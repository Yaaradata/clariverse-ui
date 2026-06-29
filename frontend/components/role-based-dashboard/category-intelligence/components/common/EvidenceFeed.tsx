import React from "react";

import type { EvidencePack } from "../../state/appState";
import { AiMarker } from "./AiMarker";
import { cssVar, radius } from "../../theme/tokens";

export function EvidenceFeed({ pack }: { pack: EvidencePack }): React.ReactElement {
  return (
    <div
      style={{
        marginTop: 16,
        padding: 16,
        borderRadius: radius.md,
        border: `1px solid ${cssVar("border")}`,
        background: cssVar("surface"),
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
        <AiMarker />
        <span style={{ fontSize: 13, fontWeight: 700, color: cssVar("text-primary") }}>Evidence feed</span>
      </div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: cssVar("text-muted"), marginBottom: 6, textTransform: "uppercase" }}>
          Customer voice
        </div>
        {pack.verbatims.map((v) => (
          <div
            key={v}
            style={{
              fontSize: 13,
              color: cssVar("text-secondary"),
              lineHeight: 1.5,
              padding: "8px 10px",
              marginBottom: 6,
              borderLeft: `3px solid ${cssVar("accent")}`,
              background: cssVar("surface-raised"),
            }}
          >
            {v}
          </div>
        ))}
      </div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: cssVar("text-muted"), marginBottom: 6, textTransform: "uppercase" }}>
          Resolved order trail
        </div>
        {pack.resolvedOrderTrail.map((line) => (
          <div key={line} style={{ fontSize: 12, color: cssVar("text-secondary"), marginBottom: 4 }}>
            {line}
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: cssVar("text-muted") }}>Provenance: {pack.provenance}</div>
    </div>
  );
}
