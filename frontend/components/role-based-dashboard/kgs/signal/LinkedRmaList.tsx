"use client";

import { meta, signalFw41 } from "@kgs/lib/data";
import { K } from "../shared/tokens";
import { useLabel } from "../shell/DemoProvider";
import { dayLabel } from "./format";

/** Linked RMAs tab (04 §4.10): ID mono · NFF chip · date · partner · serial, then the note. */
export function LinkedRmaList() {
  const L = useLabel();
  const { rmas, rmaNote } = signalFw41;
  const { rmaSerial } = meta.ui.hero;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {rmas.map((r) => (
        <div
          key={r.id}
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 8,
            padding: "10px 12px",
            background: "#131313",
            borderRadius: K.radius.tile,
            fontSize: 14,
            color: K.textSec,
          }}
        >
          <span style={{ fontFamily: K.mono, color: K.text }}>{r.id}</span>
          <span
            title={r.label}
            style={{
              fontSize: 12,
              fontWeight: 700,
              padding: "2px 7px",
              borderRadius: 6,
              border: `1px solid ${K.borderLight}`,
              background: K.surface,
              color: K.textSec,
            }}
          >
            {r.disposition}
          </span>
          <span>{dayLabel(r.returnedDate)}</span>
          <span aria-hidden>·</span>
          <span>{L(r.partnerId)}</span>
          <span aria-hidden>·</span>
          <span>
            {rmaSerial} <span style={{ fontFamily: K.mono }}>{r.serial}</span>
          </span>
        </div>
      ))}
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: K.body }}>
        {rmaNote}
      </p>
    </div>
  );
}
