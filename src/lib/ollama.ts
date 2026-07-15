import { createOpenAI } from "@ai-sdk/openai";

export const ollama = createOpenAI({
  baseURL: process.env.OLLAMA_BASE_URL ?? "http://localhost:11434/v1",
  apiKey: process.env.OLLAMA_API_KEY ?? "ollama",
});

export const OLLAMA_SUGGEST_MODEL =
  process.env.OLLAMA_SUGGEST_MODEL ?? "qwen3:8b";

export const OLLAMA_MODERATION_MODEL =
  process.env.OLLAMA_MODERATION_MODEL ?? "qwen3:8b";