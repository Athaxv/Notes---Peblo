"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  LogOut,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { getStoredUser } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/notes", label: "Notes", icon: FileText },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const user = getStoredUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebar = (
    <aside className="flex h-full flex-col border-r border-border bg-card p-4">
      <Link href="/dashboard" className="mb-8 flex items-center gap-2 px-2">
        <Sparkles className="h-6 w-6 text-accent" />
        <span className="text-lg font-bold tracking-tight">Peblo</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
              pathname.startsWith(href)
                ? "bg-accent/15 text-accent"
                : "text-muted hover:bg-muted-bg hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-border pt-4">
        <p className="truncate px-2 text-xs text-muted">{user?.email}</p>
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 w-full justify-start"
          onClick={() => void logout()}
        >
          <LogOut className="h-4 w-4" />
          Log out
        </Button>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen app-gradient">
      <div className="hidden w-64 shrink-0 md:block">{sidebar}</div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div id="mobile-sidebar" className="absolute left-0 top-0 h-full w-64 bg-card">
            {sidebar}
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-border bg-card/80 px-4 py-3 backdrop-blur md:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-sidebar"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="min-h-11 min-w-11 cursor-pointer rounded-lg p-2 hover:bg-muted-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {mobileOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
          <span className="font-semibold">Peblo</span>
        </header>
        <main id="main-content" className="flex-1 overflow-auto p-4 md:p-8" tabIndex={-1}>
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
