# Execute DQL Tool

## Overview

Executes Dynatrace Query Language (DQL) statements to retrieve data from your Dynatrace environment.

## Parameters

- `dqlStatement` (string, required): The DQL query to execute

## Best Practices for Prompts

### ✅ Good Examples

- "Execute this DQL: fetch logs | filter timestamp >= now() - 1h | limit 10"
- "Run query: timeseries avg(dt.host.cpu.usage) | limit 100"
- "Execute: fetch spans | filter service.name == 'PaymentAPI' | limit 50"
- "Query the last hour of error logs: fetch logs | filter loglevel == 'ERROR'"

### ❌ Avoid These

- Don't execute unvalidated queries (use `verify_dql` first)
- Don't run queries without limits (can return too much data)
- Don't use overly broad time ranges without filtering
- Don't execute multiple queries at once

## What This Tool Returns

- Query results as JSON objects
- Limited results display (max 100 records shown)
- "No results found" if query returns empty
- Truncated results with count if too many matches

## Use Cases

- Data analysis and exploration
- Troubleshooting performance issues
- Security investigation
- Custom reporting and dashboards
- Log analysis and monitoring
- Metrics and spans analysis

## Required Permissions

- `storage:buckets:read`
- `storage:logs:read`
- `storage:metrics:read`
- `storage:bizevents:read`
- `storage:spans:read`
- `storage:entities:read`
- `storage:events:read`
- `storage:system:read`
- `storage:user.events:read`
- `storage:user.sessions:read`
- `storage:security.events:read`

## Example Output

```text
DQL Response: {"timestamp":"2024-01-15T10:30:00Z","content":"Database connection failed","loglevel":"ERROR","entity.name":"WebService-Frontend"}
```

For multiple results:

```text
DQL Response: 25 results found. Displaying first 10:
[{"metric":"dt.host.cpu.usage","value":75.2},{"metric":"dt.host.cpu.usage","value":78.1}...]
```

## Follow-up Actions

- Use `verify_dql` before executing complex queries
- Use `explain_dql_in_natural_language` to understand what a query does
- Use `generate_dql_from_natural_language` to create queries from descriptions
- Use results with other tools like `send_slack_message` for reporting

## Common DQL Patterns

### Log Analysis
```dql
fetch logs 
| filter timestamp >= now() - 2h 
| filter loglevel == "ERROR" 
| limit 50
```

### Metrics Queries
```dql
timeseries avg(dt.host.cpu.usage), by:{dt.entity.host}
| limit 100
```

### Span Analysis
```dql
fetch spans 
| filter service.name == "PaymentAPI" 
| summarize count(), by:{span.kind}
```

### Entity Information
```dql
fetch dt.entity.service
| fields entity.name, entity.type
| limit 20
```

## Performance Tips

- Always include time ranges
- Use `limit` to control result size
- Filter early in query chains
- Use specific entity or service names when possible
- Test with smaller time ranges first
