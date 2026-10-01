"use client";

import { useLabel2, useOverviewData, useV2K } from "@kgs2/lib/demoState";
import { Activity, Sparkles } from "lucide-react";
import { withAlpha } from "@/components/role-based-dashboard/kgs/shared/tokens";
import { type OverviewQuestionCard, QuestionCard } from "./QuestionCard";
import { type OverviewSignal, SignalCard } from "./SignalCard";

/**
 * Regional overview — India & Southeast Asia.
 * C pulse · D questions · E signals. Data follows active period.
 */
export function OverviewView() {
  const L = useLabel2();
  const K = useV2K();
  const { data: overview, signalsTitle } = useOverviewData();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <style>{`
        .kgs2-lift { transition: transform 150ms ease-out, border-color 150ms ease-out, box-shadow 150ms ease-out; }
        .kgs2-lift:hover { transform: translateY(-2px); border-color: var(--kgs-accent) !important; box-shadow: var(--kgs-glow) !important; }
      `}</style>

      {/* C. Executive pulse */}
      <section
        style={{
          background: K.elevated,
          borderRadius: 10,
          padding: "12px 14px",
          borderTop: `1px solid ${K.borderLight}`,
          borderRight: `1px solid ${K.borderLight}`,
          borderBottom: `1px solid ${K.borderLight}`,
          borderLeft: `3px solid ${K.amber}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 9,
          }}
        >
          <Sparkles size={13} color={K.amber} aria-hidden />
          <h2
            style={{
              margin: 0,
              fontSize: 12,
              fontWeight: 700,
              color: K.amber,
              letterSpacing: "0.1em",
            }}
          >
            EXECUTIVE PULSE
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 8,
          }}
        >
          {overview.pulse.map((item, i) => (
            <article
              key={item.key}
              style={{
                textAlign: "left",
                background: withAlpha(K.text, 0.03),
                border: `1px solid ${K.borderLight}`,
                borderRadius: 8,
                padding: "10px 12px",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 14,
                  fontWeight: 700,
                  color: K.brandSoft,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 999,
                    background: K.textMut,
                  }}
                />
                {i + 1}. {L(item.title)}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: K.textSec,
                  lineHeight: 1.4,
                  fontWeight: 500,
                }}
              >
                {L(item.body)}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* D. Three question cards */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 12,
        }}
      >
        {(overview.questionCards as OverviewQuestionCard[]).map((c) => (
          <QuestionCard key={c.id} card={c} />
        ))}
      </section>

      {/* E. Signals for active period */}
      <section style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              color: K.text,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Activity size={16} color={K.amber2} aria-hidden />
            {signalsTitle}
          </h2>
        </div>
        <div
          style={{
            display: "flex",
            width: "100%",
            minWidth: 0,
            gap: 12,
            overflowX: "auto",
            paddingBottom: 8,
            alignItems: "stretch",
          }}
        >
          {overview.signals.map((s) => (
            <SignalCard key={s.id} signal={s as OverviewSignal} />
          ))}
        </div>
      </section>
    </div>
  );
}
