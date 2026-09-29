"use client";

import { anonymise, meta } from "@kgs/lib/data";
import { roleLabel } from "@kgs/lib/label";
import { type ReactNode, useState } from "react";
import { K, withAlpha } from "../shared/tokens";
import { AnonymiseToggle } from "./AnonymiseToggle";
import { useDemo, useLabel } from "./DemoProvider";
import { SyntheticBadge } from "./SyntheticBadge";

const selectStyle = {
  background: K.surface,
  color: K.textSec,
  border: `1px solid ${K.borderLight}`,
  borderRadius: 8,
  padding: "5px 8px",
  fontSize: 13,
  fontFamily: "inherit",
} as const;

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 12,
        color: K.textMut,
        whiteSpace: "nowrap",
      }}
    >
      {htmlFor ? (
        <label htmlFor={htmlFor}>{label}</label>
      ) : (
        <span>{label}</span>
      )}
      {children}
    </div>
  );
}

/**
 * ContextBar (04 §1.4): sticky 56px. Brand/Region render in P0 (scoping is P1), Period is
 * static, Role shows the current "Viewing as" (global switch is P2), Data as of, Anonymise
 * toggle (default OFF) and the SyntheticBadge, always visible above drawers and modals.
 */
export function ContextBar() {
  const L = useLabel();
  const { state } = useDemo();
  const ui = meta.ui.contextBar;
  const [brand, setBrand] = useState(meta.filters.brand[0]);
  const [region, setRegion] = useState(meta.filters.region[0]);
  const regionText = (v: string) =>
    anonymise.region[v] ? L.one("region", v) : v;

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 70,
        minHeight: 56,
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "8px 16px",
        padding: "8px 24px",
        background: withAlpha("#0d0d0d", 0.96),
        borderBottom: `1px solid ${K.borderLight}`,
        backdropFilter: "blur(6px)",
      }}
    >
      <Field label={ui.brand} htmlFor="kgs-brand">
        <select
          id="kgs-brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          style={selectStyle}
          className="kgs-focus"
        >
          {meta.filters.brand.map((b) => (
            <option key={b} value={b}>
              {L(b)}
            </option>
          ))}
        </select>
      </Field>
      <Field label={ui.region} htmlFor="kgs-region">
        <select
          id="kgs-region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          style={selectStyle}
          className="kgs-focus"
        >
          {meta.filters.region.map((r) => (
            <option key={r} value={r}>
              {regionText(r)}
            </option>
          ))}
        </select>
      </Field>
      <Field label={ui.period} htmlFor="kgs-period">
        <select
          id="kgs-period"
          value={meta.filters.period.value}
          onChange={() => undefined}
          style={selectStyle}
          className="kgs-focus"
        >
          <option value={meta.filters.period.value}>
            {meta.filters.period.value}
          </option>
          {meta.filters.period.disabled.map((p) => (
            <option key={p} value={p} disabled>
              {p}
            </option>
          ))}
        </select>
      </Field>
      <Field label={ui.role}>
        <span style={{ color: K.textSec, fontSize: 13 }}>
          {roleLabel(state.viewingAs, state.anonymise)}
        </span>
      </Field>
      <span
        style={{
          fontSize: 12,
          color: K.textMut,
          fontFamily: K.mono,
          whiteSpace: "nowrap",
        }}
      >
        {meta.dataAsOf.label}
      </span>
      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <AnonymiseToggle />
        <SyntheticBadge />
      </div>
    </div>
  );
}
