"use client";

import signal from "@kgs2/data/signal_pr01.json";
import { useLabel2 } from "@kgs2/lib/demoState";
import { X } from "lucide-react";
import { useEffect } from "react";
import {
  K,
  withAlpha,
} from "@/components/role-based-dashboard/kgs/shared/tokens";
import { SyntheticBadge } from "../shared/SyntheticBadge";

const BODIES: Record<string, string> = {
  "draft-partner-update":
    "Subject: Confirmed delivery date for your open lines\n\nWe have re-checked allocation for your inspection-bound projects. Confirmed date: [one date per distributor]. This draft is ready for Partner manager to send — not sent.",
  "draft-allocation":
    "Internal note: Re-prioritise allocation queue N-2 for the 2 fire-NOC projects. Owner: Operations lead. Status: Not sent.",
  "draft-carrier":
    "Request: Open a last-mile review for the Gurugram hub carrier (11 lines). Share findings with Partner manager North. Status: Not sent.",
};

export function PromiseDraftModals({
  open,
  draftId,
  onSelect,
  onClose,
}: {
  open: boolean;
  draftId: string | null;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const L = useLabel2();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const active =
    signal.drafts.find((d) => d.id === draftId) ?? signal.drafts[0];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 95,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.55)",
        padding: 24,
      }}
    >
      <button
        type="button"
        aria-label="Close drafts"
        className="kgs2-focus"
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          border: "none",
          background: "transparent",
          cursor: "pointer",
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Draft preview"
        style={{
          position: "relative",
          width: "min(640px, 100%)",
          maxHeight: "90vh",
          overflow: "auto",
          background: K.elevated,
          border: `1px solid ${K.borderLight}`,
          borderRadius: 14,
          padding: 18,
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 6,
              }}
            >
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>
                Drafts · North promises
              </h2>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: K.radius.pill,
                  background: withAlpha(K.amber, 0.18),
                  color: K.amber,
                  border: `1px solid ${withAlpha(K.amber, 0.4)}`,
                }}
              >
                Not sent
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: K.textMut }}>
              Nothing is sent automatically. Partner manager sends after
              approval.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close drafts"
            onClick={onClose}
            className="kgs2-focus"
            style={{
              background: "none",
              border: "none",
              color: K.textMut,
              cursor: "pointer",
            }}
          >
            <X size={18} />
          </button>
        </header>

        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            marginBottom: 14,
          }}
        >
          {signal.drafts.map((d) => {
            const on = d.id === active.id;
            return (
              <button
                key={d.id}
                type="button"
                className="kgs2-focus"
                onClick={() => onSelect(d.id)}
                style={{
                  padding: "6px 10px",
                  borderRadius: 8,
                  border: `1px solid ${
                    on ? withAlpha(K.violet400, 0.5) : K.borderLight
                  }`,
                  background: on ? K.brandTint : "transparent",
                  color: on ? K.violet300 : K.textSec,
                  fontSize: 12,
                  fontWeight: on ? 700 : 500,
                  fontFamily: "inherit",
                  cursor: "pointer",
                }}
              >
                {d.title}
              </button>
            );
          })}
        </div>

        <article
          style={{
            background: K.surface,
            border: `1px solid ${K.borderLight}`,
            borderRadius: 12,
            padding: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 8,
              marginBottom: 10,
            }}
          >
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>
              {active.title}
            </h3>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: K.radius.pill,
                background: withAlpha(K.amber, 0.18),
                color: K.amber,
                whiteSpace: "nowrap",
              }}
            >
              {active.status}
            </span>
          </div>
          <pre
            style={{
              margin: 0,
              whiteSpace: "pre-wrap",
              fontFamily: K.font,
              fontSize: 13,
              color: K.body,
              lineHeight: 1.55,
            }}
          >
            {L(BODIES[active.id] ?? active.title)}
          </pre>
        </article>
        <div style={{ marginTop: 14 }}>
          <SyntheticBadge compact />
        </div>
      </div>
    </div>
  );
}
