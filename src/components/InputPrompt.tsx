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

	const {
		messages,
		currentPrompt,
		setCurrentPrompt,
		setMessages,
		setError,
		setIsLoading,
		selectedModel,
		setSelectedModel,
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

	const onSubmit = (formData: FormSchema) => {
		console.log("📬 Submitting data: ", formData);
		setError(null);

		if (!formData.prompt || formData.prompt.trim() === "") {
			return; // Do not send empty message
		}

		// check if the model is selected
		if (!selectedModel) {
			setError("Please select a model");
			return;
		}

		// Costruisci il nuovo messaggio
		const newMessage: ChatMessage = {
			id: uuidv4(),
			content: formData.prompt,
			role: "user",
			timestamp: new Date(),
		};

		// Crea l’array aggiornato dei messaggi
		const updatedMessages = [...messages, newMessage];
		setMessages(updatedMessages); // aggiorna manualmente lo stato

		setCurrentPrompt("");
		form.reset();
		setIsLoading(true);

		startTransition(() => {
			sendQuestion(updatedMessages, selectedModel.id)
				.then(async (response) => {
					if (response.error) {
						setError(response.error);
					}
					if (response.message) {
						// Aggiungi il messaggio del modello alla fine
						const assistantMessage: ChatMessage = {
							id: uuidv4(),
							content: response.message,
							role: "assistant",
							timestamp: new Date(),
						};

						setMessages((prev) => [...prev, assistantMessage]);
					}

					console.log("🤖 Assistant message:", response.message);
				})
				.catch((error) => {
					setError(error.message || "Something went wrong");
				})
				.finally(() => {
					setIsLoading(false);
				});
		});
	};

	// Add a function to handle model selection and close popover
	const handleModelSelect = (model: ModelType) => {
		console.log("Selected model:", model);

		//set the new model
		setSelectedModel(model);
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
								<Button variant="ghost">
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
