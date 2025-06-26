import ChatMessages from "@/components/ChatMessages";
import InputPrompt from "@/components/InputPrompt";
import { ChatContainer } from "@/components/MessageComponent";
import { ChatProvider } from "@/contexts/chatContext";
import { getChatById, getChatMessages } from "@/actions/chatActions";
import { notFound } from "next/navigation";

interface ChatPageProps {
	params: {
		chatId: string;
	};
}

export default async function ChatPage({ params }: ChatPageProps) {
	const { chatId } = params;

	// Fetch chat details and messages
	const chat = await getChatById(chatId);

	if (!chat) {
		notFound();
	}

	const messages = await getChatMessages(chatId);

	return (
		<ChatProvider initialChatId={chatId} initialMessages={messages}>
			<div className="flex flex-col min-h-screen">
				<div
					className="flex-1 overflow-y-auto sm:pt-3.5"
					style={{ scrollbarGutter: "stable both-edges" }}
				>
					<ChatContainer>
						<ChatMessages />
					</ChatContainer>
				</div>
				<div className="fixed bottom-0 left-0 w-full ml-[150px] px-2 z-50 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
					<div className="relative mx-auto max-w-3xl">
						<InputPrompt />
					</div>
				</div>
			</div>
		</ChatProvider>
	);
}
