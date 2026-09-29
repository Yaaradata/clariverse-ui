"use client";

import { exec } from "@kgs/lib/data";
import { ExecBriefBar } from "../exec/ExecBriefBar";
import { FieldSignalMonitor } from "../exec/FieldSignalMonitor";
import { FunnelStrip } from "../exec/FunnelStrip";
import { PulseStrip } from "../exec/PulseStrip";
import { QuestionCard } from "../exec/QuestionCard";

/** Exec overview (04 §2.1): rows B–E and G; F and H follow in Step 8. */
export function OverviewView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <FunnelStrip />
      <ExecBriefBar />
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
