import {
  acquisitionChannels,
  cashFlow,
  leakage,
  waterfall,
  zones,
  type WaterfallMetric,
} from "./data";
import { clampPct, getPeriodFactors, roundN, scaleCount, scaleCr } from "@/lib/fastag-period/scales";
import { scaleShareRows, scaleTrendPoints, scaleWaterfallSteps } from "@/lib/fastag-period/scale-utils";
import { FASTAG_MONTH_LABELS, periodLabel, periodLabelLong, type FastagPeriod } from "@/lib/fastag-period/types";

const CASH_WEEKS_IN_MONTH = 4;

function cashWeeklyTrendForPeriod(
  rows: typeof cashFlow.weeklyTrend,
  period: FastagPeriod,
  f: ReturnType<typeof getPeriodFactors>,
) {
  const monthShort = FASTAG_MONTH_LABELS[period.month - 1];
  const weeks = rows.slice(0, CASH_WEEKS_IN_MONTH);
  return scaleTrendPoints(
    weeks.map((row, i) => ({
      ...row,
      label: `${monthShort} W${i + 1}`,
    })),
    f,
  );
}

function scaleWaterfallRecord(
  source: Record<string, WaterfallMetric>,
  f: ReturnType<typeof getPeriodFactors>,
): Record<string, WaterfallMetric> {
  const out: Record<string, WaterfallMetric> = {};
  for (const key of Object.keys(source)) {
    const m = source[key];
    out[key] = { ...m, steps: scaleWaterfallSteps(m.steps, f) };
  }
  return out;
}

export function getBusinessPerformanceForPeriod(period: FastagPeriod) {
  const f = getPeriodFactors(period);

  const scaledWaterfall = scaleWaterfallRecord(waterfall, f);

  const scaledCashFlow = {
    ...cashFlow,
    periodLabel: `${periodLabelLong(period)} · issuer book`,
    kpis: {
      openingFloatCr: scaleCr(cashFlow.kpis.openingFloatCr, f.money),
      cashInCr: scaleCr(cashFlow.kpis.cashInCr, f.money),
      cashOutCr: scaleCr(cashFlow.kpis.cashOutCr, f.money * f.issues),
      closingFloatCr: scaleCr(cashFlow.kpis.closingFloatCr, f.money),
      netFloatCr: scaleCr(cashFlow.kpis.netFloatCr, f.money),
      rechargeSuccessPct: clampPct(cashFlow.kpis.rechargeSuccessPct + (f.growth - 1) * 6),
      avgFloatDays: roundN(cashFlow.kpis.avgFloatDays * (2 - f.issues * 0.05), 1),
    },
    inflows: scaleShareRows(cashFlow.inflows, f).map((r) => ({
      ...r,
      wowPct: Math.round(r.wowPct * f.growth),
    })),
    outflows: scaleShareRows(cashFlow.outflows, f).map((r) => ({
      ...r,
      wowPct: Math.round(r.wowPct * f.issues),
    })),
    weeklyTrend: cashWeeklyTrendForPeriod(cashFlow.weeklyTrend, period, f),
    weeklyTrendCaption: `First ${CASH_WEEKS_IN_MONTH} weeks · ${periodLabel(period)}`,
  };

  const scaledAcquisition = {
    ...acquisitionChannels,
    periodLabel: `${periodLabelLong(period)} · new activations`,
    totalActivations: scaleCount(acquisitionChannels.totalActivations, f.tags),
    modes: acquisitionChannels.modes.map((m) => ({
      ...m,
      activations: scaleCount(m.activations, f.tags),
      activationRate: clampPct(m.activationRate + (m.id === "digital" ? (f.growth - 1) * 10 : -(f.issues - 1) * 8)),
      firstTxn30d: clampPct(m.firstTxn30d + (m.id === "digital" ? (f.growth - 1) * 8 : -(f.issues - 1) * 6)),
      revPerTag: Math.round(m.revPerTag * f.money),
      wowPct: Math.round(m.wowPct * f.growth),
      growthScore: clampPct(m.growthScore * f.health),
      children: m.children.map((c) => ({
        ...c,
        activations: scaleCount(c.activations, f.tags),
        activationRate: clampPct(c.activationRate + (f.growth - 1) * 5),
        firstTxn30d: clampPct(c.firstTxn30d + (f.growth - 1) * 4),
        revPerTag: Math.round(c.revPerTag * f.money),
        wowPct: Math.round(c.wowPct * f.growth),
        growthScore: clampPct(c.growthScore * f.health),
      })),
    })),
  };

  const scaledZones = zones.map((z) => ({
    ...z,
    txnValueCr: scaleCr(z.txnValueCr, f.money),
  }));

  const scaledLeakage = {
    steps: scaleWaterfallSteps(leakage.steps, f),
    opportunities: leakage.opportunities.map((o) => ({
      ...o,
      affected: o.affected.includes("users")
        ? `${scaleCount(parseInt(o.affected.replace(/[^\d]/g, ""), 10) || 0, f.tags).toLocaleString("en-IN")} users`
        : o.affected,
    })),
  };

  return {
    waterfall: scaledWaterfall,
    cashFlow: scaledCashFlow,
    acquisitionChannels: scaledAcquisition,
    zones: scaledZones,
    leakage: scaledLeakage,
  };
}
