import { pipeline } from "@xenova/transformers";

let pipe: any = null;
// Function to create a batch of rows for upsert
export const createBatch = async (chunks: any[]) => {
  // 1. Initialize the feature-extraction pipeline
  if (!pipe) {
    pipe = await pipeline("feature-extraction", "Supabase/gte-small");
  }

  const rowsToUpsert = [];

  for (const item of chunks) {
    const output = await pipe(item.title, { pooling: "mean", normalize: true });
    const embedding = Array.from(output.data); // Extract as a flat array

    rowsToUpsert.push({
      id: item.id,
      title: item.title,
      embedding: embedding,
      meta_data: item,
    });
  }

  return rowsToUpsert;
};
