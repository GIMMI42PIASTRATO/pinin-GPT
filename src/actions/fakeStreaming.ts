"use server";

import { readFile } from "fs/promises";
import { join } from "path";
import * as z from "zod";
import { ChatMessagesSchema } from "@/schema";
import { ChatMessage } from "@/types/chatContextTypes";
import {
	FAKE_STREAMING_CONFIG,
	getRandomDelay as getConfigDelay,
} from "@/lib/fakeStreamingConfig";

export const sendQuestionFakeStreaming = async (
	messages: ChatMessage[],
	modelId: string
) => {
	const messagesValidation = ChatMessagesSchema.safeParse(messages);
	const modelIdValidation = z.string().safeParse(modelId);

	if (!messagesValidation.success || !modelIdValidation.success) {
		console.log("🛑 Invalid data");
		return { error: "Invalid data" };
	}

	console.log("✅ Using fake streaming mode");

	// Controlla se il fake streaming è abilitato
	if (!FAKE_STREAMING_CONFIG.enabled) {
		return { error: "Fake streaming is disabled" };
	}

	// Simula un delay iniziale come se il modello stesse "pensando"
	const initialDelay = getConfigDelay(
		FAKE_STREAMING_CONFIG.initialDelay.min,
		FAKE_STREAMING_CONFIG.initialDelay.max
	);
	await new Promise((resolve) => setTimeout(resolve, initialDelay));

	try {
		// Leggi il contenuto del file response.md
		const filePath = join(
			process.cwd(),
			"public",
			FAKE_STREAMING_CONFIG.responseFile
		);
		const responseContent = await readFile(filePath, "utf-8");

		return { message: responseContent };
	} catch (error) {
		console.error("Error reading response file:", error);
		return { error: "Failed to read response file" };
	}
};

// Funzione helper per creare un delay realistico
function getRandomDelay(): number {
	// Delay casuale tra 20ms e 100ms per simulare la velocità di streaming reale
	return Math.floor(Math.random() * 80) + 20;
}

// Funzione helper per ottenere un numero casuale di caratteri da streammare
function getRandomChunkSize(): number {
	// Streammerà casualmente tra 2 e 6 caratteri alla volta
	return Math.floor(Math.random() * 5) + 2;
}

// Funzione per streammare il testo carattere per carattere (o chunk per chunk)
export async function* streamText(
	text: string
): AsyncGenerator<string, void, unknown> {
	let index = 0;

	while (index < text.length) {
		const chunkSize = getRandomChunkSize();
		const chunk = text.slice(index, index + chunkSize);

		yield chunk;

		index += chunkSize;

		// Aspetta un delay casuale prima del prossimo chunk
		await new Promise((resolve) => setTimeout(resolve, getRandomDelay()));
	}
}
