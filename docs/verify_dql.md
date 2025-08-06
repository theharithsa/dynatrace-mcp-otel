# Verify DQL Tool

## Overview

Validates a Dynatrace Query Language (DQL) statement for syntax correctness and provides suggestions for improvement.

## Parameters

- `dqlStatement` (string, required): The DQL query to validate

## Best Practices for Prompts

### ✅ Good Examples

- "Verify this DQL: fetch logs | filter timestamp >= now() - 1h"
- "Check if this query is valid: timeseries avg(dt.host.cpu.usage)"
- "Validate my DQL statement before execution"
- "Is this DQL syntax correct: fetch spans | filter service.name == 'PaymentAPI'"

### ❌ Avoid These

- Don't submit incomplete queries
- Don't include multiple queries in one verification
- Don't ask to verify and execute in the same request

## What This Tool Returns

- Validation status (valid/invalid)
- Notifications about syntax issues or suggestions
- Recommendations for improving the query
- Confirmation that the query can be executed with `execute_dql`

## Use Cases

- Pre-validation before executing expensive queries
- Learning DQL syntax and best practices
- Debugging query syntax errors
- Optimizing query performance
- Ensuring query correctness in automation

## Required Permissions

- Basic OAuth scopes (automatically included)

## Example Output

```text
DQL Statement Verification:
Notifications for adapting your DQL statement:
* WARNING: Consider adding a limit to prevent large result sets
* INFO: Query will scan the last 2 hours of data

The DQL statement is valid - you can use the "execute_dql" tool.
```

For invalid queries:

```text
DQL Statement Verification:
Notifications for adapting your DQL statement:
* ERROR: Syntax error near 'FROM' - use 'fetch' instead
* ERROR: Missing closing bracket

The DQL statement is invalid. Please adapt your statement.
```

## Follow-up Actions

- Use `execute_dql` to run validated queries
- Use `generate_dql_from_natural_language` to get DQL suggestions
- Use `explain_dql_in_natural_language` to understand complex queries

## Common DQL Validation Issues

- **Syntax errors**: Missing keywords, incorrect operators
- **Missing limits**: Queries without result limits
- **Time range issues**: Unclear or missing time specifications
- **Filter problems**: Incorrect filter syntax or field names

## Best Practices for DQL

- Always include time ranges for better performance
- Use `limit` to prevent large result sets
- Filter early in the query chain
- Use appropriate data sources (`fetch logs`, `fetch metrics`, etc.)
- Test with smaller time ranges first
