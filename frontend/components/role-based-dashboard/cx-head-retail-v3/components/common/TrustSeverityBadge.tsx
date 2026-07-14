import React from "react";
import type { TrustDriverType } from "../../lib/cxHeadRetailV3TrustBreakdownData";
import { cssVar, radius } from "../../theme/tokens";

export function TrustSeverityBadge({
  blastRadius,
  cliffOrSlope = "slope",
}: {
  blastRadius: number;
  cliffOrSlope?: TrustDriverType;
}): React.ReactElement {
  const tone = cliffOrSlope === "cliff" ? cssVar("severity-high") : cssVar("accent");

  return (
    <span
      className="lisn-num"
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: 0.3,
        textTransform: "uppercase",
        color: tone,
        background: `${tone}18`,
        border: `1px solid ${tone}44`,
        borderRadius: radius.pill,
        padding: "2px 8px",
        lineHeight: 1.3,
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      Blast {blastRadius}
    </span>
  );
}
