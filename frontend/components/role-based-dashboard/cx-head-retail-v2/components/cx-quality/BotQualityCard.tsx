"use client";

import React from "react";
import { BOT_QUALITY_CARD } from "../../lib/cxHeadRetailData";
import { AiMarker } from "../common/AiMarker";
import { ConfidenceBand } from "../common/ConfidenceBand";
import { DraftActionFooter } from "../common/DraftActionFooter";
import { cssVar, radius } from "../../theme/tokens";

/** T2-14 — bot containment drop; gated to AI-ops, never auto-act on flow change. */
export function BotQualityCard(): React.ReactElement {
  const card = BOT_QUALITY_CARD;

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
      <div style={{ fontSize: 14, fontWeight: 700, color: cssVar("text-primary") }}>{card.title}</div>
      <div className="lisn-num" style={{ fontSize: 15, fontWeight: 700, color: cssVar("severity-med") }}>
        {card.stat}
      </div>
      <p style={{ margin: 0, fontSize: 12, color: cssVar("text-secondary"), lineHeight: 1.45 }}>{card.honestyLine}</p>

      {card.gated && card.gateLabel && (
        <div
          style={{
            padding: "8px 10px",
            borderRadius: radius.sm,
            border: `1px dashed ${cssVar("severity-med")}88`,
            fontSize: 11,
            fontWeight: 600,
            color: cssVar("severity-med"),
          }}
        >
          {card.gateLabel} — never auto-act
        </div>
      )}

      <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
        <AiMarker size={12} />
        <span style={{ fontSize: 12, color: cssVar("text-secondary"), lineHeight: 1.45 }}>{card.aiVerdict}</span>
      </div>
      <ConfidenceBand band={card.confidence} />
      <DraftActionFooter draftText={card.draftAction} draftKind={card.draftKind} />
    </div>
  );
}
