import {
  adjustMatrixIpdMet,
  ANXIETY_CAT_RELIABILITY,
  type AnxietyPeriodData,
} from "./cxHeadRetailV3AnxietyData";

function pctOf(part: number, whole: number): number {
  if (whole <= 0) return 0;
  return Math.round((part / whole) * 100);
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

export interface AnxietyPeriodMetrics {
  notifyRate: number;
  funnelRate: number;
  containedRate: number;
  highBandShare: number;
  coverageRate: number;
  headroomMin: number;
  anxietyOnly: number;
  breachSignals: number;
  signalTotal: number;
  promiseKeptPct: number;
  contactAvoidedOfNotifiedPct: number;
  ipdDisplay: number;
  quadTotal: number;
}

export function getAnxietyPeriodMetrics(d: AnxietyPeriodData): AnxietyPeriodMetrics {
  const anxietyOnly = d.quad.ml + d.quad.mh;
  const breachSignals = d.quad.bl + d.quad.bh;
  const signalTotal = anxietyOnly + breachSignals;
  const notifyRate = pctOf(d.funnelNotified, d.high);
  const funnelRate = pctOf(d.funnelAvoided, d.high);

  return {
    notifyRate,
    funnelRate,
    containedRate: pctOf(d.contained, d.high),
    highBandShare: pctOf(d.high, d.scored),
    coverageRate: notifyRate,
    headroomMin: d.ttContact - d.ttc,
    anxietyOnly,
    breachSignals,
    signalTotal,
    promiseKeptPct: pctOf(anxietyOnly, signalTotal),
    contactAvoidedOfNotifiedPct: pctOf(d.funnelAvoided, d.funnelNotified),
    ipdDisplay: round1(d.ipd),
    quadTotal: signalTotal,
  };
}

export function getWeakestCategory(d: AnxietyPeriodData): { k: string; v: number } {
  return [...ANXIETY_CAT_RELIABILITY]
    .map((c) => ({ k: c.k, v: adjustMatrixIpdMet(c.v, d) }))
    .sort((a, b) => a.v - b.v)[0];
}

export function assertAnxietyPeriodConsistency(d: AnxietyPeriodData): void {
  const quadTotal = d.quad.ml + d.quad.mh + d.quad.bl + d.quad.bh;
  if (quadTotal !== d.negTotal) {
    console.warn(
      `[anxiety] ${d.label}: quad sum ${quadTotal} ≠ negTotal ${d.negTotal}`,
    );
  }
  if (d.funnelAvoided > d.funnelNotified) {
    console.warn(`[anxiety] ${d.label}: funnelAvoided exceeds funnelNotified`);
  }
  if (d.contained > d.high) {
    console.warn(`[anxiety] ${d.label}: contained exceeds high band`);
  }
}
