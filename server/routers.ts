import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import * as db from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { ownerProcedure, publicProcedure, router } from "./_core/trpc";
import { ENV } from "./_core/env";

const episodeInput = z.object({
  seasonNumber: z.number().int().min(1).max(8),
  episodeNumber: z.number().int().min(1).max(999),
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1).max(5000),
  durationSeconds: z.number().int().min(0).max(4 * 60 * 60),
  thumbnailUrl: z.string().trim().url().max(2048).nullable().optional(),
  isPublished: z.boolean().default(true),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  episodes: router({
    list: publicProcedure.query(() => db.listPublishedEpisodes()),
    get: publicProcedure.input(z.object({ id: z.number().int().positive() })).query(async ({ input }) => {
      const episode = await db.getPublishedEpisodeById(input.id);
      if (!episode) throw new TRPCError({ code: "NOT_FOUND", message: "This episode is unavailable." });
      return episode;
    }),
    access: publicProcedure.query(({ ctx }) => ({
      isOwner: Boolean(ctx.user && ctx.user.openId === ENV.ownerOpenId),
    })),
    adminList: ownerProcedure.query(() => db.listAllEpisodes()),
    create: ownerProcedure.input(episodeInput).mutation(({ input }) => db.createEpisode(input)),
    update: ownerProcedure
      .input(z.object({ id: z.number().int().positive(), episode: episodeInput }))
      .mutation(({ input }) => db.updateEpisode(input.id, input.episode)),
  }),
});

export type AppRouter = typeof appRouter;
