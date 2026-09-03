import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

/** Core user table backing the authenticated owner experience. */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

/** Episode records contain metadata only; MP4 bytes remain in S3 storage. */
export const episodes = mysqlTable(
  "episodes",
  {
    id: int("id").autoincrement().primaryKey(),
    seasonNumber: int("seasonNumber").notNull(),
    episodeNumber: int("episodeNumber").notNull(),
    title: varchar("title", { length: 160 }).notNull(),
    description: text("description").notNull(),
    durationSeconds: int("durationSeconds").notNull().default(0),
    thumbnailUrl: varchar("thumbnailUrl", { length: 2048 }),
    videoKey: varchar("videoKey", { length: 1024 }),
    videoUrl: varchar("videoUrl", { length: 2048 }),
    isPublished: boolean("isPublished").notNull().default(true),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    uniqueIndex("episodes_season_episode_unique").on(table.seasonNumber, table.episodeNumber),
  ],
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Episode = typeof episodes.$inferSelect;
export type InsertEpisode = typeof episodes.$inferInsert;
