---
layout: default
title: MCP Tools Documentation
description: Complete reference for all Dynatrace MCP Server tools organized by category
---

This page provides a comprehensive overview of all available tools in the Dynatrace MCP Server, organized by functional categories.

## 🔧 Environment & Setup {#environment-setup}

Tools for configuring and managing your Dynatrace environment connection.

### [Get Environment Info](get_environment_info.html)

Retrieves information about the connected Dynatrace environment (tenant).

**Use Cases:** Environment verification, connection testing, tenant information
**Parameters:** None required
**Returns:** Environment details, version info, available features

---

## 🚨 Problems & Incidents {#problem-incident}

Tools for managing operational problems and incident response.

### [List Problems](list_problems.html)

List all operational problems in your environment.

**Use Cases:** Health checks, incident overview, problem monitoring
**Parameters:** Optional filters for time range and severity
**Returns:** List of active problems with basic details

### [Get Problem Details](get_problem_details.html)

Get detailed information about specific problems.

**Use Cases:** Incident analysis, root cause investigation, problem deep-dive
**Parameters:** Problem ID (required)
**Returns:** Comprehensive problem details, affected entities, timeline

### [Create Workflow for Notification](create_workflow_for_notification.html)

Create automated notification workflows for problem alerts.

**Use Cases:** Incident response automation, team notifications
**Parameters:** Team name, channel, problem type, privacy settings
**Returns:** Created workflow ID and configuration

### [Make Workflow Public](make_workflow_public.html)

Make private workflows accessible to teams.

**Use Cases:** Workflow sharing, team collaboration
**Parameters:** Workflow ID (required)
**Returns:** Updated workflow access settings

---

## 🔒 Security & Vulnerabilities {#security-vulnerability}

Tools for security analysis and vulnerability management.

### [List Vulnerabilities](list_vulnerabilities.html)

List all security vulnerabilities detected in your environment.

**Use Cases:** Security assessment, vulnerability overview, compliance reporting
**Parameters:** Optional filters for severity and status
**Returns:** List of vulnerabilities with risk levels

### [Get Vulnerability Details](get_vulnerability_details.html)

Get detailed vulnerability information including affected components.

**Use Cases:** Security analysis, risk assessment, remediation planning
**Parameters:** Security problem ID (required)
**Returns:** Detailed vulnerability data, affected entities, remediation guidance

---

## 🏢 Entities & Infrastructure {#entity-infrastructure}

Tools for discovering and managing infrastructure entities.

### [Find Entity by Name](find_entity_by_name.html)

Find entity IDs by searching with entity names.

**Use Cases:** Entity lookup, ID resolution, infrastructure discovery
**Parameters:** Entity name (required)
**Returns:** Matching entity IDs and basic information

### [Get Entity Details](get_entity_details.html)

Get comprehensive information about specific entities.

**Use Cases:** Infrastructure analysis, entity investigation, configuration review
**Parameters:** Entity ID (required)
**Returns:** Complete entity details, relationships, properties

### [Get Ownership](get_ownership.html)

Get ownership information for entities including team assignments.

**Use Cases:** Team identification, responsibility mapping, contact information
**Parameters:** Entity IDs (required)
**Returns:** Ownership details, team contacts, responsibility assignments

---

## 📊 Data Analysis {#data-analysis}

Tools for querying and analyzing monitoring data using DQL.

### [Generate DQL from Natural Language](generate_dql_from_natural_language.html)

Convert natural language queries to DQL (Dynatrace Query Language).

**Use Cases:** Query creation, data exploration, learning DQL
**Parameters:** Natural language description (required)
**Returns:** Generated DQL query with explanation

### [Verify DQL](verify_dql.html)

Validate DQL query syntax before execution.

**Use Cases:** Query validation, syntax checking, development workflow
**Parameters:** DQL statement (required)
**Returns:** Validation results, syntax errors (if any)

### [Execute DQL](execute_dql.html)

Execute DQL queries and retrieve results.

**Use Cases:** Data analysis, custom reporting, monitoring insights
**Parameters:** Valid DQL statement (required)
**Returns:** Query results, data tables, metrics

### [Explain DQL in Natural Language](explain_dql_in_natural_language.html)

Explain DQL queries in plain English for better understanding.

**Use Cases:** Learning, documentation, code review, knowledge sharing
**Parameters:** DQL statement (required)
**Returns:** Human-readable explanation of query logic

### [Get Logs for Entity](get_logs_for_entity.html)

Retrieve logs for specific entities in your environment.

**Use Cases:** Troubleshooting, log analysis, debugging
**Parameters:** Entity name (required)
**Returns:** Recent logs, log patterns, error analysis

### [Get Kubernetes Events](get_kubernetes_events.html)

Get Kubernetes cluster events for container troubleshooting.

**Use Cases:** Container troubleshooting, K8s monitoring, cluster analysis
**Parameters:** Cluster ID (required)
**Returns:** Kubernetes events, pod status, cluster health

---

## 📈 Dashboards & Reporting {#dashboards-reporting}

Tools for creating and managing dashboards and reports.

### [Create Dashboard](create_dashboard.html)

Create dashboards from JSON templates in the /dashboards folder.

**Use Cases:** Dashboard deployment, visualization setup, reporting automation
**Parameters:** Uses JSON files from dashboards directory
**Returns:** Created dashboard IDs and URLs

### [Share Document Environment](share_document_env.html)

Share documents across all environments with specified access levels.

**Use Cases:** Cross-environment collaboration, document distribution
**Parameters:** Document ID (required), access level (read/read-write)
**Returns:** Sharing configuration and access URLs

### [Direct Share Document](direct_share_document.html)

Share documents with specific users or teams.

**Use Cases:** Team collaboration, targeted document sharing
**Parameters:** Document ID (required), access level (read/read-write)
**Returns:** Direct sharing links and permissions

### [Bulk Delete Dashboards](bulk_delete_dashboards.html)

Delete multiple documents/dashboards at once for cleanup.

**Use Cases:** Environment cleanup, bulk maintenance, organization
**Parameters:** List of document IDs (required)
**Returns:** Deletion results and status

---

## 💬 Communication {#communication}

Tools for team notifications and messaging.

### [Send Slack Message](send_slack_message.html)

Send messages to Slack channels for team notifications.

**Use Cases:** Team notifications, incident communication, status updates
**Parameters:** Channel name (required), message content (required)
**Returns:** Message delivery status

---

## ⚡ Advanced Operations {#advanced-operations}

Advanced tools for custom automation and AI assistance.

### [Execute TypeScript](execute_typescript.html)

Execute custom TypeScript code using Dynatrace Function Executor.

**Use Cases:** Custom logic, data processing, advanced automation
**Parameters:** TypeScript source code (required), payload object
**Returns:** Execution results, processed data

### [Chat with Davis CoPilot](chat_with_davis_copilot.html)

Interactive AI assistant for general Dynatrace guidance and troubleshooting.

**Use Cases:** General guidance, troubleshooting help, learning assistance
**Parameters:** Question or request (required), optional context
**Returns:** AI-powered guidance and recommendations

---

## Usage Patterns

### Common Workflows

#### 🔍 **Incident Investigation**

1. `list_problems` → identify active issues
2. `get_problem_details` → analyze specific problem
3. `get_entity_details` → understand affected infrastructure  
4. `get_logs_for_entity` → examine relevant logs
5. `send_slack_message` → notify team of findings

#### 🛡️ **Security Response**

1. `list_vulnerabilities` → assess security posture
2. `get_vulnerability_details` → analyze threats
3. `get_ownership` → identify responsible teams
4. `send_slack_message` → coordinate response

#### 📊 **Data Analysis**

1. `generate_dql_from_natural_language` → create query
2. `verify_dql` → validate syntax
3. `execute_dql` → get results
4. `create_dashboard` → visualize findings

## Best Practices

### 🎯 **Effective Tool Usage**

- Use `find_entity_by_name` to resolve entity IDs before other entity operations
- Always `verify_dql` before `execute_dql` for complex queries
- Chain tools logically: discovery → analysis → action → communication
- Use `get_environment_info` to verify connection before starting workflows

### 🔗 **Tool Chaining**

- Pass entity IDs between tools for consistency
- Use problem/vulnerability IDs to get detailed information
- Combine analysis results with communication tools for team updates

### 🔒 **Security & Permissions**

- Review document sharing permissions before distribution
- Ensure proper OAuth scopes are configured for all operations
- Be cautious with bulk operations like `bulk_delete_dashboards`

---

## Getting Started

New to the Dynatrace MCP Server? Start with these essential tools:

1. **[Get Environment Info](get_environment_info.html)** - Verify your connection
2. **[List Problems](list_problems.html)** - Check current system status  
3. **[Generate DQL from Natural Language](generate_dql_from_natural_language.html)** - Learn query building
4. **[Chat with Davis CoPilot](chat_with_davis_copilot.html)** - Get AI-powered assistance

For comprehensive setup instructions, visit the [Getting Started](getting-started.html) guide.
