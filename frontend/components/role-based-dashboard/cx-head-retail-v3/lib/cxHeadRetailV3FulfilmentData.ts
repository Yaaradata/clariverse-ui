import type { ConfidenceBand } from "./cxHeadRetailData";

/** Customer-facing OTIF vs stock-facing Fill — never treated as the same KPI. */
export type FulfilmentMetricId = "otif" | "fill" | "ndr" | "rto" | "rts";

export type FulfilmentMetricTile = {
  id: FulfilmentMetricId;
  label: string;
  /** Face definition — keeps OTIF ≠ Fill and RTO ≠ RTS honest. */
  definition: string;
  value: number;
  unit: "%";
  delta: string;
  deltaTone: "warn" | "up" | "down" | "flat";
  /** Lower is better for NDR / RTO / RTS; higher for OTIF / Fill. */
  lowerIsBetter: boolean;
  accent: "high" | "med" | "positive";
  lever?: string;
};

export const FULFILMENT_METRIC_TILES: FulfilmentMetricTile[] = [
  {
    id: "otif",
    label: "OTIF",
    definition: "On-time-in-full · customer-facing delivery promise",
    value: 91.2,
    unit: "%",
    delta: "−1.4 pts vs 7D",
    deltaTone: "warn",
    lowerIsBetter: false,
    accent: "med",
  },
  {
    id: "fill",
    label: "Fill Rate",
    definition: "Stock-facing availability at promise time — not OTIF",
    value: 94.8,
    unit: "%",
    delta: "+0.3 pts vs 7D",
    deltaTone: "up",
    lowerIsBetter: false,
    accent: "positive",
  },
  {
    id: "ndr",
    label: "NDR",
    definition: "Non-delivery report · address / access miss",
    value: 6.4,
    unit: "%",
    delta: "+0.8 pts vs 7D",
    deltaTone: "warn",
    lowerIsBetter: true,
    accent: "med",
    lever: "~24h containment lever — reattempt / reconfirm before RTO path",
  },
  {
    id: "rto",
    label: "RTO",
    definition: "Return-to-origin · failed delivery never reached customer",
    value: 22.6,
    unit: "%",
    delta: "+1.1 pts vs 7D",
    deltaTone: "warn",
    lowerIsBetter: true,
    accent: "high",
  },
  {
    id: "rts",
    label: "RTS",
    definition: "Return-to-seller · customer-initiated return after receipt",
    value: 8.1,
    unit: "%",
    delta: "−0.2 pts vs 7D",
    deltaTone: "down",
    lowerIsBetter: true,
    accent: "med",
  },
];

/** India e-comm RTO band — category-dependent; vendor estimate, not a firm SLA. */
export const RTO_BENCHMARK = {
  low: 20,
  high: 25,
  costPerRto: "₹180–240 / RTO",
  tag: "India · vendor-estimate",
  note: "Category-dependent. Not a contractual SLA — use to frame hotspot priority.",
} as const;

export type LastMileLineId = "rider" | "courier";

export type LastMileLineScorecard = {
  id: LastMileLineId;
  title: string;
  subtitle: string;
  slaOwner: string;
  rtoOwner: string;
  otif: number;
  fill: number;
  ndr: number;
  rto: number;
  rts: number;
  hotspotNote: string;
};

/** Rider (own last-mile) vs Courier (3PL) — separate SLA / RTO ownership. */
export const LAST_MILE_LINES: LastMileLineScorecard[] = [
  {
    id: "rider",
    title: "Rider",
    subtitle: "Own last-mile fleet",
    slaOwner: "City Ops · Rider fleet",
    rtoOwner: "Last-mile Ops (own)",
    otif: 93.4,
    fill: 95.1,
    ndr: 4.8,
    rto: 18.2,
    rts: 7.4,
    hotspotNote: "OTIF holds; NDR containment inside 24h is the lever.",
  },
  {
    id: "courier",
    title: "Courier",
    subtitle: "3PL partner",
    slaOwner: "3PL partner desk",
    rtoOwner: "Partner SLA · Logistics",
    otif: 87.9,
    fill: 94.2,
    ndr: 8.6,
    rto: 27.4,
    rts: 9.1,
    hotspotNote: "RTO above India band — own the partner scorecard separately.",
  },
];

export type FulfilmentHotspotRow = {
  id: string;
  label: string;
  city: string;
  line: LastMileLineId;
  otif: number;
  fill: number;
  ndr: number;
  rto: number;
  rts: number;
  /** Composite for default hotspot-first sort (higher = hotter). */
  hotspotScore: number;
  status: "outbreak" | "flat" | "nominal";
  confidence: ConfidenceBand;
};

/** Catchment / node rows — scored per last-mile line, not blended. */
export const FULFILMENT_HOTSPOT_ROWS: FulfilmentHotspotRow[] = [
  {
    id: "DS-BLR-D07-rider",
    label: "Koramangala D07",
    city: "Bengaluru",
    line: "rider",
    otif: 82.1,
    fill: 91.0,
    ndr: 11.2,
    rto: 24.8,
    rts: 9.4,
    hotspotScore: 96,
    status: "outbreak",
    confidence: "High",
  },
  {
    id: "DS-BLR-D07-courier",
    label: "Koramangala D07",
    city: "Bengaluru",
    line: "courier",
    otif: 78.4,
    fill: 90.2,
    ndr: 13.8,
    rto: 31.2,
    rts: 10.1,
    hotspotScore: 99,
    status: "outbreak",
    confidence: "High",
  },
  {
    id: "DS-DEL-D11-courier",
    label: "Gurugram D11",
    city: "Delhi NCR",
    line: "courier",
    otif: 86.2,
    fill: 93.5,
    ndr: 9.1,
    rto: 28.6,
    rts: 8.8,
    hotspotScore: 78,
    status: "flat",
    confidence: "Med-High",
  },
  {
    id: "DS-HYD-D04-rider",
    label: "Gachibowli D04",
    city: "Hyderabad",
    line: "rider",
    otif: 92.8,
    fill: 95.4,
    ndr: 5.1,
    rto: 19.4,
    rts: 7.2,
    hotspotScore: 42,
    status: "flat",
    confidence: "High",
  },
  {
    id: "DS-MUM-D05-rider",
    label: "Powai D05",
    city: "Mumbai",
    line: "rider",
    otif: 94.1,
    fill: 96.0,
    ndr: 3.9,
    rto: 17.1,
    rts: 6.8,
    hotspotScore: 28,
    status: "nominal",
    confidence: "High",
  },
  {
    id: "DS-BLR-D12-courier",
    label: "Indiranagar D12",
    city: "Bengaluru",
    line: "courier",
    otif: 89.5,
    fill: 94.0,
    ndr: 7.2,
    rto: 25.4,
    rts: 8.0,
    hotspotScore: 61,
    status: "flat",
    confidence: "Med-High",
  },
  {
    id: "DS-HYD-D08-rider",
    label: "Kondapur D08",
    city: "Hyderabad",
    line: "rider",
    otif: 95.2,
    fill: 96.4,
    ndr: 3.4,
    rto: 16.2,
    rts: 6.1,
    hotspotScore: 18,
    status: "nominal",
    confidence: "High",
  },
  {
    id: "DS-DEL-D02-courier",
    label: "Saket D02",
    city: "Delhi NCR",
    line: "courier",
    otif: 88.7,
    fill: 93.8,
    ndr: 8.0,
    rto: 26.1,
    rts: 8.5,
    hotspotScore: 55,
    status: "flat",
    confidence: "Med-High",
  },
];

export type FulfilmentSortKey = FulfilmentMetricId | "hotspot";

export function sortFulfilmentRows(
  rows: FulfilmentHotspotRow[],
  sortKey: FulfilmentSortKey,
): FulfilmentHotspotRow[] {
  const tile = FULFILMENT_METRIC_TILES.find((t) => t.id === sortKey);
  const lowerIsBetter = tile?.lowerIsBetter ?? true;

  return [...rows].sort((a, b) => {
    if (sortKey === "hotspot") {
      return b.hotspotScore - a.hotspotScore;
    }
    const av = a[sortKey];
    const bv = b[sortKey];
    return lowerIsBetter ? bv - av : av - bv;
  });
}

export const FULFILMENT_SCORECARD_NOTE =
  "Dynamic performance scorecard — reorder by metric; hotspot-first by default. Rider and Courier stay separate operational lines.";
