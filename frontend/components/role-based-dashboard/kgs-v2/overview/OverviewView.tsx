"use client";

import overview from "@kgs2/data/overview.json";
import { useDemo2, useLabel2 } from "@kgs2/lib/demoState";
import { Activity, Sparkles } from "lucide-react";
import {
  K,
  withAlpha,
} from "@/components/role-based-dashboard/kgs/shared/tokens";
import { type OverviewQuestionCard, QuestionCard } from "./QuestionCard";
import { type OverviewSignal, SignalCard } from "./SignalCard";

/**
 * Regional overview — Asia ex China — this week (SPEC §4).
 * All figures from overview.json via useLabel2().
 */
export function OverviewView() {
  const L = useLabel2();
  const { state, setView } = useDemo2();
  const showPipeline =
    state.role === "Sales ops" || state.role === "Regional GM";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "16px 24px 24px",
      }}
    >
      <style>{`
        .kgs2-lift { transition: transform 150ms ease-out, border-color 150ms ease-out, box-shadow 150ms ease-out; }
        .kgs2-lift:hover { transform: translateY(-2px); border-color: var(--kgs-accent) !important; box-shadow: var(--kgs-glow) !important; }
      `}</style>

      {/* A. Read strip */}
      <section
        style={{
          background: K.elevated,
          borderRadius: 10,
          padding: "10px 14px",
          border: `1px solid ${K.borderLight}`,
          fontSize: 14,
          color: K.textSec,
          lineHeight: 1.45,
        }}
      >
        {L(overview.readStrip)}
      </section>

      {/* B. Executive brief */}
      <section
        style={{
          background: K.elevated,
          borderRadius: 10,
          padding: "10px 14px",
          border: `1px solid ${K.borderLight}`,
          boxShadow: `0 0 0 1px ${K.amber}12 inset`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <Sparkles size={14} color={K.amber} aria-hidden />
          <h2
            style={{
              margin: 0,
              fontSize: 13,
              fontWeight: 700,
              color: K.amber,
              letterSpacing: "0.1em",
            }}
          >
            EXECUTIVE BRIEF
          </h2>
        </div>
        <p
          style={{
            margin: "7px 0 0",
            fontSize: 15,
            color: K.textSec,
            lineHeight: 1.45,
          }}
        >
          {L(overview.brief)}
        </p>
      </section>

      {/* C. Executive pulse */}
      <section
        style={{
          background: K.elevated,
          borderRadius: 10,
          padding: "12px 14px",
          border: `1px solid ${K.borderLight}`,
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
                background: "rgba(255,255,255,0.03)",
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

      {/* E. This week's signals */}
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
            This week&apos;s signals
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
          {(overview.signals as OverviewSignal[]).map((s) => (
            <SignalCard key={s.id} signal={s} />
          ))}
        </div>
      </section>

      {/* F. Sources card */}
      <section
        style={{
          background: K.elevated,
          borderRadius: 12,
          border: `1px solid ${K.borderLight}`,
          padding: "14px 16px",
        }}
      >
        <h2
          style={{
            margin: "0 0 12px",
            fontSize: 14,
            fontWeight: 700,
            color: K.text,
            letterSpacing: "0.04em",
          }}
        >
          Sources
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: K.green,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Connected (KGS-owned)
            </div>
            <ul
              style={{
                margin: 0,
                paddingLeft: 18,
                color: K.textSec,
                fontSize: 13,
                lineHeight: 1.55,
              }}
            >
              {overview.sources.connected.map((s) => (
                <li key={s.name}>{L(s.name)}</li>
              ))}
            </ul>
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: K.amber,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Not connected (partner-owned)
            </div>
            <ul
              style={{
                margin: 0,
                paddingLeft: 18,
                color: K.textSec,
                fontSize: 13,
                lineHeight: 1.55,
              }}
            >
              {overview.sources.notConnected.map((s) => (
                <li key={s.name}>{L(s.name)}</li>
              ))}
            </ul>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setView("partner")}
          className="kgs2-focus"
          style={{
            marginTop: 12,
            background: "none",
            border: "none",
            padding: 0,
            color: K.violet300,
            fontSize: 12,
            cursor: "pointer",
            fontFamily: "inherit",
            textDecoration: "underline",
          }}
        >
          {L(overview.sources.footnote)}
        </button>
      </section>

      {/* G. Loop-closure strip */}
      <section
        style={{
          background: withAlpha(K.teal, 0.08),
          borderRadius: 10,
          border: `1px solid ${withAlpha(K.teal, 0.28)}`,
          padding: "12px 14px",
          fontSize: 14,
          color: K.textSec,
          lineHeight: 1.45,
        }}
      >
        {L(overview.loopClosureStrip)}
      </section>

      {/* H. Pipeline notes (Sales ops / Regional GM) */}
      {showPipeline ? (
        <section
          style={{
            background: K.elevated,
            borderRadius: 12,
            border: `1px solid ${K.borderLight}`,
            padding: "14px 16px",
            maxWidth: 480,
          }}
        >
          <h2
            style={{
              margin: "0 0 4px",
              fontSize: 14,
              fontWeight: 700,
              color: K.text,
            }}
          >
            Pipeline notes
          </h2>
          <div
            style={{
              fontSize: 11,
              color: K.textMut,
              marginBottom: 10,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            From Salesforce notes
          </div>
          <ul
            style={{
              margin: 0,
              paddingLeft: 18,
              color: K.textSec,
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            {overview.pipelineNotes.items.map((item) => (
              <li key={item.theme}>
                {L(item.theme)}: {item.count}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
