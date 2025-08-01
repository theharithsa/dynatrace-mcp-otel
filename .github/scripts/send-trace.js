const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-proto');
const ResourceCtor = require('@opentelemetry/resources').Resource;
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

/**
 * Send a trace span to Dynatrace using direct OTLP exporter like otel.ts
 */
async function sendTrace(endpoint, apiToken, spanData) {
  try {
    console.log('🔍 Received span data keys:', Object.keys(spanData));
    
    // Check if we received OTLP format or simple format
    let traceId, spanId, name, parentSpanId, kind, startTime, endTime, status, attributes, resourceAttrs;
    
    if (spanData.resourceSpans) {
      // OTLP format received - extract first span
      const span = spanData.resourceSpans[0].scopeSpans[0].spans[0];
      traceId = span.traceId;
      spanId = span.spanId;
      parentSpanId = span.parentSpanId;
      name = span.name;
      kind = span.kind || 1;
      startTime = span.startTimeUnixNano;
      endTime = span.endTimeUnixNano;
      status = span.status?.code || 1;
      
      // Convert OTLP attributes format
      attributes = {};
      if (span.attributes) {
        span.attributes.forEach(attr => {
          attributes[attr.key] = attr.value.stringValue || attr.value.intValue || attr.value.boolValue;
        });
      }
      
      // Convert OTLP resource attributes
      resourceAttrs = {};
      if (spanData.resourceSpans[0].resource?.attributes) {
        spanData.resourceSpans[0].resource.attributes.forEach(attr => {
          resourceAttrs[attr.key] = attr.value.stringValue || attr.value.intValue || attr.value.boolValue;
        });
      }
    } else {
      // Simple format received
      traceId = spanData.traceId;
      spanId = spanData.spanId;
      parentSpanId = spanData.parentSpanId;
      name = spanData.name;
      kind = spanData.kind || 1;
      startTime = spanData.startTimeUnixNano;
      endTime = spanData.endTimeUnixNano;
      status = spanData.statusCode || 1;
      attributes = {};
      resourceAttrs = { [SemanticResourceAttributes.SERVICE_NAME]: spanData.serviceName || 'dynatrace-mcp-server-build' };
      
      if (spanData.attributes) {
        spanData.attributes.forEach(attr => {
          attributes[attr.key] = attr.value;
        });
      }
      
      if (spanData.resourceAttributes) {
        spanData.resourceAttributes.forEach(attr => {
          resourceAttrs[attr.key] = attr.value;
        });
      }
    }
    
    // Validate required fields
    if (!traceId || !spanId || !name) {
      throw new Error(`Missing required span fields: traceId=${traceId}, spanId=${spanId}, name=${name}`);
    }

    console.log('📋 Parsed span:', { name, traceId, spanId, parentSpanId });

    // Create resource with defaults like otel.ts
    const resource = new ResourceCtor({
      [SemanticResourceAttributes.SERVICE_NAME]: resourceAttrs[SemanticResourceAttributes.SERVICE_NAME] || 'dynatrace-mcp-server-build',
      [SemanticResourceAttributes.TELEMETRY_SDK_NAME]: 'opentelemetry',
      [SemanticResourceAttributes.TELEMETRY_SDK_LANGUAGE]: 'nodejs',
      [SemanticResourceAttributes.TELEMETRY_SDK_VERSION]: '1.0.0',
      ...resourceAttrs
    });

    // Create exporter exactly like otel.ts
    const exporter = new OTLPTraceExporter({
      url: endpoint,
      headers: {
        Authorization: `Api-Token ${apiToken}`,
      },
    });

    console.log('🔧 Created OTLP exporter with endpoint:', endpoint);

    // Create a minimal ReadableSpan that matches OTLP SDK expectations
    const readableSpan = {
      name: name,
      kind: kind,
      spanContext: () => ({
        traceId: traceId,
        spanId: spanId,
        traceFlags: 1
      }),
      parentSpanId: parentSpanId,
      startTime: [Math.floor(parseInt(startTime) / 1000000000), parseInt(startTime) % 1000000000],
      endTime: endTime ? [Math.floor(parseInt(endTime) / 1000000000), parseInt(endTime) % 1000000000] : undefined,
      status: { code: status },
      attributes: attributes,
      links: [],
      events: [],
      duration: endTime ? [Math.floor((parseInt(endTime) - parseInt(startTime)) / 1000000000), (parseInt(endTime) - parseInt(startTime)) % 1000000000] : [0, 0],
      ended: !!endTime,
      resource: resource,
      instrumentationLibrary: {
        name: 'github-actions-otel',
        version: '1.0.0'
      }
    };

    console.log('📤 Exporting span directly via OTLP...');

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
