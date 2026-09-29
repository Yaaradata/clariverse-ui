"use client";

import { signalFw41 } from "@kgs/lib/data";
import { IllustrativeChip } from "../shared/IllustrativeChip";
import { K } from "../shared/tokens";
import { useLabel } from "../shell/DemoProvider";

const MONEY = /[$£]/;

/** WhyRankedPopover (02 HS-7): factor rows with small bars, composite line, footnote. */
export function WhyRankedPopover() {
  const L = useLabel();
  const { rankFactors = [], whyRanked } = signalFw41.signal;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ fontWeight: 700, color: K.text }}>{whyRanked.title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {rankFactors.map((f) => (
          <div
            key={f.label}
            style={{
              display: "grid",
              gridTemplateColumns: "150px 1fr 72px",
              alignItems: "center",
              gap: 10,
              fontSize: 13,
            }}
          >
            <span style={{ color: K.textMut }}>{f.label}</span>
            <span
              style={{
                color: K.textSec,
                fontFamily: K.mono,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {L(f.value)}
              {MONEY.test(f.value) ? <IllustrativeChip /> : null}
            </span>
            <span
              aria-hidden
              style={{
                height: 6,
                borderRadius: 3,
                background: K.cardInner,
                overflow: "hidden",
              }}
            >
              <span
                style={{
                  display: "block",
                  height: "100%",
                  width: `${f.score * 100}%`,
                  background: K.violet400,
                }}
              />
            </span>
          </div>
        ))}
      </div>
      <div
        style={{
          fontFamily: K.mono,
          fontVariantNumeric: "tabular-nums",
          color: K.text,
          fontSize: 13,
          paddingTop: 8,
          borderTop: `1px solid ${K.borderLight}`,
        }}
      >
        {whyRanked.line}
      </div>
      <div style={{ fontSize: 12, color: K.textMut }}>{whyRanked.footnote}</div>
    </div>
  );
}
