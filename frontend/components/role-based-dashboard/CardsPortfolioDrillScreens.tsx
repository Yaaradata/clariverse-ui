"use client";

/**
 * Cards Portfolio Manager — drill-down screens (LiSN).
 *
 * Visual grammar matched to the Head of Credit Cards (V3) and Head of Retail
 * drills: near-black `JH` surfaces, `DrillPageHeader`, a 3-second headshot
 * (command-center chart + AI Summary Wall), signature charts, colored heatmaps.
 *
 * Each drill carries its OWN signature list form (no shared register) so the
 * three screens never read the same:
 *   1 Revenue   → RecoveryWorklist   (money split-bars: recoverable vs structural)
 *   2 Conduct   → ConductCaseBoard   (severity kanban with clause / clock chips)
 *   3 Forward   → EarlyWarningLadder (lead-time bars: voice-leads-book) + blast-radius card
 * Selecting any row reveals a single one-line cause strip — never a wall of prose.
 *
 * All 31 merged-research use cases are mapped:
 *   Revenue & Recovery        — MB1(hero) · MA1 MB7 MA3 MB6 MA4 MB10 MB15 MA7 MA8 MA13 MA14 MB8 MB13
 *   Conduct & Regulatory      — MB5(hero) · MB3 MA9 MB12 MA10 MA11 MA12 MB9 MB14 MB17
 *   Forward Credit & Attrition — MB4(hero) · MA5 MB2 MA2 MB11 MA6
 *   Substrate                 — MB16 (DPDP gate, footer)
 */

import { type CSSProperties, type ReactNode, useState } from "react";
import { ArrowLeft, ArrowRight, Clock, Radio, ShieldCheck, Sparkles } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/* ═════════════════════════ THEME (mirrors V3 `JH`) ═════════════════════════ */

const JH = {
  card: "#0d0d0d",
  surfaceRow: "#151515",
  inset: "#1a1a1a",
  track: "#1f1f1f",
  border: "#1f1f1f",
  borderInner: "#2a2a2a",
  borderBtn: "#393939",
  text: "#ffffff",
  sub: "#d6d9d8",
  muted: "#939394",
  dim: "#7e7f80",
  red: "#ef4444",
  amber: "#f59e0b",
  green: "#22c55e",
  cyan: "#38bdf8",
  violet: "#8b5cf6",
  gold: "#eab308",
} as const;

type Severity = "critical" | "watch" | "advisory";
function sevColor(s: Severity): string {
  if (s === "critical") return JH.red;
  if (s === "watch") return JH.amber;
  return JH.cyan;
}
function sevLabel(s: Severity): string {
  if (s === "critical") return "Critical";
  if (s === "watch") return "Watch";
  return "Advisory";
}

/* ═════════════════════════ SHELLS ═════════════════════════ */

function DrillPageHeader({ onBack, title, sub, accent }: { onBack: () => void; title: string; sub: string; accent: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
      <button
        type="button"
        onClick={onBack}
        style={{ display: "flex", alignItems: "center", gap: 8, background: JH.inset, border: `1px solid ${JH.borderBtn}`, borderRadius: 10, padding: "8px 16px", cursor: "pointer", color: JH.sub, fontSize: 15, fontWeight: 600, fontFamily: "inherit", flexShrink: 0, transition: "0.2s" }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = accent)}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = JH.borderBtn)}
      >
        <ArrowLeft size={16} /> Back to Overview
      </button>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: JH.text, letterSpacing: -0.3, lineHeight: 1.2 }}>{title}</div>
        <div style={{ fontSize: 15, color: JH.sub, marginTop: 3, maxWidth: 940, lineHeight: 1.5 }}>{sub}</div>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  accent,
  aiPill = false,
  right,
  children,
  style,
}: {
  title: string;
  subtitle?: string;
  accent?: string;
  aiPill?: boolean;
  right?: ReactNode;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <section style={{ background: JH.card, border: `1px solid ${JH.border}`, borderTop: accent ? `3px solid ${accent}` : `1px solid ${JH.border}`, borderRadius: 12, padding: 14, display: "flex", flexDirection: "column", minWidth: 0, ...style }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: JH.text, lineHeight: 1.3 }}>{title}</span>
            {aiPill ? <span style={{ background: `${JH.gold}20`, color: JH.gold, fontSize: 8.5, fontWeight: 800, letterSpacing: 0.5, padding: "1px 6px", borderRadius: 4 }}>✨ AI</span> : null}
          </div>
          {subtitle ? <div style={{ fontSize: 10.5, color: JH.muted, marginTop: 2, lineHeight: 1.45 }}>{subtitle}</div> : null}
        </div>
        {right}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </section>
  );
}

function AIInsightStrip({ children, tone = JH.gold }: { children: ReactNode; tone?: string }) {
  return (
    <div style={{ background: `${tone}10`, border: `1px solid ${tone}40`, borderLeft: `3px solid ${tone}`, borderRadius: 8, padding: "8px 10px", display: "flex", alignItems: "flex-start", gap: 7, fontSize: 11.5, color: JH.sub, lineHeight: 1.5 }}>
      <Sparkles size={12} color={tone} style={{ marginTop: 2, flexShrink: 0 }} />
      <span>{children}</span>
    </div>
  );
}

function Pill({ children, color, solid = false }: { children: ReactNode; color: string; solid?: boolean }) {
  return (
    <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase", padding: "2px 7px", borderRadius: 4, whiteSpace: "nowrap", color: solid ? "#0a0a0a" : color, background: solid ? color : `${color}1c`, border: solid ? "none" : `1px solid ${color}44` }}>
      {children}
    </span>
  );
}

function Num({ v, c, s = 13 }: { v: ReactNode; c?: string; s?: number }) {
  return <span style={{ fontFamily: "var(--mono), ui-monospace, monospace", fontWeight: 700, color: c ?? JH.text, fontSize: s, lineHeight: 1 }}>{v}</span>;
}

const TIP_STYLE: CSSProperties = { background: JH.inset, border: `1px solid ${JH.borderBtn}`, borderRadius: 8, fontSize: 11, color: JH.sub };

/* ═════════════════════════ AI SUMMARY WALL + HEADSHOT ═════════════════════════ */

type WallInsight = { sev: Severity; title: string; body: string };

function AISummaryWall({ insights }: { insights: WallInsight[] }) {
  return (
    <SectionCard title="AI Summary Wall" subtitle="3-second takeaway · ranked by business impact" accent={JH.gold} aiPill style={{ height: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {insights.map((ins, i) => {
          const c = sevColor(ins.sev);
          return (
            <div key={i} style={{ background: `${c}0f`, border: `1px solid ${c}33`, borderLeft: `3px solid ${c}`, borderRadius: 8, padding: "9px 11px" }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: JH.text, lineHeight: 1.35, marginBottom: 3 }}>{i + 1}. {ins.title}</div>
              <div style={{ fontSize: 11.5, color: JH.sub, lineHeight: 1.5 }}>{ins.body}</div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

function HeadshotRow({ left, insights }: { left: ReactNode; insights: WallInsight[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.55fr) minmax(300px, 1fr)", gap: 12, alignItems: "stretch" }}>
      {left}
      <AISummaryWall insights={insights} />
    </div>
  );
}

/* ═════════════════════════ HERO CURVES ═════════════════════════ */

const DECLINE_VOICE_SERIES = [
  { t: "08:00", decl: 7.9, calls: 100 }, { t: "09:00", decl: 8.1, calls: 104 }, { t: "10:00", decl: 8.0, calls: 101 },
  { t: "11:00", decl: 8.3, calls: 110 }, { t: "12:00", decl: 17.4, calls: 268 }, { t: "13:00", decl: 23.6, calls: 372 }, { t: "14:00", decl: 26.1, calls: 418 },
];
function DeclineVoiceDualCurve() {
  return (
    <div style={{ width: "100%", height: 184 }}>
      <ResponsiveContainer>
        <ComposedChart data={DECLINE_VOICE_SERIES} margin={{ top: 8, right: 6, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={JH.borderInner} vertical={false} />
          <XAxis dataKey="t" stroke={JH.dim} fontSize={10} tickLine={false} />
          <YAxis yAxisId="l" stroke={JH.red} fontSize={10} tickLine={false} width={30} />
          <YAxis yAxisId="r" orientation="right" stroke={JH.cyan} fontSize={10} tickLine={false} width={34} />
          <Tooltip contentStyle={TIP_STYLE} labelStyle={{ color: JH.text }} />
          <ReferenceLine yAxisId="l" x="11:00" stroke={JH.gold} strokeDasharray="4 3" label={{ value: "11:00 push", fill: JH.gold, fontSize: 10, position: "insideTopRight" }} />
          <Line yAxisId="l" type="monotone" dataKey="decl" name="Decline rate %" stroke={JH.red} strokeWidth={2.4} dot={false} />
          <Line yAxisId="r" type="monotone" dataKey="calls" name="'Payment failed' calls (idx)" stroke={JH.cyan} strokeWidth={2.4} strokeDasharray="5 3" dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

const ACTIVATION_SERIES = Array.from({ length: 9 }, (_, i) => {
  const day = i * 5;
  return { day: `D${day}`, baseline: Math.round(34 + 41 * (1 - Math.exp(-day / 12))), batch: Math.round(28 + 30 * (1 - Math.exp(-day / 12))) };
});
function ActivationDecayCurve() {
  return (
    <div style={{ width: "100%", height: 200 }}>
      <ResponsiveContainer>
        <ComposedChart data={ACTIVATION_SERIES} margin={{ top: 8, right: 6, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={JH.borderInner} vertical={false} />
          <XAxis dataKey="day" stroke={JH.dim} fontSize={10} tickLine={false} />
          <YAxis stroke={JH.dim} fontSize={10} tickLine={false} width={28} domain={[0, 80]} />
          <Tooltip contentStyle={TIP_STYLE} labelStyle={{ color: JH.text }} />
          <ReferenceLine x="D35" stroke={JH.red} strokeDasharray="4 3" label={{ value: "D37 closure", fill: JH.red, fontSize: 10, position: "insideTopLeft" }} />
          <Line type="monotone" dataKey="baseline" name="Baseline %" stroke={JH.green} strokeWidth={2.2} dot={false} />
          <Line type="monotone" dataKey="batch" name="Batch #4471 %" stroke={JH.amber} strokeWidth={2.4} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

const HARDSHIP_ROLL_SERIES = [
  { w: "W-4", hardship: 100, roll: 100 }, { w: "W-3", hardship: 124, roll: 101 }, { w: "W-2", hardship: 168, roll: 103 },
  { w: "W-1", hardship: 190, roll: 109 }, { w: "Now", hardship: 205, roll: 121 }, { w: "+1", hardship: 210, roll: 142 }, { w: "+2", hardship: 212, roll: 161 },
];
function HardshipRollCurve() {
  return (
    <div style={{ width: "100%", height: 184 }}>
      <ResponsiveContainer>
        <ComposedChart data={HARDSHIP_ROLL_SERIES} margin={{ top: 8, right: 6, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={JH.borderInner} vertical={false} />
          <XAxis dataKey="w" stroke={JH.dim} fontSize={10} tickLine={false} />
          <YAxis stroke={JH.dim} fontSize={10} tickLine={false} width={30} />
          <Tooltip contentStyle={TIP_STYLE} labelStyle={{ color: JH.text }} />
          <ReferenceLine x="Now" stroke={JH.gold} strokeDasharray="4 3" label={{ value: "today", fill: JH.gold, fontSize: 10, position: "insideTopRight" }} />
          <Line type="monotone" dataKey="hardship" name="Hardship voice (idx)" stroke={JH.amber} strokeWidth={2.4} dot={false} />
          <Line type="monotone" dataKey="roll" name="0→30 roll (idx)" stroke={JH.red} strokeWidth={2.4} strokeDasharray="5 3" dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ═════════════════════════ SIGNATURE CHARTS ═════════════════════════ */

const RECOVERABLE_BY_SIGNAL = [
  { sig: "Co-brand churn", id: "MB10", cr: 18.0 },
  { sig: "Decline spike", id: "MB1", cr: 2.4 },
  { sig: "Curable declines", id: "MA1", cr: 2.4 },
  { sig: "Premiumisation drift", id: "MA14", cr: 1.5 },
  { sig: "Offer cannibalisation", id: "MA4", cr: 1.3 },
  { sig: "Yield leakage", id: "MA7", cr: 1.2 },
  { sig: "Token approval-gap", id: "MA13", cr: 1.1 },
  { sig: "Switch attribution", id: "MA3", cr: 0.9 },
  { sig: "Offer→complaint", id: "MB6", cr: 0.9 },
  { sig: "Aggregator cluster", id: "MB15", cr: 0.8 },
  { sig: "Recurring token", id: "MB8", cr: 0.7 },
  { sig: "Reward-negative", id: "MA8", cr: 0.6 },
  { sig: "App defect", id: "MB13", cr: 0.5 },
];
function RecoverableByCohortBar() {
  return (
    <SectionCard title="Rupees in play, by signal" subtitle="Recoverable / at-risk ₹ Cr per revenue signal — ranks where the money is" accent={JH.cyan} aiPill>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={RECOVERABLE_BY_SIGNAL} layout="vertical" margin={{ top: 4, right: 30, left: 6, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={JH.borderInner} horizontal={false} />
            <XAxis type="number" stroke={JH.dim} fontSize={10} tickFormatter={(v) => `₹${v}Cr`} />
            <YAxis type="category" dataKey="sig" stroke={JH.sub} fontSize={10.5} width={120} />
            <Tooltip contentStyle={TIP_STYLE} labelStyle={{ color: JH.text }} formatter={(v) => [`₹${v} Cr`, "at risk / recoverable"]} cursor={{ fill: `${JH.cyan}10` }} />
            <Bar dataKey="cr" radius={[0, 5, 5, 0]}>
              {RECOVERABLE_BY_SIGNAL.map((r, i) => (
                <Cell key={i} fill={r.cr >= 5 ? JH.red : r.cr >= 1.5 ? JH.amber : `${JH.cyan}cc`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}

const ROLL_BY_VINTAGE = [
  { v: "Q4-23", bps: 4 }, { v: "Q1-24", bps: 6 }, { v: "Q2-24", bps: 9 }, { v: "Q3-24", bps: 5 }, { v: "Q4-24", bps: 3 },
];
function RollByVintageBar() {
  return (
    <SectionCard title="Projected 0→30 roll by sourcing vintage" subtitle="Voice-led forecast (bps of credit cost) — Q2-24 inflecting above its band" accent={JH.amber} aiPill>
      <div style={{ width: "100%", height: 240 }}>
        <ResponsiveContainer>
          <BarChart data={ROLL_BY_VINTAGE} margin={{ top: 8, right: 10, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={JH.borderInner} vertical={false} />
            <XAxis dataKey="v" stroke={JH.dim} fontSize={10.5} tickLine={false} />
            <YAxis stroke={JH.dim} fontSize={10} tickLine={false} width={32} tickFormatter={(v) => `${v}bps`} />
            <Tooltip contentStyle={TIP_STYLE} labelStyle={{ color: JH.text }} formatter={(v) => [`${v} bps`, "projected roll"]} cursor={{ fill: `${JH.amber}10` }} />
            <ReferenceLine y={5} stroke={JH.dim} strokeDasharray="4 3" label={{ value: "cohort band", fill: JH.dim, fontSize: 9, position: "insideTopRight" }} />
            <Bar dataKey="bps" radius={[5, 5, 0, 0]}>
              {ROLL_BY_VINTAGE.map((r, i) => (
                <Cell key={i} fill={r.bps >= 8 ? JH.red : r.bps >= 6 ? JH.amber : `${JH.green}cc`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}

/* Regulatory clocks — horizontal countdown bars */
const REG_CLOCKS = [
  { label: "Ombudsman decision", id: "MB5", left: 4, window: 30, unit: "days", tone: JH.red },
  { label: "Dispute → CIC report", id: "MB14", left: 3, window: 30, unit: "days", tone: JH.red },
  { label: "Unactivated 30+7 closure", id: "MA9", left: 17, window: 37, unit: "days", tone: JH.amber },
  { label: "Auth Directions 2025", id: "MB3", left: 120, window: 365, unit: "days", tone: JH.amber },
  { label: "Cross-border CNP validation", id: "MB12", left: 200, window: 365, unit: "days", tone: JH.gold },
];
function RegulatoryClocks() {
  return (
    <SectionCard title="Regulatory clocks" subtitle="Time remaining before each window closes — shortest first" accent={JH.violet} aiPill>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {REG_CLOCKS.map((c) => {
          const pct = Math.max(4, Math.round((c.left / c.window) * 100));
          return (
            <div key={c.id} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) 1fr 84px", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 12, color: JH.sub, display: "inline-flex", alignItems: "center", gap: 6, minWidth: 0 }}>
                <Pill color={JH.dim}>{c.id}</Pill>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.label}</span>
              </span>
              <div style={{ height: 10, borderRadius: 5, background: JH.track, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: c.tone, borderRadius: 5 }} />
              </div>
              <span style={{ textAlign: "right", display: "inline-flex", alignItems: "center", justifyContent: "flex-end", gap: 4, color: c.tone }}>
                <Clock size={11} /> <Num v={c.left} c={c.tone} s={13} /> <span style={{ fontSize: 10, color: JH.muted }}>{c.unit}</span>
              </span>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

/* Decline-index heatmap — reason × cohort */
const DECLINE_REASONS = ["Insufficient funds", "3DS / OTP fail", "Token expiry", "Fraud rule", "Limit / velocity"];
const DECLINE_COHORTS = ["HNI", "Mass", "Co-brand", "New"];
const DECLINE_MATRIX: Record<string, number[]> = {
  "Insufficient funds": [88, 41, 36, 22],
  "3DS / OTP fail": [54, 38, 31, 67],
  "Token expiry": [72, 24, 44, 18],
  "Fraud rule": [61, 33, 29, 81],
  "Limit / velocity": [28, 35, 22, 19],
};
function DeclineHeatmap() {
  const cell = (v: number) => {
    const c = v >= 70 ? JH.red : v >= 45 ? JH.amber : v >= 30 ? JH.gold : JH.green;
    const intensity = v >= 70 ? "cc" : v >= 45 ? "88" : v >= 30 ? "66" : "44";
    return (
      <div title={`Decline index ${v}`} style={{ background: `${c}${intensity}`, border: `1px solid ${c}55`, borderRadius: 6, height: 30, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11.5, fontWeight: 800, color: JH.text, fontFamily: "var(--mono), ui-monospace, monospace" }}>{v}</div>
    );
  };
  return (
    <SectionCard title="Decline-index heatmap" subtitle="Reason × cohort · intensity = decline pressure (higher is worse)" accent={JH.red} aiPill>
      <div style={{ display: "grid", gridTemplateColumns: "130px repeat(4, 1fr)", gap: 4 }}>
        <div />
        {DECLINE_COHORTS.map((c) => (
          <div key={c} style={{ fontSize: 10, color: JH.muted, textAlign: "center", fontFamily: "var(--mono), ui-monospace, monospace", paddingBottom: 2 }}>{c}</div>
        ))}
        {DECLINE_REASONS.map((r) => (
          <Fragment key={r}>
            <div style={{ fontSize: 11, color: JH.sub, alignSelf: "center" }}>{r}</div>
            {DECLINE_MATRIX[r].map((v, i) => (
              <div key={`${r}-${i}`}>{cell(v)}</div>
            ))}
          </Fragment>
        ))}
      </div>
      <div style={{ display: "flex", gap: 14, marginTop: 10, paddingTop: 8, borderTop: `1px solid ${JH.borderInner}` }}>
        {[
          { c: JH.green, l: "< 30 normal" },
          { c: JH.amber, l: "45–69 elevated" },
          { c: JH.red, l: "≥ 70 acute" },
        ].map((x) => (
          <span key={x.l} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10, color: JH.muted }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: `${x.c}aa`, border: `1px solid ${x.c}` }} /> {x.l}
          </span>
        ))}
      </div>
    </SectionCard>
  );
}

/* Fragment helper (avoid importing React namespace) */
function Fragment({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

/* ═════════════════════════ SHARED SIGNAL MODEL ═════════════════════════ */

type SignalRow = {
  id: string;
  sev: Severity;
  signal: string;
  cohort: string;
  metric: string;
  delta?: string;
  deltaTone?: "bad" | "good" | "neutral";
  impact: string;
  route: string;
  cause: string;
  action: string;
  feed?: boolean;
  advisory?: boolean;
  /** Revenue worklist — share of the at-risk ₹ recoverable today (green) vs structural. */
  recoverablePct?: number;
  /** Conduct board — the clause / clock this case maps to. */
  clause?: string;
  /** Forward ladder — how far the voice signal leads the book before the metric confirms. */
  lead?: { label: string; pct: number };
};

/**
 * One compact, one-line explanation strip + routing + action — shared by all
 * three registers so the *cause text never becomes a wall of prose*. The list
 * form above it is what differs per drill, not this footer.
 */
function SelectedCause({ row }: { row: SignalRow }) {
  const c = row.advisory ? JH.cyan : sevColor(row.sev);
  return (
    <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Pill color={c}>{row.advisory ? "advisory" : sevLabel(row.sev)}</Pill>
        <span style={{ fontSize: 12.5, fontWeight: 800, color: JH.text }}>{row.signal}</span>
        <span style={{ fontSize: 9, fontWeight: 800, color: JH.dim, fontFamily: "var(--mono), ui-monospace, monospace" }}>{row.id}</span>
      </div>
      <AIInsightStrip tone={c}>{row.cause}</AIInsightStrip>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, color: JH.muted }}>
          <ArrowRight size={12} color={JH.cyan} /> Routed to <strong style={{ color: JH.cyan }}>{row.route}</strong>
          {row.feed ? <span style={{ display: "inline-flex", alignItems: "center", gap: 3, color: JH.amber, marginLeft: 6 }}><Radio size={10} /> feed-dependent</span> : null}
        </span>
        <button type="button" style={{ fontSize: 12, fontWeight: 600, color: JH.text, background: JH.inset, border: `1px solid ${JH.borderBtn}`, borderRadius: 8, padding: "5px 12px", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
          {row.action}
        </button>
      </div>
    </div>
  );
}

/* ───────── DRILL 1 form: RECOVERY WORKLIST (money split-bars) ───────── */

function RecoveryWorklist({ rows }: { rows: SignalRow[] }) {
  const [sel, setSel] = useState<string>(rows[0].id);
  const selected = rows.find((r) => r.id === sel) ?? rows[0];
  const cols = "minmax(0, 1.7fr) 152px 84px 116px";
  return (
    <SectionCard title="Recovery worklist" subtitle={`${rows.length} revenue signals · bar = share recoverable today (green) vs structural · ranked by ₹ in play`} accent={JH.cyan} aiPill>
      <div style={{ display: "grid", gridTemplateColumns: cols, gap: 8, padding: "0 10px 6px" }}>
        {["Signal", "Recoverable vs structural", "₹ in play", "Route"].map((h, i) => (
          <span key={h} style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.06em", color: JH.dim, textTransform: "uppercase", textAlign: i === 2 ? "right" : "left" }}>{h}</span>
        ))}
      </div>
      <div style={{ border: `1px solid ${JH.borderInner}`, borderRadius: 10, overflow: "hidden" }}>
        {rows.map((r, idx) => {
          const active = r.id === sel;
          const rc = sevColor(r.sev);
          const pct = r.recoverablePct ?? 0;
          return (
            <button key={r.id} type="button" onClick={() => setSel(r.id)} style={{ width: "100%", display: "grid", gridTemplateColumns: cols, gap: 8, alignItems: "center", padding: "9px 10px", borderTop: idx === 0 ? "none" : `1px solid ${JH.border}`, borderLeft: `3px solid ${active ? rc : "transparent"}`, background: active ? `${rc}12` : "transparent", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: rc, flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: active ? 700 : 600, color: active ? JH.text : JH.sub, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.signal}</span>
                <span style={{ fontSize: 8.5, fontWeight: 800, color: JH.dim, fontFamily: "var(--mono), ui-monospace, monospace", flexShrink: 0 }}>{r.id}</span>
                {r.feed ? <Radio size={10} color={JH.amber} style={{ flexShrink: 0 }} /> : null}
              </span>
              {pct > 0 ? (
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ flex: 1, height: 8, borderRadius: 5, background: JH.track, overflow: "hidden", display: "flex" }}>
                    <span style={{ width: `${pct}%`, background: JH.green }} />
                    <span style={{ width: `${100 - pct}%`, background: JH.dim }} />
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: JH.green, fontFamily: "var(--mono), ui-monospace, monospace", width: 30, textAlign: "right" }}>{pct}%</span>
                </span>
              ) : (
                <span style={{ fontSize: 10.5, color: JH.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.metric}</span>
              )}
              <span style={{ textAlign: "right" }}>
                <Num v={r.impact === "—" ? r.metric : r.impact} c={r.impact === "—" ? JH.muted : JH.text} s={11.5} />
              </span>
              <span style={{ fontSize: 10.5, color: JH.cyan, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.route}</span>
            </button>
          );
        })}
      </div>
      <SelectedCause row={selected} />
    </SectionCard>
  );
}

/* ───────── DRILL 2 form: CONDUCT CASE BOARD (severity kanban) ───────── */

function ConductCaseBoard({ rows }: { rows: SignalRow[] }) {
  const [sel, setSel] = useState<string>(rows[0].id);
  const selected = rows.find((r) => r.id === sel) ?? rows[0];
  const columns: { sev: Severity; label: string }[] = [
    { sev: "critical", label: "Critical" },
    { sev: "watch", label: "Watch" },
    { sev: "advisory", label: "Advisory" },
  ];
  return (
    <SectionCard title="Conduct case board" subtitle={`${rows.length} conduct & regulatory signals grouped by severity · each tagged with its clause / clock and owner`} accent={JH.violet} aiPill>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10, alignItems: "start" }}>
        {columns.map((col) => {
          const cr = sevColor(col.sev);
          const colRows = rows.filter((r) => r.sev === col.sev);
          return (
            <div key={col.sev} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, paddingBottom: 6, borderBottom: `2px solid ${cr}66` }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: cr }} />
                <span style={{ fontSize: 11, fontWeight: 800, color: JH.text, textTransform: "uppercase", letterSpacing: "0.06em" }}>{col.label}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: JH.muted, fontFamily: "var(--mono), ui-monospace, monospace" }}>{colRows.length}</span>
              </div>
              {colRows.map((r) => {
                const active = r.id === sel;
                return (
                  <button key={r.id} type="button" onClick={() => setSel(r.id)} style={{ textAlign: "left", fontFamily: "inherit", cursor: "pointer", background: active ? `${cr}16` : JH.inset, border: `1px solid ${active ? cr : JH.border}`, borderRadius: 9, padding: "9px 10px", display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 6 }}>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: JH.text, lineHeight: 1.3 }}>{r.signal}</span>
                      <span style={{ fontSize: 8, fontWeight: 800, color: JH.dim, fontFamily: "var(--mono), ui-monospace, monospace", flexShrink: 0 }}>{r.id}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      {r.impact !== "—" ? <Pill color={cr}>{r.impact}</Pill> : null}
                      {r.clause ? <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 9.5, fontWeight: 600, color: JH.violet }}><Clock size={10} /> {r.clause}</span> : null}
                      {r.feed ? <Radio size={10} color={JH.amber} /> : null}
                    </div>
                    <span style={{ fontSize: 9.5, color: JH.cyan, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 3 }}><ArrowRight size={10} /> {r.route}</span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
      <SelectedCause row={selected} />
    </SectionCard>
  );
}

/* ───────── DRILL 3 form: EARLY-WARNING LADDER (lead-time bars) ───────── */

function EarlyWarningLadder({ rows }: { rows: SignalRow[] }) {
  const [sel, setSel] = useState<string>(rows[0].id);
  const selected = rows.find((r) => r.id === sel) ?? rows[0];
  const cols = "minmax(0, 1.4fr) minmax(0, 2fr) 96px";
  return (
    <SectionCard title="Early-warning ladder" subtitle={`${rows.length} forward signals · bar = how far voice leads the book before the metric confirms · advisory, cohort-level`} accent={JH.amber} aiPill>
      <div style={{ display: "grid", gridTemplateColumns: cols, gap: 10, padding: "0 4px 4px" }}>
        <span style={{ fontSize: 9, fontWeight: 800, color: JH.dim, textTransform: "uppercase", letterSpacing: "0.06em" }}>Signal</span>
        <span style={{ fontSize: 9, fontWeight: 800, color: JH.dim, textTransform: "uppercase", letterSpacing: "0.06em" }}>Voice now → book confirms later</span>
        <span style={{ fontSize: 9, fontWeight: 800, color: JH.dim, textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "right" }}>Route</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {rows.map((r) => {
          const active = r.id === sel;
          const rc = sevColor(r.sev);
          const pct = Math.max(10, Math.min(100, r.lead?.pct ?? 30));
          return (
            <button key={r.id} type="button" onClick={() => setSel(r.id)} style={{ width: "100%", display: "grid", gridTemplateColumns: cols, gap: 10, alignItems: "center", padding: "8px 4px", borderRadius: 8, borderLeft: `3px solid ${active ? rc : "transparent"}`, background: active ? `${rc}10` : "transparent", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7, minWidth: 0 }}>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: rc, flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: active ? 700 : 600, color: active ? JH.text : JH.sub, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.signal}</span>
                <span style={{ fontSize: 8.5, fontWeight: 800, color: JH.dim, fontFamily: "var(--mono), ui-monospace, monospace", flexShrink: 0 }}>{r.id}</span>
                {r.advisory ? <Pill color={JH.cyan}>adv</Pill> : null}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: JH.amber, flexShrink: 0 }} title="voice signal lands now" />
                <span style={{ flexBasis: `${pct}%`, height: 6, borderRadius: 5, background: `linear-gradient(90deg, ${JH.amber}, ${JH.red})`, flexShrink: 1 }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: JH.amber, whiteSpace: "nowrap" }}>{r.lead?.label ?? r.metric}</span>
                <span style={{ width: 6, height: 6, borderRadius: 2, background: JH.red, flexShrink: 0 }} title="book confirms later" />
              </span>
              <span style={{ textAlign: "right", fontSize: 10, color: JH.cyan, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.route}</span>
            </button>
          );
        })}
      </div>
      <SelectedCause row={selected} />
    </SectionCard>
  );
}

/* Fraud-rule misfire blast-radius card — DRILL 3 signature (distinct from the bars) */
function FraudMisfireBlastCard() {
  const bars = [
    { l: "3+ yr-tenure customers blocked", v: 80, c: JH.red },
    { l: "Switch-intent in follow-up voice", v: 34, c: JH.amber },
    { l: "App-store / social echo", v: 22, c: JH.gold },
  ];
  return (
    <SectionCard title="Fraud-rule R-77 misfire — blast radius" subtitle="Over-block confirmed in voice before any fraud KPI moved · detect-to-rollback the same morning" accent={JH.red} aiPill right={<Pill color={JH.dim}>MB2 · MA2 · MB11</Pill>}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
        <Num v="×3" c={JH.red} s={24} />
        <span style={{ fontSize: 11.5, color: JH.muted }}>&quot;card blocked at [merchant]&quot; contacts within 2h of the rule edit</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {bars.map((b) => (
          <div key={b.l} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.6fr) 1fr 40px", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: JH.sub }}>{b.l}</span>
            <span style={{ height: 8, borderRadius: 5, background: JH.track, overflow: "hidden" }}>
              <span style={{ display: "block", height: "100%", width: `${b.v}%`, background: b.c, borderRadius: 5 }} />
            </span>
            <span style={{ textAlign: "right", fontSize: 11, fontWeight: 700, color: b.c, fontFamily: "var(--mono), ui-monospace, monospace" }}>{b.v}%</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12 }}>
        <AIInsightStrip tone={JH.red}>Recommend rollback now — drafted for <strong style={{ color: JH.text }}>Head of Fraud</strong>. Good customers are being declined; the fraud KPI only confirms it days later.</AIInsightStrip>
      </div>
    </SectionCard>
  );
}

function SubstrateFooter() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", background: JH.card, border: `1px dashed ${JH.borderInner}`, borderRadius: 10, padding: "10px 14px" }}>
      <ShieldCheck size={15} color={JH.green} />
      <span style={{ fontSize: 12, fontWeight: 700, color: JH.sub }}>DPDP consent &amp; explainability gate</span>
      <span style={{ fontSize: 11.5, color: JH.muted, lineHeight: 1.5, flex: "1 1 320px" }}>
        Every signal is a cohort/merchant-level join, stamped with its consent status and an explainability trail. Identity-level joins are blocked unless purpose-limited consent exists. Actions are draft → human-approve → audit-logged — LiSN never auto-fires.
      </span>
      <Pill color={JH.green}>substrate · MB16</Pill>
    </div>
  );
}

/* ═════════════════════════ DRILL 1 — REVENUE & RECOVERY ═════════════════════════ */

const REVENUE_ROWS: SignalRow[] = [
  { id: "MA1", sev: "watch", signal: "Curable-decline recovery", cohort: "PREM HNI · CNP", metric: "62% curable", delta: "+38%", deltaTone: "bad", impact: "₹2.4 Cr", route: "Head of Cards", action: "Review nudge draft", recoverablePct: 62, cause: "Insufficient-funds declines run 38% above the cohort's own month-end band — curable, not structural. EMI-conversion nudge drafted to the eligible HNI sub-segment." },
  { id: "MB7", sev: "critical", signal: "Switch incident ↔ voice true-impact", cohort: "Route P-3 (in-SLA)", metric: "calls ×5", delta: "~14k", deltaTone: "bad", impact: "₹68–70L/hr", route: "Ops · Comms", action: "Draft customer comms", recoverablePct: 40, cause: "A processor route reads green but 'payment failing' contacts rose 5× and app-store reviews dipped. The voice side quantifies the human impact the health dashboard hides." },
  { id: "MA3", sev: "watch", signal: "Switch / token-CoFT attribution", cohort: "2 routes", metric: "issuer-side", impact: "—", route: "Ops · Tech", action: "Open attribution", cause: "Transaction-side attribution isolates which switch/processor route and token/CoFT step drives a decline cluster — before the voice join confirms it. Ranks by recoverable spend." },
  { id: "MB6", sev: "watch", signal: "Offer → complaint / mis-selling echo", cohort: "No-cost EMI", metric: "complaints ×3.5", delta: "48h", deltaTone: "bad", impact: "MITC", route: "Cards · Conduct", action: "Hold wave 2", feed: true, cause: "The push converts on the spend dashboard but triggers an MITC-disclosure complaint echo within 48h. Catch the fallout before the second wave sends." },
  { id: "MA4", sev: "watch", signal: "Offer incrementality & cannibalisation", cohort: "2,200+ offers", metric: "control-cohort", impact: "—", route: "Cards · Mktg", action: "Rank by incrementality", cause: "Separates genuine incremental spend from cannibalised spend across the live offer portfolio using a control-cohort method — the lift the spend dashboard averages away." },
  { id: "MB10", sev: "watch", signal: "Co-brand churn ↔ voice", cohort: "Co-brand X", metric: "spend −22%", delta: "switch ×3", deltaTone: "bad", impact: "₹18 Cr", route: "Co-brand mgr", action: "Draft retention", recoverablePct: 70, cause: "Spend fell 22% over three cycles while 'how do I switch / close this card' chatter tripled after a competitor launch — attrition, not merchant softness. Retention drafted before closures register." },
  { id: "MB15", sev: "watch", signal: "Co-brand / aggregator diagnostic join", cohort: "1 partner", metric: "decline+cmpl", impact: "—", route: "Co-brand · Ops", action: "Open partner view", feed: true, cause: "Localises a decline+complaint cluster to a single co-brand partner/aggregator — the auth/fraud-logs ↔ merchant-systems join among the hardest and most manual in India's fragmented ecosystem." },
  { id: "MA7", sev: "watch", signal: "Interchange / fee-yield leakage", cohort: "RuPay-UPI", metric: "yield ▼", impact: "₹1.2 Cr", route: "Cards · Finance", action: "Open yield view", recoverablePct: 45, cause: "Two leak paths: RuPay-UPI mix-compression eroding interchange yield, and reversal-as-dispute leakage. Fee-yield decaying while GMV holds — invisible on a spend chart." },
  { id: "MA8", sev: "watch", signal: "Reward-negative category anomaly", cohort: "+1 category", metric: "reward < 0", impact: "—", route: "Cards · Finance", action: "Flag category", feed: true, cause: "A spend category turns reward-negative — reward + fraud cost exceeds interchange — the long-tail margin leak a blended reward P&L hides. Needs reward + fraud allocation by category." },
  { id: "MA13", sev: "watch", signal: "Tokenised vs non-tokenised approval-gap", cohort: "tok vs non-tok", metric: "approval gap", impact: "—", route: "Ops · Risk", action: "Open token gap", feed: true, cause: "Isolates a token-lifecycle/ACS misconfiguration the blended approval rate hides — economically large at ~98% CoFT penetration. Tokenised CNP approving below non-tokenised on one path." },
  { id: "MA14", sev: "watch", signal: "Profitable-spend / premiumisation drift", cohort: "profitable spend", metric: "▼ vs GMV", impact: "₹1.5 Cr", route: "Head of Cards", action: "Open spend quality", recoverablePct: 55, cause: "Retained, profitable spend (net of reward and fraud) is decaying while gross GMV holds — the premiumisation-quality gap a GMV dashboard averages away." },
  { id: "MB8", sev: "watch", signal: "Token/CoFT breakage ↔ voice (recurring)", cohort: "Subs cohort", metric: "auto-pay fail", impact: "—", route: "Ops · Tech", action: "Open recurring view", feed: true, cause: "Recurring/subscription token (CoFT) breakage joined to 'subscription declined / auto-pay failed' voice — the recurring-payment failure customers feel before the metric moves." },
  { id: "MB13", sev: "watch", signal: "App-release-defect impact pack", cohort: "v3.2", metric: "journey break", impact: "—", route: "Tech · Comms", action: "Open release pack", feed: true, cause: "Ties a named app version to card-journey breakage via app-store/complaint text — release dashboards show crash/adoption, not journey breakage. v3.2 correlates with a 'can't add card / pay' spike." },
];

const REVENUE_INSIGHTS: WallInsight[] = [
  { sev: "critical", title: "Premium-HNI declines are a tokenisation break, not behaviour", body: "Decline 8%→26% from 11:00 with a 4× 'payment failed' voice spike. CoFT re-tokenisation on one network push. ₹2.4 Cr at risk — route the fix to Ops now." },
  { sev: "watch", title: "₹2.4 Cr is recoverable today via curable declines", body: "62% of the spike is curable (soft-decline / insufficient-funds at month-end). An EMI-conversion nudge to the eligible HNI sub-segment is drafted." },
  { sev: "watch", title: "Co-brand X is the biggest pool of at-risk spend", body: "₹18 Cr annual spend reads as attrition (not merchant softness) — switch-intent confirms it weeks before closures register." },
];

export function CardsRevenueRecoveryDrill({ onBack }: { onBack: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <DrillPageHeader
        onBack={onBack}
        accent={JH.cyan}
        title="Where is money leaking now?"
        sub="Revenue & Recovery — LiSN joins the decline grid to the voice/complaint corpus so the cause and the recoverable rupees arrive with the alert. Routes to Head of Cards · Ops."
      />
      <HeadshotRow
        insights={REVENUE_INSIGHTS}
        left={
          <SectionCard title="Decline-spike ↔ customer-voice root-cause join" subtitle="The join no self-built dashboard has — both curves on one timeline" accent={JH.red} aiPill right={<Pill color={JH.red} solid>HERO · MB1</Pill>}>
            <DeclineVoiceDualCurve />
            <div style={{ marginTop: 10 }}>
              <AIInsightStrip>Cause: <strong style={{ color: JH.text }}>CoFT re-tokenisation break</strong> at 11:00 — not behaviour, not fraud. ₹2.4 Cr attempted spend at risk on PREM 25–34 HNI; 62% curable.</AIInsightStrip>
            </div>
          </SectionCard>
        }
      />
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)", gap: 12, alignItems: "stretch" }}>
        <RecoverableByCohortBar />
        <DeclineHeatmap />
      </div>
      <RecoveryWorklist rows={REVENUE_ROWS} />
      <SubstrateFooter />
    </div>
  );
}

/* ═════════════════════════ DRILL 2 — CONDUCT & REGULATORY ═════════════════════════ */

const CONDUCT_ROWS: SignalRow[] = [
  { id: "MB3", sev: "critical", signal: "Weak-authentication liability cluster", cohort: "Path M-12 · CNP", metric: "47 auths", delta: "31 cmpl", deltaTone: "bad", impact: "₹6–9 L", route: "Compliance", action: "Route to Compliance", feed: true, clause: "Auth Dir 2025", cause: "47 CNP authorisations missing a completed dynamic factor on one merchant path, joined to 31 'money taken, no OTP' complaints. Under Auth Directions 2025 the issuer carries full-compensation liability." },
  { id: "MA9", sev: "watch", signal: "Activation-decay vs 30+7 closure clock", cohort: "Batch #4471", metric: "58% vs 71%", delta: "D37", deltaTone: "bad", impact: "₹93 L CAC", route: "Cards · Tech", action: "Send flow fix", clause: "30+7 day", cause: "18,000 co-brand cards activate at day-20 at 58% vs a 71% baseline. 'Can't set PIN' complaints point to a broken flow — fix it and force-closures fall to ~900." },
  { id: "MB12", sev: "watch", signal: "Cross-border CNP friction & liability", cohort: "1 corridor", metric: "co-move", delta: "Oct 2026", deltaTone: "bad", impact: "—", route: "Risk · Compliance", action: "Flag corridor", feed: true, clause: "Oct 2026", cause: "Cross-border CNP declines co-move with 'declined abroad / OTP failed' complaints on one corridor — both a CX-friction fix and an emerging weak-auth exposure ahead of the 1 Oct 2026 mechanism." },
  { id: "MA10", sev: "watch", signal: "Complaint-theme emergence radar", cohort: "interaction-native", metric: "+2 themes", impact: "—", route: "Conduct · CX", action: "Open themes", clause: "IO radar", cause: "A complaint theme is emerging in the interaction corpus before it shows in case counts — LiSN's core capability. Two new clusters this week, surfaced for early IO framing." },
  { id: "MA11", sev: "watch", signal: "Vendor-level mis-selling surveillance", cohort: "BPO pools", metric: "100% QA", delta: "vs 1–2%", deltaTone: "good", impact: "—", route: "Conduct · Vendor", action: "Open vendor QA", feed: true, clause: "100% QA", cause: "100%-QA across vendor/BPO pools vs the ~1–2% manual sample — audits the sourcing channel, not the customer. Flags mis-selling phrasing; feeds IO pattern analysis." },
  { id: "MA12", sev: "watch", signal: "Complaint-intensity per 1,000 cards", cohort: "private vs PSB", metric: "0.42", delta: "vs 0.11", deltaTone: "bad", impact: "—", route: "Head of Conduct", action: "Open benchmark", clause: "per 1k cards", cause: "Normalises complaints by active-card base (private 0.420 vs PSB 0.114), catching conduct hot spots raw counts hide as the base grows. Board-relevant." },
  { id: "MB9", sev: "watch", signal: "Double-debit / reversal-failure ↔ voice", cohort: "reversal-fail", metric: "charged ×2", impact: "—", route: "Ops · Conduct", action: "Open reversal cases", clause: "reversal", cause: "Double-debit / failed-reversal transactions joined to 'charged twice / money not returned' voice — the operational grievance that drives repeat contacts and IO escalation." },
  { id: "MB14", sev: "critical", signal: "Dispute-before-CIC-reporting breach", cohort: "CIC queue", metric: "imminent", delta: "RBI breach", deltaTone: "bad", impact: "—", route: "Collections · Compliance", action: "Hold CIC report", feed: true, clause: "CIC breach", cause: "Joins an active customer-asserted dispute to an imminent CIC default-reporting event — the exact RBI breach (disputes must settle before bureau reporting)." },
  { id: "MB17", sev: "advisory", signal: "Fair-treatment / disparate-treatment scan", cohort: "cohort parity", metric: "outcome gap", impact: "—", route: "Conduct · Compliance", action: "Open parity scan", advisory: true, clause: "parity", cause: "Detects abnormal grievance-handling/outcome gaps across cohorts/geographies — a fairness analogue no transaction tool or sampling QA can produce. Cohort-level and advisory given false-positive risk." },
];

const CONDUCT_INSIGHTS: WallInsight[] = [
  { sev: "critical", title: "Four late-fee complaints are inside the 30-day IO clock", body: "'Incorrect late fee' tripled on one co-brand, root-caused to a billing-cycle misconfiguration and concentrated in queue Q-07. Resolve before the IO window closes." },
  { sev: "critical", title: "A weak-authentication liability cluster is forming", body: "47 CNP auths missing a dynamic factor joined to 31 'no-OTP' complaints — ~₹6–9 lakh exposure and a systemic auth-flow gap under Auth Directions 2025." },
  { sev: "watch", title: "Batch #4471 will strand CAC against the 30+7 clock", body: "Activation tracks 13 pts below baseline; ~6,200 cards projected unactivated at day-37 — ₹93 lakh CAC at risk from a fixable onboarding flow." },
];

export function CardsConductRegulatoryDrill({ onBack }: { onBack: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <DrillPageHeader
        onBack={onBack}
        accent={JH.violet}
        title="Are we heading to the regulator?"
        sub="Conduct & Regulatory — complaint clusters joined to their transaction root cause, scored against the RBI / Internal Ombudsman clocks. Routes to Conduct · Compliance."
      />
      <HeadshotRow
        insights={CONDUCT_INSIGHTS}
        left={
          <SectionCard title="Ombudsman-escalation pre-empt" subtitle="Complaint cluster × transaction root cause × the 30-day IO decision clock" accent={JH.red} aiPill right={<Pill color={JH.red} solid>HERO · MB5</Pill>}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
              <Num v="4 cases" c={JH.red} s={24} />
              <span style={{ fontSize: 11.5, color: JH.muted, display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={12} color={JH.red} /> within days of the 30-day IO deadline · 'incorrect late fee' ×3</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{ background: JH.inset, border: `1px solid ${JH.border}`, borderRadius: 10, padding: "11px 12px" }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: JH.muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Root cause</div>
                <div style={{ fontSize: 12, color: JH.sub, lineHeight: 1.45 }}>Billing-cycle misconfiguration on one co-brand · maps to MITC clause 4.2</div>
              </div>
              <div style={{ background: JH.inset, border: `1px solid ${JH.border}`, borderRadius: 10, padding: "11px 12px" }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: JH.muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Mishandling locus</div>
                <div style={{ fontSize: 12, color: JH.sub, lineHeight: 1.45 }}>Resolution queue Q-07 · 41% rejection rate vs 12% portfolio</div>
              </div>
            </div>
            <div style={{ marginTop: 10 }}>
              <AIInsightStrip>Feeds the quarterly IO board pattern report against 41,457 national credit-card complaints (+20.04%). Fix the config, re-open the 4 cases, brief Q-07.</AIInsightStrip>
            </div>
          </SectionCard>
        }
      />
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 12, alignItems: "stretch" }}>
        <RegulatoryClocks />
        <SectionCard title="Activation-decay vs RBI 30+7 closure clock" subtitle="Batch #4471 · activation curve vs baseline with the day-37 force-closure line" accent={JH.amber} aiPill right={<Pill color={JH.dim}>MA9</Pill>}>
          <ActivationDecayCurve />
        </SectionCard>
      </div>
      <ConductCaseBoard rows={CONDUCT_ROWS} />
      <SubstrateFooter />
    </div>
  );
}

/* ═════════════════════════ DRILL 3 — FORWARD CREDIT & ATTRITION RISK ═════════════════════════ */

const FORWARD_ROWS: SignalRow[] = [
  { id: "MA5", sev: "watch", signal: "Early roll-rate inflection by vintage", cohort: "Vintage Q2-24", metric: "+9 bps", delta: "above band", deltaTone: "bad", impact: "—", route: "Risk · Collections", action: "Prioritise cohort", lead: { label: "~2 wks", pct: 62 }, cause: "A sourcing vintage's 0→30 migration inflects above its own seasonal band — flagged before the portfolio-level roll-rate confirms it. Concentrate collections capacity here now." },
  { id: "MB2", sev: "critical", signal: "Fraud-rule misfire, voice-confirmed", cohort: "Rule R-77", metric: "blocked ×3", delta: "< 2h", deltaTone: "bad", impact: "80% 3+yr", route: "Head of Fraud", action: "Recommend rollback", feed: true, lead: { label: "< 2h", pct: 14 }, cause: "Within two hours of R-77, 'card blocked at [merchant]' tripled — 80% from 3+-year customers with rising switch-intent — before the fraud KPI moved. Same-morning detect-to-rollback." },
  { id: "MA2", sev: "watch", signal: "Approval-rate step-change (txn-side)", cohort: "Rule R-77", metric: "−13 pts", delta: "post-rule", deltaTone: "bad", impact: "—", route: "Head of Fraud", action: "Open rule diff", feed: true, lead: { label: "post-rule", pct: 22 }, cause: "Transaction-side detection of an approval-rate step-change right after a fraud-rule change — the over-block signal before the voice join confirms it. Needs the fraud-rule change feed." },
  { id: "MB11", sev: "watch", signal: "Fraud-rule misfire × social-media surge", cohort: "viral", metric: "blast radius", impact: "—", route: "Risk · Conduct", action: "Open blast radius", lead: { label: "viral 24h", pct: 30 }, cause: "Attributes a viral / app-store reputational surge to a specific internal rule edit and quantifies the blast radius — a different decision (coordinated comms + revert) from the contact-centre fraud-rule card." },
  { id: "MA6", sev: "watch", signal: "Dormancy-onset / engagement-cliff radar", cohort: "+1 cohort", metric: "cadence ▼", delta: "onset", deltaTone: "bad", impact: "—", route: "Head of Cards", action: "Draft re-engage", lead: { label: "onset", pct: 46 }, cause: "A cohort's transaction cadence is decaying toward the dormancy threshold — caught at onset, not after the cliff. Pairs with closure-intent voice to separate attrition from a temporary pause." },
];

const FORWARD_INSIGHTS: WallInsight[] = [
  { sev: "advisory", title: "Voice is leading 0→30 roll by ~2 weeks", body: "Hardship language in vintage Q2-24 is up 1.9× and leads the roll the bureau EWS flags a fortnight later — ~9 bps. Advisory, fair-offer only, never a risk action against the customer." },
  { sev: "watch", title: "Fraud-rule R-77 is over-blocking good customers", body: "'Card blocked' contacts tripled within 2h — 80% from 3+-year customers — before any fraud KPI moved. Same-morning detect-to-rollback." },
  { sev: "watch", title: "Q2-24 vintage is inflecting above its band", body: "0→30 migration crosses its own cohort band first; concentrate collections capacity before the book-level number confirms it." },
];

export function CardsForwardRiskDrill({ onBack }: { onBack: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <DrillPageHeader
        onBack={onBack}
        accent={JH.amber}
        title="Where is cost forming first?"
        sub="Forward Credit & Attrition — credit cost and churn form in the voice corpus before the book sees them. Advisory, cohort-level, fair-offer only. Routes to Risk · Collections · Fraud."
      />
      <HeadshotRow
        insights={FORWARD_INSIGHTS}
        left={
          <SectionCard title="Hardship-language → roll-rate pre-delinquency predictor" subtitle="Credit cost forms in the voice corpus weeks before the book" accent={JH.amber} aiPill right={<div style={{ display: "flex", gap: 6 }}><Pill color={JH.cyan}>advisory</Pill><Pill color={JH.amber} solid>HERO · MB4</Pill></div>}>
            <HardshipRollCurve />
            <div style={{ marginTop: 10 }}>
              <AIInsightStrip tone={JH.cyan}>Advisory only — no credit decisioning. Genuine-hardship is split from strategic-non-payment for <strong style={{ color: JH.text }}>fair, early support</strong>; cohort-level, human-approved.</AIInsightStrip>
            </div>
          </SectionCard>
        }
      />
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 12, alignItems: "stretch" }}>
        <RollByVintageBar />
        <FraudMisfireBlastCard />
      </div>
      <EarlyWarningLadder rows={FORWARD_ROWS} />
      <SubstrateFooter />
    </div>
  );
}
