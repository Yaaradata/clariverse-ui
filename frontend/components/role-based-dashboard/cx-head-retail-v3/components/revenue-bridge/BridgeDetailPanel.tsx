"use client";

import React from "react";
import { getBridgeCatalogueEntry, getBridgeTileById } from "../../lib/cxHeadRetailData";
import { cssVar, radius, space, type } from "../../theme/tokens";
import { BRIDGE_CATALOGUE_PANEL_HEIGHT } from "./BridgeCatalogueList";
import { BridgeJoinCard } from "./BridgeJoinCard";

const panelShellStyle: React.CSSProperties = {
  height: BRIDGE_CATALOGUE_PANEL_HEIGHT,
  minHeight: BRIDGE_CATALOGUE_PANEL_HEIGHT,
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
};

export function BridgeDetailPanel({
  selectedId,
  onOpenDrill,
}: {
  selectedId: string;
  onOpenDrill?: (id: string) => void;
}): React.ReactElement {
  const entry = getBridgeCatalogueEntry(selectedId);
  const tile = getBridgeTileById(selectedId);

  if (entry?.status === "ready" && tile) {
    return (
      <div style={panelShellStyle}>
        <BridgeJoinCard
          tile={tile}
          fillHeight
          onOpen={onOpenDrill ? () => onOpenDrill(selectedId) : undefined}
        />
      </div>
    );
  }

  return (
    <article
      style={{
        ...panelShellStyle,
        width: "100%",
        boxSizing: "border-box",
        background: cssVar("surface"),
        border: `1px solid ${cssVar("border")}`,
        borderLeft: `3px solid ${cssVar("border")}`,
        borderRadius: radius.lg,
        padding: space["4"],
        gap: space["3"],
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: space["2"] }}>
        <span
          className="lisn-num"
          style={{
            fontSize: 10,
            fontWeight: type.weight.bold,
            padding: "3px 8px",
            borderRadius: radius.pill,
            background: cssVar("surface-raised"),
            color: cssVar("text-muted"),
            letterSpacing: 0.3,
          }}
        >
          {entry?.id ?? selectedId}
        </span>
        <span
          style={{
            fontSize: 9,
            fontWeight: type.weight.bold,
            letterSpacing: 0.45,
            textTransform: "uppercase",
            color: cssVar("text-muted"),
          }}
        >
          Pending join
        </span>
      </div>

      <div>
        <div style={{ fontSize: type.scale.body, fontWeight: type.weight.bold, color: cssVar("text-primary"), lineHeight: 1.3 }}>
          {entry?.title ?? "Bridge not found"}
        </div>
        <p style={{ margin: `${space["2"]} 0 0`, fontSize: type.scale.small, color: cssVar("text-secondary"), lineHeight: 1.5 }}>
          {entry?.pendingNote ?? "This catalogue bridge awaits cohort map and trust audit before a join preview is available."}
        </p>
      </div>

      <div
        style={{
          marginTop: "auto",
          padding: space["3"],
          borderRadius: radius.md,
          background: cssVar("surface-raised"),
          border: `1px dashed ${cssVar("border")}`,
          fontSize: type.scale.caption,
          color: cssVar("text-muted"),
          lineHeight: 1.45,
        }}
      >
        Voice signal is tagged and visible — transaction feed keys and governance review still required. Select a{" "}
        <strong style={{ color: cssVar("positive") }}>Ready</strong> bridge (MB1, MB4, MB8, MB17) to preview the cohort join.
      </div>
    </article>
  );
}
