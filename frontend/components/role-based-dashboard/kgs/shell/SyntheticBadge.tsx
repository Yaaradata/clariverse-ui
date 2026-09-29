"use client";

import { meta } from "@kgs/lib/data";
import { K, withAlpha } from "../shared/tokens";
import { useDemo } from "./DemoProvider";

/**
 * SyntheticBadge (03 §6.10, 04 §1.4 / §7.2): yellow-300 text, dashed border, always visible.
 * Shows the "ANONYMISED" chip beside it when anonymise is ON (04 §7.1).
 */
export function SyntheticBadge({ compact = false }: { compact?: boolean }) {
  const { state } = useDemo();
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      {state.anonymise ? (
        <span
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.08em",
            padding: "3px 7px",
            borderRadius: 6,
            color: K.violet300,
            background: withAlpha(K.brand, 0.2),
            border: `1px solid ${withAlpha(K.violet400, 0.5)}`,
          }}
        >
          {meta.demo.anonymisedChip}
        </span>
      ) : null}
      <span
        title={meta.badgeTooltip}
        role="note"
        aria-label={`${meta.badge}. ${meta.badgeTooltip}`}
        style={{
          fontSize: compact ? 11 : 12,
          fontWeight: 800,
          letterSpacing: "0.04em",
          padding: compact ? "3px 8px" : "5px 10px",
          borderRadius: 8,
          color: K.yellow300,
          background: withAlpha(K.yellow300, 0.08),
          border: `1px dashed ${withAlpha(K.yellow300, 0.6)}`,
          whiteSpace: "nowrap",
        }}
      >
        {meta.badge}
      </span>
    </span>
  );
}
