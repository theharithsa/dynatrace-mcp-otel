import { _OAuthHttpClient } from '@dynatrace-sdk/http-client';
import { executeDql } from './execute-dql';

export const listProblems = async (dtClient: _OAuthHttpClient) => {
  const dqlQuery = `
    fetch events
    | filter event.kind == "DAVIS_PROBLEM"
    | limit 100
    | fields problem_id=event.davis.problem_id, display_id=event.davis.display_id, title=event.davis.title, severity=event.davis.severity_level
  `;

  const result = await executeDql(dtClient, {
    query: dqlQuery,
  });

  if (!result.records || result.records.length === 0) {
    return [];
  }

  const problems = result.records.map((record: any) => {
    return `${record.display_id || 'N/A'} (please refer to this problem with \`problemId\` ${record.problem_id || 'N/A'}): ${record.title || 'No title'} (Severity: ${record.severity || 'Unknown'})`;
  });

  return problems;
};
