"use client";

/**
 * Ask LisN, the bar at the foot of every screen (re-bound from oct13). Five suggested questions for the selected
 * window and brand; a typed question goes to the closest one, otherwise the fallback. Answers come from the answer
 * bank only. No model call. The page keeps bottom padding so the bar never covers content (HL-26).
 */

import { Send, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { AskQA } from "@/lib/natwest-pulse/nw";
import { AnswerBody, closest } from "./AskLisN";
import { C, tint } from "./primitives";

export function AskBar({
  qa,
  fallback,
  context,
  open,
  setOpen,
}: {
  qa: AskQA[];
  fallback: string;
  context: string;
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [shown, setShown] = useState<{ q: string; a: AskQA | null } | null>(
    null,
  );

  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  const answer = (text: string) => {
    const t = text.trim();
    if (!t) return;
    const a = qa.find((x) => x.q === t) ?? closest(t, qa);
    setShown({ q: t, a });
    setQ("");
    setOpen(true);
  };

  const a = shown?.a ?? null;
  const chip = {
    textAlign: "left" as const,
    background: C.cardAlt,
    border: `1px solid ${C.border}`,
    color: C.text,
    borderRadius: 10,
    padding: "7px 11px",
    fontSize: 13.5,
    cursor: "pointer",
    lineHeight: 1.35,
  };

  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="Close Ask LisN"
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 48,
            background: "rgba(0,0,0,0.28)",
            border: "none",
          }}
        />
      ) : null}
      <div
        data-testid="ask-bar"
        style={{
          position: "fixed",
          left: "50%",
          bottom: 14,
          transform: "translateX(-50%)",
          width: "min(820px, calc(100vw - 28px))",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {open ? (
          <div
            role="dialog"
            aria-label="Ask LisN"
            data-testid="ask-panel"
            style={{
              background: C.card,
              border: `1px solid ${tint(C.brand, 0.4)}`,
              borderRadius: 16,
              boxShadow: `0 18px 50px ${tint(C.brand, 0.25)}`,
              padding: "14px 16px",
              maxHeight: "min(68vh, 640px)",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 8,
              }}
            >
              <strong
                style={{
                  display: "inline-flex",
                  gap: 6,
                  alignItems: "center",
                  fontSize: 15,
                }}
              >
                <Sparkles size={16} color={C.brandInk} /> Ask LisN
                <span
                  style={{ fontWeight: 400, color: C.textMut, fontSize: 13 }}
                >
                  · {context}
                </span>
              </strong>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: C.textSec,
                  cursor: "pointer",
                  display: "grid",
                }}
              >
                <X size={18} />
              </button>
            </div>
            {shown ? (
              <div
                data-testid="ask-answer"
                style={{
                  background: C.cardAlt,
                  border: `1px solid ${C.border}`,
                  borderRadius: 12,
                  padding: "12px 14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <strong style={{ fontSize: 15 }}>{a?.q ?? shown.q}</strong>
                {a && a.q !== shown.q ? (
                  <span style={{ fontSize: 12.5, color: C.textMut }}>
                    You asked: &ldquo;{shown.q}&rdquo;. Closest question shown.
                  </span>
                ) : null}
                {a ? (
                  <AnswerBody a={a} />
                ) : (
                  <span style={{ fontSize: 14, color: C.textSec }}>
                    {fallback}
                  </span>
                )}
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                    alignItems: "center",
                    fontSize: 12.5,
                    color: C.textMut,
                  }}
                >
                  {a?.link ? (
                    <Link
                      href={a.link.href}
                      onClick={() => setOpen(false)}
                      style={{ color: C.brandInk }}
                    >
                      {a.link.label}
                    </Link>
                  ) : null}
                  <span>
                    Precomputed from this view&apos;s figures; no model call.
                  </span>
                </div>
              </div>
            ) : null}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 800,
                  color: C.textMut,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Suggested
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {qa.map((x) => (
                  <button
                    key={x.id}
                    type="button"
                    data-testid="ask-suggestion"
                    onClick={() => answer(x.q)}
                    style={chip}
                  >
                    {x.q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            answer(q);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: C.card,
            border: `1px solid ${tint(C.brand, 0.45)}`,
            borderRadius: 999,
            padding: "6px 6px 6px 14px",
            boxShadow: `0 10px 30px ${tint(C.brand, 0.18)}`,
          }}
        >
          <Sparkles size={16} color={C.brandInk} style={{ flexShrink: 0 }} />
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setOpen(true)}
            placeholder="Ask LisN about this view"
            aria-label="Ask LisN"
            style={{
              flex: 1,
              minWidth: 0,
              background: "transparent",
              border: "none",
              outline: "none",
              color: C.text,
              fontSize: 14.5,
            }}
          />
          <button
            type="submit"
            aria-label="Ask"
            style={{
              display: "grid",
              placeItems: "center",
              width: 34,
              height: 34,
              borderRadius: 999,
              background: C.brand,
              border: "none",
              color: "#fff",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </>
  );
}
