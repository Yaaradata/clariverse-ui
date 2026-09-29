"use client";

import { meta } from "@kgs/lib/data";
import type { Confidence } from "@kgs/types";
import { K } from "./tokens";

/**
 * ConfidenceMarker (03 §6.2): level + p, with Known (solid) vs Inferred (hatched) kept
 * separate. Compact form shows the card's short text plus the K/I split bar when counts exist.
 */
export function ConfidenceMarker({
  confidence,
  short,
  compact = false,
}: {
  confidence?: Confidence;
  /** Card-level short text (monitor cards carry their own wording). */
  short?: string;
  compact?: boolean;
}) {
  const text = short ?? confidence?.short ?? "";
  const k = confidence?.known.count;
  const i = confidence?.inferred.count;
  const hasSplit = typeof k === "number" && typeof i === "number" && k + i > 0;

  return (
    <div
      title={meta.labels.confidenceTooltip}
      style={{ display: "flex", flexDirection: "column", gap: 4 }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 12,
          color: K.body,
          fontFamily: K.mono,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {hasSplit ? (
          <span
            aria-hidden
            style={{
              display: "inline-flex",
              width: compact ? 48 : 96,
              height: 8,
              borderRadius: 4,
              overflow: "hidden",
              border: `1px solid ${K.borderLight}`,
              flexShrink: 0,
            }}
          >
            <span style={{ flex: k, background: K.violet400 }} />
            <span
              style={{
                flex: i,
                background: `repeating-linear-gradient(45deg, ${K.violet400}66 0 3px, transparent 3px 6px)`,
              }}
            />
          </span>
        ) : null}
        <span>{text}</span>
      </div>
      {!compact && confidence ? (
        <div style={{ fontSize: 12, color: K.textMut, lineHeight: 1.5 }}>
          <div>
            K {confidence.known.count ?? ""} · {confidence.known.label}
          </div>
          <div style={{ fontStyle: "italic" }}>
            I {confidence.inferred.count ?? ""} · {confidence.inferred.label}
          </div>
        </div>
      ) : null}
    </div>
  );
}
