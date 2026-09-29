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
        flexShrink: 0,
      }}
    >
      {items.map((m) => (
        <div
          key={m.label}
          style={{
            border: `1px solid ${DR.border}`,
            borderRadius: 10,
            padding: "10px 12px",
            background: "rgba(255,255,255,0.02)",
            minHeight: 78,
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
            <span style={{ fontSize: 12, color: DR.muted, fontWeight: 700 }}>
              {L(m.label)}
            </span>
            <DrBadge color={severityColor(m.status)}>{m.status}</DrBadge>
          </div>
          <div
            style={{
              marginTop: 6,
              display: "flex",
              alignItems: "baseline",
              gap: 6,
              flexWrap: "wrap",
            }}
          >
            <DrMono size={22}>{L(m.value)}</DrMono>
            {m.money ? <IllustrativeChip /> : null}
          </div>
          {m.sub ? (
            <div style={{ marginTop: 4, fontSize: 12, color: DR.dim }}>
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
    <DrCard
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <DrHead sub={data.sub}>{L(data.title)}</DrHead>
      <MetricTiles items={data.kpis} />
      <div
        style={{
          marginTop: 12,
          marginBottom: 8,
          fontSize: 14,
          fontWeight: 800,
          color: DR.text,
          flexShrink: 0,
        }}
      >
        {L(data.tableTitle)}
      </div>
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "grid",
          gridTemplateRows: `auto repeat(${data.rows.length}, minmax(0, 1fr))`,
          border: `1px solid ${DR.border}`,
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 88px 64px 64px 1.3fr 0.9fr",
            gap: 8,
            padding: "8px 10px",
            borderBottom: `1px solid ${DR.border}`,
            background: "rgba(255,255,255,0.02)",
            fontSize: 11,
            fontWeight: 700,
            color: DR.dim,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          <span>System</span>
          <span>Impact</span>
          <span>Contacts</span>
          <span>vs Control</span>
          <span>Channels</span>
          <span>Owner</span>
        </div>
        {data.rows.map((r) => (
          <div
            key={r.system}
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 88px 64px 64px 1.3fr 0.9fr",
              gap: 8,
              padding: "0 10px",
              alignItems: "center",
              borderBottom: `1px solid ${DR.border}`,
              minHeight: 0,
            }}
          >
            <span style={{ fontWeight: 700, color: DR.text, fontSize: 13 }}>
              {L(r.system)}
            </span>
            <DrBadge color={severityColor(r.impact)}>{r.impact}</DrBadge>
            <DrMono size={13}>{r.contacts}</DrMono>
            <span style={{ fontSize: 13, color: DR.sub }}>{r.vsControl}</span>
            <span style={{ fontSize: 12, color: DR.muted }}>{r.channels}</span>
            <span style={{ fontSize: 12, color: DR.sub }}>{L(r.owner)}</span>
          </div>
        ))}
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
    <DrCard
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <DrHead sub={data.sub}>{L(data.title)}</DrHead>
      <MetricTiles items={data.kpis} />
      <div
        style={{
          marginTop: 12,
          marginBottom: 8,
          display: "flex",
          alignItems: "baseline",
          gap: 8,
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 800, color: DR.text }}>
          {L(data.tableTitle)}
        </span>
        <span style={{ fontSize: 12, color: DR.muted }}>
          Amounts USD · illustrative
        </span>
      </div>
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "grid",
          gridTemplateRows: `auto repeat(${data.rows.length}, minmax(0, 1fr))`,
          border: `1px solid ${DR.border}`,
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.7fr 0.7fr 0.7fr 0.7fr 1.2fr",
            gap: 8,
            padding: "8px 10px",
            borderBottom: `1px solid ${DR.border}`,
            background: "rgba(255,255,255,0.02)",
            fontSize: 11,
            fontWeight: 700,
            color: DR.dim,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          <span>Distributor</span>
          <span>Region</span>
          <span>Invoices</span>
          <span>Amount</span>
          <span>DSO</span>
          <span>Main issue</span>
        </div>
        {data.rows.map((r) => (
          <div
            key={r.distributor}
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 0.7fr 0.7fr 0.7fr 0.7fr 1.2fr",
              gap: 8,
              padding: "0 10px",
              alignItems: "center",
              borderBottom: `1px solid ${DR.border}`,
              minHeight: 0,
            }}
          >
            <span style={{ fontWeight: 700, color: DR.text, fontSize: 13 }}>
              {L(r.distributor)}
            </span>
            <span style={{ fontSize: 13, color: DR.sub }}>{L(r.region)}</span>
            <DrMono size={13}>{r.invoices}</DrMono>
            <DrMono size={13}>{r.amount}</DrMono>
            <span style={{ fontSize: 13, color: DR.sub }}>{r.dsoChange}</span>
            <span style={{ fontSize: 12, color: DR.muted }}>
              {L(r.mainIssue)}
            </span>
          </div>
        ))}
      </div>
    </DrCard>
  );
}

export function WhyInvoicesStuck({ data }: { data: SeparationV2["whyStuck"] }) {
  const L = useLabel();
  const max = Math.max(...data.causes.map((c) => c.count));
  return (
    <DrCard accent={DR.purple}>
      <DrHead sub={data.sub}>{L(data.title)}</DrHead>
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
              padding: "12px 12px",
              borderRight:
                i === data.metrics.length - 1
                  ? "none"
                  : `1px solid ${DR.border}`,
            }}
          >
            <div style={{ fontSize: 12, color: DR.dim, fontWeight: 700 }}>
              {L(m.label)}
            </div>
            <DrMono size={22}>{m.value}</DrMono>
            <div style={{ marginTop: 4, fontSize: 12, color: DR.muted }}>
              {L(m.delta)}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: 16,
          marginTop: 14,
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 800, color: DR.text }}>
            Why invoices are stuck
          </div>
          <div style={{ fontSize: 14, color: DR.muted, margin: "4px 0 12px" }}>
            Top drivers of open disputes
          </div>
          <div style={{ display: "grid", gap: 12, flex: 1 }}>
            {data.causes.map((r) => {
              const width = Math.max(12, Math.round((r.count / max) * 100));
              const col = severityColor(r.severity);
              return (
                <div
                  key={r.cause}
                  style={{
                    border: `1px solid ${DR.border}`,
                    borderRadius: 10,
                    padding: "12px 14px",
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 15,
                        color: DR.text,
                        fontWeight: 700,
                        lineHeight: 1.3,
                        minWidth: 0,
                      }}
                    >
                      {L(r.cause)}
                    </div>
                    <DrBadge color={col}>{r.severity}</DrBadge>
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      display: "flex",
                      gap: 14,
                      flexWrap: "wrap",
                      fontSize: 14,
                      color: DR.muted,
                      lineHeight: 1.35,
                    }}
                  >
                    <span>
                      <DrMono size={14} color={DR.sub}>
                        {r.count}
                      </DrMono>{" "}
                      cases
                    </span>
                    <span>{r.share} of open</span>
                    <span>{r.avgDelay} avg delay</span>
                  </div>
                  <div
                    style={{
                      marginTop: 10,
                      height: 8,
                      borderRadius: 4,
                      background: "rgba(255,255,255,0.06)",
                      overflow: "hidden",
                    }}
                    aria-hidden
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

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 800, color: DR.text }}>
            Aged Dispute Watchlist
          </div>
          <div style={{ fontSize: 14, color: DR.muted, margin: "4px 0 12px" }}>
            Closest to cash impact
          </div>
          <div
            style={{
              display: "grid",
              gap: 10,
              flex: 1,
              gridTemplateRows: `repeat(${data.watchlist.length}, minmax(0, 1fr))`,
            }}
          >
            {data.watchlist.map((r) => (
              <div
                key={`${r.theme}-${r.distributor}`}
                style={{
                  border: `1px solid ${DR.border}`,
                  borderLeft: `3px solid ${severityColor(r.severity)}`,
                  borderRadius: 10,
                  padding: "12px 14px",
                  background: "rgba(255,255,255,0.02)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  minHeight: 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      minWidth: 0,
                    }}
                  >
                    <DrBadge color={severityColor(r.severity)}>
                      {r.severity}
                    </DrBadge>
                    <div
                      style={{
                        fontSize: 14,
                        color: DR.text,
                        fontWeight: 700,
                        lineHeight: 1.3,
                      }}
                    >
                      {L(r.theme)}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 15,
                      color: severityColor(r.severity),
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {r.daysOpen}d
                  </span>
                </div>
                <div style={{ marginTop: 8, fontSize: 13, color: DR.muted }}>
                  Stage: <strong style={{ color: DR.sub }}>{L(r.stage)}</strong>
                </div>
                <div style={{ marginTop: 4, fontSize: 13, color: DR.muted }}>
                  Blocker:{" "}
                  <strong style={{ color: DR.sub }}>{L(r.blocker)}</strong>
                </div>
                <div
                  style={{
                    marginTop: 8,
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
    <DrCard
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <DrHead sub="Ranked by contacts, recontact and tone.">
        Top Cutover Issues
      </DrHead>
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateRows: `repeat(${rows.length}, minmax(0, 1fr))`,
          gap: 8,
          minHeight: 0,
        }}
      >
        {rows.map((r, idx) => {
          const sev = severityColor(r.severity);
          const width = Math.round((r.contacts / max) * 100);
          const hot = idx < 2;
          return (
            <div
              key={r.label}
              style={{
                border: `1px solid ${hot ? withAlpha(DR.red, 0.35) : DR.border}`,
                borderRadius: 10,
                padding: "10px 12px",
                background: hot
                  ? withAlpha(DR.red, 0.06)
                  : "rgba(255,255,255,0.02)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                minHeight: 0,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "28px minmax(0, 1fr) 68px 56px 52px",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    color: hot ? DR.red : DR.muted,
                    fontWeight: 800,
                    fontSize: 13,
                  }}
                >
                  #{idx + 1}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{ color: DR.text, fontWeight: 700, fontSize: 13 }}
                  >
                    {L(r.label)}
                  </div>
                  <div style={{ color: DR.muted, fontSize: 12, marginTop: 2 }}>
                    Most-affected channel: {L(r.channel)}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <DrMono size={13}>{r.contacts}</DrMono>
                  <div style={{ color: DR.muted, fontSize: 11 }}>contacts</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <DrMono size={13} color={sev}>
                    {r.recontact}
                  </DrMono>
                  <div style={{ color: DR.muted, fontSize: 11 }}>recontact</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <DrMono size={13} color={DR.orange}>
                    {r.tone.toFixed(2)}
                  </DrMono>
                  <div style={{ color: DR.muted, fontSize: 11 }}>tone</div>
                </div>
              </div>
              <div
                style={{
                  marginTop: 8,
                  height: 4,
                  borderRadius: 3,
                  background: "rgba(255,255,255,0.06)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${width}%`,
                    height: "100%",
                    background: hot ? DR.red : sev,
                    borderRadius: 3,
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
    <DrCard
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <DrHead sub={data.sub}>{L(data.title)}</DrHead>
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateRows: `repeat(${data.stages.length}, minmax(0, 1fr))`,
          gap: 8,
          minHeight: 0,
        }}
      >
        {data.stages.map((s) => {
          const width = Math.max(18, Math.round((s.volume / max) * 100));
          const col = severityColor(s.status);
          return (
            <div
              key={s.label}
              style={{
                border: `1px solid ${DR.border}`,
                borderRadius: 10,
                padding: "10px 12px",
                background: "rgba(255,255,255,0.02)",
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.1fr) minmax(90px, 1fr) auto",
                gap: 12,
                alignItems: "center",
                minHeight: 0,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: DR.text }}>
                  {L(s.label)}
                </div>
                <div style={{ marginTop: 4, fontSize: 12, color: DR.muted }}>
                  avg {s.avgDays} days
                </div>
              </div>
              <div
                style={{
                  height: 28,
                  borderRadius: 6,
                  background: "rgba(255,255,255,0.06)",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: `${width}%`,
                    height: "100%",
                    borderRadius: 6,
                    background: withAlpha(col, 0.28),
                    borderRight: `2px solid ${col}`,
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: 8,
                    minWidth: 44,
                  }}
                >
                  <DrMono size={14}>{s.volume}</DrMono>
                </div>
              </div>
              <DrBadge color={col}>{s.status}</DrBadge>
            </div>
          );
        })}
      </div>
    </DrCard>
  );
}
