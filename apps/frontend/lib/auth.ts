import type { User } from "./types";

const TOKEN_KEY = "peblo_access_token";
const USER_KEY = "peblo_user";
const SESSION_COOKIE = "peblo_session";

let memoryToken: string | null = null;
let memoryUser: User | null = null;

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return memoryToken;
  if (memoryToken) return memoryToken;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return memoryUser;
  if (memoryUser) return memoryUser;
  const raw = sessionStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function setSession(accessToken: string, user: User | null) {
  memoryToken = accessToken;
  memoryUser = user;
  if (typeof window === "undefined") return;
  sessionStorage.setItem(TOKEN_KEY, accessToken);
  if (user) sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  document.cookie = `${SESSION_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

export function clearSession() {
  memoryToken = null;
  memoryUser = null;
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`;
}

export function isAuthenticated(): boolean {
  return Boolean(getAccessToken());
}
