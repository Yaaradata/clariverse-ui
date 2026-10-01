"use client";

import { K } from "@/components/role-based-dashboard/kgs/shared/tokens";
import { useLabel2 } from "@kgs2/lib/demoState";

/** Pass 2 placeholder — SPEC title only; later passes replace the body. */
export function PlaceholderView({ title }: { title: string }) {
  const L = useLabel2();
  return (
    <div
      style={{
        padding: "48px 24px",
        color: K.text,
        fontFamily: K.font,
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: K.text,
        }}
      >
        {L(title)}
      </h2>
      <p style={{ marginTop: 12, color: K.textMut, fontSize: 14 }}>
        Placeholder — content lands in a later pass.
      </p>
    </div>
  );
}
