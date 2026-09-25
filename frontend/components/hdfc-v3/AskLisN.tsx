"use client";

import { Send, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { fmtDate } from "@/lib/hdfc-v3/format";
import type { AskEntry, AskFile, Evidence, View } from "@/lib/hdfc-v3/types";
import { C, ProvenanceTag } from "./primitives";

type Ev = Pick<
  Evidence,
  "id" | "summary" | "source_label" | "created_at" | "themes"
>;

const STOP = new Set([
  "the",
  "a",
  "an",
  "is",
  "are",
  "of",
  "to",
  "in",
  "on",
  "for",
  "and",
  "or",
  "what",
  "which",
  "where",
  "who",
  "how",
  "we",
  "us",
  "our",
  "this",
  "that",
  "with",
  "do",
  "does",
  "did",
  "be",
  "it",
  "about",
  "from",
  "most",
  "if",
  "would",
  "should",
]);

function tokens(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s']/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP.has(w));
}

/** Deterministic keyword match to the nearest precomputed prompt (B4 §7). No live model. */
export function matchPrompt(q: string, prompts: AskEntry[]): AskEntry | null {
  const qt = tokens(q);
  if (!qt.length) return null;
  let best: AskEntry | null = null;
  let bestScore = 0;
  for (const p of prompts) {
    const kw = new Set([
      ...p.keywords.map((k) => k.toLowerCase()),
      ...tokens(p.prompt),
    ]);
    let score = 0;
    for (const t of qt) {
      if (kw.has(t)) score += 2;
      else if (
        [...kw].some(
          (k) =>
            k.length > 4 &&
            (k.startsWith(t.slice(0, 5)) || t.startsWith(k.slice(0, 5))),
        )
      )
        score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = p;
    }
  }
  return bestScore >= 3 ? best : null;
}

export function AskLisN({
  open,
  onClose,
  ask,
  evidence,
  from,
}: {
  open: boolean;
  onClose: () => void;
  ask: AskFile;
  evidence: Record<string, Ev>;
  from: View;
}) {
  const [q, setQ] = useState("");
  const [thread, setThread] = useState<{ q: string; a: AskEntry | null }[]>([]);
  const prompts = ask.prompts;

  const submit = (text: string) => {
    const t = text.trim();
    if (!t) return;
    const exact = prompts.find((p) => p.prompt === t);
    setThread((th) => [...th, { q: t, a: exact ?? matchPrompt(t, prompts) }]);
    setQ("");
  };

  const suggestions = useMemo(() => prompts.map((p) => p.prompt), [prompts]);

  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-label="Ask LisN"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          border: "none",
        }}
      />
      <div
        style={{
          position: "relative",
          width: "min(520px, 100vw)",
          height: "100%",
          background: C.surface,
          borderLeft: `1px solid ${C.borderLight}`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 16px",
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>Ask LisN</div>
            <div style={{ fontSize: 13, color: C.textMut }}>
              Answers come from this demo&apos;s public data, with the items
              cited.
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Ask LisN"
            style={{
              background: "transparent",
              border: "none",
              color: C.textSec,
              cursor: "pointer",
            }}
          >
            <X size={18} />
          </button>
        </div>
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {thread.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div
                style={{
                  fontSize: 13,
                  color: C.textMut,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Suggested questions
              </div>
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => submit(s)}
                  style={{
                    textAlign: "left",
                    background: C.card,
                    border: `1px solid ${C.border}`,
                    color: C.textSec,
                    borderRadius: 8,
                    padding: "9px 12px",
                    fontSize: 14,
                    cursor: "pointer",
                    lineHeight: 1.4,
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          ) : null}
          {thread.map((t, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: append-only thread
              key={i}
              style={{ display: "flex", flexDirection: "column", gap: 8 }}
            >
              <div
                style={{
                  alignSelf: "flex-end",
                  background: C.brandSoft,
                  border: `1px solid ${C.brand}44`,
                  borderRadius: 10,
                  padding: "8px 12px",
                  fontSize: 14,
                  maxWidth: "90%",
                }}
              >
                {t.q}
              </div>
              <div
                data-testid="ask-answer"
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: 10,
                  padding: "12px 14px",
                  fontSize: 14.5,
                  lineHeight: 1.55,
                  color: C.textSec,
                }}
              >
                {t.a ? (
                  <>
                    {t.a.prompt !== t.q ? (
                      <div
                        style={{
                          fontSize: 12.5,
                          color: C.textMut,
                          marginBottom: 6,
                        }}
                      >
                        Closest question: {t.a.prompt}
                      </div>
                    ) : null}
                    <div style={{ whiteSpace: "pre-line" }}>{t.a.answer}</div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 6,
                        marginTop: 10,
                      }}
                    >
                      {t.a.evidence.map((id) => {
                        const ev = evidence[id];
                        if (!ev) return null;
                        return (
                          <Link
                            key={id}
                            data-testid="evidence-chip"
                            href={`/hdfc-v3/signal/${ev.themes[0]}?from=${from}#ev-${encodeURIComponent(id)}`}
                            onClick={onClose}
                            title={ev.summary}
                            style={{
                              fontSize: 12.5,
                              color: C.textSec,
                              border: `1px solid ${C.borderLight}`,
                              borderRadius: 999,
                              padding: "3px 10px",
                              textDecoration: "none",
                              background: C.cardAlt,
                            }}
                          >
                            {ev.source_label} · {fmtDate(ev.created_at)}
                          </Link>
                        );
                      })}
                    </div>
                    {t.a.links.length ? (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 10,
                          marginTop: 8,
                        }}
                      >
                        {t.a.links.map((l) => (
                          <Link
                            key={l.href}
                            href={`${l.href}${l.href.includes("?") ? "&" : "?"}from=${from}`}
                            onClick={onClose}
                            style={{ fontSize: 13, color: "#b7a6ff" }}
                          >
                            {l.label}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                    <div style={{ marginTop: 10 }}>
                      <ProvenanceTag kind="public" />
                    </div>
                  </>
                ) : (
                  <div>{ask.fallback}</div>
                )}
              </div>
            </div>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(q);
          }}
          style={{
            display: "flex",
            gap: 8,
            padding: 12,
            borderTop: `1px solid ${C.border}`,
          }}
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ask about this week's customer voice"
            aria-label="Question"
            style={{
              flex: 1,
              background: C.card,
              border: `1px solid ${C.borderLight}`,
              borderRadius: 8,
              color: C.text,
              padding: "9px 12px",
              fontSize: 14.5,
            }}
          />
          <button
            type="submit"
            aria-label="Ask"
            style={{
              background: C.brand,
              border: "none",
              borderRadius: 8,
              color: "#fff",
              padding: "0 14px",
              cursor: "pointer",
            }}
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}
