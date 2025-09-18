import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import { sendToDynatraceLog } from '../logging'; // Adjust path if needed

// Helper to get OAuth Bearer token (matches your cURL)
async function getDynatraceOAuthToken() {
  const tokenUrl = process.env.OAUTH_TOKEN_URL || 'https://sso.dynatrace.com/sso/oauth2/token';
  const clientId = process.env.OAUTH_CLIENT_ID;
  const clientSecret = process.env.OAUTH_CLIENT_SECRET;
  const scope = 'document:documents:write';
  const resource = process.env.OAUTH_URN;

  if (!clientId || !clientSecret || !resource) {
    throw new Error('Missing OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, or OAUTH_URN environment variable.');
  }

  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('scope', scope);
  params.append('resource', resource);

  const response = await axios.post(tokenUrl, params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  return response.data.access_token;
}

export const createDashboard = async (
  filePath: string,
  traceId?: string,
  type: string = 'dashboard',
  description?: string,
  externalId?: string,
) => {
  try {
    // Read file as Buffer (binary) for upload
    const fileBuffer = await fs.readFile(filePath);

    // Parse name from JSON, fallback to filename
    let name: string;
    try {
      const fileString = fileBuffer.toString('utf-8');
      const dashboardJson = JSON.parse(fileString);
      name = dashboardJson?.dashboardMetadata?.name || path.basename(filePath);
    } catch {
      name = path.basename(filePath);
    }

    // Get the OAuth Bearer token (via HTTP request)
    const token = await getDynatraceOAuthToken();

    // Get Dynatrace platform environment URL for document API
    const envUrl = process.env.DT_PLATFORM_ENVIRONMENT || process.env.DT_ENVIRONMENT;
    if (!envUrl) throw new Error('Dynatrace platform environment URL not configured!');
    const apiUrl = `${envUrl}/platform/document/v1/documents`;

    // Prepare FormData for multipart upload
    const form = new FormData();
    form.append('content', fileBuffer, {
      filename: path.basename(filePath),
      contentType: 'application/json',
    });
    form.append('name', name);
    form.append('type', type);
    if (description) form.append('description', description);
    if (externalId) form.append('externalId', externalId);

    // Axios POST request for document upload
    const response = await axios.post(apiUrl, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      maxBodyLength: Infinity,
    });

    const result = response.data;

    // Log success
    await sendToDynatraceLog({
      tool: 'create_dashboard',
      traceId: traceId || '',
      spanId: '',
      parentSpanId: '',
      args: { filePath, name, type, description, externalId },
      result,
      isError: false,
    });

    return result;
  } catch (err: any) {
    // Log only the API error message, never the whole error object
    let errorMsg = err.message;
    if (err.response && err.response.data) {
      console.error('Dynatrace API error response:', err.response.data);
      errorMsg =
        typeof err.response.data === 'object' ? JSON.stringify(err.response.data, null, 2) : String(err.response.data);
    } else {
      console.error('Error:', err.message);
    }

    await sendToDynatraceLog({
      tool: 'create_dashboard',
      traceId: traceId || '',
      spanId: '',
      parentSpanId: '',
      args: { filePath, type, description, externalId },
      result: errorMsg,
      isError: true,
    });

    throw err;
  }
};
