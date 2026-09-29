"use client";

import { meta } from "@kgs/lib/data";
import type { JoinTag } from "@kgs/types";
import { useState } from "react";
import { useLabel } from "../shell/DemoProvider";
import { K } from "./tokens";

const tagStyle = {
  fontSize: 11,
  padding: "2px 7px",
  borderRadius: 6,
  border: `1px solid ${K.chipBorder}`,
  background: K.surface,
  color: K.body,
  whiteSpace: "nowrap",
} as const;

/**
 * JoinTagRow (03 §6.3): prefix "JOINED ON"; first `max` tags on cards. `overflowAfter` shows
 * that many tags plus a "+n" chip that expands the rest (hero, 06 Step 9).
 */
export function JoinTagRow({
  tags,
  max,
  overflowAfter,
}: {
  tags: JoinTag[];
  max?: number;
  overflowAfter?: number;
}) {
  const L = useLabel();
  const [expanded, setExpanded] = useState(false);
  const capped = typeof max === "number" ? tags.slice(0, max) : tags;
  const hidden =
    typeof overflowAfter === "number" && !expanded
      ? Math.max(capped.length - overflowAfter, 0)
      : 0;
  const shown = hidden > 0 ? capped.slice(0, overflowAfter) : capped;
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 6,
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.08em",
          color: K.textMut,
        }}
      >
        {meta.labels.joinTagPrefix}
      </span>
      {shown.map((t) => (
        <span key={`${t.key}-${t.value}`} style={tagStyle}>
          <span style={{ color: K.textMut }}>{t.key}</span> {L(t.value)}
        </span>
      ))}
      {hidden > 0 ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="kgs-focus"
          style={{
            ...tagStyle,
            color: K.violet400,
            fontWeight: 700,
            fontFamily: "inherit",
            cursor: "pointer",
          }}
        >
          +{hidden}
        </button>
      ) : null}
    </div>
  );
}
