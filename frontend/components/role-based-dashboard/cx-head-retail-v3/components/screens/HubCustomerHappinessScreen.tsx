"use client";

import React, { useState } from "react";
import { FailureClusters } from "@/components/FCI/FailureClusters";
import { getHubCardById } from "../../lib/cxHeadRetailV3HubCards";
import { FLIPKART_FCI_CLUSTERS } from "../../lib/cxHeadRetailV3FlipkartFciClusters";
import { type ValueLens } from "../../lib/cxHeadRetailV3HappinessLensData";
import { HubFluidHeadline } from "../common/HubFluidHeadline";
import { CustomerHappinessHvLvIntentPanel } from "../hub/CustomerHappinessHvLvIntentPanel";
import { FlipkartFciKpiCards } from "../hub/FlipkartFciKpiCards";
import { cssVar, layout } from "../../theme/tokens";

function SectionHead({ n, title }: { n: string; title: React.ReactNode }): React.ReactElement {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
      <span
        className="lisn-num"
        style={{
          width: 26,
          height: 26,
          display: "grid",
          placeItems: "center",
          fontSize: 11,
          fontWeight: 800,
          color: cssVar("accent-2"),
          borderRadius: 7,
          border: `1.5px solid ${cssVar("accent")}`,
          flexShrink: 0,
        }}
      >
        {n}
      </span>
      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: cssVar("text-primary"), letterSpacing: "-0.02em", lineHeight: 1.2 }}>
        {title}
      </h3>
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

      <section>
        <SectionHead n="01" title={<>Are customers <span style={{ color: cssVar("accent") }}>happy?</span></>} />
        <FlipkartFciKpiCards isDarkMode valueLens={valueLens} onValueLensChange={setValueLens} />
      </section>

      <section>
        <SectionHead n="02" title={<>Where happiness is <span style={{ color: cssVar("accent") }}>breaking</span></>} />
        <FailureClusters clusters={FLIPKART_FCI_CLUSTERS} isDarkMode />
      </section>

      <section>
        <SectionHead n="03" title={<>Who needs action <span style={{ color: cssVar("accent") }}>first</span></>} />
        <CustomerHappinessHvLvIntentPanel valueLens={valueLens} onValueLensChange={setValueLens} />
      </section>
    </div>
  );
}
