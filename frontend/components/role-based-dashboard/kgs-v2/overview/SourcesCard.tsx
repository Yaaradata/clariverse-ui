"use client";

import overview from "@kgs2/data/overview.json";
import { useDemo2, useLabel2 } from "@kgs2/lib/demoState";
import {
  K,
  withAlpha,
} from "@/components/role-based-dashboard/kgs/shared/tokens";

/**
 * Sources card — 6th card in the signal row (SPEC §4 F).
 * Two columns: Connected (KGS-owned) / Not connected (partner-owned).
 */
export function SourcesCard() {
  const L = useLabel2();
  const { setView } = useDemo2();
  const src = overview.sources;

  return (
    <article
      style={{
        width: 252,
        minWidth: 252,
        maxWidth: 252,
        minHeight: 280,
        flex: "0 0 252px",
        borderRadius: 16,
        border: `1px solid ${K.borderLight}`,
        background: K.elevated,
        color: K.textSec,
        padding: "14px 14px 16px",
        fontSize: 12,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: 14,
          fontWeight: 700,
          color: K.text,
          letterSpacing: "0.04em",
        }}
      >
        Sources
      </h3>

      <div
        style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}
      >
        <div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: K.green,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Connected (KGS-owned)
          </div>
          <ul
            style={{
              margin: 0,
              paddingLeft: 16,
              color: K.textSec,
              fontSize: 11,
              lineHeight: 1.5,
            }}
          >
            {src.connected.map((s) => (
              <li key={s.name}>{L(s.name)}</li>
            ))}
          </ul>
        </div>
        <div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: K.amber,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Not connected (partner-owned)
          </div>
          <ul
            style={{
              margin: 0,
              paddingLeft: 16,
              color: K.textSec,
              fontSize: 11,
              lineHeight: 1.5,
            }}
          >
            {src.notConnected.map((s) => (
              <li key={s.name}>{L(s.name)}</li>
            ))}
          </ul>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setView("partner")}
        className="kgs2-focus"
        style={{
          marginTop: "auto",
          background: withAlpha(K.violet400, 0.12),
          border: `1px solid ${withAlpha(K.violet400, 0.35)}`,
          borderRadius: 10,
          padding: "8px 10px",
          color: K.violet300,
          fontSize: 11,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "inherit",
          textAlign: "left",
          lineHeight: 1.4,
        }}
      >
        {L(src.footnote)}
      </button>
    </article>
  );
}
