"use client";

import React from "react";
import { CX_QUALITY_HEADLINE, CX_QUALITY_SUMMARY } from "../../lib/cxHeadRetailData";
import { useNavigation } from "../../lib/NavigationContext";
import { AiExecSummaryBar } from "../common/AiExecSummaryBar";
import { BotQualityCard } from "../cx-quality/BotQualityCard";
import { FcrRepeatCard } from "../cx-quality/FcrRepeatCard";
import { SellerTrustCard } from "../cx-quality/SellerTrustCard";
import { SuppressionWatchdogCard } from "../cx-quality/SuppressionWatchdogCard";
import { cssVar, layout, type } from "../../theme/tokens";

/** Pass 6 — S4 CX Quality & the Wedge. */
export function CXQualityWedgeScreen(): React.ReactElement {
  const { openDrill } = useNavigation();

  const openSuppressionDrill = () => {
    openDrill({
      screenId: "cx-quality",
      itemId: "electronics-suppression",
      drillSignature: "inverse-anomaly",
    });
  };

  const openSellerTrustDrill = () => {
    openDrill({
      screenId: "cx-quality",
      itemId: "audiomax",
      drillSignature: "entity-velocity",
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
          The good number that is actually bad
        </p>
        <h2
          style={{
            margin: "10px 0 0",
            fontSize: type.scale.h1,
            fontWeight: type.weight.bold,
            color: cssVar("text-primary"),
            lineHeight: 1.2,
            maxWidth: 920,
          }}
        >
          {CX_QUALITY_HEADLINE.title}
        </h2>
        <p style={{ margin: "10px 0 0", fontSize: type.scale.body, color: cssVar("text-secondary"), maxWidth: 820, lineHeight: 1.5 }}>
          {CX_QUALITY_HEADLINE.soWhat}
        </p>
        <p style={{ margin: "8px 0 0", fontSize: type.scale.small, color: cssVar("text-muted"), maxWidth: 820, lineHeight: 1.45 }}>
          {CX_QUALITY_HEADLINE.explainability}
        </p>
      </div>

      <AiExecSummaryBar {...CX_QUALITY_SUMMARY} />

      <SuppressionWatchdogCard onOpenDrill={openSuppressionDrill} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, alignItems: "stretch" }}>
        <SellerTrustCard onOpenDrill={openSellerTrustDrill} />
        <FcrRepeatCard />
        <BotQualityCard />
      </div>
    </div>
  );
}
