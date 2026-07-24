import type { LucideIcon } from "lucide-react";
import { Activity, Shield, Target } from "lucide-react";
import type { ScreenId } from "./routes";
import {
  TOP_TRUST_DRIVER,
  TRUST_PULSE,
  type TrustRangeKey,
} from "./cxHeadRetailV3TrustBreakdownData";

export type OverviewPulseItem = {
  q: string;
  main: string;
};

/**
 * Executive pulse — Head of CX · Marketplace.
 * Each window answers a different decision horizon (not a rescale of the same line):
 *   24H → same-day fire: live journey break + SLA bleed + what not to touch
 *   7D  → weekly operating rhythm: ₹ at risk + repeat/FCR + index movement
 *   30D → structural health: trust cliff + recovery backlog + MoM trajectory
 * Spine on every card: signal → customer impact → owner / action.
 */
export const OVERVIEW_EXEC_PULSE_BY_RANGE: Record<TrustRangeKey, readonly OverviewPulseItem[]> = {
  "24H": [
    {
      q: "🔴 What's critical",
      main: "UPI checkout timeouts last 4h — 2.9K shoppers blocked · Happiness −1.2 vs yesterday. Escalate Payments before evening peak.",
    },
    {
      q: "🎯 Where's your focus",
      main: "68 refund callbacks past 2h SLA · FCR 56% today · 22 Plus cancels since noon — open retention before they churn.",
    },
    {
      q: "🟢 What's stable/ on-track",
      main: "Delivery experience holding · Click & Collect same-day 94% — dark-store North on track for tonight's cut-off.",
    },
  ],
  "7D": [
    {
      q: "🔴 What's critical",
      main: "Refund-linked complaints +18% WoW — Active + Occasional carry ₹3.2 Cr rev at risk. Open CX × Payments joint bridge.",
    },
    {
      q: "🎯 Where's your focus",
      main: "FCR 58% · 412 overdue refund callbacks · Lapsing happiness −4 pts — clear recovery queue before weekend BBD.",
    },
    {
      q: "🟢 What's stable/ on-track",
      main: "Happiness Index 68 (+2 WoW) · NPS 46 (+3) — Plus/Loyal holding; in-house care beating BPO on refund FCR.",
    },
  ],
  "30D": [
    {
      q: "🔴 What's critical",
      main: "Refund-not-credited cliff — 64K contacts · ₹11.2 Cr GMV exposed MoM. Force CX + Payments refund-SLA program.",
    },
    {
      q: "🎯 Where's your focus",
      main: "1.8K overdue refund callbacks · Occasional + Risk RFM cells · WH-East express miss 2.4× baseline — close the recovery backlog.",
    },
    {
      q: "🟢 What's stable/ on-track",
      main: "Happiness 67 (+1.1 MoM) · Loyalty 70 · owned-inventory fulfilment 88% — marketplace sellers remain the structural drag.",
    },
  ],
};

/** @deprecated Prefer getOverviewExecPulse(range) — kept as 7D default. */
export const OVERVIEW_EXEC_PULSE = OVERVIEW_EXEC_PULSE_BY_RANGE["7D"];

export function getOverviewExecPulse(range: TrustRangeKey): readonly OverviewPulseItem[] {
  return OVERVIEW_EXEC_PULSE_BY_RANGE[range];
}

/**
 * Timeline day that drives each hub card face for the header timeframe.
 * Indices map to D1…D6 in HUB_JOURNEY_CARDS timelines (0-based).
 */
export const HUB_RANGE_TIMELINE_INDEX: Record<TrustRangeKey, number> = {
  "24H": 1,
  "7D": 5,
  "30D": 3,
};

export function hubActiveIndexForRange(timelineLength: number, range: TrustRangeKey): number {
  const idx = HUB_RANGE_TIMELINE_INDEX[range] ?? timelineLength - 1;
  return Math.max(0, Math.min(timelineLength - 1, idx));
}

/** Spark window — short for 24H, full week series for 7D / 30D. */
export function hubTrendWindow<T>(timeline: readonly T[], range: TrustRangeKey, activeIndex: number): T[] {
  switch (range) {
    case "24H": {
      const start = Math.max(0, activeIndex - 1);
      return timeline.slice(start, activeIndex + 1) as T[];
    }
    case "7D":
    case "30D":
      return timeline.slice() as T[];
    default: {
      const _exhaustive: never = range;
      return _exhaustive;
    }
  }
}

export type HubCardId = "customer-happiness" | "service-delivery" | "trust";

/** Hub detail screens — headline lives in screen; purpose copy here. */
export const HUB_PAGE_PURPOSE: Record<HubCardId, string> = {
  "customer-happiness":
    "Happiness Index · RFM · lifecycle · contribution value — one period selector across every widget.",
  trust:
    "Trust drivers, cliff vs slope signal, segment impact, evidence, and cross-functional actions — measured facts vs inferred signals.",
  "service-delivery":
    "Anxiety command triad, containment queue, reliability × anxiety split, and escalation patterns — contact pressure before breach.",
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
  /** Contacts per unit — retail resolution-effort construct (units, not orders). */
  cpu: number;
  /** Escalations prevented per lever unit — the retail P&L-facing construct. */
  eplu: number;
  /** Order-cancellation rate for the segment. */
  ocr: number;
  relationalNps?: number;
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
    { key: "hvhf", label: "High Value High Frequency", interactions: 9_550, wowDelta: 2.1, sentiment: 0.08, cpu: 0.8, eplu: 118, ocr: 0.42, relationalNps: 61, color: "#A855F7" },
    { key: "hvlf", label: "High Value Low Frequency", interactions: 6_360, wowDelta: -0.8, sentiment: 0.03, cpu: 1.2, eplu: 104, ocr: 0.58, relationalNps: 54, color: "#06B6D4" },
    { key: "lvhf", label: "Low Value High Frequency", interactions: 22_700, wowDelta: 3.4, sentiment: 0.16, cpu: 2.1, eplu: 92, ocr: 0.71, relationalNps: 44, color: "#6366F1" },
    { key: "lvlf", label: "Low Value Low Frequency", interactions: 15_130, wowDelta: -1.5, sentiment: 0.26, cpu: 2.8, eplu: 81, ocr: 0.85, relationalNps: 36, color: "#94A3B8" },
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

export type TrustTopLine = {
  topCliff: string;
  cliffCount: number;
  severityLeader: string;
};

export type HubGaugeSpec = {
  label: string;
  topLabel?: string;
  bottomLabel?: string;
  value: number;
  color: string;
  suffix?: string;
  /** Center text when it should not be the clamped 0–100 fill value (e.g. contact rate). */
  displayValue?: string;
  /** When false, render label + number only (no radial meter). Default true. */
  showMeter?: boolean;
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
  | { kind: "channels"; channels: HubChannelSpec[] }
  | { kind: "trustSeverity"; cliffCount: number; topCliff: string; incidentRate: number; topBreaker: string };

export type HubTimelinePoint = {
  label: string;
  heroValue: number;
  conversationInsight: string;
  rightPanel: HubCardRightPanel;
  happiness?: CustomerHappinessTop;
  service?: ServiceDeliveryTop;
  trust?: TrustTopLine;
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
  /** Trust has no brand-marketing drill (§1.1: brand ≠ trust) — the trust drill lives on its own screen. */
  drill?: CustomerHappinessDrill | ServiceDeliveryDrill;
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

export const HUB_JOURNEY_CARDS: HubJourneyCardData[] = [
  {
    id: "customer-happiness",
    title: "Are our customers happy?",
    subtitle: "Happy · Contacts · Top Intent",
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
            {
              label: "Contacts",
              value: 64,
              color: "#F6A93B",
              bottomLabel: "Per hour",
              showMeter: false,
              displayValue: "12.8k",
            },
          ],
          stats: [{ label: "Top Intent", value: "Delivery ETA" }],
        },
        conversationInsight:
          "The week opens calm, with delivery ETA questions dominating channels.\nNo UPI spike has been detected yet.\nHappy rate holds at 68%, with contact load at 12.8k/hr.\nFour Plus members are on churn watch and need monitoring only.",
      },
      {
        label: "D2",
        heroValue: 61,
        rightPanel: {
          kind: "gauges",
          gauges: [
            { label: "Happy", value: 61, color: "#ef4444", suffix: "%", bottomLabel: "Rate" },
            {
              label: "Contacts",
              value: 80,
              color: "#ef4444",
              bottomLabel: "Per hour",
              showMeter: false,
              displayValue: "16.1k",
            },
          ],
          stats: [{ label: "Top Intent", value: "UPI Checkout" }],
        },
        conversationInsight:
          "The UPI checkout step is failing, and Plus shoppers are hit first.\nPayment errors are peaking during the BBD hour.\nEscalate the Payments team before the evening traffic surge.\nEight Plus members are flagged for churn, and the retention queue is open.",
      },
      {
        label: "D3",
        heroValue: 73,
        rightPanel: {
          kind: "gauges",
          gauges: [
            { label: "Happy", value: 73, color: "#4ADE80", suffix: "%", bottomLabel: "Rate" },
            {
              label: "Contacts",
              value: 77,
              color: "#4ADE80",
              bottomLabel: "Per hour",
              showMeter: false,
              displayValue: "15.4k",
            },
          ],
          stats: [{ label: "Top Intent", value: "Refund Status" }],
        },
        conversationInsight:
          "Payment noise eases after the overnight gateway patch.\nRefund-status confusion is now the top chat driver.\nPlus recovers to 74%, while promo-code tickets spike.\nChurn signal is stable at three Plus members, so continue the watch.",
      },
      {
        label: "D4",
        heroValue: 63,
        rightPanel: {
          kind: "gauges",
          gauges: [
            { label: "Happy", value: 63, color: "#ef4444", suffix: "%", bottomLabel: "Rate" },
            {
              label: "Contacts",
              value: 86,
              color: "#ef4444",
              bottomLabel: "Per hour",
              showMeter: false,
              displayValue: "17.2k",
            },
          ],
          stats: [{ label: "Top Intent", value: "Delivery Delay" }],
        },
        conversationInsight:
          "Late delivery and UPI failures are stacking on the same orders.\nThis is compounding shopper frustration across channels.\nTen Plus members are in the cancel window this week.\nRoute the WH-East backlog before weekend BBD loads.",
      },
      {
        label: "D5",
        heroValue: 68,
        rightPanel: {
          kind: "gauges",
          gauges: [
            { label: "Happy", value: 68, color: "#F6A93B", suffix: "%", bottomLabel: "Rate" },
            {
              label: "Contacts",
              value: 89,
              color: "#ef4444",
              bottomLabel: "Per hour",
              showMeter: false,
              displayValue: "17.8k",
            },
          ],
          stats: [{ label: "Top Intent", value: "Refund Backlog" }],
        },
        conversationInsight:
          "Payments are stabilising, but the refund backlog is now the top friction driver.\nRepeat voice and chat contacts are rising on refund status.\nShipping pain accounts for 30% of negative sentiment volume.\nTen Plus members show elevated churn signal, and retention scripts are live.",
      },
      {
        label: "D6",
        heroValue: 72,
        rightPanel: {
          kind: "gauges",
          gauges: [
            { label: "Happy", value: 68, color: "#F6A93B", suffix: "%", bottomLabel: "Rate" },
            {
              label: "Contacts",
              value: 92,
              color: "#ef4444",
              bottomLabel: "Per hour",
              showMeter: false,
              displayValue: "18.4k",
            },
          ],
          stats: [{ label: "Top Intent", value: "Delivery Delay" }],
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
          "Happy rate holds at 68%, with contact load at 18.4k/hr on delivery and promo-code confusion.\nShipping pain is spiking repeat contacts before agents close the loop.\nTwelve Plus members are in cancel signal, and the retention queue is live.\nTop drivers are shipping at 31% and refunds at 24%.",
      },
    ],
    drill: CUSTOMER_HAPPINESS_DRILL,
  },
  {
    id: "trust",
    title: "Where is customer trust breaking — and why?",
    subtitle: "Trust Index · Cliff Severity · Top Breaker",
    targetScreen: "hub-trust",
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
          kind: "trustSeverity",
          cliffCount: 2,
          topCliff: "Account Takeover",
          incidentRate: 0.4,
          topBreaker: "Trust & Safety / Fraud",
        },
        conversationInsight:
          "Trust Index opens the week at 76, which is 4 pts above today.\nTwo cliff events are live — Account Takeover and Item Missing — both low-volume, high blast severity.\nDamaged-product slope is building on Ekart-North in Tier-2 markets.\nNo counterfeit signal has surfaced yet this week.",
      },
      {
        label: "D2",
        heroValue: 75,
        rightPanel: {
          kind: "trustSeverity",
          cliffCount: 2,
          topCliff: "Item Missing in Order",
          incidentRate: 0.3,
          topBreaker: "Supply Chain / Dark Store",
        },
        conversationInsight:
          "Trust Index slips 1 pt as refund-not-credited contacts rise.\nPrepaid ledger mismatch is surfacing on voice and email.\nItem Missing overtakes Account Takeover as the top cliff today.\nRepeat-contact rate is edging up on the refund queue.",
      },
      {
        label: "D3",
        heroValue: 74,
        rightPanel: {
          kind: "trustSeverity",
          cliffCount: 3,
          topCliff: "Refund Not Credited",
          incidentRate: 3.8,
          topBreaker: "CX + Payments",
        },
        conversationInsight:
          "Refund Not Credited is re-classified as a cliff — three cliff events are now live.\nWrong-item fashion picks are pulling the slope side lower in parallel.\nNew customers are hit hardest, with a 12 pt trust drop.\nPush flagged sellers for a SKU-mapping audit to Marketplace.",
      },
      {
        label: "D4",
        heroValue: 73,
        rightPanel: {
          kind: "trustSeverity",
          cliffCount: 3,
          topCliff: "Refund Not Credited",
          incidentRate: 3.8,
          topBreaker: "CX + Payments",
        },
        conversationInsight:
          "The never-delivered cohort is adding anxiety before contact lands.\nHidden-fee complaints are up 31% week over week on checkout surprise.\nTrust contacts reach 36.9K, impacting 17.7K unique customers.\nRefund Not Credited remains the highest-severity cliff today.",
      },
      {
        label: "D5",
        heroValue: 72,
        rightPanel: {
          kind: "trustSeverity",
          cliffCount: 4,
          topCliff: "Counterfeit Concern",
          incidentRate: 4.2,
          topBreaker: "Category / Seller Ops",
        },
        conversationInsight:
          "Counterfeit Concern overtakes Refund Not Credited as the top-severity cliff.\nDamaged product still leads on raw volume, but not on severity.\nFour cliff events are now live across refund, counterfeit, ATO and missing items.\nThe trust portfolio averages 2.1 times repeat contact.",
      },
      {
        label: "D6",
        heroValue: 72,
        rightPanel: {
          kind: "trustSeverity",
          cliffCount: TRUST_PULSE.cliffCount,
          topCliff: TOP_TRUST_DRIVER.label,
          incidentRate: TOP_TRUST_DRIVER.incidentRate,
          topBreaker: TOP_TRUST_DRIVER.fixOwner,
        },
        trust: {
          topCliff: TOP_TRUST_DRIVER.label,
          cliffCount: TRUST_PULSE.cliffCount,
          severityLeader: TOP_TRUST_DRIVER.label,
        },
        conversationInsight:
          "Trust Index is at 72, down 4 pts versus week open, with an 8 pt gap to target.\nCounterfeit Concern leads on severity — 4.2% incidence among trust contacts.\nFour cliff events are live: Refund Not Credited, Counterfeit Concern, Account Takeover, Item Missing.\nPush the top breaker to Category / Seller Ops for a compliance review.",
      },
    ],
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
          "The week opens strong across fulfilment nodes, with FCR at 76%.\nDelivery success is holding at 96% network-wide.\nThe exchange queue is the only soft spot on repeat contacts.\nWarehouse staffing is adequate, and no escalation is needed.",
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
          "The refund backlog builds after weekend delivery misses hit the returns desk.\nFCR slips to 71% on Monday morning volume.\nDelivery success is down to 88%, and the WH-East backlog is widening.\nInventory API lag is driving repeat voice contacts.",
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
          "Mid-week peak arrives as weekend orders clear through the nodes.\nFCR recovers to 74% after temp staff join the returns desk.\nDelivery success is back to 92%, above the BBD target line.\nThe refund queue is still elevated but trending down versus yesterday.",
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
          "Payment gateway timeouts are hitting the fulfilment chain.\nAbout 2,100 orders are blocked at the checkout confirmation step.\nFCR drops to 68%, and delivery success sits at 82% this week.\nEscalate a Tech and Payments joint bridge before peak traffic.",
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
          "Partial recovery follows after the fallback processor is enabled on the payment rail.\nFCR is at 70%, but repeat contacts remain high.\nDelivery success is at 86%, with Pune hub worst on express slot misses.\nThe payment API remains the bottleneck on 22% of re-contacts.",
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
          "FCR is at 69%, and refund callbacks are driving repeat contacts.\nDelivery success is at 84%, with WH-East missing express slots.\nGateway timeouts blocked 2,400 checkout orders.\nThere are 412 overdue refund callbacks, so escalate Payments now.",
      },
    ],
    drill: SERVICE_DELIVERY_DRILL,
  },
];

export function getHubCardById(id: HubCardId): HubJourneyCardData | undefined {
  return HUB_JOURNEY_CARDS.find((c) => c.id === id);
}
