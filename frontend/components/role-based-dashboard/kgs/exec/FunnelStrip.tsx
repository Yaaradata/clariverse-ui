"use client";

import { exec, meta } from "@kgs/lib/data";
import { Info } from "lucide-react";
import { useKgsNav } from "../nav";
import { CountUp } from "../shared/CountUp";
import { Popover } from "../shared/Popover";
import { K } from "../shared/tokens";

const num = (n: number) => n.toLocaleString("en-GB");

function Big({ value }: { value: number }) {
  return (
    <strong
      style={{
        fontFamily: K.mono,
        fontVariantNumeric: "tabular-nums",
        color: K.text,
        fontSize: 16,
        fontWeight: 800,
        marginRight: 5,
      }}
    >
      <CountUp text={num(value)} />
    </strong>
  );
}

/** Suppressed-reasons list (V-12), shared by the funnel and AV-6 (04 §2.2, §2.6). */
export function SuppressedReasons() {
  const ui = meta.ui.funnel;
  return (
    <div>
      <div style={{ fontWeight: 700, color: K.text, marginBottom: 8 }}>
        {ui.popoverTitle}
      </div>
      {exec.funnel.suppressedReasons.map((r) => (
        <div
          key={r.label}
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            padding: "3px 0",
          }}
        >
          <span>{r.label}</span>
          <span
            style={{ fontFamily: K.mono, fontVariantNumeric: "tabular-nums" }}
          >
            {num(r.count)}
          </span>
        </div>
      ))}
      <div
        style={{
          marginTop: 8,
          paddingTop: 8,
          borderTop: `1px solid ${K.borderLight}`,
          fontSize: 12,
          color: K.textMut,
        }}
      >
        {exec.funnel.suppressedFooter}
      </div>
    </div>
  );
}

/** FunnelStrip (04 §2.2) → exec.json › funnel. Plain integers formatted en-GB only. */
export function FunnelStrip() {
  const f = exec.funnel;
  const ui = meta.ui.funnel;
  const { scrollTo } = useKgsNav();
  const sep = <span style={{ color: K.borderLight, margin: "0 10px" }}>·</span>;
  const linkStyle = {
    background: "transparent",
    border: "none",
    color: K.textSec,
    font: "inherit",
    cursor: "pointer",
    padding: 0,
    textDecoration: "underline dotted",
    textUnderlineOffset: 4,
  } as const;

  return (
    <section
      aria-label={ui.interactions}
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        rowGap: 6,
        padding: "12px 16px",
        borderRadius: K.radius.tile,
        border: `1px solid ${K.borderLight}`,
        background: K.elevated,
        fontSize: 14,
        color: K.textSec,
      }}
    >
      <span>
        <Big value={f.interactions} />
        {ui.interactions} {ui.weekNote}
      </span>
      {sep}
      <span>
        <Big value={f.candidateClusters} />
        {ui.clusters}
      </span>
      {sep}
      <Popover
        hover
        label={ui.popoverTitle}
        trigger={
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
          >
            <Big value={f.suppressed} />
            {ui.suppressed}
            <Info size={13} color={K.textMut} aria-hidden />
          </span>
        }
      >
        <SuppressedReasons />
      </Popover>
      {sep}
      <button
        type="button"
        className="kgs-focus"
        style={linkStyle}
        onClick={() => scrollTo("field-signal-monitor")}
      >
        <Big value={f.aboveThreshold} />
        {ui.above}
      </button>
      {sep}
      <button
        type="button"
        className="kgs-focus"
        style={linkStyle}
        onClick={() => scrollTo("governed-watch")}
      >
        <Big value={f.governed} />
        {ui.governed}
      </button>
    </section>
  );
}
