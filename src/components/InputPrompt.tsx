import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

export default function InputPrompt({
	className,
	...props
}: React.ComponentProps<"textarea">) {
	return (
		<div className="px-2 pt-2 rounded-t-3xl bg-sidebar-accent">
			<form className="flex gap-4 p-3 bg-secondary rounded-t-2xl border border-sidebar-border">
				<Textarea
					className={cn(
						"min-h-12 max-h-60 p-0 rounded-none border-none resize-none text-base placeholder:text-base focus-visible:outline-none focus-visible:ring-0 shadow-none",
						className
					)}
					placeholder="Fai una domanda."
					{...props}
				/>
				<Button size="icon">
					<ArrowUp />
				</Button>
			</form>
		</div>
	);
}
