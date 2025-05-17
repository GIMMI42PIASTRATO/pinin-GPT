// ModelSelectionArea.tsx
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Star } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import type {
	ModelType,
	ModelSelectionAreaProps,
} from "@/types/modelSelectionAreaTypes.ts";
import { models } from "@/data/models";

export function ModelSelectionArea({ onSelectModel }: ModelSelectionAreaProps) {
	const [searchTerm, setSearchTerm] = useState("");

	const filteredModels = searchTerm
		? models.filter((model) =>
				`${model.name} ${model.version}`
					.toLowerCase()
					.includes(searchTerm.toLowerCase())
		  )
		: models;

	const pinnedModels = filteredModels.filter((model) => model.isPinned);
	const otherModels = filteredModels.filter((model) => !model.isPinned);

	const handleModelSelect = (model: ModelType) => {
		if (onSelectModel) onSelectModel(model);
	};

	const getFeatureIcon = (feature: string) => {
		switch (feature) {
			case "web":
				return (
					<div className="rounded-full bg-blue-100 p-1.5">
						<svg className="w-3 h-3" viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
							/>
						</svg>
					</div>
				);
			case "vision":
				return (
					<div className="rounded-full bg-green-100 p-1.5">
						<svg className="w-3 h-3" viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
							/>
						</svg>
					</div>
				);
			case "code":
				return (
					<div className="rounded-full bg-purple-100 p-1.5">
						<svg className="w-3 h-3" viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"
							/>
						</svg>
					</div>
				);
			case "reasoning":
				return (
					<div className="rounded-full bg-amber-100 p-1.5">
						<svg className="w-3 h-3" viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="M20 11H4c-.55 0-1 .45-1 1s.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1zM4 18h10c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zM20 6H4c-.55 0-1 .45-1 1v.01c0 .55.45.99 1 .99h16c.55 0 1-.45 1-1s-.45-1-1-1z"
							/>
						</svg>
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<div className="flex flex-col w-full max-h-[500px]">
			<div className="p-3 border-b flex-shrink-0">
				<div className="relative">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search models..."
						className="pl-9 h-10"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
			</div>

			<div className="overflow-hidden flex-grow">
				<ScrollArea className="h-[300px]">
					<div className="p-3">
						{pinnedModels.length > 0 && (
							<>
								<div className="flex items-center gap-2 mb-2">
									<Star className="w-4 h-4 text-muted-foreground" />
									<h3 className="font-medium text-sm">
										Pinned
									</h3>
								</div>

								<div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
									{pinnedModels.map((model) => (
										<button
											key={model.id}
											className="flex flex-col items-center p-2 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
											onClick={() =>
												handleModelSelect(model)
											}
										>
											<div className="w-8 h-8 flex items-center justify-center mb-1">
												<div
													className="rounded-full p-2 w-full h-full flex items-center justify-center"
													style={{
														backgroundColor:
															model.name ===
															"Gemini"
																? "rgb(243, 232, 255)"
																: model.name ===
																  "GPT"
																? "rgb(243, 244, 246)"
																: "rgb(219, 234, 254)",
													}}
												>
													{model.name.charAt(0)}
												</div>
											</div>
											<span className="font-medium text-xs">
												{model.name}
											</span>
											<span className="text-xs text-gray-600">
												{model.version}
											</span>

											{model.badgeText && (
												<span className="text-xs bg-gray-200 px-1 py-0.5 rounded mt-0.5 text-[10px]">
													{model.badgeText}
												</span>
											)}

											<div className="flex gap-1 mt-1">
												{model.features?.map(
													(feature) => (
														<div
															key={`${model.id}-${feature}`}
															className="scale-75"
														>
															{getFeatureIcon(
																feature
															)}
														</div>
													)
												)}
											</div>
										</button>
									))}
								</div>
							</>
						)}

						<div className="flex items-center gap-2 mb-2">
							<h3 className="font-medium text-sm">Others</h3>
						</div>

						<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
							{otherModels.map((model) => (
								<button
									key={model.id}
									className="flex flex-col items-center p-2 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
									onClick={() => handleModelSelect(model)}
								>
									<div className="w-8 h-8 flex items-center justify-center mb-1">
										<div
											className="rounded-full p-2 w-full h-full flex items-center justify-center"
											style={{
												backgroundColor:
													model.name === "Gemini"
														? "rgb(243, 232, 255)"
														: model.name === "GPT"
														? "rgb(243, 244, 246)"
														: "rgb(219, 234, 254)",
											}}
										>
											{model.name.charAt(0)}
										</div>
									</div>
									<span className="font-medium text-xs">
										{model.name}
									</span>
									<span className="text-xs text-gray-600">
										{model.version}
									</span>

									{model.badgeText && (
										<span className="text-xs bg-gray-200 px-1 py-0.5 rounded mt-0.5 text-[10px]">
											{model.badgeText}
										</span>
									)}

									<div className="flex gap-1 mt-1">
										{model.features?.map((feature) => (
											<div
												key={`${model.id}-${feature}`}
												className="scale-75"
											>
												{getFeatureIcon(feature)}
											</div>
										))}
									</div>
								</button>
							))}
						</div>
					</div>
				</ScrollArea>
			</div>

			<div className="border-t p-2 flex justify-between items-center flex-shrink-0">
				<button className="text-xs flex items-center gap-1 text-pink-600">
					<Star className="w-3 h-3" />
					Favorites
				</button>
				<div className="flex items-center gap-2">
					<span className="text-xs">Gemini 2.5 Flash</span>
					<Button variant="outline" size="sm" className="h-6 w-6 p-0">
						<Search className="h-3 w-3" />
					</Button>
				</div>
			</div>
		</div>
	);
}
