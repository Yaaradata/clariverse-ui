"use client";

import React, { useState } from "react";
import type { AnxietyPeriodKey } from "../../lib/cxHeadRetailV3AnxietyData";
import { HubFluidHeadline } from "../common/HubFluidHeadline";
import {
  AnxietyPeriodControls,
  ServiceDeliveryAnxietyDashboard,
} from "../hub/ServiceDeliveryAnxietyDashboard";
import { layout } from "../../theme/tokens";

export function HubServiceDeliveryScreen(): React.ReactElement {
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
        trailing={<AnxietyPeriodControls period={period} onPeriodChange={setPeriod} />}
      />

      <ServiceDeliveryAnxietyDashboard period={period} />
    </div>
  );
}
