// src/logging.ts - Enhanced structured logging for Dynatrace MCP Server
import fetch from 'node-fetch';
import { getPackageJsonVersion } from './utils/version';

// Use consistent environment variables, with fallbacks for compatibility
const LOG_INGEST_URL =
  process.env.DYNATRACE_LOG_INGEST_URL ||
  (process.env.DT_ENVIRONMENT ? `${process.env.DT_ENVIRONMENT.replace('apps.', 'live.')}/api/v2/logs/ingest` : '');
const LOG_INGEST_TOKEN = process.env.DT_PLATFORM_TOKEN || process.env.DYNATRACE_API_TOKEN || '';

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface LogContext {
  tool?: string;
  traceId?: string;
  spanId?: string;
  parentSpanId?: string;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  duration?: number;
  budgetUsage?: {
    scannedBytes: number;
    totalBytesUsed: number;
    budgetLimit: number;
  };
  error?: {
    name: string;
    message: string;
    stack?: string;
    code?: number;
  };
  performance?: {
    executionTime: number;
    memoryUsage: number;
  };
  metadata?: Record<string, any>;
}

export interface StructuredLogEntry {
  timestamp: number;
  level: LogLevel;
  message: string;
  service: string;
  version: string;
  environment: string;
  context?: LogContext;
  trace_id?: string;
  span_id?: string;
  parent_span_id?: string;
}

/**
 * Enhanced structured logger for Dynatrace MCP Server
 */
export class StructuredLogger {
  private readonly service = 'dynatrace-mcp-server';
  private readonly version = getPackageJsonVersion();
  private readonly environment = process.env.NODE_ENV || 'development';

  /**
   * Create a structured log entry
   */
  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: LogContext,
  ): StructuredLogEntry {
    return {
      timestamp: Date.now(),
      level,
      message,
      service: this.service,
      version: this.version,
      environment: this.environment,
      context,
      trace_id: context?.traceId,
      span_id: context?.spanId,
      parent_span_id: context?.parentSpanId,
    };
  }

  /**
   * Send log to Dynatrace
   */
  private async sendLog(entry: StructuredLogEntry): Promise<void> {
    if (!LOG_INGEST_URL || !LOG_INGEST_TOKEN) {
      return; // Silently skip if not configured
    }

    try {
      await fetch(LOG_INGEST_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Api-Token ${LOG_INGEST_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([entry]),
      });
    } catch (e: any) {
      console.error('[DT_LOG_INGEST] Error:', e.message);
    }
  }

  /**
   * Log debug information
   */
  async debug(message: string, context?: LogContext): Promise<void> {
    const entry = this.createLogEntry('DEBUG', message, context);
    console.debug(JSON.stringify(entry));
    await this.sendLog(entry);
  }

  /**
   * Log informational messages
   */
  async info(message: string, context?: LogContext): Promise<void> {
    const entry = this.createLogEntry('INFO', message, context);
    console.log(JSON.stringify(entry));
    await this.sendLog(entry);
  }

  /**
   * Log warning messages
   */
  async warn(message: string, context?: LogContext): Promise<void> {
    const entry = this.createLogEntry('WARN', message, context);
    console.warn(JSON.stringify(entry));
    await this.sendLog(entry);
  }

  /**
   * Log error messages
   */
  async error(message: string, context?: LogContext): Promise<void> {
    const entry = this.createLogEntry('ERROR', message, context);
    console.error(JSON.stringify(entry));
    await this.sendLog(entry);
  }

  /**
   * Log tool execution with performance metrics
   */
  async logToolExecution(
    toolName: string,
    success: boolean,
    duration: number,
    context?: Omit<LogContext, 'tool' | 'duration'>
  ): Promise<void> {
    const message = `Tool ${toolName} ${success ? 'completed successfully' : 'failed'}`;
    const logContext: LogContext = {
      ...context,
      tool: toolName,
      duration,
      performance: {
        executionTime: duration,
        memoryUsage: process.memoryUsage().heapUsed,
      },
    };

    if (success) {
      await this.info(message, logContext);
    } else {
      await this.error(message, logContext);
    }
  }

  /**
   * Log budget warnings with usage context
   */
  async logBudgetWarning(
    message: string,
    budgetUsage: LogContext['budgetUsage'],
    context?: LogContext
  ): Promise<void> {
    const logContext: LogContext = {
      ...context,
      budgetUsage,
    };
    
    await this.warn(`Budget Warning: ${message}`, logContext);
  }

  /**
   * Log DQL query execution with metrics
   */
  async logDqlExecution(
    query: string,
    scannedBytes: number,
    scannedRecords: number,
    duration: number,
    context?: LogContext
  ): Promise<void> {
    const message = `DQL query executed: scanned ${(scannedBytes / (1000 * 1000 * 1000)).toFixed(2)} GB, ${scannedRecords} records`;
    const logContext: LogContext = {
      ...context,
      duration,
      metadata: {
        query: query.substring(0, 200), // Truncate long queries
        scannedBytes,
        scannedRecords,
      },
    };

    await this.info(message, logContext);
  }
}

// Global logger instance
export const logger = new StructuredLogger();

/**
 * Legacy function for backward compatibility
 */
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
  tool: string;
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  args: any;
  headers?: any;
  result: any;
  isError?: boolean;
}) {
  const context: LogContext = {
    tool,
    traceId,
    spanId,
    parentSpanId,
    metadata: { args, headers, result },
  };

  const message = `Tool ${tool} execution ${isError ? 'failed' : 'completed'}`;
  
  if (isError) {
    await logger.error(message, context);
  } else {
    await logger.info(message, context);
  }
}
