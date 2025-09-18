import { getDynatraceEnv, DynatraceEnv } from './getDynatraceEnv';

describe('getDynatraceEnv', () => {
  const baseEnv = {
    OAUTH_CLIENT_ID: 'dt0s02.SAMPLE',
    OAUTH_CLIENT_SECRET: 'dt0s02.SAMPLE.abcd1234',
    DT_ENVIRONMENT: 'https://abc123.apps.dynatrace.com',
    SLACK_CONNECTION_ID: 'slack-conn-id',
    DT_PLATFORM_TOKEN: 'dt0c01.SAMPLE.platform-token',
  };

  it('returns all required values when environment is valid', () => {
    const env = { ...baseEnv };
    const result = getDynatraceEnv(env);
    expect(result).toEqual({
      oauthClient: env.OAUTH_CLIENT_ID,
      oauthClientSecret: env.OAUTH_CLIENT_SECRET,
      dtEnvironment: env.DT_ENVIRONMENT,
      dtPlatformEnvironment: env.DT_ENVIRONMENT, // same as dtEnvironment when not explicitly set
      slackConnectionId: env.SLACK_CONNECTION_ID,
      dtPlatformToken: env.DT_PLATFORM_TOKEN,
      grailBudgetGB: 1000, // default value
      mcpTelemetryEndpointUrl: undefined,
      mcpTelemetryApplicationId: undefined,
      mcpTelemetryDeviceId: undefined,
      mcpDisableTelemetry: false, // default value
    });
  });

  it('auto-derives dtPlatformEnvironment from live.dynatrace.com to apps.dynatrace.com', () => {
    const env = { ...baseEnv, DT_ENVIRONMENT: 'https://abc123.live.dynatrace.com' };
    const result = getDynatraceEnv(env);
    expect(result.dtEnvironment).toBe('https://abc123.live.dynatrace.com');
    expect(result.dtPlatformEnvironment).toBe('https://abc123.apps.dynatrace.com');
  });

  it('uses explicit DT_PLATFORM_ENVIRONMENT when set', () => {
    const env = {
      ...baseEnv,
      DT_ENVIRONMENT: 'https://abc123.live.dynatrace.com',
      DT_PLATFORM_ENVIRONMENT: 'https://xyz789.apps.dynatrace.com',
    };
    const result = getDynatraceEnv(env);
    expect(result.dtEnvironment).toBe('https://abc123.live.dynatrace.com');
    expect(result.dtPlatformEnvironment).toBe('https://xyz789.apps.dynatrace.com');
  });

  it('uses default slackConnectionId if not set', () => {
    const env = { ...baseEnv, SLACK_CONNECTION_ID: undefined };
    const result = getDynatraceEnv(env);
    expect(result.slackConnectionId).toBe('fake-slack-connection-id');
  });

  it('works with Platform Token only (OAuth not required)', () => {
    const env = {
      ...baseEnv,
      OAUTH_CLIENT_ID: undefined,
      OAUTH_CLIENT_SECRET: undefined,
    };
    const result = getDynatraceEnv(env);
    expect(result.dtPlatformToken).toBe(env.DT_PLATFORM_TOKEN);
    expect(result.oauthClient).toBeUndefined();
    expect(result.oauthClientSecret).toBeUndefined();
  });

  it('works with OAuth only (Platform Token not required)', () => {
    const env = {
      ...baseEnv,
      DT_PLATFORM_TOKEN: undefined,
    };
    const result = getDynatraceEnv(env);
    expect(result.oauthClient).toBe(env.OAUTH_CLIENT_ID);
    expect(result.oauthClientSecret).toBe(env.OAUTH_CLIENT_SECRET);
    expect(result.dtPlatformToken).toBeUndefined();
  });

  it('throws if DT_ENVIRONMENT is missing', () => {
    const env = { ...baseEnv, DT_ENVIRONMENT: undefined };
    expect(() => getDynatraceEnv(env)).toThrow(/DT_ENVIRONMENT/);
  });

  it('throws if both Platform Token and OAuth credentials are missing', () => {
    const env = {
      ...baseEnv,
      DT_PLATFORM_TOKEN: undefined,
      OAUTH_CLIENT_ID: undefined,
      OAUTH_CLIENT_SECRET: undefined,
    };
    expect(() => getDynatraceEnv(env)).toThrow(/DT_PLATFORM_TOKEN.*OAUTH_CLIENT_ID.*OAUTH_CLIENT_SECRET/);
  });

  it('throws if OAuth is incomplete (missing client secret)', () => {
    const env = {
      ...baseEnv,
      DT_PLATFORM_TOKEN: undefined,
      OAUTH_CLIENT_SECRET: undefined,
    };
    expect(() => getDynatraceEnv(env)).toThrow(/DT_PLATFORM_TOKEN.*OAUTH_CLIENT_ID.*OAUTH_CLIENT_SECRET/);
  });

  it('throws if DT_ENVIRONMENT does not start with https://', () => {
    const env = {
      ...baseEnv,
      DT_ENVIRONMENT: 'http://abc123.apps.dynatrace.com',
    };
    expect(() => getDynatraceEnv(env)).toThrow(/https:\/\//);
  });

  it('throws if DT_ENVIRONMENT is not a valid Dynatrace domain', () => {
    const env = { ...baseEnv, DT_ENVIRONMENT: 'https://abc123.example.com' };
    expect(() => getDynatraceEnv(env)).toThrow(/valid Dynatrace Environment URL/);
  });

  it('accepts DT_ENVIRONMENT with live.dynatrace.com', () => {
    const env = {
      ...baseEnv,
      DT_ENVIRONMENT: 'https://abc123.live.dynatrace.com',
    };
    const result = getDynatraceEnv(env);
    expect(result.dtEnvironment).toBe('https://abc123.live.dynatrace.com');
    expect(result.dtPlatformEnvironment).toBe('https://abc123.apps.dynatrace.com'); // auto-derived
  });

  it('accepts DT_ENVIRONMENT with apps.dynatracelabs.com', () => {
    const env = {
      ...baseEnv,
      DT_ENVIRONMENT: 'https://xyz789.apps.dynatracelabs.com',
    };
    expect(() => getDynatraceEnv(env)).not.toThrow();
  });

  it('accepts DT_ENVIRONMENT with apps.dynatrace.com', () => {
    const env = {
      ...baseEnv,
      DT_ENVIRONMENT: 'https://env123.apps.dynatrace.com',
    };
    expect(() => getDynatraceEnv(env)).not.toThrow();
  });
});
