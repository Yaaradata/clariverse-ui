"use client";

import recurring from "@kgs2/data/recurring.json";
import { useDemo2, useLabel2 } from "@kgs2/lib/demoState";
import { Sparkles } from "lucide-react";
import type { CSSProperties } from "react";
import { Panel } from "@/components/role-based-dashboard/kgs/drill/Panel";
import { CountUp } from "@/components/role-based-dashboard/kgs/shared/CountUp";
import {
  K,
  withAlpha,
} from "@/components/role-based-dashboard/kgs/shared/tokens";
import { ThemeChannelBar } from "./ThemeChannelBar";
import { ThemeTimelineChart } from "./ThemeTimelineChart";

const STATUS_ORDER: Record<string, number> = {
  "back-after-fix": 0,
  "no-fix": 1,
  holding: 2,
};

function statusPill(
  status: string,
  id: string,
): { label: string; color: string } {
  if (status === "back-after-fix") {
    return {
      label: id === "rc-01" ? "Back after fix (3rd time)" : "Back after fix",
      color: K.red,
    };
  }
  if (status === "no-fix") {
    return { label: "No fix on record", color: K.amber };
  }
  return { label: "Holding", color: K.green };
}

function formatKpi(value: number, unit?: string): string {
  if (unit === "%") return `${value}%`;
  if (unit?.startsWith("%")) return `${value}%`;
  return value.toLocaleString("en-GB");
}

function fmtDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Recurring themes — What keeps coming back? (SPEC §6a).
 */
export function RecurringView() {
  const L = useLabel2();
  const { setView } = useDemo2();

  const themes = [...recurring.themes].sort((a, b) => {
    const oa = STATUS_ORDER[a.status] ?? 9;
    const ob = STATUS_ORDER[b.status] ?? 9;
    if (oa !== ob) return oa - ob;
    return b.contacts13w - a.contacts13w;
  });

  const nameById = Object.fromEntries(
    recurring.timeline.series.map((s) => [s.id, s.name]),
  );

  const beforeNowById = Object.fromEntries(
    recurring.themes
      .filter((t) => t.status === "back-after-fix")
      .map((t) => {
        const fix = t.fixes[0];
        const series = recurring.timeline.series.find((s) => s.id === t.id);
        const now =
          series?.values[series.values.length - 1] ?? fix?.before ?? 0;
        const before = fix?.after ?? 0;
        return [t.id, { before, now }];
      }),
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        padding: "16px 24px 24px",
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: 28,
          fontWeight: 800,
          color: K.text,
          lineHeight: 1.2,
        }}
      >
        {L(recurring.title)}
      </h1>

      {/* 1. KPIs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${recurring.kpis.length}, minmax(0, 1fr))`,
          gap: 12,
        }}
      >
        {recurring.kpis.map((tile) => (
          <div
            key={tile.key}
            style={{
              background: "#131313",
              border: `1px solid ${K.border}`,
              borderRadius: K.radius.tile,
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 6,
              minWidth: 0,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.06em",
                color: K.textMut,
                lineHeight: 1.35,
              }}
            >
              {L(tile.label)}
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: K.text,
                fontFamily: K.mono,
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1.1,
              }}
            >
              <CountUp text={formatKpi(tile.value, tile.unit)} />
              {tile.unit &&
              tile.unit !== "%" &&
              !tile.unit.startsWith("% of") ? (
                <span style={{ fontSize: 13, fontWeight: 600, marginLeft: 4 }}>
                  {tile.unit}
                </span>
              ) : null}
            </div>
            {tile.unit?.startsWith("% of") ? (
              <div style={{ fontSize: 12, color: K.textMut }}>{tile.unit}</div>
            ) : null}
          </div>
        ))}
      </div>

      {/* 2. Theme register */}
      <Panel
        title="Theme register"
        sub="One source of truth · Back after fix first"
      >
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
                  "Contacts (13 wks)",
                  "Last fix",
                  "Status",
                  "Channels",
                  "Partners",
                ].map((h) => (
                  <th key={h} style={th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {themes.map((t) => {
                const pill = statusPill(t.status, t.id);
                const linkInstall = t.id === "rc-09";
                return (
                  <tr key={t.id}>
                    <td style={td}>
                      {linkInstall ? (
                        <button
                          type="button"
                          className="kgs2-focus"
                          onClick={() => setView("install")}
                          style={{
                            background: "none",
                            border: "none",
                            color: K.violet300,
                            fontFamily: "inherit",
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: "pointer",
                            padding: 0,
                            textAlign: "left",
                          }}
                        >
                          {t.name} → Install
                        </button>
                      ) : (
                        t.name
                      )}
                    </td>
                    <td
                      style={{
                        ...td,
                        fontFamily: K.mono,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {fmtDate(t.firstSeen)}
                    </td>
                    <td style={{ ...td, fontFamily: K.mono }}>
                      {t.contacts13w}
                    </td>
                    <td style={td}>{t.lastFixLabel}</td>
                    <td style={td}>
                      <span
                        style={{
                          display: "inline-block",
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "3px 8px",
                          borderRadius: K.radius.pill,
                          color: pill.color,
                          background: withAlpha(pill.color, 0.15),
                          border: `1px solid ${withAlpha(pill.color, 0.4)}`,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {pill.label}
                      </span>
                    </td>
                    <td style={{ ...td, fontSize: 12 }}>
                      {t.channels.join(", ")}
                    </td>
                    <td style={{ ...td, fontFamily: K.mono }}>{t.partners}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* 3. Fixed before, back again wall */}
      <Panel
        title="Fixed before, back again"
        sub="Returning themes after a recorded fix"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 12,
          }}
        >
          {recurring.backAfterFixWall.map((card) => {
            const bn = beforeNowById[card.id];
            const openable =
              card.id === "rc-01" || card.id === "rc-03" || card.id === "rc-05";
            return (
              <button
                key={card.id}
                type="button"
                className={openable ? "kgs2-focus" : undefined}
                disabled={!openable}
                onClick={() => {
                  if (card.id === "rc-01") setView("recurringTheme");
                  else if (openable) setView("recurring");
                }}
                style={{
                  textAlign: "left",
                  background:
                    card.id === "rc-01" ? withAlpha(K.orange, 0.08) : K.surface,
                  border: `1px solid ${
                    card.id === "rc-01"
                      ? withAlpha(K.orange, 0.45)
                      : K.borderLight
                  }`,
                  borderRadius: 12,
                  padding: "14px 16px",
                  cursor: openable ? "pointer" : "default",
                  color: K.text,
                  fontFamily: "inherit",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  minHeight: 140,
                  opacity: openable ? 1 : 0.92,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: K.mono,
                    color: K.violet300,
                  }}
                >
                  {card.id.toUpperCase()}
                </span>
                <div
                  style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.35 }}
                >
                  {card.title}
                </div>
                <div
                  style={{ fontSize: 12, color: K.textMut, lineHeight: 1.45 }}
                >
                  Fix {fmtDate(card.fixDate)} · Return{" "}
                  {fmtDate(card.returnDate)}
                </div>
                <div
                  style={{ fontSize: 13, fontFamily: K.mono, color: K.body }}
                >
                  {bn ? (
                    <>
                      Weekly contacts {bn.before} → {bn.now}
                    </>
                  ) : (
                    card.weeklyDelta
                  )}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: openable ? K.violet300 : K.textMut,
                    marginTop: "auto",
                  }}
                >
                  {card.cta}
                </div>
              </button>
            );
          })}
        </div>
      </Panel>

      {/* 4. Theme timeline */}
      <Panel title="Theme timeline" sub="Top 3 themes · ◆ fix · ▲ return">
        <ThemeTimelineChart
          weeks={recurring.timeline.weeks}
          series={recurring.timeline.series}
        />
      </Panel>

      {/* 5. Where it comes from */}
      <Panel
        title="The same issue arrives through several channels"
        sub="Where it comes from · contacts by channel per theme"
      >
        <ThemeChannelBar rows={recurring.channelSplit} nameById={nameById} />
      </Panel>

      {/* 6. Evidence summary */}
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
    </div>
  );
}

const th: CSSProperties = {
  textAlign: "left",
  padding: "8px 10px",
  color: K.textMut,
  fontWeight: 600,
  borderBottom: `1px solid ${K.borderLight}`,
  whiteSpace: "nowrap",
};

const td: CSSProperties = {
  padding: "8px 10px",
  borderBottom: `1px solid ${K.borderLight}`,
  color: K.body,
  verticalAlign: "top",
};

const summaryP: CSSProperties = {
  margin: 0,
  fontSize: 14,
  lineHeight: 1.55,
  color: K.body,
};
