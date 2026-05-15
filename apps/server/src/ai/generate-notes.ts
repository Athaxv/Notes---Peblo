import Groq from "groq-sdk";
import { buildSummaryPrompt } from "./prompt";

export type GenerateNoteAIResult = {
  summary: string;
  action_items: string[];
  suggested_title: string;
};

export class GenerateNoteAIService {
  private groq: Groq;

  constructor() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not set");
    }
    this.groq = new Groq({ apiKey });
  }

  async execute(content: string): Promise<GenerateNoteAIResult> {
    const prompt = buildSummaryPrompt(content);

    const completion = await this.groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw) as Partial<GenerateNoteAIResult>;

    return {
      summary: parsed.summary ?? "",
      action_items: Array.isArray(parsed.action_items)
        ? parsed.action_items
        : [],
      suggested_title: parsed.suggested_title ?? "",
    };
  }
}
