import { chromium } from "playwright";
import fs from "node:fs";
const OUT = process.argv[2];
// Fonts from @fontsource (npm i @fontsource/outfit @fontsource/jetbrains-mono), found via FONTSOURCE_DIR.
const FD = process.env.FONTSOURCE_DIR;
const css = fs.readFileSync(new URL("./qa_fonts_v2.css", import.meta.url), "utf8");
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch();
for (const [w, h] of [[1440, 900], [390, 844]]) {
  for (const theme of ["light", "dark"]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    await ctx.addInitScript((t) => localStorage.setItem("lisn-v2-theme", t), theme);
    await ctx.route("https://fonts.googleapis.com/**", (r) => r.fulfill({ status: 200, contentType: "text/css", body: css }));
    await ctx.route("https://fonts.local/**", (r) => { const [, pkg, file] = new URL(r.request().url()).pathname.split("/"); r.fulfill({ status: 200, contentType: "font/woff2", body: fs.readFileSync(`${FD}/${pkg}/files/${file}`) }); });
    const p = await ctx.newPage();
    await p.mouse.move(w - 4, h - 4);
    const shot = async (sel, name) => {
      const el = await p.$(sel);
      if (!el) { console.log("missing", sel); return; }
      await el.scrollIntoViewIfNeeded();
      await p.waitForTimeout(300);
      await el.screenshot({ path: `${OUT}/${name}-${theme}-${w}.jpg`, type: "jpeg", quality: 80 });
    };
    await p.goto("http://localhost:3100/hdfc-pulse/v2/mds-office", { waitUntil: "networkidle" });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(600);
    await shot("#ombudsman-watch", "md-ombudsman-watch");
    // The morning brief tile that holds "What needs you"
    const brief = await p.evaluateHandle(() => [...document.querySelectorAll("section")].find((s) => /What needs you/.test(s.innerText)));
    if (brief.asElement()) { await brief.asElement().scrollIntoViewIfNeeded(); await p.waitForTimeout(300); await brief.asElement().screenshot({ path: `${OUT}/md-brief-${theme}-${w}.jpg`, type: "jpeg", quality: 80 }); }
    await p.goto("http://localhost:3100/hdfc-pulse/v2/business/cards", { waitUntil: "networkidle" });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(600);
    await shot("#ombudsman-watch", "cards-ombudsman-watch");
    await shot("#save-list", "cards-save-list");
    const cat = await p.$("[data-testid=category]");
    if (cat) { await cat.click(); await p.waitForTimeout(300); }
    await shot("#categories", "cards-categories-risk");
    if (w === 1440 && theme === "light") {
      // Ask LisN: the first suggested question on the Cards view
      const input = await p.$("input, textarea");
      if (input) { await input.click(); await p.waitForTimeout(400); }
      const sug = await p.$("[data-testid=ask-suggestion]");
      if (sug) { await sug.click(); await p.waitForTimeout(800); await p.screenshot({ path: `${OUT}/cards-ask-lisn-${theme}-${w}.jpg`, type: "jpeg", quality: 80 }); }
      else console.log("no suggestion button");
    }
    await ctx.close();
  }
}
await b.close();
console.log("done", fs.readdirSync(OUT).length);
