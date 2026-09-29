"use client";

import { Landmark, Info } from "lucide-react";
import { IllustrativeChip } from "./IllustrativeChip";
import { useLabel } from "../shell/DemoProvider";

type PnLDestinationTagProps = {
  primary: string;
  secondary?: string;
  toDate?: string;
  projected?: string;
  caption?: string;
  compact?: boolean;
  onMethod?: () => void;
};

export function PnLDestinationTag({
  primary,
  secondary,
  toDate,
  projected,
  caption,
  compact,
  onMethod,
}: PnLDestinationTagProps) {
  const L = useLabel();

  if (compact) {
    return (
      <div style={{ fontSize: 13, color: "#a3a3a3" }}>
        P&L → {L(primary)} · {L(projected || toDate || "")}
        <IllustrativeChip />
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#131313",
        border: "1px solid #1f1f1f",
        borderRadius: 12,
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {/* Icon + Label */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Landmark size={18} color="#d4d4d8" />
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.05em",
            color: "#a3a3a3",
            textTransform: "uppercase",
          }}
        >
          P&L DESTINATION
        </div>
      </div>

      {/* Primary */}
      <div style={{ fontSize: 16, fontWeight: 700, color: "#ffffff" }}>
        {L(primary)}
      </div>

      {/* Secondary */}
      {secondary ? (
        <div style={{ fontSize: 13, color: "#a3a3a3" }}>
          also: {L(secondary)}
        </div>
      ) : null}

      {/* Exposure line */}
      {(toDate || projected) ? (
        <div
          style={{
            fontSize: 15,
            fontFamily: "var(--mono, monospace)",
            fontVariantNumeric: "tabular-nums",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 4,
          }}
        >
          {toDate ? `≈ ${L(toDate)} to date` : ""}
          {toDate && projected ? " · " : ""}
          {projected ? `≈ ${L(projected)} projected` : ""}
          <IllustrativeChip />
        </div>
      ) : null}

      {/* Caption */}
      {caption ? (
        <div style={{ fontSize: 13, color: "#a3a3a3", fontStyle: "italic" }}>
          {L(caption)}
        </div>
      ) : null}

      {/* Method button */}
      {onMethod ? (
        <button
          type="button"
          onClick={onMethod}
          style={{
            background: "transparent",
            border: "none",
            padding: 0,
            color: "#a78bfa",
            fontSize: 13,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4,
            alignSelf: "flex-start",
          }}
        >
          Method <Info size={14} />
        </button>
      ) : null}
    </div>
  );
}
