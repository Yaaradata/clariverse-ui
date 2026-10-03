"use client";

/**
 * Ombudsman watch, copied from the earlier LisN component and re-bound to IndusInd data: on the brink · eligible ·
 * unhappy with the reply · awaiting IO review, each a share of pending complaints (L3), with at risk as their union.
 * The rule text sits behind the (i); timelines the verification does not carry read "confirm with the bank".
 */

import type { Fig as FigT, OmbudsmanBlock } from "@/lib/indusind-v1/types";
import { ArcGauge } from "./charts";
import { C, cols, Fig, Info, Label, MONO, ShareBar, Tile } from "./primitives";

const STATES = ["brink", "eligible", "unhappy", "awaiting_io"] as const;

/** A change in an at-risk share: up is worse (red), down is better (green). */
function deltaColor(f: FigT) {
  const d = f.delta ?? 0;
  return d > 0 ? C.red : d < 0 ? C.green : C.textMut;
}

export function OmbudsmanWatch({
  o,
  def,
  expanded,
  byBusiness,
  byBusinessDef,
  title = "Ombudsman watch",
}: {
  o: OmbudsmanBlock;
  def: string;
  expanded: boolean;
  byBusiness?: { id: string; label: string; share: FigT }[];
  byBusinessDef?: string;
  title?: string;
}) {
  const max = Math.max(...(byBusiness ?? []).map((b) => b.share.value ?? 0), 1);
  return (
    <Tile
      id="ombudsman"
      title={title}
      sub="Share of pending complaints"
      layers={["L3"]}
      info={def}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <span
          data-testid="at-risk"
          style={{
            fontFamily: MONO,
            fontSize: 30,
            fontWeight: 800,
            color: C.text,
            lineHeight: 1,
          }}
        >
          <Fig f={o.at_risk} />
        </span>
        <span style={{ fontSize: 13.5, color: C.textSec }}>
          {o.at_risk.label ?? "At risk"}
        </span>
        {o.at_risk.delta_display ? (
          <span style={{ fontSize: 12.5, color: deltaColor(o.at_risk) }}>
            {o.at_risk.delta_display}
          </span>
        ) : null}
      </div>
      {expanded ? (
        <div style={cols(4, 120, 8)}>
          {STATES.map((k) => {
            const f = o[k];
            return (
              <div key={k} data-register={f.id} data-layer={f.layer}>
                <ArcGauge
                  value={f.value}
                  // Eligible means the reply rule is already breached: red. The others need attention: amber.
                  color={k === "eligible" ? C.red : C.amber}
                  centre={f.display}
                  label={f.label ?? k}
                >
                  {f.delta_display ? (
                    <span style={{ color: deltaColor(f), fontSize: 11.5 }}>
                      {f.delta_display}
                    </span>
                  ) : null}
                </ArcGauge>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={cols(4, 120, 8)}>
          {STATES.map((k) => (
            <div key={k} style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, color: C.textMut }}>{o[k].label}</div>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 17,
                  fontWeight: 700,
                  color: C.text,
                }}
              >
                <Fig f={o[k]} />
              </div>
            </div>
          ))}
        </div>
      )}
      {expanded && byBusiness?.length ? (
        <div>
          <Label>
            At risk, by business
            {byBusinessDef ? <Info text={byBusinessDef} /> : null}
          </Label>
          <div style={{ ...cols(2, 260, 4), columnGap: 28 }}>
            {byBusiness.map((b) => (
              <ShareBar key={b.id} label={b.label} f={b.share} max={max} />
            ))}
          </div>
        </div>
      ) : null}
    </Tile>
  );
}
