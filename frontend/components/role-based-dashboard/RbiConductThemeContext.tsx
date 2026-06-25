"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import {
  getRbiThemeVars,
  RBI_ACCENT,
  RBI_THEME_STORAGE_KEY,
  type RbiAccent,
} from "./rbiConductTheme";

type RbiConductThemeContextValue = {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  toggleTheme: () => void;
  themeVars: CSSProperties;
  accent: RbiAccent;
};

const RbiConductThemeContext = createContext<RbiConductThemeContextValue | null>(
  null,
);

export function RbiConductThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(RBI_THEME_STORAGE_KEY);
    if (saved === "light" || saved === "dark") {
      setIsDarkMode(saved === "dark");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(RBI_THEME_STORAGE_KEY, isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  const value = useMemo<RbiConductThemeContextValue>(
    () => ({
      isDarkMode,
      setIsDarkMode,
      toggleTheme,
      themeVars: getRbiThemeVars(isDarkMode),
      accent: RBI_ACCENT,
    }),
    [isDarkMode, toggleTheme],
  );

  return (
    <RbiConductThemeContext.Provider value={value}>
      <div className="h-screen w-full" style={value.themeVars}>
        {children}
      </div>
    </RbiConductThemeContext.Provider>
  );
}

export function useRbiConductTheme(): RbiConductThemeContextValue {
  const ctx = useContext(RbiConductThemeContext);
  if (!ctx) {
    throw new Error("useRbiConductTheme must be used within RbiConductThemeProvider");
  }
  return ctx;
}
