// Components
import ChatMessages from "@/components/ChatMessages";
import InputPrompt from "@/components/InputPrompt";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

// Chat context
import { ChatProvider } from "@/contexts/chatContext";

export default function ChatHome() {
	return (
		<ChatProvider>
			<div className="absolute top-0 bottom-0 w-full">
				<div className="absolute inset-0 overflow-y-scroll pb-32 sm:pt-3.5">
					<MaxWidthWrapper className="max-w-3xl flex flex-col space-y-12 px-4 py-10 md:px-4">
						<ChatMessages />
					</MaxWidthWrapper>
				</div>
				<div className="px-2 absolute bottom-0 w-full z-50">
					<div className="relative mx-auto max-w-3xl">
						<InputPrompt />
					</div>
				</div>
			</div>
		</ChatProvider>
	);
}
