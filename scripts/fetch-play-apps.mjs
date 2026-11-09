/**
 * Fetches every app published by JEWEALITY on Google Play and writes:
 *   - data/play-apps.json            (app data used by the site)
 *   - public/apps/<slug>/icon.webp   (downloaded + resized icons, so the site loads no third-party images)
 *
 * Runs automatically before every build (`prebuild`), so a new Play app appears on the
 * website on the next deploy. If Google Play can't be reached, the last saved
 * data/play-apps.json is kept and the build continues.
 *
 * Usage: npm run fetch-apps          (SKIP_PLAY_FETCH=1 to skip)
 */
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const DEVELOPER_ID = process.env.PLAY_DEVELOPER_ID ?? "JEWEALITY";
const DEVELOPER_NAME = process.env.PLAY_DEVELOPER_NAME ?? "JEWEALITY";
const root = path.resolve(import.meta.dirname, "..");
const outFile = path.join(root, "data", "play-apps.json");
const iconsDir = path.join(root, "public", "apps");
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";

const log = (...a) => console.log("[fetch-play-apps]", ...a);

async function get(url, as = "text") {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, "Accept-Language": "en-US,en;q=0.9" },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`${res.status} for ${url}`);
  return as === "buffer" ? Buffer.from(await res.arrayBuffer()) : res.text();
}

const decode = (s) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");

const slugify = (s) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-");

/** "Glowpath: Arrow Puzzle 3D Game" -> "glowpath"; "SamRemote - Samsung TV Remote" -> "samremote" */
const shortSlug = (name) => slugify(name.split(/\s[:\-–|]\s|:\s/)[0] ?? name);

function mapCategory(playCategory = "", name = "") {
  if (/\bAI\b/.test(name)) return "AI";
  if (playCategory.startsWith("GAME")) return "Games";
  if (["PRODUCTIVITY", "BUSINESS", "EDUCATION"].includes(playCategory)) return "Productivity";
  if (
    [
      "TOOLS",
      "PERSONALIZATION",
      "PHOTOGRAPHY",
      "VIDEO_PLAYERS",
      "LIBRARIES_AND_DEMO",
      "COMMUNICATION",
      "FINANCE",
      "MAPS_AND_NAVIGATION",
      "AUTO_AND_VEHICLES",
    ].includes(playCategory)
  )
    return "Tools";
  return "Other";
}

function parseApp(html, packageName) {
  const ld = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .map((m) => {
      try {
        return JSON.parse(m[1]);
      } catch {
        return null;
      }
    })
    .find((j) => j?.["@type"] === "SoftwareApplication");
  if (!ld) throw new Error(`no structured data for ${packageName}`);

  const descHtml = html.match(/data-g-id="description"[^>]*>([\s\S]*?)<\/div>/)?.[1] ?? "";
  const description = decode(
    descHtml
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/\n{3,}/g, "\n\n"),
  ).trim();

  const updated = html.match(/Updated on<\/div><div[^>]*>([^<]+)</)?.[1];
  const updatedDate =
    updated && !Number.isNaN(Date.parse(updated))
      ? new Date(`${updated} UTC`).toISOString().slice(0, 10)
      : undefined;

  return {
    developer: ld.author?.name,
    packageName,
    name: decode(ld.name ?? "").trim(),
    tagline: decode(ld.description ?? "").trim(),
    description: description || decode(ld.description ?? "").trim(),
    playCategory: ld.applicationCategory ?? "",
    iconUrl: ld.image,
    updatedDate,
  };
}

/** All long, token-like strings inside a parsed JSON value (Play's "load more" page tokens). */
function findTokens(value, out = []) {
  if (typeof value === "string") {
    if (/^[A-Za-z0-9_=-]{40,}$/.test(value)) out.push(value);
  } else if (value && typeof value === "object") {
    for (const v of Object.values(value)) findTokens(v, out);
  }
  return out;
}

const PKG_IN_TEXT =
  /"(com\.[A-Za-z0-9_]+(?:\.[A-Za-z0-9_]+)+|[a-z][A-Za-z0-9_]*\.[A-Za-z0-9_.]+)"/g;

/** One "load more" request to Google Play; returns the package ids found and any next-page tokens. */
async function fetchMore(token) {
  const fields = [
    96, 27, 4, 8, 57, 30, 110, 79, 11, 16, 49, 1, 3, 9, 12, 104, 55, 56, 51, 10, 34, 77,
  ];
  const inner = JSON.stringify([[null, [[10, [10, 50]], true, null, fields], null, token]]);
  const body = `f.req=${encodeURIComponent(JSON.stringify([[["qnKhOb", inner, null, "generic"]]]))}`;
  const res = await fetch(
    "https://play.google.com/_/PlayStoreUi/data/batchexecute?rpcids=qnKhOb&hl=en&gl=US&authuser&soc-app=121&soc-platform=1&soc-device=1",
    {
      method: "POST",
      headers: {
        "User-Agent": UA,
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body,
      signal: AbortSignal.timeout(20000),
    },
  );
  if (!res.ok) throw new Error(`${res.status} from Play "load more"`);
  const line = (await res.text()).split("\n").find((l) => l.includes('"wrb.fr"'));
  const raw = line ? JSON.parse(line)[0]?.[2] : null;
  if (!raw) return { ids: [], tokens: [] };
  const payload = JSON.parse(raw);
  const ids = [...new Set([...raw.matchAll(PKG_IN_TEXT)].map((m) => m[1]))].filter((s) =>
    /^[a-zA-Z]\w*(\.[a-zA-Z]\w*)+$/.test(s),
  );
  return { ids, tokens: findTokens(payload).filter((t) => t !== token) };
}

/**
 * The developer page only renders the first ~20 apps; Google Play loads the rest while
 * scrolling. Follow those "load more" pages until no new apps appear. Every id found is
 * later verified against its own listing (developer must be JEWEALITY), so stray ids are harmless.
 */
async function loadMoreIds(devHtml, firstPage) {
  const all = new Set(firstPage);
  const ds = devHtml.match(
    /AF_initDataCallback\(\{key: 'ds:3'[\s\S]*?data:([\s\S]*?), sideChannel/,
  );
  if (!ds) return [...all];
  let queue = findTokens(JSON.parse(ds[1]));
  const tried = new Set();
  for (let page = 0; queue.length && page < 15; page++) {
    const token = queue.shift();
    if (tried.has(token)) continue;
    tried.add(token);
    try {
      const { ids, tokens } = await fetchMore(token);
      const before = all.size;
      ids.forEach((id) => all.add(id));
      if (all.size > before) queue = [...tokens, ...queue]; // follow the page that produced new apps
    } catch (e) {
      log(`warning: ${e.message}`);
    }
  }
  return [...all];
}

async function mapLimit(items, limit, fn) {
  const results = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        results[idx] = await fn(items[idx]).catch((e) => ({ error: e }));
      }
    }),
  );
  return results;
}

async function main() {
  if (process.env.SKIP_PLAY_FETCH) return log("skipped (SKIP_PLAY_FETCH set)");

  const devUrl = `https://play.google.com/store/apps/developer?id=${encodeURIComponent(DEVELOPER_ID)}&hl=en&gl=US`;
  const devHtml = await get(devUrl);
  const firstPage = [
    ...new Set([...devHtml.matchAll(/\/store\/apps\/details\?id=([\w.]+)/g)].map((m) => m[1])),
  ];
  if (!firstPage.length) throw new Error("no apps found on the developer page");
  const ids = await loadMoreIds(devHtml, firstPage);
  log(`found ${ids.length} app ids on the developer page (${firstPage.length} on first load)`);

  const parsed = await mapLimit(ids, 4, async (id) => {
    try {
      return parseApp(
        await get(`https://play.google.com/store/apps/details?id=${id}&hl=en&gl=US`),
        id,
      );
    } catch (e) {
      // 404 = not an app listing (a stray id from the page data), not a fetch failure.
      if (/^404 /.test(e.message)) return { notFound: true };
      throw e;
    }
  });

  const failed = parsed.filter((p) => p.error);
  failed.forEach((f) => log("warning:", f.error.message));
  // Only keep apps whose Play listing names JEWEALITY as the developer
  // (guards against "similar apps" links on the developer page).
  const ours = parsed.filter((p) => !p.error && p.developer === DEVELOPER_NAME);
  if (!ours.length) throw new Error("no JEWEALITY apps could be parsed");
  if (failed.length > ids.length / 2) throw new Error("too many apps failed to load");

  const used = new Set();
  const apps = [];
  for (const p of ours) {
    let slug = shortSlug(p.name) || p.packageName.split(".").pop();
    if (used.has(slug)) slug = slugify(p.packageName.split(".").pop());
    used.add(slug);

    let icon = `/apps/${slug}/icon.webp`;
    try {
      const buf = await get(`${p.iconUrl}=s512`, "buffer");
      await mkdir(path.join(iconsDir, slug), { recursive: true });
      await sharp(buf)
        .resize(256, 256)
        .webp({ quality: 88 })
        .toFile(path.join(iconsDir, slug, "icon.webp"));
    } catch (e) {
      log(`warning: icon for ${p.packageName} not downloaded (${e.message})`);
      icon = "/icon-192.png";
    }

    apps.push({
      slug,
      packageName: p.packageName,
      name: p.name,
      tagline: p.tagline,
      description: p.description,
      playCategory: p.playCategory,
      category: mapCategory(p.playCategory, p.name),
      icon,
      playStoreUrl: `https://play.google.com/store/apps/details?id=${p.packageName}`,
      ...(p.updatedDate ? { updatedDate: p.updatedDate } : {}),
    });
  }

  // Remove icon folders of apps that are no longer on Google Play.
  const previous =
    JSON.parse(await readFile(outFile, "utf8").catch(() => '{"apps":[]}')).apps ?? [];
  for (const old of previous) {
    if (!apps.some((a) => a.slug === old.slug)) {
      await rm(path.join(iconsDir, old.slug), { recursive: true, force: true });
    }
  }

  await writeFile(
    outFile,
    `${JSON.stringify({ source: devUrl.replace(/&hl=en&gl=US$/, ""), fetchedAt: new Date().toISOString(), apps }, null, 2)}\n`,
  );
  log(`saved ${apps.length} apps to data/play-apps.json`);
}

main().catch(async (e) => {
  const cached = await readFile(outFile, "utf8").catch(() => null);
  log(`could not refresh from Google Play: ${e.message}`);
  log(
    cached
      ? "keeping the last saved data/play-apps.json"
      : "no cached data; the site will show manual apps only",
  );
  if (!cached) await writeFile(outFile, `${JSON.stringify({ apps: [] }, null, 2)}\n`);
});
