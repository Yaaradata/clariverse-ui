"use client";

import { useLabel } from "../shell/DemoProvider";
import { IllustrativeChip } from "./IllustrativeChip";

/** Grid and body strings carry no money flag; a currency glyph marks them (06 §2). */
export const MONEY = /[$£]/;

/**
 * Renders a data string through useLabel, and appends ILLUSTRATIVE when the
 * source text contains $ or £.
 */
export function MoneyText({ text }: { text: string }) {
  const L = useLabel();
  return (
    <>
      {L(text)}
      {MONEY.test(text) ? <IllustrativeChip /> : null}
    </>
  );
}
