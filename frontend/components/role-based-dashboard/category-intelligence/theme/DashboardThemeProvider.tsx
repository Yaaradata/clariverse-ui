"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { useAppState } from "../state/AppStateContext";
import { GlobalStyles } from "./globalStyles";
import { cssVarsFor, type ThemeMode } from "./tokens";

interface ThemeContextValue {
  mode: ThemeMode;
  themeKey: number;
  toggle: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within DashboardThemeProvider");
  }
  return ctx;
}

interface ProviderProps {
  defaultMode?: ThemeMode;
  children: React.ReactNode;
}

export function DashboardThemeProvider({
  defaultMode = "light",
  children,
}: ProviderProps): React.ReactElement {
  const { state, setTheme: setAppTheme } = useAppState();
  const [themeKey, setThemeKey] = useState(0);

  const mode = state.theme ?? defaultMode;

  const setMode = useCallback(
    (next: ThemeMode) => {
      setAppTheme(next);
      setThemeKey((k) => k + 1);
    },
    [setAppTheme],
  );

  const toggle = useCallback(() => {
    setMode(mode === "dark" ? "light" : "dark");
  }, [mode, setMode]);

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, themeKey, toggle, setMode }),
    [mode, themeKey, toggle, setMode],
  );

  const styleVars = useMemo(() => cssVarsFor(mode) as React.CSSProperties, [mode]);

  return (
    <ThemeContext.Provider value={value}>
      <GlobalStyles />
      <div className="lisn-cat-shell" data-theme={mode} style={styleVars}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
