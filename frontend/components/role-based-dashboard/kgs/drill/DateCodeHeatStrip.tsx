"use client";

import { installedBase, meta } from "@kgs/lib/data";
import type { DateCodeCell, Role } from "@kgs/types";
import { useState } from "react";
import {
  Line,
  LineChart,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  YAxis,
} from "recharts";
import { ConfidenceMarker } from "../shared/ConfidenceMarker";
import { GateChip } from "../shared/GateChip";
import { IllustrativeChip } from "../shared/IllustrativeChip";
import { RoutedOwner } from "../shared/RoutedOwner";
import { K, withAlpha } from "../shared/tokens";
import { useLabel } from "../shell/DemoProvider";
import { fill, int } from "../signal/format";
import { DrillChip } from "./Chips";
import { Panel } from "./Panel";
import { linkedSignal, SignalSurface } from "./SignalSurface";

const DC = installedBase.dateCode;
const P = installedBase.panelCopy["P-D"];
const CELL_W = 24;
const CELL_H = 40;
const GAP = 3;
const OWNER = /^(.+?) \(owner\)(?: · cc (.+))?$/;

/** "Director Product Quality (owner) · cc VP Engineering" → roles for RoutedOwner. */
function ownerRoles(text: string): { role: Role; cc: Role[] } | undefined {
  const m = OWNER.exec(text);
  if (!m) return undefined;
  return {
    role: m[1] as Role,
    cc: m[2] ? (m[2].split(", ") as Role[]) : [],
  };
}

function Cell({
  cell,
  maxRisk,
  label,
  onHover,
}: {
  cell: DateCodeCell;
  maxRisk: number;
  label: string;
  onHover: (c: DateCodeCell | null) => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="kgs-focus"
      onMouseEnter={() => onHover(cell)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(cell)}
      onBlur={() => onHover(null)}
      style={{
        width: CELL_W,
        height: CELL_H,
        padding: 0,
        border: "none",
        borderRadius: 4,
        flexShrink: 0,
        cursor: "default",
        background: withAlpha(
          K.orange,
          Math.max(0.12, cell.relativeRisk / maxRisk),
        ),
      }}
    />
  );
}

/**
 * DateCodeHeatStrip (03 §6.9): 26 production weeks as single-hue cells; the window is outlined
 * and carries its ratio in words (never colour alone). Right: the SKU return-rate p-chart that
 * stays inside its limit. Below: the Signal #2 surface, owner and gate.
 */
export function DateCodeHeatStrip() {
  const L = useLabel();
  const [hover, setHover] = useState<DateCodeCell | null>(null);
  const [pRows] = useState(() => DC.pChart.map((v, i) => ({ i, v })));
  const linked = linkedSignal(`/installed-base#${P.anchor}`);
  const maxRisk = Math.max(...DC.cells.map((c) => c.relativeRisk));
  const first = DC.cells.findIndex((c) => c.inWindow);
  const last =
    DC.cells.length - 1 - [...DC.cells].reverse().findIndex((c) => c.inWindow);
  const owner = ownerRoles(DC.owner);
  const [exposure, ...restStats] = DC.stats;
  const tip = (c: DateCodeCell) =>
    fill(meta.ui.drill.dateCodeTooltip, {
      code: c.dateCode,
      units: int(c.units),
      rate: c.ratePer10k,
      unit: L(P.unit ?? ""),
      ratio: c.relativeRisk,
    });
  const cellFor = (c: DateCodeCell) => (
    <Cell
      key={c.dateCode}
      cell={c}
      maxRisk={maxRisk}
      label={tip(c)}
      onHover={setHover}
    />
  );

  return (
    <Panel
      id={P.anchor}
      title={
        <span
          style={{
            display: "inline-flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 8,
          }}
        >
          {L(P.title)}
          {linked ? (
            <DrillChip
              text={`${linked.card.chips.class} · ${linked.card.chips.domain}`}
            />
          ) : null}
          <DrillChip text={L(P.sub ?? "")} tone="orange" />
        </span>
      }
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 65fr) minmax(0, 35fr)",
          gap: 20,
          alignItems: "start",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div
            style={{ minHeight: 20, fontSize: 12, color: K.textSec }}
            aria-live="polite"
          >
            {hover ? tip(hover) : null}
          </div>
          <fieldset
            aria-label={`${L(P.title)} · ${L(DC.bracket)}`}
            style={{
              overflowX: "auto",
              padding: "3px 3px 4px",
              margin: 0,
              border: "none",
              minWidth: 0,
            }}
          >
            <div style={{ display: "flex", gap: GAP, alignItems: "flex-end" }}>
              {DC.cells.slice(0, first).map(cellFor)}
              <div
                style={{
                  display: "flex",
                  gap: GAP,
                  padding: 2,
                  margin: -2,
                  outline: "2px solid #fff",
                  borderRadius: 6,
                }}
              >
                {DC.cells.slice(first, last + 1).map(cellFor)}
              </div>
              {DC.cells.slice(last + 1).map(cellFor)}
            </div>
            <div
              aria-hidden
              style={{ display: "flex", gap: GAP, marginTop: 6 }}
            >
              {DC.cells.map((c, i) => (
                <span
                  key={c.dateCode}
                  style={{
                    width: CELL_W,
                    flexShrink: 0,
                    fontSize: 10,
                    fontFamily: K.mono,
                    color: c.inWindow ? K.text : K.textMut,
                    textAlign: "center",
                  }}
                >
                  {i % 2 === 0 ? c.dateCode : ""}
                </span>
              ))}
            </div>
          </fieldset>
          <div
            style={{
              marginLeft: first * (CELL_W + GAP),
              paddingLeft: 8,
              borderLeft: "2px solid #fff",
              fontSize: 13,
              fontWeight: 700,
              color: K.text,
              lineHeight: 1.45,
              maxWidth: 520,
            }}
          >
            {L(DC.bracket)}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div role="img" aria-label={L(P.right ?? "")} style={{ height: 110 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={pRows}
                margin={{ top: 14, right: 12, bottom: 4, left: 0 }}
              >
                <YAxis
                  hide
                  domain={[0, Math.max(DC.limit, ...DC.pChart) * 1.2]}
                />
                <ReferenceLine
                  y={DC.limit}
                  stroke={K.textMut}
                  strokeDasharray="4 4"
                  label={{
                    value: DC.limitLabel,
                    position: "insideTopRight",
                    fill: K.textMut,
                    fontSize: 11,
                  }}
                />
                <Line
                  dataKey="v"
                  type="linear"
                  stroke={K.green}
                  strokeWidth={2}
                  dot={false}
                  animationDuration={900}
                />
                <ReferenceDot
                  x={pRows.length - 1}
                  y={DC.current}
                  r={4}
                  fill={K.green}
                  stroke="#fff"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ fontSize: 13, color: K.textSec }}>
            {L(P.right ?? "")}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px 20px",
          alignItems: "center",
          paddingTop: 12,
          borderTop: `1px solid ${K.border}`,
          fontSize: 14,
          color: K.textSec,
        }}
      >
        <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
          {L(exposure.value)}
          {exposure.money ? <IllustrativeChip /> : null}
        </span>
        {restStats.map((s) => (
          <span key={s.label}>{L(s.value)}</span>
        ))}
        <ConfidenceMarker confidence={DC.confidence} compact />
        {owner ? (
          <RoutedOwner
            role={owner.role}
            cc={owner.cc}
            suffix={meta.ui.hero.ownerSuffix}
          />
        ) : (
          <span>{L(DC.owner)}</span>
        )}
        <GateChip text={L(DC.gate)} status="awaiting" wrap />
        <span style={{ color: K.amber2, fontWeight: 700 }}>
          {L(DC.leadLine)}
        </span>
      </div>

      {linked ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <SignalSurface
            card={linked.card}
            signal={linked.signal}
            hideConfidence
            hideGate
          />
        </div>
      ) : null}

      <p
        style={{
          margin: 0,
          fontSize: 15,
          fontWeight: 700,
          color: K.text,
        }}
      >
        {L(DC.caption)}
      </p>
    </Panel>
  );
}
