"use client";

import { K } from "./tokens";

/** Tiny money-only tag — never used for non-money figures. */
export function IllustrativeChip(_props?: { title?: string }) {
  return (
    <span
      title={_props?.title}
      style={{
        display: "inline-block",
        marginLeft: 6,
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: "0.04em",
        textTransform: "lowercase",
        color: K.textMut,
        verticalAlign: "middle",
      }}
    >
      illustrative
    </span>
  );
}
