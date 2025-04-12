import * as z from "zod";

export const PromptSchema = z.object({
	prompt: z.string(),
});

export const ChatMessageSchema = z.object({
	id: z.string(),
	content: z.string(),
	role: z.enum(["user", "assistant", "system"]),
	timestamp: z.date(),
});

export const ChatMessagesSchema = z.array(ChatMessageSchema);
