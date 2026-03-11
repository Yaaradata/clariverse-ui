"use client";

import { useState, useEffect } from 'react';

type CustomMetric = { label: string; value: string; delta?: string };

type RiskSpike = {
  id: string;
  timestamp: string;
  spikeType: "Sentiment Crash" | "Urgency Surge" | "SLA Spike" | "Unresolved Surge" | "Volume Surge";
  magnitude: number;
  channel: "Email" | "Chat" | "Ticket" | "Social" | "Voice" | string;
  topIntent: string;
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

const spikeIcon: Record<RiskSpike["spikeType"], { icon: string; color: string }> = {
  "Urgency Surge": { icon: "", color: "text-amber-300" },
  "Sentiment Crash": { icon: "", color: "text-rose-300" },
  "SLA Spike": { icon: "", color: "text-indigo-200" },
  "Unresolved Surge": { icon: "", color: "text-yellow-300" },
  "Volume Surge": { icon: "", color: "text-emerald-300" },
};

const severityStyles: Record<RiskSpike["severity"], string> = {
  critical: "border-rose-500/60 bg-rose-500/5 shadow-rose-500/30",
  moderate: "border-amber-400/60 bg-amber-500/5 shadow-amber-500/20",
  low: "border-yellow-400/40 bg-yellow-500/5 shadow-yellow-500/10",
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
    channel: "Voice / App",
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
    channel: "Chat / Secure Messages",
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
    channel: "Voice / Mobile App",
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

export function AIRiskSpikeMonitor({
  spikes = mockRiskSpikes,
  driverContext,
  driverSignals,
}: {
  spikes?: RiskSpike[];
  /** Optional line explaining what drives volume/sentiment (e.g. rate changes). Shown under the subtitle. */
  driverContext?: string;
  /** Optional list of related CX signals (e.g. "Mortgage inquiries +185%"). Rendered as pills when driverContext is set. */
  driverSignals?: string[];
}) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const checkTheme = () => {
      const theme = localStorage.getItem('theme');
      setIsDarkMode(theme === null ? true : theme === 'dark');
    };
    checkTheme();
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <h2 className={`text-lg font-semibold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          ✨ AI Risk Spike Monitor
        </h2>
        <span className="text-xs px-2 py-1 rounded-full bg-rose-500/20 text-rose-200 tracking-wide uppercase">
          Operational Alerts
        </span>
      </div>
      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Live detection of sudden sentiment, SLA, urgency, volume, and backlog shocks across channels.
      </p>
      {driverContext ? (
        <div className="space-y-2">
          <p className={`text-xs italic ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Drivers: {driverContext}
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
      <div className="flex gap-4 overflow-x-auto pb-3 items-stretch">
        {spikes.map((spike) => (
          <RiskSpikeCard key={spike.id} spike={spike} />
        ))}
      </div>
    </div>
  );
}

function RiskSpikeCard({ spike }: { spike: RiskSpike }) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const checkTheme = () => {
      const theme = localStorage.getItem('theme');
      setIsDarkMode(theme === null ? true : theme === 'dark');
    };
    checkTheme();
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const iconMeta = spikeIcon[spike.spikeType];
  const severityClass = severityStyles[spike.severity];
  const detailRows = spike.customMetrics ?? getDetailRows(spike);
  const cardTitle = spike.cardTitle ?? labelForSpike(spike.spikeType);
  const insightText = spike.triggerInsight ?? spike.aiAction;

  return (
    <div
      className={`w-70 min-w-[16rem] rounded-2xl border px-4 py-4 text-sm shadow-lg flex flex-col ${severityClass} ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}
    >
      <div className={`flex items-center gap-2 text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        <span className={`${iconMeta.color} text-lg`}>{iconMeta.icon}</span>
        <span>{cardTitle}</span>
      </div>
      <div className={`mt-3 space-y-1 text-[11px] ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        <div className="flex justify-between">
          <span className={`uppercase tracking-wide ${isDarkMode ? 'text-gray-500' : 'text-gray-700'}`}>
            {spike.region ? "Region" : "Channel"}
          </span>
          <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
            {spike.region ?? spike.channel}
          </span>
        </div>
        <div className="flex justify-between">
          <span className={`uppercase tracking-wide ${isDarkMode ? 'text-gray-500' : 'text-gray-700'}`}>Top Intent</span>
          <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{spike.topIntent}</span>
        </div>
        <div className="flex justify-between">
          <span className={`uppercase tracking-wide ${isDarkMode ? 'text-gray-500' : 'text-gray-700'}`}>Time</span>
          <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{spike.timestamp}</span>
        </div>
      </div>

      <div className={`mt-6 space-y-2 rounded-xl border p-3 text-xs flex-1 flex flex-col justify-center ${isDarkMode ? 'border-white/5 bg-black/30 text-gray-200' : 'border-gray-300 bg-gray-50 text-gray-800'}`}>
        {detailRows.map((row, idx) => {
          const r = row as CustomMetric;
          return (
            <div key={`${row.label}-${idx}`} className="flex items-center justify-between gap-3">
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{row.label}</span>
              <div className="text-right">
                {r.value ? <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{r.value}</div> : null}
                {r.delta ? <div className={`text-[11px] ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{r.delta}</div> : null}
              </div>
            </div>
          );
        })}
      </div>

      {insightText ? (
        <div className="mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-100">
          ✨ {insightText}
        </div>
      ) : null}
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


