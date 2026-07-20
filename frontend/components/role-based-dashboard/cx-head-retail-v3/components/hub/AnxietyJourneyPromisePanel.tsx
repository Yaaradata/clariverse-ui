"use client";

import React, { useMemo, useState } from "react";
import {
  Package,
  RotateCcw,
  Sparkles,
  Truck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import {
  adjustMatrixAnxietyScore,
  adjustMatrixIpdMet,
  ANXIETY_CAT_RELIABILITY,
  ANXIETY_NODE_DRILL,
  ANXIETY_NODE_SPLIT,
  scaleAnxietyUnits,
  type AnxietyPeriodData,
} from "../../lib/cxHeadRetailV3AnxietyData";
import { cssVar, radius } from "../../theme/tokens";
import { ConfidenceChip } from "../common/ConfidenceBand";
import { anxietyFmt } from "./AnxietyPrimitives";
import { useAnimatedNumber } from "../../lib/useAnimatedNumber";

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

type SelectedMatrixCell = HoveredCell;

const NODE_INSIGHT_ACTION: Record<string, string> = {
  "Last-mile": "Fire honest re-promise + revised ETA containment before the contact window closes.",
  "In-transit": "Push proactive lane status — anxiety is building in-hub before breach surfaces at last-mile.",
  Returns: "Accelerate return re-initiation and pickup confirmation to stop repeat contacts.",
  Installation: "Lock installation slot confirmation within 24h of delivery to cap anxiety escalation.",
};

function buildMatrixInsight({
  node,
  category,
  cell,
  tierLabel,
  riskIdx,
}: {
  node: string;
  category: string;
  cell: MatrixCell;
  tierLabel: string;
  riskIdx: number;
}): string {
  const ipdGap = Math.max(0, IPD_TARGET - cell.ipdMet);
  const units = anxietyFmt(cell.units);
  const nodeAction = NODE_INSIGHT_ACTION[node] ?? "Route to containment queue.";

  if (tierLabel === "HIGH") {
    const ipdNote =
      ipdGap > 0
        ? `${category} IPD sits ${ipdGap.toFixed(1)} pts below the ${IPD_TARGET}% bar.`
        : `${category} IPD holds at ${cell.ipdMet.toFixed(1)}% but anxiety score is elevated.`;
    return `${units} anxious units at signal index ${riskIdx} on ${node.toLowerCase()} — ${ipdNote} ${nodeAction}`;
  }

  if (tierLabel === "MEDIUM") {
    const ipdNote = ipdGap > 0 ? `IPD gap of ${ipdGap.toFixed(1)} pts amplifies exposure — ` : "";
    return `${units} units building anxiety (score ${cell.anxietyScore}) on ${node.toLowerCase()}. ${ipdNote}Pre-empt with status reassurance before this crosses into the breach queue.`;
  }

  return `${category} is contained on ${node.toLowerCase()} — ${units} units with low composite signal. Maintain IPD-met at ${cell.ipdMet.toFixed(1)}% and watch for hub-load spikes that could flip this lane amber.`;
}

function MatrixAiInsight({
  selection,
}: {
  selection: SelectedMatrixCell;
}): React.ReactElement {
  const score = riskScore(selection);
  const tier = riskTier(score, selection);
  const index = riskIndex(selection);
  const insight = buildMatrixInsight({
    node: selection.node,
    category: selection.category,
    cell: selection,
    tierLabel: tier.label,
    riskIdx: index,
  });

  return (
    <div
      style={{
        marginTop: 14,
        padding: "12px 14px",
        borderRadius: radius.md,
        background: cssVar("accent-soft"),
        border: `1px solid ${cssVar("accent")}33`,
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
      }}
    >
      <Sparkles size={14} color={cssVar("accent-2")} style={{ flexShrink: 0, marginTop: 1 }} />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: cssVar("accent-2"),
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            AI · Delivery hotspot
          </span>
          <ConfidenceChip conf={88} small />
          <span style={{ fontSize: 11, fontWeight: 700, color: tier.color }}>
            {selection.node} × {selection.category}
          </span>
          <span
            className="lisn-num"
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: tier.color,
              marginLeft: "auto",
            }}
          >
            Signal {index} · {tier.label}
          </span>
        </div>
        <p style={{ margin: "0 0 8px", fontSize: 12, color: cssVar("text-secondary"), lineHeight: 1.45 }}>{insight}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, fontSize: 10, color: cssVar("text-muted") }}>
          <span>
            Anxiety <strong style={{ color: cssVar("text-primary") }}>{selection.anxietyScore}</strong>
          </span>
          <span>
            Units <strong style={{ color: cssVar("text-primary") }}>{anxietyFmt(selection.units)}</strong>
          </span>
          <span>
            IPD-met <strong style={{ color: cssVar("text-primary") }}>{selection.ipdMet.toFixed(1)}%</strong>
          </span>
        </div>
      </div>
    </div>
  );
}

function MatrixHeatmapCell({
  cell,
  selected,
  onSelect,
}: {
  cell: MatrixCell;
  selected: boolean;
  onSelect: () => void;
}): React.ReactElement {
  const score = riskScore(cell);
  const tier = riskTier(score, cell);
  const index = riskIndex(cell);
  const animatedUnits = useAnimatedNumber(cell.units, { duration: 900, delay: 80 });
  const animatedIndex = useAnimatedNumber(index, { duration: 900, delay: 60 });

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
            {animatedIndex}
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
          <span style={{ fontSize: 9, color: cssVar("text-muted") }}>Units {anxietyFmt(animatedUnits)}</span>
          <span style={{ fontSize: 9, color: cssVar("text-muted") }}>IPD {cell.ipdMet.toFixed(1)}%</span>
        </div>
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
      const [, baseUnits, anxietyScore] = match;
      hotspots.push({
        node: n.key,
        category: cat,
        units: scaleAnxietyUnits(baseUnits, d.high),
        anxietyScore: adjustMatrixAnxietyScore(anxietyScore, d),
        ipdMet: adjustMatrixIpdMet(ipdByCategory[cat], d),
      });
    }
  }

  return hotspots.sort((a, b) => b.units * riskScore(b) - a.units * riskScore(a))[0];
}

const MATRIX_LEGEND_ITEMS = [
  { label: "Low signal", color: RAG.green },
  { label: "Medium signal", color: RAG.amber },
  { label: "High signal", color: RAG.red },
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
        const [, baseUnits, anxietyScore] = match;
        cells[cat] = {
          units: scaleAnxietyUnits(baseUnits, d.high),
          anxietyScore: adjustMatrixAnxietyScore(anxietyScore, d),
          ipdMet: adjustMatrixIpdMet(ipdByCategory[cat], d),
        };
      }

      return { key: n.key, totalUnits, share: Math.round(n.prop * 100), cells };
    });
  }, [categories, d, ipdByCategory]);

  const selectedCell = useMemo((): SelectedMatrixCell | null => {
    if (!selected) return null;
    const row = nodeRows.find((r) => r.key === selected.node);
    const cell = row?.cells[selected.category];
    if (!cell) return null;
    return { node: selected.node, category: selected.category, ...cell };
  }, [nodeRows, selected]);

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

      {selectedCell ? <MatrixAiInsight selection={selectedCell} /> : null}
    </div>
  );
}
