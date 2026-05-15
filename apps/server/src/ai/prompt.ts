export const buildSummaryPrompt = (content: string) => {
  return `
You are an intelligent productivity assistant.

Analyze the following note.

Generate:
1. A concise summary
2. Action items (array of strings)
3. A suggested title

Return JSON only with this shape:
{
  "summary": "string",
  "action_items": ["string"],
  "suggested_title": "string"
}

NOTE:
${content}
`;
};
