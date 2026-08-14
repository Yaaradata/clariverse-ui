"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertOctagon,
  ArrowLeft,
  ChevronRight,
  Clock,
  Layers,
  Radio,
  RotateCcw,
  UserCheck,
  Users,
} from "lucide-react";

/* ------------------------------------------------------------------ tokens */
const C = {
  appBg: "#f4f5fb",
  panel: "#ffffff",
  panelAlt: "#fafbff",
  border: "#e7e9f3",
  borderStrong: "#d6d9ea",
  ink: "#1b1e34",
  ink2: "#585d7d",
  ink3: "#6b7191",
  accent: "#4f46e5",
  accentLine: "#6366f1",
  accentSoft: "#eef0fe",
};

/* Disposition = entity palette. Breach/health = state palette. Never crossed. */
const DISPO = {
  info_update: { label: "Information + update", dot: "#0284c7", soft: "#e7f4fb", ink: "#075985" },
  repromise: { label: "Re-promise", dot: "#7c3aed", soft: "#f1eafe", ink: "#5b21b6" },
  escalate: { label: "Escalate", dot: "#db2777", soft: "#fce7f1", ink: "#9d174d" },
  info_followup: { label: "Information + follow-up", dot: "#0d9488", soft: "#e1f5f2", ink: "#115e59" },
  needs_human: { label: "Needs human review", dot: "#d97706", soft: "#fffbeb", ink: "#92400e" },
} as const;

type DispoKey = keyof typeof DISPO;

const STATE = {
  good: "#16a34a",
  warn: "#d97706",
  bad: "#dc2626",
  goodBg: "#f0fdf4",
  warnBg: "#fffbeb",
  badBg: "#fef2f2",
  goodBd: "#bbf7d0",
  warnBd: "#fde68a",
  badBd: "#fecaca",
};

type Tone = "bad" | "warn" | "good";
type RangeKey = "7D" | "30D" | "90D";
type ActionKey = "toAction" | "waiting" | "acted" | "returned";

type ActionState = {
  key: ActionKey;
  label: string;
  sub: string;
  Icon: LucideIcon;
};

/* --------------------------------------------------------------------- data */

/* ---------------------------------------------------------------- dataset */
/* Everything on this screen is scoped to unresolved cases CREATED inside the
   selected window. Changing the range changes every number, not just the chart. */

const ACTION_STATES: ActionState[] = [
  { key: "toAction", label: "With the consultant", sub: "not yet actioned", Icon: Users },
  { key: "waiting", label: "With SCM / ER", sub: "PO upload · reship desk", Icon: Clock },
  { key: "acted", label: "Actioned, unconfirmed", sub: "not yet solved on Sentinel", Icon: UserCheck },
  { key: "returned", label: "Repeat contact", sub: "after an update was issued", Icon: RotateCcw },
];

type MovementRow = {
  label: string;
  delta: number;
  pct: number;
  count: number;
  bad: boolean;
  where: string;
};

type Hotspot = { name: string; kind: string; count: number; pct: number };

type GridRow = { dispo: DispoKey } & Record<ActionKey, number>;

type LoopRow = { key: string; label: string; count: number; tone: Tone; note: string };

type WaitingRow = { label: string; count: number; tone: Tone };

type RangeData = {
  open: number;
  vsPrev: number;
  vsPrevLabel: string;
  deltaAbs: number;
  trend: number[];
  trendLabel: string;
  movement: MovementRow[];
  hotspots: Hotspot[];
  grid: GridRow[];
  loop: LoopRow[];
  waiting: WaitingRow[];
  heldForReview: number;
  patternExposure: string[];
};

const DATA: Record<RangeKey, RangeData> = {
  "7D": {
    open: 18240,
    vsPrev: 4.1,
    vsPrevLabel: "vs previous 7 days",
    deltaAbs: 720,
    trend: [15900, 16400, 16100, 17200, 17600, 17900, 18240],
    trendLabel: "last 7 days",
    movement: [
      { label: "Cases aged past 72h", delta: +540, pct: +12, count: 4180, bad: true, where: "eKart north lanes" },
      { label: "No scan for 48h or more", delta: +410, pct: +19, count: 2740, bad: true, where: "Bhiwandi motherhub" },
      { label: "Awaiting consultant action", delta: +260, pct: +4, count: 6820, bad: true, where: "inflow up, closures flat" },
      { label: "Repeat contacts", delta: -190, pct: -15, count: 1080, bad: false, where: "re-promise accuracy improving" },
    ],
    hotspots: [
      { name: "Bhiwandi motherhub", kind: "hub", count: 1420, pct: +28 },
      { name: "CloudTail", kind: "seller", count: 1080, pct: +19 },
      { name: "Ecom Express · 3PL", kind: "courier", count: 960, pct: +16 },
      { name: "Farrukhnagar hub", kind: "hub", count: 640, pct: +11 },
    ],
    grid: [
      { dispo: "info_update", toAction: 5600, waiting: 0, acted: 1900, returned: 480 },
      { dispo: "repromise", toAction: 2900, waiting: 620, acted: 980, returned: 240 },
      { dispo: "escalate", toAction: 780, waiting: 1560, acted: 430, returned: 110 },
      { dispo: "info_followup", toAction: 1180, waiting: 150, acted: 520, returned: 80 },
      { dispo: "needs_human", toAction: 710, waiting: 0, acted: 0, returned: 0 },
    ],
    loop: [
      { key: "owed", label: "Awaiting consultant action", count: 6820, tone: "bad", note: "unresolved on Smart Assist · no update issued" },
      { key: "promised", label: "Re-promised or escalated", count: 2340, tone: "warn", note: "FPD revised or with SCM · new date not yet due" },
      { key: "delivered", label: "Happy closure", count: 3360, tone: "good", note: "delivered · solved on Smart Assist" },
      { key: "returned", label: "Repeat contact", count: 1080, tone: "bad", note: "customer contacted again after an update was issued" },
    ],
    waiting: [
      { label: "Ageing over 72h", count: 980, tone: "bad" },
      { label: "Ageing 24 to 72h", count: 3140, tone: "warn" },
      { label: "Ageing under 24h", count: 2700, tone: "good" },
    ],
    heldForReview: 710,
    patternExposure: ["9.4k shipments", "4.1k returns", "3.0k replacements", "6.1k shipments", "1.4k installs"],
  },

  "30D": {
    open: 48596,
    vsPrev: 6.2,
    vsPrevLabel: "vs previous 30 days",
    deltaAbs: 2840,
    trend: [42100, 43800, 43200, 44900, 45600, 47100, 46800, 48596],
    trendLabel: "last 8 weeks",
    movement: [
      { label: "Cases aged past 72h", delta: +2100, pct: +17, count: 14776, bad: true, where: "concentrated on eKart north lanes" },
      { label: "No scan for 48h or more", delta: +1340, pct: +24, count: 8972, bad: true, where: "Bhiwandi and Farrukhnagar hubs" },
      { label: "Awaiting consultant action", delta: +890, pct: +5, count: 18046, bad: true, where: "inflow up, closures flat" },
      { label: "Repeat contacts", delta: -680, pct: -19, count: 2872, bad: false, where: "re-promise accuracy improving" },
    ],
    hotspots: [
      { name: "Bhiwandi motherhub", kind: "hub", count: 3820, pct: +31 },
      { name: "CloudTail", kind: "seller", count: 2940, pct: +22 },
      { name: "Ecom Express · 3PL", kind: "courier", count: 2610, pct: +18 },
      { name: "Farrukhnagar hub", kind: "hub", count: 1780, pct: +14 },
    ],
    grid: [
      { dispo: "info_update", toAction: 14200, waiting: 0, acted: 5100, returned: 1540 },
      { dispo: "repromise", toAction: 7900, waiting: 1850, acted: 2760, returned: 760 },
      { dispo: "escalate", toAction: 2100, waiting: 4380, acted: 1240, returned: 330 },
      { dispo: "info_followup", toAction: 3020, waiting: 410, acted: 1480, returned: 242 },
      { dispo: "needs_human", toAction: 1284, waiting: 0, acted: 0, returned: 0 },
    ],
    loop: [
      { key: "owed", label: "Awaiting consultant action", count: 18046, tone: "bad", note: "unresolved on Smart Assist · no update issued" },
      { key: "promised", label: "Re-promised or escalated", count: 6240, tone: "warn", note: "FPD revised or with SCM · new date not yet due" },
      { key: "delivered", label: "Happy closure", count: 8940, tone: "good", note: "delivered · solved on Smart Assist" },
      { key: "returned", label: "Repeat contact", count: 2872, tone: "bad", note: "customer contacted again after an update was issued" },
    ],
    waiting: [
      { label: "Ageing over 72h", count: 4180, tone: "bad" },
      { label: "Ageing 24 to 72h", count: 8920, tone: "warn" },
      { label: "Ageing under 24h", count: 4946, tone: "good" },
    ],
    heldForReview: 1284,
    patternExposure: ["28.6k shipments", "12.4k returns", "9.1k replacements", "18.4k shipments", "4.3k installs"],
  },

  "90D": {
    open: 96420,
    vsPrev: -2.4,
    vsPrevLabel: "vs previous 90 days",
    deltaAbs: -2380,
    trend: [101200, 99800, 100400, 98600, 97900, 98800, 97100, 96420],
    trendLabel: "last 6 months",
    movement: [
      { label: "Cases aged past 72h", delta: +4900, pct: +14, count: 39400, bad: true, where: "eKart north and east lanes" },
      { label: "No scan for 48h or more", delta: +2780, pct: +11, count: 27600, bad: true, where: "Bhiwandi, Farrukhnagar, Sonepat" },
      { label: "Awaiting consultant action", delta: -1640, pct: -4, count: 35800, bad: false, where: "closures outpacing inflow" },
      { label: "Repeat contacts", delta: -2210, pct: -28, count: 5700, bad: false, where: "re-promise accuracy improving" },
    ],
    hotspots: [
      { name: "Bhiwandi motherhub", kind: "hub", count: 9640, pct: +26 },
      { name: "Ecom Express · 3PL", kind: "courier", count: 7180, pct: +21 },
      { name: "CloudTail", kind: "seller", count: 6420, pct: +15 },
      { name: "Sonepat hub", kind: "hub", count: 4900, pct: +12 },
    ],
    grid: [
      { dispo: "info_update", toAction: 28100, waiting: 0, acted: 10200, returned: 3080 },
      { dispo: "repromise", toAction: 15600, waiting: 3700, acted: 5480, returned: 1520 },
      { dispo: "escalate", toAction: 4180, waiting: 8700, acted: 2460, returned: 660 },
      { dispo: "info_followup", toAction: 5880, waiting: 820, acted: 2940, returned: 480 },
      { dispo: "needs_human", toAction: 2620, waiting: 0, acted: 0, returned: 0 },
    ],
    loop: [
      { key: "owed", label: "Awaiting consultant action", count: 35800, tone: "bad", note: "unresolved on Smart Assist · no update issued" },
      { key: "promised", label: "Re-promised or escalated", count: 12400, tone: "warn", note: "FPD revised or with SCM · new date not yet due" },
      { key: "delivered", label: "Happy closure", count: 17700, tone: "good", note: "delivered · solved on Smart Assist" },
      { key: "returned", label: "Repeat contact", count: 5700, tone: "bad", note: "customer contacted again after an update was issued" },
    ],
    waiting: [
      { label: "Ageing over 72h", count: 9400, tone: "bad" },
      { label: "Ageing 24 to 72h", count: 17200, tone: "warn" },
      { label: "Ageing under 24h", count: 9200, tone: "good" },
    ],
    heldForReview: 2620,
    patternExposure: ["94.2k shipments", "38.6k returns", "27.4k replacements", "55.1k shipments", "12.8k installs"],
  },
};

type SliceTone = Tone;

type Pattern = {
  rank: number;
  title: string;
  trend: "up" | "flat" | "down";
  slices: { label: string; pct: number; tone: SliceTone }[];
};

const PATTERNS: Pattern[] = [
  {
    rank: 1,
    title: "Delivery delayed past committed date, no proactive update",
    trend: "up",
    slices: [
      { label: "In-transit", pct: 38, tone: "bad" },
      { label: "Post-delivery", pct: 36, tone: "bad" },
      { label: "At DH", pct: 16, tone: "good" },
      { label: "Pre-ship", pct: 10, tone: "good" },
    ],
  },
  {
    rank: 2,
    title: "Refund not credited after return picked up",
    trend: "flat",
    slices: [
      { label: "Awaiting QC", pct: 44, tone: "bad" },
      { label: "Credited, unseen", pct: 31, tone: "warn" },
      { label: "In reverse leg", pct: 25, tone: "good" },
    ],
  },
  {
    rank: 3,
    title: "Wrong or repeat item delivered on replacement",
    trend: "up",
    slices: [
      { label: "Seller dispatch", pct: 52, tone: "bad" },
      { label: "Hub mis-sort", pct: 33, tone: "warn" },
      { label: "Last mile", pct: 15, tone: "good" },
    ],
  },
  {
    rank: 4,
    title: "Failed delivery marked without a real attempt (WMRDD)",
    trend: "up",
    slices: [
      { label: "3PL couriers", pct: 61, tone: "bad" },
      { label: "eKart last mile", pct: 39, tone: "warn" },
    ],
  },
  {
    rank: 5,
    title: "Installation not scheduled within SLA",
    trend: "down",
    slices: [
      { label: "Brand-owned install", pct: 68, tone: "bad" },
      { label: "Flipkart install", pct: 32, tone: "good" },
    ],
  },
];

/* ------------------------------------------------------------------ helpers */
const inr = (n: number) => n.toLocaleString("en-IN");

function toneColors(tone: Tone): { col: string; bg: string; bd: string } {
  switch (tone) {
    case "bad":
      return { col: STATE.bad, bg: STATE.badBg, bd: STATE.badBd };
    case "warn":
      return { col: STATE.warn, bg: STATE.warnBg, bd: STATE.warnBd };
    case "good":
      return { col: STATE.good, bg: STATE.goodBg, bd: STATE.goodBd };
    default: {
      const _exhaustive: never = tone;
      return _exhaustive;
    }
  }
}

/* ------------------------------------------------------------- provenance */
/* Three different kinds of stamp, because the panels are three different kinds
   of thing: external data has freshness, a rule set has a version, and our own
   output has a computed-at time. Showing a run time on all three would imply
   the data is as current as the run, which it is not. */
type ProvenanceSrc =
  | { kind: "data"; system: string; asOf: string; lag: string }
  | { kind: "rule"; version: string; effective: string }
  | { kind: "computed"; asOf: string };

const SOURCE = {
  pendency: { kind: "data", system: "Sentinel", asOf: "14-Aug 09:10", lag: "live" } as const,
  hotspots: { kind: "computed", asOf: "14-Aug 09:10" } as const,
  grid: { kind: "rule", version: "SOP v3", effective: "08-Aug" } as const,
  loop: { kind: "data", system: "Sentinel", asOf: "14-Aug 09:10", lag: "live" } as const,
  patterns: { kind: "computed", asOf: "14-Aug 08:00" } as const,
  slices: { kind: "data", system: "Multi Track", asOf: "14-Aug 08:40", lag: "~hourly" } as const,
};

function Provenance({ src }: { src: ProvenanceSrc }) {
  let text: string;
  switch (src.kind) {
    case "data":
      text = `${src.system} · as of ${src.asOf}${src.lag && src.lag !== "live" ? ` · ${src.lag}` : ""}`;
      break;
    case "rule":
      text = `${src.version} · effective ${src.effective}`;
      break;
    case "computed":
      text = `computed ${src.asOf}`;
      break;
    default: {
      const _exhaustive: never = src;
      throw new Error(`Unhandled provenance: ${String(_exhaustive)}`);
    }
  }
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 11,
        fontWeight: 600,
        color: C.ink3,
        whiteSpace: "nowrap",
      }}
    >
      <Clock size={11} strokeWidth={2.2} style={{ opacity: 0.7 }} />
      {text}
    </span>
  );
}

function Pill({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 11.5,
        fontWeight: 600,
        padding: "3px 9px",
        borderRadius: 999,
        lineHeight: 1.15,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

function Card({ children, accent, style }: { children: ReactNode; accent?: string; style?: CSSProperties }) {
  return (
    <div
      style={{
        background: C.panel,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        overflow: "hidden",
        ...style,
      }}
    >
      {accent ? <div style={{ height: 3, background: accent }} /> : null}
      {children}
    </div>
  );
}

function SectionHead({
  title,
  sub,
  right,
  src,
}: {
  title: ReactNode;
  sub?: ReactNode;
  right?: ReactNode;
  src?: ProvenanceSrc;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: C.ink, letterSpacing: -0.2 }}>{title}</div>
        {sub ? <div style={{ fontSize: 12, color: C.ink3, marginTop: 2 }}>{sub}</div> : null}
      </div>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        {right}
        {src ? <Provenance src={src} /> : null}
      </div>
    </div>
  );
}

/* ================================================================== the hero */
function Spark({ points, color }: { points: number[]; color: string }) {
  const w = 132;
  const h = 30;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const d = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((p - min) / span) * (h - 4) - 2;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const lastX = w;
  const lastY = h - ((points[points.length - 1] - min) / span) * (h - 4) - 2;
  return (
    <svg width={w} height={h} style={{ display: "block", overflow: "visible" }}>
      <path d={d} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
      <circle cx={lastX} cy={lastY} r={3.2} fill={color} />
    </svg>
  );
}

function TodayBar({ range }: { range: RangeKey }) {
  const d = DATA[range];
  const up = d.vsPrev > 0;
  const tone = up ? STATE.bad : STATE.good;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0,1.05fr) minmax(0,1fr)",
        gap: 12,
        marginBottom: 20,
      }}
    >
      {/* ---------- the number, with the comparison that gives it meaning ---------- */}
      <Card accent={C.accentLine}>
        <div style={{ padding: "16px 20px 18px", display: "flex", flexDirection: "column", height: "100%" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{ fontSize: 11, letterSpacing: 0.4, textTransform: "uppercase", fontWeight: 800, color: C.ink3 }}>
              Unresolved cases requiring action today
            </div>
            <div style={{ marginLeft: "auto", flexShrink: 0 }}>
              <Provenance src={SOURCE.pendency} />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginTop: 8 }}>
            <span style={{ fontSize: 46, fontWeight: 800, color: C.ink, letterSpacing: -1.8, lineHeight: 1 }}>
              {inr(d.open)}
            </span>
            <div style={{ paddingBottom: 4 }}>
              <Pill
                style={{
                  background: up ? STATE.badBg : STATE.goodBg,
                  color: tone,
                  border: `1px solid ${up ? STATE.badBd : STATE.goodBd}`,
                  fontSize: 12,
                }}
              >
                {up ? "▲" : "▼"} {Math.abs(d.vsPrev)}% {d.vsPrevLabel}
              </Pill>
              <div style={{ fontSize: 11.5, color: C.ink3, marginTop: 5 }}>
                {d.deltaAbs > 0 ? "+" : ""}
                {inr(d.deltaAbs)} on the previous period
              </div>
            </div>
            <div style={{ marginLeft: "auto", paddingBottom: 2 }}>
              <Spark points={d.trend} color={tone} />
              <div style={{ fontSize: 10, color: C.ink3, textAlign: "right", marginTop: 2 }}>
                {d.trendLabel}
              </div>
            </div>
          </div>

          {/* what moved */}
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px dashed ${C.border}` }}>
            <div
              style={{
                fontSize: 11,
                letterSpacing: 0.4,
                textTransform: "uppercase",
                fontWeight: 800,
                color: C.ink3,
                marginBottom: 9,
              }}
            >
              What moved today
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {d.movement.map((m) => {
                const col = m.bad ? STATE.bad : STATE.good;
                return (
                  <div key={m.label} style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                    <span
                      style={{
                        minWidth: 62,
                        textAlign: "right",
                        fontSize: 14,
                        fontWeight: 800,
                        color: col,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {m.delta > 0 ? "+" : ""}
                      {inr(m.delta)}
                    </span>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: C.ink, whiteSpace: "nowrap" }}>{m.label}</span>
                    <span style={{ fontSize: 11.5, color: C.ink3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {m.where}
                    </span>
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: 11.5,
                        fontWeight: 700,
                        color: col,
                        fontVariantNumeric: "tabular-nums",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {m.pct > 0 ? "+" : ""}
                      {m.pct}%
                    </span>
                    <span
                      style={{
                        fontSize: 11.5,
                        color: C.ink3,
                        minWidth: 52,
                        textAlign: "right",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {inr(m.count)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* ---------- where it concentrates ---------- */}
      <Card accent={STATE.warn}>
        <div style={{ padding: "16px 20px 18px", display: "flex", flexDirection: "column", height: "100%" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 11, letterSpacing: 0.4, textTransform: "uppercase", fontWeight: 800, color: C.ink3 }}>
                Where the pendency concentrates
              </div>
              <div style={{ fontSize: 11.5, color: C.ink3, marginTop: 3 }}>
                Slices running above their own normal · unresolved cases
              </div>
            </div>
            <div style={{ marginLeft: "auto", flexShrink: 0 }}>
              <Provenance src={SOURCE.hotspots} />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 11, marginTop: 15 }}>
            {d.hotspots.map((h) => {
              const max = d.hotspots[0].count;
              const w = (h.count / max) * 100;
              return (
                <div key={h.name}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 5 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: C.ink }}>{h.name}</span>
                    <Pill style={{ background: C.appBg, color: C.ink3, border: `1px solid ${C.border}`, fontSize: 10.5 }}>
                      {h.kind}
                    </Pill>
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: 11.5,
                        fontWeight: 700,
                        color: STATE.bad,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      +{h.pct}%
                    </span>
                    <span
                      style={{
                        fontSize: 13.5,
                        fontWeight: 800,
                        color: C.ink,
                        fontVariantNumeric: "tabular-nums",
                        minWidth: 46,
                        textAlign: "right",
                      }}
                    >
                      {inr(h.count)}
                    </span>
                  </div>
                  <div style={{ height: 7, background: C.appBg, borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ width: `${w}%`, height: "100%", background: STATE.warn, borderRadius: 999 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ====================================================== disposition × action */
function DispositionGrid({ range }: { range: RangeKey }) {
  const grid = DATA[range].grid;
  const totals = useMemo(() => {
    const t: Record<ActionKey, number> = { toAction: 0, waiting: 0, acted: 0, returned: 0 };
    grid.forEach((r) => {
      ACTION_STATES.forEach((s) => {
        t[s.key] += r[s.key];
      });
    });
    return t;
  }, [grid]);
  const grandTotal = Object.values(totals).reduce((a, b) => a + b, 0);

  return (
    <Card accent="#0284c7" style={{ marginBottom: 20 }}>
      <div style={{ padding: "14px 18px 18px" }}>
        <SectionHead
          title="Where those cases sit"
          sub="Unresolved cases by recommended disposition and current owner"
          src={SOURCE.grid}
          right={<Pill style={{ background: C.accentSoft, color: C.accent }}>{inr(grandTotal)} cases</Pill>}
        />

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "8px 10px 10px 0",
                    fontSize: 11,
                    letterSpacing: 0.3,
                    textTransform: "uppercase",
                    color: C.ink3,
                    fontWeight: 800,
                  }}
                >
                  Recommended action
                </th>
                {ACTION_STATES.map((s) => (
                  <th
                    key={s.key}
                    style={{
                      textAlign: "right",
                      padding: "8px 10px 10px",
                      fontSize: 11,
                      letterSpacing: 0.3,
                      textTransform: "uppercase",
                      color: C.ink3,
                      fontWeight: 800,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 5, justifyContent: "flex-end" }}>
                      <s.Icon size={12} strokeWidth={2.2} />
                      {s.label}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        textTransform: "none",
                        letterSpacing: 0,
                        fontWeight: 600,
                        color: C.ink3,
                        marginTop: 2,
                      }}
                    >
                      {s.sub}
                    </div>
                  </th>
                ))}
                <th
                  style={{
                    textAlign: "right",
                    padding: "8px 0 10px 10px",
                    fontSize: 11,
                    letterSpacing: 0.3,
                    textTransform: "uppercase",
                    color: C.ink3,
                    fontWeight: 800,
                  }}
                >
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {grid.map((row) => {
                const d = DISPO[row.dispo];
                const rowTotal = ACTION_STATES.reduce((a, s) => a + row[s.key], 0);
                const isException = row.dispo === "needs_human";
                return (
                  <tr
                    key={row.dispo}
                    style={{
                      borderTop: `1px solid ${C.border}`,
                      background: isException ? "#fffdf7" : "transparent",
                    }}
                  >
                    <td style={{ padding: "11px 10px 11px 0" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 9, height: 9, borderRadius: 999, background: d.dot }} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{d.label}</span>
                        {isException ? (
                          <Pill style={{ background: "#fef3c7", color: "#92400e", fontSize: 10.5 }}>
                            <AlertOctagon size={11} strokeWidth={2.4} /> exception path
                          </Pill>
                        ) : null}
                      </div>
                    </td>
                    {ACTION_STATES.map((s) => (
                      <td
                        key={s.key}
                        style={{
                          textAlign: "right",
                          padding: "11px 10px",
                          fontSize: 14,
                          fontWeight: row[s.key] ? 700 : 400,
                          color: row[s.key] ? C.ink : C.ink3,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {row[s.key] ? inr(row[s.key]) : "—"}
                      </td>
                    ))}
                    <td
                      style={{
                        textAlign: "right",
                        padding: "11px 0 11px 10px",
                        fontSize: 14,
                        fontWeight: 800,
                        color: C.ink,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {inr(rowTotal)}
                    </td>
                  </tr>
                );
              })}
              <tr style={{ borderTop: `2px solid ${C.borderStrong}` }}>
                <td
                  style={{
                    padding: "11px 10px 4px 0",
                    fontSize: 12,
                    fontWeight: 800,
                    color: C.ink3,
                    textTransform: "uppercase",
                    letterSpacing: 0.3,
                  }}
                >
                  Total
                </td>
                {ACTION_STATES.map((s) => (
                  <td
                    key={s.key}
                    style={{
                      textAlign: "right",
                      padding: "11px 10px 4px",
                      fontSize: 14,
                      fontWeight: 800,
                      color: C.ink,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {inr(totals[s.key])}
                  </td>
                ))}
                <td
                  style={{
                    textAlign: "right",
                    padding: "11px 0 4px 10px",
                    fontSize: 15,
                    fontWeight: 800,
                    color: C.accent,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {inr(grandTotal)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}

/* ======================================================== closing the loop */
function LoopClosure({ range }: { range: RangeKey }) {
  const { loop, waiting, heldForReview } = DATA[range];
  const waitingTotal = waiting.reduce((a, r) => a + r.count, 0);

  return (
    <Card accent="#7c3aed" style={{ marginBottom: 20 }}>
      <div style={{ padding: "14px 18px 18px" }}>
        <SectionHead
          title="Case pendency by resolution state"
          sub="Unresolved Sentinel cases · what each one is waiting on"
          src={SOURCE.loop}
          right={
            <Pill style={{ background: STATE.warnBg, color: STATE.warn, border: `1px solid ${STATE.warnBd}` }}>
              <AlertOctagon size={12} strokeWidth={2.4} />
              {inr(heldForReview)} for consultant review
            </Pill>
          }
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(215px, 1fr))",
            gap: 12,
            marginBottom: 16,
          }}
        >
          {loop.map((r) => {
            const { col, bg, bd } = toneColors(r.tone);
            return (
              <div key={r.key} style={{ background: bg, border: `1px solid ${bd}`, borderRadius: 10, padding: "13px 14px 14px" }}>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 800,
                    color: col,
                    letterSpacing: -0.8,
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: 1.1,
                  }}
                >
                  {inr(r.count)}
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: C.ink, marginTop: 5, lineHeight: 1.35 }}>{r.label}</div>
                <div style={{ fontSize: 11, color: C.ink3, marginTop: 4, lineHeight: 1.4 }}>{r.note}</div>
              </div>
            );
          })}
        </div>

        {/* how long they have been waiting */}
        <div style={{ background: C.panelAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: "13px 15px 14px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 11 }}>
            <span style={{ fontSize: 11, letterSpacing: 0.4, textTransform: "uppercase", fontWeight: 800, color: C.ink3 }}>
              Ageing since case creation
            </span>
            <span style={{ fontSize: 11.5, color: C.ink3 }}>of the {inr(waitingTotal)} awaiting consultant action</span>
          </div>

          <div style={{ display: "flex", gap: 3, marginBottom: 10 }}>
            {waiting.map((w) => {
              const { col } = toneColors(w.tone);
              return <div key={w.label} title={w.label} style={{ flex: w.count, height: 9, background: col, borderRadius: 3 }} />;
            })}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
            {waiting.map((w) => {
              const { col } = toneColors(w.tone);
              return (
                <div key={w.label} style={{ display: "flex", alignItems: "baseline", gap: 7 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 999, background: col }} />
                  <span style={{ fontSize: 12.5, color: C.ink2, fontWeight: 600 }}>{w.label}</span>
                  <span style={{ fontSize: 13.5, fontWeight: 800, color: col, fontVariantNumeric: "tabular-nums" }}>
                    {inr(w.count)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ========================================================= failure patterns */
function Patterns({ range }: { range: RangeKey }) {
  const [sel, setSel] = useState(1);
  const exposure = DATA[range].patternExposure;
  const active = PATTERNS.find((p) => p.rank === sel) || PATTERNS[0];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0,1.5fr) minmax(0,1fr)",
        gap: 12,
        marginBottom: 20,
      }}
    >
      <Card accent="#0d9488">
        <div style={{ padding: "14px 18px 16px" }}>
          <SectionHead
            title="Failure modes building across the network"
            sub="Ranked by shipments exposed · compared against each slice’s own normal"
            src={SOURCE.patterns}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {PATTERNS.map((p) => {
              const on = p.rank === sel;
              return (
                <button
                  key={p.rank}
                  type="button"
                  onClick={() => setSel(p.rank)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    width: "100%",
                    textAlign: "left",
                    cursor: "pointer",
                    padding: "11px 12px",
                    borderRadius: 9,
                    border: `1px solid ${on ? "#c7cbfb" : "transparent"}`,
                    background: on ? C.accentSoft : "transparent",
                    transition: "all .12s",
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 800, color: on ? C.accent : C.ink3, minWidth: 22 }}>#{p.rank}</span>
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: C.ink, lineHeight: 1.4 }}>{p.title}</span>
                  <Pill
                    style={{
                      background: p.trend === "up" ? STATE.badBg : C.appBg,
                      color: p.trend === "up" ? STATE.bad : C.ink2,
                      border: `1px solid ${p.trend === "up" ? STATE.badBd : C.border}`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Layers size={11} strokeWidth={2.4} />
                    {exposure[p.rank - 1]}
                  </Pill>
                  <ChevronRight size={15} style={{ color: on ? C.accent : C.ink3 }} />
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      <Card accent="#0d9488">
        <div style={{ padding: "14px 18px 16px" }}>
          <SectionHead title="Where it concentrates" sub={`#${active.rank} · ${active.title}`} />
          <div style={{ display: "flex", flexDirection: "column", gap: 13, marginTop: 4 }}>
            {active.slices.map((s) => {
              const { col } = toneColors(s.tone);
              return (
                <div key={s.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: col }}>{s.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: col, fontVariantNumeric: "tabular-nums" }}>{s.pct}%</span>
                  </div>
                  <div style={{ height: 7, background: C.appBg, borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ width: `${s.pct}%`, height: "100%", background: col, borderRadius: 999 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ================================================================ main view */
export type ControlTowerLeadershipProps = {
  onExit?: () => void;
};

export function ControlTowerLeadership({ onExit }: ControlTowerLeadershipProps) {
  const [range, setRange] = useState<RangeKey>("30D");

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, system-ui, sans-serif",
        background: C.appBg,
        color: C.ink,
        minHeight: "100vh",
      }}
    >
      <header
        style={{
          height: 58,
          background: C.panel,
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "0 20px",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        {onExit ? (
          <button
            type="button"
            onClick={onExit}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              border: `1px solid ${C.border}`,
              background: C.appBg,
              color: C.ink2,
              borderRadius: 8,
              padding: "6px 10px",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            <ArrowLeft size={14} strokeWidth={2.4} />
            Roles
          </button>
        ) : null}

        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: `linear-gradient(135deg,${C.accent},#7c3aed)`,
              display: "grid",
              placeItems: "center",
            }}
          >
            <Radio size={16} color="#fff" strokeWidth={2.6} />
          </div>
          <div>
            <div style={{ fontSize: 14.5, fontWeight: 800, letterSpacing: -0.2 }}>LiSN · Forward-delivery control tower</div>
            <div style={{ fontSize: 11, color: C.ink3, fontWeight: 600, marginTop: -1 }}>CX leadership</div>
          </div>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 11.5, color: C.ink3, fontWeight: 600 }}>Refreshed 09:10 · next cycle ~09:40</span>
          <div style={{ display: "flex", gap: 3, background: C.appBg, padding: 3, borderRadius: 9, border: `1px solid ${C.border}` }}>
            {(["7D", "30D", "90D"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                style={{
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "5px 12px",
                  borderRadius: 7,
                  border: "none",
                  background: range === r ? C.accent : "transparent",
                  color: range === r ? "#fff" : C.ink2,
                  transition: "all .12s",
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main style={{ padding: "20px 20px 32px", maxWidth: 1560, margin: "0 auto" }}>
        <TodayBar range={range} />
        <DispositionGrid range={range} />
        <LoopClosure range={range} />
        <Patterns range={range} />
      </main>
    </div>
  );
}

export default ControlTowerLeadership;
