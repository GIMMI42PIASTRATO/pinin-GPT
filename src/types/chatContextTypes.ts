import { ChatMessageSchema } from "@/schema";
import * as z from "zod";

// Define the message structure
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

// Define the chat strucutre
export interface Chat {
	id: string;
	name: string;
	timestamp: Date;
	pinned: boolean;
}

// Define the context shape
export interface ChatContextType {
	messages: ChatMessage[];
	currentPrompt: string;
	isLoading: boolean;
	error: string | null;
	currentChatId: string | null;
	setCurrentPrompt: React.Dispatch<React.SetStateAction<string>>;
	setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
	clearMessages: () => void;
	setError: React.Dispatch<React.SetStateAction<string | null>>;
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
