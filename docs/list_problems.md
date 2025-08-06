# List Problems Tool

## Overview

Lists all operational problems currently known in your Dynatrace environment.

## Parameters

This tool takes no parameters.

## Best Practices for Prompts

### ✅ Good Examples

- "List all problems in my environment"
- "Show me all operational issues"
- "What problems are currently detected?"
- "Display all incidents in Dynatrace"
- "Are there any ongoing problems?"

### ❌ Avoid These

- Don't provide any parameters as none are required
- Don't ask for specific problem IDs (use `get_problem_details` for that)

## What This Tool Returns

- List of all problems with their basic identifiers
- Count of problems found
- "No problems found" message if environment is healthy

## Use Cases

- Quick health check of your environment
- Identify all ongoing operational issues
- Get overview for incident management
- Monitor system stability
- Preparation for detailed problem analysis

## Required Permissions

- `environment-api:problems:read`

## Example Output

```text
Found these problems: PROBLEM-1234567890,PROBLEM-0987654321,PROBLEM-5555666677
```

Or when no issues exist:

```text
No problems found
```

## Follow-up Actions

- Use `get_problem_details` to get detailed information about specific problems
- Use `get_entity_details` to understand affected entities
- Use `get_ownership` to find responsible teams
- Use `create_workflow_for_notification` to set up alerting
