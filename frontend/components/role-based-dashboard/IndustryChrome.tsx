"use client";

import type { ReactNode } from "react";

import { T } from "@/lib/role-based-dashboard/registry";

export function IndustryChrome({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        fontFamily: "var(--font)",
        color: T.text,
        overflow: "auto",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700;800&display=swap');
        :root { --font: 'Outfit', system-ui, sans-serif; --mono: 'JetBrains Mono', monospace; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 4px; }
      `}</style>
      {children}
    </div>
  );
}
