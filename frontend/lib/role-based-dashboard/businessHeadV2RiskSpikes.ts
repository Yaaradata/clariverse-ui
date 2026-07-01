import type { RiskSpike } from "@/components/unified/actions/AIRiskSpikeMonitor";

/** Business Head V2 category signals — operational risk spikes on the overview front. */
export const BUSINESS_HEAD_V2_RISK_SPIKES: RiskSpike[] = [
  {
    id: "bh-aura-returns",
    timestamp: "Last 7d",
    spikeType: "Volume Surge",
    magnitude: 31,
    channel: "Returns, Reviews",
    topIntent: "Sizing mismatch — category chart",
    topIntentContext: "₹6.0L recoverable · High confidence",
    aiAction: "",
    severity: "critical",
    cardTitle: "Fashion Returns Spike",
    customMetrics: [
      { label: "Return rate", value: "22% → 31%", delta: "+9 pts", deltaIntent: "bad", trend: "up" },
      { label: "Fixable units", value: "~600", delta: "36% recoverable", deltaIntent: "bad", trend: "up" },
    ],
    triggerInsight:
      "Voice confirms chart mismatch, not buyer remorse — draft PIM sizing fix before next promo wave.",
  },
  {
    id: "bh-ncr-rto",
    timestamp: "Last 7d",
    spikeType: "SLA Spike",
    magnitude: 33,
    channel: "Delivery voice, RTO",
    topIntent: "Delhi-NCR outbound lane",
    topIntentContext: "₹4.2L contribution at risk",
    aiAction: "",
    severity: "critical",
    cardTitle: "Lane RTO Breach",
    customMetrics: [
      { label: "RTO rate", value: "21% → 33%", delta: "+12 pts", deltaIntent: "bad", trend: "up" },
      { label: "Logistics voice", value: "70%", delta: "delivery theme", deltaIntent: "bad", trend: "up" },
    ],
    triggerInsight:
      "Rider non-attempt clusters dominate — route to Operations; seller penalty held pending voice split.",
  },
  {
    id: "bh-seller-trust",
    timestamp: "This week",
    spikeType: "Unresolved Surge",
    magnitude: 52,
    channel: "Care, Seller desk",
    topIntent: "Cancel-after-wait — QuickStyle",
    topIntentContext: "₹52L GMV exposure · 3 sellers",
    aiAction: "",
    severity: "critical",
    cardTitle: "Seller Trust Exposure",
    customMetrics: [
      { label: "At-risk GMV", value: "₹52L", delta: "3 sellers", deltaIntent: "bad", trend: "up" },
      { label: "Concentration", value: "23%", delta: "within 25% cap", deltaIntent: "neutral", trend: "flat" },
    ],
    triggerInsight:
      "Customer-backed GMV exposure ranks QuickStyle first — coaching draft ready for Seller-Brand.",
  },
  {
    id: "bh-festival-payment",
    timestamp: "Today",
    spikeType: "Volume Surge",
    magnitude: 180,
    channel: "Checkout, Care",
    topIntent: "Payment deducted, no order",
    topIntentContext: "Sale window · verified failure",
    aiAction: "",
    severity: "moderate",
    cardTitle: "Festival Payment Failure",
    customMetrics: [
      { label: "Order spike", value: "3× baseline", delta: "sale-scaled", deltaIntent: "bad", trend: "up" },
      { label: "Failure voice", value: "Aligned", delta: "not demand", deltaIntent: "bad", trend: "up" },
    ],
    triggerInsight:
      "Pulse earbuds spike is payment-gateway failure — prepare verified incident packet, not demand surge.",
  },
  {
    id: "bh-qcom-defect",
    timestamp: "Today 07:30",
    spikeType: "Sentiment Crash",
    magnitude: 28,
    channel: "Quick-commerce, Returns",
    topIntent: "Perishable defect wave",
    topIntentContext: "Early recall signal",
    aiAction: "",
    severity: "moderate",
    cardTitle: "Q-Com Defect Wave",
    customMetrics: [
      { label: "Return initiations", value: "Spike", delta: "vs peer nodes", deltaIntent: "bad", trend: "up" },
      { label: "Defect theme", value: "Care-aligned", delta: "co-moving", deltaIntent: "bad", trend: "up" },
    ],
    triggerInsight:
      "Return initiation co-moving with care defect transcripts — ops dashboard has not moved yet.",
  },
];
