import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";
import Link from "next/link";

export default async function ChatLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { userId } = await auth();
	const cookieStore = await cookies();
	const sidebarState = cookieStore.get("sidebar_state");
	const defaultOpen = sidebarState ? sidebarState.value == "true" : true;

	return (
		<SidebarProvider defaultOpen={defaultOpen}>
			{userId && <AppSidebar />}
			<main className="relative flex w-full flex-1 flex-col overflow-hidden">
				{userId ? (
					<Button
						size="icon"
						variant="ghost"
						title="Mostra/Nascondi Sidebar"
						className="pointer-events-auto fixed left-2 top-2 z-50 font-medium gap-2 focus-visible:ring-1"
						asChild
					>
						<SidebarTrigger />
					</Button>
				) : (
					<div className="flex flex-1 justify-between pointer-events-auto fixed left-2 right-2 top-2 z-50 font-medium p-1 gap-2">
						<Button
							size="icon"
							variant="ghost"
							title="Nuova Chat"
							className="pointer-events-auto p-1 gap-2 focus-visible:ring-1"
							asChild
						>
							<a href="/chat">
								<MessageSquarePlus />
							</a>
						</Button>
						<div className="flex items-center gap-2">
							<Button className="rounded-full">
								<Link href="/sign-in" className="font-medium">
									Accedi
								</Link>
							</Button>
							<Button variant="outline" className="rounded-full">
								<Link href="/sign-in" className="font-medium">
									Registrati gratuitamente
								</Link>
							</Button>
						</div>
					</div>
				)}
				{children}
			</main>
		</SidebarProvider>
	);
}
