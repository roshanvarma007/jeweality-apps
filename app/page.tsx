import Image from "next/image";
import Link from "next/link";
import { AppGrid } from "@/components/AppCard";
import { ContactCards } from "@/components/ContactCards";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeading } from "@/components/Section";
import { featuredApps, publicApps } from "@/lib/apps";
import { organizationJsonLd, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({ path: "/" });

const pillars = [
  {
    title: "Productivity",
    body: "Focused tools that help you plan, organise and get more done.",
    color: "from-[#2f6bff] to-[#5b3df5]",
    icon: "M5 12.5 9.5 17 19 7",
  },
  {
    title: "Utilities",
    body: "Everyday helpers that solve one job quickly and reliably.",
    color: "from-[#0ea5e9] to-[#10b981]",
    icon: "M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z",
  },
  {
    title: "Games",
    body: "Light, fun games you can pick up any time.",
    color: "from-[#ec4899] to-[#8b5cf6]",
    icon: "M7 9v4M5 11h4M15.5 10.5h.01M17.5 12.5h.01M7 6h10a4 4 0 0 1 4 4v3a4 4 0 0 1-7 2.6h-4A4 4 0 0 1 3 13v-3a4 4 0 0 1 4-4z",
  },
  {
    title: "AI-powered",
    body: "Smart features that make tasks simpler and faster.",
    color: "from-[#7b3dff] to-[#ff3d9a]",
    icon: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z",
  },
];

export default function HomePage() {
  const featured = featuredApps(6);
  const heroIcons = publicApps.slice(0, 6);

  return (
    <>
      <JsonLd data={organizationJsonLd()} />

      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden" aria-labelledby="hero-title">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_85%_0%,#ece6ff_0%,transparent_70%),radial-gradient(45%_45%_at_0%_100%,#ffe6f2_0%,transparent_70%),radial-gradient(40%_40%_at_40%_30%,#e7efff_0%,transparent_70%)]"
        />
        <div className="container-page grid items-center gap-14 pt-16 pb-20 sm:pt-24 lg:grid-cols-[1.15fr_1fr] lg:pb-28">
          <div className="fade-in">
            <Image
              src="/logo.png"
              alt="JEWEALITY logo"
              width={72}
              height={72}
              priority
              className="rounded-[18px] shadow-lg ring-1 ring-black/5"
            />
            <h1
              id="hero-title"
              className="mt-8 text-[2.6rem] leading-[1.05] font-extrabold text-ink sm:text-6xl lg:text-[4.1rem]"
            >
              Apps Made to <span className="text-gradient">Make Life Easier</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted sm:text-xl">
              We create useful tools, productivity apps, games, and innovative mobile experiences.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/apps" className="btn btn-primary">
                Explore Our Apps
                <span aria-hidden="true">→</span>
              </Link>
              <a
                href={site.playDeveloperUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                Visit Google Play
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          {/* Decorative showcase of app icons */}
          <div
            className="fade-in-delay relative mx-auto w-full max-w-md lg:max-w-none"
            aria-hidden="true"
          >
            <div className="absolute -inset-6 -z-10 rounded-[40px] bg-gradient-to-br from-[#2f6bff]/10 via-[#7b3dff]/10 to-[#ff3d9a]/10 blur-2xl" />
            <div className="card grid grid-cols-3 gap-4 rounded-[32px] p-6 sm:gap-5 sm:p-8">
              {heroIcons.map((app, i) => (
                <div
                  key={app.slug}
                  className={`flex flex-col items-center gap-2 ${i % 2 === 1 ? "translate-y-4" : ""}`}
                >
                  <Image
                    src={app.icon}
                    alt=""
                    width={96}
                    height={96}
                    className="aspect-square w-full max-w-24 rounded-[22%] shadow-md ring-1 ring-black/5"
                  />
                  <span className="line-clamp-1 text-center text-xs font-medium text-muted">
                    {app.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- About ---------- */}
      <section id="about" className="py-20 sm:py-24" aria-labelledby="about-title">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div className="reveal">
            <SectionHeading id="about-title" eyebrow="About" title="About JEWEALITY" />
            <p className="mt-5 text-lg text-muted">
              JEWEALITY is an app development and publishing brand focused on creating useful,
              innovative, and easy-to-use mobile applications. Our apps include productivity tools,
              utilities, games, and more.
            </p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {pillars.map((p) => (
              <li key={p.title} className="card reveal p-6">
                <span
                  className={`inline-flex size-11 items-center justify-center rounded-xl bg-gradient-to-br text-white ${p.color}`}
                >
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
                    <path
                      d={p.icon}
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <h3 className="mt-4 text-lg font-bold text-ink">{p.title}</h3>
                <p className="mt-1.5 text-[0.97rem] text-muted">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Our Apps ---------- */}
      <section id="apps" className="bg-surface py-20 sm:py-24" aria-labelledby="apps-title">
        <div className="container-page">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              id="apps-title"
              eyebrow="Our apps"
              title="Made by JEWEALITY"
              description="A selection of our latest apps, available on Google Play."
            />
            <Link href="/apps" className="btn btn-secondary shrink-0 self-start sm:self-auto">
              View all apps <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="mt-12">
            <AppGrid apps={featured} />
          </div>
        </div>
      </section>

      {/* ---------- Contact ---------- */}
      <section id="contact" className="py-20 sm:py-24" aria-labelledby="contact-title">
        <div className="container-page">
          <SectionHeading
            id="contact-title"
            eyebrow="Contact"
            title="Get in touch"
            description="Have a question about one of our apps? Reach us by email or find us on Google Play."
          />
          <div className="mt-12">
            <ContactCards />
          </div>
        </div>
      </section>
    </>
  );
}
