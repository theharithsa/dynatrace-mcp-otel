# Dynatrace Environment Discovery & Field Exploration

Environment discovery and field exploration using DQL to understand your Dynatrace environment, available data sources, and field structures.

**Related Files:**

- **DynatraceQueryLanguage.md** - Core DQL syntax and patterns
- **DynatraceSecurityEvents.md** - Security events schema and field exploration
- **DynatraceProblemsSpec.md** - Problems data structure and field reference
- **../workflows/DynatraceDataInvestigation.md** - Data investigation using discovered fields
- **../workflows/DynatraceIncidentResponse.md** - Problem investigation with field discovery

---

## 🔍 **Environment Discovery Strategy**

### **1. Start with Broad Data Source Queries**

```dql
// Discover available data sources
fetch logs, from:now() - 1h | limit 10 | fields timestamp, loglevel, content
fetch spans, from:now() - 1h | limit 10 | fields start_time, service.name, request.method
fetch events, from:now() - 24h | limit 10 | fields timestamp, event.kind, event.name
fetch security.events, from:now() - 24h | limit 10 | fields timestamp, event.category, security.alert.severity
```

### **2. Field Discovery Pattern**

```dql
// Template for discovering fields in any data source
fetch [data_source], from:now() - [timeframe]
| limit 100                          // Get representative sample
| fields *                           // Show all available fields
| dedup {key_field}, sort: {timestamp desc}  // Get latest unique records
```

### **3. Field Analysis and Validation**

```dql
// Analyze field population and uniqueness
fetch logs, from:now() - 6h
| summarize
    total_records = count(),
    unique_levels = countDistinctExact(loglevel),
    unique_namespaces = countDistinctExact(k8s.namespace.name),
    unique_services = countDistinctExact(k8s.service.name),
    logs_with_errors = countIf(loglevel == "ERROR"),
    logs_with_traces = countIf(isNotNull(trace.id))
```

---

## 📊 **Data Source Exploration Patterns**

### **Logs Field Discovery**

```dql
// Comprehensive logs field exploration
fetch logs, from:now() - 2h
| limit 500
| summarize
    sample_content = takeAny(content),
    available_levels = array_agg(distinct loglevel),
    k8s_namespaces = array_agg(distinct k8s.namespace.name),
    k8s_pods = takeAny(k8s.pod.name),
    trace_ids = takeAny(trace.id),
    span_ids = takeAny(span.id),
    dt_entities = takeAny(dt.entity.host)
| limit 1
```

### **Spans Field Discovery**

```dql
// Discover span fields and service information
fetch spans, from:now() - 1h
| limit 1000
| summarize
    sample_service = takeAny(service.name),
    sample_operation = takeAny(operation.name),
    request_methods = array_agg(distinct request.method),
    response_codes = array_agg(distinct response.status_code),
    service_entities = array_agg(distinct dt.entity.service),
    has_errors = countIf(request.is_failed == true),
    trace_sample = takeAny(trace.id)
```

### **Events Field Discovery**

```dql
// Discover event types and structures
fetch events, from:now() - 24h
| limit 1000
| summarize
    event_kinds = array_agg(distinct event.kind),
    event_names = array_agg(distinct event.name),
    davis_problems = countIf(event.kind == "DAVIS_PROBLEM"),
    deployment_events = countIf(event.kind == "DEPLOYMENT_EVENT"),
    sample_event = takeAny(event.name),
    affected_entities = takeAny(affected_entity_ids)
```

### **Security Events Field Discovery**

```dql
// Explore security events structure
fetch security.events, from:now() - 7d
| limit 1000
| summarize
    event_categories = array_agg(distinct event.category),
    alert_severities = array_agg(distinct security.alert.severity),
    alert_types = array_agg(distinct security.alert.type),
    vulnerability_count = countIf(event.category == "vulnerability"),
    runtime_count = countIf(event.category == "runtime_vulnerability"),
    sample_cve = takeAny(vulnerability.cve_ids)
```

---

## 🗺️ **Entity Relationship Discovery**

### **Service-to-Host Mapping**

```dql
// Discover service and host relationships
fetch spans, from:now() - 1h
| filter isNotNull(dt.entity.service) and isNotNull(dt.entity.host)
| summarize
    service_name = takeAny(entityName(dt.entity.service)),
    host_name = takeAny(entityName(dt.entity.host)),
    by: {dt.entity.service, dt.entity.host}
| limit 50
```

### **Kubernetes Context Discovery**

```dql
// Map Kubernetes relationships
fetch logs, from:now() - 1h
| filter isNotNull(k8s.namespace.name)
| summarize
    services = array_agg(distinct k8s.service.name),
    deployments = array_agg(distinct k8s.deployment.name),
    sample_pod = takeAny(k8s.pod.name),
    by: {k8s.namespace.name}
| sort k8s.namespace.name
```

### **Problem-Entity Correlation**

```dql
// Discover how problems relate to entities
fetch events, from:now() - 24h
| filter event.kind == "DAVIS_PROBLEM"
| filter isNotNull(affected_entity_ids)
| summarize
    problem_title = takeAny(event.name),
    entity_count = arraySize(affected_entity_ids),
    sample_entities = takeFirst(affected_entity_ids, 3),
    by: {event.id}
| sort entity_count desc
| limit 20
```

---

## 📝 **Field Validation and Quality Checks**

### **Data Quality Assessment**

```dql
// Assess data quality and field population
fetch logs, from:now() - 6h
| summarize
    total_logs = count(),
    logs_with_level = countIf(isNotNull(loglevel)),
    logs_with_k8s = countIf(isNotNull(k8s.namespace.name)),
    logs_with_traces = countIf(isNotNull(trace.id)),
    error_logs = countIf(loglevel == "ERROR"),
    warn_logs = countIf(loglevel == "WARN"),
    info_logs = countIf(loglevel == "INFO")
| fieldsAdd
    k8s_coverage_pct = round(logs_with_k8s / total_logs * 100, 1),
    trace_coverage_pct = round(logs_with_traces / total_logs * 100, 1),
    error_rate_pct = round(error_logs / total_logs * 100, 2)
```

### **Service Name Consistency Check**

```dql
// Check service name consistency across data sources
fetch spans, from:now() - 1h
| filter isNotNull(dt.entity.service)
| summarize
    span_service_name = takeAny(service.name),
    entity_service_name = takeAny(entityName(dt.entity.service)),
    span_count = count(),
    by: {dt.entity.service}
| fieldsAdd name_mismatch = (span_service_name != entity_service_name)
| filter name_mismatch == true
| sort span_count desc
```

---

## 🛠️ **Field Discovery Functions**

### **Semantic Dictionary Usage**

```dql
// Use semantic dictionary for field suggestions
fetch logs, from:now() - 1h
| limit 1
| fields *
| expand *  // Expand all nested fields for complete schema view
```

### **Dynamic Field Enumeration**

```dql
// Enumerate field values for categorical analysis
fetch security.events, from:now() - 7d
| filter event.category == "vulnerability"
| summarize values = array_agg(distinct security.alert.severity)
| mv-expand values
| summarize count = count(), by: {values}
| sort count desc
```

### **Nested Object Exploration**

```dql
// Explore nested object structures
fetch spans, from:now() - 1h
| filter isNotNull(request.headers)
| take 10
| fields start_time, service.name, request.headers
```

---

## 📋 **Environment Documentation Template**

After discovery, document your findings:

```markdown
## Environment Analysis Results

### Data Sources Available

- **Logs**: [X] records/hour, coverage: [X]% K8s, [X]% traces
- **Spans**: [X] records/hour, [X] services, [X] operations
- **Events**: [X] problems/day, [X] deployments/day
- **Security Events**: [X] vulnerabilities, [X] runtime alerts

### Key Fields Discovered

- **Service Identification**: dt.entity.service, service.name, k8s.service.name
- **Error Detection**: loglevel=="ERROR", request.is_failed==true
- **Tracing**: trace.id, span.id correlation available
- **Security**: vulnerability.cve_ids, security.alert.severity

### Recommended Analysis Patterns

1. Use dt.entity.service for reliable service filtering
2. K8s namespace filtering available for multi-tenant analysis
3. Trace correlation available for [X]% of logs
4. Security events updated every [X] hours
```

---

## 💡 **Discovery Best Practices**

1. **Start Small**: Use `limit 10-100` for initial exploration
2. **Use Timeframes**: Adjust timeframes based on data volume and freshness
3. **Check Nulls**: Always validate field population with `isNotNull()`
4. **Sample Data**: Use `takeAny()`, `takeFirst()` for representative samples
5. **Document Findings**: Create reusable field maps for your environment
6. **Validate Relationships**: Confirm entity-to-entity mappings work correctly
