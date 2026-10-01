"use client";

import install from "@kgs2/data/install.json";
import overview from "@kgs2/data/overview.json";
import { useDemo2, useLabel2 } from "@kgs2/lib/demoState";
import { Sparkles } from "lucide-react";
import { type CSSProperties, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Panel } from "@/components/role-based-dashboard/kgs/drill/Panel";
import {
  K,
  withAlpha,
} from "@/components/role-based-dashboard/kgs/shared/tokens";
import { DrillHeader2 } from "../shared/DrillHeader2";
import {
  type SignalWall2Data,
  type WallLevel2,
  SignalWall2,
} from "../shared/SignalWall2";
import { SyntheticBadge } from "../shared/SyntheticBadge";

const FAMILY_LABEL: Record<string, string> = {
  A: "A · detection",
  B: "B · panels",
  C: "C · notification",
  D: "D · software/licence",
};

function heatColour(n: number, max: number): string {
  if (n <= 0) return K.surface;
  const t = Math.min(1, n / Math.max(max, 1));
  return withAlpha(K.amber, 0.12 + t * 0.55);
}


function buildInstallWall(): SignalWall2Data {
  const byId = Object.fromEntries(
    overview.signals.map((s) => [s.id, s] as const),
  );
  return {
    title: "Signal Wall",
    sub: "Installer experience signals",
    pill: "Live",
    cards: install.signalWall.map((card) => {
      const improving = card.severity === "improving";
      const sig = byId[card.id];
      const level: WallLevel2 = improving
        ? "improving"
        : card.severity === "S2"
          ? "critical"
          : card.severity === "S3"
            ? "alert"
            : "warning";
      return {
        id: card.id,
        level,
        tag: improving ? "Improving" : `${card.severity} · ${card.type}`,
        title: card.title,
        body: sig?.topIntent ?? card.title,
        metric: sig
          ? sig.beforeAfter.after
          : improving
            ? "Holding"
            : "—",
        trend: sig
          ? `${sig.beforeAfter.before} → ${sig.beforeAfter.after}`
          : "Stable praise",
        detail: {
          cause: sig?.topIntent ?? card.title,
          areas: sig ? [sig.pnlTag, sig.timeWindow] : ["Install experience"],
          actions: sig
            ? [sig.recommendation]
            : ["Route praise to Marketing"],
          timeline: sig?.timeWindow ?? "13 weeks",
          owner: card.owner,
          priority: improving ? "Watching" : "Needs action",
        },
        openView: undefined,
      };
    }),
    footer: [
      { label: "Critical", value: 0 },
      {
        label: "Needs action",
        value: install.signalWall.filter((c) => c.severity !== "improving").length,
      },
      {
        label: "Improving",
        value: install.signalWall.filter((c) => c.severity === "improving").length,
      },
    ],
  };
}

/**
 * Install experience — What do installers experience? (SPEC §7).
 * Framed as experience only — never as a product fault.
 */
export function InstallView() {
  const L = useLabel2();
  const { state, setView, approve, isApproved } = useDemo2();
  const canApprove = state.role === "Product liaison";
  const [draftOpen, setDraftOpen] = useState<string | null>(null);

  const divergeData = useMemo(
    () =>
      install.steps.map((s) => ({
        step: s.step,
        friction: -s.friction,
        praise: s.praise,
        frictionAbs: s.friction,
      })),
    [],
  );

  const maxBar = useMemo(() => {
    const m = Math.max(
      ...install.steps.map((s) => Math.max(s.friction, s.praise)),
    );
    return Math.ceil(m / 5) * 5 || 25;
  }, []);

  const heatMax = Math.max(0, ...install.heatGrid.values.flat());
  const openDraft = install.drafts.find((d) => d.id === draftOpen);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        padding: "16px 24px 24px",
      }}
    >
      <DrillHeader2
        title={install.title}
        subtitle="Friction and praise by install step · experience only"
      />

      {/* 1. Capture-gap banner */}
      <aside
        style={{
          padding: "12px 14px",
          borderRadius: 10,
          border: `1px solid ${withAlpha(K.amber, 0.45)}`,
          background: withAlpha(K.amber, 0.1),
          fontSize: 14,
          color: K.textSec,
          lineHeight: 1.5,
        }}
      >
        {(() => {
          const raw = install.captureGapBanner;
          const trimmed = raw.replace(/\s*See Partner view\.?\s*$/i, "");
          return (
            <>
              {L(trimmed)}{" "}
              <button
                type="button"
                className="kgs2-focus"
                onClick={() => setView("partner")}
                style={{
                  background: "none",
                  border: "none",
                  color: K.violet300,
                  fontWeight: 700,
                  fontFamily: "inherit",
                  fontSize: 14,
                  cursor: "pointer",
                  padding: 0,
                  textDecoration: "underline",
                }}
              >
                See Partner view
              </button>
              .
            </>
          );
        })()}
      </aside>

      {/* 2. Friction vs praise diverging bars */}
      <Panel
        title="Friction vs praise by commissioning step"
        sub={`Experience only · friction ${install.frictionTotal} · praise ${install.praiseTotal}`}
        right={
          <span
            style={{
              fontSize: 12,
              fontFamily: K.mono,
              color: K.textMut,
            }}
          >
            {install.frictionTotal} / {install.praiseTotal}
          </span>
        }
      >
        <div
          style={{
            display: "flex",
            gap: 16,
            marginBottom: 8,
            fontSize: 12,
            color: K.textMut,
          }}
        >
          <span>
            <span style={{ color: K.amber }}>━</span> Friction (left)
          </span>
          <span>
            <span style={{ color: K.green }}>━</span> Praise (right)
          </span>
        </div>
        <div
          role="img"
          aria-label="Friction versus praise by step"
          style={{ height: 280 }}
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
            initialDimension={{ width: 1, height: 1 }}
          >
            <BarChart
              data={divergeData}
              layout="vertical"
              margin={{ top: 8, right: 24, bottom: 8, left: 8 }}
              stackOffset="sign"
            >
              <CartesianGrid stroke={K.borderLight} horizontal={false} />
              <XAxis
                type="number"
                domain={[-maxBar, maxBar]}
                tickFormatter={(v) => String(Math.abs(Number(v)))}
                tick={{ fill: K.textMut, fontSize: 11, fontFamily: K.mono }}
                axisLine={{ stroke: K.borderLight }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="step"
                width={168}
                tick={{ fill: K.textSec, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <ReferenceLine x={0} stroke={K.borderLight} />
              <Tooltip
                contentStyle={{
                  background: K.elevated,
                  border: `1px solid ${K.borderLight}`,
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(value: number, name: string) => {
                  const n = Math.abs(Number(value));
                  return [n, name === "friction" ? "Friction" : "Praise"];
                }}
              />
              <Bar
                dataKey="friction"
                name="friction"
                stackId="exp"
                fill={K.amber}
                isAnimationActive={false}
                radius={[4, 0, 0, 4]}
              >
                {divergeData.map((d) => (
                  <Cell key={`f-${d.step}`} fill={K.amber} />
                ))}
              </Bar>
              <Bar
                dataKey="praise"
                name="praise"
                stackId="exp"
                fill={K.green}
                isAnimationActive={false}
                radius={[0, 4, 4, 0]}
              >
                {divergeData.map((d) => (
                  <Cell key={`p-${d.step}`} fill={K.green} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      {/* 3. Time installers mention */}
      <Panel
        title="Time installers mention"
        sub="Stated by installers, not measured"
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
                  "Step",
                  "Phrase",
                  "Stated extra time",
                  "Mentions",
                  "Partners",
                ].map((h) => (
                  <th key={h} style={th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {install.statedTimeTable.map((row) => (
                <tr key={row.step + row.phrase}>
                  <td style={td}>{row.step}</td>
                  <td style={td}>“{L(row.phrase)}”</td>
                  <td style={{ ...td, fontFamily: K.mono }}>
                    {row.statedExtraTime}
                  </td>
                  <td style={{ ...td, fontFamily: K.mono }}>{row.mentions}</td>
                  <td style={{ ...td, fontFamily: K.mono }}>{row.partners}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* 4. Praise worth using */}
      <Panel
        title="Praise worth using"
        sub={`Owner: ${install.praiseWorthUsing.owner}`}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {install.praiseWorthUsing.quotes.map((q) => (
            <blockquote
              key={q.text}
              style={{
                margin: 0,
                padding: "12px 14px",
                background: withAlpha(K.green, 0.08),
                border: `1px solid ${withAlpha(K.green, 0.35)}`,
                borderRadius: 10,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  color: K.text,
                  lineHeight: 1.45,
                  fontWeight: 600,
                }}
              >
                “{L(q.text)}”
              </p>
              <footer
                style={{
                  marginTop: 8,
                  fontSize: 12,
                  color: K.textMut,
                }}
              >
                {q.step} · {L(q.source)}
              </footer>
            </blockquote>
          ))}
        </div>
      </Panel>

      {/* 5. Heat grid */}
      <Panel
        title="Friction mentions by product family × region"
        sub="Experience counts · anonymise-aware"
      >
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 12,
            }}
          >
            <thead>
              <tr>
                <th style={th}>Family</th>
                {install.heatGrid.regions.map((r) => (
                  <th key={r} style={{ ...th, textAlign: "center" }}>
                    {L(`{{region:${r}}}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {install.heatGrid.families.map((fam, ri) => (
                <tr key={fam}>
                  <td style={td}>{FAMILY_LABEL[fam] ?? fam}</td>
                  {install.heatGrid.values[ri].map((n, ci) => (
                    <td
                      key={`${fam}-${install.heatGrid.regions[ci]}`}
                      style={{
                        ...td,
                        textAlign: "center",
                        fontFamily: K.mono,
                        fontWeight: n > 0 ? 700 : 400,
                        background: heatColour(n, heatMax),
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

      {/* 6. Signal Wall */}
      <SignalWall2 wall={buildInstallWall()} />

      {/* 7. Evidence summary */}
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
            {L(install.evidenceSummary.mainSignal)}
          </p>
          <p style={summaryP}>
            <strong style={{ color: K.text }}>What changed:</strong>{" "}
            {L(install.evidenceSummary.whatChanged)}
          </p>
          <p style={summaryP}>
            <strong style={{ color: K.text }}>Decide first:</strong>{" "}
            {L(install.evidenceSummary.decideFirst)}
          </p>
        </div>
      </section>

      {/* 8. Drafts */}
      <Panel
        title="Drafts"
        sub="Awaiting Product liaison · praise routed to Marketing separately · nothing is sent"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 12,
          }}
        >
          {install.drafts.map((d) => {
            const approved = isApproved(d.id);
            const toMarketing = d.id === "draft-praise-marketing";
            return (
              <div
                key={d.id}
                style={{
                  background: K.surface,
                  border: `1px solid ${K.borderLight}`,
                  borderRadius: 12,
                  padding: 14,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 8,
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 700, color: K.text }}>
                    {d.title}
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: K.radius.pill,
                      background: approved
                        ? withAlpha(K.green, 0.15)
                        : withAlpha(K.amber, 0.18),
                      color: approved ? K.green : K.amber,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {approved ? "Approved · Not sent" : d.status}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: K.textMut }}>
                  {toMarketing
                    ? "Routed to Marketing"
                    : `Awaiting ${d.awaiting}`}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <button
                    type="button"
                    className="kgs2-focus"
                    onClick={() => setDraftOpen(d.id)}
                    style={btnOutline}
                  >
                    View draft
                  </button>
                  <span
                    title={
                      canApprove
                        ? undefined
                        : "Approval sits with the Product liaison"
                    }
                  >
                    <button
                      type="button"
                      className="kgs2-focus"
                      aria-disabled={!canApprove || approved}
                      disabled={approved}
                      onClick={() => {
                        if (!canApprove || approved) return;
                        approve(d.id);
                      }}
                      style={{
                        ...btnOutline,
                        background:
                          canApprove && !approved ? K.brandTint : "transparent",
                        color:
                          canApprove && !approved ? K.violet300 : K.textMut,
                        cursor:
                          !canApprove || approved ? "not-allowed" : "pointer",
                        opacity: !canApprove || approved ? 0.55 : 1,
                      }}
                    >
                      Approve
                    </button>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      {openDraft ? (
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
            onClick={() => setDraftOpen(null)}
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
              width: "min(520px, 100%)",
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
                {openDraft.title}
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
              {openDraft.id === "draft-praise-marketing"
                ? `Share installer praise with Marketing / partner training: “${L(install.praiseWorthUsing.quotes[0]?.text ?? "")}”`
                : openDraft.id === "draft-tip-sheet"
                  ? "One-page network set-up tip sheet for partners. Experience guidance only — not a fault notice."
                  : "Feedback note to the US product team on network configuration set-up time stated by installers. Experience signal only."}
            </p>
            <button
              type="button"
              className="kgs2-focus"
              onClick={() => setDraftOpen(null)}
              style={{ ...btnOutline, marginTop: 16 }}
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

const btnOutline: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "6px 10px",
  borderRadius: 8,
  border: `1px solid ${K.borderLight}`,
  background: "transparent",
  color: K.textSec,
  fontSize: 12,
  fontWeight: 600,
  fontFamily: "inherit",
  cursor: "pointer",
};
