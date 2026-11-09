import { readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { Marked } from "marked";
import { liveApps } from "@/lib/apps";
import { site } from "@/lib/site";

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
  /** Section number, when the document uses numbered sections. */
  number?: number;
}

export interface LegalDoc {
  title: string;
  /** Optional line shown under the page title. */
  subtitle?: string;
  description: string;
  lastUpdated: string;
  /** true = show a "draft pending review" banner (PRD: legal text must be approved before launch) */
  draft: boolean;
  html: string;
  toc: TocItem[];
}

/** Turns rendered inline HTML back into plain text (tags stripped, common entities decoded). */
const toPlainText = (html: string) =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCharCode(Number(n)))
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

export const slugify = (s: string) =>
  toPlainText(s)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Every live JEWEALITY app (fetched from Google Play at build time), rendered for the
 * legal pages so one Terms URL names each app it applies to.
 */
function appsListHtml() {
  const items = liveApps()
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(
      (a) =>
        `<li><img src="${esc(a.icon)}" alt="" width="36" height="36" loading="lazy"><span><a href="/apps/${esc(a.slug)}">${esc(a.name)}</a><code>${esc(a.packageName)}</code></span></li>`,
    )
    .join("");
  return `<ul class="legal-apps" aria-label="JEWEALITY apps covered by this document">${items}</ul>`;
}

/** Reads /content/<name>.md, converts it to HTML with heading ids + anchors, and builds a TOC. */
export async function loadLegalDoc(name: "privacy" | "terms"): Promise<LegalDoc> {
  const file = await readFile(path.join(process.cwd(), "content", `${name}.md`), "utf8");
  const { data, content } = matter(file);

  for (const key of ["title", "description", "lastUpdated"]) {
    if (!data[key]) throw new Error(`content/${name}.md is missing front-matter "${key}"`);
  }

  const numbered = Boolean(data.numbered);
  let section = 0;
  const toc: TocItem[] = [];
  const used = new Map<string, number>();
  const marked = new Marked({ gfm: true });
  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        const inner = this.parser.parseInline(tokens);
        if (depth !== 2 && depth !== 3) return `<h${depth}>${inner}</h${depth}>\n`;
        let id = slugify(inner) || "section";
        const n = used.get(id) ?? 0;
        used.set(id, n + 1);
        if (n) id = `${id}-${n}`;
        const number = numbered && depth === 2 ? ++section : undefined;
        toc.push({ id, text: toPlainText(inner), level: depth, number });
        const prefix = number ? `<span class="section-number">${number}.</span> ` : "";
        return `<h${depth} id="${id}">${prefix}${inner}<a class="heading-anchor" href="#${id}" aria-label="Link to this section">#</a></h${depth}>\n`;
      },
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const external = /^https?:\/\//.test(href);
        const t = title ? ` title="${title}"` : "";
        const ext = external ? ' target="_blank" rel="noopener noreferrer"' : "";
        return `<a href="${href}"${t}${ext}>${text}</a>`;
      },
    },
  });

  // Shared values come from lib/site.ts and the app data, so they are defined in one place.
  const filled = content
    .replaceAll("{{email}}", site.email)
    .replaceAll("{{playDeveloperUrl}}", site.playDeveloperUrl)
    .replaceAll("{{appsList}}", appsListHtml());
  const html = await marked.parse(filled);
  const lastUpdated =
    data.lastUpdated instanceof Date
      ? data.lastUpdated.toISOString().slice(0, 10)
      : String(data.lastUpdated);

  return {
    title: String(data.title),
    subtitle: data.subtitle ? String(data.subtitle) : undefined,
    description: String(data.description),
    lastUpdated,
    draft: Boolean(data.draft),
    html,
    toc,
  };
}

export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
