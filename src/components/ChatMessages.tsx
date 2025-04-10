"use client";

import { useChatContext } from "@/contexts/chatContext";

// Components
import NewConversationTemplate from "@/components/NewConversationTemplate";
import { UserMessage, ModelMessage } from "@/components/MessageComponent";

export default function ChatMessages() {
	const { messages, error, isLoading } = useChatContext();

	console.log(messages.length);

	if (messages.length === 0) {
		return <NewConversationTemplate />;
	}

	// Find the id of the last message of the model
	const modelMessages = messages.filter((message) => message.role !== "user");
	const lastModelMessageId =
		modelMessages.length > 0
			? modelMessages[modelMessages.length - 1].id
			: null;

	return (
		<>
			{messages.map((message) =>
				message.role === "user" ? (
					<UserMessage key={message.id}>
						{message.content}
					</UserMessage>
				) : (
					<ModelMessage
						key={message.id}
						className={
							message.id === lastModelMessageId
								? "min-h-[calc(100vh-20rem)]"
								: ""
						}
					>
						{message.content}
					</ModelMessage>
				)
			)}

			{isLoading && (
				<div className="p-4 rounded-lg animate-pulse">
					<p>Generando risposta...</p>
				</div>
			)}

			{error && (
				<div className="bg-red-100 p-4 rounded-lg">
					<p className="text-red-500">Errore: {error}</p>
				</div>
			)}
		</>
	);
}
