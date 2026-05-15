import type { NextFunction, Request, Response } from "express";
import { NoteError } from "../lib/errors";
import { ShareService } from "../services/share";

function getUserId(req: Request): string {
  if (!req.userId) throw new NoteError("Unauthorized", 401);
  return req.userId;
}

export const ShareController = {
  async enable(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ShareService.enableShare(
        req.params.id as string,
        getUserId(req),
      );
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async disable(req: Request, res: Response, next: NextFunction) {
    try {
      await ShareService.disableShare(req.params.id as string, getUserId(req));
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  async getPublic(req: Request, res: Response, next: NextFunction) {
    try {
      const note = await ShareService.getPublicNote(req.params.shareId as string);
      return res.status(200).json(note);
    } catch (error) {
      next(error);
    }
  },
};
