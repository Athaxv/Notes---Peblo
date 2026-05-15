import { LandingHero } from "./LandingHero";
import { LandingNavbar } from "./LandingNavbar";

export function LandingPage() {
  return (
    <div className="landing-theme min-h-screen">
      <section
        id="features"
        className="landing-hero flex min-h-screen flex-col"
        aria-label="Hero"
      >
        <LandingNavbar />
        <LandingHero />
      </section>
    </div>
  );
}
