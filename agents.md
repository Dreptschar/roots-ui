# Agents.md

This file is the handoff note for future agents working in this repository.

## Current state

- Repository now has a React + TypeScript Vite scaffold.
- Product direction: frontend web app for houseplant management.
- UX requirement: must work well on phones as a first-class web app.
- Current visual direction is accepted as-is for now.
- PWA support is included via a lightweight service worker.
- Primary flows implemented: dashboard, plant detail, create/edit plant.
- Plant model now aligns with the OpenAPI contract: `species`, `roomId`, action plans, and action history.
- Dashboard last-watered state is derived from watering action data and action plans.
- Backend integration uses generated OpenAPI clients in `src/generated/openapi` via `src/lib/backend.ts`; default dev API target is `/api` and Vite proxies that to `http://localhost:8081`.
- Client talks to the contract endpoints for `/rooms`, `/action-types`, `/plants`, `/plants/{id}`, `/plants/{id}/actions`, and `/plants/{id}/action-plans`.
- Regenerate the client with `npm run generate:api`.
- Repository contains `openapi.yaml`; it currently describes the backend contract and uses `/api` as the server base path.
- `openapi.yaml` is the source of truth for backend communication.
- All backend communication must go through generated OpenAPI classes and models.
- For local development, prefer the Vite `/api` proxy instead of browser-side cross-origin requests.
- Run path: `npm install`, `npm run dev`, `npm run build`.
- Current scaffold build has been verified successfully.
- Generated client lives under `src/generated/openapi`; do not hand-edit those files.

## Known goals

- Set up the project from scratch.
- Keep this file updated with the important facts, decisions, and conventions new agents need.

## Open questions for the user

I need the following decisions before I scaffold the app:

1. What is the backend contract?
   - Existing API base URL
   - Auth requirements
   - Plant fields and endpoints
   - Offline sync rules

2. Do you already have:
   - Brand colors
   - Logo
   - Typography preferences
   - Reference apps/screens

3. Should we add test/lint/format tooling next?

## Working conventions

- Prefer small, explicit changes.
- Update this file whenever a major decision is made.
- Record setup choices here so later agents do not have to rediscover them.
- If a file is intentionally ignored or left untracked, note why here.
- Prefer mobile-first layout decisions; desktop should follow from that baseline.
- Keep the current visual style unless the user asks for a redesign.

## Next step

Answer the questions above, and I’ll scaffold the project accordingly.
