"use client";

import { exec } from "@kgs/lib/data";
import { AppliedValueStrip } from "../exec/AppliedValueStrip";
import { EvidenceReadinessTile } from "../exec/EvidenceReadinessTile";
import { ExecBriefBar } from "../exec/ExecBriefBar";
import { FieldSignalMonitor } from "../exec/FieldSignalMonitor";
import { FunnelStrip } from "../exec/FunnelStrip";
import { GovernedWatchTile } from "../exec/GovernedWatchTile";
import { PulseStrip } from "../exec/PulseStrip";
import { QuestionCard } from "../exec/QuestionCard";

/**
 * Exec overview (04 §2.1): B funnel · C brief · D pulse · E question cards · F applied value ·
 * G Field Signal Monitor · H governed watch (cols 1–7) + evidence readiness (cols 8–12).
 */
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
      <AppliedValueStrip />
      <FieldSignalMonitor />
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
          gap: 12,
          alignItems: "stretch",
        }}
      >
        <div style={{ gridColumn: "span 7" }}>
          <GovernedWatchTile />
        </div>
        <div style={{ gridColumn: "span 5" }}>
          <EvidenceReadinessTile />
        </div>
      </section>
    </div>
  );
}
