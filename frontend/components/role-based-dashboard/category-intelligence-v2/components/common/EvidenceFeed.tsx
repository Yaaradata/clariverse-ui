import React from "react";

import type { EvidencePack } from "../../state/appState";
import { AiMarker } from "./AiMarker";
import { cssVar, radius, space, type } from "../../theme/tokens";

export function EvidenceFeed({ pack }: { pack: EvidencePack }): React.ReactElement {
  return (
    <div
      style={{
        padding: space["4"],
        borderRadius: radius.lg,
        border: `1px solid ${cssVar("border")}`,
        background: cssVar("surface"),
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: space["2"], marginBottom: space["3"] }}>
        <AiMarker />
        <span style={{ fontSize: type.scale.body, fontWeight: type.weight.bold, color: cssVar("text-primary") }}>Evidence feed</span>
      </div>
      <div style={{ marginBottom: space["3"] }}>
        <div style={{ fontSize: type.scale.caption, fontWeight: type.weight.bold, color: cssVar("text-muted"), marginBottom: space["2"], textTransform: "uppercase" }}>
          Customer voice
        </div>
        {pack.verbatims.map((v) => (
          <div
            key={v}
            style={{
              fontSize: type.scale.small,
              color: cssVar("text-secondary"),
              lineHeight: 1.5,
              padding: `${space["2"]} ${space["3"]}`,
              marginBottom: space["2"],
              borderLeft: `3px solid ${cssVar("accent")}`,
              background: cssVar("surface-raised"),
            }}
          >
            {v}
          </div>
        ))}
      </div>
      <div style={{ marginBottom: space["3"] }}>
        <div style={{ fontSize: type.scale.caption, fontWeight: type.weight.bold, color: cssVar("text-muted"), marginBottom: space["2"], textTransform: "uppercase" }}>
          Resolved order trail
        </div>
        {pack.resolvedOrderTrail.map((line) => (
          <div key={line} style={{ fontSize: type.scale.caption, color: cssVar("text-secondary"), marginBottom: space["1"] }}>
            {line}
          </div>
        ))}
      </div>
      <div style={{ fontSize: type.scale.caption, color: cssVar("text-muted") }}>Provenance: {pack.provenance}</div>
    </div>
  );
}
