# Find Entity by Name Tool

## Overview

Searches for a monitored entity in Dynatrace by its name and returns the entity ID.

## Parameters

- `entityName` (string, required): The name of the entity to search for

## Best Practices for Prompts

### ✅ Good Examples

- "Find the entity ID for 'WebService-Frontend'"
- "Get the entity ID of my database server named 'prod-db-01'"
- "What's the entity ID for the service called 'PaymentAPI'?"
- "Look up entity 'kubernetes-cluster-prod'"

### ❌ Avoid These

- Don't use partial names if you know the exact name
- Don't search for multiple entities at once (call this tool multiple times)
- Don't use display names that might be ambiguous

## What This Tool Returns

- Entity ID(s) matching the provided name
- Entity type information
- Confirmation of entity existence or "not found" message

## Use Cases

- Convert human-readable names to entity IDs for other tools
- Verify entity existence before performing operations
- Entity lookup for automation scripts
- Preparation for detailed entity analysis
- Building entity relationships

## Required Permissions

- `environment-api:entities:read`
- `storage:entities:read`

## Example Output

```text
Found entity: SERVICE-1234567890 (WebService-Frontend)
```

## Follow-up Actions

- Use the returned entity ID with `get_entity_details` for comprehensive information
- Use entity ID with `get_logs_for_entity` to retrieve logs
- Use entity ID with `get_ownership` to find responsible teams
- Use entity ID in DQL queries via `execute_dql`

## Tips

- Entity names are case-sensitive
- Some entities might have multiple matches - the tool will return the best match
- Use exact names from Dynatrace UI for best results
