import type { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth";
import { AuthError } from "../lib/errors";
import {
  clearRefreshCookie,
  REFRESH_COOKIE,
  setRefreshCookie,
} from "../utils/cookies";

function sendAuthResponse(
  res: Response,
  data: {
    accessToken: string;
    refreshToken: string;
    refreshMaxAgeMs: number;
    user: { id: string; name: string | null; email: string; createdAt: Date } | null;
  },
  status = 200,
) {
  setRefreshCookie(res, data.refreshToken, data.refreshMaxAgeMs);
  return res.status(status).json({
    accessToken: data.accessToken,
    user: data.user,
  });
}

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body);
      return sendAuthResponse(res, result, 201);
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.login(req.body);
      return sendAuthResponse(res, result);
    } catch (error) {
      next(error);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const raw = req.cookies?.[REFRESH_COOKIE] as string | undefined;
      const result = await AuthService.refresh(raw);
      setRefreshCookie(res, result.refreshToken, result.refreshMaxAgeMs);
      return res.status(200).json({
        accessToken: result.accessToken,
        user: result.user,
      });
    } catch (error) {
      next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const raw = req.cookies?.[REFRESH_COOKIE] as string | undefined;
      await AuthService.logout(raw);
      clearRefreshCookie(res);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};

export function authErrorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof AuthError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  next(err);
}
