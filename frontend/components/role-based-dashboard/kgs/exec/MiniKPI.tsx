"use client";

import { IllustrativeChip } from "../shared/IllustrativeChip";
import { useLabel } from "../shell/DemoProvider";

type MiniKPIProps = {
  label: string;
  value: string;
  caption?: string;
  money?: boolean;
};

export function MiniKPI({ label, value, caption, money }: MiniKPIProps) {
  const L = useLabel();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1, minWidth: 0 }}>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          color: "#737373",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: "#ffffff",
          fontFamily: value.match(/\d/) ? "var(--mono, monospace)" : "inherit",
          fontVariantNumeric: "tabular-nums",
          display: "flex",
          alignItems: "baseline",
          gap: 4,
          flexWrap: "wrap",
        }}
      >
        {L(value)}
        {money ? <IllustrativeChip /> : null}
      </div>
      {caption ? (
        <div
          style={{
            fontSize: 11,
            color: "#737373",
            fontFamily: caption.match(/\d/) ? "var(--mono, monospace)" : "inherit",
          }}
        >
          {L(caption)}
        </div>
      ) : null}
    </div>
  );
}
