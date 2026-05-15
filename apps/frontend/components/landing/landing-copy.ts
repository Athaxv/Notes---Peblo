export const landingCopy = {
  badge: "Write smarter. Together.",
  headlineLine1: "Beautiful tools for",
  headlineLine2: "for your best notes.",
  subheadline:
    "Peblo helps you capture ideas, summarize with AI, and share notes—without the clutter.",
  ctaPrimary: "Get Started",
  ctaSecondary: "Learn More",
  nav: {
    product: "Product",
    features: "Features",
    pricing: "Pricing",
    about: "About",
    blog: "Blog",
    login: "Log in",
    getStarted: "Get Started",
  },
} as const;

export const navLinks = [
  { label: landingCopy.nav.product, href: "#product", hasChevron: true },
  { label: landingCopy.nav.features, href: "#features" },
  { label: landingCopy.nav.pricing, href: "#pricing" },
  { label: landingCopy.nav.about, href: "#about" },
  { label: landingCopy.nav.blog, href: "#blog" },
] as const;
