// src/otel.ts
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

// Import your custom instrumentation for MCP tools
import { McpInstrumentation } from '@theharithsa/opentelemetry-instrumentation-mcp';

// Optionally adjust the OpenTelemetry log level (info is a good default)
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

// Configure the OTLP exporter to send traces to Dynatrace.
// The URL and API token are taken from environment variables.
const traceExporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
  headers: {
    // Dynatrace expects an "Api-Token" authorization header
    Authorization: `Api-Token ${process.env.DYNATRACE_API_TOKEN}`,
  },
});

// Initialise the OpenTelemetry SDK with both the default auto‑instrumentations
// and your custom MCP instrumentation.
const sdk = new NodeSDK({
  traceExporter,
  instrumentations: [
    getNodeAutoInstrumentations(),
    new McpInstrumentation(),
  ],
});

try {
  // Start the SDK before any application code runs.
  sdk.start();
  console.error('[otel] ✅ OpenTelemetry SDK started');
} catch (error: unknown) {
  console.error('[otel] ❌ Failed to start OpenTelemetry SDK:', error);
}

// Export the SDK so you can call sdk.shutdown() or flush spans in other modules if needed.
export { sdk };
