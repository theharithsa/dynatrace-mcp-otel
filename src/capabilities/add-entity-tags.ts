import { sendToDynatraceLog } from '../logging';
import { randomUUID } from 'crypto';

// Add entity tags capability - using direct API calls to live.dynatrace.com with API token
export const addEntityTags = async (
  entityId: string,
  tags: Array<{ key: string; value?: string }>,
  traceId?: string,
) => {
  const operationTraceId = traceId || randomUUID();
  const args = { entityId, tags };

  try {
    // Use live.dynatrace.com environment and API token (not Platform token)
    const dtEnvUrl = process.env.DT_ENVIRONMENT;
    const dtApiToken = process.env.DT_API_TOKEN; // Must be API token with entities.read and entities.write scopes

    if (!dtEnvUrl || !dtApiToken) {
      const errorMsg =
        'Missing DT_ENVIRONMENT or DT_API_TOKEN environment variables. For entity operations, use an API token with entities.read and entities.write scopes.';

      await sendToDynatraceLog({
        tool: 'add_entity_tags',
        traceId: operationTraceId,
        spanId: '',
        parentSpanId: '',
        args,
        result: errorMsg,
        isError: true,
      });

      throw new Error(errorMsg);
    }

    // Step 1: Prepare tags in the format expected by the API
    const tagsPayload = {
      tags: tags.map((tag) => ({
        key: tag.key,
        ...(tag.value && { value: tag.value }),
      })),
    };

    // Step 2: Apply tags to the entity using the Tags API
    const tagsUrl = `${dtEnvUrl}/api/v2/tags?entitySelector=${encodeURIComponent(`entityId("${entityId}")`)}`;

    const tagsResponse = await fetch(tagsUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json; charset=utf-8',
        'Authorization': `Api-Token ${dtApiToken}`,
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(tagsPayload),
    });

    if (!tagsResponse.ok) {
      const errorText = await tagsResponse.text();
      throw new Error(`Failed to add tags: ${tagsResponse.status} - ${errorText}`);
    }

    const tagsData: any = await tagsResponse.json();

    const result = `Successfully added ${tagsData.appliedTags?.length || 0} tags to entity ${entityId}.\n\nApplied tags:\n${tagsData.appliedTags?.map((t: any) => `- ${t.stringRepresentation}`).join('\n') || 'None'}\n\nMatched entities: ${tagsData.matchedEntitiesCount || 0}`;

    // Log successful operation
    await sendToDynatraceLog({
      tool: 'add_entity_tags',
      traceId: operationTraceId,
      spanId: '',
      parentSpanId: '',
      args,
      result,
      isError: false,
    });

    return result;
  } catch (error) {
    const errorMsg = (error as Error).message;

    // Log error
    await sendToDynatraceLog({
      tool: 'add_entity_tags',
      traceId: operationTraceId,
      spanId: '',
      parentSpanId: '',
      args,
      result: errorMsg,
      isError: true,
    });

    throw error;
  }
};
