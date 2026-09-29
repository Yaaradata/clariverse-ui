"use client";

import { monitor } from "@kgs/lib/data";
import { useLabel } from "../shell/DemoProvider";
import { SectionHeader } from "./SectionHeader";
import { SignalMonitorCard } from "./SignalMonitorCard";
import { SuppressedEndCard } from "./SuppressedEndCard";

/**
 * Field Signal Monitor (04 §2.7): SectionHeader + 5 cards in rank order + the suppressed end
 * card, in a horizontally scrolling, scroll-snapped strip with a right-edge fade.
 */
export function FieldSignalMonitor() {
  const L = useLabel();
  const s = monitor.section;
  return (
    <section
      id="field-signal-monitor"
      style={{ display: "flex", flexDirection: "column", gap: 10 }}
    >
      <SectionHeader
        title={s.title}
        chip={s.chip}
        subtitle={s.subtitle}
        italic={L(s.suppressedLine)}
      />
      <div
        style={{
          display: "flex",
          gap: 12,
          overflowX: "auto",
          paddingBottom: 8,
          alignItems: "stretch",
          scrollSnapType: "x mandatory",
          maskImage:
            "linear-gradient(to right, black calc(100% - 32px), transparent)",
        }}
      >
        {monitor.cards.map((c) => (
          <SignalMonitorCard key={c.signalId} card={c} />
        ))}
        <SuppressedEndCard />
      </div>
    </section>
  );
}
