"use client";

import React, { useState } from "react";
import {
  getBridgeTileById,
  QUICK_COMMERCE_ACTIONS,
  QUICK_COMMERCE_PAGE,
  QUICK_COMMERCE_RADAR_CARDS,
  QUICK_COMMERCE_SUMMARY,
  type QuickCommerceRadarCard,
} from "../../lib/cxHeadRetailData";
import { useNavigation } from "../../lib/NavigationContext";
import { AiMarker } from "../common/AiMarker";
import { ConfidenceBand } from "../common/ConfidenceBand";
import { DraftActionFooter } from "../common/DraftActionFooter";
import { DarkStoreKpiCards } from "../dark-store/DarkStoreKpiCards";
import { DarkStoreScorecard } from "../dark-store/DarkStoreScorecard";
import { BridgeReadyTile } from "../quick-commerce/BridgeReadyTile";
import { cssVar, layout, radius, space, type } from "../../theme/tokens";

function DarkStoreHeadline(): React.ReactElement {
  return (
    <div
      style={{
        borderLeft: `3px solid ${cssVar("accent")}`,
        paddingLeft: 14,
        maxWidth: 920,
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: type.scale.display,
          fontWeight: type.weight.bold,
          color: cssVar("text-primary"),
          lineHeight: 1.12,
          letterSpacing: -0.55,
        }}
      >
        Dark-stores{" "}
        <span style={{ color: cssVar("accent"), fontWeight: 800 }}>breaking</span> before{" "}
        <span
          style={{
            color: cssVar("accent-2"),
            fontWeight: 800,
            boxShadow: `inset 0 -3px 0 ${cssVar("accent")}40`,
          }}
        >
          Ops
        </span>{" "}
        sees it
        <span style={{ color: cssVar("accent") }}>.</span>
      </h2>
      <p
        style={{
          margin: `${space["2"]} 0 0`,
          fontSize: type.scale.small,
          color: cssVar("text-secondary"),
          lineHeight: 1.5,
          maxWidth: 720,
        }}
      >
        {QUICK_COMMERCE_PAGE.purpose}
      </p>
    </div>
  );
}

function RadarActionCard({ card }: { card: QuickCommerceRadarCard }): React.ReactElement {
  return (
    <div
      style={{
        padding: 16,
        borderRadius: radius.lg,
        background: cssVar("surface"),
        border: `1px solid ${cssVar("border")}`,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minWidth: 0,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: cssVar("text-primary") }}>{card.title}</div>
          <ConfidenceBand band={card.confidence} />
        </div>
        {card.flag && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: radius.pill,
              background: `${cssVar("severity-med")}18`,
              color: cssVar("severity-med"),
              textTransform: "uppercase",
              letterSpacing: 0.4,
              flexShrink: 0,
            }}
          >
            {card.flag}
          </span>
        )}
      </div>
      <div className="lisn-num" style={{ fontSize: 15, fontWeight: 700, color: cssVar("text-primary") }}>
        {card.stat}
      </div>
      <p style={{ margin: 0, fontSize: 12, color: cssVar("text-secondary"), lineHeight: 1.45 }}>{card.honestyLine}</p>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
        <AiMarker size={12} />
        <span style={{ fontSize: 12, color: cssVar("text-secondary"), lineHeight: 1.45 }}>{card.aiVerdict}</span>
      </div>
      <DraftActionFooter draftText={card.draftAction} draftKind={card.draftKind} />
    </div>
  );
}

/** Pass 4 — S2 Quick-Commerce Health + MB1 bridge reveal. */
export function QuickCommerceHealthScreen(): React.ReactElement {
  const { openDrill } = useNavigation();
  const mb1 = getBridgeTileById("MB1");
  const [selectedStoreId, setSelectedStoreId] = useState("DS-BLR-D07");

  const openOutbreakDrill = (storeId: string) => {
    setSelectedStoreId(storeId);
    openDrill({
      screenId: "quick-commerce",
      itemId: storeId,
      drillSignature: "geo-outbreak",
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
      <DarkStoreHeadline />

      <DarkStoreKpiCards
        critical={QUICK_COMMERCE_SUMMARY.critical}
        focus={QUICK_COMMERCE_SUMMARY.focus}
        stable={QUICK_COMMERCE_SUMMARY.stable}
        aiLine={QUICK_COMMERCE_SUMMARY.aiLine}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)",
          gap: 16,
          alignItems: "start",
        }}
      >
        <DarkStoreScorecard selectedId={selectedStoreId} onSelect={openOutbreakDrill} />
        <div style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>
          {QUICK_COMMERCE_RADAR_CARDS.map((card) => (
            <RadarActionCard key={card.id} card={card} />
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          alignItems: "start",
        }}
      >
        {mb1 && (
          <BridgeReadyTile
            tile={mb1}
            onOpen={() =>
              openDrill({
                screenId: "quick-commerce",
                itemId: "MB1",
                drillSignature: "bridge",
              })
            }
          />
        )}
        <div
          style={{
            padding: `${space["4"]} ${space["5"]}`,
            borderRadius: radius.lg,
            background: cssVar("surface"),
            border: `1px solid ${cssVar("border")}`,
            display: "flex",
            flexDirection: "column",
            gap: space["3"],
            minWidth: 0,
          }}
        >
          <div
            style={{
              fontSize: type.scale.caption,
              fontWeight: type.weight.bold,
              letterSpacing: 0.5,
              color: cssVar("text-muted"),
              textTransform: "uppercase",
              lineHeight: 1.35,
            }}
          >
            CX-detected · Ops-actioned seam
          </div>
          <DraftActionFooter draftText={QUICK_COMMERCE_ACTIONS.opsAlert} draftKind="draft" />
        </div>
      </div>
    </div>
  );
}
