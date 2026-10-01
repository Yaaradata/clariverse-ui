"use client";

import meta from "@kgs2/data/meta.json";
import { useDemo2, useLabel2 } from "@kgs2/lib/demoState";
import type { Role } from "@kgs2/types";
import type { ReactNode } from "react";
import {
  K,
  withAlpha,
} from "@/components/role-based-dashboard/kgs/shared/tokens";
import { ROLE_LANDING } from "../nav";
import { AnonymiseToggle } from "./AnonymiseToggle";

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

export function ContextBar({
  region,
  onRegionChange,
}: {
  region: string;
  onRegionChange: (id: string) => void;
}) {
  const L = useLabel2();
  const { state, setRole, setView } = useDemo2();
  const landing = ROLE_LANDING[state.role] ?? "overview";

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
      <Field label="Region" htmlFor="kgs2-region">
        <select
          id="kgs2-region"
          value={region}
          onChange={(e) => onRegionChange(e.target.value)}
          style={selectStyle}
          className="kgs2-focus"
        >
          {meta.regions.map((r) => (
            <option key={r.id} value={r.id}>
              {L(r.label)}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Period" htmlFor="kgs2-period">
        <select
          id="kgs2-period"
          value={meta.period.label}
          onChange={() => undefined}
          style={selectStyle}
          className="kgs2-focus"
        >
          <option value={meta.period.label}>{meta.period.label}</option>
        </select>
      </Field>

      <Field label="Viewing as" htmlFor="kgs2-role">
        <select
          id="kgs2-role"
          value={state.role}
          onChange={(e) => setRole(e.target.value as Role)}
          style={selectStyle}
          className="kgs2-focus"
        >
          {meta.roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </Field>

      {state.roleChanged ? (
        <button
          type="button"
          onClick={() => setView(landing)}
          className="kgs2-focus"
          style={{
            background: "none",
            border: "none",
            color: K.violet300,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
            padding: 0,
            textDecoration: "underline",
          }}
        >
          Go to my view
        </button>
      ) : null}

      <span
        style={{
          fontSize: 12,
          color: K.textMut,
          fontFamily: K.mono,
          whiteSpace: "nowrap",
        }}
      >
        Data as of {meta.dataAsOf.label}
      </span>

      <AnonymiseToggle />

      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.04em",
          color: K.amber2,
          border: `1px solid ${withAlpha(K.amber2, 0.35)}`,
          borderRadius: 6,
          padding: "3px 8px",
          whiteSpace: "nowrap",
        }}
      >
        {meta.badge}
      </span>
    </div>
  );
}
