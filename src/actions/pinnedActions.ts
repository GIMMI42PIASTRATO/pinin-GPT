"use server";

import { db } from "@/drizzle/db";
import { chatsTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

type ToggleChatPinnedResult =
	| {
			success: true;
			pinned: boolean;
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
		await db
			.update(chatsTable)
			.set({ pinned: !currentPinnedStatus })
			.where(eq(chatsTable.id, chatId));

		return {
			success: true,
			pinned: !currentPinnedStatus,
		};
	} catch (error) {
		console.error("Error toggling chat pinned status:", error);
		return { success: false, error: "Failed to update chat" };
	}
}
