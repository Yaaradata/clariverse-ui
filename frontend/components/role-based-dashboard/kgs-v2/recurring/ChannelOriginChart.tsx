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
import type { V2Tokens } from "../shared/themeTokens";

type ChannelRow = {
  id: string;
  name: string;
  help_desk: number;
  email: number;
  service_calls: number;
  salesforce: number;
  partner_portal: number;
};

function channels(K: V2Tokens): Array<{
  key: keyof Omit<ChannelRow, "id" | "name">;
  label: string;
  color: string;
}> {
  return [
    { key: "help_desk", label: "Help desk", color: K.orange },
    { key: "email", label: "Email", color: K.violet400 },
    { key: "service_calls", label: "Service calls", color: K.amberFill },
    { key: "salesforce", label: "Salesforce", color: K.greenFill },
    { key: "partner_portal", label: "Partner portal", color: K.slate },
  ];
}

/** Axis label length that fits without overlap for this many bars. */
function maxLabel(bars: number): number {
  return bars > 4 ? 16 : bars > 3 ? 20 : 28;
}

/**
 * SPEC §6a — Where it comes from: contacts by channel per theme (stacked).
 */
export function ChannelOriginChart({
  rows,
  height = 240,
}: {
  rows: ChannelRow[];
  height?: number;
}) {
  const K = useV2K();
  const CHANNELS = channels(K);
  const data = useMemo(
    () =>
      rows.map((r) => ({
        theme: r.name.length > maxLabel(rows.length)
          ? `${r.name.slice(0, maxLabel(rows.length) - 2)}…`
          : r.name,
        help_desk: r.help_desk,
        email: r.email,
        service_calls: r.service_calls,
        salesforce: r.salesforce,
        partner_portal: r.partner_portal,
      })),
    [rows],
  );

  return (
    <div
      role="img"
      aria-label="Contacts by channel per theme"
      style={{ height }}
    >
      <ResponsiveContainer
        width="100%"
        height="100%"
        initialDimension={{ width: 1, height: 1 }}
      >
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
          <CartesianGrid stroke={K.borderLight} vertical={false} />
          <XAxis
            dataKey="theme"
            tick={{ fill: K.textMut, fontSize: 10 }}
            axisLine={{ stroke: K.borderLight }}
            tickLine={false}
            interval={0}
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
          {CHANNELS.map((ch, i) => (
            <Bar
              key={ch.key}
              dataKey={ch.key}
              stackId="ch"
              fill={ch.color}
              name={ch.label}
              isAnimationActive={false}
              radius={i === CHANNELS.length - 1 ? [4, 4, 0, 0] : undefined}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
