"use client";

import type { ReactNode } from "react";
import { FastagBusinessPerformanceDrill } from "./FastagBusinessPerformanceDrill";
import { FastagGrowthDriversDrill } from "./FastagGrowthDriversDrill";
import { FastagPartnerIssuesGrowthDrill } from "./FastagPartnerIssuesGrowthDrill";
export type HobDrillId = "sales_issuance" | "ecosystem_partner" | "operations_escalations";

function SalesIssuanceDrill() {
  return <FastagBusinessPerformanceDrill />;
}

function EcosystemPartnerDrill() {
  return <FastagGrowthDriversDrill />;
}

function OperationsEscalationsDrill() {
  return <FastagPartnerIssuesGrowthDrill />;
}

export function FastagHobDrillRouter({ drillId, extra }: { drillId: HobDrillId; extra?: ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
      {drillId === "sales_issuance" ? <SalesIssuanceDrill /> : null}
      {drillId === "ecosystem_partner" ? <EcosystemPartnerDrill /> : null}
      {drillId === "operations_escalations" ? <OperationsEscalationsDrill /> : null}
      {extra ? <div style={{ marginTop: 8, width: "100%" }}>{extra}</div> : null}
    </div>
  );
}
