// IndusInd screenshots (HL-33): every screen, both views and the Cards filter, plus the role page, at 1440, 390 and
// 1536x730 at 1.25 scale. One image per screen (full page) plus an end-of-page shot with the Ask bar, which must clear
// the footer (HL-26). Local fonts, mouse parked, smooth scroll off.
// Usage: FONTSOURCE_DIR=<scratch>/node_modules/@fontsource node scripts/qa_screens_indusind.mjs http://localhost:3100 qa/screens_indusind_v1
// Needs playwright and the @fontsource packages (run from a folder that has them, as the other ui-qa scripts do).
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const [base, outDir] = process.argv.slice(2);
const BASE = "/role-based/indusind_bank/customer-pulse";
const FONT_CSS = fs.readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1")), "qa_fonts_v2.css"), "utf8");
fs.mkdirSync(outDir, { recursive: true });
const screens = [["home", ""], ["deposits", "/deposits"], ["peers", "/peers"], ["risk", "/risk"], ["cards", "/cards"], ["approvals", "/approvals"]];
const jobs = [["role-page", "/role-based/indusind_bank"]];
for (const [name, p] of screens) for (const v of ["ceo", "cx"]) jobs.push([`${name}_${v}`, `${BASE}${p}${v === "cx" ? "?v=cx" : ""}`]);
for (const v of ["ceo", "cx"]) jobs.push([`home_cards-filter_${v}`, `${BASE}?b=cards${v === "cx" ? "&v=cx" : ""}`]);
const SIZES = [
  { tag: "1440", width: 1440, height: 900, scale: 1 },
  { tag: "390", width: 390, height: 844, scale: 1 },
  { tag: "1536@1.25", width: 1536, height: 730, scale: 1.25 },
];
const b = await chromium.launch();
const report = [];
for (const s of SIZES) {
  const ctx = await b.newContext({ viewport: { width: s.width, height: s.height }, deviceScaleFactor: s.scale });
  await ctx.route("https://fonts.googleapis.com/**", (r) => r.fulfill({ status: 200, contentType: "text/css", body: FONT_CSS }));
  await ctx.route("https://fonts.local/**", (r) => {
    const [, pkg, file] = new URL(r.request().url()).pathname.split("/");
    r.fulfill({ status: 200, contentType: "font/woff2", body: fs.readFileSync(`${process.env.FONTSOURCE_DIR}/${pkg}/files/${file}`) });
  });
  for (const [name, url] of jobs) {
    const p = await ctx.newPage();
    const errs = [];
    p.on("console", (m) => { if (m.type() === "error") errs.push(m.text().slice(0, 160)); });
    p.on("pageerror", (e) => errs.push(`PAGEERROR ${String(e).slice(0, 160)}`));
    const r = await p.goto(base + url, { waitUntil: "networkidle" });
    await p.addStyleTag({ content: "html{scroll-behavior:auto!important}" });
    await p.mouse.move(s.width - 2, s.height - 2);
    await p.waitForTimeout(400);
    const info = await p.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      watermark: !!document.querySelector('[data-testid="watermark"]'),
      tiles: document.querySelectorAll('[data-testid="signal-tile"]').length,
    }));
    await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await p.waitForTimeout(200);
    const clear = await p.evaluate(() => {
      const bar = document.querySelector('[data-testid="ask-bar"]')?.getBoundingClientRect();
      const foot = document.querySelector('[data-testid="footer"]')?.getBoundingClientRect();
      return bar && foot ? foot.bottom <= bar.top : null;
    });
    await p.screenshot({ path: `${outDir}/${name}_${s.tag}_end.png` });
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.waitForTimeout(200);
    await p.addStyleTag({ content: '[data-testid="ask-bar"]{display:none!important}' });
    await p.screenshot({ path: `${outDir}/${name}_${s.tag}.png`, fullPage: true });
    report.push({ name, size: s.tag, url, status: r.status(), ...info, askBarClear: clear, errs });
    await p.close();
  }
  await ctx.close();
}
await b.close();
fs.writeFileSync(`${outDir}/report.json`, JSON.stringify(report, null, 1));
const bad = report.filter((x) => x.status !== 200 || x.sw > Number(x.size.split("@")[0]) || !x.watermark || x.askBarClear === false || x.errs.length);
for (const x of bad) console.log(`FAIL ${x.size} ${x.name}: status ${x.status}, scrollWidth ${x.sw}, watermark ${x.watermark}, ask bar clear ${x.askBarClear}, errors ${x.errs.length}`);
console.log(`Screenshots: ${report.length} (${jobs.length} screens × ${SIZES.length} sizes); problems: ${bad.length}`);
process.exit(bad.length ? 1 : 0);
