# PRD – JEWEALITY Apps Official Website (v2.0, Enhanced)

Owner: Roshan · Status: Draft for build · Hosting: Netlify

## 1. Project Overview

Build a modern, fast, professional website for **JEWEALITY**, a developer and publisher of mobile applications on Google Play (productivity apps, utility tools, games, AI-powered apps and more).

The site is the official online home of the brand. It lists all published apps, hosts the legal pages Google Play requires (Privacy Policy, Terms of Service), and is designed so that adding a new app takes **one config entry and one icon file**, with no code changes elsewhere.

## 2. Goals and Non-Goals

### Goals

- Official, trustworthy web presence for the JEWEALITY brand.
- Permanent, publicly accessible legal URLs that can be pasted into Google Play Console.
- One place to browse, search and filter all apps.
- Adding a new app = editing one data file.
- Fast (Lighthouse 95+), responsive, accessible and SEO-friendly.
- Zero backend and zero database.

### Non-Goals (v1)

- User accounts, login or dashboards.
- Blog, CMS or admin panel (can be v2).
- Payments or in-browser app features.
- Server-side form processing (contact is via email link).

## 3. Target Audience

| Audience | What they need |
|---|---|
| Google Play users | Verify the developer, read privacy and terms, find other apps |
| Google Play reviewers | Working privacy and terms URLs, developer identity and contact |
| Ad and partner reviewers (e.g. AdMob) | Verifiable site, app-ads.txt, legitimate business presence |
| Press, partners, future users | Brand overview, app catalogue, contact |

## 4. Design Requirements

Premium, clean, modern. Inspiration: Google Play, Apple website, modern SaaS sites.

**Visual style**

- Light theme, white background, black and dark-grey typography.
- Subtle gradients, clean spacing, rounded cards (e.g. 16–24px radius), soft shadows.
- Smooth but restrained animations (fade or slide-in on scroll, hover lift on cards).
- Respect `prefers-reduced-motion`.

**Avoid**

- Heavy background effects, excessive animation, clutter, decorative filler.

**Design tokens (define once in Tailwind config)**

- Colors: `bg` white, `surface` very light grey, `text` near-black, `muted` mid-grey, one accent color taken from the JEWEALITY logo.
- Typography: one sans-serif family (Inter or Geist via `next/font`, self-hosted), clear heading scale, body 16–18px, line-height 1.6.
- Spacing: 8px base grid. Max content width about 1152px; legal pages about 720px for readability.
- Breakpoints: mobile (<640px), tablet (640–1024px), desktop (>1024px).

**Optional (v1.1):** dark mode via `prefers-color-scheme`. Keep the light theme as the default.

## 5. Information Architecture and Pages

| Route | Page | Notes |
|---|---|---|
| `/` | Home | Hero, About, featured apps, Contact |
| `/apps` | Apps | Full catalogue with search and filter |
| `/apps/[slug]` | App detail (recommended) | Per-app description, screenshots, Play link, per-app legal links |
| `/privacy` | Privacy Policy | Existing provided content |
| `/terms` | Terms of Service | Common terms for all apps |
| `/contact` | Contact | Email and Play developer profile (can also be a Home section) |
| `/404` | Not found | Friendly page with links back to Home and Apps |

### 5.1 Home (`/`)

**Hero**

- JEWEALITY logo.
- Heading: "Apps Made to Make Life Easier"
- Description: "We create useful tools, productivity apps, games, and innovative mobile experiences."
- Primary button: **Explore Our Apps** (scrolls to the apps section or goes to `/apps`).
- Secondary button: **Visit Google Play** (opens the developer profile in a new tab with `rel="noopener noreferrer"`).

**About JEWEALITY**

"JEWEALITY is an app development and publishing brand focused on creating useful, innovative, and easy-to-use mobile applications. Our apps include productivity tools, utilities, games, and more."

**Our Apps**

- Show featured or latest apps (e.g. up to 6) as cards, with a "View all apps" link to `/apps`.
- Each card: app icon, name, short description, category badge, Google Play button.

**Contact**

- Developer email (real, verified; shown as a `mailto:` link).
- Google Play developer profile link.

### 5.2 Apps (`/apps`)

- Responsive grid: 1 column on mobile, 2 on tablet, 3 on desktop.
- **Search** by name and description (client-side, debounced, case-insensitive).
- **Filter** by category: Productivity, Tools, Games, AI, Other. Show "All" by default.
- Search and filter combine; the filter state is reflected in the URL (e.g. `/apps?category=games`) so it can be shared.
- Empty state: "No apps found. Try a different search."
- Optional sort: newest first (default) or A–Z.

### 5.3 App Detail (`/apps/[slug]`) – recommended

Statically generated from the same config file.

- Large icon, name, tagline, category, full description.
- Screenshots (optional, lazy-loaded).
- Google Play button using the standard badge.
- Links to the privacy policy and terms (and a per-app policy link if the app has one).
- Per-app SEO metadata and `SoftwareApplication` structured data.

### 5.4 Privacy Policy (`/privacy`)

- Use the **existing Privacy Policy content provided by JEWEALITY**. Do not rewrite, invent, or add practices.
- Do not state that apps collect no data unless confirmed.
- Layout: readable single column, clear headings, **Last updated** date at the top, auto-generated **table of contents** (sticky on desktop, collapsible on mobile), anchor links on headings, "Back to top" link.
- Content source: a Markdown or MDX file (`content/privacy.md`) so legal text can be updated without touching components.
- Print-friendly styles.
- If different apps have different data practices (for example ads, analytics, accounts), the policy must cover them or link to per-app sections. Confirm this with the owner.

### 5.5 Terms of Service (`/terms`)

Common Terms covering all JEWEALITY mobile applications, stored in `content/terms.md`.

Required sections:

1. Introduction
2. Acceptance of Terms
3. Use of Applications
4. User Responsibilities
5. Intellectual Property
6. Advertising and Third-Party Services
7. App Availability
8. Disclaimer
9. Limitation of Liability
10. Changes to Terms
11. Contact Information

Rules:

- Terms apply to JEWEALITY applications generally, and state that specific apps may have additional terms.
- No unsupported legal claims. Governing law and jurisdiction clauses only if confirmed by the owner.
- Clearly display the **Last updated** date.
- Publicly accessible with no login.
- **Content must be reviewed (ideally by a legal professional) before publication.** Treat any draft text as a placeholder until approved.
- Same layout, table of contents and print styles as the Privacy Policy.

## 6. App Data Model (Config-Driven)

All app data lives in a single typed file, e.g. `data/apps.ts` (or `apps.json` validated with a schema). Adding an app means adding one object and one icon.

```ts
export type Category = "Productivity" | "Tools" | "Games" | "AI" | "Other";

export interface AppEntry {
  slug: string;              // url-safe, unique, e.g. "portfoliopro"
  name: string;
  tagline: string;           // one line, shown on cards
  description: string;       // full description for detail page
  category: Category;
  icon: string;              // /apps/<slug>/icon.png (512x512)
  screenshots?: string[];
  playStoreUrl: string;      // full Google Play URL
  packageName: string;       // e.g. com.jeweality.app
  status: "live" | "coming-soon" | "unlisted";
  featured?: boolean;        // show on Home
  releaseDate?: string;      // ISO date, used for "newest" sort
  privacyUrl?: string;       // optional per-app policy
  termsUrl?: string;         // optional per-app terms
}
```

Rules:

- Build fails (type error or schema validation) if a required field is missing, so bad data never ships.
- Only `live` apps appear publicly; `coming-soon` shows a disabled button.
- The Home page, Apps page, detail pages, sitemap and structured data all read from this one source.

## 7. Footer (every page)

- **JEWEALITY** wordmark.
- Links: Home, Apps, Privacy Policy, Terms of Service, Contact.
- "Copyright © {current year} JEWEALITY" with the year computed automatically.
- Optional line: "Google Play and the Google Play logo are trademarks of Google LLC."

## 8. Technical Requirements

**Stack**

- Next.js (App Router), TypeScript (strict mode), Tailwind CSS.
- Static generation for all pages (`output: "export"` where possible, otherwise the Netlify Next.js runtime). Prefer static export for speed and simplicity.
- No database, no backend. Small client components only for search, filter, TOC and mobile menu.

**Code structure**

```
/app            routes (page.tsx, layout.tsx, sitemap.ts, robots.ts)
/components     Header, Footer, Hero, AppCard, AppGrid, SearchFilter, Toc, LegalLayout
/content        privacy.md, terms.md
/data           apps.ts
/lib            helpers (seo, slugify, dates)
/public         logo, favicon, icons, og image, app-ads.txt
```

**Quality**

- Reusable components, no duplicated markup, ESLint and Prettier configured.
- Images via `next/image` (or pre-optimized WebP/PNG for static export) with explicit width and height to avoid layout shift.
- Self-hosted fonts, no render-blocking third-party scripts.
- Accessible: semantic HTML, skip-to-content link, visible focus states, keyboard-navigable menu and filters, alt text on images, WCAG AA color contrast.

**Performance targets (mobile, Lighthouse)**

- Performance 95+, Accessibility 100, Best Practices 100, SEO 100.
- LCP under 2.5s, CLS under 0.1, INP under 200ms.
- Initial JS as small as practical.

## 9. SEO

- Title: **JEWEALITY – Mobile Apps, Tools and Games**
- Description: "JEWEALITY creates useful mobile applications, productivity tools, utilities, games, and innovative digital experiences."
- Per-page unique title and description (e.g. "Privacy Policy | JEWEALITY").
- Open Graph and Twitter card metadata with a 1200×630 OG image.
- Favicon set (ico, 32px, apple-touch-icon 180px, 192/512 PNG) and web manifest.
- `sitemap.xml` generated from routes and the app config; `robots.txt` allowing all and pointing to the sitemap.
- Canonical URLs on every page.
- Structured data (JSON-LD): `Organization` on Home, `SoftwareApplication` on app pages, `BreadcrumbList` where relevant.
- Clean, readable, lowercase URLs.

## 10. Google Play and Ads Compatibility

These make the site useful to Play Console and ad-network reviewers.

- `/privacy` must be a public, non-PDF, non-geo-blocked, crawlable HTML page, with the developer name matching Play Console.
- Use the official **Get it on Google Play** badge, following Google's brand guidelines.
- Add `public/app-ads.txt` at the site root if any app shows AdMob or other ads. Content must come from the ad network account (do not invent lines).
- Keep the website URL in Play Console and the developer name consistent with the site.
- If any app has user accounts, confirm whether Play's account-deletion requirement applies and add a deletion-instructions page (e.g. `/delete-account`) only if so.
- Keep Privacy Policy content consistent with each app's Play **Data safety** form.

## 11. Netlify Deployment

- GitHub repository connected to Netlify; push to `main` triggers an automatic production deploy; pull requests get Deploy Previews.
- HTTPS and automatic certificates via Netlify, with HTTP redirected to HTTPS.
- Custom domain support (apex and `www`, with one canonical redirect).
- `netlify.toml` with build command, publish directory and Node version pinned.
- Direct loads of `/privacy`, `/terms`, `/apps` and `/contact` must work (no 404 on refresh). Set the trailing-slash behavior consistently, and add redirects for old or alternate URLs if needed.
- Security headers via `netlify.toml` (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options` or CSP `frame-ancestors`, `Permissions-Policy`).
- Long cache headers for static assets, and revalidation for HTML.
- Custom 404 page.

## 12. Privacy and Analytics of the Site Itself

- No analytics or cookies by default, so no cookie banner is needed.
- If analytics are added later, use a privacy-friendly tool, update the Privacy Policy first, and add consent handling if required.
- No third-party trackers or embeds on legal pages.

## 13. Content and Data Needed From Owner (Blockers)

Nothing below may be invented. Use clearly marked placeholders until provided.

- [ ] Official developer/contact email
- [ ] Google Play developer profile URL
- [ ] Logo (SVG preferred) and brand accent color
- [ ] Existing Privacy Policy text and its last-updated date
- [ ] Reviewed Terms of Service text and its last-updated date
- [ ] For each app: name, package name, tagline, description, category, 512×512 icon, Play URL, optional screenshots
- [ ] Custom domain name
- [ ] Legal entity or business name and any governing-law details (only if to be shown)
- [ ] `app-ads.txt` lines (if ads are used)

## 14. Milestones

| # | Milestone | Output |
|---|---|---|
| 1 | Setup | Repo, Next.js + TS + Tailwind, design tokens, layout, header and footer |
| 2 | Core pages | Home, Apps (search, filter), app config, AppCard |
| 3 | Legal | Privacy and Terms with TOC, last-updated, Markdown content |
| 4 | App detail and extras | `/apps/[slug]`, contact, 404, structured data |
| 5 | SEO and polish | Metadata, OG image, sitemap, robots, favicons, accessibility pass |
| 6 | Deploy | Netlify, custom domain, HTTPS, headers, final QA |

## 15. Acceptance Criteria

- All routes render correctly on mobile, tablet and desktop, with no horizontal scroll.
- `/privacy` and `/terms` open directly via URL, are public, and show the last-updated date and a working table of contents.
- Adding a new app requires only one entry in `data/apps.ts` plus an icon, and the app then appears on Home (if featured), `/apps`, its detail page and the sitemap.
- Search and category filter work together and the filter persists in the URL.
- Footer appears on every page, with the year updating automatically.
- Lighthouse targets in section 8 are met.
- `sitemap.xml`, `robots.txt`, favicon, Open Graph tags and canonical tags are present.
- No placeholder contact details, lorem ipsum, or invented legal claims remain in production.
- Legal content has been reviewed and approved by the owner before launch.
- Automatic GitHub-to-Netlify deploys and HTTPS are confirmed working.

## 16. Risks and Open Questions

| Risk or question | Mitigation |
|---|---|
| Privacy Policy does not match actual app data practices | Owner confirms against each app's Data safety form before launch |
| Terms text is not legally reviewed | Block publication until reviewed |
| Different apps need different policies | Support per-app `privacyUrl` and `termsUrl` |
| Brand confusion with other products named Jeweality | Keep a clear tagline and consistent developer name on the site and in Play Console |
| Static export limits | Keep features client-side or use Netlify functions only if truly needed |

**Open questions**

1. Should the site use `/apps/[slug]` detail pages in v1, or only cards linking to Google Play?
2. Is a dedicated `/contact` page wanted, or only a Home section?
3. Do any apps use ads or accounts (affects `app-ads.txt` and account-deletion page)?
4. Is dark mode wanted in v1?
5. Which custom domain will be used?
