"use client";

import React from "react";
import { DashboardThemeProvider } from "./cx-head-retail/theme/DashboardThemeProvider";
import { GlobalStyles } from "./cx-head-retail/theme/globalStyles";
import { NavigationProvider } from "./cx-head-retail/lib/NavigationContext";
import { DashboardShellProvider } from "./cx-head-retail/lib/DashboardShellContext";
import { AppShell } from "./cx-head-retail/components/layout/AppShell";
import type { CxRetailVersion } from "./CxRetailVersionToggle";

export type CXVoCHeadDashboardProps = {
  industryId: string;
  industryName: string;
  roleName: string;
  industryColor: string;
  onExit: () => void;
  retailVersion?: CxRetailVersion;
};

/** Pass 1 — foundation shell only. Business logic arrives in later passes. */
export default function CXVoCHeadDashboard({
  industryId,
  industryName,
  roleName,
  industryColor,
  onExit,
  retailVersion = "v1",
}: CXVoCHeadDashboardProps): React.ReactElement {
  return (
    <DashboardThemeProvider defaultMode="dark">
      <GlobalStyles />
      <DashboardShellProvider
        industryId={industryId}
        industryName={industryName}
        roleName={roleName}
        industryColor={industryColor}
        onExit={onExit}
        retailVersion={retailVersion}
      >
        <NavigationProvider>
          <AppShell />
        </NavigationProvider>
      </DashboardShellProvider>
    </DashboardThemeProvider>
  );
}

export { CXVoCHeadDashboard };
