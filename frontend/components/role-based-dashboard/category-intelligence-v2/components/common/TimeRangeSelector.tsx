"use client";

import React from "react";
import { cssVar } from "../../theme/tokens";

export type TimeRangeKey = "24H" | "7D" | "30D";

const RANGES: readonly TimeRangeKey[] = ["24H", "7D", "30D"];

/** Header timeframe toggle — matches Head of CX (Retail) 24H / 7D / 30D control. */
export function TimeRangeSelector({
  range,
  onChange,
}: {
  range: TimeRangeKey;
  onChange: (k: TimeRangeKey) => void;
}): React.ReactElement {
  return (
    <div
      role="group"
      aria-label="Time range"
      style={{
        display: "inline-flex",
        background: cssVar("surface-raised"),
        border: `1px solid ${cssVar("border")}`,
        borderRadius: 9,
        padding: 2,
      }}
    >
      {RANGES.map((k) => (
        <button
          key={k}
          type="button"
          onClick={() => onChange(k)}
          className="lisn-num"
          style={{
            border: 0,
            background: range === k ? cssVar("surface") : "transparent",
            fontSize: 11.5,
            fontWeight: 600,
            color: range === k ? cssVar("accent") : cssVar("text-muted"),
            padding: "5px 10px",
            borderRadius: 7,
            cursor: "pointer",
            boxShadow: range === k ? cssVar("shadow-card") : undefined,
            fontFamily: "inherit",
          }}
        >
          {k}
        </button>
      ))}
    </div>
  );
}
