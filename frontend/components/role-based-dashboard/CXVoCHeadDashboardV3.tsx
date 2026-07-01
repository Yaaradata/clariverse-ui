"use client";

import React from "react";
import { DashboardThemeProvider } from "./cx-head-retail-v3/theme/DashboardThemeProvider";
import { GlobalStyles } from "./cx-head-retail-v3/theme/globalStyles";
import { NavigationProvider } from "./cx-head-retail-v3/lib/NavigationContext";
import { DashboardShellProvider } from "./cx-head-retail-v3/lib/DashboardShellContext";
import { AppShell } from "./cx-head-retail-v3/components/layout/AppShell";

export type CXVoCHeadDashboardV3Props = {
  industryId: string;
  industryName: string;
  roleName: string;
  industryColor: string;
  onExit: () => void;
};

/**
 * V3 — Fluid CX evolution of V2: same five-screen shell and component library,
 * with e-commerce CX–native copy, operational risk spikes, and refined triage flows.
 */
export default function CXVoCHeadDashboardV3({
  industryId,
  industryName,
  roleName,
  industryColor,
  onExit,
}: CXVoCHeadDashboardV3Props): React.ReactElement {
  return (
    <DashboardThemeProvider defaultMode="dark">
      <GlobalStyles />
      <DashboardShellProvider
        industryId={industryId}
        industryName={industryName}
        roleName={roleName}
        industryColor={industryColor}
        onExit={onExit}
        retailVersion="v3"
      >
        <NavigationProvider>
          <AppShell />
        </NavigationProvider>
      </DashboardShellProvider>
    </DashboardThemeProvider>
  );
}

export { CXVoCHeadDashboardV3 };
