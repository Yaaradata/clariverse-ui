"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ServiceReputationSnapshot } from "@/lib/role-based-dashboard/hdfc/ServiceReputationData";
import { useDashboardTheme } from "../../DashboardThemeContext";
import { LiveModelledPill } from "./LiveModelledPill";
import { SRPanel, boxBorder } from "./SRPanel";

type Themes = ServiceReputationSnapshot["service_reputation_themes"];
type Decay = ServiceReputationSnapshot["app_play_service_decay"];

export function ServiceReputationThemesPanel({ data }: { data: Themes }) {
  const T = useDashboardTheme();
  const rows = data.themes.map((t) => ({
    theme: t.theme,
    value: t.value,
    source: t.source,
  }));

  return (
    <SRPanel
      title={data.title}
      subtitle={data.subtitle}
      accentColor={T.red}
      ai
      aiModel={data.badge.replace(/^AI ·\s*/i, "")}
    >
      <div
        style={{
          fontSize: 11,
          color: T.textMut,
          marginBottom: 10,
          display: "flex",
          gap: 14,
          flexWrap: "wrap",
        }}
      >
        <span>
          <span style={{ color: "#22c55e" }}>●</span> from X
        </span>
        <span>
          <span style={{ color: "#fb923c" }}>●</span> from Reddit
        </span>
      </div>
      <div style={{ width: "100%", height: 360, minHeight: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={rows}
            layout="vertical"
            margin={{ top: 4, right: 28, left: 8, bottom: 4 }}
            barCategoryGap="14%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke={T.borderLight} horizontal={false} />
            <XAxis type="number" domain={[0, 500]} stroke={T.textMut} fontSize={11} />
            <YAxis
              type="category"
              dataKey="theme"
              width={190}
              stroke={T.textSec}
              fontSize={11}
              interval={0}
            />
            <Tooltip
              cursor={{ fill: `${T.red}10` }}
              contentStyle={{
                background: "rgba(10,14,22,0.96)",
                border: `1px solid ${T.borderLight}`,
                borderRadius: 8,
                fontSize: 11,
              }}
              formatter={(value) => [
                `${Number(value).toLocaleString()} mentions`,
                "Mentions",
              ]}
            />
            <Bar dataKey="value" fill={T.red} radius={[0, 6, 6, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div
        style={{
          marginTop: 10,
          paddingTop: 10,
          borderTop: `1px solid ${T.borderLight}`,
          fontSize: 12,
          color: T.textMut,
        }}
      >
        {data.footer}
      </div>
    </SRPanel>
  );
}

export function AppPlayServiceDecayPanel({ data }: { data: Decay }) {
  const T = useDashboardTheme();
  return (
    <SRPanel
      title={data.title}
      subtitle={data.subtitle}
      accentColor={T.amber}
      ai
      aiModel={data.badge.replace(/^AI ·\s*/i, "")}
      headerRight={<LiveModelledPill source={data.source} />}
    >
      <div style={{ width: "100%", height: 300, minHeight: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data.series} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.borderLight} vertical={false} />
            <XAxis dataKey="week" stroke={T.textMut} fontSize={11} />
            <YAxis
              yAxisId="left"
              domain={[0, 80]}
              stroke={T.red}
              fontSize={10}
              label={{
                value: "Complaints",
                angle: -90,
                position: "insideLeft",
                fill: T.textMut,
                fontSize: 10,
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[3.5, 4.5]}
              stroke={T.amber}
              fontSize={10}
              label={{
                value: "★ rating",
                angle: 90,
                position: "insideRight",
                fill: T.textMut,
                fontSize: 10,
              }}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(10,14,22,0.96)",
                border: `1px solid ${T.borderLight}`,
                borderRadius: 8,
                fontSize: 11,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 11, color: T.textMut }} />
            <Bar
              yAxisId="left"
              dataKey="service_complaints"
              name="Service complaints"
              fill={T.red}
              radius={[4, 4, 0, 0]}
              barSize={18}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="star_rating"
              name="Star rating"
              stroke={T.amber}
              strokeWidth={2.5}
              dot={{ r: 3, fill: T.amber }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div
        style={{
          marginTop: 10,
          paddingTop: 10,
          borderTop: `1px solid ${T.borderLight}`,
          fontSize: 12,
          color: T.textMut,
        }}
      >
        {data.footer}
      </div>
    </SRPanel>
  );
}
