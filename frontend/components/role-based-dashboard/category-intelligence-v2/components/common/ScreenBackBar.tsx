"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";

import { cssVar, radius } from "../../theme/tokens";

/** Returns user from a hub-linked screen to the overview — matches CX V3. */
export function ScreenBackBar({ onBack }: { onBack: () => void }): React.ReactElement {
  return (
    <button
      type="button"
      onClick={onBack}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: cssVar("accent-soft"),
        border: `1px solid ${cssVar("accent")}`,
        borderRadius: radius.md,
        padding: "8px 14px",
        cursor: "pointer",
        color: cssVar("accent"),
        fontSize: 13,
        fontWeight: 600,
        fontFamily: "inherit",
        flexShrink: 0,
      }}
    >
      <ArrowLeft size={14} />
      Back to Overview
    </button>
  );
}
