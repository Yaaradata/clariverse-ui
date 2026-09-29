"use client";

import { IllustrativeChip } from "./IllustrativeChip";
import { K } from "./tokens";

/**
 * PnLDestinationTag (03 §6.4): where the signal lands on the P&L. Money text carries the
 * ILLUSTRATIVE chip and is never coloured green or red.
 */
export function PnLDestinationTag({
  text,
  money = false,
}: {
  text: string;
  money?: boolean;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        flexWrap: "wrap",
        fontSize: 12,
        color: K.body,
      }}
    >
      {text}
      {money ? <IllustrativeChip /> : null}
    </span>
  );
}
