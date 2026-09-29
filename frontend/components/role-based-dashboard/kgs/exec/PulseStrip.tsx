"use client";

import { exec } from "@kgs/lib/data";
import { Sparkles } from "lucide-react";
import { useKgsNav } from "../nav";
import { K, withAlpha } from "../shared/tokens";
import { useDemo, useLabel } from "../shell/DemoProvider";

const HERO_ID = "fw-4-1";

function Chip({ text, tone }: { text: string; tone?: string }) {
  return (
    <span
      style={{
        fontSize: 12,
        fontWeight: 600,
        padding: "2px 8px",
        borderRadius: 999,
        border: `1px solid ${tone ? withAlpha(tone, 0.5) : K.chipBorder}`,
        background: tone ? withAlpha(tone, 0.12) : K.surface,
        color: tone ?? K.body,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </span>
  );
}

/**
 * Fork of the bank "Executive Pulse" (HeadOfCreditCardsDashboard.tsx:1260-1304).
 * KGS changes: 02 §3.4 variant A copy from exec.json; orb emojis replaced by a neutral dot;
 * chip row S-class · owner · gate; card 1's gate chip follows the hero approval (04 §4.9).
 */
export function PulseStrip() {
  const L = useLabel();
  const { go } = useKgsNav();
  const { isApproved } = useDemo();
  const approved = isApproved(HERO_ID);

  return (
    <section
      style={{
        background: K.elevated,
        borderRadius: 10,
        padding: "12px 14px",
        borderLeft: `3px solid ${K.amber}`,
        border: `1px solid ${K.borderLight}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 9,
        }}
      >
        <Sparkles size={13} color={K.amber} aria-hidden />
        <h2
          style={{
            margin: 0,
            fontSize: 12,
            fontWeight: 700,
            color: K.amber,
            letterSpacing: "0.1em",
          }}
        >
          {exec.pulseLabel}
        </h2>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 8,
        }}
      >
        {exec.pulse.map((item) => {
          const gate =
            item.chipAfterApprove && approved
              ? item.chipAfterApprove
              : item.chips[2];
          // Approved → green; an open gate (cards 1–2) → amber; "No action needed" → neutral.
          const gateTone =
            item.chipAfterApprove && approved
              ? K.green
              : item.chips[0] !== item.chips[1]
                ? K.amber2
                : undefined;
          return (
            <button
              key={item.n}
              type="button"
              onClick={() => go(item.linkTo)}
              className="kgs-focus"
              style={{
                textAlign: "left",
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${K.borderLight}`,
                borderRadius: 8,
                padding: "10px 12px",
                display: "flex",
                flexDirection: "column",
                gap: 6,
                cursor: "pointer",
                color: "inherit",
                font: "inherit",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 14,
                  fontWeight: 700,
                  color: K.brandSoft,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 999,
                    background: K.textMut,
                  }}
                />
                {item.n}. {item.title}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: K.textSec,
                  lineHeight: 1.4,
                  fontWeight: 500,
                }}
              >
                {L(item.text)}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                <Chip text={item.chips[0]} />
                <Chip text={item.chips[1]} />
                <Chip text={gate} tone={gateTone} />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
