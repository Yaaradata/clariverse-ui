// IndusInd route checks over everything reachable from the role page (/role-based/indusind_bank).
// Crawls from the role page, following every link that stays under /role-based/indusind_bank (screens, view, window
// and business variants, role links), and for each route records: status, X-Robots-Tag, watermark, and hits of the
// rendered-page grep (URLs, handles, emails, phones, PAN, internal labels, HDFC strings, source links). Each page's
// visible text goes to qa/_crawl/pages.json (gitignored) for the lint and PII scans. Exits 1 on any failure.
// Usage: node scripts/qa_indusind_routes.mjs http://localhost:3100 [outDir]
// Needs playwright (run from a folder that has it, as the other ui-qa scripts do).
import fs from "node:fs";
import { chromium } from "playwright";

const [base = "http://localhost:3100", outDir = "qa/_crawl"] = process.argv.slice(2);
const ROOT = "/role-based/indusind_bank";
const MAX = 200;
const GREP = {
  url: /https?:\/\/(?!fonts\.googleapis\.com|fonts\.gstatic\.com|www\.w3\.org|localhost)[^\s"'<>\\)]+/g,
  handle: /(?<![\w.@/])@(?!import|media|keyframes|font-face|supports|user\b)[A-Za-z][A-Za-z0-9_]{2,}/g,
  email: /[\w.+-]+@[\w-]+\.(?:com|in|org|net)\b/g,
  phone: /(?<![\w\d])[6-9]\d{9}(?!\d)/g,
  pan: /\b[A-Z]{5}\d{4}[A-Z]\b/g,
  internal: /\bIND-[A-Z]\d|\bDEC-\d|\bS-(?:HOME|DEP|PEER|RISK|CARDS|APPR)\b|\bCF-\d\d|\bIV-\d\d|\bHL-\d\d/g,
  hdfc: /HDFC|Regalia|PayZapp|16 Jan 2026/g,
  source_link: /play\.google\.com\/store|apps\.apple\.com|(?:x|twitter)\.com\/\w+\/status|reddit\.com\/r\/|consumercomplaints\.in\//g,
};

fs.mkdirSync(outDir, { recursive: true });
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
const seen = new Set([ROOT]);
const queue = [ROOT];
const report = [];
const pages = [];
while (queue.length && report.length < MAX) {
  const route = queue.shift();
  const res = await p.goto(base + route, { waitUntil: "networkidle" });
  await p.waitForTimeout(300);
  const finalPath = new URL(p.url()).pathname + new URL(p.url()).search;
  const html = await p.content();
  const text = await p.evaluate(() => document.body.innerText);
  const robots = (await res.allHeaders())["x-robots-tag"] ?? null;
  const watermark = await p.evaluate(() => !!document.querySelector('[data-testid="watermark"]'));
  const hits = {};
  for (const [k, rx] of Object.entries(GREP)) {
    const m = [...new Set(html.match(rx) ?? [])];
    if (m.length) hits[k] = m.slice(0, 5);
  }
  report.push({ route, final: finalPath, status: res.status(), robots, watermark, hits });
  pages.push({ route: finalPath, text });
  const links = await p.evaluate(() => [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")));
  for (const href of links) {
    if (!href) continue;
    const u = new URL(href, base + finalPath);
    if (u.origin !== new URL(base).origin || !u.pathname.startsWith(ROOT)) continue;
    const key = u.pathname + u.search;
    if (!seen.has(key)) {
      seen.add(key);
      queue.push(key);
    }
  }
}
await b.close();
fs.writeFileSync(`${outDir}/pages.json`, JSON.stringify(pages));
fs.writeFileSync(`${outDir}/routes.json`, JSON.stringify(report, null, 1));
let bad = 0;
for (const r of report) {
  const problems = [];
  if (r.status !== 200) problems.push(`status ${r.status}`);
  if (!r.robots || !/noindex/.test(r.robots)) problems.push("no noindex header");
  if (!r.watermark) problems.push("no watermark");
  if (Object.keys(r.hits).length) problems.push(`grep ${JSON.stringify(r.hits)}`);
  if (problems.length) {
    bad++;
    console.log(`FAIL ${r.final}: ${problems.join("; ")}`);
  }
}
const n = report.length;
console.log(
  `Routes crawled: ${n} (from ${ROOT}). 200: ${report.filter((r) => r.status === 200).length}/${n}; ` +
    `noindex: ${report.filter((r) => /noindex/.test(r.robots ?? "")).length}/${n}; ` +
    `watermark: ${report.filter((r) => r.watermark).length}/${n}; ` +
    `rendered grep clean: ${report.filter((r) => !Object.keys(r.hits).length).length}/${n}`,
);
process.exit(bad ? 1 : 0);
