"use client";

import { useId } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend,
} from "recharts";

/** Positive = volume above neutral; negative = surge below (signed for chart). */
const SHOCK_SCORE_DATA = [
  { channel: "Email",  positive: 320, negative: -450 },
  { channel: "Voice", positive: 380, negative: -520 },
  { channel: "Social", positive: 240, negative: -360 },
  { channel: "Chat",   positive: 190, negative: -290 },
  { channel: "Ticket", positive: 310, negative: -440 },
];

const ALERTS: Array<{
  id: string;
  label: string;
  headline: string;
  tone: string;
  intent: string;
  detail: string;
  action: string;
}> = [
  {
    id: "1",
    label: "🔴 SHOCK #1",
    headline: "Email → +4.2 shift",
    tone: "(Negative surge)",
    intent: "Billing Inquiry Spike",
    detail: "150+ threads with frustration about invoice clarity in past 2 hours",
    action: "⚡ Deploy clarification email template to waiting queue",
  },
  {
    id: "2",
    label: "🟠 SURGE #2",
    headline: "Voice → +2.8 shift",
    tone: "(Positive spike)",
    intent: "Resolution Appreciation",
    detail: "Agent performance on complex issues exceeded targets by 40%",
    action: "⚡ Capture call recordings for training library",
  },
  {
    id: "3",
    label: "🟢 COOLING #3",
    headline: "Chat → -1.8 shift",
    tone: "(Sentiment stabilizing)",
    intent: "Self-Service Deflection Success",
    detail: "Knowledge base articles reduced frustrated escalations by 35%",
    action: "⚡ Monitor for sustained improvement over next 4 hours",
  },
];

// Recharts injects full tooltip props; we only read active + payload.
function ShockTooltip({ active, payload }: { active?: boolean; payload?: ReadonlyArray<{ name?: string; value?: number; payload?: unknown }> }) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload as (typeof SHOCK_SCORE_DATA)[number] | undefined;
  const channel = row?.channel ?? "Channel";
  return (
    <div className="max-w-[240px] rounded-xl border border-slate-600 bg-slate-950 p-3 text-xs text-slate-200 shadow-lg">
      <p className="mb-1 font-semibold text-white">{channel}</p>
      {payload.map((p) => (
        <p key={String(p.name)} className="text-slate-300">
          <span className="font-medium text-slate-100">{p.name}:</span>{" "}
          {typeof p.value === "number" ? Math.abs(p.value).toLocaleString() : p.value}
        </p>
      ))}
    </div>
  );
}

export function RetailCrossChannelEmotionShockboard() {
  const uid = useId().replace(/:/g, "");
  const posGrad = `emotionPositiveGradient-${uid}`;
  const negGrad = `emotionNegativeGradient-${uid}`;

  return (
    <div className="rounded-lg border border-white/10 bg-black/30 p-6 text-[color:var(--card-foreground)] shadow-lg shadow-indigo-500/10 transition-all duration-200 hover:border-[#b90abd]/40 hover:bg-black/40">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">⚡ Cross-Channel Emotion Shockboard</h2>
        </div>
        <div className="inline-flex items-center rounded-full border border-rose-400/40 bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-100">
          Emotion Alerts
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="rounded-2xl border border-white/15 bg-[rgba(26,26,26,0.6)] p-6 pb-8">
          <div className="flex items-start justify-between text-xs uppercase tracking-wide text-gray-400">
            <span>Channel Emotion Shock Score</span>
            <span className="max-w-[14rem] text-right text-[10px] normal-case text-gray-500 sm:text-xs sm:uppercase">
              Higher = larger sentiment spike with urgency
            </span>
          </div>
          <div className="mt-2 h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={SHOCK_SCORE_DATA}
                margin={{ top: 12, right: 16, left: 8, bottom: 8 }}
                barCategoryGap="18%"
              >
                <defs>
                  <linearGradient id={posGrad} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity={1} />
                    <stop offset="100%" stopColor="#0f766e" stopOpacity={0.9} />
                  </linearGradient>
                  <linearGradient id={negGrad} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f87171" stopOpacity={1} />
                    <stop offset="100%" stopColor="#9f1239" stopOpacity={0.9} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical />
                <XAxis
                  dataKey="channel"
                  tick={{ fill: "#cbd5f5", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                />
                <YAxis
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${Math.abs(Number(v))}`}
                />
                <ReferenceLine y={0} stroke="#475569" strokeWidth={1} />
                <Tooltip
                  content={(p) => <ShockTooltip active={p.active} payload={p.payload} />}
                  cursor={{ fill: "#1e293b44" }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                  formatter={(value) => <span className="text-slate-300">{value}</span>}
                />
                <Bar
                  dataKey="positive"
                  name="Positive volume"
                  fill={`url(#${posGrad})`}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={54}
                />
                <Bar
                  dataKey="negative"
                  name="Negative volume"
                  fill={`url(#${negGrad})`}
                  radius={[0, 0, 6, 6]}
                  maxBarSize={54}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Channel-Specific Emotion Alerts
          </div>
          {ALERTS.map((a) => (
            <div
              key={a.id}
              className="rounded-2xl border border-white/10 bg-[rgba(26,26,26,0.55)] px-4 py-4 text-sm text-gray-200 shadow-inner transition hover:border-[#b90abd]/40 hover:bg-black/40"
            >
              <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-wide">
                <span className="font-semibold text-gray-300">{a.label}</span>
              </div>
              <div className="space-y-1.5">
                <p className="text-sm font-semibold text-white">
                  {a.headline}{" "}
                  <span className="font-normal text-gray-400">{a.tone}</span>
                </p>
                <p className="text-xs text-gray-300">
                  Triggered Intent: <span className="font-semibold text-indigo-200">{a.intent}</span>
                </p>
                <p className="text-xs text-gray-400">{a.detail}</p>
                <p className="text-xs text-purple-300">{a.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
