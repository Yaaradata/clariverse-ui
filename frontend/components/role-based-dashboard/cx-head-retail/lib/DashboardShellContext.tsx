"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { AuditEntry } from "./cxHeadRetailData";

export type DashboardShellContextValue = {
  industryName: string;
  roleName: string;
  industryColor: string;
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
  industryName,
  roleName,
  industryColor,
  onExit,
  children,
}: {
  industryName: string;
  roleName: string;
  industryColor: string;
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
    () => ({ industryName, roleName, industryColor, onExit, auditLog, approveDraft }),
    [industryName, roleName, industryColor, onExit, auditLog, approveDraft],
  );

  return <DashboardShellContext.Provider value={value}>{children}</DashboardShellContext.Provider>;
}
