"use client";

// Hooks
import { useForm } from "react-hook-form";
import { useEffect, useTransition, useState } from "react";

// Context
import { useChatContext } from "@/contexts/chatContext";

// zod
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Components
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowUp, ChevronDown } from "lucide-react";
import { Form } from "@/components/ui/form";
import { ModelSelectionArea } from "@/components/ModelSelectionArea";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

// Utils
import { cn } from "@/lib/utils";

// Server actions
import { sendQuestion } from "@/actions/chat";
import { sendQuestionFakeStreaming, streamText } from "@/actions/fakeStreaming";
import { createNewChat, saveMessageToChat } from "@/actions/chatActions";
import { useRouter } from "next/navigation";

// Utils
import {
	simulateRealisticDelay,
	getSmartChunkSize,
	shouldAddPause,
	debugLog,
} from "@/lib/streamingUtils";
import { FAKE_STREAMING_CONFIG } from "@/lib/fakeStreamingConfig";

// Auth
import { useUser } from "@clerk/nextjs";

// Types
import { InputPromptTypes } from "@/types/propTypes";
import { ChatMessage } from "@/types/chatContextTypes";

// zod schema
import { PromptSchema } from "@/schema";
import type { ModelType } from "@/types/modelSelectionAreaTypes";

// uuid
import { v4 as uuidv4 } from "uuid";

export default function InputPrompt({ className, ...props }: InputPromptTypes) {
	const [isPending, startTransition] = useTransition();
	const [modelPopoverOpen, setModelPopoverOpen] = useState(false);
	const { user } = useUser();

	const router = useRouter();
	const {
		messages,
		setMessages,
		currentPrompt,
		setCurrentPrompt,
		isLoading,
		setIsLoading,
		error,
		setError,
		selectedModel,
		setSelectedModel,
		currentChatId,
		setCurrentChatId,
		isStreaming,
		setIsStreaming,
		streamingText,
		setStreamingText,
	} = useChatContext();

	type FormSchema = z.infer<typeof PromptSchema>;
	const form = useForm<FormSchema>({
		resolver: zodResolver(PromptSchema),
		defaultValues: {
			prompt: "",
		},
	});

	// Sync the field of the form with currentPrompt when it changes
	useEffect(() => {
		console.log("💬 Current prompt: ", currentPrompt);
		form.setValue("prompt", currentPrompt);
	}, [currentPrompt, form]);

	// Helper function for fake streaming
	const handleFakeStreaming = async (
		responseText: string,
		onComplete?: () => void
	) => {
		debugLog("Starting fake streaming", {
			textLength: responseText.length,
		});
		setIsStreaming(true);
		setStreamingText("");

		// Rimuovo il delay aggiuntivo qui per evitare troppi delay sovrapposti
		debugLog("Starting streaming immediately");

		// Simulate streaming by gradually revealing the text
		let currentIndex = 0;
		let chunkCount = 0;

		const processNextChunk = async () => {
			if (currentIndex >= responseText.length) {
				debugLog("Streaming completed", { totalChunks: chunkCount });

				// Create the final assistant message
				const assistantMessage: ChatMessage = {
					id: uuidv4(),
					content: responseText,
					role: "assistant",
					timestamp: new Date(),
				};

				// Add the complete message to the messages array
				setMessages((prev) => [...prev, assistantMessage]);

				// Save message to database if user is authenticated and chat is not temporary
				if (
					currentChatId &&
					user &&
					!currentChatId.startsWith("temp-")
				) {
					saveMessageToChat(assistantMessage, currentChatId);
				}

				// Reset streaming state
				setIsStreaming(false);
				setStreamingText("");
				setIsLoading(false);

				// Call onComplete callback if provided
				if (onComplete) {
					onComplete();
				}

				return;
			}

			// Get smart chunk size based on context
			const chunkSize = getSmartChunkSize(responseText, currentIndex);
			const nextIndex = Math.min(
				currentIndex + chunkSize,
				responseText.length
			);
			const chunk = responseText.slice(currentIndex, nextIndex);

			debugLog(`Streaming chunk ${chunkCount}`, {
				chunk: chunk.replace(/\n/g, "\\n"),
				chunkSize,
				currentIndex,
				nextIndex,
			});

			// Update the streaming text
			setStreamingText((prev) => prev + chunk);
			currentIndex = nextIndex;
			chunkCount++;

			// Determine base delay and any additional pause
			const baseDelay = simulateRealisticDelay();
			const additionalPause = shouldAddPause(responseText, currentIndex);
			const totalDelay = baseDelay + additionalPause;

			debugLog(`Delays calculated`, {
				baseDelay,
				additionalPause,
				totalDelay,
			});

			// Schedule next chunk
			setTimeout(processNextChunk, totalDelay);
		};

		// Start the streaming process
		processNextChunk();
	};

	const onSubmit = async (data: z.infer<typeof PromptSchema>) => {
		console.log("📬 Submitting data: ", data);
		setError(null);

		if (!data.prompt || data.prompt.trim() === "") {
			return; // Do not send empty message
		}

		// check if the model is selected
		if (!selectedModel) {
			setError("Please select a model");
			return;
		}

		// Check if user is authenticated
		if (!user && !process.env.NEXT_PUBLIC_ALLOW_ANONYMOUS_CHATS) {
			setError("Please sign in to send messages");
			return;
		}

		// Costruisci il nuovo messaggio
		const newMessage: ChatMessage = {
			id: uuidv4(),
			content: data.prompt,
			role: "user",
			timestamp: new Date(),
		};

		// Crea l'array aggiornato dei messaggi
		const updatedMessages = [...messages, newMessage];
		setMessages(updatedMessages); // aggiorna manualmente lo stato

		setCurrentPrompt("");
		form.reset();
		setIsLoading(true);

		try {
			// If this is the first message and we're in the /chat route (no chatId)
			if (!currentChatId && messages.length === 0) {
				console.log("Creating new chat...");

				let chatId = null;
				let title = "New Chat";

				// Only create chat in database if user is authenticated
				if (user) {
					const { chatId: newChatId, title: newTitle } =
						await createNewChat(
							newMessage,
							// selectedModel.id,
							"gemma3:1b",
							user.id
						);
					chatId = newChatId;
					title = newTitle;
					console.log(
						`Chat created with ID: ${chatId} and title: ${title}`
					);
				} else {
					// For anonymous users, generate a temporary ID for UI state only
					chatId = `temp-${uuidv4()}`;
					console.log("Anonymous chat - not saving to database");
				}

				setCurrentChatId(chatId);

				// Use fake streaming instead of real API call
				startTransition(async () => {
					try {
						const response = await sendQuestionFakeStreaming(
							updatedMessages,
							selectedModel.id
						);

						if (response.error) {
							setError(response.error);
							setIsLoading(false);
							return;
						}

						if (response.message) {
							// Start fake streaming with conditional redirect
							const shouldRedirect =
								FAKE_STREAMING_CONFIG.autoRedirect &&
								user &&
								chatId &&
								!chatId.startsWith("temp-");
							await handleFakeStreaming(
								response.message,
								shouldRedirect
									? () => {
											router.push(`/chat/${chatId}`);
									  }
									: undefined
							);
						}
					} catch (error) {
						console.error("Error sending message:", error);
						setError("Failed to send message");
						setIsLoading(false);
					}
				});
			} else {
				// For existing chats, only save the message if user is authenticated and chat is not temporary
				if (
					currentChatId &&
					user &&
					!currentChatId.startsWith("temp-")
				) {
					await saveMessageToChat(newMessage, currentChatId);
				}

				// Use fake streaming for existing chats too
				startTransition(async () => {
					try {
						const response = await sendQuestionFakeStreaming(
							updatedMessages,
							selectedModel.id
						);

						if (response.error) {
							setError(response.error);
							setIsLoading(false);
							return;
						}

						if (response.message) {
							// Start fake streaming (for existing chats, no redirect needed)
							await handleFakeStreaming(response.message);
						}
					} catch (error) {
						console.error("Error sending message:", error);
						setError("Failed to send message");
						setIsLoading(false);
					}
				});
			}
		} catch (error) {
			console.error("Error creating chat:", error);
			setError("Failed to create chat");
			setIsLoading(false);
		}
	};

	// Add a function to handle model selection and close popover
	const handleModelSelect = (model: ModelType) => {
		console.log("Selected model:", model);

		//set the new model
		setSelectedModel(model);
		localStorage.setItem("selectedModelId", model.id);
		// Close the popover after selection
		setModelPopoverOpen(false);
	};

	return (
		<div className="px-2 pt-2 rounded-t-3xl bg-sidebar-accent">
			<Form {...form}>
				<div className="rounded-t-2xl border border-sidebar-border">
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex gap-4 p-3 bg-secondary rounded-t-2xl"
					>
						<Textarea
							className={cn(
								"min-h-12 max-h-60 p-0 rounded-none border-none resize-none text-base placeholder:text-base focus-visible:outline-none focus-visible:ring-0 shadow-none",
								className
							)}
							placeholder="Fai una domanda."
							value={currentPrompt}
							disabled={isPending}
							{...form.register("prompt", {
								onChange: (
									e: React.ChangeEvent<HTMLTextAreaElement>
								) => setCurrentPrompt(e.target.value),
							})}
							onKeyDown={(e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();
									form.handleSubmit(onSubmit)();
								}
							}}
							{...props}
						/>
						<Button
							type="submit"
							size="icon"
							disabled={isPending || !selectedModel}
							title="Invia prompt"
						>
							<ArrowUp />
						</Button>
					</form>
					<Popover
						open={modelPopoverOpen}
						onOpenChange={setModelPopoverOpen}
					>
						<span className="pl-1">
							<PopoverTrigger asChild>
								<Button
									variant="ghost"
									title="Seleziona modello"
								>
									<span>
										{selectedModel
											? `${selectedModel.name} ${selectedModel.version}`
											: "Seleziona un modello"}
									</span>
									<ChevronDown />
								</Button>
							</PopoverTrigger>
						</span>
						<PopoverContent
							className="w-[300px] p-0 sm:w-[420px]"
							sideOffset={5}
							align="start"
						>
							<ModelSelectionArea
								onSelectModel={handleModelSelect}
							/>
						</PopoverContent>
					</Popover>
				</div>
			</Form>
		</div>
	);
}
