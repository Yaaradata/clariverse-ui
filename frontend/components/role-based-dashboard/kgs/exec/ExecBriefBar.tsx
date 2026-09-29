"use client";

import { exec } from "@kgs/lib/data";
import { Sparkles } from "lucide-react";
import { K } from "../shared/tokens";
import { useLabel } from "../shell/DemoProvider";

/**
 * Fork of the bank "Executive Brief" block (HeadOfCreditCardsDashboard.tsx:1233-1258).
 * KGS changes: label and brief from exec.json (02 §3.3 variant A); label written in caps in
 * the data, no CSS uppercase.
 */
export function ExecBriefBar() {
  const L = useLabel();
  return (
    <section
      style={{
        background: K.elevated,
        borderRadius: 10,
        padding: "10px 14px",
        border: `1px solid ${K.borderLight}`,
        boxShadow: `0 0 0 1px ${K.amber}12 inset`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <Sparkles size={14} color={K.amber} aria-hidden />
        <h2
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 700,
            color: K.amber,
            letterSpacing: "0.1em",
          }}
        >
          {exec.briefLabel}
        </h2>
      </div>
      <p
        style={{
          margin: "7px 0 0",
          fontSize: 15,
          color: K.textSec,
          lineHeight: 1.45,
        }}
      >
        {L(exec.briefShort ?? exec.brief)}
      </p>
    </section>
  );
}
