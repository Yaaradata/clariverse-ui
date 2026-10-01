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

type SplitRow = {
  id: string;
  help_desk: number;
  email: number;
  service_calls: number;
  salesforce: number;
  partner_portal: number;
};

const CHANNELS = [
  { key: "help_desk", label: "Help desk", colour: K.orange },
  { key: "email", label: "Email", colour: K.violet400 },
  { key: "service_calls", label: "Service calls", colour: K.amber },
  { key: "salesforce", label: "Salesforce", colour: K.green },
  { key: "partner_portal", label: "Partner portal", colour: K.slate },
] as const;

export function ThemeChannelBar({
  rows,
  nameById,
}: {
  rows: SplitRow[];
  nameById: Record<string, string>;
}) {
  const data = useMemo(
    () =>
      rows.map((r) => ({
        theme: nameById[r.id] ?? r.id,
        help_desk: r.help_desk,
        email: r.email,
        service_calls: r.service_calls,
        salesforce: r.salesforce,
        partner_portal: r.partner_portal,
      })),
    [rows, nameById],
  );

  return (
    <div
      role="img"
      aria-label="Contacts by channel per theme"
      style={{ height: 280 }}
    >
      <ResponsiveContainer
        width="100%"
        height="100%"
        initialDimension={{ width: 1, height: 1 }}
      >
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 4, left: 0 }}>
          <CartesianGrid stroke={K.borderLight} vertical={false} />
          <XAxis
            dataKey="theme"
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
          <Legend wrapperStyle={{ fontSize: 11, color: K.textMut }} />
          {CHANNELS.map((c, i) => (
            <Bar
              key={c.key}
              dataKey={c.key}
              stackId="a"
              fill={c.colour}
              name={c.label}
              isAnimationActive={false}
              radius={i === CHANNELS.length - 1 ? [4, 4, 0, 0] : 0}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
