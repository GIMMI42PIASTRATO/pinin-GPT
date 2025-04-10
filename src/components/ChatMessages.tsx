"use client";

import { useChatContext } from "@/contexts/chatContext";

// Components
import NewConversationTemplate from "./NewConversationTemplate";

export default function ChatMessages() {
	const { messages, error, isLoading } = useChatContext();

	return <NewConversationTemplate />;
}
