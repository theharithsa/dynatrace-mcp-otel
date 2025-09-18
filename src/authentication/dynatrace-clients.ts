import {
  _OAuthHttpClient,
  HttpClientRequestOptions,
  HttpClientResponse,
  RequestBodyTypes,
  HttpClient,
  PlatformHttpClient,
} from '@dynatrace-sdk/http-client';
import { getSSOUrl } from 'dt-app';
import { getUserAgent } from '../utils/user-agent';
import { OAuthTokenResponse } from './types';

/**
 * Uses the provided oauth Client ID and Secret and requests a token via client-credentials flow
 * @param clientId - OAuth Client ID for Dynatrace
 * @param clientSecret - Oauth Client Secret for Dynatrace
 * @param ssoAuthUrl - SSO Authentication URL
 * @param scopes - List of requested scopes
 * @returns
 */
const requestToken = async (
  clientId: string,
  clientSecret: string,
  ssoAuthUrl: string,
  scopes: string[],
): Promise<OAuthTokenResponse> => {
  const res = await fetch(ssoAuthUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      scope: scopes.join(' '),
    }),
  });
  // check if the response was okay (HTTP 2xx) or not (HTTP 4xx or 5xx)
  if (!res.ok) {
    // log the error
    console.error(`Failed to fetch token: ${res.status} ${res.statusText}`);
  }
  // and return the JSON result, as it contains additional information
  return await res.json();
};

/**
 * ExtendedOAuthClient that takes parameters for clientId, secret, scopes, environmentUrl, authUrl, and the version of the dynatrace-mcp-server
 */
export class ExtendedOauthClient extends _OAuthHttpClient {
  constructor(
    config: {
      clientId: string;
      secret: string;
      scopes: string[];
      environmentUrl: string;
      authUrl: string;
    },
    protected userAgent: string,
  ) {
    super(config);
  }

  send<T extends keyof RequestBodyTypes = 'json'>(options: HttpClientRequestOptions<T>): Promise<HttpClientResponse> {
    // add the user-agent header to the request
    options.headers = {
      ...options.headers,
      'User-Agent': this.userAgent,
    };
    // call the parent send method
    return super.send(options);
  }
}

export const createDtHttpClient = async (
  environmentUrl: string,
  scopes: string[],
  clientId?: string,
  clientSecret?: string,
  dtPlatformToken?: string,
): Promise<HttpClient> => {
  // Prefer Platform Token over OAuth
  if (dtPlatformToken) {
    // create a simple HTTP client if platform token is provided (primary method)
    return createBearerTokenHttpClient(environmentUrl, dtPlatformToken);
  }
  if (clientId && clientSecret) {
    // create an OAuth client if clientId and clientSecret are provided (fallback method)
    return createOAuthClient(clientId, clientSecret, environmentUrl, scopes);
  }
  throw new Error(
    'Failed to create Dynatrace HTTP Client: Please provide either dtPlatformToken (recommended) or both clientId and clientSecret',
  );
};

/** Creates an HTTP Client based on environmentUrl and a platform token */
const createBearerTokenHttpClient = async (environmentUrl: string, dtPlatformToken: string): Promise<HttpClient> => {
  return new PlatformHttpClient({
    baseUrl: environmentUrl,
    defaultHeaders: {
      'Authorization': `Bearer ${dtPlatformToken}`,
      'User-Agent': getUserAgent(),
    },
  });
};

/** Create an Oauth Client based on clientId, clientSecret, environmentUrl and scopes
 * This uses a client-credentials flow to request a token from the SSO endpoint.
 */
export const createOAuthClient = async (
  clientId: string,
  clientSecret: string,
  environmentUrl: string,
  scopes: string[],
): Promise<_OAuthHttpClient> => {
  if (!clientId) {
    throw new Error('Failed to retrieve OAuth client id from env "DT_APP_OAUTH_CLIENT_ID"');
  }
  if (!clientSecret) {
    throw new Error('Failed to retrieve OAuth client secret from env "DT_APP_OAUTH_CLIENT_SECRET"');
  }
  if (!environmentUrl) {
    throw new Error('Failed to retrieve environment URL from env "DT_ENVIRONMENT"');
  }

  console.error(
    `Trying to authenticate API Calls to ${environmentUrl} via OAuthClientId ${clientId} with the following scopes: ${scopes.join(', ')}`,
  );

  const ssoBaseUrl = await getSSOUrl(environmentUrl);
  const ssoAuthUrl = new URL('/sso/oauth2/token', ssoBaseUrl).toString();
  console.error(`Using SSO auth URL: ${ssoAuthUrl}`);

  // try to request a token, just to verify that everything is set up correctly
  const tokenResponse = await requestToken(clientId, clientSecret, ssoAuthUrl, scopes);

  // in case we didn't get a token, or error / error_description / issueId is set, we throw an error
  if (!tokenResponse.access_token || tokenResponse.error || tokenResponse.error_description || tokenResponse.issueId) {
    throw new Error(
      `Failed to retrieve OAuth token (IssueId: ${tokenResponse.issueId}): ${tokenResponse.error} - ${tokenResponse.error_description}. Note: Your OAuth client is most likely not configured correctly and/or is missing scopes.`,
    );
  }
  console.error(`Successfully retrieved token from SSO!`);

  const userAgent = getUserAgent();

  return new ExtendedOauthClient(
    {
      scopes,
      clientId,
      secret: clientSecret,
      environmentUrl,
      authUrl: ssoAuthUrl,
    },
    userAgent,
  );
};
