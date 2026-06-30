"use client";

/**
 * LiSN — Cards Portfolio Manager (v2).
 *
 * Modelled on CreditCardsV3DrillDownScreens grammar: each drill has its OWN signature body
 * (no repeated "baseline signals" block). Shared primitives only: SectionCard (✨ AI pill),
 * AIInsightStrip, Mono, route/brand pills. JH near-black palette.
 *
 *   Overview        → Executive Pulse + 3 question cards (2 drilldown routes)
 *   Drill 1 Offers  → Command Center + AI Wall + LeakPanel + deep matrix / decision board / economics / cohort / action queue
 *   Drill 2 Blockers    → Command Center + decline heatmap + incident pack + trouble tickets + action queue
 */

import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  CreditCard,
  Info,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  TriangleAlert,
  Users,
  Zap,
} from "lucide-react";
import { RoleBasedUnifiedChrome } from "@/components/role-based-dashboard/RoleBasedUnifiedChrome";
import {
  CARDS_PORTFOLIO_V2_AI_ANALYST_QUESTIONS,
  CARDS_PORTFOLIO_V2_AI_ANALYST_SUBTITLE,
  generateCardsPortfolioV2AIResponse,
} from "@/lib/role-based-dashboard/cardsPortfolioV2Data";
import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/* ───────────── theme (JH) ───────────── */
const T = {
  bg: "#0d0d0d",
  card: "#0d0d0d",
  row: "#151515",
  inset: "#1a1a1a",
  track: "#1f1f1f",
  border: "#1f1f1f",
  inner: "#2a2a2a",
  btn: "#393939",
  text: "#ffffff",
  sub: "#d6d9d8",
  muted: "#939394",
  dim: "#7e7f80",
  red: "#ef4444",
  amber: "#f59e0b",
  green: "#22c55e",
  yellow: "#eab308",
  cyan: "#38bdf8",
  violet: "#8b5cf6",
  blue: "#5332ff",
  gold: "#eab308",
};
const MONO = "var(--mono), ui-monospace, SFMono-Regular, Menlo, monospace";
const TIP: CSSProperties = {
  background: T.row,
  border: `1px solid ${T.btn}`,
  borderRadius: 8,
  fontSize: 11,
  color: T.sub,
};
const TONE_MAP: Record<string, string> = {
  red: T.red,
  amber: T.amber,
  gold: T.gold,
  yellow: T.yellow,
  green: T.green,
  cyan: T.cyan,
  violet: T.violet,
  blue: T.blue,
  purple: T.violet,
};
const tone = (k: string): string => TONE_MAP[k] || T.gold;
const BRAND: Record<string, string> = {
  travel: T.violet,
  cashback: T.green,
  fuel: T.amber,
  biz: T.cyan,
};
const ROUTE: Record<string, { l: string; c: string }> = {
  ops: { l: "Ops / Risk", c: T.cyan },
  risk: { l: "Risk", c: T.amber },
  mktg: { l: "Marketing", c: T.yellow },
  cards: { l: "Head of Cards", c: T.green },
  conduct: { l: "Conduct", c: T.violet },
  fin: { l: "Finance", c: T.blue },
  fraud: { l: "Fraud", c: T.red },
};
const LEVEL: Record<string, string> = {
  CRITICAL: T.red,
  ALERT: "#f97316",
  WARNING: T.yellow,
  INFO: T.green,
  OBLIGATION: T.amber,
};

/* ───────────── data types ───────────── */
type TrendPoint = { v: number };
type AiRow = {
  id: string;
  level: string;
  tag: string;
  title: string;
  body: string;
  metric: string;
  delta: string;
  icon: LucideIcon;
  root: string;
  areas: string[];
  actions: string[];
  owner: string;
  priority: string;
};
type Offer = {
  id: string;
  name: string;
  leak: number;
  d: string;
  redemption: string;
  lift: string;
  cost: string;
  leakage: string;
  control: string;
  insight: string;
  rec: string;
  cats: string[];
};

/* ───────────── primitives (match V3) ───────────── */
const Mono = ({
  children,
  c = T.text,
  s = 14,
}: {
  children: ReactNode;
  c?: string;
  s?: number;
}) => (
  <span style={{ fontFamily: MONO, fontWeight: 700, color: c, fontSize: s }}>
    {children}
  </span>
);
const Eyebrow = ({
  children,
  c = T.muted,
}: {
  children: ReactNode;
  c?: string;
}) => (
  <div
    style={{
      fontSize: 9,
      fontWeight: 800,
      letterSpacing: ".08em",
      textTransform: "uppercase",
      color: c,
    }}
  >
    {children}
  </div>
);
const Dot = ({ c, sq }: { c: string; sq?: boolean }) => (
  <span
    style={{
      width: 8,
      height: 8,
      borderRadius: sq ? 2 : 999,
      background: c,
      flexShrink: 0,
      display: "inline-block",
    }}
  />
);

function SectionCard({
  title,
  subtitle,
  accent,
  aiPill,
  right,
  children,
  style,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  accent?: string;
  aiPill?: boolean;
  right?: ReactNode;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <section
      style={{
        background: T.card,
        border: `1px solid ${T.border}`,
        borderTop: accent ? `3px solid ${accent}` : `1px solid ${T.border}`,
        borderRadius: 12,
        padding: 14,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 8,
          marginBottom: 10,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>
              {title}
            </span>
            {aiPill && (
              <span
                style={{
                  background: `${T.gold}20`,
                  color: T.gold,
                  fontSize: 8.5,
                  fontWeight: 800,
                  letterSpacing: ".5px",
                  padding: "1px 6px",
                  borderRadius: 4,
                }}
              >
                ✨ AI
              </span>
            )}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: 10.5,
                color: T.muted,
                marginTop: 2,
                lineHeight: 1.45,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
        {right}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </section>
  );
}
function AIInsightStrip({
  children,
  tone: tn = "gold",
}: {
  children: ReactNode;
  tone?: string;
}) {
  const c = tone(tn);
  return (
    <div
      style={{
        background: `${c}10`,
        border: `1px solid ${c}40`,
        borderLeft: `3px solid ${c}`,
        borderRadius: 8,
        padding: "8px 10px",
        display: "flex",
        alignItems: "flex-start",
        gap: 7,
        fontSize: 11.5,
        color: T.sub,
        lineHeight: 1.5,
      }}
    >
      <Sparkles size={12} color={c} style={{ marginTop: 2, flexShrink: 0 }} />
      <span>{children}</span>
    </div>
  );
}
function Pill({
  children,
  t = "gold",
  solid,
}: {
  children: ReactNode;
  t?: string;
  solid?: boolean;
}) {
  const c = tone(t);
  return (
    <span
      style={{
        fontSize: 9,
        fontWeight: 800,
        letterSpacing: ".05em",
        textTransform: "uppercase",
        padding: "2px 7px",
        borderRadius: 4,
        whiteSpace: "nowrap",
        color: solid ? "#0d0d0d" : c,
        background: solid ? c : `${c}1c`,
        border: solid ? "none" : `1px solid ${c}44`,
      }}
    >
      {children}
    </span>
  );
}
function Chip({ children, t = "muted" }: { children: ReactNode; t?: string }) {
  const c = t === "muted" ? T.muted : tone(t);
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: ".04em",
        textTransform: "uppercase",
        padding: "5px 9px",
        borderRadius: 999,
        color: c,
        background: `${c}14`,
        border: `1px solid ${c}3a`,
      }}
    >
      {children}
    </span>
  );
}
function RouteChip({ r }: { r: string }) {
  const m = ROUTE[r];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 10.5,
        fontWeight: 700,
        color: m.c,
      }}
    >
      <ArrowRight size={11} />
      {m.l}
    </span>
  );
}
function BrandPill({ k, children }: { k: string; children: ReactNode }) {
  const c = BRAND[k];
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        color: c,
        background: `${c}18`,
        border: `1px solid ${c}40`,
        borderRadius: 999,
        padding: "2px 8px",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

/* ───────────── shared chrome ───────────── */
function TopBar() {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 21, fontWeight: 900, letterSpacing: "-.02em" }}>
        Cards Portfolio Manager{" "}
        <span style={{ color: T.dim, fontWeight: 600, fontSize: 14 }}>
          · Suvarna Bank
        </span>
      </div>
      <div style={{ color: T.muted, fontSize: 12.5, marginTop: 2 }}>
        Transactions first · blocker intelligence second
      </div>
    </div>
  );
}
function DrillHeader({
  title,
  sub,
  chips,
  onBack,
}: {
  title: ReactNode;
  sub: ReactNode;
  chips?: ReactNode;
  onBack: () => void;
}) {
  return (
    <>
      <button
        type="button"
        onClick={onBack}
        style={{
          background: T.row,
          border: `1px solid ${T.btn}`,
          color: T.sub,
          borderRadius: 10,
          padding: "8px 15px",
          fontWeight: 600,
          fontSize: 14,
          margin: "2px 0 14px",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <ArrowLeft size={16} /> Back to Overview
      </button>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 14,
        }}
      >
        <div style={{ minWidth: 260 }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: "-.3px",
              lineHeight: 1.2,
            }}
          >
            {title}
          </div>
          <div
            style={{
              color: T.sub,
              fontSize: 15,
              marginTop: 4,
              maxWidth: 880,
              lineHeight: 1.5,
            }}
          >
            {sub}
          </div>
        </div>
        {chips ? (
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            {chips}
          </div>
        ) : null}
      </div>
    </>
  );
}
function NLRow({
  queries,
  t = "gold",
}: {
  queries: [string, string][];
  t?: string;
}) {
  const c = tone(t);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
        gap: 9,
      }}
    >
      {queries.map((q) => (
        <div
          key={q[0]}
          style={{
            background: T.inset,
            border: `1px solid ${T.inner}`,
            borderRadius: 9,
            padding: "10px 11px",
            fontSize: 12.5,
            color: T.sub,
            lineHeight: 1.35,
          }}
        >
          <b style={{ color: c }}>{q[0]}</b> · {q[1]}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════ OVERVIEW ═══════════════════ */
const TREND: { g: TrendPoint[]; r: TrendPoint[]; v: TrendPoint[] } = {
  g: [{ v: 58 }, { v: 60 }, { v: 56 }, { v: 40 }, { v: 30 }, { v: 22 }],
  r: [{ v: 72 }, { v: 60 }, { v: 50 }, { v: 38 }, { v: 28 }, { v: 24 }],
  v: [{ v: 20 }, { v: 30 }, { v: 48 }, { v: 62 }, { v: 78 }, { v: 92 }],
};

const EXEC_PULSE = [
  {
    label: "1. 🔴 What's critical",
    text: "Tokenised CNP approval gap widened since 11:00 — ₹2.4 Cr at risk. Route fix to Ops / Risk.",
  },
  {
    label: "2. 🎯 Where's your focus",
    text: "Offer O-142 is leaking ₹78L; fraud-rule R-77 stepped approval down 13 pts.",
  },
  {
    label: "3. 🟢 What's stable / on-track",
    text: "62% of today's decline spike is curable; Cashback Plus growth remains healthy.",
  },
];

function MiniSpark({ data, c, h = 52 }: { data: TrendPoint[]; c: string; h?: number }) {
  return (
    <div style={{ height: h, minWidth: 0 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 4, right: 2, left: 2, bottom: 0 }}>
          <Line type="monotone" dataKey="v" stroke={c} strokeWidth={2.4} dot={false} isAnimationActive={false} />
          <YAxis hide domain={["dataMin", "dataMax"]} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function MiniGauge({
  label,
  topLabel,
  value,
  color,
  suffix = "%",
}: {
  label: string;
  topLabel?: string;
  value: number;
  color: string;
  suffix?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 9, color: T.muted, textTransform: "uppercase", letterSpacing: 0.4, textAlign: "center" }}>
        {topLabel ?? label}
      </div>
      <div style={{ position: "relative", width: "100%", height: 48 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={[{ name: label, value: clamped, fill: color }]}
            startAngle={180}
            endAngle={0}
            innerRadius={28}
            outerRadius={40}
            cx="50%"
            cy="100%"
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
            <RadialBar dataKey="value" cornerRadius={4} background={{ fill: `${T.inner}90` }} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div style={{ position: "absolute", left: "50%", bottom: 2, transform: "translateX(-50%)", fontFamily: MONO, fontSize: 11, fontWeight: 800, color }}>
          {clamped}
          {suffix}
        </div>
      </div>
      {topLabel ? (
        <div style={{ fontSize: 8.5, color: T.dim, textTransform: "uppercase", marginTop: -2 }}>{label}</div>
      ) : null}
    </div>
  );
}

function MiniBars({ bars }: { bars: { name: string; v: number; c: string }[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: 1, minWidth: 0, justifyContent: "center" }}>
      {bars.map((b) => (
        <div key={b.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 9, color: T.muted, width: 72, flexShrink: 0 }}>{b.name}</span>
          <div style={{ flex: 1, height: 6, borderRadius: 3, background: T.track }}>
            <div style={{ height: "100%", width: `${b.v}%`, background: b.c, borderRadius: 3 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ExecutivePulse() {
  return (
    <section style={{ background: T.row, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
        <Sparkles size={13} color={T.gold} />
        <span style={{ fontSize: 11, fontWeight: 800, color: T.gold, letterSpacing: ".08em", textTransform: "uppercase" }}>
          Executive Pulse
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 8 }}>
        {EXEC_PULSE.map((p) => (
          <div key={p.label} style={{ background: T.inset, border: `1px solid ${T.inner}`, borderRadius: 8, padding: "10px 11px" }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: T.sub, marginBottom: 5 }}>{p.label}</div>
            <div style={{ fontSize: 11.5, color: T.sub, lineHeight: 1.45 }}>{p.text}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ExecutiveQuestionCard({
  accent,
  iTone,
  icon,
  title,
  subtitle,
  score,
  delta,
  trend,
  trendColor,
  visualType,
  gauges,
  bars,
  miniMetrics,
  aiText,
  cta,
  chip,
  onClick,
}: {
  accent: string;
  iTone: string;
  icon: ReactNode;
  title: string;
  subtitle: string;
  score: string;
  delta: string;
  trend: TrendPoint[];
  trendColor: string;
  visualType: "gauges" | "bars";
  gauges?: { label: string; topLabel?: string; value: number; color: string }[];
  bars?: { name: string; v: number; c: string }[];
  miniMetrics: [string, string, string][];
  aiText: string;
  cta: string;
  chip?: string;
  onClick: () => void;
}) {
  const a = tone(accent);
  return (
    <button
      type="button"
      className="bigcard"
      onClick={onClick}
      style={{
        textAlign: "left",
        font: "inherit",
        width: "100%",
        background: `linear-gradient(180deg,${a}0e,${T.card})`,
        border: `1px solid ${a}3a`,
        borderRadius: 16,
        padding: "16px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        cursor: "pointer",
        minHeight: 380,
        color: "inherit",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        <div style={{ display: "flex", gap: 10, minWidth: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: `${tone(iTone)}22`, color: tone(iTone), flexShrink: 0 }}>
            {icon}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: "-.02em", lineHeight: 1.2 }}>{title}</div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 3 }}>{subtitle}</div>
            {chip ? (
              <span style={{ marginTop: 6, display: "inline-block" }}>
                <Pill t="violet">{chip}</Pill>
              </span>
            ) : null}
          </div>
        </div>
        <ChevronRight size={22} color={T.dim} style={{ flexShrink: 0 }} />
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <div style={{ fontSize: 30, fontWeight: 900, fontFamily: MONO, letterSpacing: "-.04em" }}>{score}</div>
        <Mono c={T.red} s={12}>{delta}</Mono>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,0.9fr) minmax(0,1.1fr)", gap: 10, alignItems: "center" }}>
        <MiniSpark data={trend} c={trendColor} />
        {visualType === "gauges" && gauges ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
            {gauges.map((g) => (
              <MiniGauge key={g.label} label={g.label} topLabel={g.topLabel} value={g.value} color={g.color} />
            ))}
          </div>
        ) : bars ? (
          <MiniBars bars={bars} />
        ) : null}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {miniMetrics.map(([l, v, tc]) => (
          <div key={l}>
            <Eyebrow>{l}</Eyebrow>
            <Mono c={tone(tc)} s={14}>{v}</Mono>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "auto" }}>
        <AIInsightStrip tone={accent}>{aiText}</AIInsightStrip>
        <div style={{ fontSize: 11, fontWeight: 700, color: tone(accent), marginTop: 8 }}>{cta}</div>
      </div>
    </button>
  );
}

type MonitorAlert = {
  id: string;
  title: string;
  sev: "critical" | "high" | "later";
  sevLabel: string;
  variant: "critical" | "default" | "voice";
  fields: [string, string][];
  stats: [string, string][];
  ai: string;
  aiPurple?: boolean;
};

const SEV_STYLE: Record<
  "critical" | "high" | "later",
  { color: string; bg: string; border: string }
> = {
  critical: { color: "#ff5050", bg: "#5a1f1f", border: "#9d3030" },
  high: { color: T.gold, bg: "#3a2e0b", border: "#765c12" },
  later: { color: "#b79cff", bg: "#2d1d55", border: "#6845c7" },
};

const MONITOR_ALERTS: MonitorAlert[] = [
  {
    id: "token-cnp",
    title: "Tokenised CNP Approval Gap",
    sev: "critical",
    sevLabel: "Critical",
    variant: "critical",
    fields: [
      ["Cohort", "Premium · CNP"],
      ["Data source", "Token + auth feed"],
      ["Time", "Since 11:00"],
    ],
    stats: [
      ["Approval Gap", "14 pts"],
      ["Spend at Risk", "₹2.4 Cr"],
      ["Route", "Ops / Risk"],
    ],
    ai: "Tokenised path degraded after route change. Open ACS/token incident, not a customer-behaviour issue.",
  },
  {
    id: "o142",
    title: "Offer O-142 Cannibalisation",
    sev: "critical",
    sevLabel: "Critical",
    variant: "critical",
    fields: [
      ["Cohort", "Cashback Plus"],
      ["Data source", "Offer + spend"],
      ["Time", "Day 6"],
    ],
    stats: [
      ["Redemption", "High"],
      ["True Lift", "Low"],
      ["Leakage", "₹78 L"],
    ],
    ai: "Matched-control baseline says spend would have happened anyway. Recommend pause or retarget.",
  },
  {
    id: "r77",
    title: "Fraud Rule R-77 Misfire",
    sev: "high",
    sevLabel: "High",
    variant: "default",
    fields: [
      ["Cohort", "3+ yr customers"],
      ["Data source", "Rule change feed"],
      ["Time", "Within 2h"],
    ],
    stats: [
      ["Approval Rate", "94% → 81%"],
      ["Good Blocks", "+210%"],
      ["Feed", "Needs rule log"],
    ],
    ai: "Approval step-change tied to a rule edit. Data confidence depends on the fraud-rule event feed.",
  },
  {
    id: "activation",
    title: "Activation Closure Clock",
    sev: "high",
    sevLabel: "Obligation",
    variant: "default",
    fields: [
      ["Cohort", "Batch 4471"],
      ["Data source", "Issue + first txn"],
      ["Time", "D27"],
    ],
    stats: [
      ["Below baseline", "13 pts"],
      ["Cards at risk", "6.2k"],
      ["Route", "PM + Conduct"],
    ],
    ai: "Treat as obligation, not opportunity. Surface the closure countdown and activation intervention.",
  },
  {
    id: "util",
    title: "Utilisation Migration Surge",
    sev: "high",
    sevLabel: "Advisory",
    variant: "default",
    fields: [
      ["Cohort", "Sourcing Q2"],
      ["Data source", "Balance + limit"],
      ["Time", "This week"],
    ],
    stats: [
      ["80%+ crossing", "1.8×"],
      ["Projected roll", "9 bps"],
      ["Route", "Risk"],
    ],
    ai: "Advisory only. No automatic customer treatment; route to EWS / model-risk review.",
  },
  {
    id: "settlement",
    title: "Settlement / merchant concentration anomaly",
    sev: "high",
    sevLabel: "Watch",
    variant: "default",
    fields: [
      ["Cohort", "Fuel Co-brand"],
      ["Data source", "Settlement feed"],
      ["Time", "This week"],
    ],
    stats: [
      ["Concentration", "↑ 2.1×"],
      ["Merchants", "47"],
      ["Route", "Finance / Ops"],
    ],
    ai: "Merchant concentration spike on fuel MCC — review interchange recovery and settlement lag before it becomes a decline driver.",
  },
];

function TodayTransactionSignalMonitor() {
  return (
    <div style={{ marginTop: 28 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            color: T.gold,
            fontSize: 13,
            letterSpacing: ".08em",
            textTransform: "uppercase",
            fontWeight: 900,
          }}
        >
          ✨ Today's Transaction Signal Monitor
        </div>
        <span
          style={{
            fontSize: 10,
            fontWeight: 900,
            letterSpacing: ".08em",
            textTransform: "uppercase",
            border: "1px solid #7e1f1f",
            background: "#301818",
            color: "#ff4444",
            borderRadius: 999,
            padding: "6px 12px",
          }}
        >
          Portfolio Alerts
        </span>
      </div>
      <div
        style={{
          display: "flex",
          gap: 14,
          overflowX: "auto",
          paddingBottom: 14,
        }}
      >
        {MONITOR_ALERTS.map((a) => {
          const sv = SEV_STYLE[a.sev];
          const border =
            a.variant === "critical"
              ? "#8a2b2b"
              : a.variant === "voice"
                ? "#6d44d4"
                : "#66420a";
          const bg =
            a.variant === "voice"
              ? "linear-gradient(180deg,#171127,#111)"
              : "#121212";
          return (
            <div
              key={a.id}
              style={{
                minWidth: 260,
                maxWidth: 260,
                background: bg,
                border: `1px solid ${border}`,
                borderRadius: 14,
                padding: "16px 16px 14px",
                minHeight: 400,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    fontSize: 17,
                    lineHeight: 1.1,
                    fontWeight: 900,
                    color: T.text,
                  }}
                >
                  {a.title}
                </div>
                <span
                  style={{
                    fontSize: 10,
                    textTransform: "uppercase",
                    fontWeight: 900,
                    borderRadius: 999,
                    padding: "5px 9px",
                    whiteSpace: "nowrap",
                    color: sv.color,
                    background: sv.bg,
                    border: `1px solid ${sv.border}`,
                  }}
                >
                  {a.sevLabel}
                </span>
              </div>
              {a.fields.map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "105px 1fr",
                    gap: 8,
                    marginBottom: 13,
                    fontSize: 12,
                  }}
                >
                  <span
                    style={{
                      color: "#8c8c95",
                      textTransform: "uppercase",
                      letterSpacing: ".06em",
                      fontWeight: 900,
                    }}
                  >
                    {k}
                  </span>
                  <span
                    style={{
                      textAlign: "right",
                      fontWeight: 800,
                      color: "#fff",
                    }}
                  >
                    {v}
                  </span>
                </div>
              ))}
              <div
                style={{
                  background: "#191919",
                  border: "1px solid #333",
                  borderRadius: 10,
                  padding: 12,
                  margin: "10px 0 16px",
                }}
              >
                {a.stats.map(([k, v], i) => (
                  <div
                    key={k}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1.15fr 1fr",
                      gap: 8,
                      marginBottom: i === a.stats.length - 1 ? 0 : 13,
                      fontSize: 13,
                      color: "#bfbfc6",
                    }}
                  >
                    <span>{k}</span>
                    <b
                      style={{
                        textAlign: "right",
                        color: "#fff",
                        fontFamily: MONO,
                      }}
                    >
                      {v}
                    </b>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: "auto",
                  background: a.aiPurple ? "#21163a" : "#2d2414",
                  border: `1px solid ${a.aiPurple ? "#5a3fb0" : "#5a4314"}`,
                  borderRadius: 9,
                  padding: 12,
                  fontSize: 13,
                  lineHeight: 1.45,
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                ✨ {a.ai}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const BLOCKER_BARS = [
  { name: "Token break", v: 82, c: T.red },
  { name: "Fraud-rule", v: 68, c: T.red },
  { name: "Limit / util", v: 49, c: T.amber },
  { name: "Activation", v: 58, c: T.amber },
  { name: "Roll Q2-24", v: 52, c: T.amber },
];

type NavigateFn = (screen: string) => void;

function Overview({ go }: { go: NavigateFn }) {
  return (
    <div className="fade">
      <TopBar />
      <ExecutivePulse />
      <div className="overview-cards">
        <ExecutiveQuestionCard
          accent="cyan"
          iTone="cyan"
          icon={<CreditCard size={18} />}
          title="How are my transactions & offers doing?"
          subtitle="Spend · offers · yield & reward economics"
          score="64"
          delta="−8 pts"
          trend={TREND.g}
          trendColor={T.cyan}
          visualType="gauges"
          gauges={[
            { label: "Incremental", value: 58, color: T.green },
            { label: "spend", topLabel: "Profitable", value: 55, color: T.amber },
          ]}
          miniMetrics={[
            ["Yield leak", "₹1.2 Cr", "red"],
            ["Offers to kill", "2", "amber"],
          ]}
          aiText="Offer incrementality vs matched control flags two net-negative offers. ₹1.3 Cr reallocatable; RuPay-on-UPI mix is compressing interchange yield by ~₹1.2 Cr."
          cta="Open transactions & offers →"
          onClick={() => go("d1")}
        />
        <ExecutiveQuestionCard
          accent="amber"
          iTone="amber"
          icon={<Zap size={18} />}
          title="Where are my blockers & problems today?"
          subtitle="Declines · token gaps · fraud-rule · activation · roll/util"
          score="58"
          delta="−10 pts"
          trend={TREND.r}
          trendColor={T.amber}
          visualType="bars"
          bars={BLOCKER_BARS}
          miniMetrics={[
            ["Curable", "62%", "green"],
            ["At risk", "₹2.4 Cr", "red"],
          ]}
          aiText="Decline taxonomy splits today's spike as a token break: ₹2.4 Cr at risk, 62% curable. Fraud-rule R-77 stepped approval down 13 pts; Batch #4471 risks ₹93L CAC against the 30+7 closure clock."
          cta="Open blocker command center →"
          onClick={() => go("d2")}
        />
      </div>

      <TodayTransactionSignalMonitor />
      <div style={{ height: 44 }} />
    </div>
  );
}

/* ═══════════════════ DRILL 1 — TRANSACTIONS & OFFERS (Command Center signature) ═══════════════════ */
const D1_BRANDS: {
  k: string;
  name: string;
  spend: string;
  wow: string;
  up: boolean;
  prof: number;
  status: string;
  sc: string;
}[] = [
  {
    k: "travel",
    name: "Premium Travel",
    spend: "₹312 Cr",
    wow: "−6.2%",
    up: false,
    prof: 38,
    status: "Watch",
    sc: T.amber,
  },
  {
    k: "cashback",
    name: "Cashback Plus",
    spend: "₹468 Cr",
    wow: "+8.4%",
    up: true,
    prof: 71,
    status: "Healthy",
    sc: T.green,
  },
  {
    k: "fuel",
    name: "Fuel Co-brand",
    spend: "₹214 Cr",
    wow: "+3.2%",
    up: true,
    prof: 52,
    status: "Retarget",
    sc: T.yellow,
  },
  {
    k: "biz",
    name: "Business",
    spend: "₹290 Cr",
    wow: "+1.1%",
    up: true,
    prof: 64,
    status: "Watch",
    sc: T.amber,
  },
];
const D1_TIERS: [string, string, number, number, number][] = [
  ["H1 · ₹1L+ spend", "₹420 Cr", 44, 30, 26],
  ["H2 · ₹50k–1L", "₹312 Cr", 51, 27, 22],
  ["H3 · ₹25–50k", "₹256 Cr", 58, 22, 20],
];
const D1_GMV = [
  { w: "W-6", g: 100, p: 100 },
  { w: "W-5", g: 101, p: 99 },
  { w: "W-4", g: 102, p: 97.5 },
  { w: "W-3", g: 103, p: 96 },
  { w: "W-2", g: 103.6, p: 95 },
  { w: "W-1", g: 104, p: 94.2 },
  { w: "Now", g: 104, p: 93.6 },
];
const D1_LEAK_WATCH: [string, string, string, string][] = [
  ["O-142 Cashback", "₹78 L", "High", T.red],
  ["Wallet-load MCC", "₹42 L", "High", T.red],
  ["Fuel Friday", "₹21 L", "Medium", T.amber],
  ["Grocery 2%", "₹19 L", "Medium", T.amber],
];
const D1_STRAIN: [string, number, number, number, number][] = [
  ["Wallet load", 18, 6, 9, 33],
  ["Fuel", 11, 4, 7, 22],
  ["Utilities", 6, 3, 2, 11],
];

const D1_AI: AiRow[] = [
  {
    id: "a1",
    level: "CRITICAL",
    tag: "Offer economics",
    title: "Offer O-142 is cannibalising spend",
    body: "High redemption, near-zero incremental lift vs a matched control. Reward budget is subsidising spend that would have happened anyway.",
    metric: "₹78 L leakage",
    delta: "redemption 82% · lift 18%",
    icon: CircleAlert,
    root: "Eligibility is too broad — high-frequency customers who already spend in these MCCs are claiming the reward.",
    areas: ["Marketing", "Rewards engine", "Premium desk"],
    actions: [
      "Pause wave 2 now",
      "Narrow eligibility to low-frequency / lapsing",
      "Cap reward to first ₹X spend",
      "A/B a smaller earn rate",
    ],
    owner: "Head of Cards — Marketing",
    priority: "Immediate",
  },
  {
    id: "a2",
    level: "ALERT",
    tag: "Reward economics",
    title: "2 categories turned reward-negative",
    body: "Net economics (interchange − reward − fraud) crossed below zero on wallet-load and fuel-adjacent MCCs after the earn-rate change.",
    metric: "₹2.5 Cr net strain",
    delta: "net < 0 · 2 MCCs",
    icon: TriangleAlert,
    root: "Accelerated earn applied to low-MDR categories where interchange can't cover the reward cost.",
    areas: ["Finance", "Rewards engine", "Product"],
    actions: [
      "Cap or exclude the 2 MCCs",
      "Re-tier earn by MDR band",
      "Brief Finance on run-rate",
    ],
    owner: "Finance — Card P&L",
    priority: "High",
  },
  {
    id: "a3",
    level: "WARNING",
    tag: "Spend quality",
    title: "Profitable spend drifting on premium",
    body: "Gross GMV is flat but profitable retained spend on Premium Travel is down 6.4% — top-of-wallet is slipping.",
    metric: "−6.4% vs flat GMV",
    delta: "premiumisation drift",
    icon: Zap,
    root: "Reward-heavy mix shift plus benefit fatigue in the premium cohort; engagement cadence decaying.",
    areas: ["Head of Cards", "Premium desk", "Benefits"],
    actions: [
      "Benefit / engagement review",
      "Targeted top-of-wallet nudge",
      "Watch dormancy onset",
    ],
    owner: "Head of Cards",
    priority: "Medium",
  },
  {
    id: "a4",
    level: "INFO",
    tag: "Launch",
    title: "Co-brand launch lift still unproven",
    body: "Low redemption, control delta not yet significant. Hold the read for 24h before keep/kill.",
    metric: "wait 24h",
    delta: "control n too small",
    icon: Info,
    root: "Cohort size below the minimum for a confident matched-control read.",
    areas: ["Marketing", "Analytics"],
    actions: ["Hold decision 24h", "Recheck control delta tomorrow"],
    owner: "Marketing",
    priority: "Low",
  },
];

const OFFERS: Offer[] = [
  {
    id: "O-142",
    name: "O-142 Cashback",
    leak: 78,
    d: "kill",
    redemption: "82%",
    lift: "18%",
    cost: "₹96 L",
    leakage: "₹78 L",
    control: "+2% vs control",
    insight:
      "Redemption is largely non-incremental — matched-control spend is nearly identical. The offer subsidises spend that would have happened anyway.",
    rec: "Pause wave 2 or narrow eligibility to low-frequency, lapsing customers; cap reward to first spend band.",
    cats: ["Grocery", "Wallet load", "Recharge", "Utilities"],
  },
  {
    id: "FF",
    name: "Fuel Friday",
    leak: 21,
    d: "retarget",
    redemption: "78%",
    lift: "46%",
    cost: "₹46 L",
    leakage: "₹21 L",
    control: "+24% vs control",
    insight:
      "Roughly half the spend is incremental — works for new fuel-cohort but leaks on existing heavy users.",
    rec: "Retarget to fuel-light customers; exclude top-decile fuel spenders.",
    cats: ["Fuel", "Auto", "Toll"],
  },
  {
    id: "G2",
    name: "Grocery 2%",
    leak: 19,
    d: "retarget",
    redemption: "71%",
    lift: "31%",
    cost: "₹52 L",
    leakage: "₹19 L",
    control: "+14% vs control",
    insight:
      "Weak lift on an always-on category; reward is mostly going to baseline grocery spend.",
    rec: "Convert to a threshold / streak mechanic to drive incremental trips.",
    cats: ["Grocery", "Q-commerce"],
  },
  {
    id: "T5X",
    name: "Travel 5X",
    leak: 2,
    d: "keep",
    redemption: "55%",
    lift: "74%",
    cost: "₹58 L",
    leakage: "₹2 L",
    control: "+41% vs control",
    insight:
      "Strong, clearly incremental lift in the target premium cohort. Protect it.",
    rec: "Keep as-is; consider extending to the Business portfolio.",
    cats: ["Airlines", "Hotels", "Forex"],
  },
  {
    id: "D3X",
    name: "Dining 3X",
    leak: 4,
    d: "keep",
    redemption: "60%",
    lift: "67%",
    cost: "₹38 L",
    leakage: "₹4 L",
    control: "+36% vs control",
    insight: "Healthy incremental dining spend; low leakage.",
    rec: "Keep; test a weekend-only variant for higher lift.",
    cats: ["Dining", "Delivery"],
  },
  {
    id: "CBL",
    name: "Co-brand launch",
    leak: 12,
    d: "wait",
    redemption: "26%",
    lift: "?",
    cost: "₹40 L",
    leakage: "tbd",
    control: "n too small",
    insight: "Cohort below the minimum size for a confident control read.",
    rec: "Hold the keep/kill decision 24h.",
    cats: ["New cohort"],
  },
];
const OFFER_C: Record<string, string> = {
  kill: T.red,
  keep: T.green,
  retarget: T.amber,
  wait: T.dim,
};

function AISummaryWall({ rows }: { rows: AiRow[] }) {
  const [open, setOpen] = useState<string | null>(rows[0].id);
  const counts = rows.reduce<Record<string, number>>((m, r) => {
    m[r.level] = (m[r.level] || 0) + 1;
    return m;
  }, {});
  return (
    <SectionCard
      title="AI Summary Wall"
      subtitle="Ranked · click to expand root cause & actions"
      accent={T.gold}
      aiPill
      style={{ height: "100%" }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {rows.map((r) => {
          const c = LEVEL[r.level];
          const isOpen = open === r.id;
          const Icon = r.icon;
          return (
            <div
              key={r.id}
              style={{
                borderRadius: 11,
                border: `1px solid ${c}50`,
                background: `linear-gradient(135deg,${c}22,${c}0a)`,
                overflow: "hidden",
              }}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : r.id)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  cursor: "pointer",
                  background: "transparent",
                  border: "none",
                  padding: 13,
                  fontFamily: "inherit",
                  display: "flex",
                  gap: 11,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    padding: 7,
                    borderRadius: 8,
                    background: `${c}20`,
                    flexShrink: 0,
                  }}
                >
                  <Icon size={15} color={c} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      marginBottom: 4,
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        textTransform: "uppercase",
                        padding: "2px 6px",
                        borderRadius: 4,
                        background: `${c}25`,
                        color: c,
                      }}
                    >
                      {r.level}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        padding: "2px 6px",
                        borderRadius: 4,
                        background: T.inner,
                        color: T.muted,
                        display: "inline-flex",
                        gap: 4,
                        alignItems: "center",
                      }}
                    >
                      <RefreshCw size={10} />
                      {r.tag}
                    </span>
                  </div>
                  <div
                    style={{ fontSize: 13.5, fontWeight: 700, color: T.text }}
                  >
                    {r.title}
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: T.sub,
                      lineHeight: 1.5,
                      marginTop: 3,
                    }}
                  >
                    {r.body}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginTop: 7,
                      flexWrap: "wrap",
                    }}
                  >
                    <Mono c={c} s={12}>
                      {r.metric}
                    </Mono>
                    <span style={{ fontSize: 11, color: T.muted }}>
                      {r.delta}
                    </span>
                  </div>
                </div>
                <ChevronDown
                  size={16}
                  color={c}
                  style={{
                    flexShrink: 0,
                    transform: isOpen ? "rotate(180deg)" : "none",
                    transition: ".2s",
                  }}
                />
              </button>
              {isOpen && (
                <div
                  style={{
                    padding: "0 13px 13px 13px",
                    borderTop: `1px solid ${c}30`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                      margin: "10px 0 8px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 999,
                        background: `${c}20`,
                        color: c,
                      }}
                    >
                      {r.priority} priority
                    </span>
                    <Users size={12} color={T.muted} />
                    <span style={{ fontSize: 11, color: T.muted }}>
                      {r.owner}
                    </span>
                  </div>
                  <Eyebrow>Root cause</Eyebrow>
                  <div
                    style={{
                      fontSize: 12,
                      color: T.sub,
                      lineHeight: 1.5,
                      margin: "4px 0 10px",
                    }}
                  >
                    {r.root}
                  </div>
                  <Eyebrow>Affected areas</Eyebrow>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                      margin: "6px 0 10px",
                    }}
                  >
                    {r.areas.map((a) => (
                      <span
                        key={a}
                        style={{
                          fontSize: 10,
                          padding: "3px 8px",
                          borderRadius: 6,
                          background: T.inner,
                          color: T.sub,
                        }}
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                  <Eyebrow>Recommended actions</Eyebrow>
                  <div style={{ marginTop: 6 }}>
                    {r.actions.map((a, i) => (
                      <div
                        key={a}
                        style={{
                          display: "flex",
                          gap: 8,
                          alignItems: "flex-start",
                          marginBottom: 5,
                        }}
                      >
                        <span
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: 999,
                            fontSize: 9.5,
                            fontWeight: 800,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: `${c}20`,
                            color: c,
                            flexShrink: 0,
                          }}
                        >
                          {i + 1}
                        </span>
                        <span
                          style={{
                            fontSize: 11.5,
                            color: T.sub,
                            lineHeight: 1.45,
                          }}
                        >
                          {a}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 12,
          paddingTop: 12,
          borderTop: `1px solid ${T.inner}`,
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 8,
        }}
      >
        {["CRITICAL", "ALERT", "WARNING", "INFO"].map((l) => (
          <div key={l} style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: LEVEL[l],
                fontFamily: MONO,
              }}
            >
              {counts[l] || 0}
            </div>
            <Eyebrow>{l}</Eyebrow>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function CommandCenter() {
  const W = ({
    children,
    accent,
    title,
    sub,
    right,
  }: {
    children: ReactNode;
    accent?: string;
    title: ReactNode;
    sub?: ReactNode;
    right?: ReactNode;
  }) => (
    <div
      style={{
        border: `1px solid ${T.border}`,
        borderRadius: 12,
        padding: 13,
        background: T.card,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {accent && (
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: 3,
            background: accent,
          }}
        />
      )}
      <div style={{ marginLeft: accent ? 6 : 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: sub ? 2 : 8,
          }}
        >
          <div style={{ fontSize: 13.5, fontWeight: 800 }}>{title}</div>
          {right}
        </div>
        {sub && (
          <div style={{ fontSize: 10, color: T.dim, marginBottom: 8 }}>
            {sub}
          </div>
        )}
        {children}
      </div>
    </div>
  );
  const offerMix: [string, number, string][] = [
    ["keep", 9, T.green],
    ["retarget", 6, T.amber],
    ["kill", 2, T.red],
    ["wait", 3, T.dim],
  ];
  const offerLegend: [string, number, string][] = [
    ["Keep", 9, T.green],
    ["Retarget", 6, T.amber],
    ["Kill", 2, T.red],
    ["Wait", 3, T.dim],
  ];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2,minmax(0,1fr))",
        gap: 12,
      }}
    >
      {/* total spend + brand table */}
      <W
        accent={T.blue}
        title="Total spend"
        right={<span style={{ fontSize: 10, color: T.muted }}>WoW</span>}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 8,
            marginBottom: 10,
          }}
        >
          <span
            style={{
              fontSize: 30,
              fontWeight: 800,
              fontFamily: MONO,
              background: "linear-gradient(135deg,#5332ff,#7c3aed)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ₹1,284 Cr
          </span>
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              color: T.green,
              background: `${T.green}1c`,
              border: `1px solid ${T.green}40`,
              borderRadius: 999,
              padding: "2px 8px",
            }}
          >
            ▲ +3.8%
          </span>
          <span style={{ fontSize: 10.5, fontWeight: 700, color: T.red }}>
            profit −6.4%
          </span>
        </div>
        <div
          style={{
            border: `1px solid ${T.border}`,
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr .9fr .8fr 1fr",
              gap: 8,
              padding: "7px 10px",
              background: T.row,
            }}
          >
            {["BRAND", "SPEND", "WoW", "PROFIT%"].map((h) => (
              <Eyebrow key={h}>{h}</Eyebrow>
            ))}
          </div>
          {D1_BRANDS.map((b, i) => (
            <div
              key={b.k}
              style={{
                display: "grid",
                gridTemplateColumns: "1.4fr .9fr .8fr 1fr",
                gap: 8,
                padding: "7px 10px",
                borderTop: i ? `1px solid ${T.border}` : "none",
                alignItems: "center",
              }}
            >
              <BrandPill k={b.k}>{b.name}</BrandPill>
              <Mono c={T.text} s={11.5}>
                {b.spend}
              </Mono>
              <Mono c={b.up ? T.green : T.red} s={11}>
                {b.up ? "▲" : "▼"} {b.wow}
              </Mono>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div
                  style={{
                    flex: 1,
                    height: 6,
                    background: T.track,
                    borderRadius: 999,
                  }}
                >
                  <div
                    style={{
                      width: `${b.prof}%`,
                      height: "100%",
                      background: b.sc,
                      borderRadius: 999,
                    }}
                  />
                </div>
                <Mono c={b.sc} s={10.5}>
                  {b.prof}%
                </Mono>
              </span>
            </div>
          ))}
        </div>
      </W>
      {/* spend quality by tier */}
      <W
        accent={T.violet}
        title="Spend quality by value tier"
        sub="profitable / neutral / leaking"
      >
        {D1_TIERS.map(([l, sub, h, n, u]) => (
          <div key={l} style={{ marginBottom: 9 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 3,
              }}
            >
              <span style={{ fontSize: 10.5, fontWeight: 700, color: T.text }}>
                {l}
              </span>
              <span style={{ fontSize: 10, color: T.dim }}>{sub}</span>
            </div>
            <div
              style={{
                display: "flex",
                height: 18,
                borderRadius: 5,
                overflow: "hidden",
                background: T.track,
              }}
            >
              <div
                style={{
                  width: `${h}%`,
                  background: T.green,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 9.5,
                  fontWeight: 700,
                  color: "#000",
                }}
              >
                {h}
              </div>
              <div
                style={{
                  width: `${n}%`,
                  background: T.amber,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 9.5,
                  fontWeight: 700,
                  color: "#000",
                }}
              >
                {n}
              </div>
              <div
                style={{
                  width: `${u}%`,
                  background: T.red,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 9.5,
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {u}
              </div>
            </div>
          </div>
        ))}
        <div
          style={{
            display: "flex",
            gap: 12,
            fontSize: 9.5,
            color: T.dim,
            borderTop: `1px solid ${T.border}`,
            paddingTop: 6,
          }}
        >
          <span
            style={{ display: "inline-flex", gap: 4, alignItems: "center" }}
          >
            <Dot c={T.green} />
            Profitable
          </span>
          <span
            style={{ display: "inline-flex", gap: 4, alignItems: "center" }}
          >
            <Dot c={T.amber} />
            Neutral
          </span>
          <span
            style={{ display: "inline-flex", gap: 4, alignItems: "center" }}
          >
            <Dot c={T.red} />
            Leaking
          </span>
        </div>
      </W>
      {/* gmv vs profitable monitor */}
      <W
        accent={T.cyan}
        title="Gross vs profitable spend"
        sub="7-week · gross holds, profitable falls"
      >
        <div style={{ height: 132 }}>
          <ResponsiveContainer>
            <LineChart
              data={D1_GMV}
              margin={{ top: 8, right: 8, left: -22, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis
                dataKey="w"
                tick={{ fill: T.dim, fontSize: 9 }}
                tickLine={false}
              />
              <YAxis
                domain={[90, 106]}
                tick={{ fill: T.dim, fontSize: 9 }}
                width={26}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip contentStyle={TIP} />
              <Line
                type="monotone"
                dataKey="g"
                name="Gross"
                stroke={T.green}
                strokeWidth={2.4}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="p"
                name="Profitable"
                stroke={T.red}
                strokeWidth={2.4}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </W>
      {/* reward-leakage watchlist */}
      <W
        accent={T.amber}
        title="Reward-leakage watchlist"
        right={
          <span
            style={{
              fontSize: 9,
              fontWeight: 800,
              color: T.gold,
              background: `${T.gold}14`,
              border: `1px solid ${T.gold}30`,
              borderRadius: 999,
              padding: "2px 6px",
            }}
          >
            ✨
          </span>
        }
      >
        {D1_LEAK_WATCH.map(([n, amt, lvl, c]) => (
          <div
            key={n}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
              padding: "6px 8px",
              borderRadius: 6,
              background: `${c}12`,
              border: `1px solid ${c}30`,
            }}
          >
            <span style={{ fontSize: 11.5, fontWeight: 600, color: T.text }}>
              {n}{" "}
              <Mono c={c} s={11}>
                {amt}
              </Mono>
            </span>
            <span
              style={{
                fontSize: 9,
                fontWeight: 800,
                color: c,
                background: `${c}15`,
                border: `1px solid ${c}40`,
                borderRadius: 999,
                padding: "2px 6px",
              }}
            >
              {lvl}
            </span>
          </div>
        ))}
      </W>
      {/* reward-negative strain */}
      <W
        accent={T.red}
        title="Reward-negative strain"
        sub="net-negative cells by MCC × brand"
        right={null}
      >
        <div
          style={{
            border: `1px solid ${T.inner}`,
            borderRadius: 8,
            overflow: "hidden",
            background: T.track,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0,1fr) 48px 48px 48px 56px",
              gap: 4,
              padding: "5px 8px",
              borderBottom: `1px solid ${T.inner}`,
            }}
          >
            <Eyebrow>MCC</Eyebrow>
            <span
              style={{
                fontSize: 8.5,
                fontWeight: 700,
                color: BRAND.travel,
                textAlign: "center",
              }}
            >
              TRVL
            </span>
            <span
              style={{
                fontSize: 8.5,
                fontWeight: 700,
                color: BRAND.cashback,
                textAlign: "center",
              }}
            >
              CASH
            </span>
            <span
              style={{
                fontSize: 8.5,
                fontWeight: 700,
                color: BRAND.fuel,
                textAlign: "center",
              }}
            >
              FUEL
            </span>
            <span
              style={{
                fontSize: 8.5,
                fontWeight: 700,
                color: T.red,
                textAlign: "right",
              }}
            >
              TOTAL
            </span>
          </div>
          {D1_STRAIN.map((r, i) => (
            <div
              key={r[0]}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0,1fr) 48px 48px 48px 56px",
                gap: 4,
                padding: "5px 8px",
                borderTop: i ? `1px solid ${T.inner}` : "none",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 10.5, color: T.sub }}>{r[0]}</span>
              <span
                style={{ fontSize: 10, textAlign: "center", color: T.muted }}
              >
                {r[1]}
              </span>
              <span
                style={{ fontSize: 10, textAlign: "center", color: T.muted }}
              >
                {r[2]}
              </span>
              <span
                style={{ fontSize: 10, textAlign: "center", color: T.muted }}
              >
                {r[3]}
              </span>
              <Mono c={T.red} s={11}>
                {r[4]}
              </Mono>
            </div>
          ))}
        </div>
      </W>
      {/* offer mix */}
      <W
        accent={T.yellow}
        title="Live offer mix"
        sub="20 active offers · keep / retarget / kill / wait"
      >
        <div
          style={{
            display: "flex",
            height: 22,
            borderRadius: 6,
            overflow: "hidden",
            gap: 2,
            marginBottom: 8,
          }}
        >
          {offerMix.map(([l, n, c]) => (
            <div
              key={l}
              style={{
                flex: n,
                background: c,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontWeight: 800,
                color: "#0d0d0d",
              }}
            >
              {n}
            </div>
          ))}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gap: 6,
          }}
        >
          {offerLegend.map(([l, n, c]) => (
            <span
              key={l}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 11,
                color: T.sub,
              }}
            >
              <Dot c={c} sq />
              {l}{" "}
              <Mono c={c} s={11}>
                {n}
              </Mono>
            </span>
          ))}
        </div>
      </W>
    </div>
  );
}

function LeakPanel() {
  const [sel, setSel] = useState("O-142");
  const o = OFFERS.find((x) => x.id === sel) || OFFERS[0];
  return (
    <div
      style={{
        background: T.card,
        border: `1px solid ${T.inner}`,
        borderRadius: 14,
        padding: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>
          Where is reward spend leaking?
        </h3>
        <span
          style={{
            background: `${T.gold}20`,
            color: T.gold,
            fontSize: 8.5,
            fontWeight: 800,
            padding: "1px 6px",
            borderRadius: 4,
          }}
        >
          ✨ AI
        </span>
        <span style={{ fontSize: 11, color: T.muted, marginLeft: 4 }}>
          tap an offer — leakage = reward spent on non-incremental spend
        </span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
          gap: 16,
        }}
      >
        <div style={{ height: 300 }}>
          <ResponsiveContainer>
            <BarChart
              data={OFFERS}
              layout="vertical"
              margin={{ top: 4, right: 24, left: 6, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={T.inner}
                horizontal={false}
              />
              <XAxis
                type="number"
                stroke={T.dim}
                fontSize={10}
                tickFormatter={(v) => `₹${v}L`}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke={T.sub}
                fontSize={10.5}
                width={94}
              />
              <Tooltip
                contentStyle={TIP}
                cursor={{ fill: `${T.amber}10` }}
                formatter={(v) => [`₹${v} L leakage`, ""]}
              />
              <Bar
                dataKey="leak"
                radius={[0, 5, 5, 0]}
                onClick={(d) => setSel((d as { id: string }).id)}
                cursor="pointer"
              >
                {OFFERS.map((x) => (
                  <Cell
                    key={x.id}
                    fill={x.id === sel ? OFFER_C[x.d] : `${OFFER_C[x.d]}88`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div
          style={{
            border: `1px solid ${T.inner}`,
            borderRadius: 12,
            padding: 14,
            background: T.card,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 4,
            }}
          >
            <h4 style={{ margin: 0, fontSize: 17, color: T.text }}>{o.name}</h4>
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: "#fff",
                background: OFFER_C[o.d],
                borderRadius: 4,
                padding: "3px 8px",
                textTransform: "uppercase",
              }}
            >
              {o.d}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontSize: 28,
                fontWeight: 900,
                color: o.d === "keep" ? T.green : T.red,
                fontFamily: MONO,
              }}
            >
              {o.leakage}
            </span>
            <span style={{ fontSize: 11, color: T.dim }}>leakage</span>
            <span style={{ fontSize: 11, color: T.muted }}>· {o.control}</span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 8,
              padding: 12,
              borderRadius: 10,
              background: T.inset,
              marginBottom: 10,
            }}
          >
            {(
              [
                ["Redemption", o.redemption],
                ["True lift", o.lift],
                ["Reward cost", o.cost],
              ] as [string, string][]
            ).map(([l, v]) => (
              <div key={l}>
                <Eyebrow>{l}</Eyebrow>
                <div style={{ fontSize: 14, fontWeight: 800, color: T.text }}>
                  {v}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              border: `1px solid ${T.amber}40`,
              background: `${T.amber}10`,
              borderRadius: 10,
              padding: 11,
              marginBottom: 9,
            }}
          >
            <Eyebrow c={T.amber}>✨ AI insight</Eyebrow>
            <div
              style={{
                fontSize: 12.5,
                color: T.sub,
                lineHeight: 1.5,
                marginTop: 4,
              }}
            >
              {o.insight}
            </div>
          </div>
          <div
            style={{
              border: `1px solid ${T.green}40`,
              background: `${T.green}10`,
              borderRadius: 10,
              padding: 11,
              marginBottom: 10,
            }}
          >
            <Eyebrow c={T.green}>Recommendation</Eyebrow>
            <div
              style={{
                fontSize: 12.5,
                color: T.sub,
                lineHeight: 1.5,
                marginTop: 4,
              }}
            >
              {o.rec}
            </div>
          </div>
          <Eyebrow>Reward going to</Eyebrow>
          <div
            style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}
          >
            {o.cats.map((c) => (
              <span
                key={c}
                style={{
                  fontSize: 11,
                  color: T.sub,
                  background: T.inset,
                  border: `1px solid ${T.inner}`,
                  borderRadius: 999,
                  padding: "4px 10px",
                }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────── Drill 1 — post-fold panels ───────────── */
type BrandDeepRow = {
  k: string;
  name: string;
  spend: string;
  wow: string;
  wowUp: boolean;
  txn: string;
  active: string;
  activeUp: boolean;
  repeat: string;
  repeatUp: boolean;
  roi: string;
  rewardCost: string;
  profitable: string;
  profitableUp: boolean;
  status: string;
  statusAi?: boolean;
  owner: string;
};

const BRAND_DEEP: BrandDeepRow[] = [
  {
    k: "travel",
    name: "Premium Travel",
    spend: "₹312 Cr",
    wow: "−6.2%",
    wowUp: false,
    txn: "2.1M",
    active: "−3.1%",
    activeUp: false,
    repeat: "−4.8%",
    repeatUp: false,
    roi: "Weak",
    rewardCost: "High",
    profitable: "−6.4%",
    profitableUp: false,
    status: "Watch",
    statusAi: true,
    owner: "Product",
  },
  {
    k: "cashback",
    name: "Cashback Plus",
    spend: "₹468 Cr",
    wow: "+8.4%",
    wowUp: true,
    txn: "5.4M",
    active: "+4.7%",
    activeUp: true,
    repeat: "+6.2%",
    repeatUp: true,
    roi: "Strong",
    rewardCost: "Normal",
    profitable: "+2.1%",
    profitableUp: true,
    status: "Healthy",
    owner: "Marketing",
  },
  {
    k: "fuel",
    name: "Fuel Co-brand",
    spend: "₹214 Cr",
    wow: "+3.2%",
    wowUp: true,
    txn: "1.7M",
    active: "+1.1%",
    activeUp: true,
    repeat: "−1.9%",
    repeatUp: false,
    roi: "Weak",
    rewardCost: "High",
    profitable: "−3.8%",
    profitableUp: false,
    status: "Retarget",
    statusAi: true,
    owner: "Partner PM",
  },
  {
    k: "biz",
    name: "Business Card",
    spend: "₹290 Cr",
    wow: "+1.1%",
    wowUp: true,
    txn: "1.2M",
    active: "+0.8%",
    activeUp: true,
    repeat: "+1.3%",
    repeatUp: true,
    roi: "Neutral",
    rewardCost: "Stable",
    profitable: "+0.5%",
    profitableUp: true,
    status: "Monitor",
    owner: "Portfolio PM",
  },
];

type OfferBoardCard = {
  name: string;
  leak: string;
  lift: string;
  conf: string;
  owner: string;
  decision: string;
};

const OFFER_BOARD: Record<string, OfferBoardCard[]> = {
  keep: [
    {
      name: "Travel 5X",
      leak: "₹2 L",
      lift: "74%",
      conf: "High",
      owner: "Marketing",
      decision: "Keep",
    },
    {
      name: "Dining 3X",
      leak: "₹4 L",
      lift: "67%",
      conf: "High",
      owner: "Marketing",
      decision: "Keep",
    },
  ],
  retarget: [
    {
      name: "Fuel Friday",
      leak: "₹21 L",
      lift: "46%",
      conf: "High",
      owner: "Partner PM",
      decision: "Retarget",
    },
    {
      name: "Grocery 2%",
      leak: "₹19 L",
      lift: "31%",
      conf: "Medium",
      owner: "Marketing",
      decision: "Monitor",
    },
  ],
  kill: [
    {
      name: "O-142 Cashback",
      leak: "₹78 L",
      lift: "18%",
      conf: "Medium",
      owner: "Marketing",
      decision: "Kill / Narrow",
    },
    {
      name: "Wallet-load booster",
      leak: "₹42 L",
      lift: "12%",
      conf: "Medium",
      owner: "Marketing",
      decision: "Kill",
    },
  ],
  wait: [
    {
      name: "Co-brand Launch",
      leak: "tbd",
      lift: "?",
      conf: "Low",
      owner: "Marketing",
      decision: "Wait 24h",
    },
    {
      name: "Festival EMI",
      leak: "tbd",
      lift: "?",
      conf: "Low",
      owner: "Marketing",
      decision: "Wait",
    },
  ],
};

const BOARD_COL_META: Record<string, { l: string; c: string }> = {
  keep: { l: "Keep", c: T.green },
  retarget: { l: "Retarget", c: T.amber },
  kill: { l: "Kill", c: T.red },
  wait: { l: "Wait", c: T.dim },
};

const YIELD_ROWS: [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  boolean,
  string,
][] = [
  [
    "Wallet Load",
    "₹86 Cr",
    "₹3.0 Cr",
    "Low",
    "₹4.2 Cr",
    "₹0.6 Cr",
    "−₹1.8 Cr",
    true,
    "Exclude / cap",
  ],
  [
    "Fuel-adjacent",
    "₹61 Cr",
    "₹1.7 Cr",
    "Low",
    "₹2.1 Cr",
    "₹0.3 Cr",
    "−₹0.7 Cr",
    true,
    "Retier reward",
  ],
  [
    "Online Travel",
    "₹142 Cr",
    "₹6.7 Cr",
    "Good",
    "₹1.7 Cr",
    "₹0.2 Cr",
    "+₹4.8 Cr",
    false,
    "Keep",
  ],
  [
    "Grocery",
    "₹94 Cr",
    "₹2.1 Cr",
    "Medium",
    "₹1.1 Cr",
    "₹0.1 Cr",
    "+₹0.9 Cr",
    false,
    "Monitor",
  ],
];

const COHORT_ROWS: [string, string, string, string, string, string, boolean][] =
  [
    ["New-to-card", "+4.2%", "+3.1%", "Building", "Low", "Healthy", false],
    [
      "Activated 0–30 days",
      "+2.8%",
      "+1.4%",
      "Rising",
      "Med",
      "Healthy",
      false,
    ],
    ["Repeat spenders", "+1.9%", "+0.8%", "Stable", "Low", "Healthy", false],
    [
      "High-frequency high-spend",
      "+2.1%",
      "+0.8%",
      "Stable",
      "Low",
      "Healthy",
      false,
    ],
    ["Low-frequency premium", "−4.8%", "−6.1%", "Weak", "Med", "Falling", true],
    ["Dormancy-risk", "−9.2%", "−11%", "Weak", "High", "Poor", true],
  ];

function BrandCoBrandDeepPerformanceMatrix() {
  const cols = "minmax(100px,1.1fr) repeat(9,minmax(68px,.9fr))";
  return (
    <SectionCard
      title="Brand / Co-brand deep performance"
      subtitle="Which brand is growing, flat, or unhealthy — and what cost problem is attached"
      accent={T.cyan}
      aiPill
    >
      <div
        style={{
          border: `1px solid ${T.border}`,
          borderRadius: 8,
          overflowX: "auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: cols,
            gap: 8,
            padding: "8px 10px",
            background: T.row,
            minWidth: 960,
          }}
        >
          {[
            "Brand",
            "Spend",
            "WoW",
            "Txn",
            "Active",
            "Repeat",
            "Offer ROI",
            "Reward",
            "Profit",
            "Status",
            "Owner",
          ].map((h) => (
            <Eyebrow key={h}>{h}</Eyebrow>
          ))}
        </div>
        {BRAND_DEEP.map((b, i) => (
          <div
            key={b.k}
            style={{
              display: "grid",
              gridTemplateColumns: cols,
              gap: 8,
              padding: "8px 10px",
              borderTop: i ? `1px solid ${T.border}` : "none",
              alignItems: "center",
              minWidth: 960,
              fontSize: 11,
            }}
          >
            <BrandPill k={b.k}>{b.name}</BrandPill>
            <Mono s={10.5}>{b.spend}</Mono>
            <Mono c={b.wowUp ? T.green : T.red} s={10}>
              {b.wow}
            </Mono>
            <Mono s={10.5}>{b.txn}</Mono>
            <Mono c={b.activeUp ? T.green : T.red} s={10}>
              {b.active}
            </Mono>
            <Mono c={b.repeatUp ? T.green : T.red} s={10}>
              {b.repeat}
            </Mono>
            <span>{b.roi}</span>
            <span>{b.rewardCost}</span>
            <Mono c={b.profitableUp ? T.green : T.red} s={10}>
              {b.profitable}
            </Mono>
            <span
              style={{ fontWeight: 700, color: b.statusAi ? T.amber : T.green }}
            >
              {b.statusAi ? "✨ " : ""}
              {b.status}
            </span>
            <span style={{ color: T.muted }}>{b.owner}</span>
          </div>
        ))}
      </div>
      <AIInsightStrip>
        Premium Travel is not a volume problem; it is a profitable-spend
        problem. Fuel Co-brand is growing, but reward cost is eating the growth.
      </AIInsightStrip>
    </SectionCard>
  );
}

function OfferPortfolioDecisionBoard() {
  return (
    <SectionCard
      title="Offer portfolio decision board"
      subtitle="Executive action view — keep, retarget, kill, or wait"
      accent={T.gold}
      aiPill
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,minmax(0,1fr))",
          gap: 12,
          alignItems: "start",
        }}
      >
        {(["keep", "retarget", "kill", "wait"] as const).map((bucket) => {
          const m = BOARD_COL_META[bucket];
          const items = OFFER_BOARD[bucket];
          return (
            <div key={bucket}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  paddingBottom: 6,
                  borderBottom: `2px solid ${m.c}66`,
                  marginBottom: 8,
                }}
              >
                <Dot c={m.c} sq />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: ".06em",
                  }}
                >
                  {m.l}
                </span>
                <span
                  style={{ fontSize: 10, fontFamily: MONO, color: T.muted }}
                >
                  {items.length}
                </span>
              </div>
              {items.map((x) => (
                <div
                  key={x.name}
                  style={{
                    background: T.inset,
                    border: `1px solid ${m.c}40`,
                    borderLeft: `3px solid ${m.c}`,
                    borderRadius: 9,
                    padding: "10px 11px",
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: T.text,
                      marginBottom: 6,
                    }}
                  >
                    {x.name}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                      marginBottom: 6,
                    }}
                  >
                    <Mono c={m.c} s={10}>
                      {x.leak}
                    </Mono>
                    <span style={{ fontSize: 10, color: T.muted }}>
                      lift {x.lift}
                    </span>
                  </div>
                  <div style={{ fontSize: 10, color: T.dim, marginBottom: 4 }}>
                    {x.owner} · {x.conf} conf
                  </div>
                  <Pill
                    t={
                      bucket === "keep"
                        ? "green"
                        : bucket === "kill"
                          ? "red"
                          : bucket === "retarget"
                            ? "amber"
                            : "muted"
                    }
                  >
                    {x.decision}
                  </Pill>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

function RewardYieldUnitEconomicsPanel() {
  return (
    <SectionCard
      title="Reward yield unit economics"
      subtitle="Net = Interchange − Reward − Fraud · band = interchange yield vs category baseline"
      accent={T.red}
      aiPill
    >
      <div
        style={{
          border: `1px solid ${T.border}`,
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr .65fr .7fr .55fr .65fr .65fr .65fr .75fr .75fr",
            gap: 8,
            padding: "7px 10px",
            background: T.row,
          }}
        >
          {[
            "MCC / Category",
            "Spend",
            "Interchange",
            "Band",
            "Reward",
            "Fraud/Rev",
            "Net",
            "Status",
            "Action",
          ].map((h) => (
            <Eyebrow key={h}>{h}</Eyebrow>
          ))}
        </div>
        {YIELD_ROWS.map(
          ([cat, spend, interchange, band, reward, fraud, net, neg, action], i) => (
            <div
              key={cat}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr .65fr .7fr .55fr .65fr .65fr .65fr .75fr .75fr",
                gap: 8,
                padding: "7px 10px",
                borderTop: i ? `1px solid ${T.border}` : "none",
                alignItems: "center",
                fontSize: 11,
              }}
            >
              <span style={{ color: T.sub }}>{cat}</span>
              <Mono s={10.5}>{spend}</Mono>
              <Mono s={10.5}>{interchange}</Mono>
              <span style={{ color: neg ? T.red : band === "Medium" ? T.amber : T.green }}>
                {band}
              </span>
              <Mono s={10.5}>{reward}</Mono>
              <Mono s={10.5}>{fraud}</Mono>
              <Mono c={neg ? T.red : T.green} s={10.5}>
                {net}
              </Mono>
              <span
                style={{
                  fontWeight: 700,
                  color: neg ? T.red : action === "Monitor" ? T.amber : T.green,
                }}
              >
                {neg
                  ? "✨ Negative"
                  : action === "Monitor"
                    ? "Watch"
                    : "Healthy"}
              </span>
              <span style={{ color: T.muted, fontSize: 10 }}>{action}</span>
            </div>
          ),
        )}
      </div>
      <AIInsightStrip tone="red">
        Wallet-load interchange is ₹3.0 Cr on ₹86 Cr spend (~3.5%) but reward
        runs 4.9% — net −₹1.8 Cr. Combined with fuel-adjacent, ₹2.5 Cr net
        strain across two MCC bands. Cap accelerated rewards on both.
      </AIInsightStrip>
    </SectionCard>
  );
}

function CohortGrowthQualityMatrix() {
  const cols = "minmax(140px,1.2fr) repeat(6,minmax(72px,.9fr))";
  return (
    <SectionCard
      title="Cohort growth quality"
      subtitle="Growth quality by lifecycle stage — activation → repeat → dormancy"
      accent={T.cyan}
      aiPill
    >
      <div
        style={{
          border: `1px solid ${T.border}`,
          borderRadius: 8,
          overflowX: "auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: cols,
            gap: 8,
            padding: "8px 10px",
            background: T.row,
            minWidth: 820,
          }}
        >
          {[
            "Cohort",
            "Spend Δ",
            "Txn Freq Δ",
            "Repeat",
            "Offer Dep.",
            "Profitability",
            "AI Status",
          ].map((h) => (
            <Eyebrow key={h}>{h}</Eyebrow>
          ))}
        </div>
        {COHORT_ROWS.map(
          ([cohort, spend, freq, repeat, dep, prof, watch], i) => (
            <div
              key={cohort}
              style={{
                display: "grid",
                gridTemplateColumns: cols,
                gap: 8,
                padding: "8px 10px",
                borderTop: i ? `1px solid ${T.border}` : "none",
                alignItems: "center",
                minWidth: 820,
                fontSize: 11,
              }}
            >
              <span style={{ fontWeight: 600, color: T.text }}>{cohort}</span>
              <Mono c={spend.startsWith("−") ? T.red : T.green} s={10.5}>
                {spend}
              </Mono>
              <Mono c={freq.startsWith("−") ? T.red : T.green} s={10.5}>
                {freq}
              </Mono>
              <span>{repeat}</span>
              <span>{dep}</span>
              <span
                style={{
                  color:
                    prof === "Poor" || prof === "Falling" ? T.red : T.green,
                }}
              >
                {prof}
              </span>
              <span
                style={{ fontWeight: 700, color: watch ? T.amber : T.green }}
              >
                {watch ? "✨ Watch" : "Keep growing"}
              </span>
            </div>
          ),
        )}
      </div>
      <AIInsightStrip tone="cyan">
        Growth is concentrated in offer-sensitive Cashback cohorts. Premium
        low-frequency cohorts are slipping without showing full dormancy yet.
      </AIInsightStrip>
    </SectionCard>
  );
}

function Drill1({ go }: { go: NavigateFn }) {
  return (
    <div className="fade">
      <DrillHeader
        onBack={() => go("overview")}
        title="How are my transactions & offers doing?"
        sub="Transaction-only view of portfolio growth, brand/co-brand performance, offer keep/kill decisions, reward cost, and profitable spend drift."
        chips={
          <>
            <Chip t="cyan">Transaction + offer / reward / settlement</Chip>
            <Chip t="gold">Brand + Marketing lens</Chip>
          </>
        }
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,2fr) minmax(320px,1fr)",
          gap: 12,
          alignItems: "start",
        }}
      >
        <CommandCenter />
        <AISummaryWall rows={D1_AI} />
      </div>
      <div style={{ marginTop: 14 }}>
        <LeakPanel />
      </div>
      <div
        style={{
          marginTop: 14,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <BrandCoBrandDeepPerformanceMatrix />
        <OfferPortfolioDecisionBoard />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,minmax(0,1fr))",
            gap: 12,
            alignItems: "stretch",
          }}
        >
          <RewardYieldUnitEconomicsPanel />
          <CohortGrowthQualityMatrix />
        </div>
      </div>
      <div style={{ height: 44 }} />
    </div>
  );
}

function Frag({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

/* ═══════════════════ DRILL 2 — BLOCKERS & PROBLEMS ═══════════════════ */
const DECLINE_HEAT_COLS = [
  "Premium CNP",
  "Cashback Plus",
  "3+ yr customers",
  "Batch #4471",
  "Sourcing Q2",
  "Fuel Co-brand",
  "Business Card",
];
const DECLINE_HEAT_ROWS: { label: string; cells: number[] }[] = [
  { label: "Tokenised CNP", cells: [91, 48, 38, 55, 42, 34, 28] },
  { label: "Non-token CNP", cells: [44, 36, 32, 28, 24, 22, 18] },
  { label: "3DS / OTP failure", cells: [52, 41, 38, 67, 35, 29, 24] },
  { label: "Fraud-rule block", cells: [48, 42, 84, 38, 36, 31, 45] },
  { label: "Limit exhausted", cells: [38, 35, 42, 28, 66, 24, 32] },
  { label: "Activation / first-use failed", cells: [41, 38, 36, 79, 34, 28, 22] },
  { label: "Switch / processor issue", cells: [57, 48, 30, 44, 38, 74, 26] },
  { label: "Settlement mismatch", cells: [36, 32, 28, 24, 42, 38, 30] },
];
const declineHeatTone = (v: number): string =>
  v >= 70 ? T.red : v >= 45 ? T.amber : v >= 30 ? "#caa23a" : T.green;

type BlockerEvidence = {
  strength: string;
  approvalGap: string;
  atRisk: string;
  curable: string;
  started: string;
  owner: string;
  source: string;
  confidence: string;
  evidence: string[];
  actions: string[];
};

const BLOCKER_EVIDENCE: Record<string, BlockerEvidence> = {
  "Tokenised CNP|Premium CNP": {
    strength: "4.2× baseline",
    approvalGap: "14 pts",
    atRisk: "₹2.4 Cr",
    curable: "62%",
    started: "11:00",
    owner: "ops",
    source: "token + auth feed",
    confidence: "High",
    evidence: [
      "Approval dropped only on tokenised CNP path",
      "Non-tokenised CNP remains within baseline",
      "Spike starts after route/config change window",
      "Premium cohort disproportionately hit",
    ],
    actions: [
      "Open ACS/token incident",
      "Check token route and 3DS config",
      "Prepare customer workaround script",
      "Monitor recovery within 2 hours",
    ],
  },
  "Fraud-rule block|3+ yr customers": {
    strength: "3.6× baseline",
    approvalGap: "13 pts",
    atRisk: "GMV at risk",
    curable: "—",
    started: "Within 2h",
    owner: "fraud",
    source: "rule change feed",
    confidence: "High",
    evidence: [
      "Approval 94% → 81% after R-77 edit",
      "Good-customer blocks +210%",
      "Tenured segment disproportionately hit",
    ],
    actions: [
      "Review / rollback rule R-77",
      "Cap rule to low-complexity queue",
      "Route > ₹200 cases in-house",
    ],
  },
};

const defaultBlockerEvidence = (): BlockerEvidence => ({
  strength: "2.4× baseline",
  approvalGap: "—",
  atRisk: "₹68 L",
  curable: "48%",
  started: "Today",
  owner: "ops",
  source: "decline feed",
  confidence: "Med",
  evidence: ["Cohort-specific decline above seasonal baseline", "Repeat pattern in same time window"],
  actions: ["Open incident pack", "Route to owner with evidence"],
});

const D2_BLOCKER_ACTION_ROWS: {
  signal: string;
  evidence: string;
  impact: string;
  owner: string;
  action: string;
  risk: string;
  riskT: string;
  status: string;
}[] = [
  {
    signal: "Tokenised CNP approval gap",
    evidence: "14 pts · ₹2.4 Cr",
    impact: "Payment blocker",
    owner: "ops",
    action: "Open ACS/token incident",
    risk: "Service risk",
    riskT: "cyan",
    status: "Draft ready",
  },
  {
    signal: "Fraud Rule R-77 misfire",
    evidence: "Approval 94% → 81%",
    impact: "Good customers blocked",
    owner: "fraud",
    action: "Review / rollback rule",
    risk: "Fraud ops",
    riskT: "amber",
    status: "Needs approval",
  },
  {
    signal: "Activation closure clock",
    evidence: "6.2K cards · D27",
    impact: "CAC at risk + obligation",
    owner: "conduct",
    action: "Start activation rescue",
    risk: "Obligation",
    riskT: "amber",
    status: "Draft ready",
  },
  {
    signal: "Utilisation migration surge",
    evidence: "1.8× crossing 80%+",
    impact: "Early risk signal",
    owner: "risk",
    action: "Review EWS thresholds",
    risk: "Advisory",
    riskT: "violet",
    status: "Review",
  },
];

const D2_SPLIT_BARS = [
  { name: "Token break", v: 82, c: T.red },
  { name: "Fraud-rule", v: 68, c: T.red },
  { name: "Activation", v: 58, c: T.amber },
  { name: "Roll risk", v: 52, c: T.amber },
  { name: "Limit/util", v: 49, c: T.amber },
];

const D2_PRIORITY_ALERTS: { n: number; text: string; owner: string; c: string }[] = [
  { n: 1, text: "Tokenised CNP gap · ₹2.4 Cr", owner: "ops", c: T.red },
  { n: 2, text: "Fraud Rule R-77 · −13 pts", owner: "fraud", c: T.amber },
  { n: 3, text: "Activation clock · 6.2K cards", owner: "conduct", c: T.violet },
];

function ApprovalHealthCard() {
  return (
    <SectionCard title="Approval health" subtitle="Live approval & decline posture" accent={T.red} aiPill style={{ marginBottom: 0 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "stretch" }}>
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 8 }}>
            <Eyebrow>Approval rate</Eyebrow>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <Mono s={22}>81%</Mono>
              <Mono c={T.red} s={11}>−13 pts</Mono>
            </div>
          </div>
          <div style={{ marginBottom: 8 }}>
            <Eyebrow>Decline spike</Eyebrow>
            <div style={{ fontSize: 12, color: T.sub }}>
              <Mono c={T.amber} s={12}>+38%</Mono> since 11:00
            </div>
          </div>
          <div>
            <Eyebrow>Curable</Eyebrow>
            <Mono c={T.green} s={12}>62% · ₹2.4 Cr</Mono>
          </div>
        </div>
        <div style={{ width: 88, flexShrink: 0 }}>
          <MiniSpark data={TREND.r} c={T.amber} h={72} />
        </div>
      </div>
    </SectionCard>
  );
}

function BlockerSplitCard() {
  return (
    <SectionCard title="Blocker split" subtitle="Decline taxonomy pressure" accent={T.amber} aiPill style={{ marginBottom: 0 }}>
      <MiniBars bars={D2_SPLIT_BARS} />
      <div style={{ marginTop: 8 }}>
        <AIInsightStrip tone="amber">
          LiSN splits today's spike into separate blocker types instead of one decline alert.
        </AIInsightStrip>
      </div>
    </SectionCard>
  );
}

function CompactBlockerPriorityStack() {
  return (
    <SectionCard title="AI priority stack" subtitle="Top 3 routed blockers" accent={T.gold} aiPill style={{ marginBottom: 0 }}>
      {D2_PRIORITY_ALERTS.map((a) => (
        <div
          key={a.n}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 9px",
            marginBottom: 6,
            background: T.inset,
            border: `1px solid ${a.c}40`,
            borderLeft: `3px solid ${a.c}`,
            borderRadius: 8,
            fontSize: 11.5,
          }}
        >
          <Mono c={a.c} s={11}>{a.n}.</Mono>
          <span style={{ flex: 1, color: T.sub, lineHeight: 1.3 }}>{a.text}</span>
          <RouteChip r={a.owner} />
        </div>
      ))}
    </SectionCard>
  );
}

function BlockerTopGrid() {
  return (
    <div className="d2-top-grid">
      <ApprovalHealthCard />
      <BlockerSplitCard />
      <CompactBlockerPriorityStack />
    </div>
  );
}

function DeclineInvestigationGrid({
  row,
  col,
  onSelect,
}: {
  row: string;
  col: string;
  onSelect: (r: string, c: string) => void;
}) {
  return (
    <div className="d2-investigation-grid">
      <DeclineTaxonomyHeatmap row={row} col={col} onSelect={onSelect} />
      <SelectedBlockerIncidentPack row={row} col={col} />
    </div>
  );
}

function OwnerIssueCard({
  title,
  accent,
  lines,
  owner,
}: {
  title: string;
  accent: string;
  lines: string[];
  owner: string;
}) {
  return (
    <SectionCard title={title} accent={accent} style={{ marginBottom: 0 }}>
      {lines.map((l) => (
        <div key={l} style={{ fontSize: 11.5, color: T.sub, padding: "3px 0", lineHeight: 1.35 }}>{l}</div>
      ))}
      <div style={{ marginTop: 8 }}>
        <RouteChip r={owner} />
      </div>
    </SectionCard>
  );
}

function OwnerSplitGrid() {
  return (
    <div className="d2-owner-grid">
      <OwnerIssueCard
        title="Token / Auth"
        accent={T.red}
        owner="ops"
        lines={["Tokenised CNP approval gap", "14 pts", "Premium CNP", "Since 11:00"]}
      />
      <OwnerIssueCard
        title="Fraud rule"
        accent={T.amber}
        owner="fraud"
        lines={["Fraud Rule R-77", "Approval 94% → 81%", "Good blocks +210%"]}
      />
      <OwnerIssueCard
        title="Activation clock"
        accent={T.violet}
        owner="conduct"
        lines={["Batch #4471", "D27", "6.2K cards", "₹93L CAC at risk"]}
      />
    </div>
  );
}

function BlockerExecutionGrid() {
  return (
    <div className="d2-execution-grid">
      <TroubleTicketBoard />
      <RollUtilisationEarlyWarningPanel />
    </div>
  );
}

function DeclineTaxonomyHeatmap({
  row,
  col,
  onSelect,
}: {
  row: string;
  col: string;
  onSelect: (r: string, c: string) => void;
}) {
  return (
    <SectionCard title="Decline taxonomy heatmap" subtitle="Reason × cohort · anomaly index" accent={T.red} aiPill style={{ marginBottom: 0 }}>
      <div style={{ display: "grid", gridTemplateColumns: `minmax(130px,1.1fr) repeat(${DECLINE_HEAT_COLS.length},1fr)`, gap: 5, overflowX: "auto" }}>
        <div />
        {DECLINE_HEAT_COLS.map((c) => (
          <div key={c} style={{ fontSize: 8, color: T.muted, textAlign: "center" }}>{c}</div>
        ))}
        {DECLINE_HEAT_ROWS.map((r) => (
          <Frag key={r.label}>
            <div style={{ fontSize: 10, color: T.sub, alignSelf: "center" }}>{r.label}</div>
            {r.cells.map((v, i) => {
              const ch = DECLINE_HEAT_COLS[i];
              const c = declineHeatTone(v);
              const active = row === r.label && col === ch;
              return (
                <button
                  key={ch}
                  type="button"
                  onClick={() => onSelect(r.label, ch)}
                  style={{
                    cursor: "pointer",
                    minHeight: 28,
                    borderRadius: 6,
                    background: `${c}d9`,
                    border: active ? "2px solid #fff" : `1px solid ${c}`,
                    fontFamily: MONO,
                    fontWeight: 800,
                    fontSize: 11,
                    color: v >= 45 ? "#0d0d0d" : "#fff",
                  }}
                >
                  {v}
                </button>
              );
            })}
          </Frag>
        ))}
      </div>
      <div style={{ marginTop: 10 }}>
        <AIInsightStrip tone="red">
          This heatmap is not showing raw declines. It shows where decline behaviour is abnormal versus each cohort's own baseline.
        </AIInsightStrip>
      </div>
    </SectionCard>
  );
}

function SelectedBlockerIncidentPack({ row, col }: { row: string; col: string }) {
  const ev = BLOCKER_EVIDENCE[`${row}|${col}`] ?? defaultBlockerEvidence();
  return (
    <SectionCard title="Selected incident" subtitle={`${row} × ${col}`} accent={T.gold} aiPill style={{ marginBottom: 0 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 8 }}>
        <div style={{ background: T.inset, borderRadius: 7, padding: "6px 8px" }}>
          <Eyebrow>Signal strength</Eyebrow>
          <Mono c={T.gold} s={16}>{ev.strength}</Mono>
        </div>
        <div style={{ background: T.inset, borderRadius: 7, padding: "6px 8px" }}>
          <Eyebrow>Confidence</Eyebrow>
          <div style={{ fontSize: 12, fontWeight: 800, color: T.text }}>{ev.confidence}</div>
        </div>
        <div style={{ background: T.inset, borderRadius: 7, padding: "6px 8px" }}>
          <Eyebrow>Spend at risk</Eyebrow>
          <Mono s={12}>{ev.atRisk}</Mono>
        </div>
        <div style={{ background: T.inset, borderRadius: 7, padding: "6px 8px" }}>
          <Eyebrow>Curable share</Eyebrow>
          <Mono c={T.green} s={12}>{ev.curable}</Mono>
        </div>
        <div style={{ background: T.inset, borderRadius: 7, padding: "6px 8px" }}>
          <Eyebrow>Approval gap</Eyebrow>
          <Mono c={T.red} s={12}>{ev.approvalGap}</Mono>
        </div>
        <div style={{ background: T.inset, borderRadius: 7, padding: "6px 8px" }}>
          <Eyebrow>Time started</Eyebrow>
          <div style={{ fontSize: 12, fontWeight: 800, color: T.text }}>{ev.started}</div>
        </div>
      </div>
      <Eyebrow>Evidence</Eyebrow>
      {ev.evidence.slice(0, 4).map((e) => (
        <div key={e} style={{ fontSize: 11, color: T.sub, padding: "2px 0", lineHeight: 1.35 }}>
          <span style={{ color: T.green, marginRight: 5 }}>✓</span>
          {e}
        </div>
      ))}
      <Eyebrow>Action</Eyebrow>
      {ev.actions.slice(0, 3).map((a) => (
        <div key={a} style={{ fontSize: 11, color: T.sub, padding: "2px 0", lineHeight: 1.35 }}>• {a}</div>
      ))}
      <div style={{ marginTop: 6 }}><RouteChip r={ev.owner} /></div>
    </SectionCard>
  );
}

function TroubleTicketBoard() {
  const groups: { title: string; items: string[] }[] = [
    { title: "Open incident now", items: ["Tokenised CNP approval gap", "Fraud Rule R-77"] },
    { title: "Route to owner", items: ["Switch / processor attribution", "Settlement mismatch cluster"] },
    { title: "Watch closely", items: ["Utilisation migration surge", "Roll Q2-24 inflection"] },
    { title: "Obligation clock", items: ["Activation 30+7 clock"] },
  ];
  return (
    <SectionCard title="Trouble ticket board" subtitle="Grouped by action type" accent={T.amber} aiPill style={{ marginBottom: 0 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 8 }}>
        {groups.map((g) => (
          <div key={g.title} style={{ background: T.inset, border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 10px" }}>
            <Eyebrow>{g.title}</Eyebrow>
            {g.items.map((item) => (
              <div key={item} style={{ fontSize: 11, color: T.sub, padding: "3px 0 3px 8px", lineHeight: 1.35, borderLeft: `2px solid ${T.amber}55` }}>
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function RollUtilisationEarlyWarningPanel() {
  return (
    <SectionCard title="Roll & utilisation" subtitle="Advisory only" accent={T.violet} aiPill style={{ marginBottom: 0 }}>
      <div style={{ marginBottom: 8 }}>
        <Eyebrow>Utilisation migration</Eyebrow>
        <div style={{ fontSize: 12, color: T.sub }}>80%+ band: <Mono c={T.amber} s={12}>1.8×</Mono></div>
      </div>
      <div style={{ marginBottom: 8 }}>
        <Eyebrow>Projected roll impact</Eyebrow>
        <Mono c={T.red} s={14}>+9 bps</Mono>
      </div>
      <div style={{ marginBottom: 8 }}>
        <Eyebrow>Cohort</Eyebrow>
        <span style={{ fontSize: 12, color: T.text }}>Sourcing Q2</span>
      </div>
      <AIInsightStrip tone="violet">Advisory only — route to EWS / model-risk review.</AIInsightStrip>
    </SectionCard>
  );
}

function BlockerActionQueue() {
  const cols = "minmax(110px,1fr) minmax(120px,1.1fr) minmax(90px,.9fr) minmax(80px,.8fr) minmax(150px,1.3fr) minmax(80px,.8fr) minmax(70px,.7fr)";
  return (
    <SectionCard title="Blocker action queue" subtitle="Signal → evidence → owner → action" accent={T.gold} aiPill style={{ marginBottom: 0 }}>
      <div style={{ overflowX: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: cols, gap: 6, padding: "5px 8px", background: T.row, minWidth: 880 }}>
          {["Signal", "Evidence", "Impact", "Owner", "Recommended action", "Risk", "Status"].map((h) => (
            <Eyebrow key={h}>{h}</Eyebrow>
          ))}
        </div>
        {D2_BLOCKER_ACTION_ROWS.map((r) => (
          <div key={r.signal} style={{ display: "grid", gridTemplateColumns: cols, gap: 6, padding: "6px 8px", borderTop: `1px solid ${T.border}`, alignItems: "center", minWidth: 880, fontSize: 10.5 }}>
            <span style={{ fontWeight: 700, color: T.text }}>{r.signal}</span>
            <span style={{ color: T.sub }}>{r.evidence}</span>
            <span style={{ color: T.sub }}>{r.impact}</span>
            <RouteChip r={r.owner} />
            <span style={{ color: T.sub, lineHeight: 1.35 }}>{r.action}</span>
            <Pill t={r.riskT}>{r.risk}</Pill>
            <span style={{ fontSize: 9.5, color: T.muted }}>{r.status}</span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function Drill2({ go }: { go: NavigateFn }) {
  const [row, setRow] = useState("Tokenised CNP");
  const [col, setCol] = useState("Premium CNP");
  return (
    <div className="fade">
      <DrillHeader
        onBack={() => go("overview")}
        title="Where are my blockers & problems today?"
        sub="Transaction-only detection of approval drops, decline spikes, token gaps, fraud-rule misfires, activation clocks, utilisation migration and early roll-risk."
      />
      <BlockerTopGrid />
      <DeclineInvestigationGrid
        row={row}
        col={col}
        onSelect={(r, c) => {
          setRow(r);
          setCol(c);
        }}
      />
      <OwnerSplitGrid />
      <BlockerExecutionGrid />
      <BlockerActionQueue />
      <div style={{ height: 24 }} />
    </div>
  );
}
/* ═══════════════════ ROOT ═══════════════════ */
export function CardsPortfolioV2Dashboard({ onExit }: { onExit?: () => void }) {
  const [screen, setScreen] = useState("overview");
  const go: NavigateFn = (s) => {
    setScreen(s);
    if (typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div
      className="lcp"
      style={{
        background: T.bg,
        color: T.text,
        minHeight: "100vh",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
        fontWeight: 600,
        display: "grid",
        gridTemplateColumns: "72px 1fr",
      }}
    >
      <style>{`
        .lcp *{box-sizing:border-box}
        .lcp .fade{animation:lcpf .22s ease-out}@keyframes lcpf{from{opacity:.3;transform:translateY(6px)}to{opacity:1;transform:none}}
        .lcp .bigcard{transition:transform .16s ease,box-shadow .16s ease}.lcp .bigcard:hover{transform:translateY(-3px);box-shadow:0 16px 40px rgba(0,0,0,.5)}
        .lcp button:focus-visible,.lcp .bigcard:focus-visible,.lcp input:focus-visible{outline:2px solid ${T.gold};outline-offset:2px}
        .lcp input::placeholder{color:${T.dim}}
        @media (prefers-reduced-motion: reduce){.lcp .fade,.lcp .bigcard{animation:none;transition:none}}
        .lcp .overview-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
        @media (max-width:720px){.lcp .overview-cards{grid-template-columns:1fr}}
        .lcp .d2-top-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-bottom:12px}
        .lcp .d2-investigation-grid{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(300px,.85fr);gap:12px;margin-bottom:12px;align-items:start}
        .lcp .d2-owner-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-bottom:12px}
        .lcp .d2-execution-grid{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(260px,.6fr);gap:12px;margin-bottom:12px;align-items:start}
        @media (max-width:1100px){.lcp .d2-top-grid,.lcp .d2-owner-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media (max-width:1100px){.lcp .d2-investigation-grid,.lcp .d2-execution-grid{grid-template-columns:1fr}}
        @media (max-width:720px){.lcp .d2-top-grid,.lcp .d2-owner-grid,.lcp .d2-investigation-grid,.lcp .d2-execution-grid{grid-template-columns:1fr}}
      `}</style>
      <aside
        style={{
          background: T.row,
          borderRight: `1px solid ${T.border}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "16px 0",
          gap: 12,
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        <button
          type="button"
          onClick={onExit}
          title="Back to roles"
          style={{
            width: 36,
            height: 36,
            borderRadius: 11,
            background: "#241a44",
            border: `1px solid ${T.violet}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: T.violet,
            fontWeight: 900,
            cursor: onExit ? "pointer" : "default",
            fontFamily: "inherit",
            fontSize: 15,
          }}
        >
          Y
        </button>
        <div style={{ width: "55%", height: 1, background: T.border }} />
        {[CreditCard, Zap, Users, Target].map((Ic, i) => (
          <div
            key={Ic.displayName ?? i}
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: i === 0 ? T.violet : T.dim,
              background: i === 0 ? "#221a40" : "transparent",
              borderLeft:
                i === 0 ? `3px solid ${T.violet}` : "3px solid transparent",
            }}
          >
            <Ic size={17} />
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 9,
            background: T.inset,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: T.muted,
            fontSize: 12,
            fontWeight: 800,
          }}
        >
          PM
        </div>
      </aside>
      <main
        style={{ padding: "16px 22px 36px", overflow: "auto", minWidth: 0 }}
      >
        {screen === "overview" && <Overview go={go} />}
        {screen === "d1" && <Drill1 go={go} />}
        {screen === "d2" && <Drill2 go={go} />}
      </main>
      <RoleBasedUnifiedChrome
        starterQuestions={CARDS_PORTFOLIO_V2_AI_ANALYST_QUESTIONS}
        chatSubtitle={CARDS_PORTFOLIO_V2_AI_ANALYST_SUBTITLE}
        generateResponse={generateCardsPortfolioV2AIResponse}
      />
    </div>
  );
}

export default CardsPortfolioV2Dashboard;
