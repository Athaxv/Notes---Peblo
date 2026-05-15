import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const header = req.headers.authorization;
  const token =
    typeof header === "string" && header.startsWith("Bearer ")
      ? header.slice(7)
      : header;

  if (!token || typeof token !== "string") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { userId } = verifyAccessToken(token);
    req.userId = userId;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
