#!/usr/bin/env node
import './otel';
import { trace, context, SpanStatusCode } from '@opentelemetry/api';
import { config } from 'dotenv';
config();

import { EnvironmentInformationClient } from '@dynatrace-sdk/client-platform-management-service';
import {
  ClientRequestError,
  isClientRequestError,
} from '@dynatrace-sdk/shared-errors';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  CallToolResult,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { z, ZodRawShape, ZodTypeAny } from 'zod';
import { version as VERSION } from '../package.json';
import { sendToDynatraceLog } from './logging';
import { createOAuthClient } from './authentication/dynatrace-clients';
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
import { DynatraceEnv, getDynatraceEnv } from './getDynatraceEnv';

// Adding New Tools
import { createDashboard } from './capabilities/create-dashboard';
import { shareDocumentWithEnv } from './capabilities/share-document-with-env';
import { directShareDocument } from './capabilities/direct-share-docs';



let scopesBase = ['app-engine:apps:run', 'app-engine:functions:run'];
const tracer = trace.getTracer('dynatrace-mcp');

const main = async () => {
  let dynatraceEnv: DynatraceEnv;
  try {
    dynatraceEnv = getDynatraceEnv();
  } catch (err) {

    process.exit(1);
  }

  const { oauthClient, oauthClientSecret, dtEnvironment, slackConnectionId } = dynatraceEnv;
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

      const span = tracer.startSpan(`Tool: ${name}`);
      return await context.with(trace.setSpan(context.active(), span), async () => {
        try {
          const result = await cb(args, _extra);
          span.setStatus({ code: SpanStatusCode.OK });
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
          span.setStatus({ code: SpanStatusCode.ERROR });

          if (isClientRequestError(error)) {
            const e: ClientRequestError = error;
            let more = e.response.status === 403 ? 'Missing permission' : '';
            return {
              content: [
                {
                  type: 'text',
                  text: `Client Request Error: ${e.message} (${e.response.status}) ${more}`,
                } as {
                  [x: string]: unknown;
                  type: 'text';
                  text: string;
                }
              ],
              isError: true,
            };
          }

          return {
            content: [
              {
                type: 'text',
                text: `Error: ${error.message}`,
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
      });
    });
  };
  tool('get_environment_info', 'Get information about the connected Dynatrace Environment (Tenant)', {}, async ({ }) => {
    const span = tracer.startSpan('get_environment_info');
    return await context.with(trace.setSpan(context.active(), span), async () => {
      try {
        const dtClient = await createOAuthClient(oauthClient, oauthClientSecret, dtEnvironment, scopesBase);
        const environmentInformationClient = new EnvironmentInformationClient(dtClient);
        const environmentInfo = await environmentInformationClient.getEnvironmentInformation();

        let resp = `Environment Information (also referred to as tenant):\n${JSON.stringify(environmentInfo)}\n`;
        resp += `You can reach it via ${dtEnvironment}\n`;
        span.setStatus({ code: SpanStatusCode.OK });
        return resp;
      } catch (err: any) {
        span.recordException(err as any);
        span.setStatus({ code: SpanStatusCode.ERROR });
        throw err;
      } finally {
        span.end();
      }
    });
  });

  tool('list_vulnerabilities', 'List all vulnerabilities from Dynatrace', {}, async ({ }) => {
    const span = tracer.startSpan('list_vulnerabilities');
    return await context.with(trace.setSpan(context.active(), span), async () => {
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
        span.setStatus({ code: SpanStatusCode.OK });

        await sendToDynatraceLog({
          tool: 'list_vulnerabilities',
          traceId: span.spanContext().traceId,
          spanId: span.spanContext().spanId,
          parentSpanId: '', // OpenTelemetry does not expose parentSpanId directly
          args: {}, // No args available in this scope
          result: result,
          isError: false,
        });

        return resp;
      } catch (err: any) {
        span.recordException(err);
        span.setStatus({ code: SpanStatusCode.ERROR });
        await sendToDynatraceLog({
          tool: 'list_vulnerabilities',
          traceId: span.spanContext().traceId,
          spanId: span.spanContext().spanId,
          parentSpanId: '', // OpenTelemetry does not expose parentSpanId directly
          args: {}, // No args available in this scope
          result: err.message,
          isError: true,
        });
        throw err;
      } finally {
        span.end();
      }
    });
  });

  tool('get_vulnerabilty_details', 'Get details of a vulnerability by `securityProblemId` on Dynatrace', {
    securityProblemId: z.string().optional(),
  }, async ({ securityProblemId }) => {
    const span = tracer.startSpan('get_vulnerabilty_details');
    return await context.with(trace.setSpan(context.active(), span), async () => {
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

        span.setStatus({ code: SpanStatusCode.OK });
        await sendToDynatraceLog({
          tool: 'get_vulnerabilty_details',
          traceId: span.spanContext().traceId,
          spanId: span.spanContext().spanId,
          parentSpanId: '', // OpenTelemetry does not expose parentSpanId directly
          args: { securityProblemId },
          result: resp,
          isError: false,
        });
        return resp;
      } catch (err: any) {
        span.recordException(err);
        span.setStatus({ code: SpanStatusCode.ERROR });
        await sendToDynatraceLog({
          tool: 'get_vulnerabilty_details',
          traceId: span.spanContext().traceId,
          spanId: span.spanContext().spanId,
          parentSpanId: '', // OpenTelemetry does not expose parentSpanId directly
          args: { securityProblemId },
          result: err.message,
          isError: true,
        });
        throw err;
      } finally {
        span.end();
      }
    });
  });
  tool('list_problems', 'List all problems known on Dynatrace', {}, async ({ }) => {
    const span = tracer.startSpan('list_problems');
    return await context.with(trace.setSpan(context.active(), span), async () => {
      try {
        const dtClient = await createOAuthClient(
          oauthClient,
          oauthClientSecret,
          dtEnvironment,
          scopesBase.concat('environment-api:problems:read'),
        );
        const result = await listProblems(dtClient);
        span.setStatus({ code: SpanStatusCode.OK });
        await sendToDynatraceLog({
          tool: 'list_problems',
          traceId: span.spanContext().traceId,
          spanId: span.spanContext().spanId,
          parentSpanId: '', // OpenTelemetry does not expose parentSpanId directly
          args: {}, // No args available in this scope
          result: result,
          isError: false,
        });
        return result.length === 0 ? 'No problems found' : `Found these problems: ${result.join(',')}`;
      } catch (err: any) {
        span.recordException(err);
        span.setStatus({ code: SpanStatusCode.ERROR });
        await sendToDynatraceLog({
          tool: 'list_problems',
          traceId: span.spanContext().traceId,
          spanId: span.spanContext().spanId,
          parentSpanId: '', // OpenTelemetry does not expose parentSpanId directly
          args: {}, // No args available in this scope
          result: err.message,
          isError: true,
        });
        throw err;
      } finally {
        span.end();
      }
    });
  });

  tool('get_problem_details', 'Get details of a problem on Dynatrace', {
    problemId: z.string().optional(),
  }, async ({ problemId }) => {
    const span = tracer.startSpan('get_problem_details');
    return await context.with(trace.setSpan(context.active(), span), async () => {
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

        span.setStatus({ code: SpanStatusCode.OK });
        await sendToDynatraceLog({
          tool: 'get_problem_details',
          traceId: span.spanContext().traceId,
          spanId: span.spanContext().spanId,
          parentSpanId: '', // OpenTelemetry does not expose parentSpanId directly
          args: { problemId },
          result: resp,
          isError: false,
        });
        return resp;
      } catch (err: any) {
        span.recordException(err);
        span.setStatus({ code: SpanStatusCode.ERROR });
        await sendToDynatraceLog({
          tool: 'get_problem_details',
          traceId: span.spanContext().traceId,
          spanId: span.spanContext().spanId,
          parentSpanId: '', // OpenTelemetry does not expose parentSpanId directly
          args: { problemId },
          result: err.message,
          isError: true,
        });
        throw err;
      } finally {
        span.end();
      }
    });
  });

  tool('find_entity_by_name', 'Get the entityId of a monitored entity based on the name', {
    entityName: z.string(),
  }, async ({ entityName }) => {
    const span = tracer.startSpan('find_entity_by_name');
    return await context.with(trace.setSpan(context.active(), span), async () => {
      try {
        const dtClient = await createOAuthClient(
          oauthClient,
          oauthClientSecret,
          dtEnvironment,
          scopesBase.concat('environment-api:entities:read', 'storage:entities:read'),
        );
        const entityResponse = await findMonitoredEntityByName(dtClient, entityName);
        span.setStatus({ code: SpanStatusCode.OK });
        await sendToDynatraceLog({
          tool: 'find_entity_by_name',
          traceId: span.spanContext().traceId,
          spanId: span.spanContext().spanId,
          parentSpanId: '', // OpenTelemetry does not expose parentSpanId directly
          args: { entityName },
          result: entityResponse,
          isError: false,
        });
        return entityResponse;
      } catch (err: any) {
        span.recordException(err);
        span.setStatus({ code: SpanStatusCode.ERROR });
        await sendToDynatraceLog({
          tool: 'find_entity_by_name',
          traceId: span.spanContext().traceId,
          spanId: span.spanContext().spanId,
          parentSpanId: '', // OpenTelemetry does not expose parentSpanId directly
          args: { entityName },
          result: err.message,
          isError: true,
        });
        throw err;
      } finally {
        span.end();
      }
    });
  });

  tool('get_entity_details', 'Get details of a monitored entity', {
    entityId: z.string().optional(),
  }, async ({ entityId }) => {
    const span = tracer.startSpan('get_entity_details');
    return await context.with(trace.setSpan(context.active(), span), async () => {
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

        span.setStatus({ code: SpanStatusCode.OK });
        await sendToDynatraceLog({
          tool: 'get_entity_details',
          traceId: span.spanContext().traceId,
          spanId: span.spanContext().spanId,
          parentSpanId: '', // OpenTelemetry does not expose parentSpanId directly
          args: { entityId },
          result: resp,
          isError: false,
        });
        return resp;
      } catch (err: any) {
        span.recordException(err);
        span.setStatus({ code: SpanStatusCode.ERROR });
        await sendToDynatraceLog({
          tool: 'get_entity_details',
          traceId: span.spanContext().traceId,
          spanId: span.spanContext().spanId,
          parentSpanId: '', // OpenTelemetry does not expose parentSpanId directly
          args: { entityId },
          result: err.message,
          isError: true,
        });
        throw err;
      } finally {
        span.end();
      }
    });
  });
  tool('send_slack_message', 'Sends a Slack message via Slack Connector on Dynatrace', {
    channel: z.string().optional(),
    message: z.string().optional(),
  }, async ({ channel, message }) => {
    const span = tracer.startSpan('send_slack_message');
    return await context.with(trace.setSpan(context.active(), span), async () => {
      try {
        const dtClient = await createOAuthClient(
          oauthClient,
          oauthClientSecret,
          dtEnvironment,
          scopesBase.concat('app-settings:objects:read'),
        );
        const response = await sendSlackMessage(dtClient, slackConnectionId, channel, message);
        span.setStatus({ code: SpanStatusCode.OK });
        await sendToDynatraceLog({
          tool: 'send_slack_message',
          traceId: span.spanContext().traceId,
          spanId: span.spanContext().spanId,
          parentSpanId: '', // OpenTelemetry does not expose parentSpanId directly
          args: { channel, message },
          result: response,
          isError: false,
        });
        return `Message sent to Slack channel: ${JSON.stringify(response)}`;
      } catch (err: any) {
        span.recordException(err);
        span.setStatus({ code: SpanStatusCode.ERROR });
        await sendToDynatraceLog({
          tool: 'send_slack_message',
          traceId: span.spanContext().traceId,
          spanId: span.spanContext().spanId,
          parentSpanId: '', // OpenTelemetry does not expose parentSpanId directly
          args: { channel, message },
          result: err.message,
          isError: true,
        });
        throw err;
      } finally {
        span.end();
      }
    });
  });

  tool('get_logs_for_entity', 'Get Logs for a monitored entity based on name of the entity', {
    entityName: z.string().optional(),
  }, async ({ entityName }) => {
    const span = tracer.startSpan('get_logs_for_entity');
    return await context.with(trace.setSpan(context.active(), span), async () => {
      try {
        const dtClient = await createOAuthClient(
          oauthClient,
          oauthClientSecret,
          dtEnvironment,
          scopesBase.concat('storage:logs:read'),
        );
        const logs = await getLogsForEntity(dtClient, entityName);
        span.setStatus({ code: SpanStatusCode.OK });
        await sendToDynatraceLog({
          tool: 'get_logs_for_entity',
          traceId: span.spanContext().traceId,
          spanId: span.spanContext().spanId,
          parentSpanId: '', // OpenTelemetry does not expose parentSpanId directly
          args: { entityName },
          result: logs,
          isError: false,
        });
        return `Logs:\n${JSON.stringify(logs?.map((logLine) => (logLine ? logLine.content : 'Empty log')))}`;
      } catch (err: any) {
        span.recordException(err);
        span.setStatus({ code: SpanStatusCode.ERROR });
        await sendToDynatraceLog({
          tool: 'get_logs_for_entity',
          traceId: span.spanContext().traceId,
          spanId: span.spanContext().spanId,
          parentSpanId: '', // OpenTelemetry does not expose parentSpanId directly
          args: { entityName },
          result: err.message,
          isError: true,
        });
        throw err;
      } finally {
        span.end();
      }
    });
  });

  tool('verify_dql', 'Verify a Dynatrace Query Language (DQL) statement', {
    dqlStatement: z.string(),
  }, async ({ dqlStatement }) => {
    const span = tracer.startSpan('verify_dql');
    return await context.with(trace.setSpan(context.active(), span), async () => {
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

        span.setStatus({ code: SpanStatusCode.OK });
        await sendToDynatraceLog({
          tool: 'verify_dql',
          traceId: span.spanContext().traceId,
          spanId: span.spanContext().spanId,
          parentSpanId: '', // OpenTelemetry does not expose parentSpanId directly
          args: { dqlStatement },
          result: resp,
          isError: false,
        });
        return resp;
      } catch (err: any) {
        span.recordException(err);
        span.setStatus({ code: SpanStatusCode.ERROR });
        await sendToDynatraceLog({
          tool: 'verify_dql',
          traceId: span.spanContext().traceId,
          spanId: span.spanContext().spanId,
          parentSpanId: '', // OpenTelemetry does not expose parentSpanId directly
          args: { dqlStatement },
          result: err.message,
          isError: true,
        });
        throw err;
      } finally {
        span.end();
      }
    });
  });

  tool('execute_dql', 'Execute a Dynatrace Query Language (DQL) statement', {
    dqlStatement: z.string(),
  }, async ({ dqlStatement }) => {
    const span = tracer.startSpan('execute_dql');
    return await context.with(trace.setSpan(context.active(), span), async () => {
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
        span.setStatus({ code: SpanStatusCode.OK });

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

        await sendToDynatraceLog({
          tool: 'execute_dql',
          traceId: span.spanContext().traceId,
          spanId: span.spanContext().spanId,
          parentSpanId: '', // OpenTelemetry does not expose parentSpanId directly
          args: { dqlStatement },
          result: response,
          isError: false,
        });

        return `DQL Response: ${JSON.stringify(response)}`;
      } catch (err: any) {
        span.recordException(err);
        span.setStatus({ code: SpanStatusCode.ERROR });
        await sendToDynatraceLog({
          tool: 'execute_dql',
          traceId: span.spanContext().traceId,
          spanId: span.spanContext().spanId,
          parentSpanId: '', // OpenTelemetry does not expose parentSpanId directly
          args: { dqlStatement },
          result: err.message,
          isError: true,
        });
        throw err;
      } finally {
        span.end();
      }
    });
  });

  tool('get_ownership', 'Get detailed Ownership information for entities', {
    entityIds: z.string().optional(),
  }, async ({ entityIds }) => {
    const span = tracer.startSpan('get_ownership');
    return await context.with(trace.setSpan(context.active(), span), async () => {
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
        span.setStatus({ code: SpanStatusCode.OK });
        if (!ownershipInformation || ownershipInformation.length === 0) {
          return 'No ownership information found for the provided entity IDs.';
        }
        await sendToDynatraceLog({
          tool: 'get_ownership',
          traceId: span.spanContext().traceId,
          spanId: span.spanContext().spanId,
          parentSpanId: '', // OpenTelemetry does not expose parentSpanId directly
          args: { entityIds },
          result: ownershipInformation,
          isError: false,
        });
        return 'Ownership information:\n' + JSON.stringify(ownershipInformation);
      } catch (err: any) {
        span.recordException(err);
        span.setStatus({ code: SpanStatusCode.ERROR });
        await sendToDynatraceLog({
          tool: 'get_ownership',
          traceId: span.spanContext().traceId,
          spanId: span.spanContext().spanId,
          parentSpanId: '', // OpenTelemetry does not expose parentSpanId directly
          args: { entityIds },
          result: err.message,
          isError: true,
        });
        throw err;
      } finally {
        span.end();
      }
    });
  });
  tool('get_kubernetes_events', 'Get all events from a specific Kubernetes (K8s) cluster', {
    clusterId: z.string().optional().describe(
      `The Kubernetes (K8s) Cluster Id, referred to as k8s.cluster.uid (this is NOT the Dynatrace environment)`
    ),
  }, async ({ clusterId }) => {
    const span = tracer.startSpan('get_kubernetes_events');
    return await context.with(trace.setSpan(context.active(), span), async () => {
      try {
        const dtClient = await createOAuthClient(
          oauthClient,
          oauthClientSecret,
          dtEnvironment,
          scopesBase.concat('storage:events:read'),
        );
        const events = await getEventsForCluster(dtClient, clusterId);
        span.setStatus({ code: SpanStatusCode.OK });
        await sendToDynatraceLog({
          tool: 'get_kubernetes_events',
          traceId: span.spanContext().traceId,
          spanId: span.spanContext().spanId,
          parentSpanId: '', // OpenTelemetry does not expose parentSpanId directly
          args: { clusterId },
          result: events,
          isError: false,
        });
        return `Kubernetes Events:\n${JSON.stringify(events)}`;
      } catch (err: any) {
        span.recordException(err);
        span.setStatus({ code: SpanStatusCode.ERROR });
        await sendToDynatraceLog({
          tool: 'get_kubernetes_events',
          traceId: span.spanContext().traceId,
          spanId: span.spanContext().spanId,
          parentSpanId: '', // OpenTelemetry does not expose parentSpanId directly
          args: { clusterId },
          result: err.message,
          isError: true,
        });
        throw err;
      } finally {
        span.end();
      }
    });
  });

  tool('create_workflow_for_notification', 'Create a notification workflow in Dynatrace', {
    problemType: z.string().optional(),
    teamName: z.string().optional(),
    channel: z.string().optional(),
    isPrivate: z.boolean().optional().default(false),
  }, async ({ problemType, teamName, channel, isPrivate }) => {
    const span = tracer.startSpan('create_workflow_for_notification');
    return await context.with(trace.setSpan(context.active(), span), async () => {
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

        span.setStatus({ code: SpanStatusCode.OK });
        await sendToDynatraceLog({
          tool: 'create_workflow_for_notification',
          traceId: span.spanContext().traceId,
          spanId: span.spanContext().spanId,
          parentSpanId: '', // OpenTelemetry does not expose parentSpanId directly
          args: { teamName, channel, problemType, isPrivate },
          result: response,
          isError: false,
        });
        return resp;
      } catch (err: any) {
        span.recordException(err);
        span.setStatus({ code: SpanStatusCode.ERROR });
        await sendToDynatraceLog({
          tool: 'create_workflow_for_notification',
          traceId: span.spanContext().traceId,
          spanId: span.spanContext().spanId,
          parentSpanId: '', // OpenTelemetry does not expose parentSpanId directly
          args: { teamName, channel, problemType, isPrivate },
          result: err.message,
          isError: true,
        });
        throw err;
      } finally {
        span.end();
      }
    });
  });

  tool('make_workflow_public', 'Make a workflow public on Dynatrace', {
    workflowId: z.string().optional(),
  }, async ({ workflowId }) => {
    const span = tracer.startSpan('make_workflow_public');
    return await context.with(trace.setSpan(context.active(), span), async () => {
      try {
        const dtClient = await createOAuthClient(
          oauthClient,
          oauthClientSecret,
          dtEnvironment,
          scopesBase.concat('automation:workflows:write', 'automation:workflows:read', 'automation:workflows:run'),
        );
        const response = await updateWorkflow(dtClient, workflowId, { isPrivate: false });
        span.setStatus({ code: SpanStatusCode.OK });
        await sendToDynatraceLog({
          tool: 'make_workflow_public',
          traceId: span.spanContext().traceId,
          spanId: span.spanContext().spanId,
          parentSpanId: '', // OpenTelemetry does not expose parentSpanId directly
          args: { workflowId },
          result: response,
          isError: false,
        });
        return `Workflow ${response.id} is now public!\nView it at: ${dtEnvironment}/ui/apps/dynatrace.automations/workflows/${response?.id}`;
      } catch (err: any) {
        span.recordException(err);
        span.setStatus({ code: SpanStatusCode.ERROR });
        await sendToDynatraceLog({
          tool: 'make_workflow_public',
          traceId: span.spanContext().traceId,
          spanId: span.spanContext().spanId,
          parentSpanId: '', // OpenTelemetry does not expose parentSpanId directly
          args: { workflowId },
          result: err.message,
          isError: true,
        });
        throw err;
      } finally {
        span.end();
      }
    });
  });

  // This will create dashboards for all the JSOn inside /dashboards folder
  tool(
    'create_dashboard',
    'Create a Dynatrace dashboard from the default dashboard JSON file. The dashboard name is auto-extracted from the JSON.',
    {},
    async () => {
      const span = tracer.startSpan('create_dashboard');
      return await context.with(trace.setSpan(context.active(), span), async () => {
        try {
          const path = require('path');
          const filePath = path.join(__dirname, '..', 'dashboards', 'Insightify_ Incident_MTTR_Snapshot.json');

          // Pass traceId to capability!
          const result = await createDashboard(
            filePath,
            span.spanContext().traceId // <-- Pass traceId
          );

          span.setStatus({ code: SpanStatusCode.OK });

          await sendToDynatraceLog({
            tool: 'create_dashboard',
            traceId: span.spanContext().traceId,
            spanId: span.spanContext().spanId,
            parentSpanId: '',
            args: { filePath },
            result,
            isError: false,
          });

          return `Dashboard created!\nID: ${result?.id}\nName: ${result?.name || "N/A"}`;
        } catch (err: any) {
          span.recordException(err);
          span.setStatus({ code: SpanStatusCode.ERROR });
          await sendToDynatraceLog({
            tool: 'create_dashboard',
            traceId: span.spanContext().traceId,
            spanId: span.spanContext().spanId,
            parentSpanId: '',
            args: {},
            result: err.message,
            isError: true,
          });
          throw err;
        } finally {
          span.end();
        }
      });
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
    const span = tracer.startSpan('share_document_env');
    return await context.with(trace.setSpan(context.active(), span), async () => {
      try {
        const dtClient = await createOAuthClient(
          oauthClient,
          oauthClientSecret,
          dtEnvironment,
          scopesBase.concat('document:environment-shares:write')
        );
        const result = await shareDocumentWithEnv(dtClient, documentId, access, span.spanContext().traceId);
        span.setStatus({ code: SpanStatusCode.OK });
        return `Shared document ${documentId} with '${access}' access. Share ID: ${result.id}`;
      } catch (err) {
        span.recordException(err as any);
        span.setStatus({ code: SpanStatusCode.ERROR });
        throw err;
      } finally {
        span.end();
      }
    });
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
    const span = tracer.startSpan('direct_share_document');
    return await context.with(trace.setSpan(context.active(), span), async () => {
      try {
        const dtClient = await createOAuthClient(
          oauthClient,
          oauthClientSecret,
          dtEnvironment,
          scopesBase.concat('document:direct-shares:write')
        );
        const result = await directShareDocument(dtClient, documentId, access, span.spanContext().traceId);
        span.setStatus({ code: SpanStatusCode.OK });
        return `Direct-shared document ${documentId} as ${access} with recipients from env.`;
      } catch (err) {
        span.recordException(err as any);
        span.setStatus({ code: SpanStatusCode.ERROR });
        throw err;
      } finally {
        span.end();
      }
    });
  }
);


  const transport = new StdioServerTransport();
  console.log('Connecting server to transport...');
  await server.connect(transport);
  console.log('Dynatrace MCP Server running on stdio');
};

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
