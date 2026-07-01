"use client";

import React from "react";

import type { EvidencePack } from "../../state/appState";
import { AiMarker } from "./AiMarker";
import { cssVar, radius, space, type } from "../../theme/tokens";

/** Compact evidence — top customer quotes + order trail for drill pages. */
export function CompactEvidenceFeed({ pack }: { pack: EvidencePack }): React.ReactElement {
  const quotes = pack.verbatims.slice(0, 3);
  const trail = pack.resolvedOrderTrail.slice(0, 3);

  return (
    <div
      style={{
        background: cssVar("surface"),
        border: `1px solid ${cssVar("border")}`,
        borderRadius: radius.lg,
        padding: space["4"],
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: space["3"],
        minHeight: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: space["2"], marginBottom: space["3"] }}>
        <AiMarker />
        <span style={{ fontSize: type.scale.body, fontWeight: type.weight.bold, color: cssVar("text-primary") }}>
          Customer evidence
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 0.8fr)", gap: space["3"], flex: 1, minHeight: 0 }}>
        <div>
          <div
            style={{
              fontSize: type.scale.caption,
              fontWeight: type.weight.bold,
              color: cssVar("text-muted"),
              textTransform: "uppercase",
              letterSpacing: 0.4,
              marginBottom: space["2"],
            }}
          >
            Voice
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: space["2"] }}>
            {quotes.map((v) => (
              <div
                key={v}
                style={{
                  fontSize: type.scale.small,
                  color: cssVar("text-secondary"),
                  lineHeight: 1.45,
                  padding: `${space["2"]} ${space["3"]}`,
                  borderLeft: `3px solid ${cssVar("accent")}`,
                  background: cssVar("surface-raised"),
                  borderRadius: `0 ${radius.sm} ${radius.sm} 0`,
                }}
              >
                &ldquo;{v}&rdquo;
              </div>
            ))}
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: type.scale.caption,
              fontWeight: type.weight.bold,
              color: cssVar("text-muted"),
              textTransform: "uppercase",
              letterSpacing: 0.4,
              marginBottom: space["2"],
            }}
          >
            Order trail
          </div>
          {trail.map((line) => (
            <div key={line} style={{ fontSize: type.scale.caption, color: cssVar("text-secondary"), marginBottom: space["1"], lineHeight: 1.4 }}>
              {line}
            </div>
          ))}
          <div style={{ fontSize: type.scale.caption, color: cssVar("text-muted"), marginTop: space["2"] }}>{pack.provenance}</div>
        </div>
      </div>
    </div>
  );
}
