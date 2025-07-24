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

## **How to Use the New Capabilities**

* **Create All Dashboards:**
  Run the `create_dashboard` tool—will process all `.json` files in `/dashboards` folder.
* **Bulk Delete:**
  Use the `bulk_delete_dashboards` tool, passing an array of document IDs.
* **Share a Dashboard:**

  * For environment-wide sharing, use the `share_document_env` tool.
  * For direct user/group sharing, use the `direct_share_document` tool (recipients set via env).
* **Trace & Log Everything:**
  All tools are now OTEL traced and send results and errors to Dynatrace logging.

