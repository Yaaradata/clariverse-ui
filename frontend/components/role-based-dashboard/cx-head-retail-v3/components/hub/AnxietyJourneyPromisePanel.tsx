"use client";

import React, { useMemo, useState } from "react";
import {
  Package,
  RotateCcw,
  Truck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { AnxietyPeriodData } from "../../lib/cxHeadRetailV3AnxietyData";
import {
  ANXIETY_CAT_RELIABILITY,
  ANXIETY_NODE_DRILL,
  ANXIETY_NODE_SPLIT,
} from "../../lib/cxHeadRetailV3AnxietyData";
import { cssVar, radius } from "../../theme/tokens";
import { anxietyFmt } from "./AnxietyPrimitives";

const IPD_TARGET = 92;
const ROW_LABEL_WIDTH = 144;

const RAG = {
  green: cssVar("positive"),
  amber: cssVar("severity-med"),
  red: cssVar("severity-high"),
} as const;

const RISK_MEDIUM_THRESHOLD = 0.42;

function tint(color: string, amount: number): string {
  return `color-mix(in srgb, ${color} ${amount}%, transparent)`;
}

type MatrixCell = {
  units: number;
  anxietyScore: number;
  ipdMet: number;
};

type HoveredCell = MatrixCell & {
  node: string;
  category: string;
};

type RiskTier = {
  label: string;
  color: string;
  bg: string;
};

/** Anxiety exposure amplified when category IPD sits below the 92% target. */
function riskScore(cell: MatrixCell): number {
  const ipdGap = Math.max(0, IPD_TARGET - cell.ipdMet);
  const reliabilityStress = 0.55 + ipdGap / 16;
  return (cell.anxietyScore / 100) * reliabilityStress;
}

function riskIndex(cell: MatrixCell): number {
  return Math.round(riskScore(cell) * 100);
}

function riskTier(score: number, cell: MatrixCell): RiskTier {
  const ipdGap = Math.max(0, IPD_TARGET - cell.ipdMet);
  const isHigh =
    cell.anxietyScore >= 85 ||
    score >= 0.84 ||
    (score >= 0.72 && cell.anxietyScore >= 76 && ipdGap >= 4);
  const isMedium = !isHigh && (score >= RISK_MEDIUM_THRESHOLD || (cell.anxietyScore >= 64 && ipdGap >= 3));

  if (isHigh) {
    return { label: "HIGH", color: RAG.red, bg: tint(RAG.red, 30) };
  }
  if (isMedium) {
    return { label: "MEDIUM", color: RAG.amber, bg: tint(RAG.amber, 30) };
  }
  return { label: "LOW", color: RAG.green, bg: tint(RAG.green, 30) };
}

const NODE_META: Record<string, { icon: LucideIcon; color: string }> = {
  "Last-mile": { icon: Truck, color: cssVar("severity-high") },
  "In-transit": { icon: Package, color: cssVar("severity-med") },
  Returns: { icon: RotateCcw, color: cssVar("accent") },
  Installation: { icon: Wrench, color: cssVar("positive") },
};

function CategoryHeader({ name }: { name: string }): React.ReactElement {
  return (
    <div style={{ flex: 1, padding: "0 4px 12px", textAlign: "center", minWidth: 0 }}>
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          lineHeight: 1.35,
          color: cssVar("text-muted"),
          display: "block",
        }}
      >
        {name}
      </span>
    </div>
  );
}

function NodeRowLabel({
  name,
  accent,
  icon: Icon,
}: {
  name: string;
  accent: string;
  icon: LucideIcon;
}): React.ReactElement {
  return (
    <div
      style={{
        width: ROW_LABEL_WIDTH,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        gap: 8,
        paddingRight: 12,
        paddingTop: 8,
        paddingBottom: 8,
      }}
    >
      <Icon size={16} color={accent} style={{ flexShrink: 0 }} />
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
          color: cssVar("text-primary"),
          lineHeight: 1.25,
        }}
      >
        {name}
      </span>
    </div>
  );
}

function MatrixHeatmapCell({
  cell,
  node,
  category,
  selected,
  onSelect,
}: {
  cell: MatrixCell;
  node: string;
  category: string;
  selected: boolean;
  onSelect: () => void;
}): React.ReactElement {
  const score = riskScore(cell);
  const tier = riskTier(score, cell);
  const index = riskIndex(cell);

  return (
    <div style={{ flex: 1, padding: "0 2px", minWidth: 88, position: "relative" }}>
      <button
        type="button"
        onClick={onSelect}
        style={{
          position: "relative",
          width: "100%",
          padding: 8,
          borderRadius: radius.lg,
          cursor: "pointer",
          background: tier.bg,
          border: selected ? `2px solid ${tier.color}` : `1px solid ${tint(tier.color, 50)}`,
          transform: selected ? "scale(1.02)" : "scale(1)",
          boxShadow: selected ? `0 4px 12px ${tint(tier.color, 25)}` : "none",
          transition: "transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 4 }}>
          <span className="lisn-num" style={{ fontSize: 18, fontWeight: 800, color: tier.color, lineHeight: 1 }}>
            {index}
          </span>
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              textTransform: "uppercase",
              color: tier.color,
            }}
          >
            {tier.label}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4 }}>
          <span style={{ fontSize: 9, color: cssVar("text-muted") }}>Units {anxietyFmt(cell.units)}</span>
          <span style={{ fontSize: 9, color: cssVar("text-muted") }}>IPD {cell.ipdMet}%</span>
        </div>

        {selected ? (
          <div
            style={{
              position: "absolute",
              zIndex: 50,
              bottom: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              marginBottom: 8,
              padding: 12,
              borderRadius: radius.xl,
              background: cssVar("surface-raised"),
              border: `1px solid ${cssVar("border-strong")}`,
              boxShadow: cssVar("shadow-card"),
              minWidth: 180,
              pointerEvents: "none",
            }}
          >
            <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 700, color: cssVar("text-primary") }}>{category}</p>
            <p style={{ margin: "0 0 8px", fontSize: 10, color: cssVar("text-muted") }}>
              {node} × {category}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span style={{ fontSize: 10, color: cssVar("text-muted") }}>Risk index</span>
                <span className="lisn-num" style={{ fontSize: 12, fontWeight: 700, color: tier.color }}>
                  {index}/100
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span style={{ fontSize: 10, color: cssVar("text-muted") }}>Anxiety score</span>
                <span className="lisn-num" style={{ fontSize: 12, fontWeight: 600, color: cssVar("text-primary") }}>
                  {cell.anxietyScore}/100
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span style={{ fontSize: 10, color: cssVar("text-muted") }}>Anxious units</span>
                <span className="lisn-num" style={{ fontSize: 12, fontWeight: 600, color: cssVar("text-primary") }}>
                  {anxietyFmt(cell.units)}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span style={{ fontSize: 10, color: cssVar("text-muted") }}>Category IPD-met</span>
                <span className="lisn-num" style={{ fontSize: 12, fontWeight: 600, color: cssVar("text-primary") }}>
                  {cell.ipdMet}%
                </span>
              </div>
            </div>
            <div
              aria-hidden
              style={{
                position: "absolute",
                width: 8,
                height: 8,
                bottom: -5,
                left: "50%",
                transform: "translateX(-50%) rotate(45deg)",
                background: cssVar("surface-raised"),
                borderRight: `1px solid ${cssVar("border-strong")}`,
                borderBottom: `1px solid ${cssVar("border-strong")}`,
              }}
            />
          </div>
        ) : null}
      </button>
    </div>
  );
}

export type JourneyTopHotspot = HoveredCell;

export function getJourneyMatrixTopHotspot(d: AnxietyPeriodData): JourneyTopHotspot | undefined {
  const categories = ANXIETY_CAT_RELIABILITY.map((c) => c.k);
  const ipdByCategory = Object.fromEntries(ANXIETY_CAT_RELIABILITY.map((c) => [c.k, c.v])) as Record<string, number>;
  const hotspots: HoveredCell[] = [];

  for (const n of ANXIETY_NODE_SPLIT) {
    const drillCats = ANXIETY_NODE_DRILL[n.key]?.category ?? [];
    for (const cat of categories) {
      const match = drillCats.find(([name]) => name === cat);
      if (!match) continue;
      const [, units, anxietyScore] = match;
      hotspots.push({
        node: n.key,
        category: cat,
        units,
        anxietyScore,
        ipdMet: ipdByCategory[cat],
      });
    }
  }

  return hotspots.sort((a, b) => b.units * riskScore(b) - a.units * riskScore(a))[0];
}

const MATRIX_LEGEND_ITEMS = [
  { label: "Low risk", color: RAG.green },
  { label: "Medium risk", color: RAG.amber },
  { label: "High risk", color: RAG.red },
] as const;

export function JourneyMatrixLegend({
  topHotspot,
}: {
  topHotspot?: JourneyTopHotspot;
}): React.ReactElement {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        alignItems: "center",
        fontSize: 10,
        color: cssVar("text-primary"),
      }}
    >
      {MATRIX_LEGEND_ITEMS.map((item) => (
        <span key={item.label} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 3,
              background: tint(item.color, 32),
              border: `1px solid ${item.color}`,
            }}
          />
          {item.label}
        </span>
      ))}
      <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
        <span style={{ width: 1, height: 10, background: cssVar("text-muted"), opacity: 0.7 }} />
        {IPD_TARGET}% IPD target
      </span>
      {topHotspot ? (
        <span style={{ fontSize: 11, fontWeight: 600, color: cssVar("text-primary") }}>
          Top intersection: {topHotspot.node} × {topHotspot.category}
        </span>
      ) : null}
    </div>
  );
}

export function AnxietyJourneyPromisePanel({
  d,
}: {
  d: AnxietyPeriodData;
}): React.ReactElement {
  const [selected, setSelected] = useState<{ node: string; category: string } | null>(null);

  const categories = useMemo(() => ANXIETY_CAT_RELIABILITY.map((c) => c.k), []);
  const ipdByCategory = useMemo(
    () => Object.fromEntries(ANXIETY_CAT_RELIABILITY.map((c) => [c.k, c.v])) as Record<string, number>,
    [],
  );

  const nodeRows = useMemo(() => {
    return ANXIETY_NODE_SPLIT.map((n) => {
      const totalUnits = Math.round(d.high * n.prop);
      const drillCats = ANXIETY_NODE_DRILL[n.key]?.category ?? [];
      const cells: Record<string, MatrixCell | null> = {};

      for (const cat of categories) {
        const match = drillCats.find(([name]) => name === cat);
        if (!match) {
          cells[cat] = null;
          continue;
        }
        const [, units, anxietyScore] = match;
        cells[cat] = {
          units,
          anxietyScore,
          ipdMet: ipdByCategory[cat],
        };
      }

      return { key: n.key, totalUnits, share: Math.round(n.prop * 100), cells };
    });
  }, [categories, d.high, ipdByCategory]);

  return (
    <div
      style={{
        padding: 20,
        borderRadius: radius.xl,
        background: tint(cssVar("surface"), 85),
        border: `1px solid ${tint(cssVar("text-primary"), 10)}`,
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <div style={{ minWidth: 980 }}>
          <div style={{ display: "flex" }}>
            <div style={{ width: ROW_LABEL_WIDTH, flexShrink: 0 }} />
            {categories.map((cat) => (
              <CategoryHeader key={cat} name={cat} />
            ))}
          </div>

          {nodeRows.map((row) => {
            const meta = NODE_META[row.key] ?? { icon: Package, color: cssVar("accent") };

            return (
              <div key={row.key} style={{ display: "flex", marginBottom: 4, alignItems: "stretch" }}>
                <NodeRowLabel name={row.key} accent={meta.color} icon={meta.icon} />

                {categories.map((cat) => {
                  const cell = row.cells[cat];

                  if (!cell) {
                    return (
                      <div
                        key={`${row.key}-${cat}`}
                        style={{
                          flex: 1,
                          padding: "0 2px",
                          minWidth: 88,
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            minHeight: 64,
                            borderRadius: radius.lg,
                            background: cssVar("surface"),
                            border: `1px dashed ${cssVar("border")}`,
                            display: "grid",
                            placeItems: "center",
                            fontSize: 14,
                            fontWeight: 700,
                            color: cssVar("text-muted"),
                          }}
                        >
                          —
                        </div>
                      </div>
                    );
                  }

                  const isSelected = selected?.node === row.key && selected?.category === cat;

                  return (
                    <MatrixHeatmapCell
                      key={`${row.key}-${cat}`}
                      cell={cell}
                      node={row.key}
                      category={cat}
                      selected={isSelected}
                      onSelect={() =>
                        setSelected(isSelected ? null : { node: row.key, category: cat })
                      }
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
