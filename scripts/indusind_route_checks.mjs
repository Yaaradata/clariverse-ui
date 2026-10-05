// IndusInd route checks: which routes to check, and what each must pass. Pure functions, no browser, so the fixtures in
// scripts/test_qa_indusind_routes.mjs can run them. The crawler (scripts/qa_indusind_routes.mjs) feeds them.
//
// Routes are enumerated from the route files, linked or not:
//   - every page.tsx under frontend/app/role-based/indusind_bank/ (static segments);
//   - every IndusInd role id the shared [industryId]/[roleId] route would resolve (the role-id constants and the
//     registry's IndusInd roles, listed or unlisted), and every redirect source under the IndusInd root in
//     next.config.mjs;
//   - one probe segment for the catch-all redirect;
//   - view, window and business variants from config/indusind.yaml.
import fs from "node:fs";
import path from "node:path";

export const ROOT = "/role-based/indusind_bank";
export const FOOTER = "LisN does not execute, authorise or decide";

export const GREP = {
  url: /https?:\/\/(?!fonts\.googleapis\.com|fonts\.gstatic\.com|www\.w3\.org|localhost)[^\s"'<>\\)]+/g,
  handle: /(?<![\w.@/])@(?!import|media|keyframes|font-face|supports|user\b)[A-Za-z][A-Za-z0-9_]{2,}/g,
  email: /[\w.+-]+@[\w-]+\.(?:com|in|org|net)\b/g,
  phone: /(?<![\w\d])[6-9]\d{9}(?!\d)/g,
  pan: /\b[A-Z]{5}\d{4}[A-Z]\b/g,
  internal: /\bIND-[A-Z]\d|\bDEC-\d|\bS-(?:HOME|DEP|PEER|RISK|CARDS|APPR)\b|\bCF-\d\d|\bIV-\d\d|\bHL-\d\d/g,
  hdfc: /HDFC|Regalia|PayZapp|16 Jan 2026/g,
  source_link: /play\.google\.com\/store|apps\.apple\.com|(?:x|twitter)\.com\/\w+\/status|reddit\.com\/r\/|consumercomplaints\.in\//g,
  // The earlier cards demo (review finding 1): its figures, co-brand partners and allegation wording.
  earlier_demo: /9,760 Cr|Avios|Jio-bp|EazyDiner|Pioneer Heritage|mis-selling claims/g,
};

/** Every page.tsx under dir, as a URL path (route groups and private folders skipped; dynamic segments reported). */
export function pageRoutes(appRoleDir, urlRoot = ROOT) {
  const out = [];
  const dynamic = [];
  const walk = (dir, url) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) {
        if (e.name.startsWith("_")) continue;
        const seg = /^\(.*\)$/.test(e.name) ? "" : `/${e.name}`;
        if (/^\[.*\]$/.test(e.name)) dynamic.push(path.join(dir, e.name));
        else walk(path.join(dir, e.name), url + seg);
      } else if (/^page\.(tsx|ts|jsx|js)$/.test(e.name)) out.push(url || urlRoot);
    }
  };
  walk(appRoleDir, urlRoot);
  return { routes: out, dynamic };
}

/** IndusInd role ids the shared [industryId]/[roleId] route would resolve: constants and registry entries. */
export function roleIds(industryTs, registryTsx) {
  const ids = new Set();
  for (const m of industryTs.matchAll(/_ROLE_ID\s*=\s*"([^"]+)"/g)) ids.add(m[1]);
  const start = registryTsx.indexOf("id: INDUSIND_BANK_INDUSTRY_ID");
  if (start >= 0) {
    const block = registryTsx.slice(start, registryTsx.indexOf("\n  },\n", start) + 1 || undefined);
    for (const m of block.matchAll(/\bid:\s*"([^"]+)"/g)) ids.add(m[1]);
  }
  return [...ids];
}

/** Literal redirect sources under the IndusInd root in next.config.mjs. */
export function redirectSources(nextConfig) {
  return [...nextConfig.matchAll(/source:\s*'([^']+)'/g)]
    .map((m) => m[1])
    .filter((s) => s.startsWith(`${ROOT}/`) && !s.includes(":"));
}

/** The full route list: files, role ids, redirect sources, the catch-all probe, and view/window/business variants. */
export function enumerateRoutes({ appRoleDir, industryTs, registryTsx, nextConfig, views, windows, businesses }) {
  const { routes } = pageRoutes(appRoleDir);
  const set = new Set([ROOT, ...routes]);
  for (const id of roleIds(industryTs, registryTsx)) set.add(`${ROOT}/${id}`);
  for (const s of redirectSources(nextConfig)) set.add(s);
  set.add(`${ROOT}/zz-unlisted-probe`);
  for (const r of routes) {
    if (r === ROOT) continue;
    for (const v of views) set.add(`${r}?v=${v}`);
    for (const w of windows) set.add(`${r}?w=${w}`);
    if (r === `${ROOT}/customer-pulse`) for (const b of businesses) {
      set.add(`${r}?b=${b}`);
      set.add(`${r}?v=cx&b=${b}`);
    }
  }
  return [...set];
}

/**
 * What one route must pass. rec: { route, final, status, robots, text, html, chunks?: string } (chunks: the JS the
 * page loads). opts.otherClients: names of other clients that must not be reachable (DEC-7); opts.links: every link
 * must stay under the IndusInd root; opts.footer: require the footer. Returns a list of problems; empty means the route passes.
 */
export function checkRoute(rec, opts = {}) {
  const problems = [];
  if (rec.status !== 200) problems.push(`status ${rec.status}`);
  if (!(rec.final ?? "").startsWith(ROOT)) problems.push(`left the IndusInd pages for ${rec.final}`);
  if (!rec.robots || !/noindex/.test(rec.robots)) problems.push("no noindex header");
  if (opts.footer && !(rec.text ?? "").includes(FOOTER)) problems.push("no footer");
  const hits = {};
  for (const [k, rx] of Object.entries(GREP)) {
    const m = [...new Set([...(rec.html ?? "").matchAll(rx), ...(rec.text ?? "").matchAll(rx)].map((x) => x[0]))];
    if (m.length) hits[k] = m.slice(0, 5);
  }
  if (Object.keys(hits).length) problems.push(`grep ${JSON.stringify(hits)}`);
  if (opts.otherClients?.length) {
    const rx = new RegExp(`\\b(?:${opts.otherClients.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`, "g");
    const found = new Set();
    for (const src of [rec.text, rec.html, rec.chunks]) for (const m of (src ?? "").matchAll(rx)) found.add(m[0]);
    if (found.size) problems.push(`other client named (DEC-7): ${[...found].join(", ")}`);
  }
  for (const href of opts.links ? (rec.links ?? []) : []) {
    if (!href || href.startsWith("#") || href.startsWith("/_next/") || href.startsWith("data:")) continue;
    const p = href.startsWith("http") ? new URL(href).pathname : href.split("?")[0];
    if (href.startsWith("http") && !/^https?:\/\/(localhost|127\.0\.0\.1)/.test(href)) {
      problems.push(`external link ${href}`);
      continue;
    }
    // The role page's "Back to industries" is the one link allowed out (IV-65); every other link stays under the root.
    if (!p.startsWith(ROOT) && p !== "/role-based") problems.push(`link leaves the IndusInd pages: ${href}`);
  }
  return problems;
}
