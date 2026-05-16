import type { Response } from "express";
import { env } from "../config/env";

export const REFRESH_COOKIE = "refreshToken";

/** Must be `/` so the cookie is sent on `/api/auth/*` (Next proxy), not only `/auth/*`. */
const REFRESH_COOKIE_PATH = "/";

export function setRefreshCookie(res: Response, token: string, maxAgeMs: number) {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: env.isProd,
    sameSite: "lax",
    path: REFRESH_COOKIE_PATH,
    maxAge: maxAgeMs,
  });
}

export function clearRefreshCookie(res: Response) {
  res.clearCookie(REFRESH_COOKIE, {
    httpOnly: true,
    secure: env.isProd,
    sameSite: "lax",
    path: REFRESH_COOKIE_PATH,
  });
}
