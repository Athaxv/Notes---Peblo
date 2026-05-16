import "dotenv/config";
import { createServer } from "node:http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import authRouter from "./routers/auth";
import notesRouter from "./routers/note";
import aiRouter from "./routers/ai";
import shareRouter from "./routers/share";
import publicRouter from "./routers/public";
import tagsRouter from "./routers/tag";
import insightsRouter from "./routers/insights";
import { globalErrorHandler } from "./middleware/errorHandler";

const app = express();

// Disable ETag — otherwise repeated GETs (e.g. ai-status polling) return 304 with no body
app.set("etag", false);
app.use((_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (_, res) => {
  res.status(200).json({ message: "Peblo API" });
});

app.use("/auth", authRouter);
app.use("/notes", notesRouter);
app.use("/notes", aiRouter);
app.use("/notes", shareRouter);
app.use("/shared", publicRouter);
app.use("/tags", tagsRouter);
app.use("/insights", insightsRouter);

app.use(globalErrorHandler);

/** `app.listen` alone can exit immediately on Bun/Windows; `createServer` keeps the process alive. */
const server = createServer(app);

server.listen(env.port, () => {
  console.log(`Server listening on http://localhost:${env.port}`);
  console.log(
    `AI: ${env.useAiWorker ? "worker queue (USE_AI_WORKER=true)" : "sync in-request (default)"}`,
  );
});

server.on("error", (err) => {
  console.error("Server error:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  process.exit(1);
});
