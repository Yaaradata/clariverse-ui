"use client";

import { installedBase } from "@kgs/lib/data";
import { K, withAlpha } from "../shared/tokens";

/** 26-cell micro date-code strip for monitor card 2 (04 §2.7, 03 §6.9). Window cells lit. */
export function DateCodeMicroStrip() {
  const cells = installedBase.dateCode.cells;
  return (
    <div
      aria-hidden
      style={{ display: "flex", gap: 2, height: 8, marginTop: 2 }}
    >
      {cells.map((c) => (
        <span
          key={c.dateCode}
          style={{
            flex: 1,
            borderRadius: 2,
            background: c.inWindow ? K.amber : withAlpha(K.textMut, 0.25),
          }}
        />
      ))}
    </div>
  );
}
