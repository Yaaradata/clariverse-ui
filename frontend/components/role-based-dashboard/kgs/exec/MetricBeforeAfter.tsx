"use client";

import { K } from "../shared/tokens";

/**
 * Fork of the bank spike-card metrics box (HeadOfCreditCardsDashboard.tsx:690-717).
 * KGS changes: "before → after" against the cohort's own baseline, the change is a ratio
 * (never a red "↑ %"), 12px minimum.
 */
export function MetricBeforeAfter({
  rows,
}: {
  rows: { label: string; value: string; change?: string }[];
}) {
  return (
    <div
      style={{
        borderRadius: 12,
        border: `1px solid ${K.borderLight}`,
        background: "rgba(0,0,0,0.25)",
        padding: "8px 10px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      {rows.map((m) => (
        <div
          key={m.label}
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 8,
            fontSize: 12,
          }}
        >
          <span style={{ color: K.textMut }}>{m.label}</span>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                color: K.text,
                fontWeight: 700,
                fontFamily: K.mono,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {m.value}
            </div>
            {m.change ? (
              <div
                style={{
                  fontSize: 12,
                  color: K.amber2,
                  fontWeight: 700,
                  fontFamily: K.mono,
                }}
              >
                {m.change}
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
