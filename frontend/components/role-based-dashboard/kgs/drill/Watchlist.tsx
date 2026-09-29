"use client";

import { meta } from "@kgs/lib/data";
import { CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";
import { K, withAlpha } from "../shared/tokens";
import { useLabel } from "../shell/DemoProvider";
import { DrillChip } from "./Chips";
import { Panel } from "./Panel";

/**
 * Watchlist fork (03 §3C). Rows without a chip are green-tinted and carry the word "Stable"
 * (P-K, C-H); rows with a chip are neutral watch rows (S-H legacy residue).
 */
export function Watchlist({
  title,
  rows,
  footer,
  children,
}: {
  title: string;
  rows: { text: string; chip?: string }[];
  footer?: string;
  children?: ReactNode;
}) {
  const L = useLabel();
  const stableRows = rows.every((r) => !r.chip);
  return (
    <Panel title={L(title)} accentLeft={stableRows ? K.green : K.slate}>
      <ul
        style={{
          margin: 0,
          padding: 0,
          listStyle: "none",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {rows.map((r) => {
          const tone = r.chip ? K.slate : K.green;
          return (
            <li
              key={r.text}
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 8,
                background: withAlpha(tone, 0.08),
                border: `1px solid ${withAlpha(tone, 0.3)}`,
                fontSize: 14,
                lineHeight: 1.45,
                color: K.textSec,
              }}
            >
              <span style={{ display: "flex", gap: 8 }}>
                {r.chip ? null : (
                  <CheckCircle2
                    size={16}
                    color={K.green}
                    aria-hidden
                    style={{ flexShrink: 0, marginTop: 2 }}
                  />
                )}
                {L(r.text)}
              </span>
              {r.chip ? (
                <DrillChip text={r.chip} />
              ) : (
                <DrillChip text={meta.ui.drill.stable} tone="green" />
              )}
            </li>
          );
        })}
      </ul>
      {children}
      {footer ? (
        <div style={{ fontSize: 13, color: K.textMut }}>{L(footer)}</div>
      ) : null}
    </Panel>
  );
}
