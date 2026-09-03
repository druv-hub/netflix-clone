CREATE TABLE `episodes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`seasonNumber` int NOT NULL,
	`episodeNumber` int NOT NULL,
	`title` varchar(160) NOT NULL,
	`description` text NOT NULL,
	`durationSeconds` int NOT NULL DEFAULT 0,
	`thumbnailUrl` varchar(2048),
	`videoKey` varchar(1024),
	`videoUrl` varchar(2048),
	`isPublished` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `episodes_id` PRIMARY KEY(`id`),
	CONSTRAINT `episodes_season_episode_unique` UNIQUE(`seasonNumber`,`episodeNumber`)
);
