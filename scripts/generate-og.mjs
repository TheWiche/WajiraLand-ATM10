// One-off helper to derive apple-touch-icon.png and og-cover.png from the
// brand logo. Not part of the build pipeline — run manually if the logo changes.
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const LOGO = "src/assets/logo.png";
const OUT = "public";
mkdirSync(OUT, { recursive: true });

const bgSvg = (w, h) => `
  <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="glow" cx="50%" cy="35%" r="70%">
        <stop offset="0%" stop-color="#10b981" stop-opacity="0.45"/>
        <stop offset="100%" stop-color="#05070a" stop-opacity="1"/>
      </radialGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="#05070a"/>
    <rect width="${w}" height="${h}" fill="url(#glow)"/>
  </svg>
`;

async function makeAppleTouchIcon() {
  const size = 180;
  const logo = await sharp(LOGO).resize(140, 140, { fit: "inside" }).toBuffer();
  await sharp(Buffer.from(bgSvg(size, size)))
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toFile(`${OUT}/apple-touch-icon.png`);
}

async function makeOgCover() {
  const w = 1200;
  const h = 630;
  const logo = await sharp(LOGO).resize(560, 560, { fit: "inside" }).toBuffer();
  await sharp(Buffer.from(bgSvg(w, h)))
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toFile(`${OUT}/og-cover.png`);
}

await makeAppleTouchIcon();
await makeOgCover();
console.log("Generated apple-touch-icon.png and og-cover.png in /public");
