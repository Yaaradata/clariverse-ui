import type { LucideIcon } from "lucide-react";
import {
  CalendarX,
  Clock,
  Eye,
  Package,
  RefreshCw,
  RotateCcw,
  Truck,
  Wrench,
} from "lucide-react";

export type ServiceDeliveryRangeKey = "24H" | "7D" | "30D";

export const SERVICE_DELIVERY_RANGES: Record<
  ServiceDeliveryRangeKey,
  { f: number; delta: string; period: string }
> = {
  "24H": { f: 0.16, delta: "vs prev day", period: "last 24 hours" },
  "7D": { f: 1, delta: "WoW", period: "this week" },
  "30D": { f: 3.7, delta: "MoM", period: "last 30 days" },
};

export interface PromiseReliabilityHero {
  promiseMetRate: number;
  breachedCount: number;
  atRiskCount: number;
  topBreachDriver: string;
  breachedNote: string;
  atRiskNote: string;
  aiInsight: string;
}

export const PROMISE_RELIABILITY_HERO: PromiseReliabilityHero = {
  promiseMetRate: 91.4,
  breachedCount: 18_420,
  atRiskCount: 7_240,
  topBreachDriver: "East region last-mile delays after IPD",
  breachedNote: "Committed delivery / refund / replacement / installation SLA missed.",
  atRiskNote: "Likely to breach in the next 24–48 hours.",
  aiInsight:
    "High-value electronics show hub movement slowing after dispatch — audit packaging and scan cadence on the top Tier-2 lanes before more promises slip.",
};

export interface AnxietyMiniMatrixCell {
  row: "withinSla" | "breached";
  col: "calm" | "anxious";
  label: string;
  share: number;
  color: string;
  soft: string;
}

export interface CustomerAnxietyHero {
  anxiousBeforeBreach: number;
  repeatContactPct: number;
  avgContactsPerAnxious: number;
  anxietyWowPct: number;
  topAnxietyDriver: string;
  miniMatrix: AnxietyMiniMatrixCell[];
}

export const CUSTOMER_ANXIETY_HERO: CustomerAnxietyHero = {
  anxiousBeforeBreach: 12_860,
  repeatContactPct: 31,
  avgContactsPerAnxious: 2.3,
  anxietyWowPct: 18,
  topAnxietyDriver: "Long delivery window + no tracking update",
  miniMatrix: [
    {
      row: "withinSla",
      col: "calm",
      label: "Healthy",
      share: 62,
      color: "#22c55e",
      soft: "#22c55e18",
    },
    {
      row: "withinSla",
      col: "anxious",
      label: "Anxiety risk",
      share: 23,
      color: "#eab308",
      soft: "#eab30820",
    },
    {
      row: "breached",
      col: "calm",
      label: "Hidden breach",
      share: 9,
      color: "#0d9488",
      soft: "#0d948818",
    },
    {
      row: "breached",
      col: "anxious",
      label: "Trust break",
      share: 6,
      color: "#ef4444",
      soft: "#ef444420",
    },
  ],
};

export interface ServiceDeliveryHero {
  deliverySuccessRate: number;
  fcrRate: number;
  firstAttemptDeliveryPct: number;
  escalatedCount: number;
  pendingPromiseQueue: number;
  topBottleneck: string;
  fcrNote: string;
  pendingNote: string;
  aiInsight: string;
}

export const SERVICE_DELIVERY_HERO: ServiceDeliveryHero = {
  deliverySuccessRate: 84,
  fcrRate: 69,
  firstAttemptDeliveryPct: 79,
  escalatedCount: 156,
  pendingPromiseQueue: 284,
  topBottleneck: "Hyderabad BPO-A — refund queue aging 3.2 days",
  fcrNote: "First-contact resolution across care channels.",
  pendingNote: "Open promise cases awaiting closure.",
  aiInsight:
    "FCR is weakest on Chat and Email refund-status intents. Batch overdue callback routing to Payments before the 6 PM peak.",
};

export type DeliveryScoreKind = "reliability" | "anxiety" | "trustBreak";

export interface DeliveryScore {
  kind: DeliveryScoreKind;
  label: string;
  score: number;
  delta: number;
  target: number;
  /** When true, a rising delta is bad (anxiety / trust break). */
  deltaBadWhenUp: boolean;
  rag: "good" | "watch" | "high" | "crit";
  footnote: string;
}

export const SERVICE_DELIVERY_SCORES: DeliveryScore[] = [
  {
    kind: "reliability",
    label: "Reliability Score",
    score: 78,
    delta: -3,
    target: 85,
    deltaBadWhenUp: false,
    rag: "watch",
    footnote: "Did we meet what we promised?",
  },
  {
    kind: "anxiety",
    label: "Anxiety Score",
    score: 64,
    delta: 5,
    target: 40,
    deltaBadWhenUp: true,
    rag: "high",
    footnote: "Worry before breach — lower is better",
  },
  {
    kind: "trustBreak",
    label: "Trust Break Score",
    score: 42,
    delta: 2,
    target: 25,
    deltaBadWhenUp: true,
    rag: "high",
    footnote: "Breach + angry sentiment combined",
  },
];

export type PromiseSentimentQuad = "healthy" | "anxiety" | "opsBreach" | "trustBreak";

export interface PromiseSentimentCell {
  quad: PromiseSentimentQuad;
  label: string;
  sublabel: string;
  customers: number;
  share: number;
  color: string;
  soft: string;
}

export const PROMISE_SENTIMENT_MATRIX: PromiseSentimentCell[] = [
  {
    quad: "healthy",
    label: "Promise met · Calm",
    sublabel: "Healthy delivery",
    customers: 128_400,
    share: 62,
    color: "#22c55e",
    soft: "#22c55e18",
  },
  {
    quad: "anxiety",
    label: "Promise met · Anxious",
    sublabel: "Anxiety issue — not a trust break",
    customers: 48_200,
    share: 23,
    color: "#eab308",
    soft: "#eab30820",
  },
  {
    quad: "opsBreach",
    label: "Promise breached · Calm",
    sublabel: "Ops breach — low visible complaint",
    customers: 18_600,
    share: 9,
    color: "#0d9488",
    soft: "#0d948818",
  },
  {
    quad: "trustBreak",
    label: "Promise breached · Angry",
    sublabel: "True trust break — high risk",
    customers: 12_400,
    share: 6,
    color: "#ef4444",
    soft: "#ef444420",
  },
];

export interface AnxietyCarveOut {
  totalAnxious: number;
  withinSlaPct: number;
  breachedPct: number;
  repeatContactCount: number;
  repeatContactAvg: number;
  topDriver: string;
  spikeLabel: string;
  regions: { label: string; share: number }[];
  categories: { label: string; share: number }[];
  hubs: { label: string; share: number }[];
}

export const ANXIETY_CARVE_OUT: AnxietyCarveOut = {
  totalAnxious: 4_820,
  withinSlaPct: 72,
  breachedPct: 28,
  repeatContactCount: 6_140,
  repeatContactAvg: 2.3,
  topDriver: "Long delivery promise · high-value electronics · Tier-2",
  spikeLabel: "Anxiety spike detected",
  regions: [
    { label: "East", share: 31 },
    { label: "North", share: 24 },
    { label: "South", share: 22 },
    { label: "West", share: 23 },
  ],
  categories: [
    { label: "Electronics", share: 38 },
    { label: "Appliances", share: 22 },
    { label: "Furniture", share: 14 },
    { label: "Fashion", share: 12 },
    { label: "Others", share: 14 },
  ],
  hubs: [
    { label: "WH-East", share: 28 },
    { label: "WH-North-2", share: 21 },
    { label: "WH-South", share: 19 },
    { label: "Partner-A", share: 17 },
    { label: "Partner-B", share: 15 },
  ],
};

export interface ReliabilityFailure {
  id: string;
  label: string;
  icon: LucideIcon;
  breached: number;
  pending: number;
  wow: number;
  example: string;
}

export const RELIABILITY_FAILURES: ReliabilityFailure[] = [
  {
    id: "delivery-miss",
    label: "Promised delivery date missed",
    icon: CalendarX,
    breached: 1_240,
    pending: 186,
    wow: 14,
    example: "Express slot missed · WH-East backlog",
  },
  {
    id: "refund-sla",
    label: "Refund SLA breached",
    icon: RefreshCw,
    breached: 412,
    pending: 284,
    wow: 22,
    example: "Prepaid refund >7d · ledger mismatch",
  },
  {
    id: "pickup-miss",
    label: "Replacement pickup not completed",
    icon: RotateCcw,
    breached: 324,
    pending: 72,
    wow: 11,
    example: "3rd reschedule · no rider assigned",
  },
  {
    id: "install-fail",
    label: "Installation promise failed",
    icon: Wrench,
    breached: 198,
    pending: 54,
    wow: 9,
    example: "AC install slot missed · partner no-show",
  },
];

export interface AnxietySignal {
  id: string;
  label: string;
  icon: LucideIcon;
  contacts: number;
  withinSlaPct: number;
  wow: number;
  example: string;
}

export const ANXIETY_SIGNALS: AnxietySignal[] = [
  {
    id: "expectation-gap",
    label: "Expected faster than promised SLA",
    icon: Clock,
    contacts: 1_840,
    withinSlaPct: 94,
    wow: 18,
    example: "Customer expected 3 days · promised window is 7",
  },
  {
    id: "within-sla-late",
    label: "Within SLA but asking why so late",
    icon: Truck,
    contacts: 1_420,
    withinSlaPct: 100,
    wow: 12,
    example: "Day 5 of 7-day promise · repeat tracking pings",
  },
  {
    id: "contact-build",
    label: "No breach yet · contact volume building",
    icon: Package,
    contacts: 980,
    withinSlaPct: 88,
    wow: 15,
    example: "2+ contacts before hub scan update",
  },
  {
    id: "tracking-gap",
    label: "No tracking update · sentiment dipping",
    icon: Eye,
    contacts: 580,
    withinSlaPct: 91,
    wow: 21,
    example: "48h since last scan · high-value order",
  },
];

export interface AnxietyDriver {
  label: string;
  share: number;
  contacts: number;
  wow: number;
}

export const ANXIETY_DRIVERS: AnxietyDriver[] = [
  { label: "Long delivery promise", share: 28, contacts: 1_350, wow: 16 },
  { label: "No tracking update", share: 22, contacts: 1_060, wow: 21 },
  { label: "High-value product delay fear", share: 16, contacts: 770, wow: 12 },
  { label: "Installation uncertainty", share: 12, contacts: 580, wow: 9 },
  { label: "Refund not visible", share: 11, contacts: 530, wow: 14 },
  { label: "Return pickup not scheduled", share: 11, contacts: 530, wow: 8 },
];

export interface JourneyAnxietyRow {
  stage: string;
  contacts: number;
  share: number;
  withinSlaPct: number;
  trend: number;
}

export const ANXIETY_BY_JOURNEY: JourneyAnxietyRow[] = [
  { stage: "Order placed", contacts: 620, share: 13, withinSlaPct: 96, trend: 8 },
  { stage: "Packed", contacts: 480, share: 10, withinSlaPct: 94, trend: 5 },
  { stage: "Shipped", contacts: 1_120, share: 23, withinSlaPct: 89, trend: 14 },
  { stage: "Hub delayed", contacts: 1_340, share: 28, withinSlaPct: 78, trend: 19 },
  { stage: "Out for delivery", contacts: 840, share: 17, withinSlaPct: 82, trend: 11 },
  { stage: "Return initiated", contacts: 280, share: 6, withinSlaPct: 71, trend: 6 },
  { stage: "Refund pending", contacts: 140, share: 3, withinSlaPct: 65, trend: 9 },
];

export interface SegmentAnxietyRow {
  segment: string;
  contacts: number;
  share: number;
  anxietyIndex: number;
}

export const ANXIETY_BY_SEGMENT: SegmentAnxietyRow[] = [
  { segment: "High-value electronics", contacts: 1_620, share: 34, anxietyIndex: 72 },
  { segment: "Repeat customers", contacts: 1_180, share: 24, anxietyIndex: 58 },
  { segment: "First-time customers", contacts: 980, share: 20, anxietyIndex: 68 },
  { segment: "Metro", contacts: 1_240, share: 26, anxietyIndex: 52 },
  { segment: "Non-metro", contacts: 3_580, share: 74, anxietyIndex: 71 },
  { segment: "High-contact customers", contacts: 890, share: 18, anxietyIndex: 84 },
];

export interface AnxietyEvidence {
  id: string;
  orderId: string;
  promiseDate: string;
  actualStatus: string;
  daysToBreach: number;
  slaBreached: boolean;
  contactCount: number;
  latestMessage: string;
  sentimentTrend: "rising" | "stable" | "falling";
  orderValue: string;
  category: string;
  hub: string;
  lane: string;
}

export const ANXIETY_EVIDENCE: AnxietyEvidence[] = [
  {
    id: "ev-1",
    orderId: "OD2847193021",
    promiseDate: "12 Jul · 7-day window",
    actualStatus: "Hub delayed · last scan 2 days ago",
    daysToBreach: 2,
    slaBreached: false,
    contactCount: 3,
    latestMessage: "I ordered a ₹42k TV — why is there no update for 48 hours?",
    sentimentTrend: "rising",
    orderValue: "₹42,400",
    category: "Electronics · TV",
    hub: "WH-East",
    lane: "Ekart · Tier-2 East",
  },
  {
    id: "ev-2",
    orderId: "OD2846108844",
    promiseDate: "10 Jul · refund in 5–7 days",
    actualStatus: "Refund initiated · not visible in app",
    daysToBreach: 4,
    slaBreached: false,
    contactCount: 2,
    latestMessage: "App still shows processing — my bank has nothing. Is this normal?",
    sentimentTrend: "rising",
    orderValue: "₹8,200",
    category: "Fashion · prepaid return",
    hub: "Payments ledger",
    lane: "UPI prepaid",
  },
  {
    id: "ev-3",
    orderId: "OD2845501290",
    promiseDate: "8 Jul · install within 72h of delivery",
    actualStatus: "Delivered · install slot not confirmed",
    daysToBreach: 1,
    slaBreached: false,
    contactCount: 4,
    latestMessage: "AC delivered but nobody called for installation — summer is here.",
    sentimentTrend: "rising",
    orderValue: "₹31,500",
    category: "Appliances · AC",
    hub: "Partner install",
    lane: "WH-North-2",
  },
  {
    id: "ev-4",
    orderId: "OD2844987762",
    promiseDate: "6 Jul · delivery by 9 Jul",
    actualStatus: "Out for delivery loop · 3 attempts",
    daysToBreach: 0,
    slaBreached: true,
    contactCount: 5,
    latestMessage: "Third time marked out for delivery — I took leave again. Refund now.",
    sentimentTrend: "rising",
    orderValue: "₹18,900",
    category: "Furniture",
    hub: "WH-East",
    lane: "Partner-B last mile",
  },
];

export interface ServiceDeliveryAction {
  issue: string;
  signal: string;
  owner: string;
  action: string;
  kind: "Route" | "Escalate" | "Act now";
}

export const SERVICE_DELIVERY_ACTIONS: ServiceDeliveryAction[] = [
  {
    issue: "East electronics anxiety spike",
    signal: "72% still within SLA · long promise + tracking gaps",
    owner: "CX + Last-mile",
    action: "Proactive ETA SMS before contact on Tier-2 electronics lanes.",
    kind: "Act now",
  },
  {
    issue: "Refund SLA breach cluster",
    signal: "412 breached · prepaid ledger mismatch",
    owner: "Payments / CX",
    action: "Expose refund ETA in app + validate status vs bank ledger.",
    kind: "Escalate",
  },
  {
    issue: "Hub-delay anxiety at WH-East",
    signal: "28% of anxious contacts · hub scan stale >36h",
    owner: "Supply Chain",
    action: "Scan cadence audit on top 5 SKUs · re-promise affected cohort.",
    kind: "Route",
  },
  {
    issue: "Install promise anxiety",
    signal: "580 contacts · partner slot not visible post-delivery",
    owner: "Service partners",
    action: "Surface install slot in order tracker within 2h of delivery.",
    kind: "Route",
  },
];

export const SERVICE_DELIVERY_AI_INSIGHT = {
  confidence: 89,
  headline:
    "Delivery anxiety is rising in East region electronics orders. Most cases are still within promised SLA — this is not yet a reliability breach.",
  body:
    "The anxiety appears driven by long promised delivery windows, low tracking visibility, and high-value product concern. Separately, refund SLA breaches and missed express slots are true reliability failures requiring Payments and WH-East action.",
  anxietyVsBreach:
    "Of 4,820 anxious customers who contacted before breach, 72% are still inside promised delivery date. Only 28% have an actual SLA breach — treat the majority as expectation-gap anxiety, not trust broken.",
};
