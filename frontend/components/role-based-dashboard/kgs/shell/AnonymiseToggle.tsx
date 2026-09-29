"use client";

import { meta } from "@kgs/lib/data";
import { K } from "../shared/tokens";
import { useDemo } from "./DemoProvider";

/** AnonymiseToggle (03 §6.11, 04 §7.1): default OFF; switch semantics; text from meta.ui. */
export function AnonymiseToggle() {
  const { state, toggleAnonymise } = useDemo();
  const on = state.anonymise;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={toggleAnonymise}
      className="kgs-focus"
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
            background: K.text,
            transition: "left 150ms",
          }}
        />
      </span>
      {meta.ui.contextBar.anonymise}
    </button>
  );
}
