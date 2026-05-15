"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Flower2, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { landingCopy, navLinks } from "./landing-copy";

export function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-h-11 items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary)] focus-visible:ring-offset-2"
        >
          <Flower2
            className="h-7 w-7 text-[var(--landing-primary)]"
            aria-hidden
          />
          <span className="font-display text-xl font-normal text-[var(--landing-primary)]">
            Peblo
          </span>
        </Link>

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-[var(--landing-foreground)] transition-colors hover:text-[var(--landing-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary)] focus-visible:ring-offset-2 rounded-md px-1"
            >
              {link.label}
              {"hasChevron" in link && link.hasChevron && (
                <ChevronDown className="h-4 w-4 opacity-70" aria-hidden />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/login"
            className="inline-flex min-h-11 items-center px-2 text-sm font-medium text-[var(--landing-foreground)] transition-colors hover:text-[var(--landing-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary)] focus-visible:ring-offset-2 rounded-md"
          >
            {landingCopy.nav.login}
          </Link>
          <Link
            href="/register"
            className="inline-flex min-h-11 items-center rounded-full bg-[var(--landing-primary)] px-5 text-sm font-medium text-white transition-colors hover:bg-[var(--landing-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary)] focus-visible:ring-offset-2"
          >
            {landingCopy.nav.getStarted}
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary)]"
          onClick={() => setMobileOpen((o) => !o)}
          aria-expanded={mobileOpen}
          aria-controls="landing-mobile-nav"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <X className="h-6 w-6" aria-hidden />
          ) : (
            <Menu className="h-6 w-6" aria-hidden />
          )}
        </button>
      </div>

      <div
        id="landing-mobile-nav"
        className={cn(
          "border-t border-black/5 bg-white md:hidden",
          mobileOpen ? "block" : "hidden",
        )}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="flex min-h-11 items-center gap-1 rounded-lg px-3 text-sm font-medium text-[var(--landing-foreground)] hover:bg-[var(--landing-badge-bg)]"
            >
              {link.label}
              {"hasChevron" in link && link.hasChevron && (
                <ChevronDown className="h-4 w-4 opacity-70" aria-hidden />
              )}
            </Link>
          ))}
          <div className="mt-2 flex flex-col gap-2 border-t border-black/5 pt-4">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex min-h-11 items-center justify-center rounded-lg text-sm font-medium text-[var(--landing-foreground)]"
            >
              {landingCopy.nav.login}
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              className="flex min-h-11 items-center justify-center rounded-full bg-[var(--landing-primary)] text-sm font-medium text-white hover:bg-[var(--landing-primary-hover)]"
            >
              {landingCopy.nav.getStarted}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
