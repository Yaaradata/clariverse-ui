"use client";

/**
 * NatWest Group · customer pulse blocks (re-bound from the oct13 pulse): plain coloured deltas, a one-series area
 * trend, the public "not yet loaded" tile, the group pulse and the pulse by segment. Public and internal are never
 * added together; every tile carries its provenance tag.
 */

import Link from "next/link";
import type { ReactNode } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  fmtBig,
  fmtN,
  fmtP,
  fmtSignedPct,
  fmtSignedPts,
  type GroupBlock,
  type Point,
  type SegmentRow,
  type SourceRow,
} from "@/lib/natwest-pulse/nw";
import { C, Kpi, MONO, Table, Tile, tint } from "./primitives";

/** A change as plain coloured text. Volume changes stay neutral (HL-24); rates read amber when worse, green when better. */
export function Delta({
  value,
  kind,
  worseWhen = "up",
}: {
  value: number | null | undefined;
  kind: "pts" | "pct";
  worseWhen?: "up" | "down" | "neutral";
}) {
  const text = kind === "pts" ? fmtSignedPts(value) : fmtSignedPct(value);
  if (!text) return null;
  const worse =
    worseWhen === "neutral" || !value
      ? null
      : worseWhen === "up"
        ? value > 0
        : value < 0;
  const color = worse === null ? C.textSec : worse ? C.amber : C.green;
  return (
    <span data-testid="delta" style={{ color, fontFamily: MONO, fontSize: 13 }}>
      {text}
    </span>
  );
}

import { vsPrev } from "@/lib/natwest-pulse/nw";

export { vsPrev };

/** One series, gradient fill, y-axis fitted to the data, latest value labelled. */
export function AreaTrend({
  data,
  unit,
  height = 180,
  label,
}: {
  data: Point[];
  unit: "%" | "";
  height?: number;
  label: string;
}) {
  const vals = data.map((d) => d.v).filter((v): v is number => v !== null);
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  const pad = (hi - lo) * 0.15 || Math.max(1, hi * 0.05);
  const domain: [number, number] = [
    Math.max(0, Math.floor(lo - pad)),
    Math.ceil(hi + pad),
  ];
  const last = vals[vals.length - 1];
  const fmtV = (v: number) =>
    unit === "%" ? `${v.toFixed(1)}%` : v.toLocaleString("en-GB");
  const id = `g-${label.replace(/\W/g, "")}`;
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12.5,
          color: C.textMut,
        }}
      >
        <span>{label}</span>
        {last !== undefined ? (
          <span style={{ fontFamily: MONO, color: C.text }}>
            Latest {fmtV(last)}
          </span>
        ) : null}
      </div>
      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 12, left: 0, bottom: 4 }}
          >
            <defs>
              <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.cyan} stopOpacity={0.35} />
                <stop offset="100%" stopColor={C.cyan} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={C.border} vertical={false} />
            <XAxis
              dataKey="x"
              tick={{ fill: C.textMut, fontSize: 11 }}
              axisLine={{ stroke: C.border }}
              tickLine={false}
              minTickGap={18}
            />
            <YAxis
              domain={domain}
              tick={{ fill: C.textMut, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={52}
              tickFormatter={(v) =>
                unit === "%" ? `${v}%` : fmtBig(Number(v))
              }
            />
            <Tooltip
              contentStyle={{
                background: C.tooltip,
                border: `1px solid ${C.borderLight}`,
                borderRadius: 8,
                fontSize: 12.5,
                color: C.text,
              }}
              formatter={(v) => [fmtV(Number(v)), label]}
            />
            <Area
              type="monotone"
              dataKey="v"
              stroke={C.cyan}
              strokeWidth={2}
              fill={`url(#${id})`}
              isAnimationActive={false}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/** The public layer while data/raw/natwest/ is empty: never invented posts, counts, ratings or reply rates (HL-15). */
export function NotLoadedTile({
  title = "Public voice",
  sources,
}: {
  title?: string;
  sources: SourceRow[];
}) {
  return (
    <Tile title={title} sub="Public data not yet loaded" prov="public">
      <div
        data-testid="public-not-loaded"
        style={{ fontSize: 14, color: C.textSec, lineHeight: 1.5 }}
      >
        Public data not yet loaded. No public posts, counts or ratings until the
        pull lands.
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {sources.map((s) => (
          <span
            key={s.id}
            style={{
              fontSize: 12.5,
              color: C.textMut,
              border: `1px dashed ${C.borderLight}`,
              borderRadius: 999,
              padding: "2px 10px",
            }}
          >
            {s.label} · {s.loaded ? `${fmtN(s.items)} items` : "not loaded"}
          </span>
        ))}
      </div>
    </Tile>
  );
}

function KpiSub({ children }: { children: ReactNode }) {
  return (
    <span style={{ display: "inline-flex", gap: 6, flexWrap: "wrap" }}>
      {children}
    </span>
  );
}

export function GroupPulse({
  g,
  windowLabel,
  showDelta,
}: {
  g: GroupBlock;
  windowLabel: string;
  showDelta: boolean;
}) {
  const vs = vsPrev(windowLabel);
  const d = (node: ReactNode, alt: ReactNode) =>
    showDelta ? (
      <KpiSub>
        {node} {vs}
      </KpiSub>
    ) : (
      alt
    );
  return (
    <Tile
      title="Group pulse, inside the bank"
      sub="Contacts and complaints"
      prov="internal"
      id="group-pulse"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 170px), 1fr))",
          gap: 10,
        }}
      >
        <Kpi
          label="Contacts"
          value={fmtBig(g.contacts)}
          sub={d(
            <Delta
              value={g.contacts_change_pct}
              kind="pct"
              worseWhen="neutral"
            />,
            "Calls, Cora and branch",
          )}
        />
        <Kpi
          label="Negative share"
          value={fmtP(g.negative_pct)}
          sub={d(<Delta value={g.negative_delta} kind="pts" />, "Of contacts")}
        />
        <Kpi
          label="Repeat within 7 days"
          value={fmtP(g.repeat_pct)}
          sub={d(<Delta value={g.repeat_delta} kind="pts" />, "Of contacts")}
        />
        <Kpi
          label="Complaints"
          value={fmtN(g.complaints)}
          sub={d(
            <Delta
              value={g.complaints_change_pct}
              kind="pct"
              worseWhen="neutral"
            />,
            `${g.complaints_per_100k?.toFixed(1)} per 100,000 customers`,
          )}
        />
        <Kpi
          label="Upheld"
          value={fmtP(g.upheld_pct)}
          sub={d(<Delta value={g.upheld_delta} kind="pts" />, "Of complaints")}
        />
        <Kpi
          label="Closed within 3 days"
          value={fmtP(g.closed_3d_pct)}
          sub={d(
            <Delta value={g.closed_3d_delta} kind="pts" worseWhen="down" />,
            "Of complaints",
          )}
        />
      </div>
      <AreaTrend data={g.trend} unit="%" label="Negative share of contacts" />
    </Tile>
  );
}

export function SegmentPulse({
  rows,
  showDelta,
  windowLabel,
}: {
  rows: SegmentRow[];
  showDelta: boolean;
  windowLabel: string;
}) {
  const mono = (k: string, v: ReactNode) => (
    <span key={k} style={{ fontFamily: MONO }}>
      {v}
    </span>
  );
  return (
    <Tile
      title="Customer pulse by segment"
      sub="Where the experience leaks"
      prov={["internal", "joined"]}
      id="segments"
    >
      <Table
        head={[
          "Segment",
          "Contacts",
          "Negative",
          showDelta ? `Change ${vsPrev(windowLabel)}` : "Repeat 7 days",
          "Complaints per 100k",
          "Upheld",
          "Cora leakage",
        ]}
        align={["left", "right", "right", "right", "right", "right", "right"]}
        rows={rows.map((r) => [
          <strong key="l" style={{ color: C.text }}>
            {r.label}
          </strong>,
          mono("c", fmtBig(r.contacts)),
          mono("n", fmtP(r.negative_pct)),
          showDelta ? (
            <Delta key="d" value={r.negative_delta} kind="pts" />
          ) : (
            mono("r", fmtP(r.repeat_pct))
          ),
          mono("k", r.complaints_per_100k?.toFixed(1)),
          mono("u", fmtP(r.upheld_pct)),
          mono("cl", fmtP(r.cora_leakage_pct)),
        ])}
      />
    </Tile>
  );
}

/** A tile that links to its screen, for the home page summaries. */
export function LinkTile({
  href,
  title,
  sub,
  prov,
  children,
  tone,
}: {
  href: string;
  title: string;
  sub: string;
  prov: "internal" | "public" | ("internal" | "public" | "joined")[];
  children: ReactNode;
  tone?: "amber" | "red" | "cyan";
}) {
  return (
    <Tile
      title={title}
      sub={sub}
      prov={prov}
      tone={tone}
      right={
        <Link
          href={href}
          style={{
            fontSize: 13,
            color: C.brandInk,
            border: `1px solid ${tint(C.brand, 0.4)}`,
            borderRadius: 999,
            padding: "3px 10px",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          Open
        </Link>
      }
    >
      {children}
    </Tile>
  );
}
