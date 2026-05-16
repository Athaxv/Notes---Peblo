"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  clearSession,
  getAccessToken,
  getStoredUser,
  setSession,
} from "@/lib/auth";
import { Spinner } from "@/components/ui/Spinner";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function bootstrap() {
      const token = getAccessToken();
      if (token) {
        setReady(true);
        return;
      }

      try {
        const res = await api.auth.refresh();
        setSession(res.accessToken, res.user ?? getStoredUser());
        setReady(true);
      } catch {
        clearSession();
        window.location.replace("/login");
      }
    }

    void bootstrap();
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center app-gradient">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return <>{children}</>;
}
