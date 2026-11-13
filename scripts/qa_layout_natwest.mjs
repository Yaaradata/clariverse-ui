// NatWest layout QA (feedback 13 Nov: spacing, one sidebar, responsiveness at every resolution).
// For every screen x resolution x theme: a full-page screenshot for review, plus measured checks:
//   sidebars       exactly one navigation rail on desktop widths, none taking room on phone widths
//   page overflow  document wider than the viewport (horizontal page scroll)
//   off-screen     visible elements whose box runs past the right edge (inside non-scrolling containers)
//   clipped text   single-line text cut off without an ellipsis
//   ask bar        the fixed Ask LisN bar covers the last content block when scrolled to the end
// Usage: FONTSOURCE_DIR=<.../@fontsource> node scripts/qa_layout_natwest.mjs [outDir]
// Writes <outDir>/<size>/<theme>/<route>.jpg and <outDir>/layout_report.json; exits 1 on any failure.
import fs from "node:fs";
import { chromium } from "playwright";

const outDir = process.argv[2] ?? "qa/screens_natwest_pulse_v1/layout";
const BASE = "http://localhost:3100";
const SIZES = {
  "360": { width: 360, height: 740, dpr: 2 },
  "390": { width: 390, height: 844, dpr: 2 },
  "768": { width: 768, height: 1024, dpr: 2 },
  "1024": { width: 1024, height: 768, dpr: 1 },
  "1280": { width: 1280, height: 800, dpr: 1 },
  "1440": { width: 1440, height: 900, dpr: 1 },
  "1536x730@1.25": { width: 1536, height: 730, dpr: 1.25 },
  "1920": { width: 1920, height: 1080, dpr: 1 },
};
const ROUTES = JSON.parse(fs.readFileSync("scripts/routes_natwest.json", "utf8")).filter(
  (r) => !r.includes("/signal/") || r.endsWith("/signal/complaint_handling"),
);
ROUTES.unshift("/role-based", "/role-based/natwest_bank");
const THEMES = (process.env.THEMES ?? "dark,light").split(",");
const FONT_DIR = `${process.env.FONTSOURCE_DIR}/`;
const fontCss = [
  ...[300, 400, 500, 600, 700, 800].map((w) => `@font-face{font-family:'Outfit';font-weight:${w};font-style:normal;font-display:block;src:url(https://fonts.local/outfit/outfit-latin-${w}-normal.woff2) format('woff2');}`),
  ...[400, 600, 700, 800].map((w) => `@font-face{font-family:'JetBrains Mono';font-weight:${w};font-style:normal;font-display:block;src:url(https://fonts.local/jetbrains-mono/jetbrains-mono-latin-${w}-normal.woff2) format('woff2');}`),
].join("\n");

function measure() {
  const vw = window.innerWidth;
  const doc = document.documentElement;
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none" && Number(cs.opacity) > 0;
  };
  // Inside a horizontally scrolling container (tables) running past the edge is by design.
  const inScroller = (el) => {
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const ox = getComputedStyle(p).overflowX;
      if ((ox === "auto" || ox === "scroll") && p.scrollWidth > p.clientWidth + 1) return true;
      if (ox === "hidden" || ox === "clip") return true;
    }
    return false;
  };
  const off = [];
  for (const el of document.querySelectorAll("body *")) {
    if (!visible(el) || el.children.length > 0 && !el.textContent?.trim()) continue;
    const r = el.getBoundingClientRect();
    if (r.right > vw + 1 && !inScroller(el) && getComputedStyle(el).position !== "fixed") {
      const t = (el.textContent || el.tagName).trim().replace(/\s+/g, " ").slice(0, 50);
      off.push(`${el.tagName.toLowerCase()} "${t}" right=${Math.round(r.right)}`);
    }
  }
  const clipped = [];
  for (const el of document.querySelectorAll("body *")) {
    if (!visible(el) || el.children.length) continue;
    const cs = getComputedStyle(el);
    if (cs.whiteSpace === "nowrap" && cs.textOverflow !== "ellipsis" && cs.overflow === "hidden" && el.scrollWidth > el.clientWidth + 1)
      clipped.push((el.textContent || "").trim().slice(0, 50));
  }
  const rails = [...document.querySelectorAll("aside, nav")].filter((el) => {
    const r = el.getBoundingClientRect();
    return visible(el) && r.height > window.innerHeight * 0.6 && r.width < 320 && r.left < 200;
  });
  // Overlap: two text leaves whose boxes intersect (neither inside the other), e.g. figures running into each other.
  const leaves = [...document.querySelectorAll("body *")].filter((el) => {
    if (!visible(el) || el.closest('[data-testid="ask-bar"], svg, header')) return false;
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    return own && getComputedStyle(el).position !== "fixed";
  }).map((el) => ({ el, r: el.getBoundingClientRect() }));
  const overlaps = [];
  for (let i = 0; i < leaves.length; i++) {
    for (let j = i + 1; j < leaves.length; j++) {
      const a = leaves[i], b = leaves[j];
      if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
      const w = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left);
      const h = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
      if (w > 3 && h > 3) {
        overlaps.push(`"${a.el.textContent.trim().slice(0, 24)}" x "${b.el.textContent.trim().slice(0, 24)}"`);
        if (overlaps.length > 20) break;
      }
    }
    if (overlaps.length > 20) break;
  }
  return {
    overlaps: overlaps.slice(0, 10),
    overlapCount: overlaps.length,
    pageOverflow: doc.scrollWidth > vw + 1 ? doc.scrollWidth - vw : 0,
    offscreen: [...new Set(off)].slice(0, 12),
    offscreenCount: off.length,
    clipped: [...new Set(clipped)].slice(0, 8),
    rails: rails.length,
  };
}

const br = await chromium.launch();
const report = [];
let fails = 0;
for (const [size, P] of Object.entries(SIZES)) {
  for (const theme of THEMES) {
    const ctx = await br.newContext({ viewport: { width: P.width, height: P.height }, deviceScaleFactor: P.dpr });
    await ctx.addInitScript((t) => {
      localStorage.setItem("lisn-v2-theme", t);
      document.documentElement.style.scrollBehavior = "auto";
    }, theme);
    await ctx.route("https://fonts.googleapis.com/**", (r) => r.fulfill({ status: 200, contentType: "text/css", body: fontCss }));
    await ctx.route("https://fonts.local/**", (r) => {
      const [, pkg, file] = new URL(r.request().url()).pathname.split("/");
      r.fulfill({ status: 200, contentType: "font/woff2", body: fs.readFileSync(`${FONT_DIR}${pkg}/files/${file}`) });
    });
    const p = await ctx.newPage();
    for (const route of ROUTES) {
      await p.mouse.move(P.width - 4, P.height - 4);
      await p.goto(BASE + route, { waitUntil: "networkidle", timeout: 45000 });
      await p.evaluate(() => document.fonts.ready);
      await p.addStyleTag({ content: "*{scroll-behavior:auto !important}" });
      await p.waitForTimeout(400);
      const m = await p.evaluate(measure);
      // Ask bar over the last block: scroll to the end and compare the bar's top with the footer's bottom.
      const ask = await p.evaluate(() => {
        window.scrollTo(0, document.documentElement.scrollHeight);
        const bar = document.querySelector('[data-testid="ask-bar"]') || document.querySelector("form input[placeholder*='Ask LisN']")?.closest("div");
        const foot = [...document.querySelectorAll("footer")].pop();
        if (!bar || !foot) return null;
        const b = bar.getBoundingClientRect();
        const f = foot.getBoundingClientRect();
        return getComputedStyle(bar).position === "fixed" && b.top < f.bottom - 2 && b.bottom > f.top ? Math.round(f.bottom - b.top) : 0;
      });
      const desktop = P.width >= 1024;
      const problems = [];
      if (m.pageOverflow) problems.push(`page scrolls sideways by ${m.pageOverflow}px`);
      if (m.offscreenCount) problems.push(`${m.offscreenCount} element(s) off-screen`);
      if (m.clipped.length) problems.push(`${m.clipped.length} clipped text`);
      if (m.overlapCount) problems.push(`${m.overlapCount} overlapping text: ${m.overlaps.slice(0, 3).join("; ")}`);
      if (desktop && route.startsWith("/natwest-pulse") && m.rails > 1) problems.push(`${m.rails} sidebars`);
      if (ask) problems.push(`Ask bar covers the footer by ${ask}px`);
      const name = route.replace(/^\//, "").replace(/[/?=&]/g, "_");
      const dir = `${outDir}/${size}/${theme}`;
      fs.mkdirSync(dir, { recursive: true });
      await p.evaluate(() => window.scrollTo(0, 0));
      await p.mouse.move(P.width - 4, P.height - 4);
      await p.screenshot({ path: `${dir}/${name}.jpg`, type: "jpeg", quality: 70, fullPage: true });
      report.push({ size, theme, route, ...m, ask, problems });
      if (problems.length) {
        fails += 1;
        console.log(`FAIL [${size} ${theme}] ${route}: ${problems.join("; ")}`);
      }
    }
    await ctx.close();
  }
}
await br.close();
fs.writeFileSync(`${outDir}/layout_report.json`, JSON.stringify(report, null, 1));
console.log(`Layout QA: ${report.length} page views, ${fails} with problems`);
process.exit(fails ? 1 : 0);
