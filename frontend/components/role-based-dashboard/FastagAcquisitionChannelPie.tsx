"use client";

import { useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type {
  AcquisitionMode,
  AcquisitionModeId,
  AcquisitionSubChannel,
  GrowthSignal,
} from "@/lib/fastag-business-performance/data";
import type { getBusinessPerformanceForPeriod } from "@/lib/fastag-business-performance/period-data";
import { fmtTags } from "@/lib/fastag-business-performance/format";
import type { FastagDrillTokens } from "./fastag-drill-ui";

type PieRow = {
  id: string;
  name: string;
  value: number;
  color: string;
  opacity?: number;
};

type AcquisitionBundle = ReturnType<typeof getBusinessPerformanceForPeriod>["acquisitionChannels"];

type FastagAcquisitionChannelPieProps = {
  tokens: FastagDrillTokens;
  acquisition: AcquisitionBundle;
  compact?: boolean;
};

function shadeColor(hex: string, step: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, ((n >> 16) & 0xff) + step);
  const g = Math.min(255, ((n >> 8) & 0xff) + step);
  const b = Math.min(255, (n & 0xff) + step);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function signalStyle(tokens: FastagDrillTokens, signal: GrowthSignal) {
  if (signal === "scale") return { color: tokens.green, bg: "rgba(45,212,167,.15)" };
  if (signal === "protect") return { color: tokens.amber, bg: "rgba(255,176,32,.15)" };
  return { color: tokens.red, bg: "rgba(255,59,70,.15)" };
}

function DetailPanel({
  tokens,
  title,
  subtitle,
  metrics,
  signal,
  insight,
  onBack,
  backLabel,
  compact = false,
}: {
  tokens: FastagDrillTokens;
  title: string;
  subtitle: string;
  metrics: { label: string; value: string }[];
  signal: GrowthSignal;
  insight: string;
  onBack?: () => void;
  backLabel?: string;
  compact?: boolean;
}) {
  const sig = signalStyle(tokens, signal);
  return (
    <div
      style={{
        border: compact ? "none" : `1px solid ${tokens.border}`,
        borderRadius: compact ? 0 : 12,
        background: compact ? "transparent" : tokens.surface2,
        padding: compact ? 0 : 16,
        minHeight: compact ? 0 : 320,
        display: "flex",
        flexDirection: "column",
        gap: compact ? 8 : 12,
      }}
    >
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          style={{
            alignSelf: "flex-start",
            border: `1px solid ${tokens.border2}`,
            background: tokens.surface,
            color: tokens.dim,
            borderRadius: 8,
            padding: "6px 10px",
            fontSize: 11,
            fontFamily: "var(--font-mono)",
            cursor: "pointer",
          }}
        >
          {backLabel ?? "← All modes"}
        </button>
      ) : null}
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, color: tokens.text }}>{title}</div>
        <div style={{ color: tokens.faint, fontSize: 11, marginTop: 4, fontFamily: "var(--font-mono)" }}>{subtitle}</div>
      </div>
      <span
        style={{
          alignSelf: "flex-start",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 0.6,
          textTransform: "uppercase",
          padding: "4px 8px",
          borderRadius: 6,
          color: sig.color,
          background: sig.bg,
        }}
      >
        {signal}
      </span>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: compact ? 6 : 10 }}>
        {metrics.slice(0, compact ? 4 : metrics.length).map((m) => (
          <div key={m.label}>
            <div style={{ color: tokens.faint, fontSize: 10, fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>{m.label}</div>
            <div style={{ fontSize: compact ? 12 : 15, fontWeight: 600, marginTop: 4, fontFamily: "var(--font-mono)", color: tokens.text }}>{m.value}</div>
          </div>
        ))}
      </div>
      {!compact ? (
        <div style={{ marginTop: "auto", color: tokens.dim, fontSize: 12, lineHeight: 1.5, borderTop: `1px solid ${tokens.border}`, paddingTop: 12 }}>
          {insight}
        </div>
      ) : null}
    </div>
  );
}

function metricsForMode(m: AcquisitionMode) {
  return [
    { label: "Share", value: `${m.sharePct}%` },
    { label: "Activations", value: fmtTags(m.activations) },
    { label: "Activation", value: `${m.activationRate}%` },
    { label: "First txn (30d)", value: `${m.firstTxn30d}%` },
    { label: "Rev / tag", value: `INR ${m.revPerTag}` },
    { label: "Growth score", value: `${m.growthScore}` },
    { label: "WoW", value: `${m.wowPct >= 0 ? "+" : ""}${m.wowPct}%` },
  ];
}

function metricsForSub(s: AcquisitionSubChannel) {
  return [
    { label: "Share", value: `${s.sharePct}%` },
    { label: "Activations", value: fmtTags(s.activations) },
    { label: "Activation", value: `${s.activationRate}%` },
    { label: "First txn (30d)", value: `${s.firstTxn30d}%` },
    { label: "Rev / tag", value: `INR ${s.revPerTag}` },
    { label: "Growth score", value: `${s.growthScore}` },
    { label: "WoW", value: `${s.wowPct >= 0 ? "+" : ""}${s.wowPct}%` },
  ];
}

export function FastagAcquisitionChannelPie({ tokens, acquisition: acquisitionChannels, compact = false }: FastagAcquisitionChannelPieProps) {
  const [drillMode, setDrillMode] = useState<AcquisitionModeId | null>(null);
  const [hoverOuter, setHoverOuter] = useState<number | undefined>();
  const [hoverInner, setHoverInner] = useState<number | undefined>();
  const [selectedInner, setSelectedInner] = useState<number | null>(null);

  const modes = acquisitionChannels.modes;

  const outerData: PieRow[] = useMemo(
    () =>
      modes.map((m) => ({
        id: m.id,
        name: m.label,
        value: m.sharePct,
        color: m.color,
        opacity: drillMode && drillMode !== m.id ? 0.35 : 1,
      })),
    [drillMode, modes],
  );

  const drilledMode = drillMode ? modes.find((m) => m.id === drillMode) : null;

  const innerData: PieRow[] = useMemo(() => {
    if (!drilledMode) return [];
    return drilledMode.children.map((c, i) => ({
      id: c.id,
      name: c.label,
      value: c.sharePct,
      color: shadeColor(drilledMode.color, i * 18 - 18),
    }));
  }, [drilledMode]);

  const selectedSub =
    drilledMode && selectedInner !== null ? drilledMode.children[selectedInner] : null;

  const centerLabel = drillMode ? drilledMode?.label ?? "" : "Acquisition";
  const centerSub = drillMode
    ? `${drilledMode?.sharePct ?? 0}% of book`
  : fmtTags(acquisitionChannels.totalActivations);

  const pieH = compact ? 200 : 340;
  const chartW = compact ? 200 : 320;

  const detailPanel =
    selectedSub && drilledMode ? (
      <DetailPanel
        tokens={tokens}
        title={selectedSub.label}
        subtitle={`${drilledMode.label} · ${selectedSub.sharePct}% of activations`}
        metrics={metricsForSub(selectedSub)}
        signal={selectedSub.signal}
        insight={`${selectedSub.label} contributes ${fmtTags(selectedSub.activations)} activations at ${selectedSub.activationRate}% activation — ${selectedSub.signal === "scale" ? "prioritize investment" : selectedSub.signal === "protect" ? "guard margin while growing" : "fix activation quality before scaling"}.`}
        onBack={() => setSelectedInner(null)}
        backLabel={`← ${drilledMode.label}`}
        compact={compact}
      />
    ) : drilledMode ? (
      <DetailPanel
        tokens={tokens}
        title={drilledMode.label}
        subtitle={`${drilledMode.sharePct}% · ${drilledMode.children.length} sub-channels`}
        metrics={metricsForMode(drilledMode)}
        signal={drilledMode.signal}
        insight={drilledMode.insight}
        onBack={() => {
          setDrillMode(null);
          setSelectedInner(null);
        }}
        compact={compact}
      />
    ) : (
      <DetailPanel
        tokens={tokens}
        title="All acquisition modes"
        subtitle={acquisitionChannels.periodLabel}
        metrics={[
          { label: "Total activations", value: fmtTags(acquisitionChannels.totalActivations) },
          { label: "Digital share", value: `${modes[0].sharePct}%` },
          { label: "Physical share", value: `${modes[1].sharePct}%` },
          { label: "Assisted share", value: `${modes[2].sharePct}%` },
          { label: "Best growth score", value: `${modes[0].growthScore} (Digital)` },
          { label: "Watch path", value: "Dealer-assisted" },
        ]}
        signal="protect"
        insight="Click Digital, Physical, or Assisted on the chart — then pick a sub-channel in the inner ring for growth metrics."
        compact={compact}
      />
    );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: compact ? 8 : 12 }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          gap: compact ? 12 : 16,
        }}
      >
        <div style={{ flexShrink: 0, width: chartW, minWidth: 0 }}>
        {!compact ? (
          <div style={{ color: tokens.faint, fontFamily: "var(--font-mono)", fontSize: 11, marginBottom: 8 }}>
            {acquisitionChannels.periodLabel} · click outer ring to drill in
          </div>
        ) : null}
        <div style={{ position: "relative", height: pieH }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                contentStyle={{
                  background: tokens.surface2,
                  border: `1px solid ${tokens.border2}`,
                  borderRadius: 10,
                  fontSize: 12,
                }}
                formatter={(value: number, _name, item: { payload?: PieRow }) => [
                  `${value}% · ${item.payload?.name ?? ""}`,
                  drillMode ? "Sub-channel" : "Mode",
                ]}
              />
              <Pie
                data={outerData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="58%"
                outerRadius="82%"
                paddingAngle={2}
                onMouseEnter={(_, i) => setHoverOuter(i)}
                onMouseLeave={() => setHoverOuter(undefined)}
                onClick={(_, i) => {
                  const mode = modes[i];
                  if (!mode) return;
                  setDrillMode(mode.id);
                  setSelectedInner(null);
                }}
              >
                {outerData.map((row, i) => (
                  <Cell
                    key={row.id}
                    fill={row.color}
                    fillOpacity={hoverOuter === i ? 1 : (row.opacity ?? 1)}
                    stroke={hoverOuter === i ? row.color : tokens.surface}
                    strokeWidth={hoverOuter === i ? 3 : 2}
                  />
                ))}
              </Pie>
              {drillMode && innerData.length > 0 ? (
                <Pie
                  data={innerData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius="30%"
                  outerRadius="52%"
                  paddingAngle={1}
                  onMouseEnter={(_, i) => setHoverInner(i)}
                  onMouseLeave={() => setHoverInner(undefined)}
                  onClick={(_, i) => setSelectedInner(i)}
                >
                  {innerData.map((row, i) => (
                    <Cell
                      key={row.id}
                      fill={row.color}
                      stroke={selectedInner === i || hoverInner === i ? row.color : tokens.surface}
                      strokeWidth={selectedInner === i || hoverInner === i ? 2.5 : 1}
                    />
                  ))}
                </Pie>
              ) : null}
            </PieChart>
          </ResponsiveContainer>
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              pointerEvents: "none",
              maxWidth: 120,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: tokens.text }}>{centerLabel}</div>
            <div style={{ fontSize: 11, color: tokens.faint, fontFamily: "var(--font-mono)", marginTop: 4 }}>{centerSub}</div>
            {!drillMode ? (
              <div style={{ fontSize: 10, color: tokens.faint, marginTop: 6 }}>Tap segment to drill</div>
            ) : null}
          </div>
        </div>
        </div>

        <div style={{ flex: "1 1 220px", minWidth: 0, alignSelf: "center" }}>{detailPanel}</div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: compact ? 8 : 12 }}>
        {modes.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => {
              setDrillMode(m.id);
              setSelectedInner(null);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              border: `1px solid ${drillMode === m.id ? m.color : tokens.border}`,
              background: drillMode === m.id ? `${m.color}18` : tokens.surface,
              borderRadius: 999,
              padding: "6px 12px",
              fontSize: 11,
              color: tokens.text,
              cursor: "pointer",
              fontFamily: "var(--font-mono)",
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: m.color }} />
            {m.label} {m.sharePct}%
          </button>
        ))}
      </div>
    </div>
  );
}
