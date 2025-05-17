export type ModelType = {
	id: string;
	name: string;
	version: string;
	icon: string;
	isPinned?: boolean;
	category?: string;
	badgeText?: string;
	features?: Array<"web" | "vision" | "code" | "reasoning">;
};

export interface ModelSelectionAreaProps {
	onSelectModel?: (model: ModelType) => void;
}
