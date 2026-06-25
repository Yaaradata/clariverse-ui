"use client";

/**
 * Cards Portfolio Manager — drill-down screens (LiSN).
 *
 * Visual grammar matched to the Head of Credit Cards (V3) and Head of Retail
 * drills: near-black `JH` surfaces, `DrillPageHeader`, a 3-second headshot
 * (command-center chart + AI Summary Wall), signature charts, colored heatmaps.
 *
 * Ranjith's transaction-first model — two transaction-only cards, then the join
 * as a distinct, visually-gated third card:
 *   A Transactions & Offers → OfferIncrementalityBar + YieldRewardCard + RecoveryWorklist (txn-only)
 *   B Blockers & Problems   → DeclineHeatmap + RecoverableByCohortBar + RollByVintageBar
 *                             + ActivationDecayCurve + RegulatoryClocks + RecoveryWorklist (txn-only)
 *   C Transaction × voice   → DeclineVoiceDualCurve + HardshipRollCurve + FraudMisfireBlastCard
 *                             + EarlyWarningLadder + ConductCaseBoard (LiSN ONLY — the join)
 * Each screen ends with an Ask-LiSN NL-query strip; selecting any row reveals a
 * single one-line cause strip — never a wall of prose. Every AI element is ✨.
 *
 * Use-case map (Tier-2 → A/B/C, Tier-3 join hooks promoted into C):
 *   A — MA14 MA4 MA7 MA8 MA15 · gated hook MB6
 *   B — MA1 MA2 MA13 MA9 MA3 MA5 MA16 MA17 MB15 · gated hook MB1/MB2
 *   C — MB1(hero) MB2 MB4 MB5 MB10 MB7 MB8 MB11 MB13 MB3 MB14 MB12 MB6 MB9 MB17
 *   Substrate — MB16 (DPDP gate, footer)
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

export const JH = {
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

export function SectionCard({
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

export function AIInsightStrip({ children, tone = JH.gold }: { children: ReactNode; tone?: string }) {
  return (
    <div style={{ background: `${tone}10`, border: `1px solid ${tone}40`, borderLeft: `3px solid ${tone}`, borderRadius: 8, padding: "8px 10px", display: "flex", alignItems: "flex-start", gap: 7, fontSize: 11.5, color: JH.sub, lineHeight: 1.5 }}>
      <Sparkles size={12} color={tone} style={{ marginTop: 2, flexShrink: 0 }} />
      <span>{children}</span>
    </div>
  );
}

export function Pill({ children, color, solid = false }: { children: ReactNode; color: string; solid?: boolean }) {
  return (
    <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase", padding: "2px 7px", borderRadius: 4, whiteSpace: "nowrap", color: solid ? "#0a0a0a" : color, background: solid ? color : `${color}1c`, border: solid ? "none" : `1px solid ${color}44` }}>
      {children}
    </span>
  );
}

export function Num({ v, c, s = 13 }: { v: ReactNode; c?: string; s?: number }) {
  return <span style={{ fontFamily: "var(--mono), ui-monospace, monospace", fontWeight: 700, color: c ?? JH.text, fontSize: s, lineHeight: 1 }}>{v}</span>;
}

const TIP_STYLE: CSSProperties = { background: JH.inset, border: `1px solid ${JH.borderBtn}`, borderRadius: 8, fontSize: 11, color: JH.sub };

/* ═════════════════════════ AI SUMMARY WALL + HEADSHOT ═════════════════════════ */

export type WallInsight = { sev: Severity; title: string; body: string };

export function AISummaryWall({ insights }: { insights: WallInsight[] }) {
  return (
    <SectionCard title="AI Summary Wall" subtitle="3-second takeaway · ranked by business impact · top 5" accent={JH.gold} aiPill style={{ height: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {insights.slice(0, 5).map((ins, i) => {
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

export function HeadshotRow({ left, insights }: { left: ReactNode; insights: WallInsight[] }) {
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
export function DeclineVoiceDualCurve() {
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
export function RecoverableByCohortBar() {
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

/* Regulatory clocks — horizontal countdown bars + in-force markers */
type RegClock = { label: string; id: string; left: number; window: number; unit: string; tone: string; inForce?: boolean; since?: string };
const REG_CLOCKS: RegClock[] = [
  { label: "Ombudsman decision", id: "MB5", left: 4, window: 30, unit: "days", tone: JH.red },
  { label: "Dispute → CIC report", id: "MB14", left: 3, window: 30, unit: "days", tone: JH.red },
  { label: "Unactivated 30+7 closure", id: "MA9", left: 17, window: 37, unit: "days", tone: JH.amber },
  { label: "Cross-border CNP + BIN registration", id: "MB12", left: 103, window: 365, unit: "days", tone: JH.amber },
  { label: "Auth Directions 2025 · domestic 2FA", id: "MB3", left: 0, window: 365, unit: "", tone: JH.green, inForce: true, since: "1 Apr 2026" },
];
function RegulatoryClocks() {
  return (
    <SectionCard title="Regulatory clocks" subtitle="Time remaining before each window closes — shortest first · in-force obligations marked" accent={JH.violet} aiPill>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {REG_CLOCKS.map((c) => {
          const pct = Math.max(4, Math.round((c.left / c.window) * 100));
          return (
            <div key={c.id} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) 1fr 84px", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 12, color: JH.sub, display: "inline-flex", alignItems: "center", gap: 6, minWidth: 0 }}>
                <Pill color={JH.dim}>{c.id}</Pill>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.label}</span>
              </span>
              {c.inForce ? (
                <div style={{ height: 10, borderRadius: 5, background: `${JH.green}33`, overflow: "hidden", border: `1px solid ${JH.green}66` }}>
                  <div style={{ height: "100%", width: "100%", background: `repeating-linear-gradient(45deg, ${JH.green}cc, ${JH.green}cc 5px, ${JH.green}88 5px, ${JH.green}88 10px)` }} />
                </div>
              ) : (
                <div style={{ height: 10, borderRadius: 5, background: JH.track, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: c.tone, borderRadius: 5 }} />
                </div>
              )}
              {c.inForce ? (
                <span style={{ textAlign: "right", display: "inline-flex", alignItems: "center", justifyContent: "flex-end", gap: 4, color: JH.green }}>
                  <ShieldCheck size={11} /> <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: "0.04em" }}>IN FORCE</span>
                </span>
              ) : (
                <span style={{ textAlign: "right", display: "inline-flex", alignItems: "center", justifyContent: "flex-end", gap: 4, color: c.tone }}>
                  <Clock size={11} /> <Num v={c.left} c={c.tone} s={13} /> <span style={{ fontSize: 10, color: JH.muted }}>{c.unit}</span>
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 9 }}>
        <AIInsightStrip tone={JH.green}>Auth Directions 2025 domestic 2FA is <strong style={{ color: JH.text }}>in force since 1 Apr 2026</strong> — now an enforcement baseline, not a countdown. The live auth clock is cross-border CNP validation + BIN registration, due <strong style={{ color: JH.text }}>1 Oct 2026</strong>.</AIInsightStrip>
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
export function DeclineHeatmap() {
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

export type SignalRow = {
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
  /** Mandatory regulatory path (closure / CIC / fraud-reporting) — routed, not optional. */
  obligation?: boolean;
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
        {row.obligation ? <Pill color={JH.gold} solid>obligation</Pill> : null}
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

function RecoveryWorklist({
  rows,
  title = "Recovery worklist",
  subtitle,
  accent = JH.cyan,
  barHeader = "Recoverable vs structural",
  valueHeader = "₹ in play",
}: {
  rows: SignalRow[];
  title?: string;
  subtitle?: string;
  accent?: string;
  barHeader?: string;
  valueHeader?: string;
}) {
  const [sel, setSel] = useState<string>(rows[0].id);
  const selected = rows.find((r) => r.id === sel) ?? rows[0];
  const cols = "minmax(0, 1.7fr) 152px 84px 116px";
  return (
    <SectionCard title={title} subtitle={subtitle ?? `${rows.length} signals · bar = share recoverable today (green) vs structural · ranked by ₹ in play`} accent={accent} aiPill>
      <div style={{ display: "grid", gridTemplateColumns: cols, gap: 8, padding: "0 10px 6px" }}>
        {["Signal", barHeader, valueHeader, "Route"].map((h, i) => (
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

function ConductCaseBoard({
  rows,
  title = "Conduct case board",
  subtitle,
  accent = JH.violet,
}: {
  rows: SignalRow[];
  title?: string;
  subtitle?: string;
  accent?: string;
}) {
  const [sel, setSel] = useState<string>(rows[0].id);
  const selected = rows.find((r) => r.id === sel) ?? rows[0];
  const columns: { sev: Severity; label: string }[] = [
    { sev: "critical", label: "Critical" },
    { sev: "watch", label: "Watch" },
    { sev: "advisory", label: "Advisory" },
  ];
  return (
    <SectionCard title={title} subtitle={subtitle ?? `${rows.length} signals grouped by severity · each tagged with its clause / clock and owner`} accent={accent} aiPill>
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
                      {r.obligation ? <Pill color={JH.gold} solid>obligation</Pill> : null}
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
                {r.obligation ? <Pill color={JH.gold} solid>obligation</Pill> : null}
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

/* ═════════════════════════ TRANSACTION BASELINE MONITOR ═════════════════════════ */
/**
 * Transaction-first portfolio alert strip — live detection from transaction /
 * summary data alone. The customer-voice join is kept as a single, visually
 * distinct "Later" card at the end, never mixed into the transaction-only
 * signals. Replaces the older voice-led AI spike monitor on the overview.
 */
type MonitorTone = "critical" | "high" | "obligation" | "advisory" | "voice";

function monitorToneColor(tone: MonitorTone): string {
  switch (tone) {
    case "critical":
      return JH.red;
    case "high":
      return JH.amber;
    case "obligation":
      return JH.gold;
    case "advisory":
      return JH.cyan;
    case "voice":
      return JH.violet;
    default: {
      const _exhaustive: never = tone;
      return _exhaustive;
    }
  }
}

export type MonitorAlert = {
  id: string;
  title: string;
  badge: string;
  tone: MonitorTone;
  fields: { label: string; value: string }[];
  stats: { label: string; value: string }[];
  insight: string;
};

export const TRANSACTION_BASELINE_ALERTS: MonitorAlert[] = [
  {
    id: "tbm-token-cnp",
    title: "Tokenised CNP Approval Gap",
    badge: "Critical",
    tone: "critical",
    fields: [
      { label: "Cohort", value: "Premium · CNP" },
      { label: "Data source", value: "Token + auth feed" },
      { label: "Time", value: "Since 11:00" },
    ],
    stats: [
      { label: "Approval Gap", value: "14 pts" },
      { label: "Spend at Risk", value: "₹2.4 Cr" },
      { label: "Route", value: "Ops/Risk" },
    ],
    insight: "Tokenised path degraded after route change. Open ACS/token incident, not a customer-behaviour issue.",
  },
  {
    id: "tbm-offer-o142",
    title: "Offer O-142 Cannibalisation",
    badge: "Critical",
    tone: "critical",
    fields: [
      { label: "Cohort", value: "Cashback Plus" },
      { label: "Data source", value: "Offer + spend" },
      { label: "Time", value: "Day 6" },
    ],
    stats: [
      { label: "Redemption", value: "High" },
      { label: "True Lift", value: "Low" },
      { label: "Leakage", value: "₹78 L" },
    ],
    insight: "Matched-control baseline says spend would have happened anyway. Recommend pause or retarget.",
  },
  {
    id: "tbm-fraud-r77",
    title: "Fraud Rule R-77 Misfire",
    badge: "High",
    tone: "high",
    fields: [
      { label: "Cohort", value: "3+ yr customers" },
      { label: "Data source", value: "Rule change feed" },
      { label: "Time", value: "Within 2h" },
    ],
    stats: [
      { label: "Approval Rate", value: "94% → 81%" },
      { label: "Good Blocks", value: "+210%" },
      { label: "Feed", value: "Needs rule log" },
    ],
    insight: "Approval step-change tied to a rule edit. Data confidence depends on the fraud-rule event feed.",
  },
  {
    id: "tbm-activation-clock",
    title: "Activation Closure Clock",
    badge: "Obligation",
    tone: "obligation",
    fields: [
      { label: "Cohort", value: "Batch 4471" },
      { label: "Data source", value: "Issue + first txn" },
      { label: "Time", value: "D27" },
    ],
    stats: [
      { label: "Below baseline", value: "13 pts" },
      { label: "Cards at risk", value: "6.2k" },
      { label: "Route", value: "PM + Conduct" },
    ],
    insight: "Treat as obligation, not opportunity. Surface the closure countdown and activation intervention.",
  },
  {
    id: "tbm-utilisation-surge",
    title: "Utilisation Migration Surge",
    badge: "Advisory",
    tone: "advisory",
    fields: [
      { label: "Cohort", value: "Sourcing Q2" },
      { label: "Data source", value: "Balance + limit" },
      { label: "Time", value: "This week" },
    ],
    stats: [
      { label: "80%+ crossing", value: "1.8×" },
      { label: "Projected roll", value: "9 bps" },
      { label: "Route", value: "Risk" },
    ],
    insight: "Advisory only. No automatic customer treatment; route to EWS / model-risk review.",
  },
  {
    id: "tbm-decline-voice",
    title: "Decline ↔ Payment-Failed Voice",
    badge: "Later",
    tone: "voice",
    fields: [
      { label: "Cohort", value: "Premium CNP" },
      { label: "Needs", value: "Voice corpus" },
      { label: "Join", value: "Temporal + cohort" },
    ],
    stats: [
      { label: "Payment failed", value: "×4" },
      { label: "Link strength", value: "87%" },
      { label: "Use", value: "Prove pain" },
    ],
    insight: "This is the nobody-else-can-do LiSN layer. Kept separate from the transaction-only cards.",
  },
];

function MonitorAlertCard({ alert }: { alert: MonitorAlert }) {
  const c = monitorToneColor(alert.tone);
  const isVoice = alert.tone === "voice";
  return (
    <div
      style={{
        minWidth: 264,
        maxWidth: 300,
        flex: "1 1 264px",
        background: isVoice ? `${JH.violet}10` : JH.card,
        border: `1px solid ${c}`,
        borderRadius: 14,
        padding: "16px 16px 14px",
        display: "flex",
        flexDirection: "column",
        boxShadow: `0 8px 24px ${c}14`,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 14 }}>
        <div style={{ fontSize: 15.5, fontWeight: 800, color: JH.text, lineHeight: 1.15 }}>{alert.title}</div>
        <Pill color={c} solid>{alert.badge}</Pill>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {alert.fields.map((f) => (
          <div key={f.label} style={{ display: "grid", gridTemplateColumns: "104px 1fr", gap: 8, alignItems: "baseline" }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: JH.dim, textTransform: "uppercase", letterSpacing: "0.06em" }}>{f.label}</span>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: JH.sub, textAlign: "right" }}>{f.value}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14, background: JH.inset, border: `1px solid ${JH.borderInner}`, borderRadius: 10, padding: 12, display: "flex", flexDirection: "column", gap: 11 }}>
        {alert.stats.map((s) => (
          <div key={s.label} style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 8, alignItems: "baseline" }}>
            <span style={{ fontSize: 11.5, color: JH.muted }}>{s.label}</span>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: JH.text, textAlign: "right", fontFamily: "var(--mono), ui-monospace, monospace" }}>{s.value}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "auto", paddingTop: 14 }}>
        <div style={{ background: `${c}12`, border: `1px solid ${c}40`, borderLeft: `3px solid ${c}`, borderRadius: 9, padding: "11px 12px", display: "flex", alignItems: "flex-start", gap: 7, fontSize: 12, color: JH.sub, lineHeight: 1.5 }}>
          <Sparkles size={12} color={c} style={{ marginTop: 2, flexShrink: 0 }} />
          <span>{alert.insight}</span>
        </div>
      </div>
    </div>
  );
}

export function TransactionBaselineMonitor({ alerts = TRANSACTION_BASELINE_ALERTS }: { alerts?: MonitorAlert[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: JH.text, margin: 0, display: "inline-flex", alignItems: "center", gap: 7 }}>
          <Sparkles size={16} color={JH.gold} /> Transaction Baseline Monitor
        </h2>
        <Pill color={JH.red}>Portfolio Alerts</Pill>
      </div>
      <p style={{ fontSize: 11.5, color: JH.muted, margin: 0, lineHeight: 1.5 }}>
        Live detection from transaction / summary data alone — the customer-voice join is kept separate in the &quot;Later&quot; card at the end.
      </p>
      <div style={{ display: "flex", width: "100%", minWidth: 0, gap: 14, overflowX: "auto", paddingBottom: 8, alignItems: "stretch" }}>
        {alerts.map((alert) => (
          <MonitorAlertCard key={alert.id} alert={alert} />
        ))}
      </div>
    </div>
  );
}

export function SubstrateFooter() {
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

/* ═════════════════════════ LiSN DIFFERENTIATOR (the join — visually gated) ═════════════════════════ */
/**
 * The transaction × voice/complaint join, rendered DISTINCT from the
 * transaction-only content: violet border, gold top-rule, inset background, and
 * a solid "LiSN ONLY" ribbon. Used to demote each drill's former voice hero
 * below the transaction-first content, and composed (full-width) into the
 * Overview's differentiator band. This is the Tier-3 upgrade path — present on
 * every screen, but concentrated so the "nobody else can do this" punch lands.
 */
export function LiSNDifferentiatorCard({
  title,
  subtitle,
  idTag,
  advisory = false,
  children,
}: {
  title: string;
  subtitle?: string;
  idTag?: string;
  advisory?: boolean;
  children: ReactNode;
}) {
  return (
    <section style={{ background: `${JH.violet}0c`, border: `1px solid ${JH.violet}55`, borderTop: `3px solid ${JH.gold}`, borderRadius: 12, padding: 14, display: "flex", flexDirection: "column", minWidth: 0, boxShadow: `0 0 0 1px ${JH.violet}14 inset` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <Sparkles size={13} color={JH.gold} />
            <span style={{ fontSize: 12.5, fontWeight: 800, color: JH.text, lineHeight: 1.3 }}>{title}</span>
            {idTag ? <span style={{ fontSize: 8.5, fontWeight: 800, color: JH.dim, fontFamily: "var(--mono), ui-monospace, monospace" }}>{idTag}</span> : null}
            {advisory ? <Pill color={JH.cyan}>advisory</Pill> : null}
          </div>
          {subtitle ? <div style={{ fontSize: 10.5, color: JH.muted, marginTop: 2, lineHeight: 1.45 }}>{subtitle}</div> : null}
        </div>
        <Pill color={JH.gold} solid>LiSN ONLY</Pill>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
      <div style={{ marginTop: 9, fontSize: 9.5, color: JH.dim, display: "inline-flex", alignItems: "center", gap: 5 }}>
        <span style={{ width: 6, height: 6, borderRadius: 999, background: JH.gold }} /> Transaction × customer-voice join — a view a self-built dashboard cannot produce. Tier-3 upgrade path.
      </div>
    </section>
  );
}

/* ═════════════════════════ A-CARD SIGNATURE CHARTS + NL HINTS ═════════════════════════ */

/* Offer incrementality — true lift vs a matched control; negative = cannibalised (kill) */
const OFFER_LIFT = [
  { o: "No-cost EMI", lift: -6 },
  { o: "5% fuel cashback", lift: -2 },
  { o: "Dining 10X", lift: 4 },
  { o: "Travel 2X", lift: 9 },
  { o: "Grocery flat", lift: 12 },
  { o: "UPI-on-CC", lift: 16 },
];
function OfferIncrementalityBar() {
  return (
    <SectionCard title="Offer incrementality vs control" subtitle="True lift over a matched control cohort (%) — negative = cannibalised spend, a kill candidate" accent={JH.cyan} aiPill right={<Pill color={JH.red}>2 kill</Pill>}>
      <div style={{ width: "100%", height: 270 }}>
        <ResponsiveContainer>
          <BarChart data={OFFER_LIFT} layout="vertical" margin={{ top: 4, right: 28, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={JH.borderInner} horizontal={false} />
            <XAxis type="number" stroke={JH.dim} fontSize={10} tickFormatter={(v) => `${v}%`} />
            <YAxis type="category" dataKey="o" stroke={JH.sub} fontSize={10.5} width={110} />
            <Tooltip contentStyle={TIP_STYLE} labelStyle={{ color: JH.text }} formatter={(v: number) => [`${v}% lift`, v < 0 ? "cannibalised" : "incremental"]} cursor={{ fill: `${JH.cyan}10` }} />
            <ReferenceLine x={0} stroke={JH.borderBtn} />
            <Bar dataKey="lift" radius={[0, 4, 4, 0]}>
              {OFFER_LIFT.map((r, i) => (
                <Cell key={i} fill={r.lift < 0 ? JH.red : r.lift < 6 ? JH.amber : `${JH.green}cc`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}

/* Yield & reward economics — interchange yield by network mix + reward-negative flag */
const YIELD_MIX: { net: string; idx: number; tone: string }[] = [
  { net: "Visa credit", idx: 100, tone: JH.green },
  { net: "Mastercard", idx: 97, tone: JH.green },
  { net: "RuPay card", idx: 71, tone: JH.amber },
  { net: "RuPay-on-UPI", idx: 38, tone: JH.red },
];
function YieldRewardCard() {
  return (
    <SectionCard title="Interchange yield by network mix" subtitle="Yield index vs Visa-credit = 100 · the RuPay-on-UPI shift compresses fee yield while GMV holds" accent={JH.cyan} aiPill right={<Pill color={JH.red}>reward-neg: +1 cat</Pill>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {YIELD_MIX.map((y) => (
          <div key={y.net} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.1fr) 1fr 46px", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: 11.5, color: JH.sub }}>{y.net}</span>
            <span style={{ height: 9, borderRadius: 5, background: JH.track, overflow: "hidden" }}>
              <span style={{ display: "block", height: "100%", width: `${y.idx}%`, background: y.tone, borderRadius: 5 }} />
            </span>
            <span style={{ textAlign: "right", fontSize: 11, fontWeight: 700, color: y.tone, fontFamily: "var(--mono), ui-monospace, monospace" }}>{y.idx}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12 }}>
        <AIInsightStrip>The mix shift to RuPay-on-UPI is eroding ~<strong style={{ color: JH.text }}>₹1.2 Cr</strong> interchange yield while GMV holds — invisible on a spend chart. One category is now reward-negative (interchange − reward − fraud &lt; 0).</AIInsightStrip>
      </div>
    </SectionCard>
  );
}

/* Natural-language query hints — the questions each screen is built to answer */
function NLQueryStrip({ queries, accent }: { queries: string[]; accent: string }) {
  return (
    <div style={{ background: JH.card, border: `1px solid ${JH.border}`, borderRadius: 12, padding: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
        <Sparkles size={13} color={accent} />
        <span style={{ fontSize: 12.5, fontWeight: 700, color: JH.text }}>Ask LiSN</span>
        <span style={{ fontSize: 10.5, color: JH.muted }}>— natural-language questions this screen answers</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {queries.map((q) => (
          <span key={q} style={{ fontSize: 11.5, color: JH.sub, background: JH.inset, border: `1px solid ${accent}33`, borderRadius: 999, padding: "5px 12px", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <ArrowRight size={11} color={accent} /> {q}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═════════════════════════ DRILL A — TRANSACTIONS & OFFERS (transaction-only) ═════════════════════════ */

const A_ROWS: SignalRow[] = [
  { id: "MA14", sev: "watch", signal: "Profitable-spend / premiumisation drift", cohort: "profitable spend", metric: "▼ vs GMV", impact: "₹1.5 Cr", route: "Head of Cards", action: "Open spend quality", recoverablePct: 55, cause: "Retained, profitable spend (net of reward and fraud) is decaying while gross GMV holds — the premiumisation-quality gap a GMV dashboard averages away." },
  { id: "MA4", sev: "watch", signal: "Offer incrementality & cannibalisation", cohort: "2,200+ offers", metric: "control-cohort", impact: "₹1.3 Cr", route: "Cards · Mktg", action: "Rank by incrementality", recoverablePct: 58, cause: "Separates genuine incremental spend from cannibalised spend across the live offer portfolio using a control-cohort method. Two offers run net-negative — kill candidates the gross-redemption view hides." },
  { id: "MA7", sev: "watch", signal: "Interchange / fee-yield leakage", cohort: "RuPay-UPI", metric: "yield ▼", impact: "₹1.2 Cr", route: "Cards · Finance", action: "Open yield view", recoverablePct: 45, cause: "Two leak paths: RuPay-UPI mix-compression eroding interchange yield, and reversal-as-dispute leakage. Fee-yield decaying while GMV holds — invisible on a spend chart." },
  { id: "MA8", sev: "watch", signal: "Reward-negative category anomaly", cohort: "+1 category", metric: "reward < 0", impact: "₹0.6 Cr", route: "Cards · Finance", action: "Flag category", feed: true, cause: "A spend category turns reward-negative — reward + fraud cost exceeds interchange — the long-tail margin leak a blended reward P&L hides. Needs reward + fraud allocation by category." },
  { id: "MA15", sev: "watch", signal: "Spend-velocity shock by cell", cohort: "3 cells", metric: "± vs base", impact: "—", route: "Head of Cards", action: "Open velocity", cause: "Spend velocity in three product×cohort cells breaks its own seasonal band — two drops (drift / issue) and one spike (opportunity / fraud-adjacent), each judged against the cell's baseline, not a portfolio average." },
];

const A_INSIGHTS: WallInsight[] = [
  { sev: "watch", title: "Two offers cost more than they create — kill candidates", body: "No-cost EMI and 5% fuel run net-negative vs a matched control: gross redemption masks cannibalised spend. ₹1.3 Cr reallocatable." },
  { sev: "watch", title: "RuPay-on-UPI shift is compressing interchange yield", body: "Fee-yield down ~₹1.2 Cr while GMV holds — a mix-compression + reversal-as-dispute leak invisible on a spend chart." },
  { sev: "watch", title: "Profitable spend is drifting below GMV", body: "Retained spend net of reward and fraud decays while gross GMV holds — the premiumisation-quality gap, ₹1.5 Cr." },
  { sev: "watch", title: "One category turned reward-negative this month", body: "Interchange − reward − fraud < 0 on a long-tail category — the margin leak a blended reward P&L hides." },
  { sev: "watch", title: "Spend velocity broke its band in 3 cells", body: "Two drops (drift/issue) and one spike (opportunity), each judged against the cell's own seasonal base — not a portfolio average." },
];

const A_QUERIES = [
  "Which cohorts are not growing this week, and why?",
  "Show offers where cost is rising faster than incremental spend.",
  "Which categories turned reward-negative this month?",
  "Where is the RuPay-UPI shift compressing my interchange yield?",
  "Is yesterday's spike real, or just three merchants?",
];

export function CardsTransactionsOffersDrill({ onBack }: { onBack: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <DrillPageHeader
        onBack={onBack}
        accent={JH.cyan}
        title="How are my transactions & offers doing?"
        sub="Transaction-only — spend, offers, yield and reward economics judged against each cell's own seasonal baseline. ✨ marks every AI-derived read. The customer-voice join is the LiSN-only layer at the bottom."
      />
      <HeadshotRow insights={A_INSIGHTS} left={<OfferIncrementalityBar />} />
      <YieldRewardCard />
      <RecoveryWorklist
        rows={A_ROWS}
        title="Offers & yield worklist"
        subtitle={`${A_ROWS.length} transaction & offer signals · bar = incremental / profitable share (green) vs leak · ranked by ₹ in play`}
        accent={JH.cyan}
        barHeader="Incremental vs leak"
      />
      <LiSNDifferentiatorCard
        title="Offer → mis-selling complaint echo"
        subtitle="The gated join — an offer that converts on the spend dashboard but triggers an MITC-disclosure complaint echo within 48h"
        idTag="MB6"
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
          <Num v="×3.5" c={JH.amber} s={22} />
          <span style={{ fontSize: 11.5, color: JH.muted }}>complaint echo within 48h of the No-cost EMI push</span>
        </div>
        <AIInsightStrip>Hold wave 2 until the MITC disclosure is fixed — the conversion is real but the complaint fallout lands two days later, routed to <strong style={{ color: JH.text }}>Cards · Conduct</strong>.</AIInsightStrip>
      </LiSNDifferentiatorCard>
      <NLQueryStrip queries={A_QUERIES} accent={JH.cyan} />
      <SubstrateFooter />
    </div>
  );
}

/* ═════════════════════════ DRILL B — BLOCKERS & PROBLEMS (transaction-only) ═════════════════════════ */

const B_ROWS: SignalRow[] = [
  { id: "MA1", sev: "critical", signal: "Curable-decline recovery", cohort: "PREM HNI · CNP", metric: "62% curable", delta: "+38%", deltaTone: "bad", impact: "₹2.4 Cr", route: "Head of Cards", action: "Review nudge draft", recoverablePct: 62, cause: "Insufficient-funds + soft declines run 38% above the cohort's own month-end band — curable, not structural. EMI-conversion nudge drafted to the eligible HNI sub-segment." },
  { id: "MA2", sev: "watch", signal: "Fraud-rule approval step-change", cohort: "Rule R-77", metric: "−13 pts", delta: "post-rule", deltaTone: "bad", impact: "—", route: "Head of Fraud", action: "Open rule diff", feed: true, cause: "Change-point detection on the approval rate right after a fraud-rule edit — a clean step-down, not a noisy dip. The over-block signal before the voice join confirms it." },
  { id: "MA13", sev: "watch", signal: "Tokenised vs non-tokenised approval-gap", cohort: "tok vs non-tok", metric: "approval gap", impact: "—", route: "Ops · Risk", action: "Open token gap", feed: true, cause: "Isolates a token-lifecycle/ACS misconfiguration the blended approval rate hides — economically large at ~98% CoFT penetration. Tokenised CNP approving below non-tokenised on one path." },
  { id: "MA9", sev: "watch", signal: "Activation-decay vs 30+7 closure clock", cohort: "Batch #4471", metric: "58% vs 71%", delta: "D37", deltaTone: "bad", impact: "₹93 L CAC", route: "Cards · Tech", action: "Send flow fix", obligation: true, cause: "18,000 co-brand cards activate at day-20 at 58% vs a 71% baseline. 'Can't set PIN' points to a broken flow — fix it and force-closures fall to ~900 before the RBI 30+7 deadline." },
  { id: "MA3", sev: "watch", signal: "Switch / token-CoFT attribution", cohort: "2 routes", metric: "issuer-side", impact: "—", route: "Ops · Tech", action: "Open attribution", cause: "Transaction-side attribution isolates which switch/processor route and token/CoFT step drives a decline cluster. Ranks by recoverable spend." },
  { id: "MA5", sev: "watch", signal: "Early roll-rate inflection by vintage", cohort: "Vintage Q2-24", metric: "+9 bps", delta: "above band", deltaTone: "bad", impact: "—", route: "Risk · Collections", action: "Prioritise cohort", cause: "A sourcing vintage's 0→30 migration inflects above its own seasonal band — flagged before the portfolio-level roll-rate confirms it. Concentrate collections capacity here now." },
  { id: "MA16", sev: "watch", signal: "Limit-exhaustion clusters (good vs stressed)", cohort: "2 cohorts", metric: "split", impact: "—", route: "Risk · Cards", action: "Split good vs stressed", cause: "Limit-exhaustion clusters separated into 'good customer hitting limit' (limit-increase opportunity) vs 'stressed customer maxed out' (early risk) by utilisation trend — the blended limit-hit rate hides both." },
  { id: "MA17", sev: "watch", signal: "Utilisation-band migration surge", cohort: "+1 band", metric: "leads roll", impact: "—", route: "Risk · Collections", action: "Open migration", cause: "A surge of customers crossing into high-utilisation bands leads the 0→30 roll by weeks — an early-risk lead indicator before delinquency forms on the book." },
  { id: "MB15", sev: "watch", signal: "Co-brand / aggregator diagnostic", cohort: "1 partner", metric: "decline cluster", impact: "—", route: "Co-brand · Ops", action: "Open partner view", feed: true, cause: "Localises a decline cluster to a single co-brand partner/aggregator via the auth/fraud-logs ↔ merchant-systems join — among the hardest and most manual in India's fragmented ecosystem." },
];

const B_INSIGHTS: WallInsight[] = [
  { sev: "critical", title: "Today's decline spike is token, not behaviour", body: "Decline taxonomy splits the spike into tech / limit / fraud-rule / token: a CoFT re-tokenisation break drives it. ₹2.4 Cr at risk, 62% curable today." },
  { sev: "watch", title: "Fraud-rule R-77 stepped approval down 13 pts", body: "A clean change-point right after the rule edit — over-block, not noise. Open the rule diff and recommend rollback." },
  { sev: "watch", title: "Tokenised CNP is approving below non-tokenised", body: "A gap the blended approval rate hides entirely — economically large at ~98% CoFT penetration. One path mis-configured." },
  { sev: "watch", title: "Batch #4471 will strand ₹93 L CAC on the 30+7 clock", body: "Activation 13 pts below baseline; ~6,200 cards projected unactivated at day-37. Obligation route — fixable onboarding flow." },
  { sev: "watch", title: "Utilisation migration surge leads the roll", body: "Q2-24 vintage 0→30 inflects above its own band as customers cross into high-utilisation — weeks before the book confirms." },
];

const B_QUERIES = [
  "Of today's decline spike, how much is tech vs limit vs fraud-rule vs token?",
  "Which BIN's approval rate stepped down after the last rule change?",
  "Show cohorts crossing high-utilisation this week.",
  "Which sourcing vintage's 0→30 roll is above its own band?",
  "Which onboarding batch will breach the 30+7 closure deadline, and how much CAC is at stake?",
];

export function CardsBlockersProblemsDrill({ onBack }: { onBack: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <DrillPageHeader
        onBack={onBack}
        accent={JH.amber}
        title="Where are my blockers & problems today?"
        sub="Transaction-only — decline quality, fraud-rule misfires, token gaps, roll inflection and the regulatory closure clocks, severity-ranked and routed. The customer-voice confirmation is the LiSN-only layer at the bottom."
      />
      <HeadshotRow insights={B_INSIGHTS} left={<DeclineHeatmap />} />
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)", gap: 12, alignItems: "stretch" }}>
        <RecoverableByCohortBar />
        <RollByVintageBar />
      </div>
      <SectionCard title="Activation-decay vs RBI 30+7 closure clock" subtitle="Batch #4471 · activation curve vs baseline with the day-37 force-closure line" accent={JH.amber} aiPill right={<div style={{ display: "flex", gap: 6 }}><Pill color={JH.gold} solid>obligation</Pill><Pill color={JH.dim}>MA9</Pill></div>}>
        <ActivationDecayCurve />
        <div style={{ marginTop: 10 }}>
          <AIInsightStrip tone={JH.amber}>~6,200 cards projected unactivated at day-37 — <strong style={{ color: JH.text }}>₹93 L CAC</strong> at risk. 'Can't set PIN' points to a fixable flow; fix it and force-closures fall to ~900.</AIInsightStrip>
        </div>
      </SectionCard>
      <RegulatoryClocks />
      <RecoveryWorklist
        rows={B_ROWS}
        title="Blockers worklist"
        subtitle={`${B_ROWS.length} transaction-side blockers · bar = share recoverable today (green) vs structural · ranked by ₹ in play`}
        accent={JH.amber}
      />
      <LiSNDifferentiatorCard
        title="Are these blockers something customers actually feel?"
        subtitle="The gated join — decline-spike ↔ 'payment-failed' voice on one timeline, so cause + recoverable ₹ arrive with the alert"
        idTag="MB1 · MB2"
      >
        <DeclineVoiceDualCurve />
        <div style={{ marginTop: 10 }}>
          <AIInsightStrip>Cause: <strong style={{ color: JH.text }}>CoFT re-tokenisation break</strong> at 11:00 — not behaviour, not fraud. The same join confirms fraud-rule R-77 over-block via 'card blocked' voice within 2h, before any fraud KPI moves.</AIInsightStrip>
        </div>
      </LiSNDifferentiatorCard>
      <NLQueryStrip queries={B_QUERIES} accent={JH.amber} />
      <SubstrateFooter />
    </div>
  );
}

/* ═════════════════════════ DRILL C — TRANSACTION × VOICE JOIN (LiSN ONLY) ═════════════════════════ */

/* Predictive joins — voice leads the book (lead-time ladder) */
const C_LADDER_ROWS: SignalRow[] = [
  { id: "MB4", sev: "advisory", signal: "Hardship-language → roll-rate predictor", cohort: "Vintage Q2-24", metric: "1.9× hardship", impact: "—", route: "Risk · Collections", action: "Draft fair-offer", advisory: true, lead: { label: "~2 wks", pct: 70 }, cause: "Hardship language leads the 0→30 roll the bureau EWS flags ~2 weeks later. Advisory, fair-offer only — genuine-hardship split from strategic-non-payment, never a risk action against the customer." },
  { id: "MB2", sev: "critical", signal: "Fraud-rule misfire, voice-confirmed", cohort: "Rule R-77", metric: "blocked ×3", delta: "80% 3+yr", deltaTone: "bad", impact: "80% 3+yr", route: "Head of Fraud", action: "Recommend rollback", feed: true, obligation: true, lead: { label: "< 2h", pct: 14 }, cause: "Within two hours of R-77, 'card blocked at [merchant]' tripled — 80% from 3+-year customers with rising switch-intent — before the fraud KPI moved. Same-morning detect-to-rollback." },
  { id: "MB10", sev: "watch", signal: "Co-brand churn ↔ switch-intent voice", cohort: "Co-brand X", metric: "spend −22%", delta: "switch ×3", deltaTone: "bad", impact: "₹18 Cr", route: "Co-brand mgr", action: "Draft retention", lead: { label: "weeks", pct: 60 }, cause: "Spend fell 22% over three cycles while 'how do I switch / close this card' chatter tripled after a competitor launch — attrition, not merchant softness. Retention drafted before closures register." },
  { id: "MB7", sev: "watch", signal: "Switch incident ↔ voice true-impact", cohort: "Route P-3 (in-SLA)", metric: "calls ×5", delta: "~14k", deltaTone: "bad", impact: "₹68–70L/hr", route: "Ops · Comms", action: "Draft customer comms", lead: { label: "now", pct: 40 }, cause: "A processor route reads green but 'payment failing' contacts rose 5× and app-store reviews dipped. The voice side quantifies the human impact the health dashboard hides." },
  { id: "MB8", sev: "watch", signal: "Token/CoFT breakage ↔ voice (recurring)", cohort: "Subs cohort", metric: "auto-pay fail", impact: "—", route: "Ops · Tech", action: "Open recurring view", feed: true, lead: { label: "pre-metric", pct: 35 }, cause: "Recurring/subscription token (CoFT) breakage joined to 'subscription declined / auto-pay failed' voice — the recurring-payment failure customers feel before the metric moves." },
  { id: "MB11", sev: "watch", signal: "Fraud-rule misfire × social-media surge", cohort: "viral", metric: "blast radius", impact: "—", route: "Risk · Conduct", action: "Open blast radius", lead: { label: "viral 24h", pct: 30 }, cause: "Attributes a viral / app-store reputational surge to a specific internal rule edit and quantifies the blast radius — a coordinated comms + revert decision." },
  { id: "MB13", sev: "watch", signal: "App-release-defect impact pack", cohort: "v3.2", metric: "journey break", impact: "—", route: "Tech · Comms", action: "Open release pack", feed: true, lead: { label: "release", pct: 25 }, cause: "Ties a named app version to card-journey breakage via app-store/complaint text — release dashboards show crash/adoption, not journey breakage. v3.2 correlates with a 'can't add card / pay' spike." },
];

/* Regulatory / obligation joins — complaint cluster × clause / clock (case board) */
const C_BOARD_ROWS: SignalRow[] = [
  { id: "MB5", sev: "critical", signal: "Ombudsman-escalation pre-empt", cohort: "Q-07 queue", metric: "4 cases", delta: "30-day IO", deltaTone: "bad", impact: "—", route: "Conduct · Compliance", action: "Re-open 4 cases", clause: "30-day IO", cause: "Complaint cluster × transaction root cause × the 30-day IO decision clock — 'incorrect late fee' tripled on one co-brand, root-caused to a billing-cycle misconfiguration concentrated in queue Q-07. Resolve before the window closes." },
  { id: "MB3", sev: "critical", signal: "Weak-authentication liability cluster", cohort: "Path M-12 · CNP", metric: "47 auths", delta: "31 cmpl", deltaTone: "bad", impact: "₹6–9 L", route: "Compliance", action: "Route to Compliance", feed: true, obligation: true, clause: "Auth Dir 2025", cause: "47 CNP authorisations missing a completed dynamic factor on one merchant path, joined to 31 'money taken, no OTP' complaints. Auth Directions 2025 domestic 2FA is in force — the issuer carries full-compensation liability now." },
  { id: "MB14", sev: "critical", signal: "Dispute-before-CIC-reporting breach", cohort: "CIC queue", metric: "imminent", delta: "RBI breach", deltaTone: "bad", impact: "—", route: "Collections · Compliance", action: "Hold CIC report", feed: true, obligation: true, clause: "CIC breach", cause: "Joins an active customer-asserted dispute to an imminent CIC default-reporting event — the exact RBI breach (disputes must settle before bureau reporting)." },
  { id: "MB12", sev: "watch", signal: "Cross-border CNP friction & liability", cohort: "1 corridor", metric: "co-move", delta: "1 Oct 2026", deltaTone: "bad", impact: "—", route: "Risk · Compliance", action: "Flag corridor", feed: true, obligation: true, clause: "1 Oct 2026", cause: "Cross-border CNP declines co-move with 'declined abroad / OTP failed' complaints on one corridor — a CX-friction fix and an emerging weak-auth exposure ahead of the 1 Oct 2026 validation + BIN-registration deadline." },
  { id: "MB6", sev: "watch", signal: "Offer → mis-selling complaint echo", cohort: "No-cost EMI", metric: "cmpl ×3.5", delta: "48h", deltaTone: "bad", impact: "MITC", route: "Cards · Conduct", action: "Hold wave 2", feed: true, clause: "MITC 48h", cause: "An offer converts on the spend dashboard but triggers an MITC-disclosure complaint echo within 48h. Catch the fallout before the second wave sends." },
  { id: "MB9", sev: "watch", signal: "Double-debit / reversal-failure ↔ voice", cohort: "reversal-fail", metric: "charged ×2", impact: "—", route: "Ops · Conduct", action: "Open reversal cases", clause: "reversal", cause: "Double-debit / failed-reversal transactions joined to 'charged twice / money not returned' voice — the operational grievance that drives repeat contacts and IO escalation." },
  { id: "MB17", sev: "advisory", signal: "Fair-treatment / disparate-treatment scan", cohort: "cohort parity", metric: "outcome gap", impact: "—", route: "Conduct · Compliance", action: "Open parity scan", advisory: true, clause: "parity", cause: "Detects abnormal grievance-handling/outcome gaps across cohorts/geographies — a fairness analogue no transaction tool or sampling QA can produce. Cohort-level and advisory given false-positive risk." },
];

const C_INSIGHTS: WallInsight[] = [
  { sev: "critical", title: "These declines are something customers actually feel", body: "Decline 8%→26% with a 4× 'payment failed' voice spike on one timeline — a CoFT re-tokenisation break. Cause + ₹2.4 Cr recoverable arrive with the alert (MB1)." },
  { sev: "critical", title: "Fraud-rule misfire confirmed by voice within 2h", body: "'Card blocked' contacts tripled — 80% from 3+-year customers — before any fraud KPI moved. Same-morning detect-to-rollback (MB2)." },
  { sev: "critical", title: "Four late-fee cases are inside the 30-day IO clock", body: "Complaint cluster × billing-cycle root cause × the IO decision clock — re-open and brief Q-07 before the window closes (MB5)." },
  { sev: "watch", title: "Co-brand X spend-drop is attrition, not merchant softness", body: "Spend −22% as switch-intent chatter tripled after a competitor launch — ₹18 Cr at risk, weeks before closures register (MB10)." },
  { sev: "advisory", title: "Hardship language leads the 0→30 roll by ~2 weeks", body: "Up 1.9× in vintage Q2-24 ahead of the bureau EWS. Advisory, fair-offer only — never a risk action against the customer (MB4)." },
];

const C_QUERIES = [
  "Is this decline spike something customers are actually feeling?",
  "Which complaint themes are emerging before they show in case counts?",
  "Where is hardship-language rising ahead of the roll-rate?",
  "Which co-brand's spend drop is attrition vs merchant softness?",
  "Which complaint clusters are inside the 30-day IO window right now?",
];

export function CardsVoiceJoinDrill({ onBack }: { onBack: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <DrillPageHeader
        onBack={onBack}
        accent={JH.violet}
        title="Transaction × voice — the join nobody else makes"
        sub="LiSN ONLY — transaction analytics and complaint/voice systems are separate stacks, so this join is essentially never made in production. Cause + recoverable ₹ arrive with the alert. Advisory items are fair-offer only, never a risk action against the customer."
      />
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", background: `${JH.violet}0f`, border: `1px solid ${JH.violet}55`, borderLeft: `3px solid ${JH.gold}`, borderRadius: 10, padding: "9px 13px" }}>
        <Pill color={JH.gold} solid>LiSN ONLY</Pill>
        <span style={{ fontSize: 11.5, color: JH.sub, lineHeight: 1.5, flex: "1 1 320px" }}>Every signal below joins a transaction event to the customer-voice / complaint corpus — the wedge no self-built dashboard can reproduce.</span>
        <Pill color={JH.violet}>MB1 · MB2 · MB4 · MB5 · MB10</Pill>
      </div>
      <HeadshotRow
        insights={C_INSIGHTS}
        left={
          <SectionCard title="Decline-spike ↔ customer-voice, one timeline" subtitle="Both curves together — the cause and the recoverable rupees arrive with the alert" accent={JH.violet} aiPill right={<Pill color={JH.gold} solid>HERO · MB1</Pill>}>
            <DeclineVoiceDualCurve />
            <div style={{ marginTop: 10 }}>
              <AIInsightStrip>Cause: <strong style={{ color: JH.text }}>CoFT re-tokenisation break</strong> at 11:00 — not behaviour, not fraud. ₹2.4 Cr attempted spend at risk on PREM 25–34 HNI; 62% curable.</AIInsightStrip>
            </div>
          </SectionCard>
        }
      />
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 12, alignItems: "stretch" }}>
        <SectionCard title="Hardship-language → roll-rate predictor" subtitle="Credit cost forms in the voice corpus weeks before the book" accent={JH.violet} aiPill right={<div style={{ display: "flex", gap: 6 }}><Pill color={JH.cyan}>advisory</Pill><Pill color={JH.dim}>MB4</Pill></div>}>
          <HardshipRollCurve />
          <div style={{ marginTop: 10 }}>
            <AIInsightStrip tone={JH.cyan}>Advisory only — no credit decisioning. Genuine-hardship is split from strategic-non-payment for <strong style={{ color: JH.text }}>fair, early support</strong>; cohort-level, human-approved.</AIInsightStrip>
          </div>
        </SectionCard>
        <FraudMisfireBlastCard />
      </div>
      <EarlyWarningLadder rows={C_LADDER_ROWS} />
      <ConductCaseBoard
        rows={C_BOARD_ROWS}
        title="Regulatory & conduct join board"
        subtitle={`${C_BOARD_ROWS.length} complaint × transaction signals grouped by severity · obligation paths and clause / clock tagged · owner-routed`}
        accent={JH.violet}
      />
      <NLQueryStrip queries={C_QUERIES} accent={JH.violet} />
      <SubstrateFooter />
    </div>
  );
}
