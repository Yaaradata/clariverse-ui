"use client";

import React from "react";
import { CX_QUALITY_PAGE } from "../../lib/cxHeadRetailData";
import { useNavigation } from "../../lib/NavigationContext";
import { BotQualityCard } from "../cx-quality/BotQualityCard";
import { CxQualityWedgeCards } from "../cx-quality/CxQualityWedgeCards";
import { FcrRepeatCard } from "../cx-quality/FcrRepeatCard";
import { PerfectOrderCard } from "../cx-quality/PerfectOrderCard";
import { SellerTrustCard } from "../cx-quality/SellerTrustCard";
import { SuppressionWatchdogCard } from "../cx-quality/SuppressionWatchdogCard";
import { cssVar, layout, space, type } from "../../theme/tokens";

function CxQualityHeadline(): React.ReactElement {
  return (
    <div
      style={{
        borderLeft: `3px solid ${cssVar("accent")}`,
        paddingLeft: 14,
        maxWidth: 920,
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: type.scale.display,
          fontWeight: type.weight.bold,
          color: cssVar("text-primary"),
          lineHeight: 1.12,
          letterSpacing: -0.55,
        }}
      >
        Looks{" "}
        <span style={{ color: cssVar("accent"), fontWeight: 800 }}>Good</span>
        <span style={{ color: cssVar("accent") }}>.</span> Isn't{" "}
        <span
          style={{
            color: cssVar("accent-2"),
            fontWeight: 800,
            boxShadow: `inset 0 -3px 0 ${cssVar("accent")}40`,
          }}
        >
          Business
        </span>{" "}
        Good
        <span style={{ color: cssVar("accent") }}>.</span>
      </h2>
      <p
        style={{
          margin: `${space["2"]} 0 0`,
          fontSize: type.scale.small,
          color: cssVar("text-secondary"),
          lineHeight: 1.5,
          maxWidth: 720,
        }}
      >
        {CX_QUALITY_PAGE.purpose}
      </p>
    </div>
  );
}

/** Pass 6 — S4 CX Quality & the Wedge. */
export function CXQualityWedgeScreen(): React.ReactElement {
  const { openDrill } = useNavigation();

  const openSellerTrustDrill = () => {
    openDrill({
      screenId: "cx-quality",
      itemId: "audiomax",
      drillSignature: "entity-velocity",
    });
  };

  const openSuppressionDrill = () => {
    openDrill({
      screenId: "cx-quality",
      itemId: "electronics-suppression",
      drillSignature: "inverse-anomaly",
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
      <CxQualityHeadline />

      <CxQualityWedgeCards />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, alignItems: "stretch" }}>
        <PerfectOrderCard />
        <FcrRepeatCard />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, alignItems: "stretch" }}>
        <SellerTrustCard onOpenDrill={openSellerTrustDrill} />
        <BotQualityCard />
      </div>

      <SuppressionWatchdogCard onOpenDrill={openSuppressionDrill} />
    </div>
  );
}
