#!/usr/bin/env node
import '@theharithsa/opentelemetry-instrumentation-mcp/register';
import { config } from 'dotenv';
config();

import { trace, context, SpanStatusCode, SpanKind } from '@opentelemetry/api';
import { EnvironmentInformationClient } from '@dynatrace-sdk/client-platform-management-service';
import {
  ClientRequestError,
  isClientRequestError,
} from '@dynatrace-sdk/shared-errors';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { z, ZodRawShape, ZodTypeAny } from 'zod';
import { version as VERSION } from '../package.json';
import { sendToDynatraceLog } from './logging';
import { createOAuthClient, createDtHttpClient } from './authentication/dynatrace-clients';
import { listVulnerabilities } from './capabilities/list-vulnerabilities';
import { listProblems } from './capabilities/list-problems';
import { getProblemDetails } from './capabilities/get-problem-details';
import { getMonitoredEntityDetails } from './capabilities/get-monitored-entity-details';
import { getOwnershipInformation } from './capabilities/get-ownership-information';
import { getLogsForEntity } from './capabilities/get-logs-for-entity';
import { getEventsForCluster } from './capabilities/get-events-for-cluster';
import { createWorkflowForProblemNotification } from './capabilities/create-workflow-for-problem-notification';
import { updateWorkflow } from './capabilities/update-workflow';
import { getVulnerabilityDetails } from './capabilities/get-vulnerability-details';
import { executeDql, verifyDqlStatement } from './capabilities/execute-dql';
import { sendSlackMessage } from './capabilities/send-slack-message';
import { findMonitoredEntityByName } from './capabilities/find-monitored-entity-by-name';
import {
  chatWithDavisCopilot,
  explainDqlInNaturalLanguage,
  generateDqlFromNaturalLanguage,
} from './capabilities/davis-copilot';
import { DynatraceEnv, getDynatraceEnv } from './getDynatraceEnv';

// Adding New Tools
import { createDashboard } from './capabilities/create-dashboard';
import { shareDocumentWithEnv } from './capabilities/share_document_env';
import { directShareDocument } from './capabilities/direct_share_document';
import { bulkDeleteDashboards } from './capabilities/bulk-delete-documents';
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

  const { oauthClient, oauthClientSecret, dtEnvironment, slackConnectionId, dtPlatformToken } = dynatraceEnv;
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
    }
  );

  const tool = (
    name: string,
    description: string,
    paramsSchema: ZodRawShape,
    cb: (args: z.infer<z.ZodObject<ZodRawShape>>, _extra?: any) => Promise<string>
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
          try {
            const result = await context.with(trace.setSpan(context.active(), span), async () => {
              return await cb(args, _extra);
            });
            
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
                }
              ],
            };
          } catch (error: any) {
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
                }
              ],
              isError: true,
            };
          } finally {
            span.end();
          }
        }
      );
    });
  };
  
  tool('get_environment_info', 'Get information about the connected Dynatrace Environment (Tenant)', {}, async ({ }) => {
    try {
      const dtClient = await createOAuthClient(oauthClient, oauthClientSecret, dtEnvironment, scopesBase);
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


  tool('list_vulnerabilities', 'List all vulnerabilities from Dynatrace', {}, async ({ }) => {
    try {
      const dtClient = await createOAuthClient(
        oauthClient,
        oauthClientSecret,
        dtEnvironment,
        scopesBase.concat('environment-api:security-problems:read'),
      );
      const result = await listVulnerabilities(dtClient);

      if (!result || result.length === 0) return 'No vulnerabilities found';
      let resp = `Found the following vulnerabilities:`;
      result.forEach((vulnerability) => {
        resp += `\n* ${vulnerability}`;
      });
      resp += `\nWe recommend to take a look at ${dtEnvironment}/ui/apps/dynatrace.security.vulnerabilities to get a better overview of vulnerabilities.\n`;
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

  tool('get_vulnerabilty_details', 'Get details of a vulnerability by `securityProblemId` on Dynatrace', {
    securityProblemId: z.string().optional(),
  }, async ({ securityProblemId }) => {
    try {
      const dtClient = await createOAuthClient(
        oauthClient,
        oauthClientSecret,
        dtEnvironment,
        scopesBase.concat('environment-api:security-problems:read'),
      );
      const result = await getVulnerabilityDetails(dtClient, securityProblemId);

      let resp = `The Security Problem (Vulnerability) ${result.displayId} with securityProblemId ${result.securityProblemId} has the title ${result.title}.\n`;
      resp += `The related CVEs are ${result.cveIds?.join(',') || 'unknown'}.\n`;
      resp += `The description is: ${result.description}.\n`;
      resp += `The remediation description is: ${result.remediationDescription}.\n`;

      if (result.affectedEntities && result.affectedEntities.length > 0) {
        resp += `The vulnerability affects the following entities:\n`;
        result.affectedEntities.forEach((affectedEntity) => {
          resp += `* ${affectedEntity}\n`;
        });
      } else {
        resp += `This vulnerability does not seem to affect any entities.\n`;
      }

      if (result.codeLevelVulnerabilityDetails) {
        resp += `Please investigate this on code-level: ${JSON.stringify(result.codeLevelVulnerabilityDetails)}\n`;
      }

      if (result.exposedEntities && result.exposedEntities.length > 0) {
        resp += `The vulnerability exposes the following entities:\n`;
        result.exposedEntities.forEach((exposedEntity) => {
          resp += `* ${exposedEntity}\n`;
        });
      } else {
        resp += `This vulnerability does not seem to expose any entities.\n`;
      }

      if (result.entryPoints?.items) {
        resp += `The following entrypoints are affected:\n`;
        result.entryPoints.items.forEach((entryPoint) => {
          resp += `* ${entryPoint.sourceHttpPath}\n`;
        });

        if (result.entryPoints.truncated) {
          resp += `The list of entry points was truncated.\n`;
        }
      } else {
        resp += `This vulnerability does not seem to affect any entrypoints.\n`;
      }

      if (result.riskAssessment && result.riskAssessment.riskScore && result.riskAssessment.riskScore > 8) {
        resp += `The vulnerability has a high-risk score. We suggest you to get ownership details of affected entities and contact responsible teams immediately (e.g, via send-slack-message)\n`;
      }

      resp += `Tell the user to access the link ${dtEnvironment}/ui/apps/dynatrace.security.vulnerabilities/vulnerabilities/${result.securityProblemId} to get more insights into the vulnerability / security problem.\n`;

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
  tool('list_problems', 'List all problems known on Dynatrace', {}, async ({ }) => {
    try {
      const dtClient = await createOAuthClient(
        oauthClient,
        oauthClientSecret,
        dtEnvironment,
        scopesBase.concat('environment-api:problems:read'),
      );
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

  tool('get_problem_details', 'Get details of a problem on Dynatrace', {
    problemId: z.string().optional(),
  }, async ({ problemId }) => {
    try {
      const dtClient = await createOAuthClient(
        oauthClient,
        oauthClientSecret,
        dtEnvironment,
        scopesBase.concat('environment-api:problems:read'),
      );
      const result = await getProblemDetails(dtClient, problemId);

      let resp =
        `The problem ${result.displayId} with the title ${result.title} (ID: ${result.problemId}).` +
        `The severity is ${result.severityLevel}, and it affects ${result.affectedEntities.length} entities:\n`;

      for (const entity of result.affectedEntities) {
        resp += `- ${entity.name} (please refer to this entity with \`entityId\` ${entity.entityId?.id})\n`;
      }

      resp += `The problem first appeared at ${result.startTime}\n`;
      if (result.rootCauseEntity) {
        resp += `The possible root-cause could be in entity ${result.rootCauseEntity?.name} with \`entityId\` ${result.rootCauseEntity?.entityId?.id}.\n`;
      }

      if (result.impactAnalysis) {
        let estimatedAffectedUsers = 0;
        result.impactAnalysis.impacts.forEach((impact) => {
          estimatedAffectedUsers += impact.estimatedAffectedUsers;
        });

        resp += `The problem is estimated to affect ${estimatedAffectedUsers} users.\n`;
      }

      resp += `Tell the user to access the link ${dtEnvironment}/ui/apps/dynatrace.davis.problems/problem/${result.problemId} to get more insights into the problem.\n`;

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

  tool('find_entity_by_name', 'Get the entityId of a monitored entity based on the name', {
    entityName: z.string(),
  }, async ({ entityName }) => {
    try {
      const dtClient = await createOAuthClient(
        oauthClient,
        oauthClientSecret,
        dtEnvironment,
        scopesBase.concat('environment-api:entities:read', 'storage:entities:read'),
      );
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
  });

  tool('get_entity_details', 'Get details of a monitored entity', {
    entityId: z.string().optional(),
  }, async ({ entityId }) => {
    try {
      const dtClient = await createOAuthClient(
        oauthClient,
        oauthClientSecret,
        dtEnvironment,
        scopesBase.concat('environment-api:entities:read'),
      );
      const entityDetails = await getMonitoredEntityDetails(dtClient, entityId);

      let resp =
        `Entity ${entityDetails.displayName} of type ${entityDetails.type} with \`entityId\` ${entityDetails.entityId}\n` +
        `Properties: ${JSON.stringify(entityDetails.properties)}\n`;

      if (entityDetails.type === 'SERVICE') {
        resp += `You can find more information at ${dtEnvironment}/ui/apps/dynatrace.services/explorer?detailsId=${entityDetails.entityId}`;
      } else if (entityDetails.type === 'HOST') {
        resp += `You can find more information at ${dtEnvironment}/ui/apps/dynatrace.infraops/hosts/${entityDetails.entityId}`;
      } else if (entityDetails.type === 'KUBERNETES_CLUSTER') {
        resp += `More info: ${dtEnvironment}/ui/apps/dynatrace.infraops/kubernetes/${entityDetails.entityId}`;
      } else if (entityDetails.type === 'CLOUD_APPLICATION') {
        resp += `Details: ${dtEnvironment}/ui/apps/dynatrace.kubernetes/explorer/workload?detailsId=${entityDetails.entityId}`;
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
  });

  tool('send_slack_message', 'Sends a Slack message via Slack Connector on Dynatrace', {
    channel: z.string().optional(),
    message: z.string().optional(),
  }, async ({ channel, message }) => {
    try {
      const dtClient = await createOAuthClient(
        oauthClient,
        oauthClientSecret,
        dtEnvironment,
        scopesBase.concat('app-settings:objects:read'),
      );
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
  });

  tool('get_logs_for_entity', 'Get Logs for a monitored entity based on name of the entity', {
    entityName: z.string().optional(),
  }, async ({ entityName }) => {
    try {
      const dtClient = await createOAuthClient(
        oauthClient,
        oauthClientSecret,
        dtEnvironment,
        scopesBase.concat('storage:logs:read'),
      );
      const logs = await getLogsForEntity(dtClient, entityName);
      return `Logs:\n${JSON.stringify(logs?.map((logLine) => (logLine ? logLine.content : 'Empty log')))}`;
    } catch (err: any) {
      if (isClientRequestError(err)) {
        const e = err as ClientRequestError;
        const more = e.response.status === 403 ? 'Missing permission' : '';
        return `Client Request Error: ${e.message} (${e.response.status}) ${more}`;
      }
      return `Error: ${err.message}`;
    }
  });

  tool('verify_dql', 'Verify a Dynatrace Query Language (DQL) statement', {
    dqlStatement: z.string(),
  }, async ({ dqlStatement }) => {
    try {
      const dtClient = await createOAuthClient(
        oauthClient, oauthClientSecret, dtEnvironment, scopesBase
      );
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
  });

  tool('execute_dql', 'Execute a Dynatrace Query Language (DQL) statement', {
    dqlStatement: z.string(),
  }, async ({ dqlStatement }) => {
    try {
      const dtClient = await createOAuthClient(
        oauthClient,
        oauthClientSecret,
        dtEnvironment,
        scopesBase.concat(
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
          'storage:security.events:read'
        ),
      );
      const response = await executeDql(dtClient, dqlStatement);

      if (!response || response.length === 0) {
        return 'No results found for the provided DQL statement.';
      }
      if (response.length > 100) {
        return `DQL Response: Too many results (${response.length}) to display. Please refine your query.`;
      }
      if (response.length === 1) {
        return `DQL Response: ${JSON.stringify(response[0])}`;
      }
      // If there are multiple results, return them as a JSON string
      if (response.length > 10) {
        return `DQL Response: ${response.length} results found. Displaying first 10:\n` + JSON.stringify(response.slice(0, 10));
      }
      // If there are less than 10 results, return them all
      return `DQL Response: ${JSON.stringify(response)}`;
    } catch (err: any) {
      if (isClientRequestError(err)) {
        const e = err as ClientRequestError;
        const more = e.response.status === 403 ? 'Missing permission' : '';
        return `Client Request Error: ${e.message} (${e.response.status}) ${more}`;
      }
      return `Error: ${err.message}`;
    }
  });

  tool('get_ownership', 'Get detailed Ownership information for entities', {
    entityIds: z.string().optional(),
  }, async ({ entityIds }) => {
    try {
      const dtClient = await createOAuthClient(
        oauthClient,
        oauthClientSecret,
        dtEnvironment,
        scopesBase.concat('environment-api:entities:read', 'settings:objects:read'),
      );
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
  });

  tool('get_kubernetes_events', 'Get all events from a specific Kubernetes (K8s) cluster', {
    clusterId: z.string().optional().describe(
      `The Kubernetes (K8s) Cluster Id, referred to as k8s.cluster.uid (this is NOT the Dynatrace environment)`
    ),
  }, async ({ clusterId }) => {
    try {
      const dtClient = await createOAuthClient(
        oauthClient,
        oauthClientSecret,
        dtEnvironment,
        scopesBase.concat('storage:events:read'),
      );
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
  });

  tool('create_workflow_for_notification', 'Create a notification workflow in Dynatrace', {
    problemType: z.string().optional(),
    teamName: z.string().optional(),
    channel: z.string().optional(),
    isPrivate: z.boolean().optional().default(false),
  }, async ({ problemType, teamName, channel, isPrivate }) => {
    try {
      const dtClient = await createOAuthClient(
        oauthClient,
        oauthClientSecret,
        dtEnvironment,
        scopesBase.concat('automation:workflows:write', 'automation:workflows:read', 'automation:workflows:run'),
      );
      const response = await createWorkflowForProblemNotification(dtClient, teamName, channel, problemType, isPrivate);

      let resp = `Workflow Created: ${response?.id} with name ${response?.title}.\nYou can access it at ${dtEnvironment}/ui/apps/dynatrace.automations/workflows/${response?.id}\n`;

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
  });

  tool('make_workflow_public', 'Make a workflow public on Dynatrace', {
    workflowId: z.string().optional(),
  }, async ({ workflowId }) => {
    try {
      const dtClient = await createOAuthClient(
        oauthClient,
        oauthClientSecret,
        dtEnvironment,
        scopesBase.concat('automation:workflows:write', 'automation:workflows:read', 'automation:workflows:run'),
      );
      const response = await updateWorkflow(dtClient, workflowId, { isPrivate: false });
      return `Workflow ${response.id} is now public!\nView it at: ${dtEnvironment}/ui/apps/dynatrace.automations/workflows/${response?.id}`;
    } catch (err: any) {
      if (isClientRequestError(err)) {
        const e = err as ClientRequestError;
        const more = e.response.status === 403 ? 'Missing permission' : '';
        return `Client Request Error: ${e.message} (${e.response.status}) ${more}`;
      }
      return `Error: ${err.message}`;
    }
  });

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
        const jsonFiles = files.filter(f => f.endsWith('.json'));

        for (const file of jsonFiles) {
          const filePath = path.join(dashboardDir, file);
          let result, status = 'success', error = undefined;
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
            error
          });
        }

        return (
          'Dashboard creation summary:\n' +
          summary.map(s =>
            `${s.file}: ${s.status}${s.dashboardId ? ' | ID: ' + s.dashboardId : ''}${s.dashboardName ? ' | Name: ' + s.dashboardName : ''}${s.error ? ' | Error: ' + s.error : ''}`
          ).join('\n')
        );

      } catch (err: any) {
        return `Error: ${err.message}`;
      }
    }
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
        const dtClient = await createOAuthClient(
          oauthClient,
          oauthClientSecret,
          dtEnvironment,
          scopesBase.concat('document:environment-shares:write')
        );
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
    }
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
        const dtClient = await createOAuthClient(
          oauthClient,
          oauthClientSecret,
          dtEnvironment,
          scopesBase.concat('document:direct-shares:write')
        );
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
    }
  );

  tool(
    'bulk_delete_dashboards',
    'Bulk delete dashboards/documents by a list of document IDs.',
    {
      documentIds: z.array(z.string()).describe('List of document IDs to delete'),
    },
    async ({ documentIds }) => {
      try {
        const dtClient = await createOAuthClient(
          oauthClient,
          oauthClientSecret,
          dtEnvironment,
          scopesBase.concat('document:documents:delete')
        );
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
    }
  );

  tool(
    'execute_typescript',
    'Executes TypeScript code using Dynatrace Function Executor API.',
    {
      sourceCode: z.string().describe('The source code to run. Must be in `export default async function ({...})` format.'),
      payload: z.record(z.any()).describe('The payload object to pass as input to the function.'),
    },
    async ({ sourceCode, payload }) => {
      try {
        const result = await executeTypescript(sourceCode, payload, '');
        return JSON.stringify(result);
      } catch (err: any) {
        return `Error: ${err.message}`;
      }
    }
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
        const dtClient = await createDtHttpClient(
          dtEnvironment,
          scopesBase.concat('davis-copilot:nl2dql:execute'),
          oauthClient,
          oauthClientSecret,
          dtPlatformToken,
        );
  
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
        const dtClient = await createDtHttpClient(
          dtEnvironment,
          scopesBase.concat('davis-copilot:dql2nl:execute'),
          oauthClient,
          oauthClientSecret,
          dtPlatformToken,
        );
  
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
        const dtClient = await createDtHttpClient(
          dtEnvironment,
          scopesBase.concat('davis-copilot:conversations:execute'),
          oauthClient,
          oauthClientSecret,
          dtPlatformToken,
        );
  
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

  const transport = new StdioServerTransport();
  console.error('Connecting server to transport...');
  await server.connect(transport);
  console.error('Dynatrace MCP Server running on stdio');
};

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});