import React from "react";
import type { BridgeTileData } from "../../lib/cxHeadRetailData";
import { AiMarker } from "../common/AiMarker";
import { cssVar, radius } from "../../theme/tokens";
import { Star } from "lucide-react";

export function BridgeReadyTile({
  tile,
  onOpen,
}: {
  tile: BridgeTileData;
  onOpen?: () => void;
}): React.ReactElement {
  const Wrapper = onOpen ? "button" : "div";

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
        borderRadius: radius.md,
        padding: "12px 14px",
        cursor: onOpen ? "pointer" : "default",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      {tile.starred && (
        <Star
          size={12}
          fill={cssVar("severity-med")}
          color={cssVar("severity-med")}
          style={{ position: "absolute", top: 10, right: 10 }}
        />
      )}
      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 0.45, color: cssVar("accent"), textTransform: "uppercase" }}>
        Bridge · Phase 2
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: cssVar("text-primary") }}>{tile.title}</div>
      <div className="lisn-num" style={{ fontSize: 20, fontWeight: 800, color: cssVar("severity-med") }}>
        {tile.illustrativeValue}
      </div>
      <div style={{ display: "flex", gap: 5, alignItems: "flex-start", marginTop: "auto" }}>
        <AiMarker size={10} />
        <span
          style={{
            fontSize: 11,
            color: cssVar("text-muted"),
            lineHeight: 1.35,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {tile.aiVerdict}
        </span>
      </div>
    </Wrapper>
  );
}
