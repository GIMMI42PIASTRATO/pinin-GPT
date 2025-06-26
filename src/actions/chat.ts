"use server";

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

// uuid
import { v4 as uuidv4 } from "uuid";

export const sendQuestion = async (
	messages: ChatMessage[],
	modelId: string
) => {
	const messagesValidation = ChatMessagesSchema.safeParse(messages);
	const modelIdValidation = z.string().safeParse(modelId);

	// const { userId } = await auth();
	// if (!userId) {
	// 	return { error: "Accedi per iniziare a chattare!" };
	// }

	if (!messagesValidation.success || !modelIdValidation.success) {
		console.log("🛑 Invalid data");
		return { error: "Invalid data" };
	}

	// Extract validated data for easier usage
	const validMessages = messagesValidation.data;
	const validModelId = modelIdValidation.data;

	// console.log("🆘" + !models.find((model) => model.id === validModelId));

	const installedModels = (await ollama.list()).models;

	if (!installedModels.find((model) => model.name === validModelId)) {
		console.log(`🛑 Model with ID: ${validModelId} not found`);
		return {
			error: `Model with ID: ${validModelId} not found`,
		};
	}

	console.log("✅ Data recived:", validMessages);

	const systemMessage: ChatMessage = {
		id: uuidv4(),
		content: defaultPrompt.system,
		role: "system",
		timestamp: new Date(),
	};
	// TODO: be able to select models
	const response = await ollama.chat({
		model: validModelId,
		messages: [systemMessage, ...validMessages],
		stream: false,
	});

	// const { id, content, role, timestamp } =
	// 	validMessages[validMessages.length - 1];

	// if (validatedMessages.data.length === 1) {
	//     // Message for creating a chat title
	// 	const titleRequestMessage: ChatMessage = {
	// 		id: uuidv4(),
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
	// 		id: uuidv4(),
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
