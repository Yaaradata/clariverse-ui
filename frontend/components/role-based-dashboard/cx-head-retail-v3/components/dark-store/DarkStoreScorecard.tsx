"use client";

import React, { useMemo, useState } from "react";
import {
  FULFILMENT_HOTSPOT_ROWS,
  FULFILMENT_METRIC_TILES,
  FULFILMENT_SCORECARD_NOTE,
  LAST_MILE_LINES,
  RTO_BENCHMARK,
  sortFulfilmentRows,
  type FulfilmentHotspotRow,
  type FulfilmentSortKey,
  type LastMileLineId,
} from "../../lib/cxHeadRetailV3FulfilmentData";
import { cssVar, radius, space, type } from "../../theme/tokens";

const STATUS_LABEL: Record<FulfilmentHotspotRow["status"], string> = {
  outbreak: "Breaking",
  flat: "Flat",
  nominal: "Nominal",
};

function statusColor(status: FulfilmentHotspotRow["status"]): string {
  if (status === "outbreak") return cssVar("severity-high");
  if (status === "flat") return cssVar("severity-med");
  return cssVar("positive");
}

const SORT_OPTIONS: { id: FulfilmentSortKey; label: string }[] = [
  { id: "hotspot", label: "Hotspot" },
  ...FULFILMENT_METRIC_TILES.map((t) => ({ id: t.id as FulfilmentSortKey, label: t.label })),
];

const COL_TEMPLATE =
  "minmax(0, 1.4fr) minmax(56px, 0.55fr) minmax(56px, 0.55fr) minmax(56px, 0.55fr) minmax(56px, 0.55fr) minmax(56px, 0.55fr) minmax(72px, 0.7fr)";

function LineStrip({ lineId }: { lineId: LastMileLineId }): React.ReactElement | null {
  const line = LAST_MILE_LINES.find((l) => l.id === lineId);
  if (!line) return null;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.2fr) repeat(5, minmax(0, 0.7fr))",
        gap: space["2"],
        padding: `${space["3"]} ${space["4"]}`,
        borderBottom: `1px solid ${cssVar("border")}`,
        background: cssVar("surface-raised"),
        alignItems: "center",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: cssVar("text-primary") }}>
          {line.title}
          <span style={{ fontWeight: 600, color: cssVar("text-muted"), marginLeft: 6 }}>{line.subtitle}</span>
        </div>
        <div style={{ fontSize: 10, color: cssVar("text-muted"), marginTop: 2, lineHeight: 1.35 }}>
          SLA · {line.slaOwner} · RTO · {line.rtoOwner}
        </div>
        <div style={{ fontSize: 11, color: cssVar("text-secondary"), marginTop: 4, lineHeight: 1.35 }}>
          {line.hotspotNote}
        </div>
      </div>
      {(
        [
          ["OTIF", line.otif],
          ["Fill", line.fill],
          ["NDR", line.ndr],
          ["RTO", line.rto],
          ["RTS", line.rts],
        ] as const
      ).map(([label, value]) => (
        <div key={label} style={{ textAlign: "right", minWidth: 0 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: cssVar("text-muted"), textTransform: "uppercase" }}>
            {label}
          </div>
          <div
            className="lisn-num"
            style={{
              fontSize: 15,
              fontWeight: 800,
              color:
                label === "RTO" && (value < RTO_BENCHMARK.low || value > RTO_BENCHMARK.high)
                  ? cssVar("severity-high")
                  : cssVar("text-primary"),
            }}
          >
            {value.toFixed(1)}%
          </div>
        </div>
      ))}
    </div>
  );
}

function ScorecardHeader(): React.ReactElement {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: COL_TEMPLATE,
        gap: space["2"],
        padding: `${space["2"]} ${space["4"]}`,
        fontSize: type.scale.caption,
        fontWeight: type.weight.semibold,
        letterSpacing: 0.35,
        textTransform: "uppercase",
        color: cssVar("text-muted"),
        borderBottom: `1px solid ${cssVar("border")}`,
      }}
    >
      <span>Node · line</span>
      <span style={{ textAlign: "right" }}>OTIF</span>
      <span style={{ textAlign: "right" }}>Fill</span>
      <span style={{ textAlign: "right" }}>NDR</span>
      <span style={{ textAlign: "right" }}>RTO</span>
      <span style={{ textAlign: "right" }}>RTS</span>
      <span style={{ textAlign: "right" }}>Status</span>
    </div>
  );
}

function storeIdFromRow(row: FulfilmentHotspotRow): string {
  const match = row.id.match(/^(DS-[A-Z]+-D\d+)/);
  return match ? match[1] : row.id;
}

export function DarkStoreScorecard({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (storeId: string) => void;
}): React.ReactElement {
  const [sortKey, setSortKey] = useState<FulfilmentSortKey>("hotspot");
  const [lineFilter, setLineFilter] = useState<"all" | LastMileLineId>("all");

  const rows = useMemo(() => {
    const filtered =
      lineFilter === "all"
        ? FULFILMENT_HOTSPOT_ROWS
        : FULFILMENT_HOTSPOT_ROWS.filter((r) => r.line === lineFilter);
    return sortFulfilmentRows(filtered, sortKey);
  }, [sortKey, lineFilter]);

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
          flexDirection: "column",
          gap: space["2"],
          padding: `${space["4"]} ${space["4"]} ${space["3"]}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: space["3"] }}>
          <div style={{ minWidth: 0 }}>
            <h2 style={{ margin: 0, fontSize: type.scale.h3, fontWeight: type.weight.bold, color: cssVar("text-primary") }}>
              Dynamic fulfilment scorecard
            </h2>
            <p style={{ margin: `${space["1"]} 0 0`, fontSize: 11, color: cssVar("text-muted"), lineHeight: 1.4 }}>
              {FULFILMENT_SCORECARD_NOTE}
            </p>
          </div>
          <span
            style={{
              flexShrink: 0,
              fontSize: type.scale.caption,
              fontWeight: type.weight.semibold,
              padding: `${space["1"]} ${space["3"]}`,
              borderRadius: radius.pill,
              background: `${cssVar("accent")}18`,
              color: cssVar("accent"),
              whiteSpace: "nowrap",
            }}
          >
            Hotspot-first
          </span>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: cssVar("text-muted"), textTransform: "uppercase" }}>
            Reorder by
          </span>
          {SORT_OPTIONS.map((opt) => {
            const active = sortKey === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSortKey(opt.id)}
                style={{
                  border: `1px solid ${active ? cssVar("accent") : cssVar("border")}`,
                  background: active ? `${cssVar("accent")}18` : cssVar("surface-raised"),
                  color: active ? cssVar("accent") : cssVar("text-secondary"),
                  borderRadius: radius.pill,
                  padding: "3px 10px",
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: cssVar("text-muted"), textTransform: "uppercase" }}>
            Line
          </span>
          {(
            [
              { id: "all" as const, label: "Both lines" },
              { id: "rider" as const, label: "Rider (own)" },
              { id: "courier" as const, label: "Courier (3PL)" },
            ] as const
          ).map((opt) => {
            const active = lineFilter === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setLineFilter(opt.id)}
                style={{
                  border: `1px solid ${active ? cssVar("accent-2") : cssVar("border")}`,
                  background: active ? `${cssVar("accent-2")}18` : cssVar("surface-raised"),
                  color: active ? cssVar("accent-2") : cssVar("text-secondary"),
                  borderRadius: radius.pill,
                  padding: "3px 10px",
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {(lineFilter === "all" || lineFilter === "rider") && <LineStrip lineId="rider" />}
      {(lineFilter === "all" || lineFilter === "courier") && <LineStrip lineId="courier" />}

      <div style={{ flex: 1, overflow: "auto" }}>
        <ScorecardHeader />
        {rows.map((row) => {
          const storeId = storeIdFromRow(row);
          const selected = storeId === selectedId;
          return (
            <button
              key={row.id}
              type="button"
              onClick={() => onSelect(storeId)}
              style={{
                display: "grid",
                gridTemplateColumns: COL_TEMPLATE,
                gap: space["2"],
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
                <span
                  style={{
                    display: "block",
                    fontSize: type.scale.body,
                    fontWeight: type.weight.semibold,
                    color: cssVar("text-primary"),
                  }}
                >
                  {row.label}
                </span>
                <span style={{ display: "block", fontSize: type.scale.caption, color: cssVar("text-muted"), marginTop: 2 }}>
                  {row.city} · {row.line === "rider" ? "Rider" : "Courier"}
                </span>
              </span>
              <span className="lisn-num" style={{ textAlign: "right", fontSize: 13, fontWeight: 700, color: cssVar("text-primary") }}>
                {row.otif.toFixed(1)}
              </span>
              <span className="lisn-num" style={{ textAlign: "right", fontSize: 13, fontWeight: 700, color: cssVar("text-primary") }}>
                {row.fill.toFixed(1)}
              </span>
              <span className="lisn-num" style={{ textAlign: "right", fontSize: 13, fontWeight: 700, color: cssVar("text-secondary") }}>
                {row.ndr.toFixed(1)}
              </span>
              <span
                className="lisn-num"
                style={{
                  textAlign: "right",
                  fontSize: 13,
                  fontWeight: 800,
                  color:
                    row.rto < RTO_BENCHMARK.low || row.rto > RTO_BENCHMARK.high
                      ? cssVar("severity-high")
                      : cssVar("text-primary"),
                }}
              >
                {row.rto.toFixed(1)}
              </span>
              <span className="lisn-num" style={{ textAlign: "right", fontSize: 13, fontWeight: 700, color: cssVar("text-secondary") }}>
                {row.rts.toFixed(1)}
              </span>
              <span
                style={{
                  justifySelf: "end",
                  fontSize: type.scale.caption,
                  fontWeight: type.weight.bold,
                  padding: `${space["1"]} ${space["2"]}`,
                  borderRadius: radius.pill,
                  background: `${statusColor(row.status)}18`,
                  color: statusColor(row.status),
                  textTransform: "uppercase",
                  letterSpacing: 0.3,
                }}
              >
                {STATUS_LABEL[row.status]}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
