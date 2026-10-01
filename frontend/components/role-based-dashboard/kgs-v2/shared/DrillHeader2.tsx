"use client";

import { useLabel2, useV2K } from "@kgs2/lib/demoState";
import type { V2View } from "@kgs2/types";
import { ArrowLeft } from "lucide-react";
import { useKgs2Nav } from "../nav";

/**
 * v2 BackToOverviewHeader — same size/spacing as v1.
 * Default: ← Back to Overview → overview. Hero/theme pass parentView + backLabel.
 */
export function DrillHeader2({
  title,
  subtitle,
  parentView = "overview",
  backLabel = "Back to Overview",
}: {
  title: string;
  subtitle: string;
  parentView?: V2View;
  /** Label after the arrow icon, e.g. "Back to Overview" or "Back to Promises". */
  backLabel?: string;
}) {
  const L = useLabel2();
  const K = useV2K();
  const { go } = useKgs2Nav();
  return (
    <header style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
      <button
        type="button"
        onClick={() => go(parentView)}
        className="kgs2-focus"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
          minHeight: 44,
          padding: "0 18px",
          background: "transparent",
          border: `1px solid ${K.borderLight}`,
          borderRadius: 10,
          color: K.textSec,
          fontSize: 15,
          fontWeight: 600,
          fontFamily: "inherit",
          cursor: "pointer",
        }}
      >
        <ArrowLeft size={16} aria-hidden />
        {backLabel.replace(/^←\s*/, "")}
      </button>
      <div style={{ minWidth: 0 }}>
        <h1
          style={{
            margin: 0,
            fontSize: 34,
            fontWeight: 800,
            color: K.text,
            lineHeight: 1.15,
          }}
        >
          {L(title)}
        </h1>
        <p style={{ margin: "6px 0 0", fontSize: 17, color: K.textSec }}>
          {L(subtitle)}
        </p>
      </div>
    </header>
  );
}
