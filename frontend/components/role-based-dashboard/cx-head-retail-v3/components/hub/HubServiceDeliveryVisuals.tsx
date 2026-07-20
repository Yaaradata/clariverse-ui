"use client";

import React, { useMemo, useState } from "react";
import { Bar, CartesianGrid, Cell, ComposedChart, Legend, Line, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ServiceDeliveryDrill, ServiceDeliveryTop, SlaHeatmapRow } from "../../lib/cxHeadRetailV3HubCards";
import { hubChartAxis, hubChartTooltip } from "./HubChartPrimitives";
import { HubMicroLabel } from "./HubVisualPrimitives";
import { cssVar, radius } from "../../theme/tokens";

const FCR_CHANNEL_DATA = [
  { ch: "Voice", actual: 74, last: 78, target: 80 },
  { ch: "Chat", actual: 62, last: 66, target: 75 },
  { ch: "Email", actual: 58, last: 61, target: 70 },
  { ch: "Social/X", actual: 41, last: 48, target: 60 },
  { ch: "App SS", actual: 89, last: 86, target: 85 },
] as const;

const FCR_CHANNEL_COLORS: Record<string, string> = {
  Voice: "#E11D48",
  Chat: "#EA580C",
  Email: "#0D9488",
  "Social/X": "#22c55e",
  "App SS": "#2563EB",
};

const MET_COLOR = "#4ADE80";
const BREACH_COLOR = "#FF6B6B";

const SLA_HEAT_ON_TRACK = 90;
const SLA_HEAT_AT_RISK = 75;

function slaHeatCellColors(compliance: number): { background: string; text: string } {
  if (compliance >= SLA_HEAT_ON_TRACK) {
    return { background: "#166534", text: "#ECFDF5" };
  }
  if (compliance >= SLA_HEAT_AT_RISK) {
    return { background: "#92400E", text: "#FEF3C7" };
  }
  if (compliance >= 65) {
    return { background: "#991B1B", text: "#FEE2E2" };
  }
  return { background: "#7F1D1D", text: "#FEE2E2" };
}

function parseNum(value: string): number {
  const match = value.match(/[\d.]+/);
  return match ? Number.parseFloat(match[0]) : 0;
}

function parseCases(value: string): number {
  return Number.parseInt(value.replace(/[^\d]/g, ""), 10) || 0;
}

const BREACH_TILE_COLORS = ["#DC2626", "#E85D5D", "#C94A4A", "#B83A3A", "#9F2E2E"];

function PromiseMetricTile({ label, value, color }: { label: string; value: string; color: string }): React.ReactElement {
  return (
    <div
      style={{
        padding: "9px 10px",
        borderRadius: radius.md,
        background: `${color}10`,
        border: `1px solid ${color}33`,
      }}
    >
      <div style={{ fontSize: 10, fontWeight: 700, color: cssVar("text-muted"), textTransform: "uppercase", letterSpacing: 0.35, marginBottom: 4 }}>
        {label}
      </div>
      <div className="lisn-num" style={{ fontSize: 16, fontWeight: 800, color, lineHeight: 1.1 }}>
        {value}
      </div>
    </div>
  );
}

export function ServicePromiseBoardVisual({
  service,
  failures,
}: {
  service: ServiceDeliveryTop;
  failures: ServiceDeliveryDrill["slaFailures"];
}): React.ReactElement {
  const parsed = failures
    .map((f) => ({
      ...f,
      breachedN: parseCases(f.breached),
      pendingN: parseCases(f.pending),
    }))
    .sort((a, b) => b.breachedN - a.breachedN);
  const totalBreached = parsed.reduce((sum, row) => sum + row.breachedN, 0);
  const totalPending = parsed.reduce((sum, row) => sum + row.pendingN, 0);
  const overdueDisplay = service.overdueCallbacks.includes("%")
    ? service.overdueCallbacks
    : `${Math.round((parseCases(service.overdueCallbacks) / Math.max(totalPending, 1)) * 100)}%`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
        <PromiseMetricTile label="SLA met" value={service.promise.met} color={MET_COLOR} />
        <PromiseMetricTile label="SLA breached" value={service.promise.breached} color={BREACH_COLOR} />
        <PromiseMetricTile label="Total Pending" value={service.promise.pending} color={cssVar("severity-med")} />
        <PromiseMetricTile label="Breach signal" value={overdueDisplay} color={cssVar("severity-high")} />
      </div>

      <div style={{ display: "flex", minHeight: 92, gap: 5, borderRadius: radius.md, overflow: "hidden" }}>
          {parsed.map((item, index) => {
            const share = totalBreached > 0 ? Math.round((item.breachedN / totalBreached) * 100) : 0;
            const tileColor = BREACH_TILE_COLORS[index] ?? BREACH_TILE_COLORS[BREACH_TILE_COLORS.length - 1];

            return (
              <div
                key={item.area}
                style={{
                  flex: item.breachedN,
                  minWidth: 0,
                  padding: "10px 10px 9px",
                  background: `linear-gradient(180deg, ${tileColor}EE 0%, ${tileColor}BB 100%)`,
                  border: index === 0 ? `1px solid ${cssVar("text-primary")}55` : "1px solid transparent",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 6,
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 800, color: "#FEE2E2", lineHeight: 1.25, overflow: "hidden", textOverflow: "ellipsis" }}>
                  {item.area}
                </div>
                <div>
                  <div className="lisn-num" style={{ fontSize: 20, fontWeight: 800, color: "#FFFFFF", lineHeight: 1 }}>
                    {item.breachedN}
                  </div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "#FECACA", marginTop: 3 }}>
                    {share}% · {item.pendingN} open
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

/** SLA heatmap — intent × channel compliance grid */
export function SlaHeatmapVisual({ heatmap }: { heatmap: ServiceDeliveryDrill["slaHeatmap"] }): React.ReactElement {
  const [hovered, setHovered] = useState<{ intent: string; channel: string; compliance: number } | null>(null);

  const columnCount = heatmap.channels.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `minmax(96px, 118px) repeat(${columnCount}, minmax(0, 1fr))`,
          gap: 6,
          alignItems: "stretch",
        }}
      >
        <div />
        {heatmap.channels.map((channel) => (
          <div
            key={channel}
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: cssVar("text-muted"),
              textAlign: "center",
              letterSpacing: 0.35,
              textTransform: "uppercase",
            }}
          >
            {channel}
          </div>
        ))}

        {heatmap.rows.map((row) => (
          <HeatmapRow
            key={row.intent}
            row={row}
            channels={heatmap.channels}
            hovered={hovered}
            onHover={setHovered}
          />
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
        {[
          { label: "≥ 90% — On Track", colors: slaHeatCellColors(92) },
          { label: "75–89% — Elevated", colors: slaHeatCellColors(82) },
          { label: "< 75% — Breaching", colors: slaHeatCellColors(64) },
        ].map((item) => (
          <span key={item.label} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10, color: cssVar("text-muted") }}>
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                background: item.colors.background,
                border: `1px solid ${item.colors.background}`,
              }}
            />
            {item.label}
          </span>
        ))}
        {hovered ? (
          <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: cssVar("text-secondary") }}>
            {hovered.intent} · {hovered.channel}: {hovered.compliance}% SLA met
          </span>
        ) : (
          <span style={{ marginLeft: "auto", fontSize: 10, color: cssVar("text-muted") }}>Hover a cell for detail</span>
        )}
      </div>
    </div>
  );
}

function HeatmapRow({
  row,
  channels,
  hovered,
  onHover,
}: {
  row: SlaHeatmapRow;
  channels: string[];
  hovered: { intent: string; channel: string; compliance: number } | null;
  onHover: (cell: { intent: string; channel: string; compliance: number } | null) => void;
}): React.ReactElement {
  return (
    <>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: cssVar("text-primary"),
          lineHeight: 1.3,
          display: "flex",
          alignItems: "center",
          paddingRight: 6,
        }}
      >
        {row.intent}
      </div>
      {row.values.map((compliance, index) => {
        const channel = channels[index] ?? `Col ${index + 1}`;
        const colors = slaHeatCellColors(compliance);
        const active = hovered?.intent === row.intent && hovered.channel === channel;

        return (
          <button
            key={`${row.intent}-${channel}`}
            type="button"
            onMouseEnter={() => onHover({ intent: row.intent, channel, compliance })}
            onMouseLeave={() => onHover(null)}
            style={{
              minHeight: 36,
              borderRadius: radius.sm,
              border: active ? `1px solid ${colors.text}` : "1px solid transparent",
              background: colors.background,
              color: colors.text,
              fontSize: 13,
              fontWeight: 800,
              fontVariantNumeric: "tabular-nums",
              cursor: "default",
              padding: 0,
              opacity: hovered != null && !active ? 0.72 : 1,
              transform: active ? "scale(1.03)" : "scale(1)",
              transition: "opacity 120ms ease, transform 120ms ease",
            }}
          >
            {compliance}
          </button>
        );
      })}
    </>
  );
}

const ESCALATION_COLORS = ["#E11D48", "#EA580C", "#F59E0B", "#0D9488", "#6366F1", "#8B5CF6"];

type ParsedEscalation = {
  team: string;
  open: string;
  aging: string;
  unresolved: string;
  openN: number;
  agingN: number;
  unresolvedN: number;
  color: string;
  share: number;
};

export function EscalationBoardVisual({ escalations }: { escalations: ServiceDeliveryDrill["escalations"] }): React.ReactElement {
  const [activeTeam, setActiveTeam] = useState<string | null>(null);

  const parsed = useMemo((): ParsedEscalation[] => {
    const rows = escalations.map((item, index) => ({
      ...item,
      openN: parseNum(item.open),
      agingN: parseNum(item.aging),
      unresolvedN: parseNum(item.unresolved),
      color: ESCALATION_COLORS[index % ESCALATION_COLORS.length],
    }));
    const totalOpen = rows.reduce((sum, row) => sum + row.openN, 0);
    return rows.map((row) => ({
      ...row,
      share: totalOpen > 0 ? Math.round((row.openN / totalOpen) * 100) : 0,
    }));
  }, [escalations]);

  const totalOpen = parsed.reduce((sum, row) => sum + row.openN, 0);
  const worstAging = parsed.reduce((a, b) => (b.agingN > a.agingN ? b : a), parsed[0]);
  const focus = parsed.find((row) => row.team === activeTeam) ?? worstAging ?? parsed[0];

  const pieData = parsed.map((row) => ({
    name: row.team,
    value: row.openN,
    fill: row.color,
  }));

  const tableCols = "minmax(0, 1fr) 42px 78px";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        minHeight: 0,
      }}
    >
      <div
        style={{
          position: "relative",
          width: 156,
          height: 156,
          flexShrink: 0,
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={46}
              outerRadius={72}
              paddingAngle={0}
              cornerRadius={0}
              stroke="none"
              isAnimationActive={false}
              onMouseEnter={(_, index) => setActiveTeam(parsed[index]?.team ?? null)}
              onMouseLeave={() => setActiveTeam(null)}
            >
              {pieData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={entry.fill}
                  opacity={activeTeam && activeTeam !== entry.name ? 0.5 : 1}
                />
              ))}
            </Pie>
            <Tooltip
              {...hubChartTooltip}
              formatter={(value, _name, item) => {
                const row = parsed.find((entry) => entry.team === item.payload.name);
                return [`${value} open · ${row?.share ?? 0}%`, row?.team ?? "Team"];
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <span className="lisn-num" style={{ fontSize: 22, fontWeight: 800, color: cssVar("accent"), lineHeight: 1 }}>
            {totalOpen}
          </span>
          <span style={{ fontSize: 9, fontWeight: 700, color: cssVar("text-muted"), textTransform: "uppercase", letterSpacing: 0.45, marginTop: 2 }}>
            Open cases
          </span>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          border: `1px solid ${cssVar("border")}`,
          borderRadius: radius.md,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: tableCols,
            columnGap: 10,
            padding: "6px 10px",
            background: cssVar("surface-raised"),
            borderBottom: `1px solid ${cssVar("border")}`,
          }}
        >
          <HubMicroLabel>Team</HubMicroLabel>
          <span style={{ textAlign: "right" }}>
            <HubMicroLabel>Open</HubMicroLabel>
          </span>
          <span style={{ textAlign: "right" }}>
            <HubMicroLabel>Aging</HubMicroLabel>
          </span>
        </div>

        {parsed.map((row, index) => {
          const highAging = row.agingN >= 4;
          const agingColor = highAging ? cssVar("severity-high") : row.agingN >= 3 ? cssVar("severity-med") : cssVar("text-muted");
          const isFocus = focus.team === row.team;

          return (
            <div
              key={row.team}
              onMouseEnter={() => setActiveTeam(row.team)}
              onMouseLeave={() => setActiveTeam(null)}
              style={{
                display: "grid",
                gridTemplateColumns: tableCols,
                columnGap: 10,
                alignItems: "center",
                padding: "6px 10px",
                borderBottom: index < parsed.length - 1 ? `1px solid ${cssVar("border")}` : undefined,
                background: isFocus ? `${row.color}12` : undefined,
                cursor: "default",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: row.color, flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: cssVar("text-primary"), lineHeight: 1.2 }}>{row.team}</div>
                  <div className="lisn-num" style={{ fontSize: 10, color: cssVar("text-muted"), marginTop: 1, lineHeight: 1.2 }}>
                    {row.unresolved} unresolved · {row.share}%
                  </div>
                </div>
              </div>
              <span className="lisn-num" style={{ fontSize: 13, fontWeight: 800, color: cssVar("text-primary"), textAlign: "right" }}>
                {row.open}
              </span>
              <span className="lisn-num" style={{ fontSize: 10, fontWeight: 700, color: agingColor, textAlign: "right", whiteSpace: "nowrap" }}>
                {row.aging}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function centerShortLabel(name: string): string {
  return name.replace(/\s+(in-house|BPO-[A-Z])$/i, "");
}

type ParsedCenter = {
  name: string;
  shortName: string;
  type: "In-house" | "Outsourced";
  breachPct: string;
  unresolved: string;
  breachN: number;
  unresolvedN: number;
  slaKeptN: number;
  color: string;
};

function CenterGaugeArc({ pct, color, size = 72 }: { pct: number; color: string; size?: number }): React.ReactElement {
  const stroke = 7;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={cssVar("border")}
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x={size / 2}
        y={size / 2 + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={cssVar("text-primary")}
        fontSize={15}
        fontWeight={800}
      >
        {pct}%
      </text>
    </svg>
  );
}

export function ServiceCenterVisual({ centers }: { centers: ServiceDeliveryDrill["centers"] }): React.ReactElement {
  const parsed = useMemo((): ParsedCenter[] => {
    const worstBreach = Math.max(...centers.map((c) => parseNum(c.breachPct)));
    return centers.map((c) => {
      const breachN = parseNum(c.breachPct);
      const isWorst = breachN === worstBreach;
      return {
        ...c,
        shortName: centerShortLabel(c.name),
        breachN,
        unresolvedN: parseNum(c.unresolved),
        slaKeptN: Math.max(0, 100 - breachN),
        color: c.type === "In-house" ? cssVar("positive") : isWorst ? cssVar("severity-high") : cssVar("severity-med"),
      };
    });
  }, [centers]);

  const inHouse = parsed.filter((c) => c.type === "In-house");
  const outsourced = parsed.filter((c) => c.type === "Outsourced");
  const worst = parsed.reduce((a, b) => (b.breachN > a.breachN ? b : a), parsed[0]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
        {[
          { title: "In-house", items: inHouse, accent: cssVar("positive") },
          { title: "Outsourced", items: outsourced, accent: cssVar("severity-med") },
        ].map((lane) => (
          <div
            key={lane.title}
            style={{
              padding: "10px 12px",
              borderRadius: radius.md,
              border: `1px solid ${cssVar("border")}`,
              background: cssVar("surface-raised"),
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.4, textTransform: "uppercase", color: lane.accent }}>
              {lane.title}
            </span>

            {lane.items.map((center) => {
              const isWorst = center.name === worst.name;

              return (
                <div
                  key={center.name}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    gap: 10,
                    alignItems: "center",
                    padding: "8px 10px",
                    borderRadius: radius.md,
                    background: isWorst ? `${cssVar("severity-high")}0a` : cssVar("surface"),
                    border: `1px solid ${isWorst ? `${cssVar("severity-high")}45` : cssVar("border")}`,
                  }}
                >
                  <CenterGaugeArc pct={center.slaKeptN} color={isWorst ? cssVar("severity-high") : lane.accent} />

                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 5 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: cssVar("text-primary") }}>{center.shortName}</span>
                      <span className="lisn-num" style={{ fontSize: 12, fontWeight: 800, color: cssVar("severity-high") }}>
                        {center.breachPct}
                      </span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: cssVar("text-muted") }}>
                      <span>SLA kept</span>
                      <span className="lisn-num" style={{ fontWeight: 700, color: cssVar("text-secondary") }}>
                        {center.unresolved} in queue
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export function FcrIntelligenceVisual(): React.ReactElement {
  return (
    <div style={{ width: "100%", height: 240 }}>
        <ResponsiveContainer>
          <ComposedChart data={[...FCR_CHANNEL_DATA]} margin={{ top: 6, right: 12, left: -14, bottom: 0 }}>
            <CartesianGrid stroke={cssVar("border")} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="ch" {...hubChartAxis} stroke={cssVar("border")} />
            <YAxis {...hubChartAxis} stroke={cssVar("border")} domain={[0, 100]} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const row = FCR_CHANNEL_DATA.find((d) => d.ch === label);
                return (
                  <div
                    style={{
                      background: cssVar("surface-raised"),
                      border: `1px solid ${cssVar("border")}`,
                      borderRadius: radius.sm,
                      padding: "8px 11px",
                      fontSize: 11,
                    }}
                  >
                    <div style={{ fontSize: 10.5, color: cssVar("text-muted"), marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.6 }}>
                      {label}
                    </div>
                    {payload.map((entry, index) => (
                      <div key={entry.name ?? index} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: index ? 3 : 0 }}>
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 2,
                            background:
                              entry.name === "Actual"
                                ? (FCR_CHANNEL_COLORS[label as string] ?? cssVar("text-muted"))
                                : (entry.color ?? entry.stroke ?? cssVar("text-muted")),
                            display: "inline-block",
                          }}
                        />
                        <span style={{ color: cssVar("text-muted") }}>{entry.name}</span>
                        <span className="lisn-num" style={{ color: cssVar("text-primary"), fontWeight: 700, marginLeft: "auto" }}>
                          {entry.value}%
                        </span>
                      </div>
                    ))}
                    {row ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: cssVar("text-muted"), opacity: 0.4, display: "inline-block" }} />
                        <span style={{ color: cssVar("text-muted") }}>Target</span>
                        <span className="lisn-num" style={{ color: cssVar("text-primary"), fontWeight: 700, marginLeft: "auto" }}>
                          {row.target}%
                        </span>
                      </div>
                    ) : null}
                  </div>
                );
              }}
            />
            <Legend
              content={() => (
                <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 12, marginTop: 4 }}>
                  {FCR_CHANNEL_DATA.map((d) => (
                    <div key={d.ch} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: FCR_CHANNEL_COLORS[d.ch],
                          display: "inline-block",
                        }}
                      />
                      <span style={{ fontSize: 11, color: cssVar("text-muted") }}>{d.ch}</span>
                    </div>
                  ))}
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 14, height: 0, borderTop: "2px dashed #5332FF", display: "inline-block" }} />
                    <span style={{ fontSize: 11, color: cssVar("text-muted") }}>Last month</span>
                  </div>
                </div>
              )}
            />
            <Bar dataKey="actual" name="Actual" radius={[4, 4, 0, 0]}>
              {FCR_CHANNEL_DATA.map((d) => (
                <Cell key={d.ch} fill={FCR_CHANNEL_COLORS[d.ch]} />
              ))}
            </Bar>
            <Line dataKey="last" name="Last month" stroke="#5332FF" strokeWidth={2} strokeDasharray="4 3" dot={{ r: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>
    </div>
  );
}
