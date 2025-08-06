# Create Workflow for Notification Tool

## Overview

Creates an automated notification workflow in Dynatrace that triggers on specific problem types and sends alerts to designated teams via Slack.

## Parameters

- `problemType` (string, optional): Type of problems to trigger notifications for
- `teamName` (string, optional): Name of the team to be notified
- `channel` (string, optional): Slack channel for notifications
- `isPrivate` (boolean, optional): Whether workflow should be private (default: false)

## Best Practices for Prompts

### ✅ Good Examples

- "Create a notification workflow for database problems to alert the DBA team in #database-alerts"
- "Set up alerts for service failures to notify Platform team in #platform-ops"
- "Create a private workflow for security incidents to alert #security-team"
- "Set up notifications for high CPU usage to alert DevOps in #infrastructure"

### ❌ Avoid These

- Don't create too many workflows for the same problem type
- Don't use personal channels for team notifications
- Don't create workflows without specifying target channels

## What This Tool Returns

- Workflow ID and name for reference
- Direct link to workflow configuration in Dynatrace
- Workflow type information (SIMPLE vs STANDARD)
- Privacy status confirmation

## Use Cases

- Automated incident response
- Team-specific problem notifications
- Escalation workflows
- Service-level agreement monitoring
- Security incident alerting
- Performance degradation alerts

## Required Permissions

- `automation:workflows:write`
- `automation:workflows:read`
- `automation:workflows:run`

## Example Output

```text
Workflow Created: WF-1234567890 with name Database Problem Notification.
You can access it at https://abc12345.live.dynatrace.com/ui/apps/dynatrace.automations/workflows/WF-1234567890

Note: Simple workflows are not billed.
This workflow is private and only accessible by the owner.
```

## Follow-up Actions

- Use `make_workflow_public` to share workflows with teams
- Test workflow by triggering sample problems
- Configure additional workflow steps for advanced automation
- Monitor workflow execution and effectiveness

## Workflow Types

- **SIMPLE**: Basic notifications, not billed
- **STANDARD**: Advanced workflows with complex logic, billed

## Problem Types

Common problem types to filter on:

- `APPLICATION` - Application performance issues
- `SERVICE` - Service availability problems
- `INFRASTRUCTURE` - Host and infrastructure issues
- `DATABASE` - Database connectivity and performance
- `CUSTOM` - Custom-defined problem types
- `SECURITY` - Security-related incidents

## Best Practices

- Use descriptive team names and channels
- Set up different workflows for different severity levels
- Consider creating escalation chains
- Test workflows with sample data
- Document workflow purposes for team knowledge
- Use private workflows for sensitive notifications
- Regular review and maintenance of active workflows

## Integration Patterns

1. Create workflow → Test with sample problems → Make public if needed
2. Combine with ownership information for targeted notifications
3. Use with problem analysis tools for context-rich alerts
