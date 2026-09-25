"use client";

/**
 * LisN · HDFC demo — global components (B4 §2), built once and used on every /hdfc-v3 screen.
 * Visual language follows the Cards Portfolio v2 dashboard (dark canvas, inline styles, Outfit / JetBrains Mono)
 * Five colours, one meaning each, on every screen:
 *   red    critical / negative        amber  needs attention / rising
 *   green  good / improving           cyan   neutral data and public voice
 *   violet brand, insight, owners and internal (illustrative) data
 */

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { fmt, weekLabel } from "@/lib/hdfc-v3/format";
import type { Prov, StatusValue, Weekly } from "@/lib/hdfc-v3/types";

export const C = {
  bg: "#0d0d0d",
  surface: "#111112",
  card: "#0f0f10",
  cardAlt: "#151515",
  border: "#1f1f1f",
  borderLight: "#2f2f33",
  text: "#ffffff",
  textSec: "#d6d9d8",
  textMut: "#939394",
  textDim: "#7e7f80",
  track: "#1f1f1f",
  inner: "#2a2a2a",
  accent: "#f59e0b",
  accentSoft: "rgba(245,158,11,0.12)",
  green: "#22c55e",
  greenSoft: "rgba(34,197,94,0.12)",
  red: "#ef4444",
  redSoft: "rgba(239,68,68,0.12)",
  amber: "#f59e0b",
  cyan: "#38bdf8",
  violet: "#8b5cf6",
  brand: "#5332FF",
  brandSoft: "rgba(83,50,255,0.16)",
} as const;

export type Tone = "red" | "amber" | "green" | "cyan" | "violet";

export const TONE: Record<Tone, string> = {
  red: C.red,
  amber: C.amber,
  green: C.green,
  cyan: C.cyan,
  violet: C.violet,
};

/** Categories with no good/bad meaning (e.g. businesses in a stacked chart): shades of the neutral data colours only. */
export const SERIES = [
  "#7dd3fc",
  "#38bdf8",
  "#0284c7",
  "#c4b5fd",
  "#8b5cf6",
  "#6d28d9",
];

/** Higher share of negative voice reads hotter. */
export function negColor(share: number | null | undefined) {
  const s = share ?? 0;
  return s >= 70 ? C.red : s >= 40 ? C.amber : C.green;
}

export function tint(hex: string, a: number) {
  const n = Number.parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

export const MONO = "var(--mono), ui-monospace, monospace";

/** Two tiles side by side. Pair tiles of similar height: a row stretches to its tallest tile. */
/** Grid of at most `n` columns that drops to fewer once a column would be narrower than `min`. */
export function cols(n: number, min: number, gap: number): CSSProperties {
  const share = `calc((100% - ${(n - 1) * gap}px) / ${n})`;
  return {
    display: "grid",
    gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, max(${min}px, ${share})), 1fr))`,
    gap,
  };
}

export const PAIRS: CSSProperties = cols(2, 440, 14);

/** Two columns inside one full-width tile, so a long tile doesn't force its neighbour to stretch. */
export const SPLIT: CSSProperties = {
  ...cols(2, 420, 20),
  alignItems: "start",
};

export const SPLIT3: CSSProperties = {
  ...cols(3, 300, 20),
  alignItems: "start",
};

const PROV_LABEL: Record<Prov, string> = {
  public: "Public · live",
  internal: "Internal · illustrative until discovery",
  joined: "Joined · needs bank systems",
};

const PROV_TONE: Record<Prov, Tone> = {
  public: "cyan",
  internal: "violet",
  joined: "violet",
};

export function ProvenanceTag({
  kind,
  style,
}: {
  kind: Prov;
  style?: CSSProperties;
}) {
  const tone = TONE[PROV_TONE[kind]];
  return (
    <span
      data-testid="prov"
      data-prov={kind}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 12,
        color: tone,
        border: `1px solid ${tint(tone, 0.3)}`,
        borderRadius: 999,
        padding: "2px 10px",
        background: tint(tone, 0.08),
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      <span
        aria-hidden
        style={{
          width: 6,
          height: 6,
          borderRadius: 999,
          background: tone,
        }}
      />
      {PROV_LABEL[kind]}
    </span>
  );
}

const STATUS_LABEL: Record<StatusValue, string> = {
  needs_you: "Needs you today",
  this_week: "This week",
  watching: "Watching",
  routed: "Routed",
  improving: "Improving",
};

export const STATUS_TONE: Record<StatusValue, Tone> = {
  needs_you: "red",
  this_week: "amber",
  watching: "cyan",
  routed: "violet",
  improving: "green",
};

export function statusColor(value: StatusValue) {
  return TONE[STATUS_TONE[value]];
}

export function Status({ value }: { value: StatusValue }) {
  const tone = statusColor(value);
  return (
    <span
      data-status={value}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 12.5,
        fontWeight: 600,
        color: tone,
        background: tint(tone, 0.12),
        border: `1px solid ${tint(tone, 0.35)}`,
        borderRadius: 999,
        padding: "2px 10px",
        whiteSpace: "nowrap",
      }}
    >
      <span
        aria-hidden
        style={{
          width: 7,
          height: 7,
          borderRadius: 999,
          background: tone,
        }}
      />
      {STATUS_LABEL[value]}
    </span>
  );
}

function Chip({
  label,
  value,
  title,
  color,
}: {
  label: string;
  value: string;
  title?: string;
  color: string;
}) {
  return (
    <span
      title={title}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 12.5,
        color: C.textSec,
        border: `1px solid ${tint(color, 0.3)}`,
        borderRadius: 6,
        padding: "2px 8px",
        background: tint(color, 0.08),
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ color: C.textDim }}>{label}</span>
      <span style={{ fontWeight: 600, color }}>{value}</span>
    </span>
  );
}

/** Escalation ladder: the higher the rung, the hotter the colour. */
const RUNG_COLOR: Record<string, string> = {
  Voice: C.cyan,
  Repeat: C.amber,
  Grievance: C.amber,
  "MD's office": C.amber,
  IO: C.amber,
  "RBI Ombudsman": C.red,
  Public: C.red,
};

export function rungColor(rung: string) {
  return RUNG_COLOR[rung] ?? C.cyan;
}

export const OWNER_LABEL: Record<string, string> = {
  cx: "CX",
  digital: "Digital",
  cards: "Cards",
  retail: "Retail",
  loans: "Loans",
  payments: "Payments",
  fraud_cyber: "Fraud and Cyber",
  compliance: "Compliance",
  operations: "Operations",
  rm: "RM",
  product: "Product",
  policy_credit: "Policy and Credit",
};

export function OwnerChip({ owner }: { owner: string }) {
  return (
    <Chip label="Owner" value={OWNER_LABEL[owner] ?? owner} color={C.violet} />
  );
}

export function RungChip({ rung }: { rung: string }) {
  return (
    <Chip
      label="Rung"
      value={rung}
      color={rungColor(rung)}
      title="Voice · Repeat · Grievance · MD's office · IO · RBI Ombudsman · Public"
    />
  );
}

export function ActionChip({ action }: { action: string }) {
  return (
    <Chip
      label="Action"
      value={action}
      color={C.cyan}
      title="A recommendation, routed to the owner's system"
    />
  );
}

export function AnswerLine({
  children,
  sub,
}: {
  children: ReactNode;
  sub?: ReactNode;
}) {
  return (
    <div data-testid="answer" style={{ margin: "2px 0 4px" }}>
      <p
        style={{
          fontSize: 22,
          lineHeight: 1.35,
          fontWeight: 600,
          color: C.text,
          margin: 0,
          letterSpacing: "-0.01em",
        }}
      >
        {children}
      </p>
      {sub ? (
        <p
          style={{
            fontSize: 15,
            color: C.textSec,
            margin: "6px 0 0",
            lineHeight: 1.5,
          }}
        >
          {sub}
        </p>
      ) : null}
    </div>
  );
}

export function BaselineCaption({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontSize: 12.5,
        color: C.textMut,
        marginTop: 6,
        lineHeight: 1.45,
      }}
    >
      {children}
    </div>
  );
}

export function Tile({
  title,
  sub,
  prov,
  children,
  id,
  right,
  style,
  accent,
  tone,
}: {
  title?: ReactNode;
  sub?: ReactNode;
  prov: Prov | Prov[];
  children: ReactNode;
  id?: string;
  right?: ReactNode;
  style?: CSSProperties;
  accent?: boolean;
  tone?: Tone;
}) {
  const provs = Array.isArray(prov) ? prov : [prov];
  const color = TONE[tone ?? (accent ? "violet" : PROV_TONE[provs[0]])];
  return (
    <section
      id={id}
      data-testid="tile"
      style={{
        background: accent
          ? `linear-gradient(135deg, ${tint(color, 0.1)}, ${C.card} 60%)`
          : C.card,
        border: `1px solid ${tint(color, 0.22)}`,
        borderLeft: `3px solid ${color}`,
        borderRadius: 14,
        padding: "16px 18px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        minWidth: 0,
        scrollMarginTop: 90,
        boxShadow: `0 8px 32px ${tint(color, 0.06)}`,
        ...style,
      }}
    >
      {title || right ? (
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ minWidth: 0 }}>
            {title ? (
              <h2
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: C.text,
                  margin: 0,
                  lineHeight: 1.3,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    background: color,
                    boxShadow: `0 0 8px ${tint(color, 0.6)}`,
                    flexShrink: 0,
                  }}
                />
                {title}
              </h2>
            ) : null}
            {sub ? (
              <div
                style={{
                  fontSize: 13.5,
                  color: C.textMut,
                  marginTop: 3,
                  lineHeight: 1.45,
                }}
              >
                {sub}
              </div>
            ) : null}
          </div>
          {right}
        </header>
      ) : null}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {children}
      </div>
      <footer
        style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 2 }}
      >
        {provs.map((p) => (
          <ProvenanceTag key={p} kind={p} />
        ))}
      </footer>
    </section>
  );
}

export function Kpi({
  label,
  value,
  sub,
  href,
  tone,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  href?: string;
  tone?: Tone;
}) {
  const color = tone ? TONE[tone] : C.text;
  const body = (
    <>
      <div
        style={{
          fontSize: 12.5,
          color: C.textMut,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 800,
          color,
          fontFamily: MONO,
          lineHeight: 1.1,
          marginTop: 4,
        }}
      >
        {value}
      </div>
      {sub ? (
        <div
          style={{
            fontSize: 13,
            color: C.textSec,
            marginTop: 4,
            lineHeight: 1.4,
          }}
        >
          {sub}
        </div>
      ) : null}
    </>
  );
  const box: CSSProperties = {
    background: tone ? tint(color, 0.06) : C.cardAlt,
    border: `1px solid ${tone ? tint(color, 0.25) : C.border}`,
    borderRadius: 10,
    padding: "12px 14px",
    minWidth: 0,
    display: "block",
    textDecoration: "none",
  };
  return href ? (
    <Link href={href} style={box} data-kpi-link>
      {body}
    </Link>
  ) : (
    <div style={box}>{body}</div>
  );
}

export function NumLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      style={{
        color: "inherit",
        textDecoration: "underline",
        textDecorationColor: C.borderLight,
        textUnderlineOffset: 3,
      }}
    >
      {children}
    </Link>
  );
}

const tooltipStyle = {
  background: "rgba(12,12,14,0.96)",
  border: `1px solid ${C.borderLight}`,
  borderRadius: 8,
  fontSize: 12.5,
  color: C.text,
};

/** Weekly counts with labelled axes and a dashed average line (the within-window reference). */
export function WeeklyBars({
  data,
  height = 150,
  yLabel = "Items per week",
  highlightLast = false,
}: {
  data: Weekly[];
  height?: number;
  yLabel?: string;
  highlightLast?: boolean;
}) {
  const avg = data.length
    ? data.reduce((s, d) => s + d.count, 0) / data.length
    : 0;
  const rows = data.map((d) => ({ w: weekLabel(d.week), v: d.count }));
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={rows}
          margin={{ top: 8, right: 8, left: 0, bottom: 18 }}
        >
          <CartesianGrid stroke={C.border} vertical={false} />
          <XAxis
            dataKey="w"
            tick={{ fill: C.textMut, fontSize: 11 }}
            axisLine={{ stroke: C.border }}
            tickLine={false}
            label={{
              value: "Week starting",
              position: "insideBottom",
              offset: -12,
              fill: C.textDim,
              fontSize: 11,
            }}
          />
          <YAxis
            tick={{ fill: C.textMut, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={44}
            allowDecimals={false}
            label={{
              value: yLabel,
              angle: -90,
              position: "insideLeft",
              fill: C.textDim,
              fontSize: 11,
              dy: 40,
            }}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
            formatter={(v) => [fmt(Number(v)), "Items"]}
          />
          <ReferenceLine y={avg} stroke={C.textDim} strokeDasharray="4 4" />
          <Bar
            dataKey="v"
            radius={[4, 4, 0, 0]}
            fill={C.cyan}
            shape={(props: unknown) => {
              const p = props as {
                x: number;
                y: number;
                width: number;
                height: number;
                index: number;
              };
              const last = highlightLast && p.index === rows.length - 1;
              return (
                <rect
                  x={p.x}
                  y={p.y}
                  width={p.width}
                  height={p.height}
                  rx={3}
                  fill={C.cyan}
                  fillOpacity={last ? 1 : 0.6}
                />
              );
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** A labelled line chart (e.g. net sentiment by day or week) with a dashed reference line. */
export function TrendLine({
  data,
  xKey,
  yKey,
  reference,
  referenceLabel,
  height = 170,
  yLabel,
  xLabel,
  domain,
}: {
  data: Record<string, string | number | null>[];
  xKey: string;
  yKey: string;
  reference?: number;
  referenceLabel?: string;
  height?: number;
  yLabel: string;
  xLabel: string;
  domain?: [number, number];
}) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 8, right: 12, left: 0, bottom: 18 }}
        >
          <CartesianGrid stroke={C.border} vertical={false} />
          <XAxis
            dataKey={xKey}
            tick={{ fill: C.textMut, fontSize: 11 }}
            axisLine={{ stroke: C.border }}
            tickLine={false}
            minTickGap={18}
            label={{
              value: xLabel,
              position: "insideBottom",
              offset: -12,
              fill: C.textDim,
              fontSize: 11,
            }}
          />
          <YAxis
            tick={{ fill: C.textMut, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={44}
            domain={domain ?? ["auto", "auto"]}
            label={{
              value: yLabel,
              angle: -90,
              position: "insideLeft",
              fill: C.textDim,
              fontSize: 11,
              dy: 40,
            }}
          />
          <Tooltip contentStyle={tooltipStyle} />
          {reference !== undefined ? (
            <ReferenceLine
              y={reference}
              stroke={C.textDim}
              strokeDasharray="4 4"
              label={
                referenceLabel
                  ? {
                      value: referenceLabel,
                      fill: C.textMut,
                      fontSize: 11,
                      position: "insideTopRight",
                    }
                  : undefined
              }
            />
          ) : null}
          <Line
            type="monotone"
            dataKey={yKey}
            stroke={C.cyan}
            strokeWidth={2.4}
            dot={false}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Horizontal share bar: positive / neutral / negative, labelled in words as well as colour. */
export function SentimentBar({
  pos,
  neu,
  neg,
}: {
  pos: number;
  neu: number;
  neg: number;
}) {
  const total = pos + neu + neg || 1;
  const seg = (n: number) => `${(100 * n) / total}%`;
  return (
    <div>
      <div
        style={{
          display: "flex",
          height: 12,
          borderRadius: 6,
          overflow: "hidden",
          background: C.cardAlt,
        }}
      >
        <div style={{ width: seg(pos), background: C.green }} />
        <div style={{ width: seg(neu), background: "#4b5563" }} />
        <div style={{ width: seg(neg), background: C.red }} />
      </div>
      <div
        style={{
          display: "flex",
          gap: 12,
          fontSize: 12,
          color: C.textMut,
          marginTop: 4,
          flexWrap: "wrap",
        }}
      >
        <span style={{ color: C.green }}>
          Positive {Math.round((100 * pos) / total)}%
        </span>
        <span>Neutral {Math.round((100 * neu) / total)}%</span>
        <span style={{ color: C.red }}>
          Negative {Math.round((100 * neg) / total)}%
        </span>
      </div>
    </div>
  );
}

/** Simple proportional bar row used in ranked lists. */
export function BarRow({
  label,
  value,
  max,
  href,
  right,
  sub,
  color = C.cyan,
}: {
  label: ReactNode;
  value: number;
  max: number;
  href?: string;
  right?: ReactNode;
  sub?: ReactNode;
  color?: string;
}) {
  const inner = (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) auto",
        gap: 10,
        alignItems: "center",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 8,
            fontSize: 14,
            color: C.textSec,
          }}
        >
          <span style={{ minWidth: 0 }}>{label}</span>
        </div>
        <div
          style={{
            height: 8,
            borderRadius: 4,
            background: C.track,
            marginTop: 5,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${max ? Math.max(2, (100 * value) / max) : 0}%`,
              height: "100%",
              borderRadius: 4,
              background: `linear-gradient(90deg, ${tint(color, 0.55)}, ${color})`,
            }}
          />
        </div>
        {sub ? (
          <div style={{ fontSize: 12, color: C.textMut, marginTop: 4 }}>
            {sub}
          </div>
        ) : null}
      </div>
      <div
        style={{
          fontFamily: MONO,
          fontSize: 14,
          color,
          fontWeight: 700,
          textAlign: "right",
          minWidth: 44,
        }}
      >
        {right ?? fmt(value)}
      </div>
    </div>
  );
  return href ? (
    <Link
      href={href}
      style={{ textDecoration: "none", display: "block", padding: "4px 0" }}
    >
      {inner}
    </Link>
  ) : (
    <div style={{ padding: "4px 0" }}>{inner}</div>
  );
}

export function MutedNote({ children }: { children: ReactNode }) {
  return (
    <div style={{ fontSize: 13, color: C.textMut, lineHeight: 1.5 }}>
      {children}
    </div>
  );
}

export function Grid({
  cols = 2,
  children,
  gap = 14,
  min = 320,
}: {
  cols?: number;
  children: ReactNode;
  gap?: number;
  min?: number;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${min}px), 1fr))`,
        gap,
        alignItems: "stretch",
        ...(cols === 1 ? { gridTemplateColumns: "minmax(0, 1fr)" } : {}),
      }}
    >
      {children}
    </div>
  );
}

export function Table({
  head,
  rows,
  align,
}: {
  head: ReactNode[];
  rows: ReactNode[][];
  align?: ("left" | "right")[];
}) {
  return (
    <div
      style={{
        overflowX: "auto",
        border: `1px solid ${C.border}`,
        borderRadius: 10,
      }}
    >
      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}
      >
        <thead>
          <tr style={{ background: C.cardAlt }}>
            {head.map((h, i) => (
              <th
                // biome-ignore lint/suspicious/noArrayIndexKey: static header order
                key={i}
                style={{
                  textAlign: align?.[i] ?? "left",
                  padding: "8px 10px",
                  color: C.textMut,
                  fontWeight: 600,
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  verticalAlign: "bottom",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: rows are positional
            <tr key={ri} style={{ borderTop: `1px solid ${C.border}` }}>
              {r.map((c, ci) => (
                <td
                  // biome-ignore lint/suspicious/noArrayIndexKey: cells are positional
                  key={ci}
                  style={{
                    padding: "8px 10px",
                    color: C.textSec,
                    textAlign: align?.[ci] ?? "left",
                    verticalAlign: "top",
                  }}
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Half gauge (same anatomy as the credit-cards executive tile). Without a tone, higher reads greener. */
export function HalfGauge({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: number;
  sub: string;
  tone?: Tone;
}) {
  const v = Math.max(0, Math.min(100, value));
  const r = 34;
  const circ = Math.PI * r;
  const color = tone
    ? TONE[tone]
    : v >= 60
      ? C.green
      : v >= 40
        ? C.amber
        : C.red;
  return (
    <div style={{ textAlign: "center", minWidth: 0 }}>
      <svg
        width="100%"
        height="56"
        viewBox="0 0 84 48"
        role="img"
        aria-label={`${label} ${Math.round(v)}%`}
      >
        <path
          d="M8 44 A34 34 0 0 1 76 44"
          fill="none"
          stroke={C.inner}
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M8 44 A34 34 0 0 1 76 44"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${(circ * v) / 100} ${circ}`}
        />
        <text
          x="42"
          y="42"
          textAnchor="middle"
          fontSize="14"
          fontWeight="700"
          fill={color}
          fontFamily="JetBrains Mono, monospace"
        >
          {Math.round(v)}%
        </text>
      </svg>
      <div style={{ fontSize: 12.5, color: C.textSec, fontWeight: 600 }}>
        {label}
      </div>
      <div style={{ fontSize: 11.5, color: C.textMut }}>{sub}</div>
    </div>
  );
}
