import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

type AccessTokenPayload = {
  userId: string;
};

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
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as AccessTokenPayload;

    if (!payload.userId) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
