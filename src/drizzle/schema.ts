import { relations } from "drizzle-orm";
import {
	mysqlTable,
	boolean,
	varchar,
	timestamp,
	text,
	mysqlEnum,
} from "drizzle-orm/mysql-core";

export const chatsTable = mysqlTable("chats", {
	id: varchar("id", { length: 36 }).primaryKey(), // UUID string
	timestamp: timestamp("timestamp").defaultNow().notNull(),
	userId: varchar("user_id", { length: 255 }).notNull(), // Clerk user id
	title: varchar("title", { length: 255 }).notNull(), // Renamed from chatName
	pinned: boolean("pinned").default(false).notNull(),
});

export const messagesTable = mysqlTable("messages", {
	id: varchar("id", { length: 36 }).primaryKey(), // UUID string
	content: text("content").notNull(),
	role: mysqlEnum("role", ["user", "assistant", "system"]).notNull(),
	timestamp: timestamp("timestamp").defaultNow().notNull(),
	chatId: varchar("chat_id", { length: 36 }).notNull(), // FK to chats.id
});

export const chatRelations = relations(chatsTable, ({ many }) => ({
	messages: many(messagesTable),
}));

export const messageRelations = relations(messagesTable, ({ one }) => ({
	chat: one(chatsTable, {
		fields: [messagesTable.chatId],
		references: [chatsTable.id],
	}),
}));
