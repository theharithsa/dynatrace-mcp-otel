import { _OAuthHttpClient } from '@dynatrace-sdk/http-client';
import { executeDql } from './execute-dql';

export const listProblems = async (dtClient: _OAuthHttpClient, additionalFilter?: string) => {
  let dqlQuery = `
    fetch dt.davis.problems, from: now()-12h, to: now()`;

  if (additionalFilter) {
    dqlQuery += `
    | filter ${additionalFilter}`;
  }

  dqlQuery += `
    | sort timestamp desc
    | limit 100
    | fields display_id, problem_id=event.id, event.name, event.status, event.category, affected_users_count, affected_entity_count=affected_entities_count, duration, timestamp
  `;

  const result = await executeDql(dtClient, {
    query: dqlQuery,
  });

  return result;
};
