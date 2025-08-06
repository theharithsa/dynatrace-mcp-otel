# Get Problem Details Tool

## Overview

Retrieves comprehensive details about a specific operational problem in Dynatrace.

## Parameters

- `problemId` (string, optional): The unique identifier for the problem

## Best Practices for Prompts

### ✅ Good Examples

- "Get details for problem PROBLEM-1234567890"
- "Show me information about the database connectivity issue"
- "What's the impact of the current outage?"
- "Give me details about problem XYZ"
- "Show me the root cause analysis for this problem"

### ❌ Avoid These

- Don't ask for multiple problems at once (call this tool multiple times instead)
- Don't use display names without the problem ID

## What This Tool Returns

- Problem display ID, title, and severity level
- List of affected entities with their entity IDs
- Problem start time and duration
- Root cause entity identification
- Impact analysis including estimated affected users
- Direct link to detailed problem view in Dynatrace

## Use Cases

- Detailed incident analysis
- Understanding problem scope and impact
- Root cause identification
- Impact assessment for business stakeholders
- Incident response and troubleshooting
- Post-incident reporting

## Required Permissions

- `environment-api:problems:read`

## Example Output

```text
The problem P-1234 with the title High response time detected (ID: PROBLEM-1234567890).The severity is HIGH, and it affects 3 entities:
- WebService-Frontend (please refer to this entity with `entityId` SERVICE-1234567890)
- Database-Backend (please refer to this entity with `entityId` SERVICE-0987654321)
- AppServer-01 (please refer to this entity with `entityId` HOST-1111222233)

The problem first appeared at 2024-01-15T10:30:00Z
The possible root-cause could be in entity Database-Backend with `entityId` SERVICE-0987654321.

The problem is estimated to affect 1250 users.

Tell the user to access the link https://abc12345.live.dynatrace.com/ui/apps/dynatrace.davis.problems/problem/PROBLEM-1234567890 to get more insights into the problem.
```

## Follow-up Actions

- Use `get_entity_details` for affected entities or root cause entities
- Use `get_ownership` to find responsible teams
- Use `send_slack_message` to notify teams about critical problems
- Use `get_logs_for_entity` to investigate specific entities
- Use `execute_dql` to run custom queries for deeper analysis
