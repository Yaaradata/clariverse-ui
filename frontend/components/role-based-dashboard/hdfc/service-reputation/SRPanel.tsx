"use client";

import type { CSSProperties, ReactNode } from "react";
import { useDashboardTheme } from "../../DashboardThemeContext";

export function borderSides(
  top: string,
  right: string,
  bottom: string,
  left: string,
): Pick<
  CSSProperties,
  "borderTop" | "borderRight" | "borderBottom" | "borderLeft"
> {
  return {
    borderTop: top,
    borderRight: right,
    borderBottom: bottom,
    borderLeft: left,
  };
}

export function boxBorder(color: string) {
  const v = `1px solid ${color}`;
  return borderSides(v, v, v, v);
}

/** Retail-matching AI panel shell used across Service Reputation sections. */
export function SRPanel({
  title,
  subtitle,
  accentColor,
  ai = false,
  aiModel,
  headerRight,
  children,
  fill = false,
  minHeight,
}: {
  title: string;
  subtitle?: string;
  accentColor?: string;
  ai?: boolean;
  aiModel?: string;
  headerRight?: ReactNode;
  children: ReactNode;
  fill?: boolean;
  minHeight?: number;
}) {
  const T = useDashboardTheme();
  const accent = accentColor || T.cyan;
  const edge = ai ? `${accent}35` : T.borderLight;
  return (
    <div
      style={{
        background: T.elevated,
        ...borderSides(
          `1px solid ${edge}`,
          `1px solid ${edge}`,
          `1px solid ${edge}`,
          `3px solid ${accent}`,
        ),
        borderRadius: 14,
        padding: 18,
        position: ai ? "relative" : undefined,
        overflow: ai ? "hidden" : undefined,
        height: fill ? "100%" : undefined,
        minHeight,
        display: fill ? "flex" : undefined,
        flexDirection: fill ? "column" : undefined,
      }}
    >
      {ai ? (
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${accent}18 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
      ) : null}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 10,
          marginBottom: 12,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            {ai ? <span style={{ fontSize: 14, lineHeight: 1 }}>✨</span> : null}
            <span
              style={{
                fontSize: 12.5,
                fontWeight: 700,
                color: T.text,
                textTransform: "uppercase",
                letterSpacing: 0.8,
              }}
            >
              {title}
            </span>
          </div>
          {subtitle ? (
            <div style={{ fontSize: 11, color: T.textMut, marginTop: 4 }}>{subtitle}</div>
          ) : null}
        </div>
        {headerRight ? (
          <div style={{ flexShrink: 0, display: "relative", zIndex: 1 }}>{headerRight}</div>
        ) : ai && aiModel ? (
          <span
            style={{
              fontSize: 9,
              fontWeight: 800,
              color: accent,
              letterSpacing: 0.7,
              textTransform: "uppercase",
              padding: "3px 8px",
              borderRadius: 999,
              background: `${accent}15`,
              ...boxBorder(`${accent}40`),
              whiteSpace: "nowrap",
            }}
          >
            ✨ {aiModel.startsWith("AI") ? aiModel : `AI · ${aiModel}`}
          </span>
        ) : null}
      </div>
      <div
        style={{
          position: "relative",
          zIndex: 1,
          flex: fill ? 1 : undefined,
          minHeight: 0,
          display: fill ? "flex" : undefined,
          flexDirection: fill ? "column" : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
}
