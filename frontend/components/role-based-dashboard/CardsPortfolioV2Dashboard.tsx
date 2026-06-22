"use client";

/**
 * LiSN — Cards Portfolio Manager (v2).
 *
 * Modelled on CreditCardsV3DrillDownScreens grammar: each drill has its OWN signature body
 * (no repeated "baseline signals" block). Shared primitives only: SectionCard (✨ AI pill),
 * AIInsightStrip, Mono, route/brand pills. JH near-black palette.
 *
 *   Overview        → 3 question cards + distillation scatter + today's routed signals (ranked, once)
 *   Drill 1 Offers  → Command Center grid + AI Summary Wall (expand) + "Where is spend leaking?" (select→detail)
 *   Drill 2 Blockers→ Decline heatmap (select cell) + Incident pack + Problem board (kanban)
 *   Drill 3 Voice   → Correlation hero + Join-proof (select signal→detail) + roadmap grid + governance
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
  Radio,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TriangleAlert,
  Users,
  Zap,
} from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
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
};

/* ───────────── data types ───────────── */
type TrendPoint = { v: number };
type DeclinePart = { cause: string; v: number; c: string };
type CorrPoint = { t: string; d: number; c: number };
type DistillRow = {
  n: string;
  id: string;
  dev: number;
  impact: number;
  route: string;
  sub?: boolean;
};
type RoutedRow = {
  id: string;
  n: string;
  band: [number, number];
  val: number;
  max: number;
  dev: string;
  impact: string;
  route: string;
  sev: string;
  feed?: boolean;
  obl?: boolean;
};
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
type ReasonInfo = {
  cause: string;
  owner: string;
  risk: string;
  curable: string;
  conf: string;
  parts: DeclinePart[];
  ticket: string;
};
type BoardItem = {
  sev: string;
  n: string;
  id: string;
  metric: string;
  route: string;
  feed?: boolean;
  obl?: boolean;
  adv?: boolean;
};
type JoinRow = {
  id: string;
  sig: string;
  from: string;
  voice: string;
  link: number;
  theme: string;
  outcome: string;
  owner: string;
  mb: string;
};
type VoiceUc = { id: string; n: string; link: number; why: string };

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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
        marginBottom: 14,
      }}
    >
      <div>
        <div style={{ fontSize: 21, fontWeight: 900, letterSpacing: "-.02em" }}>
          Cards Portfolio Manager{" "}
          <span style={{ color: T.dim, fontWeight: 600, fontSize: 14 }}>
            · Suvarna Bank
          </span>
        </div>
        <div style={{ color: T.muted, fontSize: 12.5, marginTop: 2 }}>
          Transactions first · the voice join is the second move
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: T.row,
          border: `1px solid ${T.border}`,
          borderRadius: 10,
          padding: "9px 12px",
          minWidth: 250,
        }}
      >
        <Search size={15} color={T.dim} />
        <input
          placeholder="Ask LiSN — which offer should I kill today?"
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            color: T.sub,
            fontSize: 12.5,
            fontFamily: "inherit",
            width: "100%",
            fontWeight: 600,
          }}
        />
        <span
          style={{
            background: `${T.gold}20`,
            color: T.gold,
            fontSize: 9,
            fontWeight: 800,
            padding: "2px 6px",
            borderRadius: 4,
          }}
        >
          ✨
        </span>
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
  chips: ReactNode;
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
const DECLINE_PARTS: DeclinePart[] = [
  { cause: "Token / CoFT", v: 9, c: "red" },
  { cause: "Fraud rule", v: 4, c: "amber" },
  { cause: "Limit / NSF", v: 3, c: "yellow" },
  { cause: "3DS / OTP", v: 1.5, c: "cyan" },
  { cause: "Behaviour", v: 0.5, c: "green" },
];
const CORR: CorrPoint[] = [
  { t: "08:00", d: 8, c: 100 },
  { t: "09:00", d: 8.2, c: 104 },
  { t: "10:00", d: 8.1, c: 101 },
  { t: "11:00", d: 12, c: 150 },
  { t: "12:00", d: 18, c: 268 },
  { t: "13:00", d: 23, c: 372 },
  { t: "14:00", d: 26, c: 418 },
];
const DISTILL: DistillRow[] = [
  { n: "Tokenised CNP gap", id: "MA13", dev: 3.1, impact: 2.4, route: "ops" },
  { n: "Curable declines", id: "MA1", dev: 1.9, impact: 2.4, route: "cards" },
  { n: "Fraud-rule R-77", id: "MA2", dev: 2.6, impact: 1.1, route: "fraud" },
  { n: "Offer O-142", id: "MA4", dev: 2.3, impact: 0.78, route: "mktg" },
  { n: "Activation 4471", id: "MA9", dev: 1.7, impact: 0.93, route: "conduct" },
  { n: "Yield leakage", id: "MA7", dev: 1.2, impact: 1.2, route: "fin" },
  { n: "Util migration", id: "T2-13", dev: 1.6, impact: 0.5, route: "risk" },
  {
    n: "POS approvals",
    id: "—",
    dev: 0.6,
    impact: 0.3,
    route: "ops",
    sub: true,
  },
  { n: "EMI mix", id: "—", dev: 0.8, impact: 0.5, route: "fin", sub: true },
  {
    n: "Mass spend",
    id: "—",
    dev: 0.4,
    impact: 0.9,
    route: "cards",
    sub: true,
  },
  {
    n: "Reversal base",
    id: "—",
    dev: 0.9,
    impact: 0.6,
    route: "fin",
    sub: true,
  },
  { n: "3DS base", id: "—", dev: 1.2, impact: 0.25, route: "ops", sub: true },
];
const ROUTED: RoutedRow[] = [
  {
    id: "MA13",
    n: "Tokenised CNP approval gap",
    band: [2, 5],
    val: 14,
    max: 18,
    dev: "+9 pts",
    impact: "₹2.4 Cr",
    route: "ops",
    sev: "red",
    feed: true,
  },
  {
    id: "MA1",
    n: "Curable-decline recovery",
    band: [20, 45],
    val: 62,
    max: 80,
    dev: "+38%",
    impact: "₹2.4 Cr",
    route: "cards",
    sev: "amber",
  },
  {
    id: "MA2",
    n: "Fraud-rule R-77 step-change",
    band: [90, 96],
    val: 81,
    max: 100,
    dev: "−13 pts",
    impact: "GMV",
    route: "fraud",
    sev: "red",
    feed: true,
  },
  {
    id: "MA9",
    n: "Activation vs 30+7 clock",
    band: [68, 75],
    val: 58,
    max: 100,
    dev: "−13 pts",
    impact: "₹93 L",
    route: "conduct",
    sev: "amber",
    obl: true,
  },
  {
    id: "MA4",
    n: "Offer O-142 cannibalisation",
    band: [55, 80],
    val: 18,
    max: 100,
    dev: "lift −62%",
    impact: "₹78 L",
    route: "mktg",
    sev: "amber",
  },
];

function MiniSpark({ data, c }: { data: TrendPoint[]; c: string }) {
  return (
    <div style={{ height: 64 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 6, right: 2, left: 2, bottom: 0 }}
        >
          <Line
            type="monotone"
            dataKey="v"
            stroke={c}
            strokeWidth={2.4}
            dot={false}
            isAnimationActive={false}
          />
          <YAxis hide domain={["dataMin", "dataMax"]} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
function AttributionBar({
  parts,
  total,
  unit = "pt",
}: {
  parts: DeclinePart[];
  total: number;
  unit?: string;
}) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          height: 28,
          borderRadius: 7,
          overflow: "hidden",
          border: `1px solid ${T.border}`,
        }}
      >
        {parts.map((p) => (
          <div
            key={p.cause}
            title={`${p.cause} ${p.v}${unit}`}
            style={{
              width: `${(p.v / total) * 100}%`,
              background: tone(p.c),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              fontFamily: MONO,
              fontWeight: 800,
              color: "#0d0d0d",
            }}
          >
            {p.v}
          </div>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(108px,1fr))",
          gap: 6,
          marginTop: 9,
        }}
      >
        {parts.map((p) => (
          <span
            key={p.cause}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 10.5,
              color: T.sub,
            }}
          >
            <Dot c={tone(p.c)} sq />
            {p.cause}{" "}
            <Mono c={tone(p.c)} s={10.5}>
              {p.v}
              {unit}
            </Mono>
          </span>
        ))}
      </div>
    </div>
  );
}
function BaselineBar({
  band,
  val,
  max,
  sev = "amber",
  h = 22,
}: {
  band: [number, number];
  val: number;
  max: number;
  sev?: string;
  h?: number;
}) {
  const c = tone(sev);
  const p = (v: number) => Math.max(0, Math.min(100, (v / max) * 100));
  const below = val < band[0];
  const bl = below ? p(val) : p(band[1]);
  const bw = below ? p(band[0]) - p(val) : p(val) - p(band[1]);
  return (
    <div
      style={{
        position: "relative",
        height: h,
        background: T.inset,
        borderRadius: 6,
        border: `1px solid ${T.inner}`,
        overflow: "hidden",
      }}
      title={`band ${band[0]}–${band[1]} · now ${val}`}
    >
      <div
        style={{
          position: "absolute",
          left: `${p(band[0])}%`,
          width: `${p(band[1]) - p(band[0])}%`,
          top: 0,
          bottom: 0,
          background: `${T.muted}26`,
          borderLeft: `1px dashed ${T.dim}`,
          borderRight: `1px dashed ${T.dim}`,
        }}
      />
      {(val > band[1] || below) && (
        <div
          style={{
            position: "absolute",
            left: `${bl}%`,
            width: `${Math.max(0, bw)}%`,
            top: 4,
            bottom: 4,
            background: `${c}66`,
            borderRadius: 3,
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          left: `calc(${p(val)}% - 1.5px)`,
          top: -1,
          bottom: -1,
          width: 3,
          background: c,
        }}
      />
    </div>
  );
}
function ScatterTip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: DistillRow }>;
}) {
  if (!active || !payload || !payload[0]) return null;
  const d = payload[0].payload;
  return (
    <div style={{ ...TIP, padding: "7px 9px", fontWeight: 700 }}>
      {d.n} · {d.id}
      <br />
      <span style={{ color: T.muted }}>
        {d.dev}σ · ₹{d.impact} Cr · {ROUTE[d.route].l}
      </span>
    </div>
  );
}
function BigCard({
  icon,
  iTone,
  title,
  sub,
  score,
  scoreC,
  delta,
  deltaC,
  visual,
  kpis,
  route,
  accent,
  onClick,
}: {
  icon: ReactNode;
  iTone: string;
  title: string;
  sub: string;
  score: string;
  scoreC?: string;
  delta: string;
  deltaC?: string;
  visual: ReactNode;
  kpis: [string, string, string][];
  route: string;
  accent: string;
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
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        cursor: "pointer",
        minHeight: 320,
        color: "inherit",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", gap: 11 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `${tone(iTone)}22`,
              color: tone(iTone),
            }}
          >
            {icon}
          </div>
          <div>
            <div
              style={{
                fontSize: 17,
                fontWeight: 800,
                letterSpacing: "-.02em",
                lineHeight: 1.15,
              }}
            >
              {title}
            </div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 3 }}>
              {sub}
            </div>
          </div>
        </div>
        <ChevronRight size={26} color={T.dim} />
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <div
          style={{
            fontSize: 32,
            fontWeight: 900,
            letterSpacing: "-.04em",
            fontFamily: MONO,
            color: scoreC || T.text,
          }}
        >
          {score}
        </div>
        <Mono c={deltaC || T.red} s={13}>
          {delta}
        </Mono>
      </div>
      <div style={{ flex: 1 }}>{visual}</div>
      <div style={{ display: "flex", gap: 16 }}>
        {kpis.map((k) => (
          <div key={k[0]}>
            <Eyebrow>{k[0]}</Eyebrow>
            <Mono c={tone(k[2])} s={15}>
              {k[1]}
            </Mono>
          </div>
        ))}
      </div>
      <div style={{ borderTop: `1px solid ${T.inner}`, paddingTop: 9 }}>
        <RouteChip r={route} />
      </div>
    </button>
  );
}

function Overview({ go }: { go: (s: string) => void }) {
  return (
    <div className="fade">
      <TopBar />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
          gap: 14,
        }}
      >
        <BigCard
          accent="cyan"
          iTone="cyan"
          icon={<CreditCard size={18} />}
          title="Transactions & offers"
          sub="growth · brand · offer keep-kill"
          score="66"
          delta="−6 pts"
          route="cards"
          kpis={[
            ["Spend", "+3.8%", "green"],
            ["Profitable", "−6.4%", "red"],
            ["Leakage", "₹78L", "red"],
          ]}
          visual={
            <>
              <MiniSpark data={TREND.g} c={T.green} />
              <Eyebrow>gross holds · profitable diverges</Eyebrow>
            </>
          }
          onClick={() => go("d1")}
        />
        <BigCard
          accent="red"
          iTone="red"
          icon={<Zap size={18} />}
          title="Blockers today"
          sub="declines · auth · token · fraud-rule"
          score="58"
          delta="−10 pts"
          route="ops"
          kpis={[
            ["Decline idx", "88", "red"],
            ["Token gap", "14pt", "red"],
            ["Curable", "62%", "green"],
          ]}
          visual={
            <div>
              <Eyebrow>+18 pt decline spike, attributed</Eyebrow>
              <div style={{ marginTop: 8 }}>
                <AttributionBar parts={DECLINE_PARTS} total={18} />
              </div>
            </div>
          }
          onClick={() => go("d2")}
        />
        <BigCard
          accent="violet"
          iTone="violet"
          icon={<Users size={18} />}
          title="Customer voice"
          sub="later · txn × voice join"
          score="Later"
          scoreC={T.violet}
          delta="differentiated"
          deltaC={T.violet}
          route="ops"
          kpis={[
            ["Signal", "×4", "violet"],
            ["Link", "87%", "violet"],
            ["Cause", "Token", "red"],
          ]}
          visual={
            <>
              <div style={{ height: 64 }}>
                <ResponsiveContainer>
                  <ComposedChart
                    data={CORR}
                    margin={{ top: 6, right: 2, left: 2, bottom: 0 }}
                  >
                    <Line
                      yAxisId="l"
                      type="monotone"
                      dataKey="d"
                      stroke={T.red}
                      strokeWidth={2.2}
                      dot={false}
                      isAnimationActive={false}
                    />
                    <YAxis yAxisId="l" hide />
                    <YAxis yAxisId="r" orientation="right" hide />
                    <Line
                      yAxisId="r"
                      type="monotone"
                      dataKey="c"
                      stroke={T.violet}
                      strokeWidth={2.2}
                      strokeDasharray="5 3"
                      dot={false}
                      isAnimationActive={false}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <Eyebrow>declines + “payment failed” calls</Eyebrow>
            </>
          }
          onClick={() => go("d3")}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1.1fr) minmax(0,1fr)",
          gap: 14,
          marginTop: 24,
          alignItems: "stretch",
        }}
      >
        <SectionCard
          title="What surfaced today"
          subtitle="Distilled from 2,418 baselines → 5 routed · impact × deviation"
          accent={T.gold}
          aiPill
          right={
            <span style={{ fontSize: 10, color: T.muted, fontFamily: MONO }}>
              2418 → 37 → 7 → 5
            </span>
          }
        >
          <div style={{ height: 234 }}>
            <ResponsiveContainer>
              <ScatterChart margin={{ top: 12, right: 14, left: 2, bottom: 6 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.inner} />
                <XAxis
                  type="number"
                  dataKey="dev"
                  domain={[0, 3.4]}
                  stroke={T.dim}
                  fontSize={10}
                  tickLine={false}
                  label={{
                    value: "deviation (σ)",
                    fill: T.muted,
                    fontSize: 10,
                    position: "insideBottom",
                    dy: 12,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="impact"
                  domain={[0, 2.8]}
                  stroke={T.dim}
                  fontSize={10}
                  tickLine={false}
                  width={30}
                  tickFormatter={(v) => `₹${v}`}
                />
                <ZAxis type="number" dataKey="impact" range={[50, 300]} />
                <ReferenceLine
                  x={1.5}
                  stroke={`${T.gold}88`}
                  strokeDasharray="4 3"
                  label={{
                    value: "surface ≥1.5σ",
                    fill: T.gold,
                    fontSize: 9,
                    position: "top",
                  }}
                />
                <Tooltip
                  content={<ScatterTip />}
                  cursor={{ strokeDasharray: "3 3", stroke: T.dim }}
                />
                <Scatter data={DISTILL}>
                  {DISTILL.map((d) => (
                    <Cell
                      key={`${d.id}-${d.n}`}
                      fill={d.sub ? `${T.dim}99` : ROUTE[d.route].c}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div
            style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 4 }}
          >
            {Object.entries(ROUTE).map(([k, m]) => (
              <span
                key={k}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 10,
                  color: T.muted,
                }}
              >
                <Dot c={m.c} />
                {m.l}
              </span>
            ))}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontSize: 10,
                color: T.muted,
              }}
            >
              <Dot c={T.dim} />
              suppressed
            </span>
          </div>
        </SectionCard>

        <SectionCard
          title="Today's routed signals"
          subtitle="Ranked by impact × deviation — each vs its own band"
          accent={T.red}
          aiPill
        >
          {ROUTED.map((s) => (
            <div
              key={s.id}
              style={{
                display: "grid",
                gridTemplateColumns:
                  "minmax(140px,1.3fr) minmax(110px,1.5fr) 84px 110px",
                gap: 10,
                alignItems: "center",
                padding: "8px 6px",
                borderBottom: `1px solid ${T.border}`,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  minWidth: 0,
                }}
              >
                <Dot c={tone(s.sev)} />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: T.text,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {s.n}
                </span>
                <span style={{ fontSize: 8.5, fontFamily: MONO, color: T.dim }}>
                  {s.id}
                </span>
                {s.feed && <Radio size={10} color={T.amber} />}
                {s.obl && <Pill t="amber">OBL</Pill>}
              </span>
              <BaselineBar band={s.band} val={s.val} max={s.max} sev={s.sev} />
              <Mono c={tone(s.sev)} s={11.5}>
                {s.dev}
              </Mono>
              <RouteChip r={s.route} />
            </div>
          ))}
          <div style={{ marginTop: 10 }}>
            <AIInsightStrip tone="red">
              Top signal is a{" "}
              <b style={{ color: T.text }}>tokenisation break</b>, not behaviour
              — route to Ops, recover ₹2.4 Cr.
            </AIInsightStrip>
          </div>
        </SectionCard>
      </div>
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
    metric: "₹61 L net leak",
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

function Drill1({ go }: { go: (s: string) => void }) {
  return (
    <div className="fade">
      <DrillHeader
        onBack={() => go("overview")}
        title="How are my transactions & offers doing?"
        sub="Growth, brand / co-brand performance, offer keep-kill, reward cost and profitable spend — from transaction data alone."
        chips={
          <>
            <Chip t="cyan">Transaction-only</Chip>
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
      <div style={{ marginTop: 14 }}>
        <SectionCard title="Ask LiSN" subtitle="natural-language">
          <NLRow
            queries={[
              ["Growth", "which cohorts are flat?"],
              ["Offers", "which offer should I kill?"],
              ["Economics", "is growth profitable or reward-heavy?"],
              ["Drift", "which premium cohort is losing profitability?"],
            ]}
          />
        </SectionCard>
      </div>
      <div style={{ height: 44 }} />
    </div>
  );
}

/* ═══════════════════ DRILL 2 — BLOCKERS (heatmap + incident + board signature) ═══════════════════ */
const HEAT_COLS = ["Prem CNP", "Prem POS", "Mass CNP", "Co-brand", "New"];
const HEAT_ROWS: { label: string; cells: number[] }[] = [
  { label: "Insufficient funds", cells: [88, 46, 41, 36, 22] },
  { label: "3DS / OTP fail", cells: [54, 20, 38, 31, 67] },
  { label: "Token expiry", cells: [72, 12, 24, 44, 18] },
  { label: "Fraud rule", cells: [61, 19, 33, 29, 81] },
  { label: "Limit / velocity", cells: [28, 41, 35, 22, 19] },
  { label: "Switch / processor", cells: [57, 48, 30, 74, 26] },
];
const REASON_INFO: Record<string, ReasonInfo> = {
  "Token expiry": {
    cause: "Token / ACS route",
    owner: "ops",
    risk: "₹2.4 Cr",
    curable: "—",
    conf: "High",
    parts: [
      { cause: "Token / CoFT", v: 9, c: "red" },
      { cause: "Fraud rule", v: 4, c: "amber" },
      { cause: "Limit / NSF", v: 3, c: "yellow" },
      { cause: "3DS / OTP", v: 1.5, c: "cyan" },
      { cause: "Behaviour", v: 0.5, c: "green" },
    ],
    ticket:
      "Premium CNP tokenised approvals dropped 14 pts after a route update — inspect token requestor & ACS path for BIN group P-44.",
  },
  "Insufficient funds": {
    cause: "Limit / NSF at cycle",
    owner: "cards",
    risk: "₹2.4 Cr",
    curable: "62%",
    conf: "High",
    parts: [
      { cause: "Limit / NSF", v: 11, c: "yellow" },
      { cause: "Token / CoFT", v: 3, c: "red" },
      { cause: "3DS / OTP", v: 2, c: "cyan" },
      { cause: "Behaviour", v: 2, c: "green" },
    ],
    ticket:
      "Curable insufficient-funds cluster at month-end — draft EMI / OVL re-prompt to the eligible sub-segment (62% curable).",
  },
  "3DS / OTP fail": {
    cause: "3DS / OTP friction",
    owner: "ops",
    risk: "₹1.1 Cr",
    curable: "48%",
    conf: "Med",
    parts: [
      { cause: "3DS / OTP", v: 10, c: "cyan" },
      { cause: "Token / CoFT", v: 3, c: "red" },
      { cause: "Fraud rule", v: 2, c: "amber" },
      { cause: "Behaviour", v: 1, c: "green" },
    ],
    ticket:
      "OTP / 3DS failure spike on new-to-bank — inspect ACS challenge flow and OTP gateway latency.",
  },
  "Fraud rule": {
    cause: "Fraud-rule over-block",
    owner: "fraud",
    risk: "GMV",
    curable: "—",
    conf: "High",
    parts: [
      { cause: "Fraud rule", v: 12, c: "amber" },
      { cause: "Token / CoFT", v: 2, c: "red" },
      { cause: "Limit / NSF", v: 2, c: "yellow" },
      { cause: "Behaviour", v: 1, c: "green" },
    ],
    ticket:
      "Rule R-77 over-blocks tenured customers (−13 pts approval, good-blocks +210%) — recommend rollback / parameter review.",
  },
  "Limit / velocity": {
    cause: "Velocity limit",
    owner: "risk",
    risk: "9 bps",
    curable: "—",
    conf: "Med",
    parts: [
      { cause: "Limit / NSF", v: 9, c: "yellow" },
      { cause: "Behaviour", v: 4, c: "green" },
      { cause: "Fraud rule", v: 2, c: "amber" },
    ],
    ticket:
      "Velocity-limit declines clustering — advisory to Risk; candidate for proactive limit / EMI engagement (advisory only).",
  },
  "Switch / processor": {
    cause: "Switch / processor route",
    owner: "ops",
    risk: "₹68 L/hr",
    curable: "—",
    conf: "High",
    parts: [
      { cause: "Switch / route", v: 10, c: "red" },
      { cause: "Token / CoFT", v: 4, c: "amber" },
      { cause: "3DS / OTP", v: 2, c: "cyan" },
    ],
    ticket:
      "Technical-decline excursion isolated to co-brand acquirer route — open Ops/Tech incident; ₹68 L/hr at risk.",
  },
};
const heatTone = (v: number): string =>
  v >= 70 ? T.red : v >= 45 ? T.amber : v >= 30 ? "#caa23a" : T.green;

const D2_BOARD: BoardItem[] = [
  {
    sev: "critical",
    n: "Tokenised CNP approval gap",
    id: "MA13",
    metric: "+9 pts · ₹2.4 Cr",
    route: "ops",
    feed: true,
  },
  {
    sev: "critical",
    n: "Fraud rule R-77 misfire",
    id: "MA2",
    metric: "−13 pts approval",
    route: "fraud",
    feed: true,
  },
  {
    sev: "high",
    n: "Weak-auth liability cluster",
    id: "MB3",
    metric: "47 auths no-factor",
    route: "conduct",
    obl: true,
    feed: true,
  },
  {
    sev: "high",
    n: "Activation vs 30+7 clock",
    id: "MA9",
    metric: "6.2k cards · ₹93 L",
    route: "conduct",
    obl: true,
  },
  {
    sev: "watch",
    n: "Utilisation migration surge",
    id: "T2-13",
    metric: "1.8× crossing 80%",
    route: "risk",
    adv: true,
  },
  {
    sev: "watch",
    n: "Curable-decline recovery",
    id: "MA1",
    metric: "62% curable · ₹2.4 Cr",
    route: "cards",
  },
];
const sevMeta: Record<string, { l: string; c: string }> = {
  critical: { l: "Critical", c: T.red },
  high: { l: "High", c: T.amber },
  watch: { l: "Watch", c: T.yellow },
};

function Drill2({ go }: { go: (s: string) => void }) {
  const [reason, setReason] = useState("Token expiry");
  const [cohort, setCohort] = useState("Prem CNP");
  const info = REASON_INFO[reason];
  const total = info.parts.reduce((s, p) => s + p.v, 0);
  return (
    <div className="fade">
      <DrillHeader
        onBack={() => go("overview")}
        title="Where are my blockers / problems today?"
        sub="Decline heatmap, auth, fraud-rule, token and switch issues — ticket-ready, attributed to a cause, with no customer voice mixed in."
        chips={
          <>
            <Chip t="red">Ticket / escalation</Chip>
            <Chip t="cyan">Transaction-only</Chip>
          </>
        }
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1.3fr) minmax(0,1fr)",
          gap: 12,
          alignItems: "start",
        }}
      >
        <SectionCard
          title="Decline-index heatmap"
          subtitle="Reason × cohort · tap a cell to open the incident"
          accent={T.red}
          aiPill
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `132px repeat(${HEAT_COLS.length},1fr)`,
              gap: 5,
            }}
          >
            <div />
            {HEAT_COLS.map((c) => (
              <div
                key={c}
                style={{
                  fontSize: 9,
                  color: T.muted,
                  textAlign: "center",
                  textTransform: "uppercase",
                }}
              >
                {c}
              </div>
            ))}
            {HEAT_ROWS.map((r) => (
              <Frag key={r.label}>
                <div
                  style={{ fontSize: 11, color: T.sub, alignSelf: "center" }}
                >
                  {r.label}
                </div>
                {r.cells.map((v, i) => {
                  const c = heatTone(v);
                  const active = reason === r.label && cohort === HEAT_COLS[i];
                  return (
                    <button
                      type="button"
                      key={HEAT_COLS[i]}
                      onClick={() => {
                        setReason(r.label);
                        setCohort(HEAT_COLS[i]);
                      }}
                      style={{
                        cursor: "pointer",
                        minHeight: 32,
                        borderRadius: 6,
                        background: `${c}d9`,
                        border: active ? `2px solid #fff` : `1px solid ${c}`,
                        fontFamily: MONO,
                        fontWeight: 800,
                        fontSize: 12,
                        color: v >= 30 ? "#0d0d0d" : "#fff",
                      }}
                    >
                      {v}
                    </button>
                  );
                })}
              </Frag>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              gap: 14,
              marginTop: 11,
              paddingTop: 8,
              borderTop: `1px solid ${T.inner}`,
            }}
          >
            {(
              [
                [T.green, "<30"],
                [T.amber, "45–69"],
                [T.red, "≥70"],
              ] as [string, string][]
            ).map(([c, l]) => (
              <span
                key={l}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 10,
                  color: T.muted,
                }}
              >
                <span
                  style={{
                    width: 11,
                    height: 11,
                    borderRadius: 3,
                    background: c,
                  }}
                />
                {l}
              </span>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Incident pack"
          subtitle={`${reason} × ${cohort}`}
          accent={tone(sevMeta.critical.c === heatTone(80) ? "red" : "amber")}
          aiPill
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <Mono c={T.red} s={24}>
              {info.risk}
            </Mono>
            <span style={{ fontSize: 11, color: T.muted }}>
              at risk · cause: {info.cause}
            </span>
          </div>
          <Eyebrow>Decline delta, attributed</Eyebrow>
          <div style={{ marginTop: 8, marginBottom: 12 }}>
            <AttributionBar parts={info.parts} total={total} />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 8,
              padding: 11,
              borderRadius: 10,
              background: T.inset,
              marginBottom: 11,
            }}
          >
            {(
              [
                ["Curable", info.curable],
                ["Owner", ROUTE[info.owner].l],
                ["Confidence", info.conf],
              ] as [string, string][]
            ).map(([l, v]) => (
              <div key={l}>
                <Eyebrow>{l}</Eyebrow>
                <div style={{ fontSize: 12.5, fontWeight: 800, color: T.text }}>
                  {v}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              border: `1px solid ${T.gold}40`,
              background: `${T.gold}10`,
              borderRadius: 10,
              padding: 11,
            }}
          >
            <Eyebrow c={T.gold}>✨ Draft ticket</Eyebrow>
            <div
              style={{
                fontSize: 12.5,
                color: T.sub,
                lineHeight: 1.5,
                marginTop: 4,
              }}
            >
              “{info.ticket}”
            </div>
            <div style={{ marginTop: 8 }}>
              <RouteChip r={info.owner} />
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Today's problem board"
        subtitle="Ticket-ready, grouped by severity · routed to an owner"
        accent={T.red}
        aiPill
        style={{ marginTop: 14 }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,minmax(0,1fr))",
            gap: 12,
            alignItems: "start",
          }}
        >
          {["critical", "high", "watch"].map((sv) => {
            const m = sevMeta[sv];
            const items = D2_BOARD.filter((x) => x.sev === sv);
            return (
              <div key={sv}>
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
                    key={x.id}
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
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 6,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12.5,
                          fontWeight: 700,
                          color: T.text,
                          lineHeight: 1.25,
                        }}
                      >
                        {x.n}
                      </span>
                      <span
                        style={{
                          fontSize: 8.5,
                          fontFamily: MONO,
                          color: T.dim,
                        }}
                      >
                        {x.id}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        margin: "7px 0",
                        flexWrap: "wrap",
                      }}
                    >
                      <Mono c={m.c} s={11}>
                        {x.metric}
                      </Mono>
                      {x.feed && <Radio size={11} color={T.amber} />}
                      {x.obl && <Pill t="amber">OBL</Pill>}
                      {x.adv && <Pill t="cyan">ADV</Pill>}
                    </div>
                    <RouteChip r={x.route} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </SectionCard>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(330px,1fr))",
          gap: 14,
          marginTop: 14,
        }}
      >
        <SectionCard
          title="Distillation"
          subtitle="why you see three, not three hundred"
          accent={T.cyan}
          aiPill
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 10,
            }}
          >
            {(
              [
                ["2,418", "baselines"],
                ["37", "abnormal"],
                ["7", "candidates"],
                ["3", "routed"],
              ] as [string, string][]
            ).map((s, i) => (
              <div
                key={s[0]}
                style={{
                  position: "relative",
                  background: T.inset,
                  border: `1px solid ${T.border}`,
                  borderRadius: 10,
                  padding: "13px 8px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 22,
                    fontFamily: MONO,
                    fontWeight: 900,
                    color: i === 3 ? T.gold : T.text,
                  }}
                >
                  {s[0]}
                </div>
                <Eyebrow>{s[1]}</Eyebrow>
                {i < 3 && (
                  <span
                    style={{
                      position: "absolute",
                      right: -11,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: T.dim,
                      fontWeight: 900,
                    }}
                  >
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            <AIInsightStrip tone="cyan">
              Per-cell seasonal baselines + a minimum-₹ floor keep the morning
              brief to the few worth acting on.
            </AIInsightStrip>
          </div>
        </SectionCard>
        <SectionCard
          title="Ask LiSN"
          subtitle="natural-language"
          accent={T.gold}
        >
          <NLRow
            queries={[
              ["Cause", "fraud-rule, token, 3DS or processor?"],
              ["Segment", "which segment is hardest hit?"],
              ["Recover", "how much of the spike is curable?"],
              ["Obligation", "which batches near 30+7 closure?"],
            ]}
          />
        </SectionCard>
      </div>
      <div style={{ height: 44 }} />
    </div>
  );
}
function Frag({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

/* ═══════════════════ DRILL 3 — VOICE JOIN (correlation + proof signature) ═══════════════════ */
const JOIN: JoinRow[] = [
  {
    id: "tok",
    sig: "Token CNP gap",
    from: "Card 2",
    voice: "“payment failed” ×4.1",
    link: 87,
    theme:
      "“Tried 3 times, my card keeps getting declined online since this morning.”",
    outcome: "Customer pain — silent leakage made visible",
    owner: "ops",
    mb: "MB1",
  },
  {
    id: "off",
    sig: "Offer O-142",
    from: "Card 1",
    voice: "reward-confusion ×2.3",
    link: 64,
    theme: "“The cashback I was promised never came — is this a scam?”",
    outcome: "Mis-selling / MITC exposure",
    owner: "mktg",
    mb: "MB6",
  },
  {
    id: "decay",
    sig: "Co-brand spend decay",
    from: "Card 1",
    voice: "switch-intent ×3.0",
    link: 70,
    theme: "“How do I close this card? Competitor gives the same lounge free.”",
    outcome: "True attrition, not merchant softness",
    owner: "cards",
    mb: "MB10",
  },
  {
    id: "act",
    sig: "Activation lag (Batch 4471)",
    from: "Card 2",
    voice: "“can’t set PIN” ×2.8",
    link: 58,
    theme: "“App won’t let me set the PIN, so I never used the card.”",
    outcome: "Broken flow vs genuine disinterest",
    owner: "conduct",
    mb: "MB-act",
  },
];
const VOICE_UCS: VoiceUc[] = [
  {
    id: "MB1",
    n: "Decline spike ↔ voice",
    link: 87,
    why: "decline codes hold no pain",
  },
  {
    id: "MB2",
    n: "Fraud-rule, voice-confirmed",
    link: 80,
    why: "rules miss switch intent",
  },
  {
    id: "MB5",
    n: "Ombudsman pre-empt",
    link: 74,
    why: "no IO clock in txn data",
  },
  { id: "MB4", n: "Hardship → roll-rate", link: 69, why: "hardship is spoken" },
  {
    id: "MB6",
    n: "Offer → complaint echo",
    link: 64,
    why: "redemption ≠ confusion",
  },
  {
    id: "MB7",
    n: "Switch incident ↔ impact",
    link: 71,
    why: "infra-green ≠ pain-free",
  },
  {
    id: "MB10",
    n: "Co-brand churn ↔ intent",
    link: 70,
    why: "decay ≠ proof of churn",
  },
  {
    id: "MB9",
    n: "Reversal fail ↔ voice",
    link: 58,
    why: "ledgers hide anxiety",
  },
];

function Drill3({ go }: { go: (s: string) => void }) {
  const [sel, setSel] = useState("tok");
  const j = JOIN.find((x) => x.id === sel) || JOIN[0];
  return (
    <div className="fade">
      <DrillHeader
        onBack={() => go("overview")}
        title="What are customers calling about — and is it linked to a problem?"
        sub="The later, differentiated card: transaction × complaint / voice / social. The only place the join appears — kept out of Cards 1 & 2."
        chips={
          <>
            <Chip t="violet">Later capability</Chip>
            <Chip t="gold">Nobody-else-can-do</Chip>
          </>
        }
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1.2fr) minmax(0,1fr)",
          gap: 12,
          alignItems: "start",
        }}
      >
        <SectionCard
          title="Tokenised CNP declines ↔ “payment failed” calls"
          subtitle="same cohort · same 11:00 trigger · one timeline"
          accent={T.violet}
          aiPill
        >
          <div
            style={{
              height: 198,
              background: "#0b0b0e",
              border: `1px solid ${T.violet}3a`,
              borderRadius: 12,
              padding: 6,
            }}
          >
            <ResponsiveContainer>
              <ComposedChart
                data={CORR}
                margin={{ top: 10, right: 8, left: -18, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={T.inner}
                  vertical={false}
                />
                <XAxis
                  dataKey="t"
                  stroke={T.dim}
                  fontSize={10}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="l"
                  stroke={T.red}
                  fontSize={10}
                  width={26}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="r"
                  orientation="right"
                  stroke={T.violet}
                  fontSize={10}
                  width={30}
                  tickLine={false}
                />
                <Tooltip contentStyle={TIP} />
                <ReferenceLine
                  yAxisId="l"
                  x="11:00"
                  stroke={T.gold}
                  strokeDasharray="4 3"
                  label={{
                    value: "route change",
                    fill: T.gold,
                    fontSize: 9,
                    position: "insideTopRight",
                  }}
                />
                <Line
                  yAxisId="l"
                  type="monotone"
                  dataKey="d"
                  name="Declines %"
                  stroke={T.red}
                  strokeWidth={2.6}
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  yAxisId="r"
                  type="monotone"
                  dataKey="c"
                  name="Calls (idx)"
                  stroke={T.violet}
                  strokeWidth={2.6}
                  strokeDasharray="6 4"
                  dot={false}
                  isAnimationActive={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: 10 }}>
            <AIInsightStrip tone="violet">
              <b style={{ color: T.text }}>87% temporal match</b> — the decline
              is now felt as customer pain. CX gets the early read weeks before
              an ombudsman case.
            </AIInsightStrip>
          </div>
        </SectionCard>

        <SectionCard
          title="Join proof"
          subtitle="tap a transaction signal → what customers actually said"
          accent={T.violet}
          aiPill
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 7,
              marginBottom: 12,
            }}
          >
            {JOIN.map((x) => {
              const active = x.id === sel;
              return (
                <button
                  type="button"
                  key={x.id}
                  onClick={() => setSel(x.id)}
                  style={{
                    textAlign: "left",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: 8,
                    alignItems: "center",
                    padding: "9px 11px",
                    borderRadius: 9,
                    border: `1px solid ${active ? T.violet : T.border}`,
                    borderLeft: `3px solid ${T.violet}`,
                    background: active ? `${T.violet}16` : T.inset,
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 7,
                      minWidth: 0,
                    }}
                  >
                    <Pill t="violet" solid>
                      {x.mb}
                    </Pill>
                    <span
                      style={{
                        fontSize: 12.5,
                        fontWeight: 700,
                        color: T.text,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {x.sig}
                    </span>
                    <span style={{ fontSize: 9.5, color: T.dim }}>
                      {x.from}
                    </span>
                  </span>
                  <Mono c={T.violet} s={11}>
                    {x.link}%
                  </Mono>
                </button>
              );
            })}
          </div>
          <div
            style={{
              border: `1px solid ${T.violet}40`,
              background: `${T.violet}10`,
              borderRadius: 10,
              padding: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  fontSize: 22,
                  fontFamily: MONO,
                  fontWeight: 900,
                  color: T.violet,
                }}
              >
                {j.voice}
              </span>
              <span style={{ fontSize: 10.5, color: T.muted }}>
                · link {j.link}%
              </span>
            </div>
            <Eyebrow c={T.violet}>What customers said</Eyebrow>
            <div
              style={{
                fontSize: 12.5,
                color: T.sub,
                lineHeight: 1.5,
                fontStyle: "italic",
                margin: "5px 0 10px",
              }}
            >
              {j.theme}
            </div>
            <Eyebrow>So what</Eyebrow>
            <div
              style={{
                fontSize: 12.5,
                color: T.text,
                fontWeight: 700,
                margin: "5px 0 10px",
              }}
            >
              {j.outcome}
            </div>
            <RouteChip r={j.owner} />
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Roadmap — what this card will carry"
        subtitle="voice-join use cases · link strength · stays in this card only"
        accent={T.violet}
        aiPill
        style={{ marginTop: 14 }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
            gap: 10,
          }}
        >
          {VOICE_UCS.map((u) => (
            <div
              key={u.id}
              style={{
                background: `linear-gradient(180deg,${T.violet}10,${T.card})`,
                border: `1px solid ${T.violet}40`,
                borderLeft: `3px solid ${T.violet}`,
                borderRadius: 11,
                padding: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <Pill t="violet" solid>
                  {u.id}
                </Pill>
                <span style={{ fontSize: 12.5, fontWeight: 700 }}>{u.n}</span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 38px",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    height: 7,
                    background: T.inset,
                    borderRadius: 999,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${u.link}%`,
                      height: "100%",
                      background: T.violet,
                    }}
                  />
                </div>
                <Mono c={T.violet} s={11}>
                  {u.link}%
                </Mono>
              </div>
              <div style={{ fontSize: 10.5, color: T.muted, marginTop: 7 }}>
                impossible alone: {u.why}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(330px,1fr))",
          gap: 14,
          marginTop: 14,
        }}
      >
        <SectionCard
          title="Governance substrate"
          subtitle="DPDP · draft → approve → audit"
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 10,
            }}
          >
            {(
              [
                ["Join level", "Cohort", T.green],
                ["Action", "Human-approved", T.amber],
                ["Consent", "DPDP-ready", T.violet],
                ["Audit", "Replayable", T.green],
              ] as [string, string, string][]
            ).map((k) => (
              <span
                key={k[0]}
                style={{
                  background: T.inset,
                  border: `1px solid ${T.inner}`,
                  borderRadius: 9,
                  padding: "8px 11px",
                }}
              >
                <Eyebrow>{k[0]}</Eyebrow>
                <Mono c={k[2]} s={13}>
                  {k[1]}
                </Mono>
              </span>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              fontSize: 11.5,
              color: T.sub,
            }}
          >
            <ShieldCheck size={15} color={T.green} />
            LiSN drafts & routes evidence — never auto-fires a customer action.
          </div>
        </SectionCard>
        <SectionCard
          title="Ask LiSN"
          subtitle="natural-language"
          accent={T.violet}
        >
          <NLRow
            t="violet"
            queries={[
              ["Correlation", "are calls linked to the token issue?"],
              ["Ombudsman", "which cases are becoming IO risk?"],
              ["Churn", "is co-brand decay real attrition?"],
              ["Evidence", "show anonymised snippets for the owner"],
            ]}
          />
        </SectionCard>
      </div>
      <div style={{ height: 44 }} />
    </div>
  );
}

/* ═══════════════════ ROOT ═══════════════════ */
export function CardsPortfolioV2Dashboard({ onExit }: { onExit?: () => void }) {
  const [screen, setScreen] = useState("overview");
  const go = (s: string) => {
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
        style={{ padding: "16px 22px 36px", overflow: "hidden", minWidth: 0 }}
      >
        {screen === "overview" && <Overview go={go} />}
        {screen === "d1" && <Drill1 go={go} />}
        {screen === "d2" && <Drill2 go={go} />}
        {screen === "d3" && <Drill3 go={go} />}
      </main>
    </div>
  );
}

export default CardsPortfolioV2Dashboard;
