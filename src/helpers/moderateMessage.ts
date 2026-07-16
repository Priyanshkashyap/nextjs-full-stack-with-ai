import { generateText } from "ai";
import { groq,GROQ_MODEL } from "../lib/groq";

export async function moderateMessage(content: string): Promise<boolean> {
  const moderationPrompt = `
You are a strict moderation filter for an anonymous messaging platform.

Return only one word:
SAFE
or
UNSAFE

Mark the message as UNSAFE if it contains:
- abusive language
- hate speech
- threats
- sexual or explicit content
- self-harm encouragement
- spam
- phishing
- harassment

Message:
${content}
`;

  const result = await generateText({
    model: groq(GROQ_MODEL),
    system: moderationPrompt,
    prompt: "Classify the message.",
  });

  const normalized = result.text
    .trim()
    .toLowerCase()
    .replace(/[^a-z]/g, "");

  return normalized === "safe";
}