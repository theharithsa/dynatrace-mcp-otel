# `CHANGELOG.md`

## 2025-07-25

### 🚀 **Major Features & Skills Added**

* **Multi-Dashboard Creation Skill**

  * Added a batch dashboard creation tool that automatically creates dashboards from every JSON file in the `/dashboards` folder, logs each operation, and returns a summary (success/failure per dashboard).

* **Bulk Dashboard Deletion Skill**

  * Implemented a tool to bulk delete dashboards/documents by IDs using the SDK, with full OpenTelemetry tracing and error logging.

* **Document Sharing Skills**

  * **Environment Share:**

    * Added a skill to share a dashboard document with all users in the environment using `environmentSharesClient`, with access level selection.
  * **Direct Share:**

    * Added a skill to direct-share a document with specific users/groups, reading recipient IDs from environment variables for automation.

* **Robust Error Handling & Logging**

  * All skills/tools now include structured error logging, capturing actual API response details, avoiding circular references, and making troubleshooting seamless.

* **OpenTelemetry Tracing Everywhere**

  * Every new skill/tool is fully instrumented for span context, trace IDs, and parent/child relationships—making observability clean and consistent.

### 🛠 **Other Notable Improvements**

* **Resilient Bulk Operations:**

  * Batch dashboard creation continues even if some dashboards fail; errors are logged and shown in the summary.

* **Environment Variable Usage:**

  * Recipients for direct shares, as well as sensitive OAuth client secrets and environment URLs, are now handled via env vars for security and flexibility.

* **SDK-First Approach with Graceful Fallbacks:**

  * Where SDK limitations exist, raw API calls are used with full tracing/logging, ensuring workflow reliability.

---

## Unreleased Changes

### Added

* Slack integration for automated reporting and notifications to team channels
* Comprehensive bug analysis and reporting with customizable channel targeting
* Security vulnerability assessment with automated Slack reporting
* Environment health check monitoring with 7-day resource utilization analysis
* Service health monitoring and root cause analysis for dynatrace-mcp-server
* Automated prompt-based analysis capabilities for code review, security scanning, and performance monitoring
* Real-time Slack message formatting with visual appeal and structured reporting
* Direct dashboard links integration in Slack reports with environment-specific URLs
* Timestamp and analyst attribution in report footers
* Customizable Slack channel names for different team workflows
* Multi-channel reporting support (#team-bugs, #team-security, #team-ops, #team-service-health)
* Automated NPM publishing via GitHub Actions
* Version change detection for conditional deployment
* NPM package configuration with proper metadata
* GitHub Release creation on successful NPM publish
* Comprehensive .npmignore for clean package distribution
* Dual-package publishing strategy for dev and production releases
* Dev branch publishes as `dynatrace-mcp-server-dev` on PR events and direct pushes
* Main branch publishes as `dynatrace-mcp-server` ONLY when PR is merged (not on direct push)
* Dynamic package naming based on target branch
* Branch-specific release tagging and GitHub releases
* PR merge detection for production releases

### Changed

* Enhanced MCP server capabilities to support multi-channel Slack reporting
* Improved analysis workflows with automated execution and comprehensive reporting
* Updated documentation to clarify Slack channel requirements and customization options
* Updated README.md with NPM installation instructions
* Enhanced package.json with publishing scripts and metadata
* Enhanced GitHub workflow with branch-specific publishing logic
* Updated workflow to handle different publishing rules per branch
* Improved debugging output for publish decisions
* Enhanced GitHub workflow with strict PR merge requirements for main branch
* Updated workflow to prevent direct push publishing to main branch
* Dev branch allows both PR and push publishing

