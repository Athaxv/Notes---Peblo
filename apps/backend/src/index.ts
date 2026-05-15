import "dotenv/config";
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

app.listen(env.port, () => {
  console.log(`Server listening on http://localhost:${env.port}`);
});
