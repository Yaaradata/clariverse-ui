"use client";

import { useV2K } from "@kgs2/lib/demoState";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { withAlpha } from "@/components/role-based-dashboard/kgs/shared/tokens";

type CauseRow = {
  regionId: string;
  region: string;
  kgs: { allocation: number; backorder: number; orderChange: number };
  lastMile: number;
};

/**
 * Candidate causes by region — KGS-side stack vs last mile (SPEC §5a).
 */
export function CauseStackedBar({
  rows,
  labelFn,
  height = 200,
}: {
  rows: CauseRow[];
  labelFn: (s: string) => string;
  height?: number;
}) {
  const K = useV2K();
  const data = useMemo(
    () =>
      rows.map((r) => ({
        region: labelFn(r.region),
        allocation: r.kgs.allocation,
        backorder: r.kgs.backorder,
        orderChange: r.kgs.orderChange,
        lastMile: r.lastMile,
      })),
    [rows, labelFn],
  );

  return (
    <div
      role="img"
      aria-label="Candidate causes by region"
      // Grows with the panel so it matches the quotes panel beside it. The inner
      // absolute box gives the chart a definite height to measure.
      style={{ flex: 1, minHeight: height, position: "relative" }}
    >
      <div style={{ position: "absolute", inset: 0 }}>
      <ResponsiveContainer
        width="100%"
        height="100%"
        initialDimension={{ width: 1, height: 1 }}
      >
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 4, left: 0 }}>
          <CartesianGrid stroke={K.borderLight} vertical={false} />
          <XAxis
            dataKey="region"
            tick={{ fill: K.textMut, fontSize: 11 }}
            axisLine={{ stroke: K.borderLight }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: K.textMut, fontSize: 11, fontFamily: K.mono }}
            axisLine={false}
            tickLine={false}
            width={28}
          />
          <Tooltip
            contentStyle={{
              background: K.elevated,
              border: `1px solid ${K.borderLight}`,
              borderRadius: 8,
              fontSize: 12,
              color: K.text,
            }}
            labelStyle={{ color: K.text, fontWeight: 700 }}
            cursor={{ fill: withAlpha(K.text, 0.06) }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, color: K.textMut, paddingTop: 4 }}
            iconType="square"
            iconSize={8}
          />
          <Bar
            dataKey="allocation"
            stackId="kgs"
            fill={K.orange}
            name="KGS · allocation"
            isAnimationActive={false}
          />
          <Bar
            dataKey="backorder"
            stackId="kgs"
            fill={K.amberFill}
            name="KGS · backorder"
            isAnimationActive={false}
          />
          <Bar
            dataKey="orderChange"
            stackId="kgs"
            fill={K.violet400}
            name="KGS · order change"
            isAnimationActive={false}
          />
          <Bar
            dataKey="lastMile"
            stackId="lm"
            fill={K.slate}
            name="Last mile"
            isAnimationActive={false}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}
