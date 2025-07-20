// src/logging.ts
import fetch from 'node-fetch';

const LOG_INGEST_URL = process.env.DYNATRACE_LOG_INGEST_URL!;
const LOG_INGEST_TOKEN = process.env.DYNATRACE_API_TOKEN!;

export async function sendToDynatraceLog({
  tool,
  traceId,
  spanId,
  parentSpanId,
  args,
  headers,
  result,
  isError,
}: {
  tool: string,
  traceId: string,
  spanId: string,
  parentSpanId?: string,
  args: any,
  headers?: any,
  result: any,
  isError?: boolean,
}) {
  const payload = [{
    content: JSON.stringify({ tool, args, headers, result }, null, 2),
    timestamp: Date.now(),
    level: isError ? 'ERROR' : 'INFO',
    service: 'dynatrace-mcp-server',
    trace_id: traceId,
    span_id: spanId,
    parent_span_id: parentSpanId ?? '',
  }];
  try {
    await fetch(LOG_INGEST_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Api-Token ${LOG_INGEST_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (e: any) {
    console.error('[DT_LOG_INGEST] Error:', e.message);
  }
}
