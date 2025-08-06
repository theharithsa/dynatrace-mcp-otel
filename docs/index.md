---
layout: home
title: Dynatrace MCP Server - Tool Documentation
description: Complete guide to using the Dynatrace Model Context Protocol Server tools
---

Welcome to the comprehensive documentation for the Dynatrace Model Context Protocol (MCP) Server. This server provides a powerful set of tools to interact with your Dynatrace environment through natural language prompts.

## Overview

The Dynatrace MCP Server enables you to:
- Query and analyze your monitoring data using natural language
- Automate incident response and notifications
- Manage dashboards and documents
- Investigate problems and vulnerabilities
- Execute custom analytics and reporting

## Quick Start

To get started, ensure your MCP server is properly configured with:
- Valid Dynatrace OAuth credentials
- Required API scopes and permissions
- Slack connector (for notification tools)

## Available Tools

### 🔧 Environment & Setup Tools

| Tool | Description | Use Case |
|------|-------------|----------|
| [**get_environment_info**](get_environment_info.md) | Get information about your connected Dynatrace environment | Environment verification, connection testing |

### 🚨 Problem & Incident Management

| Tool | Description | Use Case |
|------|-------------|----------|
| [**list_problems**](list_problems.md) | List all operational problems in your environment | Health checks, incident overview |
| [**get_problem_details**](get_problem_details.md) | Get detailed information about specific problems | Incident analysis, root cause investigation |
| [**create_workflow_for_notification**](create_workflow_for_notification.md) | Create automated notification workflows | Incident response automation |
| [**make_workflow_public**](make_workflow_public.md) | Make private workflows accessible to teams | Workflow sharing and collaboration |

### 🔒 Security & Vulnerability Management

| Tool | Description | Use Case |
|------|-------------|----------|
| [**list_vulnerabilities**](list_vulnerabilities.md) | List all security vulnerabilities detected | Security assessment, vulnerability overview |
| [**get_vulnerability_details**](get_vulnerability_details.md) | Get detailed vulnerability information | Security analysis, risk assessment |

### 🏢 Entity & Infrastructure Management

| Tool | Description | Use Case |
|------|-------------|----------|
| [**find_entity_by_name**](find_entity_by_name.md) | Find entity IDs by searching with names | Entity lookup, ID resolution |
| [**get_entity_details**](get_entity_details.md) | Get comprehensive entity information | Infrastructure analysis, entity investigation |
| [**get_ownership**](get_ownership.md) | Get ownership information for entities | Team identification, responsibility mapping |

### 📊 Data Analysis & Querying

| Tool | Description | Use Case |
|------|-------------|----------|
| [**generate_dql_from_natural_language**](generate_dql_from_natural_language.md) | Convert natural language to DQL queries | Query creation, data exploration |
| [**verify_dql**](verify_dql.md) | Validate DQL query syntax | Query validation, syntax checking |
| [**execute_dql**](execute_dql.md) | Execute DQL queries and get results | Data analysis, custom reporting |
| [**explain_dql_in_natural_language**](explain_dql_in_natural_language.md) | Explain DQL queries in plain English | Learning, documentation, code review |

### 📝 Logs & Monitoring Data

| Tool | Description | Use Case |
|------|-------------|----------|
| [**get_logs_for_entity**](get_logs_for_entity.md) | Retrieve logs for specific entities | Troubleshooting, log analysis |
| [**get_kubernetes_events**](get_kubernetes_events.md) | Get Kubernetes cluster events | Container troubleshooting, K8s monitoring |

### 📈 Dashboards & Reporting

| Tool | Description | Use Case |
|------|-------------|----------|
| [**create_dashboard**](create_dashboard.md) | Create dashboards from JSON templates | Dashboard deployment, visualization setup |
| [**share_document_env**](share_document_env.md) | Share documents across environments | Cross-environment collaboration |
| [**direct_share_document**](direct_share_document.md) | Share documents with specific users | Team collaboration, document sharing |
| [**bulk_delete_dashboards**](bulk_delete_dashboards.md) | Delete multiple documents at once | Cleanup, environment maintenance |

### 💬 Communication & Notifications

| Tool | Description | Use Case |
|------|-------------|----------|
| [**send_slack_message**](send_slack_message.md) | Send messages to Slack channels | Team notifications, incident communication |

### 🔧 Advanced & Custom Operations

| Tool | Description | Use Case |
|------|-------------|----------|
| [**execute_typescript**](execute_typescript.md) | Execute custom TypeScript code | Custom logic, data processing |
| [**chat_with_davis_copilot**](chat_with_davis_copilot.md) | Interactive AI assistant for Dynatrace | General guidance, troubleshooting help |

## Usage Patterns

### Common Workflows

#### 🔍 **Incident Investigation**
1. `list_problems` → `get_problem_details` → `get_entity_details` → `get_logs_for_entity` → `send_slack_message`

#### 🛡️ **Security Response**
1. `list_vulnerabilities` → `get_vulnerability_details` → `get_ownership` → `send_slack_message`

#### 📊 **Data Analysis**
1. `generate_dql_from_natural_language` → `verify_dql` → `execute_dql`

#### 📈 **Dashboard Management**
1. `create_dashboard` → `share_document_env` or `direct_share_document`

## Best Practices

### 🎯 **Effective Prompting**
- Be specific about what you want to achieve
- Include time ranges when relevant
- Specify entity names or IDs when available
- Use exact names as they appear in Dynatrace

### 🔗 **Tool Chaining**
- Use entity IDs from one tool as inputs to others
- Validate DQL queries before execution
- Share results via Slack for team collaboration

### 🔒 **Security & Permissions**
- Ensure proper OAuth scopes are configured
- Be careful with document sharing permissions
- Review workflow access before making public

## Getting Help

For additional assistance:
- Use the `chat_with_davis_copilot` tool for general Dynatrace guidance
- Refer to individual tool documentation for specific use cases
- Check the [Dynatrace documentation](https://dt-url.net/help) for platform-specific guidance

## Prerequisites

Before using these tools, ensure you have:
- ✅ Valid Dynatrace environment access
- ✅ OAuth client credentials configured
- ✅ Required API permissions/scopes
- ✅ Slack connector configured (for notification tools)
- ✅ MCP server running and connected

---

**Note**: This documentation covers the Dynatrace MCP Server v1.x. Some tools may require specific Dynatrace licenses or features to function properly.
