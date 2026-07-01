"use client";

import type { CSSProperties, ReactElement } from "react";
import Link from "next/link";

const ACCENT = "#8B7CF6";

export type CategoryVersion = "v1" | "v2";

const VERSION_OPTIONS: ReadonlyArray<{
  version: CategoryVersion;
  label: string;
  roleId: string;
  preload: () => Promise<unknown>;
}> = [
  {
    version: "v1",
    label: "V1",
    roleId: "business_head",
    preload: () => import("@/components/role-based-dashboard/CategoryIntelligenceDashboard"),
  },
  {
    version: "v2",
    label: "V2",
    roleId: "business_head_v2",
    preload: () => import("@/components/role-based-dashboard/CategoryIntelligenceDashboardV2"),
  },
];

export type CategoryVersionToggleProps = {
  industryId: string;
  activeVersion?: CategoryVersion | null;
  isDarkMode?: boolean;
};

export function CategoryVersionToggle({
  industryId,
  activeVersion = null,
  isDarkMode = false,
}: CategoryVersionToggleProps): ReactElement {
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
            ? { background: ACCENT, color: "#FAFAFA", boxShadow: `0 1px 4px ${ACCENT}55` }
            : { background: "transparent", color: isDarkMode ? ACCENT : "#6D5CE0" }),
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

export function categoryVersionFromRoleId(roleId: string): CategoryVersion | null {
  if (roleId === "business_head") return "v1";
  if (roleId === "business_head_v2") return "v2";
  return null;
}
