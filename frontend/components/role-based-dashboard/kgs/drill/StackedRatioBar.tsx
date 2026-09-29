"use client";

import { meta } from "@kgs/lib/data";
import type { InstalledBasePage, SeverityClass } from "@kgs/types";
import { K, SEV } from "../shared/tokens";
import { useLabel } from "../shell/DemoProvider";

type Row = InstalledBasePage["clustersBySeverity"][number];
const TYPES = ["cliff", "slope", "spread", "novel"] as const;
const TYPE_COLOR: Record<(typeof TYPES)[number], string> = {
  cliff: K.orange,
  slope: K.amber,
  spread: K.sky,
  novel: K.violet400,
};

const total = (r: Row) => TYPES.reduce((n, t) => n + r[t], 0);

/**
 * StackedRatioBar (03 §3C): above-baseline clusters per severity split by type,
 * widths against the largest row. Rows are buttons; `onSelect` receives the severity class.
 * President view: all severities including S1 render their type split (no lock/hatch).
 */
export function StackedRatioBar({
  rows,
  onSelect,
}: {
  rows: Row[];
  onSelect?: (cls: SeverityClass) => void;
}) {
  const L = useLabel();
  const max = Math.max(...rows.map(total), 1);
  const labels = meta.ui.drill.clusterTypes;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {rows.map((r) => {
        const cls = r.label.slice(0, 2) as SeverityClass;
        const n = total(r);
        return (
          <button
            key={r.label}
            type="button"
            onClick={() => onSelect?.(cls)}
            className="kgs-focus"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              background: "transparent",
              border: "none",
              padding: 0,
              textAlign: "left",
              cursor: onSelect ? "pointer" : "default",
              fontFamily: "inherit",
            }}
          >
            <span
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 8,
                fontSize: 13,
              }}
            >
              <span style={{ color: K.text, fontWeight: 700 }}>
                <span aria-hidden style={{ color: SEV[cls].color }}>
                  {SEV[cls].glyph}{" "}
                </span>
                {L(r.label)}
              </span>
              <span style={{ color: K.textMut, fontFamily: K.mono }}>
                {L(r.caption)}
              </span>
            </span>
            <span
              className="kgs-grow"
              style={{
                display: "flex",
                height: 28,
                width: `${(n / max) * 100}%`,
                minWidth: 44,
                borderRadius: 8,
                overflow: "hidden",
                border: `1px solid ${K.borderLight}`,
              }}
            >
              {TYPES.filter((t) => r[t] > 0).map((t) => (
                <span
                  key={t}
                  title={`${labels[TYPES.indexOf(t)]} ${r[t]}`}
                  style={{
                    flex: r[t],
                    background: TYPE_COLOR[t],
                    color: "#0d0d0d",
                    fontSize: 12,
                    fontWeight: 800,
                    fontFamily: K.mono,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  {r[t]}
                </span>
              ))}
            </span>
          </button>
        );
      })}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px 14px",
          fontSize: 12,
          color: K.body,
        }}
      >
        {TYPES.map((t, i) => (
          <span
            key={t}
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <span
              aria-hidden
              style={{
                width: 10,
                height: 10,
                borderRadius: 3,
                background: TYPE_COLOR[t],
              }}
            />
            {labels[i]}
          </span>
        ))}
      </div>
    </div>
  );
}
