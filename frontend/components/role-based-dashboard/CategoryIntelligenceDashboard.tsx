"use client";

import React from "react";

import { AppShell } from "./category-intelligence/components/layout/AppShell";
import { DashboardShellProvider } from "./category-intelligence/lib/DashboardShellContext";
import { NavigationProvider } from "./category-intelligence/lib/NavigationContext";
import { AppStateProvider } from "./category-intelligence/state/AppStateContext";
import { DashboardThemeProvider } from "./category-intelligence/theme/DashboardThemeProvider";

export type CategoryIntelligenceDashboardProps = {
  industryName: string;
  roleName: string;
  industryColor: string;
  onExit: () => void;
};

/** Pass 1 — foundation shell only. Business logic arrives in later passes. */
export function CategoryIntelligenceDashboard({
  industryName,
  roleName,
  industryColor,
  onExit,
}: CategoryIntelligenceDashboardProps): React.ReactElement {
  return (
    <AppStateProvider>
      <DashboardThemeProvider defaultMode="light">
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
    </AppStateProvider>
  );
}
