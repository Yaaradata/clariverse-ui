"use client";

import { exec } from "@kgs/lib/data";
import { valueRegister, valueStatements } from "@kgs/lib/values";
import { useEffect } from "react";
import { MoneyText } from "../shared/MoneyText";
import { Drawer } from "../shared/Overlay";
import { K, withAlpha } from "../shared/tokens";
import { useLabel } from "../shell/DemoProvider";

/**
 * HowWeCountDrawer (04 §2.6, NEW; EvidenceDrawer shell): value statements, unit-cost
 * assumptions, the V-01…V-14 register (figure + method, 02 §2 exact) and the
 * "Never on screen" footer. `focusIds` highlights and scrolls to the cited rows.
 */
export function HowWeCountDrawer({
  open,
  onClose,
  focusIds = [],
}: {
  open: boolean;
  onClose: () => void;
  focusIds?: string[];
}) {
  const L = useLabel();
  const h = exec.howWeCount;

  useEffect(() => {
    if (!open || focusIds.length === 0) return;
    requestAnimationFrame(() =>
      document
        .getElementById(`vreg-${focusIds[0]}`)
        ?.scrollIntoView({ block: "center" }),
    );
  }, [open, focusIds]);

  return (
    <Drawer open={open} title={h.title} onClose={onClose} footer={h.footer}>
      <ul
        style={{
          margin: "0 0 16px",
          paddingLeft: 18,
          color: K.textSec,
          fontSize: 14,
          lineHeight: 1.55,
        }}
      >
        {valueStatements.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <div
        style={{
          padding: 12,
          borderRadius: K.radius.tile,
          border: `1px solid ${K.borderLight}`,
          background: K.surface,
          marginBottom: 16,
          fontSize: 13,
          color: K.body,
          lineHeight: 1.6,
        }}
      >
        {h.unitCostLines.map((l) => (
          <div key={l}>{l}</div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {valueRegister.map((v) => {
          const focus = focusIds.includes(v.id);
          return (
            <div
              key={v.id}
              id={`vreg-${v.id}`}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: `1px solid ${focus ? withAlpha(K.violet400, 0.6) : K.chipBorder}`,
                background: focus ? withAlpha(K.brand, 0.12) : "transparent",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  fontSize: 14,
                  color: K.text,
                  fontWeight: 600,
                }}
              >
                <span style={{ fontFamily: K.mono, color: K.textMut }}>
                  {v.id}
                </span>
                <span>
                  <MoneyText text={v.figure} />
                </span>
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: K.textMut,
                  marginTop: 4,
                  lineHeight: 1.5,
                }}
              >
                {L(v.method)}
              </div>
            </div>
          );
        })}
      </div>
    </Drawer>
  );
}
