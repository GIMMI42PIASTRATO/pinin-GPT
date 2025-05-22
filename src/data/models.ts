import type { ModelType } from "@/types/modelSelectionAreaTypes";

// Mock data for demonstration
export const models: ModelType[] = [
	{
		id: "gemma3:1b",
		name: "Gemma",
		version: "3:1b",
		icon: "gemma",
		isPinned: true,
		features: ["code", "reasoning"],
	},
	{
		id: "llama-3",
		name: "Llama",
		version: "3",
		icon: "llama",
		isPinned: true,
		features: ["code", "reasoning"],
	},
	{
		id: "deepseek-r1",
		name: "DeepSeek",
		version: "R1",
		badgeText: "Llama Distilled",
		icon: "deepseek",
		isPinned: true,
		features: ["code", "reasoning", "vision"],
	},
	{
		id: "mistral-medium",
		name: "Mistral",
		version: "Medium",
		icon: "mistral",
		isPinned: false,
		features: ["vision", "code"],
	},
	{
		id: "phi-3",
		name: "Phi",
		version: "3",
		icon: "phi",
		features: ["code", "reasoning"],
	},
	{
		id: "gemma-2",
		name: "Gemma",
		version: "2",
		icon: "gemma",
		features: ["code"],
	},
	{
		id: "falcon-180b",
		name: "Falcon",
		version: "180B",
		icon: "falcon",
		features: ["reasoning"],
	},
	{
		id: "vicuna-13b",
		name: "Vicuna",
		version: "13B",
		icon: "vicuna",
		features: ["code"],
	},
	{
		id: "orca-2",
		name: "Orca",
		version: "2",
		icon: "orca",
		features: ["reasoning"],
	},
	{
		id: "openchat-3.5",
		name: "OpenChat",
		version: "3.5",
		icon: "openchat",
		features: ["vision", "code"],
	},
	{
		id: "stablelm-zephyr",
		name: "StableLM",
		version: "Zephyr",
		icon: "stablelm",
		features: ["code"],
	},
	{
		id: "mpt-7b",
		name: "MPT",
		version: "7B",
		icon: "mpt",
		features: ["reasoning"],
	},
	{
		id: "bloom",
		name: "BLOOM",
		version: "176B",
		icon: "bloom",
		features: ["code"],
	},
	{
		id: "pythia",
		name: "Pythia",
		version: "12B",
		icon: "pythia",
		features: ["code"],
	},
	{
		id: "starcoder",
		name: "StarCoder",
		version: "15B",
		icon: "starcoder",
		badgeText: "Code",
		features: ["code", "reasoning"],
	},
];

// map models to theri respective features
export const MODEL_FEATURES: Record<
	string,
	Array<"web" | "vision" | "code" | "reasoning">
> = {
	llama: ["reasoning", "code", "vision", "web"],
	mistral: ["reasoning", "code"],
	gemma: ["reasoning", "code", "vision"],
	phi: ["code", "reasoning"],
	mixtral: ["reasoning", "code"],
	yi: ["reasoning", "code"],
	qwen: ["reasoning", "code", "web"],
	dolphin: ["reasoning", "code"],
	codellama: ["code"],
	vicuna: ["reasoning"],
	"neural-chat": ["reasoning"],
	llava: ["vision", "reasoning"],
	bakllava: ["vision", "reasoning"],
	moondream: ["vision"],
	openchat: ["reasoning", "code"],
	deepseek: ["reasoning", "code", "vision", "web"],
};

export const PINNED_MODELS = ["gemma", "llama", "deepseek"];
