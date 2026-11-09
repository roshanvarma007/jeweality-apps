import type { MetadataRoute } from "next";
import { appDate, publicApps } from "@/lib/apps";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/apps"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: absoluteUrl("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: absoluteUrl("/contact"), lastModified: now, changeFrequency: "yearly", priority: 0.5 },
  ];
  const appPages: MetadataRoute.Sitemap = publicApps.map((a) => ({
    url: absoluteUrl(`/apps/${a.slug}`),
    lastModified: appDate(a) ? new Date(appDate(a)) : now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));
  return [...pages, ...appPages];
}
