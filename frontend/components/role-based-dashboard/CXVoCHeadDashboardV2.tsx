"use client";

import React from "react";
import { DashboardThemeProvider } from "./cx-head-retail-v2/theme/DashboardThemeProvider";
import { GlobalStyles } from "./cx-head-retail-v2/theme/globalStyles";
import { NavigationProvider } from "./cx-head-retail-v2/lib/NavigationContext";
import { DashboardShellProvider } from "./cx-head-retail-v2/lib/DashboardShellContext";
import { AppShell } from "./cx-head-retail-v2/components/layout/AppShell";

export type CXVoCHeadDashboardV2Props = {
  industryName: string;
  roleName: string;
  industryColor: string;
  onExit: () => void;
};

/** V2 — fork of V1 (cx-head-retail). Edit here without affecting V1. */
export default function CXVoCHeadDashboardV2({
  industryName,
  roleName,
  industryColor,
  onExit,
}: CXVoCHeadDashboardV2Props): React.ReactElement {
  return (
    <DashboardThemeProvider defaultMode="dark">
      <GlobalStyles />
      <DashboardShellProvider
        industryName={industryName}
        roleName={roleName}
        industryColor={industryColor}
        onExit={onExit}
      >
        <NavigationProvider>
          <AppShell />
        </NavigationProvider>
      </DashboardShellProvider>
    </DashboardThemeProvider>
  );
}

export { CXVoCHeadDashboardV2 };
