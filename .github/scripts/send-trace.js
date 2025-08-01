const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-proto');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { trace } = require('@opentelemetry/api');

/**
 * Send a trace span to Dynatrace using the same method as otel.ts
 */
async function sendTrace(endpoint, apiToken, spanData) {
  try {
    console.log('🔍 Received span data:', JSON.stringify(spanData, null, 2));
    
    // Validate required fields
    if (!spanData.traceId || !spanData.spanId || !spanData.name) {
      throw new Error('Missing required span fields: traceId, spanId, or name');
    }

    const exporter = new OTLPTraceExporter({
      url: endpoint,
      headers: {
        Authorization: `Api-Token ${apiToken}`,
      },
    });

    console.log('🔧 Created OTLP exporter with endpoint:', endpoint);

    // Create proper resource attributes
    const resourceAttributes = {};
    resourceAttributes[SemanticResourceAttributes.SERVICE_NAME] = spanData.serviceName || 'dynatrace-mcp-server-build';
    resourceAttributes[SemanticResourceAttributes.TELEMETRY_SDK_NAME] = 'opentelemetry';
    resourceAttributes[SemanticResourceAttributes.TELEMETRY_SDK_LANGUAGE] = 'nodejs';
    resourceAttributes[SemanticResourceAttributes.TELEMETRY_SDK_VERSION] = '1.0.0';

    // Add custom resource attributes
    if (spanData.resourceAttributes) {
      spanData.resourceAttributes.forEach(attr => {
        resourceAttributes[attr.key] = attr.value;
      });
    }

    const resource = new Resource(resourceAttributes);
    console.log('📦 Created resource with attributes:', resourceAttributes);

    // Create span attributes
    const spanAttributes = {};
    if (spanData.attributes) {
      spanData.attributes.forEach(attr => {
        spanAttributes[attr.key] = attr.value;
      });
    }

    // Create a proper ReadableSpan that matches OpenTelemetry SDK structure
    const readableSpan = {
      name: spanData.name,
      kind: spanData.kind || 1, // SPAN_KIND_CLIENT
      spanContext: () => ({
        traceId: spanData.traceId,
        spanId: spanData.spanId,
        traceFlags: 1
      }),
      parentSpanId: spanData.parentSpanId,
      startTime: [Math.floor(spanData.startTimeUnixNano / 1000000000), (spanData.startTimeUnixNano % 1000000000)],
      endTime: spanData.endTimeUnixNano ? [Math.floor(spanData.endTimeUnixNano / 1000000000), (spanData.endTimeUnixNano % 1000000000)] : undefined,
      status: {
        code: spanData.statusCode || 1 // STATUS_CODE_OK
      },
      attributes: spanAttributes,
      links: [],
      events: [],
      duration: spanData.endTimeUnixNano ? [Math.floor((spanData.endTimeUnixNano - spanData.startTimeUnixNano) / 1000000000), ((spanData.endTimeUnixNano - spanData.startTimeUnixNano) % 1000000000)] : [0, 0],
      ended: !!spanData.endTimeUnixNano,
      resource: resource,
      instrumentationLibrary: {
        name: spanData.instrumentationScope || 'github-actions-otel',
        version: '1.0.0'
      }
    };

    console.log('🔨 Created readable span object');

    console.log('📤 Exporting span data...');

    // Export the trace using the same method as otel.ts
    await new Promise((resolve, reject) => {
      exporter.export([readableSpan], (result) => {
        console.log('📊 Export result:', result);
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
    console.error('❌ Stack trace:', error.stack);
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
    console.log('🚀 Starting trace export...');
    console.log('📡 Endpoint:', endpoint);
    console.log('🔑 API Token:', apiToken ? 'SET' : 'NOT SET');
    
    sendTrace(endpoint, apiToken, spanData)
      .then(success => {
        console.log(success ? '✅ Trace export completed successfully' : '❌ Trace export failed');
        process.exit(success ? 0 : 1);
      })
      .catch(error => {
        console.error('💥 Failed to send trace:', error);
        process.exit(1);
      });
  } catch (error) {
    console.error('❌ Invalid JSON span data:', error.message);
    process.exit(1);
  }
}

module.exports = { sendTrace };
