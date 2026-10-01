"use client";

import { useV2K } from "@kgs2/lib/demoState";
import meta from "@kgs2/data/meta.json";
import { withAlpha } from "@/components/role-based-dashboard/kgs/shared/tokens";

/** Badge required on every view, drawer and modal (AGENTS / SPEC §12). */
export function SyntheticBadge({ compact = false }: { compact?: boolean }) {
  const K = useV2K();
  return (
    <div
      role="note"
      style={{
        fontSize: compact ? 10 : 11,
        fontWeight: 700,
        letterSpacing: "0.04em",
        color: K.amber2,
        border: `1px solid ${withAlpha(K.amber2, 0.35)}`,
        borderRadius: 6,
        padding: compact ? "2px 6px" : "3px 8px",
        whiteSpace: "nowrap",
        display: "inline-block",
      }}
    >
      {meta.badge}
    </div>
  );
}
