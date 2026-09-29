"use client";

import { meta } from "@kgs/lib/data";
import { X } from "lucide-react";
import { type ReactNode, useEffect, useRef } from "react";
import { usePresence } from "./motion";
import { K } from "./tokens";

/** Drawer close (04 §6): 180ms; the open slide is 240ms (GLOBAL_CSS `kgs-drawer-in`). */
const DRAWER_EXIT_MS = 180;

const FOCUSABLE =
  'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/** Esc closes, Tab is trapped inside, focus returns to the opener on close (03 §6.7). */
function useDialogFocus(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const node = ref.current;
    node?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !node) return;
      const items = [...node.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      opener?.focus?.();
    };
  }, [open]);

  return ref;
}

/** The dashboard scrolls inside its own container, not the body; lock that while a dialog is open. */
function useScrollLock(open: boolean) {
  useEffect(() => {
    if (!open) return;
    const el = document.querySelector<HTMLElement>("[data-kgs-scroll]");
    if (!el) return;
    const prev = el.style.overflowY;
    el.style.overflowY = "hidden";
    return () => {
      el.style.overflowY = prev;
    };
  }, [open]);
}

/**
 * Backdrop sits at z 60, under the sticky ContextBar (z 70). Drawer/modal panels sit at z 75.
 */
function Backdrop({
  onClose,
  closing = false,
}: {
  onClose: () => void;
  closing?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={meta.ui.close}
      tabIndex={-1}
      onClick={onClose}
      className={closing ? "kgs-fade-out" : "kgs-fade-in"}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        background: "rgba(0,0,0,0.5)",
        border: "none",
        cursor: "default",
      }}
    />
  );
}

function Header({
  title,
  onClose,
  chip,
}: {
  title: string;
  onClose: () => void;
  chip?: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "14px 16px",
        borderBottom: `1px solid ${K.borderLight}`,
      }}
    >
      <div
        style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}
      >
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: K.text }}>
          {title}
        </h2>
        {chip ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 8,
            }}
          >
            {chip}
          </div>
        ) : null}
      </div>
      <button
        type="button"
        aria-label={meta.ui.close}
        onClick={onClose}
        className="kgs-focus"
        style={{
          background: "transparent",
          border: `1px solid ${K.borderLight}`,
          borderRadius: 8,
          color: K.textSec,
          padding: 6,
          cursor: "pointer",
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}

/** Right-hand drawer, 520px (03 §6.7 shell; EvidenceDrawer and HowWeCountDrawer). */
export function Drawer({
  open,
  title,
  onClose,
  children,
  footer,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const ref = useDialogFocus(open, onClose);
  useScrollLock(open);
  const { mounted, closing } = usePresence(open, DRAWER_EXIT_MS);
  if (!mounted) return null;
  return (
    <>
      <Backdrop onClose={onClose} closing={closing} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={closing ? "kgs-drawer-out" : "kgs-drawer-in"}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: 520,
          maxWidth: "100vw",
          zIndex: 75,
          background: K.elevated,
          borderLeft: `1px solid ${K.borderLight}`,
          boxShadow: "-24px 0 48px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header title={title} onClose={onClose} />
        <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          {children}
        </div>
        {footer ? (
          <div
            style={{
              padding: "10px 16px",
              borderTop: `1px solid ${K.borderLight}`,
              fontSize: 12,
              color: K.textMut,
            }}
          >
            {footer}
          </div>
        ) : null}
      </div>
    </>
  );
}

/** Centred modal (governed-watch restriction, draft preview). */
export function Modal({
  open,
  title,
  onClose,
  children,
  width = 560,
  chip,
  footer,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  width?: number;
  /** Status chip shown beside the badge in the header. */
  chip?: ReactNode;
  footer?: ReactNode;
}) {
  const ref = useDialogFocus(open, onClose);
  useScrollLock(open);
  if (!open) return null;
  return (
    <>
      <Backdrop onClose={onClose} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width,
          maxWidth: "92vw",
          maxHeight: "85vh",
          zIndex: 75,
          background: K.elevated,
          border: `1px solid ${K.borderLight}`,
          borderRadius: K.radius.card,
          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Header title={title} onClose={onClose} chip={chip} />
        <div style={{ overflowY: "auto", padding: 16 }}>{children}</div>
        {footer ? (
          <div
            style={{
              padding: "12px 16px",
              borderTop: `1px solid ${K.borderLight}`,
            }}
          >
            {footer}
          </div>
        ) : null}
      </div>
    </>
  );
}
