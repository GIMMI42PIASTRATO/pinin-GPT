"use server";

import ollama from "ollama";
import type { ModelType } from "@/types/modelSelectionAreaTypes";
import { MODEL_FEATURES, PINNED_MODELS } from "@/data/models";

/**
 * Get the ollama installed model and convert it in ModelTypeObject
 */

export async function getInstalledModels(): Promise<ModelType[]> {
	try {
		const response = await ollama.list();
		return response.models.map((model) => {
			const [name, version] = model.name.split(":");
			const baseName = name.toLowerCase();

			// search the model name inside the map or use a partial prefix
			const features =
				MODEL_FEATURES[baseName] ||
				Object.entries(MODEL_FEATURES).find(([key]) =>
					baseName.includes(key)
				)?.[1] ||
				[];

			// check if the model is pinned
			const isPinned = PINNED_MODELS.some(
				(pinnedModel) =>
					pinnedModel.toLowerCase() === baseName ||
					baseName.includes(pinnedModel)
			);

			return {
				id: model.name,
				name: name.charAt(0).toUpperCase() + name.slice(1),
				version: version || "",
				icon: name.toLowerCase(),
				features,
				isPinned,
			};
		});
	} catch (error) {
		console.error("Error fetching installed models:", error);
		throw error;
	}
}
