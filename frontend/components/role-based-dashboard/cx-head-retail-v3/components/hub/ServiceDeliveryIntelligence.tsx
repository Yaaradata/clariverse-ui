"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  ChevronRight,
  Clock,
  MapPin,
  MessageSquare,
  Package,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Truck,
  Activity,
} from "lucide-react";
import type { ServiceDeliveryDrill, ServiceDeliveryTop } from "../../lib/cxHeadRetailV3HubCards";
import {
  ANXIETY_BY_JOURNEY,
  ANXIETY_BY_SEGMENT,
  ANXIETY_CARVE_OUT,
  ANXIETY_DRIVERS,
  ANXIETY_EVIDENCE,
  ANXIETY_SIGNALS,
  CUSTOMER_ANXIETY_HERO,
  PROMISE_RELIABILITY_HERO,
  SERVICE_DELIVERY_HERO,
  PROMISE_SENTIMENT_MATRIX,
  RELIABILITY_FAILURES,
  SERVICE_DELIVERY_ACTIONS,
  SERVICE_DELIVERY_AI_INSIGHT,
  SERVICE_DELIVERY_RANGES,
  type AnxietyEvidence,
  type AnxietyMiniMatrixCell,
  type PromiseSentimentCell,
  type PromiseSentimentQuad,
  type ServiceDeliveryRangeKey,
} from "../../lib/cxHeadRetailV3ServiceDeliveryData";
import { useAnimatedNumber } from "../../lib/useAnimatedNumber";
import { cssVar, radius } from "../../theme/tokens";
import { DetailSection } from "./HubDetailPrimitives";
import { EcommerceCrossChannelEscalationSection } from "./EcommerceCrossChannelEscalationSection";
import { EcommerceFciHeatmapSection } from "./EcommerceFciHeatmapSection";
import {
  FcrIntelligenceVisual,
  ServicePromiseBoardVisual,
  SlaHeatmapVisual,
} from "./HubServiceDeliveryVisuals";

const nf = new Intl.NumberFormat("en-IN");
const fmt = (n: number): string => nf.format(Math.round(n));
const GAP = 12;
const PAD = "12px 14px";
const KPI_PAD = "14px 16px";

const BAR_MET = "#22c55e";
const BAR_AT_RISK = "#eab308";
const BAR_BREACHED = "#ef4444";
const ACCENT_DELIVERY = "#6366f1";

function Shell({
  children,
  style,
  accent,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  accent?: string;
}): React.ReactElement {
  return (
    <div
      style={{
        background: cssVar("surface"),
        border: `1px solid ${cssVar("border")}`,
        borderRadius: radius.lg,
        boxShadow: cssVar("shadow-card"),
        borderTop: accent ? `2px solid ${accent}` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionHead({ n, title }: { n: string; title: React.ReactNode }): React.ReactElement {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
      <span
        className="lisn-num"
        style={{
          width: 26,
          height: 26,
          display: "grid",
          placeItems: "center",
          fontSize: 11,
          fontWeight: 800,
          color: cssVar("accent-2"),
          borderRadius: 7,
          border: `1.5px solid ${cssVar("accent")}`,
          flexShrink: 0,
        }}
      >
        {n}
      </span>
      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: cssVar("text-primary"), letterSpacing: "-0.02em", lineHeight: 1.2 }}>
        {title}
      </h3>
    </div>
  );
}

function KpiCardShell({
  accent,
  icon: Icon,
  title,
  children,
  style,
}: {
  accent: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  title: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}): React.ReactElement {
  return (
    <Shell
      style={{
        padding: KPI_PAD,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minWidth: 0,
        ...style,
      }}
      accent={accent}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 7, minHeight: 20 }}>
        <Icon size={15} color={accent} strokeWidth={2.3} />
        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.4, textTransform: "uppercase", color: cssVar("text-muted"), lineHeight: 1.2 }}>
          {title}
        </span>
      </div>
      {children}
    </Shell>
  );
}

function KpiHeadline({ value, label, color }: { value: string; label: string; color: string }): React.ReactElement {
  return (
    <div>
      <div className="lisn-num" style={{ fontSize: 32, fontWeight: 900, color, lineHeight: 1, letterSpacing: "-0.03em" }}>
        {value}
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, color: cssVar("text-primary"), marginTop: 4, lineHeight: 1.25 }}>{label}</div>
    </div>
  );
}

function KpiChip({
  value,
  label,
  note,
  color,
}: {
  value: string;
  label: string;
  note?: string;
  color?: string;
}): React.ReactElement {
  return (
    <div style={{ padding: "7px 9px", borderRadius: radius.sm, background: cssVar("surface-raised"), border: `1px solid ${cssVar("border")}`, minWidth: 0 }}>
      <div className="lisn-num" style={{ fontSize: 17, fontWeight: 900, color: color ?? cssVar("text-primary"), lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 10, fontWeight: 700, color: cssVar("text-primary"), marginTop: 3, lineHeight: 1.2 }}>{label}</div>
      {note ? <div style={{ fontSize: 9, color: cssVar("text-muted"), marginTop: 2, lineHeight: 1.3 }}>{note}</div> : null}
    </div>
  );
}

function KpiFootnote({ label, value, color }: { label: string; value: string; color?: string }): React.ReactElement {
  return (
    <div style={{ padding: "7px 9px", borderRadius: radius.sm, background: cssVar("surface-raised"), border: `1px solid ${cssVar("border")}` }}>
      <div style={{ fontSize: 8, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.35, color: cssVar("text-muted"), marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 11, fontWeight: 700, color: color ?? cssVar("text-primary"), lineHeight: 1.3 }}>{value}</div>
    </div>
  );
}

function KpiAiLine({ text }: { text: string }): React.ReactElement {
  return (
    <div style={{ marginTop: "auto", padding: "8px 10px", borderRadius: radius.sm, background: cssVar("accent-soft"), border: `1px solid ${cssVar("accent")}22` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
        <Sparkles size={11} color={cssVar("accent-2")} strokeWidth={2.4} />
        <span style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", color: cssVar("accent-2") }}>AI insight</span>
      </div>
      <p style={{ margin: 0, fontSize: 10.5, lineHeight: 1.4, color: cssVar("text-secondary") }}>{text}</p>
    </div>
  );
}

function PromiseReliabilityHeroCard({ scale }: { scale: (n: number) => number }): React.ReactElement {
  const d = PROMISE_RELIABILITY_HERO;
  const metRate = useAnimatedNumber(d.promiseMetRate, { duration: 1000, delay: 60, decimals: 1 });
  const breached = useAnimatedNumber(scale(d.breachedCount), { duration: 900, delay: 120 });
  const atRisk = useAnimatedNumber(scale(d.atRiskCount), { duration: 900, delay: 180 });

  return (
    <KpiCardShell accent={BAR_MET} icon={ShieldCheck} title="Promise Reliability">
      <KpiHeadline value={`${metRate.toFixed(1)}%`} label="Promises met" color={BAR_MET} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <KpiChip value={fmt(breached)} label="Breached" note="SLA missed" color={BAR_BREACHED} />
        <KpiChip value={fmt(atRisk)} label="At risk" note="Next 24–48h" color={BAR_AT_RISK} />
      </div>

      <KpiFootnote label="Top breach driver" value={d.topBreachDriver} color={cssVar("severity-high")} />
      <KpiAiLine text={d.aiInsight} />
    </KpiCardShell>
  );
}

function AnxietyMiniMatrix({ cells }: { cells: AnxietyMiniMatrixCell[] }): React.ReactElement {
  const byKey = Object.fromEntries(cells.map((c) => [`${c.row}-${c.col}`, c]));
  const cellAt = (row: AnxietyMiniMatrixCell["row"], col: AnxietyMiniMatrixCell["col"]): AnxietyMiniMatrixCell =>
    byKey[`${row}-${col}`] as AnxietyMiniMatrixCell;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "52px 1fr 1fr", gap: 4, alignItems: "stretch" }}>
      <div />
      <div style={{ fontSize: 8, fontWeight: 800, textAlign: "center", color: cssVar("text-muted"), textTransform: "uppercase" }}>Calm</div>
      <div style={{ fontSize: 8, fontWeight: 800, textAlign: "center", color: cssVar("text-muted"), textTransform: "uppercase" }}>Anxious</div>
      {(["withinSla", "breached"] as const).map((row) => (
        <React.Fragment key={row}>
          <div style={{ fontSize: 8, fontWeight: 800, color: cssVar("text-muted"), textTransform: "uppercase", display: "flex", alignItems: "center", lineHeight: 1.15 }}>
            {row === "withinSla" ? "In SLA" : "Breach"}
          </div>
          {(["calm", "anxious"] as const).map((col) => {
            const cell = cellAt(row, col);
            return (
              <div
                key={`${row}-${col}`}
                style={{
                  padding: "6px 7px",
                  borderRadius: radius.sm,
                  border: `1px solid ${cssVar("border")}`,
                  background: cell.soft,
                  minHeight: 52,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ fontSize: 9, fontWeight: 800, color: cell.color, lineHeight: 1.15 }}>{cell.label}</div>
                <div className="lisn-num" style={{ fontSize: 13, fontWeight: 900, color: cssVar("text-primary"), lineHeight: 1 }}>
                  {cell.share}%
                </div>
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}

function CustomerAnxietyHeroCard({ scale }: { scale: (n: number) => number }): React.ReactElement {
  const d = CUSTOMER_ANXIETY_HERO;
  const anxious = useAnimatedNumber(scale(d.anxiousBeforeBreach), { duration: 1000, delay: 80 });

  return (
    <KpiCardShell accent="#ca8a04" icon={AlertTriangle} title="Customer Anxiety Pressure">
      <KpiHeadline value={fmt(anxious)} label="Anxious before breach" color="#ca8a04" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <KpiChip value={`${d.repeatContactPct}%`} label="Repeat contacts" note="Same issue, same order" color="#ca8a04" />
        <KpiChip value={`${d.avgContactsPerAnxious}×`} label="Avg contacts" note="Per anxious customer" color={cssVar("severity-med")} />
      </div>

      <KpiChip value={`+${d.anxietyWowPct}%`} label="Anxiety spike" note="WoW on pre-breach contacts" color={cssVar("severity-high")} />

      <KpiFootnote label="Top anxiety driver" value={d.topAnxietyDriver} color="#b45309" />

      <div>
        <div style={{ fontSize: 9, fontWeight: 800, color: cssVar("text-muted"), textTransform: "uppercase", marginBottom: 5 }}>Sentiment mix · % of cohort</div>
        <AnxietyMiniMatrix cells={d.miniMatrix} />
      </div>
    </KpiCardShell>
  );
}

function ServiceDeliveryHeroCard({ scale }: { scale: (n: number) => number }): React.ReactElement {
  const d = SERVICE_DELIVERY_HERO;
  const delivery = useAnimatedNumber(d.deliverySuccessRate, { duration: 950, delay: 60 });
  const fcr = useAnimatedNumber(d.fcrRate, { duration: 900, delay: 100 });
  const escalated = useAnimatedNumber(scale(d.escalatedCount), { duration: 900, delay: 140 });
  const pending = useAnimatedNumber(scale(d.pendingPromiseQueue), { duration: 900, delay: 140 });

  return (
    <KpiCardShell accent={ACCENT_DELIVERY} icon={Activity} title="Service Delivery Execution">
      <KpiHeadline value={`${delivery}%`} label="Delivery success rate" color={ACCENT_DELIVERY} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <KpiChip value={`${fcr}%`} label="FCR resolution" note={d.fcrNote} color={fcr >= 75 ? BAR_MET : cssVar("severity-med")} />
        <KpiChip value={`${d.firstAttemptDeliveryPct}%`} label="First-attempt delivery" note="No re-attempt needed" color={ACCENT_DELIVERY} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <KpiChip value={fmt(escalated)} label="Escalated open" note="Backend owner queue" color={cssVar("severity-high")} />
        <KpiChip value={fmt(pending)} label="Pending promises" note={d.pendingNote} color={cssVar("severity-med")} />
      </div>

      <KpiFootnote label="Bottleneck" value={d.topBottleneck} color={ACCENT_DELIVERY} />
      <KpiAiLine text={d.aiInsight} />
    </KpiCardShell>
  );
}

function PromiseMatrix({ cells, scale }: { cells: PromiseSentimentCell[]; scale: (n: number) => number }): React.ReactElement {
  const [hovered, setHovered] = useState<PromiseSentimentQuad | null>(null);
  const order: PromiseSentimentQuad[] = ["healthy", "anxiety", "opsBreach", "trustBreak"];
  const byQuad = Object.fromEntries(cells.map((c) => [c.quad, c])) as Record<PromiseSentimentQuad, PromiseSentimentCell>;
  const focus = hovered ? byQuad[hovered] : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 6, minHeight: 168 }}>
        {order.map((quad) => {
          const cell = byQuad[quad];
          const active = hovered === quad;
          const met = quad === "healthy" || quad === "anxiety";
          const calm = quad === "healthy" || quad === "opsBreach";

          return (
            <button
              key={quad}
              type="button"
              onMouseEnter={() => setHovered(quad)}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding: "8px 10px",
                borderRadius: radius.sm,
                border: `1px solid ${active ? cell.color : cssVar("border")}`,
                background: active ? cell.soft : cssVar("surface-raised"),
                textAlign: "left",
                cursor: "default",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 0,
              }}
            >
              <div style={{ fontSize: 9, fontWeight: 700, color: cssVar("text-muted"), lineHeight: 1.2 }}>
                {met ? "Met" : "Breached"} · {calm ? "Calm" : quad === "anxiety" ? "Anxious" : "Angry"}
              </div>
              <div style={{ fontSize: 11, fontWeight: 800, color: cell.color, lineHeight: 1.2, margin: "4px 0" }}>{cell.sublabel}</div>
              <div className="lisn-num" style={{ fontSize: 20, fontWeight: 900, color: cssVar("text-primary"), lineHeight: 1 }}>
                {fmt(scale(cell.customers))}
              </div>
              <div style={{ fontSize: 9, color: cssVar("text-muted") }}>{cell.share}% cohort</div>
            </button>
          );
        })}
      </div>
      {focus ? (
        <p style={{ margin: 0, padding: "7px 9px", borderRadius: radius.sm, background: focus.soft, border: `1px solid ${focus.color}33`, fontSize: 11, lineHeight: 1.4, color: cssVar("text-secondary") }}>
          <b style={{ color: focus.color }}>{focus.label}</b> — {fmt(scale(focus.customers))} customers.
          {focus.quad === "anxiety"
            ? " Anxiety, not trust break."
            : focus.quad === "trustBreak"
              ? " True trust break."
              : focus.quad === "opsBreach"
                ? " Ops breach — fix before sentiment turns."
                : " Healthy delivery."}
        </p>
      ) : (
        <p style={{ margin: 0, fontSize: 10, color: cssVar("text-muted"), textAlign: "center" }}>Hover quadrant for anxiety vs breach split</p>
      )}
    </div>
  );
}

function AiInsightCompact(): React.ReactElement {
  const i = SERVICE_DELIVERY_AI_INSIGHT;
  return (
    <Shell style={{ padding: PAD, background: `linear-gradient(180deg, ${cssVar("surface")}, ${cssVar("accent-soft")})` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 800, color: cssVar("text-primary") }}>
          <Sparkles size={14} color={cssVar("accent-2")} strokeWidth={2.4} />
          AI insight
        </span>
        <span style={{ fontSize: 9, fontWeight: 700, color: cssVar("accent-2"), padding: "2px 7px", borderRadius: radius.pill, background: cssVar("accent-soft"), border: `1px solid ${cssVar("accent")}33` }}>
          {i.confidence}% conf.
        </span>
      </div>
      <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 700, lineHeight: 1.4, color: cssVar("text-primary") }}>{i.headline}</p>
      <p style={{ margin: 0, fontSize: 11, lineHeight: 1.45, color: cssVar("text-secondary") }}>{i.anxietyVsBreach}</p>
    </Shell>
  );
}

function AnxietyCarveOut({ data, scale }: { data: typeof ANXIETY_CARVE_OUT; scale: (n: number) => number }): React.ReactElement {
  const total = useAnimatedNumber(scale(data.totalAnxious), { duration: 850, delay: 100 });

  return (
    <Shell style={{ padding: PAD, flex: 1, background: `linear-gradient(160deg, ${cssVar("surface")}, #eab3080c)`, border: `1px solid #eab30833` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <AlertTriangle size={14} color="#ca8a04" strokeWidth={2.4} />
        <span style={{ fontSize: 12, fontWeight: 800, color: cssVar("text-primary") }}>Anxiety vs promise risk</span>
        <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 800, color: "#b45309", background: "#eab3081a", padding: "2px 7px", borderRadius: radius.pill }}>
          Spike
        </span>
      </div>
      <p style={{ margin: "0 0 8px", fontSize: 11, lineHeight: 1.4, color: cssVar("text-secondary") }}>
        <b className="lisn-num" style={{ color: cssVar("text-primary") }}>{fmt(total)}</b> contacted before SLA breach
      </p>
      <div style={{ display: "flex", height: 22, borderRadius: 6, overflow: "hidden", marginBottom: 6 }}>
        <div style={{ width: `${data.withinSlaPct}%`, background: "#22c55e", display: "grid", placeItems: "center" }}>
          <span className="lisn-num" style={{ fontSize: 10, fontWeight: 800, color: "#fff" }}>{data.withinSlaPct}%</span>
        </div>
        <div style={{ width: `${data.breachedPct}%`, background: cssVar("severity-high"), display: "grid", placeItems: "center" }}>
          <span className="lisn-num" style={{ fontSize: 10, fontWeight: 800, color: "#fff" }}>{data.breachedPct}%</span>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: cssVar("text-muted"), marginBottom: 8 }}>
        <span>Within SLA</span>
        <span>Breached</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 8 }}>
        <div style={{ padding: "6px 8px", borderRadius: radius.sm, background: cssVar("surface-raised"), border: `1px solid ${cssVar("border")}` }}>
          <div style={{ fontSize: 8, fontWeight: 700, color: cssVar("text-muted"), textTransform: "uppercase" }}>Repeat contacts</div>
          <div className="lisn-num" style={{ fontSize: 15, fontWeight: 800 }}>{fmt(scale(data.repeatContactCount))}</div>
          <div style={{ fontSize: 9, color: cssVar("text-muted") }}>{data.repeatContactAvg}× avg</div>
        </div>
        <div style={{ padding: "6px 8px", borderRadius: radius.sm, background: cssVar("surface-raised"), border: `1px solid ${cssVar("border")}` }}>
          <div style={{ fontSize: 8, fontWeight: 700, color: cssVar("text-muted"), textTransform: "uppercase" }}>Top driver</div>
          <div style={{ fontSize: 10, fontWeight: 700, color: cssVar("accent-2"), lineHeight: 1.3, marginTop: 3 }}>{data.topDriver}</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
        {[
          { t: "Region", rows: data.regions },
          { t: "Category", rows: data.categories },
          { t: "Hub", rows: data.hubs },
        ].map((b) => (
          <div key={b.t}>
            <div style={{ fontSize: 8, fontWeight: 800, color: cssVar("text-muted"), textTransform: "uppercase", marginBottom: 4 }}>{b.t}</div>
            {b.rows.slice(0, 2).map((r) => (
              <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
                <div style={{ flex: 1, height: 4, borderRadius: 2, background: cssVar("border"), overflow: "hidden" }}>
                  <div style={{ width: `${r.share}%`, height: "100%", background: "#eab308" }} />
                </div>
                <span className="lisn-num" style={{ fontSize: 8, fontWeight: 700, color: cssVar("text-muted"), width: 22, textAlign: "right" }}>{r.share}%</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Shell>
  );
}

function FailurePanel({
  title,
  accent,
  items,
  scale,
  breachMode,
}: {
  title: string;
  accent: string;
  items: typeof RELIABILITY_FAILURES | typeof ANXIETY_SIGNALS;
  scale: (n: number) => number;
  breachMode: boolean;
}): React.ReactElement {
  const getCount = (item: (typeof items)[number]): number =>
    breachMode ? (item as (typeof RELIABILITY_FAILURES)[number]).breached : (item as (typeof ANXIETY_SIGNALS)[number]).contacts;

  const getMeta = (item: (typeof items)[number]): string => {
    if (breachMode) {
      const row = item as (typeof RELIABILITY_FAILURES)[number];
      return `${fmt(scale(row.pending))} open · +${row.wow}%`;
    }
    const row = item as (typeof ANXIETY_SIGNALS)[number];
    return `${row.withinSlaPct}% in SLA · +${row.wow}%`;
  };

  const total = items.reduce((s, item) => s + getCount(item), 0);

  return (
    <Shell style={{ padding: PAD, height: "100%" }} accent={accent}>
      <div style={{ fontSize: 12, fontWeight: 800, color: cssVar("text-primary"), marginBottom: 8, lineHeight: 1.25 }}>{title}</div>
      <div style={{ display: "flex", height: 56, gap: 3, borderRadius: radius.sm, overflow: "hidden", marginBottom: 8 }}>
        {items.map((item, idx) => {
          const n = getCount(item);
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              title={item.example}
              style={{
                flex: n,
                minWidth: 0,
                padding: "6px",
                background: `${accent}${Math.round((1 - idx * 0.1) * 220).toString(16).padStart(2, "0")}`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Icon size={10} color="#fff" strokeWidth={2.3} />
              <div className="lisn-num" style={{ fontSize: 13, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{fmt(scale(n))}</div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {items.map((item) => {
          const n = getCount(item);
          const meta = getMeta(item);
          return (
            <div key={item.id} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8, padding: "5px 0", borderTop: `1px solid ${cssVar("border")}`, alignItems: "start" }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: cssVar("text-primary"), lineHeight: 1.25 }}>{item.label}</div>
                <div style={{ fontSize: 9, color: cssVar("text-muted"), marginTop: 1, lineHeight: 1.3 }}>{item.example}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="lisn-num" style={{ fontSize: 11, fontWeight: 800 }}>{fmt(scale(n))}</div>
                <div style={{ fontSize: 8, color: cssVar("text-muted") }}>{meta}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Shell>
  );
}

function DriverBars({ rows, scale }: { rows: typeof ANXIETY_DRIVERS; scale: (n: number) => number }): React.ReactElement {
  const max = Math.max(...rows.map((r) => r.share));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {rows.map((row) => (
        <div key={row.label}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 6, marginBottom: 3 }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: cssVar("text-secondary"), lineHeight: 1.2 }}>{row.label}</span>
            <span className="lisn-num" style={{ fontSize: 9, fontWeight: 700, color: cssVar("text-muted"), whiteSpace: "nowrap" }}>
              {fmt(scale(row.contacts))} · +{row.wow}%
            </span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: cssVar("surface-raised"), overflow: "hidden" }}>
            <div style={{ width: `${(row.share / max) * 100}%`, height: "100%", background: "#eab308" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function JourneyBars({ rows, scale }: { rows: typeof ANXIETY_BY_JOURNEY; scale: (n: number) => number }): React.ReactElement {
  const max = Math.max(...rows.map((r) => r.contacts));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 100 }}>
      {rows.map((row) => (
        <div key={row.stage} style={{ flex: 1, minWidth: 0, textAlign: "center" }}>
          <div
            title={`${fmt(scale(row.contacts))} · ${row.withinSlaPct}% in SLA`}
            style={{
              height: Math.max(14, (row.contacts / max) * 72),
              borderRadius: "4px 4px 1px 1px",
              background: row.trend >= 10 ? "#eab308" : cssVar("accent"),
              marginBottom: 4,
              display: "grid",
              placeItems: "start center",
              paddingTop: 3,
            }}
          >
            <span className="lisn-num" style={{ fontSize: 8, fontWeight: 800, color: "#fff" }}>{row.share}%</span>
          </div>
          <span style={{ fontSize: 7.5, fontWeight: 700, color: cssVar("text-muted"), lineHeight: 1.15, display: "block" }}>{row.stage}</span>
        </div>
      ))}
    </div>
  );
}

function SegmentTiles({ rows }: { rows: typeof ANXIETY_BY_SEGMENT }): React.ReactElement {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 6 }}>
      {rows.map((row) => {
        const hot = row.anxietyIndex >= 70;
        return (
          <div key={row.segment} style={{ padding: "6px 8px", borderRadius: radius.sm, border: `1px solid ${hot ? "#eab30844" : cssVar("border")}`, background: hot ? "#eab3080c" : cssVar("surface-raised") }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: cssVar("text-primary"), lineHeight: 1.2 }}>{row.segment}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 4 }}>
              <span className="lisn-num" style={{ fontSize: 14, fontWeight: 800, color: hot ? "#b45309" : cssVar("text-primary") }}>{row.anxietyIndex}</span>
              <span style={{ fontSize: 8, color: cssVar("text-muted") }}>{row.share}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SentimentIcon({ trend }: { trend: AnxietyEvidence["sentimentTrend"] }): React.ReactElement {
  switch (trend) {
    case "rising":
      return <TrendingUp size={11} color={cssVar("severity-high")} strokeWidth={2.5} />;
    case "falling":
      return <TrendingDown size={11} color={cssVar("positive")} strokeWidth={2.5} />;
    case "stable":
      return <Target size={11} color={cssVar("text-muted")} strokeWidth={2.5} />;
    default: {
      const _exhaustive: never = trend;
      return _exhaustive;
    }
  }
}

function EvidencePanel({ scale }: { scale: (n: number) => number }): React.ReactElement {
  const [selected, setSelected] = useState(ANXIETY_EVIDENCE[0]?.id ?? "");
  const ev = ANXIETY_EVIDENCE.find((e) => e.id === selected) ?? ANXIETY_EVIDENCE[0];
  if (!ev) return <div />;

  return (
    <Shell style={{ overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", minHeight: 220 }}>
        <div style={{ borderRight: `1px solid ${cssVar("border")}`, background: cssVar("surface-raised") }}>
          <div style={{ padding: "8px 10px", fontSize: 11, fontWeight: 800, borderBottom: `1px solid ${cssVar("border")}` }}>Signals</div>
          {ANXIETY_EVIDENCE.map((row) => (
            <button
              key={row.id}
              type="button"
              onClick={() => setSelected(row.id)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "7px 10px",
                border: 0,
                borderBottom: `1px solid ${cssVar("border")}`,
                background: row.id === selected ? cssVar("surface") : "transparent",
                cursor: "pointer",
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 700 }}>{row.orderId}</div>
              <div style={{ fontSize: 9, color: cssVar("text-muted"), marginTop: 1 }}>{row.category}</div>
            </button>
          ))}
        </div>
        <div style={{ padding: PAD }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 800 }}>{ev.orderId}</span>
            <span
              style={{
                fontSize: 9,
                fontWeight: 800,
                textTransform: "uppercase",
                padding: "3px 8px",
                borderRadius: radius.pill,
                color: ev.slaBreached ? cssVar("severity-high") : "#b45309",
                background: ev.slaBreached ? `${cssVar("severity-high")}14` : "#eab30818",
              }}
            >
              {ev.slaBreached ? "SLA breached" : "Within SLA"}
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 8 }}>
            {[
              { icon: Calendar, l: "Promise", v: ev.promiseDate },
              { icon: Truck, l: "Status", v: ev.actualStatus },
              { icon: Clock, l: "Breach", v: ev.slaBreached ? "Breached" : `${ev.daysToBreach}d left` },
              { icon: MessageSquare, l: "Contacts", v: fmt(scale(ev.contactCount)) },
              { icon: Package, l: "Value", v: ev.orderValue },
              { icon: MapPin, l: "Hub", v: `${ev.hub}` },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.l} style={{ padding: "6px 8px", borderRadius: radius.sm, background: cssVar("surface-raised"), border: `1px solid ${cssVar("border")}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
                    <Icon size={10} color={cssVar("text-muted")} />
                    <span style={{ fontSize: 8, fontWeight: 700, color: cssVar("text-muted"), textTransform: "uppercase" }}>{f.l}</span>
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 600, lineHeight: 1.3, color: cssVar("text-primary") }}>{f.v}</div>
                </div>
              );
            })}
          </div>
          <div style={{ padding: "8px 10px", borderRadius: radius.sm, background: cssVar("accent-soft"), border: `1px solid ${cssVar("accent")}22` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
              <MessageSquare size={11} color={cssVar("accent-2")} />
              <span style={{ fontSize: 9, fontWeight: 700, color: cssVar("accent-2"), textTransform: "uppercase" }}>Latest message</span>
              <span style={{ marginLeft: "auto" }}><SentimentIcon trend={ev.sentimentTrend} /></span>
            </div>
            <p style={{ margin: 0, fontSize: 11, fontStyle: "italic", lineHeight: 1.4, color: cssVar("text-secondary") }}>&ldquo;{ev.latestMessage}&rdquo;</p>
          </div>
          {!ev.slaBreached ? (
            <p style={{ margin: "8px 0 0", fontSize: 10, fontWeight: 600, color: "#b45309", lineHeight: 1.35 }}>
              Anxiety only — still within promised SLA. Do not mark as reliability breach.
            </p>
          ) : null}
        </div>
      </div>
    </Shell>
  );
}

function ActionsTable(): React.ReactElement {
  return (
    <Shell style={{ overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.3fr 0.9fr 1.4fr auto", gap: 10, padding: "8px 12px", background: cssVar("surface-raised"), borderBottom: `1px solid ${cssVar("border")}` }}>
        {["Issue", "Signal", "Owner", "Action", ""].map((l) => (
          <span key={l || "x"} style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4, color: cssVar("text-muted") }}>{l}</span>
        ))}
      </div>
      {SERVICE_DELIVERY_ACTIONS.map((a, i) => {
        const c = a.kind === "Escalate" ? cssVar("severity-high") : a.kind === "Act now" ? cssVar("positive") : cssVar("accent");
        return (
          <div
            key={a.issue}
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 1.3fr 0.9fr 1.4fr auto",
              gap: 10,
              padding: "9px 12px",
              borderBottom: i < SERVICE_DELIVERY_ACTIONS.length - 1 ? `1px solid ${cssVar("border")}` : undefined,
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.35 }}>{a.issue}</span>
            <span style={{ fontSize: 11, color: cssVar("text-secondary"), lineHeight: 1.35 }}>{a.signal}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: cssVar("accent"), background: cssVar("accent-soft"), borderRadius: 5, padding: "2px 6px", width: "fit-content" }}>{a.owner}</span>
            <span style={{ fontSize: 11, color: cssVar("text-secondary"), lineHeight: 1.35 }}>{a.action}</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, color: c, border: `1px solid ${c}44`, background: `${c}12`, padding: "4px 8px", borderRadius: 6, whiteSpace: "nowrap" }}>
              {a.kind} <ArrowRight size={11} />
            </span>
          </div>
        );
      })}
    </Shell>
  );
}

export function ServiceDeliveryRangeSelector({
  range,
  onChange,
}: {
  range: ServiceDeliveryRangeKey;
  onChange: (k: ServiceDeliveryRangeKey) => void;
}): React.ReactElement {
  return (
    <div style={{ display: "inline-flex", background: cssVar("surface-raised"), border: `1px solid ${cssVar("border")}`, borderRadius: 8, padding: 2 }}>
      {(Object.keys(SERVICE_DELIVERY_RANGES) as ServiceDeliveryRangeKey[]).map((k) => (
        <button
          key={k}
          type="button"
          onClick={() => onChange(k)}
          className="lisn-num"
          style={{
            border: 0,
            background: range === k ? cssVar("surface") : "transparent",
            fontSize: 11,
            fontWeight: 600,
            color: range === k ? cssVar("accent") : cssVar("text-muted"),
            padding: "4px 9px",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          {k}
        </button>
      ))}
    </div>
  );
}

export function ServiceDeliveryIntelligence({
  range,
  service,
  drill,
}: {
  range: ServiceDeliveryRangeKey;
  service: ServiceDeliveryTop;
  drill: ServiceDeliveryDrill;
}): React.ReactElement {
  const R = SERVICE_DELIVERY_RANGES[range];
  const scale = (n: number): number => n * R.f;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: GAP }}>
      {/* Headline KPI row — 3 equal cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: GAP, alignItems: "stretch" }}>
        <PromiseReliabilityHeroCard scale={scale} />
        <CustomerAnxietyHeroCard scale={scale} />
        <ServiceDeliveryHeroCard scale={scale} />
      </div>

      {/* Matrix + insight + carve-out */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 0.8fr)", gap: GAP, alignItems: "stretch" }}>
        <Shell style={{ padding: PAD }}>
          <SectionHead n="01" title={<>Promise × sentiment matrix</>} />
          <PromiseMatrix cells={PROMISE_SENTIMENT_MATRIX} scale={scale} />
        </Shell>
        <div style={{ display: "flex", flexDirection: "column", gap: GAP, minHeight: 0 }}>
          <AiInsightCompact />
          <AnxietyCarveOut data={ANXIETY_CARVE_OUT} scale={scale} />
        </div>
      </div>

      {/* Trust broken vs anxiety */}
      <div>
        <SectionHead n="02" title={<>Trust broken vs customer anxiety</>} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: GAP }}>
          <FailurePanel title="Trust broken — promise failed" accent={cssVar("severity-high")} items={RELIABILITY_FAILURES} scale={scale} breachMode />
          <FailurePanel title="Customer anxiety — before breach" accent="#ca8a04" items={ANXIETY_SIGNALS} scale={scale} breachMode={false} />
        </div>
      </div>

      {/* Previous ops visualizations */}
      <div>
        <SectionHead n="03" title={<>SLA promise, FCR & channel load</>} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: GAP, marginBottom: GAP }}>
          <DetailSection premium fill title="Service promise & breach map">
            <ServicePromiseBoardVisual service={service} failures={drill.slaFailures} />
          </DetailSection>
          <DetailSection premium fill title="FCR intelligence" subtitle="Actual vs target · dashed = last month">
            <FcrIntelligenceVisual />
          </DetailSection>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: GAP }}>
          <DetailSection premium fill title="SLA heatmap" subtitle="Intent × channel · intensity = compliance gap">
            <SlaHeatmapVisual heatmap={drill.slaHeatmap} />
          </DetailSection>
          <EcommerceCrossChannelEscalationSection fill channels={drill.channels} escalationFlows={drill.escalationFlows} />
        </div>
      </div>

      {/* Anxiety drivers */}
      <div>
        <SectionHead n="04" title={<>Why anxiety is building</>} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: GAP }}>
          <Shell style={{ padding: PAD }}>
            <div style={{ fontSize: 11, fontWeight: 800, marginBottom: 8 }}>Top drivers</div>
            <DriverBars rows={ANXIETY_DRIVERS} scale={scale} />
          </Shell>
          <Shell style={{ padding: PAD }}>
            <div style={{ fontSize: 11, fontWeight: 800, marginBottom: 8 }}>By journey stage</div>
            <JourneyBars rows={ANXIETY_BY_JOURNEY} scale={scale} />
          </Shell>
          <Shell style={{ padding: PAD }}>
            <div style={{ fontSize: 11, fontWeight: 800, marginBottom: 8 }}>By segment</div>
            <SegmentTiles rows={ANXIETY_BY_SEGMENT} />
          </Shell>
        </div>
      </div>

      {/* FCI heatmap (previous) */}
      <div>
        <SectionHead n="05" title={<>Shopper intent heatmap</>} />
        <EcommerceFciHeatmapSection fill />
      </div>

      {/* Evidence + actions */}
      <div>
        <SectionHead n="06" title={<>Anxiety evidence</>} />
        <EvidencePanel scale={scale} />
      </div>
      <div>
        <SectionHead n="07" title={<>Recommended actions</>} />
        <ActionsTable />
      </div>
    </div>
  );
}
