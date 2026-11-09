/**
 * App data for the website.
 *
 * 1. Apps published on Google Play are fetched AUTOMATICALLY before every build from
 *    https://play.google.com/store/apps/developer?id=JEWEALITY
 *    (scripts/fetch-play-apps.mjs -> data/play-apps.json + public/apps/<slug>/icon.webp).
 *    A new Play app therefore appears on Home, /apps, /apps/<slug>, the sitemap and the
 *    Terms of Service list on the next deploy, with no code changes.
 *
 * 2. `overrides` (below) lets you fine-tune a Play app by its package name, e.g. mark it
 *    `featured`, change its category or tagline, hide it (`status: "unlisted"`),
 *    or give it its own privacy/terms URL.
 *
 * 3. `manualApps` is for apps that are NOT on Google Play yet (e.g. "coming-soon").
 *    Put their icon at /public/apps/<slug>/icon.png.
 *
 * The build fails if any entry is invalid (see lib/apps.ts), so bad data never ships.
 */

export const categories = ["Productivity", "Tools", "Games", "AI", "Other"] as const;
export type Category = (typeof categories)[number];

export type AppStatus = "live" | "coming-soon" | "unlisted";

export interface AppEntry {
  /** url-safe, unique, e.g. "glowpath" */
  slug: string;
  name: string;
  /** one line, shown on cards */
  tagline: string;
  /** full description for the detail page (blank line = new paragraph) */
  description: string;
  category: Category;
  /** e.g. /apps/<slug>/icon.webp */
  icon: string;
  screenshots?: string[];
  /** full Google Play URL */
  playStoreUrl: string;
  /** e.g. com.jeweality.app */
  packageName: string;
  /** live = public, coming-soon = public with disabled button, unlisted = hidden */
  status: AppStatus;
  /** show on Home (if none are featured, Home shows the most recently updated apps) */
  featured?: boolean;
  /** ISO date of first release (optional) */
  releaseDate?: string;
  /** ISO date of the latest Google Play update (filled automatically) */
  updatedDate?: string;
  /** optional per-app policy */
  privacyUrl?: string;
  /** optional per-app terms */
  termsUrl?: string;
}

/** Tweaks for apps fetched from Google Play, keyed by package name. */
export const overrides: Record<string, Partial<Omit<AppEntry, "packageName">>> = {
  // Example:
  // "com.jeweality.glowpath": { featured: true },
  // "com.tambolanumbersbymt": { category: "Games" },
};

/** Apps that are not (yet) on Google Play. */
export const manualApps: AppEntry[] = [
  // Example:
  // {
  //   slug: "my-next-app",
  //   name: "My Next App",
  //   tagline: "One line about the app.",
  //   description: "Full description.",
  //   category: "Tools",
  //   icon: "/apps/my-next-app/icon.png",
  //   playStoreUrl: "https://play.google.com/store/apps/details?id=com.jeweality.mynextapp",
  //   packageName: "com.jeweality.mynextapp",
  //   status: "coming-soon",
  // },
];
