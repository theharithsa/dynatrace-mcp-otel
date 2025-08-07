---
layout: page
title: Getting Started
permalink: /getting-started/
---

# 🚀 Getting Started with Dynatrace MCP Server

Welcome to the Dynatrace Model Context Protocol Server! This guide will help you set up and start using the server to interact with Dynatrace through natural language.

## Prerequisites

Before you begin, ensure you have:

- **Dynatrace Environment**: Access to a Dynatrace SaaS or Managed environment
- **API Token**: A Dynatrace API token with appropriate permissions
- **Node.js**: Version 18 or higher
- **NPM**: Node Package Manager (comes with Node.js)

## Installation

### Option 1: Install from NPM

```bash
npm install -g dynatrace-mcp-server
```

### Option 2: Build from Source

```bash
git clone https://github.com/theharithsa/dynatrace-mcp-otel.git
cd dynatrace-mcp-otel
npm install
npm run build
```

## Configuration

### 1. Environment Setup

Create a `.env` file in your project root:

```env
# Dynatrace Configuration
DYNATRACE_URL=https://your-environment.dynatrace.com
DYNATRACE_API_TOKEN=dt0c01.xxxxx.xxxxx

# Optional: Additional settings
PORT=3000
LOG_LEVEL=info
```

### 2. API Token Permissions

Your Dynatrace API token needs the following scopes:

- `Read problems`
- `Read security events`
- `Read metrics`
- `Read logs`
- `Read configuration`
- `Write configuration` (for creating dashboards)
- `Execute queries`

## Quick Start

### 1. Start the Server

```bash
# If installed globally
dynatrace-mcp-server

# If built from source
npm start
```

### 2. Test the Connection

Once the server is running, you can test it by asking:

> "What is my environment information?"

### 3. Explore Available Tools

The server provides various categories of tools:

- **🔧 Environment & Setup**: Get environment info, test connections
- **🚨 Problems & Incidents**: List and analyze problems
- **🔒 Security & Vulnerabilities**: Monitor security threats
- **📊 Data Analysis**: Execute DQL queries
- **⚡ Automation**: Create workflows and notifications
- **📋 Reporting**: Generate dashboards and reports

## Example Interactions

Here are some example natural language queries you can try:

### Environment Management
- "Show me my environment information"
- "What's the current status of my Dynatrace environment?"

### Problem Analysis  
- "List all open problems in my environment"
- "Show me details for problem ID ABC123"
- "What problems occurred in the last 24 hours?"

### Security Monitoring
- "List all security vulnerabilities"
- "Show me high-severity security findings"
- "What are the latest security events?"

### Data Queries
- "Execute a DQL query to show CPU usage"
- "Get logs for entity XYZ from the last hour"
- "Show me database performance metrics"

### Automation
- "Create a Slack notification workflow for critical problems"
- "Set up a workflow for security alerts"

### Dashboards
- "Create a dashboard for application performance"
- "Generate a report on system health"

## Common Issues

### Connection Problems

**Issue**: Cannot connect to Dynatrace
**Solution**: 
1. Verify your `DYNATRACE_URL` is correct
2. Check your API token has proper permissions
3. Ensure network connectivity to your Dynatrace environment

### Authentication Errors

**Issue**: API authentication failed
**Solution**:
1. Regenerate your API token in Dynatrace
2. Verify the token has all required scopes
3. Update your `.env` file with the new token

### Tool Execution Errors

**Issue**: Tools return errors or unexpected results
**Solution**:
1. Check the server logs for detailed error messages
2. Verify your query syntax and parameters
3. Ensure you have permissions for the requested operation

## Next Steps

Now that you have the server running:

1. **Explore Tools**: Check out the [Tools Reference]({{ '/tools' | relative_url }}) for detailed documentation
2. **Learn DQL**: Familiarize yourself with Dynatrace Query Language
3. **Create Workflows**: Set up automated workflows for your use cases
4. **Build Dashboards**: Create custom monitoring dashboards

## Support

Need help? Here are your options:

- 📚 [Tool Documentation]({{ '/tools' | relative_url }})
- 🐛 [Report Issues](https://github.com/theharithsa/dynatrace-mcp-otel/issues)
- 💬 [Discussion Forum](https://github.com/theharithsa/dynatrace-mcp-otel/discussions)
- 📧 [Email Support](mailto:vishruth.harithsa@dynatrace.com)

Happy monitoring! 🎉
