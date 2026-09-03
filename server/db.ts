import { and, asc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { Episode, episodes, InsertUser, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export type EpisodeInput = {
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  description: string;
  durationSeconds: number;
  thumbnailUrl?: string | null;
  isPublished: boolean;
};

const starterEpisodeDetails: Array<[number, string, string]> = [
  [1, "The First Page", "Every story begins with a moment worth remembering. Add your opening chapter here."],
  [2, "The Becoming", "A new season of shared discoveries, told at exactly the pace you choose."],
  [3, "The Distance Between", "The moments that made the path more meaningful are ready for their scene."],
  [4, "A Change of Season", "A fresh chapter for the memories that shaped what came next."],
  [5, "The Things We Keep", "Save the everyday details that turned into something lasting."],
  [6, "Another Beginning", "A place for the next big turn in your story."],
  [7, "All the Way Here", "Look back at the chapters that brought the journey into focus."],
  [8, "Still Writing", "Your final season is open-ended—because the story keeps growing."],
];

const starterEpisodes: EpisodeInput[] = starterEpisodeDetails.map(([seasonNumber, title, description]) => {
  const season = Number(seasonNumber);
  return ({
  seasonNumber: season,
  episodeNumber: 1,
  title,
  description,
  durationSeconds: 0,
  thumbnailUrl: season % 2 ? "/manus-storage/our-story-hero_cf121c6b.jpeg" : "/manus-storage/our-story-ocean_bf1592f4.jpg",
  isPublished: true,
  });
});

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

function ensureDb<T>(db: T | null): T {
  if (!db) throw new Error("Database is not available");
  return db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;

  textFields.forEach(field => {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  });

  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function listPublishedEpisodes(): Promise<Episode[]> {
  const db = ensureDb(await getDb());
  const current = await db
    .select()
    .from(episodes)
    .where(eq(episodes.isPublished, true))
    .orderBy(asc(episodes.seasonNumber), asc(episodes.episodeNumber));
  if (current.length) return current;

  await db.insert(episodes).values(starterEpisodes).onDuplicateKeyUpdate({
    set: { updatedAt: new Date() },
  });
  return db
    .select()
    .from(episodes)
    .where(eq(episodes.isPublished, true))
    .orderBy(asc(episodes.seasonNumber), asc(episodes.episodeNumber));
}

export async function listAllEpisodes(): Promise<Episode[]> {
  const db = ensureDb(await getDb());
  return db.select().from(episodes).orderBy(asc(episodes.seasonNumber), asc(episodes.episodeNumber));
}

export async function getEpisodeById(id: number): Promise<Episode | undefined> {
  const db = ensureDb(await getDb());
  const result = await db.select().from(episodes).where(eq(episodes.id, id)).limit(1);
  return result[0];
}

export async function getPublishedEpisodeById(id: number): Promise<Episode | undefined> {
  const db = ensureDb(await getDb());
  const result = await db
    .select()
    .from(episodes)
    .where(and(eq(episodes.id, id), eq(episodes.isPublished, true)))
    .limit(1);
  return result[0];
}

export async function createEpisode(input: EpisodeInput): Promise<Episode> {
  const db = ensureDb(await getDb());
  const result = await db.insert(episodes).values(input);
  const id = Number((result as unknown as [{ insertId: number }])[0].insertId);
  const episode = await getEpisodeById(id);
  if (!episode) throw new Error("Episode could not be created");
  return episode;
}

export async function updateEpisode(id: number, input: EpisodeInput): Promise<Episode> {
  const db = ensureDb(await getDb());
  await db.update(episodes).set({ ...input, updatedAt: new Date() }).where(eq(episodes.id, id));
  const episode = await getEpisodeById(id);
  if (!episode) throw new Error("Episode not found");
  return episode;
}

export async function updateEpisodeVideo(id: number, videoKey: string, videoUrl: string): Promise<Episode> {
  const db = ensureDb(await getDb());
  await db
    .update(episodes)
    .set({ videoKey, videoUrl, updatedAt: new Date() })
    .where(eq(episodes.id, id));
  const episode = await getEpisodeById(id);
  if (!episode) throw new Error("Episode not found");
  return episode;
}
