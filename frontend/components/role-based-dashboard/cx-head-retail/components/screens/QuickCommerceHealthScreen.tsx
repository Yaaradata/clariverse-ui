"use client";

import React from "react";
import {
  getBridgeTileById,
  PERISHABLE_RADAR,
  QUICK_COMMERCE_ACTIONS,
  QUICK_COMMERCE_HEADLINE,
  QUICK_COMMERCE_SUMMARY,
  SUBSTITUTION_RADAR,
} from "../../lib/cxHeadRetailData";
import { useNavigation } from "../../lib/NavigationContext";
import { AiExecSummaryBar } from "../common/AiExecSummaryBar";
import { AiMarker } from "../common/AiMarker";
import { ConfidenceBand } from "../common/ConfidenceBand";
import { DraftActionFooter } from "../common/DraftActionFooter";
import { BridgeReadyTile } from "../quick-commerce/BridgeReadyTile";
import { OutbreakMap } from "../quick-commerce/OutbreakMap";
import { cssVar, layout, radius, type } from "../../theme/tokens";

function RadarActionCard({
  card,
}: {
  card: typeof PERISHABLE_RADAR;
}): React.ReactElement {
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
        height: "100%",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: cssVar("text-primary") }}>{card.title}</div>
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
      <ConfidenceBand band={card.confidence} />
      <DraftActionFooter draftText={card.draftAction} draftKind={card.draftKind} />
    </div>
  );
}

/** Pass 4 — S2 Quick-Commerce Health + MB1 bridge reveal. */
export function QuickCommerceHealthScreen(): React.ReactElement {
  const { openDrill } = useNavigation();
  const mb1 = getBridgeTileById("MB1");

  const openOutbreakDrill = (storeId: string) => {
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
      <div>
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
          Dark-stores breaking before the warehouse dashboard shows it
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
          {QUICK_COMMERCE_HEADLINE.title}
        </h2>
        <p style={{ margin: "10px 0 0", fontSize: type.scale.body, color: cssVar("text-secondary"), maxWidth: 820, lineHeight: 1.5 }}>
          {QUICK_COMMERCE_HEADLINE.soWhat}
        </p>
        <p style={{ margin: "8px 0 0", fontSize: type.scale.small, color: cssVar("text-muted"), maxWidth: 820, lineHeight: 1.45 }}>
          {QUICK_COMMERCE_HEADLINE.explainability}
        </p>
      </div>

      <AiExecSummaryBar {...QUICK_COMMERCE_SUMMARY} />

      <div style={{ display: "grid", gridTemplateColumns: "1.45fr 1fr", gap: 16, minHeight: 340 }}>
        <OutbreakMap onSelectStore={openOutbreakDrill} defaultCity="Bengaluru" />
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
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <RadarActionCard card={PERISHABLE_RADAR} />
        <RadarActionCard card={SUBSTITUTION_RADAR} />
      </div>

      <div
        style={{
          padding: 16,
          borderRadius: radius.lg,
          background: cssVar("surface-raised"),
          border: `1px solid ${cssVar("border")}`,
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 600, color: cssVar("text-muted"), marginBottom: 8 }}>
          CX-detected · Ops-actioned seam
        </div>
        <DraftActionFooter draftText={QUICK_COMMERCE_ACTIONS.opsAlert} draftKind="draft" />
      </div>
    </div>
  );
}
