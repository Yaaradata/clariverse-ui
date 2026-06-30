"use client";

/**
 * LiSN / Fluid CX · Nuvama — CONVERSATION-ONLY dashboard, aligned to the repo references.
 * Drop-in replacement for the NuvamaWealthDashboard component file.
 * Use THIS instead of NuvamaWealthDashboard_ConvOnly.tsx.
 *
 * Matches the visual grammar of CreditCardsV3DrillDownScreens + head_retail:
 *   • DARK near-black palette (surface #0d0d0d, border #1f1f1f, white text, mono numbers)
 *   • overview → drill structure (question cards open full drills with "← Back to Overview")
 *   • SectionCard chrome with a 3px accent edge and an "✨ AI" pill
 * Data is CONVERSATION-ONLY (no book/₹). Self-contained palette so it compiles without the
 * shared theme context; Cursor can later swap in useDashboardTheme + the reused panels
 * (RetailFCIKPICards, FailureClusters, etc.) to deepen parity.
 */

import {
  Activity,
  ArrowLeft,
  ChevronRight,
  Headphones,
  RefreshCw,
  Send,
  Shield,
  Sparkles,
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
  type AuditEvent,
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

// ── Palette (dark, matched to CreditCardsV3 / head_retail) ───────────────────
const C = {
  bg: "#0a0a0a",
  surface: "#0d0d0d",
  surfaceAlt: "#151515",
  inset: "#1a1a1a",
  border: "#1f1f1f",
  borderBtn: "#393939",
  text: "#ffffff",
  body: "#e8e9e9",
  muted: "#939394",
  accent: "#4f9cf9",
  gold: "#e0b341",
  red: "#ef4444",
  amber: "#f59e0b",
  yellow: "#eab308",
  green: "#22c55e",
} as const;

const MONO = "var(--mono), ui-monospace, monospace";

export type NuvamaWealthDashboardProps = {
  industryName: string;
  roleName: string;
  industryColor: string;
  onExit: () => void;
};

type Screen = "overview" | "attrition" | "promise" | "suitability";
type Sub =
  | { type: "none" }
  | { type: "evidence"; signalId: string; cohortId?: string }
  | { type: "cell"; cellId: string }
  | { type: "item"; itemId: string };

function sevColor(s: string): string {
  if (s === "high" || s === "critical") return C.red;
  if (s === "med" || s === "medium") return C.amber;
  return C.accent;
}

// ── Primitives ───────────────────────────────────────────────────────────────
function AiPill() {
  return (
    <span style={{ background: `${C.gold}20`, color: C.gold, fontSize: 9, fontWeight: 800, letterSpacing: 0.5, padding: "2px 7px", borderRadius: 4 }}>
      ✨ AI
    </span>
  );
}

function DrillPageHeader({ onBack, title, sub }: { onBack: () => void; title: string; sub: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 4 }}>
      <button
        type="button"
        onClick={onBack}
        style={{ display: "flex", alignItems: "center", gap: 8, background: C.surface, border: `1px solid ${C.borderBtn}`, borderRadius: 10, padding: "10px 18px", cursor: "pointer", color: C.body, fontSize: 15, fontWeight: 600, width: "fit-content", flexShrink: 0 }}
      >
        <ArrowLeft size={18} /> Back to Overview
      </button>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.text, letterSpacing: -0.3, lineHeight: 1.2 }}>{title}</div>
        <div style={{ fontSize: 15, color: C.body, marginTop: 3, maxWidth: 900, lineHeight: 1.5 }}>{sub}</div>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  accent,
  aiPill,
  children,
  style,
}: {
  title?: string;
  subtitle?: string;
  accent?: string;
  aiPill?: boolean;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <section style={{ background: C.surface, border: `1px solid ${C.border}`, borderTop: accent ? `3px solid ${accent}` : undefined, borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", ...style }}>
      {title ? (
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text, lineHeight: 1.3 }}>{title}</div>
            {aiPill ? <AiPill /> : null}
          </div>
          {subtitle ? <div style={{ fontSize: 11, color: C.muted, marginTop: 2, lineHeight: 1.45 }}>{subtitle}</div> : null}
        </div>
      ) : null}
      <div style={{ flex: 1 }}>{children}</div>
    </section>
  );
}

function AIInsightStrip({ text, tone = "gold" }: { text: string; tone?: "gold" | "accent" | "red" }) {
  const c = tone === "accent" ? C.accent : tone === "red" ? C.red : C.gold;
  return (
    <div style={{ background: `${c}10`, border: `1px solid ${c}40`, borderLeft: `3px solid ${c}`, borderRadius: 8, padding: "8px 11px", display: "flex", alignItems: "flex-start", gap: 6, fontSize: 11.5, color: C.body, lineHeight: 1.5, marginTop: 8 }}>
      <Sparkles size={12} color={c} style={{ marginTop: 2, flexShrink: 0 }} />
      <span>{text}</span>
    </div>
  );
}

function StatCard({ label, value, delta, tag, icon: Icon, tone }: { label: string; value: string; delta: string; tag: string; icon: typeof Target; tone: string }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderTop: `3px solid ${tone}`, borderRadius: 12, padding: "16px 18px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: `${tone}1e`, display: "grid", placeItems: "center" }}>
          <Icon size={15} color={tone} />
        </div>
        <div>
          <div style={{ fontSize: 10.5, color: C.muted, textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</div>
          <div style={{ fontSize: 9.5, color: C.gold, fontWeight: 700 }}>{tag === "north-star" ? "North-star" : "Diagnostic"}</div>
        </div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: C.text, fontFamily: MONO }}>{value}</div>
      <div style={{ fontSize: 12, color: C.muted, marginTop: 4, fontWeight: 600 }}>{delta}</div>
    </div>
  );
}

function InsightCard({ signal, onDrill, onRoute, tick }: { signal: NuvamaSignal; onDrill: () => void; onRoute: () => void; tick: number }) {
  const tone = sevColor(signal.severity);
  const cohort = signal.cohortId ? cohortById(signal.cohortId) : undefined;
  const hasEvidence = Boolean(NUAMA_EVIDENCE[signal.id]);
  return (
    <div style={{ minWidth: 290, maxWidth: 330, flex: "1 1 290px", borderRadius: 12, border: `1px solid ${tone}55`, background: `${tone}0c`, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.text, lineHeight: 1.3 }}>{signal.title}</div>
        <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", padding: "3px 8px", borderRadius: 999, background: `${tone}22`, color: tone, flexShrink: 0 }}>{signal.severity}</span>
      </div>
      {cohort ? <div style={{ fontSize: 11, color: C.muted }}>Cohort: <span style={{ color: C.body }}>{cohort.id} · {cohort.label}</span></div> : null}
      <div style={{ fontSize: 10, color: C.muted, fontStyle: "italic", lineHeight: 1.4 }}>{signal.honestyLine}</div>
      <div style={{ fontSize: 10, color: C.muted }}>Onset: {signal.timeOnset}</div>
      <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: 10, display: "flex", flexDirection: "column", gap: 6 }}>
        {signal.stats.map((s) => (
          <div key={s.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
            <span style={{ color: C.muted }}>{s.label}</span>
            <span style={{ color: C.text, fontWeight: 700, fontFamily: MONO }}>{s.actual}</span>
          </div>
        ))}
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 6, display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: C.muted, fontSize: 11 }}>{signal.impactLabel}</span>
          <span style={{ color: tone, fontWeight: 800, fontFamily: MONO }}>{signal.impactValue}</span>
        </div>
      </div>
      <div style={{ fontSize: 11.5, lineHeight: 1.5, color: C.body, background: C.surfaceAlt, borderRadius: 8, padding: 10, border: `1px solid ${C.gold}40` }} title={signal.explainability}>
        <span style={{ color: C.gold, fontWeight: 700 }}>✨</span> {signal.recommendedAction}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
        <button type="button" onClick={onDrill} disabled={!hasEvidence} style={{ flex: 1, fontSize: 11, padding: "8px 10px", borderRadius: 8, border: `1px solid ${C.borderBtn}`, background: C.surface, color: hasEvidence ? C.text : C.muted, cursor: hasEvidence ? "pointer" : "default", fontWeight: 600 }}>
          View evidence
        </button>
        <button type="button" onClick={onRoute} style={{ flex: 1, fontSize: 11, padding: "8px 10px", borderRadius: 8, border: "none", background: C.accent, color: "#04101f", cursor: "pointer", fontWeight: 700 }}>
          Draft route
        </button>
      </div>
      <div style={{ fontSize: 9, color: C.muted, opacity: 0.5 + (tick % 3) * 0.1 }}>Live monitor · refresh {tick}s</div>
    </div>
  );
}

function QuestionCard({ q, sub, insight, icon: Icon, accent, onOpen }: { q: string; sub: string; insight: string; icon: typeof Target; accent: string; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} style={{ textAlign: "left", background: C.surface, border: `1px solid ${C.border}`, borderTop: `3px solid ${accent}`, borderRadius: 12, padding: 16, cursor: "pointer", display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: `${accent}1e`, display: "grid", placeItems: "center" }}>
          <Icon size={17} color={accent} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.text, lineHeight: 1.2 }}>{q}</div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{sub}</div>
        </div>
        <ChevronRight size={18} color={C.muted} />
      </div>
      <div style={{ fontSize: 11.5, color: C.body, background: `${C.gold}10`, border: `1px solid ${C.gold}33`, borderLeft: `3px solid ${C.gold}`, borderRadius: 8, padding: "8px 10px", lineHeight: 1.5 }}>
        <span style={{ color: C.gold, fontWeight: 700 }}>✨</span> {insight}
      </div>
    </button>
  );
}

// ── Overview ──────────────────────────────────────────────────────────────────
function Overview({ tick, onOpen, onDrillSignal, onRoute }: { tick: number; onOpen: (s: Screen) => void; onDrillSignal: (signalId: string, cohortId?: string) => void; onRoute: (s: NuvamaSignal) => void }) {
  const rail = NUAMA_SIGNALS.filter((s) => s.card === "ATTRITION");
  const toneMap: Record<string, string> = { critical: C.red, focus: C.amber, stable: C.green };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <div style={{ fontSize: 26, fontWeight: 800, color: C.text, lineHeight: 1.2 }}>Voice of clients — this week vs last</div>
        <div style={{ fontSize: 14, color: C.body, marginTop: 4, maxWidth: 720 }}>
          One governed layer over 100% of client conversations. Conversation data only — no book figures.
        </div>
      </div>

      {/* Executive brief */}
      <div style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.gold}`, borderRadius: 10, padding: "12px 14px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>✨ Executive Brief</div>
        <p style={{ margin: 0, fontSize: 13.5, color: C.body, lineHeight: 1.5 }}>{NUAMA_EXECUTIVE_BRIEF}</p>
      </div>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12 }}>
        <StatCard label="Wealth NPS" value={NUAMA_KPI_STRIP.nps.value} delta={NUAMA_KPI_STRIP.nps.delta} tag={NUAMA_KPI_STRIP.nps.tag} icon={Target} tone={C.accent} />
        <StatCard label="Complaint-escalation rate" value={NUAMA_KPI_STRIP.complaintEscalation.value} delta={NUAMA_KPI_STRIP.complaintEscalation.delta} tag={NUAMA_KPI_STRIP.complaintEscalation.tag} icon={TrendingDown} tone={C.red} />
        <StatCard label="Service-promise adherence" value={NUAMA_KPI_STRIP.promiseAdherence.value} delta={NUAMA_KPI_STRIP.promiseAdherence.delta} tag={NUAMA_KPI_STRIP.promiseAdherence.tag} icon={Shield} tone={C.amber} />
      </div>

      {/* Executive pulse */}
      <SectionCard title="Executive Pulse · this week vs last" aiPill accent={C.gold}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 10 }}>
          {NUAMA_EXECUTIVE_PULSE.map((p) => (
            <div key={p.label} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px", borderLeft: `3px solid ${toneMap[p.tone]}` }}>
              <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 4 }}>{p.label}</div>
              <div style={{ fontSize: 12.5, color: C.body, lineHeight: 1.45 }}>{p.main}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Act-on-these attrition rail */}
      <section>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <Activity size={16} color={C.gold} />
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: C.text }}>Attrition-risk language monitor</h2>
          <AiPill />
          <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 999, background: `${C.red}18`, color: C.red, fontWeight: 700 }}>ACT ON THESE</span>
        </div>
        <p style={{ margin: "0 0 12px", fontSize: 12, color: C.muted }}>Cohorts whose call and chat language is shifting to exit and liquidity — cohort-level, from conversation alone.</p>
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
          {rail.map((s) => (
            <InsightCard key={s.id} signal={s} tick={tick} onDrill={() => onDrillSignal(s.id, s.cohortId)} onRoute={() => onRoute(s)} />
          ))}
        </div>
      </section>

      {/* Three question cards → drills */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12 }}>
        <QuestionCard q="Are our clients about to leave?" sub="Attrition-risk language" icon={Target} accent={C.red} insight="47 South Core-HNI clients are using exit/liquidity language, up from 6 — six weeks before the book would show it." onOpen={() => onOpen("attrition")} />
        <QuestionCard q="Are we keeping our service promise?" sub="Promises + complaints" icon={Shield} accent={C.amber} insight="Bengaluru has 12 promises overdue and 9 broken; delayed-reporting complaints are above baseline." onOpen={() => onOpen("promise")} />
        <QuestionCard q="Are we saying the right things?" sub="Suitability-language gap" icon={Headphones} accent={C.accent} insight="~8 advisory calls per 1,000 lack mandated disclosure language — prioritised for CRO review." onOpen={() => onOpen("suitability")} />
      </div>
    </div>
  );
}

// ── Drill 1: Attrition ─────────────────────────────────────────────────────────
function AttritionDrill({ onBack, sub, onEvidence, onBackToDrill, onRoute, onRouteCro }: { onBack: () => void; sub: Sub; onEvidence: (signalId: string, cohortId?: string) => void; onBackToDrill: () => void; onRoute: (target: string) => void; onRouteCro: () => void }) {
  if (sub.type === "evidence") {
    const signal = signalById(sub.signalId);
    const pack = NUAMA_EVIDENCE[sub.signalId];
    if (!signal || !pack) return null;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <button type="button" onClick={onBackToDrill} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 13, width: "fit-content" }}>
          <ArrowLeft size={14} /> Back to attrition
        </button>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.text }}>This is what the client said — weeks before anything shows in the book</div>
          <div style={{ fontSize: 14, color: C.body, marginTop: 6, lineHeight: 1.5 }}>The early signal from conversation alone — act while attrition is still reversible. No book data is used.</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <SectionCard title="Interaction evidence (cohort-level)">
            {pack.interactionSnippets.map((sn) => (
              <div key={sn.theme} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 10, color: C.accent, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>{sn.theme}</div>
                <p style={{ margin: 0, fontSize: 13, color: C.body, lineHeight: 1.5 }}>{sn.excerpt}</p>
              </div>
            ))}
          </SectionCard>
          <SectionCard title="Engagement & escalation (conversation)">
            {pack.engagementDelta.map((b) => (
              <div key={b.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 13 }}>
                <span style={{ color: C.muted }}>{b.label}</span>
                <span style={{ color: C.text, fontWeight: 700, fontFamily: MONO }}>{b.value}</span>
              </div>
            ))}
          </SectionCard>
        </div>
        <SectionCard title="Ruled out">
          <ul style={{ margin: 0, paddingLeft: 18, color: C.body, fontSize: 13, lineHeight: 1.6 }}>
            {pack.ruledOut.map((r) => <li key={r}>{r}</li>)}
          </ul>
          <div style={{ marginTop: 12, fontSize: 12, color: C.muted }}>Confidence: <strong style={{ color: C.green }}>{pack.confidence}</strong></div>
        </SectionCard>
        <AIInsightStrip text={`Recommended draft action — ${pack.recommendedAction}`} />
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="button" onClick={() => onRoute(sub.cohortId ?? sub.signalId)} style={{ padding: "10px 16px", borderRadius: 8, border: "none", background: C.accent, color: "#04101f", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
            Draft route to Market Head
          </button>
          {sub.signalId === "SIG-001" ? (
            <button type="button" onClick={onRouteCro} style={{ padding: "10px 16px", borderRadius: 8, border: `1px solid ${C.amber}`, background: `${C.amber}1a`, color: C.amber, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
              ✨ Suitability gap surfaced — Route to CRO
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  const rail = NUAMA_SIGNALS.filter((s) => s.card === "ATTRITION");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <DrillPageHeader onBack={onBack} title="Are our clients about to leave?" sub="Cohorts whose conversation tone is shifting to exit and liquidity — the early signal the book cannot show yet. Cohort-level, conversation only." />
      <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4 }}>
        {rail.map((s) => (
          <InsightCard key={s.id} signal={s} tick={0} onDrill={() => onEvidence(s.id, s.cohortId)} onRoute={() => onRoute(s.cohortId ?? s.id)} />
        ))}
      </div>
      <SectionCard title="How to read this" aiPill accent={C.red}>
        <p style={{ margin: 0, fontSize: 13, color: C.body, lineHeight: 1.55 }}>
          A cohort is flagged when exit/liquidity/anxiety language rises above its own baseline and engagement falls, with market-wide and seasonal moves ruled out against peer cohorts. Open a card's evidence to see the actual phrases, the engagement trend, and the draft action.
        </p>
      </SectionCard>
    </div>
  );
}

// ── Drill 2: Service promise + complaints ────────────────────────────────────
function PromiseDrill({ onBack, sub, onCell, onBackToDrill, onRoute }: { onBack: () => void; sub: Sub; onCell: (cellId: string) => void; onBackToDrill: () => void; onRoute: (target: string) => void }) {
  const gradId = useId().replace(/:/g, "");
  if (sub.type === "cell") {
    const cell = NUAMA_HEATMAP.find((c) => c.id === sub.cellId);
    if (!cell) return null;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <button type="button" onClick={onBackToDrill} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 13, width: "fit-content" }}>
          <ArrowLeft size={14} /> Back to service promise
        </button>
        <div style={{ fontSize: 20, fontWeight: 800, color: C.text }}>{cell.branch} · {cell.theme}</div>
        <SectionCard>
          <p style={{ margin: 0, fontSize: 13, color: C.body, lineHeight: 1.55 }}>
            Complaint rate <strong style={{ fontFamily: MONO }}>{cell.complaintRate}%</strong> exceeds the branch×theme baseline <strong style={{ fontFamily: MONO }}>{cell.baselineRate}%</strong>, with escalation at <strong style={{ fontFamily: MONO }}>{cell.escalationRate}%</strong> and SCORES ATR due in <strong style={{ fontFamily: MONO }}>{cell.atrDueDays} days</strong>. Concentrated in South cohorts. Route to CX / ops process owner (draft).
          </p>
          <div style={{ marginTop: 12, fontSize: 12, color: C.muted }}>Cell ID: {cell.id}</div>
        </SectionCard>
        <button type="button" onClick={() => onRoute(cell.id)} style={{ padding: "10px 16px", borderRadius: 8, border: "none", background: C.accent, color: "#04101f", fontWeight: 700, cursor: "pointer", fontSize: 13, width: "fit-content" }}>
          Draft route to CX / Ops
        </button>
      </div>
    );
  }

  const totals = NUAMA_SERVICE_PROMISES.reduce((a, r) => ({ made: a.made + r.made, kept: a.kept + r.kept, broken: a.broken + r.broken, overdue: a.overdue + r.overdue }), { made: 0, kept: 0, broken: 0, overdue: 0 });
  const adherence = Math.round((totals.kept / totals.made) * 100);
  const chart = NUAMA_SERVICE_PROMISES.map((r) => ({ branch: r.branch.replace(/^BR-\S+\s/, ""), broken: r.broken, overdue: r.overdue }));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <DrillPageHeader onBack={onBack} title="Are we keeping our service promise?" sub="Promises made on calls versus what later conversations show as kept, broken, or overdue — and where complaint themes are above baseline. Conversation only." />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <SectionCard title="Service-promise adherence" aiPill accent={C.amber}>
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginBottom: 12 }}>
            {[{ k: "Adherence", v: `${adherence}%`, c: C.text }, { k: "Made", v: totals.made, c: C.body }, { k: "Broken", v: totals.broken, c: C.red }, { k: "Overdue", v: totals.overdue, c: C.amber }].map((s) => (
              <div key={s.k}>
                <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 0.4 }}>{s.k}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: s.c, fontFamily: MONO }}>{s.v}</div>
              </div>
            ))}
          </div>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={`brk-${gradId}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.red} stopOpacity={0.9} /><stop offset="100%" stopColor={C.red} stopOpacity={0.4} /></linearGradient>
                  <linearGradient id={`ovd-${gradId}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.amber} stopOpacity={0.9} /><stop offset="100%" stopColor={C.amber} stopOpacity={0.4} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                <XAxis dataKey="branch" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                <RechartsTooltip contentStyle={{ background: C.surfaceAlt, border: `1px solid ${C.borderBtn}`, borderRadius: 8, fontSize: 11, color: C.body }} />
                <Bar dataKey="broken" name="Broken" fill={`url(#brk-${gradId})`} radius={[5, 5, 0, 0]} />
                <Bar dataKey="overdue" name="Overdue" fill={`url(#ovd-${gradId})`} radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <AIInsightStrip text="Bengaluru (BR-S1) carries the most broken and overdue promises — callbacks and statement dispatch committed on calls but not referenced as completed later." />
        </SectionCard>
        <SectionCard title="Complaint themes — rate vs baseline" aiPill accent={C.red}>
          {NUAMA_HEATMAP.map((cell) => {
            const hot = cell.complaintRate > cell.baselineRate * 1.3;
            return (
              <button key={cell.id} type="button" onClick={() => onCell(cell.id)} style={{ width: "100%", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", marginBottom: 8, borderRadius: 10, border: `1px solid ${hot ? C.red : C.border}`, background: hot ? `${C.red}10` : C.bg, cursor: "pointer" }}>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: C.text }}>{cell.theme}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{cell.branch} · escalation {cell.escalationRate}% · SCORES ATR {cell.atrDueDays}d</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: hot ? C.red : C.body, fontFamily: MONO }}>{cell.complaintRate}% <span style={{ fontSize: 10, color: C.muted }}>vs {cell.baselineRate}%</span></span>
                  <ChevronRight size={16} color={C.muted} />
                </div>
              </button>
            );
          })}
        </SectionCard>
      </div>
    </div>
  );
}

// ── Drill 3: Suitability-language worklist ────────────────────────────────────
function SuitabilityDrill({ onBack, sub, onItem, onBackToDrill, onAccept, onReturn, auditLog }: { onBack: () => void; sub: Sub; onItem: (itemId: string) => void; onBackToDrill: () => void; onAccept: (itemId: string) => void; onReturn: (itemId: string, reason: string) => void; auditLog: AuditEvent[] }) {
  const [reason, setReason] = useState("");
  if (sub.type === "item") {
    const item = NUAMA_SUITABILITY_ITEMS.find((i) => i.id === sub.itemId);
    if (!item) return null;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <button type="button" onClick={onBackToDrill} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 13, width: "fit-content" }}>
          <ArrowLeft size={14} /> Back to worklist
        </button>
        <div style={{ fontSize: 20, fontWeight: 800, color: C.text }}>{item.title}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <SectionCard title="Missing-language evidence"><p style={{ margin: 0, fontSize: 13, color: C.body, lineHeight: 1.55 }}>{item.missingLanguageEvidence}</p></SectionCard>
          <SectionCard title="Disclosure context"><p style={{ margin: 0, fontSize: 13, color: C.body, lineHeight: 1.55 }}>{item.disclosureContext}</p></SectionCard>
        </div>
        <SectionCard title="Ruled out">
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: C.body, lineHeight: 1.6 }}>{item.ruledOut.map((r) => <li key={r}>{r}</li>)}</ul>
        </SectionCard>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
          <button type="button" onClick={() => onAccept(item.id)} style={{ padding: "10px 16px", borderRadius: 8, border: "none", background: C.green, color: "#04140a", fontWeight: 700, cursor: "pointer" }}>Accept for review (maker)</button>
          <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Return with reason…" style={{ flex: 1, minWidth: 200, padding: "8px 10px", borderRadius: 8, border: `1px solid ${C.borderBtn}`, background: C.surface, color: C.text, fontSize: 12 }} />
          <button type="button" onClick={() => reason.trim() && onReturn(item.id, reason)} style={{ padding: "10px 16px", borderRadius: 8, border: `1px solid ${C.amber}`, background: `${C.amber}1a`, color: C.amber, fontWeight: 700, cursor: "pointer" }}>Return with reason</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <DrillPageHeader onBack={onBack} title="Are we saying the right things?" sub="Advisory conversations missing mandated risk/disclosure language — prioritised for human adjudication. Detects whether the disclosure was said; does not assess holdings. Conversation only." />
      <div style={{ background: `${C.amber}14`, border: `1px solid ${C.amber}`, borderRadius: 10, padding: "12px 14px", fontSize: 12.5, color: C.body, lineHeight: 1.5 }}>
        <span style={{ color: C.gold, fontWeight: 700 }}>✨</span> Surveillance prioritisation, not an automated compliance decision — the regulated entity remains responsible for AI output.
      </div>
      <SectionCard title="Suitability worklist" aiPill accent={C.accent}>
        {NUAMA_SUITABILITY_ITEMS.map((item) => (
          <button key={item.id} type="button" onClick={() => onItem(item.id)} style={{ width: "100%", textAlign: "left", padding: 14, marginBottom: 10, borderRadius: 10, border: `1px solid ${C.border}`, background: C.bg, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{item.title}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{item.cohortId} · {item.missingRatePer1000}/1,000 advisory calls missing disclosure</div>
            </div>
            <ChevronRight size={18} color={C.muted} />
          </button>
        ))}
      </SectionCard>
      {auditLog.length > 0 ? (
        <SectionCard title="Audit log">
          {auditLog.slice(-6).map((e) => (
            <div key={e.id} style={{ fontSize: 12, color: C.body, marginBottom: 6 }}>{e.status === "accepted" ? `Accepted by ${e.by} on ${e.at}` : `Draft: ${e.action} → ${e.target}`}</div>
          ))}
        </SectionCard>
      ) : null}
    </div>
  );
}

// ── Floating AI analyst ────────────────────────────────────────────────────────
function FloatingAI({ hidden }: { hidden?: boolean }) {
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
      setMessages((m) => [...m, { role: "ai", text: `✨ ${generateNuvamaAIResponse(text)}` }]);
      setBusy(false);
    }, 700);
  };
  return (
    <>
      {!open && (
        <button type="button" onClick={() => setOpen(true)} style={{ position: "fixed", bottom: 22, right: 22, width: 56, height: 56, borderRadius: 28, border: "none", background: `linear-gradient(135deg, ${C.gold} 0%, ${C.accent} 100%)`, color: "#fff", boxShadow: `0 12px 30px ${C.accent}44`, cursor: "pointer", display: "grid", placeItems: "center", zIndex: 50 }}>
          <Sparkles size={22} />
        </button>
      )}
      {open && (
        <div style={{ position: "fixed", bottom: 22, right: 22, width: 400, maxHeight: "70vh", background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 14, boxShadow: "0 20px 50px rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", zIndex: 50 }}>
          <div style={{ padding: 12, borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: C.text }}>✨ AI Analyst</div>
              <div style={{ fontSize: 10, color: C.muted }}>Fluid CX · conversation insight store</div>
            </div>
            <button type="button" onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted }}><X size={16} /></button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
            {messages.length === 0 && NUAMA_AI_PROMPTS.map((p) => (
              <button key={p} type="button" onClick={() => send(p)} style={{ display: "block", width: "100%", textAlign: "left", marginBottom: 6, padding: "8px 10px", fontSize: 11, borderRadius: 8, border: `1px solid ${C.border}`, background: C.surface, color: C.body, cursor: "pointer" }}>✨ {p}</button>
            ))}
            {messages.map((m, i) => (
              <div key={i} style={{ marginBottom: 8, padding: 10, borderRadius: 8, background: m.role === "user" ? `${C.accent}1a` : `${C.gold}1a`, fontSize: 12, lineHeight: 1.5, color: C.body }}>{m.text}</div>
            ))}
            {busy && <div style={{ fontSize: 11, color: C.muted, display: "flex", gap: 6, alignItems: "center" }}><RefreshCw size={12} /> Distilling corpus…</div>}
          </div>
          <div style={{ padding: 10, borderTop: `1px solid ${C.border}`, display: "flex", gap: 6 }}>
            <input value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send(prompt)} placeholder="Ask about attrition language, promises, suitability…" style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.surface, fontSize: 12, color: C.text }} />
            <button type="button" onClick={() => send(prompt)} style={{ padding: "8px 12px", borderRadius: 8, border: "none", background: C.accent, color: "#04101f", cursor: "pointer" }}><Send size={14} /></button>
          </div>
        </div>
      )}
    </>
  );
}

// ── Main shell ───────────────────────────────────────────────────────────────
export function NuvamaWealthDashboard({ industryName, roleName, onExit }: NuvamaWealthDashboardProps) {
  const [screen, setScreen] = useState<Screen>("overview");
  const [sub, setSub] = useState<Sub>({ type: "none" });
  const [auditLog, setAuditLog] = useState<AuditEvent[]>([]);
  const [tick, setTick] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goScreen = useCallback((s: Screen) => {
    setSub({ type: "none" });
    setTick(0);
    setScreen(s);
  }, []);

  useEffect(() => {
    if (screen !== "overview") {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      return;
    }
    timerRef.current = setInterval(() => setTick((t) => t + 1), 4000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [screen]);

  const appendDraft = (action: string, target: string) => {
    const id = `audit-${Date.now()}`;
    setAuditLog((log) => [...log, { id, action, target, status: "draft" }]);
    setTimeout(() => {
      setAuditLog((log) => log.map((e) => (e.id === id ? { ...e, status: "accepted", by: "Rahul Jain", at: new Date().toLocaleDateString("en-IN") } : e)));
    }, 1200);
  };

  const body = useMemo(() => {
    if (screen === "attrition")
      return (
        <AttritionDrill
          onBack={() => goScreen("overview")}
          sub={sub}
          onEvidence={(signalId, cohortId) => setSub({ type: "evidence", signalId, cohortId })}
          onBackToDrill={() => setSub({ type: "none" })}
          onRoute={(target) => appendDraft("Route cohort to Market Head", target)}
          onRouteCro={() => { appendDraft("Route suitability cluster to CRO", "SIG-004"); goScreen("suitability"); }}
        />
      );
    if (screen === "promise")
      return (
        <PromiseDrill
          onBack={() => goScreen("overview")}
          sub={sub}
          onCell={(cellId) => setSub({ type: "cell", cellId })}
          onBackToDrill={() => setSub({ type: "none" })}
          onRoute={(target) => appendDraft("Route to CX / Ops", target)}
        />
      );
    if (screen === "suitability")
      return (
        <SuitabilityDrill
          onBack={() => goScreen("overview")}
          sub={sub}
          onItem={(itemId) => setSub({ type: "item", itemId })}
          onBackToDrill={() => setSub({ type: "none" })}
          onAccept={(itemId) => { appendDraft("Accept suitability item for review", itemId); setSub({ type: "none" }); }}
          onReturn={(itemId, reason) => { appendDraft(`Return with reason: ${reason}`, itemId); setSub({ type: "none" }); }}
          auditLog={auditLog}
        />
      );
    return (
      <Overview
        tick={tick}
        onOpen={goScreen}
        onDrillSignal={(signalId, cohortId) => { setScreen("attrition"); setSub({ type: "evidence", signalId, cohortId }); }}
        onRoute={(s) => appendDraft(s.recommendedAction, s.cohortId ?? s.id)}
      />
    );
  }, [screen, sub, tick, auditLog, goScreen]);

  const nav: { id: Screen; label: string; icon: typeof Target }[] = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "attrition", label: "Attrition-risk language", icon: Target },
    { id: "promise", label: "Service promise & complaints", icon: Shield },
    { id: "suitability", label: "Suitability language", icon: Headphones },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", background: C.bg, color: C.text, overflow: "hidden", fontFamily: "inherit" }}>
      <aside style={{ width: 232, minWidth: 232, borderRight: `1px solid ${C.border}`, background: C.surface, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 14px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: C.accent, letterSpacing: 2, textTransform: "uppercase" }}>LiSN</div>
          <div style={{ fontSize: 12, color: C.muted }}>Fluid CX</div>
        </div>
        <div style={{ padding: "10px 12px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 12, fontWeight: 600 }}>{industryName}</div>
          <div style={{ fontSize: 11, color: C.accent, marginTop: 2 }}>{roleName}</div>
        </div>
        <div style={{ flex: 1, padding: "8px 8px" }}>
          {nav.map((item) => {
            const Icon = item.icon;
            const active = screen === item.id;
            return (
              <button key={item.id} type="button" onClick={() => goScreen(item.id)} style={{ width: "100%", marginBottom: 6, padding: "9px 11px", border: "none", borderRadius: 8, background: active ? `${C.accent}1a` : "transparent", color: active ? C.text : C.muted, cursor: "pointer", display: "flex", alignItems: "center", gap: 9, borderLeft: active ? `3px solid ${C.accent}` : "3px solid transparent", fontSize: 12.5, fontWeight: active ? 700 : 500, textAlign: "left" }}>
                <Icon size={15} color={active ? C.accent : C.muted} />
                {item.label}
              </button>
            );
          })}
        </div>
        <div style={{ padding: 10, borderTop: `1px solid ${C.border}` }}>
          <button type="button" onClick={onExit} style={{ width: "100%", padding: "8px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.surface, color: C.muted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 11 }}>
            <ArrowLeft size={12} /> Change role
          </button>
        </div>
      </aside>
      <main style={{ flex: 1, overflow: "auto", padding: 22, position: "relative" }}>{body}</main>
      <FloatingAI hidden={screen !== "overview"} />
    </div>
  );
}

export default NuvamaWealthDashboard;
