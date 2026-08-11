"use client";

import React from "react";

import { AppShell } from "./category-intelligence-v2/components/layout/AppShell";
import { DashboardShellProvider } from "./category-intelligence-v2/lib/DashboardShellContext";
import { NavigationProvider } from "./category-intelligence-v2/lib/NavigationContext";
import { AppStateProvider } from "./category-intelligence-v2/state/AppStateContext";
import { DashboardThemeProvider } from "./category-intelligence-v2/theme/DashboardThemeProvider";

export type CategoryIntelligenceDashboardV2Props = {
  industryId: string;
  industryName: string;
  roleName: string;
  industryColor: string;
  onExit: () => void;
};

/** Business Head category intelligence — overview hub + drill screens. */
export default function CategoryIntelligenceDashboardV2({
  industryId,
  industryName,
  roleName,
  industryColor,
  onExit,
}: CategoryIntelligenceDashboardV2Props): React.ReactElement {
  return (
    <AppStateProvider>
      <DashboardThemeProvider defaultMode="dark">
        <DashboardShellProvider
          industryId={industryId}
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
    </AppStateProvider>
  );
}

export { CategoryIntelligenceDashboardV2 };
