"use client";

import { useV2K } from "@kgs2/lib/demoState";
import { useMemo } from "react";
import {
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { withAlpha } from "@/components/role-based-dashboard/kgs/shared/tokens";
import type { V2Tokens } from "../shared/themeTokens";

type RegionSeries = {
  regionId: string;
  region: string;
  values: number[];
};

/** North highlighted; on-target regions stay grey but clearly stepped for visibility. */
export function regionStroke(
  K: V2Tokens,
): Record<string, { color: string; width: number }> {
  const light = K.mode === "light";
  return {
    North: { color: K.orange, width: 2.5 },
    South: { color: light ? "#6b7280" : "#d1d5db", width: 1.75 },
    East: { color: "#9ca3af", width: 1.75 },
    West: { color: light ? "#374151" : "#6b7280", width: 1.75 },
    SEA: { color: light ? "#b8bfc9" : "#e5e7eb", width: 1.75 },
  };
}

export const REGION_ORDER = ["North", "South", "East", "West", "SEA"] as const;

/**
 * SPEC §5a — five region lines (North highlighted) + 90% target.
 */
export function PromiseRegionChart({
  weeks,
  series,
  targetPct,
  labelFn,
  height = 260,
}: {
  weeks: string[];
  series: RegionSeries[];
  targetPct: number;
  labelFn: (s: string) => string;
  height?: number;
}) {
  const K = useV2K();
  const REGION_STROKE = regionStroke(K);
  const ordered = useMemo(() => {
    return REGION_ORDER.map((id) =>
      series.find((s) => s.regionId === id),
    ).filter((s): s is RegionSeries => Boolean(s));
  }, [series]);

  const data = useMemo(
    () =>
      weeks.map((w, i) => {
        const row: Record<string, string | number | null> = { week: w };
        for (const s of ordered) {
          row[s.regionId] = s.values[i] ?? null;
        }
        return row;
      }),
    [weeks, ordered],
  );

  const ys = ordered.flatMap((s) => s.values);
  const dataMin = ys.length ? Math.min(...ys, targetPct) : 60;
  const dataMax = ys.length ? Math.max(...ys, targetPct) : 100;
  const pad = Math.max((dataMax - dataMin) * 0.12, 2);
  const domainMin = Math.max(0, Math.floor(dataMin - pad));
  const domainMax = Math.ceil(dataMax + pad);

  const northEnd = ordered.find((s) => s.regionId === "North")?.values;
  const endLabel = northEnd?.length
    ? `${northEnd[northEnd.length - 1]}%`
    : undefined;

  return (
    <div
      role="img"
      aria-label="Promise kept by region weekly"
      style={{ height, position: "relative" }}
    >
      <ResponsiveContainer
        width="100%"
        height="100%"
        initialDimension={{ width: 1, height: 1 }}
      >
        <ComposedChart
          data={data}
          margin={{ top: 16, right: 40, bottom: 4, left: 0 }}
        >
          <CartesianGrid stroke={K.borderLight} vertical={false} />
          <XAxis
            dataKey="week"
            tick={{ fill: K.textMut, fontSize: 11, fontFamily: K.mono }}
            axisLine={{ stroke: K.borderLight }}
            tickLine={false}
          />
          <YAxis
            domain={[domainMin, domainMax]}
            tick={{ fill: K.textMut, fontSize: 11, fontFamily: K.mono }}
            axisLine={false}
            tickLine={false}
            width={36}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            cursor={{ stroke: withAlpha(K.text, 0.35), strokeWidth: 1 }}
            contentStyle={{
              background: K.elevated,
              border: `1px solid ${K.borderLight}`,
              borderRadius: 8,
              fontSize: 12,
              color: K.text,
              boxShadow: `0 8px 24px ${K.scrim}`,
            }}
            labelStyle={{
              color: K.text,
              fontWeight: 700,
              marginBottom: 4,
            }}
            itemStyle={{
              color: K.textSec,
              paddingTop: 2,
              paddingBottom: 2,
            }}
            formatter={(value: number | string, name: string) => {
              const n = typeof value === "number" ? value : Number(value);
              if (Number.isNaN(n)) return [String(value), name];
              const seriesMeta = ordered.find((s) => s.regionId === name);
              const label = seriesMeta ? labelFn(seriesMeta.region) : name;
              const stroke = REGION_STROKE[name]?.color ?? K.text;
              return [
                <span key={name} style={{ color: K.text, fontWeight: 600 }}>
                  {n}%
                </span>,
                <span
                  key={`${name}-l`}
                  style={{ color: stroke, fontWeight: 600 }}
                >
                  {label}
                </span>,
              ];
            }}
          />
          <ReferenceLine
            y={targetPct}
            stroke={K.textMut}
            strokeDasharray="4 4"
            label={{
              value: `${targetPct}% target`,
              fill: K.textMut,
              fontSize: 11,
              position: "insideTopRight",
            }}
          />
          {ordered.map((s) => {
            const stroke = REGION_STROKE[s.regionId] ?? {
              color: K.slate,
              width: 1.5,
            };
            const highlight = s.regionId === "North";
            return (
              <Line
                key={s.regionId}
                type="monotone"
                dataKey={s.regionId}
                stroke={stroke.color}
                strokeWidth={stroke.width}
                dot={
                  highlight
                    ? { r: 3, fill: stroke.color, strokeWidth: 0 }
                    : false
                }
                activeDot={{ r: highlight ? 5 : 3, fill: stroke.color }}
                isAnimationActive={false}
                name={s.regionId}
              />
            );
          })}
        </ComposedChart>
      </ResponsiveContainer>
      {endLabel ? (
        <span
          style={{
            position: "absolute",
            right: 4,
            top: 10,
            fontSize: 12,
            fontWeight: 800,
            fontFamily: K.mono,
            fontVariantNumeric: "tabular-nums",
            color: K.orange,
            pointerEvents: "none",
          }}
        >
          {endLabel}
        </span>
      ) : null}
    </div>
  );
}
