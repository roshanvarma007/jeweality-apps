import { site } from "@/lib/site";

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden="true">
      <path
        d="M6 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L7.5 3.64A1 1 0 0 0 6 4.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ContactCards() {
  const cards = [
    {
      icon: <MailIcon />,
      title: "Email us",
      body: "Questions, feedback, support or partnerships. We read every message.",
      linkLabel: site.email,
      href: `mailto:${site.email}`,
      external: false,
    },
    {
      icon: <PlayIcon />,
      title: "Google Play developer profile",
      body: "See every JEWEALITY app, ratings and the latest updates on Google Play.",
      linkLabel: "Open on Google Play ↗",
      href: site.playDeveloperUrl,
      external: true,
    },
  ];
  return (
    <ul className="grid gap-5 md:grid-cols-2">
      {cards.map((c) => (
        <li key={c.title} className="card lift reveal relative p-7">
          <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
            {c.icon}
          </span>
          <h3 className="mt-5 text-xl font-bold text-ink">{c.title}</h3>
          <p className="mt-2 text-muted">{c.body}</p>
          <a
            href={c.href}
            {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="mt-5 inline-block font-semibold break-all text-accent-dark underline-offset-4 after:absolute after:inset-0 hover:underline"
          >
            {c.linkLabel}
          </a>
        </li>
      ))}
    </ul>
  );
}
