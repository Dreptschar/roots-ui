# Roots UI

Frontend web app for houseplant management.

## Stack

- React
- TypeScript
- Vite
- React Router
- PWA support via a lightweight service worker
- OpenAPI Generator client for backend access

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

## Environment

Set `VITE_API_BASE_URL` when the backend is available.

Default backend target in development is `/api`, which Vite proxies to `http://localhost:8081`.

Set `VITE_API_BASE_URL=http://localhost:8081/api` if you need to bypass the proxy.

If the backend is not reachable, the app currently shows backend failure states instead of faking data.

## Regenerate the API client

```bash
npm run generate:api
```
