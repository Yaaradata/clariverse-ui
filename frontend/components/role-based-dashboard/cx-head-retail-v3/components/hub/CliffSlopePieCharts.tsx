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

type SliceItem = { k: string; v: number; pct: number; color: string; insight: string };

function eventColors(mode: EventMode, colors: ColorRamp): Record<string, string> {
  if (mode === "cliff") {
    return {
      "Item missing": colors.severityHigh,
      "Counterfeit suspicion": colors.accent2,
      "Account takeover": "#F472B6",
    };
  }

  return {
    "Delivery delayed": colors.severityMed,
    "Refund not credited": colors.accent,
    "Wrong item on replacement": colors.severityHigh,
    "Damaged on arrival": colors.positive,
  };
}

function EventAiInsight({
  label,
  insight,
  color,
}: {
  label: string;
  insight: string;
  color: string;
}): React.ReactElement {
  return (
    <div
      style={{
        padding: "10px 12px",
        borderRadius: radius.md,
        background: cssVar("accent-soft"),
        border: `1px solid ${cssVar("accent")}33`,
        display: "flex",
        gap: 8,
        alignItems: "flex-start",
      }}
    >
      <Sparkles size={14} color={cssVar("accent-2")} style={{ flexShrink: 0, marginTop: 1 }} />
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: cssVar("accent-2"),
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            AI insight
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, color }}>{label}</span>
        </div>
        <p style={{ margin: 0, fontSize: 12, color: cssVar("text-secondary"), lineHeight: 1.45 }}>{insight}</p>
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
  const colorMap = eventColors(mode, colors);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  useEffect(() => {
    setSelectedKey(null);
  }, [mode, negTotal]);

  const scaledSource = useMemo(
    () => source.map((e) => ({ ...e, v: scaleAnxietyNegUnits(e.v, negTotal) })),
    [negTotal, source],
  );

  const total = useMemo(() => scaledSource.reduce((sum, e) => sum + e.v, 0), [scaledSource]);
  const unitLabel = mode === "cliff" ? "incidents" : "signals";
  const accent = mode === "cliff" ? colors.severityHigh : colors.severityMed;

  const slices = useMemo<SliceItem[]>(() => {
    return scaledSource.map((e) => ({
      k: e.k,
      v: e.v,
      pct: total > 0 ? Math.round((e.v / total) * 100) : 0,
      color: colorMap[e.k] ?? colors.accent,
      insight: e.insight,
    }));
  }, [colorMap, colors.accent, scaledSource, total]);

  const selectedSlice = slices.find((s) => s.k === selectedKey) ?? null;

  const { data, layout } = useMemo(() => {
    const sliceColors = slices.map((s) => s.color);
    const maxV = Math.max(...slices.map((s) => s.v));
    const pull = slices.map((s) => {
      if (selectedKey === s.k) return 0.08;
      if (!selectedKey && s.v === maxV) return 0.05;
      return 0;
    });

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
    <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 10 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(148px, 1fr) minmax(0, 1.15fr)",
          gap: 12,
          alignItems: "center",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <Plot
            data={data}
            layout={layout}
            config={{
              displayModeBar: false,
              responsive: true,
            }}
            style={{ width: "100%", height: "100%" }}
            useResizeHandler
            onClick={handlePlotClick}
          />
        </div>

        <SliceLegend items={slices} colors={colors} mode={mode} selectedKey={selectedKey} onSelect={setSelectedKey} />
      </div>

      {selectedSlice ? (
        <EventAiInsight label={selectedSlice.k} insight={selectedSlice.insight} color={selectedSlice.color} />
      ) : null}
    </div>
  );
}
