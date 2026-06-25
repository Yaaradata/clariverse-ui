"use client";

import React from "react";
import { FCR_REPEAT_CARD } from "../../lib/cxHeadRetailData";
import { AiMarker } from "../common/AiMarker";
import { ConfidenceBand } from "../common/ConfidenceBand";
import { DraftActionFooter } from "../common/DraftActionFooter";
import { cssVar, radius } from "../../theme/tokens";

/** T2-15 — FCR / repeat root-cause; route the cause, not the queue. */
export function FcrRepeatCard(): React.ReactElement {
  const card = FCR_REPEAT_CARD;

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
      <div style={{ fontSize: 14, fontWeight: 700, color: cssVar("text-primary") }}>{card.title}</div>
      <div className="lisn-num" style={{ fontSize: 15, fontWeight: 700, color: cssVar("text-primary") }}>
        {card.stat}
      </div>
      <p style={{ margin: 0, fontSize: 12, color: cssVar("text-secondary"), lineHeight: 1.45 }}>{card.honestyLine}</p>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
        <AiMarker size={12} />
        <span style={{ fontSize: 12, color: cssVar("text-secondary"), lineHeight: 1.45 }}>{card.aiVerdict}</span>
      </div>
      <ConfidenceBand band={card.confidence} />
      <div style={{ marginTop: "auto" }}>
        <DraftActionFooter draftText={card.draftAction} draftKind={card.draftKind} />
      </div>
    </div>
  );
}
