"use client";

import type { SeparationV2 } from "@kgs/types";
import { IllustrativeChip } from "../../shared/IllustrativeChip";
import { withAlpha } from "../../shared/tokens";
import { useLabel } from "../../shell/DemoProvider";
import {
  DR,
  DrBadge,
  DrCard,
  DrHead,
  DrMono,
  DrPill,
  DrTd,
  DrTh,
  severityColor,
} from "../ui/DrillChrome";

function MetricTiles({
  items,
}: {
  items: {
    label: string;
    value: string;
    sub?: string;
    status: string;
    money?: boolean;
  }[];
}) {
  const L = useLabel();
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: 8,
      }}
    >
      {items.map((m) => (
        <div
          key={m.label}
          style={{
            border: `1px solid ${DR.border}`,
            borderRadius: 10,
            padding: "8px 10px",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 6,
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 10, color: DR.muted, fontWeight: 700 }}>
              {L(m.label)}
            </span>
            <DrBadge color={severityColor(m.status)}>{m.status}</DrBadge>
          </div>
          <div
            style={{
              marginTop: 4,
              display: "flex",
              alignItems: "baseline",
              gap: 4,
            }}
          >
            <DrMono size={20}>{L(m.value)}</DrMono>
            {m.money ? <IllustrativeChip /> : null}
          </div>
          {m.sub ? (
            <div style={{ marginTop: 2, fontSize: 10, color: DR.dim }}>
              {L(m.sub)}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function CutoverFailuresPanel({
  data,
}: {
  data: SeparationV2["cutoverFailures"];
}) {
  const L = useLabel();
  return (
    <DrCard>
      <DrHead sub={data.sub}>{L(data.title)}</DrHead>
      <MetricTiles items={data.kpis} />
      <div
        style={{
          marginTop: 10,
          marginBottom: 6,
          fontSize: 12,
          fontWeight: 800,
          color: DR.text,
        }}
      >
        {L(data.tableTitle)}
      </div>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: 640,
          }}
        >
          <thead>
            <tr>
              <DrTh>System</DrTh>
              <DrTh>Impact</DrTh>
              <DrTh>Contacts</DrTh>
              <DrTh>vs Control</DrTh>
              <DrTh>Channels</DrTh>
              <DrTh>Owner</DrTh>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r) => (
              <tr key={r.system}>
                <DrTd>
                  <span style={{ fontWeight: 700, color: DR.text }}>
                    {L(r.system)}
                  </span>
                </DrTd>
                <DrTd>
                  <DrBadge color={severityColor(r.impact)}>{r.impact}</DrBadge>
                </DrTd>
                <DrTd>
                  <DrMono size={12}>{r.contacts}</DrMono>
                </DrTd>
                <DrTd>{r.vsControl}</DrTd>
                <DrTd>
                  <span style={{ fontSize: 11 }}>{r.channels}</span>
                </DrTd>
                <DrTd>{L(r.owner)}</DrTd>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DrCard>
  );
}

export function CashImpactPanel({
  data,
}: {
  data: SeparationV2["cashImpact"];
}) {
  const L = useLabel();
  return (
    <DrCard>
      <DrHead sub={data.sub}>{L(data.title)}</DrHead>
      <MetricTiles items={data.kpis} />
      <div
        style={{
          marginTop: 10,
          marginBottom: 6,
          fontSize: 12,
          fontWeight: 800,
          color: DR.text,
        }}
      >
        {L(data.tableTitle)}
      </div>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: 640,
          }}
        >
          <thead>
            <tr>
              <DrTh>Distributor</DrTh>
              <DrTh>Region</DrTh>
              <DrTh>Invoices in dispute</DrTh>
              <DrTh>Amount</DrTh>
              <DrTh>DSO change</DrTh>
              <DrTh>Main issue</DrTh>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r) => (
              <tr key={r.distributor}>
                <DrTd>
                  <span style={{ fontWeight: 700, color: DR.text }}>
                    {L(r.distributor)}
                  </span>
                </DrTd>
                <DrTd>{L(r.region)}</DrTd>
                <DrTd>
                  <DrMono size={12}>{r.invoices}</DrMono>
                </DrTd>
                <DrTd>
                  <span
                    style={{ display: "inline-flex", alignItems: "center" }}
                  >
                    <DrMono size={12}>{r.amount}</DrMono>
                    <IllustrativeChip />
                  </span>
                </DrTd>
                <DrTd>{r.dsoChange}</DrTd>
                <DrTd>{L(r.mainIssue)}</DrTd>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DrCard>
  );
}

export function WhyInvoicesStuck({ data }: { data: SeparationV2["whyStuck"] }) {
  const L = useLabel();
  const max = Math.max(...data.causes.map((c) => c.count));
  return (
    <DrCard accent={DR.purple}>
      <DrHead sub={data.sub} badge="LiSN">
        {L(data.title)}
      </DrHead>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
          border: `1px solid ${DR.border}`,
          borderRadius: 10,
          overflow: "hidden",
          background: "rgba(255,255,255,0.015)",
        }}
      >
        {data.metrics.map((m, i) => (
          <div
            key={m.label}
            style={{
              padding: "9px 10px",
              borderRight:
                i === data.metrics.length - 1
                  ? "none"
                  : `1px solid ${DR.border}`,
            }}
          >
            <div style={{ fontSize: 10, color: DR.dim, fontWeight: 700 }}>
              {L(m.label)}
            </div>
            <DrMono size={18}>{m.value}</DrMono>
            <div style={{ marginTop: 3, fontSize: 10, color: DR.muted }}>
              {L(m.delta)}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr",
          gap: 12,
          marginTop: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: DR.text }}>
            Why invoices are stuck
          </div>
          <div style={{ fontSize: 11, color: DR.muted, margin: "2px 0 8px" }}>
            Top drivers of open disputes
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {data.causes.map((r) => {
              const width = Math.round((r.count / max) * 100);
              const col = severityColor(r.severity);
              return (
                <div key={r.cause}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 8,
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{ fontSize: 11, color: DR.text, fontWeight: 700 }}
                    >
                      {L(r.cause)}
                    </div>
                    <DrBadge color={col}>{r.severity}</DrBadge>
                  </div>
                  <div
                    style={{
                      marginTop: 2,
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                      fontSize: 10,
                      color: DR.muted,
                    }}
                  >
                    <span>{r.count} cases</span>
                    <span>{r.share} of open</span>
                    <span>{r.avgDelay} avg delay</span>
                  </div>
                  <div
                    style={{
                      marginTop: 5,
                      height: 6,
                      borderRadius: 4,
                      background: "rgba(255,255,255,0.06)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${width}%`,
                        height: "100%",
                        borderRadius: 4,
                        background: col,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: DR.text }}>
            Aged Dispute Watchlist
          </div>
          <div style={{ fontSize: 11, color: DR.muted, margin: "2px 0 8px" }}>
            Closest to cash impact
          </div>
          <div style={{ display: "grid", gap: 7 }}>
            {data.watchlist.map((r) => (
              <div
                key={`${r.theme}-${r.distributor}`}
                style={{
                  border: `1px solid ${DR.border}`,
                  borderLeft: `3px solid ${severityColor(r.severity)}`,
                  borderRadius: 8,
                  padding: "7px 8px",
                  background: "rgba(255,255,255,0.015)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <DrBadge color={severityColor(r.severity)}>
                      {r.severity}
                    </DrBadge>
                    <div
                      style={{ fontSize: 11, color: DR.text, fontWeight: 700 }}
                    >
                      {L(r.theme)}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      color: severityColor(r.severity),
                      fontWeight: 800,
                    }}
                  >
                    {r.daysOpen}d
                  </span>
                </div>
                <div style={{ marginTop: 2, fontSize: 10, color: DR.muted }}>
                  Stage: <strong style={{ color: DR.sub }}>{L(r.stage)}</strong>
                </div>
                <div style={{ marginTop: 2, fontSize: 10, color: DR.muted }}>
                  Blocker:{" "}
                  <strong style={{ color: DR.sub }}>{L(r.blocker)}</strong>
                </div>
                <div
                  style={{
                    marginTop: 4,
                    display: "flex",
                    gap: 6,
                    flexWrap: "wrap",
                  }}
                >
                  <DrPill>{L(r.distributor)}</DrPill>
                  <DrPill color={DR.orange}>{L(r.region)}</DrPill>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 12,
          padding: "8px 10px",
          borderRadius: 10,
          background: withAlpha(DR.purple, 0.08),
          border: `1px solid ${withAlpha(DR.purple, 0.28)}`,
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: DR.text,
            fontWeight: 800,
            marginBottom: 6,
          }}
        >
          LiSN diagnosis
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1.2fr",
            gap: 10,
            fontSize: 11,
            color: DR.sub,
            lineHeight: 1.4,
          }}
        >
          <div>
            <strong style={{ color: DR.text }}>Main reason: </strong>
            {L(data.diagnosis.main)}
          </div>
          <div>
            <strong style={{ color: DR.text }}>What changed: </strong>
            {L(data.diagnosis.changed)}
          </div>
          <div>
            <strong style={{ color: DR.text }}>Decide first: </strong>
            {L(data.diagnosis.decideFirst)}
          </div>
        </div>
      </div>
    </DrCard>
  );
}

export function TopCutoverIssues({
  rows,
}: {
  rows: SeparationV2["topIssues"];
}) {
  const L = useLabel();
  const max = Math.max(...rows.map((r) => r.contacts));
  return (
    <DrCard>
      <DrHead sub="Ranked by contacts, recontact and tone.">
        Top Cutover Issues
      </DrHead>
      <div style={{ display: "grid", gap: 8 }}>
        {rows.map((r, idx) => {
          const sev = severityColor(r.severity);
          const width = Math.round((r.contacts / max) * 100);
          const hot = idx < 2;
          return (
            <div
              key={r.label}
              style={{
                border: `1px solid ${hot ? withAlpha(DR.red, 0.35) : DR.border}`,
                borderRadius: 8,
                padding: "8px 10px",
                background: hot
                  ? withAlpha(DR.red, 0.06)
                  : "rgba(255,255,255,0.02)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "28px 1fr 64px 52px 52px",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    color: hot ? DR.red : DR.muted,
                    fontWeight: 800,
                    fontSize: 12,
                  }}
                >
                  #{idx + 1}
                </span>
                <div>
                  <div
                    style={{ color: DR.text, fontWeight: 700, fontSize: 12 }}
                  >
                    {L(r.label)}
                  </div>
                  <div style={{ color: DR.muted, fontSize: 10, marginTop: 2 }}>
                    Most-affected channel: {L(r.channel)}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <DrMono size={12}>{r.contacts}</DrMono>
                  <div style={{ color: DR.muted, fontSize: 9 }}>contacts</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <DrMono size={12} color={sev}>
                    {r.recontact}
                  </DrMono>
                  <div style={{ color: DR.muted, fontSize: 9 }}>recontact</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <DrMono size={12} color={DR.orange}>
                    {r.tone.toFixed(2)}
                  </DrMono>
                  <div style={{ color: DR.muted, fontSize: 9 }}>tone</div>
                </div>
              </div>
              <div
                style={{
                  marginTop: 6,
                  height: 6,
                  borderRadius: 4,
                  background: "rgba(255,255,255,0.06)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${width}%`,
                    height: "100%",
                    background: hot ? DR.red : sev,
                    borderRadius: 4,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </DrCard>
  );
}

export function InvoiceDisputeFunnel({
  data,
}: {
  data: SeparationV2["funnel"];
}) {
  const L = useLabel();
  const max = data.stages[0]?.volume ?? 1;
  return (
    <DrCard>
      <DrHead sub={data.sub}>{L(data.title)}</DrHead>
      <div style={{ display: "grid", gap: 8 }}>
        {data.stages.map((s) => {
          const width = Math.max(28, Math.round((s.volume / max) * 100));
          return (
            <div key={s.label} style={{ minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 8,
                  marginBottom: 4,
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 700, color: DR.text }}>
                  {L(s.label)}
                </span>
                <DrBadge color={severityColor(s.status)}>{s.status}</DrBadge>
              </div>
              <div
                style={{
                  width: `${width}%`,
                  margin: "0 auto 0 0",
                  borderRadius: 8,
                  padding: "8px 10px",
                  background: withAlpha(severityColor(s.status), 0.12),
                  border: `1px solid ${withAlpha(severityColor(s.status), 0.35)}`,
                }}
              >
                <DrMono size={16}>{s.volume}</DrMono>
                <span style={{ marginLeft: 10, fontSize: 11, color: DR.muted }}>
                  avg {s.avgDays} days
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <p
        style={{
          margin: "12px 0 0",
          fontSize: 12,
          color: DR.sub,
          lineHeight: 1.45,
        }}
      >
        {L(data.footer)}
      </p>
    </DrCard>
  );
}
