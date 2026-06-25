"use client";

import React from "react";
import {
  BRIDGE_TILES,
  REVENUE_BRIDGE_HEADLINE,
  REVENUE_BRIDGE_SUMMARY,
  STARRED_BRIDGE_IDS,
} from "../../lib/cxHeadRetailData";
import { useNavigation } from "../../lib/NavigationContext";
import { AiExecSummaryBar } from "../common/AiExecSummaryBar";
import { CompactPageHeader, pageShellStyle } from "../common/CompactPageHeader";
import { BridgeReadyTile } from "../quick-commerce/BridgeReadyTile";

export function RevenueBridgeScreen(): React.ReactElement {
  const { openDrill } = useNavigation();

  const starredTiles = STARRED_BRIDGE_IDS.map((id) => BRIDGE_TILES.find((t) => t.id === id)).filter(
    (t): t is (typeof BRIDGE_TILES)[number] => t !== undefined,
  );

  const openBridgeDrill = (tileId: string) => {
    openDrill({
      screenId: "revenue-bridge",
      itemId: tileId,
      drillSignature: "bridge",
    });
  };

  return (
    <div className="lisn-anim-fade" style={pageShellStyle()}>
      <CompactPageHeader
        eyebrow="Revenue bridge"
        title={REVENUE_BRIDGE_HEADLINE.title}
        subtitle={REVENUE_BRIDGE_HEADLINE.soWhat}
        badge="Phase 2"
        badgeTone="warn"
      />

      <AiExecSummaryBar {...REVENUE_BRIDGE_SUMMARY} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, alignItems: "stretch" }}>
        {starredTiles.map((tile) => (
          <BridgeReadyTile key={tile.id} tile={tile} onOpen={() => openBridgeDrill(tile.id)} />
        ))}
      </div>
    </div>
  );
}
