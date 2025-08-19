---
layout: page
title: Tools
permalink: /tools/
---

<div class="tools-page">

# 🔧 MCP Tools Reference

The Dynatrace MCP Server provides a comprehensive set of tools organized by functional categories. Each tool can be invoked through natural language interactions.

<div class="tools-toc">
<h2>📋 Quick Navigation</h2>
<div class="toc-grid">
  <a href="#environment-setup" class="toc-item">
    <span class="toc-emoji">🔧</span>
    <span class="toc-text">Environment & Setup</span>
  </a>
  <a href="#problems-incidents" class="toc-item">
    <span class="toc-emoji">🚨</span>
    <span class="toc-text">Problems & Incidents</span>
  </a>
  <a href="#security-vulnerabilities" class="toc-item">
    <span class="toc-emoji">🔒</span>
    <span class="toc-text">Security & Vulnerabilities</span>
  </a>
  <a href="#entities-infrastructure" class="toc-item">
    <span class="toc-emoji">🏗️</span>
    <span class="toc-text">Entities & Infrastructure</span>
  </a>
  <a href="#data-analysis" class="toc-item">
    <span class="toc-emoji">📊</span>
    <span class="toc-text">Data Analysis</span>
  </a>
  <a href="#automation-workflows" class="toc-item">
    <span class="toc-emoji">⚡</span>
    <span class="toc-text">Automation & Workflows</span>
  </a>
  <a href="#reporting-dashboards" class="toc-item">
    <span class="toc-emoji">📋</span>
    <span class="toc-text">Reporting & Dashboards</span>
  </a>
  <a href="#communication" class="toc-item">
    <span class="toc-emoji">💬</span>
    <span class="toc-text">Communication</span>
  </a>
</div>
</div>

## Environment & Setup {#environment-setup}

<div class="tool-category">
<div class="category-header">
  <span class="category-emoji">🔧</span>
  <h3 class="category-title">Environment & Setup</h3>
</div>
<p class="category-description">Tools for configuring and managing your Dynatrace environment connection.</p>

<div class="tool-item">
<div class="tool-name"><code>get_environment_info</code></div>
<div class="tool-details">
  <div class="tool-row">
    <span class="tool-label">Purpose:</span>
    <span class="tool-value">Retrieves information about the connected Dynatrace environment (tenant)</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Usage:</span>
    <span class="tool-value">"What is my environment information?"</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Returns:</span>
    <span class="tool-value">Environment details, version info, available features</span>
  </div>
</div>
</div>
</div>

## Problems & Incidents {#problems-incidents}

<div class="tool-category">
<div class="category-header">
  <span class="category-emoji">🚨</span>
  <h3 class="category-title">Problems & Incidents</h3>
</div>
<p class="category-description">Tools for managing operational problems and incident response.</p>

<div class="tool-item">
<div class="tool-name"><code>list_problems</code></div>
<div class="tool-details">
  <div class="tool-row">
    <span class="tool-label">Purpose:</span>
    <span class="tool-value">List all problems known in Dynatrace</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Usage:</span>
    <span class="tool-value">"Show me all current problems"</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Returns:</span>
    <span class="tool-value">List of active problems with basic details</span>
  </div>
</div>
</div>

<div class="tool-item">
<div class="tool-name"><code>get_problem_details</code></div>
<div class="tool-details">
  <div class="tool-row">
    <span class="tool-label">Purpose:</span>
    <span class="tool-value">Get detailed information about a specific problem</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Usage:</span>
    <span class="tool-value">"Show me details for problem ID ABC123"</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Parameters:</span>
    <span class="tool-value">Problem ID (required)</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Returns:</span>
    <span class="tool-value">Comprehensive problem details, affected entities, timeline</span>
  </div>
</div>
</div>
</div>

## Security & Vulnerabilities {#security-vulnerabilities}

<div class="tool-category">
<div class="category-header">
  <span class="category-emoji">🔒</span>
  <h3 class="category-title">Security & Vulnerabilities</h3>
</div>
<p class="category-description">Tools for monitoring and addressing security threats and vulnerabilities.</p>

<div class="tool-item">
<div class="tool-name"><code>list_vulnerabilities</code></div>
<div class="tool-details">
  <div class="tool-row">
    <span class="tool-label">Purpose:</span>
    <span class="tool-value">List all vulnerabilities from Dynatrace</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Usage:</span>
    <span class="tool-value">"Show me all security vulnerabilities"</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Returns:</span>
    <span class="tool-value">List of vulnerabilities with severity and status</span>
  </div>
</div>
</div>

<div class="tool-item">
<div class="tool-name"><code>get_vulnerability_details</code></div>
<div class="tool-details">
  <div class="tool-row">
    <span class="tool-label">Purpose:</span>
    <span class="tool-value">Get details of a vulnerability by security problem ID</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Usage:</span>
    <span class="tool-value">"Show details for vulnerability VULN-123"</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Parameters:</span>
    <span class="tool-value">Security problem ID</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Returns:</span>
    <span class="tool-value">Detailed vulnerability information, affected components</span>
  </div>
</div>
</div>
</div>

## Entities & Infrastructure {#entities-infrastructure}

<div class="tool-category">
<div class="category-header">
  <span class="category-emoji">🏗️</span>
  <h3 class="category-title">Entities & Infrastructure</h3>
</div>
<p class="category-description">Tools for discovering and managing your monitored infrastructure and applications.</p>

<div class="tool-item">
<div class="tool-name"><code>find_entity_by_name</code></div>
<div class="tool-details">
  <div class="tool-row">
    <span class="tool-label">Purpose:</span>
    <span class="tool-value">Get the entityId of a monitored entity based on the name</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Usage:</span>
    <span class="tool-value">"Find entity named 'my-application'"</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Parameters:</span>
    <span class="tool-value">Entity name</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Returns:</span>
    <span class="tool-value">Entity ID and basic details</span>
  </div>
</div>
</div>

<div class="tool-item">
<div class="tool-name"><code>get_entity_details</code></div>
<div class="tool-details">
  <div class="tool-row">
    <span class="tool-label">Purpose:</span>
    <span class="tool-value">Get detailed information about a monitored entity</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Usage:</span>
    <span class="tool-value">"Show me details for entity ABC123"</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Parameters:</span>
    <span class="tool-value">Entity ID</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Returns:</span>
    <span class="tool-value">Comprehensive entity details, metrics, relationships</span>
  </div>
</div>
</div>

<div class="tool-item">
<div class="tool-name"><code>get_logs_for_entity</code></div>
<div class="tool-details">
  <div class="tool-row">
    <span class="tool-label">Purpose:</span>
    <span class="tool-value">Get logs for a monitored entity based on name</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Usage:</span>
    <span class="tool-value">"Get logs for my-service"</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Parameters:</span>
    <span class="tool-value">Entity name</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Returns:</span>
    <span class="tool-value">Recent log entries for the specified entity</span>
  </div>
</div>
</div>

<div class="tool-item">
<div class="tool-name"><code>get_ownership</code></div>
<div class="tool-details">
  <div class="tool-row">
    <span class="tool-label">Purpose:</span>
    <span class="tool-value">Get detailed ownership information for entities</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Usage:</span>
    <span class="tool-value">"Who owns entity ABC123?"</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Parameters:</span>
    <span class="tool-value">Entity IDs</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Returns:</span>
    <span class="tool-value">Team ownership, contact information, responsibilities</span>
  </div>
</div>
</div>

<div class="tool-item">
<div class="tool-name"><code>get_kubernetes_events</code></div>
<div class="tool-details">
  <div class="tool-row">
    <span class="tool-label">Purpose:</span>
    <span class="tool-value">Get all events from a specific Kubernetes cluster</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Usage:</span>
    <span class="tool-value">"Show K8s events for cluster XYZ"</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Parameters:</span>
    <span class="tool-value">Kubernetes cluster ID (k8s.cluster.uid)</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Returns:</span>
    <span class="tool-value">Kubernetes events with timestamps and details</span>
  </div>
</div>
</div>
</div>

## Data Analysis {#data-analysis}

<div class="tool-category">
<div class="category-header">
  <span class="category-emoji">📊</span>
  <h3 class="category-title">Data Analysis</h3>
</div>
<p class="category-description">Tools for querying and analyzing monitoring data using DQL and other methods.</p>

<div class="tool-item">
<div class="tool-name"><code>execute_dql</code></div>
<div class="tool-details">
  <div class="tool-row">
    <span class="tool-label">Purpose:</span>
    <span class="tool-value">Execute a Dynatrace Query Language (DQL) statement</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Usage:</span>
    <span class="tool-value">"Execute DQL: fetch logs | limit 10"</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Parameters:</span>
    <span class="tool-value">DQL statement</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Returns:</span>
    <span class="tool-value">Query results in structured format</span>
  </div>
</div>
</div>

<div class="tool-item">
<div class="tool-name"><code>generate_dql_from_natural_language</code></div>
<div class="tool-details">
  <div class="tool-row">
    <span class="tool-label">Purpose:</span>
    <span class="tool-value">Convert natural language queries to DQL using Davis CoPilot AI</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Usage:</span>
    <span class="tool-value">"Show CPU usage for the last hour"</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Parameters:</span>
    <span class="tool-value">Natural language description</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Returns:</span>
    <span class="tool-value">Generated DQL query ready for execution</span>
  </div>
</div>
</div>

<div class="tool-item">
<div class="tool-name"><code>verify_dql</code></div>
<div class="tool-details">
  <div class="tool-row">
    <span class="tool-label">Purpose:</span>
    <span class="tool-value">Verify a DQL statement for syntax and validity</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Usage:</span>
    <span class="tool-value">"Verify this DQL: fetch logs | limit 100"</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Parameters:</span>
    <span class="tool-value">DQL statement</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Returns:</span>
    <span class="tool-value">Validation result with syntax errors if any</span>
  </div>
</div>
</div>

<div class="tool-item">
<div class="tool-name"><code>explain_dql_in_natural_language</code></div>
<div class="tool-details">
  <div class="tool-row">
    <span class="tool-label">Purpose:</span>
    <span class="tool-value">Explain DQL statements in natural language using Davis CoPilot AI</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Usage:</span>
    <span class="tool-value">"Explain what this DQL does: fetch logs | summarize count()"</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Parameters:</span>
    <span class="tool-value">DQL statement</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Returns:</span>
    <span class="tool-value">Plain English explanation of the query</span>
  </div>
</div>
</div>

<div class="tool-item">
<div class="tool-name"><code>execute_typescript</code></div>
<div class="tool-details">
  <div class="tool-row">
    <span class="tool-label">Purpose:</span>
    <span class="tool-value">Execute TypeScript code using Dynatrace Function Executor API</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Usage:</span>
    <span class="tool-value">"Run custom analysis script"</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Parameters:</span>
    <span class="tool-value">TypeScript source code, payload object</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Returns:</span>
    <span class="tool-value">Execution result or error messages</span>
  </div>
</div>
</div>
</div>

## Automation & Workflows {#automation-workflows}

<div class="tool-category">
<div class="category-header">
  <span class="category-emoji">⚡</span>
  <h3 class="category-title">Automation & Workflows</h3>
</div>
<p class="category-description">Tools for creating and managing automated workflows and notifications.</p>

<div class="tool-item">
<div class="tool-name"><code>create_workflow_for_notification</code></div>
<div class="tool-details">
  <div class="tool-row">
    <span class="tool-label">Purpose:</span>
    <span class="tool-value">Create automated notification workflows for problem alerts</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Usage:</span>
    <span class="tool-value">"Create a Slack notification workflow for critical problems"</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Parameters:</span>
    <span class="tool-value">Team name, channel, problem type, privacy settings</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Returns:</span>
    <span class="tool-value">Created workflow ID and configuration</span>
  </div>
</div>
</div>

<div class="tool-item">
<div class="tool-name"><code>make_workflow_public</code></div>
<div class="tool-details">
  <div class="tool-row">
    <span class="tool-label">Purpose:</span>
    <span class="tool-value">Make a workflow public on Dynatrace</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Usage:</span>
    <span class="tool-value">"Make workflow ABC123 public"</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Parameters:</span>
    <span class="tool-value">Workflow ID</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Returns:</span>
    <span class="tool-value">Updated workflow status</span>
  </div>
</div>
</div>
</div>

## Reporting & Dashboards {#reporting-dashboards}

<div class="tool-category">
<div class="category-header">
  <span class="category-emoji">📋</span>
  <h3 class="category-title">Reporting & Dashboards</h3>
</div>
<p class="category-description">Tools for generating reports and creating monitoring dashboards.</p>

<div class="tool-item">
<div class="tool-name"><code>create_dashboard</code></div>
<div class="tool-details">
  <div class="tool-row">
    <span class="tool-label">Purpose:</span>
    <span class="tool-value">Create Dynatrace dashboards from JSON files in the /dashboards folder</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Usage:</span>
    <span class="tool-value">"Create dashboards from JSON files"</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Parameters:</span>
    <span class="tool-value">None (auto-detects JSON files)</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Returns:</span>
    <span class="tool-value">Created dashboard names and IDs</span>
  </div>
</div>
</div>

<div class="tool-item">
<div class="tool-name"><code>bulk_delete_dashboards</code></div>
<div class="tool-details">
  <div class="tool-row">
    <span class="tool-label">Purpose:</span>
    <span class="tool-value">Bulk delete dashboards/documents by document IDs</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Usage:</span>
    <span class="tool-value">"Delete dashboards ABC123, XYZ789"</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Parameters:</span>
    <span class="tool-value">List of document IDs</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Returns:</span>
    <span class="tool-value">Deletion status for each document</span>
  </div>
</div>
</div>

<div class="tool-item">
<div class="tool-name"><code>direct_share_document</code></div>
<div class="tool-details">
  <div class="tool-row">
    <span class="tool-label">Purpose:</span>
    <span class="tool-value">Direct-share a document with specific recipients</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Usage:</span>
    <span class="tool-value">"Share document ABC123 with read access"</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Parameters:</span>
    <span class="tool-value">Document ID, access level (read/read-write)</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Returns:</span>
    <span class="tool-value">Sharing confirmation and recipient list</span>
  </div>
</div>
</div>

<div class="tool-item">
<div class="tool-name"><code>share_document_env</code></div>
<div class="tool-details">
  <div class="tool-row">
    <span class="tool-label">Purpose:</span>
    <span class="tool-value">Share a document across all environments</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Usage:</span>
    <span class="tool-value">"Share document ABC123 across all environments"</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Parameters:</span>
    <span class="tool-value">Document ID, access level (read/read-write)</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Returns:</span>
    <span class="tool-value">Cross-environment sharing status</span>
  </div>
</div>
</div>
</div>

## Communication {#communication}

<div class="tool-category">
<div class="category-header">
  <span class="category-emoji">💬</span>
  <h3 class="category-title">Communication</h3>
</div>
<p class="category-description">Tools for sending notifications and communicating across platforms.</p>

<div class="tool-item">
<div class="tool-name"><code>send_slack_message</code></div>
<div class="tool-details">
  <div class="tool-row">
    <span class="tool-label">Purpose:</span>
    <span class="tool-value">Send a Slack message via Slack Connector on Dynatrace</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Usage:</span>
    <span class="tool-value">"Send message 'Alert resolved' to #alerts channel"</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Parameters:</span>
    <span class="tool-value">Channel name, message content</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Returns:</span>
    <span class="tool-value">Message delivery confirmation</span>
  </div>
</div>
</div>

<div class="tool-item">
<div class="tool-name"><code>send_email</code></div>
<div class="tool-details">
  <div class="tool-row">
    <span class="tool-label">Purpose:</span>
    <span class="tool-value">Send emails via Dynatrace Email API with support for To, CC, BCC recipients</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Usage:</span>
    <span class="tool-value">"Send email to team@company.com with subject 'Alert Summary' and HTML body"</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Parameters:</span>
    <span class="tool-value">Recipients (to/cc/bcc), subject, body content, content type (text/html)</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Returns:</span>
    <span class="tool-value">Email delivery status with request ID and any rejected destinations</span>
  </div>
</div>
</div>

<div class="tool-item">
<div class="tool-name"><code>chat_with_davis_copilot</code></div>
<div class="tool-details">
  <div class="tool-row">
    <span class="tool-label">Purpose:</span>
    <span class="tool-value">Get answers to Dynatrace-related questions and troubleshooting guidance</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Usage:</span>
    <span class="tool-value">"How do I optimize my DQL query performance?"</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Parameters:</span>
    <span class="tool-value">Question text, optional context and formatting instructions</span>
  </div>
  <div class="tool-row">
    <span class="tool-label">Returns:</span>
    <span class="tool-value">Expert answers and troubleshooting guidance</span>
  </div>
</div>
</div>
</div>

</div>

---

## 💡 Usage Tips

- **Natural Language**: All tools can be invoked using conversational language
- **Context Awareness**: The MCP server understands context from previous interactions
- **Error Handling**: Tools provide helpful error messages and suggestions
- **Batch Operations**: Many tools support processing multiple items at once

## 🔗 Related Resources

- [Getting Started Guide]({{ '/getting-started' | relative_url }}) - Setup and basic usage
- [About the Project]({{ '/about' | relative_url }}) - Learn more about the MCP server
- [GitHub Repository](https://github.com/theharithsa/dynatrace-mcp-otel) - Source code and issues
