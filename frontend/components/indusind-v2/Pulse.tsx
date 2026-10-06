"use client";

/**
 * The first scroll of the MD's office / Head of CX view (30 Sep review, changes_30sep.md A): the period filter, the
 * Customer pulse and the CX pulse. Every figure comes from periods.json for the selected period.
 */

import { ChevronDown, ChevronRight, ChevronUp, Info } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type PointerEvent, type ReactNode, useState } from "react";

import {
  fmt,
  fmtCompact,
  fmtDate,
  fmtPct,
  fmtSigned,
} from "@/lib/indusind-v2/format";
import {
  CHANNEL_LABEL,
  CHANNEL_ORDER,
  PERIOD_IDS,
  type Period,
  type PeriodId,
  type PeriodsFile,
  type PublicFigures,
  type PulseList,
  type SocialPost,
} from "@/lib/indusind-v2/periods";
import {
  C,
  MONO,
  MutedNote,
  ProvenanceTag,
  SERIES,
  Table,
  Tile,
  tint,
} from "./primitives";

/* ---------------------------------------------------------------- period */

export function usePeriod(file: PeriodsFile): Period {
  const sp = useSearchParams();
  const id = sp?.get("period") as PeriodId | null;
  return file.periods[id && PERIOD_IDS.includes(id) ? id : file.default];
}

/** "Last 7 days · 22 Sep 08:30 to 29 Sep 08:30" */
export function periodLabel(p: Period): string {
  const t = (iso: string) => `${fmtDate(iso)} ${iso.slice(11, 16)}`;
  return p.id === "all"
    ? `${p.label} · ${fmtDate(p.start)} to ${t(p.end)}`
    : `${p.label} · ${t(p.start)} to ${t(p.end)}`;
}

/** Link that keeps the selected period. */
export function withPeriod(href: string, p: Period): string {
  return `${href}${href.includes("?") ? "&" : "?"}period=${p.id}`;
}

export function PeriodFilter({
  file,
  current,
}: {
  file: PeriodsFile;
  current: Period;
}) {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  return (
    <div
      data-testid="period-filter"
      style={{
        display: "flex",
        gap: 8,
        alignItems: "center",
        flexWrap: "wrap",
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: "8px 12px",
      }}
    >
      <span style={{ fontSize: 13.5, color: C.textMut }}>Period:</span>
      {PERIOD_IDS.map((id) => {
        const on = id === current.id;
        return (
          <button
            key={id}
            type="button"
            aria-pressed={on}
            onClick={() =>
              router.replace(`${pathname}?period=${id}`, { scroll: false })
            }
            style={{
              padding: "4px 12px",
              borderRadius: 999,
              fontSize: 13.5,
              cursor: "pointer",
              color: on ? C.text : C.textSec,
              background: on ? C.brandSoft : "transparent",
              border: `1px solid ${on ? C.brand : C.border}`,
              fontWeight: on ? 700 : 500,
            }}
          >
            {file.periods[id].label}
          </button>
        );
      })}
      <span style={{ fontSize: 13, color: C.textMut, marginLeft: "auto" }}>
        {periodLabel(current)}. Data runs to {fmtDate(file.end)}{" "}
        {file.end.slice(11, 16)}.
      </span>
    </div>
  );
}

/** Compact period filter for the Shell header (buttons only; the range shows under the page title). */
export function HeaderPeriodFilter({ file }: { file: PeriodsFile }) {
  const current = usePeriod(file);
  const router = useRouter();
  const pathname = usePathname() ?? "";
  return (
    <div
      data-testid="period-filter"
      style={{
        display: "flex",
        gap: 4,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {PERIOD_IDS.map((id) => {
        const on = id === current.id;
        return (
          <button
            key={id}
            type="button"
            aria-pressed={on}
            title={periodLabel(file.periods[id])}
            onClick={() =>
              router.replace(`${pathname}?period=${id}`, { scroll: false })
            }
            style={{
              padding: "4px 11px",
              borderRadius: 999,
              fontSize: 13,
              cursor: "pointer",
              color: on ? C.text : C.textSec,
              background: on ? C.brandSoft : "transparent",
              border: `1px solid ${on ? C.brand : C.border}`,
              fontWeight: on ? 700 : 500,
              whiteSpace: "nowrap",
            }}
          >
            {file.periods[id].label}
          </button>
        );
      })}
    </div>
  );
}

export function titled(title: string, _p: Period): ReactNode {
  return title;
}

/* ---------------------------------------------------------------- visuals */

export function SmallRing({
  value,
  color,
  size = 64,
  centre,
  centreSize = 12,
}: {
  value: number | null;
  color: string;
  size?: number;
  centre?: string;
  centreSize?: number;
}) {
  const r = size / 2 - 6;
  const circ = 2 * Math.PI * r;
  const v = value === null ? 0 : Math.max(0, Math.min(100, value));
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={C.inner}
        strokeWidth="6"
      />
      {value === null ? null : (
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${(circ * v) / 100} ${circ}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      )}
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        style={{ fontSize: centreSize, fontWeight: 700, fill: C.text }}
      >
        {centre ?? (value === null ? "—" : `${Math.round(v)}%`)}
      </text>
    </svg>
  );
}

export function Sparkline({
  values,
  color,
  width = 90,
  height = 26,
  area,
  points,
  title,
}: {
  values: number[];
  color: string;
  width?: number;
  height?: number;
  /** A small chart rather than a bare line: filled under the line, on a baseline, with a dot on the latest value. */
  area?: boolean;
  /** With these, each point shows its window and figure on hover, focus or touch. */
  points?: TrendPoints;
  title?: string;
}) {
  const hover = useTrendHover(values.length);
  if (values.length < 2) return null;
  const max = Math.max(...values, 1);
  const xy = values.map(
    (v, i) =>
      [
        (i * (width - 4)) / (values.length - 1) + 2,
        height - 3 - ((height - 6) * v) / max,
      ] as const,
  );
  const pts = xy.map(([x, y]) => `${x},${y}`).join(" ");
  const last = xy[xy.length - 1];
  const svg = (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      style={{ maxWidth: "100%", height: "auto", display: "block" }}
    >
      {area ? (
        <>
          <polygon
            points={`2,${height - 2} ${pts} ${width - 2},${height - 2}`}
            fill={tint(color, 0.22)}
          />
          <line
            x1="2"
            x2={width - 2}
            y1={height - 2}
            y2={height - 2}
            stroke={C.borderLight}
            strokeWidth="1"
          />
        </>
      ) : null}
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth={area ? "1.4" : "1.8"}
        strokeLinejoin="round"
      />
      {area ? <circle cx={last[0]} cy={last[1]} r="2" fill={color} /> : null}
    </svg>
  );
  if (!points) return svg;
  const at = hover.at;
  return (
    <span
      data-testid="trend"
      {...hover.wrap}
      style={{
        position: "relative",
        display: "inline-block",
        lineHeight: 0,
        borderRadius: 4,
        outline: hover.focused ? `2px solid ${C.brandInk}` : "none",
        outlineOffset: 2,
      }}
    >
      {svg}
      <TrendScrub
        hover={hover}
        count={values.length}
        label={title ?? "Trend"}
        text={at === null ? "" : pointText(points, values, at)}
      />
      {at === null ? null : (
        <TrendTip
          x={(100 * xy[at][0]) / width}
          y={(100 * xy[at][1]) / height}
          color={color}
          when={`${points.span} ${fmtDate(points.ends[at])}`}
          what={pointFigure(points, values[at])}
        />
      )}
    </span>
  );
}

export function TrendChip({
  pct,
  label,
  compact,
}: {
  pct: number | null;
  label: string;
  compact?: boolean;
}) {
  if (pct === null)
    return (
      <span style={{ fontSize: 12, color: C.textMut }}>no earlier period</span>
    );
  const up = pct > 0;
  return (
    <span
      title={label}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        fontSize: 12,
        lineHeight: 1.3,
      }}
    >
      <span style={{ fontWeight: 700, color: C.textSec, whiteSpace: "nowrap" }}>
        {up ? "▲" : pct < 0 ? "▼" : "■"} {fmtSigned(pct)}
      </span>
      {compact ? null : (
        <span style={{ fontSize: 11, color: C.textMut }}>{label}</span>
      )}
    </span>
  );
}

/** A ring with its figure and label underneath. */
export function Dial({
  value,
  color,
  big,
  label,
  sub,
  centre,
}: {
  value: number | null;
  color: string;
  big: string;
  label: string;
  sub?: ReactNode;
  centre?: string;
}) {
  return (
    <div
      data-testid="dial"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        minWidth: 0,
        textAlign: "center",
      }}
    >
      <SmallRing value={value} color={color} centre={centre} />
      <div
        style={{
          fontFamily: MONO,
          // Bank-scale figures run to seven digits: a long figure steps down so it stays inside its column.
          fontSize:
            big.length > 9
              ? 12.5
              : big.length > 7
                ? 13.5
                : big.length > 6
                  ? 16.5
                  : 20,
          fontWeight: 750,
          whiteSpace: "nowrap",
        }}
      >
        {big}
      </div>
      <div
        style={{
          fontSize: 12,
          color: C.textMut,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </div>
      {sub ? (
        <div style={{ fontSize: 12.5, color: C.textSec, lineHeight: 1.35 }}>
          {sub}
        </div>
      ) : null}
    </div>
  );
}

const DIALS = (n: number) => ({
  display: "grid",
  gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
  gap: 8,
});

function share(a: number | null, b: number): number | null {
  return a === null || !b ? null : (100 * a) / b;
}

/* ---------------------------------------------------------------- customer pulse */

/** A count's change against the comparison window: direction, amount and what it is compared with. */
export function Delta({
  n,
  label,
  goodDown,
  compact,
}: {
  n: number | null;
  label: string;
  goodDown?: boolean;
  compact?: boolean;
}) {
  if (n === null) return <span style={{ color: C.textMut }}>{label}</span>;
  const color = n === 0 || !goodDown ? C.textSec : n > 0 ? C.red : C.green;
  return (
    <span data-testid="delta" title={label}>
      <strong style={{ color, whiteSpace: "nowrap" }}>
        {n > 0 ? "▲" : n < 0 ? "▼" : "■"} {n > 0 ? "+" : n < 0 ? "−" : ""}
        {fmt(Math.abs(n))}
      </strong>
      {compact ? null : (
        <>
          {" "}
          <span style={{ color: C.textMut }}>{label}</span>
        </>
      )}
    </span>
  );
}

/**
 * Colour rule (1 Oct): red, amber and green only where a direction is good or bad: no reply in 48h+, open counts and
 * negative share. Green when it got better (fell), red when it got worse (rose), amber within 10% either way or with
 * no earlier period. Volumes (contacts, mentions) and the informational response rate are always neutral.
 */
const TREND_BAND = 10;
const NEUTRAL = C.textSec;

function trendColor(change: number | null): string {
  if (change === null) return C.amber;
  return change <= -TREND_BAND
    ? C.green
    : change >= TREND_BAND
      ? C.red
      : C.amber;
}

/** The same rule for a count's change (any rise is worse, any fall is better). */
function deltaColor(delta: number | null): string {
  return trendColor(delta === null ? null : Math.sign(delta) * 100);
}

/** A series' change in %, on the period's own comparison: the two halves for the full window, else the last two points. */
function seriesChange(values: number[], whole: boolean): number | null {
  if (values.length < 2) return null;
  const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
  const half = Math.floor(values.length / 2);
  const before = whole ? sum(values.slice(0, half)) : values[values.length - 2];
  const after = whole
    ? sum(values.slice(values.length - half))
    : values[values.length - 1];
  if (!before) return after ? 100 : 0;
  return (100 * (after - before)) / before;
}

/** What one point of a trend covers, for its hover label: "Week to 21 Sep", "7 days to 21 Sep". */
export function spanOf(p: Period): string {
  return p.id === "all"
    ? "Week to"
    : p.id === "30d"
      ? "30 days to"
      : p.id === "7d"
        ? "7 days to"
        : "24 hours to";
}

export type TrendPoints = {
  /** The end of each point's window (ISO), in step with the values. */
  ends: string[];
  span: string;
  /** What the figure counts: "contacts", "mentions"; or starting with "%" for a rate ("%", "% negative"). */
  unit: string;
};

function pointFigure(points: TrendPoints, v: number): string {
  return points.unit.startsWith("%")
    ? `${fmt(v)}${points.unit}`
    : `${fmt(v)} ${points.unit}`;
}

function pointText(points: TrendPoints, values: number[], at: number) {
  return `${points.span} ${fmtDate(points.ends[at])}: ${pointFigure(points, values[at])}`;
}

/**
 * Which point of a trend is being read. Works with a mouse (hover), a keyboard (focus, then the arrow keys) and touch
 * (tap or drag): the keyboard and touch go through an invisible range input laid over the chart.
 */
function useTrendHover(count: number) {
  const [at, setAt] = useState<number | null>(null);
  const [focused, setFocused] = useState(false);
  const last = Math.max(count - 1, 0);
  const clamp = (i: number) => Math.max(0, Math.min(last, i));
  return {
    at: at === null ? null : clamp(at),
    focused,
    setAt: (i: number | null) => setAt(i === null ? null : clamp(i)),
    setFocused,
    wrap: {
      onPointerMove: (ev: PointerEvent<HTMLElement>) => {
        const box = ev.currentTarget.getBoundingClientRect();
        const f = (ev.clientX - box.left) / Math.max(box.width, 1);
        setAt(clamp(Math.round(f * last)));
      },
      onPointerLeave: (ev: PointerEvent<HTMLElement>) => {
        // A finger lifting keeps the label up until focus moves on; a mouse leaving clears it.
        if (ev.pointerType === "mouse" && !focused) setAt(null);
      },
    },
  };
}

/** The invisible range input over a chart: focusable, moved with the arrow keys or a finger, announced as text. */
function TrendScrub({
  hover,
  count,
  label,
  text,
}: {
  hover: ReturnType<typeof useTrendHover>;
  count: number;
  label: string;
  text: string;
}) {
  return (
    <input
      type="range"
      data-testid="trend-scrub"
      aria-label={label}
      aria-valuetext={text}
      min={0}
      max={Math.max(count - 1, 0)}
      step={1}
      value={hover.at ?? Math.max(count - 1, 0)}
      onChange={(ev) => hover.setAt(Number(ev.target.value))}
      onFocus={() => {
        hover.setFocused(true);
        hover.setAt(hover.at ?? count - 1);
      }}
      onBlur={() => {
        hover.setFocused(false);
        hover.setAt(null);
      }}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        margin: 0,
        opacity: 0,
        cursor: "crosshair",
        touchAction: "pan-y",
      }}
    />
  );
}

/** The highlighted dot and the label for the point being read. x and y are % of the chart box. */
function TrendTip({
  x,
  y,
  color,
  when,
  what,
}: {
  x: number;
  y: number;
  color: string;
  when: string;
  what: string;
}) {
  return (
    <>
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: `${x}%`,
          top: `${y}%`,
          width: 9,
          height: 9,
          borderRadius: 999,
          background: color,
          border: `2px solid ${C.card}`,
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      />
      <span
        data-testid="trend-tip"
        style={{
          position: "absolute",
          left: `${x}%`,
          top: `${y}%`,
          transform: `translate(${x > 60 ? "-100%" : x < 40 ? "0" : "-50%"}, calc(-100% - 10px))`,
          zIndex: 20,
          pointerEvents: "none",
          background: C.surface,
          border: `1px solid ${C.borderLight}`,
          borderRadius: 8,
          padding: "5px 9px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.28)",
          whiteSpace: "nowrap",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          textAlign: "left",
          lineHeight: 1.3,
        }}
      >
        <span style={{ fontSize: 11.5, color: C.textMut }}>{when}</span>
        <strong style={{ fontSize: 13, color: C.text }}>{what}</strong>
      </span>
    </>
  );
}

/**
 * A smooth filled trend, stretched to its box: the shape of a series, with no axis. Each point shows its window and
 * figure on hover, focus or touch.
 */
function AreaChart({
  id,
  values,
  color,
  height,
  title,
  testid,
  points,
}: {
  /** Unique on the page: names the gradient. Passed in, so the server and the browser render the same id. */
  id: string;
  values: number[];
  color: string;
  height: number | string;
  title: string;
  testid?: string;
  points: TrendPoints;
}) {
  const hover = useTrendHover(values.length);
  const W = 200;
  const H = 100;
  const max = Math.max(...values, 1);
  const n = Math.max(values.length - 1, 1);
  const pts = values.map(
    (v, i) => [(i * W) / n, H - 6 - ((H - 16) * v) / max] as const,
  );
  let line = pts.length ? `M ${pts[0][0]},${pts[0][1]}` : "";
  for (let i = 1; i < pts.length; i++) {
    const mx = (pts[i - 1][0] + pts[i][0]) / 2;
    line += ` C ${mx},${pts[i - 1][1]} ${mx},${pts[i][1]} ${pts[i][0]},${pts[i][1]}`;
  }
  const at = hover.at !== null && pts[hover.at] ? hover.at : null;
  return (
    <div
      data-testid={testid ?? "trend"}
      {...hover.wrap}
      // A chart told to fill its box is taken out of flow, so its own shape never sets the card's height.
      style={{
        ...(height === "100%"
          ? { position: "absolute" as const, inset: 0 }
          : {
              position: "relative" as const,
              width: "100%",
              height,
              minWidth: 0,
            }),
        borderRadius: 6,
        outline: hover.focused ? `2px solid ${C.brandInk}` : "none",
        outlineOffset: 2,
      }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <defs>
          <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.45" />
            <stop offset="100%" stopColor={color} stopOpacity="0.03" />
          </linearGradient>
        </defs>
        {pts.length > 1 ? (
          <>
            <path d={`${line} L ${W},${H} L 0,${H} Z`} fill={`url(#${id})`} />
            <path
              d={line}
              fill="none"
              stroke={color}
              strokeWidth="2.5"
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
            />
          </>
        ) : null}
      </svg>
      <TrendScrub
        hover={hover}
        count={values.length}
        label={title}
        text={at === null ? "" : pointText(points, values, at)}
      />
      {at === null ? null : (
        <TrendTip
          x={(100 * pts[at][0]) / W}
          y={(100 * pts[at][1]) / H}
          color={color}
          when={`${points.span} ${fmtDate(points.ends[at])}`}
          what={pointFigure(points, values[at])}
        />
      )}
    </div>
  );
}

/** A half-circle gauge with its figure in the centre, the label under it, then one line for the change. */
function ArcGauge({
  value,
  color,
  centre,
  label,
  children,
}: {
  value: number | null;
  color: string;
  centre: string;
  label: string;
  children?: ReactNode;
}) {
  const r = 34;
  const len = Math.PI * r;
  const v = Math.max(0, Math.min(100, value ?? 0));
  return (
    <div
      data-testid="dial"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        minWidth: 0,
        textAlign: "center",
      }}
    >
      <svg
        viewBox="0 0 84 48"
        aria-hidden="true"
        style={{ width: "100%", maxWidth: 92, display: "block" }}
      >
        <path
          d={`M 8 44 A ${r} ${r} 0 0 1 76 44`}
          fill="none"
          stroke={C.inner}
          strokeWidth="9"
          strokeLinecap="round"
        />
        {value === null ? null : (
          <path
            d={`M 8 44 A ${r} ${r} 0 0 1 76 44`}
            fill="none"
            stroke={color}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={`${Math.max((len * v) / 100, 0.01)} ${len}`}
          />
        )}
        <text
          x="42"
          y="42"
          textAnchor="middle"
          style={{
            fontFamily: MONO,
            fontSize: centre.length > 3 ? 13 : 16,
            fontWeight: 750,
            fill: color,
          }}
        >
          {centre}
        </text>
      </svg>
      <span
        style={{
          fontSize: "clamp(8.5px, 0.62vw, 10.5px)",
          color: C.textMut,
          textTransform: "uppercase",
          letterSpacing: "0.01em",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      {children ? (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            height: 18,
            fontSize: 12,
            whiteSpace: "nowrap",
          }}
        >
          {children}
        </span>
      ) : null}
    </div>
  );
}

const STAT_LABEL = {
  fontSize: "clamp(9px, 0.7vw, 10.5px)",
  color: C.textMut,
  textTransform: "uppercase" as const,
  letterSpacing: "0.04em",
  whiteSpace: "nowrap" as const,
};

/**
 * One customer list. Volume is a figure with its change (neutral: volume is not good or bad). The one chart is the
 * trend that matters, no reply in 48h+, coloured by the rule. Gauges for open and no reply; RMs alerted underneath.
 */
function ListCard({ l, p }: { l: PulseList; p: Period }) {
  const late = l.not_responded_48h;
  const lateColor = deltaColor(l.not_responded_delta);
  return (
    <div
      data-testid="pulse-list"
      style={{
        background: C.cardAlt,
        border: `1px solid ${C.border}`,
        borderRadius: 14,
        padding: "14px 14px 12px",
        display: "grid",
        gridRow: "span 2",
        gridTemplateRows: "subgrid",
        rowGap: 10,
        minWidth: 0,
      }}
    >
      <strong
        style={{
          fontSize: "clamp(13.5px, 1.02vw, 15.5px)",
          lineHeight: 1.25,
          alignSelf: "start",
        }}
      >
        {l.label}
      </strong>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.15fr)",
          gap: 14,
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            minWidth: 0,
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <span
              title="Volume: contacts on the bank's own channels in the period"
              style={{
                fontFamily: MONO,
                fontSize: l.volume >= 100000 ? 23 : l.volume >= 10000 ? 26 : 30,
                fontWeight: 750,
                lineHeight: 1,
              }}
            >
              {fmt(l.volume)}
            </span>
            <TrendChip pct={l.change_pct} label={p.compare_detail} compact />
          </span>
          <span
            style={{ fontSize: 12, color: C.textMut, whiteSpace: "nowrap" }}
          >
            {fmt(l.members)} customers
          </span>
          <span style={{ ...STAT_LABEL, marginTop: 4 }}>
            No reply 48h+ · trend
          </span>
          <div style={{ flex: 1, minHeight: 46, position: "relative" }}>
            {late === null ? (
              <span style={{ fontSize: 12, color: C.textMut }}>
                Needs 48 hours of data
              </span>
            ) : (
              <AreaChart
                id={`trend-late-${l.id}`}
                testid="late-trend"
                values={l.not_responded_series.map((x) => x.count)}
                color={lateColor}
                height="100%"
                title={`${l.label}: no reply in 48h+, trend`}
                points={{
                  ends: l.not_responded_series.map((x) => x.end),
                  span: spanOf(p),
                  unit: "without a reply in 48h+",
                }}
              />
            )}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 8,
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 6,
            }}
          >
            <ArcGauge
              value={share(l.open, l.volume)}
              color={deltaColor(l.open_delta)}
              centre={fmtCompact(l.open)}
              label="Open"
            >
              <Delta
                n={l.open_delta}
                label={p.compare_detail}
                goodDown
                compact
              />
            </ArcGauge>
            <ArcGauge
              value={share(late, l.volume)}
              color={late === null ? C.textMut : lateColor}
              centre={late === null ? "—" : fmt(late)}
              label="No reply 48h+"
            >
              {late === null ? (
                <span style={{ color: C.textMut }}>needs 48 h</span>
              ) : (
                <Delta
                  n={l.not_responded_delta}
                  label={p.compare_detail}
                  goodDown
                  compact
                />
              )}
            </ArcGauge>
          </div>
          <div
            data-testid="rm-line"
            title="RMs alerted this morning, of the customers on this list due an alert"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              flexWrap: "wrap",
              gap: "2px 8px",
              borderTop: `1px solid ${C.border}`,
              paddingTop: 8,
            }}
          >
            <span style={STAT_LABEL}>RMs alerted</span>
            <strong
              style={{
                fontFamily: MONO,
                fontSize: 13.5,
                color: C.text,
                whiteSpace: "nowrap",
              }}
            >
              {fmt(l.rm.alerted)} of {fmt(l.rm.of)}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CustomerPulse({ p }: { p: Period }) {
  const cp = p.customer_pulse;
  return (
    <Tile
      id="customer-pulse"
      title={titled("Customer pulse", p)}
      sub="Listed customers on the bank's own channels, then public voice. The two are never added together."
      prov={["internal", "public"]}
      tone="violet"
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <strong style={{ fontSize: 15 }}>Internal channels</strong>
        <ProvenanceTag kind="internal" />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, max(280px, calc((100% - 30px) / 4))), 1fr))",
          gap: 10,
        }}
      >
        {cp.lists.map((l) => (
          <ListCard key={l.id} l={l} p={p} />
        ))}
      </div>
      <ExternalBlock p={p} />
    </Tile>
  );
}

/* ---------------------------------------------------------------- external block of the Customer pulse */

const ENGAGEMENT_LABEL: Record<string, string> = {
  likes: "likes",
  replies: "replies",
  reposts: "reposts",
  upvotes: "upvotes",
  helpful: "found helpful",
};

function engagementLine(e: Record<string, number>) {
  const parts = Object.entries(e).map(
    ([k, v]) => `${fmt(v)} ${ENGAGEMENT_LABEL[k] ?? k}`,
  );
  return parts.length ? parts.join(" · ") : "no engagement recorded";
}

function ResponseChip({ responded }: { responded: boolean }) {
  const [label, color] = responded
    ? ["Responded", C.green]
    : ["Not responded", C.red];
  return (
    <span
      style={{
        fontSize: 12,
        fontWeight: 700,
        color,
        border: `1px solid ${tint(color, 0.4)}`,
        background: tint(color, 0.08),
        borderRadius: 999,
        padding: "1px 9px",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function SocialPostRow({ post, rank }: { post: SocialPost; rank: number }) {
  return (
    <div
      data-testid="social-post"
      style={{
        display: "grid",
        gridTemplateColumns: "26px minmax(0, 1fr)",
        alignItems: "start",
        gap: 10,
        padding: "9px 0",
        borderTop: rank > 1 ? `1px solid ${C.border}` : "none",
      }}
    >
      <span
        style={{
          fontFamily: MONO,
          fontWeight: 750,
          fontSize: 15,
          color: C.textMut,
        }}
      >
        {rank}
      </span>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontSize: 14, lineHeight: 1.45 }}>
          &ldquo;{post.text}&rdquo;
        </span>
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            alignItems: "center",
            fontSize: 12.5,
            color: C.textSec,
          }}
        >
          <strong>
            {post.platform} · {fmtDate(post.date)}
          </strong>
          <span style={{ color: C.textMut }}>
            {engagementLine(post.engagement)}
          </span>
          <ResponseChip responded={post.responded} />
        </div>
      </div>
    </div>
  );
}

/** The frame of one external card: a title, then its parts stacked, the last one on the floor of the card. */
function ExternalCard({
  title,
  tip,
  children,
}: {
  title: string;
  tip?: string;
  children: ReactNode;
}) {
  return (
    <div
      data-testid="external-card"
      title={tip}
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 14,
        padding: "14px 14px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minWidth: 0,
      }}
    >
      <strong
        style={{ fontSize: "clamp(13.5px, 1.02vw, 15.5px)", lineHeight: 1.25 }}
      >
        {title}
      </strong>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 10,
          minWidth: 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** A card's headline: the big figure, its change beside it, and one line saying what it counts. */
function Headline({
  big,
  chip,
  caption,
}: {
  big: string;
  chip?: ReactNode;
  caption?: ReactNode;
}) {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontFamily: MONO,
            fontSize: 30,
            fontWeight: 750,
            lineHeight: 1,
          }}
        >
          {big}
        </span>
        {chip}
      </span>
      {caption ? (
        <span style={{ fontSize: 12, color: C.textMut, lineHeight: 1.35 }}>
          {caption}
        </span>
      ) : null}
    </div>
  );
}

const SPLIT_ROW = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.15fr)",
  gap: 14,
  alignItems: "start",
};

/** The line under a card's gauges: a label, a figure and a bar. */
function CardFoot({
  label,
  figure,
  value,
  color,
}: {
  label: string;
  figure: string;
  value: number | null;
  color: string;
}) {
  return (
    <div
      style={{
        borderTop: `1px solid ${C.border}`,
        paddingTop: 8,
        display: "flex",
        flexDirection: "column",
        gap: 5,
      }}
    >
      <span
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 6,
        }}
      >
        <span style={STAT_LABEL}>{label}</span>
        <strong style={{ fontFamily: MONO, fontSize: 12.5, color }}>
          {figure}
        </strong>
      </span>
      <span
        aria-hidden
        style={{
          display: "block",
          height: 6,
          borderRadius: 999,
          background: C.inner,
          overflow: "hidden",
        }}
      >
        <span
          style={{
            display: "block",
            height: "100%",
            width: `${Math.max(0, Math.min(100, value ?? 0))}%`,
            minWidth: value ? 3 : 0,
            background: color,
            borderRadius: 999,
          }}
        />
      </span>
    </div>
  );
}

const GAUGE_PAIR = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 6,
};

function ExternalBlock({ p }: { p: Period }) {
  const [open, setOpen] = useState(false);
  // The trending list can be narrowed to one day: the high-impact peak.
  const [day, setDay] = useState<string | null>(null);
  const sp = p.social_pulse;
  const peak = sp.high_impact_peak;
  const onDay = day !== null && peak?.date === day ? peak : null;
  const shown = onDay ? onDay.posts : sp.posts;
  const ext = p.cx_pulse.external;
  const m = p.customer_pulse.mentions;
  const g = sp.good_response;
  const box = {
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 12,
    padding: "12px 14px",
    minWidth: 0,
  };
  const trend = "over the last periods of the same length";
  const whole = p.id === "all";
  const unanswered = m.unanswered_series.map((x) => x.count);
  return (
    <div
      data-testid="external-block"
      style={{
        marginTop: 6,
        borderTop: `2px dashed ${tint(C.cyan, 0.6)}`,
        paddingTop: 14,
      }}
    >
      <div
        style={{
          background: tint(C.cyan, 0.07),
          border: `1px solid ${tint(C.cyan, 0.35)}`,
          borderRadius: 14,
          padding: "14px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <strong style={{ fontSize: 15 }}>External channels</strong>
          <ProvenanceTag kind="public" />
          <span
            data-testid="external-info"
            role="img"
            aria-label="Public figures are the collected sample."
            title="Public figures are the collected sample."
            style={{ display: "inline-flex", color: C.textMut, cursor: "help" }}
          >
            <Info size={14} />
          </span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, max(280px, calc((100% - 30px) / 4))), 1fr))",
            gap: 10,
            alignItems: "stretch",
          }}
        >
          <ExternalCard title="Total mentions">
            <div style={SPLIT_ROW}>
              <Headline
                big={fmt(sp.mentions)}
                chip={
                  <TrendChip
                    pct={ext.change_pct}
                    label={`${p.compare_detail}, stores and forums`}
                    compact
                  />
                }
                caption="public posts and reviews"
              />
              <div style={GAUGE_PAIR}>
                <ArcGauge
                  value={ext.positive_share}
                  color={C.green}
                  centre={fmtPct(ext.positive_share)}
                  label="Positive"
                />
                <ArcGauge
                  value={ext.negative_share}
                  color={C.red}
                  centre={fmtPct(ext.negative_share)}
                  label="Negative"
                />
              </div>
            </div>
            <div
              title={sp.by_source
                .map((x) => `${x.label} ${fmt(x.mentions)}`)
                .join(" · ")}
              style={{
                borderTop: `1px solid ${C.border}`,
                paddingTop: 8,
                display: "flex",
                flexDirection: "column",
                gap: 5,
              }}
            >
              <span style={{ ...STAT_LABEL, lineHeight: "16px" }}>
                By source
              </span>
              <span
                aria-hidden
                style={{
                  display: "flex",
                  height: 6,
                  borderRadius: 999,
                  overflow: "hidden",
                  gap: 2,
                }}
              >
                {sp.by_source.map((x, i) => (
                  <span
                    key={x.source}
                    style={{
                      flex: `${x.mentions} 0 0`,
                      minWidth: 3,
                      background: SERIES[i % SERIES.length],
                    }}
                  />
                ))}
              </span>
            </div>
          </ExternalCard>

          <ExternalCard title="High-impact mentions" tip={sp.rule}>
            <div style={SPLIT_ROW}>
              <Headline
                big={fmt(sp.high_impact)}
                chip={
                  <TrendChip
                    pct={sp.high_impact_change_pct}
                    label={p.compare_detail}
                    compact
                  />
                }
                caption={
                  <>
                    posts with reach;{" "}
                    <strong style={{ color: C.textSec }}>
                      {fmt(ext.high_impact.escalation)}
                    </strong>{" "}
                    with escalation language
                  </>
                }
              />
              <div style={GAUGE_PAIR}>
                <ArcGauge
                  value={share(sp.high_impact_responded, sp.high_impact)}
                  color={C.green}
                  centre={fmt(sp.high_impact_responded)}
                  label="Responded"
                />
                <ArcGauge
                  value={share(ext.high_impact.negative, sp.high_impact)}
                  color={C.red}
                  centre={fmt(ext.high_impact.negative)}
                  label="Negative"
                />
              </div>
            </div>
            {peak ? (
              <button
                type="button"
                data-testid="peak"
                onClick={() => {
                  setDay(peak.date);
                  setOpen(true);
                }}
                title="Open that day's posts"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  background: C.cardAlt,
                  border: `1px solid ${C.borderLight}`,
                  borderRadius: 8,
                  padding: "6px 10px",
                  color: C.text,
                  fontSize: 13,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span
                  style={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                  <span>
                    <span style={{ color: C.textMut }}>Peak: </span>
                    <strong>
                      {fmtDate(peak.date)} · {fmt(peak.count)}{" "}
                      {peak.count === 1 ? "post" : "posts"}
                    </strong>
                  </span>
                  <span style={{ fontSize: 11.5, color: C.textMut }}>
                    See that day&apos;s posts
                  </span>
                </span>
                <ChevronRight size={15} color={C.brandInk} />
              </button>
            ) : null}
          </ExternalCard>

          <ExternalCard
            title="Bank response · informational"
            tip="Response here means acknowledged and routed to an official channel. Shown for information, not as a target."
          >
            <Headline
              big={sp.response_pct === null ? "—" : `${sp.response_pct}%`}
              chip={
                <span style={{ fontSize: 12.5, color: C.textSec }}>
                  {fmt(sp.responded)} of {fmt(sp.mentions)} mentions
                </span>
              }
            />
            <div
              data-testid="response-by-source"
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
                gap: 4,
              }}
            >
              {sp.by_source.map((x, i) => (
                <div
                  key={x.source}
                  title={`${fmt(x.responded)} of ${fmt(x.mentions)}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "66px minmax(0, 1fr) 36px",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 12,
                    lineHeight: "14px",
                    color: C.textSec,
                  }}
                >
                  <span style={{ whiteSpace: "nowrap" }}>{x.label}</span>
                  <span
                    aria-hidden
                    style={{
                      height: 6,
                      borderRadius: 999,
                      background: C.inner,
                      overflow: "hidden",
                    }}
                  >
                    <span
                      style={{
                        display: "block",
                        height: "100%",
                        width: `${x.pct ?? 0}%`,
                        background: SERIES[i % SERIES.length],
                        borderRadius: 999,
                      }}
                    />
                  </span>
                  <strong
                    style={{
                      fontFamily: MONO,
                      color: C.text,
                      textAlign: "right",
                    }}
                  >
                    {x.pct === null ? "—" : `${x.pct}%`}
                  </strong>
                </div>
              ))}
            </div>
          </ExternalCard>

          <ExternalCard title="High-priority mentions" tip={m.rule}>
            <div style={{ ...SPLIT_ROW, alignItems: "stretch", flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  minWidth: 0,
                }}
              >
                <Headline
                  big={fmt(m.total)}
                  caption="listed customers who tagged the bank"
                />
                <span style={{ ...STAT_LABEL, marginTop: 4 }}>
                  Unanswered · trend
                </span>
                <div style={{ flex: 1, minHeight: 28, position: "relative" }}>
                  <AreaChart
                    id="trend-ext-unanswered"
                    values={unanswered}
                    color={trendColor(seriesChange(unanswered, whole))}
                    height="100%"
                    title={`High-priority mentions without a reply, ${trend}`}
                    points={{
                      ends: m.unanswered_series.map((x) => x.end),
                      span: spanOf(p),
                      unit: "unanswered",
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 8,
                  minWidth: 0,
                }}
              >
                <div style={GAUGE_PAIR}>
                  <ArcGauge
                    value={share(m.responded, m.total)}
                    color={C.green}
                    centre={fmt(m.responded)}
                    label="Responded"
                  />
                  <ArcGauge
                    value={share(m.not_responded, m.total)}
                    color={C.red}
                    centre={fmt(m.not_responded)}
                    label="Unanswered"
                  />
                </div>
                <CardFoot
                  label="Response rate"
                  figure={fmtPct(share(m.responded, m.total))}
                  value={share(m.responded, m.total)}
                  color={NEUTRAL}
                />
              </div>
            </div>
          </ExternalCard>
        </div>

        {/* Detail, not pulse: closed until asked for. */}
        <button
          type="button"
          data-testid="posts-toggle"
          onClick={() => {
            setOpen(!open);
            setDay(null);
          }}
          aria-expanded={open}
          style={{
            alignSelf: "flex-start",
            background: "transparent",
            border: `1px solid ${C.border}`,
            color: C.textSec,
            borderRadius: 999,
            padding: "4px 12px",
            fontSize: 12.5,
            cursor: "pointer",
            display: "inline-flex",
            gap: 4,
            alignItems: "center",
          }}
        >
          {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          Trending posts and a good response
        </button>
        {open ? (
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "flex-start",
            }}
          >
            <div style={{ ...box, flex: "3 1 460px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <strong data-testid="posts-heading" style={{ fontSize: 14.5 }}>
                  {onDay
                    ? `High-impact posts on ${fmtDate(onDay.date)}: ${shown.length} of ${fmt(onDay.count)}, by engagement`
                    : `Top ${sp.posts.length || ""} trending posts, by engagement`}
                </strong>
                {onDay ? (
                  <button
                    type="button"
                    data-testid="clear-day"
                    onClick={() => setDay(null)}
                    style={{
                      background: "transparent",
                      border: `1px solid ${C.border}`,
                      color: C.textSec,
                      borderRadius: 999,
                      padding: "2px 10px",
                      fontSize: 12.5,
                      cursor: "pointer",
                    }}
                  >
                    Show the whole period
                  </button>
                ) : null}
              </div>
              {shown.length ? (
                shown.map((post, i) => (
                  <SocialPostRow
                    key={`${post.platform}-${post.date}-${post.score}-${post.text.slice(0, 12)}`}
                    post={post}
                    rank={i + 1}
                  />
                ))
              ) : (
                <MutedNote>
                  {onDay
                    ? "None of that day's posts can be quoted (they name a person or make an allegation)."
                    : "No posts with engagement in this period."}
                </MutedNote>
              )}
            </div>
            {g ? (
              <div
                data-testid="good-response"
                style={{
                  ...box,
                  flex: "2 1 320px",
                  border: `1px solid ${tint(C.green, 0.45)}`,
                  background: tint(C.green, 0.05),
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    alignSelf: "flex-start",
                    fontSize: 12,
                    fontWeight: 800,
                    color: C.green,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Good response
                </span>
                <span style={{ fontSize: 14, lineHeight: 1.45 }}>
                  &ldquo;{g.text}&rdquo;
                </span>
                <span style={{ fontSize: 12.5, color: C.textSec }}>
                  <strong>
                    {g.platform} · {fmtDate(g.date)}
                  </strong>{" "}
                  <span style={{ color: C.textMut }}>
                    {engagementLine(g.engagement)}
                    {g.in_period
                      ? ""
                      : " · most recent example, before this period"}
                  </span>
                </span>
                <div
                  style={{
                    borderLeft: `3px solid ${C.green}`,
                    paddingLeft: 10,
                    fontSize: 13.5,
                    color: C.textSec,
                    lineHeight: 1.5,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11.5,
                      color: C.textMut,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    The bank&apos;s reply
                  </div>
                  <span>{g.reply}</span>
                </div>
                <span style={{ fontSize: 12.5, color: C.textMut }}>
                  Acknowledged, given a reference and routed to an official
                  channel. Names and links are removed.
                </span>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- CX pulse */

function ExternalSet({
  title,
  f,
  hi,
}: {
  title: string;
  f: {
    volume: number;
    positive: number;
    negative: number;
    positive_share: number | null;
    negative_share: number | null;
    responded: PublicFigures["responded"];
  };
  hi?: boolean;
}) {
  const r = f.responded;
  return (
    <div
      style={{
        background: C.cardAlt,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minWidth: 0,
      }}
    >
      <strong style={{ fontSize: 14.5 }}>{title}</strong>
      <div style={DIALS(3)}>
        <Dial
          value={100}
          color={hi ? C.amber : C.cyan}
          centre={fmtCompact(f.volume)}
          big={fmt(f.volume)}
          label={hi ? "High impact" : "Signals"}
        />
        <Dial
          value={f.positive_share}
          color={C.green}
          big={`${fmt(f.positive)} / ${fmt(f.negative)}`}
          label="Positive / negative"
          sub={`${fmtPct(f.positive_share)} positive · ${fmtPct(f.negative_share)} negative, source-weighted`}
        />
        <Dial
          value={share(r.responded, r.reviews)}
          color={C.violet}
          big={`${fmt(r.responded)} of ${fmt(r.reviews)}`}
          label="Responded"
          sub={`positive ${fmt(r.positive_responded)} of ${fmt(r.positive_reviews)} · negative ${fmt(r.negative_responded)} of ${fmt(r.negative_reviews)}`}
        />
      </div>
    </div>
  );
}

function LegendDot({ color }: { color: string }) {
  return (
    <span
      aria-hidden
      style={{
        width: 9,
        height: 9,
        borderRadius: 999,
        background: color,
        flexShrink: 0,
      }}
    />
  );
}

export function CxPulse({ p }: { p: Period }) {
  const cx = p.cx_pulse;
  const i = cx.internal;
  const e = cx.external;
  const na = i.open_too_long === null;
  const head = (
    label: string,
    kind: "internal" | "public",
    extra?: ReactNode,
  ) => (
    <div
      style={{
        display: "flex",
        gap: 8,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <strong style={{ fontSize: 15 }}>{label}</strong>
      <ProvenanceTag kind={kind} />
      {extra}
    </div>
  );
  return (
    <Tile
      id="cx-pulse"
      title={titled("CX pulse", p)}
      sub="All customer contact: the bank's own channels and public voice."
      prov={["internal", "public"]}
      tone="cyan"
    >
      <div data-testid="overall-volume">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 8,
            fontSize: 14.5,
          }}
        >
          <span>
            Overall contact volume{" "}
            <strong style={{ fontFamily: MONO, fontSize: 18 }}>
              {fmt(cx.overall.total)}
            </strong>
          </span>
          <span
            style={{
              color: C.textSec,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <LegendDot color={C.violet} />
            Internal {fmt(cx.overall.internal)} (
            {fmtPct(cx.overall.internal_pct)}) ·
            <LegendDot color={C.cyan} />
            External {fmt(cx.overall.external)} (
            {fmtPct(cx.overall.external_pct)})
          </span>
        </div>
        <div
          style={{
            display: "flex",
            height: 10,
            borderRadius: 999,
            overflow: "hidden",
            marginTop: 6,
            background: C.inner,
          }}
        >
          <div
            style={{
              width: `${cx.overall.internal_pct ?? 0}%`,
              background: C.violet,
            }}
          />
          <div
            style={{
              width: `${cx.overall.external_pct ?? 0}%`,
              background: C.cyan,
            }}
          />
        </div>
      </div>

      {head("Internal channels", "internal")}
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            flex: "5 1 520px",
            minWidth: 0,
            background: C.cardAlt,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: "12px 10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            gap: 10,
          }}
        >
          <div style={{ ...DIALS(5), alignItems: "start" }}>
            <Dial
              value={100}
              color={C.violet}
              centre={fmtCompact(i.volume)}
              big={fmt(i.volume)}
              label="Volume"
              sub={<TrendChip pct={i.change_pct} label={p.compare} />}
            />
            <Dial
              value={share(i.resolved, i.volume)}
              color={C.green}
              big={fmt(i.resolved)}
              label="Resolved"
            />
            <Dial
              value={share(i.open, i.volume)}
              color={C.amber}
              big={fmt(i.open)}
              label="Open"
              sub={<Delta n={i.open_delta} label={p.compare} goodDown />}
            />
            <Dial
              value={share(i.waiting_on_customer, i.volume)}
              color={C.cyan}
              big={fmt(i.waiting_on_customer)}
              label="Waiting on customer"
            />
            <Dial
              value={share(i.open_too_long, i.volume)}
              color={C.red}
              big={na ? "—" : fmt(i.open_too_long)}
              label="Open too long"
              sub={na ? "needs 48 hours" : "over 48 hours"}
            />
          </div>
        </div>
        <div style={{ flex: "3 1 340px", minWidth: 0 }}>
          <Table
            head={[
              "Channel",
              "Volume",
              "Resolved",
              "Open",
              "Waiting",
              "Too long",
            ]}
            align={["left", "right", "right", "right", "right", "right"]}
            rows={CHANNEL_ORDER.map((ch) => {
              const c = i.by_channel[ch];
              return [
                CHANNEL_LABEL[ch],
                fmt(c.volume),
                fmt(c.resolved),
                fmt(c.open),
                fmt(c.waiting_on_customer),
                c.open_too_long === null || c.open_too_long === undefined
                  ? "—"
                  : fmt(c.open_too_long),
              ];
            })}
          />
        </div>
      </div>
      {head(
        "External channels",
        "public",
        <TrendChip
          pct={e.change_pct}
          label={`${p.compare}, stores and forums`}
        />,
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 420px), 1fr))",
          gap: 12,
        }}
      >
        <ExternalSet title="Total signals" f={e} />
        <ExternalSet title="High-impact signals" f={e.high_impact} hi />
      </div>
    </Tile>
  );
}
