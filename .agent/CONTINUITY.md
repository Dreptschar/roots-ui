[PLANS]

- 2026-07-28T19:15:53+02:00 [USER] Validate `index.html`; no page modification was requested.
- 2026-07-28T19:24:38+02:00 [USER] Make the entire repository Prettier-clean and clean up the project.
- 2026-07-28T19:30:04+02:00 [USER] Add real Playwright UI tests.
- 2026-07-28T19:34:43+02:00 [USER] Add a Playwright scenario creating two scheduled plants with two log entries each.
- 2026-07-28T19:38:04+02:00 [USER] Add a Playwright scenario deleting a log, schedule, and plant.
- 2026-07-28T19:40:23+02:00 [USER] Split each Playwright scenario into its own file.
- 2026-07-28T19:42:19+02:00 [USER] Add a Playwright scenario creating a custom Settings action and using it for a plan and log.
- 2026-07-28T19:45:46+02:00 [USER] Add a plant picture to the deletion scenario and verify it survives log/schedule deletion.
- 2026-07-28T19:55:32+02:00 [USER] Add quick watering from plant cards on dashboard and room views.
- 2026-07-28T19:58:03+02:00 [USER] Use the default watering action emoji on the quick-water button.
- 2026-07-28T20:06:53+02:00 [USER] Prevent logging the same plant action more than once per local calendar day.
- 2026-07-28T20:15:54+02:00 [USER] Remove unused code and dependencies, cascade custom action-type deletion to its plans/logs, and prevent deletion of occupied rooms.
- 2026-07-28T20:19:54+02:00 [USER] Replace the persistent occupied-room deletion message with feedback shown only after pressing Delete.
- 2026-07-28T20:24:38+02:00 [USER] Add E2E coverage for editing plants and rooms.
- 2026-07-28T20:28:13+02:00 [USER] Make the quick-watering button emoji-only to prevent mobile layout breakage.
- 2026-07-28T20:32:46+02:00 [USER] Replace PlantCard's labeled room metadata with the room tag styling used on plant details.
- 2026-07-28T20:37:32+02:00 [USER] Diagnose photos temporarily breaking on a phone after quick watering or schedule mutations, while returning after app restart.
- 2026-07-28T20:40:36+02:00 [USER] Apply the photo object-URL lifecycle and silent-refresh fix.
- 2026-07-28T20:48:22+02:00 [USER] Phone retest still showed broken photos after quick watering and deleting a log entry.
- 2026-07-28T20:52:10+02:00 [USER] Phone retest kept the detail photo after log deletion, but the first navigation to the overview showed a broken photo until another page switch.
- 2026-07-28T20:56:27+02:00 [USER] Phone retest still reproduced the broken overview photo after the object-URL mount-cycle fix.

[DECISIONS]

- 2026-07-28T19:15:53+02:00 [TOOL] Used existing local dependencies because Docker daemon access was unavailable; no packages were installed.
- 2026-07-28T19:24:38+02:00 [CODE] Added repository-wide `format` and `format:check` scripts and excluded generated/dependency directories.
- 2026-07-28T19:30:04+02:00 [CODE] Playwright runs the same IndexedDB-backed user journey in desktop Chrome and Pixel 7 profiles against a managed Vite server.
- 2026-07-28T20:15:54+02:00 [CODE] Referential deletion rules are enforced atomically in the IndexedDB layer; UI state is an additional affordance, not the integrity boundary.

[PROGRESS]

- 2026-07-28T19:15:53+02:00 [TOOL] `npm run build` passed and emitted bundled HTML, JavaScript, CSS, and the web manifest.
- 2026-07-28T19:24:38+02:00 [TOOL] Prettier was applied across all matched repository files; stale local database tests were aligned with the current API.
- 2026-07-28T19:30:04+02:00 [CODE] Added Playwright configuration, E2E scripts, artifact ignores, documentation, and a plant-management journey; Vitest excludes `e2e/**`.
- 2026-07-28T19:34:43+02:00 [CODE] Added reusable room, plant, plan, and logging helpers plus a two-plant E2E scenario with independent schedule/history assertions.
- 2026-07-28T19:38:04+02:00 [CODE] Added a deletion E2E scenario and a cross-device swipe helper using mouse input on desktop and direct touch events on mobile.
- 2026-07-28T19:40:23+02:00 [CODE] Split E2E coverage into persistence, multiple-plants, and deletion specs; shared actions live in `e2e/support/plant-helpers.ts`.
- 2026-07-28T19:42:19+02:00 [CODE] Added `custom-action.spec.ts`; generalized shared plan/log helpers to accept custom action labels while retaining watering wrappers.
- 2026-07-28T19:45:46+02:00 [CODE] Added an SVG photo fixture and optional photo upload support to `createPlant`; deletion E2E asserts decoded image visibility after log deletion, schedule deletion, and reload.
- 2026-07-28T19:55:32+02:00 [CODE] `PlantCard` is now an article with separate navigation and accessible Water button; `usePlants.waterPlant` logs default watering and silently refreshes card state.
- 2026-07-28T19:58:03+02:00 [CODE] Added shared `WATERING_EMOJI`; both the default action label and PlantCard quick-water button render `💧`.
- 2026-07-28T20:06:53+02:00 [CODE] Action logs now store `performedOn`; `logAction` returns created/already-logged and performs a transactionally serialized same-day check without updating plans on duplicates.
- 2026-07-28T20:06:53+02:00 [CODE] IndexedDB v5 migration backfills calendar keys, keeps the newest legacy duplicate per plant/action/day, and idempotently seeds default actions.
- 2026-07-28T20:06:53+02:00 [CODE] Quick-water cards disable as “Watered today”; manual duplicate attempts show an informational status in the log dialog.
- 2026-07-28T20:15:54+02:00 [CODE] Action-type deletion now removes every matching plan and logged action in one transaction; room deletion returns `in-use` with a plant count unless the room is empty.
- 2026-07-28T20:15:54+02:00 [CODE] Removed dead variables and unused `prop-types` packages; enabled `noUnusedLocals` and `noUnusedParameters`.
- 2026-07-28T20:19:54+02:00 [CODE] Occupied-room Delete remains interactive and shows an accessible, auto-dismissing error toast when the database rejects deletion.
- 2026-07-28T20:24:38+02:00 [CODE] Added separate room-edit and plant-edit Playwright specs; plant editing covers name, species, notes, room reassignment, and reload persistence.
- 2026-07-28T20:28:13+02:00 [CODE] Plant-card quick watering is now a fixed 44px emoji-only button with state-specific accessible labels.
- 2026-07-28T20:32:46+02:00 [CODE] Overview PlantCards show the room as a compact `inlineMeta` tag beside the plant name; room-detail cards continue to omit redundant room information.
- 2026-07-28T20:40:36+02:00 [CODE] `useObjectUrl` creates replacement URLs during render and revokes them only after replacement/unmount; plant-detail mutation refreshes are silent so photos remain mounted.
- 2026-07-28T20:48:22+02:00 [CODE] Action-only detail/list refreshes now retain the exact in-memory photo Blob, preventing any object-URL replacement or revocation during quick watering and plan/log mutations.
- 2026-07-28T20:52:10+02:00 [CODE] `useObjectUrl` now creates a URL in every effect setup, making React Strict Mode's setup-cleanup-setup mount cycle recreate the URL instead of leaving a memoized revoked URL.
- 2026-07-28T20:56:27+02:00 [CODE] Removed browser `blob:` URLs from photo rendering; `useImageSource` converts IndexedDB Blobs to non-revocable data URLs for cards, details, and editor previews.

[DISCOVERIES]

- 2026-07-28T19:15:53+02:00 [TOOL] `npx --no-install prettier --check index.html` failed because the file is not Prettier-formatted.
- 2026-07-28T19:15:53+02:00 [TOOL] `npm run test` reported 3 failures in `tests/localDb.test.ts`; all are `ReferenceError: savePlant is not defined`. Two other tests passed.
- 2026-07-28T19:15:53+02:00 [CODE] Existing-plan handling passes `matchingPlan.id` to `updateActionPlan`, whose first argument is a plant ID; this can update/create data against the wrong plant.
- 2026-07-28T19:15:53+02:00 [CODE] Room and action-type deletion do not protect or clean up dependent plant, plan, or action records.
- 2026-07-28T19:15:53+02:00 [CODE] TypeScript compilation includes only `src`, so stale test API usage is not caught during `npm run build`.
- 2026-07-28T19:30:04+02:00 [TOOL] Sandbox-local Vite listen returned `EPERM`; E2E execution requires approved local-server access. Playwright Chromium 149 fallback for Ubuntu 24.04 was cached successfully.
- 2026-07-28T19:38:04+02:00 [TOOL] Pixel 7 emulation did not translate mouse/CDP dragging into the component swipe; dispatching `TouchEvent` directly to `.swipeRowContent` reliably exercised mobile deletion.
- 2026-07-28T20:10:03+02:00 [CODE] Cleanup audit found dead `wateringPlan`, `slug`, and IndexedDB result variables plus unused `prop-types` dependencies.
- 2026-07-28T20:10:03+02:00 [CODE] Build typechecking still excludes `tests` and `e2e`; room/action-type deletion integrity and swallowed hook errors remain the higher-value cleanup areas.
- 2026-07-28T20:37:32+02:00 [CODE] Photo data remains persisted; refresh returns a new IndexedDB Blob identity, causing `useObjectUrl` to revoke the displayed URL during effect cleanup before its state-driven replacement is committed. Detail refreshes also unmount the image via loading state. This lifecycle race is the likely phone-only broken-image cause.

[OUTCOMES]

- 2026-07-28T19:15:53+02:00 [TOOL] Production compilation of the Vite entry page succeeded; formatting and unrelated database tests remain failing.
- 2026-07-28T19:15:53+02:00 [CODE] Project review completed without source changes; recommended priority is fixing persistence integrity and restoring the test suite.
- 2026-07-28T19:24:38+02:00 [TOOL] `npm run format:check`, `npm run test` (5/5), and `npm run build` all passed after cleanup.
- 2026-07-28T19:30:04+02:00 [TOOL] Playwright passed 2/2 projects (desktop and mobile Chromium); Vitest 5/5, Prettier, and production build also passed.
- 2026-07-28T19:34:43+02:00 [TOOL] Expanded Playwright suite passed 4/4 executions; Vitest 5/5, Prettier, and production build also passed.
- 2026-07-28T19:38:04+02:00 [TOOL] Expanded Playwright suite passed 6/6 executions; Vitest 5/5, Prettier, and production build also passed.
- 2026-07-28T19:40:23+02:00 [TOOL] Split Playwright suite passed 6/6 executions; Vitest 5/5, Prettier, and production build also passed.
- 2026-07-28T19:42:19+02:00 [TOOL] Custom-action Playwright suite passed 8/8 executions; Vitest 5/5, Prettier, and production build also passed.
- 2026-07-28T19:45:46+02:00 [TOOL] Photo-preservation Playwright suite passed 8/8 executions; Vitest 5/5, Prettier, and production build also passed.
- 2026-07-28T19:55:32+02:00 [TOOL] Quick-watering Playwright suite passed 10/10 executions across dashboard/room desktop and mobile; Vitest 5/5, Prettier, and production build also passed.
- 2026-07-28T19:58:03+02:00 [TOOL] Emoji quick-watering Playwright spec passed 2/2; Vitest 5/5, Prettier, and production build also passed.
- 2026-07-28T20:06:53+02:00 [TOOL] Same-day deduplication Playwright suite passed 10/10; Vitest 7/7 (including legacy migration), Prettier, and production build passed.
- 2026-07-28T20:15:54+02:00 [TOOL] Cleanup and integrity changes passed Prettier, production build, Vitest 9/9, and Playwright 12/12 across desktop and mobile Chromium.
- 2026-07-28T20:19:54+02:00 [TOOL] Room toast change passed Prettier, production build, Vitest 9/9, and its Playwright scenario 2/2 across desktop and mobile Chromium.
- 2026-07-28T20:24:38+02:00 [TOOL] Editing coverage passed the complete Playwright suite 16/16 across desktop and mobile; Vitest 9/9, Prettier, and production build also passed.
- 2026-07-28T20:28:13+02:00 [TOOL] Emoji-only quick watering passed its Playwright scenario 2/2 across desktop and mobile; Vitest 9/9, Prettier, and production build also passed.
- 2026-07-28T20:32:46+02:00 [TOOL] PlantCard room tags passed the full Playwright suite 16/16 across desktop and mobile; Vitest 9/9, Prettier, and production build also passed.
- 2026-07-28T20:40:36+02:00 [TOOL] Photo lifecycle fix passed Playwright 16/16, including decoded-image checks after plan/log creation; Vitest 9/9, Prettier, and production build passed.
- 2026-07-28T20:48:22+02:00 [TOOL] In-memory photo preservation passed focused photo scenarios 4/4 and full Playwright 16/16; Vitest 9/9, Prettier, and production build passed.
- 2026-07-28T20:52:10+02:00 [TOOL] Exact log-delete → overview → detail decoded-photo regression passed 2/2; full Playwright 16/16, Vitest 9/9, Prettier, and production build passed.
- 2026-07-28T20:56:27+02:00 [TOOL] Data-URL photo rendering passed focused regressions 4/4 and full Playwright 16/16 with assertions that image sources are `data:image/`; Vitest 9/9, Prettier, and production build passed.
