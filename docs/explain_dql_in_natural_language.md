# Explain DQL in Natural Language Tool

## Overview

Converts complex Dynatrace Query Language (DQL) statements into plain English explanations using Davis CoPilot AI, helping users understand what a query does.

## Parameters

- `dql` (string, required): The DQL statement to explain

## Best Practices for Prompts

### ✅ Good Examples

- "Explain this DQL: fetch logs | filter timestamp >= now() - 2h | limit 100"
- "What does this query do: timeseries avg(dt.host.cpu.usage), by:{dt.entity.host}"
- "Help me understand this query: fetch spans | filter service.name == 'PaymentAPI'"
- "Break down this DQL for me: fetch events | summarize count(), by:{event.kind}"

### ❌ Avoid These

- Don't ask to explain invalid or incomplete DQL
- Don't submit multiple queries at once
- Don't expect explanations of non-DQL content

## What This Tool Returns

- Summary of what the query does
- Detailed step-by-step explanation
- Status of the explanation process
- Message token for tracking
- Notifications about query characteristics

## Use Cases

- Learning DQL by understanding existing queries
- Documenting complex queries for team knowledge
- Code review and validation of DQL statements
- Troubleshooting unexpected query results
- Teaching DQL concepts to team members

## Required Permissions

- `davis-copilot:dql2nl:execute`

## Example Output

```text
📝 DQL to Natural Language:

**DQL Query:**
fetch logs 
| filter timestamp >= now() - 2h 
| filter service.name == "PaymentAPI" 
| filter loglevel == "ERROR" 
| limit 100

**Summary:** This query retrieves error logs from the PaymentAPI service within the last 2 hours.

**Detailed Explanation:**
This query starts by fetching log records from Dynatrace's log storage. It then applies three filters: first, it restricts the time range to the last 2 hours using a timestamp comparison; second, it filters for logs specifically from the "PaymentAPI" service; and third, it only includes logs with an "ERROR" level. Finally, it limits the results to a maximum of 100 records to prevent overwhelming output.

**Status:** SUCCESSFUL
**Message Token:** msg_def456
```

## Follow-up Actions

- Use explanations to document queries in your codebase
- Share explanations with team members for knowledge transfer
- Use insights to optimize or improve queries
- Combine with `generate_dql_from_natural_language` for learning

## Query Types That Work Well

### Simple Filters

```dql
fetch logs | filter loglevel == "ERROR"
```

*Explanation*: Gets all error-level logs

### Time-based Analysis

```dql
fetch metrics | filter timestamp >= now() - 1h
```

*Explanation*: Retrieves metrics from the last hour

### Aggregations

```dql
fetch spans | summarize count(), by:{service.name}
```

*Explanation*: Counts spans grouped by service name

### Complex Joins

```dql
fetch logs 
| lookup [fetch dt.entity.service], sourceField:service.name, lookupField:entity.name
```

*Explanation*: Enriches logs with service entity information

## Learning Benefits

### Understanding DQL Structure

- See how different DQL operations work together
- Learn the logical flow of data processing
- Understand filtering and aggregation concepts

### Best Practices Discovery

- Identify efficient query patterns
- Learn about performance considerations
- Understand when to use different DQL functions

### Troubleshooting Insights

- Understand why queries return unexpected results
- Learn about data flow and transformations
- Identify potential optimization opportunities

## Integration with Other Tools

### Learning Workflow

1. `generate_dql_from_natural_language` - Create query from description
2. `verify_dql` - Validate the generated query
3. `explain_dql_in_natural_language` - Understand what it does (this tool)
4. `execute_dql` - Run the query

### Documentation Workflow

1. `explain_dql_in_natural_language` - Get explanation (this tool)
2. Document the explanation alongside query code
3. Share with team for knowledge transfer

## Advanced Query Examples

### Time Series Analysis

```dql
timeseries avg(dt.host.cpu.usage), interval:5m, by:{dt.entity.host}
```

*Typical Explanation*: Creates a time series showing average CPU usage for each host, calculated in 5-minute intervals.

### Complex Filtering

```dql
fetch spans 
| filter duration > 1s 
| filter service.name in ("payment", "billing") 
| summarize avg(duration), by:{service.name}
```

*Typical Explanation*: Finds slow spans (over 1 second) from payment or billing services, then calculates average duration per service.

### Log Analysis with Joins

```dql
fetch logs 
| filter contains(content, "ERROR") 
| lookup [fetch dt.entity.service | fields entity.name, service.type], 
         sourceField:service.name, lookupField:entity.name
```

*Typical Explanation*: Retrieves error logs and enriches them with service type information through a lookup operation.

## Tips for Better Explanations

- Submit complete, valid DQL statements
- Include context about what you're trying to understand
- Use explanations to build DQL vocabulary
- Compare similar queries to understand differences
- Ask for explanations of queries you found online or in documentation

## Common DQL Concepts Explained

### Data Sources

- `fetch logs` - Retrieves log data
- `fetch metrics` - Gets metric data points
- `fetch spans` - Obtains distributed tracing spans
- `fetch events` - Retrieves system events

### Operations

- `filter` - Removes records that don't match conditions
- `summarize` - Aggregates data (count, sum, avg, etc.)
- `timeseries` - Creates time-based aggregations
- `lookup` - Joins data from different sources

### Functions

- `now()` - Current timestamp
- `contains()` - Text search within fields
- `avg()`, `sum()`, `count()` - Aggregation functions
- `limit` - Restricts result set size

## Educational Value

This tool is particularly valuable for:

- **New DQL Users**: Understanding query structure and logic
- **Code Reviews**: Documenting complex query intentions
- **Team Training**: Explaining query patterns to colleagues
- **Troubleshooting**: Understanding why queries behave unexpectedly
- **Documentation**: Creating readable explanations for query libraries
