import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/apps", label: "Apps" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  // Static export: the year is computed at build time; every deploy refreshes it.
  const year = new Date().getFullYear();
  return (
    <footer data-site-footer className="mt-24 border-t border-line bg-surface">
      <div className="container-page py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="text-lg font-extrabold tracking-[0.08em] text-ink">JEWEALITY</p>
            <p className="mt-2 text-[0.95rem] text-muted">
              Useful, innovative and easy-to-use mobile apps, published on Google Play.
            </p>
          </div>
          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-10 gap-y-2.5 sm:flex sm:flex-wrap sm:gap-x-7">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[0.95rem] text-ink-soft hover:text-accent">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:justify-between">
          <p>Copyright © {year} JEWEALITY. All rights reserved.</p>
          <p>Google Play and the Google Play logo are trademarks of Google LLC.</p>
        </div>
      </div>
    </footer>
  );
}
