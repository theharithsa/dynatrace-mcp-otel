# Dynatrace Query Language (DQL) Reference

Dynatrace Query Language (DQL) is a powerful, pipeline-based query language designed to explore and analyze observability data stored in Dynatrace Grail. It enables users to fetch, filter, transform, and visualize data from logs, metrics, events, and more.

**Related Files:**

- **DynatraceExplore.md** - Environment discovery and field exploration using DQL
- **../workflows/DynatraceIncidentResponse.md** - Problem investigation with DQL patterns
- **../workflows/dataSourceGuides/DynatraceDataInvestigation.md** - Log analysis and service monitoring using DQL
- **../workflows/dataSourceGuides/DynatraceSpanAnalysis.md** - Span analytics with DQL
- **../workflows/DynatraceSecurityCompliance.md** - Security and compliance DQL patterns

---

## 🎯 **Key Patterns & Best Practices Summary**

### **Essential Query Structure**

```dql
fetch [data_source], from:now() - [timeframe]
| filter [conditions]
| dedup {key_fields}, sort: {timestamp desc}  // For latest snapshots (logs/events/problems)
| dedup {key_fields}, sort: {start_time desc} // For latest snapshots (spans)
| summarize [aggregations], by: {grouping_fields}
| sort [field] desc
| limit [number]
```

### **Critical Best Practices**

1. **Start Broad, Then Filter**: Begin with wide queries to discover available fields
2. **Use Appropriate Timeframes**: 24h+ for cloud compliance, default for K8s/logs
3. **Latest Snapshots Only**: Always use `dedup` for current state analysis
4. **Never Aggregate Over Time**: For compliance, focus on latest scan results only
5. **Leverage Pipeline Structure**: Build complex queries step by step
6. **Use Scalar for Single Values**: For single aggregated values from timeseries, use `scalar: true`
7. **Normalize with Rate**: Use `rate` parameter for time-normalized metrics (MB/s, requests/min)
8. **Timestamp Field Names**: Use `start_time` for spans, `timestamp` for logs/events/problems

### **Core Data Source Quick Reference**

```dql
// Service metrics (for monitoring dashboards)
timeseries avg(dt.service.request.count), from: now()-1h, interval: 5m

// Problems (comprehensive workflows in DynatraceIncidentResponse.md)
fetch events, from:now() - 24h | filter event.kind == "DAVIS_PROBLEM"
fetch dt.davis.problems | filter not(dt.davis.is_duplicate)

// Spans (detailed patterns in DynatraceSpanAnalysis.md - ALWAYS filter by service/namespace)
fetch spans, from:now() - 1h
| filter dt.entity.service == "SERVICE-ID" and request.is_failed == true

// Logs (extensive patterns in DynatraceDataInvestigation.md)
fetch logs, from:now() - 2h
| filter loglevel == "ERROR" and k8s.namespace.name == "production"

// Security events
fetch security.events, from:now() - 24h
```

### **Timeseries Scalar Pattern**

```dql
// ❌ WRONG - Returns array of time-based values
timeseries total_bytes = sum(dt.host.net.nic.bytes_rx), from: now()-1h, interval: 30m
// Returns: [164306530095, 163387047026, 20547359107]

// ✅ CORRECT - Returns single aggregated value
timeseries total_bytes = sum(dt.host.net.nic.bytes_rx, scalar: true), from: now()-1h
// Returns: 326139539760.11975

// Use scalar when you need a single total/average across the entire timeframe
timeseries
  total_network_in = sum(dt.host.net.nic.bytes_rx, scalar: true),
  total_network_out = sum(dt.host.net.nic.bytes_tx, scalar: true),
  avg_cpu_usage = avg(dt.host.cpu.usage, scalar: true),
  max_cpu_usage = max(dt.host.cpu.usage, scalar: true),
  active_processes = count(dt.process.cpu.usage, scalar: true),
  from: now()-2h
```

### **Timeseries Rate Normalization**

Use the `rate` parameter to normalize values to specific time units (MB/s, MB/m, MB/h):

```dql
// Rate-normalized metrics for better comparison
timeseries {
  network_mbps = sum(dt.host.net.nic.bytes_rx, scalar: true, rate: 1s),     // Bytes per second
  network_per_minute = sum(dt.host.net.nic.bytes_rx, scalar: true, rate: 1m), // Bytes per minute
  network_per_hour = sum(dt.host.net.nic.bytes_rx, scalar: true, rate: 1h),   // Bytes per hour
  cpu_utilization_rate = avg(dt.host.cpu.usage, scalar: true, rate: 1m)       // CPU % per minute
  },
  from: now()-2h
```

**Rate Examples:**

- `rate: 1s` → Values per second (throughput monitoring)
- `rate: 1m` → Values per minute (standard monitoring)
- `rate: 1h` → Values per hour (capacity planning)

**When to Use Scalar:**

- ✅ Single totals, averages, counts for reports
- ✅ Alert thresholds and SLA calculations
- ✅ Dashboard summary cards and KPIs
- ✅ Rate-normalized metrics for comparison
- ❌ Time-based visualizations and charts
- ❌ Trend analysis and pattern recognition

### **String Operations and Essential Functions**

**String Operations:**

- ✅ `matchesPhrase(field, "text")` - Text search
- ✅ `field == "exact_value"` - Exact match
- ✅ `field startsWith "prefix"` - Prefix match
- ❌ `contains()`, `like()` - Not supported

**Essential Functions:**

- `dedup` - Get latest snapshots
- `summarize` - Aggregate data
- `fieldsAdd` - Add computed fields
- `timeseries` - Time-based metrics
- `scalar: true` - Single aggregated values
- `rate: 1s/1m/1h` - Time-normalized metrics
- `takeFirst()` / `takeMax()` / `takeAny()` - Aggregation
- `countDistinctExact()` - Precise counting
- `in()` - Array membership
- `coalesce()` - Handle nulls
- `lookup` - Join with entity data

### **Risk Level Mapping**

```dql
| fieldsAdd risk_level = if(score >= 9, "CRITICAL",
    else: if(score >= 7, "HIGH",
    else: if(score >= 4, "MEDIUM",
    else: if(score >= 0.1, "LOW", else: "NONE"))))
```

---

## 🔧 **Core Concepts of DQL**

1. **Pipeline Structure**: DQL uses a pipeline model where each command is separated by a pipe (`|`). Data flows from one command to the next.
2. **Tabular Data**: Each command returns a table (rows and columns), which is passed to the next command.
3. **Read-Only**: DQL is used for querying and analyzing data, not modifying it.

---

## 🧱 **Basic Syntax and Commands**

### 1. **`fetch`** – Load data

```dql
fetch logs
```

Loads all logs within the default time range (2 hours unless specified).

### 2. **`filter`** – Narrow down results

```dql
fetch logs
| filter loglevel == "ERROR"
```

Filters logs to only include those with log level "ERROR".

### 3. **`summarize`** – Aggregate data

```dql
fetch logs | filter loglevel == "ERROR" | summarize numErr = count()
```

Counts the number of error logs.

### 4. **`fields` / `fieldsAdd`** – Select or add fields

```dql
fetch logs | fields timestamp, loglevel, content
```

### 5. **`sort`** – Order results

```dql
fetch logs | sort timestamp desc
```

### 6. **`makeTimeseries`** – Create time series for visualization

```dql
fetch logs | filter loglevel == "ERROR" | makeTimeseries count = count(), by:loglevel, interval:5m
```

---

## 🕒 **Time Range Control**

You can override the default time range:

```dql
fetch logs, from:now() - 24h, to:now() - 2h
```

Or use absolute time:

```dql
fetch logs, timeframe:"2025-06-01T00:00:00Z/2025-06-10T00:00:00Z"
```

---

## ⚠️ **CRITICAL: DQL Syntax Corrections**

### **Span Analysis Field Corrections**

**❌ WRONG - Field names that cause errors:**

```dql
// These field names DO NOT work for spans
| sort timestamp asc                         // Use start_time for spans instead
| filter trace.id == "trace-id"             // Use toUid() function
```

**✅ CORRECT - Verified working field names:**

```dql
// Correct field names from live testing
| sort start_time asc                        // Correct timestamp field for spans
| filter trace.id == toUid("trace-id")      // Trace ID filtering with toUid() function
| filter request.is_failed == true          // Most reliable failure detection
```

### **Service and Entity Identification**

**❌ WRONG - Unreliable patterns:**

```dql
// service.name is often null in many environments
| filter service.name == "payment"
// WRONG for logs - dt.entity.service not available
fetch logs | filter dt.entity.service == "SERVICE-ID"
```

**✅ CORRECT - Reliable patterns:**

```dql
// For spans - use entityName function
| filter entityName(dt.entity.service) == "myapp"
| fieldsAdd service_name = entityName(dt.entity.service)

// For logs - use infrastructure context
| filter k8s.pod.name == "myapp-pod-xxx"
| filter k8s.namespace.name == "production"
```

### **String Matching and Filtering**

**❌ WRONG - Unsupported operators:**

```dql
// These operators DO NOT work in DQL
filter vulnerability.title contains "log4j"          // contains not supported
filter vulnerability.title like "*log4j*"            // like not supported
```

**✅ CORRECT - Supported string operations:**

```dql
// Use matchesPhrase() for text searching
filter matchesPhrase(vulnerability.title, "log4j")
filter matchesPhrase(vulnerability.description, "Log4Shell")

// Use exact equality for precise matches
filter vulnerability.references.cve == "CVE-2021-44228"

// Use startsWith/endsWith for prefix/suffix matching
filter vulnerability.title startsWith "CVE-"
filter object.type startsWith "k8s"
```

## Best Practices

- Always start with a broad query and limit the amount of results, then filter down
- This allows you to identify the available data fields and their content for filtering
- Use appropriate time ranges based on your data source and requirements
- Leverage the pipeline structure to build complex queries step by step
