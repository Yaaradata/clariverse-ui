"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LabelList,
  Cell,
} from "recharts";
import { TrendingUp } from "lucide-react";

/**
 * Standalone copy of the social-page "Top 10 Topics by Virality" chart,
 * scoped to the role-based dashboard with its own embedded mock data so it
 * stays independent from the live social page feed.
 */

type ChannelKey = "appStore" | "playStore" | "reddit" | "trustpilot" | "x";

const CHANNEL_META: { key: ChannelKey; label: string; color: string }[] = [
  { key: "appStore",   label: "App Store",    color: "#10b981" },
  { key: "playStore",  label: "Play Store",   color: "#f59e0b" },
  { key: "reddit",     label: "Reddit",       color: "#f97316" },
  { key: "trustpilot", label: "Trustpilot",   color: "#ef4444" },
  { key: "x",          label: "X (Twitter)",  color: "#b91c1c" },
];

type TopicRow = {
  topic: string;
  appStore: number;
  playStore: number;
  reddit: number;
  trustpilot: number;
  x: number;
};

const TOPIC_ROWS: TopicRow[] = [
  { topic: "Payment Processing Failure",    appStore: 74, playStore: 52, reddit: 38, trustpilot: 32, x: 16 },
  { topic: "Mobile App Crashes",            appStore: 50, playStore: 44, reddit: 36, trustpilot: 29, x: 25 },
  { topic: "Account Access Problems",       appStore: 105, playStore: 25, reddit: 18, trustpilot: 12, x: 7 },
  { topic: "Fee Structure Criticism",       appStore: 46, playStore: 37, reddit: 22, trustpilot: 20, x: 16 },
  { topic: "System Outage Frustration",     appStore: 44, playStore: 31, reddit: 31, trustpilot: 13, x: 10 },
  { topic: "Cross Border Issues",           appStore: 49, playStore: 27, reddit: 21, trustpilot: 13, x: 8 },
  { topic: "Customer Service Disappointment", appStore: 43, playStore: 24, reddit: 20, trustpilot: 11, x: 4 },
  { topic: "Regulatory Compliance Questions", appStore: 50, playStore: 27, reddit: 19, trustpilot: 0, x: 0 },
  { topic: "Digital Innovation Appreciation", appStore: 52, playStore: 36, reddit: 0, trustpilot: 0, x: 0 },
  { topic: "Trade Finance Satisfaction",    appStore: 31, playStore: 20, reddit: 14, trustpilot: 11, x: 0 },
];

export function RetailTopTopicsByVirality() {
  const data = useMemo(() => {
    return TOPIC_ROWS.map(row => {
      const totalVolume =
        row.appStore + row.playStore + row.reddit + row.trustpilot + row.x;
      let cumulative = 0;
      const stops: { offset: number; color: string }[] = [];
      CHANNEL_META.forEach(meta => {
        const value = row[meta.key];
        if (!value || totalVolume === 0) return;
        if (stops.length === 0) {
          stops.push({ offset: 0, color: meta.color });
        }
        cumulative += value / totalVolume;
        stops.push({ offset: Math.min(1, cumulative), color: meta.color });
      });
      if (stops.length === 0) {
        stops.push({ offset: 0, color: "#10b981" });
        stops.push({ offset: 1, color: "#10b981" });
      }
      const activeChannels = CHANNEL_META.filter(m => row[m.key] > 0).length;
      return {
        ...row,
        totalVolume,
        totalPercent: 100,
        activeChannels,
        gradientStops: stops,
      };
    });
  }, []);

  const renderTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || payload.length === 0) return null;
    const row = payload[0].payload as (typeof data)[number];
    const total = row.totalVolume || 0;
    return (
      <div className="min-w-[240px] rounded-xl border border-white/10 bg-[#090f1f]/95 px-4 py-3 text-xs text-slate-100 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-white">{label}</div>
            <div className="text-[11px] text-slate-400">
              Shared topic across {row.activeChannels} channels
            </div>
          </div>
          <div className="text-[11px] font-semibold text-emerald-300">
            🔥 {total.toLocaleString()} posts
          </div>
        </div>
        <div className="mt-3 space-y-2">
          {CHANNEL_META.map((meta, idx) => {
            const count = (row as any)[meta.key] ?? 0;
            const percent = total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";
            return (
              <div
                key={meta.key}
                className="flex items-center justify-between gap-3 rounded-md px-3 py-2"
                style={{
                  background:
                    idx % 2 === 0
                      ? "rgba(148, 163, 184, 0.08)"
                      : "rgba(30, 41, 59, 0.45)",
                  border: "1px solid rgba(148, 163, 184, 0.15)",
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: meta.color }}
                  />
                  <span className="text-[11px] text-slate-200 font-medium">
                    {meta.label}
                  </span>
                </div>
                <div
                  className="text-[11px] font-semibold"
                  style={{ color: meta.color }}
                >
                  {count.toLocaleString()} ({percent}%)
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderLegend = () => (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[11px] text-slate-300 pt-3">
      {CHANNEL_META.map(meta => (
        <div key={meta.key} className="flex items-center gap-2">
          <span
            className="inline-block h-3 w-8 rounded-full"
            style={{ background: meta.color }}
          />
          <span>{meta.label}</span>
        </div>
      ))}
    </div>
  );

  const renderTotalLabel = (props: any) => {
    const { x = 0, y = 0, width = 0, height = 0, value } = props;
    if (!value || Number.isNaN(value)) return null;
    return (
      <g>
        <text
          x={x + width + 14}
          y={y + height / 2 + 4}
          fill="#fb923c"
          fontSize={12}
          fontWeight={600}
        >
          🔥 {Number(value).toLocaleString()}
        </text>
      </g>
    );
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0D0D0D] shadow-xl">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2 text-white">
          <TrendingUp className="h-5 w-5 text-purple-400" />
          Top 10 Topics by Virality
        </h3>
        <p className="text-sm text-slate-400">
          Most viral cross-channel topics
        </p>
      </div>
      <div className="p-6 pt-0">
        <ResponsiveContainer width="100%" height={420}>
          <BarChart
            data={data}
            layout="vertical"
            barCategoryGap="28%"
            barGap={8}
            barSize={18}
            margin={{ top: 12, right: 115, left: 16, bottom: 8 }}
          >
            <defs>
              {data.map((row, index) => (
                <linearGradient
                  key={row.topic}
                  id={`retail-topic-gradient-${index}`}
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >
                  {row.gradientStops.map((stop, stopIdx) => (
                    <stop
                      key={`${row.topic}-stop-${stopIdx}`}
                      offset={`${stop.offset * 100}%`}
                      stopColor={stop.color}
                    />
                  ))}
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid
              stroke="#1e293b"
              strokeDasharray="3 6"
              horizontal
              vertical={false}
            />
            <XAxis
              type="number"
              tickFormatter={value => `${Math.round(value || 0)}%`}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              allowDecimals
              domain={[0, 100]}
            />
            <YAxis
              dataKey="topic"
              type="category"
              width={240}
              tick={{ fill: "#cbd5f5", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={renderTooltip} />
            <Legend
              verticalAlign="bottom"
              align="center"
              content={renderLegend}
              wrapperStyle={{ paddingTop: 8 }}
            />
            <Bar
              dataKey="totalPercent"
              isAnimationActive={false}
              radius={[14, 14, 14, 14]}
            >
              {data.map((row, index) => (
                <Cell
                  key={`${row.topic}-cell`}
                  fill={`url(#retail-topic-gradient-${index})`}
                />
              ))}
              <LabelList dataKey="totalVolume" content={renderTotalLabel} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
