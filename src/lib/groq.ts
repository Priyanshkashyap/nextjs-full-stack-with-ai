import { createGroq } from "@ai-sdk/groq";

export const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY!,
});

export const GROQ_MODEL = "llama-3.1-8b-instant";