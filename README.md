# Our Story — Streaming Platform

**Our Story** is a single-show, Netflix-inspired streaming application. It provides a polished dark viewing experience, a catalog across eight seasons, browser-native MP4 playback, and an owner-only Studio for managing episode records and video uploads.

## Local setup

This project uses React, Express, tRPC, Drizzle, and a MySQL-compatible database. It is already configured for the managed project environment; for a local clone, install Node.js 22+ and pnpm, then install the dependencies and start the development server.

```bash
pnpm install
pnpm dev
```

Open the URL printed by the development server. The first public visit initializes eight editable starter chapter records—one for each season—so that every season is immediately browseable. You can update these placeholders from Studio after signing in as the configured owner.

| Area | Path | Purpose |
|---|---|---|
| Landing page | `/` | Hero presentation, Play call-to-action, and featured chapters. |
| Show catalog | `/show` | Eight-season navigation and episode selection. |
| Player | `/watch/:id` | Native MP4 playback, progress, volume, and fullscreen controls supplied by the browser. |
| Owner Studio | `/admin` | Owner-only episode creation, editing, publishing, and MP4 uploads. |

## Owner-only Studio access

The Studio is deliberately protected in two layers. The page itself displays a forbidden state for everyone except the configured project owner, and all server-side episode mutations plus the media upload route verify the authenticated user’s `openId` against `OWNER_OPEN_ID`. Being a generic admin does **not** grant content-management access.

To use the Studio locally, configure the authenticated owner through the project’s normal OAuth environment variables, then sign in with the same account. The project owner is promoted through the built-in authentication flow.

## Adding an episode and uploading an MP4

After signing in as the owner, open **Studio** and complete the episode form. Choose a season from 1–8, set the episode number and title, write a description, optionally provide a thumbnail URL, and select whether the chapter should be public. You may choose an MP4 file in the same form. When you save, the episode record is created or updated in the database and the MP4 uploads to S3.

The application stores only the S3 object key and streaming path with the episode metadata. Video files are not stored in the database or the front-end project folder. The Studio accepts MP4 files up to 200 MB and shows byte-level upload progress. Once the upload completes, the viewer uses the S3-backed `/manus-storage/` media path in the native `<video>` element.

> The first eight records are editable starter chapters, not finished program content. Rename their titles, replace their descriptions, attach your own thumbnails, and upload your MP4 files before inviting viewers.

## Database migration

The `episodes` table has already been created for this project. For a fresh local database, generate and apply the schema before starting the app:

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

The episode record includes the season number, episode number, title, description, duration in seconds, thumbnail URL, S3 video key, S3 media URL, publication state, and timestamps. The combined season and episode number is unique.

## Verification commands

Run the following before sharing changes:

```bash
pnpm check
pnpm test
pnpm build
```

The automated tests cover public input validation and the strict owner-only protection around content-management procedures. Browser testing should additionally cover an owner upload with a real MP4, standard player controls, and the desktop, tablet, and mobile breakpoints.
