import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const ollama = createOpenAI({
  baseURL: "http://localhost:11434/v1",
  apiKey: "ollama", // Dummy value. Ollama ignores it.
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const systemPrompt = `
Create a list of three open-ended and engaging questions formatted as a single string.

Rules:
- Separate every question using ||
- Avoid personal or sensitive topics
- Make them suitable for an anonymous social messaging platform.
- Example:
What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?

Only return the questions.
`;

    const result = streamText({
      model: ollama("qwen3:8b"),
      system: systemPrompt,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Ollama Error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to generate messages",
      },
      {
        status: 500,
      }
    );
  }
}