import ChatMessages from "@/components/ChatMessages";

export default function Chat({ params }: { params: { chatId: string } }) {
	return <ChatMessages chatId={params.chatId} />;
}
