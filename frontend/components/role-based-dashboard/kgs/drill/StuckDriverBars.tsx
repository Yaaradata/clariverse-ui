"use client";

import type { DriverBar } from "@kgs/types";
import { K, withAlpha } from "../shared/tokens";
import { useLabel } from "../shell/DemoProvider";
import { PanelLabel } from "./Panel";

const CHIP_COLOUR: Record<DriverBar["chip"], string> = {
  High: K.orange,
  Medium: K.amber,
  Watch: K.slate,
};

/** StuckDriverBars (03 §3C): label + meta, bar against its own max, chip in words. */
export function StuckDriverBars({
  title,
  drivers,
}: {
  title: string;
  drivers: DriverBar[];
}) {
  const L = useLabel();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <PanelLabel>{L(title)}</PanelLabel>
      {drivers.map((d) => {
        const colour = CHIP_COLOUR[d.chip];
        return (
          <div
            key={d.label}
            style={{ display: "flex", flexDirection: "column", gap: 4 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: 10,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700, color: K.text }}>
                {L(d.label)}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: K.radius.pill,
                  border: `1px solid ${withAlpha(colour, 0.5)}`,
                  background: withAlpha(colour, 0.12),
                  color: colour,
                  flexShrink: 0,
                }}
              >
                {d.chip}
              </span>
            </div>
            <div
              aria-hidden
              style={{
                height: 6,
                borderRadius: 3,
                background: K.border,
                overflow: "hidden",
              }}
            >
              <div
                className="kgs-grow"
                style={{
                  width: `${Math.min(100, (d.value / d.max) * 100)}%`,
                  height: "100%",
                  background: colour,
                  borderRadius: 3,
                }}
              />
            </div>
            <div style={{ fontSize: 12, color: K.textMut }}>{L(d.meta)}</div>
          </div>
        );
      })}
    </div>
  );
}
