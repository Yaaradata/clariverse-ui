"use client";

import { useState } from "react";
import { Sparkles, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown } from "lucide-react";
import { Bar, CartesianGrid, Cell, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const TOTAL_VOLUME = 8_429;
const MEETING_SLA = 6_312;
const NOT_MEETING_SLA = TOTAL_VOLUME - MEETING_SLA;
const MEETING_PCT = Math.round((MEETING_SLA / TOTAL_VOLUME) * 100);
const NOT_MEETING_PCT = 100 - MEETING_PCT;

const VOLUME_TREND = [62, 68, 71, 65, 74, 78, 72, 80, 76, 84, 79, 85];

const FCR_CHANNEL_DATA = [
  { ch: "Voice", actual: 74, last: 78, target: 80 },
  { ch: "Chat", actual: 62, last: 66, target: 75 },
  { ch: "Email", actual: 58, last: 61, target: 70 },
  { ch: "Social/X", actual: 41, last: 48, target: 60 },
  { ch: "App SS", actual: 89, last: 86, target: 85 },
];

const FCR_CHANNEL_COLORS: Record<string, string> = {
  Voice: "#E11D48",
  Chat: "#EA580C",
  Email: "#0D9488",
  "Social/X": "#22c55e",
  "App SS": "#2563EB",
};

const LEADING_INTENTS = [
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

export function RetailSLAPerformanceOverview() {
  const [intentTab, setIntentTab] = useState<"leading" | "bottleneck">("leading");
  const isLeading = intentTab === "leading";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-md shadow-2xl">
      {/* Background subtle glow */}
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-green-500/5 blur-[100px]" />
      <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-red-500/5 blur-[100px]" />

      {/* Header */}
      <div className="relative z-10 mb-4 flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/5 border border-white/10 shadow-inner">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
        </div>
        <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-white/90">SLA Performance Overview</h2>
      </div>

      <div className="relative z-10 grid grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(260px,0.8fr)_minmax(420px,1.2fr)]">
        {/* Col 1 — Volume & Split */}
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl ring-1 ring-white/5">
          <SemiCircleGauge pct={MEETING_PCT} filledColor="#22c55e" size={180} strokeWidth={14}>
            <div className="text-4xl font-black text-white tracking-tighter">{TOTAL_VOLUME.toLocaleString()}</div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Total Contacts</div>
          </SemiCircleGauge>


          <div className="mt-6 grid w-full grid-cols-2 gap-3">
            <div className="group relative flex flex-col items-center rounded-xl border border-green-500/30 bg-green-500/10 py-4 transition-all hover:bg-green-500/20 hover:border-green-500/50 shadow-lg">
              <div className="text-2xl font-black text-green-400">{MEETING_PCT}%</div>
              <div className="text-[11px] font-bold text-green-400/70">{MEETING_SLA.toLocaleString()}</div>
              <div className="mt-1 text-[8px] font-bold uppercase tracking-widest text-white/30">Meeting</div>
            </div>
            <div className="group relative flex flex-col items-center rounded-xl border border-red-500/30 bg-red-500/10 py-4 transition-all hover:bg-red-500/20 hover:border-red-500/50 shadow-lg">
              <div className="text-2xl font-black text-red-400">{NOT_MEETING_PCT}%</div>
              <div className="text-[11px] font-bold text-red-400/70">{NOT_MEETING_SLA.toLocaleString()}</div>
              <div className="mt-1 text-[8px] font-bold uppercase tracking-widest text-white/30">Breached</div>
            </div>
          </div>
        </div>

        {/* Col 2 — Top vs bottleneck intents (tabbed) */}
        <div className="flex flex-col rounded-xl border border-white/5 bg-white/[0.02] p-4 shadow-inner">
          <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-2">
            <div className="inline-flex rounded-lg border border-white/10 bg-white/[0.03] p-1">
              <button
                type="button"
                onClick={() => setIntentTab("leading")}
                className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider transition ${
                  isLeading ? "rounded bg-green-500/15 text-green-300" : "text-white/50 hover:text-white/80"
                }`}
              >
                Top Intents
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
              <span className={`text-[8px] font-black uppercase ${isLeading ? "text-green-400" : "text-red-400"}`}>SLA %</span>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            {isLeading ? (
              <>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-white/70">Leading Intents</h3>
                </div>
                {LEADING_INTENTS.map((item) => (
                  <div key={item.intent} className="group cursor-default">
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <span className="truncate text-[11px] font-medium text-white/60 group-hover:text-white/90 transition-colors">{item.intent}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black text-green-400 font-mono">{item.pct}%</span>
                        <span className="text-[9px] font-bold text-white/20 font-mono">{item.vol.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
                      <div className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400 shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                        style={{ width: `${item.pct}%`, transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)" }} />
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-white/70">Bottleneck Intents</h3>
                </div>
                {LAGGING_INTENTS.map((item) => (
                  <div key={item.intent} className="group">
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <span className="truncate text-[11px] font-medium text-white/60 group-hover:text-white/90 transition-colors">{item.intent}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black text-red-400 font-mono">{item.pct}%</span>
                        <span className="text-[9px] font-bold text-white/20 font-mono">{item.vol.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
                      <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-400 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                        style={{ width: `${item.pct}%`, transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)" }} />
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col rounded-xl border border-white/5 bg-white/[0.02] p-4 shadow-inner">
          <div className="mb-3 flex items-center justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[12.5px] font-bold uppercase tracking-[0.08em] text-white">FCR Intelligence</span>
              </div>
              <div className="mt-1 text-[11px] text-white/60">Actual vs. target · dashed line = last month</div>
            </div>
          </div>
          <div style={{ width: "100%", height: 240 }}>
            <ResponsiveContainer>
              <ComposedChart data={FCR_CHANNEL_DATA} margin={{ top: 6, right: 12, left: -14, bottom: 0 }}>
                <CartesianGrid stroke="#393939" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="ch" tick={{ fill: "#b9b9ba", fontSize: 10.5, fontFamily: "var(--mono)" }} stroke="#393939" />
                <YAxis tick={{ fill: "#b9b9ba", fontSize: 10.5, fontFamily: "var(--mono)" }} stroke="#393939" domain={[0, 100]} />
                <Tooltip
                  content={({ active, payload, label }: any) => {
                    if (!active || !payload?.length) return null;
                    const row = FCR_CHANNEL_DATA.find((d) => d.ch === label);
                    return (
                      <div style={{ background: "rgba(10,14,22,0.96)", border: "1px solid #393939", borderRadius: 8, padding: "8px 11px", fontSize: 11 }}>
                        <div style={{ fontSize: 10.5, color: "#b9b9ba", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.6 }}>{label}</div>
                        {payload.map((p: any, i: number) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: i ? 3 : 0 }}>
                            <span style={{ width: 8, height: 8, borderRadius: 2, background: p.name === "Actual" ? (FCR_CHANNEL_COLORS[label] ?? "#b9b9ba") : (p.color || p.fill), display: "inline-block" }} />
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
                      {FCR_CHANNEL_DATA.map((d) => (
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
                  {FCR_CHANNEL_DATA.map((d, i) => (
                    <Cell key={i} fill={FCR_CHANNEL_COLORS[d.ch] ?? "#b9b9ba"} />
                  ))}
                </Bar>
                <Line dataKey="last" name="Last month" stroke="#5332FF" strokeWidth={2} strokeDasharray="4 3" dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
