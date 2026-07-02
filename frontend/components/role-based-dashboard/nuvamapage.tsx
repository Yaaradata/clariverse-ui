"use client";

/**
 * LiSN / Fluid CX - Head of Client Experience (Rahul Jain, Nuvama).
 *
 * Overview -> TopBar + Executive Pulse + 3 outcome-question cards + AI Client-Signal Monitor
 *
 * Three CX-owned drills, each with a DISTINCT signature layout:
 *   D1 "Are our best clients staying?"  -> retention war-room: 2x2 Command Center + AI Wall,
 *                                          Attrition Radar + Client-at-Risk queue,
 *                                          exit-language phrases, competitor mentions, churn drivers. Conversation-only.
 *   D2 "Are we keeping our promises?"    -> full-width Promise Ledger hero + slim AI rail,
 *                                          Promise-flow funnel + Trust-erosion timeline,
 *                                          breach-language tracker, repeat-contact loop, service-recovery detection.
 *                                          Conversation-only; light compliance hand-off flag only.
 *   D3 "Is service paying off?"          -> ROI scorecard band + economics split + inline AI
 *                                          recommendations strip + Operations-join banner
 *                                          + 3 transaction/fulfilment panels (the ONLY rupee data).
 *
 * Self-contained JH near-black palette. Drop-in: named + default export, optional onExit.
 */

import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  Clock,
  Coins,
  Info,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  TrendingUp,
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
  Line,
  LineChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/* theme (JH near-black) */
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
const TIP: CSSProperties = { background: T.row, border: `1px solid ${T.btn}`, borderRadius: 8, fontSize: 11, color: T.sub };
const TONE_MAP: Record<string, string> = {
  red: T.red, amber: T.amber, gold: T.gold, yellow: T.yellow, green: T.green, cyan: T.cyan, violet: T.violet, blue: T.blue, purple: T.violet,
};
const tone = (k: string): string => TONE_MAP[k] || T.gold;

const CH: Record<string, string> = {
  Voice: "#ef4444", WhatsApp: "#22c55e", Email: "#eab308", "Service Desk": "#38bdf8", "App / Chat": "#8b5cf6", Social: "#f97316",
};
const ROUTE: Record<string, { l: string; c: string }> = {
  rm: { l: "Relationship Mgr", c: T.cyan },
  service: { l: "Service Ops", c: T.blue },
  advisory: { l: "Advisory Desk", c: T.violet },
  retention: { l: "Retention", c: T.red },
  compliance: { l: "Compliance / CRO", c: T.amber },
  digital: { l: "Digital CX", c: T.green },
};
const LEVEL: Record<string, string> = { CRITICAL: T.red, ALERT: "#f97316", WARNING: T.yellow, INFO: T.green, OBLIGATION: T.amber };

/* primitives */
const Mono = ({ children, c = T.text, s = 14 }: { children: ReactNode; c?: string; s?: number }) => (
  <span style={{ fontFamily: MONO, fontWeight: 700, color: c, fontSize: s }}>{children}</span>
);
const Eyebrow = ({ children, c = T.muted }: { children: ReactNode; c?: string }) => (
  <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase", color: c }}>{children}</div>
);
const Dot = ({ c, sq }: { c: string; sq?: boolean }) => (
  <span style={{ width: 8, height: 8, borderRadius: sq ? 2 : 999, background: c, flexShrink: 0, display: "inline-block" }} />
);

function SectionCard({ title, subtitle, accent, aiPill, right, children, style }: {
  title: ReactNode; subtitle?: ReactNode; accent?: string; aiPill?: boolean; right?: ReactNode; children: ReactNode; style?: CSSProperties;
}) {
  return (
    <section style={{ background: T.card, border: `1px solid ${T.border}`, borderTop: accent ? `3px solid ${accent}` : `1px solid ${T.border}`, borderRadius: 12, padding: 14, display: "flex", flexDirection: "column", minWidth: 0, ...style }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{title}</span>
            {aiPill && <span style={{ background: `${T.gold}20`, color: T.gold, fontSize: 8.5, fontWeight: 800, letterSpacing: ".5px", padding: "1px 6px", borderRadius: 4 }}>AI</span>}
          </div>
          {subtitle && <div style={{ fontSize: 10.5, color: T.muted, marginTop: 2, lineHeight: 1.45 }}>{subtitle}</div>}
        </div>
        {right}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </section>
  );
}

function AIInsightStrip({ children, tone: tn = "gold" }: { children: ReactNode; tone?: string }) {
  const c = tone(tn);
  return (
    <div style={{ background: `${c}10`, borderTop: `1px solid ${c}40`, borderRight: `1px solid ${c}40`, borderBottom: `1px solid ${c}40`, borderLeft: `3px solid ${c}`, borderRadius: 8, padding: "8px 10px", display: "flex", alignItems: "flex-start", gap: 7, fontSize: 11.5, color: T.sub, lineHeight: 1.5, marginTop: 10 }}>
      <Sparkles size={12} color={c} style={{ marginTop: 2, flexShrink: 0 }} />
      <span>{children}</span>
    </div>
  );
}

function Pill({ children, t = "gold", solid }: { children: ReactNode; t?: string; solid?: boolean }) {
  const c = tone(t);
  return (
    <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: ".05em", textTransform: "uppercase", padding: "2px 7px", borderRadius: 4, whiteSpace: "nowrap", color: solid ? "#0d0d0d" : c, background: solid ? c : `${c}1c`, border: solid ? "none" : `1px solid ${c}44` }}>
      {children}
    </span>
  );
}

function Chip({ children, t = "muted" }: { children: ReactNode; t?: string }) {
  const c = t === "muted" ? T.muted : tone(t);
  return (
    <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".04em", textTransform: "uppercase", padding: "5px 9px", borderRadius: 999, color: c, background: `${c}14`, border: `1px solid ${c}3a` }}>
      {children}
    </span>
  );
}

function ConsentChip() {
  return (
    <span style={{ display: "inline-flex", fontSize: 9, fontWeight: 800, letterSpacing: ".04em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 999, color: T.muted, background: T.inset, border: `1px solid ${T.inner}`, whiteSpace: "nowrap" }}>
      Draft - human approves
    </span>
  );
}

function RouteChip({ r }: { r: string }) {
  const m = ROUTE[r];
  if (!m) return null;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10.5, fontWeight: 700, color: m.c }}>
      <ArrowRight size={11} />
      {m.l}
    </span>
  );
}

function ChannelPill({ k }: { k: string }) {
  const c = CH[k] ?? T.muted;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 700, color: c, background: `${c}18`, border: `1px solid ${c}40`, borderRadius: 999, padding: "2px 8px", whiteSpace: "nowrap" }}>
      <Dot c={c} />
      {k}
    </span>
  );
}

/* shared chrome */
function TopBar() {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 21, fontWeight: 900, letterSpacing: "-.02em" }}>
        Client Experience Command <span style={{ color: T.dim, fontWeight: 600, fontSize: 14 }}></span>
      </div>
      <div style={{ color: T.muted, fontSize: 12.5, marginTop: 2 }}>
        Read across every client conversation - are they staying, do we keep our word, is service paying off
      </div>
    </div>
  );
}

function DrillHeader({ title, sub, chips, onBack }: { title: ReactNode; sub: ReactNode; chips?: ReactNode; onBack: () => void }) {
  return (
    <>
      <button type="button" onClick={onBack} style={{ background: T.row, border: `1px solid ${T.btn}`, color: T.sub, borderRadius: 10, padding: "8px 15px", fontWeight: 600, fontSize: 14, margin: "2px 0 14px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "inherit" }}>
        <ArrowLeft size={16} /> Back to Overview
      </button>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 14 }}>
        <div style={{ minWidth: 260 }}>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-.3px", lineHeight: 1.2 }}>{title}</div>
          <div style={{ color: T.sub, fontSize: 15, marginTop: 4, maxWidth: 880, lineHeight: 1.5 }}>{sub}</div>
        </div>
        {chips ? <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>{chips}</div> : null}
      </div>
    </>
  );
}

/* mini viz */
type TrendPoint = { v: number };

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

function MiniGauge({ label, topLabel, value, color, suffix = "%" }: { label: string; topLabel?: string; value: number; color: string; suffix?: string }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 9, color: T.muted, textTransform: "uppercase", letterSpacing: 0.4, textAlign: "center" }}>{topLabel ?? label}</div>
      <div style={{ position: "relative", width: "100%", height: 48 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart data={[{ name: label, value: clamped, fill: color }]} startAngle={180} endAngle={0} innerRadius={28} outerRadius={40} cx="50%" cy="100%">
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
            <RadialBar dataKey="value" cornerRadius={4} background={{ fill: `${T.inner}90` }} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div style={{ position: "absolute", left: "50%", bottom: 2, transform: "translateX(-50%)", fontFamily: MONO, fontSize: 11, fontWeight: 800, color }}>
          {clamped}{suffix}
        </div>
      </div>
      {topLabel ? <div style={{ fontSize: 8.5, color: T.dim, textTransform: "uppercase", marginTop: -2 }}>{label}</div> : null}
    </div>
  );
}

function MiniBars({ bars }: { bars: { name: string; v: number; c: string }[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: 1, minWidth: 0, justifyContent: "center" }}>
      {bars.map((b) => (
        <div key={b.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 9, color: T.muted, width: 88, flexShrink: 0 }}>{b.name}</span>
          <div style={{ flex: 1, height: 6, borderRadius: 3, background: T.track }}>
            <div style={{ height: "100%", width: `${b.v}%`, background: b.c, borderRadius: 3 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function CCWell({ children, accent, title, sub, right }: { children: ReactNode; accent?: string; title: ReactNode; sub?: ReactNode; right?: ReactNode }) {
  return (
    <div style={{ border: `1px solid ${T.border}`, borderRadius: 12, padding: 13, background: T.card, position: "relative", overflow: "hidden" }}>
      {accent && <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: 3, background: accent }} />}
      <div style={{ marginLeft: accent ? 6 : 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: sub ? 2 : 8 }}>
          <div style={{ fontSize: 13.5, fontWeight: 800 }}>{title}</div>
          {right}
        </div>
        {sub && <div style={{ fontSize: 10, color: T.dim, marginBottom: 8 }}>{sub}</div>}
        {children}
      </div>
    </div>
  );
}

/* shared AI Summary Wall (used by D1 full, D2 slim) */
type AiRow = {
  id: string; level: string; tag: string; title: string; body: string; metric: string; delta: string; icon: LucideIcon;
  root: string; areas: string[]; actions: string[]; owner: string; priority: string;
};

function AISummaryWall({ rows, title = "AI Summary Wall", subtitle = "Ranked - click to expand root cause & actions" }: { rows: AiRow[]; title?: string; subtitle?: string }) {
  const [open, setOpen] = useState<string | null>(rows[0].id);
  const counts = rows.reduce<Record<string, number>>((m, r) => { m[r.level] = (m[r.level] || 0) + 1; return m; }, {});
  return (
    <SectionCard title={title} subtitle={subtitle} accent={T.gold} aiPill style={{ height: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {rows.map((r) => {
          const c = LEVEL[r.level];
          const isOpen = open === r.id;
          const Icon = r.icon;
          return (
            <div key={r.id} style={{ borderRadius: 11, border: `1px solid ${c}50`, background: `linear-gradient(135deg,${c}22,${c}0a)`, overflow: "hidden" }}>
              <button type="button" onClick={() => setOpen(isOpen ? null : r.id)} style={{ width: "100%", textAlign: "left", cursor: "pointer", background: "transparent", border: "none", padding: 13, fontFamily: "inherit", display: "flex", gap: 11, alignItems: "flex-start" }}>
                <div style={{ padding: 7, borderRadius: 8, background: `${c}20`, flexShrink: 0 }}><Icon size={15} color={c} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", padding: "2px 6px", borderRadius: 4, background: `${c}25`, color: c }}>{r.level}</span>
                    <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: T.inner, color: T.muted, display: "inline-flex", gap: 4, alignItems: "center" }}><RefreshCw size={10} />{r.tag}</span>
                  </div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: T.text }}>{r.title}</div>
                  <div style={{ fontSize: 11.5, color: T.sub, lineHeight: 1.5, marginTop: 3 }}>{r.body}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 7, flexWrap: "wrap" }}>
                    <Mono c={c} s={12}>{r.metric}</Mono>
                    <span style={{ fontSize: 11, color: T.muted }}>{r.delta}</span>
                  </div>
                </div>
                <ChevronDown size={16} color={c} style={{ flexShrink: 0, transform: isOpen ? "rotate(180deg)" : "none", transition: ".2s" }} />
              </button>
              {isOpen && (
                <div style={{ padding: "0 13px 13px 13px", borderTop: `1px solid ${c}30` }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", margin: "10px 0 8px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: `${c}20`, color: c }}>{r.priority} priority</span>
                    <Users size={12} color={T.muted} />
                    <span style={{ fontSize: 11, color: T.muted }}>{r.owner}</span>
                    <ConsentChip />
                  </div>
                  <Eyebrow>Root cause</Eyebrow>
                  <div style={{ fontSize: 12, color: T.sub, lineHeight: 1.5, margin: "4px 0 10px" }}>{r.root}</div>
                  <Eyebrow>Affected areas</Eyebrow>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "6px 0 10px" }}>
                    {r.areas.map((a) => <span key={a} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, background: T.inner, color: T.sub }}>{a}</span>)}
                  </div>
                  <Eyebrow>Recommended actions</Eyebrow>
                  <div style={{ marginTop: 6 }}>
                    {r.actions.map((a, i) => (
                      <div key={a} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 5 }}>
                        <span style={{ width: 16, height: 16, borderRadius: 999, fontSize: 9.5, fontWeight: 800, display: "inline-flex", alignItems: "center", justifyContent: "center", background: `${c}20`, color: c, flexShrink: 0 }}>{i + 1}</span>
                        <span style={{ fontSize: 11.5, color: T.sub, lineHeight: 1.45 }}>{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${T.inner}`, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
        {["CRITICAL", "ALERT", "WARNING", "INFO"].map((l) => (
          <div key={l} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: LEVEL[l], fontFamily: MONO }}>{counts[l] || 0}</div>
            <Eyebrow>{l}</Eyebrow>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

/* ============ OVERVIEW ============ */
const TREND: { stay: TrendPoint[]; promise: TrendPoint[]; pay: TrendPoint[] } = {
  stay: [{ v: 88 }, { v: 87 }, { v: 86 }, { v: 84 }, { v: 82 }, { v: 79 }],
  promise: [{ v: 88 }, { v: 86 }, { v: 85 }, { v: 83 }, { v: 81 }, { v: 79 }],
  pay: [{ v: 44 }, { v: 48 }, { v: 52 }, { v: 55 }, { v: 59 }, { v: 62 }],
};

const EXEC_PULSE = [
  { label: "1. What's critical", text: "South Core-HNI clients are using exit-intent language - 47 this week vs 6 baseline, sentiment down 0.58. This is the book most at risk of walking, and it is concentrated in one cell." },
  { label: "2. Where's your focus", text: "We are breaking the promises we make. Call-back adherence fell to 79% from ~88%; 12 promises overdue, 9 already broken - and the same clients are the ones going quiet." },
  { label: "3. What's working", text: "Service is getting cheaper to run. Automation covers 62% of eligible requests and self-service deflection is climbing - the containment value is now measurable, not theoretical." },
];

function ExecutivePulse() {
  return (
    <section style={{ background: T.row, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
        <Sparkles size={13} color={T.gold} />
        <span style={{ fontSize: 11, fontWeight: 800, color: T.gold, letterSpacing: ".08em", textTransform: "uppercase" }}>Executive Pulse</span>
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

type NavigateFn = (screen: string) => void;

function ExecutiveQuestionCard({ accent, iTone, icon, title, subtitle, score, delta, deltaColor, trend, trendColor, visualType, gauges, bars, miniMetrics, aiText, cta, chip, onClick }: {
  accent: string; iTone: string; icon: ReactNode; title: string; subtitle: string; score: string; delta: string; deltaColor?: string;
  trend: TrendPoint[]; trendColor: string; visualType: "gauges" | "bars"; gauges?: { label: string; topLabel?: string; value: number; color: string }[];
  bars?: { name: string; v: number; c: string }[]; miniMetrics: [string, string, string][]; aiText: string; cta: string; chip?: string; onClick: () => void;
}) {
  const a = tone(accent);
  return (
    <button type="button" className="bigcard" onClick={onClick} style={{ textAlign: "left", font: "inherit", width: "100%", background: `linear-gradient(180deg,${a}0e,${T.card})`, border: `1px solid ${a}3a`, borderRadius: 16, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10, cursor: "pointer", minHeight: 380, color: "inherit" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        <div style={{ display: "flex", gap: 10, minWidth: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: `${tone(iTone)}22`, color: tone(iTone), flexShrink: 0 }}>{icon}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-.02em", lineHeight: 1.2 }}>{title}</div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 3 }}>{subtitle}</div>
            {chip ? <span style={{ marginTop: 6, display: "inline-block" }}><Pill t="blue">{chip}</Pill></span> : null}
          </div>
        </div>
        <ChevronRight size={22} color={T.dim} style={{ flexShrink: 0 }} />
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <div style={{ fontSize: 30, fontWeight: 900, fontFamily: MONO, letterSpacing: "-.04em" }}>{score}</div>
        <Mono c={deltaColor ?? T.red} s={12}>{delta}</Mono>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,0.9fr) minmax(0,1.1fr)", gap: 10, alignItems: "center" }}>
        <MiniSpark data={trend} c={trendColor} />
        {visualType === "gauges" && gauges ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
            {gauges.map((g) => <MiniGauge key={g.label} label={g.label} topLabel={g.topLabel} value={g.value} color={g.color} />)}
          </div>
        ) : bars ? <MiniBars bars={bars} /> : null}
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

/* AI Client-Signal Monitor */
type MonitorAlert = {
  id: string; title: string; sev: "critical" | "high" | "later"; sevLabel: string; variant: "critical" | "default" | "voice";
  feed: string; needsExtraFeed?: boolean; fields: [string, string][]; stats: [string, string][]; ai: string; route: string;
};
const SEV_STYLE: Record<"critical" | "high" | "later", { color: string; bg: string; border: string }> = {
  critical: { color: "#ff5050", bg: "#5a1f1f", border: "#9d3030" },
  high: { color: T.gold, bg: "#3a2e0b", border: "#765c12" },
  later: { color: "#b79cff", bg: "#2d1d55", border: "#6845c7" },
};
const MONITOR_STAT_SLOTS = 4;
const monitorStatRows = (stats: [string, string][]): [string, string][] => {
  const rows = [...stats];
  while (rows.length < MONITOR_STAT_SLOTS) rows.push(["", ""]);
  return rows;
};
const MONITOR_ALERTS: MonitorAlert[] = [
  { id: "exit-intent", title: "Exit-Intent Language Spike", sev: "critical", sevLabel: "Retention", variant: "critical", feed: "Voice + WhatsApp",
    fields: [["Cohort", "South - Core-HNI"], ["Window", "Last 7 days"]],
    stats: [["Exit-language", "47 clients"], ["Baseline", "6 clients"], ["Sentiment", "-0.58 shift"]],
    ai: "Cluster of 'move my portfolio', 'close relationship', 'not happy with returns' concentrated in one region-segment cell. Draft evidence pack for the RM team - never auto-contact.", route: "rm" },
  { id: "silent", title: "Silent High-Value Clients", sev: "critical", sevLabel: "Retention", variant: "critical", feed: "Cross-channel",
    fields: [["Cohort", "Private + HNI"], ["Window", "60d+ no inbound"]],
    stats: [["Gone quiet", "312 clients"], ["Were active", "Yes"], ["Pre-silence tone", "Cooling"]],
    ai: "Previously-active high-value clients have stopped reaching out - and their sentiment was already cooling before the silence. Silence is a leading attrition signal, not a neutral one.", route: "retention" },
  { id: "promise-break", title: "Service-Promise Slippage", sev: "critical", sevLabel: "Promise", variant: "critical", feed: "Service Desk + Voice",
    fields: [["Cohort", "Branch call-backs"], ["Window", "This week"]],
    stats: [["Adherence", "79%"], ["Overdue", "12 promises"], ["Broken", "9 promises"]],
    ai: "Promised 24h call-backs are slipping vs the ~88% baseline, concentrated on grievance and statement intents - the same clients showing exit-intent language.", route: "service" },
  { id: "trust", title: "Trust-Erosion Cluster", sev: "high", sevLabel: "Trust", variant: "default", feed: "NPS + CSAT",
    fields: [["Cohort", "South region"], ["Window", "This week"]],
    stats: [["NPS", "78"], ["Group", "85"], ["Detractor theme", "'no call back'"]],
    ai: "Detractor verbatims cluster on responsiveness and broken call-backs - the same root as the promise slippage. One fix clears three signals.", route: "service" },
  { id: "suitability", title: "Suitability-Language Gap", sev: "high", sevLabel: "Hand-off", variant: "default", feed: "Advisory calls", needsExtraFeed: true,
    fields: [["Cohort", "Advisory interactions"], ["Window", "Rolling 30d"]],
    stats: [["Missing phrasing", "8 / 1,000"], ["CX role", "Detect + flag"], ["Owner", "Compliance"]],
    ai: "A subset of advisory conversations lack expected suitability phrasing. CX surfaces the signal and hands it to Compliance / CRO - CX does not own the filing.", route: "compliance" },
  { id: "deflection", title: "Self-Service Deflection Rising", sev: "later", sevLabel: "Payoff", variant: "voice", feed: "App / Chat",
    fields: [["Cohort", "Balance + statement"], ["Window", "This week"]],
    stats: [["Deflection", "+14% WoW"], ["Cost-to-serve", "Falling"], ["Channel", "App / Chat"]],
    ai: "Routine balance and statement queries are resolving in self-service, holding them out of assisted channels and lowering cost-to-serve. Extend the pattern to report requests next.", route: "digital" },
];

function ClientSignalMonitor() {
  return (
    <div style={{ marginTop: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div style={{ color: T.gold, fontSize: 13, letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 900 }}>Today's Client-Signal Monitor</div>
        <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: ".08em", textTransform: "uppercase", border: "1px solid #7e1f1f", background: "#301818", color: "#ff4444", borderRadius: 999, padding: "6px 12px" }}>Experience Alerts</span>
      </div>
      <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 14, alignItems: "stretch" }}>
        {MONITOR_ALERTS.map((a) => {
          const sv = SEV_STYLE[a.sev];
          const border = a.variant === "critical" ? "#8a2b2b" : a.variant === "voice" ? "#6d44d4" : "#66420a";
          const bg = a.variant === "voice" ? "linear-gradient(180deg,#171127,#111)" : "#121212";
          return (
            <div key={a.id} style={{ minWidth: 264, maxWidth: 264, alignSelf: "stretch", background: bg, border: `1px solid ${border}`, borderRadius: 14, padding: "16px 16px 14px", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 12, minHeight: 52 }}>
                <div style={{ fontSize: 17, lineHeight: 1.1, fontWeight: 900, color: T.text }}>{a.title}</div>
                <span style={{ fontSize: 10, textTransform: "uppercase", fontWeight: 900, borderRadius: 999, padding: "5px 9px", whiteSpace: "nowrap", color: sv.color, background: sv.bg, border: `1px solid ${sv.border}` }}>{a.sevLabel}</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10, alignItems: "center", minHeight: 30 }}>
                <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: ".04em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 999, color: T.muted, background: T.inset, border: `1px solid ${T.inner}` }}>{a.feed}</span>
                {a.needsExtraFeed ? <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: ".04em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 999, color: T.amber, background: `${T.amber}14`, border: `1px solid ${T.amber}40` }}>hand-off flag</span> : null}
              </div>
              {a.fields.map(([k, v]) => (
                <div key={k} style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: 8, marginBottom: 8, fontSize: 12 }}>
                  <span style={{ color: "#8c8c95", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 900 }}>{k}</span>
                  <span style={{ textAlign: "right", fontWeight: 800, color: "#fff" }}>{v}</span>
                </div>
              ))}
              <div style={{ background: "#191919", border: "1px solid #333", borderRadius: 10, padding: 12, marginTop: 8, boxSizing: "border-box" }}>
                {monitorStatRows(a.stats).map(([k, v], i, rows) => (
                  <div key={k || `slot-${i}`} style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 8, marginBottom: i === rows.length - 1 ? 0 : 10, fontSize: 13, color: "#bfbfc6", minHeight: 18, visibility: k ? "visible" : "hidden" }}>
                    <span>{k}</span>
                    <b style={{ textAlign: "right", color: "#fff", fontFamily: MONO }}>{v}</b>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 10, background: "#2d2414", border: "1px solid #5a4314", borderRadius: 9, padding: 12, fontSize: 13, lineHeight: 1.45, color: "#fff", fontWeight: 700, minHeight: 132, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 10 }}>
                <span>{a.ai}</span>
                <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <RouteChip r={a.route} />
                  <ConsentChip />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Overview({ go }: { go: NavigateFn }) {
  return (
    <div className="fade">
      <TopBar />
      <ExecutivePulse />
      <div className="overview-cards">
        <ExecutiveQuestionCard accent="red" iTone="red" icon={<Users size={18} />} title="Are our best clients staying?" subtitle="Attrition-risk - exit-intent language - silent clients"
          score="47" delta="at-risk clients, up from 6" trend={TREND.stay} trendColor={T.red} visualType="gauges"
          gauges={[{ label: "at risk", topLabel: "Book health", value: 71, color: T.amber }, { label: "silent 60d+", topLabel: "High-value", value: 34, color: T.red }]}
          miniMetrics={[["Exit-intent clients", "47", "red"], ["Silent high-value", "312", "amber"]]}
          aiText="Exit-intent language is concentrated in South Core-HNI - 47 clients vs 6 baseline - and 312 high-value clients have gone quiet after cooling sentiment. This is the book at risk of walking."
          cta="Open retention war-room" onClick={() => go("d1")} />
        <ExecutiveQuestionCard accent="amber" iTone="amber" icon={<ShieldCheck size={18} />} title="Are we keeping our promises?" subtitle="Promise ledger - complaint-handling - trust erosion"
          score="79%" delta="-9 pts adherence" trend={TREND.promise} trendColor={T.amber} visualType="gauges"
          gauges={[{ label: "kept", topLabel: "Promises", value: 79, color: T.amber }, { label: "recovered", topLabel: "Trust", value: 58, color: T.red }]}
          miniMetrics={[["Promises overdue", "12", "amber"], ["Broken this week", "9", "red"]]}
          aiText="Call-back adherence fell to 79% from ~88%, with 12 overdue and 9 broken. Trust is eroding on the same clients - detractor verbatims cluster on 'no call back'. Compliance flags handed off, not owned."
          cta="Open promise & trust ledger" onClick={() => go("d2")} />
        <ExecutiveQuestionCard accent="green" iTone="green" icon={<TrendingUp size={18} />} title="Is service paying off?" subtitle="Automation - deflection - cost-to-serve"
          score="62%" delta="+18% containment MTD" deltaColor={T.green} trend={TREND.pay} trendColor={T.green} visualType="gauges"
          gauges={[{ label: "auto-handled", topLabel: "Automation", value: 62, color: T.green }, { label: "deflected", topLabel: "Self-service", value: 48, color: T.cyan }]}
          miniMetrics={[["Auto-resolved", "62%", "green"], ["Cost avoided MTD", "Rs 1.84 Cr", "green"]]}
          aiText="Automation covers 62% of eligible requests and containment value is Rs 1.84 Cr month-to-date. This drill joins fulfilment data to prove cost-to-serve and ROI - the only place hard numbers appear."
          chip="Includes transaction data" cta="Open service economics" onClick={() => go("d3")} />
      </div>
      <ClientSignalMonitor />
      <div style={{ height: 44 }} />
    </div>
  );
}

/* ============ DRILL 1 - ARE OUR BEST CLIENTS STAYING? (retention war-room) ============ */
const D1_SEGMENT_SENT: [string, string, number, number, number][] = [
  ["Private - UHNI", "6,240 int", 52, 27, 21],
  ["HNI", "22,180 int", 46, 27, 27],
  ["Affluent", "24,860 int", 44, 28, 28],
  ["Mass Affluent", "9,910 int", 41, 29, 30],
];

function D1CommandCenter() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 12 }}>
      <CCWell accent={T.red} title="Exit-intent monitor" sub="attrition-risk language - cohort level, never named client">
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 34, fontWeight: 900, fontFamily: MONO, color: T.red }}>47</span>
          <span style={{ fontSize: 11, color: T.dim }}>clients this week</span>
          <span style={{ fontSize: 11, color: T.red, fontWeight: 700 }}>vs 6 baseline</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
          {[["South - Core-HNI", "47", T.red], ["EWM advisory", "14", T.amber], ["West - HNI", "9", T.yellow], ["Other cells", "6", T.green]].map(([l, v, c]) => (
            <div key={l as string} style={{ background: `${c as string}12`, border: `1px solid ${c as string}30`, borderRadius: 8, padding: "8px 10px" }}>
              <div style={{ fontSize: 10, color: T.muted }}>{l}</div>
              <Mono c={c as string} s={16}>{v}</Mono>
            </div>
          ))}
        </div>
        <AIInsightStrip tone="red">
          Concentration is the signal - one cell holds most of the exit-language. Route a per-client evidence pack to the RM team; nothing auto-contacts the client.
        </AIInsightStrip>
      </CCWell>

      <CCWell accent={T.amber} title="Silent-client detection" sub="high-value clients who have gone quiet - a leading signal">
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 34, fontWeight: 900, fontFamily: MONO, color: T.amber }}>312</span>
          <span style={{ fontSize: 11, color: T.dim }}>gone quiet 60d+</span>
        </div>
        {[["Sentiment was cooling pre-silence", 68, T.red], ["Had an unresolved request", 41, T.amber], ["Missed a promised call-back", 29, T.amber]].map(([l, v, c]) => (
          <div key={l as string} style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
              <span style={{ fontSize: 10.5, color: T.text, fontWeight: 600 }}>{l}</span>
              <Mono c={c as string} s={11}>{v}%</Mono>
            </div>
            <div style={{ height: 10, borderRadius: 999, background: T.track, overflow: "hidden" }}>
              <div style={{ width: `${v}%`, height: "100%", background: c as string }} />
            </div>
          </div>
        ))}
        <div style={{ fontSize: 9.5, color: T.dim, marginTop: 2, lineHeight: 1.4 }}>Silence after cooling sentiment is not neutral - it is the quiet phase before attrition.</div>
      </CCWell>

      <CCWell accent={T.cyan} title="Sentiment trajectory by segment" sub="positive / neutral / negative - conversation-derived">
        {D1_SEGMENT_SENT.map(([l, sub, h, n, u]) => (
          <div key={l} style={{ marginBottom: 9 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: T.text }}>{l}</span>
              <span style={{ fontSize: 10, color: T.dim }}>{sub}</span>
            </div>
            <div style={{ display: "flex", height: 18, borderRadius: 5, overflow: "hidden", background: T.track }}>
              <div style={{ width: `${h}%`, background: T.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9.5, fontWeight: 700, color: "#000" }}>{h}</div>
              <div style={{ width: `${n}%`, background: T.amber, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9.5, fontWeight: 700, color: "#000" }}>{n}</div>
              <div style={{ width: `${u}%`, background: T.red, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9.5, fontWeight: 700, color: "#fff" }}>{u}</div>
            </div>
          </div>
        ))}
        <div style={{ display: "flex", gap: 12, fontSize: 9.5, color: T.dim, borderTop: `1px solid ${T.border}`, paddingTop: 6 }}>
          <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}><Dot c={T.green} />Positive</span>
          <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}><Dot c={T.amber} />Neutral</span>
          <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}><Dot c={T.red} />Negative</span>
        </div>
      </CCWell>

      <CCWell accent={T.violet} title="Relationship-health distribution" sub="clients by conversation-health band">
        <div style={{ display: "flex", height: 26, borderRadius: 6, overflow: "hidden", gap: 2, marginBottom: 12 }}>
          {[["Healthy", 54, T.green], ["Watch", 27, T.amber], ["At-risk", 13, "#f97316"], ["Critical", 6, T.red]].map(([l, v, c]) => (
            <div key={l as string} style={{ flex: v as number, background: c as string, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#0d0d0d" }} title={`${l}: ${v}%`}>{v}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
          {[["Healthy", "54%", T.green], ["Watch", "27%", T.amber], ["At-risk", "13%", "#f97316"], ["Critical", "6%", T.red]].map(([l, v, c]) => (
            <div key={l as string} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Dot c={c as string} sq /><span style={{ fontSize: 10.5, color: T.sub }}>{l}</span><Mono c={c as string} s={11}>{v}</Mono>
            </div>
          ))}
        </div>
        <AIInsightStrip tone="violet">
          The critical + at-risk 19% is where NNM leak concentrates. Working the critical band first protects the most book value per RM hour.
        </AIInsightStrip>
      </CCWell>
    </div>
  );
}

const D1_AI: AiRow[] = [
  { id: "d1a1", level: "CRITICAL", tag: "Exit-intent", title: "South Core-HNI showing relationship-ending language",
    body: "'Move my portfolio', 'close account', 'disappointed with returns' concentrated in one region-segment cell, across Voice and WhatsApp.",
    metric: "47 clients vs 6 baseline", delta: "sentiment -0.58", icon: CircleAlert,
    root: "Unmet call-back promises and responsiveness complaints compounding in the South Core-HNI book; the language is relationship-ending, not transactional.",
    areas: ["RM team", "South region", "Retention"],
    actions: ["Draft evidence pack per client - human approves", "Prioritise RM call-backs in this cell", "Brief regional head on the cluster"],
    owner: "Head of Client Experience", priority: "Immediate" },
  { id: "d1a2", level: "ALERT", tag: "Silent clients", title: "312 high-value clients have gone quiet",
    body: "Previously-active Private and HNI clients with no inbound for 60 days+, whose sentiment was already cooling before the silence.",
    metric: "312 clients", delta: "leading attrition signal", icon: TriangleAlert,
    root: "No proactive trigger fires when an active high-value client goes quiet; the relationship cools unobserved until it is too late to recover.",
    areas: ["Retention", "RM team", "Digital"],
    actions: ["Flag silent-after-cooling clients to RMs weekly", "Draft a re-engagement outreach - human sends", "Prioritise those with an unresolved request"],
    owner: "Retention Lead", priority: "High" },
  { id: "d1a3", level: "WARNING", tag: "Segment drift", title: "Mass Affluent sentiment slipping fastest",
    body: "Negative-sentiment share is highest and rising in Mass Affluent, the largest interaction pool - a volume risk even if per-client value is lower.",
    metric: "30% negative", delta: "+3 pts", icon: Zap,
    root: "Service model is thinner for Mass Affluent; routine friction goes unresolved and accumulates into detractor sentiment.",
    areas: ["Service Ops", "Digital"],
    actions: ["Strengthen self-service for this segment", "Watch for exit-intent bleed upward"],
    owner: "Service Ops", priority: "Medium" },
  { id: "d1a4", level: "INFO", tag: "Healthy core", title: "Private-UHNI relationships holding",
    body: "The top segment retains the healthiest sentiment mix, with exit-intent language rare outside the flagged advisory cluster.",
    metric: "52% positive", delta: "stable", icon: Info,
    root: "Dedicated RM coverage keeps the top book close; the model that works here is the one to extend downward.",
    areas: ["RM team", "Private"],
    actions: ["Document what is working in Private coverage", "Test elements with HNI at-risk cells"],
    owner: "Head of Client Experience", priority: "Low" },
];

/* Attrition Radar - segment x region risk heatmap */
const RADAR_COLS = ["South", "West", "North", "East"];
const RADAR_ROWS: { label: string; cells: number[] }[] = [
  { label: "Private - UHNI", cells: [38, 22, 18, 15] },
  { label: "HNI", cells: [78, 44, 36, 28] },
  { label: "Affluent", cells: [58, 46, 40, 34] },
  { label: "Mass Affluent", cells: [52, 48, 44, 41] },
];
const radarTone = (v: number): string => (v >= 65 ? T.red : v >= 45 ? "#f97316" : v >= 30 ? T.amber : T.green);

function AttritionRadar() {
  return (
    <SectionCard title="Attrition radar" subtitle="Attrition-risk score by segment x region - intensity = concentration of exit signals" accent={T.red} aiPill>
      <div style={{ display: "grid", gridTemplateColumns: `minmax(120px,1.2fr) repeat(${RADAR_COLS.length},1fr)`, gap: 5 }}>
        <div />
        {RADAR_COLS.map((c) => <div key={c} style={{ fontSize: 9, color: T.muted, textAlign: "center", alignSelf: "end", paddingBottom: 4, fontWeight: 700 }}>{c}</div>)}
        {RADAR_ROWS.map((r) => (
          <RadarRow key={r.label} label={r.label} cells={r.cells} />
        ))}
      </div>
      <AIInsightStrip tone="red">
        South-HNI is the hotspot at 78 - the single cell driving this week's exit-intent spike. Risk fades north and east, so retention effort should be weighted to the South book first.
      </AIInsightStrip>
    </SectionCard>
  );
}
function RadarRow({ label, cells }: { label: string; cells: number[] }) {
  return (
    <>
      <div style={{ fontSize: 10.5, color: T.sub, alignSelf: "center", fontWeight: 600 }}>{label}</div>
      {cells.map((v, i) => {
        const c = radarTone(v);
        return (
          <div key={i} title={`${label} - ${RADAR_COLS[i]}: ${v}`} style={{ minHeight: 34, borderRadius: 6, background: `${c}d9`, border: `1px solid ${c}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontWeight: 800, fontSize: 12, color: v >= 45 ? "#0d0d0d" : "#fff" }}>{v}</div>
        );
      })}
    </>
  );
}

/* Client-at-Risk queue */
const AT_RISK: { cohort: string; driver: string; signal: string; trend: string; sev: string; route: string }[] = [
  { cohort: "South - Core-HNI", driver: "Exit-intent language spike", signal: "47 clients - sentiment -0.58", trend: "worsening", sev: "red", route: "rm" },
  { cohort: "EWM Advisory", driver: "Performance-concern language", signal: "14 clients - returns complaints", trend: "worsening", sev: "red", route: "advisory" },
  { cohort: "Private - silent set", driver: "Went quiet after complaint", signal: "38 clients - no inbound 60d+", trend: "watch", sev: "amber", route: "retention" },
  { cohort: "West - HNI", driver: "Broken call-back promises", signal: "9 clients - trust dropping", trend: "watch", sev: "amber", route: "service" },
];

function ClientAtRiskQueue() {
  return (
    <SectionCard title="Client-at-risk queue" subtitle="Ranked cohorts to work now - each with the signal and the human-approved next step" accent={T.gold} aiPill>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {AT_RISK.map((r) => {
          const c = tone(r.sev);
          return (
            <div key={r.cohort} style={{ display: "grid", gridTemplateColumns: "1.3fr 1.4fr 1.2fr auto", gap: 12, alignItems: "center", padding: "11px 12px", borderRadius: 10, background: `${c}10`, border: `1px solid ${c}35`, borderLeft: `3px solid ${c}` }}>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 800, color: T.text }}>{r.cohort}</div>
                <span style={{ marginTop: 4, display: "inline-block" }}><Pill t={r.trend === "worsening" ? "red" : "amber"}>{r.trend}</Pill></span>
              </div>
              <div style={{ fontSize: 11.5, color: T.sub }}>{r.driver}</div>
              <Mono c={c} s={11}>{r.signal}</Mono>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                <RouteChip r={r.route} />
                <ConsentChip />
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

/* Drill 1 — conversation-detectable retention panels */
const EXIT_PHRASES: { phrase: string; count: number; wow: number; cohort: string }[] = [
  { phrase: "\u201cdisappointed with returns\u201d", count: 21, wow: 7, cohort: "EWM Advisory" },
  { phrase: "\u201cmove my portfolio\u201d", count: 18, wow: 9, cohort: "South - HNI" },
  { phrase: "\u201cfees are too high\u201d", count: 16, wow: 3, cohort: "Affluent" },
  { phrase: "\u201cclose the account\u201d", count: 12, wow: 5, cohort: "South - HNI" },
  { phrase: "\u201cnot worth it anymore\u201d", count: 11, wow: 4, cohort: "Mass Affluent" },
  { phrase: "\u201cswitching advisor\u201d", count: 9, wow: 6, cohort: "South - HNI" },
];

function ExitLanguageTracker() {
  const max = Math.max(...EXIT_PHRASES.map((p) => p.count));
  return (
    <SectionCard title="Exit-language phrase tracker" subtitle="Exact attrition phrases detected in client conversations - count & week-on-week move" accent={T.red} aiPill>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {EXIT_PHRASES.map((p) => (
          <div key={p.phrase} style={{ display: "grid", gridTemplateColumns: "1.7fr 1.6fr auto", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 11.5, color: T.text, fontWeight: 600 }}>{p.phrase}</span>
            <div style={{ height: 16, borderRadius: 5, background: T.track, overflow: "hidden" }}>
              <div style={{ width: `${(p.count / max) * 100}%`, height: "100%", background: T.red, display: "flex", alignItems: "center", paddingLeft: 7 }}>
                <Mono c="#0d0d0d" s={10}>{p.count}</Mono>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
              <Mono c={T.red} s={10.5}>+{p.wow}</Mono>
              <Chip t="amber">{p.cohort}</Chip>
            </div>
          </div>
        ))}
      </div>
      <AIInsightStrip tone="red">
        &ldquo;Disappointed with returns&rdquo; and &ldquo;move my portfolio&rdquo; are rising fastest and both concentrate in the South-HNI and advisory books - the same cell already flagged for exit-intent. The language is decisive, not exploratory.
      </AIInsightStrip>
    </SectionCard>
  );
}

const COMPETITOR_MENTIONS: { name: string; count: number; context: string; tiedToExit: number; t: string }[] = [
  { name: "360 ONE", count: 14, context: "better returns", tiedToExit: 71, t: "red" },
  { name: "Kotak", count: 9, context: "lower fees", tiedToExit: 44, t: "amber" },
  { name: "ICICI", count: 7, context: "digital experience", tiedToExit: 29, t: "amber" },
  { name: "Motilal Oswal", count: 5, context: "research quality", tiedToExit: 40, t: "amber" },
  { name: "Anand Rathi", count: 4, context: "RM attention", tiedToExit: 50, t: "amber" },
];

function CompetitorMentionMonitor() {
  return (
    <SectionCard title="Competitor mention monitor" subtitle="Rivals clients name in conversations - and how often it co-occurs with exit-intent" accent={T.amber} aiPill>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {COMPETITOR_MENTIONS.map((m) => {
          const c = tone(m.t);
          return (
            <div key={m.name} style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr auto", gap: 10, alignItems: "center", padding: "9px 11px", borderRadius: 9, background: `${c}10`, border: `1px solid ${c}30` }}>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 800, color: T.text }}>{m.name}</div>
                <span style={{ fontSize: 10, color: T.muted }}>{m.count} mentions</span>
              </div>
              <div style={{ fontSize: 10.5, color: T.sub, fontStyle: "italic" }}>&ldquo;{m.context}&rdquo;</div>
              <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                <Mono c={c} s={13}>{m.tiedToExit}%</Mono>
                <div style={{ fontSize: 8.5, color: T.dim, textTransform: "uppercase", letterSpacing: 0.4 }}>tied to exit</div>
              </div>
            </div>
          );
        })}
      </div>
      <AIInsightStrip tone="amber">
        360 ONE is the sharpest threat - most-named, and 71% of its mentions sit inside an exit-intent conversation, almost always on the returns argument. This is a competitive-positioning brief for the RM team, not a service issue.
      </AIInsightStrip>
    </SectionCard>
  );
}

const CHURN_DRIVERS: { driver: string; share: number; wow: number; theme: string; c: string }[] = [
  { driver: "Returns / performance concern", share: 34, wow: 6, theme: "underperformed vs expectation", c: T.red },
  { driver: "Responsiveness / no call back", share: 28, wow: 8, theme: "had to chase repeatedly", c: "#f97316" },
  { driver: "Fees perception", share: 16, wow: 2, theme: "not justified by value", c: T.amber },
  { driver: "RM coverage gap", share: 13, wow: 3, theme: "RM changed or unavailable", c: T.yellow },
  { driver: "Product / advice fit", share: 9, wow: -1, theme: "not what I needed", c: T.cyan },
];

function ChurnDriverAnalysis() {
  return (
    <SectionCard title="Churn-driver analysis" subtitle="Why at-risk clients are at risk - reason-coded from conversation themes, not surveys" accent={T.violet} aiPill>
      <div style={{ display: "flex", height: 26, borderRadius: 6, overflow: "hidden", gap: 2, marginBottom: 14 }}>
        {CHURN_DRIVERS.map((d) => (
          <div key={d.driver} style={{ flex: d.share, background: d.c, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#0d0d0d" }} title={`${d.driver}: ${d.share}%`}>{d.share}</div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {CHURN_DRIVERS.map((d) => (
          <div key={d.driver} style={{ display: "grid", gridTemplateColumns: "auto 1.6fr 1.6fr auto", gap: 10, alignItems: "center" }}>
            <Dot c={d.c} sq />
            <span style={{ fontSize: 11.5, color: T.text, fontWeight: 600 }}>{d.driver}</span>
            <span style={{ fontSize: 10.5, color: T.dim, fontStyle: "italic" }}>&ldquo;{d.theme}&rdquo;</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
              <Mono c={d.c} s={11}>{d.share}%</Mono>
              <Mono c={d.wow < 0 ? T.green : T.red} s={10}>{d.wow > 0 ? "+" : ""}{d.wow}</Mono>
            </div>
          </div>
        ))}
      </div>
      <AIInsightStrip tone="violet">
        Returns and responsiveness together drive 62% of attrition risk - but only responsiveness is inside CX&apos;s control, and it is rising fastest at +8. Fixing call-backs is the highest-leverage retention move you own outright.
      </AIInsightStrip>
    </SectionCard>
  );
}

function Drill1({ go }: { go: NavigateFn }) {
  return (
    <div className="fade">
      <DrillHeader onBack={() => go("overview")} title="Are our best clients staying?"
        sub="A retention war-room read entirely from client conversations - who is signalling they might leave, who has gone quiet, and which cohorts to work before the book walks."
        chips={<><Chip t="red">Conversation-only</Chip><Chip t="gold">Retention - attrition-risk</Chip></>} />
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(320px,1fr)", gap: 12, alignItems: "start" }}>
        <D1CommandCenter />
        <AISummaryWall rows={D1_AI} title="AI Retention Wall" subtitle="Ranked - click to expand root cause & actions" />
      </div>
      <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 14, alignItems: "start" }}>
        <AttritionRadar />
        <ClientAtRiskQueue />
      </div>
      <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 14, alignItems: "start" }}>
        <ExitLanguageTracker />
        <CompetitorMentionMonitor />
      </div>
      <div style={{ marginTop: 14 }}>
        <ChurnDriverAnalysis />
      </div>
      <div style={{ height: 44 }} />
    </div>
  );
}

/* ============ DRILL 2 - ARE WE KEEPING OUR PROMISES? (promise ledger + trust) ============ */
const PROMISE_LEDGER: { type: string; made: number; kept: number; overdue: number; broken: number; adh: number; flag?: boolean }[] = [
  { type: "24h call-back", made: 1840, kept: 1452, overdue: 8, broken: 6, adh: 79, flag: true },
  { type: "Statement / report dispatch", made: 2260, kept: 2034, overdue: 3, broken: 2, adh: 90 },
  { type: "Grievance resolution SLA", made: 780, kept: 562, overdue: 1, broken: 1, adh: 72, flag: true },
  { type: "Advisory follow-up", made: 640, kept: 550, overdue: 0, broken: 0, adh: 86 },
  { type: "KYC completion commit", made: 520, kept: 411, overdue: 0, broken: 0, adh: 79 },
];

function PromiseLedgerHero() {
  return (
    <SectionCard title="Promise ledger" subtitle="Every commitment made to a client, and whether we kept it - the single source of promise truth" accent={T.amber} aiPill
      right={<span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10, color: T.muted }}><Clock size={12} color={T.amber} /> live</span>}>
      <div style={{ border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.9fr .8fr .8fr .8fr .8fr 1.3fr", gap: 8, padding: "8px 12px", background: T.row }}>
          {["PROMISE TYPE", "MADE", "KEPT", "OVERDUE", "BROKEN", "ADHERENCE"].map((h) => <Eyebrow key={h}>{h}</Eyebrow>)}
        </div>
        {PROMISE_LEDGER.map((r, i) => {
          const c = r.adh >= 88 ? T.green : r.adh >= 80 ? T.amber : T.red;
          return (
            <div key={r.type} style={{ display: "grid", gridTemplateColumns: "1.9fr .8fr .8fr .8fr .8fr 1.3fr", gap: 8, padding: "10px 12px", borderTop: i ? `1px solid ${T.border}` : "none", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: T.text, fontWeight: 600 }}>{r.type}</span>
                {r.flag ? <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 8.5, fontWeight: 800, textTransform: "uppercase", color: T.amber, background: `${T.amber}18`, border: `1px solid ${T.amber}40`, borderRadius: 999, padding: "2px 6px" }}><ShieldCheck size={9} /> flag Compliance</span> : null}
              </div>
              <Mono c={T.sub} s={11}>{r.made.toLocaleString()}</Mono>
              <Mono c={T.green} s={11}>{r.kept.toLocaleString()}</Mono>
              <Mono c={r.overdue ? T.amber : T.dim} s={11}>{r.overdue}</Mono>
              <Mono c={r.broken ? T.red : T.dim} s={11}>{r.broken}</Mono>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ flex: 1, height: 8, background: T.track, borderRadius: 999 }}>
                  <div style={{ width: `${r.adh}%`, height: "100%", background: c, borderRadius: 999 }} />
                </div>
                <Mono c={c} s={11}>{r.adh}%</Mono>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: 10, padding: "9px 11px", borderRadius: 8, background: `${T.amber}0e`, border: `1px solid ${T.amber}30`, borderLeft: `3px solid ${T.amber}` }}>
        <ShieldCheck size={13} color={T.amber} style={{ marginTop: 1, flexShrink: 0 }} />
        <div style={{ fontSize: 11, color: T.sub, lineHeight: 1.5 }}>
          <b style={{ color: T.text }}>Compliance hand-off, not ownership.</b> Two clusters (call-back, grievance SLA) are flagged where broken promises could become a regulatory matter. CX surfaces them; Compliance / CRO owns any filing or SCORES action. This screen tracks the client experience, not the regulator's clock.
        </div>
      </div>
      <AIInsightStrip tone="amber">
        Call-back and grievance-SLA promises are the weak points at 79% and 72%. They are also the promises most tied to the exit-intent cluster in retention - keeping these two clears attrition risk and trust erosion together.
      </AIInsightStrip>
    </SectionCard>
  );
}

const D2_AI: AiRow[] = [
  { id: "d2a1", level: "CRITICAL", tag: "Broken promises", title: "Call-back promises breaking on at-risk clients",
    body: "24h call-back adherence is 79%, with 9 broken this week - concentrated on the same South Core-HNI clients showing exit-intent language.",
    metric: "79% - 9 broken", delta: "-9 pts vs baseline", icon: CircleAlert,
    root: "Promises made on one channel are invisible on another; there is no single ledger, so commitments slip silently until the client chases.",
    areas: ["Service Ops", "Branch", "RM team"],
    actions: ["Alert owners at 18h before breach", "Outbound the 9 broken promises today", "Link promise breaches to the retention queue"],
    owner: "Service Ops Lead", priority: "Immediate" },
  { id: "d2a2", level: "ALERT", tag: "Trust erosion", title: "Detractor verbatims cluster on 'no call back'",
    body: "South NPS is 78 vs group 85, and the detractor language is specifically about responsiveness and unmet call-backs - trust, not product.",
    metric: "NPS 78 vs 85", delta: "responsiveness theme", icon: TriangleAlert,
    root: "Repeated broken promises convert neutral clients into detractors; the trust cost compounds each time a client has to chase.",
    areas: ["Service Ops", "Quality", "Retention"],
    actions: ["Proactive status-push on open promises", "Recover the flagged detractor cohort", "Track sentiment recovery post-fix"],
    owner: "CX Quality Lead", priority: "High" },
  { id: "d2a3", level: "WARNING", tag: "Hand-off", title: "Grievance-SLA breaches flagged to Compliance",
    body: "A small set of grievance-resolution promises breached SLA. CX has flagged these to Compliance / CRO - detection and surfacing only.",
    metric: "flagged - not owned", delta: "Compliance owns filing", icon: ShieldCheck,
    root: "Grievance-SLA breaches can carry regulatory weight; the CX role is to detect early and hand off cleanly, not to run the regulatory response.",
    areas: ["Compliance / CRO", "Grievance Cell"],
    actions: ["Confirm hand-off received by Compliance", "Keep CX view to experience metrics"],
    owner: "Compliance / CRO", priority: "Medium" },
];

/* Promise-flow funnel */
function PromiseFlowFunnel() {
  const stages: { label: string; pct: number; c: string; note: string }[] = [
    { label: "Promise made", pct: 100, c: T.cyan, note: "5,040 commitments" },
    { label: "Acknowledged", pct: 94, c: T.green, note: "logged to a queue" },
    { label: "Actioned in time", pct: 86, c: T.amber, note: "work started pre-breach" },
    { label: "Kept", pct: 79, c: T.red, note: "client saw it honoured" },
  ];
  return (
    <SectionCard title="Promise-flow funnel" subtitle="Where a commitment leaks between being made and being kept" accent={T.violet} aiPill>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {stages.map((s, i) => (
          <div key={s.label}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: T.text }}>{s.label}</span>
              <span style={{ fontSize: 10, color: T.dim }}>{s.note}</span>
            </div>
            <div style={{ height: 30, borderRadius: 6, background: T.track, overflow: "hidden", display: "flex", alignItems: "center" }}>
              <div style={{ width: `${s.pct}%`, height: "100%", background: `${s.c}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 10px", transition: "width .3s" }}>
                <Mono c="#0d0d0d" s={12}>{s.pct}%</Mono>
                {i > 0 ? <span style={{ fontSize: 10, fontWeight: 800, color: "#0d0d0d" }}>-{stages[i - 1].pct - s.pct} pts</span> : null}
              </div>
            </div>
          </div>
        ))}
      </div>
      <AIInsightStrip tone="violet">
        The biggest leak is between actioned and kept - 7 points lost at the last step, where work started but the client was never told. A status-push at completion closes most of it.
      </AIInsightStrip>
    </SectionCard>
  );
}

/* Trust-erosion timeline */
function TrustErosionTimeline() {
  const steps: { label: string; sentiment: number; c: string }[] = [
    { label: "First contact", sentiment: 12, c: T.green },
    { label: "Promise made", sentiment: 28, c: T.green },
    { label: "Promise missed", sentiment: -18, c: T.amber },
    { label: "Client chases", sentiment: -42, c: "#f97316" },
    { label: "Escalation", sentiment: -64, c: T.red },
  ];
  return (
    <SectionCard title="Trust-erosion timeline" subtitle="How client sentiment moves as a promise is kept or broken" accent={T.red} aiPill>
      <div style={{ height: 150 }}>
        <ResponsiveContainer>
          <LineChart data={steps.map((s) => ({ name: s.label, v: s.sentiment }))} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
            <XAxis dataKey="name" tick={{ fill: T.dim, fontSize: 9 }} tickLine={false} interval={0} />
            <YAxis domain={[-80, 40]} tick={{ fill: T.dim, fontSize: 9 }} width={30} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={TIP} formatter={(v) => [`${v} sentiment`, "Trust"]} />
            <Line type="monotone" dataKey="v" stroke={T.red} strokeWidth={2.6} dot={{ r: 3, fill: T.red }} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 6, marginTop: 8 }}>
        {steps.map((s) => (
          <div key={s.label} style={{ textAlign: "center", flex: 1 }}>
            <Mono c={s.c} s={12}>{s.sentiment > 0 ? "+" : ""}{s.sentiment}</Mono>
          </div>
        ))}
      </div>
      <AIInsightStrip tone="red">
        Trust turns negative the moment a promise is missed and drops sharply once the client has to chase. The recoverable window is right after the miss - a proactive apology-plus-status message stops the slide to escalation.
      </AIInsightStrip>
    </SectionCard>
  );
}

/* Drill 2 — conversation-detectable promise / trust panels */
const BREACH_PHRASES: { phrase: string; count: number; wow: number; attaches: string }[] = [
  { phrase: "\u201cstill waiting\u201d", count: 51, wow: 14, attaches: "Call-back" },
  { phrase: "\u201cyou said you\u2019d call back\u201d", count: 42, wow: 11, attaches: "Call-back" },
  { phrase: "\u201cno one got back to me\u201d", count: 37, wow: 8, attaches: "Grievance SLA" },
  { phrase: "\u201cthird time I\u2019m asking\u201d", count: 28, wow: 9, attaches: "Grievance SLA" },
  { phrase: "\u201cas discussed last time\u201d", count: 23, wow: 4, attaches: "Advisory follow-up" },
  { phrase: "\u201cyou promised\u201d", count: 19, wow: 6, attaches: "Call-back" },
];

function BreachLanguageTracker() {
  const max = Math.max(...BREACH_PHRASES.map((p) => p.count));
  return (
    <SectionCard title={"\u201cYou promised\u201d language tracker"} subtitle="Direct trust-breach phrases detected in conversations - the client telling us we broke our word" accent={T.red} aiPill>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {BREACH_PHRASES.map((p) => (
          <div key={p.phrase} style={{ display: "grid", gridTemplateColumns: "1.8fr 1.4fr auto", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 11.5, color: T.text, fontWeight: 600 }}>{p.phrase}</span>
            <div style={{ height: 16, borderRadius: 5, background: T.track, overflow: "hidden" }}>
              <div style={{ width: `${(p.count / max) * 100}%`, height: "100%", background: T.red, display: "flex", alignItems: "center", paddingLeft: 7 }}>
                <Mono c="#0d0d0d" s={10}>{p.count}</Mono>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
              <Mono c={T.red} s={10.5}>+{p.wow}</Mono>
              <Chip t="amber">{p.attaches}</Chip>
            </div>
          </div>
        ))}
      </div>
      <AIInsightStrip tone="red">
        &ldquo;Still waiting&rdquo; and &ldquo;you said you&apos;d call back&rdquo; dominate and are climbing double-digits - both attach to the call-back promise. This is the trust cost of the 79% adherence, spoken in the client&apos;s own words.
      </AIInsightStrip>
    </SectionCard>
  );
}

const BROKEN_LOOP: { type: string; chases: number; contacts: number; ch: string }[] = [
  { type: "Grievance SLA", chases: 3.4, contacts: 210, ch: "Voice" },
  { type: "24h call-back", chases: 2.8, contacts: 340, ch: "Voice" },
  { type: "KYC completion", chases: 2.2, contacts: 95, ch: "App / Chat" },
  { type: "Statement dispatch", chases: 1.9, contacts: 120, ch: "WhatsApp" },
];

function BrokenPromiseLoop() {
  const max = Math.max(...BROKEN_LOOP.map((r) => r.chases));
  return (
    <SectionCard title="Broken-promise repeat-contact loop" subtitle="When we miss a promise the client chases - the volume that manufactures itself" accent={T.amber} aiPill
      right={<span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10, color: T.muted }}><RefreshCw size={12} color={T.amber} /> self-inflicted</span>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {BROKEN_LOOP.map((r) => {
          const c = r.chases >= 3 ? T.red : r.chases >= 2 ? "#f97316" : T.amber;
          return (
            <div key={r.type} style={{ display: "grid", gridTemplateColumns: "1.4fr 1.8fr auto auto", gap: 10, alignItems: "center" }}>
              <span style={{ fontSize: 11.5, color: T.text, fontWeight: 600 }}>{r.type}</span>
              <div style={{ height: 16, borderRadius: 5, background: T.track, overflow: "hidden" }}>
                <div style={{ width: `${(r.chases / max) * 100}%`, height: "100%", background: c, display: "flex", alignItems: "center", paddingLeft: 7 }}>
                  <Mono c="#0d0d0d" s={10}>{r.chases} chases</Mono>
                </div>
              </div>
              <Mono c={T.sub} s={10.5}>{r.contacts} contacts</Mono>
              <ChannelPill k={r.ch} />
            </div>
          );
        })}
      </div>
      <AIInsightStrip tone="amber">
        A broken grievance promise generates 3.4 follow-up contacts on average - so the missed promises are also inflating call volume and cost. Call-back breaks alone created 340 chase-contacts this week that a status-push would have prevented.
      </AIInsightStrip>
    </SectionCard>
  );
}

const RECOVERY_BY_TYPE: { type: string; recovered: number; c: string }[] = [
  { type: "Statement dispatch", recovered: 72, c: T.green },
  { type: "Advisory follow-up", recovered: 61, c: T.green },
  { type: "24h call-back", recovered: 38, c: T.amber },
  { type: "Grievance SLA", recovered: 24, c: T.red },
];

function ServiceRecoveryDetection() {
  return (
    <SectionCard title="Service-recovery detection" subtitle="After a broken promise - did an apology or fix follow, and did sentiment recover?" accent={T.green} aiPill>
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        <MiniGauge label="attempted" topLabel="Recovery" value={62} color={T.cyan} />
        <MiniGauge label="recovered" topLabel="Sentiment" value={41} color={T.green} />
        <MiniGauge label="escalated" topLabel="Still neg." value={38} color={T.red} />
      </div>
      <div style={{ fontSize: 10, color: T.muted, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 7, fontWeight: 800 }}>Sentiment recovered, by promise type</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {RECOVERY_BY_TYPE.map((r) => (
          <div key={r.type} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 10.5, color: T.text, width: 132, flexShrink: 0 }}>{r.type}</span>
            <div style={{ flex: 1, height: 10, borderRadius: 999, background: T.track, overflow: "hidden" }}>
              <div style={{ width: `${r.recovered}%`, height: "100%", background: r.c }} />
            </div>
            <Mono c={r.c} s={11}>{r.recovered}%</Mono>
          </div>
        ))}
      </div>
      <AIInsightStrip tone="green">
        Only 62% of broken promises get any recovery conversation, and grievance recovers just 24% of the time - the highest-stakes break has the weakest save. A prompted apology-plus-status workflow on breach is the fastest trust repair.
      </AIInsightStrip>
    </SectionCard>
  );
}

function Drill2({ go }: { go: NavigateFn }) {
  return (
    <div className="fade">
      <DrillHeader onBack={() => go("overview")} title="Are we keeping our promises?"
        sub="Every commitment we make to a client - call-backs, resolutions, follow-ups - and the trust we keep or lose by honouring them. Regulatory matters are flagged to Compliance, not owned here."
        chips={<><Chip t="amber">Conversation-only</Chip><Chip t="green">Compliance flag - not owned</Chip></>} />
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.85fr) minmax(300px,1fr)", gap: 12, alignItems: "start" }}>
        <PromiseLedgerHero />
        <AISummaryWall rows={D2_AI} title="AI Promise Wall" subtitle="Ranked - promise & trust risks" />
      </div>
      <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 14, alignItems: "start" }}>
        <PromiseFlowFunnel />
        <TrustErosionTimeline />
      </div>
      <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 14, alignItems: "start" }}>
        <BreachLanguageTracker />
        <ServiceRecoveryDetection />
      </div>
      <div style={{ marginTop: 14 }}>
        <BrokenPromiseLoop />
      </div>
      <div style={{ height: 44 }} />
    </div>
  );
}

/* ============ DRILL 3 - IS SERVICE PAYING OFF? (economics + 3 transaction panels) ============ */
function RoiScorecardBand() {
  const cells: { label: string; value: string; delta: string; c: string; icon: LucideIcon }[] = [
    { label: "Containment value MTD", value: "Rs 1.84 Cr", delta: "+18% vs last month", c: T.green, icon: Coins },
    { label: "Cost avoided vs all-manual", value: "Rs 4.6 Cr", delta: "run-rate, annualised", c: T.cyan, icon: TrendingUp },
    { label: "Blended cost-to-serve", value: "Rs 61 / req", delta: "-9% trend", c: T.green, icon: Activity },
    { label: "Automation payback", value: "3.2x", delta: "value vs run cost", c: T.violet, icon: Zap },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 12 }}>
      {cells.map((c) => {
        const Icon = c.icon;
        return (
          <div key={c.label} style={{ background: `linear-gradient(180deg,${c.c}12,${T.card})`, border: `1px solid ${c.c}35`, borderTop: `3px solid ${c.c}`, borderRadius: 12, padding: "14px 15px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: `${c.c}22`, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={15} color={c.c} /></div>
              <Eyebrow>{c.label}</Eyebrow>
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, fontFamily: MONO, color: T.text, letterSpacing: "-.02em" }}>{c.value}</div>
            <Mono c={c.c} s={11}>{c.delta}</Mono>
          </div>
        );
      })}
    </div>
  );
}

function EconomicsSplit() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 12 }}>
      <CCWell accent={T.green} title="Automation rate" sub="share of eligible requests auto-handled">
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 30, fontWeight: 900, fontFamily: MONO, color: T.green }}>62%</span>
          <span style={{ fontSize: 11, color: T.green, fontWeight: 700 }}>+5 pts</span>
        </div>
        <div style={{ height: 92 }}>
          <ResponsiveContainer>
            <LineChart data={[{ w: "W-6", v: 52 }, { w: "W-5", v: 54 }, { w: "W-4", v: 56 }, { w: "W-3", v: 58 }, { w: "W-2", v: 60 }, { w: "Now", v: 62 }]} margin={{ top: 6, right: 6, left: -26, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis dataKey="w" tick={{ fill: T.dim, fontSize: 8 }} tickLine={false} />
              <YAxis domain={[40, 70]} tick={{ fill: T.dim, fontSize: 8 }} width={24} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={TIP} />
              <Line type="monotone" dataKey="v" stroke={T.green} strokeWidth={2.2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CCWell>

      <CCWell accent={T.cyan} title="Self-service deflection" sub="resolved without an agent, by intent">
        {[["Balance query", 74, T.green], ["Statement query", 61, T.green], ["Report request", 34, T.amber], ["Status / KYC chase", 41, T.amber]].map(([l, v, c]) => (
          <div key={l as string} style={{ marginBottom: 7 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
              <span style={{ fontSize: 10.5, color: T.text, fontWeight: 600 }}>{l}</span>
              <Mono c={c as string} s={11}>{v}%</Mono>
            </div>
            <div style={{ height: 9, borderRadius: 999, background: T.track, overflow: "hidden" }}>
              <div style={{ width: `${v}%`, height: "100%", background: c as string }} />
            </div>
          </div>
        ))}
      </CCWell>

      <CCWell accent={T.violet} title="Triage overhead" sub="handling-time still added by manual triage">
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 30, fontWeight: 900, fontFamily: MONO, color: T.violet }}>31%</span>
          <span style={{ fontSize: 11, color: T.dim }}>recoverable</span>
        </div>
        <MiniBars bars={[
          { name: "Early classify", v: 62, c: T.green },
          { name: "Auto-ack", v: 48, c: T.cyan },
          { name: "Self-serve report", v: 41, c: T.amber },
          { name: "Status auto-push", v: 55, c: T.green },
        ]} />
      </CCWell>
    </div>
  );
}

/* inline AI recommendations strip (replaces the wall in D3) */
const D3_RECS: { rec: string; impact: string; owner: string; t: string }[] = [
  { rec: "Deflect Voice to App on balance & statement", impact: "Rs 1.2 Cr / yr cost-to-serve saving", owner: "digital", t: "green" },
  { rec: "Build a self-service report builder", impact: "closes the biggest deflection gap (34%)", owner: "digital", t: "cyan" },
  { rec: "Fire automation on early intent", impact: "recover 38% eligible-but-manual volume", owner: "service", t: "amber" },
];

function AiRecommendationsStrip() {
  return (
    <SectionCard title="AI recommendations" subtitle="Where the next rupee of efficiency comes from - ranked by payoff" accent={T.gold} aiPill>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 12 }}>
        {D3_RECS.map((r, i) => {
          const c = tone(r.t);
          return (
            <div key={r.rec} style={{ background: `${c}10`, border: `1px solid ${c}35`, borderLeft: `3px solid ${c}`, borderRadius: 10, padding: "12px 13px", display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 20, height: 20, borderRadius: 999, background: `${c}22`, color: c, fontSize: 11, fontWeight: 800, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: MONO }}>{i + 1}</span>
                <Eyebrow c={c}>Priority {i + 1}</Eyebrow>
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: T.text, lineHeight: 1.35 }}>{r.rec}</div>
              <div style={{ fontSize: 11, color: T.sub, lineHeight: 1.4 }}>{r.impact}</div>
              <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <RouteChip r={r.owner} />
                <ConsentChip />
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

function OperationsJoinBanner() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", padding: "12px 14px", borderRadius: 12, background: `${T.blue}12`, border: `1px solid ${T.blue}40`, borderLeft: `3px solid ${T.blue}` }}>
      <ShieldCheck size={18} color={T.blue} />
      <div style={{ minWidth: 220, flex: 1 }}>
        <div style={{ fontSize: 12.5, fontWeight: 800, color: T.text }}>Operations join - fulfilment & cost data</div>
        <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.45 }}>
          The three panels below join hard fulfilment and cost-to-serve records to the conversation layer. This is the only place transaction data appears - every other screen is conversation-only.
        </div>
      </div>
      <Chip t="blue">Transaction data</Chip>
    </div>
  );
}

const STR_ROWS: { type: string; volume: string; stp: number; manual: number; sla: string }[] = [
  { type: "Statement / report", volume: "12,400", stp: 78, manual: 22, sla: "98%" },
  { type: "Balance / holding query", volume: "9,240", stp: 84, manual: 16, sla: "99%" },
  { type: "Standing-instruction update", volume: "3,180", stp: 62, manual: 38, sla: "91%" },
  { type: "KYC refresh", volume: "4,120", stp: 47, manual: 53, sla: "84%" },
  { type: "Grievance resolution", volume: "3,580", stp: 19, manual: 81, sla: "72%" },
];

function StraightThroughResolutionPanel() {
  return (
    <SectionCard title="Straight-through resolution" subtitle="Fulfilment records - share resolved end-to-end without manual handling" accent={T.blue} aiPill right={<Chip t="blue">Transaction</Chip>}>
      <div style={{ border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr .9fr 1.4fr .8fr", gap: 8, padding: "7px 10px", background: T.row }}>
          {["REQUEST TYPE", "VOLUME", "STP vs MANUAL", "SLA"].map((h) => <Eyebrow key={h}>{h}</Eyebrow>)}
        </div>
        {STR_ROWS.map((r, i) => {
          const c = r.stp >= 70 ? T.green : r.stp >= 50 ? T.amber : T.red;
          return (
            <div key={r.type} style={{ display: "grid", gridTemplateColumns: "1.6fr .9fr 1.4fr .8fr", gap: 8, padding: "8px 10px", borderTop: i ? `1px solid ${T.border}` : "none", alignItems: "center" }}>
              <span style={{ fontSize: 11.5, color: T.text, fontWeight: 600 }}>{r.type}</span>
              <Mono c={T.sub} s={11}>{r.volume}</Mono>
              <div style={{ display: "flex", height: 16, borderRadius: 5, overflow: "hidden", background: T.track }}>
                <div style={{ width: `${r.stp}%`, background: c, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#0d0d0d" }}>{r.stp}</div>
                <div style={{ width: `${r.manual}%`, background: T.inner, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: T.muted }}>{r.manual}</div>
              </div>
              <Mono c={r.sla >= "90%" ? T.green : T.amber} s={11}>{r.sla}</Mono>
            </div>
          );
        })}
      </div>
      <AIInsightStrip tone="blue">
        Grievance resolution is only 19% straight-through - the conversation layer already flags it as the heaviest manual load, and the fulfilment record confirms the cost. Automating acknowledgement and status lifts both.
      </AIInsightStrip>
    </SectionCard>
  );
}

const CTS_ROWS: { ch: string; perReq: number; volume: string; trend: number }[] = [
  { ch: "App / Chat", perReq: 12, volume: "11,530", trend: -8 },
  { ch: "WhatsApp", perReq: 28, volume: "14,860", trend: -3 },
  { ch: "Email", perReq: 46, volume: "9,240", trend: 2 },
  { ch: "Service Desk", perReq: 88, volume: "7,180", trend: 4 },
  { ch: "Voice", perReq: 142, volume: "18,420", trend: 6 },
];

function CostToServePanel() {
  const max = Math.max(...CTS_ROWS.map((r) => r.perReq));
  return (
    <SectionCard title="Cost-to-serve by channel" subtitle="Fulfilment cost ledger - rupee per resolved request - trend vs last month" accent={T.blue} aiPill right={<Chip t="blue">Transaction</Chip>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {CTS_ROWS.map((r) => {
          const c = r.perReq >= 100 ? T.red : r.perReq >= 50 ? T.amber : T.green;
          return (
            <div key={r.ch} style={{ display: "grid", gridTemplateColumns: "1.2fr 2.4fr auto", gap: 10, alignItems: "center" }}>
              <ChannelPill k={r.ch} />
              <div style={{ height: 18, borderRadius: 5, background: T.track, overflow: "hidden" }}>
                <div style={{ width: `${(r.perReq / max) * 100}%`, height: "100%", background: c, display: "flex", alignItems: "center", paddingLeft: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: "#0d0d0d", fontFamily: MONO }}>Rs {r.perReq}</span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
                <Mono c={T.sub} s={10.5}>{r.volume}</Mono>
                <Mono c={r.trend < 0 ? T.green : T.red} s={10.5}>{r.trend > 0 ? "+" : ""}{r.trend}%</Mono>
              </div>
            </div>
          );
        })}
      </div>
      <AIInsightStrip tone="blue">
        Voice is Rs 142 per request - nearly 12x App / Chat at Rs 12. Deflecting from Voice to App is the single largest cost-to-serve lever, and App volume is already the fastest-growing channel.
      </AIInsightStrip>
    </SectionCard>
  );
}

function ContainmentValuePanel() {
  return (
    <SectionCard title="Containment value - automation ROI" subtitle="Fulfilment + cost ledger - rupee removed from assisted channels, month-to-date" accent={T.blue} aiPill right={<Chip t="blue">Transaction</Chip>}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 12 }}>
        {[["Containment MTD", "Rs 1.84 Cr", "+18%", T.green], ["Requests deflected", "48,200", "+12%", T.cyan], ["Cost avoided / req", "Rs 38", "+6%", T.green]].map(([l, v, d, c]) => (
          <div key={l as string} style={{ padding: "12px 14px", borderRadius: 12, background: T.inset, border: `1px solid ${c as string}35`, borderLeft: `3px solid ${c as string}` }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 0.6 }}>{l}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: T.text, fontFamily: MONO, marginTop: 4 }}>{v}</div>
            <Mono c={c as string} s={11}>{d}</Mono>
          </div>
        ))}
      </div>
      <div style={{ height: 150 }}>
        <ResponsiveContainer>
          <BarChart data={[{ m: "Balance", v: 62 }, { m: "Statement", v: 48 }, { m: "Report", v: 22 }, { m: "Status chase", v: 34 }, { m: "KYC", v: 18 }]} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
            <XAxis dataKey="m" tick={{ fill: T.dim, fontSize: 10 }} tickLine={false} />
            <YAxis tick={{ fill: T.dim, fontSize: 9 }} width={30} tickLine={false} axisLine={false} tickFormatter={(v) => `Rs${v}L`} />
            <Tooltip contentStyle={TIP} formatter={(v) => [`Rs ${v}L MTD`, "Containment"]} />
            <Bar dataKey="v" radius={[4, 4, 0, 0]}>
              {[T.green, T.green, T.amber, T.cyan, T.amber].map((c, i) => <Cell key={i} fill={c} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <AIInsightStrip tone="blue">
        Rs 1.84 Cr removed month-to-date, led by balance and statement containment. Report deflection is the smallest bar and the clearest next investment - the conversation layer already shows the demand is there.
      </AIInsightStrip>
    </SectionCard>
  );
}

function Drill3({ go }: { go: NavigateFn }) {
  return (
    <div className="fade">
      <DrillHeader onBack={() => go("overview")} title="Is service paying off?"
        sub="Whether the service machine is getting faster and cheaper - automation, self-service and the manual overhead still in the flow - proven against hard fulfilment and cost-to-serve data."
        chips={<><Chip t="green">Conversation + operations</Chip><Chip t="blue">Includes transaction data</Chip></>} />
      <RoiScorecardBand />
      <div style={{ marginTop: 14 }}><EconomicsSplit /></div>
      <div style={{ marginTop: 14 }}><AiRecommendationsStrip /></div>
      <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 14 }}>
        <OperationsJoinBanner />
        <StraightThroughResolutionPanel />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 12, alignItems: "stretch" }}>
          <CostToServePanel />
          <ContainmentValuePanel />
        </div>
      </div>
      <div style={{ height: 44 }} />
    </div>
  );
}

/* ============ Floating AI analyst (canned, self-contained) ============ */
const AI_PROMPTS = [
  "Which clients are most likely to leave?",
  "Which promises are we breaking most?",
  "Is service actually getting cheaper to run?",
  "What should I fix first this week?",
];
function cannedAnswer(q: string): string {
  const s = q.toLowerCase();
  if (s.includes("leave") || s.includes("staying") || s.includes("attriti") || s.includes("risk"))
    return "The clearest attrition risk is South Core-HNI: 47 clients using exit-intent language versus a baseline of 6, sentiment down 0.58. Behind them, 312 high-value clients have gone quiet after cooling sentiment - a leading signal, not a neutral one. Both go to the RM team as human-approved evidence packs; nothing auto-contacts a client.";
  if (s.includes("promise") || s.includes("call") || s.includes("break"))
    return "Call-back promises are the weakest at 79% adherence with 9 broken this week, followed by grievance-SLA at 72%. Both are flagged where they could become a Compliance matter - CX surfaces, Compliance owns any filing. The biggest leak is between actioning a promise and the client seeing it kept, so a status-push at completion is the fastest fix.";
  if (s.includes("cheap") || s.includes("cost") || s.includes("paying") || s.includes("roi") || s.includes("service"))
    return "Yes - automation covers 62% of eligible requests and containment value is Rs 1.84 Cr month-to-date, a 3.2x payback against run cost. The largest remaining lever is deflecting Voice at Rs 142 per request to App / Chat at Rs 12. Report requests are the weakest deflection at 34% and the clearest next investment.";
  if (s.includes("fix") || s.includes("first") || s.includes("priorit") || s.includes("week"))
    return "This week, in order: (1) work the South Core-HNI exit-intent cohort with RM evidence packs - highest book value at risk; (2) clear the 9 broken call-back promises and turn on an 18-hour breach alert, which also lifts the South NPS; (3) start the Voice-to-App deflection for balance and statement queries to bank the cost-to-serve saving. The first two share a root, so they compound.";
  return "I read every client conversation across channels and organise it three ways: are our best clients staying, are we keeping our promises, and is service paying off. Ask about attrition risk, broken promises, or cost-to-serve and I will trace it to a root cause and a human-approved next step.";
}

function FloatingAI() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [thread, setThread] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const ask = (question: string) => {
    if (!question.trim()) return;
    setThread((t) => [...t, { role: "user", text: question }, { role: "ai", text: cannedAnswer(question) }]);
    setQ("");
  };
  return (
    <>
      <button type="button" onClick={() => setOpen((o) => !o)} style={{ position: "fixed", right: 22, bottom: 22, zIndex: 60, width: 52, height: 52, borderRadius: 999, border: `1px solid ${T.gold}`, background: "linear-gradient(135deg,#3a2e0b,#161616)", color: T.gold, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 30px rgba(0,0,0,.5)" }} aria-label="Ask LiSN">
        {open ? <ChevronDown size={20} /> : <Sparkles size={20} />}
      </button>
      {open ? (
        <div style={{ position: "fixed", right: 22, bottom: 84, zIndex: 60, width: 380, maxWidth: "calc(100vw - 44px)", height: 520, maxHeight: "calc(100vh - 120px)", background: T.card, border: `1px solid ${T.btn}`, borderRadius: 16, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,.6)" }}>
          <div style={{ padding: "14px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: `${T.gold}20`, display: "flex", alignItems: "center", justifyContent: "center" }}><Sparkles size={16} color={T.gold} /></div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: T.text }}>Ask LiSN</div>
              <div style={{ fontSize: 10.5, color: T.muted }}>Client-experience analyst - conversation-grounded</div>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {thread.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 11, color: T.muted, marginBottom: 2 }}>Try asking:</div>
                {AI_PROMPTS.map((p) => (
                  <button key={p} type="button" onClick={() => ask(p)} style={{ textAlign: "left", background: T.inset, border: `1px solid ${T.inner}`, borderRadius: 10, padding: "9px 11px", color: T.sub, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>{p}</button>
                ))}
              </div>
            ) : (
              thread.map((m, i) => (
                <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "88%", background: m.role === "user" ? T.blue : T.inset, color: m.role === "user" ? "#fff" : T.sub, border: m.role === "user" ? "none" : `1px solid ${T.inner}`, borderRadius: 12, padding: "9px 12px", fontSize: 12, lineHeight: 1.5 }}>{m.text}</div>
              ))
            )}
          </div>
          <div style={{ padding: 12, borderTop: `1px solid ${T.border}`, display: "flex", gap: 8 }}>
            <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") ask(q); }} placeholder="Ask about clients, promises or cost..." style={{ flex: 1, background: T.inset, border: `1px solid ${T.inner}`, borderRadius: 10, padding: "9px 11px", color: T.text, fontSize: 12, fontFamily: "inherit", outline: "none" }} />
            <button type="button" onClick={() => ask(q)} style={{ background: T.gold, border: "none", borderRadius: 10, width: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} aria-label="Send"><Send size={16} color="#0d0d0d" /></button>
          </div>
        </div>
      ) : null}
    </>
  );
}

/* ============ ROOT ============ */
export function ClientExperienceDashboard({ onExit }: { onExit?: () => void }) {
  const [screen, setScreen] = useState("overview");
  const go: NavigateFn = (s) => {
    setScreen(s);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const navItems: { key: string; icon: LucideIcon }[] = [
    { key: "overview", icon: Activity },
    { key: "d1", icon: Users },
    { key: "d2", icon: ShieldCheck },
    { key: "d3", icon: TrendingUp },
  ];
  return (
    <div className="lisn-cx" style={{ background: T.bg, color: T.text, minHeight: "100vh", fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif", fontWeight: 600, display: "grid", gridTemplateColumns: "72px 1fr" }}>
      <style>{`
        .lisn-cx *{box-sizing:border-box}
        .lisn-cx .fade{animation:lisnf .22s ease-out}@keyframes lisnf{from{opacity:.3;transform:translateY(6px)}to{opacity:1;transform:none}}
        .lisn-cx .bigcard{transition:transform .16s ease,box-shadow .16s ease}.lisn-cx .bigcard:hover{transform:translateY(-3px);box-shadow:0 16px 40px rgba(0,0,0,.5)}
        .lisn-cx button:focus-visible,.lisn-cx .bigcard:focus-visible,.lisn-cx input:focus-visible{outline:2px solid ${T.gold};outline-offset:2px}
        .lisn-cx input::placeholder{color:${T.dim}}
        @media (prefers-reduced-motion: reduce){.lisn-cx .fade,.lisn-cx .bigcard{animation:none;transition:none}}
        .lisn-cx .overview-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
        @media (max-width:1100px){.lisn-cx .overview-cards{grid-template-columns:1fr}}
      `}</style>
      <aside style={{ background: T.row, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 0", gap: 12, position: "sticky", top: 0, height: "100vh" }}>
        <button type="button" onClick={onExit} title="Back to roles" style={{ width: 36, height: 36, borderRadius: 11, background: "#241a44", border: `1px solid ${T.violet}`, display: "flex", alignItems: "center", justifyContent: "center", color: T.violet, fontWeight: 900, cursor: onExit ? "pointer" : "default", fontFamily: "inherit", fontSize: 15 }}>Y</button>
        <div style={{ width: "55%", height: 1, background: T.border }} />
        {navItems.map((n) => {
          const active = screen === n.key;
          const Ic = n.icon;
          return (
            <button key={n.key} type="button" onClick={() => go(n.key)} title={n.key} style={{ width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: active ? T.violet : T.dim, background: active ? "#221a40" : "transparent", borderLeft: active ? `3px solid ${T.violet}` : "3px solid transparent", border: active ? undefined : "none", cursor: "pointer" }}>
              <Ic size={17} />
            </button>
          );
        })}
        <div style={{ flex: 1 }} />
        <div style={{ width: 32, height: 32, borderRadius: 9, background: T.inset, display: "flex", alignItems: "center", justifyContent: "center", color: T.muted, fontSize: 12, fontWeight: 800 }}>RJ</div>
      </aside>
      <main style={{ padding: "16px 22px 36px", overflow: "auto", minWidth: 0 }}>
        {screen === "overview" && <Overview go={go} />}
        {screen === "d1" && <Drill1 go={go} />}
        {screen === "d2" && <Drill2 go={go} />}
        {screen === "d3" && <Drill3 go={go} />}
      </main>
      <FloatingAI />
    </div>
  );
}

export default ClientExperienceDashboard;