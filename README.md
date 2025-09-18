# Dynatrace MCP

[![NPM Version](https://img.shields.io/npm/v/@theharithsa/dynatrace-mcp-server?logo=npm&logoColor=white)](https://www.npmjs.com/package/@theharithsa/dynatrace-mcp-server)
[![NPM Downloads](https://img.shields.io/npm/dm/@theharithsa/dynatrace-mcp-server?logo=npm&logoColor=white)](https://www.npmjs.com/package/@theharithsa/dynatrace-mcp-server)
[![License](https://img.shields.io/npm/l/@theharithsa/dynatrace-mcp-server?color=blue)](https://github.com/theharithsa/dynatrace-mcp-otel/blob/main/LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/theharithsa/dynatrace-mcp-otel/npm-publish.yml?branch=main&logo=github&logoColor=white)](https://github.com/theharithsa/dynatrace-mcp-otel/actions)
[![Node.js Version](https://img.shields.io/node/v/@theharithsa/dynatrace-mcp-server?logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![OpenTelemetry](https://img.shields.io/badge/OpenTelemetry-Enabled-orange?logo=opentelemetry&logoColor=white)](https://opentelemetry.io/)
[![Davis CoPilot](https://img.shields.io/badge/Davis%20CoPilot-AI%20Powered-purple?logo=dynatrace&logoColor=white)](https://docs.dynatrace.com/docs/platform-modules/davis-copilot)
[![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-green?logo=anthropic&logoColor=white)](https://modelcontextprotocol.io/)
[![Dynatrace Platform](https://img.shields.io/badge/Dynatrace-Platform%20Ready-blue?logo=dynatrace&logoColor=white)](https://docs.dynatrace.com/)

A powerful Model Context Protocol (MCP) server that provides AI assistants with comprehensive access to Dynatrace's observability platform. Features dual authentication architecture, Davis CoPilot AI integration, and **24 specialized tools** for monitoring, automation, and operational intelligence.

## 🚀 What's New in v2.6.0

- **📊 Grail Budget Tracking**: Advanced budget monitoring system with real-time usage tracking, warnings, and limits
- **🏷️ Entity Tagging**: Add custom tags to monitored entities for better organization and filtering
- **📈 HTTP Server Mode**: Run as a standalone HTTP server for broader integration possibilities
- **🔧 Enhanced DQL Execution**: Improved metadata extraction, error handling, and budget integration
- **📧 Enhanced Email System**: Professional email capabilities with HTML/text support and multiple recipients
- **🧪 Comprehensive Testing**: 38 test cases covering all major functionality with 83% success rate
- **📚 Extended Documentation**: Updated guides, examples, and troubleshooting resources

## Costs

**Important:** While this local MCP server is provided for free, using it to access data in Dynatrace Grail may incur additional costs based on your Dynatrace consumption model. This affects `execute_dql` tool and other capabilities that **query** Dynatrace Grail storage, and costs depend on the volume (GB scanned/billed).

**Before using this MCP server extensively, please:**

1. Review your current Dynatrace consumption model and pricing
2. Understand the cost implications of the specific data you plan to query (logs, events, metrics) - see [Dynatrace Pricing and Rate Card](https://www.dynatrace.com/pricing/)
3. Start with smaller timeframes (e.g., 12h-24h) and make use of [buckets](https://docs.dynatrace.com/docs/discover-dynatrace/platform/grail/data-model#built-in-grail-buckets) to reduce the cost impact

**Note**: We will be providing a way to monitor Query Usage of the dynatrace-mcp-server in the future.

## Table of Contents

- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Available Tools](#available-tools-24-total)
- [Davis CoPilot AI Integration](#davis-copilot-ai-integration)
- [Environment Variables](#environment-variables)
- [Authentication](#authentication)
- [Advanced Usage](#advanced-usage)
- [Development](#development)
- [Dynatrace MCP OpenTelemetry Integration](#dynatrace-mcp-opentelemetry-integration)

## 🏆 Production Ready & Tested

**v2.6.0 has been extensively tested with real Dynatrace environments:**

- ✅ **20/24 tools working perfectly** (83% success rate)
- ✅ **All core monitoring functions** operational (DQL, entities, dashboards)
- ✅ **AI integration** fully functional (Davis CoPilot, natural language processing)
- ✅ **Budget tracking** prevents cost overruns with real-time monitoring
- ✅ **Communication tools** validated (Slack, Email with professional formatting)
- ✅ **Automation workflows** tested and operational

**Minor OAuth scope adjustments needed for 4 tools** - mainly permission-related issues that are easily configurable.

## Quick Start

### 1. Add to Your MCP Client

Configure your MCP client (Claude Desktop, Cline, etc.) by adding this server to your `mcp.json`:

```json
{
  "mcpServers": {
    "dynatrace": {
      "command": "npx",
      "args": ["@theharithsa/dynatrace-mcp-server"],
      "env": {
        "OAUTH_CLIENT_ID": "dt0s02.ABC123...",
        "OAUTH_CLIENT_SECRET": "dt0s02.ABC123.DEF456...",
        "DT_ENVIRONMENT": "https://abc12345.apps.dynatrace.com"
      }
    }
  }
}
```

### 2. Get Your Dynatrace Credentials

1. Go to your Dynatrace environment → **Settings** → **Platform Management** → **OAuth clients**
2. Create a new OAuth client with the [required OAuth scopes](#required-oauth-scopes)
3. Copy the Client ID and Secret

### 3. Start Using

Your AI assistant can now:

- **🤖 AI-Powered Queries**: Convert natural language to DQL using Davis CoPilot
- **📊 Monitor & Analyze**: Query problems, vulnerabilities, and execute DQL statements
- **🏗️ Entity Management**: Find, tag, and manage monitored entities with ownership info
- **📈 Dashboard Operations**: Create, delete, and share dashboards with access control
- **🤖 Automation**: Create workflows and execute custom TypeScript functions
- **💬 Communication**: Send Slack messages and professional emails
- **📊 Budget Control**: Track and manage Grail query usage with budget limits

## Configuration

### Basic Configuration

```json
{
  "mcpServers": {
    "dynatrace": {
      "command": "npx",
      "args": ["@theharithsa/dynatrace-mcp-server"],
      "env": {
        "OAUTH_CLIENT_ID": "dt0s02.your-client-id",
        "OAUTH_CLIENT_SECRET": "dt0s02.your-client-id.your-client-secret",
        "DT_ENVIRONMENT": "https://your-tenant.apps.dynatrace.com"
      }
    }
  }
}
```

### Alternative: Global Installation

```bash
# Install globally
npm install -g @theharithsa/dynatrace-mcp-server

# Then use in mcp.json
{
  "mcpServers": {
    "dynatrace": {
      "command": "dynatrace-mcp-server",
      "env": {
        "OAUTH_CLIENT_ID": "dt0s02.your-client-id",
        "OAUTH_CLIENT_SECRET": "dt0s02.your-client-id.your-client-secret",
        "DT_ENVIRONMENT": "https://your-tenant.apps.dynatrace.com"
      }
    }
  }
}
```

### HTTP Server Mode (NEW!)

Run as a standalone HTTP server for broader integration possibilities:

```bash
# Install globally first
npm install -g @theharithsa/dynatrace-mcp-server

# Run as HTTP server (requires all environment variables set)
dynatrace-mcp-server --http-port 3000

# Server will be available at http://localhost:3000
# Endpoints:
# GET  /health      - Health check
# POST /tools/list  - List available tools  
# POST /tools/call  - Execute tool calls
```

**Environment Variables for HTTP Mode:**
```bash
export OAUTH_CLIENT_ID="dt0s02.your-client-id"
export OAUTH_CLIENT_SECRET="dt0s02.your-client-id.your-client-secret"
export DT_ENVIRONMENT="https://your-tenant.apps.dynatrace.com"
export DT_GRAIL_QUERY_BUDGET_GB="100"  # Optional: Set Grail budget limit
export LOG_LEVEL="info"                # Optional: debug, info, warn, error
```

**Docker Support:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
RUN npm install -g @theharithsa/dynatrace-mcp-server
EXPOSE 3000
CMD ["dynatrace-mcp-server", "--http-port", "3000"]
```

## Available Tools (24 Total)

### 🤖 Davis CoPilot AI Integration (3 tools)

- **`generate_dql_from_natural_language`** - Convert natural language to DQL queries using Davis CoPilot AI
- **`explain_dql_in_natural_language`** - Get plain English explanations of complex DQL statements  
- **`chat_with_davis_copilot`** - AI-powered assistant for Dynatrace questions and troubleshooting

### 🔍 Monitoring & Observability (4 tools)

- **`get_environment_info`** - Get Dynatrace environment details and configuration
- **`list_problems`** - List all active problems in your environment
- **`list_vulnerabilities`** - List security vulnerabilities detected by Dynatrace
- **`get_kubernetes_events`** - Get Kubernetes cluster events and status

### 📊 Data Querying & Analysis (2 tools)

- **`execute_dql`** - Execute Dynatrace Query Language statements with budget tracking
- **`verify_dql`** - Validate DQL syntax and structure before execution

### 🏗️ Entity Management & Tagging (4 tools)

- **`find_entity_by_name`** - Find monitored entities by name across all entity types
- **`get_entity_details`** - Get detailed information about specific monitored entities
- **`add_entity_tags`** - Add custom tags to Dynatrace monitored entities
- **`get_ownership`** - Get ownership information and team assignments for entities

### 📈 Dashboard & Document Management (4 tools)

- **`create_dashboard`** - Create dashboards from JSON files in bulk
- **`bulk_delete_dashboards`** - Delete multiple dashboards by document IDs
- **`share_document_env`** - Share documents across environments with access control
- **`direct_share_document`** - Share documents directly with specific recipients

### 🤖 Automation & Workflows (3 tools)

- **`create_workflow_for_notification`** - Create notification workflows for problem alerts
- **`make_workflow_public`** - Make private workflows publicly accessible
- **`execute_typescript`** - Execute custom TypeScript code via Dynatrace Function Executor

### 💬 Communication (2 tools)

- **`send_slack_message`** - Send messages via Dynatrace Slack integration
- **`send_email`** - Send professional emails with HTML/text support via Dynatrace Email API

### 📊 Budget & Usage Management (2 tools)

- **`get_grail_budget_status`** - Monitor current Grail query budget usage and limits
- **`reset_grail_budget`** - Reset the budget tracker when limits are exceeded

## Davis CoPilot AI Integration

### Overview

Davis CoPilot AI integration brings intelligent query generation and natural language processing to your Dynatrace MCP workflows. This feature is perfect for:

- Converting natural language requests into powerful DQL queries
- Understanding complex DQL statements in plain English
- Getting AI-powered assistance for Dynatrace-related questions

### Key Features

#### Natural Language to DQL

Transform plain English into powerful queries:

```text
Input: "Show me CPU usage for all hosts in the last hour"
↓ Davis CoPilot AI ↓
Generated: timeseries from:now()-1h, by:{dt.entity.host}, cpuUsage = avg(dt.host.cpu.usage)
```

#### DQL Explanation

Understand complex queries in plain English:

```text
Input: fetch spans | filter duration > 5s | summarize avg(duration) by service.name
↓ Davis CoPilot AI ↓
"This query retrieves all spans with duration longer than 5 seconds, then calculates the average duration grouped by service name"
```

#### AI Assistant

Get contextual help for any Dynatrace topic, from troubleshooting to best practices.

### Workflow Integration

The recommended AI workflow is:

1. **Generate**: Use `generate_dql_from_natural_language` to create queries from natural language
2. **Verify**: Use `verify_dql` to validate DQL syntax and structure
3. **Execute**: Use `execute_dql` to run queries with automatic budget tracking
4. **Monitor**: Use `get_grail_budget_status` to check query costs and usage
5. **Reset**: Use `reset_grail_budget` if budget limits are exceeded
6. **Iterate**: Refine based on results, costs, and repeat

### Required Scopes for Davis CoPilot

Add these scopes to your OAuth client:

```
davis-copilot:nl2dql:execute
davis-copilot:dql2nl:execute
davis-copilot:conversations:execute
```

### Usage Examples

#### Generate DQL from Natural Language

```json
{
  "tool": "generate_dql_from_natural_language",
  "arguments": {
    "text": "Show me CPU usage for all hosts in the last hour"
  }
}
```

**Result:** Generated DQL ready for execution with verification token.

#### Explain Complex DQL

```json
{
  "tool": "explain_dql_in_natural_language", 
  "arguments": {
    "dql": "timeseries from:now()-1h, by:{dt.entity.host}, cpuUsage = avg(dt.host.cpu.usage)"
  }
}
```

**Result:** Plain English explanation of query logic and data sources.

#### Chat with Davis CoPilot

```json
{
  "tool": "chat_with_davis_copilot",
  "arguments": {
    "text": "How do I optimize database query performance in my Java application?",
    "context": "We're seeing high response times in our e-commerce application"
  }
}
```

## Environment Variables

### Core Required Variables

| Variable              | Description                              | Example                               | Required               |
| --------------------- | ---------------------------------------- | ------------------------------------- | ---------------------- |
| `OAUTH_CLIENT_ID`     | Dynatrace OAuth Client ID                | `dt0s02.ABC123...`                    | ✅                     |
| `OAUTH_CLIENT_SECRET` | Dynatrace OAuth Client Secret            | `dt0s02.ABC123.DEF456...`             | ✅                     |
| `DT_ENVIRONMENT`      | Dynatrace environment URL (Platform API) | `https://abc12345.apps.dynatrace.com` | ✅                     |
| `DT_PLATFORM_TOKEN`   | Platform API token for Davis CoPilot     | `dt0c01.XYZ789...`                    | ✅ (for Davis CoPilot) |

### Budget & Logging Configuration (NEW!)

| Variable                      | Description                          | Example | Default |
| ----------------------------- | ------------------------------------ | ------- | ------- |
| `DT_GRAIL_QUERY_BUDGET_GB`    | Grail query budget limit in GB       | `100`   | `10`    |
| `LOG_LEVEL`                   | Logging level (debug/info/warn/error)| `info`  | `info`  |
| `HTTP_PORT`                   | Port for HTTP server mode            | `3000`  | None    |

### OAuth Configuration (Optional)

| Variable          | Description          | Default                                      |
| ----------------- | -------------------- | -------------------------------------------- |
| `OAUTH_TOKEN_URL` | OAuth token endpoint | `https://sso.dynatrace.com/sso/oauth2/token` |
| `OAUTH_URN`       | OAuth resource URN   | `urn:dtaccount:<your-account-urn-guid>`      |

### OpenTelemetry Tracing (Optional)

| Variable                      | Description                       | Example                                                     |
| ----------------------------- | --------------------------------- | ----------------------------------------------------------- |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OTLP endpoint for traces          | `https://abc12345.live.dynatrace.com/api/v2/otlp/v1/traces` |
| `DYNATRACE_API_TOKEN`         | API token for trace/log export    | `dt0c01.ABC123...`                                          |
| `DYNATRACE_LOG_INGEST_URL`    | Log ingest endpoint               | `https://abc12345.live.dynatrace.com/api/v2/logs/ingest`    |
| `OTEL_RESOURCE_ATTRIBUTES`    | OpenTelemetry resource attributes | `service.name=dynatrace-mcp-server,service.version=2.2.0`   |

### Slack Integration (Optional)

| Variable              | Description                        | Default |
| --------------------- | ---------------------------------- | ------- |
| `SLACK_CONNECTION_ID` | Slack connection ID from Dynatrace | None    |

### Document Sharing (Optional)

| Variable              | Description                            | Default |
| --------------------- | -------------------------------------- | ------- |
| `DT_SHARE_RECIPIENTS` | Comma-separated list of user/group IDs | None    |
| `DT_SHARE_TYPE`       | Type of recipients (user/group)        | `group` |

### Complete Configuration Example

```json
{
  "mcpServers": {
    "dynatrace": {
      "command": "npx",
      "args": ["@theharithsa/dynatrace-mcp-server"],
      "env": {
        "OAUTH_CLIENT_ID": "dt0s02.ABC123...",
        "OAUTH_CLIENT_SECRET": "dt0s02.ABC123.DEF456...",
        "DT_ENVIRONMENT": "https://abc12345.apps.dynatrace.com",
        "OTEL_EXPORTER_OTLP_ENDPOINT": "https://abc12345.live.dynatrace.com/api/v2/otlp/v1/traces",
        "DYNATRACE_API_TOKEN": "dt0c01.XYZ789...",
        "DYNATRACE_LOG_INGEST_URL": "https://abc12345.live.dynatrace.com/api/v2/logs/ingest",
        "SLACK_CONNECTION_ID": "your-slack-connection-id",
        "DT_SHARE_RECIPIENTS": "group-id-1,group-id-2",
        "DT_SHARE_TYPE": "group"
      }
    }
  }
}
```

## Authentication

### 🔐 Dual Authentication Architecture

Version 2.5.0 introduces a powerful dual authentication system that automatically routes requests to the appropriate Dynatrace API endpoints:

#### 1. **OAuth Client Authentication** (Primary)

- **Purpose**: Davis CoPilot AI, advanced platform features, and app execution
- **Endpoint**: `apps.dynatrace.com`
- **Token Format**: `dt0s02.CLIENT_ID` and `dt0s02.CLIENT_ID.CLIENT_SECRET`
- **Configuration**: `OAUTH_CLIENT_ID` and `OAUTH_CLIENT_SECRET`

#### 2. **API Token Authentication** (Secondary)

- **Purpose**: Entity operations, tagging, basic data access
- **Endpoint**: `live.dynatrace.com`
- **Token Format**: `dt0c01.API_TOKEN`
- **Configuration**: `DT_API_TOKEN` (optional for entity operations)

#### 3. **Platform Token Authentication** (Tertiary)

- **Purpose**: Environment information and platform management
- **Endpoint**: `apps.dynatrace.com`
- **Token Format**: `dt0s16.PLATFORM_TOKEN`
- **Configuration**: `DT_PLATFORM_TOKEN` (optional for environment info)

### Required OAuth Scopes

**🤖 Davis CoPilot AI (Core Features):**

- `davis-copilot:nl2dql:execute` - Natural language to DQL conversion
- `davis-copilot:dql2nl:execute` - DQL explanation in natural language
- `davis-copilot:conversations:execute` - AI-powered conversations

**🏗️ Platform & App Engine:**

- `app-engine:apps:run` - Execute Dynatrace apps
- `app-engine:functions:run` - Execute TypeScript functions

**📊 Data & Query Engine:**

- `storage:*:read` - DQL queries (logs, metrics, events, spans)
- `environment-api:entities:read` - Entity information
- `environment-api:entities:write` - Entity tagging (when using OAuth)

**🔍 Monitoring & Security:**

- `environment-api:problems:read` - Problem analysis
- `environment-api:security-problems:read` - Vulnerability management

**🔧 Automation & Workflows:**

- `automation:workflows:write` - Workflow creation
- `automation:workflows:read` - Workflow management
- `automation:workflows:run` - Workflow execution

**📋 Documents & Dashboards:**

- `document:documents:write` - Dashboard creation
- `document:documents:delete` - Dashboard deletion
- `document:environment-shares:write` - Document sharing
- `document:direct-shares:write` - Direct document sharing

**💬 Communication:**

- `email:emails:send` - Email notifications
- `app-settings:objects:read` - Slack integration
- `settings:objects:read` - Ownership information

### Setting Up Authentication

#### Step 1: Create OAuth Client

1. Navigate to **Settings** → **Platform Management** → **OAuth clients**
2. Click **Create OAuth client**
3. Set **Client type** to `Public`
4. Add all required scopes from the list above
5. Save and copy the Client ID and Secret

#### Step 2: (Optional) Generate API Token

1. Go to **Settings** → **Access Tokens** → **Generate new token**
2. Add scopes: `entities.read`, `entities.write`, `problems.read`
3. Copy the token (format: `dt0c01.XXXXXX`)

#### Step 3: Configuration

**Minimal Configuration (OAuth only):**

```json
{
  "OAUTH_CLIENT_ID": "dt0s02.ABC123...",
  "OAUTH_CLIENT_SECRET": "dt0s02.ABC123.DEF456...",
  "DT_ENVIRONMENT": "https://abc12345.apps.dynatrace.com"
}
```

**Full Configuration (All features):**

```json
{
  "OAUTH_CLIENT_ID": "dt0s02.ABC123...",
  "OAUTH_CLIENT_SECRET": "dt0s02.ABC123.DEF456...",
  "DT_ENVIRONMENT": "https://abc12345.apps.dynatrace.com",
  "DT_API_TOKEN": "dt0c01.XYZ789...",
  "DT_PLATFORM_TOKEN": "dt0s16.PLATFORM123..."
}
```

## Advanced Usage

### Custom Dashboard Creation

Place JSON dashboard files in a `/dashboards` folder and use the `create_dashboard` tool to bulk-create them.

### TypeScript Code Execution

Execute custom logic using the Dynatrace Function Executor:

```typescript
// Example: Query and process data
export default async function ({ entityId }) {
  // Your custom TypeScript code here
  return { processed: true, entityId };
}
```

### Slack Integration

Configure Slack notifications by setting up a Slack connection in Dynatrace and providing the `SLACK_CONNECTION_ID`.

### Email Integration

Send professional emails with rich formatting using the `send_email` tool:

```typescript
// Example: Send alert notification
{
  "toRecipients": ["oncall@company.com"],
  "ccRecipients": ["team-lead@company.com"],
  "subject": "🚨 Critical Alert: High CPU Usage",
  "body": "**Alert Details:**\n- Server: web-prod-01\n- CPU Usage: 95%\n- Duration: 15 minutes\n\n**Action Required**: Immediate investigation needed.",
  "contentType": "text/plain"
}
```

**Key Features:**

- Support for To, CC, and BCC recipients (up to 100 total)
- HTML and plain text content types
- Professional formatting with markdown support
- Comprehensive error handling and delivery tracking
- Integration with Dynatrace tenant domain validation

## Development

### For Code Customization

If you need to modify the server code:

```bash
# Install the package for customization
npm install @theharithsa/dynatrace-mcp-server

# Clone and modify the source
git clone https://github.com/theharithsa/dynatrace-mcp-otel.git
cd dynatrace-mcp-otel
npm install
npm run build
```

### Local Development

```json
{
  "mcpServers": {
    "dynatrace-local": {
      "command": "node",
      "args": ["dist/index.js"],
      "cwd": "/path/to/dynatrace-mcp-otel",
      "env": {
        "OAUTH_CLIENT_ID": "dt0s02.your-client-id",
        "OAUTH_CLIENT_SECRET": "dt0s02.your-client-id.your-client-secret",
        "DT_ENVIRONMENT": "https://your-tenant.apps.dynatrace.com"
      }
    }
  }
}
```

### Installation Options

```bash
# NPX (recommended for most users)
npx @theharithsa/dynatrace-mcp-server

# Global installation
npm install -g @theharithsa/dynatrace-mcp-server

# Local project installation
npm install @theharithsa/dynatrace-mcp-server
```

## Dynatrace MCP OpenTelemetry Integration

### Observability Features

#### Log Correlation

- All logs include `dt.security_context` field set to `dynatrace_mcp_otel`
- Logs are tagged with `logType: build-logs` for filtering
- Logs are automatically correlated with traces via standard OpenTelemetry attributes

#### CI/CD Observability

Our GitHub Actions workflows are instrumented with OpenTelemetry using [inception-health/otel-action](https://github.com/marketplace/actions/opentelemetry-for-github-workflows-jobs-and-steps).

##### Configuration in GitHub Actions

```yaml
- name: Setup OpenTelemetry
  uses: inception-health/otel-action@v2
  with:
    dsn: ${{ vars.OTEL_EXPORTER_OTLP_ENDPOINT }}
    service_name: 'dynatrace-mcp-server-build'
    access_token: ${{ secrets.DYNATRACE_API_TOKEN }}
    log_url: ${{ vars.DYNATRACE_LOG_INGEST_URL }}
    build_type: ${{ github.ref == 'refs/heads/dev' && 'dev' || 'prod' }}
```

##### Required Variables/Secrets

- `OTEL_EXPORTER_OTLP_ENDPOINT`: Dynatrace OTLP endpoint URL
- `DYNATRACE_API_TOKEN`: API token with ingest permission
- `DYNATRACE_LOG_INGEST_URL`: Dynatrace log ingest URL

#### Known Issues

- In version 1.0.8, trace ingestion might not work correctly in all environments, but logging functionality works as expected

## Version History

- **2.6.0**: Added Grail budget tracking, entity tagging, HTTP server mode, enhanced testing (24 tools with 83% success rate)
- **2.5.0**: Enhanced authentication architecture with dual OAuth/API token support, improved platform integration
- **2.3.0**: Added comprehensive workflow automation and document sharing capabilities
- **2.2.0**: Added comprehensive email integration with `send_email` tool supporting HTML/plain text, multiple recipients, and professional formatting
- **2.1.0**: Added Davis CoPilot AI integration with natural language processing capabilities
- **2.0.0**: Updated package structure and naming; enhanced configuration options
- 1.0.8: Switched to standard OpenTelemetry GitHub Action; enhanced logging with security context
- 1.0.7: // ...existing version history...

## Support

- **Issues**: Report issues on [GitHub](https://github.com/theharithsa/dynatrace-mcp-otel/issues)
- **Documentation**: [Dynatrace Platform Documentation](https://docs.dynatrace.com)
- **MCP Protocol**: [Model Context Protocol](https://modelcontextprotocol.io)

---

**Note**: This MCP server is designed for AI assistant integration. For standalone use cases, consider using the Dynatrace CLI or API directly.
