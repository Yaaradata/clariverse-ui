"use client";

import { meta, signalFw41 } from "@kgs/lib/data";
import { methodFor } from "@kgs/lib/values";
import { Info } from "lucide-react";
import { IllustrativeChip } from "../shared/IllustrativeChip";
import { K } from "../shared/tokens";
import { useLabel } from "../shell/DemoProvider";

const MONEY = /[$£]/;

/**
 * Full PnLDestinationTag (02 HS-10, 04 §4.7): destination, exposure with ILLUSTRATIVE, caption,
 * two sub-tiles. Each figure's tooltip is its V-id method; "Method ⓘ" opens the drawer's Method tab.
 */
export function PnLDetail({ onMethod }: { onMethod: () => void }) {
  const L = useLabel();
  const exposure = signalFw41.signal.pnl.exposure;
  if (!exposure) return null;
  const method = (ids?: string) =>
    ids ? L(methodFor(ids).join("\n")) : undefined;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {exposure.lines.map((line, i) => (
        <div
          key={line.text}
          title={method(line.valueId)}
          style={{
            fontSize: i === 0 ? 13 : 14,
            fontWeight: i === 0 ? 700 : 500,
            color: i === 0 ? K.text : K.textSec,
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1.45,
          }}
        >
          {L(line.text)}
          {MONEY.test(line.text) ? <IllustrativeChip /> : null}
        </div>
      ))}
      {exposure.caption ? (
        <div style={{ fontSize: 13, color: K.textMut, fontStyle: "italic" }}>
          {exposure.caption}
        </div>
      ) : null}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
        }}
      >
        {(exposure.subTiles ?? []).map((t) => (
          <div
            key={t.text}
            title={method(t.valueId)}
            style={{
              background: K.surface,
              border: `1px solid ${K.chipBorder}`,
              borderRadius: K.radius.chip,
              padding: "8px 10px",
              fontSize: 12,
              lineHeight: 1.45,
              color: K.body,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {L(t.text)}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onMethod}
        className="kgs-focus"
        style={{
          alignSelf: "flex-start",
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          background: "transparent",
          border: "none",
          padding: "2px 0",
          color: K.violet400,
          fontSize: 13,
          fontWeight: 700,
          fontFamily: "inherit",
          cursor: "pointer",
        }}
      >
        {meta.ui.hero.method}
        <Info size={13} aria-hidden />
      </button>
    </div>
  );
}
