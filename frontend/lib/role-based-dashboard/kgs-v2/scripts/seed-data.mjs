import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = join(dirname(fileURLToPath(import.meta.url)), "../data");
const w = (name, obj) =>
  writeFileSync(join(dir, name), `${JSON.stringify(obj, null, 2)}\n`);

const weeks13 = Array.from({ length: 13 }, (_, i) => `W${i + 1}`);
const north = [90, 89, 88, 88, 87, 88, 88, 87, 86, 82, 78, 74, 71];
const south = [91, 90, 92, 91, 90, 91, 92, 91, 90, 91, 92, 91, 91];
const east = [89, 88, 90, 89, 88, 89, 90, 88, 89, 90, 89, 88, 89];
const west = [90, 91, 90, 92, 91, 90, 91, 92, 91, 90, 91, 92, 91];
const sea = [86, 87, 88, 87, 88, 89, 88, 89, 90, 90, 91, 91, 92];

const distributors = [
  {
    id: "D-N-04",
    region: "North",
    ordersDue: 42,
    kept: 62,
    slip: 7.2,
    complaints: 11,
    cause: "allocation queue N-2",
  },
  {
    id: "D-N-07",
    region: "North",
    ordersDue: 38,
    kept: 66,
    slip: 6.4,
    complaints: 9,
    cause: "allocation queue N-2",
  },
  {
    id: "D-N-11",
    region: "North",
    ordersDue: 35,
    kept: 69,
    slip: 5.8,
    complaints: 8,
    cause: "last-mile {{place:Gurugram hub}}",
  },
  {
    id: "D-N-02",
    region: "North",
    ordersDue: 28,
    kept: 78,
    slip: 3.1,
    complaints: 3,
    cause: "order change",
  },
  {
    id: "D-E-03",
    region: "East",
    ordersDue: 31,
    kept: 84,
    slip: 2.4,
    complaints: 2,
    cause: "backorder",
  },
  {
    id: "D-E-06",
    region: "East",
    ordersDue: 27,
    kept: 86,
    slip: 2.1,
    complaints: 2,
    cause: "allocation",
  },
  {
    id: "D-S-01",
    region: "South",
    ordersDue: 44,
    kept: 90,
    slip: 1.6,
    complaints: 1,
    cause: "on target",
  },
  {
    id: "D-S-05",
    region: "South",
    ordersDue: 36,
    kept: 91,
    slip: 1.4,
    complaints: 1,
    cause: "on target",
  },
  {
    id: "D-S-02",
    region: "South",
    ordersDue: 40,
    kept: 92,
    slip: 1.2,
    complaints: 1,
    cause: "on target",
  },
  {
    id: "D-W-08",
    region: "West",
    ordersDue: 33,
    kept: 91,
    slip: 1.5,
    complaints: 1,
    cause: "on target",
  },
  {
    id: "D-W-09",
    region: "West",
    ordersDue: 29,
    kept: 93,
    slip: 1.1,
    complaints: 0,
    cause: "on target",
  },
  {
    id: "D-SEA-10",
    region: "SEA",
    ordersDue: 26,
    kept: 94,
    slip: 0.9,
    complaints: 0,
    cause: "improving",
  },
].map((d) => ({
  distributor: `{{partner:${d.id}}}`,
  distributorId: d.id,
  region: `{{region:${d.region}}}`,
  regionId: d.region,
  ordersDue: d.ordersDue,
  keptVsOriginalPct: d.kept,
  averageSlipDays: d.slip,
  complaints4w: d.complaints,
  trend: d.kept < 75 ? "down" : d.kept > 90 ? "up" : "flat",
  topCandidateCause: d.cause,
}));

w("promise.json", {
  title: "Are we keeping our promises?",
  kpis: [
    { key: "orders_due", label: "Orders due this quarter", value: 1180 },
    {
      key: "kept_original",
      label: "Promise kept vs original date",
      value: 82,
      unit: "%",
    },
    {
      key: "kept_revised",
      label: "Promise kept vs revised date",
      value: 93,
      unit: "%",
    },
    { key: "avg_slip", label: "Average slip", value: 4.1, unit: "days" },
    {
      key: "complaints_week",
      label: "Delivery complaints this week",
      value: 38,
    },
  ],
  weeklyByRegion: {
    weeks: weeks13,
    targetPct: 90,
    series: [
      { region: "{{region:North}}", regionId: "North", values: north },
      { region: "{{region:South}}", regionId: "South", values: south },
      { region: "{{region:East}}", regionId: "East", values: east },
      { region: "{{region:West}}", regionId: "West", values: west },
      { region: "{{region:SEA}}", regionId: "SEA", values: sea },
    ],
  },
  distributors,
  saidVsShows: [
    {
      phrase: "You confirmed Monday, now it shows the 22nd",
      partner: "{{partner:D-N-04}}",
      orderFacts: "original 15 Sep, revised 22 Sep, allocation queue N-2",
    },
    {
      phrase: "Third order this month where the date moved after confirmation",
      partner: "{{partner:D-N-07}}",
      orderFacts: "original 10 Sep, revised 18 Sep, allocation queue N-2",
    },
    {
      phrase:
        "Material reached the hub on time, but local delivery took five days",
      partner: "{{partner:D-N-11}}",
      orderFacts:
        "hub arrival on time · last-mile 5 days · {{place:Gurugram hub}}",
    },
    {
      phrase:
        "Sales and support are giving us different dates. Which one is right?",
      partner: "{{partner:D-N-04}}",
      orderFacts: "ERP original 20 Sep · help desk quoted 25 Sep",
    },
  ],
  causeSplitByRegion: [
    {
      regionId: "North",
      region: "{{region:North}}",
      kgs: { allocation: 28, backorder: 0, orderChange: 7 },
      lastMile: 11,
    },
    {
      regionId: "South",
      region: "{{region:South}}",
      kgs: { allocation: 4, backorder: 2, orderChange: 1 },
      lastMile: 3,
    },
    {
      regionId: "East",
      region: "{{region:East}}",
      kgs: { allocation: 5, backorder: 3, orderChange: 2 },
      lastMile: 2,
    },
    {
      regionId: "West",
      region: "{{region:West}}",
      kgs: { allocation: 3, backorder: 1, orderChange: 1 },
      lastMile: 2,
    },
    {
      regionId: "SEA",
      region: "{{region:SEA}}",
      kgs: { allocation: 2, backorder: 1, orderChange: 0 },
      lastMile: 1,
    },
  ],
  signalWall: [
    {
      id: "PR-01",
      title: "North promises slipping",
      severity: "S2",
      hero: true,
      cta: "Open signal →",
    },
    {
      id: "PR-02",
      title: "Last-mile delays, {{place:Gurugram hub}}",
      severity: "S3",
      hero: false,
      cta: "Open signal →",
    },
    {
      id: "SEA-IMPROVING",
      title: "SEA improving",
      severity: "improving",
      hero: false,
      cta: null,
    },
  ],
  signalWallFooter: { critical: 0, needsAction: 2, improving: 1 },
  evidenceSummary: {
    mainSignal: "{{region:North}} promise kept 71% vs its own 88%.",
    whatChanged: "Allocation queue N-2 re-sequenced in week 35 (candidate).",
    decideFirst: "Confirm dates for the 2 projects with fire NOC inspections.",
  },
});

const featuredSnippets = [
  {
    id: "sn-01",
    channel: "email",
    channelLabel: "Email",
    partnerId: "{{partner:D-N-04}}",
    localDateLabel: "8 Sep",
    text: "You confirmed dispatch for Monday. The system now shows the 22nd. Our site handover is on the 25th.",
    featured: true,
    featuredOrder: 1,
  },
  {
    id: "sn-02",
    channel: "call",
    channelLabel: "Call",
    partnerId: "{{partner:D-N-07}}",
    localDateLabel: "11 Sep",
    text: "Third order this month where the date moved after confirmation.",
    featured: true,
    featuredOrder: 2,
  },
  {
    id: "sn-03",
    channel: "case",
    channelLabel: "Case note",
    partnerId: "{{partner:D-N-04}}",
    localDateLabel: "15 Sep",
    text: "Builder has escalated. Detectors needed before the fire NOC inspection.",
    featured: true,
    featuredOrder: 3,
  },
  {
    id: "sn-04",
    channel: "email",
    channelLabel: "Email",
    partnerId: "{{partner:D-N-11}}",
    localDateLabel: "17 Sep",
    text: "Material reached the {{place:Gurugram}} hub on time, but local delivery took five days.",
    featured: true,
    featuredOrder: 4,
  },
  {
    id: "sn-05",
    channel: "case",
    channelLabel: "Case note",
    partnerId: "{{partner:D-N-04}}",
    localDateLabel: "21 Sep",
    text: "Sales and support are giving us different dates. Which one is right?",
    featured: true,
    featuredOrder: 5,
  },
];

const extraTexts = [
  "Please lock one date for the inspection project.",
  "We held the crew for a day waiting on panels.",
  "Revised date keeps moving without a note on the order.",
  "Can ops confirm allocation for family A this week?",
  "Site access was fine; the delay was after the hub.",
  "We still show Monday on our side.",
  "Partner asked again for a written confirmation.",
  "Two lines on the same PO have different revised dates.",
  "Help desk escalated to the order desk twice.",
  "Local pickup slipped after hub arrival.",
  "Need detectors before the NOC window closes.",
  "Order change was from our side last month; this one is not.",
  "{{region:South}} shipments of the same family arrived on time.",
  "Please align Salesforce case status with ERP dates.",
];

const snippets = [
  ...featuredSnippets.map((s) => ({
    ...s,
    signalId: "PR-01",
    region: "{{region:North}}",
    place: "{{place:Gurugram}}",
    timestampUtc: "2026-09-15T10:00:00Z",
    firmwareSource: "imputed",
    mentionsRollback: false,
  })),
  ...extraTexts.map((text, i) => ({
    id: `sn-${String(i + 6).padStart(2, "0")}`,
    signalId: "PR-01",
    channel: i % 3 === 0 ? "email" : i % 3 === 1 ? "call" : "case",
    channelLabel: i % 3 === 0 ? "Email" : i % 3 === 1 ? "Call" : "Case note",
    partnerId: `{{partner:${["D-N-04", "D-N-07", "D-N-11"][i % 3]}}}`,
    region: "{{region:North}}",
    place: "{{place:Gurugram}}",
    localDateLabel: `${8 + (i % 14)} Sep`,
    timestampUtc: `2026-09-${String(8 + (i % 14)).padStart(2, "0")}T09:00:00Z`,
    text,
    featured: false,
    firmwareSource: "imputed",
    mentionsRollback: false,
  })),
];

const causes = [
  ...Array.from({ length: 28 }, () => "allocation"),
  ...Array.from({ length: 7 }, () => "order-change"),
  ...Array.from({ length: 11 }, () => "last-mile"),
];
const partnersCycle = ["D-N-04", "D-N-07", "D-N-11"];
const families = ["A", "B", "A", "B", "A"];
const orderLines = causes.map((candidateCause, i) => {
  const partner = partnersCycle[i % 3];
  const slip =
    candidateCause === "last-mile"
      ? 5 + (i % 3)
      : candidateCause === "allocation"
        ? 4 + (i % 5)
        : 3 + (i % 4);
  const day = 10 + (i % 15);
  return {
    id: `OL-N-${String(i + 1).padStart(3, "0")}`,
    distributor: `{{partner:${partner}}}`,
    region: "{{region:North}}",
    family: families[i % families.length],
    originalDate: `2026-09-${String(Math.min(day, 28)).padStart(2, "0")}`,
    revisedDate: `2026-09-${String(Math.min(day + slip, 30)).padStart(2, "0")}`,
    slipDays: slip,
    contactIds: [`sn-${String((i % 19) + 1).padStart(2, "0")}`],
    candidateCause,
  };
});

w("signal_pr01.json", {
  id: "PR-01",
  displayId: "PR-01",
  rank: {
    chip: "#1 of 5 this week",
    factors: [
      { label: "Severity", value: "S2", weight: 0.3, score: 0.28 },
      {
        label: "Drop vs own baseline",
        value: "88% → 71%",
        weight: 0.25,
        score: 0.22,
      },
      { label: "Lines affected", value: "46", weight: 0.2, score: 0.18 },
      {
        label: "Source independence",
        value: "0.70",
        weight: 0.15,
        score: 0.12,
      },
      {
        label: "Projects at risk",
        value: "2 fire NOC",
        weight: 0.1,
        score: 0.09,
      },
    ],
  },
  headline:
    "{{region:North}}: promise kept fell to 71% against its own 88% over 4 weeks — 3 distributors, 46 order lines, 2 projects facing a fire NOC inspection",
  chart: {
    weeks: weeks13,
    values: north,
    baselineBand: { low: 84, high: 91 },
    targetPct: 90,
    markers: [
      {
        weekIndex: 8,
        label: "week 35: allocation queue re-sequenced (candidate)",
      },
      { weekIndex: 12, label: "next monthly ops review 7 Oct" },
    ],
  },
  severity: {
    class: "S2",
    word: "Material impact",
    domain: "Supply",
    type: "slope",
    typeNote: "slope (4-week decline)",
    blastRadius: { headline: "3 distributors · 46 lines · 2 projects" },
    incident: { flag: false, note: "Incident flag Off" },
    compact:
      "S2 · Promise · slope (4-week decline) · 3 distributors · 46 lines · 2 projects · incident flag Off",
  },
  confidence: {
    level: "M",
    p: 0.68,
    known: {
      count: 46,
      label: "46 lines with original and revised dates from ERP",
    },
    inferred: { count: 19, label: "cause read from 19 contacts" },
    sourceIndependence: {
      score: 0.7,
      scoreDisplay: "0.70",
      partners: 3,
      channels: 4,
    },
    short:
      "M 0.68 · Known: 46 lines · Inferred: 19 contacts · source independence 0.70",
  },
  causeSplit: {
    kgsSide: { total: 35, allocation: 28, orderChange: 7 },
    lastMile: { total: 11, note: "{{place:Gurugram hub}} carrier" },
    label: "candidate — Operations lead confirms",
  },
  counterEvidence:
    "{{region:South}} and {{region:West}} receive the same product families on time; the pattern follows the allocation queue, not supply.",
  joinTags: [
    { key: "REGION", value: "{{region:North}}" },
    {
      key: "PARTNERS",
      value: "{{partner:D-N-04}}, {{partner:D-N-07}}, {{partner:D-N-11}}",
    },
    { key: "FAMILIES", value: "A (detection), B (panels)" },
    { key: "CHANNELS", value: "email, service calls, Salesforce, help desk" },
    { key: "TIME", value: "weeks 36–39" },
  ],
  pnl: {
    primary: "On-time delivery and cash (DSO)",
    secondary: "partner loyalty",
    compact: "On-time delivery and cash (DSO); secondary: partner loyalty",
  },
  routing: {
    owner: "Operations lead",
    cc: ["Regional GM", "Partner manager"],
  },
  recommendedAction:
    "Re-prioritise allocation for the 2 inspection-bound projects; send each distributor one confirmed date; open a last-mile review for the {{place:Gurugram hub}}",
  humanGate: {
    id: "pr01-gate",
    artefactType: "partner-update",
    status: "awaiting",
    title: "Draft actions — awaiting Operations lead approval",
    chip: "Awaiting approval",
    owner: "Operations lead",
    approveEnabledFor: ["Operations lead"],
    approveLabel: "Approve",
    disabledTooltip: "Approval sits with the Operations lead",
    onApprove: {
      title:
        "Approved · partner updates handed to Partner manager to send · audit logged {ts}",
      auditLine:
        "Approved · partner updates handed to Partner manager to send · audit logged {ts}",
      openLines: [
        "Loop: Watching — next check 2 Oct: promise kept {{region:North}}",
        "Partner manager: drafts ready to send",
      ],
      chip: "Action approved",
      toast: { title: "Action approved", body: "Approved · audit logged {ts}" },
      auditEntry: "{ts} · Operations lead approved PR-01 drafts",
      investigationId: "PR-01",
    },
    decisionRequest: {
      buttonLabel: "Ask for a decision",
      doneLabel: "Decision requested",
      chip: "Decision requested",
      auditEntry:
        "{ts} · Regional GM asked Operations lead for a decision on PR-01",
    },
  },
  loop: { step: "open", nextCheck: "2026-10-02" },
  evidenceDrawerTabs: [
    { id: "snippets", label: "Snippets", count: 19 },
    { id: "order_lines", label: "Order lines", count: 46 },
    { id: "distributors", label: "Distributors", count: 3 },
    { id: "method", label: "Method & audit", count: null },
  ],
  snippets,
  orderLines,
  drafts: [
    {
      id: "draft-partner-update",
      title: "Partner update email with one confirmed date",
      status: "Not sent",
      artefactType: "partner-update",
    },
    {
      id: "draft-allocation",
      title: "Allocation change note",
      status: "Not sent",
      artefactType: "allocation-note",
    },
    {
      id: "draft-carrier",
      title: "Last-mile review request",
      status: "Not sent",
      artefactType: "carrier-review",
    },
  ],
});

const seededThemes = [
  {
    id: "rc-01",
    name: "Licence re-activation after a laptop change",
    firstSeen: "2025-11-12",
    contacts13w: 64,
    channels: ["help desk", "email", "service calls"],
    partners: 7,
    status: "back-after-fix",
    fixes: [
      {
        date: "2026-06-12",
        type: "kb",
        owner: "Tech support",
        before: 9,
        after: 2,
      },
    ],
    lastFixLabel: "12 Jun · knowledge article · Tech support",
  },
  {
    id: "rc-03",
    name: "Order status asked on the help desk, not the order desk",
    firstSeen: "2026-01-08",
    contacts13w: 58,
    channels: ["help desk", "email"],
    partners: 9,
    status: "back-after-fix",
    fixes: [
      {
        date: "2026-07-03",
        type: "process",
        owner: "Ops",
        before: 8,
        after: 3,
      },
    ],
    lastFixLabel: "3 Jul · process: auto-reply with order-desk link · Ops",
  },
  {
    id: "rc-05",
    name: "Device addressing questions after a panel swap",
    firstSeen: "2025-12-02",
    contacts13w: 41,
    channels: ["service calls", "help desk"],
    partners: 5,
    status: "back-after-fix",
    fixes: [
      {
        date: "2026-05-20",
        type: "training",
        owner: "Tech support",
        before: 6,
        after: 2,
      },
    ],
    lastFixLabel: "20 May · training session · Tech support",
  },
  {
    id: "rc-07",
    name: "Legacy panel upgrade path",
    firstSeen: "2026-02-14",
    contacts13w: 37,
    channels: ["help desk", "email"],
    partners: 4,
    status: "no-fix",
    fixes: [],
    lastFixLabel: "none",
  },
  {
    id: "rc-09",
    name: "Network configuration during commissioning",
    firstSeen: "2026-03-01",
    contacts13w: 33,
    channels: ["service calls", "help desk"],
    partners: 6,
    status: "no-fix",
    fixes: [],
    lastFixLabel: "none",
  },
  {
    id: "rc-11",
    name: "Programming tool download link",
    firstSeen: "2026-04-10",
    contacts13w: 12,
    channels: ["help desk", "partner portal"],
    partners: 3,
    status: "holding",
    fixes: [
      { date: "2026-08-02", type: "process", owner: "IT", before: 5, after: 1 },
    ],
    lastFixLabel: "2 Aug · portal fix · IT",
  },
];

const fillerNames = [
  "Panel password reset loop",
  "Spare detector lead time questions",
  "Zone map export help",
  "Battery replacement schedule",
  "Remote dial-in access",
  "False trouble on notification circuit",
  "Label printer pairing",
  "As-built drawing requests",
  "Holiday cover for order desk",
  "Credit note status chase",
  "Return material authorisation timing",
  "Training seat availability",
  "Portal invoice download",
  "Multi-site licence count mismatch",
  "Smoke test checklist clarification",
  "Loop card compatibility question",
  "End-of-life panel path",
  "Commissioning form upload",
  "Partner portal password lockout",
  "Dispatch photo proof missing",
  "Weekend escalation path unclear",
];

const fillerThemes = fillerNames.map((name, i) => ({
  id: `rc-${String(20 + i).padStart(2, "0")}`,
  name,
  firstSeen: `2026-0${(i % 8) + 1}-15`,
  contacts13w: 8 + (i % 7),
  channels:
    i % 2 === 0 ? ["help desk", "email"] : ["service calls", "help desk"],
  partners: 2 + (i % 4),
  status: i % 5 === 0 ? "holding" : "no-fix",
  fixes:
    i % 5 === 0
      ? [
          {
            date: "2026-08-10",
            type: "kb",
            owner: "Tech support",
            before: 4,
            after: 1,
          },
        ]
      : [],
  lastFixLabel:
    i % 5 === 0 ? "10 Aug · knowledge article · Tech support" : "none",
}));

const themes = [...seededThemes, ...fillerThemes];
if (themes.length !== 27)
  throw new Error(`expected 27 themes, got ${themes.length}`);

w("recurring.json", {
  title: "What keeps coming back?",
  kpis: [
    { key: "themes_quarter", label: "Themes this quarter", value: 27 },
    { key: "with_fix", label: "With a fix on record", value: 58, unit: "%" },
    { key: "back_after_fix", label: "Back after a fix", value: 3 },
    {
      key: "repeat_contacts",
      label: "Repeat contacts",
      value: 22,
      unit: "% of help-desk volume",
    },
  ],
  themes,
  backAfterFixWall: [
    {
      id: "rc-01",
      title: "Licence re-activation, back a third time",
      fixDate: "2026-06-12",
      returnDate: "2026-09-18",
      weeklyDelta: "+9 vs post-fix",
      cta: "Open theme →",
    },
    {
      id: "rc-03",
      title: "Order status on help desk, back after fix",
      fixDate: "2026-07-03",
      returnDate: "2026-09-10",
      weeklyDelta: "+5 vs post-fix",
      cta: "Open theme →",
    },
    {
      id: "rc-05",
      title: "Device addressing after panel swap, back",
      fixDate: "2026-05-20",
      returnDate: "2026-09-05",
      weeklyDelta: "+4 vs post-fix",
      cta: "Open theme →",
    },
  ],
  timeline: {
    weeks: weeks13,
    series: [
      {
        id: "rc-01",
        name: "Licence re-activation",
        values: [3, 4, 8, 9, 2, 2, 2, 2, 3, 5, 7, 9, 11],
        fixMarkers: [4],
        returnMarkers: [9],
      },
      {
        id: "rc-03",
        name: "Order status on help desk",
        values: [5, 6, 7, 8, 3, 3, 3, 4, 5, 6, 7, 8, 9],
        fixMarkers: [4],
        returnMarkers: [8],
      },
      {
        id: "rc-05",
        name: "Device addressing",
        values: [4, 5, 6, 2, 2, 2, 3, 3, 4, 4, 5, 5, 6],
        fixMarkers: [3],
        returnMarkers: [7],
      },
    ],
  },
  channelSplit: [
    {
      id: "rc-01",
      help_desk: 28,
      email: 18,
      service_calls: 12,
      salesforce: 4,
      partner_portal: 2,
    },
    {
      id: "rc-03",
      help_desk: 40,
      email: 12,
      service_calls: 4,
      salesforce: 2,
      partner_portal: 0,
    },
    {
      id: "rc-05",
      help_desk: 18,
      email: 8,
      service_calls: 12,
      salesforce: 2,
      partner_portal: 1,
    },
  ],
  evidenceSummary: {
    mainSignal: "Three fixes did not hold.",
    whatChanged:
      "Licence contacts rose after the licence portal change on 18 Aug (candidate).",
    decideFirst:
      "Confirm with the US product team whether the portal change reset activations.",
  },
});

w("theme_rc01.json", {
  id: "rc-01",
  title: "Licence re-activation, back a third time",
  headline:
    "Licence re-activation after a laptop change: back a third time. 11 contacts this week against 2 a week after the June fix.",
  chart: {
    weeks: Array.from({ length: 26 }, (_, i) => `W${i + 1}`),
    values: [
      2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 9, 2, 2, 2, 2, 2, 3, 3, 4, 5, 6, 7, 8, 9,
      11,
    ],
    fixMarkers: [
      { weekIndex: 11, label: "12 Jun knowledge article" },
      { weekIndex: 17, label: "18 Aug portal change" },
    ],
    returnMarkers: [{ weekIndex: 20, label: "return" }],
  },
  severity: {
    class: "S3",
    word: "Operational",
    domain: "Quality",
    type: "cliff",
    typeNote: "cliff",
    blastRadius: { headline: "7 partners · software/licence" },
    incident: { flag: false, note: "Incident flag Off" },
    compact: "S3 · cliff · licence re-activation",
  },
  confidence: {
    level: "H",
    p: 0.81,
    known: { count: 64, label: "64 contacts over 13 weeks" },
    inferred: {
      count: 11,
      label: "11 contacts this week linked to portal change",
    },
    short: "H 0.81",
  },
  joinTags: [
    { key: "FAMILY", value: "D software/licence" },
    { key: "CHANNELS", value: "help desk, email, service calls" },
    { key: "PARTNERS", value: "7" },
  ],
  pnl: {
    primary: "Cost-to-serve",
    secondary: "partner experience",
    compact: "Cost-to-serve; partner experience",
  },
  fixHistory: [
    {
      date: "2026-06-12",
      what: "Knowledge article published",
      by: "Technical support lead",
      contactsPerWeekBefore: 9,
      contactsPerWeekAfter: 2,
    },
    {
      date: "2026-08-18",
      what: "Licence portal change (candidate)",
      by: "US product team",
      contactsPerWeekBefore: 2,
      contactsPerWeekAfter: 5,
    },
  ],
  drafts: [
    {
      id: "draft-kb",
      title:
        "Update the knowledge article + ask the US product team to confirm the portal change",
      status: "Not sent",
      artefactType: "kb-update",
      awaiting: "Technical support lead",
    },
  ],
  loop: { step: "open", nextCheck: "2026-10-05" },
  humanGate: {
    id: "rc01-gate",
    artefactType: "kb-update",
    status: "awaiting",
    title: "Draft — awaiting Technical support lead approval",
    chip: "Awaiting approval",
    owner: "Technical support lead",
    approveEnabledFor: ["Technical support lead"],
    approveLabel: "Approve",
    disabledTooltip: "Approval sits with the Technical support lead",
  },
});

const steps = [
  { step: "Design & device selection", friction: 6, praise: 4 },
  { step: "Wiring & device addressing", friction: 14, praise: 5 },
  { step: "Panel programming", friction: 9, praise: 22 },
  { step: "Network configuration", friction: 21, praise: 3 },
  {
    step: "Testing & handover (fire NOC inspection)",
    friction: 11,
    praise: 5,
  },
];
const fr = steps.reduce((a, s) => a + s.friction, 0);
const pr = steps.reduce((a, s) => a + s.praise, 0);
if (fr !== 61 || pr !== 39) throw new Error(`install totals ${fr}/${pr}`);

w("install.json", {
  title: "What do installers experience?",
  captureGapBanner:
    "Source: KGS help desk and service calls only. Partner first-line support is not connected, so most installer feedback is not here yet. See Partner view.",
  steps,
  frictionTotal: 61,
  praiseTotal: 39,
  statedTimeTable: [
    {
      step: "Network configuration",
      phrase: "takes about half an hour more to set up the network",
      statedExtraTime: "~25 min (median stated)",
      statedMinutesMedian: 25,
      mentions: 9,
      partners: 5,
    },
  ],
  praiseWorthUsing: {
    owner: "Marketing / partner training",
    quotes: [
      {
        text: "Easiest panel we've programmed this year.",
        step: "Panel programming",
        source: "installer, via {{partner:D-S-02}}, 9 Sep",
      },
    ],
  },
  heatGrid: {
    families: ["A", "B", "C", "D"],
    regions: ["North", "South", "East", "West", "SEA"],
    values: [
      [3, 2, 1, 2, 1],
      [4, 3, 2, 2, 1],
      [2, 1, 1, 1, 0],
      [5, 4, 3, 3, 2],
    ],
  },
  signalWall: [
    {
      id: "IN-01",
      title: "Network configuration adds set-up time",
      severity: "S3",
      type: "slope",
      owner: "Product liaison",
    },
    {
      id: "IN-02",
      title: "Praise for ease of programming holding",
      severity: "improving",
      type: "improving",
      owner: "Product liaison",
    },
  ],
  evidenceSummary: {
    mainSignal:
      "Network configuration is the step installers most often call slow.",
    whatChanged:
      "Mentions rose after the September partner training on the new network module (candidate).",
    decideFirst:
      "Share a one-page set-up guide with partners, and send a feedback note to the US product team.",
  },
  drafts: [
    {
      id: "draft-product-note",
      title: "Feedback note to the US product team",
      status: "Not sent",
      awaiting: "Product liaison",
      artefactType: "product-feedback-note",
    },
    {
      id: "draft-tip-sheet",
      title: "Partner training tip sheet",
      status: "Not sent",
      awaiting: "Product liaison",
      artefactType: "training-tip",
    },
    {
      id: "draft-praise-marketing",
      title: "Praise routed to Marketing",
      status: "Not sent",
      awaiting: "Product liaison",
      artefactType: "product-feedback-note",
    },
  ],
  feedbackSamples: [
    {
      step: "Network configuration",
      polarity: "friction",
      text: "takes about half an hour more to set up the network",
      statedMinutes: 25,
      partner: "{{partner:D-N-04}}",
      date: "2026-09-12",
    },
    {
      step: "Panel programming",
      polarity: "praise",
      text: "Easiest panel we've programmed this year.",
      partner: "{{partner:D-S-02}}",
      date: "2026-09-09",
    },
  ],
});

w("partner.json", {
  title: "Partner view",
  conceptLabel: "Concept",
  conceptFooter:
    "Concept: partner owns its data; KGS sees only what the partner shares. Legal and data-protection terms to be agreed.",
  subtitle:
    "Help partners run their businesses better — loyalty against Competitor A",
  consentBoundary: {
    partnerKeeps: ["customer identities", "pricing", "raw messages"],
    crossesToKgs: ["agreed aggregates"],
    flowsBack: ["confirmed dates", "fixes"],
  },
  workspace: {
    partnerId: "D-N-04",
    partnerLabel: "{{partner:D-N-04}}",
    header: "Partner workspace · powered by LiSN",
    cobrandPlaceholder: "KGS co-brand placeholder",
    queue: [
      {
        priority: 1,
        title: "Site handover on the 25th, detectors not delivered",
        linkedSignal: "PR-01",
      },
      {
        priority: 2,
        title: "Programming help, network set-up",
        linkedSignal: "IN-01",
      },
      {
        priority: 3,
        title: "Licence re-activation for a laptop change",
        linkedSignal: "RC-01",
      },
    ],
    managerView: {
      themesThisWeek: 4,
      replyTimeVsTarget: "92% within target",
      repeatContacts: 3,
      waitingOnKgs: 2,
    },
    waitingOnKgs: [
      {
        type: "order",
        label: "Open order — detectors",
        promised: "2026-09-15",
        current: "2026-09-22",
      },
      {
        type: "return",
        label: "Open return — notification device",
        status: "awaiting credit note",
      },
      {
        type: "question",
        label: "Open question — network module set-up guide",
        status: "with Product liaison",
      },
    ],
    sharing: {
      themes: true,
      promise: true,
      commissioning: true,
      identities: false,
      pricing: false,
    },
  },
  kgsView: {
    partnersConnected: { connected: 4, of: 12 },
    connectedIds: ["D-N-04", "D-S-02", "D-W-08", "D-SEA-10"],
    themePartnerGrid: {
      themes: [
        "Licence re-activation",
        "Network configuration",
        "Promise slips",
        "Ease of programming",
      ],
      partners: ["D-N-04", "D-S-02", "D-W-08", "D-SEA-10"],
      values: [
        [5, 1, 0, 0],
        [3, 2, 1, 1],
        [6, 0, 1, 0],
        [0, 4, 2, 1],
      ],
    },
    promiseByPartner: [
      { partner: "{{partner:D-N-04}}", keptPct: 62, complaints: 11 },
      { partner: "{{partner:D-S-02}}", keptPct: 92, complaints: 1 },
      { partner: "{{partner:D-W-08}}", keptPct: 91, complaints: 1 },
      { partner: "{{partner:D-SEA-10}}", keptPct: 94, complaints: 0 },
    ],
    commissioningFromPartners: {
      note: "Fills the capture gap on the Install page",
      frictionMentions: 14,
      praiseMentions: 9,
    },
    healthCards: [
      {
        partner: "{{partner:D-N-04}}",
        frictionTrend: "up",
        replyTime: "sla watch",
        openItems: 3,
        action: "Draft update to partner — Not sent",
      },
      {
        partner: "{{partner:D-S-02}}",
        frictionTrend: "flat",
        replyTime: "on target",
        openItems: 1,
        action: "Draft update to partner — Not sent",
      },
      {
        partner: "{{partner:D-W-08}}",
        frictionTrend: "down",
        replyTime: "on target",
        openItems: 0,
        action: "Draft update to partner — Not sent",
      },
      {
        partner: "{{partner:D-SEA-10}}",
        frictionTrend: "down",
        replyTime: "on target",
        openItems: 0,
        action: "Draft update to partner — Not sent",
      },
    ],
  },
});

console.log("seeded", {
  snippets: snippets.length,
  orderLines: orderLines.length,
  themes: themes.length,
  install: `${fr}:${pr}`,
});
