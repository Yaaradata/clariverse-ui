"use client";

import meta from "@kgs2/data/meta.json";
import { useDemo2 } from "@kgs2/lib/demoState";
import type { Role } from "@kgs2/types";
import { RotateCcw } from "lucide-react";
import { useEffect, useRef } from "react";
import { K } from "@/components/role-based-dashboard/kgs/shared/tokens";
import { ROLE_LANDING } from "../nav";
import { SyntheticBadge } from "../shared/SyntheticBadge";
import { AnonymiseToggle } from "./AnonymiseToggle";

export function DemoMenu({
  open,
  onClose,
  onReset,
}: {
  open: boolean;
  onClose: () => void;
  onReset: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { state, setRole, setView } = useDemo2();
  const landing = ROLE_LANDING[state.role] ?? "overview";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onDown);
    ref.current?.querySelector("button")?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onDown);
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="Demo controls"
      style={{
        position: "fixed",
        left: 88,
        bottom: 56,
        zIndex: 85,
        width: 280,
        background: K.elevated,
        border: `1px solid ${K.borderLight}`,
        borderRadius: K.radius.tile,
        padding: 12,
        boxShadow: "0 16px 40px rgba(0,0,0,0.55)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <label
        htmlFor="kgs2-demo-role"
        style={{ fontSize: 12, color: K.textMut }}
      >
        Viewing as
      </label>
      <select
        id="kgs2-demo-role"
        className="kgs2-focus"
        value={state.role}
        onChange={(e) => setRole(e.target.value as Role)}
        style={{
          background: K.surface,
          color: K.textSec,
          border: `1px solid ${K.borderLight}`,
          borderRadius: 8,
          padding: "6px 8px",
          fontSize: 13,
          fontFamily: "inherit",
        }}
      >
        {meta.roles.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
      <button
        type="button"
        className="kgs2-focus"
        onClick={() => {
          setView(landing);
          onClose();
        }}
        style={{
          background: "none",
          border: "none",
          color: K.violet300,
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "inherit",
          padding: 0,
          textAlign: "left",
          textDecoration: "underline",
        }}
      >
        Go to my view
      </button>
      <AnonymiseToggle />
      <button
        type="button"
        onClick={onReset}
        className="kgs2-focus"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: K.surface,
          border: `1px solid ${K.borderLight}`,
          color: K.text,
          borderRadius: 8,
          padding: "8px 10px",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        <RotateCcw size={14} />
        Reset demo
      </button>
      <div
        style={{
          fontSize: 11,
          color: K.textMut,
          borderTop: `1px solid ${K.borderLight}`,
          paddingTop: 8,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        Clears approvals, role and loop states
        <SyntheticBadge compact />
      </div>
    </div>
  );
}
