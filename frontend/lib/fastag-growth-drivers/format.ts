export function fmtCount(v: number): string {
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M`;
  if (Math.abs(v) >= 1_000) return `${Math.round(v / 1_000)}K`;
  return `${v}`;
}

export function fmtPct(v: number): string {
  return `${v.toFixed(0)}%`;
}

export function signedPct(v: number): string {
  return `${v > 0 ? "+" : ""}${v.toFixed(1)}%`;
}

export function cohortColor(value: number | null): string {
  if (value === null) return "rgba(99,99,111,.20)";
  if (value >= 72) return "rgba(45,212,167,.24)";
  if (value >= 58) return "rgba(255,176,32,.24)";
  return "rgba(255,59,70,.24)";
}

export function ragPillTone(level: string): "good" | "warn" | "bad" {
  const l = level.toLowerCase();
  if (l === "high" || l === "critical") return "bad";
  if (l === "medium") return "warn";
  return "good";
}

