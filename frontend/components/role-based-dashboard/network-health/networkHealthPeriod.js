/**
 * Period-driven mock data for Delivery Network Health.
 * Operations Ledger grain by timeframe:
 *   7D  → last 7 days
 *   30D → all months (monthly rows)
 *   90D → quarter-to-quarter (e.g. January – April)
 */

export const PERIOD_META = {
  "7D": {
    key: "7D",
    vol: 0.28,
    rateNudge: 0.7, // shorter window → rates look a bit hotter
    cmpLabel: "7D",
  },
  "30D": {
    key: "30D",
    vol: 1,
    rateNudge: 0,
    cmpLabel: "30D",
  },
  "90D": {
    key: "90D",
    vol: 2.85,
    rateNudge: -0.4, // longer window → rates look cooler
    cmpLabel: "90D",
  },
};

/** Map legacy / casing variants onto the current 7D|30D|90D keys. */
export function normalizePeriod(period) {
  const raw = String(period || "").trim();
  if (PERIOD_META[raw]) return raw;
  const aliases = {
    wow: "7D",
    "7d": "7D",
    mom: "30D",
    "30d": "30D",
    "90d": "90D",
    yoy: "90D",
  };
  return aliases[raw.toLowerCase()] || "30D";
}

function fmtIN(n) {
  return Math.round(n).toLocaleString("en-IN");
}

function countNum(v) {
  return Number(String(v).replace(/,/g, ""));
}

/** Flow rows: Open (backlog) = Inflow − Closed. */
function withTankFlow(rows) {
  return rows.map((d, i) => {
    const inflowN = countNum(d.inflow);
    const closedN = countNum(d.closed);
    const openN = Math.max(0, inflowN - closedN);
    return {
      ...d,
      now: i === 0,
      inflow: fmtIN(inflowN),
      closed: fmtIN(closedN),
      open: fmtIN(openN),
    };
  });
}

const STATES = ["TS", "BR", "KA", "UP", "MH", "DL"];
const SELLERS = ["CloudTail", "RetailNet", "Omniverse"];
const DISPOSITIONS = ["Info + update", "Re-promise", "Escalate", "Info + follow-up"];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function fmtDayLabel(d) {
  const dd = String(d.getDate()).padStart(2, "0");
  return `${dd}-${MONTHS[d.getMonth()]}-${d.getFullYear()}`;
}

function fmtMonthLabel(d) {
  return `${MONTHS[d.getMonth()]}-${d.getFullYear()}`;
}

/** Quarter window label e.g. "January – April 2026". */
function fmtQuarterLabel(start, end) {
  const sameYear = start.getFullYear() === end.getFullYear();
  if (sameYear) {
    return `${MONTHS_FULL[start.getMonth()]} – ${MONTHS_FULL[end.getMonth()]} ${end.getFullYear()}`;
  }
  return `${MONTHS_FULL[start.getMonth()]} ${start.getFullYear()} – ${MONTHS_FULL[end.getMonth()]} ${end.getFullYear()}`;
}

/** Seed day (newest) — 12 Aug 2026. */
const SEED = {
  inflow: 50300,
  closed: 48900,
  rePromise: 16.8,
  breach: 8.6,
  risk: 21,
  escalation: 8.1,
};

function metricDrift(i, step) {
  return {
    rePromise: Math.round((SEED.rePromise - i * step.rePromise + (i % 4) * 0.05) * 10) / 10,
    breach: Math.round((SEED.breach - i * step.breach + (i % 3) * 0.03) * 10) / 10,
    risk: Math.round(SEED.risk - i * step.risk + (i % 5)),
    escalation: Math.round((SEED.escalation - i * step.escalation + (i % 4) * 0.04) * 10) / 10,
    sopApplied: Math.max(0, Math.round((83 - i * step.sopApplied + (i % 3) * 0.4) * 10) / 10),
    state: STATES[i % STATES.length],
    seller: SELLERS[i % SELLERS.length],
    disposition: DISPOSITIONS[i % DISPOSITIONS.length],
    breachHot: i === 0 || i === 1,
  };
}

/** 7D — last 7 calendar days. */
function buildDayRows(days) {
  const rows = [];
  const start = new Date(2026, 7, 12);
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() - i);
    const drift = i * 0.018;
    const wave = Math.sin(i / 3.2) * 0.012;
    const volFactor = 1 - drift * 0.35 + wave;
    const inflow = Math.round(SEED.inflow * volFactor);
    const closed = Math.round(SEED.closed * (volFactor - 0.004 + (i % 5) * 0.001));
    rows.push({
      date: fmtDayLabel(d),
      inflow: fmtIN(inflow),
      closed: fmtIN(closed),
      ...metricDrift(i, { rePromise: 0.11, breach: 0.05, risk: 0.22, escalation: 0.08, sopApplied: 0.35 }),
      breachHot: i === 1,
    });
  }
  return rows;
}

/** 30D — month grain: all months (last 12). */
function buildMonthRows(months) {
  const rows = [];
  for (let i = 0; i < months; i++) {
    const d = new Date(2026, 7 - i, 1); // Aug 2026 → back
    const drift = i * 0.02;
    const wave = Math.sin(i / 2.4) * 0.015;
    const volFactor = 30 * (1 - drift * 0.22 + wave);
    const inflow = Math.round(SEED.inflow * volFactor);
    const closed = Math.round(SEED.closed * volFactor * (0.96 + (i % 4) * 0.005));
    rows.push({
      date: fmtMonthLabel(d),
      inflow: fmtIN(inflow),
      closed: fmtIN(closed),
      ...metricDrift(i, { rePromise: 0.35, breach: 0.14, risk: 0.55, escalation: 0.22, sopApplied: 0.55 }),
      breachHot: i === 0,
    });
  }
  return rows;
}

/**
 * 90D — quarter-to-quarter windows (~90 days),
 * labeled like "January – April", "May – August".
 */
function buildQuarterRows(quarters) {
  const rows = [];
  // Current window ends Aug 2026 → May – August
  for (let i = 0; i < quarters; i++) {
    const end = new Date(2026, 7 - i * 3, 1); // Aug, May, Feb, Nov, …
    const start = new Date(end.getFullYear(), end.getMonth() - 3, 1);
    const drift = i * 0.025;
    const volFactor = 90 * (1 - drift * 0.2);
    const inflow = Math.round(SEED.inflow * volFactor);
    const closed = Math.round(SEED.closed * volFactor * (0.955 + (i % 3) * 0.008));
    rows.push({
      date: fmtQuarterLabel(start, end),
      inflow: fmtIN(inflow),
      closed: fmtIN(closed),
      ...metricDrift(i, { rePromise: 0.4, breach: 0.16, risk: 0.7, escalation: 0.25, sopApplied: 0.65 }),
      breachHot: i === 0,
    });
  }
  return rows;
}

function buildOpsLedger(period) {
  const key = normalizePeriod(period);

  if (key === "7D") {
    return {
      period: key,
      dateLabel: "Date",
      nowLabel: "Today",
      footerUnit: "day",
      deltaHint: "day-over-day",
      rows: withTankFlow(buildDayRows(7).map((row) => ({ ...row, period: key }))),
    };
  }
  if (key === "90D") {
    return {
      period: key,
      dateLabel: "Quarter",
      nowLabel: "Current",
      footerUnit: "quarter",
      deltaHint: "quarter-over-quarter",
      rows: withTankFlow(buildQuarterRows(8).map((row) => ({ ...row, period: key }))),
    };
  }
  // 30D — monthly (all months)
  return {
    period: "30D",
    dateLabel: "Month",
    nowLabel: "Current",
    footerUnit: "month",
    deltaHint: "month-over-month",
    rows: withTankFlow(buildMonthRows(12).map((row) => ({ ...row, period: "30D" }))),
  };
}

function scaleCountStr(str, vol) {
  const n = countNum(str);
  if (!Number.isFinite(n)) return String(str);
  return fmtIN(n * vol);
}

function scaleK(str, vol) {
  const raw = String(str).trim();
  if (raw.endsWith("k") || raw.endsWith("K")) {
    const n = parseFloat(raw);
    const scaled = n * vol;
    return scaled >= 100 ? `${Math.round(scaled)}k` : `${(Math.round(scaled * 10) / 10).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return scaleCountStr(raw, vol);
}

function nudgePct(v, nudge, digits = 1) {
  const x = Number(v) + nudge;
  const f = 10 ** digits;
  return Math.round(Math.max(0, x) * f) / f;
}

const ESC_BASE = [
  {
    s: "Delivery delayed past committed date, no proactive update",
    blastN: 28.6, blastUnit: "shipments exposed",
    conf: 94, t: "slope", sev: "breaking",
    contrib: {
      Channel: [["Voice", 58], ["Chat", 24], ["Email", 8], ["Ticket", 10]],
      Region: [["East", 44], ["North", 22], ["South", 18], ["West", 16]],
      Stage: [["In-transit", 38], ["Post-delivery", 36], ["At-hub", 16], ["Pre-ship", 10]],
    },
  },
  {
    s: "Refund not credited after return picked up",
    blastN: 12.4, blastUnit: "returns exposed",
    conf: 91, t: "slope", sev: "breaking",
    contrib: {
      Channel: [["Voice", 41], ["Chat", 28], ["Email", 22], ["Ticket", 9]],
      Region: [["East", 35], ["South", 28], ["North", 20], ["West", 17]],
      Stage: [["Post-delivery", 52], ["At-hub", 22], ["In-transit", 14], ["Pre-ship", 12]],
    },
  },
  {
    s: "Wrong / again item delivered on replacement",
    blastN: 9.1, blastUnit: "replacements exposed",
    conf: 88, t: "slope", sev: "shifting",
    contrib: {
      Channel: [["Voice", 48], ["Chat", 26], ["Email", 14], ["Ticket", 12]],
      Region: [["North", 32], ["West", 27], ["East", 22], ["South", 19]],
      Stage: [["Post-delivery", 54], ["In-transit", 20], ["At-hub", 16], ["Pre-ship", 10]],
    },
  },
  {
    s: "Installation not scheduled within SLA",
    blastN: 4.3, blastUnit: "installs exposed",
    conf: 86, t: "cliff", sev: "shifting",
    contrib: {
      Channel: [["Ticket", 38], ["Chat", 34], ["Voice", 20], ["Email", 8]],
      Region: [["South", 36], ["West", 26], ["East", 22], ["North", 16]],
      Stage: [["Pre-ship", 42], ["At-hub", 28], ["In-transit", 18], ["Post-delivery", 12]],
    },
  },
  {
    s: "Failed delivery marked without a real attempt",
    blastN: 18.4, blastUnit: "shipments exposed",
    conf: 84, t: "cliff", sev: "shifting",
    contrib: {
      Channel: [["Voice", 64], ["Chat", 18], ["Ticket", 12], ["Email", 6]],
      Region: [["East", 46], ["North", 24], ["South", 18], ["West", 12]],
      Stage: [["Post-delivery", 44], ["In-transit", 32], ["At-hub", 16], ["Pre-ship", 8]],
    },
  },
];

function scaleEsc(period) {
  const meta = PERIOD_META[normalizePeriod(period)] || PERIOD_META["30D"];
  const { vol, rateNudge } = meta;
  return ESC_BASE.map((e) => {
    const blast = scaleK(`${e.blastN}k`, vol);
    return {
      ...e,
      conf: nudgePct(e.conf, rateNudge * 0.4, 0),
      blast: `${blast} ${e.blastUnit}`,
      contrib: e.contrib,
    };
  });
}

function buildLisnEngine(period, ledgerRows) {
  const cur = ledgerRows[0];
  const inflowN = countNum(cur.inflow);
  const closedN = countNum(cur.closed);
  const classified = Math.round(inflowN * 1.018);
  const dispositions = Math.round(closedN * 0.922);
  const hiPri = Math.round(inflowN * 0.127);
  const is7 = period === "7D";
  const is90 = period === "90D";
  const grain = is7 ? "today" : is90 ? "this quarter" : "this month";
  const handled = is7 ? "today's" : is90 ? "this quarter's" : "this month's";
  const live = `live pipeline · ${period}`;

  return {
    title: "LiSN engine",
    sub: `How the LiSN engine handled ${handled} cases · classify → research → dispose`,
    live,
    cards: [
      {
        step: 1,
        accent: "#7c3aed",
        icon: "scan",
        title: "Classify Intent",
        subtitle: "what each customer wants",
        value: fmtIN(classified),
        delta: is7 ? "4.1" : is90 ? "2.6" : "3.2",
        deltaDown: false,
        deltaBad: false,
        valueLabel: `cases classified ${grain}`,
        badge: {
          ai: true,
          value: is7 ? "82%" : is90 ? "78%" : "79%",
          label: "High Conf",
        },
        secondaryValue: null,
        secondaryLabel: null,
        secondaryDelta: null,
        secondaryDeltaDown: false,
        mixTitle: "Intent mix",
        mix: [
          { label: "Delivery delay", pct: 34, c: "#5b21b6" },
          { label: "WISMO", pct: 22, c: "#7c3aed" },
          { label: "Failed attempt", pct: 14, c: "#6366f1" },
          { label: "Address", pct: 9, c: "#93c5fd" },
          { label: "Other", pct: 21, c: "#c7d2fe" },
        ],
        foot: "from Smart Assist case summary + issue codes · D-1 · no transcript.",
      },
      {
        step: 2,
        accent: "#8b5cf6",
        icon: "sop",
        title: "SOP Rule",
        subtitle: "scored against the Pre-alert rulebook → routing",
        value: is7 ? "83%" : is90 ? "80%" : "81%",
        delta: "2",
        deltaDown: false,
        deltaBad: false,
        valueLabel: "decided by deterministic rule · 17% to model",
        badge: {
          value: `+${Math.max(1, Math.round(hiPri / 1000))}K`,
          label: "through SOP",
        },
        secondaryValue: null,
        secondaryLabel: null,
        secondaryDelta: null,
        secondaryDeltaDown: false,
        mixTitle: "SOP routing outcome",
        mix: [
          { label: "SCM · P0 priority", pct: 38, c: "#7c3aed" },
          { label: "Upstream team", pct: 24, c: "#6366f1" },
          { label: "ER · reship / cancel", pct: 11, c: "#ec4899" },
          { label: "Eliminated · delivered / RTO", pct: 27, c: "#94a3b8" },
        ],
        foot: "weights ×3 Delay-in-Delivery & WMRDD (consumed in full) · ×2 Status check · IPD-breach filter · large / NL split.",
      },
      {
        step: 3,
        accent: "#14b8a6",
        icon: "dispo",
        title: "Dispositions",
        subtitle: "recommended action · agent-vetted",
        value: fmtIN(dispositions),
        delta: is7 ? "3.4" : is90 ? "2.1" : "2.8",
        deltaDown: false,
        deltaBad: false,
        valueLabel: "dispositions issued",
        badge: {
          value: is7 ? "86%" : is90 ? "83%" : "84%",
          label: "accepted",
        },
        secondaryValue: null,
        secondaryLabel: null,
        secondaryDelta: null,
        secondaryDeltaDown: false,
        mixTitle: "Disposition mix",
        mix: [
          { label: "Information + update", pct: 44, c: "#3b82f6" },
          { label: "Re-promise", pct: 28, c: "#8b5cf6" },
          { label: "Escalate", pct: 17, c: "#ec4899" },
          { label: "Information + follow-up", pct: 11, c: "#14b8a6" },
        ],
        foot: "4 dispositions · human decides and acts · read-only to Smart Assist.",
      },
    ],
  };
}

export function buildNetworkHealth(period = "30D") {
  const meta = PERIOD_META[normalizePeriod(period)] || PERIOD_META["30D"];
  const ledger = buildOpsLedger(meta.key);
  return {
    period: meta.key,
    cmpHint: meta.cmpLabel,
    ledgerDateLabel: ledger.dateLabel,
    ledgerNowLabel: ledger.nowLabel,
    ledgerFooterUnit: ledger.footerUnit,
    ledgerDeltaHint: ledger.deltaHint,
    lisnEngine: buildLisnEngine(meta.key, ledger.rows),
    opsDays: ledger.rows,
    escTop5: scaleEsc(meta.key),
  };
}
