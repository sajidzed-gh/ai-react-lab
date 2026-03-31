import { useState } from "react";
import axios from "axios";

export default function MAAnalyzer() {
  const [tools, setTools] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!tools) return;

    setLoading(true);
    setResult(null);

    try {
      const resp = await axios.post("http://localhost:5000/api/analyze-tools", {
        tools,
      });
      console.log("resppp", resp);
      setResult(resp.data);
    } catch (err) {
      setResult({ err: "failed to analyze" });
      console.log("analyze failed ", err);
    }
    setLoading(false);
  };
  return (
    <div>
      <h2>M&A compliance analyzer</h2>
      Architecture
      <pre>
        Input Tools ↓ Step 1: Extract tool attributes (LLM) ↓ Step 2: Map
        attributes → SOC2 criteria ↓ Step 3: Evaluate compliance per criterion ↓
        Final structured output
      </pre>
      <p>
        <a href="https://chatgpt.com/s/t_69c750b55d488191bbfb6f03bb252a93">
          https://chatgpt.com/s/t_69c750b55d488191bbfb6f03bb252a93
        </a>
      </p>
      <textarea
        rows={6}
        value={tools}
        onChange={(e) => setTools(e.target.value)}
        placeholder="list tools with descriptions..."
      ></textarea>
      <br />
      <button onClick={analyze}>{loading ? "Analyzing...." : "Analyze"}</button>
      {result && (
        <div>
          <h3>Compliant</h3>
          <ul>
            {result.compliant?.map((t: any, i: any) => (
              <li key={i}>
                {t.tool} -- {t.soc2_principle}
              </li>
            ))}
          </ul>

          <h3>❌ Non-Compliant</h3>
          {result.non_compliant?.map((r: any, i: any) => (
            <div key={i}>
              <strong>{r.tool}</strong> - {r.reason}
              <br />
              Principle: {r.soc2_principle}
              <br />
              Severity: {r.severity}
            </div>
          ))}

          <h3>Risk</h3>
          <ul>
            {result.risks?.map((r: any, i: any) => (
              <li key={i}>
                {r.tool} - {r.issue} ({r.severity})
              </li>
            ))}
          </ul>

          <h3>Recommendation</h3>
          <ul>
            {result.recommendations?.map((r: any, i: any) => (
              <li key={i}>
                {/* {r.recommendation ? r.recommendation : r} */}
                {Object.values(r).join(" - ")}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
