"use server";

import { db } from "@/drizzle/db";
import { chatsTable, messagesTable } from "@/drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { type ChatMessage, type Chat } from "@/types/chatContextTypes";
import { v4 as uuidv4 } from "uuid";
import ollama from "ollama";

/**
 * Creates a new chat with the first message and returns the chat ID and title
 */
export async function createNewChat(
	firstMessage: ChatMessage,
	modelId: string,
	userId: string
) {
	try {
		// Generate chat title using the model
		const titleRequestMessage: ChatMessage = {
			id: uuidv4(),
			content: `Generate a short, concise title (max 4-5 words) for a chat that starts with this message: "${firstMessage.content}". Only respond with the title, nothing else.`,
			role: "system",
			timestamp: new Date(),
		};

		const titleResponse = await ollama.chat({
			model: modelId,
			messages: [titleRequestMessage],
			stream: false,
		});

		const chatTitle = titleResponse.message.content
			.trim()
			.replace(/['"]/g, "");

		// Create new chat
		const chatId = uuidv4();
		const newChat = {
			id: chatId,
			title: chatTitle || "New Chat",
			userId,
			timestamp: new Date(),
			pinned: false,
		};

		await db.insert(chatsTable).values(newChat);

		// Save the first message
		await db.insert(messagesTable).values({
			id: firstMessage.id,
			chatId,
			role: firstMessage.role,
			content: firstMessage.content,
			timestamp: firstMessage.timestamp,
		});

		return { chatId, title: chatTitle };
	} catch (error) {
		console.error("Error creating chat:", error);
		throw new Error("Failed to create chat");
	}
}

/**
 * Saves a message to an existing chat
 */
export async function saveMessageToChat(message: ChatMessage, chatId: string) {
	try {
		await db.insert(messagesTable).values({
			id: message.id,
			chatId,
			role: message.role,
			content: message.content,
			timestamp: message.timestamp,
		});
	} catch (error) {
		console.error("Error saving message:", error);
		throw new Error("Failed to save message");
	}
}

/**
 * Gets all messages for a specific chat
 */
export async function getChatMessages(chatId: string) {
	try {
		const messages = await db
			.select()
			.from(messagesTable)
			.where(eq(messagesTable.chatId, chatId))
			.orderBy(messagesTable.timestamp);

		return messages;
	} catch (error) {
		console.error("Error getting chat messages:", error);
		return [];
	}
}

/**
 * Gets chat details by ID
 */
export async function getChatById(chatId: string) {
	try {
		const chat = await db
			.select()
			.from(chatsTable)
			.where(eq(chatsTable.id, chatId))
			.limit(1);

		return chat[0] || null;
	} catch (error) {
		console.error("Error getting chat:", error);
		return null;
	}
}

/**
 * Gets all chats for a user
 */
export async function getUserChats(
	userId: string
): Promise<{ chats: Chat[]; error: string | null }> {
	try {
		const chats = await db
			.select()
			.from(chatsTable)
			.where(eq(chatsTable.userId, userId))
			.orderBy(desc(chatsTable.timestamp));

		return { chats, error: null };
	} catch (error) {
		console.error("Error getting user chats:", error);
		return { chats: [], error: "Failed to load chats" };
	}
}
