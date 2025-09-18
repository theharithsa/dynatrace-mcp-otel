#!/usr/bin/env node
import { config } from 'dotenv';
config();

import { trace, context, SpanStatusCode, SpanKind } from '@opentelemetry/api';
import { EnvironmentInformationClient } from '@dynatrace-sdk/client-platform-management-service';
import { ClientRequestError, isClientRequestError } from '@dynatrace-sdk/shared-errors';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { Command } from 'commander';

import { z, ZodRawShape, ZodTypeAny } from 'zod';
import { version as VERSION } from '../package.json';
import { sendToDynatraceLog } from './logging';
import { createOAuthClient, createDtHttpClient } from './authentication/dynatrace-clients';
import { listVulnerabilities } from './capabilities/list-vulnerabilities';
import { listProblems } from './capabilities/list-problems';

import { getMonitoredEntityDetails } from './capabilities/get-monitored-entity-details';
import { getOwnershipInformation } from './capabilities/get-ownership-information';

import { getEventsForCluster } from './capabilities/get-events-for-cluster';
import { createWorkflowForProblemNotification } from './capabilities/create-workflow-for-problem-notification';
import { updateWorkflow } from './capabilities/update-workflow';

import { executeDql, verifyDqlStatement } from './capabilities/execute-dql';
import { sendSlackMessage } from './capabilities/send-slack-message';
import { sendEmail } from './capabilities/send-email';
import { findMonitoredEntityByName } from './capabilities/find-monitored-entity-by-name';
import {
  chatWithDavisCopilot,
  explainDqlInNaturalLanguage,
  generateDqlFromNaturalLanguage,
} from './capabilities/davis-copilot';
import { DynatraceEnv, getDynatraceEnv } from './getDynatraceEnv';
import {
  getGrailBudgetTracker,
  resetGrailBudgetTracker,
  addBytesScanned,
  getBudgetWarning,
  getBudgetStatus,
} from './utils/grail-budget-tracker';
import { createTelemetry, Telemetry } from './utils/telemetry-openkit';

// Adding New Tools
import { createDashboard } from './capabilities/create-dashboard';
import { shareDocumentWithEnv } from './capabilities/share_document_env';
import { directShareDocument } from './capabilities/direct_share_document';
import { addEntityTags } from './capabilities/add-entity-tags';
import { bulkDeleteDashboards } from './capabilities/bulk-delete-documents.js';
import { executeTypescript } from './capabilities/execute-typescript';

import fs from 'fs/promises';
import path from 'path';

let scopesBase = ['app-engine:apps:run', 'app-engine:functions:run'];

const tracer = trace.getTracer('dynatrace-mcp-server', VERSION);

const main = async () => {
  let dynatraceEnv: DynatraceEnv;
  try {
    dynatraceEnv = getDynatraceEnv();
  } catch (err) {
    process.exit(1);
  }

  const {
    oauthClient,
    oauthClientSecret,
    dtEnvironment,
    dtPlatformEnvironment,
    slackConnectionId,
    dtPlatformToken,
    grailBudgetGB,
    mcpTelemetryEndpointUrl,
    mcpTelemetryApplicationId,
    mcpTelemetryDeviceId,
    mcpDisableTelemetry,
  } = dynatraceEnv;

  // Helper function to create DT client with preferred Platform Token authentication
  async function createDtClient(additionalScopes: string[] = []) {
    const allScopes = scopesBase.concat(additionalScopes);
    return createDtHttpClient(dtEnvironment, allScopes, oauthClient, oauthClientSecret, dtPlatformToken);
  }

  // Helper function to create OAuth client with specific scopes (uses Platform environment)
  async function createDtOAuthClient(additionalScopes: string[] = []) {
    if (oauthClient && oauthClientSecret) {
      return createOAuthClient(
        oauthClient,
        oauthClientSecret,
        dtPlatformEnvironment,
        scopesBase.concat(additionalScopes),
      );
    } else {
      throw new Error('OAuth credentials required for this operation');
    }
  }

  // Initialize telemetry
  const telemetry = createTelemetry(
    mcpTelemetryEndpointUrl,
    mcpTelemetryApplicationId,
    mcpTelemetryDeviceId,
    mcpDisableTelemetry,
  );
  await telemetry.trackMcpServerStart();

  console.error(`Starting Dynatrace MCP Server v${VERSION}...`);

  const server = new McpServer(
    {
      name: 'Dynatrace MCP Server',
      version: VERSION,
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  const tool = (
    name: string,
    description: string,
    paramsSchema: ZodRawShape,
    cb: (args: z.infer<z.ZodObject<ZodRawShape>>, _extra?: any) => Promise<string>,
  ) => {
    server.tool(name, description, paramsSchema, async (args, _extra) => {
      return await tracer.startActiveSpan(
        `Tool.${name}`,
        {
          kind: SpanKind.SERVER,
          attributes: {
            'Tool.name': name,
            'Tool.args': JSON.stringify(args),
          },
        },
        async (span) => {
          // Track start time for telemetry
          const startTime = Date.now();
          let toolCallSuccessful = false;

          try {
            const result = await context.with(trace.setSpan(context.active(), span), async () => {
              return await cb(args, _extra);
            });

            toolCallSuccessful = true;
            span.setStatus({ code: SpanStatusCode.OK });
            span.setAttributes({
              'mcp.tool.result.length': result.length,
              'mcp.tool.success': true,
            });

            return {
              content: [
                {
                  type: 'text',
                  text: result,
                } as {
                  [x: string]: unknown;
                  type: 'text';
                  text: string;
                },
              ],
            };
          } catch (error: any) {
            // Track error for telemetry
            telemetry.trackError(error, `tool_${name}`).catch((e) => console.warn('Failed to track error:', e));

            span.recordException(error);
            span.setStatus({
              code: SpanStatusCode.ERROR,
              message: error.message,
            });
            span.setAttributes({
              'mcp.tool.success': false,
              'mcp.tool.error': error.message,
            });

            return {
              content: [
                {
                  type: 'text',
                  text: `Unexpected error: ${error.message}`,
                } as {
                  [x: string]: unknown;
                  type: 'text';
                  text: string;
                },
              ],
              isError: true,
            };
          } finally {
            // Track tool usage
            const duration = Date.now() - startTime;
            telemetry
              .trackMcpToolUsage(name, toolCallSuccessful, duration)
              .catch((e) => console.warn('Failed to track tool usage:', e));

            span.end();
          }
        },
      );
    });
  };

  tool('get_environment_info', 'Get information about the connected Dynatrace Environment (Tenant)', {}, async ({}) => {
    try {
      const dtClient = await createDtOAuthClient([]);
      const environmentInformationClient = new EnvironmentInformationClient(dtClient);
      const environmentInfo = await environmentInformationClient.getEnvironmentInformation();
      let resp = `Environment Information (also referred to as tenant):\n${JSON.stringify(environmentInfo)}\n`;
      resp += `You can reach it via ${dtEnvironment}\n`;
      return resp;
    } catch (err: any) {
      // keep your existing error-handling logic that formats a textual response
      if (isClientRequestError(err)) {
        const e = err as ClientRequestError;
        const more = e.response.status === 403 ? 'Missing permission' : '';
        return `Client Request Error: ${e.message} (${e.response.status}) ${more}`;
      }
      return `Error: ${err.message}`;
    }
  });

  tool('list_vulnerabilities', 'Lists vulnerabilities in Dynatrace', {}, async () => {
    try {
      const dtClient = await createDtOAuthClient(['environment-api:security-problems:read']);
      const result = await listVulnerabilities(dtClient);

      if (!result || result.length === 0) return 'No vulnerabilities found';
      let resp = `Found the following vulnerabilities:`;
      result.forEach((vulnerability) => {
        resp += `\n* ${vulnerability}`;
      });
      resp += `\nWe recommend to take a look at ${dtPlatformEnvironment}/ui/apps/dynatrace.security.vulnerabilities to get a better overview of vulnerabilities.\n`;
      return resp;
    } catch (err: any) {
      if (isClientRequestError(err)) {
        const e = err as ClientRequestError;
        const more = e.response.status === 403 ? 'Missing permission' : '';
        return `Client Request Error: ${e.message} (${e.response.status}) ${more}`;
      }
      return `Error: ${err.message}`;
    }
  });


  tool('list_problems', 'List all problems known on Dynatrace', {}, async ({}) => {
    try {
      const dtClient = await createDtOAuthClient(['environment-api:problems:read']);
      const result = await listProblems(dtClient);
      return result.length === 0 ? 'No problems found' : `Found these problems: ${result.join(',')}`;
    } catch (err: any) {
      if (isClientRequestError(err)) {
        const e = err as ClientRequestError;
        const more = e.response.status === 403 ? 'Missing permission' : '';
        return `Client Request Error: ${e.message} (${e.response.status}) ${more}`;
      }
      return `Error: ${err.message}`;
    }
  });



  tool(
    'find_entity_by_name',
    'Get the entityId of a monitored entity based on the name',
    {
      entityName: z.string(),
    },
    async ({ entityName }) => {
      try {
        const dtClient = await createDtOAuthClient(['environment-api:entities:read', 'storage:entities:read']);
        const entityResponse = await findMonitoredEntityByName(dtClient, entityName);
        return entityResponse;
      } catch (err: any) {
        if (isClientRequestError(err)) {
          const e = err as ClientRequestError;
          const more = e.response.status === 403 ? 'Missing permission' : '';
          return `Client Request Error: ${e.message} (${e.response.status}) ${more}`;
        }
        return `Error: ${err.message}`;
      }
    },
  );

  tool(
    'add_entity_tags',
    'Add tags to a Dynatrace monitored entity by entity ID. Use execute_dql tool to find entity IDs if needed.',
    {
      entityId: z.string().describe('Entity ID of the monitored entity to tag'),
      tags: z
        .array(
          z.object({
            key: z.string().describe('Tag key'),
            value: z.string().optional().describe('Optional tag value'),
          }),
        )
        .min(1)
        .describe('Tags to apply'),
    },
    async ({ entityId, tags }, { requestId }) => {
      try {
        const result = await addEntityTags(entityId, tags as Array<{ key: string; value?: string }>, requestId);
        return result;
      } catch (err: any) {
        return `Error: ${(err as Error).message}`;
      }
    },
  );

  tool(
    'get_entity_details',
    'Get details of a monitored entity',
    {
      entityId: z.string().optional(),
    },
    async ({ entityId }) => {
      try {
        const dtClient = await createDtOAuthClient(['environment-api:entities:read']);
        const entityDetails = await getMonitoredEntityDetails(dtClient, entityId);

        let resp =
          `Entity ${entityDetails.displayName} of type ${entityDetails.type} with \`entityId\` ${entityDetails.entityId}\n` +
          `Properties: ${JSON.stringify(entityDetails.properties)}\n`;

        if (entityDetails.type === 'SERVICE') {
          resp += `You can find more information at ${dtPlatformEnvironment}/ui/apps/dynatrace.services/explorer?detailsId=${entityDetails.entityId}`;
        } else if (entityDetails.type === 'HOST') {
          resp += `You can find more information at ${dtPlatformEnvironment}/ui/apps/dynatrace.infraops/hosts/${entityDetails.entityId}`;
        } else if (entityDetails.type === 'KUBERNETES_CLUSTER') {
          resp += `More info: ${dtPlatformEnvironment}/ui/apps/dynatrace.infraops/kubernetes/${entityDetails.entityId}`;
        } else if (entityDetails.type === 'CLOUD_APPLICATION_WORKLOAD') {
          resp += `Details: ${dtPlatformEnvironment}/ui/apps/dynatrace.kubernetes/explorer/workload?detailsId=${entityDetails.entityId}`;
        }

        return resp;
      } catch (err: any) {
        if (isClientRequestError(err)) {
          const e = err as ClientRequestError;
          const more = e.response.status === 403 ? 'Missing permission' : '';
          return `Client Request Error: ${e.message} (${e.response.status}) ${more}`;
        }
        return `Error: ${err.message}`;
      }
    },
  );

  tool(
    'send_slack_message',
    'Sends a Slack message via Slack Connector on Dynatrace',
    {
      channel: z.string().optional(),
      message: z.string().optional(),
    },
    async ({ channel, message }) => {
      try {
        const dtClient = await createDtOAuthClient(['app-settings:objects:read']);
        const response = await sendSlackMessage(dtClient, slackConnectionId, channel, message);
        return `Message sent to Slack channel: ${JSON.stringify(response)}`;
      } catch (err: any) {
        if (isClientRequestError(err)) {
          const e = err as ClientRequestError;
          const more = e.response.status === 403 ? 'Missing permission' : '';
          return `Client Request Error: ${e.message} (${e.response.status}) ${more}`;
        }
        return `Error: ${err.message}`;
      }
    },
  );

  tool(
    'send_email',
    'Send an email via Dynatrace Email API',
    {
      toRecipients: z.array(z.string()).describe('Array of email addresses for To recipients'),
      ccRecipients: z.array(z.string()).optional().describe('Array of email addresses for CC recipients'),
      bccRecipients: z.array(z.string()).optional().describe('Array of email addresses for BCC recipients'),
      subject: z.string().describe('Email subject line'),
      body: z.string().describe('Email body content'),
      contentType: z
        .enum(['text/plain', 'text/html'])
        .optional()
        .default('text/plain')
        .describe('Email body content type'),
      notificationSettingsUrl: z.string().optional().describe('Optional notification settings URL'),
    },
    async ({
      toRecipients,
      ccRecipients,
      bccRecipients,
      subject,
      body,
      contentType = 'text/plain',
      notificationSettingsUrl,
    }) => {
      try {
        const dtClient = await createDtOAuthClient(['email:emails:send']);

        const emailRequest = {
          toRecipients: { emailAddresses: toRecipients },
          subject,
          body: { contentType, body },
          ...(ccRecipients && { ccRecipients: { emailAddresses: ccRecipients } }),
          ...(bccRecipients && { bccRecipients: { emailAddresses: bccRecipients } }),
          ...(notificationSettingsUrl && { notificationSettingsUrl }),
        };

        const response = await sendEmail(dtClient, emailRequest);
        return response;
      } catch (err: any) {
        if (isClientRequestError(err)) {
          const e = err as ClientRequestError;
          const more = e.response.status === 403 ? 'Missing permission (email:emails:send scope required)' : '';
          return `Client Request Error: ${e.message} (${e.response.status}) ${more}`;
        }
        return `Error: ${err.message}`;
      }
    },
  );



  tool(
    'verify_dql',
    'Verify a Dynatrace Query Language (DQL) statement',
    {
      dqlStatement: z.string(),
    },
    async ({ dqlStatement }) => {
      try {
        const dtClient = await createDtOAuthClient([]);
        const response = await verifyDqlStatement(dtClient, dqlStatement);

        let resp = 'DQL Statement Verification:\n';
        if (response.notifications?.length) {
          resp += `Notifications for adapting your DQL statement:\n`;
          response.notifications.forEach((note) => {
            resp += `* ${note.severity}: ${note.message}\n`;
          });
        }

        resp += response.valid
          ? `The DQL statement is valid - you can use the \"execute_dql\" tool.\n`
          : `The DQL statement is invalid. Please adapt your statement.\n`;

        return resp;
      } catch (err: any) {
        if (isClientRequestError(err)) {
          const e = err as ClientRequestError;
          const more = e.response.status === 403 ? 'Missing permission' : '';
          return `Client Request Error: ${e.message} (${e.response.status}) ${more}`;
        }
        return `Error: ${err.message}`;
      }
    },
  );

  tool(
    'execute_dql',
    'Execute a Dynatrace Query Language (DQL) statement',
    {
      dqlStatement: z.string(),
    },
    async ({ dqlStatement }) => {
      try {
        const dtClient = await createDtOAuthClient([
          'storage:buckets:read',
          'storage:logs:read',
          'storage:metrics:read',
          'storage:bizevents:read',
          'storage:spans:read',
          'storage:entities:read',
          'storage:events:read',
          'storage:system:read',
          'storage:user.events:read',
          'storage:user.sessions:read',
          'storage:security.events:read',
        ]);
        const response = await executeDql(dtClient, { query: dqlStatement }, grailBudgetGB);

        if (!response) {
          return 'DQL execution failed or returned no result.';
        }

        let result = `📊 **DQL Query Results**\n\n`;

        // Budget warning comes first if present
        if (response.budgetWarning) {
          result += `${response.budgetWarning}\n\n`;
        }

        // Cost and Performance Information
        if (response.scannedRecords !== undefined) {
          result += `- **Scanned Records:** ${response.scannedRecords.toLocaleString()}\n`;
        }

        if (response.scannedBytes !== undefined) {
          const scannedGB = response.scannedBytes / (1000 * 1000 * 1000);
          result += `- **Scanned Bytes:** ${scannedGB.toFixed(2)} GB`;

          // Show budget status if available
          if (response.budgetState) {
            const usagePercentage =
              (response.budgetState.totalBytesScanned / response.budgetState.budgetLimitBytes) * 100;
            result += ` (Session total: ${(response.budgetState.totalBytesScanned / (1000 * 1000 * 1000)).toFixed(2)} GB / ${response.budgetState.budgetLimitGB} GB budget, ${usagePercentage.toFixed(1)}% used)`;
          }
          result += '\n';

          if (scannedGB > 500) {
            result += `    ⚠️ **Very High Data Usage Warning:** This query scanned ${scannedGB.toFixed(1)} GB of data, which may impact your Dynatrace consumption. Please take measures to optimize your query, like limiting the timeframe or selecting a bucket.\n`;
          } else if (scannedGB > 50) {
            result += `    ⚠️ **High Data Usage Warning:** This query scanned ${scannedGB.toFixed(2)} GB of data, which may impact your Dynatrace consumption.\n`;
          } else if (scannedGB > 5) {
            result += `    💡 **Moderate Data Usage:** This query scanned ${scannedGB.toFixed(2)} GB of data.\n`;
          } else if (response.scannedBytes === 0) {
            result += `    💡 **No Data consumed:** This query did not consume any data.\n`;
          }
        }

        if (response.sampled !== undefined && response.sampled) {
          result += `- **⚠️ Sampling Used:** Yes (results may be approximate)\n`;
        }

        result += `\n📋 **Query Results**: (${response.records?.length || 0} records):\n\n`;
        result += `\`\`\`json\n${JSON.stringify(response.records, null, 2)}\n\`\`\``;

        return result;
      } catch (err: any) {
        if (isClientRequestError(err)) {
          const e = err as ClientRequestError;
          const more = e.response.status === 403 ? 'Missing permission' : '';
          return `Client Request Error: ${e.message} (${e.response.status}) ${more}`;
        }
        return `Error: ${err.message}`;
      }
    },
  );

  tool(
    'get_ownership',
    'Get detailed Ownership information for entities',
    {
      entityIds: z.string().optional(),
    },
    async ({ entityIds }) => {
      try {
        const dtClient = await createDtOAuthClient(['environment-api:entities:read', 'settings:objects:read']);
        console.error(`Fetching ownership for ${entityIds}`);
        const ownershipInformation = await getOwnershipInformation(dtClient, entityIds);
        console.error(`Done!`);

        if (!ownershipInformation || ownershipInformation.length === 0) {
          return 'No ownership information found for the provided entity IDs.';
        }
        return 'Ownership information:\n' + JSON.stringify(ownershipInformation);
      } catch (err: any) {
        if (isClientRequestError(err)) {
          const e = err as ClientRequestError;
          const more = e.response.status === 403 ? 'Missing permission' : '';
          return `Client Request Error: ${e.message} (${e.response.status}) ${more}`;
        }
        return `Error: ${err.message}`;
      }
    },
  );

  tool(
    'get_kubernetes_events',
    'Get all events from a specific Kubernetes (K8s) cluster',
    {
      clusterId: z
        .string()
        .optional()
        .describe(
          `The Kubernetes (K8s) Cluster Id, referred to as k8s.cluster.uid (this is NOT the Dynatrace environment)`,
        ),
    },
    async ({ clusterId }) => {
      try {
        const dtClient = await createDtOAuthClient(['storage:events:read']);
        const events = await getEventsForCluster(dtClient, clusterId);
        return `Kubernetes Events:\n${JSON.stringify(events)}`;
      } catch (err: any) {
        if (isClientRequestError(err)) {
          const e = err as ClientRequestError;
          const more = e.response.status === 403 ? 'Missing permission' : '';
          return `Client Request Error: ${e.message} (${e.response.status}) ${more}`;
        }
        return `Error: ${err.message}`;
      }
    },
  );

  tool(
    'create_workflow_for_notification',
    'Create a notification workflow in Dynatrace',
    {
      problemType: z.string().optional(),
      teamName: z.string().optional(),
      channel: z.string().optional(),
      isPrivate: z.boolean().optional().default(false),
    },
    async ({ problemType, teamName, channel, isPrivate }) => {
      try {
        const dtClient = await createDtOAuthClient([
          'automation:workflows:write',
          'automation:workflows:read',
          'automation:workflows:run',
        ]);
        const response = await createWorkflowForProblemNotification(
          dtClient,
          teamName,
          channel,
          problemType,
          isPrivate,
        );

        let resp = `Workflow Created: ${response?.id} with name ${response?.title}.\nYou can access it at ${dtPlatformEnvironment}/ui/apps/dynatrace.automations/workflows/${response?.id}\n`;

        if (response.type === 'SIMPLE') {
          resp += `Note: Simple workflows are not billed.\n`;
        } else if (response.type === 'STANDARD') {
          resp += `Note: Standard workflows are billed.\n`;
        }

        if (isPrivate) {
          resp += `This workflow is private and only accessible by the owner.\n`;
        }

        return resp;
      } catch (err: any) {
        if (isClientRequestError(err)) {
          const e = err as ClientRequestError;
          const more = e.response.status === 403 ? 'Missing permission' : '';
          return `Client Request Error: ${e.message} (${e.response.status}) ${more}`;
        }
        return `Error: ${err.message}`;
      }
    },
  );

  tool(
    'make_workflow_public',
    'Make a workflow public on Dynatrace',
    {
      workflowId: z.string().optional(),
    },
    async ({ workflowId }) => {
      try {
        const dtClient = await createDtOAuthClient([
          'automation:workflows:write',
          'automation:workflows:read',
          'automation:workflows:run',
        ]);
        const response = await updateWorkflow(dtClient, workflowId, { isPrivate: false });
        return `Workflow ${response.id} is now public!\nView it at: ${dtPlatformEnvironment}/ui/apps/dynatrace.automations/workflows/${response?.id}`;
      } catch (err: any) {
        if (isClientRequestError(err)) {
          const e = err as ClientRequestError;
          const more = e.response.status === 403 ? 'Missing permission' : '';
          return `Client Request Error: ${e.message} (${e.response.status}) ${more}`;
        }
        return `Error: ${err.message}`;
      }
    },
  );

  // This will create dashboards for all the JSONs inside /dashboards folder
  tool(
    'create_dashboard',
    'Create Dynatrace dashboards for every JSON file in the /dashboards folder. Each dashboard name is auto-extracted from the JSON.',
    {},
    async () => {
      const dashboardDir = path.join(__dirname, '..', 'dashboards');
      let files: string[] = [];
      let summary: any[] = [];

      try {
        files = await fs.readdir(dashboardDir);
        const jsonFiles = files.filter((f) => f.endsWith('.json'));

        for (const file of jsonFiles) {
          const filePath = path.join(dashboardDir, file);
          let result,
            status = 'success',
            error = undefined;
          try {
            result = await createDashboard(filePath, '');
          } catch (err: any) {
            status = 'failed';
            error = err?.message || String(err);
          }
          summary.push({
            file,
            status,
            dashboardId: result?.id,
            dashboardName: result?.name,
            error,
          });
        }

        return (
          'Dashboard creation summary:\n' +
          summary
            .map(
              (s) =>
                `${s.file}: ${s.status}${s.dashboardId ? ' | ID: ' + s.dashboardId : ''}${s.dashboardName ? ' | Name: ' + s.dashboardName : ''}${s.error ? ' | Error: ' + s.error : ''}`,
            )
            .join('\n')
        );
      } catch (err: any) {
        return `Error: ${err.message}`;
      }
    },
  );

  // Env Share is usefull to send share id as a slack message to certain group of users.
  tool(
    'share_document_env',
    'Share a Dynatrace document across all environments with read or read-write access.',
    {
      documentId: z.string().describe('The ID of the document to share'),
      access: z.enum(['read', 'read-write']).default('read').describe('Type of access to grant'),
    },
    async ({ documentId, access }) => {
      try {
        const dtClient = await createDtOAuthClient(['document:environment-shares:write']);
        const result = await shareDocumentWithEnv(dtClient, documentId, access, '');
        return `Shared document ${documentId} with '${access}' access. Share ID: ${result.id}`;
      } catch (err: any) {
        if (isClientRequestError(err)) {
          const e = err as ClientRequestError;
          const more = e.response.status === 403 ? 'Missing permission' : '';
          return `Client Request Error: ${e.message} (${e.response.status}) ${more}`;
        }
        return `Error: ${err.message}`;
      }
    },
  );

  // Direct Share is useful as soon as doc is created and you want to share it with specific users (IDs from env).
  // Group ID is inherited from env variable.
  tool(
    'direct_share_document',
    'Direct-share a document with specific recipients (IDs from env), as read or read-write.',
    {
      documentId: z.string().describe('The document ID to share'),
      access: z.enum(['read', 'read-write']).default('read').describe('Access level to grant'),
    },
    async ({ documentId, access }) => {
      try {
        const dtClient = await createDtOAuthClient(['document:direct-shares:write']);
        const result = await directShareDocument(dtClient, documentId, access, '');
        return `Direct-shared document ${documentId} as ${access} with recipients from env.`;
      } catch (err: any) {
        if (isClientRequestError(err)) {
          const e = err as ClientRequestError;
          const more = e.response.status === 403 ? 'Missing permission' : '';
          return `Client Request Error: ${e.message} (${e.response.status}) ${more}`;
        }
        return `Error: ${err.message}`;
      }
    },
  );

  tool(
    'bulk_delete_dashboards',
    'Bulk delete dashboards/documents by a list of document IDs.',
    {
      documentIds: z.array(z.string()).describe('List of document IDs to delete'),
    },
    async ({ documentIds }) => {
      try {
        const dtClient = await createDtOAuthClient(['document:documents:delete']);
        const result = await bulkDeleteDashboards(dtClient, documentIds, '');
        return `Deleted documents: ${documentIds.join(', ')}`;
      } catch (err: any) {
        if (isClientRequestError(err)) {
          const e = err as ClientRequestError;
          const more = e.response.status === 403 ? 'Missing permission' : '';
          return `Client Request Error: ${e.message} (${e.response.status}) ${more}`;
        }
        return `Error: ${err.message}`;
      }
    },
  );

  tool(
    'execute_typescript',
    'Executes TypeScript code using Dynatrace Function Executor API.',
    {
      sourceCode: z
        .string()
        .describe('The source code to run. Must be in `export default async function ({...})` format.'),
      payload: z.record(z.any()).describe('The payload object to pass as input to the function.'),
    },
    async ({ sourceCode, payload }) => {
      try {
        const result = await executeTypescript(sourceCode, payload, '');
        return JSON.stringify(result);
      } catch (err: any) {
        return `Error: ${err.message}`;
      }
    },
  );

  tool(
    'generate_dql_from_natural_language',
    "Convert natural language queries to Dynatrace Query Language (DQL) using Davis CoPilot AI. You can ask for problem events, security issues, logs, metrics, spans, and custom data. Workflow: 1) Generate DQL, 2) Verify with verify_dql tool, 3) Execute with execute_dql tool, 4) Iterate if results don't match expectations.",
    {
      text: z
        .string()
        .describe(
          'Natural language description of what you want to query. Be specific and include time ranges, entities, and metrics of interest.',
        ),
    },
    async ({ text }) => {
      const dtClient = await createDtOAuthClient(['davis-copilot:nl2dql:execute']);

      const response = await generateDqlFromNaturalLanguage(dtClient, text);

      let resp = `🔤 Natural Language to DQL:\n\n`;
      resp += `**Query:** "${text}"\n\n`;
      resp += `**Generated DQL:**\n\`\`\`\n${response.dql}\n\`\`\`\n\n`;
      resp += `**Status:** ${response.status}\n`;
      resp += `**Message Token:** ${response.messageToken}\n`;

      if (response.metadata?.notifications && response.metadata.notifications.length > 0) {
        resp += `\n**Notifications:**\n`;
        response.metadata.notifications.forEach((notification) => {
          resp += `- ${notification.severity}: ${notification.message}\n`;
        });
      }

      resp += `\n💡 **Next Steps:**\n`;
      resp += `1. Use "verify_dql" tool to validate this query\n`;
      resp += `2. Use "execute_dql" tool to run the query\n`;
      resp += `3. If results don't match expectations, refine your natural language description and try again\n`;

      return resp;
    },
  );

  tool(
    'explain_dql_in_natural_language',
    'Explain Dynatrace Query Language (DQL) statements in natural language using Davis CoPilot AI.',
    {
      dql: z.string().describe('The DQL statement to explain'),
    },
    async ({ dql }) => {
      const dtClient = await createDtOAuthClient(['davis-copilot:dql2nl:execute']);

      const response = await explainDqlInNaturalLanguage(dtClient, dql);

      let resp = `📝 DQL to Natural Language:\n\n`;
      resp += `**DQL Query:**\n\`\`\`\n${dql}\n\`\`\`\n\n`;
      resp += `**Summary:** ${response.summary}\n\n`;
      resp += `**Detailed Explanation:**\n${response.explanation}\n\n`;
      resp += `**Status:** ${response.status}\n`;
      resp += `**Message Token:** ${response.messageToken}\n`;

      if (response.metadata?.notifications && response.metadata.notifications.length > 0) {
        resp += `\n**Notifications:**\n`;
        response.metadata.notifications.forEach((notification) => {
          resp += `- ${notification.severity}: ${notification.message}\n`;
        });
      }

      return resp;
    },
  );

  tool(
    'chat_with_davis_copilot',
    'Use this tool in case no specific tool is available. Get an answer to any Dynatrace related question as well as troubleshooting, and guidance. *(Note: Davis CoPilot AI is GA, but the Davis CoPilot APIs are in preview)*',
    {
      text: z.string().describe('Your question or request for Davis CoPilot'),
      context: z.string().optional().describe('Optional context to provide additional information'),
      instruction: z.string().optional().describe('Optional instruction for how to format the response'),
    },
    async ({ text, context, instruction }) => {
      const dtClient = await createDtOAuthClient(['davis-copilot:conversations:execute']);

      const conversationContext: any[] = [];

      if (context) {
        conversationContext.push({
          type: 'supplementary',
          value: context,
        });
      }

      if (instruction) {
        conversationContext.push({
          type: 'instruction',
          value: instruction,
        });
      }

      const response = await chatWithDavisCopilot(dtClient, text, conversationContext);

      let resp = `🤖 Davis CoPilot Response:\n\n`;
      resp += `**Your Question:** "${text}"\n\n`;
      resp += `**Answer:**\n${response.text}\n\n`;
      resp += `**Status:** ${response.status}\n`;
      resp += `**Message Token:** ${response.messageToken}\n`;

      if (response.metadata?.sources && response.metadata.sources.length > 0) {
        resp += `\n**Sources:**\n`;
        response.metadata.sources.forEach((source) => {
          resp += `- ${source.title || 'Untitled'}: ${source.url || 'No URL'}\n`;
        });
      }

      if (response.metadata?.notifications && response.metadata.notifications.length > 0) {
        resp += `\n**Notifications:**\n`;
        response.metadata.notifications.forEach((notification) => {
          resp += `- ${notification.severity}: ${notification.message}\n`;
        });
      }

      if (response.state?.conversationId) {
        resp += `\n**Conversation ID:** ${response.state.conversationId}`;
      }

      return resp;
    },
  );

  tool(
    'reset_grail_budget',
    'Reset the Grail query budget after it was exhausted, allowing new queries to be executed. This clears all tracked bytes scanned in the current session.',
    {},
    async ({}) => {
      // Reset the global tracker
      resetGrailBudgetTracker();

      // Get a fresh tracker to show the reset state
      const freshTracker = getGrailBudgetTracker(grailBudgetGB);
      const state = freshTracker.getState();

      return `✅ **Grail Budget Reset Successfully!**

Budget status after reset:
- Total bytes scanned: ${state.totalBytesScanned} bytes (0 GB)
- Budget limit: ${state.budgetLimitGB} GB
- Remaining budget: ${state.budgetLimitGB} GB
- Budget exceeded: ${state.isBudgetExceeded ? 'Yes' : 'No'}

You can now execute new Grail queries (DQL, etc.) again. If this happens more often, please consider

- Optimizing your queries (timeframes, bucket selection, filters)
- Creating or optimizing bucket configurations that fit your queries (see https://docs.dynatrace.com/docs/analyze-explore-automate/logs/lma-bucket-assignment for details)
- Increasing \`DT_GRAIL_QUERY_BUDGET_GB\` in your environment configuration
`;
    },
  );

  tool('get_grail_budget_status', 'Get current Grail query budget usage and status', {}, async () => {
    try {
      const tracker = getGrailBudgetTracker(grailBudgetGB);
      const state = tracker.getState();
      const status = getBudgetStatus(grailBudgetGB);

      let response = `📊 **Grail Budget Status**\n${(state.totalBytesScanned / (1000 * 1000 * 1000)).toFixed(2)} / ${grailBudgetGB} GB used (${((state.totalBytesScanned / state.budgetLimitBytes) * 100).toFixed(1)}%)`;
      
      if (tracker.isBudgetExceeded()) {
        response += `\n🚨 **Budget Exceeded!** Further queries may be blocked or incur additional costs.`;
      }

      return response;
    } catch (err: any) {
      return `Error getting budget status: ${err.message}`;
    }
  });

  // Create a shutdown handler that takes shutdown operations as parameters
  const shutdownHandler = (...shutdownOps: Array<() => void | Promise<void>>) => {
    return async () => {
      console.error('Shutting down MCP server...');
      for (const op of shutdownOps) {
        await op();
      }
      process.exit(0);
    };
  };

  // Parse command line arguments using commander
  const program = new Command();

  program
    .name('dynatrace-mcp-server')
    .description('Dynatrace Model Context Protocol (MCP) Server')
    .version(VERSION)
    .option('--http', 'enable HTTP server mode instead of stdio')
    .option('--server', 'enable HTTP server mode (alias for --http)')
    .option('-p, --port <number>', 'port for HTTP server', '3000')
    .option('-H, --host <host>', 'host for HTTP server', '0.0.0.0')
    .parse();

  const options = program.opts();
  const httpMode = options.http || options.server;
  const httpPort = parseInt(options.port, 10);
  const host = options.host || '0.0.0.0';

  // HTTP server mode (Stateless)
  if (httpMode) {
    const httpServer = createServer(async (req: IncomingMessage, res: ServerResponse) => {
      // Parse request body for POST requests
      let body: unknown;
      // Create a new Stateless HTTP Transport
      const httpTransport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined, // No Session ID needed
      });

      res.on('close', () => {
        // close transport and server, but not the httpServer itself
        httpTransport.close();
        server.close();
      });

      // Connecting MCP-server to HTTP transport
      await server.connect(httpTransport);

      // Handle POST Requests for this endpoint
      if (req.method === 'POST') {
        const chunks: Buffer[] = [];
        for await (const chunk of req) {
          chunks.push(chunk);
        }
        const rawBody = Buffer.concat(chunks).toString();
        try {
          body = JSON.parse(rawBody);
        } catch (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
          return;
        }
      }

      await httpTransport.handleRequest(req, res, body);
    });

    // Start HTTP Server on the specified host and port
    httpServer.listen(httpPort, host, () => {
      console.error(`Dynatrace MCP Server running on HTTP at http://${host}:${httpPort}`);
    });

    // Handle graceful shutdown for http server mode
    process.on(
      'SIGINT',
      shutdownHandler(
        async () => await telemetry.shutdown(),
        () => new Promise<void>((resolve) => httpServer.close(() => resolve())),
      ),
    );
  } else {
    // Default stdio mode
    const transport = new StdioServerTransport();

    console.error('Connecting server to transport...');
    await server.connect(transport);
    console.error('Dynatrace MCP Server running on stdio');

    // Handle graceful shutdown for stdio mode
    process.on(
      'SIGINT',
      shutdownHandler(async () => await telemetry.shutdown()),
    );
    process.on(
      'SIGTERM',
      shutdownHandler(async () => await telemetry.shutdown()),
    );
  }
};

main().catch(async (error) => {
  console.error('Fatal error in main():', error);
  try {
    // Report error in main
    const telemetry = createTelemetry();
    await telemetry.trackError(error, 'main_error');
    await telemetry.shutdown();
  } catch (e) {
    console.warn('Failed to track fatal error:', e);
  }
  process.exit(1);
});
