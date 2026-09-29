"use client";

import { exec } from "@kgs/lib/data";
import { Sparkles } from "lucide-react";
import { MoneyText } from "../shared/MoneyText";
import { K } from "../shared/tokens";
import { useLabel } from "../shell/DemoProvider";

/**
 * Executive Pulse — title + body only (display). Navigation via question cards / monitor.
 */
export function PulseStrip() {
  const L = useLabel();

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
          {L(exec.pulseLabel)}
        </h2>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 8,
        }}
      >
        {exec.pulse.map((item) => (
          <article
            key={item.n}
            style={{
              textAlign: "left",
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${K.borderLight}`,
              borderRadius: 8,
              padding: "10px 12px",
              display: "flex",
              flexDirection: "column",
              gap: 6,
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
              {item.n}. {L(item.title)}
            </div>
            <div
              style={{
                fontSize: 14,
                color: K.textSec,
                lineHeight: 1.4,
                fontWeight: 500,
              }}
            >
              <MoneyText text={item.textShort ?? item.text} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
