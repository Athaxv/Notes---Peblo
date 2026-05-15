import type { NextFunction, Request, Response } from "express";
import { NoteService, NoteError } from "../services/notes";

function getUserId(req: Request): string {
  if (!req.userId) throw new NoteError("Unauthorized", 401);
  return req.userId;
}

export const NotesController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const note = await NoteService.create(getUserId(req), req.body);
      return res.status(201).json(note);
    } catch (error) {
      next(error);
    }
  },

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const notes = await NoteService.findManyNote(getUserId(req));
      return res.status(200).json(notes);
    } catch (error) {
      next(error);
    }
  },

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const note = await NoteService.getById(req.params.id as string, getUserId(req));
      return res.status(200).json(note);
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const note = await NoteService.update(
        req.params.id as string,
        getUserId(req),
        req.body,
      );
      return res.status(200).json(note);
    } catch (error) {
      next(error);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await NoteService.remove(req.params.id as string, getUserId(req));
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};

export function notesErrorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof NoteError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  next(err);
}
