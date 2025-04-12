"use server";

// zod
import { ChatMessagesSchema } from "@/schema";

// ollama
import ollama from "ollama";
import { ChatMessage } from "@/types/chatContextTypes";

export const sendQuestion = async (messages: ChatMessage[]) => {
	const validatedMessages = ChatMessagesSchema.safeParse(messages);

	if (!validatedMessages.success) {
		console.log("🛑 Invalid data");
		return { error: "Invalid data" };
	}

	console.log("✅ Data recived:", validatedMessages.data);

	const systemMessage: ChatMessage = {
		id: crypto.randomUUID(),
		content:
			"You are a helpful assistant that responds ONLY with valid JSON.",
		role: "system",
		timestamp: new Date(),
	};
	// TODO: be able to select models
	const response = await ollama.chat({
		model: "gemma3:1b",
		messages: [...validatedMessages.data],
		format: "json",
		stream: false,
	});

	return { message: response.message.content };
};
