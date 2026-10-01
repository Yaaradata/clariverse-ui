"use client";

import install from "@kgs2/data/install.json";
import { useDemo2, useLabel2, useV2K } from "@kgs2/lib/demoState";
import { installForPeriod } from "@kgs2/lib/drillFromPeriod";
import { type CSSProperties, useMemo } from "react";
import { withAlpha } from "@/components/role-based-dashboard/kgs/shared/tokens";
import { DrillHeader2 } from "../shared/DrillHeader2";
import { Panel } from "../shared/Panel2";
import {
  SignalWall2,
  type SignalWall2Data,
  type WallLevel2,
  wallFooter,
} from "../shared/SignalWall2";
import type { V2Tokens } from "../shared/themeTokens";
import { FrictionPraiseChart } from "./InstallDrillSections";

function buildInstallWall(
  signalWall: typeof install.signalWall,
  periodLabel: string,
): SignalWall2Data {
  return {
    title: "Signal Wall",
    sub: `Installer experience signals · ${periodLabel}`,
    cards: signalWall.map((card) => {
      const level = (card.level ??
        (card.severity === "improving" ? "improving" : "alert")) as WallLevel2;
      return {
        id: card.id,
        level,
        tag: level === "improving" ? "Improving" : card.severity,
        title: card.title,
        body: card.body,
        metric: card.metric,
        trend: card.trend,
        detail: {
          cause: card.body,
          areas: ["Install experience", card.type],
          actions:
            card.id === "IN-01"
              ? [
                  "Share a one-page set-up guide with partners",
                  "Send a feedback note to the US product team",
                ]
              : level === "improving"
                ? ["Route praise to Marketing"]
                : [],
          timeline: card.trend,
          owner: card.owner,
          priority: level === "improving" ? "Watching" : "Needs action",
        },
      };
    }),
    footer: wallFooter(
      signalWall.map((card) => ({
        level: (card.level ??
          (card.severity === "improving" ? "improving" : "alert")) as WallLevel2,
      })),
    ),
  };
}

function heatColour(K: V2Tokens, n: number, max: number): string {
  if (n <= 0) return K.inset;
  const t = Math.min(1, n / Math.max(max, 1));
  return withAlpha(K.orange, 0.12 + t * 0.55);
}

/**
 * Install experience — SPEC §7.
 * Experience language only — never fault or defect.
 */
export function InstallView() {
  const L = useLabel2();
  const K = useV2K();
  const { state } = useDemo2();
  const drill = useMemo(
    () => installForPeriod(state.dateRange),
    [state.dateRange],
  );
  const heat = install.familyRegionHeat;
  const maxHeat = Math.max(0, ...drill.heatValues.flat());
  const praiseTopics = drill.praiseTopics;

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
  const statLabel: CSSProperties = {
    fontSize: 11,
    color: K.textMut,
    marginBottom: 4,
  };
  const statValue: CSSProperties = {
    fontSize: 18,
    fontWeight: 800,
    color: K.text,
    fontFamily: K.mono,
    fontVariantNumeric: "tabular-nums",
    lineHeight: 1.2,
  };
  const statTile: CSSProperties = {
    background: K.inset,
    border: `1px solid ${K.borderLight}`,
    borderRadius: 10,
    padding: "10px 12px",
    minWidth: 0,
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <DrillHeader2 title={install.title} subtitle={install.subtitle} />

      {/* Row 1 — friction/praise chart | Signal Wall */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.25fr) minmax(300px, 1fr)",
          gap: 12,
          alignItems: "stretch",
        }}
      >
        <FrictionPraiseChart
          steps={drill.steps}
          frictionTotal={drill.frictionTotal}
          praiseTotal={drill.praiseTotal}
          periodLabel={drill.timeLabel}
        />

        <div style={{ minWidth: 0, minHeight: 0, display: "flex" }}>
          <div style={{ flex: 1, minHeight: 0, width: "100%" }}>
            <SignalWall2 wall={buildInstallWall(drill.signalWall, drill.timeLabel)} compact fill />
          </div>
        </div>
      </div>

      {/* Row 2 — family × region heat | time + praise */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.25fr) minmax(0, 1fr)",
          gap: 12,
          alignItems: "stretch",
        }}
      >
        <Panel
          title={heat.title}
          sub={`${drill.timeLabel} · friction mentions · experience only`}
        >
          {/* Table fills the panel so the heat rows grow to match the right column */}
          <div style={{ overflowX: "auto", flex: 1, minHeight: 0 }}>
            <table
              style={{
                width: "100%",
                height: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
              <thead>
                <tr>
                  <th style={th}>Family</th>
                  {heat.regions.map((r) => (
                    <th key={r.id} style={{ ...th, textAlign: "center" }}>
                      {L(r.label)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heat.families.map((fam, ri) => (
                  <tr key={fam.id}>
                    <td style={{ ...td, color: K.text, fontWeight: 700 }}>
                      {L(fam.label)}
                    </td>
                    {drill.heatValues[ri].map((n, ci) => (
                      <td
                        key={`${fam.id}-${heat.regions[ci].id}`}
                        style={{
                          ...td,
                          textAlign: "center",
                          fontFamily: K.mono,
                          fontWeight: n > 0 ? 700 : 400,
                          background: heatColour(K, n, maxHeat),
                          color: n > 0 ? K.text : K.textMut,
                        }}
                      >
                        {n}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            minWidth: 0,
          }}
        >
          <Panel
            title="Time installers mention"
            sub={install.timeInstallersMention.note}
          >
            {drill.timeRows.map((row) => (
              <div
                key={row.step}
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                <div
                  style={{ fontSize: 14, color: K.textSec, lineHeight: 1.45 }}
                >
                  <strong style={{ color: K.text }}>{L(row.step)}</strong> · “
                  {L(row.phrase)}”
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.3fr 1fr 1fr",
                    gap: 10,
                  }}
                >
                  <div style={statTile}>
                    <div style={statLabel}>Stated extra time</div>
                    <div style={{ ...statValue, color: K.amber }}>
                      {row.statedExtraTime.split(" (")[0]}
                    </div>
                    {row.statedExtraTime.includes(" (") ? (
                      <div style={{ ...statLabel, margin: "4px 0 0" }}>
                        {row.statedExtraTime.split(" (")[1].replace(")", "")}
                      </div>
                    ) : null}
                  </div>
                  <div style={statTile}>
                    <div style={statLabel}>Mentions</div>
                    <div style={statValue}>{row.mentions}</div>
                  </div>
                  <div style={statTile}>
                    <div style={statLabel}>Partners</div>
                    <div style={statValue}>{row.partners}</div>
                  </div>
                </div>
              </div>
            ))}
          </Panel>

          <Panel
            title="Praise worth using"
            sub={`Owner: ${install.praiseWorthUsing.owner}`}
            style={{ flex: 1 }}
          >
            {install.praiseWorthUsing.quotes.map((q) => (
              <blockquote
                key={q.quote}
                style={{
                  margin: 0,
                  padding: "12px 14px",
                  background: withAlpha(K.green, 0.08),
                  border: `1px solid ${withAlpha(K.green, 0.3)}`,
                  borderRadius: 12,
                }}
              >
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: K.text,
                    lineHeight: 1.45,
                  }}
                >
                  “{L(q.quote)}”
                </div>
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 12,
                    color: K.textMut,
                  }}
                >
                  {L(q.step)} · via {L(q.via)} · {q.date} · {q.note}
                </div>
              </blockquote>
            ))}
            {praiseTopics.map((t) => (
              <div
                key={t.topic}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  gap: 12,
                  paddingTop: 8,
                  borderTop: `1px solid ${K.borderLight}`,
                  fontSize: 13,
                }}
              >
                <span style={{ color: K.text, fontWeight: 700 }}>
                  {L(t.topic)}
                </span>
                <span style={{ color: K.textMut, whiteSpace: "nowrap" }}>
                  <span
                    style={{
                      color: K.green,
                      fontWeight: 700,
                      fontFamily: K.mono,
                    }}
                  >
                    ▲ {t.growthPct}%
                  </span>{" "}
                  · <span style={{ fontFamily: K.mono }}>{t.mentions}</span>{" "}
                  mentions
                </span>
              </div>
            ))}
          </Panel>
        </div>
      </div>
    </div>
  );
}
