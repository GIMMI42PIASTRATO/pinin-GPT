"use server";

import ollama from "ollama";
import { v4 as uuidv4 } from "uuid";
import * as z from "zod";

import { defaultPrompt } from "@/data/prompt";
import { ChatMessagesSchema } from "@/schema";
import { ChatMessage } from "@/types/chatContextTypes";

export const sendQuestionStreming = async (
	messages: ChatMessage[],
	modelId: string
) => {
	const messagesValidation = ChatMessagesSchema.safeParse(messages);
	const modelIdValidation = z.string().safeParse(modelId);

	if (!messagesValidation.success || !modelIdValidation.success) {
		console.log("🛑 Invalid data");
		return { error: "Invalid data" };
	}

	// Extract validated data for easier usage
	const validMessages = messagesValidation.data;
	const validModelId = modelIdValidation.data;

	// console.log("🆘" + !models.find((model) => model.id === validModelId));

	const installedModels = (await ollama.list()).models;

	if (!installedModels.find((model) => model.name === validModelId)) {
		console.log(`🛑 Model with ID: ${validModelId} not found`);
		return {
			error: `Model with ID: ${validModelId} not found`,
		};
	}

	console.log("✅ Data recived:", validMessages);

	const systemMessage: ChatMessage = {
		id: uuidv4(),
		content: defaultPrompt.system,
		role: "system",
		timestamp: new Date(),
	};

	try {
		const response = await ollama.chat({
			model: modelId,
			messages: [systemMessage, ...validMessages],
			stream: true,
		});
	} catch (error) {
		console.error("Error in streaming chat:", error);
		return { error: "Failed to send question" };
	}
};
