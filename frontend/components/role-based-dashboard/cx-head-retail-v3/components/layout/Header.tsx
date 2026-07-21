// components/layout/Header.tsx
// Left: Back to Roles (overview) or Back to Overview · Right: timeframe + theme toggle.

"use client";

import React from "react";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { useDashboardShell } from "../../lib/DashboardShellContext";
import { useNavigation } from "../../lib/NavigationContext";
import { useTheme } from "../../theme/DashboardThemeProvider";
import { cssVar, layout, radius } from "../../theme/tokens";
import { ScreenBackBar } from "../common/ScreenBackBar";
import { TrustRangeSelector } from "../hub/TrustBreakdownIntelligence";

export function Header(): React.ReactElement {
  const { mode, toggle } = useTheme();
  const { onExit } = useDashboardShell();
  const { activeScreen, trustRange, setTrustRange } = useNavigation();
  const showBackToOverview = activeScreen !== "overview";
  const showBackToRoles = activeScreen === "overview";

  return (
    <header
      style={{
        height: layout.headerHeight,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        background: cssVar("surface"),
        borderBottom: `1px solid ${cssVar("border")}`,
      }}
    >
      <div style={{ minWidth: 0, displayShrink: 0 }}>
        {showBackToRoles ? (
          <button
            type="button"
            onClick={onExit}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: cssVar("accent-soft"),
              border: `1px solid ${cssVar("accent")}`,
              borderRadius: radius.md,
              padding: "8px 14px",
              cursor: "pointer",
              color: cssVar("accent"),
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "inherit",
              flexShrink: 0,
            }}
          >
            <ArrowLeft size={14} />
            Back to Roles
          </button>
        ) : null}
        {showBackToOverview ? <ScreenBackBar /> : null}
      </div>

      <div style={{ display: "inline-flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <TrustRangeSelector range={trustRange} onChange={setTrustRange} />
        <button
          type="button"
          onClick={toggle}
          aria-label={mode === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            borderRadius: radius.md,
            cursor: "pointer",
            color: cssVar("text-secondary"),
            background: cssVar("surface-raised"),
            border: `1px solid ${cssVar("border")}`,
          }}
        >
          {mode === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>
    </header>
  );
}
