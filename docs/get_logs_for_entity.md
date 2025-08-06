# Get Logs for Entity Tool

## Overview

Retrieves log entries for a specific monitored entity by searching using the entity's name.

## Parameters

- `entityName` (string, optional): The name of the entity to retrieve logs for

## Best Practices for Prompts

### ✅ Good Examples

- "Get logs for WebService-Frontend"
- "Show me logs from the database server 'prod-db-01'"
- "Retrieve logs for my PaymentAPI service"
- "What logs are available for the failed deployment?"

### ❌ Avoid These

- Don't use entity IDs instead of names (this tool expects entity names)
- Don't ask for logs from multiple entities at once
- Don't expect real-time streaming (this gives historical logs)

## What This Tool Returns

- Array of log entries associated with the entity
- Log content and metadata
- Empty result if no logs are found for the entity

## Use Cases

- Troubleshooting application issues
- Investigating service failures
- Analyzing deployment problems
- Post-incident analysis
- Debugging performance issues
- Understanding application behavior

## Required Permissions

- `storage:logs:read`

## Example Output

```text
Logs:
["2024-01-15T10:30:00Z ERROR: Database connection failed","2024-01-15T10:30:05Z INFO: Retrying connection","2024-01-15T10:30:10Z INFO: Connection restored"]
```

## Follow-up Actions

- Use `execute_dql` for more advanced log queries with filtering
- Use `get_entity_details` to understand the entity context
- Use `get_problem_details` if logs indicate issues
- Use `send_slack_message` to share log findings with teams

## Tips for Better Results

- Use exact entity names as they appear in Dynatrace
- Entity names are case-sensitive
- Some entities may not have associated logs
- For complex log analysis, consider using `execute_dql` with log queries
- Logs are typically available for services, processes, and hosts

## Related DQL Queries

For more advanced log analysis, you can use `execute_dql` with queries like:

- `fetch logs | filter entity.name == "WebService-Frontend"`
- `fetch logs | filter contains(content, "ERROR") | limit 100`
- `fetch logs | filter timestamp >= now() - 1h`
