import * as base from "./data";
import { clampPct, getPeriodFactors, scaleCount } from "@/lib/fastag-period/scales";
import { scaleTrendPoints } from "@/lib/fastag-period/scale-utils";
import type { FastagPeriod } from "@/lib/fastag-period/types";

function scaleFunnel<T extends { count: number }>(rows: readonly T[], f: ReturnType<typeof getPeriodFactors>): T[] {
  return rows.map((r) => ({ ...r, count: scaleCount(r.count, f.tags) }));
}

export function getGrowthDriversForPeriod(period: FastagPeriod) {
  const f = getPeriodFactors(period);

  return {
    onboardingFunnel: scaleFunnel(base.onboardingFunnel, f),
    rechargeSuccessTrend: scaleTrendPoints(base.rechargeSuccessTrend, f),
    rechargeMethods: base.rechargeMethods.map((r) => ({
      ...r,
      pct: clampPct(r.pct + (r.method === "Auto-recharge" ? (f.growth - 1) * 20 : 0)),
    })),
    autoRechargeFunnel: scaleFunnel(base.autoRechargeFunnel, f),
    rechargeFailurePareto: base.rechargeFailurePareto.map((r) => ({
      ...r,
      pct: clampPct(r.pct * f.issues),
    })),
    firstTollSuccessTrend: scaleTrendPoints(base.firstTollSuccessTrend, f),
    firstUseFailures: base.firstUseFailures,
    firstUseJourney: scaleFunnel(base.firstUseJourney, f),
    retentionCohorts: base.retentionCohorts.map((c) => ({
      ...c,
      values: c.values.map((v) => (v === null ? null : clampPct((v ?? 0) + (f.growth - 1) * 5))),
    })),
    repeatRechargeTrend: base.repeatRechargeTrend.map((r) => ({
      ...r,
      rate: clampPct(r.rate + (f.growth - 1) * 12),
    })),
    repeatTxnTrend: base.repeatTxnTrend.map((r) => ({
      ...r,
      rate: clampPct(r.rate + (f.growth - 1) * 10),
    })),
    usageComposition: base.usageComposition.map((r) => ({ ...r, pct: clampPct(r.pct) })),
    growthBlockerPareto: base.growthBlockerPareto,
    issueMatrix: base.issueMatrix,
  };
}
