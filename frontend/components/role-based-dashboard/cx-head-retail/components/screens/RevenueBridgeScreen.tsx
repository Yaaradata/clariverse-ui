"use client";

import React from "react";
import {
  BRIDGE_ACTIONS,
  BRIDGE_TILES,
  REVENUE_BRIDGE_HEADLINE,
  REVENUE_BRIDGE_SUMMARY,
  STARRED_BRIDGE_IDS,
} from "../../lib/cxHeadRetailData";
import { useNavigation } from "../../lib/NavigationContext";
import { AiExecSummaryBar } from "../common/AiExecSummaryBar";
import { DraftActionFooter } from "../common/DraftActionFooter";
import { BridgeReadyTile } from "../quick-commerce/BridgeReadyTile";
import { cssVar, layout, radius, type } from "../../theme/tokens";

/** Pass 7 — S5 Revenue Bridge: four starred bridge tiles + pilot actions. */
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
    <div
      className="lisn-anim-fade"
      style={{
        maxWidth: layout.contentMaxWidth,
        margin: "0 auto",
        padding: "24px 32px 48px",
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: type.scale.caption,
              fontWeight: type.weight.semibold,
              letterSpacing: 0.6,
              textTransform: "uppercase",
              color: cssVar("accent"),
            }}
          >
            Voice → P&L join
          </p>
          <h2
            style={{
              margin: "10px 0 0",
              fontSize: type.scale.h1,
              fontWeight: type.weight.bold,
              color: cssVar("text-primary"),
              lineHeight: 1.2,
              maxWidth: 900,
            }}
          >
            {REVENUE_BRIDGE_HEADLINE.title}
          </h2>
          <p
            style={{ margin: "10px 0 0", fontSize: type.scale.body, color: cssVar("text-secondary"), maxWidth: 820, lineHeight: 1.5 }}
          >
            {REVENUE_BRIDGE_HEADLINE.soWhat}
          </p>
          <p
            style={{ margin: "8px 0 0", fontSize: type.scale.small, color: cssVar("text-muted"), maxWidth: 820, lineHeight: 1.45 }}
          >
            {REVENUE_BRIDGE_HEADLINE.explainability}
          </p>
        </div>
        <span
          style={{
            flexShrink: 0,
            padding: "6px 12px",
            borderRadius: radius.pill,
            fontSize: type.scale.caption,
            fontWeight: type.weight.semibold,
            color: cssVar("severity-med"),
            background: `${cssVar("severity-med")}14`,
            border: `1px solid ${cssVar("severity-med")}44`,
            whiteSpace: "nowrap",
          }}
        >
          [illustrative, Phase 2]
        </span>
      </div>

      <AiExecSummaryBar {...REVENUE_BRIDGE_SUMMARY} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, alignItems: "stretch" }}>
        {starredTiles.map((tile) => (
          <BridgeReadyTile key={tile.id} tile={tile} onOpen={() => openBridgeDrill(tile.id)} />
        ))}
      </div>

      <div
        style={{
          padding: 16,
          borderRadius: radius.lg,
          background: cssVar("surface-raised"),
          border: `1px solid ${cssVar("border")}`,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 600, color: cssVar("text-muted") }}>
          Expansion narrative — no live transaction action
        </div>
        <DraftActionFooter draftText={BRIDGE_ACTIONS.previewJoin} draftKind="prepare" />
        <DraftActionFooter draftText={BRIDGE_ACTIONS.pilotDataAsk} draftKind="draft" />
      </div>
    </div>
  );
}
