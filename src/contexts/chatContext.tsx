"use client";

import { createContext, useState, useContext, ReactNode } from "react";
import { ChatMessage, ChatContextType } from "@/types/chatContextTypes";

// Create the context with default values
const ChatContext = createContext<ChatContextType>({
	messages: [],
	currentPrompt: "",
	isLoading: false,
	error: null,
	setCurrentPrompt: () => {},
	addMessage: (content: string, role: "user" | "assistant") => ({
		id: "",
		content,
		role,
		timestamp: new Date(),
	}),
	clearMessages: () => {},
	setError: () => {},
	setIsLoading: () => {},
});

// Provider component
export function ChatProvider({ children }: { children: ReactNode }) {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [currentPrompt, setCurrentPrompt] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const addMessage = (
		content: string,
		role: "user" | "assistant"
	): ChatMessage => {
		const newMessage: ChatMessage = {
			id: crypto.randomUUID(),
			content,
			role,
			timestamp: new Date(),
		};
		setMessages((prev) => [...prev, newMessage]);

		return newMessage;
	};

	const clearMessages = () => {
		setMessages([]);
	};

	return (
		<ChatContext.Provider
			value={{
				messages,
				currentPrompt,
				isLoading,
				error,
				setCurrentPrompt,
				addMessage,
				clearMessages,
				setError,
				setIsLoading,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
}

// Custom hook for using the context
export function useChatContext() {
	const context = useContext(ChatContext);
	if (context === undefined) {
		throw new Error("useChatContext must be used within a ChatProvider");
	}
	return context;
}
