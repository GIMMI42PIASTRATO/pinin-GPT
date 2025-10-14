// http
import { type IncomingMessage, ServerResponse } from "http";

// clerk
// import { auth } from "@clerk/nextjs/server";

// zod
import { ChatMessagesSchema } from "@/schema";
import * as z from "zod";

// ollama
import ollama from "ollama";
import { ChatMessage } from "@/types/chatContextTypes";

// prompt
import { defaultPrompt } from "@/data/prompt";

// drizzle
import { db } from "@/drizzle/db";
import { messagesTable } from "@/drizzle/schema";

// uuid
import { v4 as uuidv4 } from "uuid";

export const handleChatRequest = (
	req: IncomingMessage,
	res: ServerResponse
) => {
	let body = "";
	req.on("data", (chunk) => {
		body += chunk;
	});
	req.on("end", () => {
		// Now 'body' contains the full request body as a string
		// You can parse it if it's JSON:
		// const data = JSON.parse(body);
		// Continue handling the request here
	});
};
