import "dotenv/config";
import express from "express";
import authRouter from "./routers/auth"

const app = express();
app.use(express.json());

app.get("/", (_, res) => {
  res.status(200).json({
    message: "Health, check",
  });
});

app.use("/auth", authRouter);

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    const status =
      err.message === "User already exists"
        ? 409
        : err.message === "No user exists with this email" ||
            err.message === "Invalid Credentials"
          ? 401
          : 500;
    res.status(status).json({ message: err.message });
  },
);

const port = Number(process.env.PORT) || 5000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
