import Image from "next/image";
import Link from "next/link";
import { PlayBadge } from "@/components/PlayBadge";
import type { AppEntry } from "@/lib/apps";

export function AppCard({
  app,
  headingLevel = "h3",
}: {
  app: AppEntry;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  const comingSoon = app.status === "coming-soon";
  return (
    <article className="card lift reveal relative flex h-full flex-col p-6">
      <div className="flex items-start gap-4">
        <Image
          src={app.icon}
          alt={`${app.name} app icon`}
          width={64}
          height={64}
          className="size-16 shrink-0 rounded-2xl shadow-sm ring-1 ring-black/5"
        />
        <div className="min-w-0 flex-1">
          <Heading className="text-lg font-bold text-ink">
            {/* Stretched link: the whole card opens the detail page. */}
            <Link
              href={`/apps/${app.slug}`}
              className="after:absolute after:inset-0 after:rounded-[var(--radius-card)] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-accent"
            >
              {app.name}
            </Link>
          </Heading>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <span className="chip">{app.category}</span>
            {comingSoon && <span className="chip !bg-amber-50 !text-amber-800">Coming soon</span>}
          </div>
        </div>
      </div>
      <p className="mt-4 flex-1 text-[0.97rem] text-muted">{app.tagline}</p>
      <div className="mt-5">
        <PlayBadge href={app.playStoreUrl} appName={app.name} comingSoon={comingSoon} size="sm" />
      </div>
    </article>
  );
}

export function AppGrid({ apps, headingLevel }: { apps: AppEntry[]; headingLevel?: "h2" | "h3" }) {
  return (
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {apps.map((app) => (
        <li key={app.slug}>
          <AppCard app={app} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}
