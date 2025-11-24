import { useMemo, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  AreaChart,
  Area,
  ComposedChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { getEmotionShockboardData, type EmotionShockboardEntry } from "@/lib/unified/emotionShockboardData";
// Entity Bubble Cluster imports removed

interface IntentIntelligenceSectionProps {
  clusters: unknown[];
  severityMatrix: unknown[];
  selectedIntentId: string | null;
  onIntentSelect: (intentId: string | null) => void;
}

type ShockBar = EmotionShockboardEntry;

type ShockEvent = {
  id: string;
  tone: "critical" | "warning" | "positive";
  channel: string;
  spike: number;
  shiftType: string;
  intent: string;
  cause: string;
  suggestion: string;
};

type ResolutionIssueTone = "danger" | "warning" | "info";

type ResolutionIssue = {
  id: string;
  title: string;
  intent: string;
  summary: string;
  recommendation: string;
  tone: ResolutionIssueTone;
};

const tooltipStyles = {
  backgroundColor: "#0f172a",
  borderRadius: "12px",
  border: "1px solid #334155",
  maxWidth: "280px",
};

const EmotionTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const entry = payload[0]?.payload as EmotionShockboardEntry & {
    positiveValue: number;
    negativeValue: number;
  };
  if (!entry) return null;

  const renderList = (title: string, topics: string[], colorClass: string) => (
    <div>
      <p className={`text-[11px] font-semibold uppercase tracking-wide ${colorClass}`}>{title}</p>
      {topics.length === 0 ? (
        <p className="text-[11px] text-gray-400">No standout clusters</p>
      ) : (
        <ul className="list-disc list-inside text-[11px] text-gray-100 space-y-0.5">
          {topics.map((topic) => (
            <li key={`${title}-${topic}`}>{topic}</li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="p-3 text-xs text-gray-200 space-y-2" style={tooltipStyles}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">{entry.label}</p>
        <div className="text-[11px] text-gray-400">
          Total:{" "}
          <span className="text-white font-semibold">
            {(entry.positive + entry.negative).toLocaleString()} threads
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[11px] font-semibold text-emerald-300">Positive</p>
          <p className="text-sm font-semibold text-white">{entry.positive.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-rose-300">Negative</p>
          <p className="text-sm font-semibold text-white">{entry.negative.toLocaleString()}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {renderList("Top positive clusters", entry.topPositive, "text-emerald-300")}
        {renderList("Top negative clusters", entry.topNegative, "text-rose-300")}
      </div>
    </div>
  );
};

export function EmotionShockboard({
  bars = emotionShockBars,
  events = emotionShockEvents,
}: {
  bars?: ShockBar[];
  events?: ShockEvent[];
} = {}) {
  const chartData = useMemo(
    () =>
      bars.map((entry) => ({
        ...entry,
        positiveValue: entry.positive,
        negativeValue: entry.negative * -1,
      })),
    [bars],
  );

  const maxMagnitude = Math.max(
    10,
    ...chartData.map((entry) => Math.max(entry.positiveValue, entry.negativeValue * -1))
  );
  const domain = [-Math.ceil(maxMagnitude * 1.2), Math.ceil(maxMagnitude * 1.2)];

  return (
    <Card className="border border-white/10 bg-black/30 p-6 shadow-lg shadow-indigo-500/10 transition-all duration-200 hover:border-[#b90abd]/40 hover:bg-black/40">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">⚡ Cross-Channel Emotion Shockboard</h2>
        </div>
        <Badge className="border-rose-400/40 bg-rose-500/10 text-rose-100">Emotion Alerts</Badge>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="rounded-2xl border border-white/15 bg-[rgba(26,26,26,0.6)] p-6 pb-8">
          <div className="flex items-start justify-between text-xs uppercase tracking-wide text-gray-400">
            <span>Channel Emotion Shock Score</span>
            <span>Higher = larger sentiment spike with urgency</span>
          </div>
          <div className="mt-2 h-90">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 12, right: 16, left: 16, bottom: 32 }}
                barCategoryGap={24}
              >
                <defs>
                  <linearGradient id="emotionPositiveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity={1} />
                    <stop offset="100%" stopColor="#0f766e" stopOpacity={0.9} />
                  </linearGradient>
                  <linearGradient id="emotionNegativeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f87171" stopOpacity={1} />
                    <stop offset="100%" stopColor="#9f1239" stopOpacity={0.9} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#cbd5f5", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${Math.abs(Number(value)).toLocaleString()}`}
                  domain={domain as [number, number]}
                />
                <ReferenceLine y={0} stroke="#475569" />
                <Tooltip content={<EmotionTooltip />} cursor={{ fill: "#1e293b55" }} />
                <Bar
                  dataKey="positiveValue"
                  name="Positive volume"
                  radius={[6, 6, 0, 0]}
                  fill="url(#emotionPositiveGradient)"
                  isAnimationActive={false}
                />
                <Bar
                  dataKey="negativeValue"
                  name="Negative volume"
                  radius={[0, 0, 6, 6]}
                  fill="url(#emotionNegativeGradient)"
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">
            Channel-Specific Emotion Alerts
          </div>
          {events.map((event, index) => {
            const alertLabel = event.tone === "critical" ? "SHOCK" : event.tone === "warning" ? "SURGE" : "COOLING";
            const alertIcon = event.tone === "critical" ? "🔴" : event.tone === "warning" ? "🟠" : "🟢";
            return (
              <div
                key={event.id}
                className="rounded-2xl border border-white/10 bg-[rgba(26,26,26,0.55)] px-4 py-4 text-sm text-gray-200 shadow-inner transition hover:border-[#b90abd]/40 hover:bg-black/40"
              >
                <div className="flex items-center justify-between text-xs uppercase tracking-wide mb-2">
                  <span className="font-semibold text-gray-300">
                    {alertIcon} {alertLabel} #{index + 1}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <p className="text-sm font-semibold text-white">
                    {event.channel} → {event.spike > 0 ? "+" : ""}
                    {event.spike.toFixed(1)} shift <span className="text-gray-400 font-normal">({event.shiftType})</span>
                  </p>
                  <p className="text-xs text-gray-300">
                    Triggered Intent: <span className="font-semibold text-indigo-200">{event.intent}</span>
                  </p>
                  <p className="text-xs text-gray-400">{event.cause}</p>
                  <p className="text-xs text-purple-300">⚡ {event.suggestion}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

export function ResolutionIntegrityMonitor({
  score = resolutionIntegrityScore.score,
  delta = resolutionIntegrityScore.delta,
  issues = resolutionIntegrityIssues,
}: {
  score?: number;
  delta?: number;
  issues?: ResolutionIssue[];
} = {}) {
  const scoreRotation = (Math.max(0, Math.min(score, 100)) / 100) * 360;
  const deltaColor = delta >= 0 ? "text-emerald-300" : "text-rose-300";
  const deltaLabel = delta >= 0 ? `▲ ${delta}` : `▼ ${Math.abs(delta)}`;
  const issueToneClasses: Record<ResolutionIssueTone, string> = {
    danger: "border-rose-400/30 bg-rose-500/10 text-rose-100",
    warning: "border-amber-400/30 bg-amber-500/10 text-amber-100",
    info: "border-indigo-400/30 bg-indigo-500/10 text-indigo-100",
  };

  return (
    <Card className="border border-white/10 bg-black/30 p-6 shadow-lg shadow-emerald-500/10 transition-all duration-200 hover:border-[#b90abd]/40 hover:bg-black/40">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">🛡️ Cross-Channel Resolution Integrity Monitor</h2>
          <p className="text-sm text-gray-300">Flags contradictory resolutions, loops, and accountability mismatches across channels.</p>
        </div>
        <Badge className="border-emerald-400/40 bg-emerald-500/10 text-emerald-100">Resolution QA</Badge>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,0.45fr)_minmax(0,1.55fr)]">
        <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-[rgba(26,26,26,0.6)] p-6">
          <div className="relative h-36 w-36">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(#34d399 ${scoreRotation}deg, rgba(148,163,184,0.15) ${scoreRotation}deg)`,
              }}
            />
            <div className="absolute inset-3 rounded-full bg-[rgba(12,12,12,0.85)] backdrop-blur-sm" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-center text-sm text-gray-300">
              <span className="text-[11px] uppercase tracking-wide text-gray-400">Integrity Score</span>
              <span className="text-3xl font-semibold text-white">{score}</span>
              <span className={`text-[11px] font-medium uppercase tracking-wide ${deltaColor}`}>{deltaLabel}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="rounded-2xl border border-white/10 bg-[rgba(26,26,26,0.55)] p-5 text-sm text-gray-200 shadow-inner"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-gray-400">
                <span className={`rounded-full px-2 py-0.5 ${issueToneClasses[issue.tone]}`}>{issue.title}</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-gray-300">
                  Intent: {issue.intent}
                </span>
              </div>
              <p className="mt-3 text-sm text-gray-200">{issue.summary}</p>
              <p className="mt-2 text-xs text-purple-300">✨ {issue.recommendation}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// PatternRecognitionEngine (Entity Bubble Cluster) component removed

export function IntentIntelligenceSection({
  clusters: _clusters,
  severityMatrix: _severityMatrix,
  selectedIntentId: _selectedIntentId,
  onIntentSelect: _onIntentSelect,
}: IntentIntelligenceSectionProps) {
  return (
    <div className="space-y-6">
      <EmotionShockboard />
      <ResolutionIntegrityMonitor />
    </div>
  );
}

const emotionShockBars: ShockBar[] = getEmotionShockboardData();

const emotionShockEvents: ShockEvent[] = [
  {
    id: "shock-critical-email",
    tone: "critical",
    channel: "Email",
    spike: 4.2,
    shiftType: "Negative surge",
    intent: "Billing Inquiry Spike",
    cause: "150+ threads with frustration about invoice clarity in past 2 hours",
    suggestion: "Deploy clarification email template to waiting queue",
  },
  {
    id: "shock-warning-voice",
    tone: "warning",
    channel: "Voice",
    spike: 2.8,
    shiftType: "Positive spike",
    intent: "Resolution Appreciation",
    cause: "Agent performance on complex issues exceeded targets by 40%",
    suggestion: "Capture call recordings for training library",
  },
  {
    id: "shock-positive-chat",
    tone: "positive",
    channel: "Chat",
    spike: -1.8,
    shiftType: "Sentiment stabilizing",
    intent: "Self-Service Deflection Success",
    cause: "Knowledge base articles reduced frustrated escalations by 35%",
    suggestion: "Monitor for sustained improvement over next 4 hours",
  },
];

const resolutionIntegrityScore = {
  score: 62,
  delta: -8,
};

const resolutionIntegrityIssues: ResolutionIssue[] = [
  {
    id: "issue-conflict",
    title: "Conflicting Resolution Messages",
    intent: "Debit Card Replacement",
    summary:
      "Chat confirms card dispatched, Ticket shows pending fraud review, Voice requests resend after verification failure.",
    recommendation: "Sync fraud verification workflow across CRM before allowing channel-specific closure updates.",
    tone: "danger",
  },
  {
    id: "issue-loop",
    title: "Repeated Resolution Loops",
    intent: "Mortgage Rate Lock",
    summary: "Closed → Reopened → Closed → Reopened sequence detected three times this week.",
    recommendation: "Freeze closure until underwriting pipeline clears backlog; alert compliance QA automatically.",
    tone: "warning",
  },
  {
    id: "issue-dependency",
    title: "Action Dependency Mismatch",
    intent: "Account Access Reset",
    summary: "Email flagged customer pending, Voice shows company pending, Ticket already closed.",
    recommendation: "Unify responsibility assignment and auto-reopen channels when conflicting dependencies exist.",
    tone: "info",
  },
];
