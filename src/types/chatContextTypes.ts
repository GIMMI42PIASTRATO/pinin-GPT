// Define the message structure
export interface ChatMessage {
	id: string;
	content: string;
	role: "user" | "model";
	timestamp: Date;
}

// Define the context shape
export interface ChatContextType {
	messages: ChatMessage[];
	currentPrompt: string;
	isLoading: boolean;
	error: string | null;
	setCurrentPrompt: (prompt: string) => void;
	addMessage: (content: string, role: "user" | "model") => void;
	clearMessages: () => void;
	setError: (error: string | null) => void;
	setIsLoading: (isLoading: boolean) => void;
}
