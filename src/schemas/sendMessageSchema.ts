import z from "zod";

export const sendMessageSchema = z.object({
  username: z.string().min(1, "Username is required").trim(),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters")
    .max(300, "Content must be at most 300 characters"),
});