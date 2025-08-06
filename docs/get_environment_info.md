---
layout: tool
title: Get Environment Info Tool
tool_category: Environment & Setup
description: Retrieves information about the connected Dynatrace environment (tenant)
permalink: /docs/get_environment_info/
related_tools:
  - name: List Problems
    link: list_problems.html
    description: Check environment health status
  - name: Execute DQL
    link: execute_dql.html
    description: Query environment data
---

# Get Environment Info Tool

## Overview
Retrieves information about the connected Dynatrace environment (tenant).

## Parameters
This tool takes no parameters.

## Best Practices for Prompts

### ✅ Good Examples
- "Get information about my Dynatrace environment"
- "Show me details about the connected tenant"
- "What Dynatrace environment am I connected to?"
- "Display the current environment information"

### ❌ Avoid These
- Don't provide any parameters as none are required
- Don't ask for specific tenant IDs as this tool shows the current connected environment

## What This Tool Returns
- Environment/tenant details as JSON
- Environment URL for accessing the Dynatrace interface
- Basic tenant configuration information

## Use Cases
- Verify you're connected to the correct Dynatrace environment
- Get basic tenant information before performing other operations
- Troubleshoot connection issues
- Confirm environment details for documentation or reporting

## Required Permissions
- Basic OAuth scopes (automatically included)

## Example Output
```
Environment Information (also referred to as tenant):
{"id":"abc12345","name":"My Production Environment",...}
You can reach it via https://abc12345.live.dynatrace.com
```
