import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";
import { landingCopy } from "./landing-copy";

export function LandingHero() {
  return (
    <div
      className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 pt-2 pb-16 text-center sm:px-6 sm:pt-3 sm:pb-20"
      aria-labelledby="landing-headline"
    >
      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--badge-bg)] px-4 py-2 text-sm font-medium text-[var(--badge-text)]">
        <Leaf className="h-4 w-4" aria-hidden />
        {landingCopy.badge}
      </div>

      <h1
        id="landing-headline"
        className="font-display space-y-0 leading-[1.05] text-accent"
      >
        <span className="block text-4xl italic sm:text-5xl md:text-6xl">
          {landingCopy.headlineLine1}
        </span>
        <span className="block text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          {landingCopy.headlineLine2}
        </span>
      </h1>

      <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
        {landingCopy.subheadline}
      </p>

      <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
        <Link
          href="/register"
          className="inline-flex min-h-11 min-w-[10rem] items-center justify-center gap-2 rounded-full bg-accent px-8 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          {landingCopy.ctaPrimary}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        <Link
          href="#features"
          className="inline-flex min-h-11 items-center rounded-md px-2 text-sm font-medium text-accent underline decoration-dotted decoration-2 underline-offset-4 transition-colors hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          {landingCopy.ctaSecondary}
        </Link>
      </div>
    </div>
  );
}
