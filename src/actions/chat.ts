"use server";

import * as z from "zod";
import { PromptSchema } from "@/schema";

export const sendQuestion = async (formData: z.infer<typeof PromptSchema>) => {
	if (typeof formData !== "string") {
		console.log("🛑 Invalid data!!!");
		return { error: "Invalid data" };
	}

	console.log("✅ Data recived:", formData);
	return { data: formData };
};
