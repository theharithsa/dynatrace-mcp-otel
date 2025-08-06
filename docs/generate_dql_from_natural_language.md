# Generate DQL from Natural Language Tool

## Overview

Converts natural language queries into Dynatrace Query Language (DQL) using Davis CoPilot AI. This tool helps users create complex DQL queries without deep knowledge of the query syntax.

## Parameters

- `text` (string, required): Natural language description of what you want to query

## Best Practices for Prompts

### ✅ Good Examples

- "Show me error logs from the last 2 hours for the PaymentAPI service"
- "Find all hosts with CPU usage above 80% in the last hour"
- "Get response times for database queries that took longer than 1 second today"
- "List all security events related to failed login attempts this week"

### ❌ Avoid These

- Don't be too vague: "show me some data"
- Don't assume context: "get the logs from yesterday" (specify which service/entity)
- Don't mix multiple unrelated queries in one request

## What This Tool Returns

- Generated DQL query statement
- Status of the generation (SUCCESSFUL, SUCCESSFUL_WITH_WARNINGS, FAILED)
- Message token for tracking
- Notifications about potential improvements
- Step-by-step guidance for query execution

## Use Cases

- Learning DQL syntax and patterns
- Creating complex queries without manual syntax
- Rapid prototyping of monitoring queries
- Converting requirements into executable queries
- Exploring data without deep DQL knowledge

## Required Permissions

- `davis-copilot:nl2dql:execute`

## Example Output

```text
🔤 Natural Language to DQL:

**Query:** "Show me error logs from the last 2 hours for the PaymentAPI service"

**Generated DQL:**
fetch logs
| filter timestamp >= now() - 2h
| filter service.name == "PaymentAPI"
| filter loglevel == "ERROR"
| limit 100

**Status:** SUCCESSFUL
**Message Token:** msg_abc123

💡 **Next Steps:**
1. Use "verify_dql" tool to validate this query
2. Use "execute_dql" tool to run the query
3. If results don't match expectations, refine your natural language description and try again
```

## Follow-up Actions

Always follow this workflow:

1. Generate DQL from natural language (this tool)
2. Use `verify_dql` to validate the generated query
3. Use `execute_dql` to run the validated query
4. If results don't match expectations, refine and repeat

## Tips for Better Results

### Be Specific About Time Ranges

- ✅ "last 2 hours", "today", "past week"
- ❌ "recently", "sometime ago"

### Include Entity Context

- ✅ "PaymentAPI service", "production hosts", "database cluster"
- ❌ "the service", "some hosts"

### Specify Data Types

- ✅ "error logs", "CPU metrics", "user sessions", "security events"
- ❌ "data", "information"

### Define Thresholds

- ✅ "CPU usage above 80%", "response times over 1 second"
- ❌ "high CPU", "slow responses"

## Common Query Patterns

### Log Analysis

- "Show error logs from service X in the last hour"
- "Find logs containing 'database timeout' from today"
- "Get all warning and error logs from the payment system"

### Metrics Monitoring

- "Show CPU usage for all hosts in the last 4 hours"
- "Find services with response times above 2 seconds"
- "Get memory utilization for Kubernetes pods"

### Security Analysis

- "List failed authentication attempts from the last day"
- "Show security events with high severity"
- "Find unauthorized access attempts"

### Performance Analysis

- "Show slowest database queries from the past hour"
- "Find services with high error rates"
- "Get response time percentiles for web services"

## Advanced Natural Language Patterns

### Aggregation Queries

- "Count the number of errors per service in the last hour"
- "Calculate average response time by endpoint"
- "Sum total requests grouped by status code"

### Filtering and Conditions

- "Show logs where response time is greater than 5 seconds AND status is 500"
- "Find spans from services that start with 'payment' OR 'billing'"
- "Get metrics where host name contains 'prod'"

### Time Series Analysis

- "Show CPU usage trend over the last 24 hours"
- "Get hourly breakdown of error counts today"
- "Display response time distribution in 15-minute intervals"

## Limitations

- Generated queries may need refinement for complex scenarios
- Some domain-specific requirements might not be captured perfectly
- Always validate generated queries before using in production
- Consider performance implications of generated queries

## Integration with Other Tools

### Learning Workflow

1. `generate_dql_from_natural_language` - Create query from description
2. `verify_dql` - Validate the generated query
3. `explain_dql_in_natural_language` - Understand what it does
4. `execute_dql` - Run the query

### Development Workflow

1. Start with natural language description
2. Generate and validate DQL
3. Execute and review results
4. Refine description if needed
5. Document final queries

## Best Practices

- Start with simple queries and build complexity gradually
- Use specific entity names and time ranges
- Validate all generated queries before execution
- Refine natural language if results don't match expectations
- Save successful query patterns for reuse
- Consider query performance impact before execution
