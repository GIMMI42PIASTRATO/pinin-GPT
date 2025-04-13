import { cn } from "@/lib/utils";

export function UserMessage({ children }: { children: string }) {
	return (
		<div className="flex justify-end">
			<div className="inline-block group relative w-fit max-w-[80%] break-words rounded-xl bg-primary text-primary-foreground px-4 py-3 text-left">
				{children}
			</div>
		</div>
	);
}

export function ModelMessage({
	children,
	className,
}: {
	children: string;
	className?: string;
}) {
	return <div className={cn(className)}>{children}</div>;
}
