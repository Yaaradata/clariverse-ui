"use client";

import React from "react";
import { CX_QUALITY_HEADLINE, CX_QUALITY_SUMMARY } from "../../lib/cxHeadRetailData";
import { useNavigation } from "../../lib/NavigationContext";
import { AiExecSummaryBar } from "../common/AiExecSummaryBar";
import { CompactPageHeader, pageShellStyle } from "../common/CompactPageHeader";
import { BotQualityCard } from "../cx-quality/BotQualityCard";
import { FcrRepeatCard } from "../cx-quality/FcrRepeatCard";
import { SellerTrustCard } from "../cx-quality/SellerTrustCard";
import { SuppressionWatchdogCard } from "../cx-quality/SuppressionWatchdogCard";

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
    <div className="lisn-anim-fade" style={pageShellStyle()}>
      <CompactPageHeader
        eyebrow="CX quality"
        title={CX_QUALITY_HEADLINE.title}
        subtitle={CX_QUALITY_HEADLINE.soWhat}
      />

      <AiExecSummaryBar {...CX_QUALITY_SUMMARY} />

      <SuppressionWatchdogCard onOpenDrill={openSuppressionDrill} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, alignItems: "stretch" }}>
        <SellerTrustCard onOpenDrill={openSellerTrustDrill} />
        <FcrRepeatCard />
        <BotQualityCard />
      </div>
    </div>
  );
}
