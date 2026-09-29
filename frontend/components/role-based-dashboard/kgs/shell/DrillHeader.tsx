"use client";

import { meta } from "@kgs/lib/data";
import { roleLabel, withRole } from "@kgs/lib/label";
import type { KgsView } from "../nav";
import { K } from "../shared/tokens";
import { useDemo, useLabel } from "./DemoProvider";

/**
 * Fork of the bank drill header (HeadOfCreditCardsDashboard.tsx:1203-1220): title + one
 * breadcrumb line. KGS changes: breadcrumb from meta.breadcrumbs with the {role}
 * placeholder = current "Viewing as"; shown on the overview too (04 §1.3).
 */
export function DrillHeader({ view, title }: { view: KgsView; title: string }) {
  const L = useLabel();
  const { state } = useDemo();
  const crumb = withRole(
    meta.breadcrumbs[view] ?? "",
    roleLabel(state.viewingAs, state.anonymise),
  );
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
