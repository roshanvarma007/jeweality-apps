import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppGrid } from "@/components/AppCard";
import { JsonLd } from "@/components/JsonLd";
import { PlayBadge } from "@/components/PlayBadge";
import { categorySlug, getApp, publicApps } from "@/lib/apps";
import { formatDate } from "@/lib/markdown";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { absoluteUrl, site } from "@/lib/site";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return publicApps.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const app = getApp((await params).slug);
  if (!app) return {};
  return pageMetadata({
    title: `${app.name} – ${app.category} app`,
    description: app.tagline,
    path: `/apps/${app.slug}`,
  });
}

export default async function AppDetailPage({ params }: { params: Promise<Params> }) {
  const app = getApp((await params).slug);
  if (!app) notFound();

  const comingSoon = app.status === "coming-soon";
  const paragraphs = app.description.split(/\n\s*\n/).filter(Boolean);
  const related = publicApps
    .filter((a) => a.slug !== app.slug && a.category === app.category)
    .slice(0, 3);
  const more = related.length ? related : publicApps.filter((a) => a.slug !== app.slug).slice(0, 3);

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: app.name,
    description: app.tagline,
    applicationCategory: app.category === "Games" ? "GameApplication" : "MobileApplication",
    operatingSystem: "Android",
    url: absoluteUrl(`/apps/${app.slug}`),
    image: absoluteUrl(app.icon),
    ...(comingSoon ? {} : { installUrl: app.playStoreUrl, downloadUrl: app.playStoreUrl }),
    ...(app.releaseDate ? { datePublished: app.releaseDate } : {}),
    ...(app.updatedDate ? { dateModified: app.updatedDate } : {}),
    publisher: { "@type": "Organization", name: site.name, url: site.url },
  };

  return (
    <div className="container-page pt-10 sm:pt-14">
      <JsonLd
        data={[
          softwareJsonLd,
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Apps", path: "/apps" },
            { name: app.name, path: `/apps/${app.slug}` },
          ]),
        ]}
      />

      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-ink">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/apps" className="hover:text-ink">
              Apps
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-ink">
            {app.name}
          </li>
        </ol>
      </nav>

      <section className="mt-8 grid gap-10 lg:grid-cols-[1fr_20rem] lg:gap-14">
        <div>
          <div className="fade-in flex flex-col gap-6 sm:flex-row sm:items-center">
            <Image
              src={app.icon}
              alt={`${app.name} app icon`}
              width={128}
              height={128}
              priority
              className="size-28 rounded-[28px] shadow-lg ring-1 ring-black/5 sm:size-32"
            />
            <div>
              <h1 className="text-4xl font-extrabold text-ink sm:text-5xl">{app.name}</h1>
              <p className="mt-3 text-lg text-muted sm:text-xl">{app.tagline}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/apps?category=${categorySlug(app.category)}`}
                  className="chip hover:bg-[#e3dcff]"
                >
                  {app.category}
                </Link>
                {comingSoon && (
                  <span className="chip !bg-amber-50 !text-amber-800">Coming soon</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <PlayBadge href={app.playStoreUrl} appName={app.name} comingSoon={comingSoon} />
          </div>

          <h2 className="mt-14 text-2xl font-bold text-ink">About this app</h2>
          <div className="mt-4 space-y-4 text-lg leading-relaxed text-ink-soft">
            {paragraphs.map((p, i) => (
              <p key={i} className="whitespace-pre-line">
                {p}
              </p>
            ))}
          </div>

          {app.screenshots && app.screenshots.length > 0 && (
            <>
              <h2 className="mt-14 text-2xl font-bold text-ink">Screenshots</h2>
              <ul className="-mx-1 mt-5 flex snap-x gap-4 overflow-x-auto px-1 pb-3">
                {app.screenshots.map((src, i) => (
                  <li key={src} className="shrink-0 snap-start">
                    <Image
                      src={src}
                      alt={`${app.name} screenshot ${i + 1}`}
                      width={270}
                      height={585}
                      loading="lazy"
                      className="h-[480px] w-auto rounded-2xl border border-line"
                    />
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <aside className="lg:pt-2">
          <div className="card p-6">
            <h2 className="text-base font-bold text-ink">App information</h2>
            <dl className="mt-4 space-y-3 text-[0.95rem]">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Developer</dt>
                <dd className="font-medium text-ink">{site.name}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Category</dt>
                <dd className="font-medium text-ink">{app.category}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Platform</dt>
                <dd className="font-medium text-ink">Android</dd>
              </div>
              {app.updatedDate && (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Updated</dt>
                  <dd className="font-medium text-ink">
                    <time dateTime={app.updatedDate}>{formatDate(app.updatedDate)}</time>
                  </dd>
                </div>
              )}
              <div className="flex flex-col gap-1">
                <dt className="text-muted">Package</dt>
                <dd className="font-mono text-sm break-all text-ink">{app.packageName}</dd>
              </div>
            </dl>
            <hr className="my-5 border-line" />
            <h2 className="text-base font-bold text-ink">Legal</h2>
            <ul className="mt-3 space-y-2 text-[0.95rem]">
              <li>
                <Link
                  href={app.privacyUrl ?? "/privacy"}
                  className="font-medium text-accent-dark hover:underline"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href={app.termsUrl ?? "/terms"}
                  className="font-medium text-accent-dark hover:underline"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="font-medium text-accent-dark hover:underline">
                  Contact the developer
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </section>

      {more.length > 0 && (
        <section className="mt-24" aria-labelledby="more-title">
          <div className="flex items-end justify-between gap-4">
            <h2 id="more-title" className="text-2xl font-bold text-ink sm:text-3xl">
              More from JEWEALITY
            </h2>
            <Link href="/apps" className="shrink-0 font-semibold text-accent-dark hover:underline">
              View all →
            </Link>
          </div>
          <div className="mt-8">
            <AppGrid apps={more} />
          </div>
        </section>
      )}
    </div>
  );
}
