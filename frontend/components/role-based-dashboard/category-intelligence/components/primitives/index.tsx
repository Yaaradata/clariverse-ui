import type { ReactNode } from "react";

import { cssVar } from "../../theme/tokens";

export function LayoutGrid({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(12, 1fr)",
        gap: 16,
      }}
    >
      {children}
    </div>
  );
}

export function CardShell({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: cssVar("surface"),
        border: `1px solid ${cssVar("border")}`,
        borderRadius: 14,
        padding: 20,
      }}
    >
      {children}
    </div>
  );
}

export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: cssVar("text-primary") }}>{title}</div>
      {subtitle ? (
        <div style={{ fontSize: 13, color: cssVar("text-muted"), marginTop: 4 }}>{subtitle}</div>
      ) : null}
    </div>
  );
}

export function FilterBar({ children }: { children?: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 16,
      }}
    >
      {children}
    </div>
  );
}

export function BackToHub({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        color: cssVar("accent"),
        cursor: "pointer",
        fontSize: 13,
        fontWeight: 600,
        padding: 0,
      }}
    >
      ← Back to Command Centre
    </button>
  );
}

export function AiMarker() {
  return (
    <span aria-hidden style={{ color: cssVar("accent"), fontWeight: 700 }}>
      ✦
    </span>
  );
}
