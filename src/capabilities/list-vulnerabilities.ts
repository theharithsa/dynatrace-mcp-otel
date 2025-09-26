import { _OAuthHttpClient } from '@dynatrace-sdk/http-client';
import { executeDql } from './execute-dql';

export const listVulnerabilities = async (dtClient: _OAuthHttpClient, additionalFilter?: string, riskScore = 8.0) => {
  let dqlQuery = `
    fetch security.events, from: now()-30d, to: now()
    | filter event.provider=="Dynatrace"
            AND event.type=="VULNERABILITY_STATE_REPORT_EVENT"
            AND event.level=="ENTITY"
    | filter vulnerability.risk.score >= ${riskScore}
    | filter vulnerability.mute.status == "NOT_MUTED"`;

  if (additionalFilter) {
    dqlQuery += `
    | filter ${additionalFilter}`;
  }

  dqlQuery += `
    | dedup {vulnerability.display_id, affected_entity.id}, sort:{timestamp desc}
    | limit 100
    | sort vulnerability.risk.score desc
    | fields vulnerability_id=vulnerability.id, display_id=vulnerability.display_id, title=vulnerability.title, technology=vulnerability.technology, external_vulnerability_id=vulnerability.external_id, cve_ids=vulnerability.cve_ids, risk_score=vulnerability.risk.score, affected_entity_name=affected_entity.name
  `;

  const result = await executeDql(dtClient, {
    query: dqlQuery,
  });

  if (!result.records || result.records.length === 0) {
    return [];
  }

  const securityProblems = result.records.map((record: any) => {
    return `${record.display_id || 'N/A'} (please refer to this vulnerability with \`vulnerability.id\` ${record.vulnerability_id || 'N/A'}): ${record.title || 'No title'} (Technology: ${record.technology || 'Unknown'}, External Vulnerability ID: ${record.external_vulnerability_id || 'N/A'}, CVE: ${record.cve_ids ? (Array.isArray(record.cve_ids) ? record.cve_ids.join(', ') : record.cve_ids) : 'N/A'}, Risk Score: ${record.risk_score || 'N/A'}, Affected Entity: ${record.affected_entity_name || 'N/A'})`;
  });

  return securityProblems;
};
