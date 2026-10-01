"use client";

import signal from "@kgs2/data/signal_pr01.json";
import { useDemo2, useLabel2, withTs } from "@kgs2/lib/demoState";
import { X } from "lucide-react";
import { type CSSProperties, useEffect, useMemo } from "react";
import {
  K,
  withAlpha,
} from "@/components/role-based-dashboard/kgs/shared/tokens";
import { SyntheticBadge } from "../shared/SyntheticBadge";

export type PromiseEvidenceTab =
  | "snippets"
  | "order_lines"
  | "distributors"
  | "method";

export function PromiseEvidenceDrawer({
  tab,
  onTab,
  onClose,
}: {
  tab: PromiseEvidenceTab | null;
  onTab: (t: PromiseEvidenceTab) => void;
  onClose: () => void;
}) {
  const L = useLabel2();
  const { state } = useDemo2();
  const open = tab != null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const snippets = useMemo(() => {
    const featured = signal.snippets
      .filter((s) => s.featured)
      .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99));
    const rest = signal.snippets.filter((s) => !s.featured);
    return [...featured, ...rest];
  }, []);

  const northDistributors = useMemo(() => {
    const fromLines = signal.orderLines.reduce<
      Record<string, { lines: number; slips: number[] }>
    >((acc, ol) => {
      const key = ol.distributor;
      if (!acc[key]) acc[key] = { lines: 0, slips: [] };
      acc[key].lines += 1;
      acc[key].slips.push(ol.slipDays);
      return acc;
    }, {});
    return Object.entries(fromLines).map(([partner, v]) => ({
      partner,
      lines: v.lines,
      avgSlip:
        Math.round((v.slips.reduce((a, b) => a + b, 0) / v.slips.length) * 10) /
        10,
    }));
  }, []);

  const approvalTs = state.approvals["PR-01"]?.ts;
  const askTs = state.decisionRequested["PR-01"]?.ts;

  if (!open || !tab) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 90,
        display: "flex",
        justifyContent: "flex-end",
        background: "rgba(0,0,0,0.45)",
      }}
    >
      <button
        type="button"
        aria-label="Close evidence"
        className="kgs2-focus"
        onClick={onClose}
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
        aria-label="Evidence drawer"
        style={{
          position: "relative",
          width: "min(560px, 100%)",
          height: "100%",
          background: K.page,
          borderLeft: `1px solid ${K.borderLight}`,
          display: "flex",
          flexDirection: "column",
          boxShadow: "-12px 0 40px rgba(0,0,0,0.4)",
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 16px",
            borderBottom: `1px solid ${K.borderLight}`,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>
            Evidence · PR-01
          </h2>
          <button
            type="button"
            aria-label="Close evidence"
            onClick={onClose}
            className="kgs2-focus"
            style={{
              background: "none",
              border: "none",
              color: K.textMut,
              cursor: "pointer",
              padding: 4,
            }}
          >
            <X size={18} />
          </button>
        </header>

        <div
          role="tablist"
          style={{
            display: "flex",
            gap: 4,
            padding: "10px 12px",
            borderBottom: `1px solid ${K.borderLight}`,
            flexWrap: "wrap",
          }}
        >
          {signal.evidenceDrawerTabs.map((t) => {
            const id = t.id as PromiseEvidenceTab;
            const on = tab === id;
            const count = t.count != null ? ` ${t.count}` : "";
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={on}
                className="kgs2-focus"
                onClick={() => onTab(id)}
                style={{
                  padding: "6px 10px",
                  borderRadius: 8,
                  border: "none",
                  background: on ? K.brandTint : "transparent",
                  color: on ? K.violet300 : K.textSec,
                  fontSize: 12,
                  fontWeight: on ? 700 : 500,
                  fontFamily: "inherit",
                  cursor: "pointer",
                }}
              >
                {t.label}
                {count}
              </button>
            );
          })}
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
          {tab === "snippets" ? (
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {snippets.map((s, i) => (
                <li
                  key={s.id}
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    background: s.featured
                      ? withAlpha(K.violet400, 0.08)
                      : K.surface,
                    border: `1px solid ${
                      s.featured ? withAlpha(K.violet400, 0.35) : K.borderLight
                    }`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: K.textMut,
                      marginBottom: 6,
                      fontFamily: K.mono,
                    }}
                  >
                    {s.featured ? `#${i + 1} · ` : ""}
                    {s.channelLabel} · {L(s.partnerId ?? "")} ·{" "}
                    {s.localDateLabel}
                  </div>
                  <div style={{ fontSize: 14, color: K.text, lineHeight: 1.5 }}>
                    “{L(s.text)}”
                  </div>
                </li>
              ))}
            </ul>
          ) : null}

          {tab === "order_lines" ? (
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
                    {[
                      "Line",
                      "Distributor",
                      "Family",
                      "Original",
                      "Revised",
                      "Slip",
                      "Cause",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left",
                          padding: "6px 8px",
                          color: K.textMut,
                          borderBottom: `1px solid ${K.borderLight}`,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {signal.orderLines.map((ol) => (
                    <tr key={ol.id}>
                      <td style={cell}>{ol.id}</td>
                      <td style={cell}>{L(ol.distributor)}</td>
                      <td style={cell}>{ol.family}</td>
                      <td style={cell}>{ol.originalDate}</td>
                      <td style={cell}>{ol.revisedDate}</td>
                      <td style={cell}>{ol.slipDays}d</td>
                      <td style={cell}>{ol.candidateCause}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {tab === "distributors" ? (
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {northDistributors.map((d) => (
                <li
                  key={d.partner}
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    background: K.surface,
                    border: `1px solid ${K.borderLight}`,
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 14 }}>
                    {L(d.partner)}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: K.textMut,
                      marginTop: 4,
                      fontFamily: K.mono,
                    }}
                  >
                    {d.lines} order lines · avg slip {d.avgSlip} days
                  </div>
                </li>
              ))}
            </ul>
          ) : null}

          {tab === "method" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <section>
                <h3 style={h3}>Method</h3>
                <p style={p}>
                  Promise kept = delivered on or before the original confirmed
                  date. Cause split is a LiSN candidate read from contact text
                  joined to ERP order lines; the Operations lead confirms.
                </p>
                <p style={p}>
                  Confidence: {signal.confidence.short}. Source independence{" "}
                  {signal.confidence.sourceIndependence.scoreDisplay} (
                  {signal.confidence.sourceIndependence.partners} distributors,{" "}
                  {signal.confidence.sourceIndependence.channels} channels).
                </p>
              </section>
              <section>
                <h3 style={h3}>Audit</h3>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: 18,
                    color: K.body,
                    fontSize: 13,
                    lineHeight: 1.6,
                  }}
                >
                  <li>Seeded investigation PR-01 · status Open</li>
                  {askTs ? (
                    <li>
                      {withTs(
                        signal.humanGate.decisionRequest.auditEntry,
                        askTs,
                      )}
                    </li>
                  ) : null}
                  {approvalTs ? (
                    <li>
                      {withTs(
                        signal.humanGate.onApprove.auditEntry,
                        approvalTs,
                      )}
                    </li>
                  ) : (
                    <li style={{ color: K.textMut }}>No approval logged yet</li>
                  )}
                </ul>
              </section>
            </div>
          ) : null}
        </div>
        <div
          style={{
            padding: "10px 16px",
            borderTop: `1px solid ${K.borderLight}`,
          }}
        >
          <SyntheticBadge compact />
        </div>
      </div>
    </div>
  );
}

const cell: CSSProperties = {
  padding: "6px 8px",
  borderBottom: `1px solid ${K.borderLight}`,
  color: K.body,
  fontFamily: K.mono,
  whiteSpace: "nowrap",
};

const h3: CSSProperties = {
  margin: "0 0 8px",
  fontSize: 13,
  fontWeight: 700,
  color: K.text,
};

const p: CSSProperties = {
  margin: "0 0 8px",
  fontSize: 13,
  color: K.body,
  lineHeight: 1.5,
};
