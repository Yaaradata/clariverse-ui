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
      accent: {
        teal: "#14b8a6",
        indigo: "#6366f1",
        purple: "#a78bfa",
        red: "#ef4444",
        amber: "#f59e0b",
        yellow: "#eab308",
        green: "#22c55e",
        cyan: "#38bdf8",
        blue: "#60a5fa",
        saffron: "#f97316",
        muted: isDarkMode ? "#939394" : "#71717a",
      },
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
