"use client";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import { useRef } from "react";

export default function UserButtonComponent() {
	const userButtonRef = useRef<HTMLDivElement>(null);
	const { user } = useUser();

	const handleButtonClick = () => {
		const realButton = userButtonRef.current?.querySelector("button");
		if (realButton) {
			realButton.click();
		}
	};

	return (
		<Button
			variant="ghost"
			className="flex-1 justify-start p-4 hover:bg-gray-200"
			onClick={handleButtonClick}
		>
			<div
				className="w-full h-full flex items-center gap-4"
				ref={userButtonRef}
			>
				<UserButton />
				<span className="truncate text-ellipsis overflow-hidden">
					{user?.username?.toString() ??
						user?.emailAddresses.toString()}
				</span>
			</div>
		</Button>
	);
}
