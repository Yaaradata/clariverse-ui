"use client";

import { askLisn } from "@kgs/lib/data";
import type { AskLisnItem } from "@kgs/types";
import { RefreshCw, Send, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useKgsNav } from "../nav";
import { K, withAlpha } from "../shared/tokens";
import { useLabel } from "./DemoProvider";

type ChatMsg = {
  role: "user" | "ai";
  text: string;
  cites?: AskLisnItem["cites"];
};

function matchAskItem(text: string, items: AskLisnItem[]): AskLisnItem | null {
  const q = text.toLowerCase().replace(/\s+/g, " ").trim();
  if (!q) return null;
  let best: AskLisnItem | null = null;
  let bestScore = 0;
  for (const item of items) {
    const iq = item.q.toLowerCase();
    const words = iq
      .replace(/\{\{[^}]+\}\}/g, " ")
      .split(/[^a-z0-9.×x$]+/i)
      .filter((w) => w.length > 3);
    let score = 0;
    for (const w of words) {
      if (q.includes(w)) score += 1;
    }
    if (iq.includes("fw") && (q.includes("fw") || q.includes("4.1")))
      score += 2;
    if (iq.includes("partner") && q.includes("partner")) score += 2;
    if (iq.includes("dispute") && (q.includes("dispute") || q.includes("1.4")))
      score += 2;
    if (iq.includes("n-3") && (q.includes("n-3") || q.includes("backlog")))
      score += 2;
    if (iq.includes("cutover") && q.includes("cutover")) score += 2;
    if (iq.includes("confidence") && q.includes("confidence")) score += 2;
    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }
  return bestScore >= 2 ? best : null;
}

/**
 * Ask LiSN panel (04 §2.10) — canned answers from askLisn.json.
 * UI pattern mirrors bank FloatingAIDayGenerator; copy is KGS-only.
 */
export function FloatingAIButton() {
  const L = useLabel();
  const { go } = useKgsNav();
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [busy, setBusy] = useState(false);

  const items = useMemo(
    () =>
      askLisn.map((item) => ({
        ...item,
        qShown: L(item.q),
        aShown: L(item.a),
      })),
    [L],
  );

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setMessages((m) => [...m, { role: "user", text: trimmed }]);
    setPrompt("");
    setBusy(true);
    window.setTimeout(() => {
      const hit = matchAskItem(trimmed, askLisn);
      if (hit) {
        setMessages((m) => [
          ...m,
          {
            role: "ai",
            text: L(hit.a),
            cites: hit.cites,
          },
        ]);
      } else {
        setMessages((m) => [
          ...m,
          {
            role: "ai",
            text: "LiSN drafts from the interactions on this screen — pick a suggested question for a cited answer. Nothing is sent until an owner approves.",
          },
        ]);
      }
      setBusy(false);
    }, 700);
  };

  const tip = "Ask LiSN — canned answers from this week's signals";

  return (
    <>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          title={tip}
          aria-label={tip}
          className="kgs-focus"
          style={{
            position: "fixed",
            bottom: 52,
            right: 22,
            width: 52,
            height: 52,
            borderRadius: 26,
            border: "none",
            background: "linear-gradient(135deg, #c29764 0%, #724ed2 100%)",
            color: "#0a0d14",
            boxShadow: "0 12px 30px rgba(194,151,100,0.33)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <Sparkles size={20} />
        </button>
      ) : null}

      {open ? (
        <div
          role="dialog"
          aria-label="Ask LiSN"
          style={{
            position: "fixed",
            bottom: 22,
            right: 22,
            width: 420,
            maxHeight: "78vh",
            background: K.elevated,
            border: `1px solid ${withAlpha("#c29764", 0.35)}`,
            borderRadius: 16,
            boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
            display: "flex",
            flexDirection: "column",
            zIndex: 50,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "12px 14px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background:
                "linear-gradient(135deg, rgba(194,151,100,0.14) 0%, rgba(114,78,210,0.1) 100%)",
              borderBottom: `1px solid ${K.borderLight}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Sparkles size={14} color="#c29764" />
              <div>
                <div style={{ fontSize: 13, color: K.text, fontWeight: 800 }}>
                  Ask LiSN
                </div>
                <div style={{ fontSize: 10, color: K.textMut }}>
                  President Commercial Fire · Kidde Global
                </div>
              </div>
            </div>
            <button
              type="button"
              aria-label="Close Ask LiSN"
              onClick={() => setOpen(false)}
              className="kgs-focus"
              style={{
                background: "transparent",
                border: "none",
                color: K.textSec,
                cursor: "pointer",
                padding: 4,
              }}
            >
              <X size={16} />
            </button>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: 12,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {messages.length === 0 ? (
              <>
                <div
                  style={{
                    fontSize: 12,
                    color: K.textMut,
                    lineHeight: 1.45,
                    marginBottom: 2,
                  }}
                >
                  Answers cite the interactions behind them. LiSN drafts; people
                  decide.
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 6 }}
                >
                  {items.map((item) => (
                    <button
                      key={item.q}
                      type="button"
                      onClick={() => send(item.qShown)}
                      className="kgs-focus"
                      style={{
                        textAlign: "left",
                        background: K.surface,
                        borderTop: `1px solid ${K.border}`,
                        borderRight: `1px solid ${K.border}`,
                        borderBottom: `1px solid ${K.border}`,
                        borderLeft: "2px solid #c29764",
                        color: K.textSec,
                        borderRadius: 8,
                        padding: "8px 10px",
                        fontSize: 12,
                        cursor: "pointer",
                        lineHeight: 1.4,
                        fontFamily: "inherit",
                      }}
                    >
                      <Sparkles
                        size={10}
                        color="#c29764"
                        style={{ marginRight: 5, marginBottom: -1 }}
                      />
                      {item.qShown}
                    </button>
                  ))}
                </div>
              </>
            ) : null}

            {messages.map((m, i) => (
              <div
                key={`${m.role}-${i}`}
                style={{
                  background:
                    m.role === "user"
                      ? withAlpha(K.sky, 0.1)
                      : withAlpha("#c29764", 0.08),
                  border: `1px solid ${
                    m.role === "user"
                      ? withAlpha(K.sky, 0.35)
                      : withAlpha("#c29764", 0.3)
                  }`,
                  borderRadius: 10,
                  padding: "8px 10px",
                  fontSize: 12,
                  color: K.text,
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.5,
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    color: m.role === "user" ? K.sky : "#c29764",
                    marginBottom: 3,
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                  }}
                >
                  {m.role === "user" ? "You" : "LiSN"}
                </div>
                {m.text}
                {m.cites && m.cites.length > 0 ? (
                  <div
                    style={{
                      marginTop: 8,
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                    }}
                  >
                    {m.cites.map((c) =>
                      c.route ? (
                        <button
                          key={`${c.label}-${c.route}`}
                          type="button"
                          className="kgs-focus"
                          onClick={() => {
                            go(c.route as string);
                            setOpen(false);
                          }}
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: K.violet300,
                            background: withAlpha(K.violet400, 0.12),
                            border: `1px solid ${withAlpha(K.violet400, 0.35)}`,
                            borderRadius: 999,
                            padding: "3px 8px",
                            cursor: "pointer",
                            fontFamily: "inherit",
                          }}
                        >
                          {L(c.label)} →
                        </button>
                      ) : (
                        <span
                          key={c.label}
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: K.textMut,
                            background: "rgba(255,255,255,0.04)",
                            border: `1px solid ${K.borderLight}`,
                            borderRadius: 999,
                            padding: "3px 8px",
                          }}
                        >
                          {L(c.label)}
                        </span>
                      ),
                    )}
                  </div>
                ) : null}
              </div>
            ))}

            {busy ? (
              <div
                style={{
                  fontSize: 11,
                  color: K.textMut,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <RefreshCw size={11} />
                <span>Reading field signals…</span>
              </div>
            ) : null}

            {messages.length > 0 && !busy ? (
              <button
                type="button"
                className="kgs-focus"
                onClick={() => setMessages([])}
                style={{
                  alignSelf: "flex-start",
                  background: "transparent",
                  border: "none",
                  color: K.textMut,
                  fontSize: 11,
                  cursor: "pointer",
                  padding: 0,
                  fontFamily: "inherit",
                }}
              >
                Show suggested questions
              </button>
            ) : null}
          </div>

          <div
            style={{
              padding: 10,
              borderTop: `1px solid ${K.borderLight}`,
              display: "flex",
              gap: 6,
            }}
          >
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") send(prompt);
              }}
              placeholder="Ask about firmware, partners, cutovers…"
              style={{
                flex: 1,
                background: K.surface,
                border: `1px solid ${K.border}`,
                borderRadius: 8,
                padding: "8px 10px",
                color: K.text,
                fontSize: 12,
                outline: "none",
                fontFamily: "inherit",
              }}
            />
            <button
              type="button"
              aria-label="Send"
              onClick={() => send(prompt)}
              className="kgs-focus"
              style={{
                background: "#c29764",
                border: "none",
                borderRadius: 8,
                width: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#0a0d14",
              }}
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
