"use client";

import { K } from "@/components/role-based-dashboard/kgs/shared/tokens";
import { useDemo2, useLabel2 } from "@kgs2/lib/demoState";
import { VIEW_PAGE_LABEL, VIEW_TITLE } from "../nav";
import type { V2View } from "@kgs2/types";

export function DrillHeader({ view }: { view: V2View }) {
  const L = useLabel2();
  const { state } = useDemo2();
  const title = VIEW_TITLE[view];
  const crumb = `Global Commercial Fire · Asia ex China · ${state.role} · ${VIEW_PAGE_LABEL[view]}`;

  return (
    <header
      style={{
        padding: "14px 24px 12px",
        borderBottom: `1px solid ${K.borderLight}`,
        background: K.elevated,
      }}
    >
      <h1
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: K.text,
          margin: 0,
          letterSpacing: "-0.01em",
        }}
      >
        {L(title)}
      </h1>
      <div
        style={{
          fontSize: 14,
          color: K.textSec,
          marginTop: 4,
          lineHeight: 1.45,
        }}
      >
        {L(crumb)}
      </div>
    </header>
  );
}
