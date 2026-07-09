// One-off helper to render the social share cards (OG image + favicon-scale
// app icon) using the site's real design tokens. Renders actual HTML/CSS in
// headless Chromium so typography and gradients match the live site exactly.
// Not part of the build pipeline — run manually if the logo/branding changes:
//
//   npm install -D playwright && npx playwright install chromium
//   node scripts/generate-og.mjs
//
import { chromium } from "playwright";
import { writeFileSync, mkdtempSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { tmpdir } from "node:os";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const logoUrl = pathToFileURL(path.join(root, "src/assets/logo.png")).href;
const fontUrl = pathToFileURL(
  path.join(root, "node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2"),
).href;
const fontBodyUrl = pathToFileURL(
  path.join(root, "node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2"),
).href;

function ogHtml({ width, height }) {
  return `
<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  @font-face {
    font-family: "Space Grotesk";
    src: url("${fontUrl}") format("woff2");
    font-weight: 300 700;
  }
  @font-face {
    font-family: "Inter";
    src: url("${fontBodyUrl}") format("woff2");
    font-weight: 300 700;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body {
    width: ${width}px;
    height: ${height}px;
    background: #05070a;
    overflow: hidden;
  }
  .stage {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: "Inter", sans-serif;
  }
  .bg {
    position: absolute;
    inset: 0;
  }
  .grid {
    position: absolute;
    inset: 0;
    opacity: 0.06;
    background-image:
      linear-gradient(to right, white 1px, transparent 1px),
      linear-gradient(to bottom, white 1px, transparent 1px);
    background-size: 56px 56px;
  }
  .glow {
    position: absolute;
    border-radius: 999px;
    filter: blur(110px);
  }
  .glow-a { width: 560px; height: 560px; left: -220px; top: -220px; background: rgba(16,185,129,0.28); }
  .glow-b { width: 480px; height: 480px; right: -180px; bottom: -200px; background: rgba(52,232,158,0.2); }
  .vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, transparent 25%, #05070a 88%);
  }
  .content {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 28px;
    text-align: center;
  }
  .logo { width: 220px; height: auto; filter: drop-shadow(0 0 60px rgba(52,232,158,0.45)); }
  .title {
    font-family: "Space Grotesk", sans-serif;
    font-weight: 700;
    font-size: 76px;
    letter-spacing: -0.02em;
    color: #f5f8f7;
  }
  .title .accent {
    background-image: linear-gradient(110deg, #34e89e, #f5f8f7 45%, #10b981);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .tagline {
    font-size: 30px;
    color: #cfd8d5;
    max-width: 860px;
  }
  .pill {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    padding: 14px 28px;
    border-radius: 999px;
    border: 1px solid rgba(52,232,158,0.35);
    background: rgba(16,185,129,0.1);
    color: #34e89e;
    font-family: "Space Grotesk", sans-serif;
    font-weight: 600;
    font-size: 26px;
    letter-spacing: 0.02em;
  }
  .dot { width: 14px; height: 14px; border-radius: 999px; background: #34e89e; box-shadow: 0 0 18px 4px rgba(52,232,158,0.55); }
</style>
</head>
<body>
  <div class="stage">
    <div class="bg">
      <div class="grid"></div>
      <div class="glow glow-a"></div>
      <div class="glow glow-b"></div>
      <div class="vignette"></div>
    </div>
    <div class="content">
      <img class="logo" src="${logoUrl}" />
      <div class="title">Bienvenido a <span class="accent">Wajira Land</span></div>
      <div class="tagline">Servidor de Minecraft · All The Mods 10 &mdash; exploración, tecnología y magia en un mundo sin límites.</div>
      <div class="pill"><span class="dot"></span>15.204.68.134:20280</div>
    </div>
  </div>
</body>
</html>`;
}

function iconHtml({ size }) {
  return `
<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: ${size}px; height: ${size}px; background: #05070a; overflow: hidden; }
  .stage {
    position: relative;
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
  }
  .glow {
    position: absolute;
    width: 70%; height: 70%;
    border-radius: 999px;
    background: rgba(16,185,129,0.32);
    filter: blur(50px);
  }
  .logo {
    position: relative;
    width: 72%;
    height: auto;
    filter: drop-shadow(0 0 30px rgba(52,232,158,0.5));
  }
</style>
</head>
<body>
  <div class="stage">
    <div class="glow"></div>
    <img class="logo" src="${logoUrl}" />
  </div>
</body>
</html>`;
}

const browser = await chromium.launch();
const tmpDir = mkdtempSync(path.join(tmpdir(), "wajiraland-og-"));

async function shoot(html, outFile, width, height, name) {
  const htmlPath = path.join(tmpDir, `${name}.html`);
  writeFileSync(htmlPath, html);

  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 2 });
  // Navigate via file:// (not setContent) so the document's own origin can
  // load sibling file:// resources like the logo — browsers block that from
  // an about:blank origin.
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: outFile });
  await page.close();
}

await shoot(ogHtml({ width: 1200, height: 630 }), path.join(root, "public/og-cover.png"), 1200, 630, "og");
await shoot(iconHtml({ size: 180 }), path.join(root, "public/apple-touch-icon.png"), 180, 180, "icon");

await browser.close();
console.log("Generated og-cover.png and apple-touch-icon.png in /public");
