import type { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth";

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.login(req.body);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};
