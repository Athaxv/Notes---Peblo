import jwt from "jsonwebtoken";
import { env } from "../config/env";

type AccessPayload = { userId: string };

export function signAccessToken(userId: string): string {
  return jwt.sign({ userId } satisfies AccessPayload, env.jwtSecret, {
    expiresIn: "15m",
  });
}

export function verifyAccessToken(token: string): AccessPayload {
  const payload = jwt.verify(token, env.jwtSecret);
  if (
    typeof payload !== "object" ||
    payload === null ||
    !("userId" in payload) ||
    typeof payload.userId !== "string"
  ) {
    throw new Error("Invalid token payload");
  }
  return { userId: payload.userId };
}
