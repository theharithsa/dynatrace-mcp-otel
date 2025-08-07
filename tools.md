---
layout: page
title: Tools
permalink: /tools/
---

# 🔧 MCP Tools Reference

The Dynatrace MCP Server provides a comprehensive set of tools organized by functional categories. Each tool can be invoked through natural language interactions.

## Environment & Setup {#environment-setup}

Tools for configuring and managing your Dynatrace environment connection.

### Get Environment Info
**Purpose**: Retrieves information about the connected Dynatrace environment (tenant)
**Usage**: "What is my environment information?"
**Returns**: Environment details, version info, available features

### Find Entity by Name  
**Purpose**: Get the entityId of a monitored entity based on the name
**Usage**: "Find entity named 'my-application'"
**Parameters**: Entity name
**Returns**: Entity ID and basic details

### Get Entity Details
**Purpose**: Get detailed information about a monitored entity
**Usage**: "Show me details for entity ABC123"
**Parameters**: Entity ID
**Returns**: Comprehensive entity details, metrics, relationships

---

## Problems & Incidents {#problems-incidents}

Tools for managing operational problems and incident response.

### List Problems
**Purpose**: List all problems known in Dynatrace
**Usage**: "Show me all current problems"
**Returns**: List of active problems with basic details

### Get Problem Details  
**Purpose**: Get detailed information about a specific problem
**Usage**: "Show me details for problem ID ABC123"
**Parameters**: Problem ID (required)
**Returns**: Comprehensive problem details, affected entities, timeline

### Create Workflow for Notification
**Purpose**: Create automated notification workflows for problem alerts
**Usage**: "Create a Slack notification workflow for critical problems"
**Parameters**: Team name, channel, problem type, privacy settings
**Returns**: Created workflow ID and configuration

### Make Workflow Public
**Purpose**: Make private workflows accessible to teams
**Usage**: "Make workflow ABC123 public"
**Parameters**: Workflow ID (required)
**Returns**: Updated workflow access settings

---

## Security & Vulnerabilities {#security-vulnerabilities}

Tools for monitoring and addressing security threats.

### List Vulnerabilities
**Purpose**: List all vulnerabilities from Dynatrace
**Usage**: "Show me all security vulnerabilities"
**Returns**: List of security vulnerabilities with severity levels

### Get Vulnerability Details
**Purpose**: Get details of a vulnerability by securityProblemId
**Usage**: "Show me details for vulnerability SEC123"
**Parameters**: Security problem ID (required)  
**Returns**: Comprehensive vulnerability details, affected entities

### Get Kubernetes Events
**Purpose**: Get all events from a specific Kubernetes cluster
**Usage**: "Show me events for Kubernetes cluster XYZ"
**Parameters**: Cluster ID (K8s cluster UID, not Dynatrace environment)
**Returns**: List of Kubernetes events and status information

---

## Data Analysis {#data-analysis}

Tools for executing queries and analyzing monitoring data.

### Execute DQL
**Purpose**: Execute a Dynatrace Query Language (DQL) statement
**Usage**: "Run DQL query: fetch dt.entity.host"
**Parameters**: DQL statement
**Returns**: Query results in structured format

### Generate DQL from Natural Language
**Purpose**: Convert natural language queries to DQL using Davis CoPilot AI
**Usage**: "Generate DQL to show CPU usage for the last hour"
**Parameters**: Natural language description
**Returns**: Generated DQL statement

### Verify DQL
**Purpose**: Verify a DQL statement for syntax and validity
**Usage**: "Verify this DQL: fetch dt.entity.host | limit 10"
**Parameters**: DQL statement
**Returns**: Validation results and suggestions

### Explain DQL
**Purpose**: Explain DQL statements in natural language using Davis CoPilot AI
**Usage**: "Explain this DQL: fetch dt.entity.host | summarize count()"
**Parameters**: DQL statement
**Returns**: Natural language explanation

### Get Logs for Entity
**Purpose**: Get logs for a monitored entity based on name
**Usage**: "Show me logs for entity 'my-service'"
**Parameters**: Entity name
**Returns**: Log entries and filtering options

---

## Automation & Workflows {#automation}

Tools for creating and managing automated workflows.

### Execute TypeScript
**Purpose**: Execute TypeScript code using Dynatrace Function Executor API
**Usage**: "Execute this TypeScript function: [code]"
**Parameters**: Source code (must be in export default async function format), payload object
**Returns**: Function execution results

### Send Slack Message
**Purpose**: Send a Slack message via Slack Connector on Dynatrace  
**Usage**: "Send Slack message 'Hello team' to #alerts channel"
**Parameters**: Channel, message text
**Returns**: Message delivery confirmation

### Get Ownership Information
**Purpose**: Get detailed ownership information for entities
**Usage**: "Who owns entity ABC123?"
**Parameters**: Entity IDs
**Returns**: Ownership details and contact information

---

## Reporting & Dashboards {#reporting}

Tools for generating reports and creating monitoring dashboards.

### Create Dashboard
**Purpose**: Create Dynatrace dashboards from JSON files in /dashboards folder
**Usage**: "Create dashboards from my JSON files"
**Returns**: Created dashboard IDs and names (auto-extracted from JSON)

### Share Document Environment
**Purpose**: Share a Dynatrace document across all environments with read or read-write access
**Usage**: "Share document DOC123 with read access across environments"
**Parameters**: Document ID, access level (read/read-write)
**Returns**: Sharing confirmation and access details

### Direct Share Document
**Purpose**: Direct-share a document with specific recipients with read or read-write access
**Usage**: "Share document DOC123 with read-write access to specific users"
**Parameters**: Document ID, access level (read/read-write)
**Returns**: Sharing confirmation and recipient list

### Bulk Delete Documents
**Purpose**: Bulk delete dashboards/documents by a list of document IDs
**Usage**: "Delete documents DOC123, DOC456, DOC789"
**Parameters**: List of document IDs to delete
**Returns**: Deletion confirmation and results

---

## Advanced Features

### Chat with Davis CoPilot
**Purpose**: Get answers to Dynatrace-related questions and troubleshooting guidance
**Usage**: "How do I optimize my dashboard performance?"
**Parameters**: Question/request text, optional context, optional formatting instructions
**Returns**: AI-powered responses and recommendations

## Usage Tips

### Natural Language Patterns

The MCP server understands various natural language patterns:

- **Direct commands**: "List all problems"
- **Questions**: "What problems are currently active?"
- **Requests**: "Can you show me vulnerability details for SEC123?"
- **Conversational**: "I need help with creating a dashboard"

### Parameter Formatting

- **IDs**: Use exact IDs as provided by other tools
- **Names**: Use quotes for multi-word names: "my application name"
- **Time ranges**: "last hour", "past 24 hours", "this week"
- **Filters**: Include filtering criteria in natural language

### Error Handling

If a tool fails:
1. Check parameter format and requirements
2. Verify permissions and access rights
3. Review error messages for specific guidance
4. Try rephrasing your request

## Need Help?

- Use the Davis CoPilot chat for Dynatrace-specific questions
- Check tool-specific error messages for troubleshooting
- Visit our [GitHub repository](https://github.com/theharithsa/dynatrace-mcp-otel) for detailed examples
