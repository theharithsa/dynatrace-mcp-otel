# 🛠️ Skills Manifest: Dynatrace MCP Server

Version: 2.1.0

This server exposes the following skills ("tools" or "capabilities") for seamless observability, dashboard management, automation, and AI-powered assistance in your Dynatrace environment.

---

## 🤖 Davis CoPilot AI Integration (NEW!)

| Skill Name                          | Description                                                        |
| ----------------------------------- | ------------------------------------------------------------------ |
| `generate_dql_from_natural_language` | **Convert natural language to DQL** using Davis CoPilot AI. Transform plain English requests into powerful Dynatrace Query Language statements. |
| `explain_dql_in_natural_language`    | **Explain DQL in plain English** using Davis CoPilot AI. Get clear, human-readable explanations of complex DQL queries. |
| `chat_with_davis_copilot`            | **AI-powered Dynatrace assistant** for questions, troubleshooting, and guidance. Use when no specific tool covers your need. |

---

## Core Observability & Query

| Skill Name                     | Description                                                        |
| ------------------------------ | ------------------------------------------------------------------ |
| `list_problems`                | List all Dynatrace problems for a given entity/service/host.       |
| `get_problem_details`          | Fetch detailed info for a specific Dynatrace problem.              |
| `list_security_problems`       | List open vulnerabilities or security issues.                      |
| `get_security_problem_details` | Get details for a specific vulnerability or exposure.              |
| `run_dql_query`                | Run Dynatrace Query Language (DQL) for logs, metrics, traces, etc. |
| `verify_dql`                   | **Validate DQL syntax** before execution to ensure query correctness. |
| `get_entity_info`              | Fetch info on any monitored entity (host, service, etc).           |
| `set_entity_ownership`         | Set or update entity ownership.                                    |

---

## Automation & Notification

| Skill Name                     | Description                                          |
| ------------------------------ | ---------------------------------------------------- |
| `send_slack_message`           | Send a Slack message via Dynatrace Slack Connector.  |
| `create_notification_workflow` | Set up a notification workflow via AutomationEngine. |
| `execute_typescript`           | **Execute custom TypeScript code** via Dynatrace Function Executor for advanced automation. |

---

## Dashboard & Document Management

| Skill Name               | Description                                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------------- |
| `create_dashboard`       | **Bulk-create dashboards** from all JSON files in the `/dashboards/` folder.                      |
| `bulk_delete_dashboards` | **Bulk delete dashboards/documents** by providing one or more document IDs.                       |
| `share_document_env`     | **Share a dashboard/document** with all users in the environment (environment-wide share).        |
| `direct_share_document`  | **Direct-share a dashboard/document** with specific users/groups. Recipients are set in env vars. |
| `delete_direct_share`    | **Delete a direct share** by its share ID.                                                        |

---

## AI-Powered Workflow (Recommended)

### 🔄 The Complete DQL Workflow

For the best experience with data querying, follow this AI-powered workflow:

1. **🤖 Generate**: Use `generate_dql_from_natural_language` to convert your question into DQL
2. **✅ Verify**: Use `verify_dql` to validate the generated query syntax  
3. **🚀 Execute**: Use `run_dql_query` to run the validated DQL statement
4. **📝 Understand**: Use `explain_dql_in_natural_language` to understand complex results
5. **🔄 Iterate**: Refine your natural language request and repeat as needed

### 🆘 When in Doubt

Use `chat_with_davis_copilot` for:

- General Dynatrace questions
- Troubleshooting guidance  
- Best practice recommendations
- When no specific tool covers your need

---

## OpenTelemetry Integration

The Dynatrace MCP Server includes advanced OpenTelemetry integration features:

### Features

- Automatic trace correlation with logs
- Enhanced logging with security context (`dt.security_context: dynatrace_mcp_otel`)
- Build logs metadata (`logType: build-logs`) for improved filtering
- GitHub Actions integration for CI/CD observability
- **NEW**: Davis CoPilot interactions are fully traced and logged

### Latest Updates (v2.1.0)

- **Added**: Davis CoPilot AI integration with three new powerful tools
- **Added**: Natural language to DQL conversion capabilities
- **Added**: DQL explanation in plain English
- **Added**: AI-powered troubleshooting assistant
- **Enhanced**: Tool discovery and workflow guidance
- **Enhanced**: Comprehensive error handling for AI interactions

### Configuration

OpenTelemetry integration requires these environment variables:

- `OTEL_EXPORTER_OTLP_ENDPOINT`: Your Dynatrace OTLP endpoint
- `DYNATRACE_API_TOKEN`: API token with appropriate permissions
- `DYNATRACE_LOG_INGEST_URL`: Log ingest API endpoint
- `DT_PLATFORM_TOKEN`: **NEW** - Required for Davis CoPilot features

---

## Tracing, Logging, & Error Handling

All skills are:

* Fully instrumented with **OpenTelemetry** tracing.
* Log every action, result, and error for maximum observability.
* Designed for composability—skills are atomic, can be chained in your agent, and return clear results.
* Enhanced with security context tagging for proper isolation
* Protected by least privilege token permissions
* **NEW**: AI interactions include comprehensive metadata and error context

---

## Example Workflows

### 🤖 AI-Powered Query Generation

1. **Ask in Natural Language:** "Show me all HTTP 500 errors in the payment service from the last hour"
2. **Generate DQL:** Use `generate_dql_from_natural_language`
3. **Verify Query:** Use `verify_dql` to ensure syntax is correct
4. **Execute Query:** Use `run_dql_query` to get results
5. **Understand Results:** Use `explain_dql_in_natural_language` if needed

### 📊 Dashboard Management

* **Create All Dashboards:**
  Use `create_dashboard` to deploy every dashboard JSON in `/dashboards`.

* **Delete Multiple Dashboards:**
  Use `bulk_delete_dashboards` with an array of document IDs.

* **Share a Dashboard:**
  Use `share_document_env` (environment) or `direct_share_document` (specific recipients) after creation.

### 🤖 AI Troubleshooting

* **Get Help:** Use `chat_with_davis_copilot` for any Dynatrace-related question
* **Understand Queries:** Use `explain_dql_in_natural_language` for complex DQL statements
* **Generate Queries:** Use `generate_dql_from_natural_language` for data exploration

---

## Environment Variables

### For Davis CoPilot (NEW!)

- `DT_PLATFORM_TOKEN` — Platform API token with Davis CoPilot scopes.

### For Sharing

- `DT_SHARE_RECIPIENTS` — Comma-separated list of user or group IDs (for direct sharing).
- `DT_SHARE_TYPE` — `user` or `group`.

### For OpenTelemetry

- `OTEL_EXPORTER_OTLP_ENDPOINT` — Your Dynatrace OTLP endpoint
- `DYNATRACE_API_TOKEN` — API token with appropriate permissions
- `DYNATRACE_LOG_INGEST_URL` — Log ingest API endpoint

---

## Requirements

- Node.js 18+
- Dynatrace environment with API token access
- OpenTelemetry collector endpoint (for tracing functionality)
- **NEW**: Platform API token for Davis CoPilot features

---

## Required OAuth Scopes

### Core Scopes

- `app-engine:apps:run`
- `app-engine:functions:run`

### Davis CoPilot Scopes (NEW!)

- `davis-copilot:nl2dql:execute`
- `davis-copilot:dql2nl:execute` 
- `davis-copilot:conversations:execute`

### Additional Feature Scopes

- `environment-api:*:read` — For monitoring data
- `storage:*:read` — For DQL queries
- `automation:workflows:*` — For workflow management
- `document:*:*` — For dashboard management

---

> **Note:**
> All skills are ready to use via your IDE, agent, or automation pipeline.
> Version 2.1.0 introduces powerful AI capabilities with Davis CoPilot integration!
> For optimal experience, follow the recommended AI-powered workflows above.
