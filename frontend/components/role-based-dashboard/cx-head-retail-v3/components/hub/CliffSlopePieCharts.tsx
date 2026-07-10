"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import createPlotlyComponent from "react-plotly.js/factory";
import Plotly from "plotly.js-dist-min";
import type { Data, Layout, PlotMouseEvent } from "plotly.js";
import { ANXIETY_CLIFF_EVENTS, ANXIETY_SLOPE_EVENTS, scaleAnxietyNegUnits } from "../../lib/cxHeadRetailV3AnxietyData";
import { cssVar, palette, radius, type ColorRamp } from "../../theme/tokens";
import { anxietyFmt } from "./AnxietyPrimitives";
import { useAnimatedNumber } from "../../lib/useAnimatedNumber";

const Plot = createPlotlyComponent(Plotly);

type EventMode = "cliff" | "slope";

export type CliffSlopeEventMode = EventMode;

const SLOPE_ITEMS = ANXIETY_SLOPE_EVENTS.slice(0, 4);

type EventInsight = {
  headline: string;
  signal: string;
  impact: string;
  action: string;
  owner: string;
  confidence: number;
};

type SliceItem = { k: string; v: number; pct: number; color: string; insight: EventInsight };

/** Rank-based palette: majority red, lowest green, middles in between. */
function colorsByVolumeRank(colors: ColorRamp, count: number): string[] {
  if (count <= 0) return [];
  if (count === 1) return [colors.severityHigh];
  if (count === 2) return [colors.severityHigh, colors.positive];

  const middle = [colors.severityMed, colors.accent, colors.accent2];
  const result: string[] = [colors.severityHigh];
  for (let i = 1; i < count - 1; i++) {
    result.push(middle[Math.min(i - 1, middle.length - 1)]!);
  }
  result.push(colors.positive);
  return result;
}

function assignSliceColors(
  items: readonly { k: string; v: number }[],
  colors: ColorRamp,
): Record<string, string> {
  const ranked = [...items].sort((a, b) => b.v - a.v);
  const paletteByRank = colorsByVolumeRank(colors, ranked.length);
  return Object.fromEntries(ranked.map((item, i) => [item.k, paletteByRank[i]!]));
}

function EventAiInsight({
  insight,
  color,
}: {
  insight: EventInsight;
  color: string;
}): React.ReactElement {
  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        borderRadius: radius.lg,
        border: `1px solid ${cssVar("border")}`,
        background: cssVar("surface-raised"),
        display: "grid",
        gridTemplateColumns: "4px 1fr",
        overflow: "hidden",
      }}
    >
      <div style={{ background: color }} />

      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <span
            title="Model inference — treat as probabilistic, not fact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              fontWeight: 700,
              borderRadius: radius.pill,
              padding: "3px 8px",
              background: cssVar("accent-soft"),
              color: cssVar("accent-2"),
              border: `1px solid ${cssVar("accent")}55`,
            }}
          >
            <Sparkles size={11} strokeWidth={2.4} /> AI Confidence
            <b className="lisn-num" style={{ fontWeight: 600 }}>
              {insight.confidence}%
            </b>
          </span>
          <span style={{ fontSize: 11, color: cssVar("text-muted"), whiteSpace: "nowrap" }}>
            Owner · <span style={{ fontWeight: 700, color: cssVar("text-primary") }}>{insight.owner}</span>
          </span>
        </div>

        <div style={{ fontSize: 14, fontWeight: 800, color: cssVar("text-primary"), lineHeight: 1.3 }}>
          {insight.headline}
        </div>

        <p style={{ margin: 0, fontSize: 13, color: cssVar("text-secondary"), lineHeight: 1.45 }}>
          {insight.signal} — {insight.impact}
        </p>

        <div
          style={{
            padding: "8px 10px",
            borderRadius: radius.md,
            border: `1px solid ${color}44`,
            background: `color-mix(in srgb, ${color} 12%, transparent)`,
          }}
        >
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 0.35, textTransform: "uppercase", color, marginBottom: 3 }}>
            Act now
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: cssVar("text-primary"), lineHeight: 1.4 }}>
            {insight.action}
          </div>
        </div>
      </div>
    </div>
  );
}

function SliceLegend({
  items,
  colors,
  mode,
  selectedKey,
  onSelect,
}: {
  items: SliceItem[];
  colors: ColorRamp;
  mode: EventMode;
  selectedKey: string | null;
  onSelect: (key: string) => void;
}): React.ReactElement {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((item) => (
        <SliceLegendRow key={item.k} item={item} colors={colors} mode={mode} selected={selectedKey === item.k} onSelect={onSelect} />
      ))}
    </div>
  );
}

function SliceLegendRow({
  item,
  colors,
  mode,
  selected,
  onSelect,
}: {
  item: SliceItem;
  colors: ColorRamp;
  mode: EventMode;
  selected: boolean;
  onSelect: (key: string) => void;
}): React.ReactElement {
  const animatedValue = useAnimatedNumber(item.v, { duration: 900, delay: 80 });
  const animatedPct = useAnimatedNumber(item.pct, { duration: 900, delay: 120 });

  return (
    <button
      type="button"
      onClick={() => onSelect(item.k)}
      style={{
        display: "grid",
        gridTemplateColumns: "10px 1fr auto",
        gap: "8px 10px",
        alignItems: "center",
        width: "100%",
        padding: "6px 8px",
        margin: "-6px -8px",
        border: `1px solid ${selected ? item.color : "transparent"}`,
        borderRadius: radius.md,
        background: selected ? `${item.color}12` : "transparent",
        cursor: "pointer",
        textAlign: "left",
        transition: "border-color 0.15s ease, background 0.15s ease",
      }}
    >
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: radius.sm,
          background: item.color,
          boxShadow: `0 0 0 1px ${colors.border}`,
          flexShrink: 0,
        }}
      />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: colors.textPrimary, lineHeight: 1.25 }}>{item.k}</div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div className="lisn-num" style={{ fontSize: 12, fontWeight: 700, color: colors.textPrimary, lineHeight: 1.2 }}>
          {mode === "cliff" ? animatedValue : anxietyFmt(animatedValue)}
        </div>
        <div className="lisn-num" style={{ fontSize: 10, color: colors.textMuted, marginTop: 2 }}>
          {animatedPct}%
        </div>
      </div>
    </button>
  );
}

export function CliffSlopePieCharts({
  mode,
  negTotal,
}: {
  mode: CliffSlopeEventMode;
  negTotal: number;
}): React.ReactElement {
  const colors = palette.dark;
  const source = mode === "cliff" ? ANXIETY_CLIFF_EVENTS : SLOPE_ITEMS;
  const [selectedKey, setSelectedKey] = useState<string>(source[0]!.k);

  const scaledSource = useMemo(
    () => source.map((e) => ({ ...e, v: scaleAnxietyNegUnits(e.v, negTotal) })),
    [negTotal, source],
  );

  const majorityKey = useMemo(() => {
    if (scaledSource.length === 0) return source[0]!.k;
    return scaledSource.reduce((best, s) => (s.v > best.v ? s : best), scaledSource[0]!).k;
  }, [scaledSource, source]);

  useEffect(() => {
    setSelectedKey(majorityKey);
  }, [majorityKey, mode]);

  const total = useMemo(() => scaledSource.reduce((sum, e) => sum + e.v, 0), [scaledSource]);
  const unitLabel = mode === "cliff" ? "incidents" : "signals";
  const colorMap = useMemo(() => assignSliceColors(scaledSource, colors), [colors, scaledSource]);

  const slices = useMemo<SliceItem[]>(() => {
    return scaledSource.map((e) => ({
      k: e.k,
      v: e.v,
      pct: total > 0 ? Math.round((e.v / total) * 100) : 0,
      color: colorMap[e.k] ?? colors.accent,
      insight: e.insight,
    }));
  }, [colorMap, colors.accent, scaledSource, total]);

  const majorityColor = useMemo(() => {
    if (slices.length === 0) return colors.severityHigh;
    return slices.reduce((best, s) => (s.v > best.v ? s : best), slices[0]!).color;
  }, [colors.severityHigh, slices]);

  const accent = majorityColor;

  const selectedSlice = slices.find((s) => s.k === selectedKey) ?? slices.find((s) => s.k === majorityKey) ?? null;

  const { data, layout } = useMemo(() => {
    const sliceColors = slices.map((s) => s.color);
    const pull = slices.map((s) => (selectedKey === s.k ? 0.08 : 0));

    const trace: Data = {
      type: "pie",
      labels: slices.map((s) => s.k),
      values: slices.map((s) => s.v),
      hole: 0.56,
      pull,
      marker: {
        colors: sliceColors,
        line: { color: colors.bg, width: 2.5 },
      },
      text: slices.map((s) => (s.pct >= 10 ? `${s.pct}%` : "")),
      textposition: "inside",
      insidetextfont: { color: "#FFFFFF", size: 11, family: "Inter, system-ui, sans-serif" },
      textinfo: "text",
      hovertemplate:
        mode === "cliff"
          ? "<b>%{label}</b><br>%{value} incidents · %{percent}<extra></extra>"
          : "<b>%{label}</b><br>%{value:,} signals · %{percent}<extra></extra>",
      hoverlabel: {
        bgcolor: colors.surfaceRaised,
        bordercolor: colors.border,
        font: { color: colors.textPrimary, size: 11, family: "Inter, system-ui, sans-serif" },
      },
      sort: false,
      rotation: 18,
      direction: "clockwise",
    };

    const centerValue = mode === "cliff" ? String(total) : anxietyFmt(total);

    const plotLayout: Partial<Layout> = {
      paper_bgcolor: "transparent",
      plot_bgcolor: "transparent",
      autosize: true,
      height: 240,
      margin: { t: 8, r: 8, b: 8, l: 8 },
      font: {
        family: "Inter, system-ui, sans-serif",
        size: 11,
        color: colors.textSecondary,
      },
      showlegend: false,
      annotations: [
        {
          x: 0.5,
          y: 0.54,
          xref: "paper",
          yref: "paper",
          text: centerValue,
          showarrow: false,
          font: {
            size: 24,
            color: accent,
            family: "var(--lisn-font-numeric), Inter, system-ui, sans-serif",
          },
          align: "center",
        },
        {
          x: 0.5,
          y: 0.44,
          xref: "paper",
          yref: "paper",
          text: `${mode === "cliff" ? "Cliff" : "Slope"} ${unitLabel}`,
          showarrow: false,
          font: {
            size: 10,
            color: colors.textMuted,
            family: "Inter, system-ui, sans-serif",
          },
          align: "center",
        },
      ],
    };

    return { data: [trace], layout: plotLayout };
  }, [accent, colors.bg, colors.border, colors.surfaceRaised, colors.textMuted, colors.textPrimary, mode, selectedKey, slices, total, unitLabel]);

  const handlePlotClick = (event: Readonly<PlotMouseEvent>): void => {
    const pointNumber = event.points?.[0]?.pointNumber;
    if (typeof pointNumber === "number") {
      const slice = slices[pointNumber];
      if (slice) setSelectedKey(slice.k);
    }
  };

  return (
    <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(148px, 1fr) minmax(0, 1.15fr)",
          gap: 12,
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <div style={{ minWidth: 0, height: 240, overflow: "hidden", position: "relative" }}>
          <Plot
            data={data}
            layout={layout}
            config={{
              displayModeBar: false,
              responsive: true,
            }}
            style={{ width: "100%", height: 240 }}
            useResizeHandler
            onClick={handlePlotClick}
          />
        </div>

        <SliceLegend items={slices} colors={colors} mode={mode} selectedKey={selectedKey} onSelect={setSelectedKey} />
      </div>

      {selectedSlice ? (
        <EventAiInsight
          insight={selectedSlice.insight}
          color={selectedSlice.color}
        />
      ) : null}
    </div>
  );
}
