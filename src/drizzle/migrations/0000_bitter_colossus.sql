CREATE TABLE `chats` (
	`id` varchar(36) NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	`user_id` varchar(255) NOT NULL,
	`chat_name` varchar(255) NOT NULL,
	`pinned` boolean NOT NULL DEFAULT false,
	CONSTRAINT `chats_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` varchar(36) NOT NULL,
	`content` text NOT NULL,
	`role` enum('user','assistant','system') NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	`chat_id` varchar(36) NOT NULL,
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
