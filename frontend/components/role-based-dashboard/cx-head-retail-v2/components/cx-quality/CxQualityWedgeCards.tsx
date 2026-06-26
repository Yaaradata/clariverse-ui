"use client";

import React from "react";
import { ArrowRight, CircleAlert, CircleCheck, Scale } from "lucide-react";
import {
  CX_QUALITY_WEDGE_CARDS,
  type CxQualityWedgeCardConfig,
  type CxQualityWedgeFace,
  type CxQualityWedgeProof,
} from "../../lib/cxHeadRetailData";
import { cssVar, radius, space, type } from "../../theme/tokens";

function accentColor(accent: CxQualityWedgeCardConfig["accent"]): string {
  if (accent === "positive") return cssVar("positive");
  if (accent === "trap") return cssVar("severity-high");
  return cssVar("severity-high");
}

function proofToneColor(tone: CxQualityWedgeProof["tone"]): string {
  if (tone === "positive") return cssVar("positive");
  if (tone === "trap" || tone === "high") return cssVar("severity-high");
  if (tone === "med") return cssVar("severity-med");
  return cssVar("text-muted");
}

function CardIcon({ cardId }: { cardId: CxQualityWedgeCardConfig["id"] }): React.ReactElement {
  const size = 16;
  if (cardId === "good") return <CircleCheck size={size} color={cssVar("positive")} aria-hidden />;
  if (cardId === "bad") return <CircleAlert size={size} color={cssVar("severity-high")} aria-hidden />;
  return <Scale size={size} color={cssVar("severity-high")} aria-hidden />;
}

function ProofRow({ proof }: { proof: CxQualityWedgeProof }): React.ReactElement {
  const color = proofToneColor(proof.tone);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: space["2"],
        padding: `${space["2"]} ${space["3"]}`,
        borderRadius: radius.sm,
        background: cssVar("surface-raised"),
        borderLeft: `3px solid ${color}`,
      }}
    >
      <span style={{ fontSize: type.scale.caption, color: cssVar("text-muted") }}>{proof.label}</span>
      <span style={{ fontSize: type.scale.caption, fontWeight: type.weight.semibold, color, textAlign: "right" }}>
        {proof.value}
      </span>
    </div>
  );
}

function faceValueColor(cardId: CxQualityWedgeCardConfig["id"], side: "left" | "right"): string {
  if (cardId === "good") return side === "left" ? cssVar("positive") : cssVar("text-primary");
  if (cardId === "bad") return side === "left" ? cssVar("severity-high") : cssVar("severity-med");
  return side === "left" ? cssVar("severity-high") : cssVar("text-primary");
}

function faceTagColor(cardId: CxQualityWedgeCardConfig["id"], side: "left" | "right"): string {
  if (cardId === "good") return side === "left" ? cssVar("positive") : cssVar("accent");
  if (cardId === "bad") return side === "left" ? cssVar("severity-high") : cssVar("accent");
  return side === "left" ? cssVar("severity-med") : cssVar("accent");
}

function FaceColumn({
  face,
  cardId,
  side,
}: {
  face: CxQualityWedgeFace;
  cardId: CxQualityWedgeCardConfig["id"];
  side: "left" | "right";
}): React.ReactElement {
  const valueColor = faceValueColor(cardId, side);
  const strikeLeft = cardId === "inverse" && side === "left";

  return (
    <div style={{ textAlign: "center", minWidth: 0 }}>
      <div
        className="lisn-num"
        style={{
          fontSize: type.scale.h2,
          fontWeight: 800,
          color: valueColor,
          lineHeight: 1.1,
          textDecoration: strikeLeft ? "line-through" : undefined,
          textDecorationColor: strikeLeft ? `${cssVar("severity-high")}66` : undefined,
        }}
      >
        {face.value}
      </div>
      <div style={{ marginTop: 4, fontSize: type.scale.caption, color: cssVar("text-muted"), lineHeight: 1.35 }}>
        {face.label}
      </div>
      <div
        style={{
          marginTop: 6,
          fontSize: 9,
          fontWeight: type.weight.bold,
          letterSpacing: 0.5,
          textTransform: "uppercase",
          color: faceTagColor(cardId, side),
        }}
      >
        {face.tag}
      </div>
    </div>
  );
}

function DualFace({
  dualFace,
  cardId,
}: {
  dualFace: CxQualityWedgeCardConfig["dualFace"];
  cardId: CxQualityWedgeCardConfig["id"];
}): React.ReactElement {
  const accent =
    cardId === "good" ? cssVar("positive") : cardId === "bad" ? cssVar("severity-high") : cssVar("severity-high");

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        gap: space["2"],
        padding: space["3"],
        minHeight: 108,
        borderRadius: radius.md,
        background: `linear-gradient(135deg, ${accent}10, transparent)`,
        border: `1px dashed ${accent}55`,
      }}
    >
      <FaceColumn face={dualFace.left} cardId={cardId} side="left" />
      <ArrowRight size={18} color={cssVar("text-muted")} aria-hidden />
      <FaceColumn face={dualFace.right} cardId={cardId} side="right" />
    </div>
  );
}

function WedgeVerdictCard({ card }: { card: CxQualityWedgeCardConfig }): React.ReactElement {
  const accent = accentColor(card.accent);
  const isInverse = card.id === "inverse";

  return (
    <article
      style={{
        background: cssVar("surface"),
        border: `1px solid ${isInverse ? `${cssVar("severity-high")}44` : cssVar("border")}`,
        borderRadius: radius.lg,
        padding: space["4"],
        display: "flex",
        flexDirection: "column",
        gap: space["3"],
        minWidth: 0,
        height: "100%",
        boxShadow: `inset 4px 0 0 ${accent}`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: space["2"] }}>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: type.scale.caption,
              fontWeight: type.weight.bold,
              letterSpacing: 0.5,
              textTransform: "uppercase",
              color: accent,
              lineHeight: 1.35,
            }}
          >
            {card.eyebrow}
          </div>
          <p
            style={{
              margin: `${space["2"]} 0 0`,
              fontSize: type.scale.small,
              color: cssVar("text-secondary"),
              lineHeight: 1.45,
              ...(card.id === "inverse" ? { whiteSpace: "nowrap" } : {}),
            }}
          >
            {card.verdict}
          </p>
        </div>
        <div
          style={{
            flexShrink: 0,
            width: 32,
            height: 32,
            borderRadius: radius.pill,
            background: `${accent}14`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CardIcon cardId={card.id} />
        </div>
      </div>

      <DualFace dualFace={card.dualFace} cardId={card.id} />

      <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
        {card.proofs.map((proof) => (
          <ProofRow key={proof.label} proof={proof} />
        ))}
      </div>
    </article>
  );
}

/** Wedge verdict row — dual-face panels with matched proof stacks. */
export function CxQualityWedgeCards(): React.ReactElement {
  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: space["3"],
        alignItems: "stretch",
      }}
    >
      {CX_QUALITY_WEDGE_CARDS.map((card) => (
        <WedgeVerdictCard key={card.id} card={card} />
      ))}
    </section>
  );
}
