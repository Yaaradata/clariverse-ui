"use client";

import React from "react";
import { useNavigation } from "../../lib/NavigationContext";
import { HubFluidHeadline } from "../common/HubFluidHeadline";
import { TrustBreakdownIntelligence } from "../hub/TrustBreakdownIntelligence";
import { layout } from "../../theme/tokens";

export function HubTrustScreen(): React.ReactElement {
  const { trustRange } = useNavigation();

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
      <HubFluidHeadline variant="trust" />

      <TrustBreakdownIntelligence range={trustRange} />
    </div>
  );
}
