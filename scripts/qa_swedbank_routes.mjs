// Swedbank route checks (docs/swedbank/kickoff_prompt.md Step 13, SW-D15 points 3 and 6): every route in
// scripts/routes_swedbank.json, each page route also in every window (?period=brief|7d|14d|all), plus every
// /swedbank-pulse link found on those pages. For each: status 200 after redirects, X-Robots-Tag noindex, the footer with
// the freeze, no link that leaves /swedbank-pulse, no other demo bank, no internal label ("illustrative", "synthetic",
// "seed", "mock", ANCHOR/DERIVED/ASSUMPTION) and no empty figure ("undefined", "NaN", "null", "0 of 0", an empty quote).
// Each page's visible text goes to qa/_crawl/swedbank_pages.json (gitignored) for lint_swedbank.py and check_pii.py.
// Usage: node scripts/qa_swedbank_routes.mjs http://localhost:3100   (exits 1 on any failure; FAST=1 for a subset)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const base = process.argv[2] ?? "http://localhost:3100";
const ROOT = "/swedbank-pulse";
const OTHER = /\b(HDFC|IndusInd|Sterling|Openbank|NatWest|RBS|Ulster|Coutts|Mettle|Cora)\b/;
const LABELS = /\b(illustrative|Illustrative|synthetic|Synthetic|seeded|mock|Mock|dummy|TODO|lorem|ANCHOR|DERIVED|ASSUMPTION)\b/;
// SW-D15 point 3: a card never shows a blank figure.
// SW-D17: no screen may say a figure is missing.
const EMPTY = /\bundefined\b|\bNaN\b|\bnull\b|(?<![\d,])0 of 0\b|\bInfinity\b|no reply data|\bno data\b|not available|(?<![\w/])n\/a(?![\w/])|\bunavailable\b|not fetched|no replies found|no earlier period|\bassum(?:ption|ed)s?\b|\bestimate[ds]?\b/i;
const PERIODS = ["brief", "7d", "14d", "all"];

// FAST=1: each Swedbank route once, 5 sampled signal pages, windows on the home route only, no link following.
const FAST = process.env.FAST === "1";
const all = JSON.parse(fs.readFileSync(path.join(REPO, "scripts/routes_swedbank.json"), "utf8"));
const signals = all.filter((r) => r.includes("/signal/"));
const base0 = FAST
  ? [...all.filter((r) => !r.includes("/signal/")), ...[0, 1, 2, 3, 4].map((i) => signals[Math.floor((i * signals.length) / 5)])]
  : all;
// Every window for every page route (SW-D15 point 3); FAST keeps the home route's windows only.
const windowed = base0
  .filter((r) => r.startsWith(`${ROOT}/v1/`) && !r.includes("?") && (!FAST || r.endsWith("/head-of-cx")))
  .flatMap((r) => PERIODS.map((x) => `${r}?period=${x}`));
// SW_ROUTES="v1/head-of-cx,v1/business/everyday_accounts_app" limits the crawl to those pages in every window (SW-D18).
const only = process.env.SW_ROUTES?.split(",").map((r) => `${ROOT}/${r}`);
const seeds = only
  ? only.flatMap((r) => PERIODS.map((x) => `${r}?period=${x}`))
  : [...new Set([...base0, ...windowed])];
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
const seen = new Set(seeds);
const queue = [...seeds];
const pages = [];
const fails = [];
while (queue.length && pages.length < 900) {
  const route = queue.shift();
  let res;
  try {
    res = await p.goto(base + route, { waitUntil: "networkidle", timeout: 30000 });
  } catch (e) {
    fails.push(`${route}: did not load (${e.name})`);
    continue;
  }
  const u = new URL(p.url());
  const final = u.pathname + u.search;
  const text = await p.evaluate(() => document.body.innerText);
  const robots = (await res.allHeaders())["x-robots-tag"] ?? "";
  const links = await p.evaluate(() => [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")));
  const problems = [];
  if (res.status() !== 200) problems.push(`status ${res.status()}`);
  if (!robots.includes("noindex")) problems.push("no X-Robots-Tag noindex");
  // SW-D15 point 6: no internal label on screen (the "Internal" tag on the social-inbox row is allowed).
  // SW-D02: the header reads the Swedbank freeze in Swedish time, never the copied NatWest one.
  if (!text.includes("Swedbank · Customer Pulse · 17 Nov 2026 07:45 CET")) problems.push("header is not 'Swedbank · Customer Pulse · 17 Nov 2026 07:45 CET'");
  const stale = text.match(/GMT|BST|13 November 2026|13 Nov|Friday 13/);
  if (stale) problems.push(`NatWest freeze or time zone on screen: ${stale[0]}`);
  // Customer quotes are the customer's own words ("pound sterling", another bank they left): the demo-bank check reads
  // the page without them (NW-D85).
  const ownText = await p.evaluate(() => {
    const c = document.body.cloneNode(true);
    // Scripts and styles are not on screen (a detached clone's innerText includes them, with the quotes' data).
    for (const q of c.querySelectorAll('[data-testid="evidence"], [data-quote], script, style, noscript')) q.remove();
    return c.innerText ?? c.textContent ?? "";
  });
  const other = ownText.match(OTHER);
  if (other) problems.push(`other demo bank on screen: ${other[0]}`);
  const label = ownText.match(LABELS);
  if (label) problems.push(`internal label on screen: ${label[0]}`);
  const empty = ownText.match(EMPTY);
  if (empty) problems.push(`empty figure on screen: ${empty[0]}`);
  const emptyQuotes = await p.evaluate(
    () => [...document.querySelectorAll('[data-testid="evidence"], [data-quote]')].filter((q) => !(q.textContent || "").trim()).length,
  );
  if (emptyQuotes) problems.push(`${emptyQuotes} empty quote slot(s)`);
  for (const href of links) {
    if (!href) continue;
    const l = new URL(href, base + final);
    // The sidebar's Back to roles link (Usha, 17 Nov) is the one link out.
    if (l.pathname === "/role-based/swedbank_bank") continue;
    if (l.origin !== new URL(base).origin || !l.pathname.startsWith(ROOT)) {
      problems.push(`link leaves the Swedbank pages: ${href}`);
      continue;
    }
    const key = l.pathname + l.search;
    if (!FAST && !only && !seen.has(key)) {
      seen.add(key);
      queue.push(key);
    }
  }
  if (problems.length) fails.push(`${route} -> ${final}: ${problems.join("; ")}`);
  pages.push({ route: final, text });
}
await b.close();
fs.mkdirSync(path.join(REPO, "qa/_crawl"), { recursive: true });
fs.writeFileSync(path.join(REPO, FAST ? "qa/_crawl/swedbank_pages_fast.json" : "qa/_crawl/swedbank_pages.json"), JSON.stringify(pages));
for (const f of fails) console.log("FAIL", f);
console.log(`Swedbank routes: ${pages.length - fails.length}/${pages.length} pass (${seeds.length} seeds)`);
process.exit(fails.length ? 1 : 0);
