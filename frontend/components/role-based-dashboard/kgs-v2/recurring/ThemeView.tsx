"use client";

import theme from "@kgs2/data/theme_rc01.json";
import { useDemo2, useLabel2, withTs } from "@kgs2/lib/demoState";
import type { LoopStatus } from "@kgs2/types";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  K,
  withAlpha,
} from "@/components/role-based-dashboard/kgs/shared/tokens";
import { LoopTracker } from "../shared/LoopTracker";
import { SyntheticBadge } from "../shared/SyntheticBadge";
import { useToast2 } from "../shell/Toast";

const SIGNAL_ID = "RC-01";
const APPROVING_MS = 500;

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

const outlineBtn = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "8px 12px",
  borderRadius: K.radius.chip,
  background: "transparent",
  border: `1px solid ${K.borderLight}`,
  color: K.textSec,
  fontSize: 14,
  fontWeight: 600,
  fontFamily: "inherit",
  cursor: "pointer",
  whiteSpace: "nowrap" as const,
};

function ThemeDecisionPanel({ onViewDraft }: { onViewDraft: () => void }) {
  const L = useLabel2();
  const { state, approve, askForDecision, isApproved, setLoop } = useDemo2();
  const { show } = useToast2();
  const gate = theme.humanGate;
  const approved = isApproved(SIGNAL_ID);
  const ts = state.approvals[SIGNAL_ID]?.ts;
  const asked = Boolean(state.decisionRequested[SIGNAL_ID]);
  const canApprove = gate.approveEnabledFor.includes(state.role);
  const [approving, setApproving] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  const banner =
    approved && ts
      ? `Approved · draft handed to Technical support lead · audit logged ${ts}`
      : asked
        ? "Decision requested"
        : L(gate.title);

  return (
    <section
      aria-label="Decision panel"
      style={{
        background: K.elevated,
        border: `1px solid ${K.borderLight}`,
        borderRadius: 12,
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.06em",
          color: K.textMut,
          textTransform: "uppercase",
        }}
      >
        Human gate
      </div>
      <div
        style={{
          padding: "10px 12px",
          borderRadius: 10,
          background: approved
            ? withAlpha(K.green, 0.12)
            : withAlpha(K.amber, 0.1),
          border: `1px solid ${
            approved ? withAlpha(K.green, 0.4) : withAlpha(K.amber, 0.35)
          }`,
          fontSize: 13,
          color: approved ? K.green : K.text,
          lineHeight: 1.45,
          fontWeight: 600,
        }}
      >
        {banner}
        <span
          style={{
            marginLeft: 8,
            fontSize: 11,
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: K.radius.pill,
            background: approved
              ? withAlpha(K.green, 0.2)
              : withAlpha(K.amber, 0.2),
            color: approved ? K.green : K.amber,
          }}
        >
          {approved
            ? "Action approved"
            : asked
              ? "Decision requested"
              : gate.chip}
        </span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <span title={!canApprove ? gate.disabledTooltip : undefined}>
          <button
            type="button"
            className="kgs2-focus"
            aria-disabled={!canApprove || approved}
            disabled={approving}
            onClick={() => {
              if (!canApprove || approved || approving) return;
              setApproving(true);
              timer.current = window.setTimeout(() => {
                const stamp = approve(SIGNAL_ID);
                setLoop(SIGNAL_ID, {
                  step: "watching",
                  nextCheck: theme.loop.nextCheck,
                  approvedAt: stamp,
                  approvedBy: "Technical support lead",
                });
                setApproving(false);
                show(
                  "Action approved",
                  withTs("Approved · audit logged {ts}", stamp),
                );
              }, APPROVING_MS);
            }}
            style={{
              ...outlineBtn,
              background: canApprove && !approved ? K.brandTint : "transparent",
              color: canApprove && !approved ? K.violet300 : K.textMut,
              borderColor:
                canApprove && !approved
                  ? withAlpha(K.violet400, 0.5)
                  : K.borderLight,
              cursor:
                !canApprove || approved
                  ? "not-allowed"
                  : approving
                    ? "wait"
                    : "pointer",
              opacity: !canApprove || approved ? 0.55 : 1,
            }}
          >
            {approving ? "Approving…" : gate.approveLabel}
          </button>
        </span>
        <button
          type="button"
          className="kgs2-focus"
          disabled={asked || approved}
          onClick={() => askForDecision(SIGNAL_ID)}
          style={{
            ...outlineBtn,
            cursor: asked || approved ? "not-allowed" : "pointer",
            opacity: asked || approved ? 0.55 : 1,
          }}
        >
          {asked ? "Decision requested" : "Ask for a decision"}
        </button>
        <button
          type="button"
          className="kgs2-focus"
          onClick={onViewDraft}
          style={outlineBtn}
        >
          View draft
        </button>
      </div>
      {!canApprove && !approved ? (
        <div style={{ fontSize: 12, color: K.textMut }}>
          {gate.disabledTooltip}
        </div>
      ) : null}
      {approved && ts ? (
        <div style={{ fontSize: 12, color: K.textMut, fontFamily: K.mono }}>
          {ts} · Technical support lead approved RC-01 draft
        </div>
      ) : null}
    </section>
  );
}

/**
 * RC-01 theme deep dive (SPEC §6b) — Pass 4 hero layout.
 */
export function ThemeView() {
  const L = useLabel2();
  const { state, setView, isApproved } = useDemo2();
  const [draftOpen, setDraftOpen] = useState(false);
  const draft = theme.drafts[0];

  const loop: LoopStatus = useMemo(() => {
    const stored = state.loop[SIGNAL_ID];
    if (stored) return stored;
    if (isApproved(SIGNAL_ID)) {
      return {
        step: "watching",
        nextCheck: theme.loop.nextCheck,
        approvedAt: state.approvals[SIGNAL_ID]?.ts,
      };
    }
    return { step: "open", nextCheck: theme.loop.nextCheck };
  }, [state.loop, state.approvals, isApproved]);

  const chartData = useMemo(
    () =>
      theme.chart.weeks.map((w, i) => ({
        week: w,
        value: theme.chart.values[i] ?? null,
      })),
    [],
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        padding: "16px 24px 24px",
      }}
    >
      <button
        type="button"
        className="kgs2-focus"
        onClick={() => setView("recurring")}
        style={{
          alignSelf: "flex-start",
          background: "transparent",
          border: `1px solid ${K.borderLight}`,
          borderRadius: 10,
          color: K.textSec,
          fontSize: 14,
          fontWeight: 600,
          padding: "8px 14px",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        ← Back to Recurring
      </button>

      <h1
        style={{
          margin: 0,
          fontSize: 22,
          fontWeight: 800,
          color: K.text,
          lineHeight: 1.3,
          maxWidth: 920,
        }}
      >
        {L(theme.headline)}
      </h1>

      {/* Severity */}
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
        <span style={{ fontWeight: 800, color: K.amber, fontFamily: K.mono }}>
          {theme.severity.class}
        </span>
        <span>{theme.severity.word}</span>
        <span style={{ color: K.textMut }}>·</span>
        <span>{theme.severity.typeNote}</span>
        <span style={{ color: K.textMut }}>·</span>
        <span>{theme.severity.blastRadius.headline}</span>
        <span style={{ color: K.textMut }}>·</span>
        <span>{theme.severity.incident.note}</span>
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
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: K.textMut,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              26-week contacts
            </div>
            <div
              role="img"
              aria-label="RC-01 weekly contacts"
              style={{ height: 280 }}
            >
              <ResponsiveContainer
                width="100%"
                height="100%"
                initialDimension={{ width: 1, height: 1 }}
              >
                <LineChart
                  data={chartData}
                  margin={{ top: 28, right: 16, bottom: 4, left: 0 }}
                >
                  <CartesianGrid stroke={K.borderLight} vertical={false} />
                  <XAxis
                    dataKey="week"
                    tick={{ fill: K.textMut, fontSize: 10, fontFamily: K.mono }}
                    interval={2}
                    axisLine={{ stroke: K.borderLight }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: K.textMut, fontSize: 11, fontFamily: K.mono }}
                    axisLine={false}
                    tickLine={false}
                    width={28}
                  />
                  <Tooltip
                    contentStyle={{
                      background: K.elevated,
                      border: `1px solid ${K.borderLight}`,
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  {theme.chart.fixMarkers.map((m) => {
                    const w = theme.chart.weeks[m.weekIndex];
                    if (!w) return null;
                    return (
                      <ReferenceLine
                        key={`fix-${m.label}`}
                        x={w}
                        stroke={withAlpha(K.violet400, 0.7)}
                        label={{
                          value: `◆ ${m.label}`,
                          fill: K.violet300,
                          fontSize: 10,
                          position: "top",
                        }}
                      />
                    );
                  })}
                  {theme.chart.returnMarkers.map((m) => {
                    const w = theme.chart.weeks[m.weekIndex];
                    if (!w) return null;
                    return (
                      <ReferenceLine
                        key={`ret-${m.label}`}
                        x={w}
                        stroke={withAlpha(K.orange, 0.7)}
                        label={{
                          value: `▲ ${m.label}`,
                          fill: K.orange,
                          fontSize: 10,
                          position: "top",
                        }}
                      />
                    );
                  })}
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={K.orange}
                    strokeWidth={2.5}
                    dot={{ r: 2.5, fill: K.orange, strokeWidth: 0 }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
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
              Fix history
            </div>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
              <thead>
                <tr>
                  {["Date", "What was done", "By whom", "Contacts/week"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left",
                          padding: "6px 8px",
                          color: K.textMut,
                          borderBottom: `1px solid ${K.borderLight}`,
                          fontWeight: 600,
                        }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {theme.fixHistory.map((row) => (
                  <tr key={row.date + row.what}>
                    <td
                      style={{
                        padding: "8px",
                        borderBottom: `1px solid ${K.borderLight}`,
                        fontFamily: K.mono,
                        color: K.body,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.date}
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        borderBottom: `1px solid ${K.borderLight}`,
                        color: K.body,
                      }}
                    >
                      {row.what}
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        borderBottom: `1px solid ${K.borderLight}`,
                        color: K.body,
                      }}
                    >
                      {row.by}
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        borderBottom: `1px solid ${K.borderLight}`,
                        fontFamily: K.mono,
                        color: K.body,
                      }}
                    >
                      {row.contactsPerWeekBefore} → {row.contactsPerWeekAfter}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Block>

          <LoopTracker
            status={loop}
            watchingNote={`next check 5 Oct: ${theme.title}`}
          />
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
              {theme.confidence.level} {theme.confidence.p} · K{" "}
              {theme.confidence.known.count} · I{" "}
              {theme.confidence.inferred.count}
            </div>
            <div style={{ fontSize: 12, color: K.body, lineHeight: 1.45 }}>
              Known: {theme.confidence.known.label}
            </div>
            <div style={{ fontSize: 12, color: K.body, lineHeight: 1.45 }}>
              Inferred: {theme.confidence.inferred.label}
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
              {theme.joinTags.map((t) => (
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
              {theme.pnl.compact}
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
              Draft
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: K.body,
                lineHeight: 1.5,
              }}
            >
              {draft?.title}
            </p>
            <div
              style={{
                display: "inline-flex",
                alignSelf: "flex-start",
                fontSize: 11,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: K.radius.pill,
                background: withAlpha(K.amber, 0.18),
                color: K.amber,
              }}
            >
              {draft?.status} · awaiting {draft?.awaiting}
            </div>
          </Block>

          <ThemeDecisionPanel onViewDraft={() => setDraftOpen(true)} />
        </div>
      </div>

      {draftOpen && draft ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 95,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.55)",
            padding: 24,
          }}
        >
          <button
            type="button"
            aria-label="Close draft"
            className="kgs2-focus"
            onClick={() => setDraftOpen(false)}
            style={{
              position: "absolute",
              inset: 0,
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Draft preview"
            style={{
              position: "relative",
              width: "min(560px, 100%)",
              background: K.elevated,
              border: `1px solid ${K.borderLight}`,
              borderRadius: 14,
              padding: 18,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>
                Draft · RC-01
              </h2>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: K.radius.pill,
                  background: withAlpha(K.amber, 0.18),
                  color: K.amber,
                }}
              >
                Not sent
              </span>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                color: K.body,
                lineHeight: 1.55,
              }}
            >
              {draft.title}
            </p>
            <p
              style={{
                margin: "12px 0 0",
                fontSize: 12,
                color: K.textMut,
              }}
            >
              Awaiting {draft.awaiting}. Nothing is sent automatically.
            </p>
            <button
              type="button"
              className="kgs2-focus"
              onClick={() => setDraftOpen(false)}
              style={{
                ...outlineBtn,
                marginTop: 16,
              }}
            >
              Close
            </button>
            <div style={{ marginTop: 14 }}>
              <SyntheticBadge compact />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
