// Helper to validate and extract required environment variables for Dynatrace MCP
export interface DynatraceEnv {
  oauthClient?: string;
  oauthClientSecret?: string;
  dtEnvironment: string;
  dtPlatformEnvironment: string;
  slackConnectionId: string;
  dtPlatformToken?: string;
  grailBudgetGB: number;
  // OpenKit Telemetry Configuration
  mcpTelemetryEndpointUrl?: string;
  mcpTelemetryApplicationId?: string;
  mcpTelemetryDeviceId?: string;
  mcpDisableTelemetry: boolean;
}

/**
 * Reads and validates required environment variables for Dynatrace MCP.
 * Supports Platform Token (primary) or OAuth Client Credentials (fallback).
 * Throws an Error if validation fails.
 */
export function getDynatraceEnv(env: NodeJS.ProcessEnv = process.env): DynatraceEnv {
  const oauthClient = env.OAUTH_CLIENT_ID;
  const oauthClientSecret = env.OAUTH_CLIENT_SECRET;
  const dtEnvironment = env.DT_ENVIRONMENT;
  const dtPlatformEnvironment = env.DT_PLATFORM_ENVIRONMENT;
  const slackConnectionId = env.SLACK_CONNECTION_ID || 'fake-slack-connection-id';
  const dtPlatformToken = env.DT_PLATFORM_TOKEN;
  const grailBudgetGB = parseFloat(env.DT_GRAIL_QUERY_BUDGET_GB || '1000'); // Default to 1000 GB

  // OpenKit Telemetry Configuration
  const mcpTelemetryEndpointUrl = env.DT_MCP_TELEMETRY_ENDPOINT_URL;
  const mcpTelemetryApplicationId = env.DT_MCP_TELEMETRY_APPLICATION_ID;
  const mcpTelemetryDeviceId = env.DT_MCP_TELEMETRY_DEVICE_ID;
  const mcpDisableTelemetry = env.DT_MCP_DISABLE_TELEMETRY === 'true';

  if (!dtEnvironment) {
    throw new Error('Please set DT_ENVIRONMENT environment variable');
  }

  // Auto-derive dtPlatformEnvironment from dtEnvironment if not explicitly set
  const finalDtPlatformEnvironment =
    dtPlatformEnvironment ||
    (dtEnvironment.includes('live.dynatrace.com') ? dtEnvironment.replace('live.', 'apps.') : dtEnvironment);

  // Require either Platform Token OR OAuth credentials
  if (!dtPlatformToken && (!oauthClient || !oauthClientSecret)) {
    throw new Error(
      'Please set either DT_PLATFORM_TOKEN (recommended) or both OAUTH_CLIENT_ID and OAUTH_CLIENT_SECRET environment variables',
    );
  }

  // Validate Grail budget
  if (isNaN(grailBudgetGB) || (grailBudgetGB <= 0 && grailBudgetGB !== -1)) {
    throw new Error(
      'DT_GRAIL_QUERY_BUDGET_GB must be a positive number representing GB budget for Grail queries or -1 for unlimited',
    );
  }

  if (!dtEnvironment.startsWith('https://')) {
    throw new Error(
      'Please set DT_ENVIRONMENT to a valid Dynatrace Environment URL (e.g., https://<environment-id>.live.dynatrace.com)',
    );
  }

  // Validate that DT_ENVIRONMENT is a valid Dynatrace domain
  if (!dtEnvironment.includes('.dynatrace.com') && !dtEnvironment.includes('.dynatracelabs.com')) {
    throw new Error(
      'Please set DT_ENVIRONMENT to a valid Dynatrace Environment URL (e.g., https://<environment-id>.live.dynatrace.com or https://<environment-id>.apps.dynatrace.com)',
    );
  }

  if (!finalDtPlatformEnvironment.startsWith('https://')) {
    throw new Error(
      'Please set DT_PLATFORM_ENVIRONMENT to a valid Dynatrace Platform Environment URL (e.g., https://<environment-id>.apps.dynatrace.com)',
    );
  }

  // Validate that DT_PLATFORM_ENVIRONMENT is a valid Dynatrace platform domain
  if (
    !finalDtPlatformEnvironment.includes('apps.dynatrace.com') &&
    !finalDtPlatformEnvironment.includes('apps.dynatracelabs.com')
  ) {
    throw new Error(
      'Please set DT_PLATFORM_ENVIRONMENT to a valid Dynatrace Platform Environment URL (e.g., https://<environment-id>.apps.dynatrace.com)',
    );
  }

  return {
    oauthClient,
    oauthClientSecret,
    dtEnvironment,
    dtPlatformEnvironment: finalDtPlatformEnvironment,
    slackConnectionId,
    dtPlatformToken,
    grailBudgetGB,
    mcpTelemetryEndpointUrl,
    mcpTelemetryApplicationId,
    mcpTelemetryDeviceId,
    mcpDisableTelemetry,
  };
}
