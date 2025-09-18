import { _OAuthHttpClient } from '@dynatrace-sdk/http-client';
import { executeDql } from './execute-dql';

export const listVulnerabilities = async (dtClient: _OAuthHttpClient) => {
  const dqlQuery = `
    fetch events
    | filter event.kind == "SECURITY_EVENT"
    | filter event.davis.risk_assessment.risk_score >= 8.0
    | limit 100
    | sort event.davis.risk_assessment.risk_score desc
    | fields security_problem_id=event.davis.security_problem_id, display_id=event.davis.display_id, title=event.davis.title, technology=event.davis.technology, external_vulnerability_id=event.davis.external_vulnerability_id, cve_ids=event.davis.cve_ids, risk_score=event.davis.risk_assessment.risk_score
  `;

  const result = await executeDql(dtClient, {
    query: dqlQuery,
  });

  if (!result.records || result.records.length === 0) {
    return [];
  }

  const securityProblems = result.records.map((record: any) => {
    return `${record.display_id || 'N/A'} (please refer to this vulnerability with \`securityProblemId\` ${record.security_problem_id || 'N/A'}): ${record.title || 'No title'} (Technology: ${record.technology || 'Unknown'}, External Vulnerability ID: ${record.external_vulnerability_id || 'N/A'}, CVE: ${record.cve_ids ? (Array.isArray(record.cve_ids) ? record.cve_ids.join(', ') : record.cve_ids) : 'N/A'}, Risk Score: ${record.risk_score || 'N/A'})`;
  });

  return securityProblems;
};
