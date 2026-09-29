"use client";

import { meta } from "@kgs/lib/data";
import { ArrowLeft } from "lucide-react";
import { useKgsNav } from "../nav";
import { K } from "../shared/tokens";
import { useLabel } from "../shell/DemoProvider";

/** BackToOverviewHeader (03 §1.2): "← Back to Overview" beside the H1 question and subtitle. */
export function BackToOverviewHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const L = useLabel();
  const { go } = useKgsNav();
  return (
    <header style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
      <button
        type="button"
        onClick={() => go("/")}
        className="kgs-focus"
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
        {meta.ui.drill.back}
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
        <p style={{ margin: "6px 0 0", fontSize: 17, color: "#e5e5e5" }}>
          {L(subtitle)}
        </p>
      </div>
    </header>
  );
}
