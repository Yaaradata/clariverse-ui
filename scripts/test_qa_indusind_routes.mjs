// Fixtures for the IndusInd route checks (scripts/indusind_route_checks.mjs). Each must fail the check it targets
// (HL-08). No browser needed. Usage: node scripts/test_qa_indusind_routes.mjs
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { checkRoute, enumerateRoutes, ROOT } from "./indusind_route_checks.mjs";

let failures = 0;
const expect = (name, cond) => {
  console.log(`${cond ? "PASS" : "FAIL"} ${name}`);
  if (!cond) failures++;
};

// A clean page, as the crawler records it.
const good = {
  route: `${ROOT}/customer-pulse`,
  final: `${ROOT}/customer-pulse`,
  status: 200,
  robots: "noindex, nofollow",
  text: "IndusInd Bank · Customer pulse … LisN does not execute, authorise or decide.",
  html: "<main>ok</main>",
  chunks: "function(){return 1}",
  links: [`${ROOT}/customer-pulse/cards`, "/_next/static/x.js"],
};
const opts = { otherClients: ["HDFC", "Sterling Bank"], links: true, footer: true };
expect("a clean page passes", checkRoute(good, opts).length === 0);

// 1. An unlinked route, enumerated from a route file that nothing links to, is checked, and fails without a footer.
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "ind-routes-"));
fs.mkdirSync(path.join(tmp, "customer-pulse", "hidden"), { recursive: true });
fs.writeFileSync(path.join(tmp, "page.tsx"), "export default function P(){}");
fs.writeFileSync(path.join(tmp, "customer-pulse", "page.tsx"), "export default function P(){}");
fs.writeFileSync(path.join(tmp, "customer-pulse", "hidden", "page.tsx"), "export default function P(){}");
const routes = enumerateRoutes({
  appRoleDir: tmp,
  industryTs: 'export const X_ROLE_ID = "indusind_ceo_office" as const;',
  registryTsx: '  {\n    id: INDUSIND_BANK_INDUSTRY_ID,\n    roles: [\n      { id: "head_cards", unlisted: true },\n    ],\n  },\n',
  nextConfig: `{ source: '${ROOT}/old_alias', destination: '${ROOT}' }`,
  views: ["cx"],
  windows: ["week"],
  businesses: ["cards"],
});
expect("an unlinked page file is enumerated", routes.includes(`${ROOT}/customer-pulse/hidden`));
expect("an unlisted registry role is enumerated", routes.includes(`${ROOT}/head_cards`));
expect("a role-id constant is enumerated", routes.includes(`${ROOT}/indusind_ceo_office`));
expect("a redirect source is enumerated", routes.includes(`${ROOT}/old_alias`));
expect("view variants are enumerated", routes.includes(`${ROOT}/customer-pulse/hidden?v=cx`));
const unlinked = { ...good, route: `${ROOT}/customer-pulse/hidden`, final: `${ROOT}/customer-pulse/hidden`, text: "Cards view" };
expect("an unlinked route without a footer fails", checkRoute(unlinked, opts).includes("no footer"));
fs.rmSync(tmp, { recursive: true, force: true });

// 2. The other checks each trip.
expect("non-200 fails", checkRoute({ ...good, status: 404 }, opts).some((p) => p.startsWith("status")));
expect("missing noindex fails", checkRoute({ ...good, robots: null }, opts).includes("no noindex header"));
expect("missing footer fails", checkRoute({ ...good, text: "IndusInd Bank · Customer pulse" }, opts).includes("no footer"));
expect("a redirect out of the IndusInd pages fails",
  checkRoute({ ...good, final: "/role-based" }, opts).some((p) => p.startsWith("left the IndusInd pages")));
expect("the earlier demo's figures fail", checkRoute({ ...good, text: `${good.text} Receivables ₹9,760 Cr` }, opts)
  .some((p) => p.includes("earlier_demo")));
expect("a post URL fails", checkRoute({ ...good, html: "https://play.google.com/store/apps/details?id=x" }, opts)
  .some((p) => p.includes("source_link")));
expect("an other client's name in the page JS fails (DEC-7)",
  checkRoute({ ...good, chunks: 'alt:"HDFC Logo"' }, opts).some((p) => p.startsWith("other client named")));
expect("a link to another industry's pages fails (DEC-7)",
  checkRoute({ ...good, links: ["/role-based/hdfc_bank"] }, opts).some((p) => p.startsWith("link leaves")));
expect("the role page's back link to the industries list passes (IV-65)",
  !checkRoute({ ...good, links: ["/role-based"] }, opts).some((p) => p.startsWith("link leaves")));

console.log(`test_qa_indusind_routes: ${failures} failure(s)`);
process.exit(failures ? 1 : 0);
