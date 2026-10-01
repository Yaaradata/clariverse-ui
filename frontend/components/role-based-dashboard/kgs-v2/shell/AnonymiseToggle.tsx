"use client";

import { useDemo2, useV2K } from "@kgs2/lib/demoState";

/** Anonymise toggle — default OFF (v2 demoState). */
export function AnonymiseToggle() {
  const K = useV2K();
  const { state, toggleAnonymise } = useDemo2();
  const on = state.anonymise;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={toggleAnonymise}
      className="kgs2-focus"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: "transparent",
        border: "none",
        color: K.textSec,
        fontSize: 13,
        cursor: "pointer",
        fontFamily: "inherit",
        padding: 2,
      }}
    >
      <span
        aria-hidden
        style={{
          width: 32,
          height: 18,
          borderRadius: 999,
          background: on ? K.violet400 : K.borderLight,
          position: "relative",
          transition: "background 150ms",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 2,
            left: on ? 16 : 2,
            width: 14,
            height: 14,
            borderRadius: 999,
            background: "#fff",
            transition: "left 150ms",
          }}
        />
      </span>
      Anonymise
    </button>
  );
}
