// Stretched tiles: children of multi-column grid/flex rows whose box is much taller than their content.
import { chromium } from "playwright";
import fs from "node:fs";
const routes = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const MIN_GAP = Number(process.argv[3] || 60);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1536, height: 730 } });
await ctx.route("https://fonts.googleapis.com/**", (r) => r.fulfill({ status: 200, contentType: "text/css", body: fs.readFileSync(new URL("./qa_fonts_v2.css", import.meta.url), "utf8") }));
await ctx.route("https://fonts.local/**", (r) => { const [, pkg, file] = new URL(r.request().url()).pathname.split("/"); r.fulfill({ status: 200, contentType: "font/woff2", body: fs.readFileSync(`${process.env.FONTSOURCE_DIR}/${pkg}/files/${file}`) }); });
const p = await ctx.newPage();
await p.mouse.move(1530, 720);
const out = [];
for (const r of routes) {
  await p.goto("http://localhost:3100" + r, { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(500);
  const found = await p.evaluate((MIN_GAP) => {
    const res = [];
    const main = document.querySelector("main main") || document.querySelector("main");
    for (const parent of main.querySelectorAll("*")) {
      const cs = getComputedStyle(parent);
      const isGrid = cs.display === "grid" || cs.display === "inline-grid";
      const isRow = cs.display === "flex" && !cs.flexDirection.startsWith("column");
      if (!isGrid && !isRow) continue;
      const kids = [...parent.children].filter((k) => k.getBoundingClientRect().height > 40);
      if (kids.length < 2) continue;
      // group children into visual rows by top
      const rows = {};
      for (const k of kids) { const t = Math.round(k.getBoundingClientRect().top / 4); (rows[t] ||= []).push(k); }
      for (const row of Object.values(rows)) {
        if (row.length < 2) continue;
        for (const k of row) {
          const box = k.getBoundingClientRect();
          // vertical intervals covered by visible leaf content; the largest uncovered band is the gap
          const iv = [];
          for (const d of k.querySelectorAll("*")) {
            const r = d.getBoundingClientRect();
            if (r.height === 0 || r.width === 0) continue;
            const leaf = !d.children.length || ["svg", "TABLE", "table"].includes(d.tagName) || d.tagName.toLowerCase() === "svg";
            const bg = getComputedStyle(d).backgroundColor;
            const painted = bg && !bg.endsWith(", 0)") && bg !== "transparent" && d !== k;
            if (!leaf && !painted) continue;
            if (d.closest("svg") && d.tagName.toLowerCase() !== "svg") continue;
            iv.push([r.top, r.bottom]);
          }
          iv.sort((a, z) => a[0] - z[0]);
          const padT = parseFloat(getComputedStyle(k).paddingTop) || 0;
          const padB = parseFloat(getComputedStyle(k).paddingBottom) || 0;
          let cur = box.top + padT, gap = 0, at = 0;
          for (const [t, bt] of iv) { if (t - cur > gap) { gap = t - cur; at = cur; } cur = Math.max(cur, bt); }
          if (box.bottom - padB - cur > gap) { gap = box.bottom - padB - cur; at = cur; }
          gap = Math.round(gap);
          if (gap >= MIN_GAP) {
            const title = (k.querySelector("h2,h3,[data-title]")?.textContent || k.innerText || "").trim().split("\n")[0].slice(0, 60);
            res.push({ gap, h: Math.round(box.height), cols: row.length, y: Math.round(box.top + scrollY), at: Math.round(at - box.top), title });
          }
        }
      }
    }
    return res;
  }, MIN_GAP);
  // keep the outermost report per y/title
  out.push({ route: r, gaps: found.sort((a, z) => z.gap - a.gap) });
  console.log(r, found.length ? found.slice(0, 6).map((g) => `${g.gap}px@${g.at} "${g.title}" (y${g.y}, ${g.cols} cols)`).join(" | ") : "ok");
}
fs.writeFileSync(process.argv[4] || "gaps.json", JSON.stringify(out, null, 1));
await b.close();
