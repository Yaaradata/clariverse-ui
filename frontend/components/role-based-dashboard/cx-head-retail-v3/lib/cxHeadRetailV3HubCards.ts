import type { LucideIcon } from "lucide-react";
import {
  BRAND_FEATURE_REQUESTS,
  BRAND_INFLUENCER_WATCHLIST,
  type BrandFeatureRequest,
  type BrandInfluencerProfile,
} from "./cxHeadRetailV3BrandSocialData";
import { Activity, Shield, Target } from "lucide-react";
import type { ScreenId } from "./routes";

export const OVERVIEW_EXEC_PULSE = [
  {
    q: "🔴 What's critical",
    main: "Payment failures at checkout — 18.4K shoppers affected today. Route to Payments before evening peak.",
  },
  {
    q: "🎯 Where's your focus",
    main: "412 refund callbacks overdue · 156 cases escalated to backend with no owner closure.",
  },
  {
    q: "🟢 What's stable/ on-track",
    main: "Click & Collect holding 91% SLA — in-house care centre outperforming outsourced on refunds.",
  },
] as const;

export type HubCardId = "customer-happiness" | "service-delivery" | "brand-risk";

/** Hub detail screens — headline lives in screen; purpose copy here. */
export const HUB_PAGE_PURPOSE: Record<HubCardId, string> = {
  "customer-happiness":
    "How happy are Flipkart shoppers and what is driving unhappiness across segments, orders, sellers and channels?",
  "brand-risk":
    "Trust drivers, cliff vs slope risk, segment impact, evidence, and cross-functional actions — measured facts vs inferred signals.",
  "service-delivery":
    "SLA promise, centre performance, and escalation load in one view — breach hotspots carry queue depth and aging.",
};

export type SentimentSplit = {
  positive: number;
  neutral: number;
  negative: number;
  changeLabel: string;
  risingAlert?: string;
  contactsScored?: string;
};

export type CallerSegmentKey = "hvhf" | "hvlf" | "lvhf" | "lvlf";

export type CallerSegmentRow = {
  key: CallerSegmentKey;
  label: string;
  interactions: number;
  wowDelta: number;
  sentiment: number;
  fciRate: number;
  color: string;
};

export type WhoCallingSnapshot = {
  totalInteractions: number;
  lastWeekDeltaLabel: string;
  segments: CallerSegmentRow[];
};

export type CustomerHappinessTop = {
  sentiment: SentimentSplit;
  whoCalling: WhoCallingSnapshot;
  whyCalling: { topIntent: string; topFriction: string };
  whereBreaking: [string, string];
  impact: { customers: string; channels: string };
};

export const DEFAULT_WHO_CALLING: WhoCallingSnapshot = {
  totalInteractions: 53_740,
  lastWeekDeltaLabel: "+1,842",
  segments: [
    { key: "hvhf", label: "High Value High Frequency", interactions: 9_550, wowDelta: 2.1, sentiment: 0.08, fciRate: 0.8, color: "#A855F7" },
    { key: "hvlf", label: "High Value Low Frequency", interactions: 6_360, wowDelta: -0.8, sentiment: 0.03, fciRate: 1.2, color: "#06B6D4" },
    { key: "lvhf", label: "Low Value High Frequency", interactions: 22_700, wowDelta: 3.4, sentiment: 0.16, fciRate: 2.1, color: "#6366F1" },
    { key: "lvlf", label: "Low Value Low Frequency", interactions: 15_130, wowDelta: -1.5, sentiment: 0.26, fciRate: 2.8, color: "#94A3B8" },
  ],
};

export type ServiceDeliveryTop = {
  slaKeptPct: number;
  promise: { met: string; breached: string; pending: string };
  topFailure: string;
  overdueCallbacks: string;
  escalated: { count: string; topOwner: string };
  repeatContact: string;
};

export type BrandRiskTop = {
  severity: "Critical" | "Rising" | "Stable";
  topTheme: string;
  competitor: string;
  trustSignal: string;
  fraudSignal: string;
  spread: string;
};

export type HubGaugeSpec = {
  label: string;
  topLabel?: string;
  bottomLabel?: string;
  value: number;
  color: string;
  suffix?: string;
  offsetY?: number;
};

export type HubStatSpec = {
  label: string;
  value: string;
  color?: string;
};

export type HubChannelSpec = {
  name: string;
  v: number;
};

export type HubCardRightPanel =
  | { kind: "gauges"; gauges: HubGaugeSpec[]; stats: HubStatSpec[] }
  | { kind: "channels"; channels: HubChannelSpec[] };

export type HubTimelinePoint = {
  label: string;
  heroValue: number;
  conversationInsight: string;
  rightPanel: HubCardRightPanel;
  happiness?: CustomerHappinessTop;
  service?: ServiceDeliveryTop;
  brand?: BrandRiskTop;
};

export type CallingReasonRow = {
  label: string;
  share: string;
  volume: string;
  trend: string;
  trendRisk?: boolean;
  aht: string;
  repeatPct: string;
};

export type JourneyBreakStep = {
  step: string;
  status: "breaking" | "watch" | "ok";
  contacts: string;
  journeyShare: string;
  trend: string;
  trendRisk?: boolean;
};

export type CrossChannelMention = { name: string; mentions: string };
export type CrossChannelEscalationFlow = { from: string; to: string; customers: number };

export const ECOMMERCE_CROSS_CHANNEL_DATA: {
  channels: CrossChannelMention[];
  escalationFlows: CrossChannelEscalationFlow[];
} = {
  channels: [
    { name: "Voice", mentions: "6,240" },
    { name: "Chat", mentions: "8,910" },
    { name: "Email", mentions: "2,180" },
    { name: "App reviews", mentions: "1,420" },
    { name: "Social", mentions: "3,650" },
  ],
  escalationFlows: [
    { from: "Chat", to: "Voice", customers: 318 },
    { from: "Chat", to: "Email", customers: 142 },
    { from: "Email", to: "Chat", customers: 148 },
    { from: "Email", to: "Voice", customers: 54 },
    { from: "Voice", to: "Chat", customers: 96 },
    { from: "Voice", to: "Email", customers: 41 },
    { from: "App reviews", to: "Social", customers: 78 },
    { from: "App reviews", to: "Voice", customers: 52 },
    { from: "Social", to: "Voice", customers: 118 },
    { from: "Social", to: "Chat", customers: 94 },
  ],
};

export type CustomerHappinessDrill = {
  breaking: {
    what: string;
    where: string;
    owner: string;
    activeSince: string;
    escalatedToBackend: "Yes" | "No";
  };
  intents: CallingReasonRow[];
  friction: CallingReasonRow[];
  journeyBreaks: JourneyBreakStep[];
  channels: CrossChannelMention[];
  escalationFlows: CrossChannelEscalationFlow[];
};

export type SlaHeatmapRow = {
  intent: string;
  values: number[];
};

export type ServiceDeliveryDrill = {
  slaFailures: { area: string; breached: string; pending: string }[];
  escalations: { team: string; open: string; aging: string; unresolved: string }[];
  centers: { name: string; type: "In-house" | "Outsourced"; breachPct: string; unresolved: string }[];
  repeatRecovery: { metric: string; value: string; note: string }[];
  slaHeatmap: { channels: string[]; rows: SlaHeatmapRow[] };
  channels: CrossChannelMention[];
  escalationFlows: CrossChannelEscalationFlow[];
};

export type SpreadMapRing = "internal" | "reviews" | "social" | "viral";

export type SpreadMapNode = {
  label: string;
  volume: number;
  ring: SpreadMapRing;
  severity: "critical" | "high" | "muted";
  angle: number;
  detail?: string;
  voiceQuote?: string;
  voiceCount?: number;
};

export type CompetitorBuzzDetail = {
  shopperShift: string;
  channelSignals: { surface: string; mentions: string; trend: string }[];
  shopperQuotes: string[];
  flipkartWeakness: string;
  recommendedAction: string;
};

export type { BrandFeatureRequest, BrandInfluencerProfile } from "./cxHeadRetailV3BrandSocialData";

export type BrandRiskDrill = {
  buzzThemes: { theme: string; mentions: string; viral: boolean }[];
  competitor: {
    name: string;
    theme: string;
    flipkartComparison: string;
    comparativeBuzz: number;
    detail: CompetitorBuzzDetail;
  }[];
  fraud: { type: string; trend: string; momentum: number[]; signals: string }[];
  quality: { issue: string; complaints: string }[];
  spreadMap: SpreadMapNode[];
  influencers: BrandInfluencerProfile[];
  featureRequests: BrandFeatureRequest[];
};

export type HubJourneyCardData = {
  id: HubCardId;
  title: string;
  subtitle: string;
  targetScreen: ScreenId;
  icon: LucideIcon;
  iconColor: string;
  sparkColor: string;
  sparkYPadBelow?: number;
  sparkYPadAbove?: number;
  timeline: HubTimelinePoint[];
  drill: CustomerHappinessDrill | ServiceDeliveryDrill | BrandRiskDrill;
};

export function hubSparkSeries(card: HubJourneyCardData): number[] {
  return card.timeline.map((p) => p.heroValue);
}

export function hubHeroDelta(
  timeline: HubTimelinePoint[],
  activeIndex: number,
): { text: string; positive: boolean } {
  const first = timeline[0]?.heroValue ?? 0;
  const current = timeline[activeIndex]?.heroValue ?? first;
  const diff = Math.round(current - first);
  const abs = Math.abs(diff);
  const ptWord = abs === 1 ? "pt" : "pts";
  if (diff === 0) return { text: `0 ${ptWord}`, positive: true };
  if (diff > 0) return { text: `+${abs} ${ptWord}`, positive: true };
  return { text: `−${abs} ${ptWord}`, positive: false };
}

const CUSTOMER_HAPPINESS_DRILL: CustomerHappinessDrill = {
  breaking: {
    what: "UPI payment step failing at checkout",
    where: "Checkout → Payment",
    owner: "Payments platform team",
    activeSince: "4 hours",
    escalatedToBackend: "Yes",
  },
  intents: [
    {
      label: "Payment issue",
      share: "34%",
      volume: "6.3K",
      trend: "+5 pts vs LW",
      trendRisk: true,
      aht: "8m 10s",
      repeatPct: "31%",
    },
    {
      label: "Order not received",
      share: "22%",
      volume: "4.0K",
      trend: "+2 pts vs LW",
      trendRisk: true,
      aht: "7m 04s",
      repeatPct: "27%",
    },
    {
      label: "Refund / return",
      share: "18%",
      volume: "3.3K",
      trend: "Flat vs LW",
      aht: "5m 48s",
      repeatPct: "19%",
    },
    {
      label: "Delivery delay",
      share: "14%",
      volume: "2.6K",
      trend: "−1 pt vs LW",
      aht: "5m 22s",
      repeatPct: "16%",
    },
    {
      label: "Account / login",
      share: "12%",
      volume: "2.2K",
      trend: "−3 pts vs LW",
      aht: "4m 55s",
      repeatPct: "14%",
    },
  ],
  friction: [
    {
      label: "Payment deducted, no order",
      share: "31%",
      volume: "5.7K",
      trend: "+6 pts vs LW",
      trendRisk: true,
      aht: "9m 18s",
      repeatPct: "38%",
    },
    {
      label: "Refund status unclear",
      share: "24%",
      volume: "4.4K",
      trend: "+4 pts vs LW",
      trendRisk: true,
      aht: "7m 32s",
      repeatPct: "29%",
    },
    {
      label: "Delivery promise missed",
      share: "19%",
      volume: "3.5K",
      trend: "+1 pt vs LW",
      aht: "6m 08s",
      repeatPct: "22%",
    },
    {
      label: "Promo code not applied",
      share: "14%",
      volume: "2.6K",
      trend: "Flat vs LW",
      aht: "5m 40s",
      repeatPct: "18%",
    },
    {
      label: "OTP / login loop",
      share: "12%",
      volume: "2.2K",
      trend: "−2 pts vs LW",
      aht: "4m 48s",
      repeatPct: "21%",
    },
  ],
  journeyBreaks: [
    {
      step: "Checkout",
      status: "breaking",
      contacts: "3.1K",
      journeyShare: "29%",
      trend: "+12 pts vs LW",
      trendRisk: true,
    },
    {
      step: "Payment",
      status: "breaking",
      contacts: "2.8K",
      journeyShare: "26%",
      trend: "+8 pts vs LW",
      trendRisk: true,
    },
    {
      step: "Post-order",
      status: "watch",
      contacts: "1.4K",
      journeyShare: "13%",
      trend: "+3 pts vs LW",
    },
    {
      step: "Refund",
      status: "watch",
      contacts: "980",
      journeyShare: "9%",
      trend: "Flat vs LW",
    },
    {
      step: "Delivery",
      status: "watch",
      contacts: "720",
      journeyShare: "7%",
      trend: "−1 pt vs LW",
    },
    {
      step: "Support follow-up",
      status: "ok",
      contacts: "410",
      journeyShare: "4%",
      trend: "−4 pts vs LW",
    },
  ],
  ...ECOMMERCE_CROSS_CHANNEL_DATA,
};

const SERVICE_DELIVERY_DRILL: ServiceDeliveryDrill = {
  slaFailures: [
    { area: "Refund SLA", breached: "412 cases", pending: "284 open" },
    { area: "Delivery resolution", breached: "198 cases", pending: "96 open" },
    { area: "Payment dispute", breached: "156 cases", pending: "88 open" },
    { area: "Return pickup", breached: "124 cases", pending: "72 open" },
    { area: "Complaint closure", breached: "98 cases", pending: "54 open" },
  ],
  escalations: [
    { team: "Payments", open: "48", aging: "3.2 days avg", unresolved: "31" },
    { team: "Logistics", open: "42", aging: "2.8 days avg", unresolved: "28" },
    { team: "Refunds", open: "38", aging: "4.1 days avg", unresolved: "26" },
    { team: "Seller ops", open: "18", aging: "2.1 days avg", unresolved: "11" },
    { team: "Tech", open: "10", aging: "5.4 days avg", unresolved: "8" },
    { team: "Warehouse", open: "14", aging: "3.6 days avg", unresolved: "9" },
  ],
  centers: [
    { name: "Bangalore in-house", type: "In-house", breachPct: "18%", unresolved: "42" },
    { name: "Hyderabad BPO-A", type: "Outsourced", breachPct: "34%", unresolved: "128" },
    { name: "Pune BPO-B", type: "Outsourced", breachPct: "41%", unresolved: "156" },
    { name: "Chennai in-house", type: "In-house", breachPct: "21%", unresolved: "38" },
  ],
  repeatRecovery: [
    { metric: "Reopened within 48h", value: "22%", note: "Refund-status theme dominant" },
    { metric: "Repeat complaint 24h", value: "14%", note: "After first agent reply" },
    { metric: "Reply but root open", value: "186 cases", note: "Backend not closed" },
  ],
  slaHeatmap: {
    channels: ["Voice", "Chat", "Email", "App SS"],
    rows: [
      { intent: "Wrong item", values: [92, 94, 88, 98] },
      { intent: "Order tracking", values: [88, 90, 82, 99] },
      { intent: "Refund status", values: [64, 58, 54, 72] },
      { intent: "Delivery delay", values: [72, 68, 65, 80] },
      { intent: "Return pickup", values: [69, 72, 70, 76] },
      { intent: "Complaint closure", values: [81, 76, 74, 83] },
    ],
  },
  ...ECOMMERCE_CROSS_CHANNEL_DATA,
};

const BRAND_RISK_DRILL: BrandRiskDrill = {
  buzzThemes: [
    { theme: "#NeverDelivered", mentions: "1,588", viral: true },
    { theme: "Hidden platform fee", mentions: "920", viral: true },
    { theme: "Wrong item received", mentions: "640", viral: false },
    { theme: "Refund not credited", mentions: "510", viral: false },
  ],
  competitor: [
    {
      name: "Amazon",
      theme: "Big Billion sale",
      flipkartComparison: "Shoppers citing faster refunds",
      comparativeBuzz: 78,
      detail: {
        shopperShift: "412 shoppers explicitly comparing refund speed vs Flipkart this week",
        channelSignals: [
          { surface: "Social/X", mentions: "1.2K", trend: "Rising" },
          { surface: "Reviews", mentions: "640", trend: "Rising" },
          { surface: "Live Chat", mentions: "286", trend: "Watch" },
        ],
        shopperQuotes: [
          "Amazon refunded in 2 days — Flipkart still pending",
          "Switching my phone order to Amazon after this sale",
          "Prime delivery beat Flipkart again on the same SKU",
        ],
        flipkartWeakness: "Refund SLA + sale-window delivery promise gap vs Amazon Prime",
        recommendedAction: "Expedite refund-status comms + match sale-window delivery messaging on top SKUs",
      },
    },
    {
      name: "Meesho",
      theme: "Lower price perception",
      flipkartComparison: "Value comparison spreading on social",
      comparativeBuzz: 62,
      detail: {
        shopperShift: "268 value-seeking shoppers cross-shopping on fashion & home basics",
        channelSignals: [
          { surface: "Social/X", mentions: "890", trend: "Rising" },
          { surface: "Reviews", mentions: "412", trend: "Watch" },
          { surface: "App Store", mentions: "186", trend: "Stable" },
        ],
        shopperQuotes: [
          "Same kurta ₹200 cheaper on Meesho",
          "Why pay Flipkart fees when Meesho is zero commission?",
          "Meesho COD is easier — no platform fee shock",
        ],
        flipkartWeakness: "Platform fee + perceived price gap on value-tier fashion",
        recommendedAction: "Surface all-in price earlier in checkout · target fee-transparency fix on app",
      },
    },
    {
      name: "Myntra",
      theme: "Fashion festival pull",
      flipkartComparison: "Style-led shoppers deferring Flipkart fashion basket",
      comparativeBuzz: 54,
      detail: {
        shopperShift: "194 fashion-intent shoppers delaying Flipkart checkout for Myntra EORS",
        channelSignals: [
          { surface: "Reviews", mentions: "520", trend: "Watch" },
          { surface: "Social/X", mentions: "348", trend: "Rising" },
          { surface: "Care Email", mentions: "142", trend: "Stable" },
        ],
        shopperQuotes: [
          "Waiting for Myntra sale instead of buying on Flipkart now",
          "Myntra try-and-buy is easier for fashion returns",
          "Flipkart fashion filters feel worse than Myntra",
        ],
        flipkartWeakness: "Fashion try-and-buy + festival sale timing vs Myntra EORS",
        recommendedAction: "Pull forward fashion assurance messaging · highlight easy returns on top categories",
      },
    },
  ],
  fraud: [
    { type: "Refund fraud concern", trend: "Rising", momentum: [22, 28, 34, 41, 52, 61], signals: "412" },
    { type: "Fake seller / product", trend: "Rising", momentum: [18, 24, 31, 38, 48, 58], signals: "286" },
    { type: "Empty box delivery", trend: "Watch", momentum: [30, 38, 32, 40, 36, 44], signals: "194" },
    { type: "Fake seller account", trend: "Stable", momentum: [42, 44, 41, 43, 42, 44], signals: "128" },
  ],
  quality: [
    { issue: "Damaged product", complaints: "820" },
    { issue: "Wrong product", complaints: "640" },
    { issue: "Used product received", complaints: "210" },
    { issue: "Poor packaging", complaints: "180" },
    { issue: "Counterfeit suspected", complaints: "156" },
  ],
  spreadMap: [
    {
      label: "#NeverDelivered",
      volume: 1588,
      ring: "viral",
      severity: "critical",
      angle: 302,
      detail: "Viral hashtag · late-delivery posts crossing into public news cycle",
      voiceQuote: "Complained but nobody acted",
      voiceCount: 412,
    },
    {
      label: "Hidden platform fee",
      volume: 928,
      ring: "reviews",
      severity: "high",
      angle: 38,
      detail: "Review-site spike · shoppers flag unexpected checkout fees",
      voiceQuote: "I no longer trust Flipkart",
      voiceCount: 340,
    },
    {
      label: "Damaged product",
      volume: 828,
      ring: "reviews",
      severity: "critical",
      angle: 132,
      detail: "Quality trust break · photo evidence in app-store reviews",
      voiceQuote: "Will never shop here again",
      voiceCount: 224,
    },
    {
      label: "Wrong item / product",
      volume: 648,
      ring: "reviews",
      severity: "high",
      angle: 198,
      detail: "Fulfillment mismatch · repeat contacts after wrong SKU delivered",
      voiceQuote: "High-frustration repeat contact",
      voiceCount: 186,
    },
    {
      label: "Refund not credited",
      volume: 510,
      ring: "reviews",
      severity: "critical",
      angle: 268,
      detail: "Refund-status confusion · shoppers posting on review surfaces",
      voiceQuote: "Promised refund never came",
      voiceCount: 278,
    },
    {
      label: "",
      volume: 86,
      ring: "internal",
      severity: "muted",
      angle: 182,
      detail: "Internal care chatter · not yet visible on public surfaces",
    },
    {
      label: "",
      volume: 64,
      ring: "internal",
      severity: "muted",
      angle: 12,
      detail: "Early ops signal · contained to voice/chat queues",
    },
  ],
  influencers: BRAND_INFLUENCER_WATCHLIST,
  featureRequests: BRAND_FEATURE_REQUESTS,
};

export const HUB_JOURNEY_CARDS: HubJourneyCardData[] = [
  {
    id: "customer-happiness",
    title: "Are our customers happy?",
    subtitle: "Happy vs Unhappy · Top Intent · Contacts",
    targetScreen: "hub-customer-happiness",
    icon: Target,
    iconColor: "#f59e0b",
    sparkColor: "#22c55e",
    sparkYPadBelow: 6,
    sparkYPadAbove: 4,
    timeline: [
      {
        label: "D1",
        heroValue: 68,
        rightPanel: {
          kind: "gauges",
          gauges: [
            { label: "Happy", value: 68, color: "#F6A93B", suffix: "%", bottomLabel: "Rate" },
            { label: "Unhappy", value: 32, color: "#ef4444", suffix: "%", bottomLabel: "Rate" },
          ],
          stats: [
            { label: "Top Intent", value: "Delivery ETA" },
            { label: "Contacts", value: "12.8k/hr", color: "#f59e0b" },
          ],
        },
        conversationInsight:
          "Week opens calm. Delivery ETA questions dominate\nchannels — no UPI spike detected yet.\n68% happy rate; unhappy still contained at 32%.\nChurn watch: 4 Plus members — monitor only.",
      },
      {
        label: "D2",
        heroValue: 61,
        rightPanel: {
          kind: "gauges",
          gauges: [
            { label: "Happy", value: 61, color: "#ef4444", suffix: "%", bottomLabel: "Rate" },
            { label: "Unhappy", value: 39, color: "#ef4444", suffix: "%", bottomLabel: "Rate" },
          ],
          stats: [
            { label: "Top Intent", value: "UPI Checkout" },
            { label: "Contacts", value: "16.1k/hr", color: "#ef4444" },
          ],
        },
        conversationInsight:
          "UPI checkout step failing — Plus shoppers\nhit first on payment errors at BBD peak hour.\nEscalate Payments team before evening traffic surge.\nChurn risk: 8 Plus members flagged — retention queue open.",
      },
      {
        label: "D3",
        heroValue: 73,
        rightPanel: {
          kind: "gauges",
          gauges: [
            { label: "Happy", value: 73, color: "#4ADE80", suffix: "%", bottomLabel: "Rate" },
            { label: "Unhappy", value: 27, color: "#F6A93B", suffix: "%", bottomLabel: "Rate" },
          ],
          stats: [
            { label: "Top Intent", value: "Refund Status" },
            { label: "Contacts", value: "15.4k/hr", color: "#22c55e" },
          ],
        },
        conversationInsight:
          "Payment noise eases after gateway patch deployed\novernight. Refund-status confusion now tops chat.\nPlus recovers to 74%; promo-code tickets spike.\nChurn risk stable at 3 Plus members — continue watch.",
      },
      {
        label: "D4",
        heroValue: 63,
        rightPanel: {
          kind: "gauges",
          gauges: [
            { label: "Happy", value: 63, color: "#ef4444", suffix: "%", bottomLabel: "Rate" },
            { label: "Unhappy", value: 37, color: "#ef4444", suffix: "%", bottomLabel: "Rate" },
          ],
          stats: [
            { label: "Top Intent", value: "Delivery Delay" },
            { label: "Contacts", value: "17.2k/hr", color: "#ef4444" },
          ],
        },
        conversationInsight:
          "Late delivery and UPI failures stacking on\nthe same orders — compounding shopper frustration.\n10 Plus members in cancel window this week.\nRoute WH-East backlog before weekend BBD loads.",
      },
      {
        label: "D5",
        heroValue: 68,
        rightPanel: {
          kind: "gauges",
          gauges: [
            { label: "Happy", value: 68, color: "#F6A93B", suffix: "%", bottomLabel: "Rate" },
            { label: "Unhappy", value: 32, color: "#ef4444", suffix: "%", bottomLabel: "Rate" },
          ],
          stats: [
            { label: "Top Intent", value: "Refund Backlog" },
            { label: "Contacts", value: "17.8k/hr", color: "#ef4444" },
          ],
        },
        conversationInsight:
          "Payments stabilising; refund backlog now the top\nfriction driver on repeat voice and chat contacts.\nShipping pain at 30% of negative sentiment volume.\n10 Plus members still at risk — retention scripts live.",
      },
      {
        label: "D6",
        heroValue: 72,
        rightPanel: {
          kind: "gauges",
          gauges: [
            { label: "Happy", value: 68, color: "#F6A93B", suffix: "%", bottomLabel: "Rate" },
            { label: "Unhappy", value: 32, color: "#ef4444", suffix: "%", bottomLabel: "Rate" },
          ],
          stats: [
            { label: "Top Intent", value: "Delivery Delay" },
            { label: "Contacts", value: "18.4k/hr", color: "#ef4444" },
          ],
        },
        happiness: {
          sentiment: {
            positive: 41,
            neutral: 27,
            negative: 32,
            changeLabel: "↓ 4 pts vs usual",
            risingAlert: "Negative sentiment rising fast",
            contactsScored: "18.4K",
          },
          whoCalling: DEFAULT_WHO_CALLING,
          whyCalling: { topIntent: "Payment issue", topFriction: "Delivery delay" },
          whereBreaking: ["Checkout", "Payment"],
          impact: { customers: "18.4K", channels: "Voice, Chat" },
        },
        conversationInsight:
          "32% unhappy — delivery & promo-code confusion.\n68% happy rate · unhappy spike on shipping pain.\n12 Plus cancel-risk — retention queue live.\nTop drivers: shipping 31%, refunds 24%.",
      },
    ],
    drill: CUSTOMER_HAPPINESS_DRILL,
  },
  {
    id: "brand-risk",
    title: "Where is customer trust breaking — and why?",
    subtitle: "Trust Index · Outcome Signals · Top Breakers",
    targetScreen: "hub-brand-risk",
    icon: Shield,
    iconColor: "#f59e0b",
    sparkColor: "#f59e0b",
    sparkYPadBelow: 6,
    sparkYPadAbove: 4,
    timeline: [
      {
        label: "D1",
        heroValue: 76,
        rightPanel: {
          kind: "channels",
          channels: [
            { name: "Sentiment", v: 0.61 },
            { name: "Resolution", v: 0.79 },
            { name: "CSAT", v: 0.82 },
            { name: "Fulfilment", v: 0.62 },
            { name: "Payments", v: 0.58 },
          ],
        },
        conversationInsight:
          "Trust Index 76 at week open — 4 pts above today.\nOutcome signals stable; fulfilment trust soft on damage lane.\nDamaged-product share building on Ekart-North · Tier-2.\nNo cliff breach active — slope erosion only.",
      },
      {
        label: "D2",
        heroValue: 75,
        rightPanel: {
          kind: "channels",
          channels: [
            { name: "Sentiment", v: 0.59 },
            { name: "Resolution", v: 0.78 },
            { name: "CSAT", v: 0.81 },
            { name: "Fulfilment", v: 0.58 },
            { name: "Payments", v: 0.55 },
          ],
        },
        conversationInsight:
          "Trust Index slips 1 pt as refund-not-credited contacts rise.\nPrepaid ledger mismatch surfacing on voice + email.\nFulfilment score down — damage on mobiles & appliances.\nRepeat-contact rate edging up on refund queue.",
      },
      {
        label: "D3",
        heroValue: 74,
        rightPanel: {
          kind: "channels",
          channels: [
            { name: "Sentiment", v: 0.58 },
            { name: "Resolution", v: 0.77 },
            { name: "CSAT", v: 0.8 },
            { name: "Fulfilment", v: 0.55 },
            { name: "Payments", v: 0.54 },
          ],
        },
        conversationInsight:
          "Wrong-item fashion picks pulling fulfilment trust lower.\nResolution still above 0.77 but sentiment decaying.\nNew-customer segment hit hardest — 12 pt trust drop.\nRoute flagged sellers for SKU-mapping audit.",
      },
      {
        label: "D4",
        heroValue: 73,
        rightPanel: {
          kind: "channels",
          channels: [
            { name: "Sentiment", v: 0.57 },
            { name: "Resolution", v: 0.76 },
            { name: "CSAT", v: 0.79 },
            { name: "Fulfilment", v: 0.52 },
            { name: "Payments", v: 0.53 },
          ],
        },
        conversationInsight:
          "Never-delivered cohort adding anxiety before contact lands.\nHidden-fee complaints +31% WoW on checkout surprise.\nTrust contacts 36.9K · 17.7K unique customers impacted.\nPayments trust weakest signal this week.",
      },
      {
        label: "D5",
        heroValue: 72,
        rightPanel: {
          kind: "channels",
          channels: [
            { name: "Sentiment", v: 0.56 },
            { name: "Resolution", v: 0.75 },
            { name: "CSAT", v: 0.785 },
            { name: "Fulfilment", v: 0.5 },
            { name: "Payments", v: 0.525 },
          ],
        },
        conversationInsight:
          "Trust Index at 72 — 8 pts below 80 target band.\nDamaged product leads 35% of trust complaints (+18% WoW).\nRefund-not-credited fastest riser (+22%) on prepaid mismatch.\nRepeat-contact portfolio avg 2.1× on trust issues.",
      },
      {
        label: "D6",
        heroValue: 72,
        rightPanel: {
          kind: "channels",
          channels: [
            { name: "Sentiment", v: 0.55 },
            { name: "Resolution", v: 0.74 },
            { name: "CSAT", v: 0.78 },
            { name: "Fulfilment", v: 0.48 },
            { name: "Payments", v: 0.52 },
          ],
        },
        brand: {
          severity: "Rising",
          topTheme: "Damaged product · 35% share",
          competitor: "Amazon refund speed gap",
          trustSignal: "36.9K trust contacts · 17.7K impacted",
          fraudSignal: "Counterfeit cliff · consumables",
          spread: "Refund + never-delivered · Tier-2",
        },
        conversationInsight:
          "Trust Index 72 · −4 pts vs week open · gap to target 8 pts.\nWeakest scores: Fulfilment 0.48 · Payments 0.52.\nTop breaker: Damaged product; refund-not-credited +22% WoW.\nAct: packaging audit top pincodes · expose refund ETA.",
      },
    ],
    drill: BRAND_RISK_DRILL,
  },
  {
    id: "service-delivery",
    title: "How is our service delivery?",
    subtitle: "FCR Resolution · Delivery Success · Repeat Contact · Bottleneck",
    targetScreen: "hub-service-delivery",
    icon: Activity,
    iconColor: "#eab308",
    sparkColor: "#ef4444",
    sparkYPadBelow: 8,
    sparkYPadAbove: 5,
    timeline: [
      {
        label: "D1",
        heroValue: 82,
        rightPanel: {
          kind: "gauges",
          gauges: [
            { label: "FCR Resolution", topLabel: "FCR", bottomLabel: "Resolution", value: 76, color: "#4ADE80", suffix: "%" },
            { label: "Delivery Success Rate", topLabel: "Delivery", bottomLabel: "Success Rate", value: 96, color: "#4ADE80", suffix: "%" },
          ],
          stats: [
            { label: "Repeat Contact", value: "14%", color: "#22c55e" },
            { label: "Bottleneck", value: "Warehouse", color: "#f59e0b" },
          ],
        },
        conversationInsight:
          "Strong week open across fulfilment nodes. FCR at 76%\nwith delivery success holding at 96% network-wide.\nExchange queue the only soft spot on repeat contacts.\nWarehouse staffing adequate — no escalation needed.",
      },
      {
        label: "D2",
        heroValue: 70,
        rightPanel: {
          kind: "gauges",
          gauges: [
            { label: "FCR Resolution", topLabel: "FCR", bottomLabel: "Resolution", value: 71, color: "#F6A93B", suffix: "%" },
            { label: "Delivery Success Rate", topLabel: "Delivery", bottomLabel: "Success Rate", value: 88, color: "#4ADE80", suffix: "%" },
          ],
          stats: [
            { label: "Repeat Contact", value: "18%", color: "#ef4444" },
            { label: "Bottleneck", value: "Inventory API", color: "#f59e0b" },
          ],
        },
        conversationInsight:
          "Refund backlog builds after weekend delivery misses\nhit the returns desk Monday morning. FCR slips to 71%.\nDelivery success down to 88% — WH-East backlog widening.\nInventory API lag driving repeat voice contacts.",
      },
      {
        label: "D3",
        heroValue: 84,
        rightPanel: {
          kind: "gauges",
          gauges: [
            { label: "FCR Resolution", topLabel: "FCR", bottomLabel: "Resolution", value: 74, color: "#4ADE80", suffix: "%" },
            { label: "Delivery Success Rate", topLabel: "Delivery", bottomLabel: "Success Rate", value: 92, color: "#4ADE80", suffix: "%" },
          ],
          stats: [
            { label: "Repeat Contact", value: "16%", color: "#f59e0b" },
            { label: "Bottleneck", value: "Returns desk", color: "#f59e0b" },
          ],
        },
        conversationInsight:
          "Mid-week peak as weekend orders clear through nodes.\nFCR recovers to 74% after temp staff on returns desk.\nDelivery success back to 92% — above BBD target line.\nRefund queue elevated but trending down vs yesterday.",
      },
      {
        label: "D4",
        heroValue: 66,
        rightPanel: {
          kind: "gauges",
          gauges: [
            { label: "FCR Resolution", topLabel: "FCR", bottomLabel: "Resolution", value: 68, color: "#ef4444", suffix: "%" },
            { label: "Delivery Success Rate", topLabel: "Delivery", bottomLabel: "Success Rate", value: 82, color: "#F6A93B", suffix: "%" },
          ],
          stats: [
            { label: "Repeat Contact", value: "24%", color: "#ef4444" },
            { label: "Bottleneck", value: "Payments", color: "#f59e0b" },
          ],
        },
        conversationInsight:
          "Payment gateway timeouts hit fulfilment chain —\n2,100 orders blocked at checkout confirmation step.\nFCR drops to 68%; delivery success at 82% this week.\nEscalate Tech + Payments joint bridge before peak.",
      },
      {
        label: "D5",
        heroValue: 74,
        rightPanel: {
          kind: "gauges",
          gauges: [
            { label: "FCR Resolution", topLabel: "FCR", bottomLabel: "Resolution", value: 70, color: "#F6A93B", suffix: "%" },
            { label: "Delivery Success Rate", topLabel: "Delivery", bottomLabel: "Success Rate", value: 86, color: "#4ADE80", suffix: "%" },
          ],
          stats: [
            { label: "Repeat Contact", value: "21%", color: "#ef4444" },
            { label: "Bottleneck", value: "Payments", color: "#f59e0b" },
          ],
        },
        conversationInsight:
          "Partial recovery after fallback processor enabled\non payment rail. FCR at 70% — repeat contacts still high.\nDelivery success 86%; Pune hub worst miss on express slots.\nPayment API remains bottleneck on 22% of re-contacts.",
      },
      {
        label: "D6",
        heroValue: 68,
        rightPanel: {
          kind: "gauges",
          gauges: [
            { label: "FCR Resolution", topLabel: "FCR", bottomLabel: "Resolution", value: 69, color: "#F6A93B", suffix: "%" },
            { label: "Delivery Success Rate", topLabel: "Delivery", bottomLabel: "Success Rate", value: 84, color: "#4ADE80", suffix: "%" },
          ],
          stats: [
            { label: "Repeat Contact", value: "22%", color: "#ef4444" },
            { label: "Bottleneck", value: "Payments", color: "#f59e0b" },
          ],
        },
        service: {
          slaKeptPct: 68,
          promise: { met: "68%", breached: "32%", pending: "284" },
          topFailure: "Refund SLA breached",
          overdueCallbacks: "42%",
          escalated: { count: "156", topOwner: "Payments" },
          repeatContact: "22% within 48h",
        },
        conversationInsight:
          "FCR at 69% — refund callbacks driving repeat contacts.\nDelivery success 84% with WH-East express misses.\nGateway timeouts blocked 2,400 checkout orders.\n412 refund callbacks overdue — escalate Payments.",
      },
    ],
    drill: SERVICE_DELIVERY_DRILL,
  },
];

export function getHubCardById(id: HubCardId): HubJourneyCardData | undefined {
  return HUB_JOURNEY_CARDS.find((c) => c.id === id);
}
