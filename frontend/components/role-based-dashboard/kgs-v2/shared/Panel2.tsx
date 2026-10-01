"use client";

import { useV2K } from "@kgs2/lib/demoState";
import type { CSSProperties, ReactNode } from "react";

/**
 * v2 copy of the v1 drill Panel — same layout, theme-aware surface tokens.
 */
export function Panel({
  title,
  sub,
  right,
  icon,
  id,
  accentLeft,
  style,
  children,
}: {
  title?: ReactNode;
  sub?: ReactNode;
  right?: ReactNode;
  icon?: ReactNode;
  id?: string;
  accentLeft?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const K = useV2K();
  return (
    <section
      id={id}
      style={{
        background: K.panel,
        border: `1px solid ${K.border}`,
        borderLeft: accentLeft
          ? `3px solid ${accentLeft}`
          : `1px solid ${K.border}`,
        borderRadius: K.radius.card,
        padding: 18,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        minWidth: 0,
        ...style,
      }}
    >
      {title || right ? (
        <header
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ minWidth: 0 }}>
            {title ? (
              <h2
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 800,
                  color: K.text,
                  lineHeight: 1.3,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {icon}
                {title}
              </h2>
            ) : null}
            {sub ? (
              <div
                style={{
                  fontSize: 14,
                  color: K.textMut,
                  marginTop: 4,
                  lineHeight: 1.45,
                }}
              >
                {sub}
              </div>
            ) : null}
          </div>
          {right ? (
            <div
              style={{
                flexShrink: 0,
                fontSize: 13,
                color: K.textMut,
                textAlign: "right",
              }}
            >
              {right}
            </div>
          ) : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}
