import React from "react";
import type { ConfidenceBand as Band } from "../../lib/cxHeadRetailData";
import { cssVar, radius } from "../../theme/tokens";

export function ConfidenceBand({ band }: { band: Band }): React.ReactElement {
  const tone =
    band === "High"
      ? cssVar("positive")
      : band === "Low"
        ? cssVar("text-muted")
        : cssVar("severity-med");

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 8px",
        borderRadius: radius.pill,
        fontSize: 11,
        fontWeight: 600,
        color: tone,
        background: `${tone}18`,
        border: `1px solid ${tone}40`,
      }}
    >
      {band} confidence
    </span>
  );
}
