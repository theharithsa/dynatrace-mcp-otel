# 🛠️ Skills Manifest: Dynatrace MCP Server

Version: 1.0.8

This server exposes the following skills ("tools" or "capabilities") for seamless observability, dashboard management, and automation in your Dynatrace environment.

---

## Core Observability & Query

| Skill Name                     | Description                                                        |
| ------------------------------ | ------------------------------------------------------------------ |
| `list_problems`                | List all Dynatrace problems for a given entity/service/host.       |
| `get_problem_details`          | Fetch detailed info for a specific Dynatrace problem.              |
| `list_security_problems`       | List open vulnerabilities or security issues.                      |
| `get_security_problem_details` | Get details for a specific vulnerability or exposure.              |
| `run_dql_query`                | Run Dynatrace Query Language (DQL) for logs, metrics, traces, etc. |
| `get_entity_info`              | Fetch info on any monitored entity (host, service, etc).           |
| `set_entity_ownership`         | Set or update entity ownership.                                    |

---

## Automation & Notification

| Skill Name                     | Description                                          |
| ------------------------------ | ---------------------------------------------------- |
| `send_slack_message`           | Send a Slack message via Dynatrace Slack Connector.  |
| `create_notification_workflow` | Set up a notification workflow via AutomationEngine. |

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

## OpenTelemetry Integration

The Dynatrace MCP Server includes advanced OpenTelemetry integration features:

### Features
- Automatic trace correlation with logs
- Enhanced logging with security context (`dt.security_context: dynatrace_mcp_otel`)
- Build logs metadata (`logType: build-logs`) for improved filtering
- GitHub Actions integration for CI/CD observability

### Latest Updates (v1.0.8)
- **Added**: Enhanced logging with `dt.security_context` field for proper isolation
- **Added**: `logType: build-logs` metadata for all log entries
- **Fixed**: Improved error handling for OpenTelemetry trace sending
- **Known Issue**: Trace ingestion not fully functional in all environments, but logging works correctly

### Configuration
OpenTelemetry integration requires these environment variables:
- `OTEL_EXPORTER_OTLP_ENDPOINT`: Your Dynatrace OTLP endpoint
- `DYNATRACE_API_TOKEN`: API token with appropriate permissions
- `DYNATRACE_LOG_INGEST_URL`: Log ingest API endpoint

---

## Tracing, Logging, & Error Handling

All skills are:

* Fully instrumented with **OpenTelemetry** tracing.
* Log every action, result, and error for maximum observability.
* Designed for composability—skills are atomic, can be chained in your agent, and return clear results.
* Enhanced with security context tagging for proper isolation
* Protected by least privilege token permissions

---

## Example Workflows

* **Create All Dashboards:**
  Use `create_dashboard` to deploy every dashboard JSON in `/dashboards`.

* **Delete Multiple Dashboards:**
  Use `bulk_delete_dashboards` with an array of document IDs.

* **Share a Dashboard:**
  Use `share_document_env` (environment) or `direct_share_document` (specific recipients) after creation.

* **Remove Shares:**
  Use `delete_direct_share` for cleanup.

---

## Environment Variables

### For Sharing
- `DT_SHARE_RECIPIENTS` — Comma-separated list of user or group IDs (for direct sharing).
- `DT_SHARE_TYPE` — `user` or `group`.

### For OpenTelemetry
- `OTEL_EXPORTER_OTLP_ENDPOINT` — Your Dynatrace OTLP endpoint
- `DYNATRACE_API_TOKEN` — API token with appropriate permissions
- `DYNATRACE_LOG_INGEST_URL` — Log ingest API endpoint

---

## Requirements
- Node.js 14+
- Dynatrace environment with API token access
- OpenTelemetry collector endpoint (for tracing functionality)

---

> **Note:**
> All skills are ready to use via your IDE, agent, or automation pipeline.
> For custom orchestrations, just chain skills as needed!
> Version 1.0.8 enhances observability with security context tagging and build logs metadata.
> For custom orchestrations, just chain skills as needed!
