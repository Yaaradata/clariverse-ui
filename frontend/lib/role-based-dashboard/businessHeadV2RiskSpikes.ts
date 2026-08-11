import type { RiskSpike } from "@/components/unified/actions/AIRiskSpikeMonitor";
import type { TimeRangeKey } from "@/components/role-based-dashboard/category-intelligence-v2/components/common/TimeRangeSelector";

/** Business Head — growth, availability, and retention risk spikes (7D baseline). */
export const BUSINESS_HEAD_V2_RISK_SPIKES: RiskSpike[] = [
  {
    id: "bh-fashion-share",
    timestamp: "Last 7d",
    spikeType: "Volume Surge",
    magnitude: 9,
    channel: "Demand · GMV",
    topIntent: "Growth lagging market",
    topIntentContext: "↑ Ties to · Growth & Share",
    aiAction: "",
    severity: "critical",
    cardTitle: "Share Slip — Fashion",
    customMetrics: [
      { label: "GMV growth", value: "9% → 4%", delta: "5 pts", deltaIntent: "bad", trend: "down" },
      { label: "Market gap", value: "+5 → +9 pts", delta: "widening", deltaIntent: "bad", trend: "up" },
    ],
    triggerInsight:
      "Fashion growth halved vs market — mid-band price + selection gap. Route to merchandising.",
  },
  {
    id: "bh-new-buyer-stall",
    timestamp: "Last 7d",
    spikeType: "Volume Surge",
    magnitude: 42,
    channel: "Acquisition",
    topIntent: "New-GMV share falling",
    topIntentContext: "↑ Ties to · Growth & Share",
    aiAction: "",
    severity: "moderate",
    cardTitle: "New-Buyer Stall",
    customMetrics: [
      { label: "New-GMV share", value: "46% → 42%", delta: "4 pts", deltaIntent: "bad", trend: "down" },
      { label: "Acquisition mix", value: "Paid-heavy", delta: "not demand", deltaIntent: "neutral", trend: "up" },
    ],
    triggerInsight:
      "New-buyer contribution slipping — acquisition mix, not category demand. Review paid + selection funnel.",
  },
  {
    id: "bh-appliance-stockout",
    timestamp: "Last 7d",
    spikeType: "Unresolved Surge",
    magnitude: 11,
    channel: "Supply · Availability",
    topIntent: "A-SKU out-of-stock",
    topIntentContext: "↑ Ties to · Availability & Gaps",
    aiAction: "",
    severity: "critical",
    cardTitle: "Stockout Surge — Appliances",
    customMetrics: [
      { label: "A-SKU OOS rate", value: "6% → 11%", delta: "5 pts", deltaIntent: "bad", trend: "up" },
      { label: "Lost GMV", value: "₹59 → ₹77 Cr", delta: "₹18 Cr", deltaIntent: "bad", trend: "up" },
    ],
    triggerInsight:
      "Top-SKU stockouts driving ₹77 Cr lost demand — replenishment lag, not demand drop. Escalate to supply.",
  },
  {
    id: "bh-grocery-search-gap",
    timestamp: "Last 7d",
    spikeType: "Volume Surge",
    magnitude: 18,
    channel: "Demand · Search",
    topIntent: "Zero-result queries",
    topIntentContext: "↑ Ties to · Availability & Gaps",
    aiAction: "",
    severity: "moderate",
    cardTitle: "Search-Gap Spike — Grocery",
    customMetrics: [
      { label: "No-result rate", value: "13% → 18%", delta: "5 pts", deltaIntent: "bad", trend: "up" },
      { label: "Concentration", value: "3 sub-cats", delta: "mid-price", deltaIntent: "neutral", trend: "up" },
    ],
    triggerInsight:
      "Unserved searches cluster in mid-price staples — assortment gap, onboarding brief ready.",
  },
  {
    id: "bh-ncr-delivery-sla",
    timestamp: "Last 7d",
    spikeType: "SLA Spike",
    magnitude: 19,
    channel: "Fulfilment · Care",
    topIntent: "Late delivery · churn signal",
    topIntentContext: "↑ Ties to · Retention & CX",
    aiAction: "",
    severity: "critical",
    cardTitle: "Delivery-SLA Breach — NCR",
    customMetrics: [
      { label: "SLA breach", value: "8% → 19%", delta: "11 pts", deltaIntent: "bad", trend: "up" },
      { label: "LTV exposed", value: "₹22 → ₹31 Cr", delta: "cohort", deltaIntent: "bad", trend: "up" },
    ],
    triggerInsight:
      "NCR lane SLA slip is this week's top churn signal — ₹31 Cr forward LTV exposed. Route to ops.",
  },
  {
    id: "bh-repeat-rate-dip",
    timestamp: "Last 7d",
    spikeType: "Sentiment Crash",
    magnitude: 34,
    channel: "Retention · CX",
    topIntent: "Second-order drop-off",
    topIntentContext: "↑ Ties to · Retention & CX",
    aiAction: "",
    severity: "moderate",
    cardTitle: "Repeat-Rate Dip — New Cohort",
    customMetrics: [
      { label: "Repeat rate", value: "38% → 34%", delta: "4 pts", deltaIntent: "bad", trend: "down" },
      { label: "Churn theme", value: "Delivery", delta: "not price", deltaIntent: "neutral", trend: "up" },
    ],
    triggerInsight:
      "New-buyer cohort not returning — first-delivery experience, not pricing. Fix onboarding CX.",
  },
];

const RANGE_TIMESTAMP: Record<TimeRangeKey, string> = {
  "24H": "Last 24h",
  "7D": "Last 7d",
  "30D": "Last 30d",
};

/** Spikes for the active header timeframe (timestamps + mild severity emphasis). */
export function getBusinessHeadRiskSpikes(range: TimeRangeKey): RiskSpike[] {
  const stamp = RANGE_TIMESTAMP[range];
  return BUSINESS_HEAD_V2_RISK_SPIKES.map((spike) => {
    if (range === "24H") {
      const acute =
        spike.id === "bh-ncr-delivery-sla" || spike.id === "bh-appliance-stockout"
          ? ("critical" as const)
          : spike.severity;
      return { ...spike, timestamp: stamp, severity: acute };
    }
    if (range === "30D") {
      return { ...spike, timestamp: stamp };
    }
    return { ...spike, timestamp: stamp };
  });
}
