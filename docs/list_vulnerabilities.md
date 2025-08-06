# List Vulnerabilities Tool

## Overview

Lists all security vulnerabilities detected by Dynatrace in your environment.

## Parameters

This tool takes no parameters.

## Best Practices for Prompts

### ✅ Good Examples

- "List all vulnerabilities in my environment"
- "Show me all security vulnerabilities"
- "What vulnerabilities have been detected?"
- "Display all security issues found by Dynatrace"

### ❌ Avoid These

- Don't provide any parameters as none are required
- Don't ask for specific vulnerability IDs (use `get_vulnerability_details` for that)

## What This Tool Returns

- List of all vulnerabilities with their basic information
- Links to the Dynatrace security vulnerabilities UI
- Count of vulnerabilities found

## Use Cases

- Get an overview of your security posture
- Identify all vulnerabilities across your environment
- Security assessment and reporting
- Initial triage of security issues

## Required Permissions

- `environment-api:security-problems:read`

## Example Output

```text
Found the following vulnerabilities:
* CVE-2023-1234: Critical SQL Injection in MyApp
* CVE-2023-5678: High XSS vulnerability in WebService
We recommend to take a look at https://abc12345.live.dynatrace.com/ui/apps/dynatrace.security.vulnerabilities to get a better overview of vulnerabilities.
```

## Follow-up Actions

- Use `get_vulnerability_details` to get detailed information about specific vulnerabilities
- Use `get_entity_details` to understand affected entities
- Use `get_ownership` to find responsible teams
