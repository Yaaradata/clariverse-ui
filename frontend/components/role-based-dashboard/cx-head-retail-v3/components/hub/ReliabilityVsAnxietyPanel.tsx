"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { AnxietyPeriodData, QuadCellId } from "../../lib/cxHeadRetailV3AnxietyData";
import {
  ANXIETY_QUAD_CELLS,
} from "../../lib/cxHeadRetailV3AnxietyData";
import { cssVar, radius } from "../../theme/tokens";
import type { CliffSlopeEventMode } from "./CliffSlopePieCharts";
import {
  ANXIETY_STATE_META,
  AnxietyCard,
  ContribBar,
  SegButton,
  anxietyFmt,
} from "./AnxietyPrimitives";
import { useAnimatedNumber } from "../../lib/useAnimatedNumber";

const CliffSlopePieCharts = dynamic(
  () => import("./CliffSlopePieCharts").then((m) => m.CliffSlopePieCharts),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          height: 300,
          display: "grid",
          placeItems: "center",
          fontSize: 12,
          color: cssVar("text-muted"),
        }}
      >
        Loading chart…
      </div>
    ),
  },
);

function tint(color: string, mixPct: number): string {
  return `color-mix(in srgb, ${color} ${mixPct}%, transparent)`;
}

const QUAD_SHORT_LABEL: Record<QuadCellId, string> = {
  ml: "Healthy",
  mh: "Reassure",
  bl: "Pre-empt",
  bh: "Trust erosion",
};

const MATRIX_ROWS: {
  label: string;
  laneColor: string;
  cells: readonly [QuadCellId, QuadCellId];
}[] = [
  { label: "Promise breached", laneColor: cssVar("severity-high"), cells: ["bl", "bh"] },
  { label: "Promise met", laneColor: cssVar("positive"), cells: ["ml", "mh"] },
];

function QuadMatrixCell({
  id,
  count,
  share,
  active,
  onSelect,
}: {
  id: QuadCellId;
  count: number;
  share: number;
  active: boolean;
  onSelect: () => void;
}): React.ReactElement {
  const accent = ANXIETY_STATE_META[ANXIETY_QUAD_CELLS[id].tone].color;
  const animatedCount = useAnimatedNumber(count, { duration: 900, delay: 80 });

  return (
    <button
      type="button"
      onClick={onSelect}
      style={{
        border: `1px solid ${active ? accent : cssVar("border")}`,
        background: active ? tint(accent, 10) : cssVar("surface-raised"),
        borderRadius: radius.md,
        padding: "12px 12px 10px",
        cursor: "pointer",
        textAlign: "left",
        minHeight: 88,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: active ? `inset 3px 0 0 ${accent}` : undefined,
        transition: "border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: accent, lineHeight: 1.25 }}>{QUAD_SHORT_LABEL[id]}</span>
        <span
          className="lisn-num"
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: cssVar("text-muted"),
            background: cssVar("surface"),
            border: `1px solid ${cssVar("border")}`,
            borderRadius: radius.pill,
            padding: "2px 7px",
            flexShrink: 0,
          }}
        >
          {share}%
        </span>
      </div>
      <div className="lisn-num" style={{ fontSize: 24, fontWeight: 800, color: cssVar("text-primary"), lineHeight: 1.05, marginTop: 8 }}>
        {anxietyFmt(animatedCount)}
      </div>
    </button>
  );
}

function ReliabilityAnxietyLaneMatrix({
  data,
  shares,
  active,
  onSelect,
}: {
  data: Record<QuadCellId, number>;
  shares: Record<QuadCellId, number>;
  active: QuadCellId;
  onSelect: (id: QuadCellId) => void;
}): React.ReactElement {
  return (
    <div style={{ minWidth: 0 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "104px 1fr 1fr",
          gap: 8,
          marginBottom: 6,
        }}
      >
        <div />
        <div
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: 0.3,
            textTransform: "uppercase",
            color: cssVar("text-muted"),
            textAlign: "center",
          }}
        >
          Low anxiety
        </div>
        <div
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: 0.3,
            textTransform: "uppercase",
            color: cssVar("text-muted"),
            textAlign: "center",
          }}
        >
          High anxiety
        </div>
      </div>

      {MATRIX_ROWS.map((row) => (
        <div
          key={row.label}
          style={{
            display: "grid",
            gridTemplateColumns: "104px 1fr 1fr",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: 0.3,
              textTransform: "uppercase",
              color: row.laneColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingRight: 8,
              lineHeight: 1.3,
              textAlign: "right",
            }}
          >
            {row.label}
          </div>
          {row.cells.map((id) => (
            <QuadMatrixCell
              key={id}
              id={id}
              count={data[id]}
              share={shares[id]}
              active={active === id}
              onSelect={() => onSelect(id)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ReliabilityVsAnxietyPanel({
  d,
}: {
  d: AnxietyPeriodData;
}): React.ReactElement {
  const [cell, setCell] = useState<QuadCellId>("bh");
  const [cliffSlopeMode, setCliffSlopeMode] = useState<CliffSlopeEventMode>("cliff");
  const meta = ANXIETY_QUAD_CELLS[cell];
  const toneMeta = ANXIETY_STATE_META[meta.tone];

  const quadShares = useMemo(() => {
    return Object.fromEntries(
      (Object.keys(d.quad) as QuadCellId[]).map((id) => [
        id,
        d.negTotal > 0 ? Math.round((d.quad[id] / d.negTotal) * 100) : 0,
      ]),
    ) as Record<QuadCellId, number>;
  }, [d.negTotal, d.quad]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 12, alignItems: "stretch" }}>
        <AnxietyCard pad={16}>
          <ReliabilityAnxietyLaneMatrix data={d.quad} shares={quadShares} active={cell} onSelect={setCell} />

          <div
            style={{
              marginTop: 14,
              paddingTop: 14,
              borderTop: `1px solid ${cssVar("border")}`,
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.35, textTransform: "uppercase", color: cssVar("text-muted"), marginBottom: 8 }}>
              Top drivers
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {meta.drivers.map(([k, v]) => (
                <ContribBar key={k} label={k} pct={v} color={toneMeta.color} labelColor={cssVar("text-secondary")} pctColor={toneMeta.color} />
              ))}
            </div>
          </div>
        </AnxietyCard>

        <AnxietyCard pad={16} style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              marginBottom: 6,
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.35, textTransform: "uppercase", color: cssVar("text-muted") }}>
              Cliff vs slope events
            </div>
            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
              <SegButton active={cliffSlopeMode === "cliff"} onClick={() => setCliffSlopeMode("cliff")}>
                Cliff
              </SegButton>
              <SegButton active={cliffSlopeMode === "slope"} onClick={() => setCliffSlopeMode("slope")}>
                Slope
              </SegButton>
            </div>
          </div>
          <CliffSlopePieCharts mode={cliffSlopeMode} />
        </AnxietyCard>
      </div>
    </div>
  );
}
