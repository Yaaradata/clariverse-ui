"use client";

import type { CSSProperties, ReactNode } from "react";
import { K, withAlpha } from "../../shared/tokens";
import { useLabel } from "../../shell/DemoProvider";

export const DR = {
  card: K.bg,
  border: K.border,
  text: K.text,
  sub: K.textSec,
  muted: K.textMut,
  dim: K.textMut,
  red: K.red,
  orange: K.orange,
  amber: K.amber,
  green: K.green,
  cyan: K.sky,
  purple: K.violet400,
} as const;

export function severityColor(s: string): string {
  const k = s.toLowerCase();
  if (k.includes("critical")) return DR.red;
  if (k.includes("high")) return DR.orange;
  if (k.includes("medium") || k.includes("watch") || k.includes("bottleneck"))
    return DR.amber;
  if (k.includes("healthy") || k.includes("positive") || k.includes("low"))
    return DR.green;
  if (k.includes("negative")) return DR.red;
  if (k.includes("neutral")) return DR.muted;
  return DR.muted;
}

export function DrMono({
  children,
  color,
  size = 15,
  weight = 700,
}: {
  children: ReactNode;
  color?: string;
  size?: number;
  weight?: number;
}) {
  return (
    <span
      style={{
        fontFamily: K.mono,
        fontWeight: weight,
        color: color || DR.text,
        fontSize: size,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {children}
    </span>
  );
}

export function DrBadge({
  children,
  color,
}: {
  children: ReactNode;
  color: string;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontSize: 11,
        fontWeight: 700,
        padding: "3px 8px",
        borderRadius: 4,
        background: withAlpha(color, 0.14),
        color,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        lineHeight: 1.2,
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {children}
    </span>
  );
}

export function DrTag({
  children,
  color,
}: {
  children: ReactNode;
  color: string;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontSize: 12,
        fontWeight: 700,
        padding: "3px 8px",
        borderRadius: 3,
        background: withAlpha(color, 0.18),
        color,
        letterSpacing: "0.04em",
      }}
    >
      {children}
    </span>
  );
}

export function DrCard({
  children,
  accent,
  style,
}: {
  children: ReactNode;
  accent?: string;
  style?: CSSProperties;
}) {
  return (
    <section
      style={{
        background: DR.card,
        border: `1px solid ${DR.border}`,
        borderLeft: accent ? `3px solid ${accent}` : `1px solid ${DR.border}`,
        borderRadius: 16,
        padding: 14,
        minWidth: 0,
        minHeight: 0,
        ...style,
      }}
    >
      {children}
    </section>
  );
}

export function DrHead({
  children,
  sub,
  badge,
}: {
  children: ReactNode;
  sub?: string;
  badge?: string;
}) {
  const L = useLabel();
  return (
    <header style={{ marginBottom: 12 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <h3
          style={{
            margin: 0,
            color: DR.text,
            fontSize: 17,
            fontWeight: 800,
            letterSpacing: "-0.01em",
          }}
        >
          {children}
        </h3>
        {badge ? <DrBadge color={DR.purple}>{badge}</DrBadge> : null}
      </div>
      {sub ? (
        <p
          style={{
            margin: "6px 0 0",
            fontSize: 14,
            color: DR.muted,
            lineHeight: 1.45,
          }}
        >
          {L(sub)}
        </p>
      ) : null}
    </header>
  );
}

export function DrFilterBar({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string; count?: number }[];
  value: string;
  onChange: (id: string) => void;
}) {
  const L = useLabel();
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
        marginBottom: 10,
      }}
    >
      {options.map((o) => {
        const on = value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o.id)}
            className="kgs-focus"
            style={{
              padding: "5px 10px",
              borderRadius: 999,
              border: `1px solid ${on ? withAlpha(K.violet400, 0.5) : K.borderLight}`,
              background: on ? withAlpha(K.violet400, 0.14) : "transparent",
              color: on ? K.violet300 : DR.muted,
              fontSize: 11,
              fontWeight: 700,
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            {L(o.label)}
            {o.count != null ? (
              <span style={{ marginLeft: 6, opacity: 0.75 }}>{o.count}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export function DrPill({
  children,
  color = DR.cyan,
}: {
  children: ReactNode;
  color?: string;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        fontSize: 12,
        fontWeight: 600,
        padding: "3px 8px",
        borderRadius: 999,
        border: `1px solid ${withAlpha(color, 0.35)}`,
        background: withAlpha(color, 0.1),
        color,
        lineHeight: 1.3,
      }}
    >
      {children}
    </span>
  );
}

export function DrTh({
  children,
  align = "left",
}: {
  children: ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      style={{
        padding: "8px 8px",
        textAlign: align,
        color: DR.dim,
        fontWeight: 700,
        fontSize: 10,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        background: DR.card,
        borderBottom: `1px solid ${DR.border}`,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </th>
  );
}

export function DrTd({
  children,
  align = "left",
}: {
  children: ReactNode;
  align?: "left" | "right";
}) {
  return (
    <td
      style={{
        padding: "10px 8px",
        textAlign: align,
        verticalAlign: "top",
        borderBottom: `1px solid ${DR.border}`,
        fontSize: 12,
        color: DR.sub,
        lineHeight: 1.4,
        wordBreak: "break-word",
      }}
    >
      {children}
    </td>
  );
}
