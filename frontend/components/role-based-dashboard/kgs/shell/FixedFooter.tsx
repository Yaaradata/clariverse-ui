"use client";

import { meta } from "@kgs/lib/data";
import { K } from "../shared/tokens";

/** FixedFooter (04 §1.5): on every view, pinned to the bottom of the content column. */
export function FixedFooter() {
  return (
    <footer
      style={{
        position: "sticky",
        bottom: 0,
        zIndex: 30,
        padding: "8px 24px",
        background: "rgba(13,13,13,0.96)",
        borderTop: `1px solid ${K.borderLight}`,
        fontSize: 12,
        color: K.textMut,
        textAlign: "center",
      }}
    >
      {meta.footer}
    </footer>
  );
}
