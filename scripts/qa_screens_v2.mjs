// Screen-by-screen captures as a Windows Chrome user sees them: fixed viewport, real fonts, sidebar closed.
import { chromium } from "playwright";
import fs from "node:fs";
const PRESETS = {
  laptop125: { width: 1536, height: 730, dpr: 1.25 }, // 1920x1080 display, 125% scaling, Chrome tabs + address bar
  monitor100: { width: 1920, height: 945, dpr: 1 }, // 1920x1080 display, 100% scaling
};
const [, , route, theme, preset, outDir, maxScreens = "99"] = process.argv;
const P = PRESETS[preset];
// Fonts come from @fontsource packages (npm i @fontsource/outfit @fontsource/jetbrains-mono), found via FONTSOURCE_DIR.
const FONT_DIR = `${process.env.FONTSOURCE_DIR}/`;
const fontCss = [
  ...[300, 400, 500, 600, 700, 800].map((w) => `@font-face{font-family:'Outfit';font-weight:${w};font-style:normal;font-display:block;src:url(https://fonts.local/outfit/outfit-latin-${w}-normal.woff2) format('woff2');}`),
  ...[400, 600, 700, 800].map((w) => `@font-face{font-family:'JetBrains Mono';font-weight:${w};font-style:normal;font-display:block;src:url(https://fonts.local/jetbrains-mono/jetbrains-mono-latin-${w}-normal.woff2) format('woff2');}`),
].join("\n");
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: P.width, height: P.height }, deviceScaleFactor: P.dpr });
await ctx.addInitScript((t) => localStorage.setItem("lisn-v2-theme", t), theme);
await ctx.route("https://fonts.googleapis.com/**", (r) => r.fulfill({ status: 200, contentType: "text/css", body: fontCss }));
await ctx.route("https://fonts.local/**", (r) => {
  const [, pkg, file] = new URL(r.request().url()).pathname.split("/");
  r.fulfill({ status: 200, contentType: "font/woff2", body: fs.readFileSync(`${FONT_DIR}${pkg}/files/${file}`) });
});
const p = await ctx.newPage();
await p.mouse.move(P.width - 4, P.height - 4); // away from the sidebar, which opens on hover
await p.goto("http://localhost:3100" + route, { waitUntil: "networkidle" });
await p.evaluate(() => document.fonts.ready);
// The site scrolls smoothly; jump instead, so each capture is at rest, not mid-animation.
await p.addStyleTag({ content: "html,body{scroll-behavior:auto !important}" });
await p.waitForTimeout(800);
const fontsOk = await p.evaluate(() => [...document.fonts].some((f) => f.family.replace(/'/g, "") === "Outfit" && f.status === "loaded"));
const total = await p.evaluate(() => document.documentElement.scrollHeight);
const maxY = await p.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
const step = P.height - 60; // 60px overlap so nothing falls between two screens
const ys = [];
for (let y = 0; y < maxY; y += step) ys.push(y);
ys.push(maxY); // last screen sits exactly at the bottom, never past it
const uniq = [...new Set(ys.map((y) => Math.max(0, Math.min(maxY, y))))];
const n = Math.min(Number(maxScreens), uniq.length);
fs.mkdirSync(outDir, { recursive: true });
const name = route.replace(/^\/hdfc-pulse\/v2\/?/, "").replace(/[/?=&]/g, "_") || "index";
for (let i = 0; i < n; i++) {
  await p.evaluate((y) => window.scrollTo(0, y), uniq[i]);
  await p.waitForFunction((y) => Math.abs(window.scrollY - y) < 2, uniq[i]);
  await p.waitForTimeout(250);
  await p.mouse.move(P.width - 4, P.height - 4);
  await p.screenshot({ path: `${outDir}/${name}-${String(i + 1).padStart(2, "0")}.jpg`, type: "jpeg", quality: 80 });
}
console.log(route, theme, preset, "fonts", fontsOk ? "Outfit loaded" : "FALLBACK", "page height", total, "screens", n);
await b.close();
