import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

export function UserMessage({
	children,
	avatar,
	username = "You",
}: {
	children: string;
	avatar?: string;
	username?: string;
}) {
	return (
		<div className="flex items-start gap-3 justify-end mb-4">
			<Card className="inline-block w-fit max-w-[80%] bg-primary/90 text-primary-foreground p-0 overflow-hidden shadow-md">
				<div className="px-4 py-2 bg-primary border-b border-primary/20">
					<p className="text-sm font-medium">{username}</p>
				</div>
				<div className="px-4 py-3">
					<p className="text-sm leading-relaxed">{children}</p>
				</div>
			</Card>
			{avatar ? (
				<Avatar className="h-8 w-8 border-2 border-background">
					<img src={avatar} alt={username} />
				</Avatar>
			) : (
				<div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
					{username.charAt(0).toUpperCase()}
				</div>
			)}
		</div>
	);
}

export function ModelMessage({
	children,
	className,
	avatar,
	modelName = "Assistant",
	isLoading = false,
}: {
	children: string;
	className?: string;
	avatar?: string;
	modelName?: string;
	isLoading?: boolean;
}) {
	return (
		<div className={cn("flex items-start gap-3 mb-4", className)}>
			{avatar ? (
				<Avatar className="h-8 w-8 border-2 border-background">
					<img src={avatar} alt={modelName} />
				</Avatar>
			) : (
				<div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-xs font-bold">
					{modelName.charAt(0).toUpperCase()}
				</div>
			)}
			<Card
				className={cn(
					"inline-block w-fit bg-card text-card-foreground p-0 overflow-hidden shadow-sm",
					isLoading && "animate-pulse"
				)}
			>
				<div className="px-4 py-2 bg-muted/50 border-b">
					<p className="text-sm font-medium">{modelName}</p>
				</div>
				<div className="px-4 py-3">
					<ReactMarkdown
						rehypePlugins={[rehypeSanitize]}
						components={{
							p: ({ ...props }) => (
								<p
									className="text-sm leading-relaxed mb-4 last:mb-0"
									{...props}
								/>
							),
							h1: ({ ...props }) => (
								<h1
									className="text-2xl font-bold mt-6 mb-4 first:mt-1 border-b pb-2"
									{...props}
								/>
							),
							h2: ({ ...props }) => (
								<h2
									className="text-xl font-bold mt-5 mb-3 first:mt-1"
									{...props}
								/>
							),
							h3: ({ ...props }) => (
								<h3
									className="text-lg font-semibold mt-4 mb-2 first:mt-1"
									{...props}
								/>
							),
							h4: ({ ...props }) => (
								<h4
									className="text-base font-semibold mt-4 mb-2 first:mt-1"
									{...props}
								/>
							),
							ul: ({ ...props }) => (
								<ul
									className="list-disc pl-6 mb-4 text-sm space-y-1"
									{...props}
								/>
							),
							ol: ({ ...props }) => (
								<ol
									className="list-decimal pl-6 mb-4 text-sm space-y-1"
									{...props}
								/>
							),
							li: ({ ...props }) => (
								<li className="mb-1" {...props} />
							),
							a: ({ ...props }) => (
								<a
									className="text-primary hover:underline hover:text-primary/80 transition-colors"
									{...props}
								/>
							),
							blockquote: ({ ...props }) => (
								<blockquote
									className="border-l-4 border-muted pl-4 italic my-4"
									{...props}
								/>
							),
							code: ({
								node,
								className,
								children,
								...props
							}: any) => {
								const match = /language-(\w+)/.exec(
									className || ""
								);
								const language = match ? match[1] : "";
								const isInline = !match;

								if (isInline) {
									return (
										<code
											className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono"
											{...props}
										>
											{children}
										</code>
									);
								}

								return (
									<div className="relative my-4">
										{language && (
											<div className="absolute top-2 right-2 text-xs text-muted-foreground bg-muted/80 px-2 py-1 rounded z-10">
												{language.toUpperCase()}
											</div>
										)}
										<SyntaxHighlighter
											style={oneLight}
											language={language || "text"}
											PreTag="div"
											className="rounded-md text-sm"
											showLineNumbers={true}
											wrapLines={true}
											customStyle={{
												margin: 0,
												borderRadius: "6px",
												fontSize: "14px",
												lineHeight: "1.5",
											}}
										>
											{String(children).replace(
												/\n$/,
												""
											)}
										</SyntaxHighlighter>
									</div>
								);
							},
							table: ({ ...props }) => (
								<div className="overflow-x-auto my-4">
									<table
										className="w-full border-collapse text-sm"
										{...props}
									/>
								</div>
							),
							thead: ({ ...props }) => (
								<thead
									className="bg-muted font-medium"
									{...props}
								/>
							),
							tbody: ({ ...props }) => (
								<tbody className="divide-y" {...props} />
							),
							tr: ({ ...props }) => (
								<tr className="even:bg-muted/50" {...props} />
							),
							th: ({ ...props }) => (
								<th
									className="py-2 px-3 text-left"
									{...props}
								/>
							),
							td: ({ ...props }) => (
								<td className="py-2 px-3" {...props} />
							),
							hr: ({ ...props }) => (
								<hr className="my-6 border-muted" {...props} />
							),
							img: ({ ...props }) => (
								<img
									className="max-w-full h-auto rounded-md my-4"
									{...props}
								/>
							),
						}}
					>
						{children}
					</ReactMarkdown>
				</div>
			</Card>
		</div>
	);
}

export function StreamingModelMessage({
	children,
	className,
	avatar,
	modelName = "Assistant",
}: {
	children: string;
	className?: string;
	avatar?: string;
	modelName?: string;
}) {
	return (
		<div className={cn("flex items-start gap-3 mb-4", className)}>
			{avatar ? (
				<Avatar className="h-8 w-8 border-2 border-background">
					<img src={avatar} alt={modelName} />
				</Avatar>
			) : (
				<div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-xs font-bold">
					{modelName.charAt(0).toUpperCase()}
				</div>
			)}
			<Card className="inline-block w-fit bg-card text-card-foreground p-0 overflow-hidden shadow-sm">
				<div className="px-4 py-2 bg-muted/50 border-b">
					<div className="flex items-center gap-2">
						<p className="text-sm font-medium">{modelName}</p>
						<div className="flex space-x-1">
							<div
								className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"
								style={{ animationDelay: "0ms" }}
							></div>
							<div
								className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"
								style={{ animationDelay: "150ms" }}
							></div>
							<div
								className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"
								style={{ animationDelay: "300ms" }}
							></div>
						</div>
					</div>
				</div>
				<div className="px-4 py-3">
					<ReactMarkdown
						rehypePlugins={[rehypeSanitize]}
						components={{
							p: ({ ...props }) => (
								<p
									className="text-sm leading-relaxed mb-4 last:mb-0"
									{...props}
								/>
							),
							h1: ({ ...props }) => (
								<h1
									className="text-2xl font-bold mt-6 mb-4 first:mt-1 border-b pb-2"
									{...props}
								/>
							),
							h2: ({ ...props }) => (
								<h2
									className="text-xl font-bold mt-5 mb-3 first:mt-1"
									{...props}
								/>
							),
							h3: ({ ...props }) => (
								<h3
									className="text-lg font-semibold mt-4 mb-2 first:mt-1"
									{...props}
								/>
							),
							h4: ({ ...props }) => (
								<h4
									className="text-base font-semibold mt-4 mb-2 first:mt-1"
									{...props}
								/>
							),
							ul: ({ ...props }) => (
								<ul
									className="list-disc pl-6 mb-4 text-sm space-y-1"
									{...props}
								/>
							),
							ol: ({ ...props }) => (
								<ol
									className="list-decimal pl-6 mb-4 text-sm space-y-1"
									{...props}
								/>
							),
							li: ({ ...props }) => (
								<li className="mb-1" {...props} />
							),
							a: ({ ...props }) => (
								<a
									className="text-primary hover:underline hover:text-primary/80 transition-colors"
									{...props}
								/>
							),
							blockquote: ({ ...props }) => (
								<blockquote
									className="border-l-4 border-muted pl-4 italic my-4"
									{...props}
								/>
							),
							code: ({
								node,
								className,
								children,
								...props
							}: any) => {
								const match = /language-(\w+)/.exec(
									className || ""
								);
								const language = match ? match[1] : "";
								const isInline = !match;

								if (isInline) {
									return (
										<code
											className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono"
											{...props}
										>
											{children}
										</code>
									);
								}

								return (
									<div className="relative my-4">
										{language && (
											<div className="absolute top-2 right-2 text-xs text-muted-foreground bg-muted/80 px-2 py-1 rounded z-10">
												{language.toUpperCase()}
											</div>
										)}
										<SyntaxHighlighter
											style={oneLight}
											language={language || "text"}
											PreTag="div"
											className="rounded-md text-sm"
											showLineNumbers={true}
											wrapLines={true}
											customStyle={{
												margin: 0,
												borderRadius: "6px",
												fontSize: "14px",
												lineHeight: "1.5",
											}}
										>
											{String(children).replace(
												/\n$/,
												""
											)}
										</SyntaxHighlighter>
									</div>
								);
							},
							table: ({ ...props }) => (
								<div className="overflow-x-auto my-4">
									<table
										className="w-full border-collapse text-sm"
										{...props}
									/>
								</div>
							),
							thead: ({ ...props }) => (
								<thead
									className="bg-muted font-medium"
									{...props}
								/>
							),
							tbody: ({ ...props }) => (
								<tbody className="divide-y" {...props} />
							),
							tr: ({ ...props }) => (
								<tr className="even:bg-muted/50" {...props} />
							),
							th: ({ ...props }) => (
								<th
									className="py-2 px-3 text-left"
									{...props}
								/>
							),
							td: ({ ...props }) => (
								<td className="py-2 px-3" {...props} />
							),
							hr: ({ ...props }) => (
								<hr className="my-6 border-muted" {...props} />
							),
							img: ({ ...props }) => (
								<img
									className="max-w-full h-auto rounded-md my-4"
									{...props}
								/>
							),
						}}
					>
						{children}
					</ReactMarkdown>
					{/* Cursore lampeggiante alla fine del testo */}
					<span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1"></span>
				</div>
			</Card>
		</div>
	);
}

// Componente contenitore per la chat
export function ChatContainer({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col max-w-3xl mx-auto px-4 pt-6 pb-28 space-y-2">
			{children}
		</div>
	);
}

// Componente per mostrare un timestamp o separatore nella chat
export function ChatDivider({ text }: { text: string }) {
	return (
		<div className="flex items-center justify-center my-6">
			<div className="border-t flex-grow border-border"></div>
			<span className="px-4 text-xs text-muted-foreground">{text}</span>
			<div className="border-t flex-grow border-border"></div>
		</div>
	);
}

// Componente per mostrare un'azione o notifica nella chat
export function ChatNotification({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex justify-center my-2">
			<div className="bg-muted px-3 py-1.5 rounded-md text-xs text-muted-foreground">
				{children}
			</div>
		</div>
	);
}

// Componente per mostrare una bolla di typing animation
export function ModelTyping({
	modelName = "Assistant",
}: {
	modelName?: string;
}) {
	return (
		<div className="flex items-start gap-3 mb-4">
			<div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-xs font-bold">
				{modelName.charAt(0).toUpperCase()}
			</div>
			<Card className="inline-block py-3 px-6 bg-card">
				<div className="flex items-center space-x-2">
					<div className="flex space-x-1">
						<div
							className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"
							style={{ animationDelay: "0ms" }}
						></div>
						<div
							className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"
							style={{ animationDelay: "150ms" }}
						></div>
						<div
							className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"
							style={{ animationDelay: "300ms" }}
						></div>
					</div>
					<span className="text-xs text-muted-foreground ml-2">
						{modelName} sta pensando...
					</span>
				</div>
			</Card>
		</div>
	);
}
