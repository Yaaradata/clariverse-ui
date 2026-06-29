import React, { useState } from "react";

import type { CategorySignalView } from "../../lib/seedData";
import { SELLER_ROWS } from "../../lib/seedData";
import { cssVar, radius } from "../../theme/tokens";

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
          gap: 8,
          padding: "10px 14px",
          background: cssVar("surface-raised"),
          fontSize: 10,
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
              gap: 8,
              width: "100%",
              padding: "12px 14px",
              border: "none",
              borderTop: `1px solid ${cssVar("border")}`,
              background: active ? cssVar("accent-soft") : cssVar("surface"),
              cursor: "pointer",
              textAlign: "left",
              fontSize: 13,
              color: cssVar("text-primary"),
            }}
          >
            <span style={{ fontWeight: 600 }}>{row.name}</span>
            <span>{row.tier}</span>
            <span className="lisn-cat-num">{row.gmvExposure}</span>
            <span style={{ color: cssVar("text-secondary") }}>{row.complaintCluster}</span>
            <span className="lisn-cat-num">{row.repeatContact}</span>
            <span className="lisn-cat-num">{row.concentrationPct}% / 25% cap</span>
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
    <div className="lisn-cat-anim-drill" style={{ marginTop: 16, padding: 16, borderRadius: radius.md, border: `1px solid ${cssVar("border")}`, background: cssVar("surface") }}>
      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>{row.name} breakdown</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 13, color: cssVar("text-secondary") }}>
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
    <div style={{ padding: 16, borderRadius: radius.md, border: `1px solid ${cssVar("border")}`, background: cssVar("surface") }}>
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Voice theme split</div>
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
    <div style={{ padding: 16, borderRadius: radius.md, border: `1px solid ${cssVar("border")}`, background: cssVar("surface") }}>
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Warehouse vs seller fault split</div>
      <div style={{ fontSize: 13, color: cssVar("text-secondary"), lineHeight: 1.5 }}>
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
    <div style={{ padding: 16, borderRadius: radius.md, border: `1px solid ${cssVar("border")}`, background: cssVar("surface") }}>
      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Real demand vs failure verdict</div>
      <p style={{ fontSize: 13, color: cssVar("text-secondary") }}>{signal.stats}</p>
      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
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
    <div style={{ padding: 16, borderRadius: radius.md, border: `1px solid ${cssVar("border")}`, background: cssVar("surface") }}>
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Defect wave — quick-commerce</div>
      <p style={{ fontSize: 13, color: cssVar("text-secondary"), margin: 0 }}>
        Return-initiation spike co-moving with care defect transcript theme — early recall signal on perishables.
      </p>
    </div>
  );
}

export function SuppressedNearMissInline(): React.ReactElement {
  return (
    <div style={{ marginTop: 12, padding: 12, borderRadius: radius.sm, border: `1px dashed ${cssVar("border")}`, opacity: 0.75 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: cssVar("text-muted") }}>Suppressed near-miss (inline)</div>
      <p style={{ fontSize: 12, color: cssVar("text-secondary"), margin: "6px 0 0" }}>
        4× tee spike — expected sale-day demand, no failure voice — held below escalation threshold.
      </p>
    </div>
  );
}
