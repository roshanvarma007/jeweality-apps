/**
 * Tiny zero-dependency static server for the exported site in /out.
 * Mimics Netlify: /privacy -> privacy.html, /apps/x -> apps/x.html, unknown -> 404.html.
 * Usage: npm run build && npm start   (PORT env var optional, default 3000)
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..", "out");
const port = Number(process.env.PORT ?? 3000);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".webmanifest": "application/manifest+json",
  ".webp": "image/webp",
};

const isFile = async (p) => (await stat(p).catch(() => null))?.isFile() ?? false;

createServer(async (req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname);
  const safe = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, "");
  const base = path.join(root, safe);
  const candidates = [base, `${base}.html`, path.join(base, "index.html")];
  let file = null;
  for (const c of candidates)
    if (c.startsWith(root) && (await isFile(c))) {
      file = c;
      break;
    }
  const status = file ? 200 : 404;
  file ??= path.join(root, "404.html");
  res.writeHead(status, {
    "Content-Type": types[path.extname(file)] ?? "application/octet-stream",
  });
  res.end(await readFile(file));
}).listen(port, () => console.log(`Serving /out on http://localhost:${port}`));
