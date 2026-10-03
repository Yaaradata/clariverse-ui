"use client";

/**
 * IndusInd · chart parts, copied from the earlier LisN pulse: the area trend with a hover value on every point, and the
 * arc gauge. Values arrive precomputed in the page payload; nothing here derives a figure.
 */

import { type PointerEvent, type ReactNode, useState } from "react";

import { fmtDate } from "@/lib/indusind-v1/format";
import type { Trend } from "@/lib/indusind-v1/types";
import { C, MONO } from "./primitives";

/** What one point of a trend covers, for its hover label. */
export type TrendPoints = {
  /** The end of each point's window (ISO), in step with the values. */
  ends: string[];
  span: string;
  /** "index" for an index (Q1 weekly average = 100), else a unit such as "%". */
  unit: string;
};

export function trendPoints(
  t: Trend,
  span = "Week to",
): {
  values: number[];
  points: TrendPoints;
} {
  const pts = t.points.filter((p) => p.value !== null);
  return {
    values: pts.map((p) => p.value as number),
    points: { ends: pts.map((p) => p.end), span, unit: t.unit },
  };
}

function pointFigure(points: TrendPoints, v: number): string {
  if (points.unit === "index") return `Index ${v}`;
  return points.unit.startsWith("%")
    ? `${v}${points.unit}`
    : `${v} ${points.unit}`;
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
export function AreaChart({
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
  // Indices sit near 100: scale between the series' own floor and ceiling, with headroom, so the shape reads.
  const lo = Math.min(...values) * 0.9;
  const hi = Math.max(...values, lo + 1);
  const n = Math.max(values.length - 1, 1);
  const pts = values.map(
    (v, i) => [(i * W) / n, H - 6 - ((H - 16) * (v - lo)) / (hi - lo)] as const,
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
export function ArcGauge({
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
