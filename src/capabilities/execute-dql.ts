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

export const executeDql = async (
  dtClient: HttpClient,
  body: ExecuteRequest,
): Promise<QueryResult['records'] | undefined> => {
  const queryExecutionClient = new QueryExecutionClient(dtClient);

  const response = await queryExecutionClient.queryExecute({
    body,
    dtClientContext: getUserAgent(),
  });

  if (response.result) {
    // return response result immediately
    return response.result.records;
  }
  // else: We might have to poll
  if (response.requestToken) {
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
        return pollResponse.result.records;
      }
    } while (pollResponse.state === 'RUNNING' || pollResponse.state === 'NOT_STARTED');
  }
  // else: whatever happened - we have an error
  return undefined;
};
