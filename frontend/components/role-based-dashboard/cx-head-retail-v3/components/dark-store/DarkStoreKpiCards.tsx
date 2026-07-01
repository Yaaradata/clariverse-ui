"use client";

import React, { useMemo, useState } from "react";
import {
  DARK_STORE_KPI_CARDS,
  type ConfidenceBand,
  type DarkStoreKpiBar,
  type DarkStoreKpiCardConfig,
} from "../../lib/cxHeadRetailData";
import { DarkStoreTrendChart } from "./DarkStoreTrendChart";
import { cssVar, radius, space, type } from "../../theme/tokens";

function accentColor(accent: DarkStoreKpiCardConfig["accent"]): string {
  if (accent === "high") return cssVar("severity-high");
  if (accent === "positive") return cssVar("positive");
  return cssVar("severity-med");
}

function barToneColor(tone: DarkStoreKpiBar["tone"]): string {
  if (tone === "high") return cssVar("severity-high");
  if (tone === "positive") return cssVar("positive");
  return cssVar("severity-med");
}

function deltaColor(tone: DarkStoreKpiCardConfig["deltaTone"]): string {
  if (tone === "warn" || tone === "down") return cssVar("severity-high");
  if (tone === "up") return cssVar("positive");
  return cssVar("text-muted");
}

function MetricBar({ bar }: { bar: DarkStoreKpiBar }): React.ReactElement {
  const color = barToneColor(bar.tone);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: space["2"] }}>
      <span style={{ fontSize: 10, color: cssVar("text-muted"), width: 52, flexShrink: 0 }}>{bar.label}</span>
      <div style={{ flex: 1, height: 6, borderRadius: radius.pill, background: `${color}20` }}>
        <div style={{ height: "100%", width: `${Math.round(bar.pct * 100)}%`, background: color, borderRadius: radius.pill }} />
      </div>
      <span className="lisn-num" style={{ fontSize: 11, fontWeight: type.weight.bold, color, width: 28, textAlign: "right" }}>
        {bar.pct.toFixed(2)}
      </span>
    </div>
  );
}

function CompactDarkStoreKpiCard({ card, caption }: { card: DarkStoreKpiCardConfig; caption: string }): React.ReactElement {
  const accent = accentColor(card.accent);
  const lastDayIndex = card.spark.length - 1;
  const [dayIndex, setDayIndex] = useState(lastDayIndex);

  const bars = useMemo(
    () => card.barsByDay[dayIndex] ?? card.barsByDay[lastDayIndex] ?? [],
    [card.barsByDay, dayIndex, lastDayIndex],
  );

  return (
    <article
      style={{
        background: cssVar("surface"),
        border: `1px solid ${cssVar("border")}`,
        borderTop: `2px solid ${accent}`,
        borderRadius: radius.lg,
        padding: `${space["3"]} ${space["4"]}`,
        display: "flex",
        flexDirection: "column",
        gap: space["3"],
        minWidth: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: space["2"], minWidth: 0 }}>
        <span
          style={{
            fontSize: type.scale.caption,
            fontWeight: type.weight.bold,
            letterSpacing: 0.5,
            textTransform: "uppercase",
            color: accent,
            flexShrink: 0,
          }}
        >
          {card.eyebrow}
        </span>
        <span
          style={{
            fontSize: type.scale.caption,
            color: cssVar("text-secondary"),
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {caption}
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 1fr)",
          gap: space["3"],
          alignItems: "stretch",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", minWidth: 0, position: "relative" }}>
          <span
            className="lisn-num"
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              fontSize: type.scale.caption,
              color: deltaColor(card.deltaTone),
              fontWeight: type.weight.bold,
            }}
          >
            {card.delta}
          </span>
          <div
            className="lisn-num"
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: cssVar("text-primary"),
              lineHeight: 1,
              paddingRight: 52,
              marginBottom: space["1"],
            }}
          >
            {card.primaryValue}
          </div>
          <div style={{ flex: 1, minHeight: 64, width: "100%" }}>
            <DarkStoreTrendChart
              data={card.spark}
              color={accent}
              labels={card.timeline}
              height={64}
              onDayIndexChange={setDayIndex}
            />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 6, minWidth: 0 }}>
          {bars.map((bar) => (
            <MetricBar key={bar.label} bar={bar} />
          ))}
        </div>
      </div>
    </article>
  );
}

const CAPTIONS = ["critical", "focus", "stable"] as const;

/** Compact dark-store KPI row — metric + trend left, bars right. */
export function DarkStoreKpiCards({
  critical,
  focus,
  stable,
}: {
  critical: string;
  focus: string;
  stable: string;
  aiLine: string;
  aiConfidence?: ConfidenceBand;
}): React.ReactElement {
  const captions = { critical, focus, stable };

  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: space["3"],
        alignItems: "stretch",
      }}
    >
      {DARK_STORE_KPI_CARDS.map((card, index) => (
        <CompactDarkStoreKpiCard key={card.id} card={card} caption={captions[CAPTIONS[index]]} />
      ))}
    </section>
  );
}
