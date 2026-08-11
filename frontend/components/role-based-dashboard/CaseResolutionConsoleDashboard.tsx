"use client";

import React from "react";
import CaseConsole from "./case-resolution-console/CaseConsole";

export type CaseResolutionConsoleDashboardProps = {
  onExit: () => void;
};

/** Exact CaseConsole experience for the ecommerce Case Resolution Console role. */
export function CaseResolutionConsoleDashboard({
  onExit,
}: CaseResolutionConsoleDashboardProps): React.ReactElement {
  return <CaseConsole onExit={onExit} />;
}

export default CaseResolutionConsoleDashboard;
