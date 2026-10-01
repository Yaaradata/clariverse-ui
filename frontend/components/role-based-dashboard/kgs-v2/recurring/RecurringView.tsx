"use client";

import recurring from "@kgs2/data/recurring.json";
import { useDemo2, useLabel2, useV2K } from "@kgs2/lib/demoState";
import { recurringForPeriod } from "@kgs2/lib/drillFromPeriod";
import { seriesForRange } from "@kgs2/lib/periodData";
import { type CSSProperties, useMemo, useState } from "react";
import { withAlpha } from "@/components/role-based-dashboard/kgs/shared/tokens";
import { DrillHeader2 } from "../shared/DrillHeader2";
import { KpiRow2 } from "../shared/KpiRow2";
import { Panel } from "../shared/Panel2";
import { ChannelOriginChart } from "./ChannelOriginChart";
import { ThemeTimelineChart } from "./ThemeTimelineChart";

const VISIBLE_ROWS = 6;
/** Themes with a deep dive: every "Back after fix" theme. */
const DEEP_DIVE_IDS = new Set([
  ...recurring.backAfterFixWall.map((c) => c.id),
  ...recurring.backAfterFixEarlier.map((c) => c.id),
]);

type ThemeRow = {
  id: string;
  name: string;
  firstSeen: string;
  contacts13w: number;
  channels: string[];
  partners: number;
  status: string;
  lastFixLabel: string;
};

function statusLabel(status: string, id: string): string {
  if (status === "back-after-fix")
    return id === "rc-01" ? "Back after fix (3rd time)" : "Back after fix";
  if (status === "no-fix") {
    if (id === "rc-09") return "No fix on record (links to Install)";
    return "No fix on record";
  }
  return "Holding";
}

function fmtFirstSeen(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** "Back after fix" themes first, then most contacts in the active period. */
function sortThemes(themes: ThemeRow[]): ThemeRow[] {
  const rank = (t: ThemeRow) => (t.status === "back-after-fix" ? 0 : 1);
  return [...themes].sort(
    (a, b) => rank(a) - rank(b) || b.contacts13w - a.contacts13w,
  );
}

/**
 * Recurring themes — SPEC §6a panels 3.0–3.6.
 */
export function RecurringView() {
  const K = useV2K();
  const th: CSSProperties = {
    textAlign: "left",
    padding: "8px 10px",
    fontSize: 11,
    fontWeight: 700,
    color: K.textMut,
    borderBottom: `1px solid ${K.borderLight}`,
    whiteSpace: "nowrap",
  };
  const td: CSSProperties = {
    padding: "8px 10px",
    fontSize: 13,
    color: K.body,
    borderBottom: `1px solid ${K.borderLight}`,
  };
  const L = useLabel2();
  const { setView, openRecurringTheme, state } = useDemo2();
  const [showAll, setShowAll] = useState(false);

  const drill = useMemo(
    () => recurringForPeriod(state.dateRange),
    [state.dateRange],
  );
  const themes = useMemo(
    () => sortThemes(drill.themes as ThemeRow[]),
    [drill.themes],
  );
  const visible = showAll ? themes : themes.slice(0, VISIBLE_ROWS);

  const channelRows = useMemo(() => {
    // Short names (as on the timeline) keep the axis labels readable.
    const byId = Object.fromEntries([
      ...recurring.themes.map((t) => [t.id, t.name] as const),
      ...recurring.timeline.series.map((s) => [s.id, s.name] as const),
    ]);
    return drill.channelSplit.map((row) => ({
      ...row,
      name: byId[row.id] ?? row.id,
    }));
  }, [drill.channelSplit]);

  const timeline = useMemo(() => {
    const weeks = recurring.timeline.weeks;
    const n = seriesForRange(
      weeks.map((_, i) => i),
      state.dateRange,
    ).length;
    // Markers are indexed on the 13-week series; shift them into the window.
    const offset = weeks.length - n;
    const shift = (markers: number[]) =>
      markers.map((m) => m - offset).filter((m) => m >= 0);
    return {
      weeks: weeks.slice(-n),
      series: drill.timelineSeries.map((s) => ({
        ...s,
        name: `${s.name} · ${s.windowContacts}`,
        values: seriesForRange(s.values, state.dateRange),
        fixMarkers: shift(s.fixMarkers),
        returnMarkers: shift(s.returnMarkers),
      })),
    };
  }, [state.dateRange, drill.timelineSeries]);

  const openTheme = (id: string) => {
    if (DEEP_DIVE_IDS.has(id)) openRecurringTheme(id);
    else if (id === "rc-09") setView("install");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <DrillHeader2
        title={recurring.title}
        subtitle="Issues we fixed once that returned, and where they come from."
      />

      {/* 3.0 KPI tiles — no status chips */}
      <KpiRow2
        tiles={drill.kpis}
      />

      {/* 3.1 Theme register — one table, Back after fix first */}
      <Panel
        title="Theme register"
        sub={`${themes.length} themes · ${drill.timeLabel} · Back after fix first · click a row to open`}
      >
        <style>{`.kgs2-row:hover td { background: ${withAlpha(K.text, 0.04)}; }`}</style>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 13,
            }}
          >
            <thead>
              <tr>
                {[
                  "Theme",
                  "First seen",
                  "Contacts",
                  "Last fix",
                  "Status",
                  "Channels",
                  "Partners affected",
                ].map((h) => (
                  <th key={h} style={th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((t) => {
                const clickable = DEEP_DIVE_IDS.has(t.id) || t.id === "rc-09";
                const back = t.status === "back-after-fix";
                return (
                  <tr
                    key={t.id}
                    onClick={() => clickable && openTheme(t.id)}
                    onKeyDown={(e) => {
                      if (!clickable) return;
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openTheme(t.id);
                      }
                    }}
                    tabIndex={clickable ? 0 : undefined}
                    className={clickable ? "kgs2-row" : undefined}
                    style={{ cursor: clickable ? "pointer" : "default" }}
                  >
                    <td
                      style={{
                        ...td,
                        color: K.text,
                        fontWeight: 700,
                        maxWidth: 280,
                        boxShadow: back ? `inset 3px 0 0 ${K.orange}` : "none",
                        paddingLeft: 14,
                      }}
                    >
                      {L(t.name)}
                    </td>
                    <td
                      style={{
                        ...td,
                        fontFamily: K.mono,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {fmtFirstSeen(t.firstSeen)}
                    </td>
                    <td
                      style={{
                        ...td,
                        fontFamily: K.mono,
                        fontWeight: back ? 800 : 400,
                        color: back ? K.text : K.body,
                      }}
                    >
                      {t.contacts13w}
                    </td>
                    <td style={{ ...td, maxWidth: 260 }}>
                      {L(t.lastFixLabel)}
                    </td>
                    <td
                      style={{
                        ...td,
                        whiteSpace: "nowrap",
                        fontWeight: back ? 700 : 500,
                        color: back
                          ? K.orange
                          : t.status === "holding"
                            ? K.green
                            : K.textMut,
                      }}
                    >
                      {back ? "▲ " : ""}
                      {statusLabel(t.status, t.id)}
                    </td>
                    <td style={td}>
                      {t.channels.slice(0, 2).join(" · ")}
                      {t.channels.length > 2
                        ? ` +${t.channels.length - 2}`
                        : ""}
                    </td>
                    <td style={{ ...td, fontFamily: K.mono }}>{t.partners}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {themes.length > VISIBLE_ROWS ? (
          <button
            type="button"
            className="kgs2-focus"
            onClick={() => setShowAll((v) => !v)}
            style={{
              marginTop: 10,
              alignSelf: "flex-start",
              background: "transparent",
              border: "none",
              color: K.violet300,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              padding: 0,
            }}
          >
            {showAll ? "Show fewer" : `Show all ${themes.length}`}
          </button>
        ) : null}
      </Panel>

      {/* 3.2 Fixed before, back again wall */}
      <Panel
        title="Fixed before, back again"
        sub={`Returning themes after a recorded fix · ${drill.timeLabel}`}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${drill.backAfterFixWall.length}, minmax(0, 1fr))`,
            gap: 12,
          }}
        >
          {drill.backAfterFixWall.map((card) => {
            const openable = DEEP_DIVE_IDS.has(card.id);
            return (
              <button
                key={card.id}
                type="button"
                className="kgs2-focus"
                onClick={() => openable && openRecurringTheme(card.id)}
                style={{
                  textAlign: "left",
                  padding: "14px 14px 16px",
                  borderRadius: 12,
                  border: `1px solid ${withAlpha(K.orange, 0.4)}`,
                  background: withAlpha(K.orange, 0.08),
                  color: K.textSec,
                  cursor: openable ? "pointer" : "default",
                  fontFamily: "inherit",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  opacity: openable ? 1 : 0.85,
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: K.text,
                    lineHeight: 1.3,
                  }}
                >
                  {L(card.title)}
                </div>
                <div style={{ fontSize: 12, color: K.textMut }}>
                  Fix {card.fixDate} · Returned {card.returnDate}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: K.mono,
                    color: K.orange,
                  }}
                >
                  {card.weeklyDelta}
                </div>
                <span
                  style={{
                    marginTop: "auto",
                    fontSize: 12,
                    fontWeight: 700,
                    color: openable ? K.violet300 : K.textMut,
                  }}
                >
                  {card.cta}
                </span>
              </button>
            );
          })}
        </div>
      </Panel>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: 12,
          alignItems: "stretch",
        }}
      >
        {/* 3.3 Theme timeline */}
        <Panel
          title="Theme timeline"
          sub={`Themes back after a fix · ${drill.timeLabel}`}
        >
          <ThemeTimelineChart
            weeks={timeline.weeks}
            series={timeline.series}
            height={240}
          />
        </Panel>

        {/* 3.4 Where it comes from */}
        <Panel
          title="Where it comes from"
          sub={`${drill.timeLabel} · contacts by channel · same theme, several doors`}
        >
          <ChannelOriginChart rows={channelRows} height={240} />
        </Panel>
      </div>
    </div>
  );
}

