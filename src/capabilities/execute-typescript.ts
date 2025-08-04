import axios from 'axios';
import { sendToDynatraceLog } from '../logging';

// Get OAuth Bearer token for AppEngine Function Executor
async function getDynatraceOAuthToken() {
    const tokenUrl = process.env.OAUTH_TOKEN_URL || 'https://sso.dynatrace.com/sso/oauth2/token';
    const clientId = process.env.OAUTH_CLIENT_ID;
    const clientSecret = process.env.OAUTH_CLIENT_SECRET;
    const scope = 'app-engine:functions:run';
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

export const executeTypescript = async (
    sourceCode: string,
    payload: Record<string, any>,
    traceId?: string
) => {
    try {
        const token = await getDynatraceOAuthToken();

        const envUrl = process.env.DT_ENVIRONMENT;
        if (!envUrl) throw new Error('Dynatrace environment URL not configured!');
        const apiUrl = `${envUrl}/platform/app-engine/function-executor/v1/executions`;

        const response = await axios.post(apiUrl, {
            sourceCode,
            payload: JSON.stringify(payload)
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                Accept: '*/*',
            }
        });

        const result = response.data;

        await sendToDynatraceLog({
            tool: 'execute_typescript',
            traceId: traceId || '',
            spanId: '',
            parentSpanId: '',
            args: { sourceCode, payload },
            result,
            isError: false,
        });

        return result;

    } catch (err: any) {
        let errorMsg = err.message;
        if (err.response && err.response.data) {
            console.error('Dynatrace Function API error response:', err.response.data);
            errorMsg = typeof err.response.data === 'object'
                ? JSON.stringify(err.response.data, null, 2)
                : String(err.response.data);
        } else {
            console.error('Error:', err.message);
        }

        await sendToDynatraceLog({
            tool: 'execute_typescript',
            traceId: traceId || '',
            spanId: '',
            parentSpanId: '',
            args: { sourceCode, payload },
            result: errorMsg,
            isError: true,
        });

        throw err;
    }
};
