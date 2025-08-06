# Bulk Delete Dashboards Tool

## Overview

Deletes multiple Dynatrace documents (dashboards, notebooks, etc.) in a single operation using their document IDs.

## Parameters

- `documentIds` (array of strings, required): List of document IDs to delete

## Best Practices for Prompts

### ✅ Good Examples

- "Delete these dashboards: DASH-123,DASH-456,DASH-789"
- "Bulk delete documents: [\"DOC-111\", \"DOC-222\", \"DOC-333\"]"
- "Remove the test dashboards we created earlier"
- "Clean up old dashboards with IDs: DASH-A, DASH-B, DASH-C"

### ❌ Avoid These

- Don't delete documents without backing them up first
- Don't use document names instead of IDs
- Don't delete shared documents without team notification
- Don't delete production dashboards without approval

## What This Tool Returns

- Confirmation of deletion operation
- List of document IDs that were deleted
- Success/failure status for the bulk operation

## Use Cases

- Cleanup of obsolete dashboards
- Environment maintenance and housekeeping
- Removing test or temporary documents
- Mass deletion during environment migration
- Cleaning up after failed deployments

## Required Permissions

- `document:documents:delete`

## Example Output

```text
Deleted documents: DASH-1234567890, DASH-0987654321, DOC-5555666677
```

## Follow-up Actions

- Verify that correct documents were deleted
- Update any references to deleted documents
- Inform teams about deleted shared resources
- Update documentation or inventories

## Safety Considerations

⚠️ **Warning: This operation is irreversible**

- Always verify document IDs before deletion
- Consider backing up important documents
- Check if documents are shared or referenced elsewhere
- Have rollback plans for critical dashboards
- Test deletion operations in non-production first

## Best Practices

- Create backups of important documents before deletion
- Use staging environments to test bulk operations
- Maintain an inventory of critical documents
- Coordinate with teams before deleting shared resources
- Document deletion decisions for audit trails
- Consider soft deletion or archiving alternatives

## Document ID Formats

Common document ID patterns:

- **Dashboards**: `DASH-xxxxxxxxxxxxxxx`
- **Notebooks**: `NOTEBOOK-xxxxxxxxx`
- **Reports**: `REPORT-xxxxxxxxxxxx`
- **Custom Documents**: `DOC-xxxxxxxxxxxxx`

## Pre-deletion Checklist

Before using this tool:

1. ✅ Verify all document IDs are correct
2. ✅ Check if documents are shared with others
3. ✅ Backup critical documents if needed
4. ✅ Notify relevant teams about the deletion
5. ✅ Document the reason for deletion
6. ✅ Test in non-production environment first

## Error Handling

Common issues:

- **Permission errors**: Ensure delete permissions are granted
- **Document not found**: Verify document IDs exist
- **Shared documents**: May require additional permissions
- **Network errors**: Retry operation if temporary

## Integration Patterns

### Cleanup Workflow

1. Identify obsolete documents
2. Backup critical content if needed
3. Notify stakeholders
4. Execute `bulk_delete_dashboards`
5. Verify deletion success
6. Update inventories and documentation

### Migration Workflow

1. Export documents from source environment
2. Import to target environment
3. Verify successful import
4. Use `bulk_delete_dashboards` to clean source
5. Update environment references
