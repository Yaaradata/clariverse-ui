// Route check for eng-qa: every V2 route must end in a 200 from a fresh production server (redirects are followed;
// /hdfc-pulse/v2 and /service-promise redirect on purpose).
// Usage: node scripts/qa_routes_v2.mjs <baseUrl> <routes.json>
// Example: node scripts/qa_routes_v2.mjs http://localhost:3100 scripts/routes.json
// Needs Node 18+ (global fetch). Exits 1 if any route is not 200.
import fs from "node:fs";

const [baseUrl, routesFile] = process.argv.slice(2);
if (!baseUrl || !routesFile) {
  console.error("Usage: node scripts/qa_routes_v2.mjs <baseUrl> <routes.json>");
  process.exit(2);
}

const routes = JSON.parse(fs.readFileSync(routesFile, "utf8"));
let bad = 0;
for (const route of routes) {
  let status;
  try {
    status = (await fetch(baseUrl + route)).status;
  } catch (e) {
    status = `error: ${e.message}`;
  }
  if (status !== 200) {
    bad += 1;
    console.log(`FAIL ${route}: ${status}`);
  }
}
const ok = routes.length - bad;
console.log(`Routes: ${ok}/${routes.length} 200`);
process.exit(bad ? 1 : 0);
