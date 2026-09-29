"use client";

import { channel } from "@kgs/lib/data";
import type { TableRow } from "@kgs/types";
import { useRef, useState } from "react";
import { BackToOverviewHeader } from "../drill/BackToOverviewHeader";
import { DiagnosisBox } from "../drill/DiagnosisBox";
import { EnhancedPanel } from "../drill/EnhancedPanel";
import { KpiRow } from "../drill/KpiTile";
import { Panel } from "../drill/Panel";
import { PartnerTimeline } from "../drill/PartnerTimeline";
import { SegmentTable } from "../drill/SegmentTable";
import { SignalWall } from "../drill/SignalWall";
import { StackedBarWithDetailPanel } from "../drill/StackedBarWithDetailPanel";
import { Watchlist } from "../drill/Watchlist";
import { useKgsNav } from "../nav";
import { IllustrativeChip } from "../shared/IllustrativeChip";
import { prefersReducedMotion } from "../shared/motion";
import { K } from "../shared/tokens";
import { useLabel } from "../shell/DemoProvider";

const C = channel;
const P = C.panelCopy;
const SELF = `/channel#${P["C-B"].anchor}`;

type PromiseBasis = "revised" | "original";
const PROMISES: readonly PromiseBasis[] = ["revised", "original"];

/** C-D header: "vs revised promise / vs original promise" toggle flips "OTD 94% | OTD 71%". */
function PromiseToggle({
  value,
  onChange,
}: {
  value: PromiseBasis;
  onChange: (p: PromiseBasis) => void;
}) {
  const L = useLabel();
  const labels = L(P["C-D"].sub ?? "").split(" / ");
  return (
    <fieldset
      style={{
        margin: 0,
        padding: 3,
        display: "inline-flex",
        gap: 3,
        alignSelf: "flex-start",
        borderRadius: K.radius.chip,
        background: K.surface,
        border: `1px solid ${K.chipBorder}`,
      }}
    >
      <legend
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
        }}
      >
        {L(P["C-D"].title)}
      </legend>
      {PROMISES.map((p, i) => {
        const on = value === p;
        return (
          <button
            key={p}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(p)}
            className="kgs-focus"
            style={{
              padding: "5px 10px",
              borderRadius: 6,
              border: "none",
              background: on ? K.brandTint : "transparent",
              color: on ? K.violet300 : K.textSec,
              fontSize: 13,
              fontWeight: on ? 700 : 500,
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            {labels[i]}
          </button>
        );
      })}
    </fieldset>
  );
}

function BackorderPanel() {
  const L = useLabel();
  const [promise, setPromise] = useState<PromiseBasis>("revised");
  const otd = L(P["C-D"].right ?? "").split(" | ");
  return (
    <Panel
      id={P["C-D"].anchor}
      title={L(P["C-D"].title)}
      sub={
        <span style={{ display: "inline-flex", alignItems: "center" }}>
          {L(P["C-D"].unit ?? "")}
          <IllustrativeChip />
        </span>
      }
      right={
        <span
          style={{
            fontSize: 20,
            fontWeight: 800,
            fontFamily: K.mono,
            color: K.text,
          }}
        >
          {otd[PROMISES.indexOf(promise)]}
        </span>
      }
    >
      <StackedBarWithDetailPanel
        data={C.backorder}
        ariaLabel={L(P["C-D"].title)}
        controls={<PromiseToggle value={promise} onChange={setPromise} />}
        detailFooter={C.backorder.leadLine}
      />
    </Panel>
  );
}

/**
 * Q2 drill-down /channel (04 §5.1): one Strategic Partner drifting against its own baseline
 * while 419 of 420 hold — the league first, then the partner's timeline, certification and
 * switching beside the Signal Wall, then the backorder consequence.
 */
export function ChannelView() {
  const L = useLabel();
  const { go } = useKgsNav();
  const timelineRef = useRef<HTMLDivElement>(null);
  const onLeague = (row: TableRow) => {
    if (!row.linkTo) return;
    if (row.linkTo !== SELF) return go(row.linkTo);
    timelineRef.current?.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <BackToOverviewHeader title={C.title} subtitle={C.subtitle} />
      <KpiRow tiles={C.kpis} />

      <Panel id={P["C-B"].anchor} title={L(P["C-B"].title)}>
        <SegmentTable
          columns={P["C-B"].columns ?? []}
          rows={C.league}
          chipColumn={8}
          figures={[3, 4, 5, 6, 7]}
          onRow={onLeague}
          selectedId={P["C-B"].anchor}
          caption={L(P["C-B"].title)}
        />
      </Panel>

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
          <div ref={timelineRef} style={{ scrollMarginTop: 72 }}>
            <PartnerTimeline />
          </div>
          <Panel title={L(P["C-E"].title)}>
            <SegmentTable
              columns={P["C-E"].columns ?? []}
              rows={C.certification.rows}
              figures={[2, 3, 4]}
              caption={L(P["C-E"].title)}
            />
            <p
              style={{
                margin: 0,
                fontSize: 14,
                lineHeight: 1.5,
                color: K.textSec,
              }}
            >
              {L(C.certification.caption)}
            </p>
          </Panel>
          <Panel title={L(P["C-F"].title)}>
            <SegmentTable
              columns={P["C-F"].columns ?? []}
              rows={C.switching}
              chipColumn={4}
              figures={[2]}
              caption={L(P["C-F"].title)}
            />
          </Panel>
          <Watchlist title={P["C-H"].title} rows={C.stable.rows} />
        </div>

        <div style={{ minWidth: 0, alignSelf: "stretch" }}>
          <SignalWall wall={C.signalWall} />
        </div>
      </div>

      <BackorderPanel />
      <EnhancedPanel data={C.enhanced}>
        <DiagnosisBox diagnosis={C.diagnosis} />
      </EnhancedPanel>
    </div>
  );
}
