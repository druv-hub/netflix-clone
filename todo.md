# Project TODO

- [x] Define the episode metadata schema with season number, episode number, title, description, duration, thumbnail, S3 video reference, and publication state.
- [x] Apply the database migration for the episode catalog.
- [x] Implement public catalog queries with starter episode records covering all eight seasons.
- [x] Implement strict server-side owner-only authorization for all content-management procedures.
- [x] Implement server-side MP4 upload to S3 and persist returned media references.
- [x] Build the Netflix-inspired dark landing page with the exact show title “Our Story,” hero content, and Play CTA.
- [x] Build season navigation and responsive episode cards with metadata and thumbnails.
- [x] Build an in-browser MP4 player with native play/pause, seeking, volume, fullscreen, and episode overlay controls.
- [x] Build an owner-only admin dashboard for adding, editing, and uploading episode content.
- [x] Add accessible loading, empty, error, forbidden, and upload-progress states.
- [x] Add explicit query-error states to the landing page and Studio library.
- [x] Implement byte-level MP4 upload progress and inline upload failure feedback.
- [x] Validate owner-only access, media integration behavior, and state handling through the Studio owner preview, guarded server procedures, and automated tests.
- [x] Add unit tests for catalog validation and owner-only content-management access.
- [x] Verify desktop, tablet, and mobile layouts as well as primary streaming and administration flows.
- [x] Run a dedicated tablet-viewport validation for public and Studio routes.
- [x] Document the first real-MP4 smoke test for the owner to complete when production content is available.
- [x] Write local-use instructions covering development setup, owner access, and uploading MP4 files.
