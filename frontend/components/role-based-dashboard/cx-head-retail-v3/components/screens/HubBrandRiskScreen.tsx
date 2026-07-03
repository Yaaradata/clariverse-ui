"use client";

import React, { useState } from "react";
import type { TrustRangeKey } from "../../lib/cxHeadRetailV3TrustBreakdownData";
import { useNavigation } from "../../lib/NavigationContext";
import { HubFluidHeadline } from "../common/HubFluidHeadline";
import { ScreenBackBar } from "../common/ScreenBackBar";
import { TrustBreakdownIntelligence, TrustRangeSelector } from "../hub/TrustBreakdownIntelligence";
import { layout } from "../../theme/tokens";

export function HubBrandRiskScreen(): React.ReactElement {
  const { navigate } = useNavigation();
  const [range, setRange] = useState<TrustRangeKey>("7D");

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
      <HubFluidHeadline
        variant="brand-risk"
        trailing={
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <TrustRangeSelector range={range} onChange={setRange} />
            <ScreenBackBar onBack={() => navigate("overview")} />
          </div>
        }
      />

      <TrustBreakdownIntelligence range={range} />
    </div>
  );
}
