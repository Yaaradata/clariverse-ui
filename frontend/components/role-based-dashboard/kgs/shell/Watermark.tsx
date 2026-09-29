"use client";

import { meta } from "@kgs/lib/data";
import { useDemo } from "./DemoProvider";

/** Diagonal watermark (03 §6.10, 04 §7.1): 6% white, −30°, only when anonymised. */
export function Watermark() {
  const { state } = useDemo();
  if (!state.anonymise) return null;
  return (
    <div
      aria-hidden
      className="kgs-watermark"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 90,
        display: "grid",
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
    </div>
  );
}
