# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install
npm run dev       # Vite dev server
npm run build     # tsc -b (type-check via project references) then vite build → dist/
npm run preview   # serve the built dist/
npm run lint      # eslint . (flat config in eslint.config.js)
```

There is no test framework configured. `npm run build` is the type-check gate — `tsc -b` fails the build on type errors.

## Architecture

A single-page React 18 + Vite + TypeScript app: the user enters a URL and gets a downloadable QR code PNG. QR generation happens entirely client-side via the `qrcode` package (`QRCode.toDataURL`), so there is no backend — the app is a pure static site.

- Essentially all logic lives in `src/App.tsx`: URL normalization (bare domains get `https://` prepended), a loose validity check (http/https protocol and a dotted hostname), QR generation, and PNG download via a synthetic `<a download>` click.
- TypeScript uses project references: `tsconfig.json` points to `tsconfig.app.json` (browser code in `src/`) and `tsconfig.node.json` (`vite.config.ts`). 

## Deployment

Deployed to Azure Static Web Apps by `.github/workflows/azure-static-web-apps-*.yml` on every push to `main` (PRs to `main` get preview environments, torn down when the PR closes). The Azure action builds from `app_location: "/"` and uploads `output_location: "dist"`; there is no API (`api_location: ""`).

`staticwebapp.config.json` rewrites unknown routes to `/index.html` (SPA fallback), excluding `/assets/*` and `/favicon.svg`. If you add new static files at the root of `public/`, add them to that exclude list.
