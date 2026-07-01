"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

import type { CategoryVersion } from "@/components/role-based-dashboard/CategoryVersionToggle";
import type { AuditEntry } from "../state/appState";

export type DashboardShellContextValue = {
  industryId: string;
  categoryVersion: CategoryVersion;
  industryName: string;
  roleName: string;
  industryColor: string;
  onExit: () => void;
  auditLog: AuditEntry[];
  approveDraft: (signalId: string, actionLabel: string, acceptedBy?: string) => void;
};

const DashboardShellContext = createContext<DashboardShellContextValue | null>(null);

export function useDashboardShell(): DashboardShellContextValue {
  const ctx = useContext(DashboardShellContext);
  if (!ctx) {
    throw new Error("useDashboardShell must be used within DashboardShellProvider");
  }
  return ctx;
}

export function DashboardShellProvider({
  industryId,
  categoryVersion,
  industryName,
  roleName,
  industryColor,
  onExit,
  children,
}: {
  industryId: string;
  categoryVersion: CategoryVersion;
  industryName: string;
  roleName: string;
  industryColor: string;
  onExit: () => void;
  children: React.ReactNode;
}): React.ReactElement {
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);

  const approveDraft = useCallback(
    (signalId: string, actionLabel: string, acceptedBy = "Priya Nair") => {
      const accepted_at = new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      setAuditLog((prev) => [...prev, { signalId, actionLabel, accepted_by: acceptedBy, accepted_at }]);
    },
    [],
  );

  const value = useMemo(
    () => ({
      industryId,
      categoryVersion,
      industryName,
      roleName,
      industryColor,
      onExit,
      auditLog,
      approveDraft,
    }),
    [industryId, categoryVersion, industryName, roleName, industryColor, onExit, auditLog, approveDraft],
  );

  return <DashboardShellContext.Provider value={value}>{children}</DashboardShellContext.Provider>;
}
