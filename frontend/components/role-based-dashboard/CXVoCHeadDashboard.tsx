"use client";

import React from "react";
import { DashboardThemeProvider } from "./cx-head-retail/theme/DashboardThemeProvider";
import { GlobalStyles } from "./cx-head-retail/theme/globalStyles";
import { NavigationProvider } from "./cx-head-retail/lib/NavigationContext";
import { DashboardShellProvider } from "./cx-head-retail/lib/DashboardShellContext";
import { AppShell } from "./cx-head-retail/components/layout/AppShell";

export type CXVoCHeadDashboardProps = {
  industryName: string;
  roleName: string;
  industryColor: string;
  onExit: () => void;
};

/** Pass 1 — foundation shell only. Business logic arrives in later passes. */
export default function CXVoCHeadDashboard({
  industryName,
  roleName,
  industryColor,
  onExit,
}: CXVoCHeadDashboardProps): React.ReactElement {
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

export { CXVoCHeadDashboard };
