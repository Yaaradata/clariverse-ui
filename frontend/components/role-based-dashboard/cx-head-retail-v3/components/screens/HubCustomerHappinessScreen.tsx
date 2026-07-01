"use client";

import React from "react";
import { FailureClusters } from "@/components/FCI/FailureClusters";
import { getHubCardById } from "../../lib/cxHeadRetailV3HubCards";
import { FLIPKART_FCI_CLUSTERS } from "../../lib/cxHeadRetailV3FlipkartFciClusters";
import { useNavigation } from "../../lib/NavigationContext";
import { HubFluidHeadline } from "../common/HubFluidHeadline";
import { ScreenBackBar } from "../common/ScreenBackBar";
import { CustomerHappinessHvLvIntentPanel } from "../hub/CustomerHappinessHvLvIntentPanel";
import { FlipkartFciKpiCards } from "../hub/FlipkartFciKpiCards";
import { layout } from "../../theme/tokens";

export function HubCustomerHappinessScreen(): React.ReactElement {
  const { navigate } = useNavigation();
  const card = getHubCardById("customer-happiness");

  if (!card) {
    return <div style={{ padding: 32 }}>Card data unavailable.</div>;
  }

  return (
    <div
      className="lisn-anim-fade"
      style={{
        maxWidth: layout.contentMaxWidth,
        margin: "0 auto",
        padding: "24px 32px 48px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <HubFluidHeadline
        variant="customer-happiness"
        trailing={<ScreenBackBar onBack={() => navigate("overview")} />}
      />

      <FlipkartFciKpiCards isDarkMode />

      <FailureClusters clusters={FLIPKART_FCI_CLUSTERS} isDarkMode />

      <CustomerHappinessHvLvIntentPanel />
    </div>
  );
}
