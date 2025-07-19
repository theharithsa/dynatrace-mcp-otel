import { getDynatraceEnv, DynatraceEnv } from './getDynatraceEnv';

describe('getDynatraceEnv', () => {
  const baseEnv = {
    OAUTH_CLIENT_ID: 'dt0s02.SAMPLE',
    OAUTH_CLIENT_SECRET: 'dt0s02.SAMPLE.abcd1234',
    DT_ENVIRONMENT: 'https://abc123.apps.dynatrace.com',
    SLACK_CONNECTION_ID: 'slack-conn-id',
  };

  it('returns all required values when environment is valid', () => {
    const env = { ...baseEnv };
    const result = getDynatraceEnv(env);
    expect(result).toEqual({
      oauthClient: env.OAUTH_CLIENT_ID,
      oauthClientSecret: env.OAUTH_CLIENT_SECRET,
      dtEnvironment: env.DT_ENVIRONMENT,
      slackConnectionId: env.SLACK_CONNECTION_ID,
    });
  });

  it('uses default slackConnectionId if not set', () => {
    const env = { ...baseEnv, SLACK_CONNECTION_ID: undefined };
    const result = getDynatraceEnv(env);
    expect(result.slackConnectionId).toBe('fake-slack-connection-id');
  });

  it('throws if OAUTH_CLIENT_ID is missing', () => {
    const env = { ...baseEnv, OAUTH_CLIENT_ID: undefined };
    expect(() => getDynatraceEnv(env)).toThrow(/OAUTH_CLIENT_ID/);
  });

  it('throws if OAUTH_CLIENT_SECRET is missing', () => {
    const env = { ...baseEnv, OAUTH_CLIENT_SECRET: undefined };
    expect(() => getDynatraceEnv(env)).toThrow(/OAUTH_CLIENT_SECRET/);
  });

  it('throws if DT_ENVIRONMENT is missing', () => {
    const env = { ...baseEnv, DT_ENVIRONMENT: undefined };
    expect(() => getDynatraceEnv(env)).toThrow(/DT_ENVIRONMENT/);
  });

  it('throws if DT_ENVIRONMENT does not start with https://', () => {
    const env = {
      ...baseEnv,
      DT_ENVIRONMENT: 'http://abc123.apps.dynatrace.com',
    };
    expect(() => getDynatraceEnv(env)).toThrow(/https:\/\//);
  });

  it('throws if DT_ENVIRONMENT is not a Dynatrace Platform URL (any URL)', () => {
    const env = { ...baseEnv, DT_ENVIRONMENT: 'https://abc123.example.com' };
    expect(() => getDynatraceEnv(env)).toThrow(/Dynatrace Platform Environment URL/);
  });

  it('throws if DT_ENVIRONMENT is not a Dynatrace Platform URL (contains live)', () => {
    const env = {
      ...baseEnv,
      DT_ENVIRONMENT: 'https://abc123.live.dynatrace.com',
    };
    expect(() => getDynatraceEnv(env)).toThrow(/Dynatrace Platform Environment URL/);
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
