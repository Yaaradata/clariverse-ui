import type { ConfidenceBand } from "./cxHeadRetailData";

/** Base-wide happy rate — all shoppers. Never recompute on HV-only. */
export const HAPPINESS_BASE_WIDE = {
  happyRate: 63,
  contactsScored: "53.7K",
  measuredSharePct: 72,
  inferredSharePct: 28,
  confidence: "Med-High" as ConfidenceBand,
  note: "Base-wide across all shoppers — Plus and mass. Not filtered to high-value.",
} as const;

export type ValueLens = "hv" | "lv";

export type ValueReachCell = {
  id: string;
  value: "hv" | "lv";
  reach: "low" | "high";
  title: string;
  action: string;
  detail: string;
  shoppers: string;
  gmvAtRisk: string;
};

/** Value × reach 2×2 — HV leads action; LV is managed, never dropped. */
export const VALUE_REACH_CELLS: ValueReachCell[] = [
  {
    id: "hv-low",
    value: "hv",
    reach: "low",
    title: "White-glove recovery",
    action: "Personal outreach · Plus retention desk",
    detail: "High-GMV / Plus with low social amplification — recover privately before cancel.",
    shoppers: "284 Plus · 1.1K high-GMV",
    gmvAtRisk: "₹18.4 Cr",
  },
  {
    id: "hv-high",
    value: "hv",
    reach: "high",
    title: "Top priority",
    action: "Executive war-room · public + private recovery",
    detail: "High-value shoppers with review/social virality — act first; blast radius is material.",
    shoppers: "96 Plus · viral review cluster",
    gmvAtRisk: "₹24.8 Cr",
  },
  {
    id: "lv-low",
    value: "lv",
    reach: "low",
    title: "Automate / Deflect",
    action: "Bot + self-serve · no agent queue by default",
    detail: "Mass volume, low influence — contain with automation; do not drop from the base-wide view.",
    shoppers: "4.2K standard",
    gmvAtRisk: "₹3.1 Cr",
  },
  {
    id: "lv-high",
    value: "lv",
    reach: "high",
    title: "Watch — viral / detractor signal",
    action: "Social listen · suppress brigading · route if spreads",
    detail: "Low-value but high reach — manage as a signal; never remove from the operating picture.",
    shoppers: "620 · X / review amplifiers",
    gmvAtRisk: "₹6.2 Cr",
  },
];

/** Segment knowledge table — ranked by GMV at risk so HV rises on its own. */
export type HappinessSegmentRow = {
  key: "hvhf" | "hvlf" | "lvhf" | "lvlf";
  label: string;
  valueLens: ValueLens;
  interactions: number;
  wowDelta: number;
  sentiment: number;
  cpu: number;
  resolutionRate: number;
  /** Ranking metric — ₹ Cr GMV exposed. */
  gmvAtRiskCr: number;
  color: string;
};

export const HAPPINESS_SEGMENT_ROWS: HappinessSegmentRow[] = [
  { key: "hvhf", label: "HVHF", valueLens: "hv", interactions: 9550, wowDelta: 2.1, sentiment: 0.08, cpu: 0.8, resolutionRate: 58, gmvAtRiskCr: 42.0, color: "#A855F7" },
  { key: "hvlf", label: "HVLF", valueLens: "hv", interactions: 6360, wowDelta: -0.8, sentiment: 0.03, cpu: 1.2, resolutionRate: 42, gmvAtRiskCr: 31.2, color: "#06B6D4" },
  { key: "lvhf", label: "LVHF", valueLens: "lv", interactions: 22700, wowDelta: 3.4, sentiment: 0.16, cpu: 2.1, resolutionRate: 29, gmvAtRiskCr: 18.6, color: "#6366F1" },
  { key: "lvlf", label: "LVLF", valueLens: "lv", interactions: 15130, wowDelta: -1.5, sentiment: 0.26, cpu: 2.8, resolutionRate: 15, gmvAtRiskCr: 9.4, color: "#94A3B8" },
];

export function segmentsRankedByGmvAtRisk(
  rows: readonly HappinessSegmentRow[] = HAPPINESS_SEGMENT_ROWS,
): HappinessSegmentRow[] {
  return [...rows].sort((a, b) => b.gmvAtRiskCr - a.gmvAtRiskCr);
}
