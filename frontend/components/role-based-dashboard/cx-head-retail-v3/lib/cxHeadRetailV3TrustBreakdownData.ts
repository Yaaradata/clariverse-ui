import type { LucideIcon } from "lucide-react";
import {
  AtSign,
  Layers,
  Linkedin,
  Mail,
  MessageSquare,
  PackageX,
  Phone,
  RefreshCw,
  Shield,
  ShieldAlert,
  Tag,
  Target,
  Truck,
} from "lucide-react";

export type TrustDriverId =
  | "damaged"
  | "refund"
  | "wrong"
  | "hidden"
  | "never"
  | "counterfeit"
  | "ato"
  | "missing";

export type TrustDriverType = "slope" | "cliff";
export type TrustRangeKey = "24H" | "7D" | "30D";
export type TrustRagLevel = "good" | "watch" | "high" | "crit";
export type TrustQuadKind = "cliff" | "hotspot" | "ops" | "monitor";
export type TrustActionKind = "Route" | "Escalate" | "Act now";
export type AnxietyWindowState = "pre-contact" | "contacting" | "escalated";
export type Chronicity = "chronic" | "acute" | "emergent";

export interface TrustDriverTags {
  sku: string;
  category: string;
  seller: string;
  pincode: string;
  channel: string;
  time: string;
  stage: string;
  marketplaceVsOwned: string;
}

interface TrustDriverInput {
  id: TrustDriverId;
  label: string;
  icon: LucideIcon;
  complaints: number;
  wow: number;
  sentNeg: number;
  confidence: number;
  repeat: number;
  cliffOrSlope: TrustDriverType;
  incidentRate: number;
  blastRadius: number;
  originationStage: string;
  manifestationStage: string;
  detectionStage: string;
  fixOwner: string;
  anxietyWindowState: AnxietyWindowState;
  chronicity: Chronicity;
  pnlMetric: string;
  pnlValue: string;
  cpu: number;
  eplu: number;
  tags: TrustDriverTags;
  meaning: string;
  next: string;
  dealPoints: readonly [string, string, string];
}

export interface TrustDriver extends TrustDriverInput {
  /** incidentRate * blastRadius — the sort key. Never hand-authored. */
  severityScore: number;
  /** cliffOrSlope === "cliff" && incidentRate >= SCATTER_IX — the §2.4 cell. */
  highIncidenceCliff: boolean;
}

export interface TrustCategoryCutRow {
  label: string;
  share: number;
  complaints: number;
  wow: number;
  negSentiment: number;
}

export interface TrustSegmentMatrixRow {
  code: "HVHF" | "HVLF" | "LVHF" | "LVLF";
  share: number;
  complaints: number;
}

export interface TrustChannelCutRow {
  label: string;
  share: number;
  complaints: number;
  messages: readonly [string, string, string, string, string];
}

export interface TrustPathCutRow {
  label: string;
  share: number;
  complaints: number;
  detail: string;
}

export interface TrustSellerSkuCutRow {
  sellerId: string;
  sellerName: string;
  share: number;
  category: string;
  complaints?: number;
  risk?: string;
}

export interface TrustDriverCut {
  verdict: string;
  conf: number;
  category: TrustCategoryCutRow[];
  seller: [string, number][];
  region: [string, number][];
  path: TrustPathCutRow[];
  segment: [string, number][];
  segmentMatrix: TrustSegmentMatrixRow[];
  channel: TrustChannelCutRow[];
  sellerSku: TrustSellerSkuCutRow[];
}

export interface TrustSegment {
  label: string;
  affected: number;
  wow: number;
  drop: number;
  conf: number;
  aiInsight: string;
}

export interface TrustEvidence {
  src: string;
  icon: LucideIcon;
  quote: string;
  tag: string;
}

export interface TrustAction {
  issue: string;
  cause: string;
  team: string;
  action: string;
  kind: TrustActionKind;
}

export const TRUST_RANGES: Record<
  TrustRangeKey,
  { f: number; delta: string; period: string }
> = {
  "24H": { f: 0.16, delta: "vs prev day", period: "last 24 hours" },
  "7D": { f: 1, delta: "WoW", period: "this week" },
  "30D": { f: 3.7, delta: "MoM", period: "last 30 days" },
};

export const TRUST_RAG: Record<TrustRagLevel, { label: string }> = {
  good: { label: "Healthy" },
  watch: { label: "Watch" },
  high: { label: "Elevated" },
  crit: { label: "Critical" },
};

/** §2.4 high-incidence-cliff threshold — incident rate at/above this on a cliff is not "rare". */
export const SCATTER_IX = 1.2;
export const SCATTER_BY = 65;

const TRUST_DRIVER_INPUTS: TrustDriverInput[] = [
  {
    id: "damaged",
    label: "Damaged Product",
    icon: PackageX,
    complaints: 12840,
    wow: 18,
    sentNeg: 71,
    confidence: 92,
    repeat: 2.4,
    cliffOrSlope: "slope",
    incidentRate: 3.1,
    blastRadius: 55,
    originationStage: "S4 Pack",
    manifestationStage: "S6 Delivery",
    detectionStage: "S8 Returns",
    fixOwner: "Supply Chain / Packaging",
    anxietyWindowState: "contacting",
    chronicity: "chronic",
    pnlMetric: "Reverse logistics + replacement",
    pnlValue: "₹4.1 Cr",
    cpu: 0.34,
    eplu: 118,
    tags: {
      sku: "SKU-MOB-2291",
      category: "Mobiles",
      seller: "68% marketplace · Ekart-North lane",
      pincode: "Jaipur · 302012",
      channel: "Chat",
      time: "Evening peak",
      stage: "S6 Delivery",
      marketplaceVsOwned: "68% marketplace / 32% owned",
    },
    meaning: "Customers doubt product quality and fulfilment reliability.",
    next: "Drill damage by category & pincode, then push the top-5 pincodes to Supply Chain.",
    dealPoints: [
      "Drill damage by category & pincode",
      "Route top-5 pincodes to Supply Chain",
      "Push to Seller Ops: QA hold on repeat-damage sellers",
    ],
  },
  {
    id: "refund",
    label: "Refund Not Credited",
    icon: RefreshCw,
    complaints: 6540,
    wow: 22,
    sentNeg: 78,
    confidence: 90,
    repeat: 2.1,
    cliffOrSlope: "cliff",
    incidentRate: 3.8,
    blastRadius: 78,
    originationStage: "S8 Refunds",
    manifestationStage: "S8 Refunds",
    detectionStage: "S8 Returns",
    fixOwner: "CX + Payments",
    anxietyWindowState: "contacting",
    chronicity: "chronic",
    pnlMetric: "Refund leakage + contact cost",
    pnlValue: "₹2.8 Cr",
    cpu: 0.21,
    eplu: 96,
    tags: {
      sku: "SKU-FSH-1187",
      category: "Fashion",
      seller: "61% marketplace / 39% owned",
      pincode: "Delhi · 110001",
      channel: "Email",
      time: "Business hours",
      stage: "S8 Refunds",
      marketplaceVsOwned: "61% marketplace / 39% owned",
    },
    meaning: "Customers feel their money is unsafe — the fastest trust eroder.",
    next: "Validate refund-status vs ledger mismatch and push aged cases to Payments.",
    dealPoints: [
      "Push refund-status vs ledger mismatch to Payments",
      "Escalate refunds pending 48h+ to Payments",
      "Send proactive wallet-credit alerts",
    ],
  },
  {
    id: "wrong",
    label: "Wrong Item Received",
    icon: Layers,
    complaints: 8120,
    wow: 11,
    sentNeg: 64,
    confidence: 89,
    repeat: 1.9,
    cliffOrSlope: "slope",
    incidentRate: 2.0,
    blastRadius: 42,
    originationStage: "S1 Catalogue",
    manifestationStage: "S6 Delivery",
    detectionStage: "S8 Returns",
    fixOwner: "Marketplace / Catalogue",
    anxietyWindowState: "contacting",
    chronicity: "acute",
    pnlMetric: "Replacement + reverse logistics",
    pnlValue: "₹2.2 Cr",
    cpu: 0.26,
    eplu: 74,
    tags: {
      sku: "SKU-FSH-3342",
      category: "Fashion",
      seller: "74% marketplace / 26% owned",
      pincode: "Kolkata · 700001",
      channel: "Chat",
      time: "Afternoon",
      stage: "S1 Catalogue",
      marketplaceVsOwned: "74% marketplace / 26% owned",
    },
    meaning: "Fulfilment feels unreliable; erodes confidence at scale.",
    next: "Push seller-to-catalogue SKU mapping audit for flagged sellers to Marketplace.",
    dealPoints: [
      "Push SKU-mapping re-check to Marketplace for flagged sellers",
      "Push pick-pack error audit to Fulfilment Ops",
      "Recommend replacement-first before refund offer",
    ],
  },
  {
    id: "hidden",
    label: "Hidden Platform Fee",
    icon: Tag,
    complaints: 4210,
    wow: 31,
    sentNeg: 68,
    confidence: 85,
    repeat: 1.4,
    cliffOrSlope: "slope",
    incidentRate: 1.1,
    blastRadius: 48,
    originationStage: "S2 Checkout",
    manifestationStage: "S2 Checkout",
    detectionStage: "S8 Returns",
    fixOwner: "Pricing / Product",
    anxietyWindowState: "contacting",
    chronicity: "chronic",
    pnlMetric: "Checkout drop-off / GMV at risk",
    pnlValue: "₹1.6 Cr",
    cpu: 0.12,
    eplu: 31,
    tags: {
      sku: "SKU-GRC-0087",
      category: "Grocery",
      seller: "52% marketplace / 48% owned",
      pincode: "Bengaluru · 560001",
      channel: "LinkedIn",
      time: "Checkout window",
      stage: "S2 Checkout",
      marketplaceVsOwned: "52% marketplace / 48% owned",
    },
    meaning: "Customers feel misled when fees surface late in checkout.",
    next: "Push fee-communication clarity review at checkout to Product / Pricing.",
    dealPoints: [
      "Push fee-clarity review to Product / Pricing",
      "Push all-fees-before-payment fix to Product",
      "Recommend a transparent cart fee-breakdown test",
    ],
  },
  {
    id: "never",
    label: "Never Delivered",
    icon: Truck,
    complaints: 3180,
    wow: 14,
    sentNeg: 82,
    confidence: 91,
    repeat: 2.6,
    cliffOrSlope: "slope",
    incidentRate: 0.9,
    blastRadius: 86,
    originationStage: "S6 Last Mile",
    manifestationStage: "S6 Last Mile",
    detectionStage: "S8 Returns",
    fixOwner: "Last Mile",
    anxietyWindowState: "pre-contact",
    chronicity: "acute",
    pnlMetric: "Refund + re-ship + GMV at risk",
    pnlValue: "₹1.9 Cr",
    cpu: 0.41,
    eplu: 142,
    tags: {
      sku: "SKU-APL-5510",
      category: "Appliances",
      seller: "57% marketplace / 43% owned",
      pincode: "Patna · 800001",
      channel: "Voice",
      time: "Delivery slot window",
      stage: "S6 Last Mile",
      marketplaceVsOwned: "57% marketplace / 43% owned",
    },
    meaning: "Severe fulfilment failure; high anxiety before contact even lands.",
    next: "Trace the non-delivery cohort and push proactive re-promise notifications before contact.",
    dealPoints: [
      "Trace the non-delivery cohort by hub & carrier",
      "Re-promise affected orders within 2 hours",
      "Push repeat out-for-delivery loops to partner last-mile ops",
    ],
  },
  {
    id: "counterfeit",
    label: "Counterfeit Concern",
    icon: ShieldAlert,
    complaints: 640,
    wow: 9,
    sentNeg: 88,
    confidence: 94,
    repeat: 1.2,
    cliffOrSlope: "cliff",
    incidentRate: 4.2,
    blastRadius: 92,
    originationStage: "S1 Listing",
    manifestationStage: "S7 Usage",
    detectionStage: "S8 Returns",
    fixOwner: "Category / Seller Ops",
    anxietyWindowState: "contacting",
    chronicity: "chronic",
    pnlMetric: "GMV at risk + firm-level regulatory exposure",
    pnlValue: "₹0.9 Cr",
    cpu: 0.08,
    eplu: 210,
    tags: {
      sku: "SKU-BBF-7742",
      category: "Baby & food",
      seller: "SLR-88213 · NutriBaby Store",
      pincode: "Delhi · 110006",
      channel: "LinkedIn",
      time: "Any time",
      stage: "S1 Listing",
      marketplaceVsOwned: "91% marketplace / 9% owned",
    },
    meaning: "Authenticity doubt with regulatory exposure in consumables.",
    next: "Push a seller compliance review for baby-food & consumable SKUs to Trust & Safety.",
    dealPoints: [
      "Push compliance review on consumable SKUs to Trust & Safety",
      "Push evidence pull on exposed listings to Trust & Safety",
      "Push to Trust & Safety: hold request on flagged sellers",
    ],
  },
  {
    id: "ato",
    label: "Account Takeover",
    icon: Shield,
    complaints: 210,
    wow: 6,
    sentNeg: 95,
    confidence: 96,
    repeat: 1.1,
    cliffOrSlope: "cliff",
    incidentRate: 0.06,
    blastRadius: 96,
    originationStage: "S9 Account",
    manifestationStage: "S9 Account",
    detectionStage: "S8 Returns",
    fixOwner: "Trust & Safety / Fraud",
    anxietyWindowState: "escalated",
    chronicity: "acute",
    pnlMetric: "Wallet write-off + fraud loss",
    pnlValue: "₹0.4 Cr",
    cpu: 0.05,
    eplu: 268,
    tags: {
      sku: "N/A — account-level event",
      category: "Wallet / GC",
      seller: "34% marketplace / 66% owned",
      pincode: "Bengaluru · 560001",
      channel: "Voice",
      time: "Late night",
      stage: "S9 Account",
      marketplaceVsOwned: "34% marketplace / 66% owned",
    },
    meaning: "Immediate financial-trust collapse — a true cliff event.",
    next: "Escalate flagged accounts and wallet activity to Fraud / Security.",
    dealPoints: [
      "Escalate flagged wallet activity to Fraud",
      "Escalate to Fraud: wallet lock + step-up auth",
      "Route to Fraud / Security within 15 min",
    ],
  },
  {
    id: "missing",
    label: "Item Missing in Order",
    icon: Target,
    complaints: 1120,
    wow: 8,
    sentNeg: 85,
    confidence: 93,
    repeat: 1.5,
    cliffOrSlope: "cliff",
    incidentRate: 0.3,
    blastRadius: 84,
    originationStage: "S4 Picking",
    manifestationStage: "S6 Delivery",
    detectionStage: "S8 Returns",
    fixOwner: "Supply Chain / Dark Store",
    anxietyWindowState: "contacting",
    chronicity: "acute",
    pnlMetric: "Instant credit + contact cost",
    pnlValue: "₹0.7 Cr",
    cpu: 0.18,
    eplu: 158,
    tags: {
      sku: "SKU-MOB-9821",
      category: "Mobiles",
      seller: "46% marketplace / 54% owned",
      pincode: "Hyderabad · 500001",
      channel: "Chat",
      time: "Post-delivery",
      stage: "S4 Picking",
      marketplaceVsOwned: "46% marketplace / 54% owned",
    },
    meaning: "Customer feels cheated when a paid item is absent from the box.",
    next: "Push shipment-manifest reconciliation for affected SKUs to Ops.",
    dealPoints: [
      "Reconcile manifests for affected SKUs with Ops",
      "Match pick-list to pack-scan and proof of delivery",
      "Service: instant credit on verified missing items, SOP-driven",
    ],
  },
];

export const TRUST_DRIVERS: TrustDriver[] = TRUST_DRIVER_INPUTS.map((d) => ({
  ...d,
  severityScore: d.incidentRate * d.blastRadius,
  highIncidenceCliff: d.cliffOrSlope === "cliff" && d.incidentRate >= SCATTER_IX,
}));

/** Descending by severityScore — the canonical ranking (§2.2, §2.4). */
export function sortDriversBySeverity(drivers: readonly TrustDriver[]): TrustDriver[] {
  return [...drivers].sort((a, b) => b.severityScore - a.severityScore);
}

/** Live cliff events this period — drives the "Cliff events live" KPI. */
export function liveCliffCount(drivers: readonly TrustDriver[] = TRUST_DRIVERS): number {
  return drivers.filter((d) => d.cliffOrSlope === "cliff" && d.wow > 0).length;
}

/** Derived, never hand-authored — cannot assert "no cliff breach" while a cliff is live. */
export function deriveTrustVerdict(drivers: readonly TrustDriver[] = TRUST_DRIVERS): string {
  const ranked = sortDriversBySeverity(drivers);
  const top = ranked[0];
  const cliffs = drivers.filter((d) => d.cliffOrSlope === "cliff" && d.wow > 0);
  const fastest = [...drivers].sort((a, b) => b.wow - a.wow)[0];
  const cliffClause =
    cliffs.length > 0
      ? `${cliffs.length} live cliff event${cliffs.length === 1 ? "" : "s"} — ${cliffs.map((d) => d.label).join(", ")}.`
      : "No live cliff events this period.";
  return `${top.label} leads on severity (${top.severityScore.toFixed(0)} = ${top.incidentRate}% × blast ${top.blastRadius}). ${fastest.label} is rising fastest (+${fastest.wow}% WoW). ${cliffClause} Push the top breaker to ${top.fixOwner}.`;
}

/** One-line KPI pulse insight — new synthesis only; never restate tile values. */
export function deriveTrustPulseInsight(pulse: {
  trustIndex: number;
  trustDelta: number;
  target?: number;
  sentimentDelta: number;
  resolutionDelta: number;
  csatDelta: number;
  repeatContactDelta: number;
}): string {
  const target = pulse.target ?? 80;
  const gap = target - pulse.trustIndex;
  const outcomesWorsening =
    pulse.sentimentDelta < 0 && pulse.resolutionDelta < 0 && pulse.csatDelta < 0;

  if (pulse.trustDelta < 0 && outcomesWorsening) {
    return `${gap} pts below target — sentiment, CSAT and resolution all worsened with the index drop.`;
  }
  if (pulse.trustDelta < 0 && pulse.repeatContactDelta > 0) {
    return `${gap} pts below target — repeat contact is rising as the composite slips.`;
  }
  if (gap > 0) {
    return `${gap} pts below the ${target} target — close the gap before outcome drag compounds.`;
  }
  return `On or above the ${target} target — keep watching outcome drift for early reverse signals.`;
}

const categoryRow = (
  total: number,
  label: string,
  share: number,
  wow: number,
  negSentiment: number,
): TrustCategoryCutRow => ({
  label,
  share,
  complaints: Math.round((total * share) / 100),
  wow,
  negSentiment,
});

const segmentMatrix = (
  total: number,
  hvhf: number,
  hvlf: number,
  lvhf: number,
  lvlf: number,
): TrustSegmentMatrixRow[] => [
  { code: "HVHF", share: hvhf, complaints: Math.round((total * hvhf) / 100) },
  { code: "HVLF", share: hvlf, complaints: Math.round((total * hvlf) / 100) },
  { code: "LVHF", share: lvhf, complaints: Math.round((total * lvhf) / 100) },
  { code: "LVLF", share: lvlf, complaints: Math.round((total * lvlf) / 100) },
];

const channelRow = (
  total: number,
  label: string,
  share: number,
  messages: readonly [string, string, string, string, string],
): TrustChannelCutRow => ({
  label,
  share,
  complaints: Math.round((total * share) / 100),
  messages,
});

const pathRow = (total: number, label: string, share: number, detail: string): TrustPathCutRow => ({
  label,
  share,
  complaints: Math.round((total * share) / 100),
  detail,
});

const sellerSkuRow = (
  total: number,
  sellerId: string,
  sellerName: string,
  share: number,
  category: string,
  risk?: string,
): TrustSellerSkuCutRow => ({
  sellerId,
  sellerName,
  share,
  category,
  complaints: Math.round((total * share) / 100),
  ...(risk ? { risk } : {}),
});

export const TRUST_DRIVER_CUTS: Record<TrustDriverId, TrustDriverCut> = {
  damaged: {
    verdict:
      "Damage is concentrated in Mobiles & Appliances, driven by marketplace sellers on the Ekart-North route into Tier-2 pincodes. Push a packaging + handling audit to Supply Chain for the top 5 pincodes.",
    conf: 92,
    category: [
      categoryRow(12840, "Mobiles", 28, 22, 74),
      categoryRow(12840, "Appliances", 22, 18, 71),
      categoryRow(12840, "Furniture", 14, 14, 68),
      categoryRow(12840, "Fashion", 10, 11, 65),
      categoryRow(12840, "Electronics", 8, 10, 64),
      categoryRow(12840, "Home", 7, 9, 63),
      categoryRow(12840, "Grocery", 6, 8, 61),
      categoryRow(12840, "Others", 5, 7, 60),
    ],
    seller: [
      ["Marketplace seller", 68],
      ["Flipkart-fulfilled", 32],
    ],
    region: [
      ["Jaipur · 302012", 16],
      ["Lucknow · 226010", 14],
      ["Patna · 800001", 12],
      ["Kanpur · 208001", 11],
      ["Nagpur · 440002", 9],
      ["Varanasi · 221001", 8],
      ["Indore · 452001", 7],
      ["Bhopal · 462001", 6],
      ["Ranchi · 834001", 5],
      ["Jodhpur · 342001", 4],
    ],
    path: [
      pathRow(12840, "Ekart · North", 45, "Own fleet · North hub · Tier-2 last mile"),
      pathRow(12840, "Partner-A", 31, "3PL partner · heavy mobiles & appliances"),
      pathRow(12840, "Partner-B", 24, "Secondary hub · repack / handoff failures"),
    ],
    segment: [
      ["High-frequency", 31],
      ["New users", 28],
      ["High-value", 22],
      ["Occasional", 19],
    ],
    segmentMatrix: segmentMatrix(12840, 24, 19, 26, 31),
    channel: [
      channelRow(12840, "Chat", 38, [
        "The box was completely crushed — this is the second damaged item in a month.",
        "Screen has dead pixels straight out of the box.",
        "Outer packaging intact but product inside is shattered.",
        "Return pickup was promised three times — still waiting with a broken TV.",
      "Need a human review on this — auto-close is making trust worse.",
      ]),
      channelRow(12840, "Voice", 26, [
        "I don't trust Flipkart delivery anymore; please pick up and refund.",
        "Every appliance I order arrives with dents — fix your handling.",
        "Your courier threw the box over the gate and left.",
        "Calling again because chat said someone would call back — nobody did.",
      "Please escalate with evidence attached — I will not drop this.",
      ]),
      channelRow(12840, "Email", 16, [
        "Received a broken phone screen. Need replacement or full refund immediately.",
        "Attached photos of the damage — please respond within 24 hours.",
        "Order ID attached — item is unusable on arrival.",
        "Escalating to consumer forum if I don't hear back by tomorrow.",
      "Same issue for the second week — what is the permanent fix?",
      ]),
      channelRow(12840, "LinkedIn", 12, [
        "Received a broken item again — never buying from Flipkart.",
        "Quality control is zero — third damaged delivery this quarter.",
        "Sharing my experience so others know what to expect.",
        "Tagging leadership because support tickets keep getting auto-closed.",
      "Share the investigation ID so I can follow up with a real owner.",
      ]),
      channelRow(12840, "X", 8, [
        "Never buying from Flipkart again — third damaged TV in two months.",
        "Posting photos of crushed box — this keeps happening in my pincode.",
        "Tagging @flipkart because chat closed my ticket without pickup.",
        "Going public — quality control is broken on mobiles.",
      "This pattern repeats — protect other customers before it spreads.",
      ]),
    ],
    sellerSku: [
      sellerSkuRow(12840, "SLR-44120", "ElectroMart North", 38, "Mobiles"),
      sellerSkuRow(12840, "SLR-33881", "HomeAppliances Hub", 24, "Appliances"),
      sellerSkuRow(12840, "SLR-29014", "FurniWorld Store", 16, "Furniture"),
      sellerSkuRow(12840, "SLR-18772", "GadgetBay IN", 12, "Mobiles"),
      sellerSkuRow(12840, "SLR-10255", "ValueTech Mart", 10, "Electronics"),
    ],
  },
  refund: {
    verdict:
      "Refund failures cluster on prepaid orders where the ledger shows 'processed' but the customer sees no credit. Validate the status mismatch and expose a proactive refund ETA before customers escalate.",
    conf: 90,
    category: [
      categoryRow(6540, "Fashion", 24, 24, 78),
      categoryRow(6540, "Mobiles", 20, 21, 76),
      categoryRow(6540, "Grocery", 16, 16, 72),
      categoryRow(6540, "Appliances", 12, 12, 70),
      categoryRow(6540, "Electronics", 9, 11, 69),
      categoryRow(6540, "Beauty", 8, 10, 68),
      categoryRow(6540, "Home", 6, 9, 66),
      categoryRow(6540, "Others", 5, 8, 65),
    ],
    seller: [
      ["Marketplace seller", 61],
      ["Flipkart-fulfilled", 39],
    ],
    region: [
      ["Delhi · 110001", 16],
      ["Mumbai · 400001", 14],
      ["Bengaluru · 560001", 12],
      ["Hyderabad · 500001", 11],
      ["Pune · 411001", 9],
      ["Chennai · 600001", 8],
      ["Kolkata · 700001", 7],
      ["Ahmedabad · 380001", 6],
      ["Jaipur · 302012", 5],
      ["Chandigarh · 160001", 4],
    ],
    path: [
      pathRow(6540, "UPI / prepaid", 58, "Prepaid ledger mismatch · status vs bank"),
      pathRow(6540, "Card", 27, "Card refunds · 5–7 day settlement lag"),
      pathRow(6540, "Wallet", 15, "SuperCoins / wallet · instant credit expected"),
    ],
    segment: [
      ["High-value", 34],
      ["High-frequency", 27],
      ["New users", 22],
      ["Occasional", 17],
    ],
    segmentMatrix: segmentMatrix(6540, 28, 22, 24, 26),
    channel: [
      channelRow(6540, "Email", 32, [
        "Refund shows processed on your app but nothing has hit my bank account.",
        "Bank statement attached — no credit after 10 business days.",
        "Please confirm UTR number for my prepaid refund.",
        "Legal notice will follow if refund is not credited this week.",
      "Need a human review on this — auto-close is making trust worse.",
      ]),
      channelRow(6540, "Chat", 30, [
        "It's been 12 days — where is my refund? This feels like fraud.",
        "Agent said refund is done but wallet balance unchanged.",
        "Need refund today — I cancelled before dispatch.",
        "Every agent gives a different timeline — which one is true?",
      "Please escalate with evidence attached — I will not drop this.",
      ]),
      channelRow(6540, "Voice", 19, [
        "I paid prepaid and you still haven't credited me. Escalate this now.",
        "Third call this week on the same refund — no resolution.",
        "Transfer me to someone who can actually release my money.",
        "Recording this call — your app says refunded, my bank says no.",
      "Same issue for the second week — what is the permanent fix?",
      ]),
      channelRow(6540, "LinkedIn", 9, [
        "Flipkart took my money and no refund after 2 weeks.",
        "Prepaid order cancelled — still waiting for my ₹4,200 back.",
        "Posting publicly because support keeps closing my ticket.",
        "Anyone else stuck in refund limbo after cancelling prepaid orders?",
      "Share the investigation ID so I can follow up with a real owner.",
      ]),
      channelRow(6540, "X", 10, [
        "Refund shows processed but bank still empty after 12 days — thread 🧵",
        "Prepaid cancelled, wallet untouched — is this normal @flipkart?",
        "Screenshot of app vs bank statement — someone explain this.",
        "Public warning: don't cancel prepaid until you see UTR.",
      "This pattern repeats — protect other customers before it spreads.",
      ]),
    ],
    sellerSku: [
      sellerSkuRow(6540, "SLR-55102", "StyleCart Fashion", 34, "Fashion"),
      sellerSkuRow(6540, "SLR-48210", "PhoneZone Retail", 26, "Mobiles"),
      sellerSkuRow(6540, "SLR-39001", "DailyBasket Grocery", 18, "Grocery"),
      sellerSkuRow(6540, "SLR-27440", "ApplianceKart", 12, "Appliances"),
      sellerSkuRow(6540, "SLR-16088", "QuickBuy Market", 10, "Others"),
    ],
  },
  wrong: {
    verdict:
      "Wrong-item spikes track to catalogue/SKU mapping errors from a small set of fashion sellers. Push a re-verification of SKU-to-catalogue mapping for flagged sellers before the pattern scales.",
    conf: 89,
    category: [
      categoryRow(8120, "Fashion", 32, 14, 66),
      categoryRow(8120, "Mobiles", 16, 11, 63),
      categoryRow(8120, "Home", 14, 10, 61),
      categoryRow(8120, "Appliances", 12, 9, 60),
      categoryRow(8120, "Beauty", 9, 8, 59),
      categoryRow(8120, "Footwear", 7, 8, 58),
      categoryRow(8120, "Electronics", 5, 7, 57),
      categoryRow(8120, "Others", 5, 6, 56),
    ],
    seller: [
      ["Marketplace seller", 74],
      ["Flipkart-fulfilled", 26],
    ],
    region: [
      ["Kolkata · 700001", 15],
      ["Chennai · 600001", 13],
      ["Ahmedabad · 380001", 12],
      ["Surat · 395001", 11],
      ["Indore · 452001", 9],
      ["Nagpur · 440002", 8],
      ["Bhopal · 462001", 7],
      ["Ranchi · 834001", 6],
      ["Patna · 800001", 5],
      ["Guwahati · 781001", 4],
    ],
    path: [
      pathRow(8120, "Ekart · East", 39, "East FC pick errors · fashion SKUs"),
      pathRow(8120, "Partner-A", 34, "Catalogue mismatch · marketplace sellers"),
      pathRow(8120, "Partner-C", 27, "Alternate 3PL · wrong bin picks"),
    ],
    segment: [
      ["New users", 33],
      ["High-frequency", 26],
      ["Occasional", 22],
      ["High-value", 19],
    ],
    segmentMatrix: segmentMatrix(8120, 20, 18, 29, 33),
    channel: [
      channelRow(8120, "Chat", 40, [
        "I ordered a blue shirt and got a completely different colour — third time this month.",
        "Received XL instead of M — label on box doesn't match item inside.",
        "Wrong SKU delivered again — same seller, same mistake.",
        "Please stop sending random items — I need the exact product I paid for.",
      "Need a human review on this — auto-close is making trust worse.",
      ]),
      channelRow(8120, "Voice", 22, [
        "Wrong item again. How hard is it to pick the right SKU from the shelf?",
        "I ordered black sneakers, got white — need pickup today.",
        "Warehouse keeps sending someone else's order to my address.",
        "This seller has wrong-pick complaints every week — why still live?",
      "Please escalate with evidence attached — I will not drop this.",
      ]),
      channelRow(8120, "Email", 18, [
        "Received size M instead of L. Please send the correct item or refund.",
        "Product image on app doesn't match what was shipped.",
        "Attached photos — completely different brand than ordered.",
        "Return label attached — ship correct SKU or process refund.",
      "Same issue for the second week — what is the permanent fix?",
      ]),
      channelRow(8120, "LinkedIn", 10, [
        "Flipkart sent me the wrong product AGAIN. Sort your warehouse out.",
        "Fashion orders are a coin toss — wrong colour twice in a row.",
        "How does a marketplace this big mess up basic SKU picking?",
        "Seller keeps shipping wrong variants — marketplace QA is broken.",
      "Share the investigation ID so I can follow up with a real owner.",
      ]),
      channelRow(8120, "X", 10, [
        "Wrong colour AGAIN — fashion pick accuracy is a joke on @flipkart.",
        "Ordered M got XL — posting so others don't waste money.",
        "Third wrong SKU from same seller — why is this store still live?",
        "Warehouse roulette: you never know what colour you'll get.",
      "This pattern repeats — protect other customers before it spreads.",
      ]),
    ],
    sellerSku: [
      sellerSkuRow(8120, "SLR-61990", "TrendWear Closet", 41, "Fashion"),
      sellerSkuRow(8120, "SLR-50822", "ColourMatch Apparels", 22, "Fashion"),
      sellerSkuRow(8120, "SLR-41770", "MobilePick Store", 15, "Mobiles"),
      sellerSkuRow(8120, "SLR-30118", "HomeNest Decor", 12, "Home"),
      sellerSkuRow(8120, "SLR-22045", "PickRight Mart", 10, "Others"),
    ],
  },
  hidden: {
    verdict:
      "Fee complaints rise where platform / handling fees appear only on the final payment screen. Surface fees earlier in the funnel and push a checkout-copy review to Product / Pricing.",
    conf: 85,
    category: [
      categoryRow(4210, "Grocery", 26, 31, 70),
      categoryRow(4210, "Fashion", 18, 19, 67),
      categoryRow(4210, "Mobiles", 16, 17, 65),
      categoryRow(4210, "Home", 12, 12, 63),
      categoryRow(4210, "Beauty", 10, 11, 62),
      categoryRow(4210, "Electronics", 8, 10, 61),
      categoryRow(4210, "Appliances", 5, 9, 60),
      categoryRow(4210, "Others", 5, 8, 58),
    ],
    seller: [
      ["Marketplace seller", 52],
      ["Flipkart-fulfilled", 48],
    ],
    region: [
      ["Bengaluru · 560001", 15],
      ["Pune · 411001", 13],
      ["Delhi · 110001", 12],
      ["Mumbai · 400001", 11],
      ["Jaipur · 302012", 9],
      ["Hyderabad · 500001", 8],
      ["Chennai · 600001", 7],
      ["Ahmedabad · 380001", 6],
      ["Kolkata · 700001", 5],
      ["Lucknow · 226010", 4],
    ],
    path: [
      pathRow(4210, "Checkout screen", 63, "Fee surfaced only at payment step"),
      pathRow(4210, "Cart page", 24, "Cart-stage fee disclosure gaps"),
      pathRow(4210, "Post-order", 13, "Invoice surprise · post-checkout"),
    ],
    segment: [
      ["Occasional", 31],
      ["New users", 29],
      ["High-frequency", 23],
      ["High-value", 17],
    ],
    segmentMatrix: segmentMatrix(4210, 16, 21, 27, 36),
    channel: [
      channelRow(4210, "LinkedIn", 30, [
        "Flipkart charged me ₹49 delivery on a 'free delivery' order. Screenshots attached.",
        "Promised free delivery on Plus — still got charged at checkout.",
        "Hidden platform fee on grocery — not shown until payment page.",
        "Checkout UX hides fees until OTP — feels deliberately misleading.",
      "Need a human review on this — auto-close is making trust worse.",
      ]),
      channelRow(4210, "Chat", 28, [
        "Your checkout said free delivery but I was charged at payment. Fix this.",
        "Delivery fee appeared only after I entered OTP — misleading.",
        "Why is there a handling charge not listed on the product page?",
        "Reverse the fee or I cancel Plus — this wasn't disclosed upfront.",
      "Please escalate with evidence attached — I will not drop this.",
      ]),
      channelRow(4210, "Email", 20, [
        "Hidden fee added at the last step — I would not have ordered if I knew.",
        "Invoice shows charges not in the order summary I approved.",
        "Please refund the undisclosed convenience fee immediately.",
        "Attaching side-by-side screenshots of product page vs final bill.",
      "Same issue for the second week — what is the permanent fix?",
      ]),
      channelRow(4210, "Voice", 12, [
        "Why am I paying delivery when the product page clearly says free?",
        "Agent couldn't explain the extra ₹40 on my bill.",
        "I want the hidden charge reversed before I place another order.",
        "Read me the exact line item — none of this was shown in cart.",
      "Share the investigation ID so I can follow up with a real owner.",
      ]),
      channelRow(4210, "X", 10, [
        "Hidden ₹49 fee at checkout — product page said free delivery. Screenshots.",
        "Plus member still charged delivery — who else got hit?",
        "Fee only appeared after OTP — feels like a bait-and-switch.",
        "Posting cart vs invoice side-by-side so buyers know what to expect.",
      "This pattern repeats — protect other customers before it spreads.",
      ]),
    ],
    sellerSku: [
      sellerSkuRow(4210, "SLR-70012", "FreshDaily Grocery", 33, "Grocery"),
      sellerSkuRow(4210, "SLR-61180", "UrbanWear Co", 24, "Fashion"),
      sellerSkuRow(4210, "SLR-52040", "BeautyBox IN", 18, "Beauty"),
      sellerSkuRow(4210, "SLR-40310", "CartPlus Sellers", 15, "Others"),
      sellerSkuRow(4210, "SLR-29100", "FeeTrap Mart", 10, "Others"),
    ],
  },
  never: {
    verdict:
      "Non-delivery concentrates on long-haul lanes with repeated out-for-delivery loops. Trace the cohort and fire proactive re-promise notifications — this is an anxiety-mitigation win CX owns directly.",
    conf: 91,
    category: [
      categoryRow(3180, "Appliances", 24, 16, 84),
      categoryRow(3180, "Furniture", 18, 14, 81),
      categoryRow(3180, "Mobiles", 16, 12, 79),
      categoryRow(3180, "Fashion", 12, 10, 76),
      categoryRow(3180, "Electronics", 10, 9, 75),
      categoryRow(3180, "Home", 8, 8, 74),
      categoryRow(3180, "Grocery", 6, 7, 72),
      categoryRow(3180, "Others", 6, 6, 70),
    ],
    seller: [
      ["Marketplace seller", 57],
      ["Flipkart-fulfilled", 43],
    ],
    region: [
      ["Patna · 800001", 16],
      ["Guwahati · 781001", 14],
      ["Ranchi · 834001", 12],
      ["Lucknow · 226010", 11],
      ["Bhopal · 462001", 9],
      ["Varanasi · 221001", 8],
      ["Kanpur · 208001", 7],
      ["Jodhpur · 342001", 6],
      ["Indore · 452001", 5],
      ["Nagpur · 440002", 4],
    ],
    path: [
      pathRow(3180, "Long-haul lane", 61, "Inter-city lanes · repeated out-for-delivery loops"),
      pathRow(3180, "Ekart · North", 22, "North hub · missed delivery slots"),
      pathRow(3180, "Partner-B", 17, "Partner last-mile · no-show pattern"),
    ],
    segment: [
      ["New users", 35],
      ["High-value", 26],
      ["High-frequency", 21],
      ["Occasional", 18],
    ],
    segmentMatrix: segmentMatrix(3180, 22, 20, 30, 28),
    channel: [
      channelRow(3180, "Voice", 34, [
        "I took a day off for delivery and nobody showed up. No call, no update.",
        "Rescheduled twice — rider never came either time.",
        "Waited till 9 PM — tracking still says out for delivery.",
        "Need a confirmed slot today — can't take another leave for this.",
      "Need a human review on this — auto-close is making trust worse.",
      ]),
      channelRow(3180, "Chat", 28, [
        "Marked delivered but I was home all day — item never arrived.",
        "Delivery failed but status updated to delivered automatically.",
        "Need proof of delivery — nobody came to my flat.",
        "Bot keeps saying 'attempted' — I have CCTV showing no visit.",
      "Please escalate with evidence attached — I will not drop this.",
      ]),
      channelRow(3180, "Email", 18, [
        "Third missed delivery attempt. When will you actually deliver my order?",
        "Large appliance — need confirmed slot, not vague 'by end of day'.",
        "Escalate to hub manager — two weeks of failed attempts.",
        "Attaching work-leave letter — cost of your missed deliveries.",
      "Same issue for the second week — what is the permanent fix?",
      ]),
      channelRow(3180, "LinkedIn", 10, [
        "Flipkart says delivered — I was waiting at the door. Where is my package?",
        "Never-delivered but marked complete — this keeps happening in my pincode.",
        "Lost a full day of work waiting for a delivery that never came.",
        "Neighbors report same fake 'delivered' status on our lane.",
      "Share the investigation ID so I can follow up with a real owner.",
      ]),
      channelRow(3180, "X", 10, [
        "#NeverDelivered again — tracking says delivered, I was home all day.",
        "Took leave for appliance delivery — rider never showed. Thread.",
        "Fake 'delivered' status in our pincode — neighbours seeing the same.",
        "Posting CCTV timestamp because support says 'attempted'.",
      "This pattern repeats — protect other customers before it spreads.",
      ]),
    ],
    sellerSku: [
      sellerSkuRow(3180, "SLR-81200", "LaneEast Express", 36, "Appliances"),
      sellerSkuRow(3180, "SLR-74410", "NorthHub Dispatch", 24, "Mobiles"),
      sellerSkuRow(3180, "SLR-65502", "PartnerMile Courier", 18, "Others"),
      sellerSkuRow(3180, "SLR-50190", "CityDrop Partners", 12, "Fashion"),
      sellerSkuRow(3180, "SLR-38820", "LastMile Plus", 10, "Grocery"),
    ],
  },
  counterfeit: {
    verdict:
      "Lower volume but high blast radius and regulatory weight, concentrated on baby-food & consumables from a small set of sellers. Push a compliance-grade seller review to Trust & Safety — treat as a cliff event.",
    conf: 94,
    category: [
      categoryRow(640, "Baby & food", 34, 9, 90),
      categoryRow(640, "Beauty", 18, 7, 87),
      categoryRow(640, "Health", 14, 6, 85),
      categoryRow(640, "Electronics", 9, 5, 82),
      categoryRow(640, "Fashion", 7, 5, 81),
      categoryRow(640, "Grocery", 6, 4, 80),
      categoryRow(640, "Home", 5, 4, 79),
      categoryRow(640, "Toys", 4, 3, 78),
      categoryRow(640, "Others", 3, 3, 76),
    ],
    seller: [
      ["Marketplace seller", 91],
      ["Flipkart-fulfilled", 9],
    ],
    region: [
      ["Delhi · 110006", 17],
      ["Mumbai · 400002", 14],
      ["Kolkata · 700007", 12],
      ["Chennai · 600003", 10],
      ["Surat · 395003", 8],
      ["Bengaluru · 560001", 7],
      ["Hyderabad · 500001", 6],
      ["Ahmedabad · 380001", 5],
      ["Pune · 411001", 4],
      ["Jaipur · 302001", 3],
    ],
    path: [
      pathRow(640, "3rd-party seller", 86, "Unverified marketplace listings"),
      pathRow(640, "Reseller", 9, "Grey-market reseller channel"),
      pathRow(640, "Import", 5, "Cross-border import listings"),
    ],
    segment: [
      ["New users", 30],
      ["High-frequency", 27],
      ["High-value", 25],
      ["Occasional", 18],
    ],
    segmentMatrix: segmentMatrix(640, 26, 24, 28, 22),
    channel: [
      channelRow(640, "LinkedIn", 36, [
        "Pretty sure this baby food is fake — packaging looks off.",
        "Counterfeit beauty product — smell and texture don't match the real one.",
        "Reporting seller selling duplicate health supplements on your platform.",
        "Regulatory complaint filed — selling fake consumables is not acceptable.",
      "Need a human review on this — auto-close is making trust worse.",
      ]),
      channelRow(640, "Email", 24, [
        "Product seal was broken and expiry date looks tampered. This is dangerous.",
        "Batch number doesn't match manufacturer website — please verify.",
        "Attached comparison photos with authorised retailer packaging.",
        "Need written confirmation of authenticity before my child uses this.",
      "Please escalate with evidence attached — I will not drop this.",
      ]),
      channelRow(640, "Chat", 18, [
        "I received what looks like a counterfeit product. I want this investigated.",
        "QR code on box doesn't scan — is this genuine?",
        "Not safe to use — need immediate pickup and refund.",
        "Stop auto-closing — this is a safety issue, not a return delay.",
      "Same issue for the second week — what is the permanent fix?",
      ]),
      channelRow(640, "Voice", 10, [
        "This doesn't look genuine — I won't use it on my child until you verify.",
        "Need brand authorization proof before I open this.",
        "Escalate to trust & safety — suspected fake item.",
        "Connect me to compliance — I won't drop this until seller is delisted.",
      "Share the investigation ID so I can follow up with a real owner.",
      ]),
      channelRow(640, "X", 12, [
        "WARNING: suspect fake baby food from @flipkart seller — photos attached.",
        "Counterfeit beauty product — smell is wrong. Reporting publicly.",
        "Duplicate health supplements on marketplace — regulatory risk.",
        "Parents please check batch numbers — this seal looked tampered.",
      "This pattern repeats — protect other customers before it spreads.",
      ]),
    ],
    sellerSku: [
      {
        sellerId: "SLR-88213",
        sellerName: "NutriBaby Store",
        share: 91,
        category: "Baby & food",
        complaints: 582,
        risk: "Packaging / batch mismatch · regulatory exposure",
      },
      {
        sellerId: "SLR-77102",
        sellerName: "GlowMart Authentics",
        share: 4,
        category: "Beauty",
        complaints: 26,
      },
      {
        sellerId: "SLR-60944",
        sellerName: "PureLife Wellness",
        share: 2,
        category: "Health",
        complaints: 13,
      },
      {
        sellerId: "SLR-44018",
        sellerName: "TechClone Hub",
        share: 2,
        category: "Electronics",
        complaints: 13,
      },
      {
        sellerId: "SLR-33091",
        sellerName: "BabyCare Direct",
        share: 1,
        category: "Baby & food",
        complaints: 6,
      },
    ],
  },
  ato: {
    verdict:
      "Rare but catastrophic to trust: unauthorised logins followed by wallet / gift-card use. Escalate flagged accounts to Fraud / Security and freeze wallet movement — resolution speed is everything.",
    conf: 96,
    category: [
      categoryRow(210, "Wallet / GC", 38, 6, 96),
      categoryRow(210, "High-value SKUs", 22, 5, 94),
      categoryRow(210, "Electronics", 12, 4, 92),
      categoryRow(210, "Fashion", 8, 4, 90),
      categoryRow(210, "Appliances", 7, 3, 89),
      categoryRow(210, "Grocery", 5, 3, 88),
      categoryRow(210, "Home", 4, 2, 87),
      categoryRow(210, "Others", 4, 2, 86),
    ],
    seller: [
      ["Marketplace seller", 34],
      ["Flipkart-fulfilled", 66],
    ],
    region: [
      ["Bengaluru · 560001", 17],
      ["Delhi · 110001", 14],
      ["Mumbai · 400001", 12],
      ["Hyderabad · 500001", 11],
      ["Pune · 411001", 9],
      ["Chennai · 600001", 8],
      ["Kolkata · 700001", 7],
      ["Ahmedabad · 380001", 6],
      ["Jaipur · 302012", 5],
      ["Chandigarh · 160001", 4],
    ],
    path: [
      pathRow(210, "Unknown device", 71, "New device login · no customer OTP"),
      pathRow(210, "SIM-swap signal", 18, "Telco SIM-swap correlation"),
      pathRow(210, "Credential reuse", 11, "Password reuse across apps"),
    ],
    segment: [
      ["High-value", 44],
      ["High-frequency", 29],
      ["Occasional", 15],
      ["New users", 12],
    ],
    segmentMatrix: segmentMatrix(210, 38, 28, 20, 14),
    channel: [
      channelRow(210, "Voice", 42, [
        "Someone used my wallet balance without my OTP. Lock my account immediately.",
        "Got SMS for login from another city — I wasn't online.",
        "Unauthorized COD order placed — cancel before dispatch.",
        "On the phone now — need fraud desk, not standard support.",
      "Need a human review on this — auto-close is making trust worse.",
      ]),
      channelRow(210, "Email", 26, [
        "Unauthorized order placed from my account — I never approved this transaction.",
        "Password reset emails I didn't request — account compromised.",
        "Need fraud investigation report for my bank dispute.",
        "Attached login alert screenshots from three unknown devices.",
      "Please escalate with evidence attached — I will not drop this.",
      ]),
      channelRow(210, "Chat", 16, [
        "My gift card was drained overnight. How did they get access?",
        "Wallet shows debit to seller I've never purchased from.",
        "Freeze my account — suspicious activity since yesterday.",
        "OTP was never entered on my phone — how was wallet debited?",
      "Same issue for the second week — what is the permanent fix?",
      ]),
      channelRow(210, "LinkedIn", 7, [
        "Account hacked on Flipkart — ₹18k gone from wallet. No response for 3 days.",
        "ATO on my Plus account — orders shipping to unknown addresses.",
        "Public alert: check your Flipkart wallet if you got odd login alerts.",
        "Sharing IOCs so others can check for unauthorized wallet debits.",
      "Share the investigation ID so I can follow up with a real owner.",
      ]),
      channelRow(210, "X", 9, [
        "Wallet drained overnight on @flipkart — no OTP on my phone. Help.",
        "Account takeover — orders shipping to addresses I've never used.",
        "Public alert: odd login SMS? Check your Flipkart wallet now.",
        "₹18k gone from wallet — still no fraud desk callback.",
      "This pattern repeats — protect other customers before it spreads.",
      ]),
    ],
    sellerSku: [
      sellerSkuRow(210, "SLR-99001", "Unknown Device Cluster", 42, "Wallet / GC"),
      sellerSkuRow(210, "SLR-88140", "GreyLogin Network", 24, "High-value SKUs"),
      sellerSkuRow(210, "SLR-77020", "SIM-Swap Linked", 16, "Wallet / GC"),
      sellerSkuRow(210, "SLR-66015", "Credential Reuse Ring", 10, "Electronics"),
      sellerSkuRow(210, "SLR-55090", "Wallet Drain Sellers", 8, "Others"),
    ],
  },
  missing: {
    verdict:
      "Paid items absent from multi-unit orders, concentrated on a specific fulfilment centre. Push shipment-manifest reconciliation for the affected SKUs to Ops before repeat contacts build.",
    conf: 93,
    category: [
      categoryRow(1120, "Mobiles", 24, 10, 86),
      categoryRow(1120, "Beauty", 18, 9, 84),
      categoryRow(1120, "Grocery", 15, 8, 82),
      categoryRow(1120, "Fashion", 13, 7, 80),
      categoryRow(1120, "Electronics", 10, 7, 79),
      categoryRow(1120, "Home", 8, 6, 78),
      categoryRow(1120, "Appliances", 6, 5, 77),
      categoryRow(1120, "Others", 6, 5, 76),
    ],
    seller: [
      ["Marketplace seller", 46],
      ["Flipkart-fulfilled", 54],
    ],
    region: [
      ["Hyderabad · 500001", 16],
      ["Chennai · 600001", 14],
      ["Bengaluru · 560001", 12],
      ["Kochi · 682001", 11],
      ["Vizag · 530001", 9],
      ["Madurai · 625001", 8],
      ["Coimbatore · 641001", 7],
      ["Trichy · 620001", 6],
      ["Mysuru · 570001", 5],
      ["Mangalore · 575001", 4],
    ],
    path: [
      pathRow(1120, "FC-South-2", 58, "Pick/pack error · multi-unit orders"),
      pathRow(1120, "Ekart · South", 26, "South last-mile · false proof-of-delivery"),
      pathRow(1120, "Partner-A", 16, "Partner hub · partial shipment"),
    ],
    segment: [
      ["High-frequency", 32],
      ["High-value", 27],
      ["New users", 24],
      ["Occasional", 17],
    ],
    segmentMatrix: segmentMatrix(1120, 23, 21, 28, 28),
    channel: [
      channelRow(1120, "Chat", 35, [
        "Tracking says delivered but there's nothing at my door — check with the rider.",
        "Empty package received — seal looked re-taped.",
        "Rider photo shows wrong building — not my address.",
        "Open-box delivery missing main unit — only accessories inside.",
      "Need a human review on this — auto-close is making trust worse.",
      ]),
      channelRow(1120, "Voice", 26, [
        "Package marked delivered to a neighbour I don't have. Where is my order?",
        "Item missing from shipment — outer box fine, product gone.",
        "Need GPS proof from delivery app — I was home.",
        "Hub says delivered — I want CCTV from the handover point.",
      "Please escalate with evidence attached — I will not drop this.",
      ]),
      channelRow(1120, "Email", 19, [
        "Item missing from the box — outer package intact but product not inside.",
        "Partial shipment — accessories missing from mobile order.",
        "Invoice shows 2 items, received only 1 — investigate warehouse.",
        "Weight on label doesn't match what I received — possible pilferage.",
      "Same issue for the second week — what is the permanent fix?",
      ]),
      channelRow(1120, "LinkedIn", 10, [
        "Flipkart 'delivered' my phone but I never received it. This is theft.",
        "Missing item report ignored for a week — no callback.",
        "Posting because support keeps auto-closing my missing-package ticket.",
        "FC error or rider theft — either way customer is left empty-handed.",
      "Share the investigation ID so I can follow up with a real owner.",
      ]),
      channelRow(1120, "X", 10, [
        "'Delivered' but phone never arrived — posting proof for others.",
        "Empty box, re-taped seal — main unit missing from shipment.",
        "Support auto-closed missing-item ticket — going public.",
        "Invoice says 2 items, box had 1 — warehouse error or theft?",
      "This pattern repeats — protect other customers before it spreads.",
      ]),
    ],
    sellerSku: [
      sellerSkuRow(1120, "SLR-83040", "FC Pick Errors East", 31, "Mobiles"),
      sellerSkuRow(1120, "SLR-72110", "OpenBox Beauty", 24, "Beauty"),
      sellerSkuRow(1120, "SLR-61080", "Grocery Partial Pack", 19, "Grocery"),
      sellerSkuRow(1120, "SLR-50070", "Fashion Incomplete", 16, "Fashion"),
      sellerSkuRow(1120, "SLR-39050", "DarkStore Gaps", 10, "Others"),
    ],
  },
};

/** Canonical ecommerce order lifecycle — S1…S9 — for stage-break trust view. */
export type TrustLifecycleStageId =
  | "S1"
  | "S2"
  | "S3"
  | "S4"
  | "S5"
  | "S6"
  | "S7"
  | "S8"
  | "S9";

export interface TrustStageAiInsight {
  headline: string;
  signal: string;
  impact: string;
  action: string;
  confidence: number;
}

export interface TrustLifecycleStageDef {
  id: TrustLifecycleStageId;
  label: string;
  shortLabel: string;
  /** Residual / latent contacts when no TRUST_DRIVER originates here. */
  latentContacts: number;
  fixOwner: string;
  cxSignal: string;
  businessIssue: string;
  evidence: readonly [string, string];
  action: string;
  aiInsight: TrustStageAiInsight;
}

export interface TrustStageBreakdown {
  categories: string;
  pincode: string;
  topComplaint: string;
  marketplaceSplit: string;
  topChannel: string;
}

export interface TrustLifecycleStage extends TrustLifecycleStageDef {
  contacts: number;
  wow: number;
  trustDropPts: number;
  sharePct: number;
  rag: TrustRagLevel;
  driverIds: TrustDriverId[];
  cliffCount: number;
  pnlAtRisk: string;
  breakdown: TrustStageBreakdown;
}

/** Full customer lifecycle — every slice must appear on the stage pie. */
export const TRUST_LIFECYCLE_STAGE_DEFS: readonly TrustLifecycleStageDef[] = [
  {
    id: "S1",
    label: "Listing & Catalogue",
    shortLabel: "Listing",
    latentContacts: 0,
    fixOwner: "Category / Catalogue",
    cxSignal: "Wrong SKU, counterfeit suspicion, and catalogue mismatch before fulfilment.",
    businessIssue: "Pre-order trust is poisoned — customers doubt what they bought before it arrives.",
    evidence: [
      "Counterfeit leads severity · blast 92 — originates at listing.",
      "Wrong-item contacts map to SKU mapping, not pick errors.",
    ],
    action: "Push seller compliance + catalogue mapping audit to Category / Seller Ops.",
    aiInsight: {
      headline: "S1 is the highest-severity origination node this week",
      signal: "Counterfeit + wrong-SKU cliffs/slopes both originate in listing/catalogue",
      impact: "Governs downstream returns, CSAT, and regulatory exposure before CX can recover",
      action: "Push top counterfeit sellers to Trust & Safety; route wrong-SKU SKUs to Catalogue",
      confidence: 93,
    },
  },
  {
    id: "S2",
    label: "Checkout & Pricing",
    shortLabel: "Checkout",
    latentContacts: 0,
    fixOwner: "Pricing / Product",
    cxSignal: "Fee surprises and hidden charges at cart — trust breaks before payment confirm.",
    businessIssue: "Checkout drop and post-purchase fee regret erode first-order trust fastest.",
    evidence: [
      "Hidden fees origin at S2 Checkout — chronic slope.",
      "First-order cohort cites fee surprise in ~1 in 5 trust contacts.",
    ],
    action: "Push fee-disclosure fix to Pricing / Product; monitor cart-abandon lift.",
    aiInsight: {
      headline: "Checkout fee opacity is a slow trust leak, not a one-off spike",
      signal: "Hidden-fees slope remains chronic with new-customer over-index",
      impact: "GMV at risk + higher post-order contacts before delivery even starts",
      action: "Push fee-disclosure gap closure to Pricing with cart-page evidence pack",
      confidence: 88,
    },
  },
  {
    id: "S3",
    label: "Payment Capture",
    shortLabel: "Payment",
    latentContacts: 1840,
    fixOwner: "Payments / Platform",
    cxSignal: "Debited-but-no-order and payment-status anxiety — money feels unsafe.",
    businessIssue: "Payment failures are S3 trust events — they must stay visible even when not yet a tracked driver card.",
    evidence: [
      "Exec pulse: ~18.4K payment-failure shoppers cited in day pulse window.",
      "Customers escalate fastest when money leaves the wallet with no order.",
    ],
    action: "Validate ledger mismatch with Payments; surface aged cases in CX queue.",
    aiInsight: {
      headline: "Payment anxiety is latent in the driver model — treat as watch-band S3",
      signal: "Debit-without-order clusters sit beside checkout and refund friction",
      impact: "Fastest path to 'my money is unsafe' narrative if unowned",
      action: "Align with Payments on status truth; promote to tracked cliff if WoW > +15%",
      confidence: 84,
    },
  },
  {
    id: "S4",
    label: "Pack & Fulfilment Centre",
    shortLabel: "Pack / FC",
    latentContacts: 0,
    fixOwner: "Supply Chain / Packaging",
    cxSignal: "Damage and missing-item roots in pack/pick — customers feel quality is roulette.",
    businessIssue: "Fulfilment defects become delivery-stage complaints; fix owner sits upstream of last mile.",
    evidence: [
      "Damaged product originates S4 Pack — chronic packaging lane.",
      "Missing-item cliff originates S4 Picking — dark-store / FC error.",
    ],
    action: "Route packaging audit + pick-QA hold to Supply Chain / Dark Store.",
    aiInsight: {
      headline: "S4 is the engineering root for the two largest volume drivers",
      signal: "Damage (slope) + missing item (cliff) both originate in pack/pick",
      impact: "Reverse logistics ₹ and CSAT hit appear later at S6/S8 — fix at S4",
      action: "Route top damage pincodes + missing-item SKUs to Supply Chain this week",
      confidence: 92,
    },
  },
  {
    id: "S5",
    label: "Dispatch & Transit",
    shortLabel: "Dispatch",
    latentContacts: 2100,
    fixOwner: "Logistics / Carrier Ops",
    cxSignal: "Delay and handoff silence — customers ask 'where is my order' before damage shows.",
    businessIssue: "Transit anxiety is the bridge between FC defects and last-mile cliffs.",
    evidence: [
      "Delay clusters correlate with later damage on the same lane.",
      "No primary driver owns S5 today — treat as watch origination.",
    ],
    action: "Export delay×damage correlated lanes to Logistics for steer-co.",
    aiInsight: {
      headline: "S5 is under-instrumented — delay is the silent trust precursor",
      signal: "Transit silence precedes S6 never-delivered and S4/S6 damage complaints",
      impact: "Missed S5 ownership lets CX absorb volume that Logistics should own",
      action: "Stand up delay×damage correlated-lane view; push top lanes to Logistics",
      confidence: 81,
    },
  },
  {
    id: "S6",
    label: "Last Mile Delivery",
    shortLabel: "Delivery",
    latentContacts: 0,
    fixOwner: "Logistics / Last Mile",
    cxSignal: "Never-delivered and damaged-at-door — promise of delivery is where trust collapses.",
    businessIssue: "Manifestation stage for many defects; only some originate here (never-delivered).",
    evidence: [
      "Never-delivered cliff originates S6 Last Mile.",
      "Damage often manifests here though pack quality failed earlier.",
    ],
    action: "Push never-delivered lane recovery to Last Mile; keep damage root on Supply Chain.",
    aiInsight: {
      headline: "S6 is where customers feel the break — even when root is upstream",
      signal: "Never-delivered is the live cliff owned here; damage manifests on this stage",
      impact: "Highest emotional intensity contacts; drives public-channel amplification",
      action: "White-glove recovery on HV never-delivered; keep packaging root with Supply Chain",
      confidence: 90,
    },
  },
  {
    id: "S7",
    label: "Post-delivery Usage",
    shortLabel: "Usage",
    latentContacts: 960,
    fixOwner: "Category / Quality",
    cxSignal: "Counterfeit suspicion and quality doubt after first use — trust dies late.",
    businessIssue: "Usage-stage manifestation of listing defects (counterfeit) with slow detection.",
    evidence: [
      "Counterfeit manifests at S7 Usage — customer discovers after use.",
      "Detection still lands in S8 Returns — late, noisy, expensive.",
    ],
    action: "Accelerate authenticity checks pre-use; bridge Category early on suspect SKUs.",
    aiInsight: {
      headline: "S7 is the delayed reveal — listing fraud becomes a usage cliff",
      signal: "Counterfeit manifests in usage long after purchase intent was formed",
      impact: "Late detection inflates returns cost and regulatory narrative risk",
      action: "Push authenticity QA earlier; keep seller hold request with Trust & Safety",
      confidence: 89,
    },
  },
  {
    id: "S8",
    label: "Returns & Refunds",
    shortLabel: "Refunds",
    latentContacts: 0,
    fixOwner: "CX + Payments",
    cxSignal: "Refund not credited — money trust breaker; detection stage for most imperfections.",
    businessIssue: "S8 is both an origination cliff (refund lag) and the detection sink for the journey.",
    evidence: [
      "Refund-not-credited is a live cliff owned by CX + Payments.",
      "Most drivers detect in S8 Returns — CX sees volume that others must fix.",
    ],
    action: "Validate refund ledger mismatches; aged cases to Payments with SLA.",
    aiInsight: {
      headline: "S8 is the CX-owned money cliff — and the detection sink for the chain",
      signal: "Refund-not-credited rising fastest; other stages dump detection here",
      impact: "'My money is unsafe' erodes trust faster than delivery defects alone",
      action: "Clear aged refund ledger gaps with Payments; don’t mis-own upstream roots",
      confidence: 91,
    },
  },
  {
    id: "S9",
    label: "Account & Access",
    shortLabel: "Account",
    latentContacts: 0,
    fixOwner: "Fraud / Security",
    cxSignal: "Account takeover fear — identity and wallet trust collapse.",
    businessIssue: "ATO cliff is high-blast, low-volume — still board-level if mishandled.",
    evidence: [
      "ATO originates and manifests at S9 Account.",
      "Requires Fraud ownership — CX drafts, does not auto-lock.",
    ],
    action: "Escalate flagged wallets to Fraud: lock + step-up auth draft for approval.",
    aiInsight: {
      headline: "S9 is low volume, high blast — treat as always-on cliff watch",
      signal: "ATO contacts are sparse but severity and ePLU are extreme",
      impact: "One public ATO thread outweighs dozens of damage contacts politically",
      action: "Keep Fraud on 15-min escalate path; CX owns evidence pack only",
      confidence: 94,
    },
  },
] as const;

function parseLifecycleStageId(stageLabel: string): TrustLifecycleStageId | null {
  const match = /^S([1-9])\b/.exec(stageLabel.trim());
  if (!match) return null;
  const id = `S${match[1]}` as TrustLifecycleStageId;
  switch (id) {
    case "S1":
    case "S2":
    case "S3":
    case "S4":
    case "S5":
    case "S6":
    case "S7":
    case "S8":
    case "S9":
      return id;
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}

/**
 * RAG follows contact load first. A lone cliff with tiny volume stays Watch (amber) —
 * e.g. S9 Account / ATO at ~210 contacts — not Critical red beside 13k-pack stages.
 */
function stageRag(contacts: number, cliffCount: number, wow: number): TrustRagLevel {
  if (cliffCount >= 2 && contacts >= 1500) return "crit";
  if (contacts >= 8000 || (cliffCount >= 1 && contacts >= 5000) || (wow >= 18 && contacts >= 3000)) {
    return "crit";
  }
  if (contacts >= 4000 || (cliffCount >= 1 && contacts >= 1500) || wow >= 15) {
    return "high";
  }
  if (contacts >= 1200 || cliffCount >= 1 || wow >= 8) {
    return "watch";
  }
  return "good";
}

function formatStagePnl(drivers: readonly TrustDriver[]): string {
  if (drivers.length === 0) return "—";
  const cr = drivers
    .map((d) => {
      const m = /([\d.]+)\s*Cr/.exec(d.pnlValue);
      return m ? Number(m[1]) : 0;
    })
    .reduce((a, b) => a + b, 0);
  if (cr <= 0) return drivers[0]?.pnlValue ?? "—";
  return `₹${cr.toFixed(1)} Cr`;
}

const LATENT_STAGE_BREAKDOWNS: Record<TrustLifecycleStageId, TrustStageBreakdown> = {
  S1: { categories: "—", pincode: "—", topComplaint: "—", marketplaceSplit: "—", topChannel: "—" },
  S2: { categories: "—", pincode: "—", topComplaint: "—", marketplaceSplit: "—", topChannel: "—" },
  S3: {
    categories: "Wallet · Prepaid · UPI",
    pincode: "Mumbai · 400001",
    topComplaint: "Debited but no order",
    marketplaceSplit: "52% marketplace / 48% owned",
    topChannel: "Voice",
  },
  S4: { categories: "—", pincode: "—", topComplaint: "—", marketplaceSplit: "—", topChannel: "—" },
  S5: {
    categories: "Mobiles · Appliances · Fashion",
    pincode: "Hyderabad · 500001",
    topComplaint: "Delay / handoff silence",
    marketplaceSplit: "61% marketplace / 39% owned",
    topChannel: "Chat",
  },
  S6: { categories: "—", pincode: "—", topComplaint: "—", marketplaceSplit: "—", topChannel: "—" },
  S7: {
    categories: "Baby & food · Electronics",
    pincode: "Delhi · 110006",
    topComplaint: "Counterfeit after first use",
    marketplaceSplit: "91% marketplace / 9% owned",
    topChannel: "LinkedIn",
  },
  S8: { categories: "—", pincode: "—", topComplaint: "—", marketplaceSplit: "—", topChannel: "—" },
  S9: { categories: "—", pincode: "—", topComplaint: "—", marketplaceSplit: "—", topChannel: "—" },
};

function buildStageBreakdown(
  stageId: TrustLifecycleStageId,
  stageDrivers: readonly TrustDriver[],
): TrustStageBreakdown {
  if (stageDrivers.length === 0) {
    return LATENT_STAGE_BREAKDOWNS[stageId];
  }

  const sorted = [...stageDrivers].sort((a, b) => b.complaints - a.complaints);
  const top = sorted[0]!;
  const categories = [...new Set(sorted.map((d) => d.tags.category))].slice(0, 3).join(" · ");

  return {
    categories,
    pincode: top.tags.pincode,
    topComplaint: top.label,
    marketplaceSplit: top.tags.marketplaceVsOwned,
    topChannel: top.tags.channel,
  };
}

/** Stage × trust-break contacts — pie source for §02. */
export function buildTrustLifecycleStages(
  drivers: readonly TrustDriver[] = TRUST_DRIVERS,
): TrustLifecycleStage[] {
  const byStage = new Map<TrustLifecycleStageId, TrustDriver[]>();
  for (const d of drivers) {
    const id = parseLifecycleStageId(d.originationStage);
    if (!id) continue;
    const list = byStage.get(id) ?? [];
    list.push(d);
    byStage.set(id, list);
  }

  const staged = TRUST_LIFECYCLE_STAGE_DEFS.map((def) => {
    const stageDrivers = byStage.get(def.id) ?? [];
    const driverContacts = stageDrivers.reduce((sum, d) => sum + d.complaints, 0);
    const contacts = driverContacts > 0 ? driverContacts : def.latentContacts;
    const wow =
      stageDrivers.length > 0
        ? Math.round(
            stageDrivers.reduce((sum, d) => sum + d.wow * d.complaints, 0) / Math.max(driverContacts, 1),
          )
        : def.id === "S3"
          ? 11
          : def.id === "S5"
            ? 7
            : 4;
    const cliffCount = stageDrivers.filter((d) => d.cliffOrSlope === "cliff").length;
    const trustDropPts = Math.min(14, Math.max(1, Math.round(contacts / 2800) + cliffCount * 2));
    return {
      ...def,
      contacts,
      wow,
      trustDropPts,
      sharePct: 0,
      rag: stageRag(contacts, cliffCount, wow),
      driverIds: stageDrivers.map((d) => d.id),
      cliffCount,
      pnlAtRisk: formatStagePnl(stageDrivers),
      breakdown: buildStageBreakdown(def.id, stageDrivers),
    } satisfies TrustLifecycleStage;
  });

  const total = staged.reduce((sum, s) => sum + s.contacts, 0) || 1;
  return staged.map((s) => ({
    ...s,
    sharePct: Math.round((s.contacts / total) * 100),
  }));
}

export const TRUST_LIFECYCLE_STAGES: TrustLifecycleStage[] = buildTrustLifecycleStages();

export const TRUST_SEGMENTS: TrustSegment[] = [
  {
    label: "High-frequency customers",
    affected: 12400,
    wow: 9,
    drop: 9,
    conf: 87,
    aiInsight:
      "HF buyers drive 34% of trust contacts — repeat-route damage and refund delays dominate. Proactive outreach on the 3rd negative contact cuts escalation by ~22%.",
  },
  {
    label: "New customers (first order)",
    affected: 10500,
    wow: 12,
    drop: 12,
    conf: 86,
    aiInsight:
      "First-order cohort shows the steepest 12 pt trust drop. Never-delivered and wrong-SKU failures here convert at half the rate of repeat buyers — fast refund + apology credit is critical.",
  },
  {
    label: "High-value customers",
    affected: 7900,
    wow: 6,
    drop: 6,
    conf: 88,
    aiInsight:
      "HV buyers cite refund-not-credited and damaged premium SKUs in 71% of contacts. White-glove recovery before ₹15k+ orders churn saves an estimated 18% of at-risk GMV.",
  },
  {
    label: "Category-loyal (Mobiles)",
    affected: 6100,
    wow: 8,
    drop: 8,
    conf: 85,
    aiInsight:
      "Mobile loyalists report delivery damage and wrong-SKU at 2.1× category average. Route top 5 pincodes from the Ekart-North lane to a packaging audit within 48 hours.",
  },
];

export const TRUST_EVIDENCE: TrustEvidence[] = [
  {
    src: "Chat",
    icon: MessageSquare,
    quote: "This is the second time I received a damaged product.",
    tag: "Damaged product · Mobiles · High-frequency",
  },
  {
    src: "Voice",
    icon: Phone,
    quote: "I don't trust Flipkart delivery anymore — please pick up and refund.",
    tag: "Damaged product · Appliances · High-value",
  },
  {
    src: "Email",
    icon: Mail,
    quote: "Refund shows processed on your app but nothing has hit my bank account.",
    tag: "Refund not credited · Prepaid · New user",
  },
  {
    src: "X",
    icon: AtSign,
    quote: "Never buying from Flipkart again — third damaged TV in two months.",
    tag: "Damaged product · Reach ≈ 24k impressions",
  },
  {
    src: "LinkedIn",
    icon: Linkedin,
    quote: "Prepaid order cancelled — still waiting for my ₹4,200 back after 12 days.",
    tag: "Refund not credited · Payments · Public post",
  },
];

export const TRUST_ACTIONS: TrustAction[] = [
  {
    issue: "Damage rising in Appliances & Mobiles",
    cause: "35% of trust complaints · 68% marketplace · Ekart-North · Tier-2",
    team: "Supply Chain / Packaging",
    action: "Push a packaging & handling audit to Supply Chain for the top 5 pincodes.",
    kind: "Route",
  },
  {
    issue: "Refund-not-credited spike (+22% WoW)",
    cause: "18% of trust complaints · prepaid ledger mismatch",
    team: "Payments / CX",
    action: "Validate mismatch; expose a proactive refund ETA.",
    kind: "Route",
  },
  {
    issue: "Wrong-item spike in Fashion",
    cause: "22% of trust complaints · seller SKU-mapping errors",
    team: "Marketplace / Catalogue",
    action: "Push SKU-to-catalogue mapping re-verification to Marketplace for flagged sellers.",
    kind: "Route",
  },
  {
    issue: "Counterfeit concern in Baby & consumables",
    cause: "High severity + regulatory exposure",
    team: "Trust & Safety / Compliance",
    action: "Push a seller compliance review to Trust & Safety / Compliance.",
    kind: "Escalate",
  },
  {
    issue: "Hidden-fee complaints (+31% WoW)",
    cause: "Fees disclosed late in checkout",
    team: "Product / Pricing",
    action: "Push a fee-communication clarity review to Product / Pricing.",
    kind: "Route",
  },
  {
    issue: "Never-delivered cohort, high anxiety",
    cause: "Long-haul lanes; contact not yet raised",
    team: "CX — owned lever",
    action: "Fire proactive re-promise notifications before contact.",
    kind: "Act now",
  },
];

const TRUST_TOTAL_COMPLAINTS = TRUST_DRIVERS.reduce((sum, driver) => sum + driver.complaints, 0);
const TOP_TRUST_DRIVER = sortDriversBySeverity(TRUST_DRIVERS)[0];
const TRUST_WEIGHTED_REPEAT =
  TRUST_DRIVERS.reduce((sum, driver) => sum + driver.complaints * driver.repeat, 0) / TRUST_TOTAL_COMPLAINTS;

export { TRUST_TOTAL_COMPLAINTS, TOP_TRUST_DRIVER };

/** 7D is the baseline model week — other ranges rescale volumes / GMV / deltas from it. */
export function trustRangeScale(range: TrustRangeKey): number {
  return TRUST_RANGES[range].f;
}

export function scaleTrustCount(n: number, range: TrustRangeKey): number {
  return Math.max(0, Math.round(n * TRUST_RANGES[range].f));
}

/** Period deltas: spikier on 24H, smoother on 30D vs the 7D WoW baseline. */
export function scaleTrustDelta(pct: number, range: TrustRangeKey): number {
  const mult = range === "24H" ? 0.42 : range === "30D" ? 0.88 : 1;
  return Math.round(pct * mult * 10) / 10;
}

export function scaleTrustCrLabel(label: string, range: TrustRangeKey): string {
  const match = /([\d.]+)\s*Cr/.exec(label);
  if (!match) return label;
  const scaled = Number(match[1]) * TRUST_RANGES[range].f;
  if (!Number.isFinite(scaled) || scaled <= 0) return label;
  const digits = scaled < 1 ? 2 : 1;
  return `₹${scaled.toFixed(digits)} Cr`;
}

export type SlopeTrajectory = "Steepening" | "Steady" | "Easing";

export interface SlopeEventMetrics {
  /** Weekly complaint-growth gradient, e.g. 3.1 */
  gradientPctPerWeek: number;
  /** Visual slope angle for the gradient callout */
  gradientAngleDeg: number;
  /** How long this slope has been building */
  buildingDays: number;
  trajectory: SlopeTrajectory;
  /** Time-to-critical callout, e.g. "~3 weeks" */
  reachesCritical: string;
}

/**
 * Slope-event operating metrics — derived from incident rate / blast / WoW,
 * then soft-shifted by timeframe so 24H / 7D / 30D stay coherent.
 */
export function getSlopeEventMetrics(d: TrustDriver, range: TrustRangeKey): SlopeEventMetrics {
  const baseGradient = d.incidentRate;
  const baseAngle = Math.round(10 + baseGradient * 9);
  const baseBuildingDays = Math.round(14 + d.blastRadius * 0.5);
  const wow = scaleTrustDelta(d.wow, range);
  const trajectory: SlopeTrajectory = wow >= 10 ? "Steepening" : wow >= 0 ? "Steady" : "Easing";

  switch (range) {
    case "24H": {
      const gradientPctPerWeek = Math.round(baseGradient * 1.35 * 10) / 10;
      const buildingDays = Math.max(5, Math.round(baseBuildingDays * 0.5));
      return {
        gradientPctPerWeek,
        gradientAngleDeg: Math.min(55, Math.round(baseAngle * 1.12)),
        buildingDays,
        trajectory: wow >= 4 ? "Steepening" : trajectory,
        reachesCritical: buildingDays <= 10 ? "~1 week" : `~${Math.max(1, Math.round(buildingDays / 7))} weeks`,
      };
    }
    case "30D": {
      const gradientPctPerWeek = Math.round(baseGradient * 0.88 * 10) / 10;
      const buildingDays = Math.round(baseBuildingDays * 1.45);
      return {
        gradientPctPerWeek,
        gradientAngleDeg: Math.max(18, Math.round(baseAngle * 0.92)),
        buildingDays,
        trajectory: wow >= 12 ? "Steepening" : trajectory,
        reachesCritical: `~${Math.max(2, Math.round(buildingDays / 14))} weeks`,
      };
    }
    case "7D": {
      return {
        gradientPctPerWeek: baseGradient,
        gradientAngleDeg: baseAngle,
        buildingDays: baseBuildingDays,
        trajectory,
        reachesCritical: `~${Math.max(1, Math.round(baseBuildingDays / 14))} weeks`,
      };
    }
    default: {
      const _exhaustive: never = range;
      return _exhaustive;
    }
  }
}

export function scaleTrustDriverCut(cut: TrustDriverCut, range: TrustRangeKey): TrustDriverCut {
  const sc = (n: number): number => scaleTrustCount(n, range);
  const sd = (n: number): number => Math.round(scaleTrustDelta(n, range));
  return {
    ...cut,
    category: cut.category.map((row) => ({
      ...row,
      complaints: sc(row.complaints),
      wow: sd(row.wow),
    })),
    path: cut.path.map((row) => ({ ...row, complaints: sc(row.complaints) })),
    segmentMatrix: cut.segmentMatrix.map((row) => ({ ...row, complaints: sc(row.complaints) })),
    channel: cut.channel.map((row) => ({ ...row, complaints: sc(row.complaints) })),
    sellerSku: cut.sellerSku.map((row) => ({
      ...row,
      complaints: row.complaints == null ? undefined : sc(row.complaints),
    })),
  };
}

const TRUST_PULSE_BASE = {
  trustIndex: 72,
  trustRag: "high" as TrustRagLevel,
  trustDelta: -4,
  cliffCount: liveCliffCount(),
  topBreakerShare: Math.round((TOP_TRUST_DRIVER.complaints / TRUST_TOTAL_COMPLAINTS) * 100),
  topBreakerWow: TOP_TRUST_DRIVER.wow,
  customersImpacted: Math.round(TRUST_TOTAL_COMPLAINTS / TRUST_WEIGHTED_REPEAT),
  customersDelta: 12,
  sentimentScore: 0.55,
  sentimentDelta: -0.06,
  resolutionScore: 0.74,
  resolutionDelta: -0.05,
  csatScore: 3.9,
  csatDelta: -0.2,
  sentimentSpark: [0.61, 0.6, 0.59, 0.58, 0.57, 0.56, 0.55] as const,
  resolutionSpark: [0.79, 0.78, 0.77, 0.76, 0.75, 0.75, 0.74] as const,
  csatSpark: [4.1, 4.05, 4.0, 3.95, 3.92, 3.91, 3.9] as const,
  repeatContactRate: Math.round(TRUST_WEIGHTED_REPEAT * 10) / 10,
  repeatContactDelta: 0.3,
  repeatContactSpark: [1.8, 1.85, 1.9, 1.95, 2.0, 2.05, 2.1] as const,
  modelConfidence: 91,
  verdictConf: 91,
};

type TrustPulseSnapshot = typeof TRUST_PULSE_BASE;

/** Range-specific outcome scores — rates/indexes, not just volume multiply. */
const TRUST_PULSE_RANGE_OVERLAY: Record<
  TrustRangeKey,
  Pick<
    TrustPulseSnapshot,
    | "trustIndex"
    | "trustRag"
    | "trustDelta"
    | "customersDelta"
    | "sentimentScore"
    | "sentimentDelta"
    | "resolutionScore"
    | "resolutionDelta"
    | "csatScore"
    | "csatDelta"
    | "repeatContactDelta"
    | "modelConfidence"
    | "verdictConf"
  > & { topBreakerWowMult: number }
> = {
  "24H": {
    trustIndex: 74,
    trustRag: "watch",
    trustDelta: -1,
    customersDelta: 5,
    sentimentScore: 0.58,
    sentimentDelta: -0.02,
    resolutionScore: 0.76,
    resolutionDelta: -0.01,
    csatScore: 4.0,
    csatDelta: -0.05,
    repeatContactDelta: 0.1,
    modelConfidence: 88,
    verdictConf: 88,
    topBreakerWowMult: 0.42,
  },
  "7D": {
    trustIndex: 72,
    trustRag: "high",
    trustDelta: -4,
    customersDelta: 12,
    sentimentScore: 0.55,
    sentimentDelta: -0.06,
    resolutionScore: 0.74,
    resolutionDelta: -0.05,
    csatScore: 3.9,
    csatDelta: -0.2,
    repeatContactDelta: 0.3,
    modelConfidence: 91,
    verdictConf: 91,
    topBreakerWowMult: 1,
  },
  "30D": {
    trustIndex: 69,
    trustRag: "high",
    trustDelta: -6,
    customersDelta: 21,
    sentimentScore: 0.51,
    sentimentDelta: -0.1,
    resolutionScore: 0.7,
    resolutionDelta: -0.08,
    csatScore: 3.7,
    csatDelta: -0.35,
    repeatContactDelta: 0.55,
    modelConfidence: 93,
    verdictConf: 93,
    topBreakerWowMult: 0.88,
  },
};

export function getTrustPulse(range: TrustRangeKey = "7D") {
  const overlay = TRUST_PULSE_RANGE_OVERLAY[range];
  const customersImpacted = scaleTrustCount(TRUST_PULSE_BASE.customersImpacted, range);
  const topBreakerWow = Math.round(TRUST_PULSE_BASE.topBreakerWow * overlay.topBreakerWowMult);
  const periodLabel = TRUST_RANGES[range].delta;
  const insight = deriveTrustPulseInsight({
    trustIndex: overlay.trustIndex,
    trustDelta: overlay.trustDelta,
    sentimentDelta: overlay.sentimentDelta,
    resolutionDelta: overlay.resolutionDelta,
    csatDelta: overlay.csatDelta,
    repeatContactDelta: overlay.repeatContactDelta,
  });
  const verdictBase = deriveTrustVerdict();
  const verdict = verdictBase.replace(/WoW/g, periodLabel);

  return {
    ...TRUST_PULSE_BASE,
    trustIndex: overlay.trustIndex,
    trustRag: overlay.trustRag,
    trustDelta: overlay.trustDelta,
    customersImpacted,
    customersDelta: overlay.customersDelta,
    sentimentScore: overlay.sentimentScore,
    sentimentDelta: overlay.sentimentDelta,
    resolutionScore: overlay.resolutionScore,
    resolutionDelta: overlay.resolutionDelta,
    csatScore: overlay.csatScore,
    csatDelta: overlay.csatDelta,
    repeatContactDelta: overlay.repeatContactDelta,
    topBreakerWow,
    modelConfidence: overlay.modelConfidence,
    verdictConf: overlay.verdictConf,
    verdict,
    insight,
    period: TRUST_RANGES[range].period,
    deltaLabel: periodLabel,
  };
}

/** Back-compat 7D snapshot used by static call sites. Prefer getTrustPulse(range). */
export const TRUST_PULSE = getTrustPulse("7D");
