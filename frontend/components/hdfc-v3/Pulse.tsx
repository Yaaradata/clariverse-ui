"use client";

/**
 * The first scroll of the MD's office / Head of CX view (30 Sep review, changes_30sep.md A): the period filter, the
 * Customer pulse and the CX pulse. Every figure comes from periods.json for the selected period.
 */

import { ChevronDown, ChevronUp } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, useState } from "react";

import { fmt, fmtDate, fmtPct, fmtSigned } from "@/lib/hdfc-v3/format";
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
} from "@/lib/hdfc-v3/periods";
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
}: {
  values: number[];
  color: string;
  width?: number;
  height?: number;
  /** A small chart rather than a bare line: filled under the line, on a baseline, with a dot on the latest value. */
  area?: boolean;
}) {
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
  return (
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
      <div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 750 }}>
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
 * One colour rule for every trend chart: green when the measure got better, red when it got worse, amber in between
 * (within 10% either way, or no earlier period). "Better" is fewer contacts, mentions and late replies, and a higher
 * response rate.
 */
const TREND_BAND = 10;

function trendColor(change: number | null, upIsGood = false): string {
  if (change === null) return C.amber;
  const better = upIsGood ? change : -change;
  return better >= TREND_BAND
    ? C.green
    : better <= -TREND_BAND
      ? C.red
      : C.amber;
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
function spanOf(p: Period): string {
  return p.id === "all"
    ? "Week to"
    : p.id === "30d"
      ? "30 days to"
      : p.id === "7d"
        ? "7 days to"
        : "24 hours to";
}

type TrendPoints = {
  /** The end of each point's window (ISO), in step with the values. */
  ends: string[];
  span: string;
  /** What the figure counts: "contacts", "mentions", or "%" for a rate. */
  unit: string;
};

/**
 * A smooth filled trend, stretched to its box: the shape of a series, with no axis. Hovering a point shows its window
 * and its figure.
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
  points?: TrendPoints;
}) {
  const [at, setAt] = useState<number | null>(null);
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
  const hover = at !== null && points && pts[at] ? at : null;
  const x = hover === null ? 0 : (100 * pts[hover][0]) / W;
  const y = hover === null ? 0 : (100 * pts[hover][1]) / H;
  return (
    <div
      data-testid={testid}
      role="img"
      aria-label={title}
      onMouseMove={(ev) => {
        const box = ev.currentTarget.getBoundingClientRect();
        const f = (ev.clientX - box.left) / Math.max(box.width, 1);
        setAt(Math.max(0, Math.min(values.length - 1, Math.round(f * n))));
      }}
      onMouseLeave={() => setAt(null)}
      // A chart told to fill its box is taken out of flow, so its own shape never sets the card's height.
      style={
        height === "100%"
          ? { position: "absolute", inset: 0 }
          : { position: "relative", width: "100%", height, minWidth: 0 }
      }
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
      {hover !== null && points ? (
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
            }}
          >
            <span style={{ fontSize: 11.5, color: C.textMut }}>
              {points.span} {fmtDate(points.ends[hover])}
            </span>
            <strong style={{ fontSize: 13, color }}>
              {points.unit === "%"
                ? `${fmt(values[hover])}%`
                : `${fmt(values[hover])} ${points.unit}`}
            </strong>
          </span>
        </>
      ) : null}
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
          fontSize: "clamp(9px, 0.7vw, 10.5px)",
          color: C.textMut,
          textTransform: "uppercase",
          letterSpacing: "0.03em",
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

/** One customer list: the big figure and its change, the volume trend as a filled chart, two gauges, two small stats. */
function ListCard({ l, p }: { l: PulseList; p: Period }) {
  const late = l.not_responded_48h;
  return (
    <div
      data-testid="pulse-list"
      style={{
        background: C.cardAlt,
        border: `1px solid ${tint(C.violet, 0.3)}`,
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
      {/* Two columns from the top: the figure sits over its trend, the gauges start level with it. The chart is
          short and wide, so the card stays compact. */}
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
                fontSize: 30,
                fontWeight: 750,
                lineHeight: 1,
              }}
            >
              {fmt(l.volume)}
            </span>
            <TrendChip pct={l.change_pct} label={p.compare} compact />
          </span>
          <span
            style={{ fontSize: 12, color: C.textMut, whiteSpace: "nowrap" }}
          >
            {fmt(l.members)} customers
          </span>
          <div style={{ flex: 1, minHeight: 52, position: "relative" }}>
            <AreaChart
              id={`trend-volume-${l.id}`}
              testid="volume-trend"
              values={l.volume_series.map((x) => x.count)}
              color={trendColor(l.change_pct)}
              height="100%"
              title="Volume, over the last periods of the same length"
              points={{
                ends: l.volume_series.map((x) => x.end),
                span: spanOf(p),
                unit: "contacts",
              }}
            />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 6,
            }}
          >
            <ArcGauge
              value={share(l.open, l.volume)}
              color={C.amber}
              centre={fmt(l.open)}
              label="Open"
            >
              <Delta n={l.open_delta} label={p.compare} goodDown compact />
            </ArcGauge>
            <ArcGauge
              value={share(late, l.volume)}
              color={C.red}
              centre={late === null ? "—" : fmt(late)}
              label="No reply 48h+"
            >
              {late === null ? (
                <span style={{ color: C.textMut }}>needs 48 h</span>
              ) : (
                <Delta
                  n={l.not_responded_delta}
                  label={p.compare}
                  goodDown
                  compact
                />
              )}
            </ArcGauge>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto minmax(0, 1fr)",
              gap: "clamp(6px, 0.7vw, 12px)",
              borderTop: `1px solid ${C.border}`,
              paddingTop: 8,
            }}
          >
            <div
              data-testid="rm-line"
              title="RMs alerted this morning, of the customers on this list due an alert"
              style={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
              <span style={STAT_LABEL}>RMs alerted</span>
              <strong
                style={{
                  fontFamily: MONO,
                  fontSize: 13.5,
                  color: C.violet,
                  whiteSpace: "nowrap",
                }}
              >
                {fmt(l.rm.alerted)} of {fmt(l.rm.of)}
              </strong>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={STAT_LABEL}>48h+ trend</span>
              {late === null ? (
                <span style={{ fontSize: 12, color: C.textMut }}>—</span>
              ) : (
                <AreaChart
                  id={`trend-late-${l.id}`}
                  testid="late-trend"
                  values={l.not_responded_series.map((x) => x.count)}
                  color={trendColor(
                    l.not_responded_delta === null
                      ? null
                      : Math.sign(l.not_responded_delta) * 100,
                  )}
                  height={20}
                  title="Not responded to in 48h+, over the last periods of the same length"
                  points={{
                    ends: l.not_responded_series.map((x) => x.end),
                    span: spanOf(p),
                    unit: "without a reply in 48h+",
                  }}
                />
              )}
            </div>
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
        <span style={{ fontSize: 12.5, color: C.textMut }}>
          Changes: {p.compare}. Trend colour: green better, amber within{" "}
          {TREND_BAND}%, red worse.
        </span>
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

/** One external figure, in the same shape as a list card: the figure over its trend, gauges beside it. */
function ExternalCard({
  title,
  tip,
  big,
  chip,
  caption,
  chart,
  color,
  children,
}: {
  title: string;
  tip?: string;
  big: string;
  chip?: ReactNode;
  caption: string;
  chart?: { id: string; values: number[]; title: string; points: TrendPoints };
  color: string;
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
        {title}
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
          <span style={{ fontSize: 12, color: C.textMut, lineHeight: 1.35 }}>
            {caption}
          </span>
          {chart ? (
            <div style={{ flex: 1, minHeight: 40, position: "relative" }}>
              <AreaChart
                id={chart.id}
                values={chart.values}
                color={color}
                height="100%"
                title={chart.title}
                points={chart.points}
              />
            </div>
          ) : null}
        </div>
        {/* Gauges at the top, the footer on the floor of the card, level with the foot of the chart. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 8,
            minWidth: 0,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

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
  const sp = p.social_pulse;
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
  const of = (xs: number[], upIsGood = false) =>
    trendColor(seriesChange(xs, whole), upIsGood);
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
          <span style={{ fontSize: 13, color: C.textSec }}>
            What LisN adds beyond your own systems. Counted separately from the
            internal cards above; for awareness, not a service target.
          </span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, max(280px, calc((100% - 30px) / 4))), 1fr))",
            gap: 10,
          }}
        >
          <ExternalCard
            title="Total mentions"
            big={fmt(sp.mentions)}
            chip={
              <TrendChip
                pct={ext.change_pct}
                label={`${p.compare}, stores and forums`}
                compact
              />
            }
            caption="public posts and reviews"
            chart={{
              id: "trend-ext-mentions",
              values: sp.mentions_series.map((x) => x.count),
              title: `Mentions, ${trend}`,
              points: {
                ends: sp.mentions_series.map((x) => x.end),
                span: spanOf(p),
                unit: "mentions",
              },
            }}
            color={trendColor(ext.change_pct)}
          >
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

          <ExternalCard
            title="High-impact mentions"
            tip={sp.rule}
            big={fmt(sp.high_impact)}
            caption="posts with reach"
            chart={{
              id: "trend-ext-high-impact",
              values: sp.high_impact_series.map((x) => x.count),
              title: `High-impact mentions, ${trend}`,
              points: {
                ends: sp.high_impact_series.map((x) => x.end),
                span: spanOf(p),
                unit: "high-impact mentions",
              },
            }}
            color={of(sp.high_impact_series.map((x) => x.count))}
          >
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
            <CardFoot
              label="Escalation language"
              figure={fmt(ext.high_impact.escalation)}
              value={share(ext.high_impact.escalation, sp.high_impact)}
              color={C.amber}
            />
          </ExternalCard>

          <ExternalCard
            title="Bank response · informational"
            tip="Response here means acknowledged and routed to an official channel. Shown for information, not as a target."
            big={sp.response_pct === null ? "—" : `${sp.response_pct}%`}
            caption={`${fmt(sp.responded)} of ${fmt(sp.mentions)} mentions`}
            chart={{
              id: "trend-ext-response",
              values: sp.response_series.map((x) => x.pct ?? 0),
              title: `Bank response rate, ${trend}`,
              points: {
                ends: sp.response_series.map((x) => x.end),
                span: spanOf(p),
                unit: "%",
              },
            }}
            color={of(
              sp.response_series.map((x) => x.pct ?? 0),
              true,
            )}
          >
            <div
              data-testid="response-by-source"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                flex: 1,
                gap: 4,
              }}
            >
              {sp.by_source.map((x, i) => (
                <div
                  key={x.source}
                  title={`${fmt(x.responded)} of ${fmt(x.mentions)}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "62px minmax(0, 1fr) 34px",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
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

          <ExternalCard
            title="High-priority mentions"
            tip={m.rule}
            big={fmt(m.total)}
            caption="listed customers who tagged the bank"
            chart={{
              id: "trend-ext-high-priority",
              values: m.series.map((x) => x.count),
              title: `High-priority mentions, ${trend}`,
              points: {
                ends: m.series.map((x) => x.end),
                span: spanOf(p),
                unit: "mentions",
              },
            }}
            color={of(m.series.map((x) => x.count))}
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
              color={C.violet}
            />
          </ExternalCard>
        </div>

        <div style={{ fontSize: 12.5, color: C.textMut }}>
          Response here means acknowledged and routed to an official channel. It
          is shown for information, not as a target.
        </div>
        {/* Detail, not pulse: closed until asked for. */}
        <button
          type="button"
          data-testid="posts-toggle"
          onClick={() => setOpen(!open)}
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
              <strong style={{ fontSize: 14.5 }}>
                Top {sp.posts.length || ""} trending posts, by engagement
              </strong>
              {sp.posts.length ? (
                sp.posts.map((post, i) => (
                  <SocialPostRow
                    key={`${post.platform}-${post.date}-${post.score}`}
                    post={post}
                    rank={i + 1}
                  />
                ))
              ) : (
                <MutedNote>No posts with engagement in this period.</MutedNote>
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
          centre={fmt(f.volume)}
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
              centre={fmt(i.volume)}
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
