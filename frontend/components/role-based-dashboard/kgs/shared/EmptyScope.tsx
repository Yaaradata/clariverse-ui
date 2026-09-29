"use client";

import { meta } from "@kgs/lib/data";
import { K } from "./tokens";

/** EmptyScope (03 §6.13): shown when a filter leaves no signal above threshold. */
export function EmptyScope() {
  return (
    <div
      style={{
        padding: 16,
        borderRadius: K.radius.tile,
        border: `1px dashed ${K.borderLight}`,
        color: K.textMut,
        fontSize: 13,
        textAlign: "center",
      }}
    >
      {meta.ui.emptyScope}
    </div>
  );
}
