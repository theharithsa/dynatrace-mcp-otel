import { _OAuthHttpClient } from '@dynatrace-sdk/http-client';
import { WorkflowsClient } from '@dynatrace-sdk/client-automation';

export const updateWorkflow = async (dtClient: _OAuthHttpClient, workflowId: string, body: any) => {
  const workflowsclient = new WorkflowsClient(dtClient);

  return await workflowsclient.updateWorkflow({
    id: workflowId,
    body: body,
  });
};
