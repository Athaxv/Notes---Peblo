import { LandingHero } from "./LandingHero";
import { LandingNavbar } from "./LandingNavbar";

export function LandingPage() {
  return (
    <div className="landing-theme flex min-h-screen flex-col">
      <LandingNavbar />
      <main id="main-content" tabIndex={-1}>
        <LandingHero />
      </main>
    </div>
  );
}
