"use client";

import { useState } from "react";
import { Sparkles, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Bar, CartesianGrid, Cell, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type RetailSLAOverviewVariant = "default" | "retail_h4";
export type RetailSLAOverviewSection = "full" | "funnel" | "stages" | "channel";

export type LeadingIntentRow = { intent: string; pct: number; vol: number };

const TOTAL_VOLUME = 8_429;
const MEETING_SLA = 6_312;
const NOT_MEETING_SLA = TOTAL_VOLUME - MEETING_SLA;
const MEETING_PCT = Math.round((MEETING_SLA / TOTAL_VOLUME) * 100);
const NOT_MEETING_PCT = 100 - MEETING_PCT;

const H4_VIABLE_REJECTED = 1_313;
const H4_CRIME_CONSTRAINT = 804;
const H4_VIABLE_REJECTED_PCT = 62;
const H4_CRIME_CONSTRAINT_PCT = 38;

const FCR_CHANNEL_DATA = [
  { ch: "Voice", actual: 74, last: 78, target: 80 },
  { ch: "Chat", actual: 62, last: 66, target: 75 },
  { ch: "Email", actual: 58, last: 61, target: 70 },
  { ch: "Social/X", actual: 41, last: 48, target: 60 },
  { ch: "App SS", actual: 89, last: 86, target: 85 },
];

const H4_CHANNEL_APPROVAL_DATA = [
  { ch: "Voice", actual: 71, last: 68, target: 80 },
  { ch: "Chat", actual: 68, last: 65, target: 75 },
  { ch: "Email", actual: 64, last: 62, target: 70 },
  { ch: "Social/X", actual: 52, last: 49, target: 60 },
  { ch: "App SS", actual: 82, last: 79, target: 85 },
];

const FCR_CHANNEL_COLORS: Record<string, string> = {
  Voice: "#E11D48",
  Chat: "#EA580C",
  Email: "#0D9488",
  "Social/X": "#22c55e",
  "App SS": "#2563EB",
};

const LEADING_INTENTS: LeadingIntentRow[] = [
  { intent: "Balance enquiry", pct: 97, vol: 1_240 },
  { intent: "Card activation", pct: 95, vol: 830 },
  { intent: "Direct debit setup", pct: 94, vol: 610 },
  { intent: "Statement request", pct: 93, vol: 520 },
  { intent: "PIN reset", pct: 92, vol: 480 },
];

const LAGGING_INTENTS = [
  { intent: "KYC / onboarding refresh", pct: 41, vol: 612, reason: "Source-of-wealth docs stalled in manual review queue." },
  { intent: "Mortgage rate lock", pct: 53, vol: 340, reason: "Post-rate-change surge exceeds RM capacity." },
  { intent: "Fee dispute resolution", pct: 58, vol: 295, reason: "Cross-channel case ID mismatch causes duplicates." },
];

const H4_LEADING_STAGES = [
  { intent: "Account activation", pct: 94, vol: 1_840 },
  { intent: "KYC verification", pct: 88, vol: 1_620 },
  { intent: "ID re-verification", pct: 85, vol: 980 },
  { intent: "Proof-of-trading (SME)", pct: 78, vol: 640 },
  { intent: "Entity / PSC check (SME)", pct: 72, vol: 520 },
];

const H4_LAGGING_STAGES = [
  { intent: "Source-of-wealth refresh", pct: 41, vol: 612, reason: "Manual review queue · 38% of backlog past 3-day SLA." },
  { intent: "Manual entity check (SME)", pct: 48, vol: 340, reason: "PSC verification backlog · sole-trader friction." },
  { intent: "Proof-of-trading viable rejections", pct: 52, vol: 280, reason: "Trading evidence loop · viable applicants re-applying." },
];

function SemiCircleGauge({
  pct,
  filledColor,
  emptyColor = "rgba(255,255,255,0.05)",
  size = 120,
  strokeWidth = 10,
  children,
}: {
  pct: number;
  filledColor: string;
  emptyColor?: string;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const halfCircumference = Math.PI * radius;
  const offset = halfCircumference - (pct / 100) * halfCircumference;

  return (
    <div className="relative" style={{ width: size, height: size / 2 + 5 }}>
      <svg width={size} height={size / 2 + strokeWidth} viewBox={`0 0 ${size} ${size / 2 + strokeWidth}`}>
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={emptyColor} strokeWidth={strokeWidth}
          strokeDasharray={halfCircumference} strokeDashoffset={0} strokeLinecap="round" transform={`rotate(180, ${size / 2}, ${size / 2})`} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={filledColor} strokeWidth={strokeWidth}
          strokeDasharray={halfCircumference} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(180, ${size / 2}, ${size / 2})`}
          style={{ transition: "stroke-dashoffset 0.8s ease", filter: "url(#glow)" }} />
      </svg>
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">{children}</div>
    </div>
  );
}

export function RetailSLAPerformanceOverview({
  variant = "default",
  section = "full",
  leadingIntents,
}: {
  variant?: RetailSLAOverviewVariant;
  /** Sterling H4 drill: render one column of the 3-col grid (`funnel` | `stages` | `channel`) */
  section?: RetailSLAOverviewSection;
  /** Override leading-intent labels only (Sterling head_retail service delivery) */
  leadingIntents?: LeadingIntentRow[];
}) {
  const [intentTab, setIntentTab] = useState<"leading" | "bottleneck">("leading");
  const isLeading = intentTab === "leading";
  const isH4 = variant === "retail_h4";
  const isSplitSection = section !== "full";

  const totalVolume = TOTAL_VOLUME;
  const meetingCount = MEETING_SLA;
  const notMeetingCount = NOT_MEETING_SLA;
  const meetingPct = MEETING_PCT;
  const notMeetingPct = NOT_MEETING_PCT;

  const leadingItems = isH4 ? H4_LEADING_STAGES : (leadingIntents ?? LEADING_INTENTS);
  const laggingItems = isH4 ? H4_LAGGING_STAGES : LAGGING_INTENTS;
  const channelData = isH4 ? H4_CHANNEL_APPROVAL_DATA : FCR_CHANNEL_DATA;

  const splitShellClass =
    "relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-md shadow-2xl";

  const funnelColumn = isSplitSection ? (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-2 flex shrink-0 items-center gap-2">
        <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-white/5 border border-white/10 shadow-inner">
          <Sparkles className="h-3 w-3 text-amber-400" />
        </div>
        <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/90">
          Acquisition Funnel Overview
        </h2>
      </div>
      <div className="flex min-h-0 flex-1 flex-col justify-between gap-3">
        <div className="flex flex-1 items-center justify-center">
          <SemiCircleGauge pct={meetingPct} filledColor="#22c55e" size={152} strokeWidth={12}>
            <div className="text-2xl font-black text-white tracking-tighter">{totalVolume.toLocaleString()}</div>
            <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">Applications</div>
          </SemiCircleGauge>
        </div>
        <div className="grid w-full shrink-0 grid-cols-2 gap-2.5">
          <div className="flex flex-col items-center justify-center rounded-lg border border-green-500/30 bg-green-500/10 py-3">
            <div className="text-xl font-black text-green-400">{meetingPct}%</div>
            <div className="text-[10px] font-bold text-green-400/70">{meetingCount.toLocaleString()}</div>
            <div className="mt-0.5 text-[7px] font-bold uppercase tracking-widest text-white/30">Approved</div>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 py-3">
            <div className="text-xl font-black text-red-400">{notMeetingPct}%</div>
            <div className="text-[10px] font-bold text-red-400/70">{notMeetingCount.toLocaleString()}</div>
            <div className="mt-0.5 text-[7px] font-bold uppercase tracking-widest text-white/30">Declined</div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl ring-1 ring-white/5">
      <SemiCircleGauge pct={meetingPct} filledColor="#22c55e" size={180} strokeWidth={14}>
        <div className="text-4xl font-black text-white tracking-tighter">{totalVolume.toLocaleString()}</div>
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
          {isH4 ? "Applications" : "Total Contacts"}
        </div>
      </SemiCircleGauge>

      <div className="mt-6 grid w-full grid-cols-2 gap-3">
        <div className="group relative flex flex-col items-center rounded-xl border border-green-500/30 bg-green-500/10 py-4 transition-all hover:bg-green-500/20 hover:border-green-500/50 shadow-lg">
          <div className="text-2xl font-black text-green-400">{meetingPct}%</div>
          <div className="text-[11px] font-bold text-green-400/70">{meetingCount.toLocaleString()}</div>
          <div className="mt-1 text-[8px] font-bold uppercase tracking-widest text-white/30">
            {isH4 ? "Approved" : "Meeting"}
          </div>
        </div>
        <div className="group relative flex flex-col items-center rounded-xl border border-red-500/30 bg-red-500/10 py-4 transition-all hover:bg-red-500/20 hover:border-red-500/50 shadow-lg">
          <div className="text-2xl font-black text-red-400">{notMeetingPct}%</div>
          <div className="text-[11px] font-bold text-red-400/70">{notMeetingCount.toLocaleString()}</div>
          <div className="mt-1 text-[8px] font-bold uppercase tracking-widest text-white/30">
            {isH4 ? "Declined" : "Breached"}
          </div>
        </div>
      </div>

      {isH4 ? (
        <div className="mt-4 w-full space-y-2">
          <div className="flex h-2 overflow-hidden rounded-full">
            <div className="bg-amber-500/80" style={{ width: `${H4_CRIME_CONSTRAINT_PCT}%` }} title="Crime-constraint" />
            <div className="bg-red-500/80" style={{ width: `${H4_VIABLE_REJECTED_PCT}%` }} title="Viable-but-rejected" />
          </div>
          <div className="text-[10px] leading-snug text-white/50">
            Of declined:{" "}
            <span className="font-semibold text-red-300">
              {H4_VIABLE_REJECTED_PCT}% viable-but-rejected (~{H4_VIABLE_REJECTED.toLocaleString()})
            </span>
            {" · "}
            <span className="font-semibold text-amber-300">
              {H4_CRIME_CONSTRAINT_PCT}% crime-constraint (~{H4_CRIME_CONSTRAINT.toLocaleString()})
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );

  const renderStageRow = (
    item: { intent: string; pct: number; vol: number },
    tone: "leading" | "bottleneck",
    expanded = false,
  ) => {
    const isLead = tone === "leading";
    const pctColor = isLead ? "text-green-400" : "text-red-400";
    const barGradient = isLead
      ? "bg-gradient-to-r from-green-500 to-emerald-400 shadow-[0_0_8px_rgba(34,197,94,0.4)]"
      : "bg-gradient-to-r from-red-500 to-orange-400 shadow-[0_0_8px_rgba(239,68,68,0.4)]";
    return (
      <div
        key={item.intent}
        className={`group cursor-default ${expanded ? "flex flex-1 flex-col justify-center min-h-0" : ""}`}
      >
        <div className={`flex items-center justify-between gap-3 ${expanded ? "mb-2" : "mb-1"}`}>
          <span className={`truncate font-medium text-white/70 group-hover:text-white/90 transition-colors ${expanded ? "text-[12px]" : "text-[11px]"}`}>
            {item.intent}
          </span>
          <div className="flex shrink-0 items-center gap-2">
            <span className={`font-black font-mono ${pctColor} ${expanded ? "text-[12px]" : "text-[11px]"}`}>{item.pct}%</span>
            <span className={`font-bold font-mono text-white/25 ${expanded ? "text-[10px]" : "text-[9px]"}`}>{item.vol.toLocaleString()}</span>
          </div>
        </div>
        <div className={`w-full overflow-hidden rounded-full bg-white/5 ${expanded ? "h-2" : "h-1"}`}>
          <div className={`h-full rounded-full ${barGradient}`} style={{ width: `${item.pct}%` }} />
        </div>
      </div>
    );
  };

  const stagesColumn = isSplitSection ? (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-2 flex shrink-0 items-center justify-between border-b border-white/10 pb-2">
        <div className="inline-flex rounded-lg border border-white/10 bg-white/[0.03] p-0.5">
          <button
            type="button"
            onClick={() => setIntentTab("leading")}
            className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-wider transition ${
              isLeading ? "rounded bg-green-500/15 text-green-300" : "text-white/50 hover:text-white/80"
            }`}
          >
            Top Stages
          </button>
          <button
            type="button"
            onClick={() => setIntentTab("bottleneck")}
            className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-wider transition ${
              !isLeading ? "rounded bg-red-500/15 text-red-300" : "text-white/50 hover:text-white/80"
            }`}
          >
            Bottleneck
          </button>
        </div>
        <div
          className={`flex items-center gap-1 rounded-full px-1.5 py-0.5 border ${
            isLeading ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"
          }`}
        >
          <span className={`text-[7px] font-black uppercase ${isLeading ? "text-green-400" : "text-red-400"}`}>
            Approval %
          </span>
        </div>
      </div>

      <div className="mb-2 flex shrink-0 items-center gap-1.5">
        {isLeading ? (
          <CheckCircle2 className="h-3 w-3 text-green-400" />
        ) : (
          <AlertTriangle className="h-3 w-3 text-red-400" />
        )}
        <h3 className="text-[9px] font-black uppercase tracking-widest text-white/70">
          {isLeading ? "Leading Onboarding Stages" : "Bottleneck Stages"}
        </h3>
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-between gap-0.5">
        {(isLeading ? leadingItems : laggingItems).map((item) =>
          renderStageRow(item, isLeading ? "leading" : "bottleneck", true),
        )}
      </div>
    </div>
  ) : (
    <div className="flex h-full flex-col rounded-xl border border-white/5 bg-white/[0.02] p-4 shadow-inner">
      <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-2">
        <div className="inline-flex rounded-lg border border-white/10 bg-white/[0.03] p-1">
          <button
            type="button"
            onClick={() => setIntentTab("leading")}
            className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider transition ${
              isLeading ? "rounded bg-green-500/15 text-green-300" : "text-white/50 hover:text-white/80"
            }`}
          >
            {isH4 ? "Top Stages" : "Top Intents"}
          </button>
          <button
            type="button"
            onClick={() => setIntentTab("bottleneck")}
            className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider transition ${
              !isLeading ? "rounded bg-red-500/15 text-red-300" : "text-white/50 hover:text-white/80"
            }`}
          >
            Bottleneck
          </button>
        </div>
        <div
          className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 border ${
            isLeading ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"
          }`}
        >
          <span className={`text-[8px] font-black uppercase ${isLeading ? "text-green-400" : "text-red-400"}`}>
            {isH4 ? "Approval %" : "SLA %"}
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-3 min-h-0 overflow-y-auto">
        {isLeading ? (
          <>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white/70">
                {isH4 ? "Leading Onboarding Stages" : "Leading Intents"}
              </h3>
            </div>
            {leadingItems.map((item) => renderStageRow(item, "leading"))}
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white/70">
                {isH4 ? "Bottleneck Stages" : "Bottleneck Intents"}
              </h3>
            </div>
            {laggingItems.map((item) => renderStageRow(item, "bottleneck"))}
          </>
        )}
      </div>
    </div>
  );

  const channelColumn = isSplitSection ? (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-3 shrink-0">
        <div className="text-[12.5px] font-bold uppercase tracking-[0.08em] text-white">Channel Approval Rate</div>
        <div className="mt-1 text-[11px] text-white/60">Onboarding approval by channel · dashed line = last month</div>
      </div>
      <div className="min-h-0 flex-1" style={{ width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={channelData} margin={{ top: 6, right: 12, left: -14, bottom: 0 }}>
            <CartesianGrid stroke="#393939" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="ch" tick={{ fill: "#b9b9ba", fontSize: 10.5, fontFamily: "var(--mono)" }} stroke="#393939" />
            <YAxis tick={{ fill: "#b9b9ba", fontSize: 10.5, fontFamily: "var(--mono)" }} stroke="#393939" domain={[0, 100]} />
            <Tooltip
              content={({ active, payload, label }: any) => {
                if (!active || !payload?.length) return null;
                const row = channelData.find((d) => d.ch === label);
                return (
                  <div style={{ background: "rgba(10,14,22,0.96)", border: "1px solid #393939", borderRadius: 8, padding: "8px 11px", fontSize: 11 }}>
                    <div style={{ fontSize: 10.5, color: "#b9b9ba", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.6 }}>{label}</div>
                    {payload.map((p: any, i: number) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: i ? 3 : 0 }}>
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: p.name === "Actual" ? (FCR_CHANNEL_COLORS[label ?? ""] ?? "#b9b9ba") : (p.color || p.fill), display: "inline-block" }} />
                        <span style={{ color: "#b9b9ba" }}>{p.name}</span>
                        <span style={{ color: "#fff", fontWeight: 700, fontFamily: "var(--mono)", marginLeft: "auto" }}>{p.value}%</span>
                      </div>
                    ))}
                    {row ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: "#b9b9ba", opacity: 0.4, display: "inline-block" }} />
                        <span style={{ color: "#b9b9ba" }}>Target</span>
                        <span style={{ color: "#fff", fontWeight: 700, fontFamily: "var(--mono)", marginLeft: "auto" }}>{row.target}%</span>
                      </div>
                    ) : null}
                  </div>
                );
              }}
            />
            <Legend
              content={() => (
                <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 12, marginTop: 4 }}>
                  {channelData.map((d) => (
                    <div key={d.ch} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: FCR_CHANNEL_COLORS[d.ch] ?? "#b9b9ba", display: "inline-block" }} />
                      <span style={{ fontSize: 11, color: "#b9b9ba" }}>{d.ch}</span>
                    </div>
                  ))}
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 14, height: 0, borderTop: "2px dashed #5332FF", display: "inline-block" }} />
                    <span style={{ fontSize: 11, color: "#b9b9ba" }}>Last month</span>
                  </div>
                </div>
              )}
            />
            <Bar dataKey="actual" name="Actual" radius={[4, 4, 0, 0]}>
              {channelData.map((d, i) => (
                <Cell key={i} fill={FCR_CHANNEL_COLORS[d.ch] ?? "#b9b9ba"} />
              ))}
            </Bar>
            <Line dataKey="last" name="Last month" stroke="#5332FF" strokeWidth={2} strokeDasharray="4 3" dot={{ r: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  ) : (
    <div className="flex h-full flex-col rounded-xl border border-white/5 bg-white/[0.02] p-4 shadow-inner">
      <div className="mb-3 flex items-center justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[12.5px] font-bold uppercase tracking-[0.08em] text-white">
              {isH4 ? "Channel Approval Rate" : "FCR Intelligence"}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-white/60">
            {isH4 ? "Onboarding approval by channel · dashed line = last month" : "Actual vs. target · dashed line = last month"}
          </div>
        </div>
      </div>
      <div className="flex-1 min-h-0" style={{ width: "100%", minHeight: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={channelData} margin={{ top: 6, right: 12, left: -14, bottom: 0 }}>
            <CartesianGrid stroke="#393939" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="ch" tick={{ fill: "#b9b9ba", fontSize: 10.5, fontFamily: "var(--mono)" }} stroke="#393939" />
            <YAxis tick={{ fill: "#b9b9ba", fontSize: 10.5, fontFamily: "var(--mono)" }} stroke="#393939" domain={[0, 100]} />
            <Tooltip
              content={({ active, payload, label }: any) => {
                if (!active || !payload?.length) return null;
                const row = channelData.find((d) => d.ch === label);
                return (
                  <div style={{ background: "rgba(10,14,22,0.96)", border: "1px solid #393939", borderRadius: 8, padding: "8px 11px", fontSize: 11 }}>
                    <div style={{ fontSize: 10.5, color: "#b9b9ba", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.6 }}>{label}</div>
                    {payload.map((p: any, i: number) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: i ? 3 : 0 }}>
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: p.name === "Actual" ? (FCR_CHANNEL_COLORS[label ?? ""] ?? "#b9b9ba") : (p.color || p.fill), display: "inline-block" }} />
                        <span style={{ color: "#b9b9ba" }}>{p.name}</span>
                        <span style={{ color: "#fff", fontWeight: 700, fontFamily: "var(--mono)", marginLeft: "auto" }}>{p.value}%</span>
                      </div>
                    ))}
                    {row ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: "#b9b9ba", opacity: 0.4, display: "inline-block" }} />
                        <span style={{ color: "#b9b9ba" }}>Target</span>
                        <span style={{ color: "#fff", fontWeight: 700, fontFamily: "var(--mono)", marginLeft: "auto" }}>{row.target}%</span>
                      </div>
                    ) : null}
                  </div>
                );
              }}
            />
            <Legend
              content={() => (
                <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 12, marginTop: 4 }}>
                  {channelData.map((d) => (
                    <div key={d.ch} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: FCR_CHANNEL_COLORS[d.ch] ?? "#b9b9ba", display: "inline-block" }} />
                      <span style={{ fontSize: 11, color: "#b9b9ba" }}>{d.ch}</span>
                    </div>
                  ))}
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 14, height: 0, borderTop: "2px dashed #5332FF", display: "inline-block" }} />
                    <span style={{ fontSize: 11, color: "#b9b9ba" }}>Last month</span>
                  </div>
                </div>
              )}
            />
            <Bar dataKey="actual" name="Actual" radius={[4, 4, 0, 0]}>
              {channelData.map((d, i) => (
                <Cell key={i} fill={FCR_CHANNEL_COLORS[d.ch] ?? "#b9b9ba"} />
              ))}
            </Bar>
            <Line dataKey="last" name="Last month" stroke="#5332FF" strokeWidth={2} strokeDasharray="4 3" dot={{ r: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  if (section === "funnel") {
    return <div className={splitShellClass}>{funnelColumn}</div>;
  }
  if (section === "stages") {
    return <div className={splitShellClass}>{stagesColumn}</div>;
  }
  if (section === "channel") {
    return <div className={splitShellClass}>{channelColumn}</div>;
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-md shadow-2xl">
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-green-500/5 blur-[100px]" />
      <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-red-500/5 blur-[100px]" />

      <div className="relative z-10 mb-4 flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/5 border border-white/10 shadow-inner">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
        </div>
        <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-white/90">
          {isH4 ? "Acquisition Funnel Overview" : "SLA Performance Overview"}
        </h2>
      </div>

      <div className="relative z-10 grid grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(260px,0.8fr)_minmax(420px,1.2fr)]">
        {funnelColumn}
        {stagesColumn}
        {channelColumn}
      </div>
    </div>
  );
}
