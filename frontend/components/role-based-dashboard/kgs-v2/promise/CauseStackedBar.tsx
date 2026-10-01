"use client";

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
import { K } from "@/components/role-based-dashboard/kgs/shared/tokens";

type CauseRow = {
  regionId: string;
  region: string;
  kgs: { allocation: number; backorder: number; orderChange: number };
  lastMile: number;
};

export function CauseStackedBar({
  rows,
  labelFn,
  height = 200,
}: {
  rows: CauseRow[];
  labelFn: (s: string) => string;
  height?: number;
}) {
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
    <div role="img" aria-label="Candidate causes by region" style={{ height }}>
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
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, color: K.textMut, paddingTop: 4 }}
            iconType="square"
            iconSize={8}
          />
          <Bar
            dataKey="allocation"
            stackId="a"
            fill={K.orange}
            name="KGS allocation"
            isAnimationActive={false}
          />
          <Bar
            dataKey="backorder"
            stackId="a"
            fill={K.amber}
            name="Backorder"
            isAnimationActive={false}
          />
          <Bar
            dataKey="orderChange"
            stackId="a"
            fill={K.violet400}
            name="Order change"
            isAnimationActive={false}
          />
          <Bar
            dataKey="lastMile"
            stackId="a"
            fill={K.slate}
            name="Last mile"
            isAnimationActive={false}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
