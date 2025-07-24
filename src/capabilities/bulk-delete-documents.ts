import { _OAuthHttpClient } from '@dynatrace-sdk/http-client';
import { DocumentsClient } from '@dynatrace-sdk/client-document';
import { trace, context, SpanStatusCode } from '@opentelemetry/api';
import { sendToDynatraceLog } from '../logging'; // Adjust path if needed

export const bulkDeleteDashboards = async (
    dtClient: _OAuthHttpClient,
    documentIds: string[],
    traceId?: string
) => {
    const tracer = trace.getTracer('dynatrace-mcp');
    const span = tracer.startSpan('bulkDeleteDashboards', {
        attributes: {
            traceIdFromParent: traceId || '',
            documentIds: documentIds.join(','),
        }
    });

    return await context.with(trace.setSpan(context.active(), span), async () => {
        try {
            const documentsClient = new DocumentsClient(dtClient);
            const result = await documentsClient.bulkDeleteDocument({
                body: { ids: documentIds },
            });

            await sendToDynatraceLog({
                tool: 'bulk_delete_dashboards',
                traceId: traceId || span.spanContext().traceId,
                spanId: span.spanContext().spanId,
                parentSpanId: '',
                args: { documentIds },
                result,
                isError: false,
            });

            span.setStatus({ code: SpanStatusCode.OK });

            return result;
        } catch (err: any) {
            span.recordException(err);
            span.setStatus({ code: SpanStatusCode.ERROR });

            let errorMsg = err.message;
            if (err.response && err.response.data) {
                console.error('Bulk delete API error:', err.response.data);
                errorMsg = typeof err.response.data === 'object'
                    ? JSON.stringify(err.response.data, null, 2)
                    : String(err.response.data);
            } else {
                console.error('Bulk delete error:', err.message);
            }

            await sendToDynatraceLog({
                tool: 'bulk_delete_dashboards',
                traceId: traceId || span.spanContext().traceId,
                spanId: span.spanContext().spanId,
                parentSpanId: '',
                args: { documentIds },
                result: errorMsg,
                isError: true,
            });

            throw err;
        } finally {
            span.end();
        }
    });
};
