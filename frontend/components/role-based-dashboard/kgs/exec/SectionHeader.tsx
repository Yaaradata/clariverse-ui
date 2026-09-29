"use client";

import { Activity } from "lucide-react";
import type { ReactNode } from "react";
import { K, withAlpha } from "../shared/tokens";

/**
 * Fork of the bank "AI Risk Spike Monitor" header (HeadOfCreditCardsDashboard.tsx:586-612).
 * KGS changes: title/chip/subtitle from data; the chip is neutral-amber, not a red alert.
 */
export function SectionHeader({
  title,
  chip,
  subtitle,
  italic,
  right,
  chipPulse = false,
}: {
  title: string;
  chip?: string;
  /** Pulse the chip once on mount (04 §6, P1). */
  chipPulse?: boolean;
  subtitle?: string;
  italic?: string;
  right?: ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <h2
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 700,
            color: K.text,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Activity size={16} color={K.amber2} aria-hidden />
          <span>{title}</span>
        </h2>
        {chip ? (
          <span
            className={chipPulse ? "kgs-chip-pulse" : undefined}
            style={{
              fontSize: 11,
              padding: "4px 8px",
              borderRadius: 999,
              background: withAlpha(K.amber, 0.14),
              color: K.amber2,
              letterSpacing: "0.05em",
              fontWeight: 700,
              fontFamily: K.mono,
            }}
          >
            {chip}
          </span>
        ) : null}
        {right ? <div style={{ marginLeft: "auto" }}>{right}</div> : null}
      </div>
      {subtitle ? (
        <p style={{ margin: 0, fontSize: 13, color: K.textMut }}>{subtitle}</p>
      ) : null}
      {italic ? (
        <p
          style={{
            margin: 0,
            fontSize: 12,
            color: K.textMut,
            fontStyle: "italic",
          }}
        >
          {italic}
        </p>
      ) : null}
    </div>
  );
}
