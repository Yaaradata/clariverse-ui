"use client";

import { RotateCcw } from "lucide-react";
import { useEffect, useRef } from "react";
import { K } from "@/components/role-based-dashboard/kgs/shared/tokens";
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
        width: 260,
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
      <AnonymiseToggle />
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
