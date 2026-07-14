import React from "react";
import { Sparkles } from "lucide-react";
import type { ConfidenceBand as Band } from "../../lib/cxHeadRetailData";
import { cssVar, radius } from "../../theme/tokens";

export function ConfidenceBand({ band }: { band: Band }): React.ReactElement {
  // Med must never render as severity-med (amber) — "amber red should never come" on the confidence chip.
  const tone =
    band === "High"
      ? cssVar("positive")
      : band === "Low"
        ? cssVar("text-muted")
        : cssVar("accent");

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "2px 8px",
        borderRadius: radius.pill,
        fontSize: 11,
        fontWeight: 600,
        color: tone,
        background: `${tone}18`,
        border: `1px solid ${tone}40`,
      }}
    >
      <span
        aria-hidden
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: tone,
          flexShrink: 0,
        }}
      />
      {band} confidence
    </span>
  );
}

/**
 * Numeric confidence chip for model-inferred percentages — always accent, never
 * amber/red (a model probability is not a risk signal).
 */
export function ConfidenceChip({ conf, small = false }: { conf: number; small?: boolean }): React.ReactElement {
  return (
    <span
      title="Model inference — treat as probabilistic, not fact"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: small ? 10 : 11,
        fontWeight: 700,
        borderRadius: radius.pill,
        padding: small ? "3px 7px" : "3px 8px",
        background: cssVar("accent-soft"),
        color: cssVar("accent-2"),
        border: `1px solid ${cssVar("accent")}55`,
        whiteSpace: "nowrap",
      }}
    >
      <Sparkles size={small ? 10 : 11} strokeWidth={2.4} />
      {small ? null : <>Confidence </>}
      <b className="lisn-num" style={{ fontWeight: 600 }}>
        {conf}%
      </b>
    </span>
  );
}
