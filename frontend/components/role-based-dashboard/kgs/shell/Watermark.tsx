"use client";

import { meta } from "@kgs/lib/data";

/**
 * Diagonal watermark (03 §6.10, 04 §7.1): screen-hidden; visible only when printing/exporting.
 * Print also forces anonymise ON (see KgsCommercialFireDashboard beforeprint).
 */
export function Watermark() {
  return (
    <div
      aria-hidden
      className="kgs-watermark"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 90,
        placeItems: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          transform: "rotate(-30deg)",
          fontSize: 64,
          fontWeight: 800,
          color: "rgba(255,255,255,0.06)",
          whiteSpace: "nowrap",
          letterSpacing: "0.04em",
        }}
      >
        {meta.demo.watermark}
      </div>
      <span
        className="kgs-anon-chip"
        style={{
          position: "fixed",
          top: 12,
          right: 24,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.45)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 4,
          padding: "2px 8px",
        }}
      >
        {meta.demo.anonymisedChip}
      </span>
    </div>
  );
}
