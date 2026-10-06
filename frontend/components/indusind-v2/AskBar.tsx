"use client";

/**
 * Ask LisN, AI-first (30 Sep review, K5): a pinned question bar on every screen. On focus it offers about ten
 * questions for the current view and the recent ones. A suggested question is answered from the page's own period
 * figures (lib/hdfc-v3/askAnswers.ts): a short answer and a small table, tagged as precomputed. No live model call.
 * An answer can be pinned to "My view" for the session.
 */

import { Lock, Pin, Send, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  type AskQA,
  type AskScope,
  cardsQuestions,
  mdQuestions,
} from "@/lib/indusind-v2/askAnswers";
import { addRecent, pin, useAskSession } from "@/lib/indusind-v2/askSession";
import {
  PERIOD_IDS,
  type PeriodId,
  type PeriodsFile,
} from "@/lib/indusind-v2/periods";
import type { AskFile } from "@/lib/indusind-v2/types";
import { matchPrompt } from "./AskLisN";
import { C, MONO, tint } from "./primitives";

const MY_VIEW = "/role-based/indusind_bank/pulse-v2/my-view";

const words = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3);

/** The suggested question closest to what was typed, if any shares two or more words with it. */
function closest(q: string, qs: AskQA[]): AskQA | null {
  const t = new Set(words(q));
  let best: AskQA | null = null;
  let score = 1;
  for (const x of qs) {
    const n = words(x.q).filter((w) => t.has(w)).length;
    if (n > score) {
      score = n;
      best = x;
    }
  }
  return best;
}

export function AnswerBody({ a }: { a: AskQA }) {
  return (
    <>
      <div
        style={{
          fontSize: 14.5,
          lineHeight: 1.55,
          color: a.denied ? C.amber : C.text,
          display: "flex",
          gap: 8,
          alignItems: "flex-start",
          whiteSpace: "pre-line",
        }}
      >
        {a.denied ? (
          <Lock size={16} style={{ flexShrink: 0, marginTop: 3 }} />
        ) : null}
        <span>{a.answer}</span>
      </div>
      {a.table?.rows.length ? (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 13,
            }}
          >
            <thead>
              <tr>
                {a.table.head.map((h, i) => (
                  <th
                    key={h}
                    style={{
                      textAlign: i ? "right" : "left",
                      color: C.textMut,
                      fontWeight: 700,
                      fontSize: 12,
                      padding: "4px 8px",
                      borderBottom: `1px solid ${C.border}`,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {a.table.rows.map((r) => (
                <tr key={r.join("|")}>
                  {r.map((cell, i) => (
                    <td
                      key={`${a.table?.head[i]}`}
                      style={{
                        textAlign: i ? "right" : "left",
                        fontFamily:
                          i && /^[\d−+—]/.test(cell) ? MONO : undefined,
                        padding: "5px 8px",
                        borderBottom: `1px solid ${C.border}`,
                        color: C.textSec,
                        verticalAlign: "top",
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </>
  );
}

export function AskBar({
  ask,
  periods,
  open,
  setOpen,
}: {
  ask: AskFile;
  periods?: PeriodsFile;
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const sp = useSearchParams();
  const pathname = usePathname() ?? "";
  const session = useAskSession();
  const input = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [shown, setShown] = useState<{ q: string; a: AskQA | null } | null>(
    null,
  );

  const pid = sp?.get("period") as PeriodId | null;
  const period = periods
    ? periods.periods[pid && PERIOD_IDS.includes(pid) ? pid : periods.default]
    : null;
  const scope: AskScope | null = period?.cards?.internal
    ? "cards"
    : period?.customer_pulse
      ? "md"
      : null;
  const viewLabel =
    scope === "cards"
      ? "Cards business view"
      : scope === "md"
        ? "MD's office / Head of CX"
        : "Full window";

  const suggestions: AskQA[] = useMemo(() => {
    if (period && scope === "cards") return cardsQuestions(period);
    if (period && scope === "md") return mdQuestions(period);
    // Pages without period figures: the questions precomputed for the full window.
    return ask.prompts.slice(0, 10).map((x) => ({
      id: x.id,
      q: x.prompt,
      answer: x.answer,
      link: x.links[0],
    }));
  }, [period, scope, ask]);

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
    let a: AskQA | null =
      suggestions.find((x) => x.q === t) ?? closest(t, suggestions);
    if (!a) {
      const old = matchPrompt(t, ask.prompts);
      if (old)
        a = {
          id: old.id,
          q: old.prompt,
          answer: old.answer,
          link: old.links[0],
        };
    }
    setShown({ q: t, a });
    addRecent(a?.q ?? t);
    setQ("");
    setOpen(true);
  };

  const a = shown?.a ?? null;
  const pinnedKey = a ? `${a.id}:${period?.label ?? viewLabel}` : "";
  const isPinned = session.pinned.some((x) => x.key === pinnedKey);
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
  const label = {
    fontSize: 11.5,
    fontWeight: 800,
    color: C.textMut,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
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
                  · {viewLabel}
                  {period ? ` · ${period.label}` : ""}
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
                  border: `1px solid ${a?.denied ? tint(C.amber, 0.5) : C.border}`,
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
                    {ask.fallback}
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
                  {a && !a.denied ? (
                    <button
                      type="button"
                      data-testid="pin-answer"
                      disabled={isPinned}
                      onClick={() =>
                        pin(a, period?.label ?? viewLabel, viewLabel)
                      }
                      style={{
                        display: "inline-flex",
                        gap: 5,
                        alignItems: "center",
                        background: isPinned ? "transparent" : C.brand,
                        color: isPinned ? C.textSec : "#fff",
                        border: `1px solid ${isPinned ? C.border : C.brand}`,
                        borderRadius: 8,
                        padding: "4px 10px",
                        fontSize: 12.5,
                        fontWeight: 700,
                        cursor: isPinned ? "default" : "pointer",
                      }}
                    >
                      <Pin size={13} />{" "}
                      {isPinned ? "Pinned to my view" : "Pin to my view"}
                    </button>
                  ) : null}
                  {isPinned ? (
                    <Link href={MY_VIEW} style={{ color: C.brandInk }}>
                      Open My view
                    </Link>
                  ) : null}
                  {a?.link ? (
                    <Link
                      href={a.link.href}
                      onClick={() => setOpen(false)}
                      style={{ color: C.brandInk }}
                    >
                      {a.link.label}
                    </Link>
                  ) : null}
                  {a?.denied ? null : (
                    <span>
                      Precomputed from this view&apos;s data
                      {period ? ` for ${period.label.toLowerCase()}` : ""}; no
                      live model call.
                    </span>
                  )}
                </div>
              </div>
            ) : null}

            <div style={label}>Suggested for this view</div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
                gap: 6,
              }}
            >
              {suggestions.map((x) => (
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
            <div style={label}>Recent questions</div>
            {session.recent.length ? (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {session.recent.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => answer(r)}
                    style={{ ...chip, fontSize: 13, padding: "5px 10px" }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            ) : (
              <span style={{ fontSize: 13, color: C.textMut }}>
                None yet in this session.
              </span>
            )}
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
            padding: "8px 8px 8px 16px",
            boxShadow: `0 10px 34px ${tint(C.brand, 0.28)}`,
          }}
        >
          <Sparkles size={20} color={C.brandInk} style={{ flexShrink: 0 }} />
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setOpen(true)}
            aria-label="Ask LisN about your business"
            placeholder="Ask LisN about your business"
            style={{
              flex: 1,
              minWidth: 0,
              background: "transparent",
              border: "none",
              outline: "none",
              color: C.text,
              fontSize: 15.5,
              padding: "6px 0",
            }}
          />
          {pathname !== MY_VIEW && session.pinned.length ? (
            <Link
              href={MY_VIEW}
              style={{
                fontSize: 12.5,
                color: C.brandInk,
                whiteSpace: "nowrap",
                textDecoration: "none",
              }}
            >
              My view ({session.pinned.length})
            </Link>
          ) : null}
          <button
            type="submit"
            aria-label="Ask"
            style={{
              width: 38,
              height: 38,
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
            <Send size={17} />
          </button>
        </form>
      </div>
    </>
  );
}
