# Pillyung

Medication safety and reminder app built with React, TypeScript, and Vite.

## Run locally

Requires Node.js 22.12 or newer.

```sh
npm ci
npm run dev
```

The app is available at <http://localhost:3000>.

## Build

```sh
npm run build
npm run preview
```

Vite writes the production site to `dist/`.

## Deploy to Vercel

Import this repository in Vercel and use the detected Vite settings:

- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm ci`
- Node.js version: 22.x or newer

These settings are also recorded in `vercel.json`. The rewrite there lets Vercel serve the app shell for client-side routes. No environment variables are currently required by the app.

If Gemini API functionality is added later, route requests through a server-side function and store the API key as a Vercel environment variable. Do not expose a private API key in client-side `VITE_*` variables.
