# Roots UI

Frontend web app for houseplant management.

## Stack

- React
- TypeScript
- Vite
- React Router
- PWA support via a lightweight service worker
- IndexedDB for local persistence

## Run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the dev server:

   ```bash
   npm run dev
   ```

3. Build for production:

   ```bash
   npm run build
   ```

4. Run tests:

   ```bash
   npm run test
   ```

## Environment

There are no remote service environment variables for the current local-first setup.

## Data model

The app stores plants, rooms, action types, action plans, and action history in IndexedDB.
First launch starts empty; everything is created locally in the browser.
