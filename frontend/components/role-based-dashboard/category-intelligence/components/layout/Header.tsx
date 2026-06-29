import React from "react";
import { Moon, Sun } from "lucide-react";

import { useTheme } from "../../theme/DashboardThemeProvider";
import { useNavigation } from "../../lib/NavigationContext";
import { useAppState } from "../../state/AppStateContext";
import { screenById } from "../../lib/routes";
import { cssVar, layout, radius, type } from "../../theme/tokens";

export function Header(): React.ReactElement {
  const { mode, toggle, themeKey } = useTheme();
  const { activeScreen, closeDrill } = useNavigation();
  const { state, setPersonaId, resetTransientUi } = useAppState();
  const screen = screenById(activeScreen);

  const personaLabel = state.personaId === "category-head" ? "Category Head" : "CX / VoC Head";

  const onPersonaToggle = () => {
    const next = state.personaId === "category-head" ? "cx-voc-head" : "category-head";
    setPersonaId(next);
    resetTransientUi();
    closeDrill();
  };

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
      <div>
        <div
          style={{
            fontSize: type.scale.h3,
            fontWeight: type.weight.bold,
            color: cssVar("text-primary"),
          }}
        >
          {screen.label}
        </div>
        <div style={{ fontSize: type.scale.small, color: cssVar("text-muted"), marginTop: 2 }}>
          LiSN · Fluid CX · this week vs last week
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          type="button"
          key={`persona-${themeKey}`}
          onClick={onPersonaToggle}
          style={{
            padding: "6px 12px",
            borderRadius: radius.md,
            border: `1px solid ${cssVar("border")}`,
            background: cssVar("surface-raised"),
            color: cssVar("text-secondary"),
            fontSize: type.scale.small,
            cursor: "pointer",
          }}
        >
          {personaLabel}
        </button>
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
