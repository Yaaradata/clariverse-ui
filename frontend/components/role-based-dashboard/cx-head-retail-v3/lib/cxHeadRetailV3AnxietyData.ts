export type AnxietyPeriodKey = "today" | "7d" | "30d";
export type AnxietyFreshKey = "nrt" | "daily";
export type AnxietyScreenId = 1 | 3 | 4;
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
  /**
   * 24H — acute East / Furniture break day.
   * Invariants: notified ≤ high ≤ scored; avoided ≤ notified; contained ≤ high;
   * quad sums to negTotal; cov = round(notified/high*100); breachUnits ≈ (bl+bh)/1.78.
   */
  today: {
    label: "24H",
    freshDefault: "nrt",
    index: 84,
    conf: 84,
    state: "break",
    trend: [58, 61, 60, 66, 71, 74, 79, 84],
    scored: 48_000,
    high: 12_400, // 25.8% of scored
    contained: 3_100, // 25.0% of high
    deltaIndex: 9,
    ipd: 91.0,
    ipdDelta: -1.4,
    breachUnits: 4_213, // (bl+bh) / 1.78
    cov: 75, // = notified / high
    ttc: 41,
    ttContact: 68, // headroom +27 min
    funnelNotified: 9_300, // 75% of high
    funnelAvoided: 6_820, // 55% of high · 73% of notified
    optOut: 1.9,
    overComms: 0.4,
    driverPct: 62,
    driverConf: 79,
    negTotal: 18_600,
    pContact: 0.45, // = (high − avoided) / high · complements contacts-avoided 55%
    // promise-kept signals 59.7% · breach signals 40.3%
    quad: { ml: 4_200, mh: 6_900, bl: 2_300, bh: 5_200 },
    splitConf: 82,
    top10Shares: [24, 16, 11, 10, 8, 7, 7, 6, 6, 5],
    matrixAnxietyOffset: 0,
    matrixIpdOffset: 0,
    contribShift: 0,
    clusterSlaScale: 1,
  },
  /**
   * 7D — weekly operating window (~6.56× 24H volume; quieter weekend days).
   * Rates hold near 24H with slight IPD recovery and softer anxiety index.
   */
  "7d": {
    label: "7D",
    freshDefault: "nrt",
    index: 76,
    conf: 88,
    state: "shift",
    trend: [62, 70, 74, 69, 73, 77, 76],
    scored: 312_000,
    high: 81_400, // 26.1% of scored · ~6.56× 24H
    contained: 22_600, // 27.8% of high
    deltaIndex: -3,
    ipd: 92.0,
    ipdDelta: 0.8,
    breachUnits: 27_753, // (bl+bh) / 1.78
    cov: 74,
    ttc: 44,
    ttContact: 71, // headroom +27 min
    funnelNotified: 60_236, // 74% of high
    funnelAvoided: 44_770, // 55% of high · 74% of notified
    optOut: 2.1,
    overComms: 0.5,
    driverPct: 58,
    driverConf: 84,
    negTotal: 121_400, // ~6.53× 24H
    pContact: 0.45, // complements contacts-avoided 55% of high
    // promise-kept 59.3% · breach 40.7%
    quad: { ml: 28_800, mh: 43_200, bl: 15_600, bh: 33_800 },
    splitConf: 86,
    top10Shares: [20, 16, 12, 10, 9, 8, 7, 6, 6, 6],
    matrixAnxietyOffset: -2,
    matrixIpdOffset: 0.4,
    contribShift: 1,
    clusterSlaScale: 1.12,
  },
  /**
   * 30D — structural window (~27.5× 24H). Index and IPD improve as acute days dilute.
   */
  "30d": {
    label: "30D",
    freshDefault: "daily",
    index: 71,
    conf: 90,
    state: "shift",
    trend: [66, 69, 73, 72, 70, 68, 71],
    scored: 1_290_000,
    high: 341_000, // 26.4% of scored · ~27.5× 24H
    contained: 96_500, // 28.3% of high
    deltaIndex: -5,
    ipd: 93.0,
    ipdDelta: 1.9,
    breachUnits: 117_416, // (bl+bh) / 1.78
    cov: 76,
    ttc: 47,
    ttContact: 74, // headroom +27 min
    funnelNotified: 259_160, // 76% of high
    funnelAvoided: 194_370, // 57% of high · 75% of notified
    optOut: 2.0,
    overComms: 0.4,
    driverPct: 55,
    driverConf: 88,
    negTotal: 512_000, // ~27.5× 24H
    pContact: 0.43, // complements contacts-avoided 57% of high
    // promise-kept 59.2% · breach 40.8%
    quad: { ml: 122_000, mh: 181_000, bl: 66_000, bh: 143_000 },
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
  /** Secondary CX impact line under the problem title */
  impactLine: string;
  region: string;
  node: string;
  units: number;
  band: "High" | "Building";
  conf: number;
  serviceStatus: "Promise breached" | "Service breached" | "Within service window";
  tmpl: string;
  sla: number;
  evidence: readonly string[];
  carve?: boolean;
}

export const ANXIETY_CLUSTERS: readonly AnxietyCluster[] = [
  {
    id: "CL-2207",
    label: "Delivery promise missed — shipment stuck at hub",
    impactLine: "620 likely contacts · 180 escalation-risk customers",
    region: "East · Kolkata WH",
    node: "Last-mile delivery",
    units: 2140,
    band: "High",
    conf: 86,
    serviceStatus: "Promise breached",
    tmpl: "Send revised delivery ETA and callback option",
    sla: 302,
    evidence: ["Promised delivery date missed by 2d 6h", "Shipment stuck at hub for 41h", "312 customers already contacted support"],
  },
  {
    id: "CL-2213",
    label: "Delivery marked failed without an attempt",
    impactLine: "290 likely contacts · 96 escalation-risk customers",
    region: "North · Delhi Hub",
    node: "Last-mile delivery",
    units: 980,
    band: "High",
    conf: 81,
    serviceStatus: "Promise breached",
    tmpl: "Offer re-attempt slot and confirm delivery window",
    sla: 977,
    evidence: ["Failed-delivery flag with no attempt recorded", "Promise miss of 1d 3h", "COD orders 61% of this group"],
  },
  {
    id: "CL-2219",
    label: "Shipment delayed in transit",
    impactLine: "410 likely contacts · 74 customers already contacted support",
    region: "West · Bhiwandi",
    node: "In transit",
    units: 1760,
    band: "Building",
    conf: 68,
    serviceStatus: "Within service window",
    tmpl: "Send proactive delay update and revised ETA",
    sla: 1847,
    carve: true,
    evidence: ["Committed delivery window still intact", "Customer expectation ahead of promise", "Hub load elevated vs baseline"],
  },
  {
    id: "CL-2224",
    label: "Return pickup could not be scheduled",
    impactLine: "210 likely contacts · 88 escalation-risk customers",
    region: "South · Bengaluru",
    node: "Returns",
    units: 540,
    band: "High",
    conf: 79,
    serviceStatus: "Service breached",
    tmpl: "Restart return request and confirm pickup",
    sla: 107,
    evidence: ["Return request failed to schedule", "Pickup unscheduled for 2 days", "High-value electronics 44% of group"],
  },
  {
    id: "CL-2231",
    label: "Installation pending beyond 48 hours",
    impactLine: "95 likely contacts · 28 escalation-risk customers",
    region: "East · Large Appliances",
    node: "Installation",
    units: 410,
    band: "Building",
    conf: 63,
    serviceStatus: "Within service window",
    tmpl: "Confirm installation slot",
    sla: 2687,
    carve: true,
    evidence: ["Product delivered on time", "Installation still pending past 48h", "Brand visit not yet confirmed"],
  },
  {
    id: "CL-2238",
    label: "Delivery delayed by regional disruption",
    impactLine: "70 likely contacts · 22 escalation-risk customers",
    region: "West · Jalna",
    node: "In transit",
    units: 260,
    band: "Building",
    conf: 61,
    serviceStatus: "Within service window",
    tmpl: "Send disruption notice and revised ETA",
    sla: 2387,
    carve: true,
    evidence: ["Regional disruption active on lane", "Promise window not yet breached", "Weather advisory in region"],
  },
  {
    id: "CL-2244",
    label: "Open-box delivery pending",
    impactLine: "120 likely contacts · 48 escalation-risk customers",
    region: "North · Mobiles",
    node: "Last-mile delivery",
    units: 320,
    band: "High",
    conf: 77,
    serviceStatus: "Promise breached",
    tmpl: "Confirm open-box delivery slot and agent ETA",
    sla: 647,
    evidence: ["Open-box delivery required, agent unassigned", "Promise miss of 18h", "Prepaid high-value orders 92%"],
  },
  {
    id: "CL-2251",
    label: "Refund delayed after initiation",
    impactLine: "340 likely contacts · 218 customers already contacted support",
    region: "South · Chennai WH",
    node: "Post-delivery",
    units: 890,
    band: "High",
    conf: 74,
    serviceStatus: "Service breached",
    tmpl: "Send refund reference and expected credit date",
    sla: 527,
    evidence: ["Refund initiated 4 days ago, credit pending", "218 customers already contacted support", "Plus members 38% of this group"],
  },
  {
    id: "CL-2258",
    label: "Shipment rerouted due to pincode change",
    impactLine: "160 likely contacts · 41 escalation-risk customers",
    region: "Central · Nagpur",
    node: "In transit",
    units: 620,
    band: "Building",
    conf: 65,
    serviceStatus: "Within service window",
    tmpl: "Send reroute notice and revised hub ETA",
    sla: 2207,
    carve: true,
    evidence: ["Promise window still intact", "Reroute added ~18h transit", "Customers watching tracking with no update"],
  },
];

export const ANXIETY_QUEUE_OUTCOME_BASELINE = {
  atRisk: 7920,
  preventable: 2180,
  escalation: 640,
} as const;

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
    insight: {
      headline: "59% of cliff — East mobile open-box / handoff gaps",
      signal: "Missing at open-box or last-mile handoff; contacts spike in the first hour.",
      impact: "Trust-critical: refund + replacement + complaint risk before the next IPD wave.",
      action: "Approve packaging audit + hub CCTV on East mobile lanes today.",
      owner: "CX Ops · Last-mile",
      confidence: 94,
    },
  },
  {
    k: "Counterfeit suspicion",
    v: 22,
    insight: {
      headline: "31% of cliff — marketplace authenticity break",
      signal: "Counterfeit flags on marketplace electronics; trust collapses fast.",
      impact: "Seller authenticity gaps create brand and compliance risk.",
      action: "Freeze flagged SKU payouts; push authenticity check to pre-dispatch.",
      owner: "Marketplace · Compliance",
      confidence: 91,
    },
  },
  {
    k: "Account takeover",
    v: 7,
    insight: {
      headline: "Low volume, irreversible trust damage",
      signal: "Prepaid redirect / address-change patterns on high-value orders.",
      impact: "Fraud loss and permanent exit — not a normal delivery miss.",
      action: "Escalate to Risk for step-up auth on COD-to-prepaid switches.",
      owner: "Risk · Fraud",
      confidence: 88,
    },
  },
] as const;

export const ANXIETY_SLOPE_EVENTS = [
  {
    k: "Delivery delayed",
    v: 6200,
    insight: {
      headline: "55% of slope — anxiety before promise breach",
      signal: "Customers feel late while IPD often still holds.",
      impact: "Tips into Trust erosion if uncontained inside the ~42 min window.",
      action: "Send honest re-promise + revised ETA on top delay corridors.",
      owner: "CX · Promise desk",
      confidence: 92,
    },
  },
  {
    k: "Refund not credited",
    v: 2400,
    insight: {
      headline: "21% of slope — refund lag, repeat contacts",
      signal: "UPI/bank lag after refund; no bank reference or credit ETA visible.",
      impact: "Second contacts inflate containment cost on this lane.",
      action: "Surface bank-reference + credit ETA in-app on refund-initiated orders.",
      owner: "Payments · CX Ops",
      confidence: 90,
    },
  },
  {
    k: "Wrong item on replacement",
    v: 1600,
    insight: {
      headline: "14% of slope — West fashion pick errors",
      signal: "Wrong item on replacement; 44% already on a second attempt.",
      impact: "Burns replacement slots and pushes customers toward cliff language.",
      action: "Tighten WMS pick-verify on West fashion exchange orders.",
      owner: "WMS · West hubs",
      confidence: 89,
    },
  },
  {
    k: "Damaged on arrival",
    v: 1100,
    insight: {
      headline: "10% of slope — Ekart-North Tier-2 damage",
      signal: "Damaged-on-arrival concentrated on a few Tier-2 pincodes.",
      impact: "Left into BBD load, becomes a trust complaint cluster.",
      action: "Packaging audit on top 5 Tier-2 pincodes before BBD peaks.",
      owner: "Ekart-North · Packaging",
      confidence: 87,
    },
  },
  {
    k: "Hidden fee at checkout",
    v: 720,
    insight: {
      headline: "Checkout fee surprise — pre-delivery anxiety",
      signal: "Unclear fees at checkout on Plus/non-Plus mix.",
      impact: "Customers enter the journey primed to escalate on first delay.",
      action: "Clarify fee line-items at cart review.",
      owner: "Product · Checkout",
      confidence: 85,
    },
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
  contrib: AnxietyContribBreakdown;
}> = [
  {
    s: "Delivery delayed past committed date, no proactive update",
    c: 22,
    kind: "slope",
    state: "break",
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
    conf: 88,
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
  { id: 3 as const, name: "Reliability vs Anxiety" },
  { id: 4 as const, name: "Escalation Patterns", plane: "Cold" as const },
];

export const ANXIETY_SCREEN_QUESTIONS: Record<AnxietyScreenId, string> = {
  1: "Are customers about to contact us? · Are we keeping our promise? · Are we containing in time?",
  3: "",
  4: "",
};
