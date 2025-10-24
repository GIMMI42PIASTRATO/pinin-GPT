import * as z from "zod";

export const PromptSchema = z.object({
	prompt: z.string(),
});

export const ChatMessageSchema = z.object({
	id: z.string(),
	content: z.string(),
	role: z.enum(["user", "assistant", "system"]),
	timestamp: z.coerce.date(),
});

export const ChatSchema = z.object({
	id: z.string().max(36),
	timestamp: z.date(),
	userId: z.string(),
	title: z.string(),
	pinned: z.boolean(),
});

export const ChatMessagesSchema = z.array(ChatMessageSchema);
