"use client";

import React, { useState } from "react";
import type { AnxietyPeriodKey } from "../../lib/cxHeadRetailV3AnxietyData";
import { useNavigation } from "../../lib/NavigationContext";
import { HubFluidHeadline } from "../common/HubFluidHeadline";
import { ScreenBackBar } from "../common/ScreenBackBar";
import {
  AnxietyPeriodControls,
  ServiceDeliveryAnxietyDashboard,
} from "../hub/ServiceDeliveryAnxietyDashboard";
import { layout } from "../../theme/tokens";

export function HubServiceDeliveryScreen(): React.ReactElement {
  const { navigate } = useNavigation();
  const [period, setPeriod] = useState<AnxietyPeriodKey>("today");

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
      <HubFluidHeadline
        variant="service-delivery"
        trailing={
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <AnxietyPeriodControls period={period} onPeriodChange={setPeriod} />
            <ScreenBackBar onBack={() => navigate("overview")} />
          </div>
        }
      />

      <ServiceDeliveryAnxietyDashboard period={period} />
    </div>
  );
}
