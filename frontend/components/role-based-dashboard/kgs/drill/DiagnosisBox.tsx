"use client";

import { meta } from "@kgs/lib/data";
import type { Diagnosis } from "@kgs/types";
import { Sparkles } from "lucide-react";
import { ConfidenceMarker } from "../shared/ConfidenceMarker";
import { K, withAlpha } from "../shared/tokens";
import { useLabel } from "../shell/DemoProvider";

/** DiagnosisBox (03 §3C): ✨ title + compact confidence; three columns with bold lead-ins. */
export function DiagnosisBox({ diagnosis }: { diagnosis: Diagnosis }) {
  const L = useLabel();
  const [mainLabel, changedLabel, decideLabel] = meta.labels.diagnosisRows;
  const rows = [
    { label: mainLabel, text: diagnosis.main },
    { label: changedLabel, text: diagnosis.changed },
    { label: decideLabel, text: diagnosis.decideFirst },
  ];
  return (
    <section
      aria-label={L(diagnosis.title)}
      style={{
        background: withAlpha(K.brand, 0.08),
        border: `1px solid ${withAlpha(K.violet400, 0.35)}`,
        borderRadius: K.radius.card,
        padding: 18,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <header
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 800,
            color: K.text,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Sparkles size={18} color={K.violet400} aria-hidden />
          {L(diagnosis.title)}
        </h2>
        {diagnosis.confidenceShort ? (
          <ConfidenceMarker short={diagnosis.confidenceShort} compact />
        ) : null}
      </header>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 16,
        }}
      >
        {rows.map((r) => (
          <p
            key={r.label}
            style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: K.body }}
          >
            <strong style={{ color: K.text }}>{L(r.label)}:</strong> {L(r.text)}
          </p>
        ))}
      </div>
    </section>
  );
}
