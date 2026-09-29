"use client";

import { Info } from "lucide-react";

type ConfidenceLevel = "H" | "M" | "L";

type ConfidenceMarkerProps = {
  level?: ConfidenceLevel;
  value?: number;
  known?: number;
  inferred?: number;
  short?: string;
  compact?: boolean;
};

export function ConfidenceMarker({
  level,
  value,
  known = 0,
  inferred = 0,
  short,
  compact,
}: ConfidenceMarkerProps) {
  const total = known + inferred;
  const knownPct = total > 0 ? (known / total) * 100 : 50;
  const inferredPct = total > 0 ? (inferred / total) * 100 : 50;

  const pips = level === "H" ? [true, true, true] : level === "M" ? [true, true, false] : [true, false, false];

  if (compact) {
    if (short && known === 0 && inferred === 0) {
      // Only short text, no bar
      return (
        <div style={{ fontSize: 13, color: "#a3a3a3" }}>
          {short}
        </div>
      );
    }

    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ fontSize: 13, color: "#a3a3a3" }}>
          {short || `${level} ${value?.toFixed(2)} · K ${known} / I ${inferred}`}
        </div>
        {total > 0 ? (
          <div
            style={{
              width: 48,
              height: 10,
              borderRadius: 999,
              overflow: "hidden",
              display: "flex",
              background: "#2a2a2a",
            }}
          >
            <div
              style={{
                width: `${knownPct}%`,
                background: "#d4d4d8",
              }}
            />
            <div
              style={{
                width: `${inferredPct}%`,
                background: "repeating-linear-gradient(135deg, #737373 0 4px, transparent 4px 8px)",
                border: "1px solid #737373",
              }}
            />
          </div>
        ) : null}
      </div>
    );
  }

  // Full variant
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Row 1: Label + Level pill + Info */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.05em",
            color: "#a3a3a3",
            textTransform: "uppercase",
          }}
        >
          CONFIDENCE
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "4px 10px",
            borderRadius: 999,
            background: "#2a2a2a",
            border: "1px solid #3f3f46",
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: "#ffffff" }}>
            {level} {value?.toFixed(2)}
          </span>
          <div style={{ display: "flex", gap: 3 }}>
            {pips.map((filled, idx) => (
              <div
                key={idx}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: filled ? "#d4d4d8" : "#3f3f46",
                }}
              />
            ))}
          </div>
        </div>
        <button
          type="button"
          title="K = joined, verified records. I = text-extracted or imputed. Kept separate on every signal."
          style={{
            background: "transparent",
            border: "none",
            padding: 0,
            cursor: "pointer",
            color: "#939394",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Info size={14} />
        </button>
      </div>

      {/* Row 2: Split bar */}
      <div
        style={{
          height: 10,
          borderRadius: 999,
          overflow: "hidden",
          display: "flex",
          background: "#2a2a2a",
        }}
      >
        <div
          style={{
            width: `${knownPct}%`,
            background: "#d4d4d8",
          }}
        />
        <div
          style={{
            width: `${inferredPct}%`,
            background: "repeating-linear-gradient(135deg, #737373 0 4px, transparent 4px 8px)",
            border: "1px solid #737373",
          }}
        />
      </div>

      {/* Row 3: Legend */}
      <div style={{ display: "flex", gap: 16, fontSize: 13 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 12, height: 12, background: "#d4d4d8", borderRadius: 2 }} />
          <span style={{ color: "#ffffff", fontWeight: 700 }}>K {known}</span>
          <span style={{ color: "#a3a3a3" }}>known — firmware in the record</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 12,
              height: 12,
              background: "repeating-linear-gradient(135deg, #737373 0 4px, transparent 4px 8px)",
              border: "1px solid #737373",
              borderRadius: 2,
            }}
          />
          <span style={{ color: "#ffffff", fontWeight: 700 }}>I {inferred}</span>
          <span style={{ color: "#a3a3a3" }}>inferred — from ship date and download logs</span>
        </div>
      </div>
    </div>
  );
}
