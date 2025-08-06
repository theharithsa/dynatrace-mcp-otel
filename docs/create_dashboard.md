# Create Dashboard Tool

## Overview

Automatically creates Dynatrace dashboards from JSON files located in the `/dashboards` folder of the project. Each dashboard is created based on its JSON definition with the name auto-extracted.

## Parameters

This tool takes no parameters.

## Best Practices for Prompts

### ✅ Good Examples

- "Create dashboards from all JSON files in the dashboards folder"
- "Deploy all dashboard configurations to Dynatrace"
- "Set up the predefined dashboards"
- "Create all dashboards from the dashboard templates"

### ❌ Avoid These

- Don't provide parameters as none are required
- Don't ask to create specific dashboards (this tool processes all JSON files)
- Don't expect to upload files during execution (files must exist in /dashboards)

## What This Tool Returns

- Summary of dashboard creation results for each JSON file
- Dashboard IDs and names for successfully created dashboards
- Error details for failed dashboard creations
- Status for each dashboard file processed

## Use Cases

- Bulk dashboard deployment
- Environment setup and initialization
- Dashboard template distribution
- Standardizing monitoring across environments
- Quick dashboard provisioning

## Required Permissions

- `document:documents:write` (OAuth scope)
- Proper OAuth client configuration

## Prerequisites

- JSON dashboard files must exist in `/dashboards` folder
- Dashboard JSON files must be properly formatted
- OAuth client must have dashboard creation permissions

## Example Output

```text
Dashboard creation summary:
[CARBON] Breakdown per Namespace.json: success | ID: DASH-123 | Name: Carbon Namespace Analysis
Databases.json: success | ID: DASH-456 | Name: Database Overview
Security findings.json: failed | Error: Invalid JSON format
```

## Follow-up Actions

- Use `share_document_env` to share created dashboards across environments
- Use `direct_share_document` to share with specific teams
- Use dashboard IDs for further customization or sharing
- Review failed creations and fix JSON formatting issues

## Dashboard JSON Format

Dashboard JSON files should follow Dynatrace dashboard specification:

- Must include valid dashboard metadata
- Should have proper tile configurations
- Must specify visualization types and queries
- Should include time range specifications

## Managing Dashboard Files

The tool processes all `.json` files in the `/dashboards` folder:

- Files are processed alphabetically
- Each file should contain one dashboard definition
- Invalid JSON files will be skipped with error messages
- File names don't affect dashboard names (extracted from JSON content)

## Error Handling

Common issues and solutions:

- **Invalid JSON**: Check JSON syntax and formatting
- **Missing permissions**: Verify OAuth scopes and credentials
- **Network errors**: Check Dynatrace environment connectivity
- **Quota limits**: Verify dashboard limits haven't been exceeded

## Best Practices

- Test dashboard JSON files manually before bulk creation
- Keep dashboard definitions version-controlled
- Use descriptive names in JSON metadata
- Include documentation for custom dashboards
- Regular cleanup of unused dashboards using `bulk_delete_dashboards`
