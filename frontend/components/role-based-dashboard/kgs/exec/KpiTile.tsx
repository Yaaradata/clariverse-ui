"use client";

import { IllustrativeChip } from "../shared/IllustrativeChip";
import { useLabel } from "../shell/DemoProvider";

type KpiTileProps = {
  value: string;
  sub?: string;
  chip?: string;
  chipColor?: string;
  tooltip?: string;
  onClick?: () => void;
  money?: boolean;
};

export function KpiTile({ value, sub, chip, chipColor, tooltip, onClick, money }: KpiTileProps) {
  const L = useLabel();

  const Component = onClick ? "button" : "div";

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      title={tooltip}
      style={{
        background: "#151515",
        border: "1px solid #1f1f1f",
        borderRadius: 12,
        padding: "16px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        flex: 1,
        minWidth: 0,
        cursor: onClick ? "pointer" : "default",
        textAlign: "left",
        transition: "border-color 0.15s",
      }}
      onMouseEnter={onClick ? (e: any) => { e.currentTarget.style.borderColor = "#3f3f46"; } : undefined}
      onMouseLeave={onClick ? (e: any) => { e.currentTarget.style.borderColor = "#1f1f1f"; } : undefined}
    >
      <div
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: "#ffffff",
          fontFamily: value.match(/\d/) ? "var(--mono, monospace)" : "inherit",
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1.2,
          display: "flex",
          alignItems: "baseline",
          gap: 6,
          flexWrap: "wrap",
        }}
      >
        {L(value)}
        {money ? <IllustrativeChip /> : null}
      </div>
      {chip ? (
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: chipColor || "#a3a3a3",
            padding: "3px 8px",
            borderRadius: 6,
            background: "#2a2a2a",
            alignSelf: "flex-start",
          }}
        >
          {L(chip)}
        </div>
      ) : null}
      {sub ? (
        <div
          style={{
            fontSize: 13,
            color: "#a3a3a3",
            lineHeight: 1.4,
          }}
        >
          {L(sub)}
        </div>
      ) : null}
    </Component>
  );
}
