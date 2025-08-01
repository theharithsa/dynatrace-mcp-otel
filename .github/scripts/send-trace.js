const { NodeSDK } = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-proto');
const { trace, context, SpanKind, SpanStatusCode } = require('@opentelemetry/api');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

/**
 * Send a trace span to Dynatrace using NodeSDK approach like otel.ts
 */
async function sendTrace(endpoint, apiToken, spanData) {
  try {
    console.log('🔍 Received span data keys:', Object.keys(spanData));
    
    // Check if we received OTLP format or simple format
    let traceId, spanId, name, parentSpanId, kind, startTime, endTime, status, attributes, resourceAttrs;
    
    if (spanData.resourceSpans) {
      // OTLP format received
      const span = spanData.resourceSpans[0].scopeSpans[0].spans[0];
      traceId = span.traceId;
      spanId = span.spanId;
      parentSpanId = span.parentSpanId;
      name = span.name;
      kind = span.kind || 1;
      startTime = parseInt(span.startTimeUnixNano);
      endTime = span.endTimeUnixNano ? parseInt(span.endTimeUnixNano) : undefined;
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
      startTime = parseInt(spanData.startTimeUnixNano);
      endTime = spanData.endTimeUnixNano ? parseInt(spanData.endTimeUnixNano) : undefined;
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

    // Create resource with defaults
    const resource = new Resource({
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

    // Create a minimal NodeSDK instance for this trace
    const sdk = new NodeSDK({
      resource: resource,
      traceExporter: exporter,
      instrumentations: [], // No auto-instrumentation needed
    });

    // Start SDK
    sdk.start();
    console.log('🚀 NodeSDK started');

    // Get tracer and create span
    const tracer = trace.getTracer('github-actions-otel', '1.0.0');
    
    // Create span context for parent if provided
    let parentContext = context.active();
    if (parentSpanId) {
      const parentSpanContext = {
        traceId: traceId,
        spanId: parentSpanId,
        traceFlags: 1,
        isRemote: true
      };
      parentContext = trace.setSpanContext(context.active(), parentSpanContext);
    }

    // Create and start span
    const span = tracer.startSpan(name, {
      kind: kind,
      attributes: attributes,
      startTime: [Math.floor(startTime / 1000000000), startTime % 1000000000]
    }, parentContext);

    // Set span context to match our IDs
    Object.defineProperty(span, '_spanContext', {
      value: {
        traceId: traceId,
        spanId: spanId,
        traceFlags: 1
      },
      writable: false
    });

    // Set status
    span.setStatus({ code: status === 1 ? SpanStatusCode.OK : SpanStatusCode.ERROR });

    // End span if endTime provided
    if (endTime) {
      span.end([Math.floor(endTime / 1000000000), endTime % 1000000000]);
    } else {
      span.end();
    }

    console.log('📤 Span created and ended');

    // Force flush and shutdown
    await sdk.shutdown();
    console.log('✅ Trace sent successfully via NodeSDK');

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
