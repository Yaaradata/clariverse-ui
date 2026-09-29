"use client";

import { installedBase, LEGACY_ROUTES, meta } from "@kgs/lib/data";
import type { SeverityClass } from "@kgs/types";
import { useEffect, useRef, useState } from "react";
import { BackToOverviewHeader } from "../drill/BackToOverviewHeader";
import { BigKpiTile, KpiRow } from "../drill/KpiTile";
import { LineMonitor, type MonitorSeries } from "../drill/LineMonitor";
import { Panel } from "../drill/Panel";
import { SegmentTable } from "../drill/SegmentTable";
import { SignalWall } from "../drill/SignalWall";
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

/** P-C: each release against its own baseline; the fw 4.1 line (and legend item) opens the hero. */
function CohortMonitor() {
  const L = useLabel();
  const { go } = useKgsNav();
  const { lineageMonitor: lm } = IB;
  const series: MonitorSeries[] = lm.series.map((s, i) => ({
    key: `s${i}`,
    label: L(s.label),
    colour: s.colour,
    values: s.values,
    dashed: s.dashed,
    secondary: s.dashed,
    emphasis: s.label.includes("@4.1}}"),
    onClick: s.label.includes("@4.1}}") ? () => go(HERO_ROUTE) : undefined,
  }));
  return (
    <Panel title={L(P["P-C"].title)} sub={L(P["P-C"].sub ?? "")}>
      <LineMonitor
        weeks={lm.weeks}
        series={series}
        markers={lm.markers}
        tick={(w) => fill(meta.ui.drill.week, { n: w })}
        secondaryDomain={[0, 0.7]}
        ariaLabel={L(P["P-C"].title)}
        height={260}
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
        </div>

        <div style={{ minWidth: 0, alignSelf: "stretch" }}>
          <SignalWall wall={IB.signalWall} pulseClass={pulse} />
        </div>
      </div>

      <div id={P["P-D"].anchor} />
      <div id={P["P-H"].anchor} />
    </div>
  );
}
