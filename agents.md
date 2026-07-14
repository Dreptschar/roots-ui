# Agents.md

This file is the handoff note for future agents working in this repository.

## Current state

- Repository now has a React + TypeScript Vite scaffold.
- Product direction: frontend web app for houseplant management.
- UX requirement: must work well on phones as a first-class web app.
- Current visual direction is accepted as-is for now.
- PWA support is included via a lightweight service worker.
- Primary flows implemented: dashboard, plant detail, create/edit plant.
- Plant data is now local-first and persisted in IndexedDB.
- Test coverage is set up with Vitest, Testing Library, jsdom, and fake-indexeddb.
- Dashboard is room-first; room pages list the plants in that room.
- Dashboard last-watered state is derived from local watering action data and action plans.
- There is no remote service dependency in the UI anymore.
- First launch starts empty; users create rooms, action types, plants, and action plans locally.
- Run path: `npm install`, `npm run dev`, `npm run test`, `npm run build`.
- Current scaffold build has been verified successfully.

## Known goals

- Set up the project from scratch.
- Keep this file updated with the important facts, decisions, and conventions new agents need.

## Open questions for the user

I need the following decisions before I extend the app further:

1. Do you already have:
   - Brand colors
   - Logo
   - Typography preferences
   - Reference apps/screens

2. Should we add test/lint/format tooling next?

3. Do you want any local export/import or sync mechanism next?

## Working conventions

- Prefer small, explicit changes.
- Update this file whenever a major decision is made.
- Record setup choices here so later agents do not have to rediscover them.
- If a file is intentionally ignored or left untracked, note why here.
- Prefer mobile-first layout decisions; desktop should follow from that baseline.
- Keep the current visual style unless the user asks for a redesign.

## Next step

Answer the questions above, and I’ll extend the local-first PWA accordingly.
