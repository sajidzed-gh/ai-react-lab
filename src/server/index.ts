import express from "express";
import cors from "cors";
import axios from "axios";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

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

    let toolinfo;

    /*   const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: process.env.LLM_MODEL,
        messages: [
          //{ role: "system", content: "You are a specialized JSON generator. Output raw text only. No conversational filler. No markdown."},
          { role: "user", content: evalPrompt }
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      },
    );
    const raw = response.data.choices[0].message.content;*/
    const rawToolinfo = await llmApi(extractPrompt);
    console.log(`rawToolinfo, ${rawToolinfo}`);
    toolinfo = evaluationInput(JSON.parse(rawToolinfo));

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
    res.status(500).json({ error: "Analysis failed" });
  }
});

const llmApi = async (prompt: string): Promise<any> => {
  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: process.env.LLM_MODEL,
      messages: [
        //{ role: "system", content: "You are a specialized JSON generator. Output raw text only. No conversational filler. No markdown."},
        { role: "user", content: prompt },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
    },
  );
  //return response.data.choices[0].message.content;

  const match = response.data.choices[0].message.content.match(/\{[\s\S]*\}/);
  if (match) {
    return match[0];
  }
  return null;
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
