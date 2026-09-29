"use client";

import { meta, signalFw41 } from "@kgs/lib/data";
import { ArrowLeft } from "lucide-react";
import { useKgsNav } from "../nav";
import { CountUp } from "../shared/CountUp";
import { K } from "../shared/tokens";
import { useLabel } from "../shell/DemoProvider";
import { RankChip } from "./RankChip";

/** Hero header block (04 §4.1–§4.2): back, rank chip, H1, metric line, sub-line. */
export function SignalHeader() {
  const L = useLabel();
  const { go } = useKgsNav();
  const { signal } = signalFw41;
  return (
    <header style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 12,
        }}
      >
        <button
          type="button"
          onClick={() => go("/installed-base")}
          className="kgs-focus"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "transparent",
            border: `1px solid ${K.borderLight}`,
            borderRadius: K.radius.chip,
            color: K.textSec,
            padding: "5px 10px",
            fontSize: 13,
            fontFamily: "inherit",
            cursor: "pointer",
          }}
        >
          <ArrowLeft size={14} aria-hidden />
          {meta.ui.hero.back}
        </button>
        <RankChip />
      </div>
      <h1
        style={{
          margin: 0,
          fontSize: 28,
          fontWeight: 800,
          lineHeight: 1.25,
          color: K.text,
          maxWidth: 1100,
        }}
      >
        {L(signal.headline)}
      </h1>
      <div
        style={{
          fontSize: 14,
          color: K.textSec,
          fontFamily: K.mono,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <CountUp
          text={L(signal.metric.line)}
          only={signal.metric.display.split(" vs ")}
        />
      </div>
      <div style={{ fontSize: 13, color: K.textMut }}>{L(signal.subline)}</div>
    </header>
  );
}
