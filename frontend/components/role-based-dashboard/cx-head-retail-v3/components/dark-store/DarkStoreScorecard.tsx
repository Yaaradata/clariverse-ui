"use client";

import React, { useMemo } from "react";
import { DARK_STORES, type DarkStoreNode, type DarkStoreTrend7d } from "../../lib/cxHeadRetailData";
import { cssVar, radius, space, type } from "../../theme/tokens";

const STATUS_ORDER: Record<DarkStoreNode["status"], number> = {
  outbreak: 0,
  flat: 1,
  nominal: 2,
};

const STATUS_LABEL: Record<DarkStoreNode["status"], string> = {
  outbreak: "Breaking",
  flat: "Flat",
  nominal: "Nominal",
};

function statusColor(status: DarkStoreNode["status"]): string {
  if (status === "outbreak") return cssVar("severity-high");
  if (status === "flat") return cssVar("severity-med");
  return cssVar("positive");
}

const COL_TEMPLATE =
  "minmax(0, 1.35fr) minmax(68px, 0.65fr) minmax(80px, 0.75fr) minmax(88px, 0.85fr) minmax(68px, 0.6fr)";

function trendColor(direction: DarkStoreTrend7d["direction"]): string {
  if (direction === "up") return cssVar("severity-high");
  if (direction === "down") return cssVar("positive");
  return cssVar("text-muted");
}

function Trend7dBars({ data, color }: { data: number[]; color: string }): React.ReactElement {
  const max = Math.max(...data, 0.01);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "flex-end",
        gap: 2,
        height: 24,
        width: 64,
      }}
    >
      {data.map((value, index) => {
        const isLatest = index === data.length - 1;
        const heightPct = Math.max(14, (value / max) * 100);
        return (
          <div
            key={index}
            style={{
              flex: 1,
              height: `${heightPct}%`,
              minHeight: 3,
              borderRadius: 2,
              background: color,
              opacity: isLatest ? 1 : 0.35 + (index / data.length) * 0.45,
            }}
          />
        );
      })}
    </div>
  );
}

function Trend7dCell({ trend }: { trend: DarkStoreTrend7d }): React.ReactElement {
  const color = trendColor(trend.direction);
  return (
    <span
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 3,
        minWidth: 0,
      }}
    >
      <Trend7dBars data={trend.spark} color={color} />
      <span className="lisn-num" style={{ fontSize: type.scale.caption, fontWeight: type.weight.semibold, color }}>
        {trend.delta}
      </span>
    </span>
  );
}

function ScorecardHeader(): React.ReactElement {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: COL_TEMPLATE,
        gap: space["3"],
        padding: `${space["2"]} ${space["4"]}`,
        fontSize: type.scale.caption,
        fontWeight: type.weight.semibold,
        letterSpacing: 0.4,
        textTransform: "uppercase",
        color: cssVar("text-muted"),
        borderBottom: `1px solid ${cssVar("border")}`,
      }}
    >
      <span>Dark-store</span>
      <span style={{ textAlign: "right" }}>Issue / 1k</span>
      <span style={{ textAlign: "right" }}>vs baseline</span>
      <span style={{ textAlign: "right" }}>Trend (7D)</span>
      <span style={{ textAlign: "right" }}>Status</span>
    </div>
  );
}

export function DarkStoreScorecard({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (storeId: string) => void;
}): React.ReactElement {
  const rows = useMemo(
    () =>
      [...DARK_STORES].sort((a, b) => {
        const statusDiff = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
        if (statusDiff !== 0) return statusDiff;
        return b.peerMultiple - a.peerMultiple;
      }),
    [],
  );

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        borderRadius: radius.lg,
        background: cssVar("surface"),
        border: `1px solid ${cssVar("border")}`,
        overflow: "hidden",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: space["3"],
          padding: `${space["4"]} ${space["4"]} ${space["3"]}`,
        }}
      >
        <h2 style={{ margin: 0, fontSize: type.scale.h3, fontWeight: type.weight.bold, color: cssVar("text-primary") }}>
          Catchment scorecard
        </h2>
        <span
          style={{
            fontSize: type.scale.caption,
            fontWeight: type.weight.semibold,
            padding: `${space["1"]} ${space["3"]}`,
            borderRadius: radius.pill,
            background: `${cssVar("accent")}18`,
            color: cssVar("accent"),
            whiteSpace: "nowrap",
          }}
        >
          All cities
        </span>
      </div>

      <div style={{ flex: 1, overflow: "auto" }}>
        <ScorecardHeader />
        {rows.map((store) => {
          const selected = store.id === selectedId;
          return (
            <button
              key={store.id}
              type="button"
              onClick={() => onSelect(store.id)}
              style={{
                display: "grid",
                gridTemplateColumns: COL_TEMPLATE,
                gap: space["3"],
                width: "100%",
                padding: `${space["3"]} ${space["4"]}`,
                border: "none",
                borderBottom: `1px solid ${cssVar("border")}`,
                borderLeft: selected ? `3px solid ${cssVar("accent")}` : "3px solid transparent",
                background: selected ? `${cssVar("accent")}0c` : "transparent",
                cursor: "pointer",
                textAlign: "left",
                alignItems: "center",
              }}
            >
              <span style={{ minWidth: 0 }}>
                <span style={{ display: "block", fontSize: type.scale.body, fontWeight: type.weight.semibold, color: cssVar("text-primary") }}>
                  {store.label}
                </span>
                <span style={{ display: "block", fontSize: type.scale.caption, color: cssVar("text-muted"), marginTop: 2 }}>
                  {store.city}
                </span>
              </span>
              <span className="lisn-num" style={{ textAlign: "right", fontSize: type.scale.body, fontWeight: type.weight.bold, color: statusColor(store.status) }}>
                {store.issueRate.toFixed(1)}
              </span>
              <span className="lisn-num" style={{ textAlign: "right", fontSize: type.scale.body, fontWeight: type.weight.semibold, color: cssVar("text-secondary") }}>
                {store.peerMultiple}×
              </span>
              <Trend7dCell trend={store.trend7d} />
              <span
                style={{
                  justifySelf: "end",
                  fontSize: type.scale.caption,
                  fontWeight: type.weight.bold,
                  padding: `${space["1"]} ${space["2"]}`,
                  borderRadius: radius.pill,
                  background: `${statusColor(store.status)}18`,
                  color: statusColor(store.status),
                  textTransform: "uppercase",
                  letterSpacing: 0.3,
                }}
              >
                {STATUS_LABEL[store.status]}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
