import InputPrompt from "@/components/InputPrompt";

export default function ChatHome() {
	return (
		<div className="absolute top-0 bottom-0 w-full">
			<div className="px-2 absolute bottom-0 w-full z-50">
				<div className="relative mx-auto max-w-3xl">
					<InputPrompt />
				</div>
			</div>
		</div>
	);
}
