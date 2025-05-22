"use server";

import ollama from "ollama";
import type { ModelType } from "@/types/modelSelectionAreaTypes";

/**
 * Get the ollama installed model and convert it in ModelTypeObject
 */

export async function getInstalledModels(): Promise<ModelType[]> {
	try {
		const response = await ollama.list();
		return response.models.map((model) => {
			const [name, version] = model.name.split(":");

			return {
				id: model.name,
				name: name.charAt(0).toUpperCase() + name.slice(1),
				version: version || "",
				icon: name.toLowerCase(),
				features: [],
			};
		});
	} catch (error) {
		console.error("Error fetching installed models:", error);
		return [];
	}
}
