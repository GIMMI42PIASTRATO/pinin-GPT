import { SidebarProvider /**SidebarTrigger */ } from "@/components/ui/sidebar";
// import AppSidebar from "@/components/AppSidebar";
import { cookies } from "next/headers";

export default async function ChatLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const cookieStore = await cookies();
	const sidebarState = cookieStore.get("sidebar_state");
	const defaultOpen = sidebarState ? sidebarState.value == "true" : true;

	return (
		<SidebarProvider defaultOpen={defaultOpen}>
			{/* <AppSidebar /> */}
			<main className="relative flex w-full flex-1 flex-col overflow-hidden">
				{/* <SidebarTrigger className="pointer-events-auto h-8 w-8 p-1 fixed left-2 top-2 z-50 font-medium gap-2 focus-visible:ring-1" /> */}
				{children}
			</main>
		</SidebarProvider>
	);
}
