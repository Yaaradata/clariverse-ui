"use client";

import { meta, signalFw41 } from "@kgs/lib/data";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { K } from "../shared/tokens";
import { useLabel } from "../shell/DemoProvider";

/** CounterEvidence (02 HS-5, 03 §6.13): collapsed by default, neutral box. */
export function CounterEvidence() {
  const L = useLabel();
  const [open, setOpen] = useState(false);
  const text = signalFw41.signal.counterEvidence;
  if (!text) return null;
  return (
    <div
      style={{
        borderRadius: K.radius.tile,
        border: `1px solid ${K.borderLight}`,
        background: K.surface,
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="kgs-focus"
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 12px",
          background: "transparent",
          border: "none",
          borderRadius: K.radius.tile,
          color: K.textSec,
          fontSize: 13,
          fontWeight: 700,
          fontFamily: "inherit",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <ChevronDown
          size={16}
          aria-hidden
          style={{
            transform: open ? "rotate(0deg)" : "rotate(-90deg)",
            transition: "transform 150ms",
          }}
        />
        {meta.ui.hero.counterEvidence}
      </button>
      {open ? (
        <p
          style={{
            margin: 0,
            padding: "0 12px 12px 36px",
            fontSize: 14,
            lineHeight: 1.55,
            color: K.body,
          }}
        >
          {L(text)}
        </p>
      ) : null}
    </div>
  );
}
