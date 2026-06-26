"use client";

import React from "react";
import { ArrowRight, Star } from "lucide-react";
import type { BridgeTileData } from "../../lib/cxHeadRetailData";
import { AiMarker } from "../common/AiMarker";
import { cssVar, radius, space, type } from "../../theme/tokens";

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

function JoinStep({
  label,
  detail,
  accent,
}: {
  label: string;
  detail: string;
  accent?: boolean;
}): React.ReactElement {
  return (
    <div style={{ minWidth: 0, textAlign: "center" }}>
      <div
        style={{
          fontSize: type.scale.caption,
          fontWeight: type.weight.bold,
          letterSpacing: 0.4,
          textTransform: "uppercase",
          color: accent ? cssVar("accent") : cssVar("text-muted"),
        }}
      >
        {label}
      </div>
      <div
        style={{
          marginTop: 2,
          fontSize: type.scale.caption,
          color: cssVar("text-secondary"),
          lineHeight: 1.35,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {detail}
      </div>
    </div>
  );
}

/** AP-015 starred bridge tile — Phase 2 pilot only, never live. */
export function BridgeReadyTile({
  tile,
  onOpen,
}: {
  tile: BridgeTileData;
  onOpen?: () => void;
}): React.ReactElement {
  const Wrapper = onOpen ? "button" : "div";
  const govLabel = governanceLabel(tile);
  const accent = cssVar("severity-med");

  return (
    <Wrapper
      type={onOpen ? "button" : undefined}
      onClick={onOpen}
      style={{
        textAlign: "left",
        width: "100%",
        alignSelf: "stretch",
        background: `linear-gradient(135deg, ${cssVar("accent-soft")}, transparent)`,
        border: `1px solid ${cssVar("accent")}55`,
        borderRadius: radius.lg,
        padding: `${space["4"]} ${space["5"]}`,
        cursor: onOpen ? "pointer" : "default",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: space["3"],
      }}
    >
      {tile.starred && (
        <Star
          size={14}
          fill={accent}
          color={accent}
          style={{ position: "absolute", top: 12, right: 12 }}
          aria-hidden
        />
      )}

      <div style={{ paddingRight: tile.starred ? 20 : 0 }}>
        <div
          style={{
            fontSize: type.scale.caption,
            fontWeight: type.weight.bold,
            letterSpacing: 0.5,
            color: cssVar("accent"),
            textTransform: "uppercase",
            lineHeight: 1.35,
          }}
        >
          Bridge-ready · Phase 2
        </div>
        <div style={{ fontSize: type.scale.body, fontWeight: type.weight.bold, color: cssVar("text-primary"), marginTop: space["2"] }}>
          {tile.title}
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: space["2"], marginTop: space["2"], flexWrap: "wrap" }}>
          <span className="lisn-num" style={{ fontSize: type.scale.h2, fontWeight: 800, color: accent, lineHeight: 1 }}>
            {tile.bridgeValue}
          </span>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr auto 1fr",
          alignItems: "center",
          gap: space["2"],
          padding: `${space["3"]} ${space["2"]}`,
          borderRadius: radius.md,
          background: cssVar("surface-raised"),
          border: `1px solid ${cssVar("border")}`,
        }}
      >
        <JoinStep label="CX signal" detail={tile.signalRef} accent />
        <ArrowRight size={14} color={cssVar("text-muted")} aria-hidden />
        <JoinStep label="Order feed" detail="Read-only pilot" />
        <ArrowRight size={14} color={cssVar("text-muted")} aria-hidden />
        <JoinStep label="Margin" detail={tile.cohort} />
      </div>

      {govLabel && (
        <div
          style={{
            padding: `${space["2"]} ${space["3"]}`,
            borderRadius: radius.sm,
            border: `1px dashed ${accent}88`,
            fontSize: type.scale.caption,
            fontWeight: type.weight.semibold,
            color: accent,
          }}
        >
          {govLabel}
        </div>
      )}

      <div
        style={{
          background: `linear-gradient(135deg, ${cssVar("accent")}10 0%, ${cssVar("accent")}06 38%)`,
          border: `1px solid ${cssVar("accent")}28`,
          borderLeftWidth: 4,
          borderLeftColor: cssVar("accent"),
          borderRadius: radius.md,
          padding: `${space["3"]} ${space["3"]}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: space["1"] }}>
          <AiMarker size={11} />
          <span
            style={{
              fontSize: type.scale.caption,
              fontWeight: type.weight.bold,
              color: cssVar("accent"),
              letterSpacing: 0.5,
              textTransform: "uppercase",
            }}
          >
            Bridge AI
          </span>
        </div>
        <p style={{ margin: 0, fontSize: type.scale.small, color: cssVar("text-primary"), lineHeight: 1.5 }}>
          {tile.aiVerdict}
        </p>
        {tile.honestyLine ? (
          <p style={{ margin: `${space["2"]} 0 0`, fontSize: type.scale.caption, color: cssVar("text-muted"), lineHeight: 1.45 }}>
            {tile.honestyLine}
          </p>
        ) : null}
      </div>
    </Wrapper>
  );
}
