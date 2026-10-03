"use client";

/**
 * Ask LisN, demo mode: answers only from the precomputed answer bank (ask.json), every figure bound to its id. Free
 * text matches the nearest question; anything else gets "I'd need your data for that" and what LisN would look at.
 * No model call, no generated numbers.
 */

import { Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { AskBank } from "@/lib/indusind-v1/types";
import { C, Fig, tint } from "./primitives";

type Q = AskBank["questions"][number];

const words = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3);

/** The question closest to what was typed, if it shares at least one meaningful word. */
function closest(q: string, qs: Q[]): Q | null {
  const t = new Set(words(q));
  let best: Q | null = null;
  let score = 0;
  for (const x of qs) {
    const n = words(x.q).filter((w) => t.has(w)).length;
    if (n > score) {
      score = n;
      best = x;
    }
  }
  return best;
}

export function AskBar({ ask }: { ask: AskBank }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [shown, setShown] = useState<{ q: string; a: Q | null } | null>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const answer = (text: string) => {
    const t = text.trim();
    if (!t) return;
    const a = ask.questions.find((x) => x.q === t) ?? closest(t, ask.questions);
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
          width: "min(760px, calc(100vw - 32px))",
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
              maxHeight: "min(68vh, 600px)",
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
              }}
            >
              <strong
                style={{
                  display: "inline-flex",
                  gap: 6,
                  alignItems: "center",
                  fontSize: 15,
                  color: C.text,
                }}
              >
                <Sparkles size={16} color={C.brandInk} /> Ask LisN
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
                  gap: 8,
                }}
              >
                <strong style={{ fontSize: 14.5, color: C.text }}>
                  {a?.q ?? shown.q}
                </strong>
                {a && a.q !== shown.q ? (
                  <span style={{ fontSize: 12.5, color: C.textMut }}>
                    You asked: &ldquo;{shown.q}&rdquo;. Closest question shown.
                  </span>
                ) : null}
                {a ? (
                  <>
                    <span
                      style={{
                        fontSize: 14,
                        color: C.textSec,
                        lineHeight: 1.5,
                      }}
                    >
                      {a.answer}
                    </span>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                      }}
                    >
                      {a.figures.map((f) => (
                        <div
                          key={f.id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 12,
                            fontSize: 13,
                            color: C.textSec,
                            borderBottom: `1px solid ${C.border}`,
                            padding: "4px 0",
                          }}
                        >
                          <span style={{ minWidth: 0 }}>{f.label}</span>
                          <strong
                            style={{ color: C.text, whiteSpace: "nowrap" }}
                          >
                            <Fig f={f} />
                          </strong>
                        </div>
                      ))}
                    </div>
                    <span style={{ fontSize: 12, color: C.textMut }}>
                      From the answer bank; no live model call.
                    </span>
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: 14, color: C.textSec }}>
                      {ask.fallback}
                    </span>
                    <ul
                      style={{
                        margin: 0,
                        paddingLeft: 18,
                        fontSize: 13.5,
                        color: C.textSec,
                        lineHeight: 1.6,
                      }}
                    >
                      {ask.fallback_look.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            ) : null}

            <div
              style={{
                fontSize: 11.5,
                fontWeight: 800,
                color: C.textMut,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Show me
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
                gap: 6,
              }}
            >
              {ask.questions.map((x) => (
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
        ) : null}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            answer(q);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: C.card,
            border: `1.5px solid ${tint(C.brand, 0.55)}`,
            borderRadius: 999,
            padding: "6px 6px 6px 16px",
            boxShadow: `0 10px 34px ${tint(C.brand, 0.24)}`,
          }}
        >
          <Sparkles size={18} color={C.brandInk} style={{ flexShrink: 0 }} />
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setOpen(true)}
            aria-label="Ask LisN"
            placeholder="Ask LisN"
            style={{
              flex: 1,
              minWidth: 0,
              background: "transparent",
              border: "none",
              outline: "none",
              color: C.text,
              fontSize: 15,
              padding: "6px 0",
            }}
          />
          <button
            type="submit"
            aria-label="Ask"
            style={{
              width: 36,
              height: 36,
              borderRadius: 999,
              border: "none",
              background: C.brand,
              color: "#fff",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </>
  );
}
