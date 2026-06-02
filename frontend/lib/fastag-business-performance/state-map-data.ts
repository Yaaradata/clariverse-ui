export type StateSeverityBand = "none" | "low" | "med" | "high" | "critical";

export type FastagStateMapPoint = {
  code: string;
  name: string;
  band: StateSeverityBand;
  txnValueCr: number;
  /** Toll collection margin retained (INR Cr). */
  profitCr: number;
  /** Leakage, refunds, and dormancy drag (INR Cr). */
  lossCr: number;
  dormancyPct: number;
  complaintIndex: number;
  status: string;
  rtoHub: string;
};

function deriveStatePnl(txnValueCr: number, dormancyPct: number, complaintIndex: number) {
  const activeShare = 1 - dormancyPct / 100;
  const margin = complaintIndex < 45 ? 0.44 : complaintIndex < 70 ? 0.34 : 0.24;
  const leakRate = dormancyPct / 220 + complaintIndex / 380;
  const profitCr = Math.round(txnValueCr * activeShare * margin * 100) / 100;
  const lossCr = Math.round(txnValueCr * leakRate * 100) / 100;
  return { profitCr, lossCr };
}

function withPnl<T extends { txnValueCr: number; dormancyPct: number; complaintIndex: number }>(
  row: T,
): T & { profitCr: number; lossCr: number } {
  return { ...row, ...deriveStatePnl(row.txnValueCr, row.dormancyPct, row.complaintIndex) };
}

export const SEVERITY_BAND_COLORS: Record<
  StateSeverityBand,
  { fill: string; label: string; border: string }
> = {
  none: { fill: "#f4f4f2", label: "None", border: "#e5e7eb" },
  low: { fill: "#d8f0e3", label: "Low", border: "#9fd4b0" },
  med: { fill: "#f7f0c8", label: "Med", border: "#e8d48a" },
  high: { fill: "#fde5ce", label: "High", border: "#f0b98a" },
  critical: { fill: "#f8d4d8", label: "Critical", border: "#e88a94" },
};

/** Illustrative state-level FASTag health (RTO / VRN aligned keys for Highcharts IN map). */
const FASTAG_STATE_MAP_RAW = [
  { code: "in-jk", name: "Jammu & Kashmir", band: "high", txnValueCr: 0.42, dormancyPct: 14, complaintIndex: 72, status: "Watch corridor", rtoHub: "Jammu · Srinagar" },
  { code: "in-hp", name: "Himachal Pradesh", band: "low", txnValueCr: 0.28, dormancyPct: 9, complaintIndex: 38, status: "Stable", rtoHub: "Shimla" },
  { code: "in-pb", name: "Punjab", band: "med", txnValueCr: 0.65, dormancyPct: 11, complaintIndex: 48, status: "Monitor", rtoHub: "Chandigarh" },
  { code: "in-uk", name: "Uttarakhand", band: "med", txnValueCr: 0.31, dormancyPct: 12, complaintIndex: 52, status: "Monitor", rtoHub: "Dehradun" },
  { code: "in-hr", name: "Haryana", band: "high", txnValueCr: 0.88, dormancyPct: 13, complaintIndex: 64, status: "NH corridor load", rtoHub: "Gurugram" },
  { code: "in-dl", name: "Delhi", band: "critical", txnValueCr: 1.12, dormancyPct: 18, complaintIndex: 88, status: "SLA pressure", rtoHub: "Delhi NCR" },
  { code: "in-rj", name: "Rajasthan", band: "med", txnValueCr: 0.94, dormancyPct: 15, complaintIndex: 55, status: "Monitor", rtoHub: "Jaipur" },
  { code: "in-up", name: "Uttar Pradesh", band: "high", txnValueCr: 1.45, dormancyPct: 17, complaintIndex: 76, status: "Activation gap", rtoHub: "Lucknow · Noida" },
  { code: "in-br", name: "Bihar", band: "high", txnValueCr: 0.72, dormancyPct: 16, complaintIndex: 70, status: "Recharge friction", rtoHub: "Patna" },
  { code: "in-sk", name: "Sikkim", band: "low", txnValueCr: 0.08, dormancyPct: 7, complaintIndex: 28, status: "Stable", rtoHub: "Gangtok" },
  { code: "in-ar", name: "Arunachal Pradesh", band: "low", txnValueCr: 0.09, dormancyPct: 8, complaintIndex: 31, status: "Stable", rtoHub: "Itanagar" },
  { code: "in-nl", name: "Nagaland", band: "med", txnValueCr: 0.11, dormancyPct: 11, complaintIndex: 44, status: "Monitor", rtoHub: "Kohima" },
  { code: "in-mn", name: "Manipur", band: "med", txnValueCr: 0.1, dormancyPct: 12, complaintIndex: 46, status: "Monitor", rtoHub: "Imphal" },
  { code: "in-mz", name: "Mizoram", band: "low", txnValueCr: 0.07, dormancyPct: 6, complaintIndex: 25, status: "Stable", rtoHub: "Aizawl" },
  { code: "in-tr", name: "Tripura", band: "low", txnValueCr: 0.12, dormancyPct: 9, complaintIndex: 33, status: "Stable", rtoHub: "Agartala" },
  { code: "in-ml", name: "Meghalaya", band: "med", txnValueCr: 0.14, dormancyPct: 10, complaintIndex: 41, status: "Monitor", rtoHub: "Shillong" },
  { code: "in-as", name: "Assam", band: "high", txnValueCr: 0.58, dormancyPct: 14, complaintIndex: 68, status: "Corridor risk", rtoHub: "Guwahati" },
  { code: "in-wb", name: "West Bengal", band: "critical", txnValueCr: 0.96, dormancyPct: 19, complaintIndex: 82, status: "Partner disputes", rtoHub: "Kolkata" },
  { code: "in-jh", name: "Jharkhand", band: "med", txnValueCr: 0.38, dormancyPct: 13, complaintIndex: 49, status: "Monitor", rtoHub: "Ranchi" },
  { code: "in-or", name: "Odisha", band: "critical", txnValueCr: 0.52, dormancyPct: 20, complaintIndex: 85, status: "Acquirer cluster", rtoHub: "Bhubaneswar" },
  { code: "in-ct", name: "Chhattisgarh", band: "med", txnValueCr: 0.34, dormancyPct: 14, complaintIndex: 51, status: "Monitor", rtoHub: "Raipur" },
  { code: "in-mp", name: "Madhya Pradesh", band: "high", txnValueCr: 0.78, dormancyPct: 16, complaintIndex: 74, status: "Dormancy uplift", rtoHub: "Bhopal · Indore" },
  { code: "in-gj", name: "Gujarat", band: "low", txnValueCr: 1.05, dormancyPct: 10, complaintIndex: 36, status: "Scale-ready", rtoHub: "Ahmedabad" },
  { code: "in-dd", name: "Daman & Diu", band: "none", txnValueCr: 0.04, dormancyPct: 5, complaintIndex: 12, status: "Low volume", rtoHub: "Daman" },
  { code: "in-dn", name: "Dadra & Nagar Haveli", band: "none", txnValueCr: 0.03, dormancyPct: 4, complaintIndex: 10, status: "Low volume", rtoHub: "Silvassa" },
  { code: "in-mh", name: "Maharashtra", band: "high", txnValueCr: 1.82, dormancyPct: 15, complaintIndex: 71, status: "Mumbai-Pune load", rtoHub: "Mumbai · Pune" },
  { code: "in-ga", name: "Goa", band: "low", txnValueCr: 0.18, dormancyPct: 8, complaintIndex: 30, status: "Stable", rtoHub: "Panaji" },
  { code: "in-ka", name: "Karnataka", band: "low", txnValueCr: 1.24, dormancyPct: 9, complaintIndex: 34, status: "Scale-ready", rtoHub: "Bengaluru" },
  { code: "in-kl", name: "Kerala", band: "low", txnValueCr: 0.62, dormancyPct: 8, complaintIndex: 32, status: "Stable", rtoHub: "Kochi" },
  { code: "in-tn", name: "Tamil Nadu", band: "critical", txnValueCr: 1.38, dormancyPct: 21, complaintIndex: 90, status: "Plaza mis-read", rtoHub: "Chennai" },
  { code: "in-py", name: "Puducherry", band: "none", txnValueCr: 0.05, dormancyPct: 6, complaintIndex: 14, status: "Low volume", rtoHub: "Puducherry" },
  { code: "in-an", name: "Andaman & Nicobar", band: "none", txnValueCr: 0.02, dormancyPct: 3, complaintIndex: 8, status: "Low volume", rtoHub: "Port Blair" },
  { code: "in-ld", name: "Lakshadweep", band: "none", txnValueCr: 0.01, dormancyPct: 2, complaintIndex: 5, status: "Low volume", rtoHub: "Kavaratti" },
  { code: "in-ap", name: "Andhra Pradesh", band: "med", txnValueCr: 0.86, dormancyPct: 12, complaintIndex: 47, status: "Monitor", rtoHub: "Hyderabad · Vijayawada" },
  { code: "in-tg", name: "Telangana", band: "med", txnValueCr: 0.74, dormancyPct: 11, complaintIndex: 45, status: "Monitor", rtoHub: "Hyderabad" },
  { code: "in-la", name: "Ladakh", band: "low", txnValueCr: 0.06, dormancyPct: 7, complaintIndex: 22, status: "Stable", rtoHub: "Leh" },
] as const;

export const FASTAG_STATE_MAP_DATA: FastagStateMapPoint[] = FASTAG_STATE_MAP_RAW.map((s) => withPnl(s));

export const STATE_MAP_BY_CODE = Object.fromEntries(FASTAG_STATE_MAP_DATA.map((s) => [s.code, s])) as Record<
  string,
  FastagStateMapPoint
>;
