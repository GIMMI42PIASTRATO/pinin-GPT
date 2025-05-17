import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { cookies } from "next/headers";
import { ChatProvider } from "@/contexts/chatContext";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import InputPrompt from "@/components/InputPrompt";

export default async function ChatLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const cookieStore = await cookies();
	const sidebarState = cookieStore.get("sidebar_state");
	const defaultOpen = sidebarState ? sidebarState.value == "true" : true;

	return (
		<ChatProvider>
			<SidebarProvider defaultOpen={defaultOpen}>
				<AppSidebar />
				<main className="relative flex w-full flex-1 flex-col overflow-hidden">
					<SidebarTrigger className="pointer-events-auto h-8 w-8 p-1 fixed left-2 top-2 z-50 font-medium gap-2 focus-visible:ring-1" />
					<div className="flex flex-col min-h-screen">
						<div
							className="flex-1 overflow-y-auto sm:pt-3.5"
							style={{ scrollbarGutter: "stable both-edges" }}
						>
							<MaxWidthWrapper className="pt-10 mx-auto flex w-full max-w-3xl flex-col space-y-12 px-4 pb-36 transform-gpu duration-700 will-change-transform animate-in fade-in-0">
								{children}
							</MaxWidthWrapper>
						</div>
						<div className="fixed bottom-0 left-0 w-full px-2 z-50 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
							<div className="relative mx-auto max-w-3xl">
								<InputPrompt />
							</div>
						</div>
					</div>
				</main>
			</SidebarProvider>
		</ChatProvider>
	);
}
