"use client";

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
import { SignedOut, SignedIn, useUser } from "@clerk/nextjs";
import {
	LogIn,
	MessageSquarePlus,
	MessageSquare,
	Pin,
	Loader2,
	ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import UserButtonComponent from "@/components/UserButtonComponent";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getUserChats } from "@/actions/chatActions";
import { toggleChatPinned } from "@/actions/pinnedActions";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserChat } from "@/types/chatTypes";
import { Chat } from "@/types/chatContextTypes";

export default function AppSidebar() {
	const { user, isLoaded } = useUser();
	const [chats, setChats] = useState<Chat[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [pinnedChats, setPinnedChats] = useState<Chat[]>([]);
	const [recentChats, setRecentChats] = useState<Chat[]>([]);
	const [updatingPinId, setUpdatingPinId] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const pathname = usePathname();
	const router = useRouter();

	// Function to load chats
	const loadChats = async () => {
		// Only load chats if user is authenticated
		if (user && isLoaded) {
			setIsLoading(true);
			const { chats: userChats, error } = await getUserChats(user.id);
			setIsLoading(false);

			if (error) {
				console.error("Error loading chats:", error);
				setError("Failed to load chats. Please try again later.");
				return;
			}

			setChats(userChats);
			// Separate pinned and recent chats
			const { pinned, recent } = pinnedAndRecentChats(userChats);

			setPinnedChats(pinned);
			setRecentChats(recent);
		} else if (isLoaded && !user) {
			// Clear chats if user is not authenticated
			setChats([]);
			setPinnedChats([]);
			setRecentChats([]);
			setIsLoading(false);
		}
	};

	useEffect(() => {
		loadChats();
	}, [user, isLoaded]);

	// Listen for chat creation events
	useEffect(() => {
		const handleChatCreated = () => {
			console.log("Chat created event received, refreshing sidebar...");
			loadChats();
		};

		window.addEventListener("chatCreated", handleChatCreated);

		return () => {
			window.removeEventListener("chatCreated", handleChatCreated);
		};
	}, [user, isLoaded]);

	const pinnedAndRecentChats = (userChats: UserChat[]) => {
		// Separate pinned and recent chats, both sorted by timestamp (most recent first)
		const pinned = userChats
			.filter((chat) => chat.pinned)
			.sort(
				(a, b) =>
					new Date(b.timestamp).getTime() -
					new Date(a.timestamp).getTime()
			);

		const recent = userChats
			.filter((chat) => !chat.pinned)
			.sort(
				(a, b) =>
					new Date(b.timestamp).getTime() -
					new Date(a.timestamp).getTime()
			);

		return { pinned, recent };
	};

	const handleTogglePin = async (chatId: string, e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		setUpdatingPinId(chatId);

		try {
			const result = await toggleChatPinned(chatId);

			if (result.success) {
				const newTimestamp = result.newTimestamp;

				// Update the local state with new pinned status AND updated timestamp
				setChats((prevChats) =>
					prevChats.map((chat) =>
						chat.id === chatId
							? {
									...chat,
									pinned: result.pinned,
									timestamp: newTimestamp,
							  }
							: chat
					)
				);

				// Update pinned and recent lists maintaining timestamp order
				const updatedChat = chats.find((c) => c.id === chatId);
				if (updatedChat) {
					const chatWithUpdatedPin = {
						...updatedChat,
						pinned: result.pinned,
						timestamp: newTimestamp, // Update timestamp in local state
					};

					if (result.pinned) {
						// Add to pinned and sort by timestamp
						const newPinnedChats = [
							...pinnedChats,
							chatWithUpdatedPin,
						].sort(
							(a, b) =>
								new Date(b.timestamp).getTime() -
								new Date(a.timestamp).getTime()
						);
						setPinnedChats(newPinnedChats);

						// Remove from recent
						setRecentChats((prev) =>
							prev.filter((c) => c.id !== chatId)
						);
					} else {
						// Add to recent and sort by timestamp
						const newRecentChats = [
							...recentChats,
							chatWithUpdatedPin,
						].sort(
							(a, b) =>
								new Date(b.timestamp).getTime() -
								new Date(a.timestamp).getTime()
						);
						setRecentChats(newRecentChats);

						// Remove from pinned
						setPinnedChats((prev) =>
							prev.filter((c) => c.id !== chatId)
						);
					}
				}
			}
		} catch (error) {
			console.error("Error toggling pin status:", error);
		} finally {
			setUpdatingPinId(null);
		}
	};

	return (
		<Sidebar className="z-[60]">
			<SidebarHeader className="flex flex-col gap-4 px-6 py-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
				<div className="flex justify-between items-center">
					<h1 className="text-2xl font-bold text-gray-800 tracking-tight">
						PininGPT
					</h1>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									size="sm"
									variant="ghost"
									onClick={() => router.push("/chat")}
									title="New Chat"
									className="h-9 w-9 hover:bg-gray-100 transition-colors duration-200"
								>
									<MessageSquarePlus className="h-5 w-5" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>New Chat</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>

				{/* PininGPT Studio Button */}
				<div className="w-full">
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									asChild
									className="w-full bg-gray-900 hover:bg-gray-800 text-white border-0 h-12 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 group relative overflow-hidden"
								>
									<Link
										href="#"
										className="flex items-center justify-center gap-2 font-medium"
									>
										<div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
										<div className="relative z-10 flex items-center gap-2">
											<span className="font-bold text-lg">
												PininGPT
											</span>
											<span className="font-serif italic text-sm opacity-90">
												STUDIO
											</span>
											<ExternalLink className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity duration-200" />
										</div>
									</Link>
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Open PininGPT Studio</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			</SidebarHeader>
			<SidebarContent className="px-4">
				{isLoading ? (
					<div className="flex justify-center py-8">
						<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
					</div>
				) : error && user ? (
					<div className="h-full flex items-center justify-center p-4">
						<div className="flex flex-col bg-red-50 text-red-500 p-3 rounded-md max-w-xs text-center gap-2 justify-center items-center">
							<p className="font-medium">Error</p>
							<p className="text-sm">{error}</p>
							<Button
								onClick={() => {
									setError(null);
									loadChats();
								}}
								variant="destructive"
								className="w-min"
							>
								Try Again
							</Button>
						</div>
					</div>
				) : (
					<>
						{pinnedChats.length > 0 && (
							<SidebarGroup>
								<SidebarGroupLabel>Pinned</SidebarGroupLabel>
								<SidebarGroupContent>
									<SidebarMenu>
										{pinnedChats.map((chat) => (
											<SidebarMenuItem key={chat.id}>
												<SidebarMenuButton asChild>
													<div className="flex w-full relative group">
														<Link
															href={`/chat/${chat.id}`}
															className={cn(
																"flex items-center gap-2 flex-1 pr-10 truncate",
																pathname ===
																	`/chat/${chat.id}` &&
																	"bg-accent text-accent-foreground"
															)}
														>
															<MessageSquare className="h-4 w-4 shrink-0" />
															<span className="truncate">
																{chat.title}
															</span>
														</Link>
														<TooltipProvider>
															<Tooltip>
																<TooltipTrigger
																	asChild
																>
																	<Button
																		size="icon"
																		variant="ghost"
																		className="h-8 w-8 absolute right-1"
																		onClick={(
																			e
																		) =>
																			handleTogglePin(
																				chat.id,
																				e
																			)
																		}
																		disabled={
																			updatingPinId ===
																			chat.id
																		}
																	>
																		{updatingPinId ===
																		chat.id ? (
																			<Loader2 className="h-3.5 w-3.5 animate-spin" />
																		) : (
																			<Pin className="h-3.5 w-3.5 fill-current" />
																		)}
																	</Button>
																</TooltipTrigger>
																<TooltipContent>
																	<p>Unpin</p>
																</TooltipContent>
															</Tooltip>
														</TooltipProvider>
													</div>
												</SidebarMenuButton>
											</SidebarMenuItem>
										))}
									</SidebarMenu>
								</SidebarGroupContent>
							</SidebarGroup>
						)}

						<SidebarGroup>
							<SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
							<SidebarGroupContent>
								<SidebarMenu>
									{recentChats.length > 0 ? (
										recentChats.map((chat) => (
											<SidebarMenuItem key={chat.id}>
												<SidebarMenuButton asChild>
													<div className="flex w-full relative group">
														<Link
															href={`/chat/${chat.id}`}
															className={cn(
																"flex items-center gap-2 flex-1 pr-10 truncate",
																pathname ===
																	`/chat/${chat.id}` &&
																	"bg-accent text-accent-foreground"
															)}
														>
															<MessageSquare className="h-4 w-4 shrink-0" />
															<span className="truncate">
																{chat.title}
															</span>
														</Link>
														<TooltipProvider>
															<Tooltip>
																<TooltipTrigger
																	asChild
																>
																	<Button
																		size="icon"
																		variant="ghost"
																		className="h-8 w-8 absolute right-1 opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100"
																		onClick={(
																			e
																		) =>
																			handleTogglePin(
																				chat.id,
																				e
																			)
																		}
																		disabled={
																			updatingPinId ===
																			chat.id
																		}
																	>
																		{updatingPinId ===
																		chat.id ? (
																			<Loader2 className="h-3.5 w-3.5 animate-spin" />
																		) : (
																			<Pin className="h-3.5 w-3.5" />
																		)}
																	</Button>
																</TooltipTrigger>
																<TooltipContent>
																	<p>Pin</p>
																</TooltipContent>
															</Tooltip>
														</TooltipProvider>
													</div>
												</SidebarMenuButton>
											</SidebarMenuItem>
										))
									) : (
										<div className="flex justify-center py-4">
											<span className="text-muted-foreground">
												No chats yet
											</span>
										</div>
									)}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					</>
				)}
			</SidebarContent>
			<SidebarFooter className="p-4 border-t border-gray-200 bg-gray-50/50">
				<SignedIn>
					<UserButtonComponent />
				</SignedIn>
				<SignedOut>
					<Button
						asChild
						variant="ghost"
						className="flex-1 justify-start p-4 hover:bg-white hover:shadow-sm transition-all duration-200 rounded-lg"
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
