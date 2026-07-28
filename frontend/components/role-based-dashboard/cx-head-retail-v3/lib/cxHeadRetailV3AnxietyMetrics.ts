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
  breachSharePct: number;
  contactAvoidedOfNotifiedPct: number;
  ipdDisplay: number;
  quadTotal: number;
  silentNotContacted: number;
  customerMayContactPct: number;
  mayContactCount: number;
}

export function getAnxietyPeriodMetrics(d: AnxietyPeriodData): AnxietyPeriodMetrics {
  const anxietyOnly = d.quad.ml + d.quad.mh;
  const breachSignals = d.quad.bl + d.quad.bh;
  const signalTotal = anxietyOnly + breachSignals;
  const notifyRate = pctOf(d.funnelNotified, d.high);
  const funnelRate = pctOf(d.funnelAvoided, d.high);
  const promiseKeptPct = pctOf(anxietyOnly, signalTotal);
  // Residual of the high band who were not contact-avoided — complements funnelRate to 100%.
  const customerMayContactPct = Math.max(0, 100 - funnelRate);
  const mayContactCount = Math.max(0, d.high - d.funnelAvoided);

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
    promiseKeptPct,
    breachSharePct: Math.max(0, 100 - promiseKeptPct),
    contactAvoidedOfNotifiedPct: pctOf(d.funnelAvoided, d.funnelNotified),
    ipdDisplay: round1(d.ipd),
    quadTotal: signalTotal,
    silentNotContacted: Math.max(0, d.high - d.funnelNotified),
    customerMayContactPct,
    mayContactCount,
  };
}

export function getWeakestCategory(d: AnxietyPeriodData): { k: string; v: number } {
  return [...ANXIETY_CAT_RELIABILITY]
    .map((c) => ({ k: c.k, v: adjustMatrixIpdMet(c.v, d) }))
    .sort((a, b) => a.v - b.v)[0];
}

export function getStrongestCategory(d: AnxietyPeriodData): { k: string; v: number } {
  return [...ANXIETY_CAT_RELIABILITY]
    .map((c) => ({ k: c.k, v: adjustMatrixIpdMet(c.v, d) }))
    .sort((a, b) => b.v - a.v)[0];
}

export function assertAnxietyPeriodConsistency(d: AnxietyPeriodData): void {
  const quadTotal = d.quad.ml + d.quad.mh + d.quad.bl + d.quad.bh;
  const notifyRate = d.high > 0 ? Math.round((d.funnelNotified / d.high) * 100) : 0;
  const expectedBreachUnits = Math.round((d.quad.bl + d.quad.bh) / 1.78);
  const shareSum = d.top10Shares.reduce((a, b) => a + b, 0);

  if (quadTotal !== d.negTotal) {
    console.warn(`[anxiety] ${d.label}: quad sum ${quadTotal} ≠ negTotal ${d.negTotal}`);
  }
  if (d.funnelAvoided > d.funnelNotified) {
    console.warn(`[anxiety] ${d.label}: funnelAvoided exceeds funnelNotified`);
  }
  if (d.funnelNotified > d.high) {
    console.warn(`[anxiety] ${d.label}: funnelNotified exceeds high band`);
  }
  if (d.high > d.scored) {
    console.warn(`[anxiety] ${d.label}: high exceeds scored`);
  }
  if (d.contained > d.high) {
    console.warn(`[anxiety] ${d.label}: contained exceeds high band`);
  }
  if (d.ttc >= d.ttContact) {
    console.warn(`[anxiety] ${d.label}: outreach is not ahead of contact window`);
  }
  if (d.cov !== notifyRate) {
    console.warn(`[anxiety] ${d.label}: cov ${d.cov} ≠ notify rate ${notifyRate}`);
  }
  const avoidedPct = d.high > 0 ? Math.round((d.funnelAvoided / d.high) * 100) : 0;
  const mayContactPct = Math.max(0, 100 - avoidedPct);
  const pContactPct = Math.round(d.pContact * 100);
  if (avoidedPct + mayContactPct !== 100) {
    console.warn(`[anxiety] ${d.label}: avoided ${avoidedPct}% + may-contact ${mayContactPct}% ≠ 100`);
  }
  if (pContactPct !== mayContactPct) {
    console.warn(`[anxiety] ${d.label}: pContact ${pContactPct}% ≠ may-contact residual ${mayContactPct}%`);
  }
  if (Math.abs(d.breachUnits - expectedBreachUnits) > 2) {
    console.warn(
      `[anxiety] ${d.label}: breachUnits ${d.breachUnits} ≠ expected ${expectedBreachUnits} from (bl+bh)/1.78`,
    );
  }
  if (shareSum !== 100) {
    console.warn(`[anxiety] ${d.label}: top10Shares sum ${shareSum} ≠ 100`);
  }
}
