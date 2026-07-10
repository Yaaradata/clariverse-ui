export type AnxietyPeriodKey = "today" | "7d" | "30d";
export type AnxietyFreshKey = "nrt" | "daily";
export type AnxietyScreenId = 1 | 2 | 3 | 4;
export type AnxietyStateKey = "strong" | "shift" | "break" | "info";
export type QuadCellId = "ml" | "mh" | "bl" | "bh";

export interface AnxietyPeriodData {
  label: string;
  freshDefault: AnxietyFreshKey;
  index: number;
  conf: number;
  state: AnxietyStateKey;
  trend: readonly number[];
  high: number;
  scored: number;
  contained: number;
  deltaIndex: number;
  ipd: number;
  ipdDelta: number;
  breachUnits: number;
  cov: number;
  ttc: number;
  ttContact: number;
  funnelNotified: number;
  funnelAvoided: number;
  optOut: number;
  overComms: number;
  driverPct: number;
  driverConf: number;
  negTotal: number;
  pContact: number;
  quad: Record<QuadCellId, number>;
  splitConf: number;
  top10Shares: readonly number[];
  matrixAnxietyOffset: number;
  matrixIpdOffset: number;
  contribShift: number;
  clusterSlaScale: number;
}

export const ANXIETY_PERIODS: Record<AnxietyPeriodKey, AnxietyPeriodData> = {
  today: {
    label: "Today",
    freshDefault: "nrt",
    index: 84,
    conf: 84,
    state: "break",
    trend: [58, 61, 60, 66, 71, 74, 79, 84],
    high: 12400,
    scored: 47800,
    contained: 3100,
    deltaIndex: 9,
    ipd: 91,
    ipdDelta: -1.4,
    breachUnits: 4210,
    cov: 75,
    ttc: 41,
    ttContact: 68,
    funnelNotified: 9300,
    funnelAvoided: 6900,
    optOut: 1.9,
    overComms: 0.4,
    driverPct: 62,
    driverConf: 79,
    negTotal: 18600,
    pContact: 0.71,
    quad: { ml: 4200, mh: 6900, bl: 2300, bh: 5200 },
    splitConf: 82,
    top10Shares: [24, 16, 11, 10, 8, 7, 7, 6, 6, 5],
    matrixAnxietyOffset: 0,
    matrixIpdOffset: 0,
    contribShift: 0,
    clusterSlaScale: 1,
  },
  "7d": {
    label: "7 days",
    freshDefault: "nrt",
    index: 76,
    conf: 88,
    state: "shift",
    trend: [62, 70, 74, 69, 73, 77, 76],
    high: 81400,
    scored: 312000,
    contained: 22600,
    deltaIndex: -3,
    ipd: 92,
    ipdDelta: 0.8,
    breachUnits: 23100,
    cov: 74,
    ttc: 44,
    ttContact: 71,
    funnelNotified: 60200,
    funnelAvoided: 44900,
    optOut: 2.1,
    overComms: 0.5,
    driverPct: 58,
    driverConf: 84,
    negTotal: 121400,
    pContact: 0.69,
    quad: { ml: 28800, mh: 43200, bl: 15600, bh: 33800 },
    splitConf: 86,
    top10Shares: [20, 16, 12, 10, 9, 8, 7, 6, 6, 6],
    matrixAnxietyOffset: -2,
    matrixIpdOffset: 0.4,
    contribShift: 1,
    clusterSlaScale: 1.12,
  },
  "30d": {
    label: "30 days",
    freshDefault: "daily",
    index: 71,
    conf: 90,
    state: "shift",
    trend: [66, 69, 73, 72, 70, 68, 71],
    high: 341000,
    scored: 1290000,
    contained: 96500,
    deltaIndex: -5,
    ipd: 93,
    ipdDelta: 1.9,
    breachUnits: 92800,
    cov: 76,
    ttc: 47,
    ttContact: 74,
    funnelNotified: 259000,
    funnelAvoided: 195000,
    optOut: 2.0,
    overComms: 0.4,
    driverPct: 55,
    driverConf: 88,
    negTotal: 512000,
    pContact: 0.65,
    quad: { ml: 122000, mh: 181000, bl: 66000, bh: 143000 },
    splitConf: 88,
    top10Shares: [18, 15, 13, 11, 10, 9, 8, 7, 5, 4],
    matrixAnxietyOffset: -4,
    matrixIpdOffset: 0.8,
    contribShift: -1,
    clusterSlaScale: 1.28,
  },
};

export const ANXIETY_PERIOD_BASELINE = ANXIETY_PERIODS.today;

export function anxietyPeriodScale(
  periodHigh: number,
  baselineHigh: number = ANXIETY_PERIOD_BASELINE.high,
): number {
  return periodHigh / baselineHigh;
}

export function scaleAnxietyUnits(units: number, periodHigh: number): number {
  return Math.max(1, Math.round(units * anxietyPeriodScale(periodHigh)));
}

export function scaleAnxietyNegUnits(units: number, negTotal: number): number {
  return Math.max(1, Math.round(units * (negTotal / ANXIETY_PERIOD_BASELINE.negTotal)));
}

export const ANXIETY_NODE_SPLIT = [
  { key: "Last-mile", prop: 0.55 },
  { key: "In-transit", prop: 0.25 },
  { key: "Returns", prop: 0.125 },
  { key: "Installation", prop: 0.075 },
] as const;

export const ANXIETY_REGION_SPLIT = [
  { key: "East", prop: 0.62, hub: "Kolkata WH", pos: { l: 74, t: 40 } },
  { key: "North", prop: 0.18, hub: "Delhi Hub", pos: { l: 44, t: 14 } },
  { key: "West", prop: 0.1, hub: "Bhiwandi", pos: { l: 24, t: 52 } },
  { key: "South", prop: 0.1, hub: "Bengaluru", pos: { l: 46, t: 82 } },
] as const;

export const ANXIETY_CAT_RELIABILITY = [
  { k: "Fashion", v: 95.2 },
  { k: "Mobiles", v: 93.1 },
  { k: "Grocery", v: 90.0 },
  { k: "Beauty", v: 91.4 },
  { k: "Home & Kitchen", v: 88.9 },
  { k: "Electronics", v: 89.6 },
  { k: "Large Appliances", v: 86.4 },
  { k: "Furniture", v: 82.7 },
  { k: "Sports", v: 87.8 },
] as const;

export interface AnxietyCluster {
  id: string;
  label: string;
  region: string;
  node: string;
  units: number;
  band: "High" | "Building";
  conf: number;
  rel: "Breached" | "Met";
  tmpl: string;
  sla: number;
  evidence: readonly string[];
  carve?: boolean;
}

export const ANXIETY_CLUSTERS: readonly AnxietyCluster[] = [
  {
    id: "CL-2207",
    label: "IPD breach · stuck-at-hub",
    region: "East · Kolkata WH",
    node: "Last-mile",
    units: 2140,
    band: "High",
    conf: 86,
    rel: "Breached",
    tmpl: "Honest re-promise + revised ETA",
    sla: 735,
    evidence: ["IPD 04 Jul missed by 2d 6h", "Shipment stuck-at-hub 41h", "Prior repeat-contact on 312 units"],
  },
  {
    id: "CL-2213",
    label: "Failed delivery marked, no attempt",
    region: "North · Delhi Hub",
    node: "Last-mile",
    units: 980,
    band: "High",
    conf: 81,
    rel: "Breached",
    tmpl: "Re-attempt schedule + slot pick",
    sla: 1410,
    evidence: ["Attempt-failed flag with 0s geo-dwell", "IPD miss 1d 3h", "COD orders 61%"],
  },
  {
    id: "CL-2219",
    label: "In-transit delay · BBD load",
    region: "West · Bhiwandi",
    node: "In-transit",
    units: 1760,
    band: "Building",
    conf: 68,
    rel: "Met",
    tmpl: "Proactive status reassurance (no breach)",
    sla: 2280,
    carve: true,
    evidence: ["Committed 7-day SLA intact (Day 4)", "Customer-desired 3-day expectation gap", "Hub load 1.8× baseline"],
  },
  {
    id: "CL-2224",
    label: "Return pickup tech-failure",
    region: "South · Bengaluru",
    node: "Returns",
    units: 540,
    band: "High",
    conf: 79,
    rel: "Breached",
    tmpl: "Return re-initiation + confirmation",
    sla: 540,
    evidence: ["Return-creation API failure code RT-503", "Pickup unscheduled 2d", "High-value electronics 44%"],
  },
  {
    id: "CL-2231",
    label: "Installation pending > 48h",
    region: "East · Large Appliances",
    node: "Installation",
    units: 410,
    band: "Building",
    conf: 63,
    rel: "Met",
    tmpl: "Installation slot confirmation",
    sla: 3120,
    carve: true,
    evidence: ["Delivered on-time (IPD met)", "Installation SLA Day 2 of 3", "Brand-visit pending flag"],
  },
  {
    id: "CL-2238",
    label: "Embargo hold · regional disruption",
    region: "West · Jalna",
    node: "In-transit",
    units: 260,
    band: "Building",
    conf: 61,
    rel: "Met",
    tmpl: "Regional disruption honest notice",
    sla: 2820,
    carve: true,
    evidence: ["Embargo flag active on lane", "IPD not yet breached", "Weather advisory in region"],
  },
  {
    id: "CL-2244",
    label: "Open-box delivery pending",
    region: "North · Mobiles",
    node: "Last-mile",
    units: 320,
    band: "High",
    conf: 77,
    rel: "Breached",
    tmpl: "OBD slot + agent ETA",
    sla: 1080,
    evidence: ["OBD required, agent unassigned", "IPD miss 18h", "Prepaid high-value 92%"],
  },
  {
    id: "CL-2251",
    label: "Refund initiated · bank lag",
    region: "South · Chennai WH",
    node: "Post-delivery",
    units: 890,
    band: "High",
    conf: 74,
    rel: "Breached",
    tmpl: "Refund reference + credit ETA push",
    sla: 960,
    evidence: ["Refund initiated 4d ago, UPI unsettled", "Repeat contact on 218 units", "Plus members 38%"],
  },
  {
    id: "CL-2258",
    label: "Pincode reroute · lane shift",
    region: "Central · Nagpur",
    node: "In-transit",
    units: 620,
    band: "Building",
    conf: 65,
    rel: "Met",
    tmpl: "Lane-shift notice + revised hub ETA",
    sla: 2640,
    carve: true,
    evidence: ["Committed IPD still intact (Day 5 of 7)", "Reroute added 18h transit", "Customer anxiety on tracking gap"],
  },
  {
    id: "CL-2265",
    label: "COD verification stall",
    region: "East · Patna",
    node: "Last-mile",
    units: 470,
    band: "High",
    conf: 82,
    rel: "Breached",
    tmpl: "COD confirm call + re-attempt window",
    sla: 720,
    evidence: ["3+ failed IVR verification attempts", "Agent unreachable 26h", "High-value COD 71%"],
  },
];

export const ANXIETY_QUAD_CELLS: Record<
  QuadCellId,
  {
    name: string;
    tone: AnxietyStateKey;
    note: string;
    drivers: readonly (readonly [string, number])[];
  }
> = {
  ml: {
    name: "Healthy — no action",
    tone: "strong",
    note: "Promise kept, low anxiety.",
    drivers: [
      ["On-time last-mile", 48],
      ["Prepaid, in-SLA", 31],
      ["Standard grocery", 21],
    ],
  },
  mh: {
    name: "Proactive reassurance — carve OUT of trust",
    tone: "shift",
    note: "Promise kept, customer anxious (7-vs-3-day). Contain, don't resolve.",
    drivers: [
      ["In-transit, SLA intact", 44],
      ["BBD hub load", 33],
      ["Desired-faster-than-promised", 23],
    ],
  },
  bl: {
    name: "Pre-empt — honest re-promise before they notice",
    tone: "info",
    note: "Reliability slipping, anxiety not yet built.",
    drivers: [
      ["Silent IPD slip", 52],
      ["Installation SLA drift", 27],
      ["Return schedule lag", 21],
    ],
  },
  bh: {
    name: "Trust erosion + hot escalation",
    tone: "break",
    note: "Promise broken and anxiety high. Resolve fast + route to accountability.",
    drivers: [
      ["IPD miss + stuck-at-hub", 46],
      ["Failed attempt, no re-attempt", 29],
      ["Refund not credited", 25],
    ],
  },
};

export const ANXIETY_CLIFF_EVENTS = [
  {
    k: "Item missing",
    v: 41,
    insight:
      "59% of cliff incidents — open-box and last-mile handoff gaps in East mobiles. Route packaging audit + hub CCTV review before the next IPD wave.",
  },
  {
    k: "Counterfeit suspicion",
    v: 22,
    insight:
      "Trust cliff on marketplace electronics — 31% of cliff volume. Freeze seller payouts on flagged SKUs and push authenticity verification to pre-dispatch.",
  },
  {
    k: "Account takeover",
    v: 7,
    insight:
      "Low volume but irreversible damage — prepaid redirect and address-change fraud. Escalate to Risk for step-up auth on high-value COD-to-prepaid switches.",
  },
] as const;

export const ANXIETY_SLOPE_EVENTS = [
  {
    k: "Delivery delayed",
    v: 6200,
    insight:
      "55% of slope signals — anxiety-heavy while IPD often still holds. Fire honest re-promise + revised ETA before the ~42 min contact window closes.",
  },
  {
    k: "Refund not credited",
    v: 2400,
    insight:
      "21% of slope — UPI/bank lag drives repeat contacts even when refund is initiated. Surface bank-reference + credit ETA in-app to cut second contacts by ~38%.",
  },
  {
    k: "Wrong item on replacement",
    v: 1600,
    insight:
      "14% of slope — replacement pick errors in West fashion. Tighten WMS pick-verify on exchange orders; 44% of cases are second-attempt replacements.",
  },
  {
    k: "Damaged on arrival",
    v: 1100,
    insight:
      "10% of slope — Ekart-North route into Tier-2 pincodes. Packaging + handling audit on top 5 pincodes before BBD load peaks.",
  },
  {
    k: "Hidden fee at checkout",
    v: 720,
    insight:
      "Checkout surprise fees on Plus/non-Plus mix — anxiety before delivery breach. Clarify fee line-items at cart review to pre-empt escalation to voice.",
  },
] as const;

export type AnxietyContribDim = "Channel" | "Region" | "Stage";

export type AnxietyContribBreakdown = Record<
  AnxietyContribDim,
  readonly (readonly [string, number])[]
>;

export const ANXIETY_TOP10: ReadonlyArray<{
  s: string;
  c: number;
  kind: "slope" | "cliff";
  state: AnxietyStateKey;
  chronic?: boolean;
  contrib: AnxietyContribBreakdown;
}> = [
  {
    s: "Delivery delayed past committed date, no proactive update",
    c: 22,
    kind: "slope",
    state: "break",
    chronic: true,
    contrib: {
      Channel: [
        ["Voice", 58],
        ["Chat", 24],
        ["Email", 8],
        ["Ticket", 10],
      ],
      Region: [
        ["East", 44],
        ["North", 22],
        ["South", 18],
        ["West", 16],
      ],
      Stage: [
        ["In-transit", 38],
        ["Post-delivery", 36],
        ["At-hub", 16],
        ["Pre-ship", 10],
      ],
    },
  },
  {
    s: "Refund not credited after return picked up",
    c: 15,
    kind: "slope",
    state: "break",
    chronic: true,
    contrib: {
      Channel: [
        ["Voice", 41],
        ["Chat", 28],
        ["Email", 22],
        ["Ticket", 9],
      ],
      Region: [
        ["East", 35],
        ["South", 28],
        ["North", 20],
        ["West", 17],
      ],
      Stage: [
        ["Post-delivery", 52],
        ["At-hub", 22],
        ["In-transit", 14],
        ["Pre-ship", 12],
      ],
    },
  },
  {
    s: "Wrong / again item delivered on replacement",
    c: 11,
    kind: "slope",
    state: "shift",
    contrib: {
      Channel: [
        ["Voice", 48],
        ["Chat", 26],
        ["Email", 14],
        ["Ticket", 12],
      ],
      Region: [
        ["North", 32],
        ["West", 27],
        ["East", 22],
        ["South", 19],
      ],
      Stage: [
        ["Post-delivery", 54],
        ["In-transit", 20],
        ["At-hub", 16],
        ["Pre-ship", 10],
      ],
    },
  },
  {
    s: "Installation not scheduled within SLA",
    c: 9,
    kind: "slope",
    state: "shift",
    contrib: {
      Channel: [
        ["Ticket", 38],
        ["Chat", 34],
        ["Voice", 20],
        ["Email", 8],
      ],
      Region: [
        ["South", 36],
        ["West", 26],
        ["East", 22],
        ["North", 16],
      ],
      Stage: [
        ["Pre-ship", 42],
        ["At-hub", 28],
        ["In-transit", 18],
        ["Post-delivery", 12],
      ],
    },
  },
  {
    s: "Failed delivery marked without a real attempt",
    c: 8,
    kind: "slope",
    state: "shift",
    chronic: true,
    contrib: {
      Channel: [
        ["Voice", 64],
        ["Chat", 18],
        ["Ticket", 12],
        ["Email", 6],
      ],
      Region: [
        ["East", 46],
        ["North", 24],
        ["South", 18],
        ["West", 12],
      ],
      Stage: [
        ["Post-delivery", 44],
        ["In-transit", 32],
        ["At-hub", 16],
        ["Pre-ship", 8],
      ],
    },
  },
  {
    s: "Open-box delivery denied at doorstep",
    c: 7,
    kind: "slope",
    state: "shift",
    contrib: {
      Channel: [
        ["Chat", 42],
        ["Voice", 35],
        ["Ticket", 15],
        ["Email", 8],
      ],
      Region: [
        ["East", 48],
        ["South", 22],
        ["North", 18],
        ["West", 12],
      ],
      Stage: [
        ["At-hub", 40],
        ["Post-delivery", 34],
        ["In-transit", 16],
        ["Pre-ship", 10],
      ],
    },
  },
  {
    s: "COD amount mismatch at delivery",
    c: 6,
    kind: "slope",
    state: "shift",
    contrib: {
      Channel: [
        ["Voice", 71],
        ["Chat", 17],
        ["Ticket", 8],
        ["Email", 4],
      ],
      Region: [
        ["West", 34],
        ["North", 28],
        ["East", 22],
        ["South", 16],
      ],
      Stage: [
        ["Post-delivery", 62],
        ["In-transit", 22],
        ["At-hub", 10],
        ["Pre-ship", 6],
      ],
    },
  },
  {
    s: "Return pickup repeatedly rescheduled",
    c: 6,
    kind: "slope",
    state: "shift",
    contrib: {
      Channel: [
        ["Chat", 36],
        ["Ticket", 32],
        ["Voice", 22],
        ["Email", 10],
      ],
      Region: [
        ["South", 30],
        ["East", 28],
        ["North", 24],
        ["West", 18],
      ],
      Stage: [
        ["Pre-ship", 36],
        ["At-hub", 30],
        ["In-transit", 22],
        ["Post-delivery", 12],
      ],
    },
  },
  {
    s: "Hidden fee / price change vs listing",
    c: 5,
    kind: "slope",
    state: "shift",
    contrib: {
      Channel: [
        ["Email", 38],
        ["Ticket", 30],
        ["Chat", 22],
        ["Voice", 10],
      ],
      Region: [
        ["North", 29],
        ["East", 27],
        ["West", 24],
        ["South", 20],
      ],
      Stage: [
        ["Pre-ship", 48],
        ["Post-delivery", 28],
        ["In-transit", 14],
        ["At-hub", 10],
      ],
    },
  },
  {
    s: "Counterfeit suspicion on branded item",
    c: 3,
    kind: "cliff",
    state: "break",
    chronic: false,
    contrib: {
      Channel: [
        ["Voice", 54],
        ["Chat", 26],
        ["Email", 14],
        ["Ticket", 6],
      ],
      Region: [
        ["East", 52],
        ["North", 22],
        ["South", 14],
        ["West", 12],
      ],
      Stage: [
        ["Post-delivery", 68],
        ["In-transit", 18],
        ["At-hub", 10],
        ["Pre-ship", 4],
      ],
    },
  },
];

/** Roll-up contribution across all top-10 statements (unselected view). */
export const ANXIETY_CONTRIB: AnxietyContribBreakdown = {
  Channel: [
    ["Voice", 52],
    ["Chat", 22],
    ["Email", 12],
    ["Ticket", 14],
  ],
  Region: [
    ["East", 41],
    ["North", 24],
    ["South", 19],
    ["West", 16],
  ],
  Stage: [
    ["Post-delivery", 48],
    ["In-transit", 24],
    ["At-hub", 18],
    ["Pre-ship", 10],
  ],
} as const;

export const ANXIETY_IMPERFECTIONS = [
  {
    title: "Jalna in-transit embargo — escalation creep +38% w/w",
    kind: "inference" as const,
    conf: 74,
    escalationCount: 12,
    evidenceDays: 5,
  },
  {
    title: "Kolkata WH open-box mis-tag — new failure code appearing",
    kind: "knowledge" as const,
    ticketCount: 8,
  },
] as const;

function normalizeContribRows(rows: readonly (readonly [string, number])[]): [string, number][] {
  const adjusted = rows.map(([k, v]) => [k, Math.max(1, v)] as [string, number]);
  const sum = adjusted.reduce((acc, [, v]) => acc + v, 0);
  if (sum <= 0) return adjusted;
  return adjusted.map(([k, v]) => [k, Math.round((v / sum) * 100)] as [string, number]);
}

export function shiftContribBreakdown(
  breakdown: AnxietyContribBreakdown,
  shift: number,
): AnxietyContribBreakdown {
  if (shift === 0) return breakdown;

  return {
    Channel: normalizeContribRows(
      breakdown.Channel.map(([k, v], i) => [k, Math.max(2, v + (i % 2 === 0 ? shift : -shift))] as [string, number]),
    ),
    Region: normalizeContribRows(
      breakdown.Region.map(([k, v], i) => [k, Math.max(2, v + (i % 2 === 0 ? shift : -shift))] as [string, number]),
    ),
    Stage: normalizeContribRows(
      breakdown.Stage.map(([k, v], i) => [k, Math.max(2, v + (i % 2 === 0 ? shift : -shift))] as [string, number]),
    ),
  };
}

function normalizeTop10Shares(shares: readonly number[]): number[] {
  const sum = shares.reduce((acc, v) => acc + v, 0);
  if (sum <= 0) return shares.map(() => 0);
  if (sum === 100) return [...shares];

  const scaled = shares.map((v) => Math.max(1, Math.round((v / sum) * 100)));
  const scaledSum = scaled.reduce((acc, v) => acc + v, 0);
  const drift = 100 - scaledSum;
  if (drift !== 0) {
    const maxIdx = scaled.indexOf(Math.max(...scaled));
    scaled[maxIdx] = Math.max(1, scaled[maxIdx] + drift);
  }
  return scaled;
}

export function getEscalationTop10(d: AnxietyPeriodData) {
  const shares = normalizeTop10Shares(d.top10Shares);
  return ANXIETY_TOP10.map((item, i) => ({
    ...item,
    c: shares[i] ?? item.c,
    contrib: shiftContribBreakdown(item.contrib, d.contribShift),
  }));
}

export function getQuadDriversForPeriod(cellId: QuadCellId, d: AnxietyPeriodData): [string, number][] {
  const drivers = ANXIETY_QUAD_CELLS[cellId].drivers;
  if (d.contribShift === 0) {
    return drivers.map(([k, v]) => [k, v] as [string, number]);
  }
  return normalizeContribRows(
    drivers.map(([k, v], i) => [k, Math.max(5, v + (i % 2 === 0 ? d.contribShift : -d.contribShift))] as [string, number]),
  );
}

export function adjustMatrixAnxietyScore(score: number, d: AnxietyPeriodData): number {
  return Math.max(0, Math.min(100, Math.round(score + d.matrixAnxietyOffset)));
}

export function adjustMatrixIpdMet(ipdMet: number, d: AnxietyPeriodData): number {
  return Math.max(0, Math.min(100, Math.round((ipdMet + d.matrixIpdOffset) * 10) / 10));
}

export function getImperfectionEvidence(
  imperfection: (typeof ANXIETY_IMPERFECTIONS)[number],
  d: AnxietyPeriodData,
): string {
  const scale = d.negTotal / ANXIETY_PERIOD_BASELINE.negTotal;
  if ("escalationCount" in imperfection) {
    const count = Math.max(1, Math.round(imperfection.escalationCount * scale));
    return `${count} escalations in ${imperfection.evidenceDays} days on a lane with no prior pattern; all embargo-tagged.`;
  }
  const tickets = Math.max(1, Math.round(imperfection.ticketCount * scale));
  return `${tickets} tickets, identical WH + SKU class + OBD flag. Deterministic — same signature.`;
}

export type AnxietyNodeDrillTab = "pin" | "category" | "market";

export const ANXIETY_NODE_DRILL: Record<
  string,
  Record<AnxietyNodeDrillTab, readonly (readonly [string, number, number])[]>
> = {
  "Last-mile": {
    pin: [
      ["700001 · Kolkata GPO", 1240, 88],
      ["800001 · Patna", 980, 84],
      ["834001 · Ranchi", 760, 82],
      ["110001 · Delhi", 640, 79],
      ["560001 · Bengaluru", 420, 74],
    ],
    category: [
      ["Large Appliances", 2010, 87],
      ["Mobiles", 1680, 83],
      ["Furniture", 1240, 81],
      ["Home & Kitchen", 920, 76],
      ["Fashion", 980, 71],
      ["Electronics", 740, 69],
      ["Grocery", 610, 66],
      ["Beauty", 520, 63],
      ["Sports", 380, 59],
    ],
    market: [
      ["Marketplace (3P sellers)", 4620, 85],
      ["Flipkart (1P / F-Assured)", 2230, 74],
    ],
  },
  "In-transit": {
    pin: [
      ["431203 · Jalna lane", 640, 71],
      ["421302 · Bhiwandi", 560, 69],
      ["781001 · Guwahati", 420, 67],
      ["700001 · Kolkata", 380, 66],
    ],
    category: [
      ["Large Appliances", 1120, 72],
      ["Furniture", 820, 70],
      ["Electronics", 680, 68],
      ["Home & Kitchen", 560, 67],
      ["Mobiles", 640, 66],
      ["Fashion", 520, 61],
      ["Sports", 340, 58],
      ["Beauty", 290, 56],
      ["Grocery", 260, 54],
    ],
    market: [
      ["Marketplace (3P sellers)", 1980, 70],
      ["Flipkart (1P / F-Assured)", 1120, 64],
    ],
  },
  Returns: {
    pin: [
      ["560001 · Bengaluru", 410, 79],
      ["500001 · Hyderabad", 360, 76],
      ["600001 · Chennai", 300, 74],
    ],
    category: [
      ["Mobiles", 620, 80],
      ["Large Appliances", 480, 77],
      ["Electronics", 410, 74],
      ["Fashion", 450, 68],
      ["Beauty", 320, 66],
      ["Home & Kitchen", 280, 64],
      ["Sports", 190, 62],
    ],
    market: [
      ["Marketplace (3P sellers)", 1010, 78],
      ["Flipkart (1P / F-Assured)", 540, 71],
    ],
  },
  Installation: {
    pin: [
      ["700001 · Kolkata", 280, 64],
      ["110001 · Delhi", 240, 62],
      ["380001 · Ahmedabad", 180, 61],
    ],
    category: [
      ["Large Appliances", 620, 66],
      ["Furniture", 280, 62],
      ["Home & Kitchen", 220, 58],
      ["Electronics", 160, 55],
    ],
    market: [
      ["Marketplace (3P sellers)", 560, 65],
      ["Flipkart (1P / F-Assured)", 340, 60],
    ],
  },
};

export const ANXIETY_SCREENS = [
  { id: 1 as const, name: "Anxiety Command", plane: "Hot" as const },
  { id: 2 as const, name: "Containment Queue", plane: "Hot" as const },
  { id: 3 as const, name: "Reliability vs Anxiety", plane: "Both" as const },
  { id: 4 as const, name: "Escalation Patterns", plane: "Cold" as const },
];

export const ANXIETY_SCREEN_QUESTIONS: Record<AnxietyScreenId, string> = {
  1: "Are customers about to contact us? · Are we keeping our promise? · Are we containing in time?",
  2: "",
  3: "",
  4: "",
};
