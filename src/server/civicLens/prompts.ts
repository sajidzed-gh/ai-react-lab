export async function generateActionPlan(
  title: string,
  resource_link: string,
): Promise<string> {
  const prompt = `This is a guide titled "${title}". Based strictly on the provided document ${resource_link}, generate a 3-step actionable checklist for a city worker or a police officer to 
    address this issue today. For every step, you must include a direct quote or a page number reference from the PDF to justify the recommendation
  `;

  // const prompt = `This is a guide titled "${title}". Based on the provided document ${resource_link}, generate a 3-step actionable checklist for a city worker or a police officer to
  //     address this issue today.`;

  return prompt;
}
