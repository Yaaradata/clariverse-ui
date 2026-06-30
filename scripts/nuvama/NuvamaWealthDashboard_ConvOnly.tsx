"use client";

/**
 * LiSN / Fluid CX · Nuvama — CONVERSATION-ONLY dashboard.
 * Drop-in replacement for the NuvamaWealthDashboard component file.
 *
 * Data is conversation-only (calls, WhatsApp, service, app, email, complaints, NPS/CSAT).
 * NO book/₹ anywhere. Command view mirrors the Head of Retail Banking page
 * (service-promise + complaints); drill screens follow the CreditCardsV3DrillDownScreens pattern.
 * Align spacing/visual grammar to those two repo components.
 */

import {
  Activity,
  ArrowLeft,
  ChevronRight,
  Headphones,
  Moon,
  RefreshCw,
  Send,
  Shield,
  Sparkles,
  Sun,
  Target,
  TrendingDown,
  X,
} from "lucide-react";
import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  DashboardThemeProvider,
  type DashboardThemeTokens,
  useDashboardTheme,
} from "./DashboardThemeContext";
import {
  type AuditEvent,
  type ComparisonWindow,
  type NuvamaLens,
  type NuvamaSignal,
  NUAMA_AI_PROMPTS,
  NUAMA_EVIDENCE,
  NUAMA_EXECUTIVE_BRIEF,
  NUAMA_EXECUTIVE_PULSE,
  NUAMA_HEATMAP,
  NUAMA_KPI_STRIP,
  NUAMA_SERVICE_PROMISES,
  NUAMA_SIGNALS,
  NUAMA_SUITABILITY_ITEMS,
  cohortById,
  generateNuvamaAIResponse,
  signalById,
} from "@/lib/role-based-dashboard/nuvamaData";
import { T as REGISTRY_THEME } from "@/lib/role-based-dashboard/registry";

// ─── Theme (light default per Stage 9C) ─────────────────────────────────────
const NUAMA_ACCENT = "#0B4F8A";

const NUAMA_LIGHT: DashboardThemeTokens = {
  ...REGISTRY_THEME,
  bg: "#F5F7FA",
  surface: "#FFFFFF",
  card: "#FFFFFF",
  elevated: "#FFFFFF",
  border: "#E0E4ED",
  borderLight: "#E8ECF2",
  cyan: NUAMA_ACCENT,
  cyanGlow: "rgba(11, 79, 138, 0.10)",
  gold: "#C5A028",
  goldGlow: "rgba(197, 160, 40, 0.12)",
  text: "#1A1A2E",
  textSec: "#4B5563",
  textMut: "#6B7280",
};

const NUAMA_DARK: DashboardThemeTokens = {
  ...REGISTRY_THEME,
  bg: "#0a1220",
  surface: "#0e1830",
  card: "#0e1830",
  elevated: "#142040",
  border: "#1a2d50",
  borderLight: "#243a60",
  cyan: "#38bdf8",
  cyanGlow: "rgba(56, 189, 248, 0.12)",
  text: "#e2e8f0",
  textSec: "#94a3b8",
  textMut: "#5e718a",
};

export type NuvamaWealthDashboardProps = {
  industryName: string;
  roleName: string;
  industryColor: string;
  onExit: () => void;
};

type DrillState =
  | { type: "none" }
  | { type: "cohort"; cohortId: string; signalId: string }
  | { type: "cell"; cellId: string }
  | { type: "risk-item"; itemId: string };

function severityColor(sev: string, T: DashboardThemeTokens): string {
  if (sev === "high" || sev === "critical") return T.red;
  if (sev === "med" || sev === "medium") return T.amber;
  return T.cyan;
}

function AiMarker({ size = 12 }: { size?: number }) {
  const T = useDashboardTheme();
  return (
    <span style={{ color: T.gold, fontSize: size, fontWeight: 700 }} title="AI insight">
      ✦
    </span>
  );
}

function CardShell({
  title,
  children,
  aiMarked,
  style,
}: {
  title?: string;
  children: ReactNode;
  aiMarked?: boolean;
  style?: CSSProperties;
}) {
  const T = useDashboardTheme();
  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "16px 18px", ...style }}>
      {title ? (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
          {aiMarked ? <AiMarker /> : null}
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.text }}>{title}</h3>
        </div>
      ) : null}
      {children}
    </div>
  );
}

function FilterBar() {
  const T = useDashboardTheme();
  const filters = ["Segment", "RM/EWM", "Region", "Branch", "Tenure", "Channel"];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
      <span style={{ fontSize: 11, color: T.textMut, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
        Filters
      </span>
      {filters.map((f) => (
        <button
          key={f}
          type="button"
          style={{ fontSize: 11, padding: "5px 10px", borderRadius: 6, border: `1px solid ${T.border}`, background: T.surface, color: T.textSec, cursor: "pointer" }}
        >
          {f} ▾
        </button>
      ))}
    </div>
  );
}

function ExecutivePulseStrip() {
  const T = useDashboardTheme();
  const toneMap = { critical: T.red, focus: T.amber, stable: T.green };
  return (
    <CardShell aiMarked>
      <div style={{ fontSize: 11, fontWeight: 700, color: T.gold, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
        <AiMarker size={11} /> Executive Pulse · this week vs last
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}>
        {NUAMA_EXECUTIVE_PULSE.map((p) => (
          <div key={p.label} style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10, padding: "10px 12px", borderLeft: `3px solid ${toneMap[p.tone]}` }}>
            <div style={{ fontSize: 10, color: T.textMut, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 4 }}>{p.label}</div>
            <div style={{ fontSize: 12.5, color: T.textSec, lineHeight: 1.45 }}>{p.main}</div>
          </div>
        ))}
      </div>
    </CardShell>
  );
}

function ExecutiveBriefStrip() {
  const T = useDashboardTheme();
  return (
    <div style={{ background: T.elevated, borderRadius: 10, padding: "12px 14px", border: `1px solid ${T.border}`, borderLeft: `3px solid ${T.gold}` }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: T.gold, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
        <AiMarker size={11} /> Executive Brief
      </div>
      <p style={{ margin: 0, fontSize: 13.5, color: T.textSec, lineHeight: 1.5 }}>{NUAMA_EXECUTIVE_BRIEF}</p>
    </div>
  );
}

// Conversation-only executive KPIs (NPS / complaint-escalation / service-promise adherence).
function ExecutiveTiles({ window }: { window: ComparisonWindow }) {
  const T = useDashboardTheme();
  const tiles = [
    { label: "Wealth NPS", value: NUAMA_KPI_STRIP.nps.value, delta: NUAMA_KPI_STRIP.nps.delta, tag: NUAMA_KPI_STRIP.nps.tag, icon: Target },
    { label: "Complaint-escalation rate", value: NUAMA_KPI_STRIP.complaintEscalation.value, delta: NUAMA_KPI_STRIP.complaintEscalation.delta, tag: NUAMA_KPI_STRIP.complaintEscalation.tag, icon: TrendingDown },
    { label: "Service-promise adherence", value: NUAMA_KPI_STRIP.promiseAdherence.value, delta: NUAMA_KPI_STRIP.promiseAdherence.delta, tag: NUAMA_KPI_STRIP.promiseAdherence.tag, icon: Shield },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
      {tiles.map((t) => {
        const Icon = t.icon;
        return (
          <div key={t.label} style={{ background: T.elevated, border: `1px solid ${T.border}`, borderRadius: 14, padding: "16px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: T.cyanGlow, display: "grid", placeItems: "center" }}>
                <Icon size={16} color={T.cyan} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: T.textMut, textTransform: "uppercase", letterSpacing: 0.4 }}>{t.label}</div>
                <div style={{ fontSize: 10, color: T.gold, fontWeight: 600 }}>{t.tag === "north-star" ? "North-star" : "Diagnostic"}</div>
              </div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: T.text, fontFamily: "var(--mono)" }}>{t.value}</div>
            <div style={{ fontSize: 12, color: T.red, marginTop: 4, fontWeight: 600 }}>{t.delta}</div>
            <div style={{ fontSize: 10, color: T.textMut, marginTop: 6 }}>{window === "WoW" ? "This week vs last" : "This month vs last"}</div>
          </div>
        );
      })}
    </div>
  );
}

// Service-promise block — mirrors the Head of Retail Banking "service promise" panel.
function ServicePromisePanel() {
  const T = useDashboardTheme();
  const gradId = useId().replace(/:/g, "");
  const totals = NUAMA_SERVICE_PROMISES.reduce(
    (a, r) => ({ made: a.made + r.made, kept: a.kept + r.kept, broken: a.broken + r.broken, overdue: a.overdue + r.overdue }),
    { made: 0, kept: 0, broken: 0, overdue: 0 },
  );
  const adherence = Math.round((totals.kept / totals.made) * 100);
  const data = NUAMA_SERVICE_PROMISES.map((r) => ({ branch: r.branch.replace(/^BR-\S+\s/, ""), broken: r.broken, overdue: r.overdue }));
  return (
    <CardShell title="Service-promise adherence" aiMarked>
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginBottom: 12 }}>
        {[
          { k: "Adherence", v: `${adherence}%`, c: T.text },
          { k: "Made", v: totals.made, c: T.textSec },
          { k: "Broken", v: totals.broken, c: T.red },
          { k: "Overdue", v: totals.overdue, c: T.amber },
        ].map((s) => (
          <div key={s.k}>
            <div style={{ fontSize: 10, color: T.textMut, textTransform: "uppercase", letterSpacing: 0.4 }}>{s.k}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.c, fontFamily: "var(--mono)" }}>{s.v}</div>
          </div>
        ))}
      </div>
      <div style={{ height: 170 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`brk-${gradId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={T.red} stopOpacity={0.9} />
                <stop offset="100%" stopColor={T.red} stopOpacity={0.45} />
              </linearGradient>
              <linearGradient id={`ovd-${gradId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={T.amber} stopOpacity={0.9} />
                <stop offset="100%" stopColor={T.amber} stopOpacity={0.45} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
            <XAxis dataKey="branch" tick={{ fill: T.textMut, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: T.textMut, fontSize: 11 }} axisLine={false} tickLine={false} />
            <RechartsTooltip contentStyle={{ background: T.elevated, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 11 }} />
            <Bar dataKey="broken" name="Broken" fill={`url(#brk-${gradId})`} radius={[5, 5, 0, 0]} />
            <Bar dataKey="overdue" name="Overdue" fill={`url(#ovd-${gradId})`} radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p style={{ margin: "10px 0 0", fontSize: 11.5, color: T.textSec, lineHeight: 1.5 }}>
        <AiMarker /> Promises made on calls (callbacks, statements, resolutions) versus what later conversations show as kept, broken, or overdue. From conversation only.
      </p>
    </CardShell>
  );
}

// Complaints block — mirrors the Head of Retail Banking "complaints" panel.
function ComplaintsPanel({ onOpenCx }: { onOpenCx: () => void }) {
  const T = useDashboardTheme();
  const rows = [...NUAMA_HEATMAP].sort((a, b) => b.complaintRate / b.baselineRate - a.complaintRate / a.baselineRate).slice(0, 3);
  return (
    <CardShell title="Complaints — themes & escalation" aiMarked>
      {rows.map((c) => {
        const hot = c.complaintRate > c.baselineRate * 1.3;
        return (
          <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${T.border}` }}>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: T.text }}>{c.theme}</div>
              <div style={{ fontSize: 11, color: T.textMut }}>{c.branch} · escalation {c.escalationRate}% · SCORES ATR {c.atrDueDays}d</div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: hot ? T.red : T.textSec, fontFamily: "var(--mono)" }}>
              {c.complaintRate}% <span style={{ fontSize: 10, color: T.textMut }}>vs {c.baselineRate}%</span>
            </div>
          </div>
        );
      })}
      <button
        type="button"
        onClick={onOpenCx}
        style={{ marginTop: 12, fontSize: 12, padding: "8px 14px", borderRadius: 8, border: `1px solid ${T.cyan}`, background: T.cyanGlow, color: T.cyan, cursor: "pointer", fontWeight: 600 }}
      >
        Open CX lens →
      </button>
    </CardShell>
  );
}

function InsightCard({
  signal,
  onDrill,
  onRoute,
  liveTick,
}: {
  signal: NuvamaSignal;
  onDrill: () => void;
  onRoute: () => void;
  liveTick: number;
}) {
  const T = useDashboardTheme();
  const tone = severityColor(signal.severity, T);
  const cohort = signal.cohortId ? cohortById(signal.cohortId) : undefined;
  return (
    <div style={{ minWidth: 280, maxWidth: 320, flex: "1 1 280px", borderRadius: 14, border: `1px solid ${tone}55`, background: `${tone}08`, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: T.text, lineHeight: 1.3 }}>{signal.title}</div>
        <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", padding: "3px 8px", borderRadius: 999, background: `${tone}22`, color: tone, flexShrink: 0 }}>
          {signal.severity}
        </span>
      </div>
      {cohort ? (
        <div style={{ fontSize: 11, color: T.textMut }}>
          Cohort: <span style={{ color: T.textSec }}>{cohort.id} · {cohort.label}</span>
        </div>
      ) : null}
      <div style={{ fontSize: 10, color: T.textMut, fontStyle: "italic", lineHeight: 1.4 }}>{signal.honestyLine}</div>
      <div style={{ fontSize: 10, color: T.textMut }}>Onset: {signal.timeOnset}</div>
      <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10, padding: 10, display: "flex", flexDirection: "column", gap: 6 }}>
        {signal.stats.map((s) => (
          <div key={s.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
            <span style={{ color: T.textMut }}>{s.label}</span>
            <span style={{ color: T.text, fontWeight: 600, fontFamily: "var(--mono)" }}>{s.actual}</span>
          </div>
        ))}
        <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 6, display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: T.textMut, fontSize: 11 }}>{signal.impactLabel}</span>
          <span style={{ color: tone, fontWeight: 800, fontFamily: "var(--mono)" }}>{signal.impactValue}</span>
        </div>
      </div>
      <div style={{ fontSize: 11.5, lineHeight: 1.5, color: T.textSec, background: T.surface, borderRadius: 8, padding: 10, border: `1px solid ${T.gold}40` }} title={signal.explainability}>
        <AiMarker /> {signal.recommendedAction}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
        <button type="button" onClick={onDrill} style={{ flex: 1, fontSize: 11, padding: "8px 10px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.surface, color: T.text, cursor: "pointer", fontWeight: 600 }}>
          View evidence
        </button>
        <button type="button" onClick={onRoute} style={{ flex: 1, fontSize: 11, padding: "8px 10px", borderRadius: 8, border: "none", background: T.cyan, color: "#fff", cursor: "pointer", fontWeight: 600 }}>
          Draft route
        </button>
      </div>
      <div style={{ fontSize: 9, color: T.textMut, opacity: 0.5 + (liveTick % 3) * 0.1 }}>Live monitor · refresh {liveTick}s</div>
    </div>
  );
}

function AttritionRiskMonitor({
  signals,
  onDrill,
  onRoute,
  liveTick,
}: {
  signals: NuvamaSignal[];
  onDrill: (signalId: string, cohortId: string) => void;
  onRoute: (signal: NuvamaSignal) => void;
  liveTick: number;
}) {
  const T = useDashboardTheme();
  const rail = signals.filter((s) => s.card === "ATTRITION");
  return (
    <section>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <Activity size={16} color={T.gold} />
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: T.text }}>Attrition-risk language monitor</h2>
        <AiMarker />
        <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 999, background: `${T.red}18`, color: T.red, fontWeight: 700 }}>ACT ON THESE</span>
      </div>
      <p style={{ margin: "0 0 12px", fontSize: 12, color: T.textMut }}>
        Triaged cohorts whose call and chat language is shifting to exit and liquidity — cohort-level only, from conversation alone.
      </p>
      <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
        {rail.map((s) =>
          s.cohortId ? (
            <InsightCard key={s.id} signal={s} liveTick={liveTick} onDrill={() => onDrill(s.id, s.cohortId!)} onRoute={() => onRoute(s)} />
          ) : null,
        )}
      </div>
    </section>
  );
}

function EvidenceDrillPanel({
  signalId,
  onBack,
  onRoute,
  onRouteToCro,
}: {
  signalId: string;
  onBack: () => void;
  onRoute: () => void;
  onRouteToCro?: () => void;
}) {
  const T = useDashboardTheme();
  const signal = signalById(signalId);
  const pack = NUAMA_EVIDENCE[signalId];
  if (!signal || !pack) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <button type="button" onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: T.textMut, cursor: "pointer", fontSize: 13, width: "fit-content" }}>
        <ArrowLeft size={14} /> Back to command view
      </button>
      <div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: T.text }}>This is what the client said — weeks before anything shows in the book</h1>
        <p style={{ margin: "8px 0 0", fontSize: 14, color: T.textSec, lineHeight: 1.5 }}>
          The early signal from conversation alone — act now while attrition is still reversible. No book data is used.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <CardShell title="Interaction evidence (cohort-level)">
          {pack.interactionSnippets.map((sn) => (
            <div key={sn.theme} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 10, color: T.cyan, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>{sn.theme}</div>
              <p style={{ margin: 0, fontSize: 13, color: T.textSec, lineHeight: 1.5 }}>{sn.excerpt}</p>
            </div>
          ))}
        </CardShell>
        <CardShell title="Engagement & escalation (conversation)">
          {pack.engagementDelta.map((b) => (
            <div key={b.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 13 }}>
              <span style={{ color: T.textMut }}>{b.label}</span>
              <span style={{ color: T.text, fontWeight: 700, fontFamily: "var(--mono)" }}>{b.value}</span>
            </div>
          ))}
          {pack.promiseStats ? (
            <div style={{ marginTop: 12, padding: 10, background: T.bg, borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: T.textMut, marginBottom: 6 }}>Service promises (this cohort)</div>
              <div style={{ fontSize: 13, color: T.text }}>
                Made {pack.promiseStats.made} · Kept {pack.promiseStats.kept} · Broken {pack.promiseStats.broken} · Overdue {pack.promiseStats.overdue}
              </div>
            </div>
          ) : null}
        </CardShell>
      </div>
      <CardShell title="Ruled out">
        <ul style={{ margin: 0, paddingLeft: 18, color: T.textSec, fontSize: 13, lineHeight: 1.6 }}>
          {pack.ruledOut.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
        <div style={{ marginTop: 12, fontSize: 12, color: T.textMut }}>
          Confidence: <strong style={{ color: T.green }}>{pack.confidence}</strong>
        </div>
      </CardShell>
      <div style={{ padding: 14, borderRadius: 12, border: `1px solid ${T.gold}50`, background: T.goldGlow }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: T.gold, marginBottom: 6 }}>
          <AiMarker /> Recommended draft action
        </div>
        <p style={{ margin: 0, fontSize: 13.5, color: T.textSec }}>{pack.recommendedAction}</p>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button type="button" onClick={onRoute} style={{ padding: "10px 16px", borderRadius: 8, border: "none", background: T.cyan, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
          Draft route to Market Head
        </button>
        {signalId === "SIG-001" && onRouteToCro ? (
          <button type="button" onClick={onRouteToCro} style={{ padding: "10px 16px", borderRadius: 8, border: `1px solid ${T.amber}`, background: T.amberGlow, color: T.amber, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
            ✦ SIG-004 surfaced — Route to CRO
          </button>
        ) : null}
      </div>
    </div>
  );
}

function CXNPSLensScreen({ onCellDrill }: { onCellDrill: (cellId: string) => void }) {
  const T = useDashboardTheme();
  const pack = NUAMA_EVIDENCE["SIG-005"];
  const nps = pack?.nps;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: T.text }}>NPS holds near 85 — but delayed reporting is dragging South</h1>
        <p style={{ margin: "8px 0 0", fontSize: 13, color: T.textMut }}>Same corpus as the command view — CX lens on the conversation insight store.</p>
      </div>
      <FilterBar />
      <CardShell title="Root-caused NPS decomposition" aiMarked>
        {nps ? (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: T.textMut }}>Segment NPS</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: T.red, fontFamily: "var(--mono)" }}>{nps.score}</div>
                <div style={{ fontSize: 12, color: T.textMut }}>vs baseline {nps.baseline}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: T.textMut }}>Theme clusters</div>
                {nps.themes.map((th) => (
                  <div key={th} style={{ fontSize: 13, color: T.textSec, marginTop: 4 }}>• {th}</div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 11, color: T.textMut }}>SCORES ATR</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: T.amber }}>Due in {nps.atrDueDays} days</div>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: 12.5, color: T.textSec, lineHeight: 1.5 }}>
              <AiMarker /> This NPS movement traces to a delayed-reporting + performance-concern theme cluster in South branches. Score from survey; root cause from conversation themes.
            </p>
          </>
        ) : null}
      </CardShell>
      <CardShell title="Complaint themes — rate vs baseline">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
          {NUAMA_HEATMAP.map((cell) => {
            const hot = cell.complaintRate > cell.baselineRate * 1.3;
            return (
              <button
                key={cell.id}
                type="button"
                onClick={() => onCellDrill(cell.id)}
                style={{ textAlign: "left", padding: 12, borderRadius: 10, border: `1px solid ${hot ? T.red : T.border}`, background: hot ? `${T.red}10` : T.bg, cursor: "pointer" }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{cell.branch}</div>
                <div style={{ fontSize: 11, color: T.textMut, marginTop: 2 }}>{cell.theme}</div>
                <div style={{ fontSize: 13, color: hot ? T.red : T.textSec, marginTop: 6, fontFamily: "var(--mono)" }}>
                  {cell.complaintRate}% vs {cell.baselineRate}% baseline
                </div>
                <div style={{ fontSize: 10, color: T.textMut, marginTop: 4 }}>Escalation {cell.escalationRate}% · SCORES ATR {cell.atrDueDays}d</div>
              </button>
            );
          })}
        </div>
      </CardShell>
    </div>
  );
}

function CellDrillPanel({ cellId, onBack }: { cellId: string; onBack: () => void }) {
  const T = useDashboardTheme();
  const cell = NUAMA_HEATMAP.find((c) => c.id === cellId);
  if (!cell) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <button type="button" onClick={onBack} style={{ background: "none", border: "none", color: T.textMut, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, width: "fit-content" }}>
        <ArrowLeft size={14} /> Back to CX lens
      </button>
      <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: T.text }}>{cell.branch} · {cell.theme}</h1>
      <CardShell>
        <p style={{ margin: 0, fontSize: 13, color: T.textSec, lineHeight: 1.5 }}>
          Complaint rate {cell.complaintRate}% exceeds the branch×theme baseline {cell.baselineRate}%, with escalation at {cell.escalationRate}% and SCORES ATR due in {cell.atrDueDays} days. Concentrated in South cohorts. Route to CX / ops process owner (draft).
        </p>
        <div style={{ marginTop: 12, fontSize: 12, color: T.textMut }}>Cell ID: {cell.id}</div>
      </CardShell>
    </div>
  );
}

function RiskConductLensScreen({
  onItemDrill,
  auditLog,
}: {
  onItemDrill: (itemId: string) => void;
  auditLog: AuditEvent[];
}) {
  const T = useDashboardTheme();
  const sig = signalById("SIG-004");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ padding: "12px 14px", borderRadius: 10, border: `1px solid ${T.amber}`, background: T.amberGlow, fontSize: 12.5, color: T.textSec, lineHeight: 1.5 }}>
        <AiMarker /> Surveillance prioritisation, not an automated compliance decision — the regulated entity remains responsible for AI output.
      </div>
      <div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: T.text }}>
          {NUAMA_SUITABILITY_ITEMS.length} advisory cohorts show a suitability-language gap — prioritised for review
        </h1>
        <p style={{ margin: "8px 0 0", fontSize: 13, color: T.textMut }}>
          About 8 advisory calls per 1,000 lack mandated risk/disclosure language. Detects whether the disclosure was said; does not assess holdings.
        </p>
      </div>
      <FilterBar />
      <CardShell title="Suitability worklist" aiMarked>
        {NUAMA_SUITABILITY_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onItemDrill(item.id)}
            style={{ width: "100%", textAlign: "left", padding: 14, marginBottom: 10, borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{item.title}</div>
              <div style={{ fontSize: 11, color: T.textMut, marginTop: 4 }}>{item.cohortId} · {item.missingRatePer1000}/1,000 advisory calls missing disclosure</div>
            </div>
            <ChevronRight size={18} color={T.textMut} />
          </button>
        ))}
      </CardShell>
      {sig ? <p style={{ margin: 0, fontSize: 12, color: T.textMut, fontStyle: "italic" }}>{sig.honestyLine}</p> : null}
      {auditLog.length > 0 ? (
        <CardShell title="Audit log">
          {auditLog.slice(-5).map((e) => (
            <div key={e.id} style={{ fontSize: 12, color: T.textSec, marginBottom: 6 }}>
              {e.status === "accepted" ? `Accepted by ${e.by} on ${e.at}` : `Draft: ${e.action} → ${e.target}`}
            </div>
          ))}
        </CardShell>
      ) : null}
    </div>
  );
}

function RiskItemDrill({
  itemId,
  onBack,
  onAccept,
  onReturn,
}: {
  itemId: string;
  onBack: () => void;
  onAccept: () => void;
  onReturn: (reason: string) => void;
}) {
  const T = useDashboardTheme();
  const item = NUAMA_SUITABILITY_ITEMS.find((i) => i.id === itemId);
  const [reason, setReason] = useState("");
  if (!item) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <button type="button" onClick={onBack} style={{ background: "none", border: "none", color: T.textMut, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, width: "fit-content" }}>
        <ArrowLeft size={14} /> Back to worklist
      </button>
      <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: T.text }}>{item.title}</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <CardShell title="Missing-language evidence">
          <p style={{ margin: 0, fontSize: 13, color: T.textSec, lineHeight: 1.5 }}>{item.missingLanguageEvidence}</p>
        </CardShell>
        <CardShell title="Disclosure context">
          <p style={{ margin: 0, fontSize: 13, color: T.textSec, lineHeight: 1.5 }}>{item.disclosureContext}</p>
        </CardShell>
      </div>
      <CardShell title="Ruled out">
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: T.textSec }}>
          {item.ruledOut.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </CardShell>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
        <button type="button" onClick={onAccept} style={{ padding: "10px 16px", borderRadius: 8, border: "none", background: T.green, color: "#fff", fontWeight: 700, cursor: "pointer" }}>
          Accept for review (maker)
        </button>
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Return with reason…"
          style={{ flex: 1, minWidth: 200, padding: "8px 10px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.surface, color: T.text, fontSize: 12 }}
        />
        <button type="button" onClick={() => reason.trim() && onReturn(reason)} style={{ padding: "10px 16px", borderRadius: 8, border: `1px solid ${T.amber}`, background: T.amberGlow, color: T.amber, fontWeight: 700, cursor: "pointer" }}>
          Return with reason
        </button>
      </div>
    </div>
  );
}

function FloatingAIDayGenerator({ hidden }: { hidden?: boolean }) {
  const T = useDashboardTheme();
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [busy, setBusy] = useState(false);
  if (hidden) return null;
  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setPrompt("");
    setBusy(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "ai", text: `✦ ${generateNuvamaAIResponse(text)}` }]);
      setBusy(false);
    }, 800);
  };
  return (
    <>
      {!open && (
        <button type="button" onClick={() => setOpen(true)} style={{ position: "fixed", bottom: 22, right: 22, width: 56, height: 56, borderRadius: 28, border: "none", background: `linear-gradient(135deg, ${T.gold} 0%, ${T.cyan} 100%)`, color: "#fff", boxShadow: `0 12px 30px ${T.cyan}44`, cursor: "pointer", display: "grid", placeItems: "center", zIndex: 50 }}>
          <Sparkles size={22} />
        </button>
      )}
      {open && (
        <div style={{ position: "fixed", bottom: 22, right: 22, width: 400, maxHeight: "70vh", background: T.elevated, border: `1px solid ${T.border}`, borderRadius: 14, boxShadow: "0 20px 50px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column", zIndex: 50 }}>
          <div style={{ padding: 12, borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: T.text }}>✦ AI Analyst</div>
              <div style={{ fontSize: 10, color: T.textMut }}>Fluid CX · conversation insight store</div>
            </div>
            <button type="button" onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: T.textMut }}>
              <X size={16} />
            </button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
            {messages.length === 0 &&
              NUAMA_AI_PROMPTS.map((p) => (
                <button key={p} type="button" onClick={() => send(p)} style={{ display: "block", width: "100%", textAlign: "left", marginBottom: 6, padding: "8px 10px", fontSize: 11, borderRadius: 8, border: `1px solid ${T.border}`, background: T.surface, color: T.textSec, cursor: "pointer" }}>
                  ✦ {p}
                </button>
              ))}
            {messages.map((m, i) => (
              <div key={i} style={{ marginBottom: 8, padding: 10, borderRadius: 8, background: m.role === "user" ? T.cyanGlow : T.goldGlow, fontSize: 12, lineHeight: 1.5, color: T.text }}>
                {m.text}
              </div>
            ))}
            {busy && (
              <div style={{ fontSize: 11, color: T.textMut, display: "flex", gap: 6, alignItems: "center" }}>
                <RefreshCw size={12} /> Distilling corpus…
              </div>
            )}
          </div>
          <div style={{ padding: 10, borderTop: `1px solid ${T.border}`, display: "flex", gap: 6 }}>
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(prompt)}
              placeholder="Ask about attrition language, promises, suitability…"
              style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.surface, fontSize: 12, color: T.text }}
            />
            <button type="button" onClick={() => send(prompt)} style={{ padding: "8px 12px", borderRadius: 8, border: "none", background: T.cyan, color: "#fff", cursor: "pointer" }}>
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Main shell ─────────────────────────────────────────────────────────────
export function NuvamaWealthDashboard({ industryName, roleName, industryColor, onExit }: NuvamaWealthDashboardProps) {
  const [colorMode, setColorMode] = useState<"light" | "dark">("light");
  const theme = colorMode === "light" ? NUAMA_LIGHT : NUAMA_DARK;

  const [lens, setLens] = useState<NuvamaLens>("wealth");
  const [drill, setDrill] = useState<DrillState>({ type: "none" });
  const [comparisonWindow, setComparisonWindow] = useState<ComparisonWindow>("WoW");
  const [auditLog, setAuditLog] = useState<AuditEvent[]>([]);
  const [liveTick, setLiveTick] = useState(0);
  const [sidebarHover, setSidebarHover] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const sidebarW = sidebarHover ? 268 : 76;

  const resetTransient = useCallback(() => {
    setDrill({ type: "none" });
    setLiveTick(0);
  }, []);

  const switchLens = useCallback(
    (next: NuvamaLens) => {
      if (next !== lens) {
        resetTransient();
        setLens(next);
      }
    },
    [lens, resetTransient],
  );

  useEffect(() => {
    if (lens !== "wealth" || drill.type !== "none") {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    timerRef.current = setInterval(() => setLiveTick((t) => t + 1), 4000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [lens, drill.type]);

  const appendDraft = (action: string, target: string) => {
    const id = `audit-${Date.now()}`;
    setAuditLog((log) => [...log, { id, action, target, status: "draft" }]);
    setTimeout(() => {
      setAuditLog((log) =>
        log.map((e) => (e.id === id ? { ...e, status: "accepted", by: "Rahul Jain", at: new Date().toLocaleDateString("en-IN") } : e)),
      );
    }, 1200);
  };

  const content = useMemo(() => {
    if (drill.type === "cohort") {
      return (
        <EvidenceDrillPanel
          signalId={drill.signalId}
          onBack={resetTransient}
          onRoute={() => appendDraft("Route cohort to Market Head", drill.cohortId)}
          onRouteToCro={
            drill.signalId === "SIG-001"
              ? () => {
                  appendDraft("Route suitability cluster to CRO", "SIG-004");
                  resetTransient();
                  switchLens("risk");
                }
              : undefined
          }
        />
      );
    }
    if (drill.type === "cell") return <CellDrillPanel cellId={drill.cellId} onBack={resetTransient} />;
    if (drill.type === "risk-item")
      return (
        <RiskItemDrill
          itemId={drill.itemId}
          onBack={resetTransient}
          onAccept={() => {
            appendDraft("Accept suitability item for review", drill.itemId);
            resetTransient();
          }}
          onReturn={(reason) => {
            appendDraft(`Return with reason: ${reason}`, drill.itemId);
            resetTransient();
          }}
        />
      );

    if (lens === "cx") return <CXNPSLensScreen onCellDrill={(cellId) => setDrill({ type: "cell", cellId })} />;
    if (lens === "risk") return <RiskConductLensScreen onItemDrill={(itemId) => setDrill({ type: "risk-item", itemId })} auditLog={auditLog} />;

    // Command view — service-promise + complaints (Head of Retail Banking layout), conversation-only.
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: theme.text, lineHeight: 1.2 }}>
              47 clients in South Core-HNI are using exit language this week — up from 6
            </h1>
            <p style={{ margin: "8px 0 0", fontSize: 14, color: theme.textSec, maxWidth: 560 }}>
              Their review calls shifted to liquidity and capital-protection weeks before anything would show in the book. Peer West/North cohorts are stable, so this is cohort-specific.
            </p>
          </div>
          <button
            type="button"
            onClick={() => appendDraft("Route to Market Head", "CH-07")}
            style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: NUAMA_ACCENT, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}
          >
            Draft route to Market Head
          </button>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {(["WoW", "MoM"] as const).map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setComparisonWindow(w)}
              style={{ fontSize: 11, padding: "5px 12px", borderRadius: 6, border: `1px solid ${comparisonWindow === w ? theme.cyan : theme.border}`, background: comparisonWindow === w ? theme.cyanGlow : theme.surface, color: comparisonWindow === w ? theme.cyan : theme.textMut, cursor: "pointer", fontWeight: 600 }}
            >
              {w === "WoW" ? "This week vs last" : "This month vs last"}
            </button>
          ))}
        </div>
        <ExecutiveBriefStrip />
        <ExecutivePulseStrip />
        <ExecutiveTiles window={comparisonWindow} />
        <FilterBar />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <ServicePromisePanel />
          <ComplaintsPanel onOpenCx={() => switchLens("cx")} />
        </div>
        <AttritionRiskMonitor
          signals={NUAMA_SIGNALS}
          liveTick={liveTick}
          onDrill={(signalId, cohortId) => setDrill({ type: "cohort", cohortId, signalId })}
          onRoute={(s) => appendDraft(s.recommendedAction, s.cohortId ?? s.id)}
        />
      </div>
    );
  }, [auditLog, comparisonWindow, drill, lens, liveTick, resetTransient, switchLens, theme]);

  const navItems: { id: NuvamaLens; label: string; icon: typeof Target }[] = [
    { id: "wealth", label: "Command · Voice of clients", icon: Target },
    { id: "cx", label: "CX · NPS & complaints", icon: Headphones },
    { id: "risk", label: "Risk · Suitability language", icon: Shield },
  ];

  return (
    <DashboardThemeProvider value={theme}>
      <div style={{ display: "flex", height: "100vh", background: theme.bg, color: theme.text, overflow: "hidden" }}>
        <aside
          onMouseEnter={() => setSidebarHover(true)}
          onMouseLeave={() => setSidebarHover(false)}
          style={{ width: sidebarW, minWidth: sidebarW, transition: "width 0.22s ease", borderRight: `1px solid ${theme.border}`, background: theme.elevated, display: "flex", flexDirection: "column" }}
        >
          <div style={{ padding: sidebarHover ? "16px 14px" : "12px 8px", borderBottom: `1px solid ${theme.border}` }}>
            {sidebarHover ? (
              <>
                <div style={{ fontSize: 11, fontWeight: 800, color: theme.cyan, letterSpacing: 2, textTransform: "uppercase" }}>LiSN</div>
                <div style={{ fontSize: 12, color: theme.textMut }}>Fluid CX</div>
              </>
            ) : (
              <div style={{ textAlign: "center", fontWeight: 800, color: theme.cyan, fontSize: 14 }}>L</div>
            )}
          </div>
          <div style={{ padding: sidebarHover ? "10px 12px" : "8px 6px", borderBottom: `1px solid ${theme.border}` }}>
            {sidebarHover ? (
              <>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{industryName}</div>
                <div style={{ fontSize: 11, color: theme.cyan, marginTop: 2 }}>{roleName}</div>
              </>
            ) : null}
          </div>
          <div style={{ flex: 1, padding: "8px 6px" }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = lens === item.id && drill.type === "none";
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => switchLens(item.id)}
                  style={{ width: "100%", marginBottom: 6, padding: sidebarHover ? "8px 10px" : "10px 8px", border: "none", borderRadius: 8, background: active ? theme.cyanGlow : "transparent", color: active ? theme.text : theme.textSec, cursor: "pointer", display: "flex", alignItems: "center", gap: sidebarHover ? 8 : 0, justifyContent: sidebarHover ? "flex-start" : "center", borderLeft: active ? `3px solid ${theme.cyan}` : "3px solid transparent", fontSize: 12, fontWeight: active ? 700 : 500, textAlign: "left" }}
                >
                  <Icon size={14} color={active ? theme.cyan : theme.textMut} />
                  {sidebarHover ? item.label : null}
                </button>
              );
            })}
          </div>
          <div style={{ padding: 8, borderTop: `1px solid ${theme.border}` }}>
            <button type="button" onClick={() => setColorMode((m) => (m === "light" ? "dark" : "light"))} style={{ width: "100%", padding: "8px", borderRadius: 8, border: `1px solid ${theme.border}`, background: theme.surface, color: theme.textSec, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 11 }}>
              {colorMode === "light" ? <Moon size={12} /> : <Sun size={12} />}
              {sidebarHover ? (colorMode === "light" ? "Dark" : "Light") : null}
            </button>
            <button type="button" onClick={onExit} style={{ width: "100%", marginTop: 6, padding: "8px", borderRadius: 8, border: `1px solid ${theme.border}`, background: theme.surface, color: theme.textSec, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 11 }}>
              <ArrowLeft size={12} />
              {sidebarHover ? "Change role" : null}
            </button>
          </div>
        </aside>
        <main style={{ flex: 1, overflow: "auto", padding: 20, position: "relative" }}>{content}</main>
        <FloatingAIDayGenerator hidden={drill.type !== "none" && lens === "wealth"} />
      </div>
    </DashboardThemeProvider>
  );
}

export default NuvamaWealthDashboard;
