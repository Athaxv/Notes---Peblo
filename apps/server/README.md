# server

Queue configuration and AI worker for the peblo monorepo.

## Architecture

- **`server/queue`** — BullMQ queue (`aiQueue`), job names, Redis connection. Imported by `apps/backend` to enqueue jobs.
- **`src/worker.ts`** — Separate process that consumes jobs, calls Groq, and updates notes via the `db` package.

## Prerequisites

- Redis running locally:

```bash
docker run -p 6379:6379 redis
```

- `DATABASE_URL` and `GROQ_API_KEY` in `apps/server/.env`
- Same `REDIS_HOST` / `REDIS_PORT` in `apps/backend/.env`

## Run locally (two terminals)

**Terminal 1 — API**

```bash
bun run dev:api
# from repo root, or: cd apps/backend && bun run src/index.ts
```

**Terminal 2 — AI worker**

```bash
bun run dev:worker
# from repo root, or: cd apps/server && bun run worker
```

## Enqueue AI job

```http
POST http://localhost:5000/notes/:noteId/ai
Authorization: Bearer <access_token>
```

## Install

```bash
bun install
```
