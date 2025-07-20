# Dynatrace Query Language (DQL) Reference

Dynatrace Query Language (DQL) is a powerful, pipeline-based query language designed to explore and analyze observability data stored in Dynatrace Grail. It enables users to fetch, filter, transform, and visualize data from logs, metrics, events, and more.

## 🎯 **Key Patterns & Best Practices Summary**

### **Essential Query Structure**

```dql
fetch [data_source], from:now() - [timeframe]
| filter [conditions]
| dedup {key_fields}, sort: {timestamp desc}  // For latest snapshots
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

### **Security Data Patterns**

```dql
// Standard security event filtering
fetch security.events
| filter dt.system.bucket == "default_securityevents_builtin"
    AND event.provider == "Dynatrace"
    AND event.type == "VULNERABILITY_STATE_REPORT_EVENT"
    AND event.level == "ENTITY"
| dedup {vulnerability.display_id, affected_entity.id}, sort: {timestamp desc}
| filter vulnerability.resolution.status == "OPEN"
    AND vulnerability.parent.mute.status != "MUTED"
    AND vulnerability.mute.status != "MUTED"
```

### **String Operations**

- ✅ `matchesPhrase(field, "text")` - Text search
- ✅ `field == "exact_value"` - Exact match
- ✅ `field startsWith "prefix"` - Prefix match
- ❌ `contains()`, `like()` - Not supported

### **Essential Functions**

- `dedup` - Get latest snapshots
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
fetch logs | filter loglevel == "ERROR"
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

## 📊 **Advanced Example: Business Hours Aggregation**

```dql
fetch bizevents
| filter event.type == "booking.process.started"
| fieldsAdd hour = formatTimestamp(timestamp, format:"hh"), day_of_week = formatTimestamp(timestamp, format:"EE")
| filterOut (day_of_week == "Sat" or day_of_week == "Sun") or (toLong(hour) <= 08 or toLong(hour) >= 17)
| summarize numStarts = count(), by:{product}
```

This query counts booking events during business hours on weekdays.

## Best Practices

- Always start with a broad query and limit the amount of results, then filter down
- This allows you to identify the available data fields and their content for filtering
- Use appropriate time ranges based on your data source and requirements
- Leverage the pipeline structure to build complex queries step by step

---

## ⚠️ **CRITICAL: DQL Syntax Corrections**

### **String Matching and Filtering**

**❌ WRONG - Unsupported operators:**

```dql
// These operators DO NOT work in DQL
filter vulnerability.title contains "log4j"          // contains not supported
filter vulnerability.title like "*log4j*"            // like not supported
filter vulnerability.id in ["123", "456"]            // string array filtering issues
```

**✅ CORRECT - Supported string operations:**

```dql
// Use matchesPhrase() for text searching
filter matchesPhrase(vulnerability.title, "log4j")
filter matchesPhrase(vulnerability.description, "Log4Shell")

// Use exact equality for precise matches
filter vulnerability.references.cve == "CVE-2021-44228"
filter vulnerability.id == "CVE-2021-44228"

// Use startsWith/endsWith for prefix/suffix matching
filter vulnerability.title startsWith "CVE-"
filter object.type startsWith "k8s"
```

### **Array and Multi-Value Field Filtering**

**✅ CORRECT - Working with arrays:**

```dql
// For array fields like vulnerability.references.cve
filter vulnerability.references.cve == "CVE-2021-44228"  // checks if array contains value

// For filtering multiple severity levels
filter compliance.rule.severity.level in ["CRITICAL", "HIGH"]

// For object type filtering
filter object.type in ["awsbucket", "awsvpc", "awsinstance"]
```

### **Vulnerability Search Patterns**

**Comprehensive vulnerability search (Log4Shell example):**

```dql
fetch events, from:now() - 7d
| filter event.kind == "SECURITY_EVENT"
| filter event.type == "VULNERABILITY_STATE_REPORT_EVENT"
| filter (
    vulnerability.references.cve == "CVE-2021-44228" or
    vulnerability.id == "CVE-2021-44228" or
    matchesPhrase(vulnerability.title, "log4j") or
    matchesPhrase(vulnerability.title, "Log4Shell") or
    matchesPhrase(vulnerability.description, "log4j")
  )
| fields timestamp, vulnerability.id, vulnerability.title, affected_entity.name, vulnerability.davis_assessment.level
```

**Component-based vulnerability search:**

```dql
fetch events, from:now() - 7d
| filter event.kind == "SECURITY_EVENT"
| filter event.type == "VULNERABILITY_STATE_REPORT_EVENT"
| filter (
    matchesPhrase(affected_entity.vulnerable_component.name, "log4j") or
    matchesPhrase(affected_entity.vulnerable_component.short_name, "log4j")
  )
| fields affected_entity.vulnerable_component.name, vulnerability.title, affected_entity.name
```

---

## ⚠️ **CRITICAL: Compliance Query Best Practices**

**NEVER aggregate COMPLIANCE_FINDING events over time periods!** This creates thousands of outdated findings.

### **Correct Approach: Latest Scan Analysis**

**Step 1: Identify Latest Scan**

```dql
fetch events, from:now() - 24h
| filter event.type == "COMPLIANCE_SCAN_COMPLETED" AND object.type == "AWS"
| sort timestamp desc
| limit 1
| fields scan.id, timestamp
```

**Step 2: Analyze Current Findings from Latest Scan**

```dql
fetch events, from:now() - 24h
| filter event.type == "COMPLIANCE_FINDING" AND scan.id == "<latest_scan_id>"
| filter compliance.result.status.level == "FAILED"
| summarize count = count(), by:{compliance.rule.severity.level}
```

**❌ WRONG - Time-based aggregation:**

```dql
// This includes outdated findings from multiple scans!
fetch events, from:now() - 7d
| filter event.type == "COMPLIANCE_FINDING"
| summarize count = count()
```

**✅ CORRECT - Scan-specific analysis:**

```dql
// Current compliance state from latest scan only
fetch events, from:now() - 24h
| filter event.type == "COMPLIANCE_FINDING" AND scan.id == "<latest_scan_id>"
| summarize count = count()
```

---

## 📊 **Remediation-Focused DQL Patterns**

### **Compliance Monitoring Dashboards**

**Real-time Compliance Status (Latest Scan Only):**

```dql
// First get latest scan IDs by provider
fetch events, from:now() - 24h
| filter event.type == "COMPLIANCE_SCAN_COMPLETED"
| summarize latest_scan = max(timestamp), by:{object.type}
| join [
    fetch events, from:now() - 24h
    | filter event.type == "COMPLIANCE_SCAN_COMPLETED"
], on:{object.type}, prefix:"scan_"
| filter scan_timestamp == latest_scan
| fields object.type, scan_scan.id
// Then analyze findings from latest scans only
| join [
    fetch events, from:now() - 24h
    | filter event.type == "COMPLIANCE_FINDING"
], on:{scan.id: scan_scan.id}, prefix:"finding_"
| summarize
    total_findings = count(),
    failed_findings = countIf(finding_compliance.result.status.level == "FAILED"),
    critical_findings = countIf(finding_compliance.rule.severity.level == "CRITICAL"),
    by:{finding_cloud.provider, finding_compliance.standard.short_name}
| fieldsAdd compliance_score = round((total_findings - failed_findings) / total_findings * 100, 1)
```

**Remediation Progress Tracking (Compare Latest vs Previous Scan):**

```dql
// Get current scan findings
fetch events, from:now() - 24h
| filter event.type == "COMPLIANCE_SCAN_COMPLETED" AND object.type == "AWS"
| sort timestamp desc | limit 1
| fields current_scan_id = scan.id
| join [
    fetch events, from:now() - 48h, to:now() - 24h
    | filter event.type == "COMPLIANCE_SCAN_COMPLETED" AND object.type == "AWS"
    | sort timestamp desc | limit 1
    | fields previous_scan_id = scan.id
], on:{1:1}
// Compare findings between scans
| join [
    fetch events, from:now() - 48h
    | filter event.type == "COMPLIANCE_FINDING"
    | filter compliance.result.status.level == "FAILED"
], on:{scan.id: current_scan_id OR scan.id: previous_scan_id}
| summarize
    current_critical = countIf(scan.id == current_scan_id AND compliance.rule.severity.level == "CRITICAL"),
    previous_critical = countIf(scan.id == previous_scan_id AND compliance.rule.severity.level == "CRITICAL"),
    by:{cloud.provider}
| fieldsAdd progress = current_critical - previous_critical
```

### **Alert-Worthy Queries for Proactive Monitoring**

**New Critical Findings from Latest Scan (for immediate alerts):**

```dql
// Get most recent scan
fetch events, from:now() - 2h
| filter event.type == "COMPLIANCE_SCAN_COMPLETED"
| sort timestamp desc | limit 1
| fields latest_scan_id = scan.id, scan_timestamp = timestamp
// Get critical findings from that scan only
| join [
    fetch events, from:now() - 2h
    | filter event.type == "COMPLIANCE_FINDING"
    | filter compliance.rule.severity.level == "CRITICAL" AND compliance.result.status.level == "FAILED"
], on:{scan.id: latest_scan_id}
| fields scan_timestamp, cloud.provider, object.type, compliance.rule.title, compliance.result.object.evidence_json
```

**Configuration Drift Detection:**

```dql
fetch events, from:now() - 24h
| filter event.type == "COMPLIANCE_FINDING"
| summarize
    current_failed = countIf(compliance.result.status.level == "FAILED"),
    by:{object.id, compliance.rule.title}
| join [
    fetch events, from:now() - 48h, to:now() - 24h
    | filter event.type == "COMPLIANCE_FINDING"
    | summarize
        previous_failed = countIf(compliance.result.status.level == "FAILED"),
        by:{object.id, compliance.rule.title}
], on:{object.id, compliance.rule.title}
| filter current_failed > previous_failed
```

### **Team-Specific Reporting Queries**

**Security Team Dashboard:**

```dql
fetch events, from:now() - 24h
| filter event.type == "COMPLIANCE_FINDING" AND compliance.result.status.level == "FAILED"
| filter compliance.rule.severity.level in ["CRITICAL", "HIGH"]
| summarize count = count(), by:{compliance.standard.short_name, compliance.rule.severity.level, object.type}
| sort compliance.rule.severity.level asc, count desc
```

**DevOps Team Infrastructure Focus:**

```dql
fetch events, from:now() - 24h
| filter event.type == "COMPLIANCE_FINDING" AND compliance.result.status.level == "FAILED"
| filter object.type in ["awsbucket", "awsvpc", "awsinstance", "k8spod", "k8snode"]
| summarize count = count(), by:{object.type, compliance.rule.title}
| sort count desc
```

### **SLO and Performance Metrics**

**Remediation Time SLO:**

```dql
fetch events, from:now() - 30d
| filter event.type == "COMPLIANCE_FINDING"
| filter compliance.rule.severity.level == "CRITICAL"
| summarize
    avg_resolution_time = avg(resolution_time_hours),
    slo_target = 24, // 24 hours for critical findings
    by:{cloud.provider}
| fieldsAdd slo_compliance = if(avg_resolution_time <= slo_target, "PASS", "FAIL")
```

**Compliance Trend Analysis:**

```dql
fetch events, from:now() - 90d
| filter event.type == "COMPLIANCE_FINDING"
| makeTimeseries
    compliance_score = round((count() - countIf(compliance.result.status.level == "FAILED")) / count() * 100, 1),
    by:{cloud.provider}, interval:1d
| fieldsAdd trend = if(compliance_score > lag(compliance_score, 1), "IMPROVING", "DECLINING")
```

# 📈 Dynatrace DQL Timeseries Examples

> Metrics on Grail enable you to pinpoint and retrieve any metric data using the Dynatrace Query Language. Below are practical `timeseries` examples to help you analyze CPU, memory, disk, and service metrics in real-time.

---

## Example 1: Average CPU usage across all hosts

```dql
timeseries usage=avg(dt.host.cpu.usage)
```

---

## Example 2: Average CPU usage by host, limit to top 3 hosts

```dql
timeseries usage=avg(dt.host.cpu.usage), by:{dt.entity.host}
| fieldsAdd entityName(dt.entity.host)
| sort arrayAvg(usage) desc
| limit 3
```

### Simplified Table View

```dql
timeseries usage=avg(dt.host.cpu.usage), by:{dt.entity.host}
| fieldsAdd entityName(dt.entity.host)
| sort arrayAvg(usage) desc
| limit 3
| fields dt.entity.host, dt.entity.host.name, usage=arrayAvg(usage)
```

---

## Example 3: Average CPU usage by host IP Address

```dql
timeseries usage=avg(dt.host.cpu.usage),
    filter: {in(
      dt.entity.host,
      classicEntitySelector("type(host),ipAddress(\"10.102.39.126\")")
    )}
```

---

## Example 4: Number of hosts sending CPU usage data

```dql
timeseries usage=avg(dt.host.cpu.usage), by:{dt.entity.host}
| summarize count()
```

---

## Example 5: Top hosts by bytes read with corresponding bytes written

```dql
timeseries by:{dt.entity.host}, {
  bytes_read=sum(dt.host.disk.bytes_read),
  bytes_written=sum(dt.host.disk.bytes_written)
}
| sort arrayAvg(bytes_read) desc
| limit 3
| fields
    dt.entity.host,
    entityName(dt.entity.host),
    bytes_read=arrayAvg(bytes_read),
    bytes_written=arrayAvg(bytes_written)
```

---

## Example 6: Available CPU by Kubernetes Node

```dql
timeseries {
  cpu_allocatable = min(dt.kubernetes.node.cpu_allocatable),
  requests_cpu = max(dt.kubernetes.container.requests_cpu)
},
by:{dt.entity.kubernetes_cluster, dt.entity.kubernetes_node}
| fieldsAdd  
    entityName(dt.entity.kubernetes_cluster),
    entityName(dt.entity.kubernetes_node)
| fieldsAdd result = cpu_allocatable[] - requests_cpu[]
| fieldsRemove cpu_allocatable, requests_cpu
```

---

## Example 7: Average host CPU usage by host size

```dql
timeseries usage=avg(dt.host.cpu.usage), by:{dt.entity.host}
| fieldsAdd usage=arrayAvg(usage)
| fieldsAdd cpuCores = entityAttr(dt.entity.host, "cpuCores")
| summarize by:{cpuCores}, avg(usage), count_hosts=count()
```

---

## Example 8: Query multiple CPU usage metrics with a single query

```dql
timeseries idle=avg(dt.host.cpu.idle),
    by:dt.entity.host,
    filter: dt.entity.host == "HOST-EFAB6D2FE7274823"
| append [
    timeseries system=avg(dt.host.cpu.system),
        by:dt.entity.host,
        filter: dt.entity.host == "HOST-EFAB6D2FE7274823"
]
| append [
    timeseries user=avg(dt.host.cpu.user),
        by:dt.entity.host,
        filter: dt.entity.host == "HOST-EFAB6D2FE7274823"
]
```

---

## Example 9: Connection failure rate by host

```dql
timeseries {
  new = sum(dt.process.network.sessions.new),
  {reset = sum(dt.process.network.sessions.reset), default:0},
  {timeout = sum(dt.process.network.sessions.timeout), default:0}
},
by:{dt.entity.host}
| fieldsAdd result = 100 * (reset[] + timeout[]) / new[]
| filter arrayAvg(result) > 0
| sort arrayAvg(result) desc
```

---

## Example 10: Monitoring host availability

```dql
timeseries availability = sum(dt.host.availability, default:0),
    nonempty:true,
    filter:{availability.state == "up"}
```

---

## Example 11: Readiness probe

```dql
timeseries
    failure_count=sum(log.readiness_probe.failure_count, default:0),
    success_count=sum(log.readiness_probe.success_count, default:0),
    by:{dt.entity.host},
    union:true
```

---

## Example 12: Failure rate

```dql
timeseries sum(dt.service.request.failure_count, rate:1s),
    filter:{startsWith(endpoint.name, "/api/accounts")}
```

---

## Example 13: Capacity planning

```dql
timeseries avail=avg(dt.host.disk.avail), by:{dt.entity.host}, from:-24h
| append [
    timeseries avail.7d=avg(dt.host.disk.avail), by:{dt.entity.host}, shift:-7d
]
| filter startsWith(entityName(dt.entity.host), "prod-")
```

---

## Example 14: Verify host availability and redundance

```dql
timeseries num_hosts = count(dt.host.cpu.usage),
    by:{aws.availability_zone},
    filter:{startsWith(aws.availability_zone, "us-east-1")}
```

---

## Example 15: Performance optimization

```dql
timeseries p90 = percentile(dt.service.request.response_time, 90),
    filter:{startsWith(endpoint.name, "/api/accounts")}
```

---

## Example 16: Right-sizing deployments

```dql
timeseries avail=avg(dt.host.disk.avail),
    by:{dt.entity.disk, dt.entity.host},
    filter:{startsWith(dt.entity.host, "my-app-")}
| fieldsAdd avail=arrayAvg(avail)
| fieldsAdd disk_usage=if(avail>450000000000, "underused", else: "optimal")
| limit 3
```

---

## Example 17: Split CPU usage by Kubernetes annotations

```dql
timeseries cpu_usage = sum(dt.kubernetes.container.cpu_usage, rollup:max),
    by:{dt.entity.cloud_application}
| fieldsAdd annotations = entityAttr(dt.entity.cloud_application, "kubernetesAnnotations")
| fieldsAdd component = annotations[`app.kubernetes.io/component`]
| summarize cpu_usage = sum(cpu_usage[]),
    by:{timeframe, interval, component}
```