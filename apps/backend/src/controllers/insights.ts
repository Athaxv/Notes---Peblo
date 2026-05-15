import type { NextFunction, Request, Response } from "express";
import { NoteError } from "../lib/errors";
import { InsightsService } from "../services/insights";

export const InsightsController = {
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const data = await InsightsService.getForUser(req.userId);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  },
};
