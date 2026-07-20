"use client";

import React, { useState } from "react";
import { FailureClusters } from "@/components/FCI/FailureClusters";
import { getHubCardById } from "../../lib/cxHeadRetailV3HubCards";
import { FLIPKART_FCI_CLUSTERS } from "../../lib/cxHeadRetailV3FlipkartFciClusters";
import { HAPPINESS_BASE_WIDE, type ValueLens } from "../../lib/cxHeadRetailV3HappinessLensData";
import { HubFluidHeadline } from "../common/HubFluidHeadline";
import { ConfidenceBand } from "../common/ConfidenceBand";
import { CustomerHappinessHvLvIntentPanel } from "../hub/CustomerHappinessHvLvIntentPanel";
import { FlipkartFciKpiCards } from "../hub/FlipkartFciKpiCards";
import { cssVar, layout, radius } from "../../theme/tokens";

function BaseWideHappyRateHeadline(): React.ReactElement {
  const h = HAPPINESS_BASE_WIDE;
  return (
    <div
      data-testid="happiness-screen-headline-rate"
      data-happy-rate={h.happyRate}
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 16,
        padding: "14px 18px",
        borderRadius: radius.lg,
        background: cssVar("surface"),
        border: `1px solid ${cssVar("border")}`,
        borderLeft: `3px solid ${cssVar("positive")}`,
      }}
    >
      <div>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: cssVar("text-muted") }}>
          Happy rate · all shoppers
        </div>
        <div className="lisn-num" style={{ fontSize: 36, fontWeight: 800, color: cssVar("text-primary"), lineHeight: 1.05 }}>
          {h.happyRate}%
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 200, fontSize: 12, color: cssVar("text-secondary"), lineHeight: 1.45 }}>
        {h.note} Contacts scored {h.contactsScored}. Inferred share of the score gets a confidence marker — not presented as a hard count.
      </div>
      <ConfidenceBand band={h.confidence} />
    </div>
  );
}

export function HubCustomerHappinessScreen(): React.ReactElement {
  const card = getHubCardById("customer-happiness");
  const [valueLens, setValueLens] = useState<ValueLens>("hv");

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
      <HubFluidHeadline variant="customer-happiness" />

      <BaseWideHappyRateHeadline />

      <FlipkartFciKpiCards isDarkMode valueLens={valueLens} onValueLensChange={setValueLens} />

      <FailureClusters clusters={FLIPKART_FCI_CLUSTERS} isDarkMode />

      <CustomerHappinessHvLvIntentPanel valueLens={valueLens} onValueLensChange={setValueLens} />
    </div>
  );
}
