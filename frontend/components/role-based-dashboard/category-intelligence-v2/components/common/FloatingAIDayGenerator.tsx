"use client";

import React, { useState } from "react";
import { Sparkles, X } from "lucide-react";

import { AI_WEEK_RESPONSE, DEFAULT_RAIL_ORDER } from "../../lib/seedData";
import { useAppState } from "../../state/AppStateContext";
import { useTheme } from "../../theme/DashboardThemeProvider";
import { cssVar, radius, z } from "../../theme/tokens";

const PROMPTS = [
  "Generate my week — what should Priya act on?",
  "Re-rank signals for the weekly category review",
  "What is fixable vs buyer-intent this week?",
];

export function FloatingAIDayGenerator(): React.ReactElement {
  const { reorderRail, patchUi, resetTransientUi } = useAppState();
  const { themeKey } = useTheme();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const generate = () => {
    if (busy) return;
    setBusy(true);
    patchUi({ dayGeneratorActive: true });
    window.setTimeout(() => {
      reorderRail([...DEFAULT_RAIL_ORDER]);
      setResponse(AI_WEEK_RESPONSE);
      setBusy(false);
    }, 800);
  };

  React.useEffect(() => {
    return () => {
      resetTransientUi();
    };
  }, [themeKey, resetTransientUi]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: z.floating ?? 50,
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
        ✦ Generate my week
      </button>

      {open && (
        <div
          className="lisn-anim-scale"
          style={{
            position: "fixed",
            bottom: 80,
            right: 24,
            width: 340,
            zIndex: z.floating ?? 50,
            background: cssVar("surface"),
            border: `1px solid ${cssVar("border-strong")}`,
            borderRadius: radius.lg,
            boxShadow: cssVar("shadow-pop"),
            padding: 14,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>✦ AI Day Generator</span>
            <button type="button" onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <X size={16} />
            </button>
          </div>
          <p style={{ fontSize: 12, color: cssVar("text-muted"), margin: "0 0 10px" }}>
            Re-ranks the signal rail — does not fire any action.
          </p>
          {PROMPTS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={generate}
              disabled={busy}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                marginBottom: 6,
                padding: "8px 10px",
                borderRadius: radius.sm,
                border: `1px solid ${cssVar("border")}`,
                background: cssVar("surface-raised"),
                fontSize: 11,
                cursor: busy ? "wait" : "pointer",
              }}
            >
              {p}
            </button>
          ))}
          {response && (
            <div style={{ marginTop: 10, fontSize: 12, color: cssVar("text-secondary"), lineHeight: 1.45 }}>
              {response}
            </div>
          )}
        </div>
      )}
    </>
  );
}
