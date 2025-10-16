// Custom request/response classes
import { AppRequest, AppResponse } from "@/lib/server/customRequestResponse";

// zod
import { ChatMessagesSchema } from "@/schema";
import * as z from "zod";

// ollama
import ollama from "ollama";
import { ChatMessage } from "@/types/chatContextTypes";

// prompt
import { defaultPrompt } from "@/data/prompt";

// drizzle
import { db } from "@/drizzle/db";
import { messagesTable } from "@/drizzle/schema";

// uuid
import { v4 as uuidv4 } from "uuid";

// Define the request body schema
const ChatRequestSchema = z.object({
	messages: ChatMessagesSchema,
	model: z.string(),
	chatId: z.string().optional(),
	systemPrompt: z.string().optional(),
});

type ChatRequestBody = z.infer<typeof ChatRequestSchema>;

/**
 * Handle chat request with Ollama streaming
 */
export const handleChatRequest = async (req: AppRequest, res: AppResponse) => {
	try {
		// Parse the request body
		const body = await req.parseBody<ChatRequestBody>();

		// Validate the request body
		const validation = ChatRequestSchema.safeParse(body);

		if (!validation.success) {
			res.error("Invalid request body: " + validation.error.message, 400);
			return;
		}

		const { messages, model, chatId, systemPrompt } = validation.data;

		// Initialize SSE connection
		res.initSSE();

		// Prepare messages for Ollama
		const ollamaMessages = [
			{
				role: "system" as const,
				content: systemPrompt || defaultPrompt.system,
			},
			...messages.map((msg) => ({
				role: msg.role as "user" | "assistant" | "system",
				content: msg.content,
			})),
		];

		// Stream response from Ollama
		const stream = await ollama.chat({
			model: model,
			messages: ollamaMessages,
			stream: true,
		});

		let fullResponse = "";
		const messageId = uuidv4();

		// Send message start event
		res.sendSSE("message-start", { messageId });

		// Stream each chunk
		for await (const chunk of stream) {
			const content = chunk.message.content;
			fullResponse += content;

			// Send chunk to client
			res.sendSSE("message-chunk", {
				messageId,
				content,
				done: chunk.done,
			});
		}

		// Save the message to database if chatId is provided
		if (chatId) {
			try {
				// Save user's last message
				const lastUserMessage = messages[messages.length - 1];
				if (lastUserMessage) {
					await db.insert(messagesTable).values({
						id: lastUserMessage.id,
						chatId: chatId,
						content: lastUserMessage.content,
						role: lastUserMessage.role,
						timestamp: lastUserMessage.timestamp,
					});
				}

				// Save assistant's response
				await db.insert(messagesTable).values({
					id: messageId,
					chatId: chatId,
					content: fullResponse,
					role: "assistant",
					timestamp: new Date(),
				});
			} catch (dbError) {
				console.error("Database error:", dbError);
				// Continue even if database save fails
			}
		}

		// Send completion event
		res.sendSSE("message-complete", {
			messageId,
			fullContent: fullResponse,
		});

		// End the SSE connection
		res.endSSE();
	} catch (error) {
		console.error("Error in handleChatRequest:", error);

		// If headers not sent yet, send error response
		if (!res.headersSent) {
			res.error(
				error instanceof Error
					? error.message
					: "Internal server error",
				500
			);
		} else {
			// If streaming already started, send error event
			res.sendSSE("error", {
				message:
					error instanceof Error
						? error.message
						: "Internal server error",
			});
			res.endSSE();
		}
	}
};
