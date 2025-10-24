"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SSEChatClient } from "@/lib/client/sseClient";
import { Input } from "@/components/ui/input";
import { FormEvent } from "react";
import { useState } from "react";
import { v4 } from "uuid";
import { ChatMessage } from "@/types/chatContextTypes";
import {
	SSEMessageStart,
	SSEMessageChunk,
	SSEMessageComplete,
	SSEError,
} from "@/lib/client/sseClient";

export default function TestHome() {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [streamingContent, setStreamingContent] = useState<string>("");
	const [isStreaming, setIsStreaming] = useState<boolean>(false);

	const handleClick = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);

		const modelName = String(formData.get("model"));
		const prompt = String(formData.get("prompt"));
		if (!modelName || !prompt) {
			console.log("Insert data!!!");
			return;
		}

		const newMessage: ChatMessage = {
			id: v4(),
			content: prompt,
			role: "user",
			timestamp: new Date(),
		};

		const newMessages = [...messages, newMessage];
		setMessages(newMessages);

		console.log(
			"🀄 Last message: ",
			newMessages[newMessages.length - 1].content
		);

		const client = new SSEChatClient();
		client.sendMessage(
			{
				messages: newMessages,
				model: modelName,
				chatId: v4(),
				systemPrompt: "You are Richard Matthew Stallman",
			},
			{
				onStart: (data: SSEMessageStart) => {
					console.log(
						`Streaming is started with message: ${data.messageId}`
					);
				},
				onChunk: (chunk: SSEMessageChunk) => {
					setStreamingContent((prev) => prev + chunk.content);
				},
				onComplete: (message: SSEMessageComplete) => {
					setIsStreaming(false);
					console.log("Full message received!");
					setStreamingContent((prev) => prev + "\n\n3");
				},
				onError: (error: SSEError) => {
					setIsStreaming(false);
					console.error(error.message);
				},
			}
		);
	};

	return (
		<section className="flex h-screen items-center justify-center">
			<div className="flex w-[1000px] gap-3">
				<Card>
					<CardHeader>
						<CardTitle>Write your prompt</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid gap-2">
							<form
								onSubmit={handleClick}
								className="flex flex-col gap-1"
							>
								<Input
									placeholder="Write the model name"
									name="model"
								></Input>
								<Textarea
									placeholder="Type your message here."
									name="prompt"
								/>
								<Button type="submit" disabled={isStreaming}>
									Send message
								</Button>
							</form>
						</div>
					</CardContent>
				</Card>
				<Card className="flex-1">
					<CardHeader>
						<CardTitle>See the model response</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="w-full">{streamingContent}</div>
					</CardContent>
				</Card>
			</div>
		</section>
	);
}
