"use client";

import { monitor } from "@kgs/lib/data";
import { EmptyScope } from "../shared/EmptyScope";
import { useLabel } from "../shell/DemoProvider";
import { useScope } from "../shell/Scope";
import { SectionHeader } from "./SectionHeader";
import { SignalMonitorCard } from "./SignalMonitorCard";
import { SuppressedEndCard } from "./SuppressedEndCard";

/**
 * Field Signal Monitor (04 §2.7): SectionHeader + ranked cards + suppressed end card
 * in a horizontally scrolling strip (bank AI Risk Spike Monitor layout).
 */
export function FieldSignalMonitor() {
  const L = useLabel();
  const { inScope } = useScope();
  const s = monitor.section;
  const cards = monitor.cards.filter((c) => inScope(c.signalId));
  return (
    <section
      id="field-signal-monitor"
      style={{ display: "flex", flexDirection: "column", gap: 10 }}
    >
      <SectionHeader
        title={s.title}
        chip={s.chip}
        chipPulse
        subtitle={s.subtitleShort ?? s.subtitle}
        italic={L(s.suppressedLine)}
      />
      <div
        style={{
          display: "flex",
          width: "100%",
          minWidth: 0,
          gap: 12,
          overflowX: "auto",
          paddingBottom: 8,
          alignItems: "stretch",
          scrollSnapType: "x mandatory",
        }}
      >
        {cards.length ? (
          cards.map((c) => <SignalMonitorCard key={c.signalId} card={c} />)
        ) : (
          <div style={{ flex: "1 1 0", minWidth: 240, scrollSnapAlign: "start" }}>
            <EmptyScope />
          </div>
        )}
        <SuppressedEndCard />
      </div>
    </section>
  );
}
