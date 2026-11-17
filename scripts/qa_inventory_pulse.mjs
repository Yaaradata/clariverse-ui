// Dumps the structure of every screen of one pulse (SW-D15 point 12: visual parity, Swedbank against NatWest):
// page title and subtitle, every section (tile) with its heading, sub-heading and provenance tags, the table column
// headers inside it, the labels of KPI-style figures, and every in-page link with its destination (drill-downs).
// Usage: node scripts/qa_inventory_pulse.mjs <base> <routes.json> <out.json>
import fs from "node:fs";
import { chromium } from "playwright";

const [, , BASE = "http://localhost:3100", ROUTES = "scripts/routes_swedbank.json", OUT = "qa/_crawl/swedbank_inventory.json"] = process.argv;
// NatWest 30d and Swedbank 14d are the same slot; a period a pulse does not offer is skipped.
const PERIODS = ["brief", "7d", "14d", "30d", "all"];
const pageRoutes = JSON.parse(fs.readFileSync(ROUTES, "utf8")).filter(
  (r) => (!r.includes("/signal/") || r.endsWith("/signal/complaint_handling")) && !r.includes("/customer/") && r.split("/").length > 3,
);
const routes = pageRoutes.flatMap((r) => (r.includes("?") ? [r] : [r, ...PERIODS.map((x) => `${r}?period=${x}`)]));
const br = await chromium.launch();
const p = await (await br.newContext({ viewport: { width: 1536, height: 900 } })).newPage();
const out = [];
for (const route of routes) {
  // "load" plus a settle wait: a dev server never reaches network idle.
  const res = await p.goto(BASE + route, { waitUntil: "load", timeout: 120000 }).catch((e) => (console.log("SKIP", route, e.name), null));
  if (!res || res.status() !== 200) {
    if (res) console.log("SKIP", route, res.status());
    continue;
  }
  await p.waitForTimeout(1500);
  const data = await p.evaluate(() => {
    const txt = (el) => (el?.textContent || "").replace(/\s+/g, " ").trim();
    const h1 = document.querySelector("h1");
    const sections = [];
    const tiles = [...document.querySelectorAll('[data-testid="tile"], section')].filter(
      (el) => !el.parentElement?.closest('[data-testid="tile"], section'),
    );
    for (const t of tiles) {
      const head = t.querySelector("h2, h3, strong");
      const sub = head?.parentElement?.nextElementSibling;
      const subHeads = [...t.querySelectorAll("h3, h4, strong")].map(txt).filter((x) => x && x.length < 90);
      const tables = [...t.querySelectorAll("table")].map((tb) => [...tb.querySelectorAll("th")].map(txt).filter(Boolean));
      const provs = [...t.querySelectorAll('[data-testid="prov"]')].map(txt);
      const links = [...t.querySelectorAll("a[href]")].map((a) => ({ text: txt(a).slice(0, 80), href: a.getAttribute("href") }));
      sections.push({
        title: txt(head).slice(0, 120),
        sub: txt(sub).slice(0, 200),
        subHeads: [...new Set(subHeads)].slice(0, 40),
        tables,
        provs: [...new Set(provs)],
        links: links.filter((l) => l.href && !l.href.startsWith("#")).slice(0, 40),
        tables_n: t.querySelectorAll("table").length,
        quotes_n: t.querySelectorAll('[data-testid="evidence"], [data-quote]').length,
        text: txt(t).slice(0, 300),
      });
    }
    const nav = [...document.querySelectorAll("aside a[href], nav a[href]")].map((a) => ({ text: a.getAttribute("title") || txt(a), href: a.getAttribute("href") }));
    return { title: txt(h1), subtitle: txt(h1?.parentElement?.querySelector("div")), sections, nav };
  });
  out.push({ route, ...data });
  console.log(route, data.sections.length, "sections");
}
await br.close();
fs.mkdirSync("qa/_crawl", { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log("pages:", out.length);
