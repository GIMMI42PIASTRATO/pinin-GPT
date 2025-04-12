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

// zod schema
import { PromptSchema } from "@/schema";

export default function InputPrompt({ className, ...props }: InputPromptTypes) {
	const [isPending, startTransition] = useTransition();

	const {
		messages,
		currentPrompt,
		setCurrentPrompt,
		addMessage,
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
		form.setValue("prompt", currentPrompt);
	}, [currentPrompt, form]);

	const onSubmit = (formData: FormSchema) => {
		console.log("Submitting data: ", formData);
		setError(null);
		addMessage(formData.prompt, "user");
		setCurrentPrompt("");
		setIsLoading(true);

		startTransition(() => {
			sendQuestion(messages)
				.then(async (response) => {
					if (response.error) {
						setError(response.error);
					}
					if (response.message) {
						// Un comment if you want to add a delay
						// await new Promise<void>((resolve) =>
						// 	setTimeout(resolve, 5000)
						// );

						addMessage(response.message, "assistant");
					}

					console.log("☕️ My message:", response.message);
				})
				.catch((error) => {
					setError(error.message || "Something went wrong");
				})
				.finally(() => {
					setIsLoading(false);
				});
		});
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
