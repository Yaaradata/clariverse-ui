"use client";

import { createContext, useContext, type ReactNode } from "react";

import { T as registryDefaultTheme } from "@/lib/role-based-dashboard/registry";

export type DashboardThemeTokens = typeof registryDefaultTheme;

const DashboardThemeContext = createContext<DashboardThemeTokens>(registryDefaultTheme);

export function DashboardThemeProvider({
  value,
  children,
}: {
  value: DashboardThemeTokens;
  children: ReactNode;
}) {
  return <DashboardThemeContext.Provider value={value}>{children}</DashboardThemeContext.Provider>;
}

export function useDashboardTheme(): DashboardThemeTokens {
  return useContext(DashboardThemeContext);
}
