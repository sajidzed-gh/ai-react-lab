export function toolDetailsPrompt(toolname: string): string {
  return `Extract structured information about this tool.

Return ONLY JSON in this format:
{
  "name": "",
  "data_types": [],
  "stores_personal_data": true/false,
  "security_features": [],
  "hosting": "cloud | on-prem",
  "access_control": "yes | no | unknown"
}

Tool:
${toolname}`;
}

//
export function soc2AuditorPrompt(context: string, toolInfo: string): string {
  return `
    You are a SOC2 auditor.

Evaluate the toolinfo against the following AICPA Trust Services Criteria:

${context}

Return JSON:
{
"toolInfo": ""
  "gaps": [
    {
      "criteria_id": "",
      "issue": "",
      "risk": "",
      "recommendation": ""
    }
  ]
}

toolInfo:
${toolInfo}
`;
}
