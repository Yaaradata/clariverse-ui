// Overflow and ellipsis detector for ui-qa.
// Usage: node qa_overflow.mjs <baseUrl> <route> [<route> ...]
// Example: node qa_overflow.mjs http://localhost:3000 /v2/md /v2/cx
// Exits 1 if any visible text element is cut off, ellipsised or overflowing its box.
import { chromium } from "playwright";

const [baseUrl, ...routes] = process.argv.slice(2);
if (!baseUrl || routes.length === 0) {
  console.error("Usage: node qa_overflow.mjs <baseUrl> <route> [...]");
  process.exit(2);
}

const viewports = [
  { name: "1536@1.25", width: 1536, height: 730, deviceScaleFactor: 1.25 },
  { name: "390", width: 390, height: 844, deviceScaleFactor: 2 },
];

const browser = await chromium.launch();
let failures = 0;

for (const vp of viewports) {
  const page = await browser.newPage({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.deviceScaleFactor,
  });
  for (const route of routes) {
    await page.goto(baseUrl + route, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const issues = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll("body *")) {
        const style = getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden") continue;
        const text = (el.innerText || "").trim();
        if (!text || el.children.length > 0) continue; // leaf text nodes only
        const clippedX = el.scrollWidth > el.clientWidth + 1 && style.overflowX !== "visible";
        const clippedY = el.scrollHeight > el.clientHeight + 1 && style.overflowY !== "visible";
        const ellipsis = style.textOverflow === "ellipsis" && el.scrollWidth > el.clientWidth;
        const rect = el.getBoundingClientRect();
        const offScreen = rect.right > window.innerWidth + 1;
        if (clippedX || clippedY || ellipsis || offScreen) {
          out.push({
            text: text.slice(0, 60),
            reason: ellipsis ? "ellipsis" : offScreen ? "off-screen" : "clipped",
          });
        }
      }
      return out;
    });
    for (const i of issues) {
      console.log(`FAIL [${vp.name}] ${route}: ${i.reason} — "${i.text}"`);
    }
    failures += issues.length;
  }
  await page.close();
}

await browser.close();
console.log(failures ? `${failures} overflow issue(s)` : "PASS: no overflow or ellipsis");
process.exit(failures ? 1 : 0);
