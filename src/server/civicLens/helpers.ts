import { createBatch } from "./createEmbeddings.ts";

//
export const batchUpsert = async (batch: never[], supabaseOps: any) => {
  const rows = await createBatch(batch);
  //console.dir(rows, { depth: null });
  await supabaseOps.upsertRecord(rows);
};

// Utility function to chunk an array into smaller batches
export const chunkJsonArray = (array: never[], size: number) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};
