"use client";

import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { useDashboardTheme } from "./DashboardThemeContext";

export type FastagDrillTokens = {
  bg: string;
  bg2: string;
  surface: string;
  surface2: string;
  border: string;
  border2: string;
  text: string;
  dim: string;
  faint: string;
  red: string;
  amber: string;
  green: string;
  orange: string;
};

const LIGHT: FastagDrillTokens = {
  bg: "#f5f7fa",
  bg2: "#eef2f7",
  surface: "#ffffff",
  surface2: "#f8fafc",
  border: "rgba(26,26,46,0.10)",
  border2: "rgba(26,26,46,0.16)",
  text: "#1a1a2e",
  dim: "#4b5563",
  faint: "#6b7280",
  red: "#e63540",
  amber: "#d97706",
  green: "#059669",
  orange: "#ea580c",
};

const DARK: FastagDrillTokens = {
  bg: "#08080b",
  bg2: "#0c0c11",
  surface: "#111118",
  surface2: "#15151d",
  border: "rgba(255,255,255,0.06)",
  border2: "rgba(255,255,255,0.10)",
  text: "#f3f3f6",
  dim: "#9a9aa6",
  faint: "#63636f",
  red: "#ff3b46",
  amber: "#ffb020",
  green: "#2dd4a7",
  orange: "#ff7a45",
};

export function useFastagDrillTokens(): FastagDrillTokens {
  const theme = useDashboardTheme();
  const isLight = theme.bg.toLowerCase() !== "#0d1117";
  return isLight ? LIGHT : DARK;
}

export function FastagDrillStyles() {
  return (
    <style>{`
      .fastag-drill-2col {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
        align-items: stretch;
      }
      .fastag-drill-split {
        display: grid;
        grid-template-columns: minmax(260px, 0.9fr) minmax(0, 1.1fr);
        gap: 16px;
        align-items: start;
      }
      .fastag-drill-score-row {
        display: grid;
        grid-template-columns: minmax(140px, 0.45fr) minmax(0, 1fr);
        gap: 20px;
        align-items: flex-end;
      }
      @media (max-width: 1100px) {
        .fastag-drill-2col,
        .fastag-drill-split,
        .fastag-drill-score-row {
          grid-template-columns: 1fr;
        }
      }
      .fastag-drill-scroll {
        width: 100%;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }
      .fastag-drill-scroll table {
        min-width: 640px;
      }
      .fastag-bp-two-screen {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
      }
      .fastag-bp-screen-row {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
        align-items: stretch;
      }
      .fastag-bp-span-2 {
        grid-column: 1 / -1;
      }
      .fastag-bp-scroll-y {
        max-height: 148px;
        overflow-y: auto;
        overflow-x: hidden;
      }
      @media (max-width: 1100px) {
        .fastag-bp-screen-row {
          grid-template-columns: 1fr;
        }
      }
    `}</style>
  );
}

export function FastagDrillCanvas({
  children,
  tokens,
  compact = false,
}: {
  children: ReactNode;
  tokens: FastagDrillTokens;
  compact?: boolean;
}) {
  return (
    <div
      style={{
        width: "100%",
        color: tokens.text,
        background: `linear-gradient(180deg, ${tokens.surface} 0%, ${tokens.bg2} 100%)`,
        borderTop: `1px solid ${tokens.border}`,
        borderRight: `1px solid ${tokens.border}`,
        borderBottom: `1px solid ${tokens.border}`,
        borderLeft: `1px solid ${tokens.border}`,
        borderRadius: compact ? 12 : 16,
        padding: compact ? "12px 14px 14px" : "20px 24px 28px",
        boxSizing: "border-box",
      }}
    >
      <FastagDrillStyles />
      <div style={{ display: "flex", flexDirection: "column", gap: compact ? 10 : 28, width: "100%" }}>
        {children}
      </div>
    </div>
  );
}

const sectionMotion = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.4 },
};

export function FastagDrillSection({
  index,
  title,
  question,
  children,
  tokens,
  compact = false,
}: {
  index: string;
  title: string;
  question: string;
  children: ReactNode;
  tokens: FastagDrillTokens;
  compact?: boolean;
}) {
  return (
    <motion.section
      {...sectionMotion}
      style={{ display: "flex", flexDirection: "column", gap: compact ? 6 : 14, width: "100%", minHeight: 0 }}
    >
      <div style={{ display: "flex", gap: compact ? 8 : 12, alignItems: "flex-start", flexWrap: "wrap" }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            color: tokens.red,
            fontWeight: 700,
            fontSize: compact ? 11 : 13,
            lineHeight: 1.2,
            flexShrink: 0,
          }}
        >
          {index}
        </span>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h2
            style={{
              margin: 0,
              fontSize: compact ? 15 : "clamp(18px, 2vw, 24px)",
              fontWeight: 700,
              lineHeight: 1.25,
              color: tokens.text,
            }}
          >
            {title}
          </h2>
          {!compact ? (
            <p style={{ margin: "6px 0 0", color: tokens.dim, fontSize: 13, lineHeight: 1.45 }}>↳ {question}</p>
          ) : (
            <p style={{ margin: "2px 0 0", color: tokens.faint, fontSize: 10, lineHeight: 1.35 }}>{question}</p>
          )}
        </div>
      </div>
      <div
        style={{
          background: tokens.surface2,
          borderTop: `1px solid ${tokens.border}`,
          borderRight: `1px solid ${tokens.border}`,
          borderBottom: `1px solid ${tokens.border}`,
          borderLeft: `1px solid ${tokens.border}`,
          borderRadius: compact ? 10 : 14,
          padding: compact ? "10px 12px" : "18px 20px",
          minHeight: 0,
        }}
      >
        {children}
      </div>
    </motion.section>
  );
}

export function FastagDrillInsight({
  text,
  tokens,
  accent,
  compact = false,
}: {
  text: string;
  tokens: FastagDrillTokens;
  accent?: string;
  compact?: boolean;
}) {
  return (
    <div
      style={{
        marginTop: compact ? 0 : 16,
        borderTop: `1px solid ${tokens.border2}`,
        borderRight: `1px solid ${tokens.border2}`,
        borderBottom: `1px solid ${tokens.border2}`,
        borderLeft: `3px solid ${accent ?? tokens.red}`,
        borderRadius: 10,
        padding: "12px 14px",
        color: tokens.dim,
        fontSize: 13,
        lineHeight: 1.55,
      }}
    >
      {text}
    </div>
  );
}

export function FastagDrillPanel({
  children,
  tokens,
  style,
}: {
  children: ReactNode;
  tokens: FastagDrillTokens;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        background: `linear-gradient(180deg, ${tokens.surface}, ${tokens.bg2})`,
        borderTop: `1px solid ${tokens.border}`,
        borderRight: `1px solid ${tokens.border}`,
        borderBottom: `1px solid ${tokens.border}`,
        borderLeft: `1px solid ${tokens.border}`,
        borderRadius: 14,
        padding: "16px 18px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function FastagTableScroll({ children }: { children: ReactNode }) {
  return <div className="fastag-drill-scroll">{children}</div>;
}

export function FastagSectionBadge({ n, tokens }: { n: string; tokens: FastagDrillTokens }) {
  return (
    <span
      style={{
        width: 22,
        height: 22,
        borderRadius: 7,
        display: "grid",
        placeItems: "center",
        fontSize: 11,
        fontWeight: 700,
        background: "rgba(255,59,70,0.12)",
        color: tokens.red,
        flexShrink: 0,
      }}
    >
      {n}
    </span>
  );
}
