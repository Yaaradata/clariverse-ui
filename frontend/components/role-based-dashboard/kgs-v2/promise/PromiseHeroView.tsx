"use client";

import signal from "@kgs2/data/signal_pr01.json";
import { useDemo2, useLabel2 } from "@kgs2/lib/demoState";
import type { LoopStatus } from "@kgs2/types";
import { Info } from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import {
  K,
  withAlpha,
} from "@/components/role-based-dashboard/kgs/shared/tokens";
import { DrillHeader2 } from "../shared/DrillHeader2";
import { LoopTracker } from "../shared/LoopTracker";
import { HeroPromiseChart } from "./HeroPromiseChart";
import { PromiseDecisionPanel } from "./PromiseDecisionPanel";
import { PromiseDraftModals } from "./PromiseDraftModals";
import {
  PromiseEvidenceDrawer,
  type PromiseEvidenceTab,
} from "./PromiseEvidenceDrawer";

function Block({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: K.card,
        borderRadius: K.radius.card,
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {children}
    </div>
  );
}

function WhyRankedPopover({ open }: { open: boolean }) {
  if (!open) return null;
  return (
    <div
      role="tooltip"
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        left: 0,
        zIndex: 20,
        width: 420,
        maxWidth: "90vw",
        background: K.elevated,
        border: `1px solid ${K.borderLight}`,
        borderRadius: 12,
        padding: 12,
        boxShadow: "0 12px 32px rgba(0,0,0,0.45)",
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: K.textMut,
          marginBottom: 8,
        }}
      >
        Why ranked here?
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
        {signal.rank.factors.map((f) => (
          <li
            key={f.label}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto auto",
              gap: 8,
              padding: "6px 0",
              borderBottom: `1px solid ${K.borderLight}`,
              fontSize: 12,
            }}
          >
            <span style={{ color: K.text }}>{f.label}</span>
            <span style={{ color: K.body, fontFamily: K.mono }}>{f.value}</span>
            <span style={{ color: K.textMut, fontFamily: K.mono }}>
              w{f.weight} · {f.score}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * PR-01 hero deep dive (SPEC §5b).
 */
export function PromiseHeroView() {
  const L = useLabel2();
  const { state, isApproved } = useDemo2();
  const [whyOpen, setWhyOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<PromiseEvidenceTab | null>(null);
  const [draftsOpen, setDraftsOpen] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(
    signal.drafts[0]?.id ?? null,
  );

  const loop: LoopStatus = useMemo(() => {
    const stored = state.loop["PR-01"];
    if (stored) return stored;
    if (isApproved("PR-01")) {
      return {
        step: "watching",
        nextCheck: "2026-10-02",
        approvedAt: state.approvals["PR-01"]?.ts,
      };
    }
    return { step: "open", nextCheck: signal.loop.nextCheck };
  }, [state.loop, state.approvals, isApproved]);

  const cs = signal.causeSplit;
  const conf = signal.confidence;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        padding: "16px 24px 24px",
      }}
    >
      <DrillHeader2
        title="North region: promises slipping"
        subtitle="Promise kept fell vs its own baseline · 3 distributors · 2 projects at inspection risk"
        parentView="promise"
        backLabel="Back to Promises"
      />

      {/* Rank */}
      <div style={{ position: "relative", alignSelf: "flex-start" }}>
        <button
          type="button"
          className="kgs2-focus"
          aria-expanded={whyOpen}
          onClick={() => setWhyOpen((v) => !v)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            fontWeight: 700,
            padding: "4px 10px",
            borderRadius: K.radius.pill,
            background: K.brandTint,
            color: K.violet300,
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {signal.rank.chip} · Why ranked here?
          <Info size={13} aria-hidden />
        </button>
        <WhyRankedPopover open={whyOpen} />
      </div>

      {/* Severity strip */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "8px 12px",
          padding: "10px 12px",
          borderRadius: K.radius.tile,
          border: `1px solid ${K.borderLight}`,
          background: K.surface,
          fontSize: 13,
          color: K.body,
        }}
      >
        <span
          style={{
            fontWeight: 800,
            color: K.orange,
            fontFamily: K.mono,
          }}
        >
          {signal.severity.class}
        </span>
        <span>{signal.severity.word}</span>
        <span style={{ color: K.textMut }}>·</span>
        <span>{signal.severity.domain}</span>
        <span style={{ color: K.textMut }}>·</span>
        <span>{signal.severity.blastRadius.headline}</span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
          gap: 14,
          alignItems: "start",
        }}
      >
        <div
          style={{
            gridColumn: "span 8",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            minWidth: 0,
          }}
        >
          <Block>
            <HeroPromiseChart
              weeks={signal.chart.weeks}
              values={signal.chart.values}
              baselineLow={signal.chart.baselineBand.low}
              baselineHigh={signal.chart.baselineBand.high}
              targetPct={signal.chart.targetPct}
              markers={signal.chart.markers}
              ariaLabel="North weekly promise kept with baseline band"
            />
          </Block>

          <Block>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: K.textMut,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Cause split
            </div>
            <div style={{ fontSize: 14, color: K.text, lineHeight: 1.5 }}>
              KGS-side {cs.kgsSide.total} of{" "}
              {cs.kgsSide.total + cs.lastMile.total} lines (allocation{" "}
              {cs.kgsSide.allocation}, order change {cs.kgsSide.orderChange}) ·
              last mile {cs.lastMile.total} ({L(cs.lastMile.note)})
            </div>
            <div style={{ fontSize: 12, color: K.amber, fontWeight: 600 }}>
              {L(cs.label)}
            </div>
            <div
              style={{
                display: "flex",
                height: 10,
                borderRadius: 6,
                overflow: "hidden",
                marginTop: 4,
              }}
            >
              <div
                style={{
                  flex: cs.kgsSide.allocation,
                  background: K.orange,
                }}
                title="Allocation"
              />
              <div
                style={{
                  flex: cs.kgsSide.orderChange,
                  background: K.violet400,
                }}
                title="Order change"
              />
              <div
                style={{ flex: cs.lastMile.total, background: K.slate }}
                title="Last mile"
              />
            </div>
          </Block>

          <Block>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: K.textMut,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Counter-evidence
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                color: K.body,
                lineHeight: 1.5,
              }}
            >
              {L(signal.counterEvidence)}
            </p>
          </Block>

          <LoopTracker status={loop} />
        </div>

        <div
          style={{
            gridColumn: "span 4",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            minWidth: 0,
          }}
        >
          <Block>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: K.textMut,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Confidence
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: K.text }}>
              {conf.level} {conf.p} · K {conf.known.count} · I{" "}
              {conf.inferred.count}
            </div>
            <div style={{ fontSize: 12, color: K.body, lineHeight: 1.45 }}>
              Known: {conf.known.label}
            </div>
            <div style={{ fontSize: 12, color: K.body, lineHeight: 1.45 }}>
              Inferred: {conf.inferred.label}
            </div>
            <div
              style={{
                display: "flex",
                height: 8,
                borderRadius: 4,
                overflow: "hidden",
                marginTop: 4,
              }}
              title={`K ${conf.known.count} · I ${conf.inferred.count}`}
            >
              <div
                style={{
                  flex: conf.known.count,
                  background: K.violet400,
                }}
              />
              <div
                style={{
                  flex: conf.inferred.count,
                  background: withAlpha(K.violet400, 0.35),
                }}
              />
            </div>
            <div style={{ fontSize: 12, color: K.textMut, marginTop: 4 }}>
              Source independence {conf.sourceIndependence.scoreDisplay} ·{" "}
              {conf.sourceIndependence.partners} distributors ·{" "}
              {conf.sourceIndependence.channels} channels
            </div>
          </Block>

          <Block>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: K.textMut,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Join tags
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {signal.joinTags.map((t) => (
                <span
                  key={t.key}
                  style={{
                    fontSize: 11,
                    padding: "4px 8px",
                    borderRadius: K.radius.pill,
                    background: K.surface,
                    border: `1px solid ${K.borderLight}`,
                    color: K.body,
                  }}
                >
                  <span style={{ color: K.textMut }}>{t.key}: </span>
                  {L(t.value)}
                </span>
              ))}
            </div>
          </Block>

          <Block>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: K.textMut,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              P&L destination
            </div>
            <div style={{ fontSize: 14, color: K.text }}>
              {signal.pnl.compact}
            </div>
          </Block>

          <Block>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: K.textMut,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Routed to
            </div>
            <div style={{ fontSize: 14, color: K.text }}>
              {signal.routing.owner}{" "}
              <span style={{ color: K.textMut }}>(owner)</span>
            </div>
            <div style={{ fontSize: 12, color: K.textMut }}>
              cc {signal.routing.cc.join(", ")}
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 12,
                fontWeight: 700,
                color: K.textMut,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Recommended action
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: K.body,
                lineHeight: 1.5,
              }}
            >
              {L(signal.recommendedAction)}
            </p>
          </Block>

          <PromiseDecisionPanel
            onViewDrafts={() => {
              setDraftId(signal.drafts[0]?.id ?? null);
              setDraftsOpen(true);
            }}
            onOpenEvidence={() => setDrawerTab("snippets")}
          />
        </div>
      </div>

      <PromiseEvidenceDrawer
        tab={drawerTab}
        onTab={setDrawerTab}
        onClose={() => setDrawerTab(null)}
      />
      <PromiseDraftModals
        open={draftsOpen}
        draftId={draftId}
        onSelect={setDraftId}
        onClose={() => setDraftsOpen(false)}
      />
    </div>
  );
}
