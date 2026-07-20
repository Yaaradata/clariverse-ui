import type { ConfidenceBand } from "./cxHeadRetailData";

/** Global evidence heuristics — not client-audited P&L. */
export const CX_MARGIN_GLOBAL_EVIDENCE = {
  returnsToMargin:
    "−5pp returns ≈ +200bps contribution margin (global heuristic — not a firm model).",
  returnCostShare: "A return ≈ ~30% of item price in reverse-logistics + write-down load.",
  inrNote: "₹ figures are client-data placeholders (mock) until the order feed lands.",
} as const;

export type CmLadderStep = {
  id: "cm1" | "cm2" | "cm3";
  label: string;
  definition: string;
  ratePct: number;
  deltaBps: number;
};

export type CxToMarginBridgeModel = {
  returnsRatePct: number;
  returnsRateDeltaPp: number;
  reverseLogisticsCostInr: string;
  lostGmvInr: string;
  cmLadder: CmLadderStep[];
  compressionNote: string;
  confidence: ConfidenceBand;
  nextAction: string;
};

/** Returns-rate → reverse-logistics + lost GMV → CM1/CM2/CM3 compression. */
export const CX_TO_MARGIN_BRIDGE: CxToMarginBridgeModel = {
  returnsRatePct: 18.4,
  returnsRateDeltaPp: 2.1,
  reverseLogisticsCostInr: "₹4.8L / wk",
  lostGmvInr: "₹12.6L / wk",
  cmLadder: [
    {
      id: "cm1",
      label: "CM1",
      definition: "Gross margin after COGS",
      ratePct: 28.4,
      deltaBps: -80,
    },
    {
      id: "cm2",
      label: "CM2",
      definition: "After variable fulfilment + reverse logistics",
      ratePct: 18.9,
      deltaBps: -140,
    },
    {
      id: "cm3",
      label: "CM3",
      definition: "After allocated care / refund friction",
      ratePct: 11.2,
      deltaBps: -210,
    },
  ],
  compressionNote:
    "CX returns-rate lifts reverse-logistics cost and lost GMV — CM compresses down the ladder.",
  confidence: "Med-High",
  nextAction: "Prioritise return-driver intents on high-ASP categories before CM3 bottoms out.",
};

export const GMV_CONVENTION_TOOLTIP =
  "GMV convention varies by feed: GST inclusion, discounts, and returns treatment differ across client extracts. Treat strip GMV as directional until convention is locked.";

export type CategoryPnlRow = {
  id: string;
  category: string;
  gmvInr: string;
  aovInr: string;
  aspInr: string;
  takeRatePct: number;
  cm1Pct: number;
  cm2Pct: number;
  cm3Pct: number;
  gmroi: number;
  sellThroughPct: number;
  returnsRatePct: number;
};

export const CATEGORY_PNL_ROWS: CategoryPnlRow[] = [
  {
    id: "electronics",
    category: "Electronics",
    gmvInr: "₹86.2Cr",
    aovInr: "₹4,820",
    aspInr: "₹3,140",
    takeRatePct: 12.4,
    cm1Pct: 24.1,
    cm2Pct: 15.2,
    cm3Pct: 8.4,
    gmroi: 3.1,
    sellThroughPct: 71,
    returnsRatePct: 22.8,
  },
  {
    id: "fashion",
    category: "Fashion",
    gmvInr: "₹54.7Cr",
    aovInr: "₹1,680",
    aspInr: "₹920",
    takeRatePct: 18.6,
    cm1Pct: 42.0,
    cm2Pct: 28.4,
    cm3Pct: 16.1,
    gmroi: 4.4,
    sellThroughPct: 64,
    returnsRatePct: 28.4,
  },
  {
    id: "grocery-qc",
    category: "Grocery / QC",
    gmvInr: "₹31.4Cr",
    aovInr: "₹620",
    aspInr: "₹145",
    takeRatePct: 8.2,
    cm1Pct: 18.6,
    cm2Pct: 11.4,
    cm3Pct: 6.8,
    gmroi: 8.2,
    sellThroughPct: 88,
    returnsRatePct: 6.1,
  },
  {
    id: "home",
    category: "Home",
    gmvInr: "₹22.1Cr",
    aovInr: "₹2,240",
    aspInr: "₹1,480",
    takeRatePct: 14.1,
    cm1Pct: 31.2,
    cm2Pct: 19.8,
    cm3Pct: 12.4,
    gmroi: 2.7,
    sellThroughPct: 58,
    returnsRatePct: 14.2,
  },
];

/** Periodic / strategic Relational NPS — not a real-time happiness pulse. */
export type RelationalNpsModel = {
  score: number;
  deltaPts: number;
  period: string;
  cadence: string;
  promotersPct: number;
  passivesPct: number;
  detractorsPct: number;
  byValueTier: { tier: string; score: number }[];
  confidence: ConfidenceBand;
  note: string;
  relocatedFrom: string;
};

export const RELATIONAL_NPS: RelationalNpsModel = {
  score: 42,
  deltaPts: -3,
  period: "Q1 FY26",
  cadence: "Quarterly · strategic",
  promotersPct: 48,
  passivesPct: 30,
  detractorsPct: 22,
  byValueTier: [
    { tier: "HVHF", score: 58 },
    { tier: "HVLF", score: 51 },
    { tier: "LVHF", score: 38 },
    { tier: "LVLF", score: 29 },
  ],
  confidence: "Med-High",
  note: "Relational NPS is periodic and strategic — relocated off the real-time happiness card.",
  relocatedFrom: "Customer happiness · real-time pulse",
};
