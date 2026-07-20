"use client";

import React from "react";
import { FCR_REPEAT_CARD } from "../../lib/cxHeadRetailData";
import { FCR_REPEAT_METRICS } from "../../lib/cxHeadRetailV3LifecycleMatrixData";
import { AiMarker } from "../common/AiMarker";
import { BenchmarkBandTrack } from "../common/BenchmarkBandTrack";
import { ConfidenceBand } from "../common/ConfidenceBand";
import { DraftActionFooter } from "../common/DraftActionFooter";
import { cssVar, radius } from "../../theme/tokens";

/** T2-15 — FCR + repeat are inverse; show both with global benchmark bands. */
export function FcrRepeatCard(): React.ReactElement {
  const card = FCR_REPEAT_CARD;
  const m = FCR_REPEAT_METRICS;

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
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 700, color: cssVar("text-primary") }}>
        Are we resolving once — or looping?
      </div>
      <p style={{ margin: 0, fontSize: 11, color: cssVar("text-muted"), lineHeight: 1.4 }}>
        FCR and repeat rate move inversely. Intent: <strong style={{ color: cssVar("text-secondary") }}>{m.intent}</strong>
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <BenchmarkBandTrack
          label="FCR"
          value={m.fcrRate}
          low={m.fcrBenchmark.low}
          high={m.fcrBenchmark.high}
          tag={m.fcrBenchmark.tag}
          goodWhenHigher
        />
        <BenchmarkBandTrack
          label="Repeat rate"
          value={m.repeatRate}
          low={m.repeatBenchmark.low}
          high={m.repeatBenchmark.high}
          tag={m.repeatBenchmark.tag}
          goodWhenHigher={false}
        />
      </div>

      <p style={{ margin: 0, fontSize: 12, color: cssVar("text-secondary"), lineHeight: 1.45 }}>{card.honestyLine}</p>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
        <AiMarker size={12} />
        <span style={{ fontSize: 12, color: cssVar("text-secondary"), lineHeight: 1.45 }}>{card.aiVerdict}</span>
      </div>
      <ConfidenceBand band={card.confidence} />
      <DraftActionFooter draftText={m.nextAction} draftKind={card.draftKind} />
    </div>
  );
}
