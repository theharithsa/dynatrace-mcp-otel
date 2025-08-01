# Dynatrace MCP Server

A Model Context Protocol (MCP) server that provides AI assistants with comprehensive access to Dynatrace observability data, automation capabilities, and operational insights.

## Table of Contents

- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Available Tools](#available-tools)
- [Environment Variables](#environment-variables)
- [Authentication](#authentication)
- [Advanced Usage](#advanced-usage)
- [Development](#development)
- [Dynatrace MCP OpenTelemetry Integration](#dynatrace-mcp-opentelemetry-integration)

## Quick Start

### 1. Add to Your MCP Client

Configure your MCP client (Claude Desktop, Cline, etc.) by adding this server to your `mcp.json`:

```json
{
  "mcpServers": {
    "dynatrace": {
      "command": "npx",
      "args": ["dynatrace-mcp-server"],
      "env": {
        "OAUTH_CLIENT_ID": "dt0c01.ABC123...",
        "OAUTH_CLIENT_SECRET": "dt0s01.DEF456...",
        "DT_ENVIRONMENT": "https://abc12345.apps.dynatrace.com"
      }
    }
  }
}
```

### 2. Get Your Dynatrace Credentials

1. Go to your Dynatrace environment → **Settings** → **Platform Management** → **OAuth clients**
2. Create a new OAuth client with the [required scopes](#required-scopes)
3. Copy the Client ID and Secret

### 3. Start Using

Your AI assistant can now:
- Query problems and vulnerabilities
- Execute DQL (Dynatrace Query Language) queries
- Get entity details and ownership information
- Create dashboards and workflows
- Send Slack notifications
- Execute custom TypeScript code

## Configuration

### Basic Configuration

```json
{
  "mcpServers": {
    "dynatrace": {
      "command": "npx",
      "args": ["dynatrace-mcp-server"],
      "env": {
        "OAUTH_CLIENT_ID": "your-client-id",
        "OAUTH_CLIENT_SECRET": "your-client-secret",
        "DT_ENVIRONMENT": "https://your-tenant.apps.dynatrace.com"
      }
    }
  }
}
```

### Development Version

For latest features and testing:

```json
{
  "mcpServers": {
    "dynatrace-dev": {
      "command": "npx",
      "args": ["dynatrace-mcp-server-dev"],
      "env": {
        "OAUTH_CLIENT_ID": "your-client-id",
        "OAUTH_CLIENT_SECRET": "your-client-secret",
        "DT_ENVIRONMENT": "https://your-tenant.apps.dynatrace.com"
      }
    }
  }
}
```

## Available Tools

### 🔍 Monitoring & Observability
- **`get_environment_info`** - Get Dynatrace environment details
- **`list_problems`** - List all active problems
- **`get_problem_details`** - Get detailed problem information
- **`list_vulnerabilities`** - List security vulnerabilities
- **`get_vulnerabilty_details`** - Get vulnerability details and affected entities

### 📊 Data Querying
- **`execute_dql`** - Execute Dynatrace Query Language statements
- **`verify_dql`** - Validate DQL syntax before execution
- **`get_logs_for_entity`** - Retrieve logs for specific entities
- **`get_kubernetes_events`** - Get Kubernetes cluster events

### 🏗️ Entity Management
- **`find_entity_by_name`** - Find monitored entities by name
- **`get_entity_details`** - Get detailed entity information
- **`get_ownership`** - Get ownership information for entities

### 📈 Dashboard & Reporting
- **`create_dashboard`** - Create dashboards from JSON files
- **`bulk_delete_dashboards`** - Delete multiple dashboards
- **`share_document_env`** - Share documents across environments
- **`direct_share_document`** - Share documents with specific users

### 🤖 Automation
- **`create_workflow_for_notification`** - Create notification workflows
- **`make_workflow_public`** - Make workflows publicly accessible
- **`execute_typescript`** - Execute custom TypeScript code via Function Executor

### 💬 Communication
- **`send_slack_message`** - Send messages via Slack integration

## Environment Variables

### Required
| Variable | Description | Example |
|----------|-------------|---------|
| `OAUTH_CLIENT_ID` | Dynatrace OAuth Client ID | `dt0c01.ABC123...` |
| `OAUTH_CLIENT_SECRET` | Dynatrace OAuth Client Secret | `dt0s01.DEF456...` |
| `DT_ENVIRONMENT` | Dynatrace environment URL | `https://abc12345.apps.dynatrace.com` |

### Optional
| Variable | Description | Default |
|----------|-------------|---------|
| `SLACK_CONNECTION_ID` | Slack connection ID for notifications | `fake-slack-connection-id` |
| `DT_SHARE_RECIPIENTS` | Comma-separated list of user/group IDs for document sharing | None |
| `DT_SHARE_TYPE` | Type of recipients (user/group) | `group` |
| `OAUTH_TOKEN_URL` | OAuth token endpoint | `https://sso.dynatrace.com/sso/oauth2/token` |
| `OAUTH_URN` | OAuth resource URN | Auto-detected |

### OpenTelemetry (Optional)
| Variable | Description |
|----------|-------------|
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OpenTelemetry endpoint for traces |
| `DYNATRACE_API_TOKEN` | API token for trace export |
| `DYNATRACE_LOG_INGEST_URL` | Log ingest endpoint |

## Authentication

### Required Scopes

Your OAuth client needs these scopes:

**Core Scopes:**
- `app-engine:apps:run`
- `app-engine:functions:run`

**Feature-Specific Scopes:**
- `environment-api:security-problems:read` - For vulnerability management
- `environment-api:problems:read` - For problem analysis
- `environment-api:entities:read` - For entity information
- `storage:*:read` - For DQL queries (logs, metrics, events, etc.)
- `automation:workflows:write` - For workflow creation
- `automation:workflows:read` - For workflow management
- `automation:workflows:run` - For workflow execution
- `document:documents:write` - For dashboard creation
- `document:documents:delete` - For dashboard deletion
- `document:environment-shares:write` - For document sharing
- `document:direct-shares:write` - For direct document sharing
- `app-settings:objects:read` - For Slack integration
- `settings:objects:read` - For ownership information

### Setting Up OAuth Client

1. Navigate to **Settings** → **Platform Management** → **OAuth clients**
2. Click **Create OAuth client**
3. Set **Client type** to `Public`
4. Add all required scopes from the list above
5. Save and copy the Client ID and Secret

## Advanced Usage

### Custom Dashboard Creation

Place JSON dashboard files in a `/dashboards` folder and use the `create_dashboard` tool to bulk-create them.

### TypeScript Code Execution

Execute custom logic using the Dynatrace Function Executor:

```typescript
// Example: Query and process data
export default async function({ entityId }) {
  // Your custom TypeScript code here
  return { processed: true, entityId };
}
```

### Slack Integration

Configure Slack notifications by setting up a Slack connection in Dynatrace and providing the `SLACK_CONNECTION_ID`.

## Development

### For Code Customization

If you need to modify the server code:

```bash
# Install the package for customization
npm install dynatrace-mcp-server

# Or for development version
npm install dynatrace-mcp-server-dev

# Clone and modify the source
git clone https://github.com/your-repo/dynatrace-mcp-otel.git
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
        "OAUTH_CLIENT_ID": "your-client-id",
        "OAUTH_CLIENT_SECRET": "your-client-secret",
        "DT_ENVIRONMENT": "https://your-tenant.apps.dynatrace.com"
      }
    }
  }
}
```

### Package Variants

- **`dynatrace-mcp-server`** - Production release (stable)
- **`dynatrace-mcp-server-dev`** - Development release (latest features)

## Dynatrace MCP OpenTelemetry Integration

### Observability Features

#### Log Correlation
- All logs include `dt.security_context` field set to `dynatrace_mcp_otel`
- Logs are tagged with `logType: build-logs` for filtering
- Logs are automatically correlated with traces via standard OpenTelemetry attributes

#### Known Issues
- In version 1.0.8, trace ingestion might not work correctly in all environments, but logging functionality works as expected

## Version History
- 1.0.8: Enhanced logging with security context and build-logs metadata
- 1.0.7: // ...existing version history...

## Support

- **Issues**: Report issues on GitHub
- **Documentation**: [Dynatrace Platform Documentation](https://docs.dynatrace.com)
- **MCP Protocol**: [Model Context Protocol](https://modelcontextprotocol.io)

---

**Note**: This MCP server is designed for AI assistant integration. For standalone use cases, consider using the Dynatrace CLI or API directly.