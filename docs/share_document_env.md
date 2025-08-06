# Share Document Environment Tool

## Overview

Shares a Dynatrace document (like dashboards or notebooks) across all environments with specified access permissions, generating a share link that can be distributed.

## Parameters

- `documentId` (string, required): The ID of the document to share
- `access` (enum, optional): Access level to grant - "read" (default) or "read-write"

## Best Practices for Prompts

### ✅ Good Examples

- "Share dashboard DASH-1234567890 with read access across environments"
- "Share this notebook with read-write access for all environments"
- "Create an environment share for document DOC-999 with read-only access"
- "Share the security dashboard across all environments"

### ❌ Avoid These

- Don't use document names instead of document IDs
- Don't share sensitive documents without considering access levels
- Don't assume document IDs from other contexts

## What This Tool Returns

- Confirmation of successful sharing
- Share ID for reference and distribution
- Access level confirmation

## Use Cases

- Distributing dashboards across multiple Dynatrace environments
- Sharing monitoring templates between teams
- Cross-environment reporting and analysis
- Standardizing dashboards across dev/test/prod environments
- Creating shareable links for stakeholders

## Required Permissions

- `document:environment-shares:write`

## Example Output

```text
Shared document DASH-1234567890 with 'read' access. Share ID: SHARE-abcdef123456
```

## Follow-up Actions

- Use `send_slack_message` to distribute the share link
- Document the share ID for future reference
- Monitor share usage and access patterns
- Use with `create_dashboard` for automated dashboard distribution

## Access Levels

### Read Access

- View document content
- Cannot modify or edit
- Suitable for consumers and viewers
- Recommended for general sharing

### Read-Write Access

- Full editing capabilities
- Can modify document structure and content
- Suitable for collaborators and maintainers
- Use with caution for sensitive documents

## Document Types

This tool works with various Dynatrace documents:

- **Dashboards**: Monitoring and visualization dashboards
- **Notebooks**: Analysis and investigation notebooks
- **Reports**: Custom reports and analytics
- **Workflows**: Automation workflow definitions

## Finding Document IDs

Document IDs can be found:

1. From `create_dashboard` tool outputs
2. In Dynatrace URL when viewing documents
3. Through Dynatrace API responses
4. In document management interfaces

## Security Considerations

- **Read access**: Safe for general sharing, viewers cannot modify
- **Read-write access**: Use carefully, allows full editing
- **Cross-environment**: Shares work across all connected environments
- **Link distribution**: Share links can be used by anyone with access

## Best Practices

- Use read-only access for general distribution
- Reserve read-write access for trusted collaborators
- Document who has access to shared documents
- Regular review of shared documents and access levels
- Consider document sensitivity before sharing
- Use descriptive sharing for audit trails
