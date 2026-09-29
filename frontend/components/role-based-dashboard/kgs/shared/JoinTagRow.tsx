"use client";

import { meta } from "@kgs/lib/data";
import type { JoinTag } from "@kgs/types";
import { useLabel } from "../shell/DemoProvider";
import { K } from "./tokens";

/** JoinTagRow (03 §6.3): prefix "JOINED ON"; first `max` tags on cards. */
export function JoinTagRow({ tags, max }: { tags: JoinTag[]; max?: number }) {
  const L = useLabel();
  const shown = typeof max === "number" ? tags.slice(0, max) : tags;
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
        <span
          key={`${t.key}-${t.value}`}
          style={{
            fontSize: 11,
            padding: "2px 7px",
            borderRadius: 6,
            border: `1px solid ${K.chipBorder}`,
            background: K.surface,
            color: K.body,
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ color: K.textMut }}>{t.key}</span> {L(t.value)}
        </span>
      ))}
    </div>
  );
}
