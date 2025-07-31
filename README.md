# Dynatrace MCP Server

This remote MCP server allows interaction with the [Dynatrace](https://www.dynatrace.com/) observability platform.
Bring real-time observability data directly into your development workflow.

<img width="1046" alt="image" src="/assets/dynatrace-mcp-arch.png" />

## Use cases

- Real-time observability, fetch production-level data for early detection.
- Fix issues in the context from monitored exceptions, logs, and anomalies.
- More context on security level issues
- Natural language to query log data
- For more skills manifest, visit [here](./SkillManifest.md)

## Capabilities

- List and get [problem](https://www.dynatrace.com/hub/detail/problems/) details from your services (for example Kubernetes)
- List and get security problems / [vulnerability](https://www.dynatrace.com/hub/detail/vulnerabilities/) details
- Execute DQL (Dynatrace Query Language) and retrieve logs, events, spans and metrics
- Send Slack messages (via Slack Connector)
- Set up notification Workflow (via Dynatrace [AutomationEngine](https://docs.dynatrace.com/docs/discover-dynatrace/platform/automationengine))
- Get more information about a monitored entity
- Get Ownership of an entity
- Bulk create dashboards from all JSON files in your /dashboards folder (auto-names each dashboard).
- Bulk delete dashboards/documents by passing an array of document IDs.
- Share dashboards/documents environment-wide (all users in the Dynatrace environment).
- Direct-share dashboards/documents with specific users or groups (recipients and type from environment variables).
- Delete direct shares by their share ID.
- Full OpenTelemetry tracing and detailed logging for all dashboard/document operations.
- Keep an eye on [CHANGELOG.md](./CHANGELOG.md), more updates to come. 

## Quickstart

**Work in progress**

You can add this MCP server (using STDIO) to your MCP Client like VS Code, Claude, Cursor, Amazon Q Developer CLI, Windsurf Github Copilot via the package `@dynatrace-oss/dynatrace-mcp-server`.

We recommend to always set it up for your current workspace instead of using it globally.

**VS Code**

```json
{
  "servers": {
    "npx-dynatrace-mcp-server": {
      "command": "npx",
      "cwd": "${workspaceFolder}",
      "args": ["-y", "@dynatrace-oss/dynatrace-mcp-server@latest"],
      "envFile": "${workspaceFolder}/.env"
    }
  }
}
```

Please note: In this config, [the `${workspaceFolder}` variable](https://code.visualstudio.com/docs/reference/variables-reference#_predefined-variables) is used.
This only works if the config is stored in the current workspaces, e.g., `<your-repo>/.vscode/mcp.json`. Alternatively, this can also be stored in user-settings, and you can define `env` as follows:

```json
{
  "servers": {
    "npx-dynatrace-mcp-server": {
      "command": "npx",
      "args": ["-y", "@dynatrace-oss/dynatrace-mcp-server@latest"],
      "env": {
        "OAUTH_CLIENT_ID": "",
        "OAUTH_CLIENT_SECRET": "",
        "DT_ENVIRONMENT": ""
      }
    }
  }
}
```

**Claude Desktop**

```json
{
  "mcpServers": {
    "mobile-mcp": {
      "command": "npx",
      "args": ["-y", "@dynatrace-oss/dynatrace-mcp-server@latest"],
      "env": {
        "OAUTH_CLIENT_ID": "",
        "OAUTH_CLIENT_SECRET": "",
        "DT_ENVIRONMENT": ""
      }
    }
  }
}
```

**Amazon Q Developer CLI**

The [Amazon Q Developer CLI](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/command-line-mcp-configuration.html) provides an interactive chat experience directly in your terminal. You can ask questions, get help with AWS services, troubleshoot issues, and generate code snippets without leaving your command line environment.

```json
{
  "mcpServers": {
    "mobile-mcp": {
      "command": "npx",
      "args": ["-y", "@dynatrace-oss/dynatrace-mcp-server@latest"],
      "env": {
        "OAUTH_CLIENT_ID": "",
        "OAUTH_CLIENT_SECRET": "",
        "DT_ENVIRONMENT": ""
      }
    }
  }
}
```

This configuration should be stored in `<your-repo>/.amazonq/mcp.json`.

## Environment Variables

A **Dynatrace OAuth Client** is needed to communicate with your Dynatrace Environment. Please follow the documentation about
[creating an Oauth Client in Dynatrace](https://docs.dynatrace.com/docs/manage/identity-access-management/access-tokens-and-oauth-clients/oauth-clients),
and set up the following environment variables in order for this MCP to work:

- `DT_ENVIRONMENT` (string, e.g., https://abc12345.apps.dynatrace.com) - URL to your Dynatrace Platform (do not use Dynatrace classic URLs like `abc12345.live.dynatrace.com`)
- `OAUTH_CLIENT_ID` (string, e.g., `dt0s02.SAMPLE`) - Dynatrace OAuth Client ID
- `OAUTH_CLIENT_SECRET` (string, e.g., `dt0s02.SAMPLE.abcd1234`) - Dynatrace OAuth Client Secret
- OAuth Client Scopes:
  - `app-engine:apps:run` - needed for environmentInformationClient
  - `app-engine:functions:run` - needed for environmentInformationClient
  - `hub:catalog:read` - get details about installed Apps on Dynatrace Environment
  - `environment-api:security-problems:read` - needed for reading security problems
  - `environment-api:entities:read` - read monitored entities
  - `environment-api:problems:read` - get problems
  - `environment-api:metrics:read` - read metrics
  - `environment-api:slo:read` - read SLOs
  - `storage:buckets:read` - Read all system data stored on Grail
  - `storage:logs:read` - Read logs for reliability guardian validations
  - `storage:metrics:read` - Read metrics for reliability guardian validations
  - `storage:bizevents:read` - Read bizevents for reliability guardian validations
  - `storage:spans:read` - Read spans from Grail
  - `storage:entities:read` - Read Entities from Grail
  - `storage:events:read` - Read Events from Grail
  - `storage:security.events:read`- Read Security Events from Grail
  - `storage:system:read` - Read System Data from Grail
  - `storage:user.events:read` - Read User events from Grail
  - `storage:user.sessions:read` - Read User sessions from Grail
  - `settings:objects:read` - needed for reading ownership information and Guardians (SRG) from settings

    **Note**: Please ensure that `settings:objects:read` is used, and _not_ the similarly named scope `app-settings:objects:read`.

In addition, depending on the features you use, the following variables can be configured:

- `SLACK_CONNECTION_ID` (string, optional) - Slack Connection ID from Dynatrace Slack App configuration. Required for `send_slack_message` functionality.

### Slack Integration Setup

To use the `send_slack_message` functionality, you need to:

1. **Install Slack App in Dynatrace:**
   - Go to your Dynatrace environment
   - Navigate to **Apps** → **Slack** (or search for "Slack" in the Hub)
   - Install and configure the Slack connector

2. **Create Slack Connection:**
   - Set up a connection with your Slack workspace
   - Copy the connection ID from the Slack connector settings
   - Add the connection ID to your `.env` file as `SLACK_CONNECTION_ID`

3. **Required OAuth Scope:**
   - `app-settings:objects:read` - needed for accessing Slack connection settings

## Troubleshooting

### Authentication Issues

In most cases, something is wrong with the OAuth Client. Please ensure that you have added all scopes as requested above.
In addition, please ensure that your user also has all necessary permissions on your Dynatrace Environment.

In case of any problems, you can troubleshoot SSO/OAuth issues based on our [Dynatrace Developer Documentation](https://developer.dynatrace.com/develop/access-platform-apis-from-outside/#get-bearer-token-and-call-app-function) and providing the list of scopes.

It is recommended to try access the following API (which requires minimal scopes `app-engine:apps:run` and `app-engine:functions:run`):

1. Use OAuth Client ID and Secret to retrieve a Bearer Token (only valid for a couple of minutes):

```bash
curl --request POST 'https://sso.dynatrace.com/sso/oauth2/token' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'grant_type=client_credentials' \
  --data-urlencode 'client_id={your-client-id}' \
  --data-urlencode 'client_secret={your-client-secret}' \
  --data-urlencode 'scope=app-engine:apps:run app-engine:functions:run'
```

2. Use `access_token` from the response of the above call as the bearer-token in the next call:

```bash
curl -X GET https://abc12345.apps.dynatrace.com/platform/management/v1/environment \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer {your-bearer-token}'
```

3. You should retrieve a result like this:

```json
{
  "environmentId": "abc12345",
  "createTime": "2023-01-01T00:10:57.123Z",
  "blockTime": "2025-12-07T00:00:00Z",
  "state": "ACTIVE"
}
```

### Problem accessing data on Grail

Grail has a dedicated section about permissions in the Dynatrace Docs. Please refer to https://docs.dynatrace.com/docs/discover-dynatrace/platform/grail/data-model/assign-permissions-in-grail for more details.

## Development

For local development purposes, you can use VSCode and GitHub Copilot.

First, enable Copilot for your Workspace `.vscode/settings.json`:

```json
{
  "github.copilot.enable": {
    "*": true
  }
}
```

Second, add the MCP to `.vscode/mcp.json`:

```json
{
  "servers": {
    "my-dynatrace-mcp-server": {
      "command": "node",
      "args": ["${workspaceFolder}/dist/index.js"],
      "envFile": "${workspaceFolder}/.env"
    }
  }
}
```

Third, create a `.env` file in this repository (you can copy from `.env.template`) and configure environment variables as [described above](#environment-variables).

Last but not least, switch to Agent Mode in CoPilot and reload tools.

## Installation

### From NPM (Recommended)

```bash
npm install -g dynatrace-mcp-server
```

### From Source

```bash
git clone https://github.com/your-username/dynatrace-mcp-otel.git
cd dynatrace-mcp-otel
npm install
npm run build
npm start
```

## Usage

After installation, you can start the server:

```bash
# If installed globally
dynatrace-mcp-server

# If running from source
npm start
```

## Publishing

This package is automatically published to NPM when:
1. Changes are pushed to the main branch
2. The version in `package.json` is incremented

To publish a new version:
1. Update the version in `package.json`:
   ```bash
   npm version patch  # for bug fixes
   npm version minor  # for new features
   npm version major  # for breaking changes
   ```
2. Push to main branch:
   ```bash
   git push origin main --tags
   ```

The GitHub Action will automatically build, test, and publish to NPM.

## Added Changes
### 🆕 **Dashboard & Document Management**

This MCP server now lets you **manage dashboards/documents directly from your agent, IDE, or automation workflow**.

#### **New Capabilities:**

* **Batch Dashboard Creation**

  * Automatically create Dynatrace dashboards for every JSON file in your `/dashboards` folder.
  * Each dashboard name is auto-extracted from the JSON.
  * Errors are logged; summary shows all results (success/failure per file).

* **Bulk Dashboard/Document Deletion**

  * Delete multiple dashboards/documents at once using the `bulk_delete_dashboards` tool.

* **Document Sharing**

  * **Environment-wide Share:** Share a document with all users in the environment (`share_document_env`).
  * **Direct Share:** Share a document directly with one or more users/groups. Recipient IDs and types are configurable via environment variables for automation.

* **Direct Share Deletion**

  * Delete a direct share by ID with full OTEL tracing.

* **Comprehensive Tracing & Logging**

  * All operations (create, delete, share) are fully traced via OpenTelemetry and logged for observability.

---

### **Usage Examples**

**Batch Create All Dashboards:**

```bash
# Will create dashboards for every .json file in /dashboards
create_dashboard
```

**Bulk Delete Dashboards:**

```json
# Tool input (in Copilot/Agent)
{
  "tool": "bulk_delete_dashboards",
  "args": { "documentIds": ["docId1", "docId2", "..."] }
}
```

**Share Dashboard with Environment:**

```json
{
  "tool": "share_document_env",
  "args": { "documentId": "<your-dashboard-id>", "access": "read" }
}
```

**Direct Share Dashboard:**

* Set environment variables:

  ```
  DT_SHARE_RECIPIENTS=comma,separated,ids
  DT_SHARE_TYPE=group  # or "user"
  ```
* Then call:

  ```json
  {
    "tool": "direct_share_document",
    "args": { "documentId": "<your-dashboard-id>", "access": "read" }
  }
  ```

**Delete Direct Share:**

```json
{
  "tool": "delete_direct_share",
  "args": { "shareId": "<your-direct-share-id>" }
}
```

---

### **Environment Variables for Document Sharing**

* `DT_SHARE_RECIPIENTS` — Comma-separated user or group IDs for direct share
* `DT_SHARE_TYPE` — Either `group` or `user`

---

### **Changelog (Major Additions)**

* **\[2025-07-25]**

  * Batch dashboard creation from folder
  * Bulk dashboard/document deletion
  * Environment and direct document sharing
  * Direct share deletion
  * Enhanced OpenTelemetry tracing and error logging everywhere

---

### **Quickstart (Extended)**

You can use these new skills/capabilities via any MCP-compatible IDE/agent/chat:

* **Create dashboards in bulk:**
  Run the `create_dashboard` skill—auto-discovers all JSON files and creates dashboards.
* **Delete dashboards in bulk:**
  Pass one or more document IDs to the `bulk_delete_dashboards` tool.
* **Share dashboards after creation:**
  Pass the document ID to either `share_document_env` or `direct_share_document`.

---

### **Pro Tip**

Combine these skills for full dashboard lifecycle automation. For example:

1. Create dashboards from `/dashboards`.
2. Share each dashboard with your team (or groups) right after creation.
3. Clean up with bulk delete when needed.

## Features

- **Dynatrace Integration**: Seamless connection to Dynatrace environments
- **MCP Protocol Support**: Full Model-Context-Protocol server implementation
- **OAuth Authentication**: Secure authentication using Dynatrace OAuth clients
- **Slack Integration**: Automated reporting and notifications to designated Slack channels
- **Automated Analysis**: Comprehensive code analysis, security scanning, and health monitoring
- **Multi-Channel Reporting**: Organized reporting across different team channels (#team-bugs, #team-security, #team-ops, #team-service-health)

## Slack Integration

The MCP server now supports automated Slack reporting for various analysis and monitoring tasks:

### Supported Channels
- `#team-bugs`: Bug analysis and code quality reports
- `#team-security`: Security vulnerability assessments  
- `#team-ops`: Environment health checks and resource monitoring
- `#team-service-health`: Service performance analysis and root cause investigations

> **Important**: These Slack channels must already exist in your workspace for the integration to work. If your team uses different channel names, you can modify the channel names in the prompt when requesting analysis (e.g., change `#team-bugs` to `#dev-issues` or any other existing channel name in your workspace).

### Analysis Capabilities
- **Bug Analysis**: Automated code review with line-by-line bug identification and severity assessment
- **Security Scanning**: Comprehensive vulnerability detection with remediation recommendations
- **Health Monitoring**: CPU, memory, and disk usage analysis across all hosts (7-day analysis)
- **Service Monitoring**: Performance tracking, response time analysis, and failure rate monitoring for dynatrace-mcp-server

### Report Features
- Visual formatting with proper Slack markdown
- Direct links to Dynatrace dashboards and environments
- Severity classifications (Critical, High, Medium, Low)
- Timestamp attribution and analyst identification
- Actionable remediation steps and recommendations

### Channel Customization
When using the analysis prompts, you can specify different channel names that exist in your Slack workspace. Simply replace the default channel names (e.g., `#team-bugs`, `#team-security`) with your preferred channels in the prompt text.

## Required Scopes

The following Dynatrace OAuth scopes are required for full functionality:

- `app-engine:apps:run` - For application execution
- `environment-api:entities:read` - For entity data access
- `environment-api:metrics:read` - For metrics data access
- `environment-api:problems:read` - For problem analysis
- `environment-api:events:read` - For event data access
- `environment-api:logs:read` - For log analysis
- `settings:objects:read` - For configuration access
- `DataExport` - For data export capabilities
- `InstallerDownload` - For installer access
- `storage:events:read` - For event storage access
- `storage:metrics:read` - For metrics storage access
- `storage:logs:read` - For log storage access
- `storage:bizevents:read` - For business events access

> **Note**: Slack integration requires additional configuration of Slack webhook URLs or bot tokens for posting to channels. All referenced Slack channels must exist in your workspace before using the automated reporting features.