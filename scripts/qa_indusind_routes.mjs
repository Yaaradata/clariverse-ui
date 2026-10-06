// IndusInd route checks over EVERY route under /role-based/indusind_bank, linked or not (review finding 1, IV-47).
// Routes come from the route files (scripts/indusind_route_checks.mjs: enumerateRoutes); links found on the pages
// are followed as well. For each route it records status (after redirects), the final URL, X-Robots-Tag,
// footer, the rendered-page grep, other clients' names in the page or the JS it loads (DEC-7), and links that leave
// the IndusInd pages. Each page's visible text goes to qa/_crawl/pages.json (gitignored) for the lint and PII scans.
// Exits 1 on any failure.
// Usage: node scripts/qa_indusind_routes.mjs http://localhost:3100 [outDir]
// Needs playwright: installed here, or PLAYWRIGHT_MODULE=<file URL of playwright/index.mjs in a scratch folder>.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { checkRoute, enumerateRoutes, isExempt, ROOT } from "./indusind_route_checks.mjs";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [base = "http://localhost:3100", outDir = path.join(REPO, "qa/_crawl")] = process.argv.slice(2);
const read = (p) => fs.readFileSync(path.join(REPO, p), "utf8");
const common = JSON.parse(read("data/out/indusind_v1/common.json"));
// Other clients' names (DEC-7). Kept in a scripts file, never in a page payload, so the list itself never ships.
const otherClients = fs.existsSync(path.join(REPO, "scripts/indusind_other_clients.json"))
  ? JSON.parse(read("scripts/indusind_other_clients.json")).names
  : [];
const seeds = enumerateRoutes({
  appRoleDir: path.join(REPO, "frontend/app/role-based/indusind_bank"),
  industryTs: read("frontend/lib/role-based-dashboard/indusindBankIndustry.ts"),
  registryTsx: read("frontend/lib/role-based-dashboard/registry.tsx"),
  nextConfig: read("frontend/next.config.mjs"),
  views: common.views.map((v) => v.id).filter((v) => v !== "ceo"),
  windows: common.windows.map((w) => w.id),
  businesses: common.businesses.map((b) => b.id).filter((b) => b !== "all"),
});

fs.mkdirSync(outDir, { recursive: true });
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
const chunkCache = new Map();
async function chunkText(src) {
  if (!chunkCache.has(src)) {
    const r = await ctx.request.get(new URL(src, base).toString());
    chunkCache.set(src, r.ok() ? await r.text() : "");
  }
  return chunkCache.get(src);
}
const seen = new Set(seeds);
const queue = [...seeds];
const report = [];
const pages = [];
while (queue.length && report.length < 400) {
  const route = queue.shift();
  const res = await p.goto(base + route, { waitUntil: "networkidle" });
  await p.waitForTimeout(250);
  const u = new URL(p.url());
  const final = u.pathname + u.search;
  const html = await p.content();
  const text = await p.evaluate(() => document.body.innerText);
  const robots = (await res.allHeaders())["x-robots-tag"] ?? null;
  const links = await p.evaluate(() => [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")));
  const scripts = await p.evaluate(() => [...document.querySelectorAll("script[src]")].map((s) => s.getAttribute("src")));
  const chunks = (await Promise.all(scripts.map(chunkText))).join("\n");
  const rec = { route, final, status: res.status(), robots, text, html, chunks, links };
  const problems = checkRoute(rec, { otherClients, links: true, footer: true });
  report.push({ route, final, status: rec.status, robots, scripts: scripts.length, problems });
  // The earlier Head of Cards demo is kept by request: recorded, not linted, and its links are not followed.
  if (isExempt(final)) continue;
  pages.push({ route: final, text });
  for (const href of links) {
    if (!href) continue;
    const l = new URL(href, base + final);
    if (l.origin !== new URL(base).origin || !l.pathname.startsWith(ROOT)) continue;
    const key = l.pathname + l.search;
    if (!seen.has(key)) {
      seen.add(key);
      queue.push(key);
    }
  }
}
await b.close();
fs.writeFileSync(`${outDir}/pages.json`, JSON.stringify(pages));
fs.writeFileSync(`${outDir}/routes.json`, JSON.stringify(report, null, 1));
const bad = report.filter((r) => r.problems.length);
for (const r of bad) console.log(`FAIL ${r.route} -> ${r.final}: ${r.problems.join("; ")}`);
const n = report.length;
const ok = (f) => report.filter(f).length;
console.log(
  `Routes checked: ${n} (${seeds.length} enumerated from the route files, ${n - seeds.length} more found by links). ` +
    `200: ${ok((r) => r.status === 200)}/${n}; noindex: ${ok((r) => /noindex/.test(r.robots ?? ""))}/${n}; ` +
    `all checks clean: ${n - bad.length}/${n}`,
);
process.exit(bad.length ? 1 : 0);
