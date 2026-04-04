import { getEmbedding } from "./embeddings.ts";
import { cosineSimilarity } from "./similarity.ts";
import type { TSCCriterion } from "../types/kbTypes.ts";

export async function matchCriteria(
  toolInfo: string,
  criteria: TSCCriterion[],
): Promise<(TSCCriterion & { score: number })[]> {
  const queryEmbedding = await getEmbedding(toolInfo);

  return semanticSearch(queryEmbedding, criteria);
}

export function semanticSearch(
  queryEmbedding: number[],
  criteria: TSCCriterion[],
  topK = 3,
): (TSCCriterion & { score: number })[] {
  const scored = criteria.map((c) => {
    if (!c.embedding) {
      throw new Error(`Missing embedding id for ${c.id}`);
    }

    return {
      ...c,
      score: cosineSimilarity(queryEmbedding, c.embedding),
    };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, topK);
}
