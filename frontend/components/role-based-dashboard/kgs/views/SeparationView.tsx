"use client";

import { meta, separation } from "@kgs/lib/data";
import type { HumanGate } from "@kgs/types";
import { BackToOverviewHeader } from "../drill/BackToOverviewHeader";
import { DiagnosisBox } from "../drill/DiagnosisBox";
import { EnhancedPanel } from "../drill/EnhancedPanel";
import { KpiRow } from "../drill/KpiTile";
import { LineMonitor, type MonitorSeries } from "../drill/LineMonitor";
import { Panel } from "../drill/Panel";
import { SegmentTable } from "../drill/SegmentTable";
import { SignalWall } from "../drill/SignalWall";
import { StackedBarWithDetailPanel } from "../drill/StackedBarWithDetailPanel";
import { Watchlist } from "../drill/Watchlist";
import { ApproveButton } from "../shared/ApproveButton";
import { GateChip } from "../shared/GateChip";
import { HumanGateStatus } from "../shared/HumanGateStatus";
import { RoutedOwner } from "../shared/RoutedOwner";
import { K } from "../shared/tokens";
import { useLabel } from "../shell/DemoProvider";
import { fill, int } from "../signal/format";

const S = separation;
const P = S.panelCopy;
const TICK_EVERY = 4;

/** S-B: the affected region's lines against the control, with every cutover marked. */
function CutoverTimeline() {
  const L = useLabel();
  const ct = S.cutoverTimeline;
  const weeks = ct.series[0]?.values.map((_, i) => i + 1) ?? [];
  const series: MonitorSeries[] = ct.series.map((s, i) => ({
    key: `s${i}`,
    label: L(s.name),
    colour: s.colour,
    values: s.values,
    dashed: s.dashed,
    emphasis: i === 0,
  }));
  const last = weeks.length;
  return (
    <Panel title={L(P["S-B"].title)} sub={L(P["S-B"].unit ?? "")}>
      <LineMonitor
        weeks={weeks}
        series={series}
        markers={ct.markers}
        tick={(w) => fill(meta.ui.drill.week, { n: w })}
        ticks={weeks.filter(
          (w) => w === 1 || w % TICK_EVERY === 0 || w === last,
        )}
        ariaLabel={L(P["S-B"].title)}
        height={280}
      />
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: K.textSec }}>
        {L(ct.caption)}
      </p>
    </Panel>
  );
}

/** One S-F gate: status block, the owner it sits with, and an Approve locked to that owner. */
function SeparationGate({ gate }: { gate: HumanGate }) {
  const L = useLabel();
  const label = gate.approveLabel ?? "";
  const owner = (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 10,
      }}
    >
      <RoutedOwner role={gate.owner} />
      <ApproveButton
        state="locked"
        label={label}
        pendingLabel={label}
        doneLabel={label}
        lockedTooltip={L(gate.disabledTooltip ?? "")}
        onApprove={() => undefined}
      />
    </div>
  );
  if (gate.status !== "not_sent") {
    return (
      <HumanGateStatus
        status={gate.status}
        title={L(gate.title)}
        auditLine={gate.auditLine ? L(gate.auditLine) : undefined}
      >
        {owner}
      </HumanGateStatus>
    );
  }
  return (
    <div
      style={{
        borderRadius: K.radius.tile,
        padding: 16,
        border: `1px solid ${K.border}`,
        borderLeft: `3px solid ${K.slate}`,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <HumanGateStatus status={gate.status} title={L(gate.title)} />
      <div style={{ paddingLeft: 23 }}>{owner}</div>
    </div>
  );
}

/** S-E: FAQ-able change vs defect, as one split bar with both counts. */
function DefectSplit() {
  const L = useLabel();
  const { faqable, defect, caption } = S.defectSplit;
  const [faqLabel = "", defectLabel = ""] = P["S-E"].columns ?? [];
  const parts = [
    { key: "faq", label: faqLabel, n: faqable, colour: K.sky },
    { key: "defect", label: defectLabel, n: defect, colour: K.orange },
  ];
  return (
    <Panel title={L(P["S-E"].title)}>
      <div
        role="img"
        aria-label={parts.map((p) => `${L(p.label)} ${int(p.n)}`).join(" · ")}
        style={{
          display: "flex",
          height: 28,
          borderRadius: K.radius.chip,
          overflow: "hidden",
          gap: 2,
        }}
      >
        {parts.map((p) => (
          <div
            key={p.key}
            className="kgs-grow"
            style={{ flex: p.n, background: p.colour, opacity: 0.85 }}
          />
        ))}
      </div>
      <dl
        style={{
          margin: 0,
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 12,
        }}
      >
        {parts.map((p, i) => (
          <div
            key={p.key}
            style={{ textAlign: i === 0 ? "left" : "right", minWidth: 0 }}
          >
            <dt style={{ fontSize: 13, color: K.textMut, lineHeight: 1.4 }}>
              <span
                aria-hidden
                style={{
                  display: "inline-block",
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: p.colour,
                  marginRight: 6,
                }}
              />
              {L(p.label)}
            </dt>
            <dd
              style={{
                margin: "2px 0 0",
                fontSize: 24,
                fontWeight: 800,
                color: K.text,
                fontFamily: K.mono,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {int(p.n)}
            </dd>
          </div>
        ))}
      </dl>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: K.textSec }}>
        {L(caption)}
      </p>
    </Panel>
  );
}

/**
 * Q3 drill-down /separation (04 §5.2): one cutover, not the programme — the UK-EU entity against
 * its control, the scorecard showing the other three clean, and the three decisions it needs.
 * GBP only on this page.
 */
export function SeparationView() {
  const L = useLabel();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <BackToOverviewHeader title={S.title} subtitle={S.subtitle} />
      <KpiRow tiles={S.kpis} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)",
          gap: 12,
          alignItems: "start",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            minWidth: 0,
          }}
        >
          <CutoverTimeline />
          <Panel id={P["S-C"].anchor} title={L(P["S-C"].title)}>
            <SegmentTable
              columns={P["S-C"].columns ?? []}
              rows={S.scorecard}
              chipColumn={5}
              figures={[3, 4]}
              caption={L(P["S-C"].title)}
            />
          </Panel>
          <Panel title={L(P["S-F"].title)}>
            {S.gates.map((g) => (
              <SeparationGate key={g.id} gate={g} />
            ))}
            <p style={{ margin: 0, fontSize: 13, color: K.textMut }}>
              {L(P["S-F"].footer ?? "")}
            </p>
          </Panel>
          <Watchlist title={P["S-H"].title} rows={S.legacy.rows}>
            <GateChip text={L(S.legacy.gate)} status="awaiting" wrap />
          </Watchlist>
        </div>

        <div style={{ minWidth: 0, alignSelf: "stretch" }}>
          <SignalWall wall={S.signalWall} />
        </div>
      </div>

      <Panel title={L(S.topicStack.title)}>
        <StackedBarWithDetailPanel
          data={S.topicStack}
          unit={P["S-D"].unit}
          ariaLabel={L(S.topicStack.title)}
        />
      </Panel>
      <DefectSplit />
      <EnhancedPanel data={S.enhanced}>
        <DiagnosisBox diagnosis={S.diagnosis} />
      </EnhancedPanel>
    </div>
  );
}
