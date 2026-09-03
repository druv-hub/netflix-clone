import type { Express, Request, Response } from "express";
import multer from "multer";
import { ENV } from "./_core/env";
import { sdk } from "./_core/sdk";
import { getEpisodeById, updateEpisodeVideo } from "./db";
import { storagePut } from "./storage";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 200 * 1024 * 1024, files: 1 },
});

function safeFilename(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]/g, "_");
}

async function handleVideoUpload(req: Request, res: Response) {
  const user = await sdk.authenticateRequest(req).catch(() => null);
  if (!user || user.openId !== ENV.ownerOpenId) {
    return res.status(403).json({ error: "Only the project owner can upload episode videos." });
  }

  const episodeId = Number(req.params.episodeId);
  if (!Number.isSafeInteger(episodeId) || episodeId < 1) {
    return res.status(400).json({ error: "A valid episode is required." });
  }

  const file = req.file;
  if (!file) return res.status(400).json({ error: "Choose an MP4 video file to upload." });
  if (file.mimetype !== "video/mp4" || !file.originalname.toLowerCase().endsWith(".mp4")) {
    return res.status(415).json({ error: "Only MP4 video files are supported." });
  }

  const episode = await getEpisodeById(episodeId);
  if (!episode) return res.status(404).json({ error: "Episode not found." });

  const filename = safeFilename(file.originalname);
  const { key, url } = await storagePut(
    `our-story/videos/season-${episode.seasonNumber}/episode-${episode.episodeNumber}/${filename}`,
    file.buffer,
    "video/mp4",
  );
  const updated = await updateEpisodeVideo(episode.id, key, url);

  return res.status(201).json({
    episode: updated,
    message: "MP4 video uploaded and attached to this episode.",
  });
}

export function registerMediaUploadRoute(app: Express) {
  app.post("/api/media/episodes/:episodeId/video", (req, res, next) => {
    upload.single("video")(req, res, error => {
      if (error) {
        const message = error instanceof Error ? error.message : "Video upload failed.";
        return res.status(400).json({ error: message });
      }
      void handleVideoUpload(req, res).catch(next);
    });
  });
}
