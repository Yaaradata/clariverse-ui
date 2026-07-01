"use client";

import { useState, useEffect } from 'react';

type CustomMetric = {
  label: string;
  value: string;
  delta?: string;
  /** Semantic intent of the delta — drives color (bad=red, good=green, neutral=gray). */
  deltaIntent?: "bad" | "good" | "neutral";
  /** Direction arrow shown next to delta. */
  trend?: "up" | "down" | "flat";
};

type RiskSpike = {
  id: string;
  timestamp: string;
  spikeType: "Sentiment Crash" | "Urgency Surge" | "SLA Spike" | "Unresolved Surge" | "Volume Surge";
  magnitude: number;
  channel: "Email" | "Chat" | "Ticket" | "Social" | "Voice" | string;
  topIntent: string;
  /** Short impact/severity/resolution qualifier rendered under Top Intent. */
  topIntentContext?: string;
  sentimentBefore?: number;
  sentimentAfter?: number;
  urgencyBefore?: number;
  urgencyAfter?: number;
  unresolvedBefore?: number;
  unresolvedAfter?: number;
  slaBefore?: number;
  slaAfter?: number;
  aiAction: string;
  severity: "critical" | "moderate" | "low";
  triggerExplanation?: string;
  correlationConfidence?: "High" | "Medium" | "Low";
  /** Bank-specific card title (e.g. "Mortgage Inquiry Surge"). */
  cardTitle?: string;
  /** Custom metrics when provided (overrides standard detail rows). */
  customMetrics?: CustomMetric[];
  /** Detected phrases for sentiment/complaint cards. */
  detectedPhrases?: string[];
  /** Trigger insight text for rate-event correlation. */
  triggerInsight?: string;
  /** Region for geographic cards (shows Region instead of Channel). */
  region?: string;
};

const severityBadge: Record<RiskSpike["severity"], { label: string; icon: string; light: string; dark: string }> = {
  critical: {
    label: "Critical",
    icon: "🔥",
    light: "bg-rose-500/20 text-rose-700 border-rose-500/40",
    dark: "bg-rose-500/25 text-rose-100 border-rose-400/50",
  },
  moderate: {
    label: "High",
    icon: "⚠️",
    light: "bg-amber-500/20 text-amber-800 border-amber-400/40",
    dark: "bg-amber-500/25 text-amber-100 border-amber-400/50",
  },
  low: {
    label: "Watch",
    icon: "🔔",
    light: "bg-yellow-500/15 text-yellow-800 border-yellow-400/30",
    dark: "bg-yellow-500/20 text-yellow-100 border-yellow-400/40",
  },
};

const deltaIntentClass: Record<NonNullable<CustomMetric["deltaIntent"]>, string> = {
  bad: "text-rose-300",
  good: "text-emerald-300",
  neutral: "text-gray-400",
};

const trendArrow: Record<NonNullable<CustomMetric["trend"]>, string> = {
  up: "↑",
  down: "↓",
  flat: "→",
};

/** When trend is up/down, direction is shown by the arrow only — strip leading +/−/−. */
function deltaForTrendDisplay(delta: string, trend: CustomMetric["trend"]): string {
  if (trend !== "up" && trend !== "down") return delta;
  return delta.replace(/^[\u002B\u2212\u002D]+/, "");
}

const spikeIcon: Record<RiskSpike["spikeType"], { icon: string; color: string }> = {
  "Urgency Surge": { icon: "", color: "text-amber-300" },
  "Sentiment Crash": { icon: "", color: "text-rose-300" },
  "SLA Spike": { icon: "", color: "text-indigo-200" },
  "Unresolved Surge": { icon: "", color: "text-yellow-300" },
  "Volume Surge": { icon: "", color: "text-emerald-300" },
};

const severityStyles: Record<RiskSpike["severity"], { light: string; dark: string }> = {
  critical: {
    light: "border-rose-500/60 bg-rose-500/5 shadow-rose-500/30",
    dark: "border-rose-500/55 bg-rose-950/35 shadow-rose-900/40",
  },
  moderate: {
    light: "border-amber-400/60 bg-amber-500/5 shadow-amber-500/20",
    dark: "border-amber-500/50 bg-amber-950/30 shadow-amber-900/30",
  },
  low: {
    light: "border-yellow-400/40 bg-yellow-500/5 shadow-yellow-500/10",
    dark: "border-yellow-500/40 bg-yellow-950/25 shadow-yellow-900/20",
  },
};

const mockRiskSpikes: RiskSpike[] = [
  {
    id: "spike-urgency-voice",
    timestamp: "3h ago",
    spikeType: "Urgency Surge",
    magnitude: 34,
    channel: "Voice",
    topIntent: "Account Access Reset",
    urgencyBefore: 21,
    urgencyAfter: 55,
    sentimentBefore: 2.2,
    sentimentAfter: 3.9,
    unresolvedBefore: 124,
    unresolvedAfter: 187,
    aiAction: "Possible trigger: recent interest-rate adjustment. Enable real-time callback routing and suppress repeat MFA checks.",
    severity: "critical",
    triggerExplanation: "Mortgage/savings rate adjustment",
    correlationConfidence: "High",
  },
  {
    id: "spike-sentiment-chat",
    timestamp: "1h ago",
    spikeType: "Sentiment Crash",
    magnitude: 1.2,
    channel: "Chat",
    topIntent: "Payment Failure",
    urgencyBefore: 12,
    urgencyAfter: 31,
    sentimentBefore: 2.8,
    sentimentAfter: 4.0,
    unresolvedBefore: 210,
    unresolvedAfter: 380,
    aiAction: "Possible trigger: interest-rate change driving pricing dissatisfaction. Inject payment timeline updates into chatbot and escalate unresolved cases to Ticket.",
    severity: "critical",
    triggerExplanation: "Mortgage/savings rate adjustment",
    correlationConfidence: "High",
  },
  {
    id: "spike-sla-social",
    timestamp: "45m ago",
    spikeType: "SLA Spike",
    magnitude: 19,
    channel: "Social",
    topIntent: "Card Declined",
    slaBefore: 9,
    slaAfter: 28,
    unresolvedBefore: 91,
    unresolvedAfter: 164,
    aiAction: "Trigger expedited follow-up for decline disputes; Social backlog expanding rapidly.",
    severity: "moderate",
  },
  {
    id: "spike-unresolved-email",
    timestamp: "4h ago",
    spikeType: "Unresolved Surge",
    magnitude: 140,
    channel: "Email",
    topIntent: "KYC Resubmission",
    unresolvedBefore: 212,
    unresolvedAfter: 352,
    aiAction: "Auto-prioritize KYC documentation in verification queue to prevent compliance delays.",
    severity: "moderate",
  },
  {
    id: "spike-volume-ticket",
    timestamp: "2h ago",
    spikeType: "Volume Surge",
    magnitude: 68,
    channel: "Ticket",
    topIntent: "Dispute Status",
    urgencyBefore: 18,
    urgencyAfter: 36,
    unresolvedBefore: 98,
    unresolvedAfter: 166,
    aiAction: "Borrow capacity from Chat agents to triage new dispute tickets for the next 4 hours.",
    severity: "low",
  },
];

/** Bank-specific CX anomaly cards for interest-rate context. */
export const bankingRiskSpikes: RiskSpike[] = [
  {
    id: "spike-mortgage-inquiry",
    timestamp: "3h ago",
    spikeType: "Volume Surge",
    magnitude: 200,
    channel: "Voice, App",
    topIntent: "Refinancing",
    aiAction: "",
    severity: "critical",
    cardTitle: "Mortgage Inquiry Surge",
    customMetrics: [
      { label: "Call Volume", value: "1,500 → 4,500", delta: "+200%" },
      { label: "Calculator Usage", value: "40k → 95k", delta: "+137%" },
      { label: "Refinancing Requests", value: "", delta: "+210%" },
    ],
    triggerInsight: "Recent rate reduction triggered refinancing interest. Demand concentrated in urban markets.",
  },
  {
    id: "spike-savings-sentiment",
    timestamp: "1h ago",
    spikeType: "Sentiment Crash",
    magnitude: 32,
    channel: "Chat, Secure Messages",
    topIntent: "Savings rate complaints",
    aiAction: "",
    severity: "critical",
    cardTitle: "Sentiment Drop",
    customMetrics: [
      { label: "Sentiment", value: "", delta: "-32%" },
      { label: "Complaint Volume", value: "120 → 650", delta: "+442%" },
      { label: "Topic Cluster", value: "Pricing fairness", delta: undefined },
    ],
    detectedPhrases: ['"unfair interest rate"', '"savings rates still low"'],
    triggerInsight: "Deposit customers reacting to lag between lending rate cuts and savings pricing.",
  },
  {
    id: "spike-sla-social",
    timestamp: "45m ago",
    spikeType: "SLA Spike",
    magnitude: 19,
    channel: "Social",
    topIntent: "Card Declined",
    slaBefore: 9,
    slaAfter: 28,
    unresolvedBefore: 91,
    unresolvedAfter: 164,
    aiAction: "Trigger expedited follow-up for decline disputes; Social backlog expanding rapidly.",
    severity: "moderate",
  },
  {
    id: "spike-unresolved-email",
    timestamp: "4h ago",
    spikeType: "Unresolved Surge",
    magnitude: 140,
    channel: "Email",
    topIntent: "KYC Resubmission",
    unresolvedBefore: 212,
    unresolvedAfter: 352,
    aiAction: "Auto-prioritize KYC documentation in verification queue to prevent compliance delays.",
    severity: "moderate",
  },
  {
    id: "spike-card-decline",
    timestamp: "30m ago",
    spikeType: "Volume Surge",
    magnitude: 195,
    channel: "Voice, Mobile App",
    topIntent: "Payment declined",
    aiAction: "",
    severity: "critical",
    cardTitle: "Card Decline Spike",
    customMetrics: [
      { label: "Declined transactions", value: "420 → 1,240", delta: "+195%" },
      { label: "Fraud rule triggers", value: "", delta: "+82%" },
      { label: "Travel-related declines", value: "", delta: "+67%" },
    ],
    triggerInsight: "Customers reporting declined card transactions during travel and high-value purchases.",
  },
];

/** Head of Retail Banking — role-specific risk & CX spike signals.
 *  Order: EMI first, HNI second, Social Complaint + App in the middle, Fee Dispute last. */
export const headRetailRiskSpikes: RiskSpike[] = [
  {
    id: "hretail-emi-urgency",
    timestamp: "Last 4h",
    spikeType: "Urgency Surge",
    magnitude: 39,
    channel: "Voice, Chat",
    topIntent: "Loan EMI Failure",
    topIntentContext: "High impact · Low resolution",
    aiAction: "",
    severity: "critical",
    cardTitle: "EMI Repayment Surge",
    customMetrics: [
      { label: "Urgency", value: "28% → 67%", delta: "+39 pts", deltaIntent: "bad", trend: "up" },
      { label: "Unresolved cases", value: "180 → 410", delta: "+128%", deltaIntent: "bad", trend: "up" },
    ],
    triggerInsight:
      "Rate reset + missed standing instructions — 3 HNI accounts flagged for churn. Escalate to relationship managers immediately.",
  },
  {
    id: "hretail-hni-churn",
    timestamp: "Last 4h",
    spikeType: "Sentiment Crash",
    magnitude: 36,
    channel: "Voice",
    topIntent: "Account Closure Inquiry",
    topIntentContext: "Critical impact · Retention window open",
    aiAction: "",
    severity: "critical",
    cardTitle: "HNI Churn Risk",
    customMetrics: [
      { label: "Sentiment", value: "0.67 → 0.31", delta: "−0.36", deltaIntent: "bad", trend: "down" },
      { label: "Closure intents", value: "4 → 19", delta: "+375% this week", deltaIntent: "bad", trend: "up" },
      { label: "HNI at risk", value: "3 accounts", delta: undefined, deltaIntent: "bad" },
    ],
    detectedPhrases: ['"switching to competitor"', '"closing my account"'],
    triggerInsight:
      "3 high-net-worth customers actively exploring account closure. Initiate retention calls via relationship managers within 2 hours.",
  },
  {
    id: "hretail-social-complaint-trend",
    timestamp: "Last 12h",
    spikeType: "Volume Surge",
    magnitude: 182,
    channel: "Social/X, Reddit",
    topIntent: "Hidden Fees / App Outage",
    topIntentContext: "High impact · PR risk",
    aiAction: "",
    severity: "moderate",
    cardTitle: "Social Complaint Trending",
    customMetrics: [
      { label: "Mentions (4h)", value: "480 → 1,354", delta: "+182%", deltaIntent: "bad", trend: "up" },
      { label: "Top hashtag", value: "#BankAppCrash", delta: "+287% growth", deltaIntent: "bad", trend: "up" },
      { label: "Reach", value: "2.4M impressions", delta: undefined, deltaIntent: "neutral" },
    ],
    triggerInsight:
      "Complaint cluster viral on X/Reddit. #BankAppCrash + hidden-fee posts amplified by influencers. Push PR + in-app status in 60 min.",
  },
  {
    id: "hretail-app-drop",
    timestamp: "Last 4h",
    spikeType: "SLA Spike",
    magnitude: 23,
    channel: "App Store, Social/X",
    topIntent: "App Login / Password Reset",
    topIntentContext: "High impact · Fix in-flight",
    slaBefore: 8,
    slaAfter: 31,
    aiAction: "",
    severity: "moderate",
    cardTitle: "App Experience Drop",
    customMetrics: [
      { label: "App Store rating", value: "4.3 → 3.8", delta: "0.5", deltaIntent: "bad", trend: "down" },
      { label: "iOS crash reports", value: "", delta: "+195%", deltaIntent: "bad", trend: "up" },
      { label: "Top error", value: "Password loop", delta: undefined, deltaIntent: "bad" },
    ],
    triggerInsight:
      "iOS password loop bug hitting mobile-first customers. App Store rating at risk — escalate to tech team now before next review cycle.",
  },
  {
    id: "hretail-fee-dispute",
    timestamp: "Last 24h",
    spikeType: "Volume Surge",
    magnitude: 31,
    channel: "App, Chat",
    topIntent: "Fee Dispute",
    topIntentContext: "Medium impact · Policy comms gap",
    aiAction: "",
    severity: "critical",
    cardTitle: "Fee Dispute Surge",
    customMetrics: [
      { label: "Volume WoW", value: "310 → 660", delta: "+113%", deltaIntent: "bad", trend: "up" },
      { label: "Top Reason", value: "Acct maint. fee", delta: undefined, deltaIntent: "neutral" },
      { label: "Primary channel", value: "App (44%)", delta: undefined, deltaIntent: "neutral" },
    ],
    triggerInsight:
      "New account maintenance fee poorly communicated. Customers unaware of policy change — update in-app messaging today.",
  },
];

export function AIRiskSpikeMonitor({
  spikes = mockRiskSpikes,
  driverContext,
  driverSignals,
  isDarkMode: isDarkModeProp,
}: {
  spikes?: RiskSpike[];
  /** Optional line explaining what drives volume/sentiment (e.g. rate changes). Shown under the subtitle. */
  driverContext?: string;
  /** Optional list of related CX signals (e.g. "Mortgage inquiries +185%"). Rendered as pills when driverContext is set. */
  driverSignals?: string[];
  /** When embedded in a themed shell (e.g. Fluid CX V3), pass the parent theme explicitly. */
  isDarkMode?: boolean;
}) {
  const detectedDark = useRiskMonitorDarkMode();
  const isDarkMode = isDarkModeProp ?? detectedDark;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <h2 className={`text-lg font-semibold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          ✨ AI Risk Spike Monitor
        </h2>
        <span className={`text-xs px-2 py-1 rounded-full tracking-wide uppercase border ${isDarkMode ? "bg-rose-500/25 text-rose-100 border-rose-400/45" : "bg-rose-500/20 text-rose-700 border-rose-500/40"}`}>
          Operational Alerts
        </span>
      </div>
      <p className={`text-xs leading-relaxed ${isDarkMode ? "text-gray-200" : "text-gray-600"}`}>
        Live detection of sudden sentiment, SLA, urgency, volume, and backlog shocks across channels.
      </p>
      {driverContext ? (
        <div className="space-y-2">
          <p className={`text-xs leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            <span className={isDarkMode ? "text-gray-400" : "text-gray-500"}>Drivers:</span> {driverContext}
          </p>
          {driverSignals && driverSignals.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {driverSignals.map((signal, i) => (
                <span
                  key={i}
                  className={`text-[11px] px-2.5 py-1 rounded-md border ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-700'}`}
                >
                  {signal}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
      <div className="flex w-full min-w-0 gap-4 overflow-x-auto pb-3 items-stretch">
        {spikes.map((spike) => (
          <RiskSpikeCard key={spike.id} spike={spike} isDarkMode={isDarkMode} />
        ))}
      </div>
    </div>
  );
}

function useRiskMonitorDarkMode(): boolean {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const checkTheme = () => {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark') {
        setIsDarkMode(true);
        return;
      }
      if (stored === 'light') {
        setIsDarkMode(false);
        return;
      }
      const inLisnDarkShell = document.querySelector('.lisn-shell[data-theme="dark"]') !== null;
      setIsDarkMode(document.documentElement.classList.contains('dark') || inLisnDarkShell);
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    const shell = document.querySelector('.lisn-shell');
    if (shell) {
      observer.observe(shell, { attributes: true, attributeFilter: ['data-theme'] });
    }
    return () => observer.disconnect();
  }, []);

  return isDarkMode;
}

function RiskSpikeCard({ spike, isDarkMode }: { spike: RiskSpike; isDarkMode: boolean }) {
  const iconMeta = spikeIcon[spike.spikeType];
  const severityClass = isDarkMode ? severityStyles[spike.severity].dark : severityStyles[spike.severity].light;
  const detailRows = (spike.customMetrics ?? getDetailRows(spike)).slice(0, 2);
  const cardTitle = spike.cardTitle ?? labelForSpike(spike.spikeType);
  const insightText = spike.triggerInsight ?? spike.aiAction;
  const sevBadge = severityBadge[spike.severity];
  const metaLabelClass = isDarkMode ? "text-gray-300" : "text-gray-700";
  const metaValueClass = isDarkMode ? "text-gray-50" : "text-gray-900";
  const metaSubClass = isDarkMode ? "text-gray-400" : "text-gray-600";

  return (
    <div
      className={`w-[17rem] shrink-0 sm:w-[18rem] h-[22.5rem] rounded-2xl border px-4 py-4 text-sm shadow-lg flex flex-col ${severityClass} ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}
    >
      <div className="flex items-start justify-between gap-2 min-h-[2.75rem]">
        <div className={`flex items-start gap-2 text-sm font-semibold leading-snug line-clamp-2 min-w-0 flex-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          <span className={`${iconMeta.color} text-lg leading-none shrink-0 pt-0.5`}>{iconMeta.icon}</span>
          <span>{cardTitle}</span>
        </div>
        <span
          className={`shrink-0 flex items-center gap-1 text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full border ${isDarkMode ? sevBadge.dark : sevBadge.light}`}
        >
          <span className="text-[11px] leading-none">{sevBadge.icon}</span>
          <span>{sevBadge.label}</span>
        </span>
      </div>

      <div className={`mt-2 h-[4.75rem] space-y-1.5 text-[11px] ${isDarkMode ? "text-gray-200" : "text-gray-600"}`}>
        <div className="flex justify-between gap-3 items-baseline min-h-[1rem]">
          <span className={`uppercase tracking-wide font-semibold shrink-0 ${metaLabelClass}`}>
            {spike.region ? "Region" : "Channel"}
          </span>
          <span className={`font-semibold text-right truncate ${metaValueClass}`}>
            {spike.region ?? spike.channel}
          </span>
        </div>
        <div className="flex justify-between gap-3 min-h-[2.25rem]">
          <span className={`uppercase tracking-wide font-semibold shrink-0 pt-0.5 ${metaLabelClass}`}>
            Top Intent
          </span>
          <div className="text-right min-w-0 flex-1">
            <div className={`font-semibold leading-snug line-clamp-1 ${metaValueClass}`}>
              {spike.topIntent}
            </div>
            <div className={`text-[10px] leading-snug line-clamp-1 min-h-[0.875rem] ${metaSubClass}`}>
              {spike.topIntentContext ?? "\u00A0"}
            </div>
          </div>
        </div>
        <div className="flex justify-between gap-3 items-baseline min-h-[1rem]">
          <span className={`uppercase tracking-wide font-semibold ${metaLabelClass}`}>Time</span>
          <span className={`font-semibold ${metaValueClass}`}>{spike.timestamp}</span>
        </div>
      </div>

      <div
        className={`mt-3 h-[7.25rem] space-y-0 rounded-xl border p-3 text-xs flex flex-col justify-center ${
          isDarkMode
            ? "border-white/20 bg-zinc-950/85 text-gray-100 shadow-inner shadow-black/30"
            : "border-gray-300 bg-gray-50 text-gray-800"
        }`}
      >
        {detailRows.map((row, idx) => {
          const r = row as CustomMetric;
          const intent = r.deltaIntent ?? "neutral";
          const deltaClass = isDarkMode
            ? intent === "bad"
              ? "text-rose-400"
              : intent === "good"
                ? "text-emerald-400"
                : "text-gray-400"
            : deltaIntentClass[intent];
          const arrow = r.trend ? trendArrow[r.trend] : null;
          return (
            <div
              key={`${row.label}-${idx}`}
              className="flex items-center justify-between gap-3 min-h-[2.5rem] py-0.5"
            >
              <span className={`shrink-0 ${isDarkMode ? "text-gray-300 font-medium" : "text-gray-600"}`}>{row.label}</span>
              <div className="text-right min-w-0">
                <div className={`font-semibold leading-tight min-h-[1rem] ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {r.value || "\u00A0"}
                </div>
                <div
                  className={`text-[11px] font-semibold flex items-center justify-end gap-1 min-h-[0.875rem] leading-tight ${deltaClass}`}
                >
                  {r.delta ? (
                    <>
                      {arrow ? <span aria-hidden>{arrow}</span> : null}
                      <span className="truncate max-w-[7.5rem]">{deltaForTrendDisplay(r.delta, r.trend)}</span>
                    </>
                  ) : (
                    "\u00A0"
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className={`mt-auto h-[4.75rem] rounded-xl border p-3 text-xs leading-relaxed overflow-hidden ${
          isDarkMode
            ? "border-amber-500/40 bg-zinc-950/70 text-gray-100"
            : "border-rose-500/40 bg-rose-500/10 text-rose-900"
        }`}
      >
        <p className={`line-clamp-4 m-0 ${isDarkMode ? "text-gray-100" : ""}`}>
          {insightText ? `✨ ${insightText}` : "\u00A0"}
        </p>
      </div>
    </div>
  );
}

function getDetailRows(spike: RiskSpike) {
  const rows: Array<{ label: string; value: string; delta?: string }> = [];
  if (spike.urgencyBefore !== undefined && spike.urgencyAfter !== undefined) {
    rows.push({
      label: "Urgency",
      value: `${spike.urgencyBefore}% → ${spike.urgencyAfter}%`,
      delta: deltaText(spike.urgencyBefore, spike.urgencyAfter, "%"),
    });
  }
  if (spike.sentimentBefore !== undefined && spike.sentimentAfter !== undefined) {
    rows.push({
      label: "Sentiment",
      value: `${spike.sentimentBefore.toFixed(1)} → ${spike.sentimentAfter.toFixed(1)}`,
      delta: spike.sentimentAfter > spike.sentimentBefore ? "↑ anger spike" : "↓ easing tone",
    });
  }
  if (spike.unresolvedBefore !== undefined && spike.unresolvedAfter !== undefined) {
    const diff = spike.unresolvedAfter - spike.unresolvedBefore;
    rows.push({
      label: "Unresolved Load",
      value: `${spike.unresolvedBefore} → ${spike.unresolvedAfter}`,
      delta: diff === 0 ? undefined : `${diff > 0 ? "+" : ""}${diff} in last window`,
    });
  }
  if (spike.slaBefore !== undefined && spike.slaAfter !== undefined) {
    rows.push({
      label: "SLA Risk",
      value: `${spike.slaBefore}% → ${spike.slaAfter}%`,
      delta: deltaText(spike.slaBefore, spike.slaAfter, "%"),
    });
  }
  return rows;
}

function deltaText(before: number, after: number, unit: string) {
  const diff = after - before;
  if (diff === 0) return undefined;
  const sign = diff > 0 ? "+" : "";
  return `${sign}${diff}${unit}`;
}

function labelForSpike(type: RiskSpike["spikeType"]) {
  switch (type) {
    case "Urgency Surge":
      return "Urgency Spike Detected";
    case "Sentiment Crash":
      return "Sentiment Crash";
    case "SLA Spike":
      return "SLA Breach Spike";
    case "Unresolved Surge":
      return "Unresolved Case Surge";
    case "Volume Surge":
      return "Volume Surge";
    default:
      return type;
  }
}

export type { RiskSpike };


