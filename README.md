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

### Core Required Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `OAUTH_CLIENT_ID` | Dynatrace OAuth Client ID | `dt0s02.ABC123...` | ✅ |
| `OAUTH_CLIENT_SECRET` | Dynatrace OAuth Client Secret | `dt0s02.ABC123.DEF456...` | ✅ |
| `DT_ENVIRONMENT` | Dynatrace environment URL (Platform API) | `https://abc12345.apps.dynatrace.com` | ✅ |

### OAuth Configuration (Optional)

| Variable | Description | Default |
|----------|-------------|---------|
| `OAUTH_TOKEN_URL` | OAuth token endpoint | `https://sso.dynatrace.com/sso/oauth2/token` |
| `OAUTH_URN` | OAuth resource URN | `urn:dtaccount:<your-account-urn-guid>` |

### OpenTelemetry Tracing (Optional)

| Variable | Description | Example |
|----------|-------------|---------|
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OTLP endpoint for traces | `https://abc12345.live.dynatrace.com/api/v2/otlp/v1/traces` |
| `DYNATRACE_API_TOKEN` | API token for trace/log export | `dt0c01.ABC123...` |
| `DYNATRACE_LOG_INGEST_URL` | Log ingest endpoint | `https://abc12345.live.dynatrace.com/api/v2/logs/ingest` |
| `OTEL_RESOURCE_ATTRIBUTES` | OpenTelemetry resource attributes | `service.name=dynatrace-mcp-server,service.version=2.0.0` |

### Slack Integration (Optional)

| Variable | Description | Default |
|----------|-------------|---------|
| `SLACK_CONNECTION_ID` | Slack connection ID from Dynatrace | None |

### Document Sharing (Optional)

| Variable | Description | Default |
|----------|-------------|---------|
| `DT_SHARE_RECIPIENTS` | Comma-separated list of user/group IDs | None |
| `DT_SHARE_TYPE` | Type of recipients (user/group) | `group` |

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

- 2.0.0: Updated package structure and naming; enhanced configuration options
- 1.0.8: Switched to standard OpenTelemetry GitHub Action; enhanced logging with security context
- 1.0.7: // ...existing version history...

## Support

- **Issues**: Report issues on [GitHub](https://github.com/theharithsa/dynatrace-mcp-otel/issues)
- **Documentation**: [Dynatrace Platform Documentation](https://docs.dynatrace.com)
- **MCP Protocol**: [Model Context Protocol](https://modelcontextprotocol.io)

---

**Note**: This MCP server is designed for AI assistant integration. For standalone use cases, consider using the Dynatrace CLI or API directly.
