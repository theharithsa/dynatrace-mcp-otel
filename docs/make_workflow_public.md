# Make Workflow Public Tool

## Overview

Converts a private workflow to a public workflow, making it accessible to all users in your Dynatrace environment.

## Parameters

- `workflowId` (string, optional): The ID of the workflow to make public

## Best Practices for Prompts

### ✅ Good Examples

- "Make workflow WF-1234567890 public"
- "Share the database notification workflow with the team"
- "Convert my private security workflow to public access"
- "Make the workflow from the previous creation public"

### ❌ Avoid These

- Don't make sensitive workflows public without review
- Don't use workflow names instead of IDs
- Don't make workflows public without team agreement

## What This Tool Returns

- Confirmation that workflow is now public
- Direct link to the public workflow
- Workflow ID for reference

## Use Cases

- Sharing proven workflows with teams
- Making templates available organization-wide
- Collaborative workflow development
- Standard operating procedure distribution
- Team knowledge sharing

## Required Permissions

- `automation:workflows:write`
- `automation:workflows:read`
- `automation:workflows:run`

## Example Output

```text
Workflow WF-1234567890 is now public!
View it at: https://abc12345.live.dynatrace.com/ui/apps/dynatrace.automations/workflows/WF-1234567890
```

## Follow-up Actions

- Share the workflow link with team members
- Document the workflow purpose and usage
- Train team members on workflow functionality
- Monitor workflow usage and effectiveness
- Consider creating workflow templates for common scenarios

## Security Considerations

Before making workflows public:

- Review workflow content for sensitive information
- Ensure appropriate access controls
- Verify workflow doesn't expose credentials
- Consider data privacy implications
- Document who should use the workflow

## Workflow Sharing Best Practices

- Add clear descriptions to public workflows
- Include contact information for workflow owners
- Document expected inputs and outputs
- Provide usage examples and guidelines
- Regular maintenance and updates
- Monitor for misuse or issues

## Finding Workflow IDs

To find workflow IDs:

1. Use `create_workflow_for_notification` and note the returned ID
2. Navigate to Automation > Workflows in Dynatrace UI
3. Check the URL when viewing a workflow
4. Look in workflow execution logs and histories

## Related Operations

- Use with `create_workflow_for_notification` to create then share workflows
- Consider workflow versioning for public workflows
- Document changes when updating public workflows
