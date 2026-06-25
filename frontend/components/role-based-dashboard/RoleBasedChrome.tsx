"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";

type RoleBasedUi = { isDarkMode: boolean };

const RoleBasedUiContext = createContext<RoleBasedUi>({ isDarkMode: true });

export function useRoleBasedUi() {
  return useContext(RoleBasedUiContext);
}

/** Layout shell for `/role-based`: no app sidebar (see ConditionalSidebar), no duplicate header/tabs — only fonts + theme context for list pages. */
export function RoleBasedChrome({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.add("dark");
    return () => {
      try {
        const theme = localStorage.getItem("theme");
        if (theme === "light") {
          document.documentElement.classList.remove("dark");
        }
      } catch {
        // keep dark
      }
    };
  }, []);

  const isDarkMode = true;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#010101" }}>
      <RoleBasedUiContext.Provider value={{ isDarkMode }}>
        <main
          className="w-full min-h-screen antialiased"
          style={{ fontFamily: "var(--font), system-ui, sans-serif" }}
          data-theme="dark"
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
