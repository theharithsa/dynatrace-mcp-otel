# Get Ownership Tool

## Overview

Retrieves detailed ownership information for specific entities in Dynatrace, helping you identify responsible teams and contacts.

## Parameters

- `entityIds` (string, optional): Comma-separated list of entity IDs to get ownership information for

## Best Practices for Prompts

### ✅ Good Examples

- "Get ownership information for entity SERVICE-1234567890"
- "Who owns these services: SERVICE-111,SERVICE-222,SERVICE-333"
- "Find the responsible team for HOST-0987654321"
- "Get ownership details for the entities from the previous problem"

### ❌ Avoid These

- Don't use entity names instead of entity IDs (use `find_entity_by_name` first)
- Don't request ownership for too many entities at once (performance)
- Don't expect ownership data if it hasn't been configured

## What This Tool Returns

- Detailed ownership information for each entity
- Team assignments and responsible contacts
- Ownership hierarchy and relationships
- "No ownership information found" if not configured

## Use Cases

- Incident response - finding who to contact
- Security vulnerability notifications
- Service ownership mapping
- Team responsibility verification
- Escalation path identification
- Organizational reporting

## Required Permissions

- `environment-api:entities:read`
- `settings:objects:read`

## Example Output

```text
Ownership information:
[{"entityId":"SERVICE-1234567890","teams":[{"name":"Platform Team","contacts":["john.doe@company.com"]}],"primaryOwner":"Platform Team"}]
```

## Follow-up Actions

- Use `send_slack_message` to notify responsible teams
- Use ownership info to assign incidents or vulnerabilities
- Use with `get_problem_details` or `get_vulnerability_details` for complete context
- Use for creating automated notification workflows

## Setting Up Ownership

For this tool to return meaningful data, ownership must be configured in Dynatrace:

1. Navigate to Settings > Ownership
2. Define ownership rules based on entity properties
3. Assign teams and contacts to entities
4. Configure ownership hierarchies

## Integration Patterns

### Security Response
1. `list_vulnerabilities` → `get_vulnerability_details` → `get_ownership` → `send_slack_message`

### Incident Response
1. `list_problems` → `get_problem_details` → `get_ownership` → `send_slack_message`

### Team Notification
1. `find_entity_by_name` → `get_ownership` → `send_slack_message`

## Tips

- Ownership configuration is environment-specific
- Some entities may not have explicit ownership assigned
- Ownership can be inherited from parent entities
- Consider setting up automated ownership rules based on tags or naming conventions
