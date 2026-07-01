"use client";

import React from "react";
import { Scale } from "lucide-react";
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { COMPLIANCE_PAGE, REGULATION_EXPOSURE_BARS, type RegulationExposureBar } from "../../lib/cxHeadRetailData";
import { cssVar, radius, space, type } from "../../theme/tokens";

type ChartRow = RegulationExposureBar & { name: string };

const CHART_DATA: ChartRow[] = REGULATION_EXPOSURE_BARS.map((bar) => ({
  ...bar,
  name: bar.shortLabel,
}));

function urgencyColor(urgency: RegulationExposureBar["urgency"]): string {
  if (urgency === "critical") return cssVar("severity-high");
  if (urgency === "high") return cssVar("severity-med");
  return cssVar("accent");
}

function categoryLabel(category: RegulationExposureBar["category"]): string {
  if (category === "statutory-clock") return "Statutory";
  if (category === "metrology") return "Metrology";
  return "Conduct";
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{ payload: ChartRow }>;
}): React.ReactElement | null {
  if (!active || !payload?.length) return null;
  const item = payload[0]?.payload;
  if (!item) return null;
  const color = urgencyColor(item.urgency);

  return (
    <div
      style={{
        padding: space["3"],
        borderRadius: radius.sm,
        background: cssVar("surface-raised"),
        border: `1px solid ${cssVar("border")}`,
        maxWidth: 220,
        fontSize: 11,
      }}
    >
      <div style={{ fontWeight: type.weight.bold, color: cssVar("text-primary"), marginBottom: 6 }}>{item.label}</div>
      <div style={{ display: "grid", gap: 3, color: cssVar("text-secondary"), lineHeight: 1.4 }}>
        <span>
          Volume: <strong className="lisn-num" style={{ color }}>{item.count}</strong>
        </span>
        <span>
          Corroboration: <strong className="lisn-num" style={{ color }}>{item.sharePct}%</strong>
        </span>
        <span>{item.owner}</span>
      </div>
    </div>
  );
}

function InstrumentTile({ bar }: { bar: RegulationExposureBar }): React.ReactElement {
  const color = urgencyColor(bar.urgency);

  return (
    <div
      style={{
        padding: space["3"],
        borderRadius: radius.md,
        border: `1px solid ${cssVar("border")}`,
        borderTop: `3px solid ${color}`,
        background: cssVar("surface-raised"),
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <div style={{ fontSize: 10, fontWeight: type.weight.bold, color: cssVar("text-primary"), lineHeight: 1.3 }}>{bar.shortLabel}</div>
      <div className="lisn-num" style={{ fontSize: 20, fontWeight: 800, lineHeight: 1, color }}>{bar.sharePct}%</div>
      <div style={{ fontSize: 9, color: cssVar("text-muted") }}>corroboration</div>
      <div style={{ marginTop: 2, fontSize: 9, color: cssVar("text-secondary"), lineHeight: 1.35 }}>
        {bar.count} contacts · {categoryLabel(bar.category)}
      </div>
    </div>
  );
}

/** S3 exposure — volume mix strip + dual-axis chart + instrument tiles. */
export function RegulationExposureChart(): React.ReactElement {
  return (
    <div
      style={{
        padding: space["4"],
        borderRadius: radius.lg,
        background: cssVar("surface"),
        border: `1px solid ${cssVar("border")}`,
        minWidth: 0,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: space["3"],
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: space["2"] }}>
        <Scale size={16} color={cssVar("accent")} aria-hidden />
        <div style={{ fontSize: type.scale.body, fontWeight: type.weight.bold, color: cssVar("text-primary") }}>
          {COMPLIANCE_PAGE.sections.exposure}
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={CHART_DATA} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
            <CartesianGrid stroke={cssVar("border")} strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: cssVar("text-muted"), fontSize: 10 }}
              axisLine={{ stroke: cssVar("border") }}
              tickLine={false}
            />
            <YAxis
              yAxisId="volume"
              allowDecimals={false}
              tick={{ fill: cssVar("text-muted"), fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={32}
              label={{ value: "Contacts", angle: -90, position: "insideLeft", fill: cssVar("text-muted"), fontSize: 9, dx: 10 }}
            />
            <YAxis
              yAxisId="corr"
              orientation="right"
              domain={[0, 100]}
              tick={{ fill: cssVar("text-muted"), fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={28}
              unit="%"
              label={{ value: "Corroboration", angle: 90, position: "insideRight", fill: cssVar("text-muted"), fontSize: 9, dx: -6 }}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: `${cssVar("accent")}12` }} />
            <Bar yAxisId="volume" dataKey="count" name="Volume" radius={[4, 4, 0, 0]} maxBarSize={36}>
              {CHART_DATA.map((row) => (
                <Cell key={row.id} fill={urgencyColor(row.urgency)} fillOpacity={0.75} />
              ))}
            </Bar>
            <Line
              yAxisId="corr"
              type="monotone"
              dataKey="sharePct"
              name="Corroboration"
              stroke={cssVar("accent-2")}
              strokeWidth={2}
              dot={{ r: 4, fill: cssVar("accent-2"), stroke: cssVar("surface"), strokeWidth: 2 }}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(72px, 1fr))", gap: space["2"] }}>
        {REGULATION_EXPOSURE_BARS.map((bar) => (
          <InstrumentTile key={bar.id} bar={bar} />
        ))}
      </div>
    </div>
  );
}
