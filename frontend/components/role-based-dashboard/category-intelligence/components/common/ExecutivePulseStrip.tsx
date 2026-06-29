import React from "react";

import { cssVar, radius } from "../../theme/tokens";

export function ExecutivePulseStrip({
  critical,
  focus,
  stable,
  answers,
}: {
  critical: string;
  focus: string;
  stable: string;
  answers: { critical: string; focus: string; stable: string };
}): React.ReactElement {
  const items = [
    { q: critical, a: answers.critical, color: cssVar("severity-high") },
    { q: focus, a: answers.focus, color: cssVar("severity-med") },
    { q: stable, a: answers.stable, color: cssVar("positive") },
  ];

  return (
    <div
      style={{
        borderRadius: radius.md,
        border: `1px solid ${cssVar("border")}`,
        background: cssVar("surface-raised"),
        padding: "10px 14px",
      }}
    >
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.5, color: cssVar("text-muted"), marginBottom: 8 }}>
        EXECUTIVE PULSE
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {items.map((item) => (
          <div key={item.q}>
            <div style={{ fontSize: 11, fontWeight: 600, color: item.color, marginBottom: 4 }}>{item.q}</div>
            <div style={{ fontSize: 12.5, color: cssVar("text-secondary"), lineHeight: 1.35 }}>{item.a}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
