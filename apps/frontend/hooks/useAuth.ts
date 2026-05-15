"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
  clearSession,
  getStoredUser,
  setSession,
} from "@/lib/auth";
import type { User } from "@/lib/types";

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.auth.login({ email, password });
        setSession(res.accessToken, res.user);
        setUser(res.user);
        router.push("/dashboard");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Login failed");
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  const register = useCallback(
    async (email: string, password: string, name?: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.auth.register({ email, password, name });
        setSession(res.accessToken, res.user);
        setUser(res.user);
        router.push("/dashboard");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Registration failed");
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  const logout = useCallback(async () => {
    try {
      await api.auth.logout();
    } catch {
      /* ignore */
    }
    clearSession();
    setUser(null);
    router.push("/login");
  }, [router]);

  return { user, loading, error, login, register, logout, setError };
}
