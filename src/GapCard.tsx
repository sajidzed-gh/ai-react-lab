export type Gap = {
  criteria_id: string;
  issue: string;
  risk: string;
  recommendation: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  category: string;
};

export function GapCard({ gap }: { gap: Gap }) {
  console.log(`gap : ${gap}`);
  return (
    <div className="border rounded p-4 mb-4 shadow">
      <h3 className="font-bold text-lg">
        [{gap.severity}] {gap.criteria_id}
      </h3>

      <p>
        <strong>Issue:</strong> {gap.issue}
      </p>
      <p>
        <strong>Risk:</strong> {gap.risk}
      </p>
      <p>
        <strong>Recommendation:</strong> {gap.recommendation}
      </p>
      <p className="text-sm text-gray-500">Category: {gap.category}</p>
    </div>
  );
}
