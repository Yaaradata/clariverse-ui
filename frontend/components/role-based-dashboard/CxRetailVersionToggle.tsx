"use client";

import type { CSSProperties, ReactElement } from "react";
import Link from "next/link";

const ACCENT = "#5332FF";

export type CxRetailVersion = "v1" | "v2" | "v3";

const VERSION_OPTIONS: ReadonlyArray<{
  version: CxRetailVersion;
  label: string;
  roleId: string;
  preload: () => Promise<unknown>;
}> = [
  {
    version: "v1",
    label: "V1",
    roleId: "head_cx_retail",
    preload: () => import("@/components/role-based-dashboard/CXVoCHeadDashboard"),
  },
  {
    version: "v2",
    label: "V2",
    roleId: "head_cx_retail_v2",
    preload: () => import("@/components/role-based-dashboard/CXVoCHeadDashboardV2"),
  },
  {
    version: "v3",
    label: "V3",
    roleId: "head_cx_retail_v3",
    preload: () => import("@/components/role-based-dashboard/CXVoCHeadDashboardV3"),
  },
];

export type CxRetailVersionToggleProps = {
  industryId: string;
  activeVersion?: CxRetailVersion | null;
  isDarkMode?: boolean;
};

export function CxRetailVersionToggle({
  industryId,
  activeVersion = null,
  isDarkMode = true,
}: CxRetailVersionToggleProps): ReactElement {
  const trackBg = isDarkMode ? `${ACCENT}14` : `${ACCENT}10`;
  const trackBorder = isDarkMode ? `${ACCENT}33` : `${ACCENT}40`;

  return (
    <div
      role="group"
      aria-label="Dashboard version"
      style={{
        display: "inline-flex",
        padding: 3,
        borderRadius: 10,
        background: trackBg,
        border: `1px solid ${trackBorder}`,
        gap: 2,
        flexShrink: 0,
      }}
    >
      {VERSION_OPTIONS.map((opt) => {
        const isActive = activeVersion === opt.version;
        const href = `/role-based/${industryId}/${opt.roleId}`;

        const segmentStyle: CSSProperties = {
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: 0.6,
          padding: "6px 14px",
          borderRadius: 7,
          lineHeight: 1,
          textDecoration: "none",
          cursor: "pointer",
          transition: "background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease",
          ...(isActive
            ? { background: ACCENT, color: "#ffffff", boxShadow: `0 1px 4px ${ACCENT}55` }
            : { background: "transparent", color: ACCENT }),
        };

        return (
          <Link
            key={opt.version}
            href={href}
            onMouseEnter={() => {
              void opt.preload();
            }}
            aria-pressed={isActive}
            style={segmentStyle}
          >
            {opt.label}
          </Link>
        );
      })}
    </div>
  );
}

export function cxRetailVersionFromRoleId(roleId: string): CxRetailVersion | null {
  if (roleId === "head_cx_retail") return "v1";
  if (roleId === "head_cx_retail_v2") return "v2";
  if (roleId === "head_cx_retail_v3") return "v3";
  return null;
}
