"use client";

import { monitor } from "@kgs/lib/data";
import { Activity } from "lucide-react";
import { EmptyScope } from "../shared/EmptyScope";
import { K, withAlpha } from "../shared/tokens";
import { useScope } from "../shell/Scope";
import { SignalMonitorCard } from "./SignalMonitorCard";

/**
 * Field Signal Monitor — bank AI Risk Spike Monitor layout (header + scroll row).
 */
export function FieldSignalMonitor() {
  const { inScope } = useScope();
  const s = monitor.section;
  const cards = monitor.cards.filter((c) => inScope(c.signalId));

  return (
    <section
      id="field-signal-monitor"
      style={{ display: "flex", flexDirection: "column", gap: 10 }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <h2
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 700,
            color: K.text,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Activity size={16} color={K.amber2} aria-hidden />
          <span>{s.title}</span>
        </h2>
        <span
          className="kgs-chip-pulse"
          style={{
            fontSize: 10,
            padding: "4px 8px",
            borderRadius: 999,
            background: withAlpha(K.amber, 0.125),
            color: `${K.amber}dd`,
            letterSpacing: 0.5,
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          {s.chip}
        </span>
      </div>
      <p style={{ margin: 0, fontSize: 11, color: K.textMut }}>
        {s.headerLine ?? s.subtitleShort ?? s.subtitle}
      </p>

      <div
        style={{
          display: "flex",
          width: "100%",
          minWidth: 0,
          gap: 12,
          overflowX: "auto",
          paddingBottom: 8,
          alignItems: "stretch",
        }}
      >
        {cards.length ? (
          cards.map((c) => <SignalMonitorCard key={c.signalId} card={c} />)
        ) : (
          <div style={{ flex: "0 0 252px", minWidth: 252 }}>
            <EmptyScope />
          </div>
        )}
      </div>
    </section>
  );
}
