import type { ConfidenceBand } from "./cxHeadRetailData";

/** Our 6-stage retail lifecycle — not an industry-standard taxonomy. */
export const LIFECYCLE_MATRIX_STAGES = [
  "Discovery",
  "Checkout/Payment",
  "Fulfilment/Shipping",
  "Delivery/Unboxing",
  "Returns/Refund",
  "Post-order/Account",
] as const;

export type LifecycleMatrixStage = (typeof LIFECYCLE_MATRIX_STAGES)[number];

export type CliffSlopeTag = "cliff" | "slope";

export type LifecycleMatrixCell = {
  id: string;
  stage: LifecycleMatrixStage;
  /** Top complaint for this stage cell. */
  topComplaint: string;
  cliffOrSlope: CliffSlopeTag;
  owner: string;
  nextAction: string;
  /** Contacts attributed to this breakage. */
  incidents: number;
  /** Incident rate per 1k units. */
  incidentRate: number;
  /** Network-effect / blast radius 0–100 — inferred. */
  blastRadius: number;
  blastConfidence: ConfidenceBand;
  drill: {
    breakage: string;
    category: string;
    pinCode: string;
    marketplaceVsOwn: string;
  };
};

/** Severity sort key — incident rate × network effect (never raw count alone). */
export function lifecycleSeverity(cell: LifecycleMatrixCell): number {
  return cell.incidentRate * cell.blastRadius;
}

/**
 * One primary cell per lifecycle stage.
 * Ranked for the above-fold strip by severity, not volume.
 */
export const LIFECYCLE_MATRIX_CELLS: LifecycleMatrixCell[] = [
  {
    id: "disc-counterfeit",
    stage: "Discovery",
    topComplaint: "Counterfeit / not-as-described listing",
    cliffOrSlope: "cliff",
    owner: "Category / Seller Ops",
    nextAction: "Hold top-3 counterfeit sellers · push listing audit pack today",
    incidents: 1840,
    incidentRate: 4.2,
    blastRadius: 92,
    blastConfidence: "High",
    drill: {
      breakage: "Counterfeit Concern",
      category: "Electronics · earbuds",
      pinCode: "560034 · Koramangala",
      marketplaceVsOwn: "78% marketplace / 22% own",
    },
  },
  {
    id: "chk-hidden-fee",
    stage: "Checkout/Payment",
    topComplaint: "Hidden fee / price surprise at cart",
    cliffOrSlope: "slope",
    owner: "Pricing / Product",
    nextAction: "Ship fee-disclosure fix on cart · monitor abandon lift 48h",
    incidents: 3120,
    incidentRate: 2.8,
    blastRadius: 48,
    blastConfidence: "Med-High",
    drill: {
      breakage: "Hidden fee",
      category: "Fashion · apparel",
      pinCode: "110016 · South Delhi",
      marketplaceVsOwn: "41% marketplace / 59% own",
    },
  },
  {
    id: "ful-damage",
    stage: "Fulfilment/Shipping",
    topComplaint: "Damaged in pack / transit",
    cliffOrSlope: "slope",
    owner: "Supply Chain / Packaging",
    nextAction: "Route Ekart-North packaging QA hold · Tier-2 pincode pack",
    incidents: 12840,
    incidentRate: 3.1,
    blastRadius: 55,
    blastConfidence: "High",
    drill: {
      breakage: "Damaged Product",
      category: "Mobiles",
      pinCode: "302012 · Jaipur",
      marketplaceVsOwn: "68% marketplace / 32% own",
    },
  },
  {
    id: "del-missing",
    stage: "Delivery/Unboxing",
    topComplaint: "Item missing / never delivered",
    cliffOrSlope: "cliff",
    owner: "Logistics / Last Mile",
    nextAction: "Open missing-item war-room · dark-store + last-mile dual hold",
    incidents: 4210,
    incidentRate: 1.9,
    blastRadius: 78,
    blastConfidence: "High",
    drill: {
      breakage: "Item Missing",
      category: "Grocery · dark-store",
      pinCode: "560095 · HSR",
      marketplaceVsOwn: "12% marketplace / 88% own",
    },
  },
  {
    id: "ret-refund",
    stage: "Returns/Refund",
    topComplaint: "Refund not credited",
    cliffOrSlope: "cliff",
    owner: "Payments / Finance Ops",
    nextAction: "Clear aged refund ledger mismatches · Plus members first",
    incidents: 2860,
    incidentRate: 2.4,
    blastRadius: 84,
    blastConfidence: "Med-High",
    drill: {
      breakage: "Refund Not Credited",
      category: "Cross-category prepaid",
      pinCode: "400001 · Fort",
      marketplaceVsOwn: "55% marketplace / 45% own",
    },
  },
  {
    id: "post-ato",
    stage: "Post-order/Account",
    topComplaint: "Account takeover / OTP abuse",
    cliffOrSlope: "cliff",
    owner: "Trust & Safety / Platform",
    nextAction: "Escalate ATO cluster to Trust & Safety · freeze suspect cohort",
    incidents: 640,
    incidentRate: 0.7,
    blastRadius: 96,
    blastConfidence: "High",
    drill: {
      breakage: "Account Takeover",
      category: "Account security",
      pinCode: "National · multi-PIN",
      marketplaceVsOwn: "N/A · platform account",
    },
  },
];

export const LIFECYCLE_MATRIX_MODEL_NOTE =
  "Our trust-breakdown model — cliff = rare high blast-radius; slope = chronic. Scored on incident rate × network effect.";

/** Above-fold strip — top breakages by severity, not raw count. */
export function rankedLifecycleBreakages(
  cells: readonly LifecycleMatrixCell[] = LIFECYCLE_MATRIX_CELLS,
): LifecycleMatrixCell[] {
  return [...cells].sort((a, b) => lifecycleSeverity(b) - lifecycleSeverity(a));
}

export type PerfectOrderVertical = "apparel" | "electronics" | "grocery";

export type PerfectOrderFactor = {
  id: "onTime" | "complete" | "damageFree" | "accurateDocs";
  label: string;
  /** Industry 4-factor POR component. */
  rate: number;
  target: number;
};

export type PerfectOrderVerticalConfig = {
  id: PerfectOrderVertical;
  label: string;
  /** Vertical-specific failure criteria beyond the 4-factor core. */
  failureCriteria: string;
  /** Extra note when vertical extends discovery/checkout. */
  extensionNote: string;
};

export const PERFECT_ORDER_FACTORS: PerfectOrderFactor[] = [
  { id: "onTime", label: "On-time", rate: 91.2, target: 95 },
  { id: "complete", label: "Complete", rate: 94.8, target: 98 },
  { id: "damageFree", label: "Damage-free", rate: 96.1, target: 99 },
  { id: "accurateDocs", label: "Accurate docs", rate: 97.4, target: 99 },
];

/** Composite POR = product of four factor rates (mock). */
export const PERFECT_ORDER_RATE = 80.4;

export const PERFECT_ORDER_VERTICALS: PerfectOrderVerticalConfig[] = [
  {
    id: "apparel",
    label: "Apparel",
    failureCriteria: "Open-box / try-on mismatch counts as imperfect — sealed intact is not enough.",
    extensionNote: "Size/fit discovery + checkout fee surprise extend the 4-factor core.",
  },
  {
    id: "electronics",
    label: "Electronics",
    failureCriteria: "Sealed-box intact is required; open-box does not apply as a success criteria.",
    extensionNote: "Listing accuracy (discovery) and payment-capture truth extend the 4-factor core.",
  },
  {
    id: "grocery",
    label: "Grocery / dark-store",
    failureCriteria: "Cold-chain break or substitution without consent counts as imperfect.",
    extensionNote: "Slot promise at checkout extends the 4-factor core for quick commerce.",
  },
];

export const PERFECT_ORDER_NEXT_ACTION =
  "Close damage-free gap on Mobiles Ekart-North · own the packaging QA hold this week";

export const FCR_REPEAT_METRICS = {
  fcrRate: 68,
  fcrBenchmark: { low: 70, high: 80, tag: "global" as const },
  repeatRate: 34,
  repeatBenchmark: { low: 10, high: 20, tag: "global" as const },
  intent: "refund-status",
  nextAction: "Route refund-status cause → process owner — fix the ledger, not the queue depth",
};
