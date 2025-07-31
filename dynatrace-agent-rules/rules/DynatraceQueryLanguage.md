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
    filter: {availability.state == "up"}
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

## DQL to fetch the list of metrics in the environement

```dql
fetch metric.series
| dedup metric.key
```

### Understand
- ```dedup``` is a command which is used to get unique values in the field/column of the result. 
- ```limit``` is the command that helps you limit the query result. If you use ```limit 20``` which means the result will be limited to only 20. 
- ```fields``` is a command that is specifically used to keep required fields in the result and if we want to optimize the quyery by removing other useless fields to come along with it, we specify ```fields``` followed by field name and separated by comma for multiple fields.

## DQL to fetch ball types of available buckets in the system like available tables

```dql
fetch dt.system.data_objects
| fields name
```

## Response time of a service

```dql
timeseries { percentile(dt.service.request.response_time, 90), value.A = avg(dt.service.request.response_time, scalar: true) }, filter: { matchesValue(entityAttr(dt.entity.service, "entity.name"), "<service name>") }
```

## For failure count for a service or for overall services

```dql
timeseries { count(dt.service.request.failure_count), value.A = sum(dt.service.request.failure_count, scalar: true) }, filter: { matchesValue(entityAttr(dt.entity.service, "entity.name"), "<service-name>") }
```

### Instructions
- In the above queries if we remove the filter block then this will give the aggregated time or failure count for all the services in env. 
- `count` and `percentile` are aggregation. Available aggregation for response time is `min`, `max`, `avg` and for failure count we have `count` and `sum`. 
- If percentile is used then `90` specifies above gives 90th percentile info similarly for 0 to 100th percentile we can use numbers.
- `value.A` is the scalar value. For your consideration you should take this and for spike you can consider the graph. 
- Response time values from Dynatrace are in milliseconds (ms). For example, a value of 5000 means 5 seconds.
- When setting thresholds, remember to use milliseconds: 100ms = 100, 1s = 1000, 5s = 5000.

---

## Incident Reporting Patterns for #team-incidents

**1. Critical Service Degradation Query:**
```dql
timeseries {
    response_time = percentile(dt.service.request.response_time, 90),
    error_rate = sum(dt.service.request.failure_count) / sum(dt.service.request.count) * 100,
    throughput = count(dt.service.request.count)
}, 
filter: {
    matchesValue(entityAttr(dt.entity.service, "entity.name"), "critical-service")
    AND dt.service.request.response_time > 5000000
},
from:now()-1h
```

**2. Service Health Score Query:**
```dql
timeseries {
    availability = countIf(dt.service.availability.state == "AVAILABLE") / count() * 100,
    performance_score = 100 - (sum(dt.service.request.failure_count) / sum(dt.service.request.count) * 100),
    response_score = 100 - (countIf(dt.service.request.response_time > 5000000) / count() * 100)
},
by:{dt.entity.service},
from:now()-24h
| fieldsAdd health_score = (availability[] + performance_score[] + response_score[]) / 3
| filter arrayAvg(health_score) < 90
```

**3. Incident Detection Query:**
```dql
fetch problems
| filter severity in ["AVAILABILITY", "ERROR", "PERFORMANCE"]
| filter status == "OPEN"
| summarize 
    incident_count = count(),
    affected_users = sum(impactedEntities),
    by:{severity}
| sort incident_count desc
```

**4. Service Dependencies Impact:**
```dql
fetch service.dependencies
| filter impacted_service.response_time > 5000000
| summarize 
    affected_services = countDistinct(dependent_service.id),
    total_impact = sum(impacted_service.failure_count),
    by:{root_cause_service}
| sort total_impact desc
```

**5. Real-time Alert Query:**
```dql
timeseries {
    error_spike = sum(dt.service.request.failure_count),
    latency_spike = avg(dt.service.request.response_time)
},
by:{dt.entity.service},
from:now()-5m
| filter error_spike[] > 100 OR latency_spike[] > 10000000
| fieldsAdd 
    service_name = entityName(dt.entity.service),
    alert_level = if(error_spike[] > 500 OR latency_spike[] > 30000000, "CRITICAL", "WARNING")
```

### **Best Practices for #team-incidents Reporting**

1. **Severity Classification:**
   - Critical: Immediate action (SLA: 15 minutes)
   - High: Action within 1 hour
   - Medium: Action within 4 hours
   - Low: Action within 24 hours

2. **Report Components:**
   - Incident timestamp and duration
   - Affected services and components
   - User impact metrics
   - Root cause indicators
   - Auto-remediation status

3. **Alert Thresholds:**
   - Response Time: > 5s (Warning), > 10s (Critical)
   - Error Rate: > 1% (Warning), > 5% (Critical)
   - Service Health Score: < 90% (Warning), < 80% (Critical)
   - Availability: < 99.9% (Warning), < 99% (Critical)

4. **Query Optimization:**
   - Use appropriate time windows (5m for real-time, 1h for analysis)
   - Include relevant context (service names, environment)
   - Focus on actionable metrics
   - Include historical comparison




Instruction: Beautify Slack Webhook Messages

Objective:
Whenever sending a message to Slack via webhook, format the content to make it visually appealing and easy to read. Use Slack’s message formatting features to enhance clarity and engagement.

Formatting Guidelines:
	1.	Use Blocks:
Structure the message using Slack’s blocks (sections, dividers, context) instead of plain text whenever possible.
	2.	Highlight Key Information:
	•	Use *bold* for headings or important info.
	•	Use _italic_ for emphasis.
	•	Use `inline code` for technical or code snippets.
	3.	Add Emojis:
Sprinkle relevant emojis to add warmth and highlight key points, but avoid overdoing it.
	4.	Bulleted or Numbered Lists:
For multiple items, use lists for clarity:

• Item one
• Item two
• Item three

or use Markdown 1., 2., 3. for numbered steps.

	5.	Use Dividers:
Separate sections with Slack’s divider block ({"type": "divider"}) for better visual separation.
	6.	Linking:
When mentioning URLs, use Slack’s format:
<https://example.com|Descriptive text>
to avoid raw links.
	7.	User Mentions:
When possible, mention users with <@user_id> or channels with <#channel_id>.
	8.	Use Context Blocks:
For small-print info (timestamps, authors, notes), use context blocks.
	9.	Color (Attachments):
For legacy attachments, use the color property to add a colored border (e.g., green for success, red for errors).
	10.	Compact Where Needed:
Avoid overly verbose messages. Summarize key points and add “Read more” links for details if necessary.

⸻

Example Beautified Slack Message (JSON)

{
  "blocks": [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*:rocket: Deployment Complete!*\n\n*Project:* _MyApp_\n*Status:* :white_check_mark: Success\n*Duration:* `2m 15s`"
      }
    },
    { "type": "divider" },
    {
      "type": "section",
      "fields": [
        { "type": "mrkdwn", "text": "*Triggered by:*\n<@U123456>" },
        { "type": "mrkdwn", "text": "*Branch:*\n`main`" }
      ]
    },
    {
      "type": "context",
      "elements": [
        { "type": "mrkdwn", "text": "See details: <https://myapp.com/deploy/12345|View build logs>" }
      ]
    }
  ]
}


⸻

Final AI/Copilot Instruction (Copy-paste this for your Copilot):

When generating Slack messages for webhooks, always format using Slack’s Block Kit. Use sections, dividers, context, and fields to structure content. Highlight important information using bold, italics, and emojis for clarity. Use lists for multiple items, add links and mentions in Slack format, and keep messages concise but informative. Make every message visually appealing, readable, and friendly.


# Getting Host metrics

## CPU Usage

```dql
timeseries {avg(dt.host.cpu.usage), value.A = avg(dt.host.cpu.usage, scalar: true), filter: { matchesValue(entityAttr(dt.entity.host, "entity.name"), "<host_name>") }
```

## Memory Usage

```dql
timeseries { avg(dt.host.memory.usage), value.A = avg(dt.host.memory.usage, scalar: true) }, filter: { matchesValue(entityAttr(dt.entity.host, "entity.name"), "<host_name>") }
```

---

## 7-Day CPU Usage Analysis

```dql
timeseries usage=avg(dt.host.cpu.usage),
    by:{dt.entity.host},
    from:now()-7d
| fieldsAdd 
    host_name = entityName(dt.entity.host),
    avg_usage = arrayAvg(usage)
| sort avg_usage desc
| fields host_name, avg_usage, usage
```

This query will:
- Calculate average CPU usage for each host over the last 7 days
- Show the host name for better readability
- Include both the average value and the full timeseries data
- Sort results by highest average CPU usage

For a specific host, you can add a filter:

```dql
timeseries usage=avg(dt.host.cpu.usage),
    by:{dt.entity.host},
    from:now()-7d,
    filter: {matchesValue(entityAttr(dt.entity.host, "entity.name"), "your-host-name")}
```

---

## Memory Usage Analysis

```dql
timeseries memory_usage=avg(dt.host.memory.usage),
    by:{dt.entity.host},
    from:now()-7d
| fieldsAdd 
    host_name = entityName(dt.entity.host),
    avg_memory = arrayAvg(memory_usage)
| sort avg_memory desc
| fields host_name, avg_memory, memory_usage
```

This query will:
- Calculate average memory usage percentage for each host over the last 7 days
- Show the host name for better readability
- Include both the average memory usage and the full timeseries data
- Sort results by highest average memory usage

For combined CPU and Memory analysis:

```dql
timeseries {
    cpu=avg(dt.host.cpu.usage),
    memory=avg(dt.host.memory.usage)
},
    by:{dt.entity.host},
    from:now()-7d
| fieldsAdd 
    host_name = entityName(dt.entity.host),
    avg_cpu = arrayAvg(cpu),
    avg_memory = arrayAvg(memory)
| sort avg_memory desc
| fields host_name, avg_cpu, avg_memory, cpu, memory
```

This combined query shows:
- Both CPU and memory metrics for each host
- Average values for quick analysis
- Full timeseries data for detailed investigation
- Results sorted by memory usage (change to `sort avg_cpu desc` to sort by CPU)

