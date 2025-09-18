# Dynatrace Problems Data Structure & Field Reference

Comprehensive reference for problems data sources (events with DAVIS_PROBLEM and dt.davis.problems) including field structures, problem lifecycle, and analysis patterns.

**Related Files:**

- **DynatraceQueryLanguage.md** - Core DQL syntax for problems queries
- **DynatraceExplore.md** - Field discovery for problems data
- **../workflows/DynatraceIncidentResponse.md** - Problem investigation workflows using these fields
- **../workflows/DynatraceDataInvestigation.md** - Problem correlation with logs and spans

---

## 🚨 **Problems Data Model**

### **Two Data Sources for Problems**

1. **events (event.kind == "DAVIS_PROBLEM")** - Individual problem events with full context
2. **dt.davis.problems** - Dedicated problems table with enhanced metadata

```dql
// Method 1: Events approach (most comprehensive)
fetch events, from:now() - 24h
| filter event.kind == "DAVIS_PROBLEM"

// Method 2: Dedicated problems table (enhanced metadata)
fetch dt.davis.problems, from:now() - 24h
| filter not(dt.davis.is_duplicate)
```

### **Core Problem Fields (Events)**

```dql
fetch events, from:now() - 24h
| filter event.kind == "DAVIS_PROBLEM"
| fields
    timestamp,                    // Problem detection time
    event.id,                    // Unique problem event ID
    event.name,                  // Problem title/summary
    event.status,               // OPEN | RESOLVED
    event.level,                // INFO | WARN | ERROR (problem severity indicator)
    affected_entity_ids,        // Array of affected Dynatrace entities
    dt.davis.problem.id,       // Davis problem ID (may differ from event.id)
    dt.davis.problem.status,   // OPEN | RESOLVED | MERGED
    dt.davis.problem.impact,   // APPLICATION | SERVICE | INFRASTRUCTURE
    dt.davis.root_cause_entity // Root cause entity ID (if determined)
```

### **Enhanced Problems Fields (dt.davis.problems)**

```dql
fetch dt.davis.problems, from:now() - 24h
| fields
    timestamp,                      // Problem start time
    dt.davis.problem.id,           // Unique problem identifier
    dt.davis.problem.display_name, // Human-readable problem name
    dt.davis.problem.status,       // OPEN | RESOLVED | MERGED
    dt.davis.problem.severity,     // Calculated severity score
    dt.davis.problem.impact,       // APPLICATION | SERVICE | INFRASTRUCTURE | MULTITIER
    dt.davis.is_duplicate,         // Boolean - true for duplicate problems
    dt.davis.is_frequent_issue,    // Boolean - recurring problem indicator
    dt.davis.affected_entities,    // Enhanced entity information
    dt.davis.root_cause,          // Root cause analysis results
    dt.davis.problem.start,       // Problem start timestamp
    dt.davis.problem.end          // Problem end timestamp (if resolved)
```

---

## 🔍 **Problem Analysis Patterns**

### **Active Problems Overview**

```dql
fetch dt.davis.problems, from:now() - 24h
| filter dt.davis.problem.status == "OPEN"
| filter not(dt.davis.is_duplicate)
| dedup {dt.davis.problem.id}, sort: {timestamp desc}
| summarize
    total_open_problems = count(),
    application_impact = countIf(dt.davis.problem.impact == "APPLICATION"),
    service_impact = countIf(dt.davis.problem.impact == "SERVICE"),
    infrastructure_impact = countIf(dt.davis.problem.impact == "INFRASTRUCTURE"),
    multitier_impact = countIf(dt.davis.problem.impact == "MULTITIER"),
    frequent_issues = countIf(dt.davis.is_frequent_issue == true),
    avg_severity = avg(dt.davis.problem.severity)
| fieldsAdd
    application_pct = round(application_impact / total_open_problems * 100, 1),
    frequent_issue_pct = round(frequent_issues / total_open_problems * 100, 1)
```

### **Problem Resolution Analysis**

```dql
fetch dt.davis.problems, from:now() - 7d
| filter dt.davis.problem.status == "RESOLVED"
| filter not(dt.davis.is_duplicate)
| filter isNotNull(dt.davis.problem.end)
| dedup {dt.davis.problem.id}, sort: {timestamp desc}
| fieldsAdd resolution_time_minutes = (dt.davis.problem.end - dt.davis.problem.start) / (1000 * 1000 * 1000 * 60)
| summarize
    total_resolved = count(),
    avg_resolution_minutes = round(avg(resolution_time_minutes), 1),
    median_resolution_minutes = percentile(resolution_time_minutes, 50),
    p95_resolution_minutes = percentile(resolution_time_minutes, 95),
    fastest_resolution = min(resolution_time_minutes),
    slowest_resolution = max(resolution_time_minutes),
    by: {dt.davis.problem.impact}
| sort avg_resolution_minutes desc
```

### **Entity Impact Analysis**

```dql
fetch events, from:now() - 24h
| filter event.kind == "DAVIS_PROBLEM"
| filter event.status == "OPEN"
| mv-expand affected_entity_ids
| summarize
    open_problems = countDistinctExact(event.id),
    problem_names = array_agg(distinct event.name),
    latest_problem = max(timestamp),
    impact_levels = array_agg(distinct dt.davis.problem.impact),
    by: {affected_entity_ids}
| sort open_problems desc
| limit 20
```

---

## ⚠️ **Critical Field Validations**

### **Problem Status Values**

```dql
// Correct status values - case sensitive
filter dt.davis.problem.status == "OPEN"        // Active problems
filter dt.davis.problem.status == "RESOLVED"    // Fixed problems
filter dt.davis.problem.status == "MERGED"      // Merged into other problems

// Event status (slightly different)
filter event.status == "OPEN"                   // Active problem events
filter event.status == "RESOLVED"               // Resolved problem events
```

### **Impact Level Classification**

```dql
// Standard impact levels
filter dt.davis.problem.impact == "APPLICATION"     // App-level problems
filter dt.davis.problem.impact == "SERVICE"         // Service-level problems
filter dt.davis.problem.impact == "INFRASTRUCTURE"  // Infrastructure problems
filter dt.davis.problem.impact == "MULTITIER"       // Cross-tier problems
```

### **Duplicate Problem Handling**

```dql
// Always filter duplicates for accurate problem counts
fetch dt.davis.problems, from:now() - 24h
| filter not(dt.davis.is_duplicate)              // Exclude duplicate problems

// For events approach, use dedup on problem ID
fetch events, from:now() - 24h
| filter event.kind == "DAVIS_PROBLEM"
| dedup {dt.davis.problem.id}, sort: {timestamp desc}
```

---

## 📊 **Problem Correlation Queries**

### **Problem-to-Log Correlation**

```dql
// Find logs related to active problems
fetch events, from:now() - 24h
| filter event.kind == "DAVIS_PROBLEM" and event.status == "OPEN"
| mv-expand affected_entity_ids
| lookup [
    fetch logs, from:now() - 24h
    | filter loglevel == "ERROR"
    | filter isNotNull(dt.entity.service)
    | dedup {dt.entity.service, timestamp}, sort: {timestamp desc}
  ], sourceField:affected_entity_ids, lookupField:dt.entity.service, prefix:"logs."
| filter isNotNull(logs.content)
| summarize
    problem_name = takeAny(event.name),
    error_log_count = count(),
    sample_error = takeAny(logs.content),
    latest_error = max(logs.timestamp),
    by: {event.id, affected_entity_ids}
| sort error_log_count desc
```

### **Problem-to-Span Correlation**

```dql
// Correlate problems with failed requests
fetch events, from:now() - 6h
| filter event.kind == "DAVIS_PROBLEM" and event.status == "OPEN"
| mv-expand affected_entity_ids
| lookup [
    fetch spans, from:now() - 6h
    | filter request.is_failed == true
    | filter isNotNull(dt.entity.service)
    | summarize failed_requests = count(), by: {dt.entity.service}
  ], sourceField:affected_entity_ids, lookupField:dt.entity.service, prefix:"spans."
| filter spans.failed_requests > 0
| summarize
    problem_title = takeAny(event.name),
    problem_impact = takeAny(dt.davis.problem.impact),
    total_failed_requests = sum(spans.failed_requests),
    affected_services = count(),
    by: {event.id}
| sort total_failed_requests desc
```

### **Root Cause Entity Analysis**

```dql
fetch events, from:now() - 24h
| filter event.kind == "DAVIS_PROBLEM"
| filter isNotNull(dt.davis.root_cause_entity)
| dedup {dt.davis.problem.id}, sort: {timestamp desc}
| summarize
    problems_caused = count(),
    problem_examples = array_agg(event.name),
    impact_levels = array_agg(distinct dt.davis.problem.impact),
    latest_problem = max(timestamp),
    by: {dt.davis.root_cause_entity}
| sort problems_caused desc
| limit 15
```

---

## 🕒 **Problem Timeline Analysis**

### **Problem Frequency Trends**

```dql
fetch dt.davis.problems, from:now() - 7d
| filter not(dt.davis.is_duplicate)
| makeTimeseries problem_count = count(), interval:1h
| fieldsAdd
    hour_of_day = hour(timeframe),
    day_of_week = dayOfWeek(timeframe)
```

### **Problem Duration Analysis**

```dql
fetch dt.davis.problems, from:now() - 30d
| filter dt.davis.problem.status == "RESOLVED"
| filter not(dt.davis.is_duplicate)
| filter isNotNull(dt.davis.problem.start) and isNotNull(dt.davis.problem.end)
| fieldsAdd duration_minutes = (dt.davis.problem.end - dt.davis.problem.start) / (1000 * 1000 * 1000 * 60)
| summarize
    problem_count = count(),
    avg_duration = round(avg(duration_minutes), 1),
    median_duration = percentile(duration_minutes, 50),
    p90_duration = percentile(duration_minutes, 90),
    p95_duration = percentile(duration_minutes, 95),
    max_duration = max(duration_minutes),
    by: {dt.davis.problem.impact}
| sort avg_duration desc
```

### **Recurring Problems Detection**

```dql
fetch dt.davis.problems, from:now() - 30d
| filter not(dt.davis.is_duplicate)
| dedup {dt.davis.problem.display_name}, sort: {timestamp desc}
| summarize
    occurrence_count = count(),
    first_seen = min(timestamp),
    last_seen = max(timestamp),
    frequent_issue_flag = takeAny(dt.davis.is_frequent_issue),
    sample_problem_id = takeAny(dt.davis.problem.id),
    by: {dt.davis.problem.display_name}
| filter occurrence_count >= 3
| fieldsAdd days_between = (last_seen - first_seen) / (1000 * 1000 * 1000 * 60 * 60 * 24)
| sort occurrence_count desc, days_between asc
```

---

## 📋 **Problems Data Schema Summary**

### **Primary Data Sources**

1. **events** (event.kind == "DAVIS_PROBLEM")
   - Full problem lifecycle events
   - Rich contextual information
   - Entity relationship data

2. **dt.davis.problems**
   - Enhanced problem metadata
   - Severity scoring
   - Duplicate detection flags
   - Start/end timestamps

### **Key Status Values**

- **Problem Status**: OPEN, RESOLVED, MERGED
- **Event Status**: OPEN, RESOLVED
- **Impact Levels**: APPLICATION, SERVICE, INFRASTRUCTURE, MULTITIER

### **Critical Analysis Fields**

- `dt.davis.problem.id`: Unique problem identifier (consistent across both sources)
- `affected_entity_ids`: Array of impacted entities (events source)
- `dt.davis.affected_entities`: Enhanced entity data (problems source)
- `dt.davis.is_duplicate`: Duplicate detection (problems source only)
- `dt.davis.root_cause_entity`: Root cause identification
- `dt.davis.problem.severity`: Calculated severity score

### **Time-based Fields**

- `timestamp`: Event detection time (both sources)
- `dt.davis.problem.start`: Problem start time (problems source)
- `dt.davis.problem.end`: Problem resolution time (problems source)

---

## ⚡ **Performance Best Practices**

### **Efficient Problem Queries**

```dql
// Always filter duplicates first for accurate counts
fetch dt.davis.problems, from:now() - 24h
| filter not(dt.davis.is_duplicate)

// Use dedup for events to avoid duplicate problem counting
fetch events, from:now() - 24h
| filter event.kind == "DAVIS_PROBLEM"
| dedup {dt.davis.problem.id}, sort: {timestamp desc}

// Filter by status early for performance
| filter dt.davis.problem.status == "OPEN"
```

### **Timeframe Recommendations**

- **Real-time monitoring**: 1-6 hours
- **Daily operations**: 24 hours
- **Weekly reviews**: 7 days
- **Trend analysis**: 30-90 days
- **Historical analysis**: Use longer timeframes cautiously due to data volume
