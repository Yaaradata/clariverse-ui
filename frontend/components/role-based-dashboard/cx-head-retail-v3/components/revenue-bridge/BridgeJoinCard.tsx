"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { getBridgeEvidenceById, type BridgeTileData } from "../../lib/cxHeadRetailData";
import { AiMarker } from "../common/AiMarker";
import { ConfidenceBand } from "../common/ConfidenceBand";
import { cssVar, radius, space, type } from "../../theme/tokens";

function governanceChips(tile: BridgeTileData): string[] {
  const g = tile.governance;
  if (!g) return [];
  const parts: string[] = [];
  if (g.cohortBanded) parts.push("Cohort-banded");
  if (g.proxyAudited) parts.push("Proxy-audited");
  if (g.differentialGated) parts.push("Gated");
  if (g.neverAutoApplied) parts.push("Never auto-applied");
  return parts;
}

function BridgeMiniCard({
  label,
  value,
  valueBold = false,
}: {
  label: string;
  value: string;
  valueBold?: boolean;
}): React.ReactElement {
  return (
    <div
      style={{
        padding: `${space["2"]} ${space["3"]}`,
        borderRadius: radius.md,
        background: cssVar("surface-raised"),
        border: `1px solid ${cssVar("border")}`,
        minHeight: 76,
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: space["1"],
        minWidth: 0,
      }}
    >
      <div style={{ fontSize: 9, fontWeight: type.weight.bold, letterSpacing: 0.4, textTransform: "uppercase", color: cssVar("accent") }}>
        {label}
      </div>
      <div
        style={{
          flex: 1,
          fontSize: type.scale.caption,
          fontWeight: valueBold ? type.weight.semibold : type.weight.medium,
          color: valueBold ? cssVar("text-primary") : cssVar("text-secondary"),
          lineHeight: 1.35,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function BridgeEvidenceSection({ tile, fillHeight = false }: { tile: BridgeTileData; fillHeight?: boolean }): React.ReactElement | null {
  const evidence = getBridgeEvidenceById(tile.id);
  if (!evidence) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: space["2"],
        ...(fillHeight ? { flex: 1, minHeight: 0 } : {}),
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: space["2"],
          alignItems: "stretch",
          ...(fillHeight ? { flex: 1, minHeight: 0 } : {}),
        }}
      >
        <BridgeMiniCard label="Owner" value={evidence.owner} valueBold />
        <BridgeMiniCard label="Voice evidence" value={evidence.cxSignalCount} />
        <BridgeMiniCard label="CX cohort" value={evidence.cxCohort} />
        <BridgeMiniCard label="Feed cohort" value={evidence.txnCohort} />
      </div>
      <div
        style={{
          padding: space["3"],
          borderRadius: radius.md,
          background: cssVar("surface-raised"),
          border: `1px solid ${cssVar("border")}`,
          display: "flex",
          flexDirection: "column",
          gap: space["2"],
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: `${space["2"]} ${space["3"]}`, fontSize: type.scale.caption, color: cssVar("text-muted") }}>
          <span>
            Join key: <span style={{ color: cssVar("text-secondary"), fontWeight: type.weight.semibold }}>{evidence.joinKey}</span>
          </span>
          <span className="lisn-num" style={{ color: cssVar("text-secondary"), fontWeight: type.weight.semibold }}>
            {evidence.txnRowCount}
          </span>
        </div>
        <div style={{ fontSize: type.scale.caption, color: cssVar("text-muted"), lineHeight: 1.4 }}>
          <span style={{ fontWeight: type.weight.bold, color: cssVar("text-secondary") }}>Feed scope: </span>
          {evidence.feedScope}
        </div>
        <ul style={{ margin: 0, paddingLeft: 16, fontSize: type.scale.caption, color: cssVar("text-secondary"), lineHeight: 1.45 }}>
          {evidence.guardrails.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** S5 bridge join card — voice signal → feed → cohort ₹. */
export function BridgeJoinCard({
  tile,
  onOpen,
  fillHeight = false,
}: {
  tile: BridgeTileData;
  onOpen?: () => void;
  fillHeight?: boolean;
}): React.ReactElement {
  const Wrapper = onOpen ? "button" : "div";
  const chips = governanceChips(tile);

  return (
    <Wrapper
      type={onOpen ? "button" : undefined}
      onClick={onOpen}
      style={{
        textAlign: "left",
        width: "100%",
        height: fillHeight ? "100%" : undefined,
        minHeight: fillHeight ? "100%" : undefined,
        boxSizing: "border-box",
        background: cssVar("surface"),
        border: `1px solid ${cssVar("border")}`,
        borderLeft: `3px solid ${cssVar("accent")}`,
        borderRadius: radius.lg,
        padding: space["4"],
        cursor: onOpen ? "pointer" : "default",
        display: "flex",
        flexDirection: "column",
        gap: space["3"],
        minWidth: 0,
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: space["2"],
            flexWrap: "wrap",
          }}
        >
          <div style={{ fontSize: type.scale.body, fontWeight: type.weight.bold, color: cssVar("text-primary"), lineHeight: 1.3, flex: 1, minWidth: 0 }}>
            {tile.title}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", flexShrink: 0 }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: type.weight.bold,
                padding: "3px 8px",
                borderRadius: radius.pill,
                background: `${cssVar("accent")}14`,
                color: cssVar("accent"),
                letterSpacing: 0.3,
              }}
            >
              {tile.id}
            </span>
            <ConfidenceBand band={tile.confidence} />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            flexWrap: "wrap",
            gap: space["2"],
            marginTop: space["2"],
            rowGap: space["1"],
          }}
        >
          <span className="lisn-num" style={{ fontSize: 28, fontWeight: 800, color: cssVar("accent-2"), lineHeight: 1 }}>
            {tile.bridgeValue}
          </span>
          <span style={{ fontSize: type.scale.caption, color: cssVar("text-muted"), lineHeight: 1.35 }}>{tile.cohort}</span>
        </div>
        {tile.honestyLine ? (
          <div style={{ marginTop: space["2"], fontSize: type.scale.caption, color: cssVar("text-secondary"), lineHeight: 1.4 }}>{tile.honestyLine}</div>
        ) : null}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr auto 1fr",
          alignItems: "center",
          gap: space["1"],
          padding: `${space["2"]} ${space["2"]}`,
          borderRadius: radius.md,
          background: cssVar("surface-raised"),
          border: `1px solid ${cssVar("border")}`,
        }}
      >
        <div style={{ minWidth: 0, textAlign: "center" }}>
          <div style={{ fontSize: 9, fontWeight: type.weight.bold, letterSpacing: 0.4, textTransform: "uppercase", color: cssVar("accent") }}>
            Voice
          </div>
          <div style={{ marginTop: 2, fontSize: 10, color: cssVar("text-secondary"), lineHeight: 1.35 }}>{tile.signalRef}</div>
        </div>
        <ArrowRight size={12} color={cssVar("text-muted")} aria-hidden />
        <div style={{ minWidth: 0, textAlign: "center" }}>
          <div style={{ fontSize: 9, fontWeight: type.weight.bold, letterSpacing: 0.4, textTransform: "uppercase", color: cssVar("text-muted") }}>
            Feed
          </div>
          <div style={{ marginTop: 2, fontSize: 10, color: cssVar("text-secondary") }}>Read-only</div>
        </div>
        <ArrowRight size={12} color={cssVar("text-muted")} aria-hidden />
        <div style={{ minWidth: 0, textAlign: "center" }}>
          <div style={{ fontSize: 9, fontWeight: type.weight.bold, letterSpacing: 0.4, textTransform: "uppercase", color: cssVar("text-muted") }}>
            Margin
          </div>
          <div style={{ marginTop: 2, fontSize: 10, color: cssVar("text-secondary"), lineHeight: 1.35 }}>Cohort join</div>
        </div>
      </div>

      <BridgeEvidenceSection tile={tile} fillHeight={fillHeight} />

      {chips.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {chips.map((chip) => (
            <span
              key={chip}
              style={{
                fontSize: 9,
                fontWeight: type.weight.semibold,
                padding: "3px 7px",
                borderRadius: radius.pill,
                border: `1px dashed ${cssVar("severity-med")}66`,
                color: cssVar("severity-med"),
              }}
            >
              {chip}
            </span>
          ))}
        </div>
      ) : null}

      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "flex-start",
          padding: space["3"],
          borderRadius: radius.md,
          background: `${cssVar("accent")}08`,
          border: `1px solid ${cssVar("border")}`,
          ...(fillHeight ? { marginTop: "auto" } : {}),
        }}
      >
        <AiMarker size={12} />
        <span style={{ fontSize: type.scale.caption, color: cssVar("text-secondary"), lineHeight: 1.45 }}>{tile.aiVerdict}</span>
      </div>
    </Wrapper>
  );
}
