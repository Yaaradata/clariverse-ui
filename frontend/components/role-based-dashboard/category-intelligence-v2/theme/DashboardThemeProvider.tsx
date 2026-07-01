"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

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
  defaultMode = "dark",
  children,
}: ProviderProps): React.ReactElement {
  const [mode, setModeState] = useState<ThemeMode>(defaultMode);
  const [themeKey, setThemeKey] = useState(0);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState((prev) => {
      if (prev !== next) setThemeKey((k) => k + 1);
      return next;
    });
  }, []);

  const toggle = useCallback(() => {
    setModeState((prev) => (prev === "dark" ? "light" : "dark"));
    setThemeKey((k) => k + 1);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, themeKey, toggle, setMode }),
    [mode, themeKey, toggle, setMode],
  );

  const styleVars = useMemo(() => cssVarsFor(mode) as React.CSSProperties, [mode]);

  return (
    <ThemeContext.Provider value={value}>
      <GlobalStyles />
      <div className="lisn-shell" data-theme={mode} style={styleVars}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
