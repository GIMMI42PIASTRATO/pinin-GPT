import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarGroupContent,
	SidebarHeader,
	SidebarFooter,
} from "@/components/ui/sidebar";
import { SignedOut, SignedIn } from "@clerk/nextjs";
import { Calendar, Home, Inbox, LogIn, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserButtonComponent from "@/components/UserButtonComponent";
import Link from "next/link";

export default function AppSidebar() {
	const items = [
		{
			title: "Home",
			url: "#",
			icon: Home,
		},
		{
			title: "Inbox",
			url: "#",
			icon: Inbox,
		},
		{
			title: "Calendar",
			url: "#",
			icon: Calendar,
		},
		{
			title: "Search",
			url: "#",
			icon: Search,
		},
		{
			title: "Settings",
			url: "#",
			icon: Settings,
		},
	];

	return (
		<Sidebar className="z-[60]">
			<SidebarHeader className="flex justify-center items-center">
				<h1 className="flex h-8 shrink-0 items-center justify-center text-lg font-bold transition-opacity delay-75 duration-75">
					Pinin CHAT
				</h1>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Application</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<a href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SignedIn>
					<UserButtonComponent />
				</SignedIn>
				<SignedOut>
					<Button
						asChild
						variant="ghost"
						className="flex-1 justify-start p-4 hover:bg-gray-200"
					>
						<Link
							href="/sign-in"
							className="flex items-center gap-4 text-base"
						>
							<LogIn />
							<span>Login</span>
						</Link>
					</Button>
				</SignedOut>
			</SidebarFooter>
		</Sidebar>
	);
}
