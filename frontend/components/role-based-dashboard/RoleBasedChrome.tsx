"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type RoleBasedUi = { isDarkMode: boolean };

const RoleBasedUiContext = createContext<RoleBasedUi>({ isDarkMode: true });

export function useRoleBasedUi() {
  return useContext(RoleBasedUiContext);
}

/** Layout shell for `/role-based`: no app sidebar (see ConditionalSidebar), no duplicate header/tabs — only fonts + theme context for list pages. */
export function RoleBasedChrome({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      return savedTheme === null ? true : savedTheme === "dark";
    }
    return true;
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const initialDarkMode = savedTheme === null ? true : savedTheme === "dark";
    setIsDarkMode(initialDarkMode);
    if (initialDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: isDarkMode ? "#010101" : "#F5F5F5" }}>
      <RoleBasedUiContext.Provider value={{ isDarkMode }}>
        <main
          className="w-full min-h-screen antialiased"
          style={{ fontFamily: "var(--font), system-ui, sans-serif" }}
          data-theme={isDarkMode ? "dark" : "light"}
        >
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700;800&display=swap');
            :root { --font: 'Outfit', system-ui, sans-serif; --mono: 'JetBrains Mono', monospace; }
          `}</style>
          {children}
        </main>
      </RoleBasedUiContext.Provider>
    </div>
  );
}
