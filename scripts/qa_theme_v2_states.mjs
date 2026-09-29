import { chromium } from "playwright";
const Q = process.argv[2];
const B = "http://localhost:3100";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
const bg = () => p.evaluate(() => getComputedStyle(document.querySelector(".lisn-v2")).backgroundColor);
await p.goto(B + "/hdfc-pulse/v2/mds-office", { waitUntil: "networkidle" });
console.log("default:", await p.getAttribute("html", "data-lisn-theme"), await bg(), "button:", await p.innerText("[data-testid=theme-toggle]"));
await p.click("[data-testid=theme-toggle]");
await p.waitForTimeout(200);
console.log("after click:", await p.getAttribute("html", "data-lisn-theme"), await bg(), "button:", await p.innerText("[data-testid=theme-toggle]"));
await p.goto(B + "/hdfc-pulse/v2/market", { waitUntil: "networkidle" });
console.log("next page (persisted):", await p.getAttribute("html", "data-lisn-theme"), await bg());
// states in light
await p.mouse.move(700, 400);
await p.screenshot({ path: `${Q}/states/light-header-toggle.jpg`, type: "jpeg", quality: 70, clip: { x: 0, y: 0, width: 1440, height: 400 } });
await p.mouse.move(30, 300);
await p.waitForTimeout(400);
await p.screenshot({ path: `${Q}/states/light-sidebar-open.jpg`, type: "jpeg", quality: 70 });
await p.mouse.move(700, 400);
await p.click("header >> text=Ask LisN");
await p.waitForTimeout(500);
await p.screenshot({ path: `${Q}/states/light-ask-lisn.jpg`, type: "jpeg", quality: 70 });
await p.keyboard.press("Escape");
await p.goto(B + "/hdfc-pulse/v2/satisfaction", { waitUntil: "networkidle" });
const chart = await p.$(".recharts-surface");
if (chart) { await chart.scrollIntoViewIfNeeded(); const bb = await chart.boundingBox(); await p.mouse.move(bb.x + bb.width * 0.5, bb.y + bb.height * 0.4); await p.waitForTimeout(400);
  await p.screenshot({ path: `${Q}/states/light-chart-tooltip.jpg`, type: "jpeg", quality: 70 }); }
// back to dark via toggle
await p.click("[data-testid=theme-toggle]");
await p.waitForTimeout(200);
console.log("toggle back:", await p.getAttribute("html", "data-lisn-theme"), await bg());
await p.click("[data-testid=theme-toggle]"); // leave light saved for the V1 check
await p.goto(B + "/hdfc-pulse/v1/mds-office", { waitUntil: "networkidle" });
console.log("V1 with light saved: body bg", await p.evaluate(() => getComputedStyle(document.body).backgroundColor), "has .lisn-v2:", await p.evaluate(() => !!document.querySelector(".lisn-v2")));
await p.screenshot({ path: `${Q}/states/v1-unchanged-with-light-saved.jpg`, type: "jpeg", quality: 60, clip: { x: 0, y: 0, width: 1440, height: 700 } });
await b.close();
