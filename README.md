# Elo Arena

A minimalist, self‑hostable Elo voting app for images and text items. Built with Next.js App Router, React, TypeScript, and Tailwind CSS.

## Features

- Smooth two‑choice voting with keyboard (←/→), subtle animations, and Upset! toast
- Image and text items: static public, admin uploads (Vercel Blob in prod, FS in dev), and local-only (client) fallback
- Global ratings + Personal leaderboards (signed-in or cookie-based when sign-in disabled)
- Admin: upload images, add text, rename/reset names, remove items, set arena title
- Super Admin (OJ lock): claim/reset lock, toggle sign-in, edit allowlist, export/import state, reset arena data
- Single JSON state persisted via Vercel Blob (prod) or filesystem (dev)
- Theming: light/dark/system, clean aesthetic, glass surfaces, subtle interactions

## Quickstart

- Prereqs: Node 20+, pnpm
- Local run:
  - `pnpm install`
  - `pnpm dev`
  - open http://localhost:3000

## Environment

Create `.env.local` (not committed):

```
ARENA_PASSWORD="change-me"
ARENA_SUPER_ADMIN_PASSWORD="change-me-too"
FP_SALT="a-long-random-secret-string"
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..." # optional, required for Vercel Blob
```

Notes:
- In production on Vercel, set the same keys in Project Settings → Environment Variables.
- When `BLOB_READ_WRITE_TOKEN` is absent (or not on Vercel), dev uses `data/state.json` and `public/uploads/` (both Git‑ignored).

## Deploy on Vercel

- Push this repo to GitHub
- Import into Vercel
- Add env vars in Project Settings (see above)
- Optionally provision Vercel Blob & set `BLOB_READ_WRITE_TOKEN`

## Scripts

- `pnpm dev` — run locally
- `pnpm build` — production build
- `pnpm start` — run built app
- `pnpm lint` — lint

## Notes

- API endpoints are uncached with `no-store` headers
- Fingerprint is server-only and salted (`FP_SALT`)
- `.env.local` and `data/` are Git‑ignored; configure env in Vercel settings for production

# elo-arena
