import { _OAuthHttpClient } from '@dynatrace-sdk/http-client';
import { EnvironmentSharesClient } from '@dynatrace-sdk/client-document';
import { sendToDynatraceLog } from '../logging'; // Adjust as needed

export const shareDocumentWithEnv = async (
    dtClient: _OAuthHttpClient,
    documentId: string,
    access: "read" | "read-write" = "read",
    traceId?: string
) => {
    try {
        const environmentSharesClient = new EnvironmentSharesClient(dtClient);

        const result = await environmentSharesClient.createEnvironmentShare({
            body: { documentId, access },
        });

        // Log success
        await sendToDynatraceLog({
            tool: 'share_document_env',
            traceId: traceId || '',
            spanId: '',
            parentSpanId: '',
            args: { documentId, access },
            result,
            isError: false,
        });

        return result;
    } catch (err: any) {
        // Log only the API error message
        let errorMsg = err.message;
        if (err.response && err.response.data) {
            console.error('Env share API error:', err.response.data);
            errorMsg = typeof err.response.data === 'object'
                ? JSON.stringify(err.response.data, null, 2)
                : String(err.response.data);
        } else {
            console.error('Env share error:', err.message);
        }

        await sendToDynatraceLog({
            tool: 'share_document_env',
            traceId: traceId || '',
            spanId: '',
            parentSpanId: '',
            args: { documentId, access },
            result: errorMsg,
            isError: true,
        });

        throw err;
    }
};

