// Full-page screens of every V2 route at 1440 and 390 wide, for the Morning brief and the Full window, plus a check
// for horizontal overflow. Usage: node scripts/qa_screens_30sep.mjs scripts/routes.json qa/screens_30sep
import fs from "node:fs";
import { chromium } from "playwright";

const routes = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const out = process.argv[3];
const SIZES = [
  { name: "1440", width: 1440, height: 900 },
  { name: "390", width: 390, height: 844 },
];
const b = await chromium.launch();
const report = [];
for (const size of SIZES) {
  fs.mkdirSync(`${out}/${size.name}`, { recursive: true });
  const ctx = await b.newContext({ viewport: { width: size.width, height: size.height } });
  await ctx.route("https://fonts.googleapis.com/**", (r) =>
    r.fulfill({ status: 200, contentType: "text/css", body: fs.readFileSync(new URL("./qa_fonts_v2.css", import.meta.url), "utf8") }),
  );
  await ctx.route("https://fonts.local/**", (r) => {
    const [, pkg, file] = new URL(r.request().url()).pathname.split("/");
    r.fulfill({ status: 200, contentType: "font/woff2", body: fs.readFileSync(`${process.env.FONTSOURCE_DIR}/${pkg}/files/${file}`) });
  });
  const p = await ctx.newPage();
  for (const r of routes) {
    for (const period of ["brief", "all"]) {
      const res = await p.goto(`http://localhost:3100${r}?period=${period}`, { waitUntil: "networkidle" });
      await p.evaluate(() => document.fonts.ready);
      await p.waitForTimeout(300);
      const over = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      const name = `${r.replace("/hdfc-pulse/v2", "").replace(/^\//, "").replace(/\//g, "_") || "index"}-${period}`;
      await p.screenshot({ path: `${out}/${size.name}/${name}.jpg`, type: "jpeg", quality: 60, fullPage: true });
      report.push({ route: r, period, width: size.width, status: res.status(), overflow_px: Math.max(0, over) });
    }
  }
  await ctx.close();
}
await b.close();
fs.writeFileSync(`${out}/report.json`, JSON.stringify(report, null, 1));
const bad = report.filter((x) => x.status !== 200 || x.overflow_px > 1);
console.log(`${report.length} screens; ${bad.length} with overflow or a bad status`);
for (const x of bad) console.log(x.width, x.route, x.period, x.status, `${x.overflow_px}px`);
