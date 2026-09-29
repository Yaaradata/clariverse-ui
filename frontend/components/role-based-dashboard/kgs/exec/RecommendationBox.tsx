"use client";

import { K, withAlpha } from "../shared/tokens";

/**
 * Fork of the bank spike-card red callout (HeadOfCreditCardsDashboard.tsx:719-734).
 * KGS changes: neutral/amber, labelled "LiSN suggests · owner decides", addressed to the
 * owner — never an imperative, never red.
 */
export function RecommendationBox({
  label,
  text,
}: {
  label: string;
  text: string;
}) {
  return (
    <div
      style={{
        borderRadius: 12,
        border: `1px solid ${withAlpha(K.amber, 0.4)}`,
        background: withAlpha(K.amber, 0.08),
        padding: "8px 10px",
        fontSize: 12.5,
        lineHeight: 1.5,
        color: K.textSec,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: K.amber2,
          letterSpacing: "0.06em",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      {text}
    </div>
  );
}
