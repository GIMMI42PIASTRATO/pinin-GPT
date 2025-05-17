import * as z from "zod";

export const PromptSchema = z.object({
	prompt: z.string(),
});

export const ChatId = z.string().min(36).max(36);

export const ChatMessageSchema = z.object({
	id: z.string(),
	content: z.string(),
	role: z.enum(["user", "assistant", "system"]),
	timestamp: z.date(),
	chatId: ChatId,
});

export const ChatMessagesSchema = z.array(ChatMessageSchema);
