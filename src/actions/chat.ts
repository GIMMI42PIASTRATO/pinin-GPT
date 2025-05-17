"use server";

// clerk
import { auth } from "@clerk/nextjs/server";

// zod
import { ChatMessagesSchema } from "@/schema";

// ollama
import ollama from "ollama";
import { ChatMessage } from "@/types/chatContextTypes";

// prompt
import { defaultPrompt } from "@/data/prompt";

// drizzle
import { db } from "@/drizzle/db";
import { chatsTable, messagesTable } from "@/drizzle/schema";

export const sendQuestion = async (messages: ChatMessage[]) => {
	const validatedMessages = ChatMessagesSchema.safeParse(messages);

	// const { userId } = await auth();
	// if (!userId) {
	// 	return { error: "Accedi per iniziare a chattare!" };
	// }

	if (!validatedMessages.success) {
		console.log("🛑 Invalid data");
		return { error: "Invalid data" };
	}

	console.log("✅ Data recived:", validatedMessages.data);

	const systemMessage: ChatMessage = {
		id: crypto.randomUUID(),
		content: defaultPrompt.system,
		role: "system",
		timestamp: new Date(),
	};
	// TODO: be able to select models
	const response = await ollama.chat({
		model: "gemma3:1b",
		messages: [systemMessage, ...validatedMessages.data],
		stream: false,
	});

	const { id, content, role, timestamp } =
		validatedMessages.data[validatedMessages.data.length - 1];

	// if (validatedMessages.data.length === 1) {
	//     // Message for creating a chat title
	// 	const titleRequestMessage: ChatMessage = {
	// 		id: crypto.randomUUID(),
	// 		content: defaultPrompt.generateTitle,
	// 		role: "system",
	// 		timestamp: new Date(),
	// 	};

	// 	const titleResponse = await ollama.chat({
	// 		model: "gemma3:1b",
	// 		messages: [
	// 			systemMessage,
	// 			...validatedMessages.data,
	// 			titleRequestMessage,
	// 		],
	// 		stream: false,
	// 	});

	//     // New chatsTable filed
	// 	const newChat: typeof chatsTable.$inferInsert = {
	// 		id: crypto.randomUUID(),
	// 		chatName: titleResponse.message.content,
	// 		userId,
	// 	};

	//     // New messagesTable field
	//     const newMessage: typeof messagesTable.$inferInsert = {
	//         id,
	//         role,
	//         content,
	//         timestamp,
	//         chatId: newChat.id
	//     }

	//     //! HOLD UP: forse non è il server che crea l'UUID della chat, ma è il client, questo perché quando l'utente invia un messaggio viene generata effettivamente la chat perché prima l'utente si trova in /chat, poi una volta che invia il messaggio si trova in /chat/<uuid>

	// 	await db.insert(chatsTable).values(newChat);
	// 	console.log("💬✅ New chat created!!!");

	// 	await db.insert(messagesTable).values(newMessage);
	//     console.log("💬✅ New message created!!!");
	// } else {
	//     // New messagesTable field
	//     const newMessage: typeof messagesTable.$inferInsert = {
	//         id,
	//         role,
	//         content,
	//         timestamp,
	//         chatId: // Come faccio a sapere in che chat fa parte questo messaggio?
	//     }

	//     await db.insert(messagesTable).values(newMessage);
	//     console.log("💬✅ New message created!!!");
	// }

	return { message: response.message.content };
};
