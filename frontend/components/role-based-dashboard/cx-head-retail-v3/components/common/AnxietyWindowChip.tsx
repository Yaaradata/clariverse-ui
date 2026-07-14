import React from "react";
import type { AnxietyWindowState } from "../../lib/cxHeadRetailV3TrustBreakdownData";
import { cssVar, radius } from "../../theme/tokens";

const LABEL: Record<AnxietyWindowState, string> = {
  "pre-contact": "Detected · contact not yet received",
  contacting: "Customers contacting",
  escalated: "Escalated",
};

export function AnxietyWindowChip({ state }: { state: AnxietyWindowState }): React.ReactElement {
  const tone =
    state === "escalated"
      ? cssVar("severity-high")
      : state === "pre-contact"
        ? cssVar("accent")
        : cssVar("text-secondary");

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontSize: 10,
        fontWeight: 700,
        color: tone,
        background: `${tone}14`,
        border: `1px solid ${tone}33`,
        borderRadius: radius.pill,
        padding: "2px 8px",
        lineHeight: 1.3,
        whiteSpace: "nowrap",
      }}
    >
      {LABEL[state]}
    </span>
  );
}
