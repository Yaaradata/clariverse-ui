"use client";

import React, { useEffect, useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronRight,
  ChevronDown,
  X,
  Star,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  MapPin,
} from "lucide-react";
import type { AnxietyFreshKey, AnxietyPeriodData, AnxietyStateKey, QuadCellId } from "../../lib/cxHeadRetailV3AnxietyData";
import { ANXIETY_NODE_DRILL, ANXIETY_QUAD_CELLS, type AnxietyNodeDrillTab } from "../../lib/cxHeadRetailV3AnxietyData";
import { cssVar, radius } from "../../theme/tokens";

const nf = new Intl.NumberFormat("en-IN");
export const anxietyFmt = (n: number): string => nf.format(Math.round(n));

export const ANXIETY_STATE_META: Record<
  AnxietyStateKey,
  { label: string; color: string; tint: string }
> = {
  strong: { label: "Strong", color: cssVar("positive"), tint: `${cssVar("positive")}18` },
  shift: { label: "Shifting", color: cssVar("severity-med"), tint: `${cssVar("severity-med")}18` },
  break: { label: "Breaking", color: cssVar("severity-high"), tint: `${cssVar("severity-high")}18` },
  info: { label: "Watch", color: cssVar("accent"), tint: cssVar("accent-soft") },
};

export function anxietyBandColor(band: string): string {
  if (band === "High" || band === "Critical") return cssVar("severity-high");
  if (band === "Building") return cssVar("severity-med");
  return cssVar("positive");
}

export function InferenceBadge({ conf, small = false }: { conf: number; small?: boolean }): React.ReactElement {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: small ? 10 : 11,
        fontWeight: 700,
        fontFamily: cssVar("font-numeric"),
        borderRadius: radius.pill,
        padding: small ? "1px 6px" : "3px 8px",
        background: cssVar("accent-soft"),
        color: cssVar("accent-2"),
        border: `1px solid ${cssVar("accent")}44`,
      }}
    >
      <Sparkles size={small ? 10 : 11} strokeWidth={2.4} />
      {conf}%
    </span>
  );
}

export function KnowledgeTag({ small = false }: { small?: boolean }): React.ReactElement {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: small ? 10 : 11,
        fontWeight: 600,
        borderRadius: radius.pill,
        padding: small ? "1px 6px" : "3px 8px",
        background: cssVar("surface-raised"),
        color: cssVar("text-secondary"),
        border: `1px solid ${cssVar("border")}`,
      }}
    >
      <CheckCircle2 size={small ? 10 : 11} strokeWidth={2} />
      measured
    </span>
  );
}

export const INNER_KPI_STRIP_MIN_HEIGHT = 72;
export const INNER_KPI_LABEL_MIN_HEIGHT = 20;
export const INNER_KPI_VALUE_MIN_HEIGHT = 16;
export const INNER_KPI_HINT_MIN_HEIGHT = 14;

export const innerKpiValueStyle = {
  fontSize: 14,
  fontWeight: 700,
  lineHeight: 1.2,
  width: "100%",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
} as const;

export function InnerKpiCard({
  label,
  accent,
  hint,
  children,
}: {
  label: string;
  accent: string;
  hint?: string;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div
      style={{
        padding: "8px 10px",
        borderRadius: radius.sm,
        background: `linear-gradient(145deg, ${accent}28, ${accent}0a)`,
        border: `1px solid ${accent}55`,
        boxShadow: `0 4px 12px ${accent}12`,
        minWidth: 0,
        width: "100%",
        height: "100%",
        minHeight: INNER_KPI_STRIP_MIN_HEIGHT,
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 2,
          background: accent,
        }}
      />
      <div
        style={{
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: 0.4,
          textTransform: "uppercase",
          color: accent,
          marginBottom: 2,
          lineHeight: 1.2,
          minHeight: INNER_KPI_LABEL_MIN_HEIGHT,
          display: "flex",
          alignItems: "flex-start",
          gap: 4,
        }}
      >
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: accent,
            flexShrink: 0,
            marginTop: 2,
          }}
        />
        <span style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {label}
        </span>
      </div>
      <div
        style={{
          minHeight: INNER_KPI_VALUE_MIN_HEIGHT,
          display: "flex",
          alignItems: "flex-start",
          lineHeight: 1.1,
          flexShrink: 0,
        }}
      >
        {children}
      </div>
      <div
        style={{
          marginTop: "auto",
          minHeight: INNER_KPI_HINT_MIN_HEIGHT,
          fontSize: 9,
          fontWeight: 600,
          color: accent,
          opacity: hint ? 0.9 : 0,
          lineHeight: 1.25,
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        {hint ?? "\u00a0"}
      </div>
    </div>
  );
}

export function StatePill({ state }: { state: AnxietyStateKey }): React.ReactElement {
  const m = ANXIETY_STATE_META[state];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 11,
        fontWeight: 700,
        borderRadius: radius.pill,
        padding: "3px 9px",
        color: m.color,
        background: m.tint,
        border: `1px solid ${m.color}44`,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: m.color }} />
      {m.label}
    </span>
  );
}

export function Delta({
  v,
  unit = "",
  invert = false,
  size = 12,
}: {
  v: number;
  unit?: string;
  invert?: boolean;
  size?: number;
}): React.ReactElement {
  const good = invert ? v < 0 : v > 0;
  const up = v > 0;
  const color = v === 0 ? cssVar("text-muted") : good ? cssVar("positive") : cssVar("severity-high");
  const Icon = up ? ArrowUp : ArrowDown;
  return (
    <span
      style={{
        color,
        fontSize: size,
        display: "inline-flex",
        alignItems: "center",
        gap: 2,
        fontWeight: 600,
        fontFamily: cssVar("font-numeric"),
      }}
    >
      <Icon size={size} strokeWidth={2.5} />
      {Math.abs(v)}
      {unit}
    </span>
  );
}

export function StarFlag(): React.ReactElement {
  return (
    <span title="Integration-dependent — pending Flipkart data access">
      <Star size={11} fill={cssVar("severity-med")} color={cssVar("severity-med")} />
    </span>
  );
}

export function AnxietyCard({
  children,
  style,
  primary = false,
  pad = 18,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  primary?: boolean;
  pad?: number;
}): React.ReactElement {
  return (
    <div
      style={{
        background: primary
          ? `linear-gradient(165deg, ${cssVar("surface")} 0%, ${cssVar("surface-raised")} 100%)`
          : cssVar("surface"),
        border: `1px solid ${primary ? cssVar("border-strong") : cssVar("border")}`,
        borderRadius: radius.lg,
        padding: pad,
        boxShadow: primary ? cssVar("shadow-card") : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function TrackBar({
  pct,
  color,
  height = 8,
}: {
  pct: number;
  color: string;
  height?: number;
}): React.ReactElement {
  return (
    <div
      style={{
        height,
        borderRadius: radius.pill,
        background: cssVar("surface-raised"),
        border: `1px solid ${cssVar("border")}`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${Math.min(100, Math.max(0, pct))}%`,
          background: color,
          borderRadius: radius.pill,
          transition: "width 0.4s ease",
        }}
      />
    </div>
  );
}

export function Dial({
  value,
  color,
  size = 128,
  stroke = 11,
  unit = "",
  label,
}: {
  value: number;
  color: string;
  size?: number;
  stroke?: number;
  unit?: string;
  label?: string;
}): React.ReactElement {
  const r = size / 2 - stroke / 2 - 2;
  const c = size / 2;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size}>
        <circle cx={c} cy={c} r={r} fill="none" stroke={cssVar("border")} strokeWidth={stroke} />
        <circle
          cx={c}
          cy={c}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={`${Math.max(0, Math.min(100, value))} 100`}
          transform={`rotate(-90 ${c} ${c})`}
          style={{ transition: "stroke-dasharray 0.6s cubic-bezier(.4,0,.2,1)" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: size * 0.28,
            fontWeight: 600,
            lineHeight: 1,
            color: cssVar("text-primary"),
            fontFamily: cssVar("font-numeric"),
          }}
        >
          {value}
          <span style={{ fontSize: size * 0.13, color: cssVar("text-secondary") }}>{unit}</span>
        </div>
        {label ? (
          <div
            style={{
              fontSize: 10,
              color: cssVar("text-muted"),
              marginTop: 4,
              letterSpacing: 0.3,
              textTransform: "uppercase",
            }}
          >
            {label}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function Sparkline({
  data,
  color,
  w = 132,
  h = 38,
}: {
  data: readonly number[];
  color: string;
  w?: number;
  h?: number;
}): React.ReactElement {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const rng = max - min || 1;
  const pts = data.map((d, i) => [
    (i / (data.length - 1)) * (w - 6) + 3,
    h - 5 - ((d - min) / rng) * (h - 12),
  ]);
  const line = pts.map((p) => p.join(",")).join(" ");
  const area = `3,${h - 3} ${line} ${w - 3},${h - 3}`;
  const last = pts[pts.length - 1];
  const gid = `spg-${color.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${gid})`} />
      <polyline
        points={line}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={last[0]} cy={last[1]} r="3" fill={color} />
    </svg>
  );
}

export function BaselineBars({
  rows,
  max,
  color,
  unit = "",
}: {
  rows: { k: string; v: number; c?: string }[];
  max?: number;
  color: string;
  unit?: string;
}): React.ReactElement {
  const m = max ?? Math.max(...rows.map((r) => r.v));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
      {rows.map((r) => (
        <div
          key={r.k}
          style={{
            display: "grid",
            gridTemplateColumns: "108px 1fr 62px",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span style={{ fontSize: 12, color: cssVar("text-secondary") }}>{r.k}</span>
          <TrackBar pct={(r.v / m) * 100} color={r.c ?? color} />
          <span
            style={{
              fontSize: 12,
              textAlign: "right",
              color: cssVar("text-primary"),
              fontFamily: cssVar("font-numeric"),
            }}
          >
            {anxietyFmt(r.v)}
            {unit}
          </span>
        </div>
      ))}
    </div>
  );
}

export function Funnel({
  flagged,
  notified,
  avoided,
}: {
  flagged: number;
  notified: number;
  avoided: number;
}): React.ReactElement {
  const stages = [
    { k: "Flagged", v: flagged, c: cssVar("severity-med") },
    { k: "Notified", v: notified, c: cssVar("accent") },
    { k: "Contact avoided", v: avoided, c: cssVar("positive") },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {stages.map((s, i) => (
        <div key={s.k}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: cssVar("text-secondary") }}>{s.k}</span>
            <span style={{ fontSize: 12, color: cssVar("text-primary"), fontFamily: cssVar("font-numeric") }}>
              {anxietyFmt(s.v)}
            </span>
          </div>
          <TrackBar pct={(s.v / flagged) * 100} color={s.c} height={10} />
          {i < stages.length - 1 ? (
            <div
              style={{
                fontSize: 10,
                color: cssVar("text-muted"),
                marginTop: 3,
                textAlign: "right",
                fontFamily: cssVar("font-numeric"),
              }}
            >
              → {Math.round((stages[i + 1].v / s.v) * 100)}% kept
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function ContribBar({
  label,
  pct,
  color = cssVar("accent"),
  labelColor,
  pctColor,
}: {
  label: string;
  pct: number;
  color?: string;
  labelColor?: string;
  pctColor?: string;
}): React.ReactElement {
  const accent = color;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 44px", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: labelColor ?? cssVar("text-secondary") }}>{label}</span>
      <TrackBar pct={pct} color={accent} />
      <span
        className="lisn-num"
        style={{
          fontSize: 12,
          fontWeight: 700,
          textAlign: "right",
          color: pctColor ?? accent,
          fontFamily: cssVar("font-numeric"),
        }}
      >
        {pct}%
      </span>
    </div>
  );
}

export function SLATimer({ seconds }: { seconds: number }): React.ReactElement {
  const [t, setT] = useState(seconds);
  useEffect(() => {
    setT(seconds);
  }, [seconds]);
  useEffect(() => {
    const id = setInterval(() => setT((x) => (x <= 0 ? 0 : x - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const over = t <= 0;
  const urgent = t > 0 && t < 600;
  const warn = t >= 600 && t < 1500;
  const color =
    over || urgent ? cssVar("severity-high") : warn ? cssVar("severity-med") : cssVar("positive");
  const mm = String(Math.floor(t / 60)).padStart(2, "0");
  const ss = String(t % 60).padStart(2, "0");
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 11,
        fontWeight: 700,
        fontFamily: cssVar("font-numeric"),
        color,
        border: `1px solid ${color}44`,
        background: `${color}18`,
        borderRadius: radius.pill,
        padding: "3px 8px",
        animation: urgent && !over ? "pulse 1.2s ease infinite" : undefined,
      }}
    >
      <Clock size={12} strokeWidth={2} />
      {over ? "OVERDUE" : `${mm}:${ss}`}
    </span>
  );
}

export function Quadrant({
  data,
  active,
  onCell,
}: {
  data: Record<QuadCellId, number>;
  active: QuadCellId;
  onCell: (id: QuadCellId) => void;
}): React.ReactElement {
  const S = 300;
  const pad = 34;
  const inner = S - pad * 2;
  const maxV = Math.max(...Object.values(data));
  const cells: { id: QuadCellId; cx: number; cy: number }[] = [
    { id: "bh", cx: pad + inner * 0.75, cy: pad + inner * 0.25 },
    { id: "mh", cx: pad + inner * 0.75, cy: pad + inner * 0.75 },
    { id: "bl", cx: pad + inner * 0.25, cy: pad + inner * 0.25 },
    { id: "ml", cx: pad + inner * 0.25, cy: pad + inner * 0.75 },
  ];
  const toneColor = (t: AnxietyStateKey) => ANXIETY_STATE_META[t].color;
  return (
    <svg width="100%" viewBox={`0 0 ${S} ${S}`} style={{ display: "block" }}>
      {cells.map((c) => {
        const meta = ANXIETY_QUAD_CELLS[c.id];
        const isA = active === c.id;
        const qx = c.cx < S / 2 ? pad : S / 2;
        const qy = c.cy < S / 2 ? pad : S / 2;
        return (
          <g key={c.id} style={{ cursor: "pointer" }} onClick={() => onCell(c.id)}>
            <rect
              x={qx}
              y={qy}
              width={inner / 2}
              height={inner / 2}
              fill={toneColor(meta.tone)}
              opacity={isA ? 0.16 : 0.05}
              stroke={isA ? toneColor(meta.tone) : "transparent"}
              strokeWidth="1.5"
              rx="4"
            />
          </g>
        );
      })}
      <line x1={S / 2} y1={pad} x2={S / 2} y2={S - pad} stroke={cssVar("border-strong")} strokeWidth="1" />
      <line x1={pad} y1={S / 2} x2={S - pad} y2={S / 2} stroke={cssVar("border-strong")} strokeWidth="1" />
      {cells.map((c) => {
        const v = data[c.id];
        const meta = ANXIETY_QUAD_CELLS[c.id];
        const r = 14 + Math.sqrt(v / maxV) * 30;
        return (
          <g key={`b-${c.id}`} style={{ cursor: "pointer" }} onClick={() => onCell(c.id)}>
            <circle
              cx={c.cx}
              cy={c.cy}
              r={r}
              fill={toneColor(meta.tone)}
              opacity={active === c.id ? 0.9 : 0.62}
              stroke={toneColor(meta.tone)}
              strokeWidth="1.5"
            />
            <text
              x={c.cx}
              y={c.cy + 4}
              textAnchor="middle"
              fontSize="12"
              fontFamily={cssVar("font-numeric")}
              fontWeight="600"
              fill={cssVar("text-primary")}
            >
              {anxietyFmt(v)}
            </text>
          </g>
        );
      })}
      <text x={pad} y={pad - 12} fontSize="10" fill={cssVar("text-muted")} fontWeight="600">
        RELIABILITY BREACHED ↑
      </text>
      <text x={pad} y={S - 12} fontSize="10" fill={cssVar("text-muted")} fontWeight="600">
        RELIABILITY MET ↓
      </text>
      <text x={S - pad} y={S - 12} fontSize="10" fill={cssVar("text-muted")} fontWeight="600" textAnchor="end">
        ANXIETY HIGH →
      </text>
    </svg>
  );
}

export function SegButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        fontSize: 12,
        fontWeight: active ? 700 : 500,
        padding: "6px 12px",
        borderRadius: radius.md,
        border: `1px solid ${active ? cssVar("accent") : cssVar("border")}`,
        background: active ? cssVar("accent-soft") : "transparent",
        color: active ? cssVar("text-primary") : cssVar("text-secondary"),
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

export function AnxietyToastStack({ items }: { items: { id: number; msg: string }[] }): React.ReactElement {
  if (items.length === 0) return <></>;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        zIndex: 9999,
      }}
    >
      {items.map((t) => (
        <div
          key={t.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 14px",
            borderRadius: radius.lg,
            background: cssVar("surface-raised"),
            border: `1px solid ${cssVar("border-strong")}`,
            boxShadow: cssVar("shadow-pop"),
            fontSize: 13,
            color: cssVar("text-primary"),
          }}
        >
          <CheckCircle2 size={15} color={cssVar("positive")} />
          {t.msg}
        </div>
      ))}
    </div>
  );
}

export function NodeDrillModal({
  node,
  count,
  onClose,
}: {
  node: string;
  count: number;
  onClose: () => void;
}): React.ReactElement {
  const [tab, setTab] = useState<AnxietyNodeDrillTab>("pin");
  const dd = ANXIETY_NODE_DRILL[node] ?? ANXIETY_NODE_DRILL["Last-mile"];
  const rows = dd[tab];
  const tabs: [AnxietyNodeDrillTab, string][] = [
    ["pin", "PIN code"],
    ["category", "Category"],
    ["market", "Marketplace vs Flipkart"],
  ];

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        zIndex: 8000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        role="dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 560,
          background: cssVar("surface"),
          border: `1px solid ${cssVar("border-strong")}`,
          borderRadius: radius.xl,
          padding: "20px 22px",
          boxShadow: cssVar("shadow-pop"),
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: cssVar("text-primary") }}>
              {node} · anxiety drill
            </div>
            <div style={{ fontSize: 12, color: cssVar("text-secondary"), marginTop: 2 }}>
              <span style={{ fontFamily: cssVar("font-numeric") }}>{anxietyFmt(count)}</span> high-anxiety units ·
              by PIN / category / marketplace
            </div>
          </div>
          <button
            type="button"
            aria-label="Close drill"
            onClick={onClose}
            style={{
              border: `1px solid ${cssVar("border")}`,
              background: "transparent",
              borderRadius: radius.md,
              padding: 6,
              cursor: "pointer",
              color: cssVar("text-secondary"),
            }}
          >
            <X size={16} />
          </button>
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
          {tabs.map(([k, l]) => (
            <SegButton key={k} active={tab === k} onClick={() => setTab(k)}>
              {l}
            </SegButton>
          ))}
        </div>
        <div style={{ marginTop: 14 }}>
          <BaselineBars rows={rows.map((r) => ({ k: r[0], v: r[1] }))} color={cssVar("severity-high")} />
        </div>
        <div
          style={{
            marginTop: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 12, color: cssVar("text-muted") }}>
            Deeper than this routes to CX-Ops.
          </span>
          <SegButton active={false} onClick={onClose}>
            Close
          </SegButton>
        </div>
      </div>
    </div>
  );
}

export function GeoHeat({
  high,
  regions,
}: {
  high: number;
  regions: readonly {
    key: string;
    prop: number;
    hub: string;
    pos: { l: number; t: number };
  }[];
}): React.ReactElement {
  return (
    <div
      style={{
        position: "relative",
        height: 220,
        borderRadius: radius.lg,
        background: cssVar("surface-raised"),
        border: `1px solid ${cssVar("border")}`,
        marginTop: 8,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 12,
          fontSize: 10,
          fontWeight: 700,
          color: cssVar("text-muted"),
        }}
      >
        N
      </div>
      {regions.map((r) => {
        const v = Math.round(high * r.prop);
        const intensity = r.prop;
        const col =
          intensity > 0.4
            ? cssVar("severity-high")
            : intensity > 0.15
              ? cssVar("severity-med")
              : cssVar("accent");
        return (
          <div
            key={r.key}
            style={{
              position: "absolute",
              left: `${r.pos.l}%`,
              top: `${r.pos.t}%`,
              transform: "translate(-50%, -50%)",
              padding: "8px 10px",
              borderRadius: radius.md,
              border: `1px solid ${col}66`,
              background: `${col}1f`,
              minWidth: 72,
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: col,
                margin: "0 auto 4px",
                boxShadow: `0 0 0 4px ${col}22`,
              }}
            />
            <div style={{ fontSize: 11, fontWeight: 700, color: cssVar("text-primary") }}>{r.key}</div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: col,
                fontFamily: cssVar("font-numeric"),
              }}
            >
              {anxietyFmt(v)}
            </div>
            <div style={{ fontSize: 10, color: cssVar("text-muted") }}>{r.hub}</div>
          </div>
        );
      })}
    </div>
  );
}

export function AIBand({ d, fresh }: { d: AnxietyPeriodData; fresh: AnxietyFreshKey }): React.ReactElement {
  const stamp = fresh === "nrt" ? "as of ~45 min ago · hot plane" : "as of 06:00 IST · daily plane";
  const segStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 3,
    minWidth: 0,
  };
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr) auto",
        gap: 0,
        background: cssVar("surface-raised"),
        border: `1px solid ${cssVar("border")}`,
        borderRadius: radius.lg,
        overflow: "hidden",
      }}
    >
      {[
        { lab: "What's building", val: "Delivery-delay anxiety, last-mile" },
        {
          lab: "How bad",
          val: (
            <>
              <span style={{ fontFamily: cssVar("font-numeric") }}>{anxietyFmt(d.high)}</span> units High{" "}
              <InferenceBadge conf={d.conf} small />
            </>
          ),
        },
        { lab: "Who's affected", val: "East hubs — Kolkata, Patna, Ranchi" },
        {
          lab: (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: cssVar("accent-2") }}>
              <Sparkles size={12} /> AI · what to do next
            </span>
          ),
          val: `Fire containment in East now — anxiety cresting, contact window ~${d.ttContact} min.`,
          ai: true,
        },
      ].map((s, i) => (
        <div
          key={i}
          style={{
            padding: "14px 16px",
            borderRight: i < 3 ? `1px solid ${cssVar("border")}` : undefined,
            ...segStyle,
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: cssVar("text-muted"),
              textTransform: "uppercase",
              letterSpacing: 0.4,
            }}
          >
            {s.lab}
          </span>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: s.ai ? cssVar("accent-2") : cssVar("text-primary"),
              lineHeight: 1.45,
            }}
          >
            {s.val}
          </span>
        </div>
      ))}
      <div
        style={{
          padding: "14px 12px",
          fontSize: 10,
          color: cssVar("text-muted"),
          fontFamily: cssVar("font-numeric"),
          alignSelf: "center",
          whiteSpace: "nowrap",
        }}
      >
        {stamp}
      </div>
    </div>
  );
}

export function QCard({
  question,
  verdict,
  verdictState,
  kind,
  conf,
  star,
  action,
  onAction,
  primary,
  children,
}: {
  question: string;
  verdict: string;
  verdictState: AnxietyStateKey;
  kind: "inference" | "knowledge";
  conf?: number;
  star?: boolean;
  action?: string;
  onAction?: () => void;
  primary?: boolean;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <AnxietyCard primary={primary} style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: cssVar("text-primary"), lineHeight: 1.35 }}>
            {question}
          </span>
          {star ? <StarFlag /> : null}
        </div>
        <StatePill state={verdictState} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "5px 0 12px", flexWrap: "wrap" }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: cssVar("text-primary") }}>{verdict}</span>
        {kind === "inference" && conf !== undefined ? (
          <InferenceBadge conf={conf} small />
        ) : (
          <KnowledgeTag small />
        )}
      </div>
      <div style={{ flex: 1 }}>{children}</div>
      {action && onAction ? (
        <button
          type="button"
          onClick={onAction}
          style={{
            marginTop: 14,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            fontWeight: 700,
            padding: "8px 12px",
            borderRadius: radius.md,
            border: `1px solid ${cssVar("accent")}`,
            background: cssVar("accent-soft"),
            color: cssVar("accent-2"),
            cursor: "pointer",
            alignSelf: "flex-start",
          }}
        >
          {action} <ArrowRight size={14} />
        </button>
      ) : null}
    </AnxietyCard>
  );
}

export function TileHead({
  title,
  trailing,
}: {
  title: React.ReactNode;
  trailing?: React.ReactNode;
}): React.ReactElement {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 4 }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: cssVar("text-primary") }}>{title}</span>
      {trailing}
    </div>
  );
}

export function RelTag({ breached }: { breached: boolean }): React.ReactElement {
  const color = breached ? cssVar("severity-high") : cssVar("positive");
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 11,
        fontWeight: 600,
        color,
      }}
    >
      {breached ? <AlertTriangle size={11} /> : <CheckCircle2 size={11} />}
      {breached ? "Breached" : "Met"}
    </span>
  );
}

export function MiniBand({ band }: { band: string }): React.ReactElement {
  const color = anxietyBandColor(band);
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 0.3,
        color,
        border: `1px solid ${color}55`,
        background: `${color}18`,
        borderRadius: radius.pill,
        padding: "2px 7px",
      }}
    >
      {band}
    </span>
  );
}

export function IconBtn({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      style={{
        border: `1px solid ${cssVar("border")}`,
        background: "transparent",
        borderRadius: radius.md,
        padding: 4,
        cursor: "pointer",
        color: cssVar("text-secondary"),
        display: "inline-flex",
      }}
    >
      {children}
    </button>
  );
}

export function GhostBtn({
  onClick,
  children,
  small,
  disabled,
}: {
  onClick: () => void;
  children: React.ReactNode;
  small?: boolean;
  disabled?: boolean;
}): React.ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: small ? 11 : 12,
        fontWeight: 600,
        padding: small ? "5px 10px" : "7px 12px",
        borderRadius: radius.md,
        border: `1px solid ${cssVar("border")}`,
        background: "transparent",
        color: disabled ? cssVar("text-muted") : cssVar("text-secondary"),
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.72 : 1,
      }}
    >
      {children}
    </button>
  );
}

export function PrimaryBtn({
  onClick,
  children,
  tiny,
  disabled,
}: {
  onClick: () => void;
  children: React.ReactNode;
  tiny?: boolean;
  disabled?: boolean;
}): React.ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: tiny ? 11 : 12,
        fontWeight: 700,
        padding: tiny ? "5px 10px" : "7px 12px",
        borderRadius: radius.md,
        border: `1px solid ${disabled ? cssVar("positive") : cssVar("accent")}`,
        background: disabled ? `${cssVar("positive")}18` : cssVar("accent-soft"),
        color: disabled ? cssVar("positive") : cssVar("accent-2"),
        cursor: disabled ? "default" : "pointer",
        whiteSpace: "nowrap",
        opacity: disabled ? 0.92 : 1,
      }}
    >
      {children}
    </button>
  );
}
