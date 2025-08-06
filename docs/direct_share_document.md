# Direct Share Document Tool

## Overview

Shares a Dynatrace document directly with specific recipients (configured in environment variables) with read or read-write access permissions.

## Parameters

- `documentId` (string, required): The document ID to share
- `access` (enum, optional): Access level to grant - "read" (default) or "read-write"

## Best Practices for Prompts

### ✅ Good Examples

- "Direct share dashboard DASH-1234567890 with read access to the configured team"
- "Share this document directly with read-write access to my team members"
- "Give the configured users read access to document DOC-123"
- "Share the incident report directly with the response team"

### ❌ Avoid These

- Don't expect to specify recipients (they're pre-configured in environment)
- Don't use document names instead of document IDs
- Don't share without understanding who the configured recipients are

## What This Tool Returns

- Confirmation that document was shared directly
- Access level confirmation
- Reference to configured recipients

## Use Cases

- Immediate sharing with trusted team members
- Incident response document distribution
- Quick collaboration on dashboards or notebooks
- Sharing with pre-defined user groups
- Automated sharing in workflows

## Required Permissions

- `document:direct-shares:write`

## Prerequisites

- Recipient user IDs must be configured in environment variables
- Recipients must have appropriate Dynatrace access
- Document must exist and be accessible

## Example Output

```text
Direct-shared document DASH-1234567890 as read with recipients from env.
```

## Follow-up Actions

- Notify recipients via other channels if needed
- Monitor document usage and collaboration
- Update access levels if requirements change
- Document sharing decisions for audit purposes

## Access Levels

### Read Access

- Recipients can view document content
- No editing capabilities
- Safe for information sharing
- Recommended for status updates and reports

### Read-Write Access

- Recipients can edit and modify documents
- Full collaboration capabilities
- Use for team workspaces
- Requires trust in recipient actions

## Configuration

This tool requires pre-configured recipient lists in environment variables:

- Recipients are defined during server setup
- Cannot be modified through the tool interface
- Contact your administrator to update recipient lists
- Ensure recipients have proper Dynatrace permissions

## Security Considerations

- Recipients are pre-approved through configuration
- No ad-hoc sharing with arbitrary users
- Access levels still apply (read vs read-write)
- All sharing actions are logged and auditable

## Best Practices

- Understand who your configured recipients are
- Use appropriate access levels for the content
- Monitor shared document usage
- Regular review of recipient configurations
- Document business justification for sharing
- Consider using `share_document_env` for broader distribution
