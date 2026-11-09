# JEWEALITY Apps – Official Website

Fully static website (Next.js App Router + TypeScript + Tailwind CSS). **No login, no database, no backend.**
`npm run build` writes plain HTML/CSS/JS into `out/`, which Netlify serves as-is.

## Run it locally

```bash
npm install
npm run dev        # dev server with hot reload → http://localhost:3000
npm run build      # static export into /out
npm start          # serve /out locally (behaves like Netlify)
npm run lint
npm run format
```

## Apps are fetched automatically from Google Play

Before every build, [`scripts/fetch-play-apps.mjs`](scripts/fetch-play-apps.mjs) reads
<https://play.google.com/store/apps/developer?id=JEWEALITY>, opens each app's listing, keeps only apps whose
developer is **JEWEALITY**, and saves:

- `data/play-apps.json`: name, short + full description, category, package, Play URL, last-updated date
- `public/apps/<slug>/icon.webp`: the app icon, downloaded so the site loads no third-party images

A new Play app therefore appears on Home, `/apps`, `/apps/<slug>`, `sitemap.xml` **and the list of apps
covered on `/terms`** with no code changes. If Google Play can't be reached, the last saved
`data/play-apps.json` is used and the build still succeeds. Run it by hand with `npm run fetch-apps`
(or skip it with `SKIP_PLAY_FETCH=1`).

**Daily refresh:** [`.github/workflows/daily-rebuild.yml`](.github/workflows/daily-rebuild.yml) triggers a
Netlify rebuild every day. One-time setup: create a Netlify build hook (Site configuration → Build & deploy →
Build hooks) and save its URL as the GitHub secret `NETLIFY_BUILD_HOOK`.

**Fine-tuning:** in [`data/apps.ts`](data/apps.ts), `overrides` (keyed by package name) lets you mark an app
`featured`, change its category/tagline, give it its own `privacyUrl`/`termsUrl`, or hide it
(`status: "unlisted"`). `manualApps` is for apps not on Play yet (e.g. `status: "coming-soon"`).
The build fails if any entry is invalid (bad slug, duplicate slug, non-Play URL, …).

## One Terms of Service URL for every app

Use `https://<your-domain>/terms` in **Play Console → App content → App-level trader status and Terms of
Service** for every app. The page lists each app it covers (name + package name), generated from the Play
data above, so the same URL "applies specifically" to each app.

## Edit legal pages

- Privacy Policy: [`content/privacy.md`](content/privacy.md)
- Terms of Service: [`content/terms.md`](content/terms.md)

Front-matter holds `title`, `description`, `lastUpdated` and `draft`. While `draft: true`, the page shows a "Draft – pending review" notice. The table of contents is built from `##` / `###` headings.

## Before launch – replace placeholders (PRD §13)

| What | Where |
|---|---|
| Final domain | [`lib/site.ts`](lib/site.ts) / `NEXT_PUBLIC_SITE_URL` |
| (Done) Apps now come from Google Play automatically | `data/play-apps.json` |
| Your existing Privacy Policy text, then `draft: false` | `content/privacy.md` |
| Reviewed Terms of Service, then `draft: false` | `content/terms.md` |
| `app-ads.txt` (only if apps show ads; lines come from AdMob) | `public/app-ads.txt` |
| Higher-res / SVG logo, then `npm run icons` | `public/logo.png` |

## Deploy on Netlify

1. Push this folder to a GitHub repo, then in Netlify choose **Add new site → Import from Git**.
2. Build settings come from [`netlify.toml`](netlify.toml) (`npm run build`, publish `out`, Node 22).
3. Set env var `NEXT_PUBLIC_SITE_URL` to your final domain (e.g. `https://jeweality.com`).
4. Add the custom domain in Netlify (HTTPS is automatic), then uncomment the www → apex redirect in `netlify.toml`.

Security headers, long caching for hashed assets, alternate legal URLs (`/privacy-policy`, `/tos`) and the custom 404 are already configured.

## Structure

```
app/          routes: page, apps, apps/[slug], privacy, terms, contact, not-found, sitemap, robots, manifest
components/   Header, Footer, AppCard/AppGrid, SearchFilter, PlayBadge, Toc, LegalLayout, ContactCards…
content/      privacy.md, terms.md
data/         apps.ts  ← the single source of truth for apps
lib/          site config, app helpers + validation, markdown/TOC, SEO helpers
public/       logo, favicons, og.png, app icons
scripts/      generate-assets.mjs (favicons/OG image), serve.mjs (local static server)
```
# jeweality-apps
