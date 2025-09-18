import { _OAuthHttpClient } from '@dynatrace-sdk/http-client';
import { executeDql } from './execute-dql';

export const findMonitoredEntityByName = async (dtClient: _OAuthHttpClient, entityName: string) => {
  // Enhanced DQL query to cover full topology including containers, databases, and cloud infrastructure
  const dql = `fetch dt.entity.application | search "*${entityName}*" | fieldsAdd entity.type
                | append [fetch dt.entity.service | search "*${entityName}*" | fieldsAdd entity.type]
                | append [fetch dt.entity.host | search "*${entityName}*" | fieldsAdd entity.type]
                | append [fetch dt.entity.process_group | search "*${entityName}*" | fieldsAdd entity.type]
                | append [fetch dt.entity.cloud_application | search "*${entityName}*" | fieldsAdd entity.type]
                | append [fetch dt.entity.kubernetes_cluster | search "*${entityName}*" | fieldsAdd entity.type]
                | append [fetch dt.entity.kubernetes_node | search "*${entityName}*" | fieldsAdd entity.type]
                | append [fetch dt.entity.kubernetes_namespace | search "*${entityName}*" | fieldsAdd entity.type]
                | append [fetch dt.entity.kubernetes_workload | search "*${entityName}*" | fieldsAdd entity.type]
                | append [fetch dt.entity.container_group | search "*${entityName}*" | fieldsAdd entity.type]
                | append [fetch dt.entity.container | search "*${entityName}*" | fieldsAdd entity.type]
                | append [fetch dt.entity.database_service | search "*${entityName}*" | fieldsAdd entity.type]
                | append [fetch dt.entity.cloud_application_instance | search "*${entityName}*" | fieldsAdd entity.type]
                | append [fetch dt.entity.ec2_instance | search "*${entityName}*" | fieldsAdd entity.type]
                | append [fetch dt.entity.azure_vm | search "*${entityName}*" | fieldsAdd entity.type]
                | append [fetch dt.entity.gcp_compute_instance | search "*${entityName}*" | fieldsAdd entity.type]
                | limit 50`;

  const dqlResponse = await executeDql(dtClient, { query: dql });

  if (dqlResponse && dqlResponse.records && dqlResponse.records.length > 0) {
    let resp = `Found ${dqlResponse.records.length} monitored entities matching "${entityName}":\n`;
    // iterate over dqlResponse.records and create a string with the entity names
    dqlResponse.records.forEach((entity) => {
      if (entity) {
        resp += `- Entity '${entity['entity.name']}' of type '${entity['entity.type']}' has entity id '${entity.id}'\n`;
      }
    });
    
    if (dqlResponse.records.length >= 50) {
      resp += '\nNote: Results limited to 50 entities. Refine your search for more specific results.\n';
    }
    
    return resp;
  } else {
    return 'No monitored entity found with the specified name.';
  }
};
