"use server";

import { db } from "@/drizzle/db";
import { chatsTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

type ToggleChatPinnedResult =
	| {
			success: true;
			pinned: boolean;
			newTimestamp: Date;
	  }
	| {
			success: false;
			error: string;
	  };

/**
 * Toggles the pinned status of a chat
 */
export async function toggleChatPinned(
	chatId: string
): Promise<ToggleChatPinnedResult> {
	try {
		// First, get the current pinned status
		const chat = await db
			.select({ pinned: chatsTable.pinned })
			.from(chatsTable)
			.where(eq(chatsTable.id, chatId))
			.limit(1);

		if (!chat || chat.length === 0) {
			return { success: false, error: "Chat not found" };
		}

		const currentPinnedStatus = chat[0].pinned;

		// Update the pinned status to the opposite of its current value
		// Also update timestamp so the chat appears at the top of its respective list
		const newTimestamp = new Date();
		await db
			.update(chatsTable)
			.set({
				pinned: !currentPinnedStatus,
				timestamp: newTimestamp,
			})
			.where(eq(chatsTable.id, chatId));

		return {
			success: true,
			pinned: !currentPinnedStatus,
			newTimestamp,
		};
	} catch (error) {
		console.error("Error toggling chat pinned status:", error);
		return { success: false, error: "Failed to update chat" };
	}
}
