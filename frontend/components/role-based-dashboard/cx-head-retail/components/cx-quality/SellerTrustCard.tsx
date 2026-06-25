"use client";

import React from "react";
import { SELLER_TRUST_CARD } from "../../lib/cxHeadRetailData";
import { AiMarker } from "../common/AiMarker";
import { ConfidenceBand } from "../common/ConfidenceBand";
import { DraftActionFooter } from "../common/DraftActionFooter";
import { cssVar, radius } from "../../theme/tokens";

/** T2-5 — integrity-guarded seller trust erosion; gated to risk review. */
export function SellerTrustCard({ onOpenDrill }: { onOpenDrill: () => void }): React.ReactElement {
  const card = SELLER_TRUST_CARD;

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
              background: `${cssVar("accent")}18`,
              color: cssVar("accent"),
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

      <button
        type="button"
        onClick={onOpenDrill}
        style={{
          marginTop: "auto",
          padding: "8px 12px",
          borderRadius: radius.sm,
          border: `1px solid ${cssVar("border")}`,
          background: cssVar("surface-raised"),
          color: cssVar("accent"),
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        Open entity-velocity evidence →
      </button>

      <DraftActionFooter draftText={card.draftAction} draftKind={card.draftKind} />
    </div>
  );
}
