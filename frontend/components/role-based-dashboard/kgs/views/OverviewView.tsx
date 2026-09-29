"use client";

import { exec } from "@kgs/lib/data";
import { FieldSignalMonitor } from "../exec/FieldSignalMonitor";
import { PulseStrip } from "../exec/PulseStrip";
import { QuestionCard } from "../exec/QuestionCard";

/**
 * Exec overview: pulse · question cards · Field Signal Monitor.
 */
export function OverviewView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <PulseStrip />
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 12,
        }}
      >
        {exec.questionCards.map((c) => (
          <QuestionCard key={c.id} card={c} />
        ))}
      </section>
      <FieldSignalMonitor />
    </div>
  );
}
