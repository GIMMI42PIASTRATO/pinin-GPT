"use client";

// Hooks
import { useForm } from "react-hook-form";
import { useTransition } from "react";

// zod
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Components
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { Form } from "react-hook-form";

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

	type FormSchema = z.infer<typeof PromptSchema>;
	const form = useForm<FormSchema>({
		resolver: zodResolver(PromptSchema),
		defaultValues: {
			prompt: "",
		},
	});

	const onSubmit = (data: FormSchema) => {
		// TODO: handle error reset
		startTransition(() => {
			sendQuestion(data).then((data) => {
				// TODO: setResponse(data.response);
				// TODO: setError(data.error);
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
						name="prompt"
						{...props}
					/>
					<Button type="submit" size="icon">
						<ArrowUp />
					</Button>
				</form>
			</Form>
		</div>
	);
}
