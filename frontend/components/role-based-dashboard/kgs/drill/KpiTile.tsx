"use client";

import type { KpiTile as KpiTileData } from "@kgs/types";
import { IllustrativeChip } from "../shared/IllustrativeChip";
import { K, withAlpha } from "../shared/tokens";
import { useLabel } from "../shell/DemoProvider";

/** KpiTile (03 §3C): caps label → 28px/800 value → sub. Money carries the ILLUSTRATIVE chip. */
export function KpiTile({ tile }: { tile: KpiTileData }) {
  const L = useLabel();
  return (
    <div
      style={{
        background: "#131313",
        border: `1px solid ${K.border}`,
        borderRadius: K.radius.tile,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 6,
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.06em",
          color: K.textMut,
          lineHeight: 1.35,
        }}
      >
        {L(tile.label)}
      </div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 800,
          color: K.text,
          fontFamily: K.mono,
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1.1,
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {L(tile.value)}
        {tile.money ? <IllustrativeChip /> : null}
      </div>
      {tile.sub ? (
        <div style={{ fontSize: 13, color: K.textMut }}>{L(tile.sub)}</div>
      ) : null}
    </div>
  );
}

/** P-0 / C-0 / S-0 row: 4 tiles, or 6 on Q2/Q3. */
export function KpiRow({ tiles }: { tiles: KpiTileData[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${tiles.length}, minmax(0, 1fr))`,
        gap: 12,
      }}
    >
      {tiles.map((t) => (
        <KpiTile key={t.label} tile={t} />
      ))}
    </div>
  );
}

/** Big-gradient KpiTile (03 §3C): caps label, large value, emerald delta pill. */
export function BigKpiTile({
  label,
  value,
  delta,
}: {
  label: string;
  value: string;
  delta: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.06em",
          color: K.textMut,
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <span
          style={{
            fontSize: 40,
            fontWeight: 800,
            fontFamily: K.mono,
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1,
            background: "linear-gradient(90deg, #8b7bff, #5332ff)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {value}
        </span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            padding: "3px 9px",
            borderRadius: K.radius.pill,
            color: "#34d399",
            background: withAlpha("#064e3b", 0.6),
            border: `1px solid ${withAlpha("#10b981", 0.3)}`,
            fontFamily: K.mono,
            whiteSpace: "nowrap",
          }}
        >
          {delta}
        </span>
      </div>
    </div>
  );
}
