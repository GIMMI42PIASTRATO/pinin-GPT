import * as z from "zod";

export const PromptSchema = z.object({
	prompt: z.string(),
});
