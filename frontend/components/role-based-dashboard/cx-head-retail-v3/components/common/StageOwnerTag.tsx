import React from "react";
import { cssVar, radius } from "../../theme/tokens";

export function StageOwnerTag({
  origination,
  owner,
}: {
  origination: string;
  owner: string;
}): React.ReactElement {
  return (
    <span
      title={`${origination} → ${owner}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        maxWidth: "100%",
        fontSize: 10.5,
        fontWeight: 600,
        color: cssVar("text-secondary"),
        background: cssVar("surface-raised"),
        border: `1px solid ${cssVar("border")}`,
        borderRadius: radius.sm,
        padding: "3px 8px",
        lineHeight: 1.3,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ color: cssVar("accent"), fontWeight: 700 }}>{origination}</span>
      <span aria-hidden style={{ color: cssVar("text-muted") }}>
        →
      </span>
      <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{owner}</span>
    </span>
  );
}
