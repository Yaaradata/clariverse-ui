// NatWest route checks (docs/natwest/brief.md Finish 1): every route in scripts/routes_natwest.json, plus every
// /natwest-pulse link found on those pages. For each: status 200 after redirects, X-Robots-Tag noindex, the watermark,
// the footer with the freeze, no link that leaves /natwest-pulse except none, and no other demo bank in the page.
// Each page's visible text goes to qa/_crawl/natwest_pages.json (gitignored) for lint_natwest.py and check_pii.py.
// Usage: node scripts/qa_natwest_routes.mjs http://localhost:3100   (exits 1 on any failure)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const base = process.argv[2] ?? "http://localhost:3100";
const ROOT = "/natwest-pulse";
const WATERMARK = "Demonstration · public data plus illustrative internal data · not NatWest Group MIS";
const OTHER = /\b(HDFC|IndusInd|Sterling|Openbank)\b/;

const seeds = JSON.parse(fs.readFileSync(path.join(REPO, "scripts/routes_natwest.json"), "utf8"));
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
const seen = new Set(seeds);
const queue = [...seeds];
const pages = [];
const fails = [];
while (queue.length && pages.length < 300) {
  const route = queue.shift();
  const res = await p.goto(base + route, { waitUntil: "networkidle" });
  const u = new URL(p.url());
  const final = u.pathname + u.search;
  const text = await p.evaluate(() => document.body.innerText);
  const robots = (await res.allHeaders())["x-robots-tag"] ?? "";
  const links = await p.evaluate(() => [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")));
  const problems = [];
  if (res.status() !== 200) problems.push(`status ${res.status()}`);
  if (!robots.includes("noindex")) problems.push("no X-Robots-Tag noindex");
  if (!text.includes(WATERMARK)) problems.push("no watermark");
  if (!/Data frozen [^.]*\d{1,2} \w+ 2026/.test(text)) problems.push("no freeze date in the footer");
  const other = text.match(OTHER);
  if (other) problems.push(`other demo bank on screen: ${other[0]}`);
  for (const href of links) {
    if (!href) continue;
    const l = new URL(href, base + final);
    if (l.origin !== new URL(base).origin || !l.pathname.startsWith(ROOT)) {
      problems.push(`link leaves the NatWest pages: ${href}`);
      continue;
    }
    const key = l.pathname + l.search;
    if (!seen.has(key)) {
      seen.add(key);
      queue.push(key);
    }
  }
  if (problems.length) fails.push(`${route} -> ${final}: ${problems.join("; ")}`);
  pages.push({ route: final, text });
}
await b.close();
fs.mkdirSync(path.join(REPO, "qa/_crawl"), { recursive: true });
fs.writeFileSync(path.join(REPO, "qa/_crawl/natwest_pages.json"), JSON.stringify(pages));
for (const f of fails) console.log("FAIL", f);
console.log(`NatWest routes: ${pages.length - fails.length}/${pages.length} pass (${seeds.length} seeds)`);
process.exit(fails.length ? 1 : 0);
