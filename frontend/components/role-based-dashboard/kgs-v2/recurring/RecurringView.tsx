"use client";

import recurring from "@kgs2/data/recurring.json";
import { useLabel2 } from "@kgs2/lib/demoState";
import { Sparkles } from "lucide-react";
import { type CSSProperties, useMemo, useState } from "react";
import { Panel } from "@/components/role-based-dashboard/kgs/drill/Panel";
import {
  K,
  withAlpha,
} from "@/components/role-based-dashboard/kgs/shared/tokens";
import { DrillHeader2 } from "../shared/DrillHeader2";
import {
  BiggestOpenThemesPanel,
  FixesDidntHoldPanel,
  FixLoopFunnel,
  type RecurringThemeRow,
  ThemeRegisterDrawer,
  TopRecurringThemes,
  WhyFixesDontHold,
} from "./RecurringDrillSections";
import { ThemeTimelineChart } from "./ThemeTimelineChart";

/**
 * Recurring themes — SeparationView layout (SPEC §6a / R4).
 */
export function RecurringView() {
  const L = useLabel2();
  const [registerOpen, setRegisterOpen] = useState(false);

  const themes = recurring.themes as RecurringThemeRow[];

  const beforeNowById = useMemo(() => {
    const map: Record<string, { before: number; now: number }> = {};
    for (const t of themes) {
      if (t.status !== "back-after-fix") continue;
      const fix = t.fixes[0];
      const series = recurring.timeline.series.find((s) => s.id === t.id);
      const now = series?.values[series.values.length - 1] ?? fix?.before ?? 0;
      const before = fix?.after ?? 0;
      map[t.id] = { before, now };
    }
    return map;
  }, [themes]);

  const watchlist = recurring.backAfterFixWall.map((card) => {
    const bn = beforeNowById[card.id] ?? { before: 0, now: 0 };
    return {
      id: card.id,
      title: card.title,
      fixDate: card.fixDate,
      returnDate: card.returnDate,
      before: bn.before,
      now: bn.now,
    };
  });

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
        title={recurring.title}
        subtitle="Issues we fixed once that returned, and where they come from."
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: 12,
          alignItems: "stretch",
        }}
      >
        <FixesDidntHoldPanel
          kpis={recurring.panelKpis.fixesDidntHold}
          themes={themes}
          beforeNowById={beforeNowById}
          onShowAll={() => setRegisterOpen(true)}
        />
        <BiggestOpenThemesPanel
          kpis={recurring.panelKpis.biggestOpen}
          themes={themes}
          onShowAll={() => setRegisterOpen(true)}
        />
      </div>

      <WhyFixesDontHold
        title={recurring.whyFixesDontHold.title}
        sub={recurring.whyFixesDontHold.sub}
        causes={recurring.whyFixesDontHold.causes}
        watchlist={watchlist}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: 12,
          alignItems: "stretch",
        }}
      >
        <TopRecurringThemes rows={recurring.topThemes} />
        <FixLoopFunnel
          title={recurring.funnel.title}
          sub={recurring.funnel.sub}
          stages={recurring.funnel.stages}
        />
      </div>

      <Panel title="Theme timeline" sub="Top 3 themes · ◆ fix · ▲ return">
        <ThemeTimelineChart
          weeks={recurring.timeline.weeks}
          series={recurring.timeline.series}
          height={220}
        />
      </Panel>

      <section
        aria-label="LiSN evidence summary"
        style={{
          background: withAlpha(K.brand, 0.08),
          border: `1px solid ${withAlpha(K.violet400, 0.35)}`,
          borderRadius: K.radius.card,
          padding: 18,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 800,
            color: K.text,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Sparkles size={18} color={K.violet400} aria-hidden />
          LiSN evidence summary
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 16,
          }}
        >
          <p style={summaryP}>
            <strong style={{ color: K.text }}>Main signal:</strong>{" "}
            {L(recurring.evidenceSummary.mainSignal)}
          </p>
          <p style={summaryP}>
            <strong style={{ color: K.text }}>What changed:</strong>{" "}
            {L(recurring.evidenceSummary.whatChanged)}
          </p>
          <p style={summaryP}>
            <strong style={{ color: K.text }}>Decide first:</strong>{" "}
            {L(recurring.evidenceSummary.decideFirst)}
          </p>
        </div>
      </section>

      <ThemeRegisterDrawer
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        themes={themes}
      />
    </div>
  );
}

const summaryP: CSSProperties = {
  margin: 0,
  fontSize: 14,
  lineHeight: 1.55,
  color: K.body,
};
