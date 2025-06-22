import { chatsTable } from "@/drizzle/schema";

export type UserChat = typeof chatsTable.$inferSelect;
