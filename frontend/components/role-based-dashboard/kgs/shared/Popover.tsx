"use client";

import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { K } from "./tokens";

/**
 * Small anchored popover (no Radix Popover in the repo, REPO_MAP R10). Opens on click, and on
 * hover when `hover` is set; Esc and outside click close it. 150ms fade/scale (04 §6).
 */
export function Popover({
  trigger,
  label,
  children,
  hover = false,
  align = "left",
  width = 360,
}: {
  trigger: ReactNode;
  /** Accessible name for the trigger button. */
  label: string;
  children: ReactNode;
  hover?: boolean;
  align?: "left" | "right";
  width?: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onDown);
    };
  }, [open, close]);

  return (
    <span ref={ref} style={{ position: "relative", display: "inline-flex" }}>
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        onMouseEnter={hover ? () => setOpen(true) : undefined}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="kgs-focus"
        style={{
          background: "transparent",
          border: "none",
          padding: 0,
          color: "inherit",
          font: "inherit",
          cursor: "pointer",
        }}
      >
        {trigger}
      </button>
      {open ? (
        <div
          role="dialog"
          aria-label={label}
          onMouseLeave={hover ? close : undefined}
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            [align]: 0,
            zIndex: 65,
            width,
            maxWidth: "80vw",
            background: K.elevated,
            border: `1px solid ${K.borderLight}`,
            borderRadius: K.radius.tile,
            padding: 14,
            boxShadow: "0 16px 40px rgba(0,0,0,0.55)",
            color: K.textSec,
            fontSize: 13,
            lineHeight: 1.5,
            textAlign: "left",
            cursor: "default",
          }}
          className="kgs-pop-in"
        >
          {children}
        </div>
      ) : null}
    </span>
  );
}
