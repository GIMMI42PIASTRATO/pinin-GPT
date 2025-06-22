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

export default function AppSidebar() {
	const { user, isLoaded } = useUser();
	const [chats, setChats] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [pinnedChats, setPinnedChats] = useState<any[]>([]);
	const [recentChats, setRecentChats] = useState<any[]>([]);
	const [updatingPinId, setUpdatingPinId] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const pathname = usePathname();
	const router = useRouter();

	useEffect(() => {
		async function loadChats() {
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
		}

		loadChats();
	}, [user, isLoaded]);

	const pinnedAndRecentChats = (userChats: UserChat[]) => {
		const pinned = userChats.filter((chat) => chat.pinned);
		const recent = userChats.filter((chat) => !chat.pinned);
		return { pinned, recent };
	};

	const handleTogglePin = async (chatId: string, e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		setUpdatingPinId(chatId);

		try {
			const result = await toggleChatPinned(chatId);

			if (result.success) {
				// Update the local state without requiring a full refetch
				setChats((prevChats) =>
					prevChats.map((chat) =>
						chat.id === chatId
							? { ...chat, pinned: result.pinned }
							: chat
					)
				);

				// Update pinned and recent lists
				const updatedChat = chats.find((c) => c.id === chatId);
				if (updatedChat) {
					if (result.pinned) {
						setPinnedChats((prev) => [
							...prev,
							{ ...updatedChat, pinned: true },
						]);
						setRecentChats((prev) =>
							prev.filter((c) => c.id !== chatId)
						);
					} else {
						setRecentChats((prev) => [
							...prev,
							{ ...updatedChat, pinned: false },
						]);
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
			<SidebarHeader className="flex justify-between items-center px-4 py-2">
				<h1 className="flex h-8 shrink-0 items-center justify-center text-lg font-bold transition-opacity delay-75 duration-75">
					Pinin CHAT
				</h1>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								size="sm"
								variant="ghost"
								onClick={() => router.push("/chat")}
								title="New Chat"
							>
								<MessageSquarePlus className="h-5 w-5" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>New Chat</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</SidebarHeader>
			<SidebarContent>
				{isLoading ? (
					<div className="flex justify-center py-4">
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
									setIsLoading(true);
									getUserChats(user.id)
										.then(({ chats: userChats, error }) => {
											if (error) {
												throw new Error(error);
											}
											setChats(userChats);
											const { pinned, recent } =
												pinnedAndRecentChats(userChats);
											setPinnedChats(pinned);
											setRecentChats(recent);
										})
										.catch((err) => {
											console.error(err);
											setError(
												"Failed to load chats. Please try again later."
											);
										})
										.finally(() => setIsLoading(false));
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
													<div className="flex w-full relative">
														<Link
															href={`/chat/${chat.id}`}
															className={cn(
																"flex items-center gap-2 flex-1",
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
													<div className="flex w-full relative">
														<Link
															href={`/chat/${chat.id}`}
															className={cn(
																"flex items-center gap-2 flex-1",
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
