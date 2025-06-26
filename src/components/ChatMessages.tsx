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
	StreamingModelMessage,
} from "@/components/MessageComponent";

export default function ChatMessages() {
	const {
		messages,
		error,
		isLoading,
		selectedModel,
		modelsLoading,
		optimisticModelsLoaded,
		currentChatId,
		isStreaming,
		streamingText,
	} = useChatContext();
	const { user, isLoaded } = useUser();
	const messageEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages, isLoading, streamingText]); // Aggiunto streamingText per lo scroll durante lo streaming

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

	if (modelsLoading && !optimisticModelsLoaded) {
		return (
			<div className="flex justify-center items-center h-40">
				<span className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></span>
				<span className="ml-2">Caricamento modelli...</span>
			</div>
		);
	}

	if (!isLoaded) {
		return (
			<div className="flex justify-center items-center h-40">
				<span className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></span>
				<span className="ml-2">Caricamento utente...</span>
			</div>
		);
	}

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
					<UserMessage
						key={message.id}
						avatar={user ? user.imageUrl : undefined}
						username={user?.username ? user.username : undefined}
					>
						{message.content}
					</UserMessage>
				) : (
					<ModelMessage
						key={message.id}
						modelName={`${selectedModel.name} ${selectedModel.version}`}
					>
						{message.content}
					</ModelMessage>
				)
			)}

			{/* Show streaming message if streaming is active */}
			{isStreaming && streamingText && (
				<StreamingModelMessage
					modelName={`${selectedModel.name} ${selectedModel.version}`}
				>
					{streamingText}
				</StreamingModelMessage>
			)}

			{isLoading && !isStreaming && (
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
