import type { NextFunction, Request, Response } from "express";
import { AIService, AIError } from "../services/ai";

export const AIController = {
  async generate(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const result = await AIService.enqueueNoteGeneration(
        req.params.id as string,
        req.userId,
      );

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};

export function aiErrorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof AIError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  next(err);
}
