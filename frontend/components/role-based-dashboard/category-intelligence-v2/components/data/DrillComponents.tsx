import React, { useState } from "react";

import type { CategorySignalView } from "../../lib/seedData";
import { SELLER_ROWS } from "../../lib/seedData";
import { SELLER_EXPOSURE, SELLER_GMV_AT_RISK_LAKHS } from "../../lib/categoryDetailData";
import { ChartPanel } from "../common/ChartPanel";
import { cssVar, radius, space, type } from "../../theme/tokens";

const SELLER_FILL_BY_NAME = Object.fromEntries(SELLER_EXPOSURE.map((d) => [d.seller, d.fill]));
const SELLER_TRUST_BY_NAME = Object.fromEntries(SELLER_EXPOSURE.map((d) => [d.seller, d.trust]));

function trustColor(score: number): string {
  if (score < 50) return "#F0606B";
  if (score < 60) return "#E8A23D";
  return "#4FD17A";
}

export function SellerRiskScorecard({
  onSelectSeller,
  selectedId,
}: {
  onSelectSeller: (sellerId: string) => void;
  selectedId: string | null;
}): React.ReactElement {
  const activeRow = SELLER_ROWS.find((r) => r.sellerId === selectedId);
  const activeExposure = activeRow ? SELLER_EXPOSURE.find((e) => e.seller === activeRow.name) : undefined;
  const activeFill = activeRow ? SELLER_FILL_BY_NAME[activeRow.name] ?? cssVar("accent") : cssVar("accent");

  return (
    <ChartPanel
      title="Seller risk scorecard"
      subtitle="Ranked by customer-backed GMV · click row for breakdown"
      subtitlePlacement="header"
      headerEnd={
        <span
          className="lisn-num"
          style={{
            fontSize: type.scale.caption,
            fontWeight: type.weight.bold,
            color: "#F6A93B",
            background: "rgba(246,169,59,0.12)",
            border: "1px solid rgba(246,169,59,0.3)",
            padding: "4px 10px",
            borderRadius: radius.pill,
            whiteSpace: "nowrap",
          }}
        >
          ₹{SELLER_GMV_AT_RISK_LAKHS}L at risk
        </span>
      }
    >
      <div style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: type.scale.small }}>
          <thead>
            <tr>
              {["#", "Seller", "GMV", "Trust", "Complaint cluster", "Conc."].map((h, i) => (
                <th
                  key={h}
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    color: cssVar("text-muted"),
                    textTransform: "uppercase",
                    textAlign: i <= 1 ? "left" : "right",
                    padding: "0 8px 10px",
                    borderBottom: `1px solid ${cssVar("border")}`,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SELLER_ROWS.map((row, index) => {
              const active = selectedId === row.sellerId;
              const fill = SELLER_FILL_BY_NAME[row.name] ?? cssVar("accent");
              const trust = SELLER_TRUST_BY_NAME[row.name] ?? 0;
              const isTopRisk = index === 0;
              return (
                <tr
                  key={row.sellerId}
                  onClick={() => onSelectSeller(row.sellerId)}
                  style={{
                    cursor: "pointer",
                    background: active ? `${fill}12` : "transparent",
                  }}
                >
                  <td
                    style={{
                      padding: "11px 8px",
                      borderBottom: `1px solid ${cssVar("border")}`,
                      borderLeft: active ? `3px solid ${fill}` : "3px solid transparent",
                      fontWeight: 700,
                      color: cssVar("text-muted"),
                      width: 28,
                    }}
                  >
                    {index + 1}
                  </td>
                  <td
                    style={{
                      padding: "11px 8px",
                      borderBottom: `1px solid ${cssVar("border")}`,
                      fontWeight: 600,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: fill, flexShrink: 0 }} />
                      {row.name}
                      {isTopRisk ? (
                        <span
                          style={{
                            fontSize: 8,
                            fontWeight: 700,
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            color: "#F0606B",
                            background: "rgba(240,96,107,0.14)",
                            border: "1px solid rgba(240,96,107,0.35)",
                            padding: "2px 6px",
                            borderRadius: radius.pill,
                          }}
                        >
                          Top risk
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td
                    className="lisn-num"
                    style={{
                      padding: "11px 8px",
                      borderBottom: `1px solid ${cssVar("border")}`,
                      textAlign: "right",
                      fontWeight: 700,
                      color: cssVar("text-primary"),
                    }}
                  >
                    {row.gmvExposure}
                  </td>
                  <td
                    className="lisn-num"
                    style={{
                      padding: "11px 8px",
                      borderBottom: `1px solid ${cssVar("border")}`,
                      textAlign: "right",
                      fontWeight: 700,
                      color: trustColor(trust),
                    }}
                  >
                    {trust}
                  </td>
                  <td
                    style={{
                      padding: "11px 8px",
                      borderBottom: `1px solid ${cssVar("border")}`,
                      textAlign: "right",
                      color: cssVar("text-secondary"),
                      fontSize: type.scale.caption,
                    }}
                  >
                    {row.complaintCluster}
                  </td>
                  <td
                    className="lisn-num"
                    style={{
                      padding: "11px 8px",
                      borderBottom: `1px solid ${cssVar("border")}`,
                      textAlign: "right",
                      color: cssVar("text-muted"),
                      fontSize: type.scale.caption,
                    }}
                  >
                    {row.concentrationPct}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {activeRow && activeExposure ? (
        <div
          style={{
            flexShrink: 0,
            padding: "10px 12px",
            borderRadius: radius.md,
            background: `${activeFill}0D`,
            border: `1px solid ${activeFill}40`,
            borderLeft: `3px solid ${activeFill}`,
          }}
        >
          <div style={{ fontSize: type.scale.caption, fontWeight: type.weight.bold, color: activeFill, marginBottom: 4 }}>
            {activeRow.name} · {activeRow.gmvExposure} GMV · trust {activeExposure.trust}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: space["2"], fontSize: type.scale.caption, color: cssVar("text-secondary"), lineHeight: 1.45 }}>
            <span>SLA breach: {activeRow.slaBreach}</span>
            <span>Repeat contact: {activeRow.repeatContact}</span>
            <span>Cluster: {activeRow.complaintCluster}</span>
            <span>Concentration: {activeRow.concentrationPct}% / 25% FDI cap</span>
          </div>
        </div>
      ) : null}
    </ChartPanel>
  );
}

export function OwnershipBoard({
  onSelectSeller,
  selectedId,
}: {
  onSelectSeller: (sellerId: string) => void;
  selectedId: string | null;
}): React.ReactElement {
  return (
    <div style={{ border: `1px solid ${cssVar("border")}`, borderRadius: radius.md, overflow: "hidden" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.6fr 0.8fr 1fr 0.7fr 0.8fr",
          gap: 6,
          padding: "6px 10px",
          background: cssVar("surface-raised"),
          fontSize: 9,
          fontWeight: 700,
          color: cssVar("text-muted"),
          textTransform: "uppercase",
        }}
      >
        <span>Seller</span>
        <span>Tier</span>
        <span>GMV exposure</span>
        <span>Complaint cluster</span>
        <span>Repeat contact</span>
        <span>Concentration</span>
      </div>
      {SELLER_ROWS.map((row) => {
        const active = selectedId === row.sellerId;
        return (
          <button
            key={row.sellerId}
            type="button"
            onClick={() => onSelectSeller(row.sellerId)}
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 0.6fr 0.8fr 1fr 0.7fr 0.8fr",
              gap: 6,
              width: "100%",
              padding: "6px 10px",
              border: "none",
              borderTop: `1px solid ${cssVar("border")}`,
              background: active ? cssVar("accent-soft") : cssVar("surface"),
              cursor: "pointer",
              textAlign: "left",
              fontSize: 12,
              color: cssVar("text-primary"),
            }}
          >
            <span style={{ fontWeight: 600 }}>{row.name}</span>
            <span>{row.tier}</span>
            <span className="lisn-num">{row.gmvExposure}</span>
            <span style={{ color: cssVar("text-secondary") }}>{row.complaintCluster}</span>
            <span className="lisn-num">{row.repeatContact}</span>
            <span className="lisn-num">{row.concentrationPct}% / 25% cap</span>
          </button>
        );
      })}
    </div>
  );
}

export function SellerDetailPanel({ sellerId }: { sellerId: string }): React.ReactElement {
  const row = SELLER_ROWS.find((r) => r.sellerId === sellerId);
  if (!row) return <div />;
  return (
    <div className="lisn-anim-drill" style={{ padding: "8px 10px", borderRadius: radius.md, border: `1px solid ${cssVar("border")}`, background: cssVar("surface") }}>
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{row.name} breakdown</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 12, color: cssVar("text-secondary") }}>
        <div>SLA breach: {row.slaBreach}</div>
        <div>Concentration: {row.concentrationPct}% vs 25% FDI cap</div>
        <div>Complaint cluster: {row.complaintCluster}</div>
        <div>Repeat contact: {row.repeatContact}</div>
      </div>
    </div>
  );
}

export function VoiceThemeSplit(): React.ReactElement {
  return (
    <div style={{ padding: space["4"], borderRadius: radius.md, border: `1px solid ${cssVar("border")}`, background: cssVar("surface") }}>
      <div style={{ fontSize: type.scale.body, fontWeight: type.weight.bold, marginBottom: space["2"] }}>Voice theme split</div>
      <div style={{ display: "flex", height: 28, borderRadius: radius.sm, overflow: "hidden", marginBottom: 10 }}>
        <div style={{ width: "70%", background: cssVar("accent"), color: "#fff", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>
          Delivery 70%
        </div>
        <div style={{ width: "30%", background: cssVar("border-strong"), fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
          Product 30%
        </div>
      </div>
      <p style={{ fontSize: 13, color: cssVar("text-secondary"), margin: 0 }}>
        Verdict owner: <strong>Operations (logistics)</strong> — seller penalty held · confidence High
      </p>
    </div>
  );
}

export function FaultSplitCard(): React.ReactElement {
  return (
    <div style={{ padding: "8px 10px", borderRadius: radius.md, border: `1px solid ${cssVar("border")}`, background: cssVar("surface") }}>
      <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Warehouse vs seller fault split</div>
      <div style={{ fontSize: 11, color: cssVar("text-secondary"), lineHeight: 1.4 }}>
        Warehouse / pick-pack exception: elevated on NCR outbound · Seller sub-standard goods: 30% voice share — not deciding
      </div>
    </div>
  );
}

export function AspectCliffPanel({ signal }: { signal: CategorySignalView }): React.ReactElement {
  return (
    <div style={{ padding: 16, borderRadius: radius.md, border: `1px solid ${cssVar("border")}`, background: cssVar("surface") }}>
      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Aspect cliff — leading indicator</div>
      <p style={{ fontSize: 13, color: cssVar("text-secondary"), lineHeight: 1.5 }}>{signal.stats}</p>
      <p style={{ fontSize: 12, color: cssVar("text-muted"), marginTop: 8 }}>Slope vs trailing mix — not the star average · conversion overlay with correlation band</p>
    </div>
  );
}

export function PromoHealthGate({ signal }: { signal: CategorySignalView }): React.ReactElement {
  return (
    <div style={{ padding: 16, borderRadius: radius.md, border: `1px solid ${cssVar("severity-med")}`, background: cssVar("surface") }}>
      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Promo health gate — do not promote</div>
      <p style={{ fontSize: 13, color: cssVar("text-secondary") }}>{signal.stats}</p>
      <div style={{ marginTop: 12, padding: "8px 12px", borderRadius: radius.sm, background: cssVar("severity-high"), color: "#fff", fontSize: 12, fontWeight: 700, width: "fit-content" }}>
        Verdict: Do not promote · redirect ₹3.4L
      </div>
    </div>
  );
}

export function LostDemandPanel({ signal }: { signal: CategorySignalView }): React.ReactElement {
  return (
    <div style={{ padding: 16, borderRadius: radius.md, border: `1px solid ${cssVar("border")}`, background: cssVar("surface") }}>
      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Stockout — lost demand</div>
      <p style={{ fontSize: 13, color: cssVar("text-secondary") }}>{signal.stats}</p>
    </div>
  );
}

export function RealVsFailureVerdictCard({ signal }: { signal: CategorySignalView }): React.ReactElement {
  const [tier, setTier] = useState("conservative");
  return (
    <div style={{ padding: "8px 10px", borderRadius: radius.md, border: `1px solid ${cssVar("border")}`, background: cssVar("surface") }}>
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Real demand vs failure verdict</div>
      <p style={{ fontSize: 11, color: cssVar("text-secondary"), lineHeight: 1.4 }}>{signal.stats}</p>
      <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
        {["conservative", "standard", "aggressive"].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTier(t)}
            style={{
              padding: "6px 12px",
              borderRadius: radius.sm,
              border: `1px solid ${tier === t ? cssVar("accent") : cssVar("border")}`,
              background: tier === t ? cssVar("accent-soft") : "transparent",
              fontSize: 11,
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {t}
          </button>
        ))}
      </div>
      <p style={{ fontSize: 12, color: cssVar("text-muted"), marginTop: 10 }}>Confidence: {signal.confidence} · {signal.regimeBadge}</p>
    </div>
  );
}

export function DefectWaveCard(): React.ReactElement {
  return (
    <div style={{ padding: "8px 10px", borderRadius: radius.md, border: `1px solid ${cssVar("border")}`, background: cssVar("surface") }}>
      <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Defect wave — quick-commerce</div>
      <p style={{ fontSize: 11, color: cssVar("text-secondary"), margin: 0, lineHeight: 1.4 }}>
        Return-initiation spike co-moving with care defect transcript theme — early recall signal on perishables.
      </p>
    </div>
  );
}

export function SuppressedNearMissInline(): React.ReactElement {
  return (
    <div style={{ marginTop: 0, padding: "6px 8px", borderRadius: radius.sm, border: `1px dashed ${cssVar("border")}`, opacity: 0.75 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: cssVar("text-muted") }}>Suppressed near-miss (inline)</div>
      <p style={{ fontSize: 12, color: cssVar("text-secondary"), margin: "6px 0 0" }}>
        4× tee spike — expected sale-day demand, no failure voice — held below escalation threshold.
      </p>
    </div>
  );
}
