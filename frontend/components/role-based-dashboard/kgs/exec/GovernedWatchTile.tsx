"use client";

import { exec, meta } from "@kgs/lib/data";
import type { WatchItem } from "@kgs/types";
import { Lock } from "lucide-react";
import { useState } from "react";
import { Modal } from "../shared/Overlay";
import { K, withAlpha } from "../shared/tokens";

/**
 * ClockRing (03 §6.12): elapsed time from the candidate first mention to the fixed
 * data-as-of time (never computed from "now"), with 24h / 72h reference ticks.
 */
export function ClockRing({
  clock,
}: {
  clock: NonNullable<WatchItem["clock"]>;
}) {
  const [, max] = clock.refsHours;
  const hours =
    (Date.parse(meta.dataAsOf.iso) - Date.parse(clock.startUtc)) / 3_600_000;
  const r = 26;
  const c = 2 * Math.PI * r;
  const frac = Math.min(1, Math.max(0, hours / max));
  const tick = (h: number) => {
    const a = (h / max) * 2 * Math.PI - Math.PI / 2;
    return {
      x1: 32 + Math.cos(a) * 22,
      y1: 32 + Math.sin(a) * 22,
      x2: 32 + Math.cos(a) * 31,
      y2: 32 + Math.sin(a) * 31,
    };
  };
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" aria-hidden="true">
      <circle
        cx={32}
        cy={32}
        r={r}
        fill="none"
        stroke={K.borderLight}
        strokeWidth={4}
      />
      <circle
        cx={32}
        cy={32}
        r={r}
        fill="none"
        stroke={K.red400}
        strokeWidth={4}
        strokeDasharray={`${frac * c} ${c}`}
        transform="rotate(-90 32 32)"
        strokeLinecap="round"
      />
      {clock.refsHours.map((h) => (
        <line key={h} {...tick(h)} stroke={K.textMut} strokeWidth={2} />
      ))}
      <text
        x={32}
        y={36}
        textAnchor="middle"
        fontSize={11}
        fontWeight={700}
        fill={K.text}
        fontFamily="var(--mono)"
      >
        {clock.elapsedLabel}
      </text>
    </svg>
  );
}

function RedactionBars() {
  return (
    <div aria-hidden style={{ display: "flex", gap: 6, marginTop: 6 }}>
      {[48, 30, 38].map((w) => (
        <span
          key={w}
          style={{
            width: `${w}%`,
            height: 8,
            borderRadius: 3,
            background: withAlpha(K.textMut, 0.3),
          }}
        />
      ))}
    </div>
  );
}

/**
 * GovernedWatchTile (04 §2.8, 03 §6.12): restricted band, counts and clocks only — no
 * platform, firmware or country in either mode; content as redaction bars. Opens the
 * restriction modal. No hover lift.
 */
export function GovernedWatchTile() {
  const g = exec.governedWatch;
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        id="governed-watch"
        onClick={() => setOpen(true)}
        className="kgs-focus"
        style={{
          textAlign: "left",
          width: "100%",
          padding: 0,
          borderRadius: K.radius.card,
          border: `1px solid ${withAlpha(K.red, 0.3)}`,
          background: K.elevated,
          color: K.textSec,
          cursor: "pointer",
          overflow: "hidden",
          fontFamily: "inherit",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 14px",
            background: `repeating-linear-gradient(135deg, ${withAlpha(K.red, 0.16)} 0 10px, ${withAlpha(K.red, 0.06)} 10px 20px)`,
            borderBottom: `1px solid ${withAlpha(K.red, 0.3)}`,
          }}
        >
          <Lock size={14} color={K.red400} aria-hidden />
          <span
            style={{
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.12em",
              color: K.red400,
            }}
          >
            {g.band}
          </span>
          <span style={{ fontSize: 14, fontWeight: 700, color: K.text }}>
            {g.title}
          </span>
        </div>
        <div
          style={{
            padding: "12px 14px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: K.text }}>
              {g.headline}
            </span>
            <span style={{ fontSize: 12, color: K.textMut }}>{g.pnl}</span>
          </div>
          {g.items.map((w) => (
            <div
              key={w.id}
              style={{
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
                paddingTop: 10,
                borderTop: `1px solid ${K.chipBorder}`,
              }}
            >
              <span
                style={{
                  fontFamily: K.mono,
                  fontSize: 12,
                  fontWeight: 800,
                  color: K.red400,
                  paddingTop: 2,
                }}
              >
                {w.id}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, lineHeight: 1.5 }}>{w.row}</div>
                {w.secondLine ? (
                  <div
                    style={{
                      fontSize: 12,
                      color: K.textMut,
                      marginTop: 4,
                      lineHeight: 1.5,
                    }}
                  >
                    {w.secondLine}
                  </div>
                ) : null}
                <RedactionBars />
                {w.clock ? (
                  <div style={{ fontSize: 12, color: K.textMut, marginTop: 6 }}>
                    {w.clock.caption}
                  </div>
                ) : null}
              </div>
              {w.clock ? <ClockRing clock={w.clock} /> : null}
            </div>
          ))}
          <div style={{ fontSize: 13, fontWeight: 800, color: K.text }}>
            {g.footer}
          </div>
        </div>
      </button>
      <Modal
        open={open}
        title={g.title}
        onClose={() => setOpen(false)}
        width={520}
      >
        <p style={{ margin: "0 0 16px", fontSize: 14, lineHeight: 1.6 }}>
          {g.modal}
        </p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="kgs-focus"
          style={{
            background: K.surface,
            border: `1px solid ${K.borderLight}`,
            color: K.text,
            borderRadius: 8,
            padding: "8px 14px",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 14,
          }}
        >
          {meta.ui.close}
        </button>
      </Modal>
    </>
  );
}
