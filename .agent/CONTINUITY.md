[PLANS]

- 2026-07-28T19:15:53+02:00 [USER] Validate `index.html`; no page modification was requested.
- 2026-07-28T19:24:38+02:00 [USER] Make the entire repository Prettier-clean and clean up the project.

[DECISIONS]

- 2026-07-28T19:15:53+02:00 [TOOL] Used existing local dependencies because Docker daemon access was unavailable; no packages were installed.
- 2026-07-28T19:24:38+02:00 [CODE] Added repository-wide `format` and `format:check` scripts and excluded generated/dependency directories.

[PROGRESS]

- 2026-07-28T19:15:53+02:00 [TOOL] `npm run build` passed and emitted bundled HTML, JavaScript, CSS, and the web manifest.
- 2026-07-28T19:24:38+02:00 [TOOL] Prettier was applied across all matched repository files; stale local database tests were aligned with the current API.

[DISCOVERIES]

- 2026-07-28T19:15:53+02:00 [TOOL] `npx --no-install prettier --check index.html` failed because the file is not Prettier-formatted.
- 2026-07-28T19:15:53+02:00 [TOOL] `npm run test` reported 3 failures in `tests/localDb.test.ts`; all are `ReferenceError: savePlant is not defined`. Two other tests passed.
- 2026-07-28T19:15:53+02:00 [CODE] Existing-plan handling passes `matchingPlan.id` to `updateActionPlan`, whose first argument is a plant ID; this can update/create data against the wrong plant.
- 2026-07-28T19:15:53+02:00 [CODE] Room and action-type deletion do not protect or clean up dependent plant, plan, or action records.
- 2026-07-28T19:15:53+02:00 [CODE] TypeScript compilation includes only `src`, so stale test API usage is not caught during `npm run build`.

[OUTCOMES]

- 2026-07-28T19:15:53+02:00 [TOOL] Production compilation of the Vite entry page succeeded; formatting and unrelated database tests remain failing.
- 2026-07-28T19:15:53+02:00 [CODE] Project review completed without source changes; recommended priority is fixing persistence integrity and restoring the test suite.
- 2026-07-28T19:24:38+02:00 [TOOL] `npm run format:check`, `npm run test` (5/5), and `npm run build` all passed after cleanup.
