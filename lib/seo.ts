import type { Metadata } from "next";
import { absoluteUrl, site } from "@/lib/site";

interface PageMetaInput {
  title?: string;
  description?: string;
  path: string;
  image?: string;
}

/** Builds per-page metadata with canonical URL, Open Graph and Twitter tags. */
export function pageMetadata({ title, description, path, image }: PageMetaInput): Metadata {
  const fullTitle = title ? `${title} | ${site.name}` : site.title;
  const desc = description ?? site.description;
  const img = image ?? "/og.png";
  return {
    title: fullTitle,
    description: desc,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      type: "website",
      url: absoluteUrl(path),
      siteName: site.name,
      title: fullTitle,
      description: desc,
      images: [{ url: img, width: 1200, height: 630, alt: site.title }],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [img],
    },
  };
}

export const organizationJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: absoluteUrl("/icon-512.png"),
  email: site.email,
  sameAs: [site.playDeveloperUrl],
});

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: absoluteUrl(it.path),
  })),
});
