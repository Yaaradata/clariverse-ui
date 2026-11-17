// Swedbank screen-by-screen captures (SW-D15 point 12; copied from qa_screens_natwest.mjs, HL-33): sidebar closed, mouse parked, smooth scroll off, local fonts
// (FONTSOURCE_DIR=<folder with @fontsource/outfit and @fontsource/jetbrains-mono>). One browser for every capture.
// Usage: node scripts/qa_screens_swedbank.mjs [outDir] [maxScreensPerPage]
// Captures every oct13 screen at 1440, 390 and 1536x730 @1.25, light and dark; the home screen also in each period.
import fs from "node:fs";
import { chromium } from "playwright";

const [, , outDir = "qa/screens_swedbank_pulse_v1", maxScreens = "3"] = process.argv;
const BASE = "http://localhost:3100/swedbank-pulse/v1";
const SIZES = {
  d1440: { width: 1440, height: 900, dpr: 1 },
  m390: { width: 390, height: 844, dpr: 2 },
  laptop125: { width: 1536, height: 730, dpr: 1.25 },
};
const SCREENS = ["head-of-cx", "satisfaction", "market", "priority", "action-queue", "deliverables", "service-promise",
  "business/payments_swish", "business/everyday_accounts_app", "business/cards", "business/mortgages", "business/savings_funds",
  "business/consumer_loans", "business/everyday_accounts_app/happy", "business/everyday_accounts_app/market",
  "business/everyday_accounts_app/service", "module/nina_digital", "module/everyday_accounts_app", "my-view"];
// No brand filter: the oct13 layout has none and the layout rule bars adding one (NW-D27). Periods instead.
const BRANDED = SCREENS; // SW-D15 points 3 and 12: every screen in every window
const FONT_DIR = `${process.env.FONTSOURCE_DIR}/`;
const fontCss = [
  ...[300, 400, 500, 600, 700, 800].map((w) => `@font-face{font-family:'Outfit';font-weight:${w};font-style:normal;font-display:block;src:url(https://fonts.local/outfit/outfit-latin-${w}-normal.woff2) format('woff2');}`),
  ...[400, 600, 700, 800].map((w) => `@font-face{font-family:'JetBrains Mono';font-weight:${w};font-style:normal;font-display:block;src:url(https://fonts.local/jetbrains-mono/jetbrains-mono-latin-${w}-normal.woff2) format('woff2');}`),
].join("\n");

const jobs = [];
for (const [size] of Object.entries(SIZES))
  for (const theme of ["dark", "light"])
    for (const s of SCREENS) jobs.push({ size, theme, route: s });
for (const s of BRANDED)
  for (const per of ["brief", "7d", "14d", "all"]) jobs.push({ size: "laptop125", theme: "dark", route: `${s}?period=${per}` });

const br = await chromium.launch();
let fontsOk = true;
let n = 0;
for (const j of jobs) {
  const P = SIZES[j.size];
  const ctx = await br.newContext({ viewport: { width: P.width, height: P.height }, deviceScaleFactor: P.dpr });
  await ctx.addInitScript((t) => localStorage.setItem("lisn-v2-theme", t), j.theme);
  await ctx.route("https://fonts.googleapis.com/**", (r) => r.fulfill({ status: 200, contentType: "text/css", body: fontCss }));
  await ctx.route("https://fonts.local/**", (r) => {
    const [, pkg, file] = new URL(r.request().url()).pathname.split("/");
    r.fulfill({ status: 200, contentType: "font/woff2", body: fs.readFileSync(`${FONT_DIR}${pkg}/files/${file}`) });
  });
  const p = await ctx.newPage();
  await p.mouse.move(P.width - 4, P.height - 4);
  await p.goto(`${BASE}/${j.route}`, { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  await p.addStyleTag({ content: "*{scroll-behavior:auto !important}" });
  await p.waitForTimeout(500);
  fontsOk &&= await p.evaluate(() => [...document.fonts].some((f) => f.family.replace(/'/g, "") === "Outfit" && f.status === "loaded"));
  // The role-based chrome scrolls an inner container, not the document: mark the tallest scroller and drive it.
  const maxY = await p.evaluate(() => {
    let best = document.scrollingElement;
    for (const el of document.querySelectorAll("*")) {
      const cs = getComputedStyle(el);
      if (/(auto|scroll)/.test(cs.overflowY) && el.scrollHeight - el.clientHeight > best.scrollHeight - best.clientHeight) best = el;
    }
    best.setAttribute("data-qa-scroller", "1");
    return best.scrollHeight - best.clientHeight;
  });
  const ys = [];
  for (let y = 0; y < maxY; y += P.height - 60) ys.push(y);
  ys.push(Math.max(0, maxY));
  const uniq = [...new Set(ys)].slice(0, Number(maxScreens));
  const dir = `${outDir}/${j.size}/${j.theme}`;
  fs.mkdirSync(dir, { recursive: true });
  const name = j.route.replace(/[/?=&]/g, "_");
  for (let i = 0; i < uniq.length; i++) {
    await p.evaluate((y) => document.querySelector("[data-qa-scroller]").scrollTo(0, y), uniq[i]);
    await p.waitForTimeout(200);
    await p.mouse.move(P.width - 4, P.height - 4);
    await p.screenshot({ path: `${dir}/${name}-${String(i + 1).padStart(2, "0")}.jpg`, type: "jpeg", quality: 78 });
    n += 1;
  }
  await ctx.close();
}
await br.close();
console.log(`Swedbank screens: ${jobs.length} pages, ${n} captures, fonts ${fontsOk ? "Outfit loaded" : "FALLBACK"}`);
