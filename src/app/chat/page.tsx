// Components
import ChatMessages from "@/components/ChatMessages";
import InputPrompt from "@/components/InputPrompt";
// import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { ChatContainer } from "@/components/MessageComponent";

// Auth
import { auth } from "@clerk/nextjs/server";

// Chat context
import { ChatProvider } from "@/contexts/chatContext";
// Utils
import { cn } from "@/lib/utils";

export default async function ChatHome() {
	const { userId } = await auth();

	return (
		<ChatProvider initialChatId={null} initialMessages={[]}>
			<div className="flex flex-col min-h-screen">
				<div
					className="flex-1 overflow-y-auto sm:pt-3.5"
					style={{ scrollbarGutter: "stable both-edges" }}
				>
					{/* <MaxWidthWrapper className="pt-10 mx-auto flex w-full max-w-3xl flex-col space-y-12 px-4 pb-36 transform-gpu duration-700 will-change-transform animate-in fade-in-0"> */}
					<ChatContainer>
						<ChatMessages />
					</ChatContainer>
					{/* </MaxWidthWrapper> */}
				</div>
				<div
					className={cn(
						"fixed bottom-0 left-0 w-full px-2 z-50 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60",
						userId ? "ml-[150px]" : ""
					)}
				>
					<div className="relative mx-auto max-w-3xl">
						<InputPrompt />
					</div>
				</div>
			</div>
		</ChatProvider>
	);
}
