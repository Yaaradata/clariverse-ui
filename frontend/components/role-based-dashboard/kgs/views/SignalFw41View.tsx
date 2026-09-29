"use client";

import { meta, signalFw41 } from "@kgs/lib/data";
import { type ReactNode, useState } from "react";
import { ConfidenceMarker } from "../shared/ConfidenceMarker";
import { JoinTagRow } from "../shared/JoinTagRow";
import { RoutedOwner } from "../shared/RoutedOwner";
import { SeverityStrip } from "../shared/SeverityStrip";
import { K } from "../shared/tokens";
import { useDemo } from "../shell/DemoProvider";
import { CohortMiniTable } from "../signal/CohortMiniTable";
import { CounterEvidence } from "../signal/CounterEvidence";
import { DecisionPanel } from "../signal/DecisionPanel";
import { DraftPreviewModal } from "../signal/DraftPreviewModal";
import { EvidenceDrawer, type EvidenceTab } from "../signal/EvidenceDrawer";
import { FirmwareLineageChart } from "../signal/FirmwareLineageChart";
import { fill } from "../signal/format";
import { PnLDetail } from "../signal/PnLDetail";
import { RecommendedAction } from "../signal/RecommendedAction";
import { SignalChips } from "../signal/SignalChips";
import { SignalHeader } from "../signal/SignalHeader";

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

/**
 * Hero deep-dive /installed-base/signal/fw-4-1 (04 §4, 03 §1.3): reads as evidence top to
 * bottom — header, severity, lineage chart and chips on the left; confidence, joins, cohort,
 * P&L, owner, recommended action and the decision on the right.
 */
export function SignalFw41View() {
  const { signal } = signalFw41;
  const si = signal.confidence.sourceIndependence;
  const { drawerOpened } = useDemo();
  const [drawerTab, setDrawerTab] = useState<EvidenceTab | null>(null);
  const [draftOpen, setDraftOpen] = useState(false);
  const openDrawer = (tab: EvidenceTab) => {
    drawerOpened();
    setDrawerTab(tab);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <SignalHeader />
      <SeverityStrip severity={signal.severity} />
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
          <FirmwareLineageChart />
          <SignalChips />
          <CounterEvidence />
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
            <ConfidenceMarker confidence={signal.confidence} />
            {si ? (
              <div
                style={{
                  fontSize: 12,
                  color: K.textMut,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {fill(meta.ui.hero.sourceIndependence, {
                  score: si.score.toFixed(2),
                  partners: si.partners,
                  channels: si.channels,
                })}
              </div>
            ) : null}
            <JoinTagRow tags={signal.joinTags} overflowAfter={5} />
          </Block>
          <Block>
            <CohortMiniTable />
          </Block>
          <Block>
            <PnLDetail onMethod={() => openDrawer("method")} />
          </Block>
          <Block>
            <RoutedOwner
              role={signal.routing.owner}
              cc={signal.routing.cc}
              prefix={meta.ui.hero.routedTo}
              suffix={meta.ui.hero.ownerSuffix}
            />
            {signal.routing.presidentReason ? (
              <div style={{ fontSize: 12, color: K.textMut }}>
                {signal.routing.presidentReason}
              </div>
            ) : null}
            <RecommendedAction />
          </Block>
          <DecisionPanel
            onViewDraft={() => setDraftOpen(true)}
            onOpenEvidence={() => openDrawer("snippets")}
          />
        </div>
      </div>
      <EvidenceDrawer
        tab={drawerTab}
        onTab={setDrawerTab}
        onClose={() => setDrawerTab(null)}
      />
      <DraftPreviewModal open={draftOpen} onClose={() => setDraftOpen(false)} />
    </div>
  );
}
