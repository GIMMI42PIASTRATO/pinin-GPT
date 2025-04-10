"use server";

import * as z from "zod";
import { PromptSchema } from "@/schema";
import { randomInt } from "node:crypto";

export const sendQuestion = async (data: z.infer<typeof PromptSchema>) => {
	const validatedData = PromptSchema.safeParse(data);

	if (!validatedData.success) {
		console.log("🛑 Invalid data");
		return { error: "Invalid data" };
	}

	console.log("✅ Data recived:", validatedData.data.prompt);
	return { message: validatedData.data.prompt };
};
