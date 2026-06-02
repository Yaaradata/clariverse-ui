export function fmtTags(v: number): string {
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M`;
  if (Math.abs(v) >= 1_000) return `${Math.round(v / 1_000)}K`;
  return `${v}`;
}

export function fmtCr(v: number): string {
  return `INR ${v.toFixed(1)}Cr`;
}

export function fmtL(v: number): string {
  return `INR ${v.toFixed(0)}L`;
}

export function fmtPct(v: number): string {
  return `${v.toFixed(0)}%`;
}

export function signed(v: number): string {
  return `${v > 0 ? "+" : "-"}${Math.abs(v)}`;
}
