"use client";

import { installedBase, LEGACY_ROUTES, meta } from "@kgs/lib/data";
import type { SeverityClass } from "@kgs/types";
import { useEffect, useRef, useState } from "react";
import { BackToOverviewHeader } from "../drill/BackToOverviewHeader";
import { ContactsRmaOverlay } from "../drill/ContactsRmaOverlay";
import { EmergingPhrasingTable } from "../drill/EmergingPhrasingTable";
import { BigKpiTile, KpiRow } from "../drill/KpiTile";
import { LineMonitor, type MonitorSeries } from "../drill/LineMonitor";
import { Panel } from "../drill/Panel";
import { SegmentTable } from "../drill/SegmentTable";
import { SignalWall } from "../drill/SignalWall";
import { StackedBarWithDetailPanel } from "../drill/StackedBarWithDetailPanel";
import { StackedRatioBar } from "../drill/StackedRatioBar";
import { Watchlist } from "../drill/Watchlist";
import { useKgsNav } from "../nav";
import { K } from "../shared/tokens";
import { useLabel } from "../shell/DemoProvider";
import { fill, int } from "../signal/format";

const IB = installedBase;
const P = IB.panelCopy;
const HERO_ROUTE = LEGACY_ROUTES["/signals/A1"];
const PULSE_MS = 1200;

/** P-C: fw 4.1 vs normal range (focus variant); legend opens the hero. */
function CohortMonitor() {
  const L = useLabel();
  const { go } = useKgsNav();
  const { lineageMonitor: lm } = IB;
  const series: MonitorSeries[] = lm.series.map((s, i) => {
    const isFw41 = /@4\.1\}\}/.test(s.label) || /fw:EST4@4\.1/.test(s.label);
    return {
      key: `s${i}`,
      label: L(s.label),
      colour: s.colour,
      values: s.values,
      dashed: s.dashed,
      secondary: Boolean(s.dashed),
      emphasis: isFw41,
      onClick: isFw41 ? () => go(HERO_ROUTE) : undefined,
    };
  });
  // Focus copy only — never fall back to the long 12-week title.
  const title =
    lm.focusTitle ?? "Only firmware 4.1 is getting more fault calls";
  const sub =
    lm.focusSub ??
    "Fault calls per 1,000 panels a week · the other 45 releases stay in the normal range";
  return (
    <Panel title={L(title)} sub={L(sub)}>
      <LineMonitor
        weeks={lm.weeks}
        series={series}
        markers={lm.markers}
        tick={(w) => fill(meta.ui.drill.week, { n: w })}
        ariaLabel={L(title)}
        height={260}
        variant="focus"
        focusCopy={{
          legendFocus: lm.focusLegendFocus ?? "Firmware 4.1",
          legendBand: lm.focusLegendBand ?? "Other releases (normal range)",
          bandLabel: lm.focusBandLabel ?? "Normal range",
          releaseLabel: lm.focusReleaseLabel ?? "{{fw:EST4@4.1}} released",
          endLabel: lm.focusEndLabel ?? "6.5 — about 3× normal",
          chips: lm.focusChips ?? [
            { text: "3.1× normal", tone: "accent" },
            { text: "Returns (RMA) rate: still normal", tone: "muted" },
            { text: "1,240 panels on 4.1", tone: "muted" },
          ],
        }}
      />
    </Panel>
  );
}

/**
 * Q1 drill-down /installed-base (04 §3): the contradiction before the detail — "2 signals
 * above threshold" beside an in-control RMA rate — with the Signal Wall (hero first) on the
 * right. Grid per 04 §3.1.
 */
export function InstalledBaseView() {
  const L = useLabel();
  const [pulse, setPulse] = useState<SeverityClass | null>(null);
  const timer = useRef<number | null>(null);
  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );
  const pulseWall = (cls: SeverityClass) => {
    if (timer.current) window.clearTimeout(timer.current);
    setPulse(cls);
    timer.current = window.setTimeout(() => setPulse(null), PULSE_MS);
  };
  const t = IB.interactionsTable;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <BackToOverviewHeader title={IB.title} subtitle={IB.subtitle} />
      <KpiRow tiles={IB.kpis} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
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
          <Panel title={L(P["P-A"].title)}>
            <BigKpiTile
              label={L(P["P-A"].sub ?? "")}
              value={int(t.total)}
              delta={t.delta}
            />
            <SegmentTable
              columns={P["P-A"].columns ?? []}
              rows={t.rows}
              caption={L(P["P-A"].title)}
            />
            <p
              style={{
                margin: 0,
                fontSize: 13,
                lineHeight: 1.5,
                color: K.textMut,
              }}
            >
              {L(t.footnote)}
            </p>
          </Panel>
          <Watchlist
            title={P["P-K"].title}
            rows={IB.stable.rows}
            footer={IB.stable.footer}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            minWidth: 0,
          }}
        >
          <Panel title={L(P["P-B"].title)} sub={L(P["P-B"].sub ?? "")}>
            <StackedRatioBar
              rows={IB.clustersBySeverity}
              onSelect={pulseWall}
            />
          </Panel>
          <CohortMonitor />
          <ContactsRmaOverlay />
        </div>

        <div style={{ minWidth: 0, alignSelf: "stretch" }}>
          <SignalWall wall={IB.signalWall} pulseClass={pulse} />
        </div>
      </div>

      <EmergingPhrasingTable />
      <Panel title={L(IB.symptomStack.title)}>
        <StackedBarWithDetailPanel
          data={IB.symptomStack}
          unit={P["P-J"].unit}
          ariaLabel={L(IB.symptomStack.title)}
          interactive
        />
      </Panel>
    </div>
  );
}
