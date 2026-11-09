/**
 * Generates favicons, PWA icons and the Open Graph image (app icons come from Google Play).
 * Run with: npm run icons
 * Source logo: public/logo.png (replace with a larger/SVG logo for sharper results).
 */
import sharp from "sharp";
import { writeFile, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const pub = (...p) => path.join(root, "public", ...p);
const logo = pub("logo.png");

// ---------- Favicons & PWA icons ----------
const sizes = [
  ["favicon-32x32.png", 32],
  ["apple-touch-icon.png", 180],
  ["icon-192.png", 192],
  ["icon-512.png", 512],
];
for (const [name, size] of sizes) {
  await sharp(logo).resize(size, size, { kernel: "lanczos3" }).png().toFile(pub(name));
}

// favicon.ico (PNG-in-ICO, 32x32 + 16x16)
const icoImages = await Promise.all([16, 32].map((s) => sharp(logo).resize(s, s).png().toBuffer()));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(icoImages.length, 4);
let offset = 6 + 16 * icoImages.length;
const entries = icoImages.map((buf, i) => {
  const s = [16, 32][i];
  const e = Buffer.alloc(16);
  e.writeUInt8(s, 0);
  e.writeUInt8(s, 1);
  e.writeUInt8(0, 2);
  e.writeUInt8(0, 3);
  e.writeUInt16LE(1, 4);
  e.writeUInt16LE(32, 6);
  e.writeUInt32LE(buf.length, 8);
  e.writeUInt32LE(offset, 12);
  offset += buf.length;
  return e;
});
await writeFile(pub("favicon.ico"), Buffer.concat([header, ...entries, ...icoImages]));

// ---------- Open Graph image (1200x630) ----------
const mask = Buffer.from(
  '<svg width="220" height="220"><rect width="220" height="220" rx="48" fill="#fff"/></svg>',
);
const logoBuf = await sharp(logo)
  .resize(220, 220)
  .ensureAlpha()
  .composite([{ input: mask, blend: "dest-in" }])
  .png()
  .toBuffer();
const ogSvg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="a" cx="85%" cy="10%" r="70%">
      <stop offset="0" stop-color="#c7b8ff" stop-opacity=".55"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="b" cx="5%" cy="95%" r="60%">
      <stop offset="0" stop-color="#ffc2e2" stop-opacity=".5"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="t" x1="0" x2="1">
      <stop offset="0" stop-color="#2f6bff"/>
      <stop offset=".5" stop-color="#7b3dff"/>
      <stop offset="1" stop-color="#ff3d9a"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="#ffffff"/>
  <rect width="1200" height="630" fill="url(#a)"/>
  <rect width="1200" height="630" fill="url(#b)"/>
  <text x="390" y="270" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="88" font-weight="800" fill="#0b0b12" letter-spacing="2">JEWEALITY</text>
  <text x="392" y="340" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="40" font-weight="600" fill="url(#t)">Apps Made to Make Life Easier</text>
  <text x="392" y="400" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="28" fill="#4b5563">Productivity tools · Utilities · Games · AI apps</text>
</svg>`;
await sharp(Buffer.from(ogSvg))
  .composite([{ input: logoBuf, left: 130, top: 205 }])
  .png()
  .toFile(pub("og.png"));

console.log("Assets generated:", (await readFile(pub("og.png"))).length, "byte OG image");
