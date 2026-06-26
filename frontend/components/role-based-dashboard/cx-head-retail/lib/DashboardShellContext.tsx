"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { CxRetailVersion } from "@/components/role-based-dashboard/CxRetailVersionToggle";
import type { AuditEntry } from "./cxHeadRetailData";

export type DashboardShellContextValue = {
  industryId: string;
  industryName: string;
  roleName: string;
  industryColor: string;
  retailVersion: CxRetailVersion;
  onExit: () => void;
  auditLog: AuditEntry[];
  approveDraft: (action: string, acceptedBy?: string) => void;
};

const DashboardShellContext = createContext<DashboardShellContextValue | null>(null);

export function useDashboardShell(): DashboardShellContextValue {
  const ctx = useContext(DashboardShellContext);
  if (!ctx) throw new Error("useDashboardShell must be used within DashboardShellProvider");
  return ctx;
}

export function DashboardShellProvider({
  industryId,
  industryName,
  roleName,
  industryColor,
  retailVersion = "v1",
  onExit,
  children,
}: {
  industryId: string;
  industryName: string;
  roleName: string;
  industryColor: string;
  retailVersion?: CxRetailVersion;
  onExit: () => void;
  children: React.ReactNode;
}): React.ReactElement {
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);

  const approveDraft = useCallback((action: string, acceptedBy = "Head of CX") => {
    const acceptedAt = new Date().toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    setAuditLog((prev) => [...prev, { action, acceptedBy, acceptedAt }]);
  }, []);

  const value = useMemo(
    () => ({ industryId, industryName, roleName, industryColor, retailVersion, onExit, auditLog, approveDraft }),
    [industryId, industryName, roleName, industryColor, retailVersion, onExit, auditLog, approveDraft],
  );

  return <DashboardShellContext.Provider value={value}>{children}</DashboardShellContext.Provider>;
}
