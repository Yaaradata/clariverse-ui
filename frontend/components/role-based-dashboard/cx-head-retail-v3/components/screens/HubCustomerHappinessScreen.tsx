"use client";

import React from "react";
import { CustomerHappinessDashboard } from "../hub/CustomerHappinessDashboard";
import { HubFluidHeadline } from "../common/HubFluidHeadline";
import { HAPPINESS_DATA } from "../../lib/cxHeadRetailV3CustomerHappinessData";
import { useNavigation } from "../../lib/NavigationContext";
import { cssVar, layout } from "../../theme/tokens";

export function HubCustomerHappinessScreen(): React.ReactElement {
  const { trustRange } = useNavigation();
  const interactions = HAPPINESS_DATA[trustRange].interactions;

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
        purpose={
          <>
            Live read across <b style={{ color: cssVar("text-primary"), fontWeight: 600 }}>{interactions}</b> interactions ·
            Marketplace · <b style={{ color: cssVar("text-primary"), fontWeight: 600 }}>Head of CX</b>
          </>
        }
      />

      <CustomerHappinessDashboard period={trustRange} />
    </div>
  );
}
