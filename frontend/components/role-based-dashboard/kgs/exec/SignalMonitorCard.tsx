"use client";

import type { MonitorCard as MonitorCardData } from "@kgs/types";
import { K, URGENCY, withAlpha } from "../shared/tokens";
import { useLabel } from "../shell/DemoProvider";

/**
 * Field Signal Monitor card — bank AI Risk Spike anatomy with urgency chrome.
 * Display only: no drill-down, no owner/gate/confidence/P&L footer.
 */
export function SignalMonitorCard({ card }: { card: MonitorCardData }) {
  const L = useLabel();
  const c = card.compact;
  const u = URGENCY[card.urgency];
  const tone = u.color;
  const pillLabel = u.showSeverityClass
    ? `${u.word} · ${card.chips.class}`
    : u.word;

  if (!c) return null;

  return (
    <article
      style={{
        width: 252,
        minWidth: 252,
        maxWidth: 252,
        minHeight: 280,
        flex: "0 0 252px",
        borderRadius: 16,
        border: `1px solid ${withAlpha(tone, u.borderA)}`,
        background: withAlpha(tone, u.bgA),
        boxShadow: u.glow
          ? `0 10px 24px ${withAlpha(tone, u.glowA)}`
          : "none",
        color: K.textSec,
        padding: "14px 14px 16px",
        fontSize: 12,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: K.text,
            lineHeight: 1.3,
            minWidth: 0,
          }}
        >
          {L(c.title)}
        </div>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 0.5,
            textTransform: "uppercase",
            padding: "3px 8px",
            borderRadius: 999,
            border: `1px solid ${withAlpha(tone, u.pillBorderA)}`,
            background: withAlpha(tone, u.pillBgA),
            color: `${tone}dd`,
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          <span aria-hidden>{u.glyph}</span>
          <span>{pillLabel}</span>
        </span>
      </div>

      <div
        style={{
          marginTop: 10,
          display: "flex",
          flexDirection: "column",
          gap: 5,
          fontSize: 11,
          color: K.textMut,
        }}
      >
        <div
          style={{ display: "flex", justifyContent: "space-between", gap: 8 }}
        >
          <span style={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
            Channel
          </span>
          <span style={{ color: K.text, textAlign: "right" }}>
            {L(c.channel)}
          </span>
        </div>
        <div
          style={{ display: "flex", justifyContent: "space-between", gap: 8 }}
        >
          <span style={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
            Top Issue
          </span>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: K.text }}>{L(c.topIssue)}</div>
            <div style={{ fontSize: 10, color: K.textMut }}>
              {L(c.topIssueSub)}
            </div>
          </div>
        </div>
        <div
          style={{ display: "flex", justifyContent: "space-between", gap: 8 }}
        >
          <span style={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
            Time
          </span>
          <span style={{ color: K.text, textAlign: "right" }}>{L(c.time)}</span>
        </div>
      </div>

      <div
        style={{
          marginTop: 14,
          minHeight: 108,
          borderRadius: 12,
          border: `1px solid ${K.borderLight}`,
          background: "rgba(0,0,0,0.25)",
          padding: 10,
          fontSize: 11,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 8,
          flex: 1,
        }}
      >
        {c.metrics.map((m) => {
          const deltaColor =
            m.deltaTone === "opportunity" ? K.green : u.delta;
          return (
            <div
              key={m.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <span style={{ color: K.textMut }}>{L(m.label)}</span>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    color: K.text,
                    fontWeight: 700,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {L(m.value)}
                </div>
                {m.delta ? (
                  <div
                    style={{
                      fontSize: 11,
                      color: deltaColor,
                      fontWeight: 700,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {L(m.delta)}
                  </div>
                ) : null}
                {m.sub ? (
                  <div
                    style={{
                      fontSize: 10,
                      color: K.textMut,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {L(m.sub)}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 20,
          borderRadius: 12,
          border: `1px solid ${withAlpha(tone, u.calloutBorderA)}`,
          background: withAlpha(tone, u.calloutBgA),
          padding: 16,
          fontSize: 12,
          lineHeight: 1.75,
          color: u.calloutText,
        }}
      >
        ✨ {L(c.callout)}
      </div>
    </article>
  );
}
