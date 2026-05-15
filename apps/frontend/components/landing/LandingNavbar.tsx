import Link from "next/link";
import { Flower2 } from "lucide-react";
import { landingCopy } from "./landing-copy";

export function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 bg-transparent">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-h-11 items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          <Flower2 className="h-7 w-7 text-accent" aria-hidden />
          <span className="font-display text-xl font-normal text-accent">
            Peblo
          </span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/login"
            className="inline-flex min-h-11 items-center px-2 text-sm font-medium text-foreground transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-md"
          >
            {landingCopy.nav.login}
          </Link>
          <Link
            href="/register"
            className="inline-flex min-h-11 items-center rounded-full bg-accent px-4 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 sm:px-5"
          >
            {landingCopy.nav.getStarted}
          </Link>
        </div>
      </div>
    </header>
  );
}
