const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-proto');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

/**
 * Send a trace span to Dynatrace using the same method as otel.ts
 */
async function sendTrace(endpoint, apiToken, spanData) {
  try {
    const exporter = new OTLPTraceExporter({
      url: endpoint,
      headers: {
        Authorization: `Api-Token ${apiToken}`,
      },
    });

    // Create resource spans in the format expected by OTLP
    const resourceSpans = {
      resource: {
        attributes: [
          { key: 'service.name', value: { stringValue: spanData.serviceName || 'dynatrace-mcp-server-build' } },
          { key: 'telemetry.sdk.name', value: { stringValue: 'opentelemetry' } },
          { key: 'telemetry.sdk.language', value: { stringValue: 'nodejs' } },
          { key: 'telemetry.sdk.version', value: { stringValue: '1.0.0' } },
          ...(spanData.resourceAttributes || []).map(attr => ({
            key: attr.key,
            value: { stringValue: attr.value }
          }))
        ]
      },
      scopeSpans: [{
        scope: {
          name: spanData.instrumentationScope || 'github-actions-otel',
          version: '1.0.0'
        },
        spans: [{
          traceId: spanData.traceId,
          spanId: spanData.spanId,
          parentSpanId: spanData.parentSpanId,
          name: spanData.name,
          kind: spanData.kind || 1, // SPAN_KIND_CLIENT
          startTimeUnixNano: spanData.startTimeUnixNano,
          endTimeUnixNano: spanData.endTimeUnixNano,
          status: {
            code: spanData.statusCode || 1 // STATUS_CODE_OK
          },
          attributes: (spanData.attributes || []).map(attr => ({
            key: attr.key,
            value: attr.type === 'int' ? { intValue: attr.value } : { stringValue: attr.value }
          }))
        }]
      }]
    };

    // Export the trace using the same method as otel.ts
    await new Promise((resolve, reject) => {
      exporter.export([resourceSpans], (result) => {
        if (result.code === 0) {
          console.log('✅ Trace sent successfully via OTLP protobuf');
          resolve(result);
        } else {
          console.error('❌ Failed to send trace:', result.error);
          reject(new Error(`Export failed: ${result.error}`));
        }
      });
    });

    await exporter.shutdown();
    return true;
  } catch (error) {
    console.error('❌ Error sending trace:', error.message);
    return false;
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.error('Usage: node send-trace.js <endpoint> <apiToken> <jsonSpanData>');
    process.exit(1);
  }

  const [endpoint, apiToken, jsonSpanData] = args;
  
  try {
    const spanData = JSON.parse(jsonSpanData);
    sendTrace(endpoint, apiToken, spanData)
      .then(success => process.exit(success ? 0 : 1))
      .catch(error => {
        console.error('Failed to send trace:', error);
        process.exit(1);
      });
  } catch (error) {
    console.error('Invalid JSON span data:', error.message);
    process.exit(1);
  }
}

module.exports = { sendTrace };
