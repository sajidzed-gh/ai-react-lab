import { useState } from "react";
import axios from "axios";
import { GapCard, type Gap } from "./GapCard";

export default function MAAnalyzer() {
  const [tools, setTools] = useState("");

  const [loading, setLoading] = useState(false);
  const [gaps, setGaps] = useState<Gap[]>([]);
  const [toolInfo, setToolInfo] = useState<any>("");

  const analyze = async () => {
    if (!tools) return;

    setLoading(true);

    try {
      const resp = await axios.post(
        "http://localhost:5000/api/rag-analyze-tools",
        {
          tools,
        },
      );
      console.log("resppp", resp, resp.data.gaps);
      setToolInfo(resp.data.toolInfo);
      setGaps(resp.data.gaps);
    } catch (err) {
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
      <pre>
        <h2>
          existing tools in market and methodology used (How Automation Works
          for a Procurer)
        </h2>

        <ul>
          <li>
            AI-Powered Parsing: Tools like Bitsight and Vanta use AI to
            instantly "read" uploaded SOC 2 PDFs. They extract key data points,
            such as the auditor's opinion, the audit period, and specific
            control descriptions.
          </li>
          <li>
            Automated Mapping: The software automatically aligns the vendor's
            documented controls with the specific AICPA criteria (e.g., CC1
            through CC9). This highlights exactly where a vendor might be
            missing coverage for a required rule like "Logical Access" or
            "Change Management".
          </li>
          <li>
            Exception Detection: Instead of you hunting through Section IV,
            these platforms can flag "Exceptions" (control failures) and
            categorize them by severity.
          </li>
          <li>
            CUEC Extraction: Advanced tools can automatically pull out the
            Complementary User Entity Controls (your company's "homework") and
            assign them as tasks to your internal IT or Security teams.{" "}
          </li>
        </ul>
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
      <h2>Tool info</h2>
      <ul>
        {Object.entries(toolInfo).map(([label, value]: any) => {
          return (
            <li key={label}>
              <strong>{label}</strong>{" "}
              {Array.isArray(value) ? (
                <span>{value.join(", ")}</span>
              ) : (
                <span>{value}</span>
              )}
            </li>
          );
        })}
      </ul>
      {gaps.map((gap) => {
        console.log(`gap | ${gap}`);
        return <GapCard key={gap.criteria_id} gap={gap} />;
      })}
    </div>
  );
}
