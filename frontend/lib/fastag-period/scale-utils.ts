import { clampPct, roundN, scaleCount, scaleCr } from "./scales";
import type { PeriodFactors } from "./scales";

export function scaleWaterfallSteps<T extends { t: string; value?: number; delta?: number }>(
  steps: readonly T[],
  f: PeriodFactors,
): T[] {
  const money = f.money;
  const tags = f.tags;
  return steps.map((s) => {
    if (s.t === "total" && typeof s.value === "number") {
      const factor = s.value > 1000 ? tags : money;
      return { ...s, value: s.value > 1000 ? scaleCount(s.value, factor) : scaleCr(s.value, factor) };
    }
    if ((s.t === "inc" || s.t === "dec") && typeof s.delta === "number") {
      const factor = s.delta > 1000 ? tags : money;
      return { ...s, delta: s.delta > 1000 ? scaleCount(s.delta, factor) : scaleCr(s.delta, factor) };
    }
    return { ...s };
  }) as T[];
}

export function scaleTrendPoints<T extends { inCr?: number; outCr?: number; rate?: number }>(
  rows: readonly T[],
  f: PeriodFactors,
): T[] {
  return rows.map((r) => {
    const next = { ...r } as T & { inCr?: number; outCr?: number; rate?: number };
    if ("inCr" in r && typeof r.inCr === "number") next.inCr = scaleCr(r.inCr, f.money);
    if ("outCr" in r && typeof r.outCr === "number") next.outCr = scaleCr(r.outCr, f.money);
    if ("rate" in r && typeof r.rate === "number") next.rate = clampPct(r.rate + (f.growth - 1) * 8);
    return next;
  });
}

export function scaleShareRows<T extends { sharePct?: number; activations?: number; amountCr?: number }>(
  rows: readonly T[],
  f: PeriodFactors,
): T[] {
  return rows.map((r) => ({
    ...r,
    ...(typeof r.activations === "number" ? { activations: scaleCount(r.activations, f.tags) } : {}),
    ...(typeof r.amountCr === "number" ? { amountCr: scaleCr(r.amountCr, f.money) } : {}),
  }));
}

export function scaleNumberArray(values: readonly number[], factor: number): number[] {
  return values.map((v) => roundN(v * factor, v % 1 === 0 ? 0 : 1));
}
