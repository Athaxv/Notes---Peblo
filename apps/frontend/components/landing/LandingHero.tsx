import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";
import { landingCopy } from "./landing-copy";

export function LandingHero() {
  return (
    <section
      id="features"
      className="mx-auto flex max-w-3xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-24 lg:py-28"
      aria-labelledby="landing-headline"
    >
      <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-[var(--landing-badge-bg)] px-4 py-2 text-sm font-medium text-[var(--landing-badge-text)]">
        <Leaf className="h-4 w-4" aria-hidden />
        {landingCopy.badge}
      </div>

      <h1 id="landing-headline" className="space-y-1">
        <span className="font-display block text-4xl italic leading-tight text-[var(--landing-primary)] sm:text-5xl md:text-6xl">
          {landingCopy.headlineLine1}
        </span>
        <span className="block text-4xl font-bold leading-tight tracking-tight text-[var(--landing-primary)] sm:text-5xl md:text-6xl">
          {landingCopy.headlineLine2}
        </span>
      </h1>

      <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--landing-muted)]">
        {landingCopy.subheadline}
      </p>

      <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
        <Link
          href="/register"
          className="inline-flex min-h-11 min-w-[10rem] items-center justify-center gap-2 rounded-full bg-[var(--landing-primary)] px-8 text-sm font-medium text-white transition-colors hover:bg-[var(--landing-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary)] focus-visible:ring-offset-2"
        >
          {landingCopy.ctaPrimary}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        <Link
          href="#features"
          className="inline-flex min-h-11 items-center px-2 text-sm font-medium text-[var(--landing-primary)] underline decoration-dotted decoration-2 underline-offset-4 transition-colors hover:text-[var(--landing-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary)] focus-visible:ring-offset-2 rounded-md"
        >
          {landingCopy.ctaSecondary}
        </Link>
      </div>
    </section>
  );
}
