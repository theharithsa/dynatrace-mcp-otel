# Dynatrace Security Events Schema & Field Reference

Comprehensive reference for security.events data source schema, field structures, and analysis patterns for security and compliance monitoring.

**Related Files:**

- **DynatraceQueryLanguage.md** - Core DQL syntax and string matching for security queries
- **DynatraceExplore.md** - Field discovery patterns for security.events
- **../workflows/DynatraceSecurityCompliance.md** - Security compliance workflows using these fields
- **../workflows/DynatraceIncidentResponse.md** - Security incident investigation patterns

---

## 🛡️ **Security Events Data Model**

### **Core Event Structure**

```dql
fetch security.events, from:now() - 24h
| take 1
| fields
    timestamp,                    // Event occurrence time
    event.category,              // vulnerability | runtime_vulnerability | code_level_vulnerability
    event.name,                  // Human-readable event name
    security.alert.type,         // Alert classification
    security.alert.severity,     // LOW | MEDIUM | HIGH | CRITICAL
    security.alert.status,       // OPEN | RESOLVED | MUTED
    affected_entity_ids          // Array of affected Dynatrace entities
```

### **Vulnerability Fields**

```dql
// Vulnerability-specific fields (event.category == "vulnerability")
fetch security.events, from:now() - 7d
| filter event.category == "vulnerability"
| fields
    vulnerability.id,                    // Unique vulnerability identifier
    vulnerability.title,                 // Vulnerability title/name
    vulnerability.description,           // Detailed description
    vulnerability.cve_ids,              // Array of CVE identifiers
    vulnerability.cvss_score,           // CVSS base score (0.0-10.0)
    vulnerability.risk_score,           // Dynatrace calculated risk score
    vulnerability.references.cve,       // Primary CVE reference
    vulnerability.external_references,   // External reference URLs
    vulnerability.vulnerability_type,    // Vulnerability classification
    technology.name,                    // Affected technology name
    technology.version,                 // Technology version
    technology.type                     // Technology type (library, framework, etc.)
```

### **Runtime Vulnerability Fields**

```dql
// Runtime vulnerability fields (event.category == "runtime_vulnerability")
fetch security.events, from:now() - 7d
| filter event.category == "runtime_vulnerability"
| fields
    runtime_vulnerability.id,
    runtime_vulnerability.title,
    runtime_vulnerability.description,
    runtime_vulnerability.class,         // Runtime vulnerability class
    runtime_vulnerability.entry_point,   // Code entry point
    runtime_vulnerability.data_flow,     // Data flow information
    runtime_vulnerability.evidence,      // Runtime evidence
    process.name,                       // Affected process
    process.command_line,               // Process command line
    dt.entity.process_group            // Process group entity
```

---

## 🔍 **Field Analysis Patterns**

### **Vulnerability Severity Distribution**

```dql
fetch security.events, from:now() - 30d
| filter event.category == "vulnerability"
| dedup {vulnerability.id}, sort: {timestamp desc}
| summarize
    total_vulnerabilities = count(),
    critical_count = countIf(security.alert.severity == "CRITICAL"),
    high_count = countIf(security.alert.severity == "HIGH"),
    medium_count = countIf(security.alert.severity == "MEDIUM"),
    low_count = countIf(security.alert.severity == "LOW")
| fieldsAdd
    critical_pct = round(critical_count / total_vulnerabilities * 100, 1),
    high_pct = round(high_count / total_vulnerabilities * 100, 1)
```

### **CVE Reference Analysis**

```dql
fetch security.events, from:now() - 90d
| filter event.category == "vulnerability"
| filter isNotNull(vulnerability.cve_ids)
| dedup {vulnerability.references.cve}, sort: {timestamp desc}
| summarize
    vulnerability_title = takeAny(vulnerability.title),
    cvss_score = takeAny(vulnerability.cvss_score),
    risk_score = takeAny(vulnerability.risk_score),
    severity = takeAny(security.alert.severity),
    affected_entities = countDistinctExact(affected_entity_ids),
    by: {vulnerability.references.cve}
| sort cvss_score desc
| limit 20
```

### **Technology Stack Vulnerability Mapping**

```dql
fetch security.events, from:now() - 60d
| filter event.category == "vulnerability"
| dedup {technology.name, technology.version, vulnerability.id}, sort: {timestamp desc}
| summarize
    unique_vulnerabilities = countDistinctExact(vulnerability.id),
    max_cvss_score = max(vulnerability.cvss_score),
    critical_vulns = countIf(security.alert.severity == "CRITICAL"),
    latest_detection = max(timestamp),
    by: {technology.name, technology.version, technology.type}
| sort max_cvss_score desc, critical_vulns desc
| limit 50
```

---

## ⚠️ **Critical Field Validations**

### **String Matching for Security Events**

**❌ WRONG - Unsupported operators:**

```dql
// These DO NOT work for security events
filter vulnerability.title contains "log4j"          // contains not supported
filter vulnerability.description like "*RCE*"       // like not supported
```

**✅ CORRECT - Supported string operations:**

```dql
// Use matchesPhrase() for text searching in security fields
filter matchesPhrase(vulnerability.title, "log4j")
filter matchesPhrase(vulnerability.description, "Remote Code Execution")
filter matchesPhrase(vulnerability.title, "Log4Shell")

// Use exact equality for CVE and reference fields
filter vulnerability.references.cve == "CVE-2021-44228"
filter vulnerability.references.cve startsWith "CVE-2023"

// Use in() for multiple CVE matching
filter vulnerability.references.cve in ("CVE-2021-44228", "CVE-2021-45046", "CVE-2021-45105")
```

### **Severity Level Standardization**

```dql
// Standardized severity levels - case sensitive
filter security.alert.severity == "CRITICAL"     // Correct - uppercase
filter security.alert.severity == "HIGH"         // Correct - uppercase
filter security.alert.severity == "MEDIUM"       // Correct - uppercase
filter security.alert.severity == "LOW"          // Correct - uppercase

// Status values - case sensitive
filter security.alert.status == "OPEN"           // Active vulnerabilities
filter security.alert.status == "RESOLVED"       // Fixed vulnerabilities
filter security.alert.status == "MUTED"          // Suppressed vulnerabilities
```

### **Entity ID Processing**

```dql
// Handle affected_entity_ids array properly
fetch security.events, from:now() - 7d
| filter event.category == "vulnerability"
| mv-expand affected_entity_ids
| summarize
    vulnerability_count = countDistinctExact(vulnerability.id),
    max_severity = takeMax(security.alert.severity),
    latest_detection = max(timestamp),
    by: {affected_entity_ids}
| sort vulnerability_count desc
```

---

## 📊 **Security Compliance Queries**

### **Latest Vulnerability Status per Entity**

```dql
fetch security.events, from:now() - 30d
| filter event.category == "vulnerability"
| mv-expand affected_entity_ids
| dedup {affected_entity_ids, vulnerability.id}, sort: {timestamp desc}
| summarize
    open_critical = countIf(security.alert.severity == "CRITICAL" and security.alert.status == "OPEN"),
    open_high = countIf(security.alert.severity == "HIGH" and security.alert.status == "OPEN"),
    total_open = countIf(security.alert.status == "OPEN"),
    total_vulnerabilities = count(),
    latest_scan = max(timestamp),
    by: {affected_entity_ids}
| fieldsAdd risk_level = if(open_critical > 0, "CRITICAL",
    else: if(open_high > 0, "HIGH",
    else: if(total_open > 0, "MEDIUM", else: "LOW")))
| sort open_critical desc, open_high desc
```

### **Technology Version Vulnerability Tracking**

```dql
fetch security.events, from:now() - 90d
| filter event.category == "vulnerability"
| dedup {technology.name, technology.version, vulnerability.id}, sort: {timestamp desc}
| filter security.alert.status == "OPEN"
| summarize
    open_vulnerabilities = count(),
    critical_count = countIf(security.alert.severity == "CRITICAL"),
    high_count = countIf(security.alert.severity == "HIGH"),
    max_cvss = max(vulnerability.cvss_score),
    sample_cve = takeAny(vulnerability.references.cve),
    by: {technology.name, technology.version}
| fieldsAdd
    upgrade_priority = if(critical_count > 0, "IMMEDIATE",
        else: if(high_count > 0, "HIGH",
        else: if(open_vulnerabilities > 0, "MEDIUM", else: "LOW")))
| sort critical_count desc, high_count desc, max_cvss desc
```

### **CVE Impact Analysis**

```dql
fetch security.events, from:now() - 180d
| filter event.category == "vulnerability"
| filter isNotNull(vulnerability.references.cve)
| dedup {vulnerability.references.cve, affected_entity_ids}, sort: {timestamp desc}
| summarize
    affected_entities = countDistinctExact(affected_entity_ids),
    vulnerability_title = takeAny(vulnerability.title),
    cvss_score = takeAny(vulnerability.cvss_score),
    severity = takeAny(security.alert.severity),
    technologies_affected = countDistinctExact(technology.name),
    open_count = countIf(security.alert.status == "OPEN"),
    by: {vulnerability.references.cve}
| filter affected_entities > 0
| sort affected_entities desc, cvss_score desc
| limit 25
```

---

## 🔧 **Runtime Vulnerability Analysis**

### **Runtime Security Events Pattern**

```dql
fetch security.events, from:now() - 7d
| filter event.category == "runtime_vulnerability"
| dedup {runtime_vulnerability.id, dt.entity.process_group}, sort: {timestamp desc}
| summarize
    event_count = count(),
    unique_vulnerabilities = countDistinctExact(runtime_vulnerability.id),
    processes_affected = countDistinctExact(dt.entity.process_group),
    latest_detection = max(timestamp),
    vulnerability_classes = array_agg(distinct runtime_vulnerability.class),
    by: {runtime_vulnerability.id}
| sort event_count desc
```

### **Process-Level Security Analysis**

```dql
fetch security.events, from:now() - 24h
| filter event.category == "runtime_vulnerability"
| filter isNotNull(dt.entity.process_group)
| summarize
    runtime_events = count(),
    unique_vulnerabilities = countDistinctExact(runtime_vulnerability.id),
    entry_points = array_agg(distinct runtime_vulnerability.entry_point),
    process_name = takeAny(process.name),
    latest_event = max(timestamp),
    by: {dt.entity.process_group}
| sort runtime_events desc
| limit 20
```

---

## 📋 **Security Events Schema Summary**

### **Primary Event Categories**

1. **vulnerability** - Traditional vulnerability scanning results
2. **runtime_vulnerability** - Runtime security analysis
3. **code_level_vulnerability** - Code-level security findings

### **Key Filtering Fields**

- `security.alert.severity`: CRITICAL, HIGH, MEDIUM, LOW
- `security.alert.status`: OPEN, RESOLVED, MUTED
- `event.category`: vulnerability, runtime_vulnerability, code_level_vulnerability
- `vulnerability.references.cve`: CVE identifiers (exact match)
- `technology.name`: Affected technology/library name
- `technology.version`: Technology version strings

### **Critical Analysis Fields**

- `vulnerability.cvss_score`: Numeric severity (0.0-10.0)
- `vulnerability.risk_score`: Dynatrace calculated risk
- `affected_entity_ids`: Array of entity identifiers
- `timestamp`: Event detection time
- `vulnerability.id`: Unique vulnerability identifier

### **Text Search Fields**

- `vulnerability.title`: Use with matchesPhrase()
- `vulnerability.description`: Use with matchesPhrase()
- `runtime_vulnerability.evidence`: Runtime detection evidence

---

## ⚡ **Performance Optimization**

### **Efficient Queries for Large Datasets**

```dql
// Use appropriate timeframes for different analysis types
fetch security.events, from:now() - 7d     // Real-time monitoring
fetch security.events, from:now() - 30d    // Monthly compliance reports
fetch security.events, from:now() - 90d    // Quarterly vulnerability trends

// Always use dedup for latest state analysis
| dedup {vulnerability.id}, sort: {timestamp desc}

// Filter by status for active vulnerability management
| filter security.alert.status == "OPEN"
```

### **Index-Optimized Filtering**

```dql
// Leverage indexed fields for better performance
| filter event.category == "vulnerability"           // Highly selective
| filter security.alert.severity in ("CRITICAL", "HIGH")  // Common filter pattern
| filter isNotNull(vulnerability.references.cve)     // Exclude incomplete records
```
