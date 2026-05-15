# Peblo Frontend

Next.js app for the PEBLO notes workspace.

## Setup

```bash
cp .env.local.example .env.local
bun install
```

Ensure the backend runs on `http://localhost:5000` with `FRONTEND_URL=http://localhost:3000`.

## Run

```bash
# From repo root
bun run dev:web

# Or from this directory
bun dev
```

Also run the API and AI worker:

```bash
bun run dev:api
bun run dev:worker
```

## Routes

| Route | Description |
|-------|-------------|
| `/login`, `/register` | Authentication |
| `/dashboard` | Productivity insights |
| `/notes` | Notes list with search & filters |
| `/notes/[id]` | Editor with auto-save & AI |
| `/shared/[shareId]` | Public shared note |
