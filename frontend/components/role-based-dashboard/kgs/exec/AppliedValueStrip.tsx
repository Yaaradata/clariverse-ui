"use client";

import { exec, meta, monitor } from "@kgs/lib/data";
import { methodFor } from "@kgs/lib/values";
import type { AppliedValueTile } from "@kgs/types";
import { type ReactNode, useState } from "react";
import { useKgsNav } from "../nav";
import { IllustrativeChip } from "../shared/IllustrativeChip";
import { Popover } from "../shared/Popover";
import { K } from "../shared/tokens";
import { useDemo, useLabel } from "../shell/DemoProvider";
import { SuppressedReasons } from "./FunnelStrip";
import { HowWeCountDrawer } from "./HowWeCountDrawer";

const HERO_ID = "fw-4-1";

function Tile({
  tile,
  children,
  tooltip,
}: {
  tile: AppliedValueTile;
  children: ReactNode;
  tooltip: string;
}) {
  return (
    <div
      title={tooltip}
      style={{
        padding: "10px 12px",
        borderRadius: K.radius.tile,
        border: `1px solid ${K.borderLight}`,
        background: K.surface,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: K.textMut,
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {tile.label}
        {tile.money ? <IllustrativeChip /> : null}
      </div>
      {children}
    </div>
  );
}

const valueStyle = {
  fontFamily: K.mono,
  fontVariantNumeric: "tabular-nums",
  fontSize: 20,
  fontWeight: 800,
  color: K.text,
  lineHeight: 1.15,
} as const;
const subStyle = { fontSize: 12, color: K.textMut, lineHeight: 1.4 } as const;

/**
 * AppliedValueStrip (04 §2.6, NEW; 6 KpiTiles). AV-4 is three separate lines, never summed
 * (USD and GBP stay apart). AV-3 follows the hero approval. Every tile carries its method
 * tooltip; money tiles carry the ILLUSTRATIVE chip.
 */
export function AppliedValueStrip() {
  const L = useLabel();
  const { scrollTo } = useKgsNav();
  const { isApproved } = useDemo();
  const [drawer, setDrawer] = useState<string[] | null>(null);
  const av = exec.appliedValue;
  const approved = isApproved(HERO_ID);
  const tip = (t: AppliedValueTile) =>
    t.methodIds.includes("count")
      ? (meta.ui.appliedValue[t.id] ?? "")
      : methodFor(t.methodIds).map(L).join("\n");
  // Unit word from AV-1's own value text ("21 days" → "days").
  const leadUnit = (av.tiles[0].value ?? "").split(" ").slice(1).join(" ");
  const titleOf = (id: string) =>
    L(monitor.cards.find((c) => c.signalId === id)?.title ?? id);

  const linkBtn = {
    background: "transparent",
    border: "none",
    padding: 0,
    font: "inherit",
    color: "inherit",
    cursor: "pointer",
    textAlign: "left",
  } as const;

  const body = (t: AppliedValueTile) => {
    switch (t.id) {
      case "AV-1":
        return (
          <Popover
            label={t.label}
            trigger={<span style={valueStyle}>{t.value}</span>}
            width={420}
          >
            {av.leadList.map((r) => (
              <div
                key={r.signalId}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 10,
                  padding: "5px 0",
                  borderBottom: `1px solid ${K.chipBorder}`,
                }}
              >
                <span>
                  {titleOf(r.signalId)}
                  <br />
                  <span style={{ color: K.textMut, fontSize: 12 }}>
                    {r.crossed} → {r.review}
                  </span>
                </span>
                <span style={{ fontFamily: K.mono, color: K.text }}>
                  {r.lead} {leadUnit}
                </span>
              </div>
            ))}
          </Popover>
        );
      case "AV-2":
        return (
          <button
            type="button"
            className="kgs-focus"
            style={linkBtn}
            onClick={() => scrollTo("field-signal-monitor")}
          >
            <span style={valueStyle}>{t.value}</span>
          </button>
        );
      case "AV-3": {
        const value = approved && t.onApprove ? t.onApprove.value : t.value;
        return (
          <Popover
            label={t.label}
            trigger={<span style={valueStyle}>{value}</span>}
            width={420}
          >
            {monitor.cards.map((c) => (
              <div key={c.signalId} style={{ padding: "4px 0" }}>
                {c.gateChipAfterApprove && isApproved(c.signalId)
                  ? c.gateChipAfterApprove
                  : L(c.ownerGate)}
              </div>
            ))}
          </Popover>
        );
      }
      case "AV-4":
        return (
          <button
            type="button"
            className="kgs-focus"
            style={linkBtn}
            onClick={() => setDrawer(t.methodIds)}
          >
            {(t.lines ?? []).map((l) => (
              <div
                key={l}
                style={{
                  ...valueStyle,
                  fontFamily: K.font,
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {L(l)}
              </div>
            ))}
          </button>
        );
      case "AV-5":
        return (
          <button
            type="button"
            className="kgs-focus"
            style={linkBtn}
            onClick={() => setDrawer(t.methodIds)}
          >
            <span style={valueStyle}>{t.value}</span>
          </button>
        );
      default:
        return (
          <Popover
            label={meta.ui.funnel.popoverTitle}
            trigger={<span style={valueStyle}>{t.value}</span>}
          >
            <SuppressedReasons />
          </Popover>
        );
    }
  };

  return (
    <section
      style={{
        borderRadius: K.radius.card,
        border: `1px solid ${K.borderLight}`,
        background: K.elevated,
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
          {av.header}
        </h2>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: 999,
            border: `1px dashed ${K.borderLight}`,
            color: K.textMut,
          }}
        >
          {av.chip}
        </span>
        <button
          type="button"
          onClick={() => setDrawer([])}
          className="kgs-focus"
          style={{
            marginLeft: "auto",
            background: "transparent",
            border: "none",
            color: K.violet400,
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          {av.link}
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
          gap: 10,
        }}
      >
        {av.tiles.map((t) => (
          <Tile key={t.id} tile={t} tooltip={tip(t)}>
            {body(t)}
            <div style={subStyle}>
              {approved && t.onApprove ? t.onApprove.sub : L(t.sub)}
            </div>
          </Tile>
        ))}
      </div>
      <p style={{ margin: 0, fontSize: 12, color: K.textMut }}>{av.footnote}</p>
      <HowWeCountDrawer
        open={drawer !== null}
        onClose={() => setDrawer(null)}
        focusIds={drawer ?? []}
      />
    </section>
  );
}
