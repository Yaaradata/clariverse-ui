"use client";

import { meta } from "@kgs/lib/data";
import { useEffect, useState } from "react";
import { CountUp } from "../shared/CountUp";
import { K } from "../shared/tokens";
import { useLabel } from "./DemoProvider";

/** 04 §6.1: the whole intro stays within 1.5s. */
const LINE2_MS = 650;
const TAGLINE_MS = 1000;
const FADE_MS = 1350;
const DONE_MS = 1500;

type Phase = 0 | 1 | 2;

/** Skeleton rows echo the overview: funnel tiles, brief + pulse, question cards. */
const SKELETON_ROWS = [
  { id: "funnel", cells: ["f1", "f2", "f3", "f4"] },
  { id: "brief", cells: ["b1", "b2"] },
  { id: "questions", cells: ["q1", "q2", "q3"] },
] as const;

/**
 * Intro (04 §6.1, P1): skeletons with the mono reading line counting up, then the funnel line,
 * then the tagline. Skipped by any click or key; the parent mounts it once per page load.
 */
export function Intro({ onDone }: { onDone: () => void }) {
  const L = useLabel();
  const [phase, setPhase] = useState<Phase>(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setPhase(1), LINE2_MS),
      window.setTimeout(() => setPhase(2), TAGLINE_MS),
      window.setTimeout(() => setFading(true), FADE_MS),
      window.setTimeout(onDone, DONE_MS),
    ];
    const skip = () => onDone();
    window.addEventListener("pointerdown", skip, { capture: true });
    window.addEventListener("keydown", skip, { capture: true });
    return () => {
      for (const t of timers) window.clearTimeout(t);
      window.removeEventListener("pointerdown", skip, { capture: true });
      window.removeEventListener("keydown", skip, { capture: true });
    };
  }, [onDone]);

  return (
    <output
      aria-live="polite"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 65,
        background: K.bg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 28,
        padding: "0 12vw",
        opacity: fading ? 0 : 1,
        transition: `opacity ${DONE_MS - FADE_MS}ms ease-out`,
      }}
    >
      <div
        aria-hidden
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        {SKELETON_ROWS.map((row) => (
          <div key={row.id} style={{ display: "flex", gap: 12 }}>
            {row.cells.map((cell) => (
              <div
                key={cell}
                style={{
                  flex: 1,
                  height: 56,
                  borderRadius: K.radius.tile,
                  background: K.surface,
                  border: `1px solid ${K.border}`,
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div
          style={{
            fontFamily: K.mono,
            fontVariantNumeric: "tabular-nums",
            fontSize: 18,
            color: K.textSec,
          }}
        >
          <CountUp text={L(meta.demo.introLine)} />
        </div>
        <div
          className={phase >= 1 ? "kgs-fade-in" : undefined}
          style={{
            fontFamily: K.mono,
            fontSize: 14,
            color: K.textMut,
            visibility: phase >= 1 ? "visible" : "hidden",
          }}
        >
          {L(meta.demo.introLine2)}
        </div>
        <div
          className={phase >= 2 ? "kgs-fade-in" : undefined}
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: K.text,
            visibility: phase >= 2 ? "visible" : "hidden",
          }}
        >
          {L(meta.demo.tagline)}
        </div>
      </div>
    </output>
  );
}
