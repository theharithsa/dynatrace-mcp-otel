# Get Entity Details Tool

## Overview

Retrieves comprehensive details about a specific monitored entity in Dynatrace using its entity ID.

## Parameters

- `entityId` (string, optional): The unique entity identifier (e.g., SERVICE-1234567890)

## Best Practices for Prompts

### ✅ Good Examples

- "Get details for entity SERVICE-1234567890"
- "Show me information about entity HOST-0987654321"
- "What are the properties of this Kubernetes cluster entity?"
- "Give me details about the service entity from the previous result"

### ❌ Avoid These

- Don't use entity names instead of entity IDs (use `find_entity_by_name` first)
- Don't ask for multiple entities at once (call this tool multiple times)

## What This Tool Returns

- Entity display name and type
- Entity ID for reference
- Complete properties object with entity-specific metadata
- Direct links to entity details in Dynatrace UI (type-specific)

## Use Cases

- Detailed entity investigation
- Understanding entity configuration and properties
- Collecting entity metadata for reporting
- Troubleshooting entity-specific issues
- Building entity inventory
- Preparing for entity-based operations

## Required Permissions

- `environment-api:entities:read`

## Example Output

```text
Entity WebService-Frontend of type SERVICE with `entityId` SERVICE-1234567890
Properties: {"serviceType":"WEB_SERVICE","port":"8080","technology":"JAVA","..."}
You can find more information at https://abc12345.live.dynatrace.com/ui/apps/dynatrace.services/explorer?detailsId=SERVICE-1234567890
```

Different entity types get different UI links:

- **Services**: Services explorer
- **Hosts**: Infrastructure monitoring hosts view
- **Kubernetes Clusters**: Kubernetes overview
- **Cloud Applications**: Kubernetes workload explorer

## Follow-up Actions

- Use `get_logs_for_entity` to see logs for this entity
- Use `get_ownership` to find who owns this entity
- Use entity properties in DQL queries via `execute_dql`
- Use `send_slack_message` to notify teams about entity issues

## Entity Types

Common entity types you'll encounter:

- `SERVICE` - Applications and microservices
- `HOST` - Physical or virtual machines
- `KUBERNETES_CLUSTER` - Kubernetes clusters
- `CLOUD_APPLICATION` - Cloud-native applications
- `DATABASE` - Database instances
- `PROCESS_GROUP` - Process groups
