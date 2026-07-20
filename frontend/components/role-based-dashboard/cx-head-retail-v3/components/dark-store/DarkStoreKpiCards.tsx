"use client";

import React from "react";
import {
  FULFILMENT_METRIC_TILES,
  RTO_BENCHMARK,
  type FulfilmentMetricTile,
} from "../../lib/cxHeadRetailV3FulfilmentData";
import { BenchmarkBandTrack } from "../common/BenchmarkBandTrack";
import { cssVar, radius, space, type } from "../../theme/tokens";

function accentColor(accent: FulfilmentMetricTile["accent"]): string {
  if (accent === "high") return cssVar("severity-high");
  if (accent === "positive") return cssVar("positive");
  return cssVar("severity-med");
}

function deltaColor(tone: FulfilmentMetricTile["deltaTone"]): string {
  if (tone === "warn" || tone === "down") return cssVar("severity-high");
  if (tone === "up") return cssVar("positive");
  return cssVar("text-muted");
}

function FulfilmentMetricCard({ tile }: { tile: FulfilmentMetricTile }): React.ReactElement {
  const accent = accentColor(tile.accent);
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
        gap: 8,
        minWidth: 0,
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline" }}>
        <span
          style={{
            fontSize: type.scale.caption,
            fontWeight: type.weight.bold,
            letterSpacing: 0.4,
            textTransform: "uppercase",
            color: accent,
          }}
        >
          {tile.label}
        </span>
        <span className="lisn-num" style={{ fontSize: 11, fontWeight: 700, color: deltaColor(tile.deltaTone) }}>
          {tile.delta}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span className="lisn-num" style={{ fontSize: 26, fontWeight: 800, color: cssVar("text-primary"), lineHeight: 1 }}>
          {tile.value.toFixed(1)}
        </span>
        <span style={{ fontSize: 12, color: cssVar("text-muted") }}>{tile.unit}</span>
      </div>

      <p style={{ margin: 0, fontSize: 11, color: cssVar("text-secondary"), lineHeight: 1.4 }}>{tile.definition}</p>

      {tile.lever ? (
        <div
          style={{
            marginTop: "auto",
            fontSize: 11,
            fontWeight: 700,
            color: cssVar("accent-2"),
            lineHeight: 1.35,
            paddingTop: 4,
          }}
        >
          {tile.lever}
        </div>
      ) : null}

      {tile.id === "rto" ? (
        <div style={{ marginTop: tile.lever ? 0 : "auto", paddingTop: 4 }}>
          <BenchmarkBandTrack
            label="RTO vs India band"
            value={tile.value}
            low={RTO_BENCHMARK.low}
            high={RTO_BENCHMARK.high}
            tag={RTO_BENCHMARK.tag}
            goodWhenHigher={false}
          />
          <div style={{ fontSize: 10, color: cssVar("text-muted"), marginTop: 4, lineHeight: 1.35 }}>
            {RTO_BENCHMARK.costPerRto} · {RTO_BENCHMARK.note}
          </div>
        </div>
      ) : null}
    </article>
  );
}

/**
 * Fulfilment KPI strip — OTIF (customer) · Fill (stock) · NDR · RTO · RTS as distinct metrics.
 * Props kept for call-site compatibility; captions are secondary context under the strip.
 */
export function DarkStoreKpiCards({
  critical,
  focus,
  stable,
}: {
  critical: string;
  focus: string;
  stable: string;
  aiLine: string;
}): React.ReactElement {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: space["3"] }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
        <span style={{ fontSize: 12, fontWeight: 800, color: cssVar("text-primary") }}>
          Fulfilment performance tiles
        </span>
        <span style={{ fontSize: 11, color: cssVar("text-muted") }}>
          OTIF ≠ Fill · RTO ≠ RTS · NDR has a ~24h containment lever
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
          gap: space["3"],
          alignItems: "stretch",
        }}
      >
        {FULFILMENT_METRIC_TILES.map((tile) => (
          <FulfilmentMetricCard key={tile.id} tile={tile} />
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: space["2"],
        }}
      >
        {(
          [
            { label: "Critical hotspot", value: critical },
            { label: "Focus", value: focus },
            { label: "Stable peers", value: stable },
          ] as const
        ).map((row) => (
          <div
            key={row.label}
            style={{
              padding: `${space["2"]} ${space["3"]}`,
              borderRadius: radius.md,
              background: cssVar("surface-raised"),
              border: `1px solid ${cssVar("border")}`,
              fontSize: 11,
              color: cssVar("text-secondary"),
              lineHeight: 1.35,
            }}
          >
            <span style={{ fontWeight: 800, color: cssVar("text-muted"), textTransform: "uppercase", letterSpacing: 0.3 }}>
              {row.label}
            </span>
            <div style={{ marginTop: 2, color: cssVar("text-primary"), fontWeight: 600 }}>{row.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
