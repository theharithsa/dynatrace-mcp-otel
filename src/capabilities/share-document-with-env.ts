import { _OAuthHttpClient } from '@dynatrace-sdk/http-client';
import { EnvironmentSharesClient } from '@dynatrace-sdk/client-document';
import { trace, context, SpanStatusCode } from '@opentelemetry/api';
import { sendToDynatraceLog } from '../logging'; // Adjust as needed

export const shareDocumentWithEnv = async (
    dtClient: _OAuthHttpClient,
    documentId: string,
    access: "read" | "read-write" = "read",
    traceId?: string
) => {
    const tracer = trace.getTracer('dynatrace-mcp');
    const span = tracer.startSpan('shareDocumentWithEnv', {
        attributes: {
            traceIdFromParent: traceId || '',
            documentId,
            access,
        }
    });

    return await context.with(trace.setSpan(context.active(), span), async () => {
        try {
            const environmentSharesClient = new EnvironmentSharesClient(dtClient);

            const result = await environmentSharesClient.createEnvironmentShare({
                body: { documentId, access },
            });

            // Log success
            await sendToDynatraceLog({
                tool: 'share_document_env',
                traceId: traceId || span.spanContext().traceId,
                spanId: span.spanContext().spanId,
                parentSpanId: '',
                args: { documentId, access },
                result,
                isError: false,
            });

            span.setStatus({ code: SpanStatusCode.OK });
            span.setAttribute('document.id', result?.documentId || '');
            span.setAttribute('share.access', access);

            return result;
        } catch (err: any) {
            span.recordException(err);
            span.setStatus({ code: SpanStatusCode.ERROR });

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
                traceId: traceId || span.spanContext().traceId,
                spanId: span.spanContext().spanId,
                parentSpanId: '',
                args: { documentId, access },
                result: errorMsg,
                isError: true,
            });

            throw err;
        } finally {
            span.end();
        }
    });
};
