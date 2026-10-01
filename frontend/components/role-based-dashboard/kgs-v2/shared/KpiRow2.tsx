"use client";

import { useLabel2, useV2K } from "@kgs2/lib/demoState";
import { CountUp } from "@/components/role-based-dashboard/kgs/shared/CountUp";

export type KpiTile2Data = {
  key?: string;
  label: string;
  value: string;
  sub?: string;
};

function KpiTile2({ tile }: { tile: KpiTile2Data }) {
  const L = useLabel2();
  const K = useV2K();
  return (
    <div
      style={{
        background: K.tile,
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
          fontFamily: K.font,
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
        }}
      >
        <CountUp text={L(tile.value)} />
      </div>
      {tile.sub ? (
        <div style={{ fontSize: 13, color: K.textMut, fontFamily: K.font }}>
          {L(tile.sub)}
        </div>
      ) : null}
    </div>
  );
}

/** v1-style KPI row — 4 or 5 tiles; values mono, labels sans. */
export function KpiRow2({ tiles }: { tiles: KpiTile2Data[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${tiles.length}, minmax(0, 1fr))`,
        gap: 12,
      }}
    >
      {tiles.map((t) => (
        <KpiTile2 key={t.key ?? t.label} tile={t} />
      ))}
    </div>
  );
}
