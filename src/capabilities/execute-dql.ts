import { HttpClient } from '@dynatrace-sdk/http-client';
import { QueryExecutionClient, QueryAssistanceClient, QueryResult, ExecuteRequest } from '@dynatrace-sdk/client-query';
import { getUserAgent } from '../utils/user-agent';

export const verifyDqlStatement = async (dtClient: HttpClient, dqlStatement: string) => {
  const queryAssistanceClient = new QueryAssistanceClient(dtClient);

  const response = await queryAssistanceClient.queryVerify({
    body: {
      query: dqlStatement,
    },
  });

  return response;
};

export interface DqlResponse {
  records?: QueryResult['records'];
  scannedBytes?: number;
  scannedRecords?: number;
  sampled?: boolean;
  budgetWarning?: string;
  budgetState?: {
    totalBytesScanned: number;
    budgetLimitBytes: number;
    budgetLimitGB: number;
  };
}

export const executeDql = async (
  dtClient: HttpClient,
  body: ExecuteRequest,
  grailBudgetGB?: number
): Promise<DqlResponse> => {
  const queryExecutionClient = new QueryExecutionClient(dtClient);

  const response = await queryExecutionClient.queryExecute({
    body,
    dtClientContext: getUserAgent(),
  });

  let finalResult: QueryResult | undefined;

  if (response.result) {
    // return response result immediately
    finalResult = response.result;
  } else if (response.requestToken) {
    // poll for the result
    let pollResponse;
    do {
      // sleep for 2 seconds
      await new Promise((resolve) => setTimeout(resolve, 2000));
      pollResponse = await queryExecutionClient.queryPoll({
        requestToken: response.requestToken,
        dtClientContext: getUserAgent(),
      });
      // done - let's return it
      if (pollResponse.result) {
        finalResult = pollResponse.result;
        break;
      }
    } while (pollResponse.state === 'RUNNING' || pollResponse.state === 'NOT_STARTED');
  }

  if (!finalResult) {
    return { records: undefined };
  }

  // Extract metadata (if available)
  const metadata = finalResult.metadata as any; // Type assertion since the SDK might not expose all fields
  const scannedBytes = metadata?.scannedBytes || metadata?.totalProcessedBytes;
  const scannedRecords = metadata?.scannedRecords || metadata?.scannedDataPoints;
  const sampled = metadata?.sampled;

  // Build the enhanced response
  const dqlResponse: DqlResponse = {
    records: finalResult.records,
    scannedBytes,
    scannedRecords,
    sampled
  };

  // Add budget tracking if grailBudgetGB is provided
  if (grailBudgetGB && scannedBytes) {
    // Import budget functions dynamically to avoid circular dependencies
    const { addBytesScanned, getBudgetWarning, getGrailBudgetTracker } = await import('../utils/grail-budget-tracker');
    
    const warning = addBytesScanned(scannedBytes, grailBudgetGB);
    const tracker = getGrailBudgetTracker(grailBudgetGB);
    const state = tracker.getState();

    dqlResponse.budgetWarning = getBudgetWarning(warning) || undefined;
    dqlResponse.budgetState = {
      totalBytesScanned: state.totalBytesScanned,
      budgetLimitBytes: state.budgetLimitBytes,
      budgetLimitGB: state.budgetLimitGB
    };
  }

  return dqlResponse;
};
