import { SupabaseClient } from "@supabase/supabase-js";

export class supabaseOperations {
  private supabaseClient: SupabaseClient;
  constructor(supabaseClient: SupabaseClient) {
    this.supabaseClient = supabaseClient;
  }

  testConnection = async () => {
    const { data, error } = await this.supabaseClient
      .from("pop_document")
      .select("*")
      .limit(1);

    if (error) {
      console.error("Error connecting to Supabase:", error);
    } else {
      console.log("Supabase connection successful. Sample data:", data);
    }
  };

  upsertRecord = async (record: object) => {
    const { data, error } = await this.supabaseClient
      .from("pop_document")
      .upsert(record, { ignoreDuplicates: false });
    //bulk upsert can be done by passing an array of records instead of a single record

    if (error) {
      console.error("Error pushing to Supabase:", error);
    } else {
      console.log("Supabase insert successful. ", data);
    }
  };

  fetchSemanticResults = async (queryEmbedding: unknown[]) => {
    // Call the Supabase RPC function 'match_pop_document'
    const { data, error } = await this.supabaseClient.rpc(
      "match_pop_document",
      {
        query_embedding: queryEmbedding,
        match_threshold: 0.78, // Adjust for "strictness"
        match_count: 5, // Top 5 most relevant guides
      },
    );

    if (error) {
      console.error("Error fetching semantic results from Supabase:", error);
      return [];
    }
    return data;
  };
}
