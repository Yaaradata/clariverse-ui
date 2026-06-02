import { getPeriodFactors, roundN } from "./scales";
import type { FastagPeriod } from "./types";
import { periodKey } from "./types";

export type HobGatewayTileSnapshot = {
  score: number;
  delta: number;
  deltaLabel: string;
  spark: number[];
  aiInsight: string;
  compact?: {
    leftGauge: number;
    rightGauge: number;
    bottomRight?: string;
  };
};

const TILE_SNAPSHOTS: Record<
  string,
  Partial<Record<"sales_issuance" | "ecosystem_partner" | "operations_escalations", HobGatewayTileSnapshot>>
> = {
  "2025-Q1": {
    sales_issuance: {
      score: 70,
      delta: -2,
      deltaLabel: "▼ 2 pts",
      spark: [48, 50, 55, 58, 64, 70],
      aiInsight: "Q1 toll volume recovered after festival dip; dormant tags still elevated at 15%.",
      compact: { leftGauge: 82, rightGauge: 15 },
    },
  },
  "2025-Q4": {
    ecosystem_partner: {
      score: 68,
      delta: 6,
      deltaLabel: "+6 pts",
      spark: [40, 44, 50, 56, 62, 68],
      aiInsight: "Annual Pass and auto-recharge enrolment peaked in Q4 — commercial segment led net-new tags.",
      compact: { leftGauge: 62, rightGauge: 74 },
    },
  },
  "2026-Q1": {
    operations_escalations: {
      score: 62,
      delta: -6,
      deltaLabel: "▼ 6 pts",
      spark: [68, 60, 58, 54, 58, 62],
      aiInsight: "Q1 refund SLA pressure from acquirer reconciliation backlog — 48 cases beyond promise window.",
      compact: { leftGauge: 54, rightGauge: 40 },
    },
  },
};

export function resolveGatewayTile(
  tileId: "sales_issuance" | "ecosystem_partner" | "operations_escalations",
  base: HobGatewayTileSnapshot,
  period: FastagPeriod,
): HobGatewayTileSnapshot {
  const override = TILE_SNAPSHOTS[periodKey(period)]?.[tileId];
  if (override) return { ...base, ...override };

  const f = getPeriodFactors(period);
  const score = roundN(base.score * f.health, 0);
  const delta = roundN(base.delta * (tileId === "operations_escalations" ? f.issues : f.growth), 0);
  const spark = base.spark.map((v, i) => roundN(v * f.health * (0.92 + i * 0.02), 0));

  return {
    ...base,
    score,
    delta,
    deltaLabel: delta >= 0 ? `+${delta} pts` : `▼ ${Math.abs(delta)} pts`,
    spark,
    aiInsight: base.aiInsight,
    compact: base.compact
      ? {
          leftGauge: roundN(base.compact.leftGauge * f.health, 0),
          rightGauge: roundN(
            tileId === "operations_escalations" ? base.compact.rightGauge * f.issues : base.compact.rightGauge,
            0,
          ),
          bottomRight: base.compact.bottomRight,
        }
      : undefined,
  };
}

export function periodPulseLines(period: FastagPeriod): [string, string, string] {
  const f = getPeriodFactors(period);
  const q = period.quarter;
  const y = period.year;
  if (f.issues > 1.05) {
    return [
      `${y} Q${q}: Recharge-failure and refund clusters are elevated — wallet friction is the primary churn risk.`,
      `Double-deduction disputes are tracking above the ${y} Q${q} target; acquirer reconciliation is the focus area.`,
      `Digital issuance mix is stable; monitor social sentiment while gateway fail-over completes.`,
    ];
  }
  if (f.growth > 1.05) {
    return [
      `${y} Q${q}: Growth levers are performing — auto-recharge and Annual Pass are lifting activation quality.`,
      `First-toll success improved quarter-on-quarter; plaza POS remains the activation gap to close.`,
      `Service-health index is stable; continue scaling bank-app and payments-app acquisition.`,
    ];
  }
  return [
    `${y} Q${q}: Business performance is in a steady band — toll volume and active tag base are tracking plan.`,
    `Watch dormancy in assisted channels while scaling digital self-serve paths.`,
    `Partner SLAs are within tolerance; maintain focus on NETC redirect conversion.`,
  ];
}
