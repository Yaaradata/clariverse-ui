"use client";

import React from "react";
import type { AnxietyPeriodKey } from "../../lib/cxHeadRetailV3AnxietyData";
import type { TrustRangeKey } from "../../lib/cxHeadRetailV3TrustBreakdownData";
import { useNavigation } from "../../lib/NavigationContext";
import { HubFluidHeadline } from "../common/HubFluidHeadline";
import { ServiceDeliveryAnxietyDashboard } from "../hub/ServiceDeliveryAnxietyDashboard";
import { layout } from "../../theme/tokens";

function anxietyPeriodFromTrustRange(range: TrustRangeKey): AnxietyPeriodKey {
  switch (range) {
    case "24H":
      return "today";
    case "7D":
      return "7d";
    case "30D":
      return "30d";
    default: {
      const _exhaustive: never = range;
      return _exhaustive;
    }
  }
}

export function HubServiceDeliveryScreen(): React.ReactElement {
  const { trustRange } = useNavigation();
  const period = anxietyPeriodFromTrustRange(trustRange);

  return (
    <div
      className="lisn-anim-fade"
      style={{
        maxWidth: layout.contentMaxWidth,
        margin: "0 auto",
        padding: "20px 28px 40px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <HubFluidHeadline variant="service-delivery" />

      <ServiceDeliveryAnxietyDashboard period={period} />
    </div>
  );
}
