"use client";

// Hooks
import { useForm } from "react-hook-form";
import { useEffect, useTransition } from "react";

// Context
import { useChatContext } from "@/contexts/chatContext";

// zod
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Components
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { Form } from "@/components/ui/form";

// Utils
import { cn } from "@/lib/utils";

// Server actions
import { sendQuestion } from "@/actions/chat";

// Types
import { InputPromptTypes } from "@/types/propTypes";
import { ChatMessage } from "@/types/chatContextTypes";

// zod schema
import { PromptSchema } from "@/schema";
import { useRouter } from "next/navigation";

export default function InputPrompt({ className, ...props }: InputPromptTypes) {
	const [isPending, startTransition] = useTransition();
	const route = useRouter();

	const {
		messages,
		currentPrompt,
		setCurrentPrompt,
		setMessages,
		setError,
		setIsLoading,
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

		if (messages.length === 0) {
			const chatId = crypto.randomUUID();
			// redirect first
			route.push(`/chat/${chatId}`);

			// Il resto del codice può attendere sulla pagina /chat/[chatId]
			// Potresti salvarlo anche su localStorage o usare qualche meccanismo condiviso
			setTimeout(() => {
				const newMessage: ChatMessage = {
					id: crypto.randomUUID(),
					content: formData.prompt,
					role: "user",
					timestamp: new Date(),
					chatId,
				};

				const updatedMessages = [newMessage];
				setMessages(updatedMessages);
				setCurrentPrompt("");
				form.reset();
				setIsLoading(true);

				startTransition(() => {
					sendQuestion(updatedMessages)
						.then((response) => {
							if (response.error) {
								setError(response.error);
								setMessages([]);
							}
							if (response.message) {
								const assistantMessage: ChatMessage = {
									id: crypto.randomUUID(),
									content: response.message,
									role: "assistant",
									timestamp: new Date(),
									chatId,
								};

								setMessages((prev) => [
									...prev,
									assistantMessage,
								]);
							}
						})
						.catch((error) => {
							console.log("🆘 Unexpected error");
							setError(error.message || "Something went wrong");
							setMessages([]);
						})
						.finally(() => {
							setIsLoading(false);
						});
				});
			}, 0); // Avvia tutto nel tick successivo
		} else {
			const chatId = messages[messages.length - 1].chatId;

			const newMessage: ChatMessage = {
				id: crypto.randomUUID(),
				content: formData.prompt,
				role: "user",
				timestamp: new Date(),
				chatId,
			};

			const updatedMessages = [...messages, newMessage];
			setMessages(updatedMessages);
			setCurrentPrompt("");
			form.reset();
			setIsLoading(true);

			startTransition(() => {
				sendQuestion(updatedMessages)
					.then((response) => {
						if (response.error) {
							setError(response.error);
							setMessages((prev) => prev.slice(0, -1));
						}
						if (response.message) {
							const assistantMessage: ChatMessage = {
								id: crypto.randomUUID(),
								content: response.message,
								role: "assistant",
								timestamp: new Date(),
								chatId,
							};

							setMessages((prev) => [...prev, assistantMessage]);
						}
					})
					.catch((error) => {
						console.log("🆘 Unexpected error");
						setError(error.message || "Something went wrong");
						setMessages((prev) => prev.slice(0, -1));
					})
					.finally(() => {
						setIsLoading(false);
					});
			});
		}
	};

	return (
		<div className="px-2 pt-2 rounded-t-3xl bg-sidebar-accent">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex gap-4 p-3 bg-secondary rounded-t-2xl border border-sidebar-border"
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
						{...props}
					/>
					<Button type="submit" size="icon" disabled={isPending}>
						<ArrowUp />
					</Button>
				</form>
			</Form>
		</div>
	);
}
