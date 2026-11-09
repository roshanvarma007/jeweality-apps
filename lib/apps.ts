import { categories, manualApps, overrides, type AppEntry, type Category } from "@/data/apps";
import playData from "@/data/play-apps.json";

interface PlayApp {
  slug: string;
  packageName: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  icon: string;
  playStoreUrl: string;
  updatedDate?: string;
}

/** Apps fetched from Google Play (scripts/fetch-play-apps.mjs), with overrides applied. */
const playApps: AppEntry[] = (playData.apps as PlayApp[]).map((p) => ({
  slug: p.slug,
  packageName: p.packageName,
  name: p.name,
  tagline: p.tagline,
  description: p.description,
  category: (categories as readonly string[]).includes(p.category)
    ? (p.category as Category)
    : "Other",
  icon: p.icon,
  playStoreUrl: p.playStoreUrl,
  updatedDate: p.updatedDate,
  status: "live",
  ...overrides[p.packageName],
}));

const rawApps: AppEntry[] = [
  ...playApps,
  // A manual entry for a package that is already on Play is ignored (Play data wins).
  ...manualApps.filter((m) => !playApps.some((p) => p.packageName === m.packageName)),
];

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PKG_RE = /^[a-zA-Z]\w*(\.[a-zA-Z]\w*)+$/;

/** Validates the config at build time. Any problem throws and fails `next build`. */
function validate(list: AppEntry[]): AppEntry[] {
  const errors: string[] = [];
  const seen = new Set<string>();
  for (const [i, app] of list.entries()) {
    const at = `apps[${i}] (${app.slug || "no slug"})`;
    if (!SLUG_RE.test(app.slug)) errors.push(`${at}: slug must be lowercase and url-safe`);
    if (seen.has(app.slug)) errors.push(`${at}: duplicate slug`);
    seen.add(app.slug);
    for (const key of ["name", "tagline", "description", "icon", "playStoreUrl"] as const) {
      if (!app[key]?.trim()) errors.push(`${at}: "${key}" is required`);
    }
    if (!categories.includes(app.category)) errors.push(`${at}: unknown category`);
    if (!PKG_RE.test(app.packageName)) errors.push(`${at}: invalid packageName`);
    if (!app.playStoreUrl.startsWith("https://play.google.com/"))
      errors.push(`${at}: playStoreUrl must be a https://play.google.com/ link`);
    if (!app.icon.startsWith("/")) errors.push(`${at}: icon must be a path under /public`);
    for (const key of ["releaseDate", "updatedDate"] as const) {
      const v = app[key];
      if (v && Number.isNaN(Date.parse(v))) errors.push(`${at}: ${key} must be an ISO date`);
    }
  }
  if (errors.length) throw new Error(`Invalid app data:\n- ${errors.join("\n- ")}`);
  return list;
}

const all = validate(rawApps);

/** Most recent activity for an app: latest Play update, else release date. */
export const appDate = (a: AppEntry) => a.updatedDate ?? a.releaseDate ?? "";

/** Live apps first, then coming-soon; most recently updated first within each group. */
const byNewest = (a: AppEntry, b: AppEntry) =>
  Number(a.status === "coming-soon") - Number(b.status === "coming-soon") ||
  appDate(b).localeCompare(appDate(a)) ||
  a.name.localeCompare(b.name);

/** Every app shown publicly on Google Play (used for the Terms of Service list). */
export const liveApps = () => publicApps.filter((a) => a.status === "live");

/** Apps visible on the public site (unlisted ones are hidden), live first, newest first. */
export const publicApps: AppEntry[] = all.filter((a) => a.status !== "unlisted").sort(byNewest);

/** Featured apps for Home; falls back to the newest apps if none are marked featured. */
export const featuredApps = (limit = 6) => {
  const featured = publicApps.filter((a) => a.featured);
  return (featured.length ? featured : publicApps).slice(0, limit);
};

export const getApp = (slug: string) => publicApps.find((a) => a.slug === slug);

export const categorySlug = (c: Category) => c.toLowerCase();

export { categories };
export type { AppEntry, Category };
