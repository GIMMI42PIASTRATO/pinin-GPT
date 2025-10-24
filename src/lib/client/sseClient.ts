/**
 * Client-side SSE handler for consuming the /api/stream endpoint
 *
 * Example usage:
 *
 * const client = new SSEChatClient();
 *
 * await client.sendMessage({
 *   messages: [...],
 *   model: "llama2",
 *   chatId: "chat-123"
 * }, {
 *   onChunk: (chunk) => console.log("Received:", chunk.content),
 *   onComplete: (message) => console.log("Done:", message.fullContent),
 *   onError: (error) => console.error("Error:", error)
 * });
 */

import { ChatMessage } from "@/types/chatContextTypes";

export interface SSEChatRequest {
	messages: ChatMessage[];
	model: string;
	chatId?: string;
	systemPrompt?: string;
}

export interface SSEMessageChunk {
	messageId: string;
	content: string;
	done: boolean;
}

export interface SSEMessageComplete {
	messageId: string;
	fullContent: string;
}

export interface SSEMessageStart {
	messageId: string;
}

export interface SSEError {
	message: string;
}

export interface SSECallbacks {
	onStart?: (data: SSEMessageStart) => void;
	onChunk?: (data: SSEMessageChunk) => void;
	onComplete?: (data: SSEMessageComplete) => void;
	onError?: (error: SSEError) => void;
}

export class SSEChatClient {
	private baseUrl: string;

	constructor(baseUrl: string = "") {
		this.baseUrl = baseUrl;
	}

	/**
	 * Send a message and stream the response
	 */
	async sendMessage(
		request: SSEChatRequest,
		callbacks: SSECallbacks
	): Promise<void> {
		const response = await fetch(`${this.baseUrl}/api/stream`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(request),
		});

		if (!response.ok) {
			const errorData = await response
				.json()
				.catch(() => ({ error: "Unknown error" }));
			callbacks.onError?.({
				message: errorData.error || "Request failed",
			});
			return;
		}

		const reader = response.body?.getReader();
		if (!reader) {
			callbacks.onError?.({ message: "No response body" });
			return;
		}

		const decoder = new TextDecoder();
		let buffer = "";

		try {
			while (true) {
				const { done, value } = await reader.read();

				if (done) break;

				buffer += decoder.decode(value, { stream: true });
				const lines = buffer.split("\n\n");
				buffer = lines.pop() || "";

				for (const line of lines) {
					if (!line.trim()) continue;

					const [eventLine, dataLine] = line.split("\n");

					// Handle data without event type
					if (!dataLine && eventLine.startsWith("data: ")) {
						const data = eventLine.slice(6);
						if (data === "[DONE]") {
							return;
						}
						continue;
					}

					if (
						!eventLine.startsWith("event: ") ||
						!dataLine?.startsWith("data: ")
					) {
						continue;
					}

					const eventType = eventLine.slice(7);
					const dataStr = dataLine.slice(6);

					try {
						const data = JSON.parse(dataStr);

						switch (eventType) {
							case "message-start":
								callbacks.onStart?.(data);
								break;
							case "message-chunk":
								callbacks.onChunk?.(data);
								break;
							case "message-complete":
								callbacks.onComplete?.(data);
								break;
							case "error":
								callbacks.onError?.(data);
								break;
						}
					} catch (e) {
						console.error("Failed to parse SSE data:", e);
					}
				}
			}
		} catch (error) {
			callbacks.onError?.({
				message:
					error instanceof Error ? error.message : "Unknown error",
			});
		} finally {
			reader.releaseLock();
		}
	}
}
