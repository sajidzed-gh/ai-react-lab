import type { TSCCriterion } from "../types/kbTypes.ts";
import { getEmbedding } from "./embeddings.ts";

/**
 * AICPA Trust Services Criteria
 **/
export const AICPA_TSC_Criteria: TSCCriterion[] = [
  {
    id: "CC6.1",
    category: "Security",
    title: "Logical Access Controls",
    requirement:
      "The entity implements logical access controls to protect against unauthorized access.",
    keywords: [
      "authentication",
      "authorization",
      "RBAC",
      "login",
      "access control",
    ],
  },
  {
    id: "CC6.7",
    category: "Security",
    title: "Data Transmission Protection",
    requirement:
      "The entity protects data during transmission using encryption.",
    keywords: ["encryption", "TLS", "HTTPS", "data in transit"],
  },
  {
    id: "CC6.8",
    category: "Confidentiality",
    title: "Data at Rest Protection",
    requirement:
      "The entity protects stored data using encryption or equivalent safeguards.",
    keywords: ["encryption at rest", "database security", "storage protection"],
  },
  {
    id: "A1.1",
    category: "Availability",
    title: "System Availability",
    requirement:
      "The entity maintains system uptime and resilience through monitoring and redundancy.",
    keywords: ["uptime", "redundancy", "failover", "monitoring"],
  },
  {
    id: "PI1.1",
    category: "Processing Integrity",
    title: "Data Processing Accuracy",
    requirement:
      "The system ensures data is processed completely, accurately, and timely.",
    keywords: ["data validation", "accuracy", "processing", "integrity"],
  },
];

export async function embedCriteria(): Promise<void> {
  for (const c of AICPA_TSC_Criteria) {
    const combinedtext = `${c.title} 
        ${c.requirement} 
        ${c.keywords.join(" ")}
        `;
    c.embedding = await getEmbedding(combinedtext);
  }
}
