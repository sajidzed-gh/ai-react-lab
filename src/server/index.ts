import express from "express";
import cors from "cors";
import axios from "axios";
import "dotenv/config";
import { matchCriteria } from "./utils/search.ts";
import { AICPA_TSC_Criteria, embedCriteria } from "./utils/kb.ts";
import { toolDetailsPrompt, soc2AuditorPrompt } from "./utils/prompts.ts";
import { createClient } from "@supabase/supabase-js";
import { supabaseOperations } from "./civicLens/supabaseOperations.ts";
import popData from "./civicLens/guides_projects.json" with { type: "json" };
import { type Request, type Response } from "express";
import { batchUpsert, chunkJsonArray } from "./civicLens/helpers.ts";
import { createBatch } from "./civicLens/createEmbeddings.ts";
import { generateActionPlan } from "./civicLens/prompts.ts";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(cors());
app.use(express.json());

// Replace with your actual project details from Settings > API
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase credentials in environment variables.");
}

const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
const supabaseOps = new supabaseOperations(supabaseClient);

app.get("/api/test", async (req, res) => {
  console.log("HIT /api/test");
  res.status(200).send(`Hello from API of React-app ${req}`);
});

app.post("/api/analyze-tools", async (req, res) => {
  try {
    const { tools } = req.body;
    const extractPrompt = `Extract structured information about this tool.

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
${tools}`;

    const rawToolinfo = await llmApi(extractPrompt);
    console.log(`rawToolinfo, ${rawToolinfo}`);
    const toolinfo = evaluationInput(JSON.parse(rawToolinfo));

    const evalPrompt = `You are a SOC 2 compliance auditor.

SOC 2 principles:
1. Security - protect systems from unauthorized access
2. Availability - systems must be operational
3. Confidentiality - sensitive data must be protected
4. Processing Integrity - accurate and complete processing
5. Privacy - personal data must be handled properly

Analyze the based on the Tool data for SOC 2 compliance.

Return ONLY JSON in this format:

{
  "compliant": [],
  "non_compliant": [
    {
      "tool": "",
      "reason": "",
      "soc2_principle": "",
      "severity": "low | medium | high"
    }
  ],
  "missing_info": [],
  "recommendations": []
}

Tool data:
${JSON.stringify(toolinfo)}`;

    console.log(`toolinfo, ${toolinfo}`);
    console.log(`evalPrompt, ${evalPrompt}`);
    const raw = await llmApi(evalPrompt);

    //parse AI JSON safely
    let parsed;
    try {
      console.log("raw response", raw);
      parsed = JSON.parse(raw);
      console.log("parsed response", parsed);
    } catch (err) {
      console.error(`in CATCH *******`, err);
      return res.status(500).json({ error: "invalid AI response format" });
    }
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: `"Analysis failed" ${err}` });
  }
});

//Call once at server start.

(async () => {
  console.log("Embedding criteria");
  await embedCriteria();
  console.log("Embeddings criteria ready");
})();

app.post("/api/rag-analyze-tools", async (req, res) => {
  try {
    const { tools } = req.body;

    const rawToolinfo = await llmApi(toolDetailsPrompt(tools));
    const toolinfo = evaluationInput(JSON.parse(rawToolinfo));

    const matches = await matchCriteria(
      JSON.stringify(toolinfo),
      AICPA_TSC_Criteria,
    );
    const context = matches
      .map((m) => `${m.id} (${m.category}): ${m.requirement}`)
      .join("\n");

    const raw = await llmApi(
      soc2AuditorPrompt(context, JSON.stringify(toolinfo)),
    );
    const parsed = JSON.parse(raw);
    console.log(`parsed, | ${parsed}`);

    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: `failed semantic serach - ${err}` });
  }
});

/**
 * Endpoint to create embeddings and upsert to Supabase
 * NOTE : call this endpoint once to create embeddings for the guides_projects data and upsert to supabase.
 *  The batchUpsert function creates embedding for each record in the batch and then calls the upsertRecord function of supabaseOperations class to upsert to supabase.
 *  The chunkJsonArray function is used to chunk the data into smaller batches of 100 records each to avoid memory issues while creating embeddings.
 */

app.post(
  "/api/civic-lens/create-embeddings",
  async (req: Request, res: Response) => {
    try {
      const batches = chunkJsonArray(popData, 100);
      console.log(
        `Total records: ${popData.length}, Total batches: ${batches.length}`,
      );
      for (const batch of batches) {
        console.log(`Processing batch with ${batch.length} records`);
        await batchUpsert(batch, supabaseOps);
      }

      res.status(200).json({
        message: "Created embeddings and bulk upsert went through ...",
      });
    } catch (err) {
      res.status(500).json({ error: `failed to create embeddings - ${err}` });
    }
  },
);

app.post(
  "/api/civic-lens/semantic-search",
  async (req: Request, res: Response) => {
    try {
      const { record } = req.body;
      console.log(record);
      const item = { id: -1, title: record.title };
      const titleEmbedding = await createBatch([item]);
      //console.log(`rowsresult, ${JSON.stringify(titleEmbedding)}`);
      const semanticResult = await supabaseOps.fetchSemanticResults(
        titleEmbedding[0].embedding,
      );
      const prompt = await generateActionPlan(
        semanticResult[0].meta_data.title,
        semanticResult[0].meta_data.resource_link,
      );
      const llmResponse = await llmGeminiApi(prompt);

      res
        .status(200)
        .json({
          rowsToUpsert: titleEmbedding,
          fetchResult: semanticResult,
          llmResponse,
        });
    } catch (err) {
      res.status(500).json({ error: `failed API semantic-search - ${err}` });
    }
  },
);

// Helper functions
const llmApi = async (
  prompt: string,
  feature: string | null = "civic_lens",
): Promise<any> => {
  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: process.env.LLM_MODEL,
      messages: [{ role: "user", content: prompt }],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
    },
  );

  if (feature === "civic_lens") {
    return response.data.choices[0].message.content;
  }

  const match = response.data.choices[0].message.content.match(/\{[\s\S]*\}/);
  if (match) {
    return match[0];
  }
  return null;
};

// Separate function for Gemini API calls 
//It uses tools feature to read the Data from the link and summarize. check prompt
// given its preview model, the response is 503 status-expeiencing high demands
const llmGeminiApi = async (prompt: string): Promise<any> => {
  const ai = new GoogleGenAI({});
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt, // "Explain how AI works in a few words",
    config: {
      tools: [{ urlContext: {} }],
    },
  });
  console.log(response.text);
  return response.text;
};

const evaluationInput = (toolInfo: any): any => {
  return {
    name: toolInfo.name,
    data_types: toolInfo.data_types,
    stores_personal_data: toolInfo.stores_personal_data,
    security_features: toolInfo.security_features,
    access_control: toolInfo.access_control,
    hosting: toolInfo.hosting,
  };
};

app.listen(5000, () => console.log("server 5000 is running"));
