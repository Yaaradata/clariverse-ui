// Pass 3 screenshots: home, market (with the excluded-brands toggle ticked) and deliverables, laptop and phone.
// Usage: FONTSOURCE_DIR=<.../@fontsource> node scripts/qa_pass3_shots.mjs [outDir]
import fs from "node:fs";
import { chromium } from "playwright";

const outDir = process.argv[2] ?? "qa/screens_natwest_pulse_v1/pass3";
const BASE = "http://localhost:3100/natwest-pulse/v1";
const FONT_DIR = `${process.env.FONTSOURCE_DIR}/`;
const fontCss = [
  ...[300, 400, 500, 600, 700, 800].map((w) => `@font-face{font-family:'Outfit';font-weight:${w};src:url(https://fonts.local/outfit/outfit-latin-${w}-normal.woff2) format('woff2');}`),
  ...[400, 600, 700, 800].map((w) => `@font-face{font-family:'JetBrains Mono';font-weight:${w};src:url(https://fonts.local/jetbrains-mono/jetbrains-mono-latin-${w}-normal.woff2) format('woff2');}`),
].join("\n");
const SIZES = { laptop125: { width: 1536, height: 730, dpr: 1.25 }, phone390: { width: 390, height: 844, dpr: 2 } };
const PAGES = [["home", "/mds-office"], ["market", "/market"], ["deliverables", "/deliverables"]];

fs.mkdirSync(outDir, { recursive: true });
const br = await chromium.launch();
for (const [size, P] of Object.entries(SIZES)) {
  const ctx = await br.newContext({ viewport: { width: P.width, height: P.height }, deviceScaleFactor: P.dpr });
  await ctx.addInitScript(() => localStorage.setItem("lisn-v2-theme", "dark"));
  await ctx.route("https://fonts.googleapis.com/**", (r) => r.fulfill({ status: 200, contentType: "text/css", body: fontCss }));
  await ctx.route("https://fonts.local/**", (r) => {
    const [, pkg, file] = new URL(r.request().url()).pathname.split("/");
    r.fulfill({ status: 200, contentType: "font/woff2", body: fs.readFileSync(`${FONT_DIR}${pkg}/files/${file}`) });
  });
  const p = await ctx.newPage();
  for (const [name, route] of PAGES) {
    await p.goto(BASE + route, { waitUntil: "networkidle" });
    await p.evaluate(() => document.fonts.ready);
    if (name === "market") {
      await p.locator("#app-pulse input[type=checkbox]").check();
      await p.waitForTimeout(200);
      await p.locator("#app-pulse").screenshot({ path: `${outDir}/${size}_market_app_pulse.png` });
    }
    await p.screenshot({ path: `${outDir}/${size}_${name}.jpg`, type: "jpeg", quality: 70, fullPage: true });
    const head = await p.evaluate(() => ({
      title: document.title,
      header: document.querySelector("header")?.innerText.split("\n").slice(0, 3).join(" | "),
      watermark: document.querySelector('[data-testid="watermark"]')?.textContent?.trim(),
      footer: [...document.querySelectorAll("footer")].pop()?.innerText.slice(0, 170),
      excluded: document.querySelector('[data-testid="excluded-brands"]')?.innerText,
      overflow: document.documentElement.scrollWidth - window.innerWidth,
    }));
    console.log(size, name, JSON.stringify(head));
  }
  await ctx.close();
}
await br.close();
