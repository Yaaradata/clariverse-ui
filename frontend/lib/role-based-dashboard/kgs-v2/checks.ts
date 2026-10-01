/**
 * KGS v2 mock checks (SPEC §10).
 * Run: npx tsx lib/role-based-dashboard/kgs-v2/checks.ts
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dataDir = join(dirname(fileURLToPath(import.meta.url)), "data");

function load<T>(name: string): T {
  return JSON.parse(readFileSync(join(dataDir, name), "utf8")) as T;
}

const meta = load<{
  weeklyInteractions: number[];
  thisWeekInteractions: number;
  totalInteractions13w: number;
  channelMixPct: Record<string, number>;
}>("meta.json");

const overview = load<{
  questionCards: { id: string; count: number }[];
  signals: { id: string }[];
  readStrip: string;
}>("overview.json");

const promise = load<{
  distributors: { distributorId: string }[];
  kpis: { key: string; value: number }[];
}>("promise.json");

const signalPr01 = load<{
  snippets: unknown[];
  orderLines: { candidateCause: string }[];
  causeSplit: {
    kgsSide: { allocation: number; orderChange: number; total: number };
    lastMile: { total: number };
  };
}>("signal_pr01.json");

const recurring = load<{
  themes: unknown[];
  kpis: { key: string; value: number }[];
}>("recurring.json");

const install = load<{
  steps: { friction: number; praise: number }[];
  frictionTotal: number;
  praiseTotal: number;
}>("install.json");

const partner = load<{
  subtitle: string;
  kgsView: { partnersConnected: { connected: number; of: number } };
}>("partner.json");

const anonymise = load<
  Record<string, Record<string, { named: string; anon: string }>>
>("anonymise.json");

type Check = { name: string; ok: boolean; detail?: string };

function strings(o: unknown, out: string[] = []): string[] {
  if (typeof o === "string") out.push(o);
  else if (Array.isArray(o)) for (const v of o) strings(v, out);
  else if (o && typeof o === "object")
    for (const v of Object.values(o)) strings(v, out);
  return out;
}

const BANNED: { re: RegExp; label: string }[] = [
  { re: /distil signal from noise/i, label: "distil signal from noise" },
  { re: /executive attention/i, label: "executive attention" },
  { re: /24\/7 analyst/i, label: "24/7 analyst" },
  { re: /not a dashboard/i, label: "not a dashboard" },
  { re: /\btime to resolve\b/i, label: "time to resolve" },
  { re: /\broot cause found\b/i, label: "root cause found" },
  { re: /\bfirmware\b/i, label: "firmware" },
  { re: /\bdefect\b/i, label: "defect" },
  { re: /\bbatch\b/i, label: "batch" },
  { re: /release failure/i, label: "release failure" },
  { re: /installed base healthy/i, label: "installed base healthy" },
  { re: /\bseparation\b/i, label: "separation" },
  { re: /carve-out/i, label: "carve-out" },
  { re: /\bTSA\b/, label: "TSA" },
  { re: /\bCarrier\b(?![a-z])/, label: "Carrier" },
  { re: /\b300K\b|\b233,?900\b/i, label: "big volume" },
  { re: /thousands of baselines/i, label: "thousands of baselines" },
  { re: /we'll take the action/i, label: "we'll take the action" },
  { re: /auto-send/i, label: "auto-send" },
  { re: /in 30 minutes/i, label: "in 30 minutes" },
  { re: /\bAmit\b|\bKartik\b|\bKarthik\b/, label: "real person name" },
  { re: /Honeywell|Edwards|EST4/i, label: "real product/competitor (data)" },
];

const CURRENCY = /[$£€¥₹]|USD|GBP|INR|EUR|rupees?/i;

export function checkWeeklyTotals(): Check {
  const sum = meta.weeklyInteractions.reduce((a, b) => a + b, 0);
  const ok =
    sum === 4940 &&
    meta.totalInteractions13w === 4940 &&
    meta.thisWeekInteractions === 386 &&
    meta.weeklyInteractions[meta.weeklyInteractions.length - 1] === 386;
  return {
    name: "weekly totals = 4,940 · this week = 386",
    ok,
    detail: `sum=${sum} thisWeek=${meta.thisWeekInteractions}`,
  };
}

export function checkChannelMix(): Check {
  const m = meta.channelMixPct;
  const ok =
    m.email === 38 &&
    m.help_desk === 22 &&
    m.service_calls === 20 &&
    m.salesforce === 15 &&
    m.partner_portal === 5 &&
    m.email + m.help_desk + m.service_calls + m.salesforce + m.partner_portal ===
      100;
  return { name: "channel mix 38/22/20/15/5", ok };
}

export function checkPr01CauseSplit(): Check {
  const lines = signalPr01.orderLines;
  const alloc = lines.filter((l) => l.candidateCause === "allocation").length;
  const orderChange = lines.filter(
    (l) => l.candidateCause === "order-change",
  ).length;
  const lastMile = lines.filter((l) => l.candidateCause === "last-mile").length;
  const split = signalPr01.causeSplit;
  const ok =
    lines.length === 46 &&
    alloc === 28 &&
    orderChange === 7 &&
    lastMile === 11 &&
    split.kgsSide.allocation === 28 &&
    split.kgsSide.orderChange === 7 &&
    split.lastMile.total === 11 &&
    alloc + orderChange + lastMile === 46;
  return {
    name: "PR-01 cause split 28 + 7 + 11 = 46",
    ok,
    detail: `${alloc}+${orderChange}+${lastMile}=${lines.length}`,
  };
}

export function checkPr01Snippets(): Check {
  const ok = signalPr01.snippets.length === 19;
  return {
    name: "PR-01 snippets = 19",
    ok,
    detail: `n=${signalPr01.snippets.length}`,
  };
}

export function checkInstallTotals(): Check {
  const fr = install.steps.reduce((a, s) => a + s.friction, 0);
  const pr = install.steps.reduce((a, s) => a + s.praise, 0);
  const ok =
    fr === 61 &&
    pr === 39 &&
    install.frictionTotal === 61 &&
    install.praiseTotal === 39;
  return {
    name: "install friction : praise = 61 : 39",
    ok,
    detail: `${fr}:${pr}`,
  };
}

export function checkOverviewMatchesPages(): Check {
  const promiseCard = overview.questionCards.find((c) => c.id === "promise");
  const recurringCard = overview.questionCards.find((c) => c.id === "recurring");
  const installCard = overview.questionCards.find((c) => c.id === "install");
  const signalIds = overview.signals.map((s) => s.id);
  const backAfterFix = recurring.kpis.find((k) => k.key === "back_after_fix");
  const ok =
    promiseCard?.count === 2 &&
    recurringCard?.count === 3 &&
    installCard?.count === 2 &&
    backAfterFix?.value === 3 &&
    signalIds.includes("PR-01") &&
    signalIds.includes("PR-02") &&
    signalIds.includes("RC-01") &&
    signalIds.includes("RC-03") &&
    signalIds.includes("IN-01") &&
    overview.signals.length === 5;
  return {
    name: "overview card counts match pages (2 / 3 / 2 signals)",
    ok,
  };
}

export function checkThemeCount(): Check {
  const ok = recurring.themes.length === 27;
  return {
    name: "themes = 27",
    ok,
    detail: `n=${recurring.themes.length}`,
  };
}

export function checkDistributors(): Check {
  const ids = promise.distributors.map((d) => d.distributorId);
  const worst = ["D-N-04", "D-N-07", "D-N-11"];
  const ok =
    ids.length === 12 &&
    worst.every((id) => ids.includes(id)) &&
    ids[0] === "D-N-04" &&
    ids[1] === "D-N-07" &&
    ids[2] === "D-N-11";
  return {
    name: "12 distributors · D-N-04/07/11 worst (top rows)",
    ok,
  };
}

export function checkPartnerCoverage(): Check {
  const p = partner.kgsView.partnersConnected;
  const ok = p.connected === 4 && p.of === 12;
  return { name: "partner view 4 of 12 connected", ok };
}

export function checkNoCurrency(): Check {
  const all = [
    meta,
    overview,
    promise,
    signalPr01,
    recurring,
    install,
    partner,
  ];
  const hits: string[] = [];
  for (const s of strings(all)) {
    if (CURRENCY.test(s)) hits.push(s.slice(0, 80));
  }
  return {
    name: "no currency anywhere in v2",
    ok: hits.length === 0,
    detail: hits[0],
  };
}

export function checkBannedStrings(): Check {
  const all = [
    meta,
    overview,
    promise,
    signalPr01,
    recurring,
    install,
    partner,
  ];
  const hits: string[] = [];
  for (const s of strings(all)) {
    for (const b of BANNED) {
      // SPEC §8 / AGENTS: Honeywell allowed only in Partner view subtitle.
      if (
        b.label === "real product/competitor (data)" &&
        s === partner.subtitle &&
        /Honeywell/i.test(s) &&
        !/Edwards|EST4/i.test(s)
      ) {
        continue;
      }
      if (b.re.test(s)) hits.push(`${b.label}: ${s.slice(0, 72)}`);
    }
  }
  return {
    name: "banned strings absent (SPEC §11)",
    ok: hits.length === 0,
    detail: hits[0],
  };
}

export function checkAnonymiseMap(): Check {
  const partnerKeys = Object.keys(anonymise.partner ?? {});
  const regionKeys = Object.keys(anonymise.region ?? {});
  const placeKeys = Object.keys(anonymise.place ?? {});
  const partnerOk = partnerKeys.every((k) => {
    const anon = anonymise.partner[k].anon;
    return /^Partner P-\d+$/.test(anon) || anon.startsWith("Partner P-");
  });
  const regionOk = regionKeys.every((k) =>
    anonymise.region[k].anon.startsWith("Region "),
  );
  const placeOk = placeKeys.every((k) =>
    anonymise.place[k].anon.startsWith("Hub "),
  );
  return {
    name: "anonymise map: Partner P-nn / Region n / Hub n",
    ok: partnerOk && regionOk && placeOk && partnerKeys.length >= 12,
  };
}

export function checkAnonymiseLeavesNoIds(): Check {
  /**
   * Display copy only: strings that use {{tokens}} or free-text sentences.
   * Structural ids (distributorId, connectedIds) are join keys, not on-screen.
   */
  const TOKEN =
    /\{\{(brand|platform|fw|partner|region|place|term):([^{}]+)\}\}/g;
  const fmt = (str: string) =>
    str.replace(TOKEN, (_m, kind: string, key: string) => {
      const entry = anonymise[kind]?.[key];
      return entry ? entry.anon : key;
    });

  function displayStrings(
    o: unknown,
    key = "",
    out: string[] = [],
  ): string[] {
    if (typeof o === "string") {
      const structural =
        /Id$|Ids$|^id$|connectedIds|distributorId|partnerId|regionId|signalId/i.test(
          key,
        );
      const looksDisplay =
        o.includes("{{") || o.includes(" ") || o.length > 12;
      if (!structural && looksDisplay) out.push(o);
    } else if (Array.isArray(o)) {
      o.forEach((v, i) => displayStrings(v, `${key}[${i}]`, out));
    } else if (o && typeof o === "object") {
      for (const [k, v] of Object.entries(o)) displayStrings(v, k, out);
    }
    return out;
  }

  const rendered = displayStrings([
    overview,
    promise,
    signalPr01,
    recurring,
    install,
    partner,
  ]).map(fmt);

  const hard = rendered.filter(
    (s) =>
      /\bD-[NSEW]{1,3}A?-\d{2}\b/.test(s) ||
      /\bGurugram\b/.test(s) ||
      /\bDelhi\b/.test(s) ||
      /\bMumbai\b/.test(s),
  );
  return {
    name: "anonymise ON leaves no distributor ID or city name",
    ok: hard.length === 0,
    detail: hard[0]?.slice(0, 100),
  };
}

export function checkReadStrip(): Check {
  const ok =
    overview.readStrip.includes("386") &&
    overview.readStrip.includes("77") &&
    overview.readStrip.includes("4,940");
  return { name: "read strip seeds 386 / ~77 / 4,940", ok };
}

export function checkPromiseKpis(): Check {
  const map = Object.fromEntries(promise.kpis.map((k) => [k.key, k.value]));
  const ok =
    map.orders_due === 1180 &&
    map.kept_original === 82 &&
    map.kept_revised === 93 &&
    map.avg_slip === 4.1 &&
    map.complaints_week === 38;
  return { name: "promise KPI tiles match SPEC", ok };
}

export const ALL_CHECKS = [
  checkWeeklyTotals,
  checkChannelMix,
  checkPr01CauseSplit,
  checkPr01Snippets,
  checkInstallTotals,
  checkOverviewMatchesPages,
  checkThemeCount,
  checkDistributors,
  checkPartnerCoverage,
  checkNoCurrency,
  checkBannedStrings,
  checkAnonymiseMap,
  checkAnonymiseLeavesNoIds,
  checkReadStrip,
  checkPromiseKpis,
];

export function runAllChecks(): Check[] {
  return ALL_CHECKS.map((fn) => fn());
}

function main() {
  const results = runAllChecks();
  let failed = 0;
  for (const r of results) {
    const line = r.ok
      ? `PASS: ${r.name}`
      : `FAIL: ${r.name}${r.detail ? ` — ${r.detail}` : ""}`;
    console.log(line);
    if (!r.ok) failed += 1;
  }
  console.log(
    failed === 0
      ? `\nAll ${results.length} checks passed.`
      : `\n${failed} of ${results.length} checks failed.`,
  );
  process.exit(failed === 0 ? 0 : 1);
}

const invoked = process.argv[1] ?? "";
if (/kgs-v2[/\\]checks\.(ts|js|mts|cjs)/.test(invoked)) {
  main();
}
