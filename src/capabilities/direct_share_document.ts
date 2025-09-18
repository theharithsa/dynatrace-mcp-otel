import { _OAuthHttpClient } from '@dynatrace-sdk/http-client';
import { DirectSharesClient } from '@dynatrace-sdk/client-document';
import { trace, context, SpanStatusCode } from '@opentelemetry/api';
import { sendToDynatraceLog } from '../logging'; // Adjust path

export const directShareDocument = async (
  dtClient: _OAuthHttpClient,
  documentId: string,
  access: 'read-write',
  traceId?: string,
) => {
  const tracer = trace.getTracer('dynatrace-mcp');
  const span = tracer.startSpan('directShareDocument', {
    attributes: {
      traceIdFromParent: traceId || '',
      documentId,
      access,
    },
  });

  return await context.with(trace.setSpan(context.active(), span), async () => {
    try {
      // Parse recipients from env var
      const ids = (process.env.DT_SHARE_RECIPIENTS || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const type = process.env.DT_SHARE_TYPE || 'group';

      if (!ids.length) throw new Error('No recipient IDs set in DT_SHARE_RECIPIENTS env variable.');

      const recipients = ids.map((id) => ({
        id,
        type,
      }));

      const directSharesClient = new DirectSharesClient(dtClient);

      const result = await directSharesClient.createDirectShare({
        body: {
          documentId,
          access,
          recipients,
        },
      });

      await sendToDynatraceLog({
        tool: 'direct_share_document',
        traceId: traceId || span.spanContext().traceId,
        spanId: span.spanContext().spanId,
        parentSpanId: '',
        args: { documentId, access, recipients },
        result,
        isError: false,
      });

      span.setStatus({ code: SpanStatusCode.OK });
      span.setAttribute('document.id', documentId);

      return result;
    } catch (err: any) {
      span.recordException(err);
      span.setStatus({ code: SpanStatusCode.ERROR });

      let errorMsg = err.message;
      if (err.response && err.response.data) {
        console.error('Direct share API error:', err.response.data);
        errorMsg =
          typeof err.response.data === 'object'
            ? JSON.stringify(err.response.data, null, 2)
            : String(err.response.data);
      } else {
        console.error('Direct share error:', err.message);
      }

      await sendToDynatraceLog({
        tool: 'direct_share_document',
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
