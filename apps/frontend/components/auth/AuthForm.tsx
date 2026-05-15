"use client";

import Link from "next/link";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const { login, register, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password, name || undefined);
      }
    } catch {
      /* error shown via useAuth */
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center app-gradient p-4">
      <Card className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-2">
          <Sparkles className="h-8 w-8 text-accent" aria-hidden />
          <span className="text-2xl font-bold">Peblo</span>
        </div>

        <h1 className="mb-6 text-center text-xl font-semibold">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {mode === "register" && (
            <div>
              <label htmlFor="auth-name" className="mb-1.5 block text-sm text-muted">
                Name
              </label>
              <Input
                id="auth-name"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
          )}
          <div>
            <label htmlFor="auth-email" className="mb-1.5 block text-sm text-muted">
              Email
            </label>
            <Input
              id="auth-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="auth-password" className="mb-1.5 block text-sm text-muted">
              Password
            </label>
            <Input
              id="auth-password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Sign up"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          {mode === "login" ? (
            <>
              No account?{" "}
              <Link href="/register" className="font-medium text-accent">
                Register
              </Link>
            </>
          ) : (
            <>
              Have an account?{" "}
              <Link href="/login" className="font-medium text-accent">
                Sign in
              </Link>
            </>
          )}
        </p>
      </Card>
    </div>
  );
}
