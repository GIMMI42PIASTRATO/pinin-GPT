"use client";

import {
	createContext,
	useState,
	useContext,
	ReactNode,
	useEffect,
} from "react";
import { ChatMessage, ChatContextType } from "@/types/chatContextTypes";
import type { ModelType } from "@/types/modelSelectionAreaTypes";
import { getInstalledModels } from "@/actions/models";

// Create the context with default values
const ChatContext = createContext<ChatContextType>({
	messages: [],
	currentPrompt: "",
	isLoading: false,
	error: null,
	selectedModel: null,
	currentChatId: null,
	setCurrentChatId: () => {},
	setSelectedModel: () => {},
	setCurrentPrompt: () => {},
	setMessages: () => {},
	clearMessages: () => {},
	setError: () => {},
	setIsLoading: () => {},
	models: [],
	modelsLoading: false,
	setModels: () => {},
	setModelsLoading: () => {},
});

// Provider component
interface ChatProviderProps {
	children: ReactNode;
	initialChatId?: string | null;
	initialMessages?: ChatMessage[];
}

export function ChatProvider({
	children,
	initialChatId = null,
	initialMessages = [],
}: ChatProviderProps) {
	const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
	const [currentPrompt, setCurrentPrompt] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [models, setModels] = useState<ModelType[]>([]);
	const [selectedModel, setSelectedModel] = useState<ModelType | null>(null);
	const [modelsLoading, setModelsLoading] = useState(true);
	const [currentChatId, setCurrentChatId] = useState<string | null>(
		initialChatId
	);

	useEffect(() => {
		async function loadModels() {
			try {
				setModelsLoading(true);
				const installedModels = await getInstalledModels();
				setModels(installedModels);
				setSelectedModel(installedModels[0] || null);
			} catch (err) {
				console.error("Failed to load models:", err);
				setError("Failed to load models. Please try again later.");
			} finally {
				setModelsLoading(false);
			}
		}
		loadModels();
	}, []);

	const clearMessages = () => {
		setMessages([]);
		setCurrentChatId(null);
	};

	return (
		<ChatContext.Provider
			value={{
				messages,
				currentPrompt,
				isLoading,
				error,
				currentChatId,
				setCurrentChatId,
				setCurrentPrompt,
				setMessages,
				clearMessages,
				setError,
				setIsLoading,
				selectedModel,
				setSelectedModel,
				models,
				modelsLoading,
				setModels,
				setModelsLoading,
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
