/**
 * Global site settings. Everything brand/contact related lives here so it can be
 * changed in one place.
 *
 * TODO(owner): replace every value marked PLACEHOLDER before going live
 * (PRD section 13 – nothing here may be invented for production).
 */
export const site = {
  name: "JEWEALITY",
  title: "JEWEALITY – Mobile Apps, Tools and Games",
  description:
    "JEWEALITY creates useful mobile applications, productivity tools, utilities, games, and innovative digital experiences.",

  /**
   * Canonical site URL (no trailing slash), used for canonical tags, sitemap, robots and Open Graph.
   * Order: NEXT_PUBLIC_SITE_URL (manual override) → URL (set by Netlify at build time to the
   * site's primary domain, so a custom domain is picked up automatically) → Netlify subdomain.
   */
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.URL ||
    "https://jeweality-apps.netlify.app"
  ).replace(/\/$/, ""),

  /** Official developer/contact email (shown on Contact, Home and legal pages). */
  email: "roshanvarma@jeweality.com",

  /** Google Play developer profile URL. */
  playDeveloperUrl: "https://play.google.com/store/apps/developer?id=JEWEALITY",

  /** Brand accent taken from the logo gradient. */
  themeColor: "#5b3df5",

  nav: [
    { href: "/", label: "Home" },
    { href: "/apps", label: "Apps" },
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
    { href: "/contact", label: "Contact" },
  ],
} as const;

export const absoluteUrl = (path = "/") => `${site.url}${path === "/" ? "" : path}`;
