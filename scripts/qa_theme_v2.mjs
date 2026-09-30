// Theme QA for V2: every route, both themes. Flags blocks whose background/fill belongs to the other theme,
// and text whose contrast against its effective background is below 3:1.
import { chromium } from "playwright";
import fs from "node:fs";
const BASE = "http://localhost:3100";
const routes = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const OUT = process.argv[3];
const SHOT = new Set(JSON.parse(fs.readFileSync(process.argv[4], "utf8")));
const width = Number(process.argv[5] || 1440);
const b = await chromium.launch();
const results = [];
for (const theme of ["light", "dark"]) {
  const ctx = await b.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  await ctx.addInitScript((t) => localStorage.setItem("lisn-v2-theme", t), theme);
  const p = await ctx.newPage();
  for (const r of routes) {
    await p.goto(BASE + r, { waitUntil: "networkidle" });
    await p.waitForTimeout(600);
    const issues = await p.evaluate((theme) => {
      const parse = (c) => {
        const m = c.match(/rgba?\(([^)]+)\)/);
        if (m) { const [r, g, b, a = 1] = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return [r, g, b, a]; }
        const s = c.match(/srgb ([\d.]+) ([\d.]+) ([\d.]+)(?: \/ ([\d.]+))?/);
        if (s) return [s[1] * 255, s[2] * 255, s[3] * 255, s[4] === undefined ? 1 : Number(s[4])];
        return null;
      };
      const lum = ([r, g, b]) => { const f = (x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
      const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
      const out = [];
      const root = document.querySelector(".lisn-v2");
      if (!root) return [{ kind: "no-v2-root" }];
      const bgOf = (el) => { // effective background: first ancestor with an opaque-ish background
        for (let e = el; e; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if (c && c[3] > 0.5) return c; }
        return theme === "light" ? [244, 245, 248, 1] : [13, 13, 13, 1];
      };
      const desc = (el) => `${el.tagName.toLowerCase()}${el.className && typeof el.className === "string" ? "." + el.className.split(" ")[0] : ""} "${(el.innerText || el.textContent || "").trim().slice(0, 40)}"`;
      for (const el of root.querySelectorAll("*")) {
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2 || cs.visibility === "hidden" || cs.display === "none") continue;
        const bg = parse(cs.backgroundColor);
        if (bg && bg[3] > 0.5 && r.width * r.height > 400) {
          const L = lum(bg);
          if (theme === "light" && L < 0.08) out.push({ kind: "dark-block", el: desc(el), color: cs.backgroundColor, size: `${Math.round(r.width)}x${Math.round(r.height)}` });
          if (theme === "dark" && L > 0.6) out.push({ kind: "light-block", el: desc(el), color: cs.backgroundColor, size: `${Math.round(r.width)}x${Math.round(r.height)}` });
        }
        if (el instanceof SVGElement && ["rect", "path", "circle"].includes(el.tagName) && r.width * r.height > 60) {
          const f = parse(cs.fill);
          if (f && f[3] > 0.5 && (cs.fillOpacity === "" || Number(cs.fillOpacity) > 0.5)) {
            const L = lum(f);
            if (theme === "light" && L < 0.03) out.push({ kind: "dark-svg", el: `${el.tagName} ${el.getAttribute("class") || ""}`, color: cs.fill });
          }
        }
        // text contrast on leaf text nodes
        const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
        if (own && !(el instanceof SVGElement)) {
          const fg = parse(cs.color);
          if (fg && fg[3] > 0.5) {
            const cr = ratio(fg, bgOf(el));
            if (cr < 3) out.push({ kind: "low-contrast", el: desc(el), color: cs.color, ratio: Math.round(cr * 100) / 100 });
          }
        } else if (own && el instanceof SVGElement) {
          const f = parse(cs.fill);
          if (f) { const cr = ratio(f, theme === "light" ? [255, 255, 255] : [15, 15, 16]); if (cr < 3) out.push({ kind: "low-contrast-svg", el: desc(el), color: cs.fill, ratio: Math.round(cr * 100) / 100 }); }
        }
      }
      return out;
    }, theme);
    const name = r.replace(/^\/hdfc-pulse\/v2\/?/, "").replace(/[/?=&]/g, "_") || "index";
    if (SHOT.has(r)) {
      fs.mkdirSync(`${OUT}/${theme}`, { recursive: true });
      await p.screenshot({ path: `${OUT}/${theme}/${name}-${width}.jpg`, fullPage: true, type: "jpeg", quality: 60 });
    }
    results.push({ theme, route: r, issues });
  }
  await ctx.close();
}
await b.close();
fs.writeFileSync(`${OUT}/qa-${width}.json`, JSON.stringify(results, null, 1));
const tally = {};
for (const x of results) for (const i of x.issues) { const k = `${x.theme} ${i.kind}`; tally[k] = (tally[k] || 0) + 1; }
console.log(results.length, "pages", tally);
