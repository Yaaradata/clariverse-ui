import React from "react";
import type { BridgeTileData } from "../../lib/cxHeadRetailData";
import { AiMarker } from "../common/AiMarker";
import { ConfidenceBand } from "../common/ConfidenceBand";
import { cssVar, radius } from "../../theme/tokens";
import { Star } from "lucide-react";

function governanceLabel(tile: BridgeTileData): string | null {
  const g = tile.governance;
  if (!g) return null;
  const parts: string[] = [];
  if (g.cohortBanded) parts.push("Cohort-banded");
  if (g.proxyAudited) parts.push("Proxy-audited");
  if (g.differentialGated) parts.push("Differential gated");
  if (g.neverAutoApplied) parts.push("Never auto-applied");
  return parts.length > 0 ? parts.join(" · ") : null;
}

/** AP-015 starred bridge tile — illustrative Phase 2 only, never live. */
export function BridgeReadyTile({
  tile,
  onOpen,
}: {
  tile: BridgeTileData;
  onOpen?: () => void;
}): React.ReactElement {
  const Wrapper = onOpen ? "button" : "div";
  const govLabel = governanceLabel(tile);

  return (
    <Wrapper
      type={onOpen ? "button" : undefined}
      onClick={onOpen}
      style={{
        textAlign: "left",
        width: "100%",
        height: "100%",
        background: `linear-gradient(135deg, ${cssVar("accent-soft")}, transparent)`,
        border: `1px solid ${cssVar("accent")}55`,
        borderRadius: radius.lg,
        padding: "16px 18px",
        cursor: onOpen ? "pointer" : "default",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {tile.starred && (
        <Star
          size={14}
          fill={cssVar("severity-med")}
          color={cssVar("severity-med")}
          style={{ position: "absolute", top: 12, right: 12 }}
        />
      )}
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 0.5,
          color: cssVar("accent"),
          textTransform: "uppercase",
          lineHeight: 1.35,
          maxWidth: "85%",
        }}
      >
        Bridge-ready (lights up with transaction feed)
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: cssVar("text-primary"), marginTop: 8 }}>{tile.title}</div>
      <div
        className="lisn-num"
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: cssVar("severity-med"),
          marginTop: 10,
        }}
      >
        {tile.illustrativeValue}
      </div>
      <div style={{ fontSize: 11, color: cssVar("text-muted"), marginTop: 4 }}>[illustrative, Phase 2]</div>
      <div style={{ fontSize: 12, color: cssVar("text-secondary"), marginTop: 10, lineHeight: 1.45, flex: 1 }}>
        {tile.honestyLine}
      </div>

      {govLabel && (
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
          {govLabel}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginTop: 10 }}>
        <AiMarker size={12} />
        <span style={{ fontSize: 12, color: cssVar("text-secondary"), lineHeight: 1.45 }}>{tile.aiVerdict}</span>
      </div>
      <ConfidenceBand band={tile.confidence} />
      <div className="lisn-num" style={{ fontSize: 11, color: cssVar("text-muted"), marginTop: 6 }}>
        Ties to: {tile.signalRef}
      </div>
      <div style={{ fontSize: 11, color: cssVar("text-muted"), marginTop: 4 }}>Cohort: {tile.cohort}</div>
    </Wrapper>
  );
}
