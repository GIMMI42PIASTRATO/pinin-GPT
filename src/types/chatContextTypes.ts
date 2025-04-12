import { ChatMessageSchema } from "@/schema";
import * as z from "zod";

// Define the message structure
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

// Define the context shape
export interface ChatContextType {
	messages: ChatMessage[];
	currentPrompt: string;
	isLoading: boolean;
	error: string | null;
	setCurrentPrompt: (prompt: string) => void;
	addMessage: (content: string, role: "user" | "assistant") => ChatMessage;
	clearMessages: () => void;
	setError: (error: string | null) => void;
	setIsLoading: (isLoading: boolean) => void;
}
