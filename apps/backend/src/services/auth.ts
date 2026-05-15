import { env } from "../config/env";
import { AuthError } from "../lib/errors";
import { RefreshTokenRepository } from "../repositories/refreshToken.repository";
import { UserRepository } from "../repositories/user";
import { comparePassword, hashPassword } from "../utils/password";
import {
  generateOpaqueToken,
  hashToken,
  refreshExpiresAt,
} from "../utils/token";
import { signAccessToken } from "../utils/jwt";
import type { z } from "zod";
import type { loginSchema, registerSchema } from "../schemas/auth.schema";

type RegisterInput = z.infer<typeof registerSchema>;
type LoginInput = z.infer<typeof loginSchema>;

async function issueTokenPair(userId: string) {
  const accessToken = signAccessToken(userId);
  const rawRefresh = generateOpaqueToken();
  const tokenHash = hashToken(rawRefresh);
  const expiresAt = refreshExpiresAt(env.refreshDays);

  await RefreshTokenRepository.create({ userId, tokenHash, expiresAt });

  return {
    accessToken,
    refreshToken: rawRefresh,
    refreshMaxAgeMs: env.refreshDays * 24 * 60 * 60 * 1000,
  };
}

export const AuthService = {
  async register(body: RegisterInput) {
    const existing = await UserRepository.findByEmail(body.email);
    if (existing) throw new AuthError("User already exists", 409);

    const password = await hashPassword(body.password);
    const user = await UserRepository.create({
      email: body.email,
      password,
      name: body.name,
    });

    const tokens = await issueTokenPair(user.id);
    return { user, ...tokens };
  },

  async login(body: LoginInput) {
    const existing = await UserRepository.findByEmail(body.email);
    if (!existing) throw new AuthError("Invalid credentials", 401);

    const valid = await comparePassword(body.password, existing.password);
    if (!valid) throw new AuthError("Invalid credentials", 401);

    const tokens = await issueTokenPair(existing.id);
    const user = await UserRepository.findById(existing.id);
    return { user, ...tokens };
  },

  async refresh(rawRefreshToken: string | undefined) {
    if (!rawRefreshToken) throw new AuthError("Missing refresh token", 401);

    const tokenHash = hashToken(rawRefreshToken);
    const stored = await RefreshTokenRepository.findValidByHash(tokenHash);
    if (!stored) throw new AuthError("Invalid refresh token", 401);

    await RefreshTokenRepository.revokeById(stored.id);
    const tokens = await issueTokenPair(stored.userId);
    const user = await UserRepository.findById(stored.userId);
    return { user, ...tokens };
  },

  async logout(rawRefreshToken: string | undefined) {
    if (!rawRefreshToken) return;
    const tokenHash = hashToken(rawRefreshToken);
    const stored = await RefreshTokenRepository.findValidByHash(tokenHash);
    if (stored) await RefreshTokenRepository.revokeById(stored.id);
  },
};
