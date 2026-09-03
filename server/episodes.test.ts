import { describe, expect, it } from "vitest";
import { ENV } from "./_core/env";
import type { TrpcContext } from "./_core/context";
import { appRouter } from "./routers";

function createContext(openId: string | null): TrpcContext {
  const user = openId === null ? null : {
    id: 99,
    openId,
    name: "Test User",
    email: "test@example.com",
    loginMethod: "manus",
    role: "admin" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("episode content management access", () => {
  it("rejects an unauthenticated request to list Studio episodes", async () => {
    const caller = appRouter.createCaller(createContext(null));
    await expect(caller.episodes.adminList()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("rejects an authenticated non-owner, even if that user has an admin role", async () => {
    const caller = appRouter.createCaller(createContext("another-admin"));
    await expect(caller.episodes.adminList()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("validates season bounds before an owner can create an episode", async () => {
    const caller = appRouter.createCaller(createContext(ENV.ownerOpenId));
    await expect(
      caller.episodes.create({
        seasonNumber: 9,
        episodeNumber: 1,
        title: "Invalid season",
        description: "This payload should be rejected before any database operation.",
        durationSeconds: 0,
        isPublished: true,
      }),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
