"use client";

import { meta, signalFw41 } from "@kgs/lib/data";
import { K, withAlpha } from "../shared/tokens";
import { useDemo, useLabel } from "../shell/DemoProvider";
import { HERO_ID } from "./format";

/** Recommended action (04 §4.8): amber while awaiting VP Engineering, green once approved. */
export function RecommendedAction() {
  const L = useLabel();
  const { isApproved } = useDemo();
  const approved = isApproved(HERO_ID);
  const tone = approved ? K.green : K.amber;
  const { recommendedPending, recommendedApproved } = meta.ui.hero;
  return (
    <div
      style={{
        borderRadius: K.radius.tile,
        border: `1px solid ${withAlpha(tone, 0.4)}`,
        background: withAlpha(tone, 0.08),
        padding: "10px 12px",
        transition: "background 300ms, border-color 300ms",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.06em",
          color: approved ? K.green : K.amber2,
          marginBottom: 4,
        }}
      >
        {approved ? recommendedApproved : recommendedPending}
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.5, color: K.textSec }}>
        {L(signalFw41.signal.recommendedAction)}
      </div>
    </div>
  );
}
