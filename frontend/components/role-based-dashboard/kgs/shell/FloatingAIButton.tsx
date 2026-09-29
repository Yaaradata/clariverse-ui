"use client";

import { meta } from "@kgs/lib/data";
import { Sparkles } from "lucide-react";

/**
 * Fork of the bank FloatingAIDayGenerator button (HeadOfCreditCardsDashboard.tsx:774-798).
 * P0 is the button with its tooltip only; the Ask LiSN panel is P2 (04 §2.10), so the
 * button is aria-disabled and opens nothing.
 */
export function FloatingAIButton() {
  const tip = meta.labels.askButtonTooltip;
  return (
    <button
      type="button"
      aria-disabled
      title={tip}
      aria-label={tip}
      className="kgs-focus"
      style={{
        position: "fixed",
        bottom: 52,
        right: 22,
        width: 52,
        height: 52,
        borderRadius: 26,
        border: "none",
        background: "linear-gradient(135deg, #c29764 0%, #724ed2 100%)",
        color: "#0a0d14",
        boxShadow: "0 12px 30px rgba(194,151,100,0.33)",
        cursor: "help",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <Sparkles size={20} />
    </button>
  );
}
