"use client";

import React, { useState } from "react";
import { RefreshCw, Send, Sparkles, X } from "lucide-react";
import { AI_DAY_PROMPTS, mockAiDayResponse } from "../../lib/cxHeadRetailData";
import { ConfidenceBand as ConfidenceBandUi } from "./ConfidenceBand";
import { cssVar, radius, z } from "../../theme/tokens";

export function FloatingAIDayGenerator(): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);

  const send = (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setPrompt("");
    setBusy(true);
    window.setTimeout(() => {
      setMessages((m) => [...m, { role: "ai", text: mockAiDayResponse(q) }]);
      setBusy(false);
    }, 900);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: z.floating,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 18px",
          borderRadius: radius.pill,
          border: "none",
          background: `linear-gradient(135deg, ${cssVar("accent")}, ${cssVar("accent-2")})`,
          color: "#fff",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: cssVar("shadow-pop"),
        }}
      >
        <Sparkles size={16} />
        AI Day Generator
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 80,
            right: 24,
            width: 360,
            maxHeight: 480,
            zIndex: z.floating,
            background: cssVar("surface"),
            border: `1px solid ${cssVar("border-strong")}`,
            borderRadius: radius.lg,
            boxShadow: cssVar("shadow-pop"),
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "12px 14px", borderBottom: `1px solid ${cssVar("border")}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: cssVar("text-primary") }}>Distil the day</span>
            <button type="button" onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: cssVar("text-muted") }}>
              <X size={16} />
            </button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {messages.length === 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {AI_DAY_PROMPTS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => send(p)}
                    style={{
                      textAlign: "left",
                      background: cssVar("surface-raised"),
                      border: `1px solid ${cssVar("border")}`,
                      borderLeft: `2px solid ${cssVar("accent")}`,
                      borderRadius: radius.sm,
                      padding: "8px 10px",
                      fontSize: 11,
                      color: cssVar("text-secondary"),
                      cursor: "pointer",
                      lineHeight: 1.4,
                    }}
                  >
                    <Sparkles size={10} style={{ marginRight: 5, verticalAlign: "middle" }} />
                    {p}
                  </button>
                ))}
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  background: m.role === "user" ? cssVar("accent-soft") : cssVar("surface-raised"),
                  border: `1px solid ${cssVar("border")}`,
                  borderRadius: radius.md,
                  padding: "8px 10px",
                  fontSize: 12,
                  color: cssVar("text-primary"),
                  lineHeight: 1.5,
                }}
              >
                {m.role === "ai" && (
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                    <Sparkles size={10} color={cssVar("accent")} />
                    <ConfidenceBandUi band="High" />
                  </div>
                )}
                {m.text}
              </div>
            ))}
            {busy && (
              <div style={{ fontSize: 11, color: cssVar("text-muted"), display: "flex", alignItems: "center", gap: 6 }}>
                <RefreshCw size={11} />
                Distilling interaction corpus…
              </div>
            )}
          </div>
          <div style={{ padding: 10, borderTop: `1px solid ${cssVar("border")}`, display: "flex", gap: 6 }}>
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") send(prompt);
              }}
              placeholder="Ask about signals, bridges, statutory clocks…"
              style={{
                flex: 1,
                background: cssVar("surface-raised"),
                border: `1px solid ${cssVar("border")}`,
                borderRadius: radius.sm,
                padding: "8px 10px",
                fontSize: 12,
                color: cssVar("text-primary"),
                outline: "none",
              }}
            />
            <button
              type="button"
              onClick={() => send(prompt)}
              style={{
                background: cssVar("accent"),
                border: "none",
                borderRadius: radius.sm,
                width: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#fff",
              }}
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
