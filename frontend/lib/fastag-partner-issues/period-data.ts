import { clampPct, getPeriodFactors, roundN } from "@/lib/fastag-period/scales";
import { scaleNumberArray } from "@/lib/fastag-period/scale-utils";
import { periodLabelLong, type FastagPeriod } from "@/lib/fastag-period/types";

const BASE = {
  serviceScore: 59,
  trend: [70, 68, 71, 66, 69, 64, 67, 63, 65, 60, 59],
  impactVolScale: 1,
} as const;

export function getPartnerIssuesForPeriod(period: FastagPeriod) {
  const f = getPeriodFactors(period);
  const score = clampPct(BASE.serviceScore * (2 - f.issues * 0.08));
  const trend = scaleNumberArray(BASE.trend, 0.98 + (f.health - 1) * 0.5).map((v, i, arr) =>
    i === arr.length - 1 ? score : v,
  );
  const volMult = f.issues;

  const scaleVol = (s: string) => {
    const n = parseInt(s.replace(/,/g, ""), 10);
    if (!Number.isFinite(n)) return s;
    return Math.round(n * volMult).toLocaleString("en-IN");
  };

  return {
    serviceScore: score,
    trend,
    periodLabel: periodLabelLong(period),
    scoreDelta: roundN(-9 * f.issues, 0),
    impact: [
      { issue: "Double deduction", vol: scaleVol("1,420"), volD: `+${Math.round(38 * f.issues)}%`, affected: scaleVol("8,900") + " tags", risk: "₹47L", churn: "High", sev: "Critical" },
      { issue: "Blacklist on low balance", vol: scaleVol("980"), volD: `+${Math.round(62 * f.issues)}%`, affected: scaleVol("6,200") + " tags", risk: "₹31L", churn: "High", sev: "Critical" },
      { issue: "Recharge / wallet failure", vol: scaleVol("1,180"), volD: `+${Math.round(24 * f.issues)}%`, affected: scaleVol("4,800") + " wallets", risk: "₹28L", churn: "Med", sev: "High" },
      { issue: "KYC / activation stall", vol: scaleVol("760"), volD: `+${Math.round(17 * f.issues)}%`, affected: scaleVol("4,300") + " tags", risk: "₹18L", churn: "Med", sev: "High" },
      { issue: "Tag mis-read at plaza", vol: scaleVol("540"), volD: `+${Math.round(9 * f.issues)}%`, affected: scaleVol("2,100") + " tags", risk: "₹9L", churn: "Low", sev: "Watch" },
    ],
    slaResolvedPct: clampPct(51 * (2 - f.issues * 0.15)),
    beyondSla: Math.round(56 * f.issues),
  };
}
