---
layout: page
title: Getting Started
permalink: /getting-started/
description: Quick start guide for setting up and using the Dynatrace MCP Server
---

# 🚀 Getting Started with Dynatrace MCP Server

Welcome to the Dynatrace Model Context Protocol (MCP) Server! This guide will help you get up and running quickly.

## Prerequisites

Before you begin, ensure you have:

- ✅ **Dynatrace Environment**: Access to a Dynatrace SaaS or Managed environment
- ✅ **OAuth Credentials**: Valid OAuth client ID and secret from Dynatrace
- ✅ **Node.js**: Version 18 or higher
- ✅ **npm**: Node package manager
- ✅ **Slack Integration** (optional): For notification features

## Quick Setup

### 1. Clone the Repository

```bash
git clone https://github.com/theharithsa/dynatrace-mcp-otel.git
cd dynatrace-mcp-otel
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Dynatrace OAuth Configuration
OAUTH_CLIENT_ID=your_client_id_here
OAUTH_CLIENT_SECRET=your_client_secret_here
OAUTH_URN=urn:dtaccount:your_account_id
DT_ENVIRONMENT_URL=https://your_environment_id.live.dynatrace.com

# Slack Configuration (optional)
SLACK_CONNECTION_ID=your_slack_connection_id

# Platform Token (for Davis CoPilot features)
DT_PLATFORM_TOKEN=your_platform_token
```

### 4. Build the Project

```bash
npm run build
```

### 5. Start the Server

```bash
npm start
```

## Essential OAuth Scopes

Your OAuth application needs these minimum scopes:

| Scope | Purpose |
|-------|---------|
| `app-engine:apps:run` | Core functionality |
| `app-engine:functions:run` | TypeScript execution |
| `environment-api:problems:read` | Problem management |
| `environment-api:security-problems:read` | Security analysis |
| `environment-api:entities:read` | Entity operations |
| `storage:logs:read` | Log analysis |
| `storage:metrics:read` | Metrics queries |
| `davis-copilot:conversations:execute` | AI assistance |

[View complete scope requirements →](scope-requirements.html)

## First Steps

### 1. Verify Connection

Start by checking your environment connection:

```
"Get information about my Dynatrace environment"
```

### 2. Explore Your Data

Try some basic queries:

```
"List all problems in my environment"
"Show me recent vulnerabilities"
"Get logs from my main application"
```

### 3. Use Natural Language Queries

Convert plain English to DQL:

```
"Show me error logs from the last 2 hours"
"Find hosts with high CPU usage"
"Get database response times from today"
```

## Common Workflows

### 🔍 Incident Investigation

1. **List Problems** → **Get Problem Details** → **Find Affected Entities**
2. **Get Entity Logs** → **Analyze Root Cause** → **Notify Teams**

### 🛡️ Security Analysis

1. **List Vulnerabilities** → **Get Vulnerability Details** → **Check Affected Systems**
2. **Get Ownership Info** → **Send Alerts** → **Track Remediation**

### 📊 Data Exploration

1. **Generate DQL Query** → **Verify Syntax** → **Execute Query**
2. **Analyze Results** → **Create Dashboard** → **Share Insights**

## Tool Categories Overview

### 🔧 Environment & Setup
- [Get Environment Info](get_environment_info.html) - Verify connection

### 🚨 Problems & Incidents
- [List Problems](list_problems.html) - Health overview
- [Get Problem Details](get_problem_details.html) - Deep analysis
- [Create Notifications](create_workflow_for_notification.html) - Automate alerts

### 🔒 Security & Vulnerabilities
- [List Vulnerabilities](list_vulnerabilities.html) - Security overview
- [Get Vulnerability Details](get_vulnerability_details.html) - Risk analysis

### 📊 Data Analysis & Querying
- [Execute DQL](execute_dql.html) - Run custom queries
- [Generate DQL](generate_dql_from_natural_language.html) - AI-powered query creation
- [Explain DQL](explain_dql_in_natural_language.html) - Understand complex queries

### 💬 Communication
- [Send Slack Messages](send_slack_message.html) - Team notifications

## Best Practices

### 🎯 Effective Prompting

**Be Specific:**
- ✅ "Show error logs from PaymentAPI service in the last hour"
- ❌ "Show some logs"

**Include Context:**
- ✅ "Find hosts with CPU above 80% in production environment"
- ❌ "Find slow hosts"

**Use Time Ranges:**
- ✅ "Get problems from the last 24 hours"
- ❌ "Get recent problems"

### 🔗 Tool Chaining

Combine tools for powerful workflows:

```
1. List Problems → Get Problem Details → Get Entity Details
2. Generate DQL → Verify DQL → Execute DQL
3. Get Vulnerability Details → Get Ownership → Send Slack Message
```

### 🔒 Security Considerations

- Never include credentials in queries
- Review permissions before sharing documents
- Use appropriate access levels for document sharing
- Monitor tool usage and access patterns

## Troubleshooting

### Common Issues

**Connection Problems:**
- Verify OAuth credentials in `.env`
- Check environment URL format
- Ensure required scopes are granted

**Permission Errors:**
- Review OAuth scope requirements
- Contact Dynatrace admin for additional permissions
- Check API token permissions

**Query Issues:**
- Use `verify_dql` before executing queries
- Start with simple queries and build complexity
- Check entity names and field formats

### Getting Help

1. **Use the AI Assistant**: Try `chat_with_davis_copilot` for guidance
2. **Check Documentation**: Each tool has detailed documentation
3. **Community Support**: Visit [GitHub Issues](https://github.com/theharithsa/dynatrace-mcp-otel/issues)
4. **Dynatrace Community**: [Dynatrace Community](https://community.dynatrace.com/)

## What's Next?

- 📖 **Explore Tools**: Browse the [complete tool documentation](index.html)
- 🔧 **Advanced Setup**: Configure custom dashboards and workflows  
- 🤝 **Join Community**: Share feedback and contribute improvements
- 📊 **Build Dashboards**: Create custom visualizations from your data

---

**Ready to get started?** Begin with the [environment info tool](get_environment_info.html) to verify your connection, then explore the tools that match your use case!

<div class="getting-started-footer">
  <div class="next-steps">
    <h3>Quick Links</h3>
    <a href="index.html" class="btn btn-primary">📚 View All Tools</a>
    <a href="get_environment_info.html" class="btn btn-secondary">🔧 Test Connection</a>
    <a href="https://github.com/theharithsa/dynatrace-mcp-otel" class="btn btn-outline" target="_blank">🔗 GitHub Repository</a>
  </div>
</div>

<style>
.getting-started-footer {
  margin: 3rem 0 2rem 0;
  padding: 2rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  text-align: center;
}

.next-steps h3 {
  margin-bottom: 1.5rem;
  color: #343a40;
}

.btn {
  display: inline-block;
  padding: 12px 24px;
  margin: 0 0.5rem 0.5rem 0;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.btn-primary {
  background: linear-gradient(135deg, #1496ff 0%, #6f42c1 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(20, 150, 255, 0.3);
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #545b62;
  color: white;
  transform: translateY(-2px);
}

.btn-outline {
  background: transparent;
  color: #1496ff;
  border-color: #1496ff;
}

.btn-outline:hover {
  background: #1496ff;
  color: white;
  transform: translateY(-2px);
}
</style>
