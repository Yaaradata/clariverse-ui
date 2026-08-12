"use client";

import React from "react";
import CaseConsole from "./case-resolution-console/CaseConsole";

export type CaseResolutionConsoleDashboardProps = {
  onExit: () => void;
  metrics?: {
    open?: number;
    atRisk?: number;
    breaching?: number;
    resolvedToday?: number;
    medianTtrMin?: number;
  };
};

/** Exact CaseConsole experience for the ecommerce Case Resolution Console role. */
export function CaseResolutionConsoleDashboard({
  onExit,
  metrics,
}: CaseResolutionConsoleDashboardProps): React.ReactElement {
  return <CaseConsole onExit={onExit} metrics={metrics} />;
}

export default CaseResolutionConsoleDashboard;
