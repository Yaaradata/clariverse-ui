// components/layout/Header.tsx
// Pass 1 — back to overview + trust range (hub-trust) + light/dark toggle.

"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useNavigation } from "../../lib/NavigationContext";
import { useTheme } from "../../theme/DashboardThemeProvider";
import { cssVar, layout, radius } from "../../theme/tokens";
import { ScreenBackBar } from "../common/ScreenBackBar";
import { TrustRangeSelector } from "../hub/TrustBreakdownIntelligence";

export function Header(): React.ReactElement {
  const { mode, toggle } = useTheme();
  const { activeScreen, trustRange, setTrustRange } = useNavigation();
  const showBack = activeScreen !== "overview";
  const showTrustRange = activeScreen === "hub-trust" || activeScreen === "hub-customer-happiness";

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
      <div style={{ minWidth: 0 }}>{showBack ? <ScreenBackBar /> : null}</div>

      <div style={{ display: "inline-flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        {showTrustRange ? (
          <TrustRangeSelector range={trustRange} onChange={setTrustRange} />
        ) : null}
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
