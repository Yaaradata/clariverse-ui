import type { RiskSpike } from "@/components/unified/actions/AIRiskSpikeMonitor";
import type { TrustRangeKey } from "@/components/role-based-dashboard/cx-head-retail-v3/lib/cxHeadRetailV3TrustBreakdownData";

/** V3 overview operational alerts — retail / ecommerce CX spikes (7D baseline). */
export const CX_HEAD_V3_RISK_SPIKES: RiskSpike[] = [
  {
    id: "v3-checkout-failure",
    timestamp: "Last 4h",
    spikeType: "Volume Surge",
    magnitude: 47,
    channel: "Web, Mobile App",
    topIntent: "Checkout Payment Failure",
    topIntentContext: "High impact · GMV at risk",
    aiAction: "",
    severity: "critical",
    cardTitle: "Checkout Failure Spike",
    customMetrics: [
      { label: "Abandonment rate", value: "22% → 41%", delta: "+19 pts", deltaIntent: "bad", trend: "up" },
      { label: "Failed txns", value: "840 → 2,180", delta: "+159%", deltaIntent: "bad", trend: "up" },
    ],
    triggerInsight:
      "Payment gateway timeout on mobile checkout — escalate to platform team; enable fallback processor before evening peak.",
  },
  {
    id: "v3-platinum-churn",
    timestamp: "Last 4h",
    spikeType: "Sentiment Crash",
    magnitude: 34,
    channel: "Email, Live Chat",
    topIntent: "Membership Cancel",
    topIntentContext: "Retention window open",
    aiAction: "",
    severity: "critical",
    cardTitle: "Platinum Churn Risk",
    customMetrics: [
      { label: "Sentiment", value: "0.71 → 0.34", delta: "−0.37", deltaIntent: "bad", trend: "down" },
      { label: "Cancel intents", value: "8 → 34", delta: "+325%", deltaIntent: "bad", trend: "up" },
    ],
    triggerInsight:
      "12 Platinum members exploring cancellation after repeated delivery failures — retention offers within 2h.",
  },
  {
    id: "v3-social-late-delivery",
    timestamp: "Last 12h",
    spikeType: "Volume Surge",
    magnitude: 156,
    channel: "Social/X, Instagram",
    topIntent: "Late Delivery / Never Arrived",
    topIntentContext: "High impact · PR risk",
    aiAction: "",
    severity: "moderate",
    cardTitle: "Social Complaint Trending",
    customMetrics: [
      { label: "Mentions (4h)", value: "620 → 1,588", delta: "+156%", deltaIntent: "bad", trend: "up" },
      { label: "Top hashtag", value: "#NeverDelivered", delta: "+214%", deltaIntent: "bad", trend: "up" },
    ],
    triggerInsight:
      "Late-delivery cluster viral on X/Instagram. #NeverDelivered + promo-fee posts amplified by influencers — push social response + delivery status page in 60 min.",
  },
  {
    id: "v3-app-checkout",
    timestamp: "Last 4h",
    spikeType: "SLA Spike",
    magnitude: 28,
    channel: "App Store, Social/X",
    topIntent: "Cart Sync at Checkout",
    topIntentContext: "High impact · Fix in-flight",
    slaBefore: 12,
    slaAfter: 38,
    aiAction: "",
    severity: "moderate",
    cardTitle: "App Experience Drop",
    customMetrics: [
      { label: "App Store rating", value: "4.4 → 3.9", delta: "−0.5", deltaIntent: "bad", trend: "down" },
      { label: "iOS crash reports", value: "", delta: "+168%", deltaIntent: "bad", trend: "up" },
    ],
    triggerInsight:
      "iOS cart sync bug at payment step — mobile team escalation before next review cycle.",
  },
  {
    id: "v3-refund-surge",
    timestamp: "Last 24h",
    spikeType: "Volume Surge",
    magnitude: 38,
    channel: "App, Live Chat",
    topIntent: "Refund Request",
    topIntentContext: "Ops backlog · SLA breach",
    aiAction: "",
    severity: "critical",
    cardTitle: "Refund Request Surge",
    customMetrics: [
      { label: "Volume WoW", value: "420 → 980", delta: "+133%", deltaIntent: "bad", trend: "up" },
      { label: "Top reason", value: "Late delivery", delta: undefined, deltaIntent: "neutral" },
    ],
    triggerInsight:
      "Holiday delivery delays driving refunds — warehouse return receipt lag; add weekend shift and update ETA comms.",
  },
];

const RANGE_SPIKE_META: Record<
  TrustRangeKey,
  { magnitudeScale: number; stamp: (base: string) => string; windowLabel: string }
> = {
  "24H": {
    magnitudeScale: 0.55,
    stamp: () => "Last 4h",
    windowLabel: "today",
  },
  "7D": {
    magnitudeScale: 1,
    stamp: (base) => base,
    windowLabel: "this week",
  },
  "30D": {
    magnitudeScale: 2.4,
    stamp: () => "Last 30D",
    windowLabel: "this month",
  },
};

/** Range-aware spike list for overview — magnitudes + timestamps shift with 24H / 7D / 30D. */
export function getCxHeadV3RiskSpikes(range: TrustRangeKey = "7D"): RiskSpike[] {
  const meta = RANGE_SPIKE_META[range];
  return CX_HEAD_V3_RISK_SPIKES.map((spike) => ({
    ...spike,
    timestamp: meta.stamp(spike.timestamp),
    magnitude: Math.max(8, Math.round(spike.magnitude * meta.magnitudeScale)),
    slaBefore: spike.slaBefore != null ? Math.max(1, Math.round(spike.slaBefore * meta.magnitudeScale)) : undefined,
    slaAfter: spike.slaAfter != null ? Math.max(1, Math.round(spike.slaAfter * meta.magnitudeScale)) : undefined,
    triggerInsight: spike.triggerInsight.replace(/\bevening peak\b/i, `${meta.windowLabel} peak`),
  }));
}

export const CX_HEAD_V3_RISK_DRIVER_CONTEXT =
  "Sale payment failures · delivery promise miss · Platinum churn · viral late-delivery posts · cart sync bug";
