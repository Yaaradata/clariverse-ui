"use client";

import { meta, signalFw41 } from "@kgs/lib/data";
import { type LucideIcon, Repeat, Scale, Sparkles } from "lucide-react";
import { K } from "../shared/tokens";
import { useLabel } from "../shell/DemoProvider";

const ICONS: Record<string, LucideIcon> = { Sparkles, Repeat, Scale };
/** 04 §6 pulses the "New phrasing" chip once on mount (P1). */
const PULSE_CHIP = "New phrasing";

/** Product ↔ practice attribution bar; the dot sits at `pos` from the product end. */
function AttributionBar({ pos }: { pos: number }) {
  const [left, right] = meta.ui.hero.attribution;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 11,
        color: K.textMut,
      }}
    >
      {left}
      <span
        aria-hidden
        style={{
          position: "relative",
          width: 72,
          height: 4,
          borderRadius: 2,
          background: K.borderLight,
        }}
      >
        <span
          style={{
            position: "absolute",
            top: -3,
            left: `calc(${pos * 100}% - 5px)`,
            width: 10,
            height: 10,
            borderRadius: 999,
            background: K.violet400,
          }}
        />
      </span>
      {right}
    </span>
  );
}

/** SignalChips (02 HS-5, 03 §6.13): outline pills with icon; the third carries the attribution bar. */
export function SignalChips() {
  const L = useLabel();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {(signalFw41.signal.chips ?? []).map((c) => {
        const Icon = ICONS[c.icon] ?? Sparkles;
        return (
          <span
            key={c.text}
            className={
              c.text.startsWith(PULSE_CHIP) ? "kgs-chip-pulse" : undefined
            }
            style={{
              display: "inline-flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "6px 10px",
              padding: "6px 10px",
              borderRadius: K.radius.tile,
              border: `1px solid ${K.borderLight}`,
              fontSize: 13,
              color: K.textSec,
              lineHeight: 1.4,
            }}
          >
            <span
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <Icon size={14} color={K.violet400} aria-hidden />
              {L(c.text)}
            </span>
            {typeof c.attributionPos === "number" ? (
              <AttributionBar pos={c.attributionPos} />
            ) : null}
          </span>
        );
      })}
    </div>
  );
}
