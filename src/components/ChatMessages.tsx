"use client";

// Hooks
import { useChatContext } from "@/contexts/chatContext";
import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";

// Components
import NewConversationTemplate from "@/components/NewConversationTemplate";
import {
	UserMessage,
	ModelMessage,
	ModelTyping,
} from "@/components/MessageComponent";

export default function ChatMessages() {
	const { messages, error, isLoading, selectedModel, currentChatId } =
		useChatContext();
	const { user } = useUser();
	const messageEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages, isLoading]);

	console.log("👀 Messages array while rendering:", messages);
	console.log("👀 Current chat ID:", currentChatId);

	if (messages.length === 0) {
		return <NewConversationTemplate />;
	}

	// Find the id of the last message of the model
	// const modelMessages = messages.filter(
	// 	(message) => message.role !== "user" && message.role !== "system"
	// );
	// const lastModelMessageId =
	// 	modelMessages.length > 0
	// 		? modelMessages[modelMessages.length - 1].id
	// 		: null;

	if (!selectedModel) {
		return (
			<div className="bg-red-100 p-4 rounded-lg">
				<p className="text-red-500">
					Seleziona un modello per iniziare la conversazione
				</p>
			</div>
		);
	}

	return (
		<>
			{/* Show warning for anonymous users */}
			{!user && messages.length > 0 && (
				<div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
					<p className="text-yellow-800 text-sm">
						⚠️ <strong>Modalità anonima:</strong> La tua
						conversazione non viene salvata.
						<a href="/sign-in" className="underline ml-1">
							Accedi
						</a>{" "}
						per salvare le tue chat.
					</p>
				</div>
			)}

			{messages.map((message) =>
				message.role === "user" ? (
					<UserMessage key={message.id}>
						{message.content}
					</UserMessage>
				) : (
					<ModelMessage
						key={message.id}
						modelName={`${selectedModel.name} ${selectedModel.version}`}
						// className={
						// 	message.id === lastModelMessageId
						// 		? "min-h-[calc(100vh-20rem)]"
						// 		: ""
						// }
					>
						{message.content}
					</ModelMessage>
				)
			)}

			{isLoading && (
				<ModelTyping
					modelName={`${selectedModel.name} ${selectedModel.version}`}
				/>
			)}

			{error && (
				<div className="bg-red-100 p-4 rounded-lg">
					<p className="text-red-500">Errore: {error}</p>
				</div>
			)}

			<div ref={messageEndRef} />
		</>
	);
}
