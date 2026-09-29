"use client";

import { separation } from "@kgs/lib/data";
import { BackToOverviewHeader } from "../drill/BackToOverviewHeader";
import {
  CashImpactPanel,
  CutoverFailuresPanel,
  InvoiceDisputeFunnel,
  TopCutoverIssues,
  WhyInvoicesStuck,
} from "../drill/separation/SeparationDrillSections";

const S = separation;

/**
 * Q3 /separation — service-promise layout (failures + cash → why stuck → issues + funnel).
 * No Signal Wall / cohort line chart (those stay on Installed base only). USD only.
 */
export function SeparationView() {
  const v2 = S.v2;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <BackToOverviewHeader title={S.title} subtitle={S.subtitle} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: 12,
          alignItems: "stretch",
        }}
      >
        <CutoverFailuresPanel data={v2.cutoverFailures} />
        <CashImpactPanel data={v2.cashImpact} />
      </div>
      <WhyInvoicesStuck data={v2.whyStuck} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: 12,
          alignItems: "stretch",
        }}
      >
        <TopCutoverIssues rows={v2.topIssues} />
        <InvoiceDisputeFunnel data={v2.funnel} />
      </div>
    </div>
  );
}
