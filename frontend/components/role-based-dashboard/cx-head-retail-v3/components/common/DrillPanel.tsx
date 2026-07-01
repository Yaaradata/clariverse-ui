import React from "react";
import { X } from "lucide-react";
import {
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DrillSignature, RadarSignal } from "../../lib/cxHeadRetailData";
import {
  BRIDGE_ACTIONS,
  BRIDGE_TILES,
  COMPLIANCE_ACTIONS,
  CX_QUALITY_ACTIONS,
  DARK_PATTERN_EVIDENCE,
  DARK_STORES,
  getBridgeEvidenceById,
  getRadarSignalById,
  getStatutoryItemById,
  getStatutoryClockDrillQueue,
  OUTBREAK_EVIDENCE,
  QUICK_COMMERCE_ACTIONS,
  SELLER_TRUST_EVIDENCE,
  STATUTORY_CLOCK_RUNWAYS,
  SUPPRESSION_EVIDENCE,
} from "../../lib/cxHeadRetailData";
import { AiMarker } from "./AiMarker";
import { ConfidenceBand } from "./ConfidenceBand";
import { DraftActionFooter } from "./DraftActionFooter";
import { cssVar, radius } from "../../theme/tokens";

type DrillPanelProps = {
  itemId: string;
  drillSignature: DrillSignature;
  onClose: () => void;
};

export function DrillPanel({ itemId, drillSignature, onClose }: DrillPanelProps): React.ReactElement {
  const signal = getRadarSignalById(itemId);
  const bridge = BRIDGE_TILES.find((b) => b.id === itemId);

  return (
    <aside
      className="lisn-anim-drill"
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "min(480px, 92vw)",
        height: "100vh",
        background: cssVar("surface"),
        borderLeft: `1px solid ${cssVar("border-strong")}`,
        boxShadow: cssVar("shadow-pop"),
        zIndex: 40,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "16px 18px",
          borderBottom: `1px solid ${cssVar("border")}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 700, color: cssVar("text-primary") }}>Evidence pack</div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close drill"
          style={{ background: "none", border: "none", cursor: "pointer", color: cssVar("text-muted") }}
        >
          <X size={18} />
        </button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px 32px" }}>
        <DrillSignatureBody
          drillSignature={drillSignature}
          itemId={itemId}
          signal={signal}
          bridge={bridge}
        />
      </div>
    </aside>
  );
}

function DrillSignatureBody({
  drillSignature,
  itemId,
  signal,
  bridge,
}: {
  drillSignature: DrillSignature;
  itemId: string;
  signal?: RadarSignal;
  bridge?: (typeof BRIDGE_TILES)[number];
}): React.ReactElement {
  switch (drillSignature) {
    case "radar-corroboration":
      return signal ? <RadarCorroborationDrill signal={signal} /> : <MissingPack itemId={itemId} />;
    case "geo-outbreak":
      return <GeoOutbreakDrill itemId={itemId} signal={signal} />;
    case "statutory-queue":
      return <StatutoryQueueDrill itemId={itemId} />;
    case "compliance-evidence":
      return <ComplianceEvidenceDrill />;
    case "inverse-anomaly":
      return <InverseAnomalyDrill signal={signal} />;
    case "entity-velocity":
      return <EntityVelocityDrill itemId={itemId} />;
    case "bridge":
      return bridge ? <BridgeDrill tile={bridge} /> : <MissingPack itemId={itemId} />;
    default: {
      const _exhaustive: never = drillSignature;
      return _exhaustive;
    }
  }
}

function RadarCorroborationDrill({ signal }: { signal: RadarSignal }): React.ReactElement {
  return (
    <>
      <Section title="Corroboration funnel">
        <p className="lisn-num" style={{ fontSize: 14, color: cssVar("text-primary"), fontWeight: 600 }}>
          {signal.mentions.toLocaleString("en-IN")} mentions → {signal.signalsDistilled} signal
        </p>
        <ul style={{ margin: "12px 0 0", paddingLeft: 18, color: cssVar("text-secondary"), fontSize: 13, lineHeight: 1.6 }}>
          {signal.channels.map((c) => (
            <li key={`${c.name}-${c.time}`}>
              {c.name} — first seen {c.time}
            </li>
          ))}
        </ul>
      </Section>
      {signal.evidence?.snippets && (
        <Section title="Corpus snippets">
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: cssVar("text-secondary"), lineHeight: 1.55 }}>
            {signal.evidence.snippets.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </Section>
      )}
      <Section title="Ruled out">
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: cssVar("text-secondary"), lineHeight: 1.6 }}>
          {(signal.evidence?.ruledOut ?? ["Single-channel decoy suppressed"]).map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </Section>
      <AiLine text={signal.aiVerdict} />
      <div style={{ marginBottom: 16 }}>
        <ConfidenceBand band={signal.confidence} />
      </div>
      <DraftActionFooter draftText={signal.draftAction} draftKind={signal.draftKind} />
    </>
  );
}

function GeoOutbreakDrill({ itemId, signal }: { itemId: string; signal?: RadarSignal }): React.ReactElement {
  const store = DARK_STORES.find((d) => d.id === itemId) ?? DARK_STORES[0];
  const evidence = OUTBREAK_EVIDENCE[itemId] ?? OUTBREAK_EVIDENCE["DS-BLR-D07"];
  const peers = DARK_STORES.filter((d) => d.id !== store.id);

  return (
    <>
      <Section title="D07 vs peers (normalised)">
        <p style={{ fontSize: 13, color: cssVar("text-secondary"), lineHeight: 1.5 }}>
          {store.label} reads {store.peerMultiple}× its own baseline; {peers.filter((p) => p.status === "flat" || p.status === "nominal").length} peers hold flat.
        </p>
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: cssVar("severity-high") }}>
            <span>{store.label}</span>
            <span className="lisn-num">{store.issueRate.toFixed(1)} / 1k · {store.peerMultiple}×</span>
          </div>
          {peers.map((d) => (
            <div key={d.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
              <span style={{ color: cssVar("text-secondary") }}>{d.label}</span>
              <span className="lisn-num" style={{ color: cssVar("text-muted") }}>
                {d.issueRate.toFixed(1)} / 1k · {d.peerMultiple}×
              </span>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Issue-type split">
        <p className="lisn-num" style={{ fontSize: 13, color: cssVar("text-secondary") }}>
          Missing {evidence.issueSplit.missing} · Spoiled {evidence.issueSplit.spoiled} · Late {evidence.issueSplit.late} (per 1k orders)
        </p>
      </Section>
      <Section title="Node snippets">
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: cssVar("text-secondary"), lineHeight: 1.55 }}>
          {evidence.snippets.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </Section>
      <Section title="Ruled out">
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: cssVar("text-secondary"), lineHeight: 1.6 }}>
          {evidence.ruledOut.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </Section>
      <AiLine text={signal?.aiVerdict ?? "Picker/pack/substitution-layer failure at D07 — not city-wide."} />
      <div style={{ marginBottom: 16 }}>
        <ConfidenceBand band={signal?.confidence ?? "High"} />
      </div>
      <DraftActionFooter
        draftText={QUICK_COMMERCE_ACTIONS.opsAlert}
        draftKind="draft"
      />
    </>
  );
}

function StatutoryQueueDrill({ itemId }: { itemId: string }): React.ReactElement {
  if (itemId === "statutory-clock") {
    const queue = getStatutoryClockDrillQueue();
    const withinSixCount = queue.filter((q) => {
      const runway = STATUTORY_CLOCK_RUNWAYS.find((r) => r.id === q.id);
      return runway !== undefined && runway.hoursLeft <= 6;
    }).length;

    return (
      <>
        <Section title="Consumer-rights deadline queue">
          <p style={{ fontSize: 13, color: cssVar("text-secondary"), lineHeight: 1.5 }}>
            {withinSixCount} within 6h of deadline · {queue.length} in the re-ranked queue above time-waiting.
          </p>
        </Section>
        <Section title="Re-ranked rows">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {queue.map((row, index) => {
              const runway = STATUTORY_CLOCK_RUNWAYS.find((r) => r.id === row.id);
              const withinSix = runway !== undefined && runway.hoursLeft <= 6;
              return (
                <div
                  key={row.id}
                  style={{
                    padding: "10px 12px",
                    borderRadius: radius.md,
                    background: cssVar("surface-raised"),
                    border: `1px solid ${withinSix ? `${cssVar("severity-high")}44` : cssVar("border")}`,
                    borderLeft: `3px solid ${withinSix ? cssVar("severity-high") : cssVar("severity-med")}`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start" }}>
                    <span className="lisn-num" style={{ fontSize: 12, fontWeight: 800, color: cssVar("text-primary") }}>
                      #{index + 1} · {row.id}
                    </span>
                    <span
                      className="lisn-num"
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: withinSix ? cssVar("severity-high") : cssVar("text-muted"),
                        flexShrink: 0,
                      }}
                    >
                      {row.countdown}
                    </span>
                  </div>
                  <p style={{ margin: "6px 0 0", fontSize: 13, fontWeight: 600, color: cssVar("text-primary") }}>
                    &quot;{row.keyword}&quot;
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: 11, color: cssVar("text-muted") }}>{row.regulation}</p>
                  <p style={{ margin: "6px 0 0", fontSize: 12, color: cssVar("text-secondary") }}>{row.stallState}</p>
                </div>
              );
            })}
          </div>
        </Section>
        <Section title="Routing rule">
          <p style={{ fontSize: 13, color: cssVar("text-secondary"), lineHeight: 1.5 }}>
            Statutory keyword + clock proximity override FIFO — human approve before external route.
          </p>
        </Section>
        <AiLine text="Marketplace refund-policy complaints approaching statutory response windows." />
        <div style={{ marginBottom: 16 }}>
          <ConfidenceBand band="High" />
        </div>
        <DraftActionFooter draftText={COMPLIANCE_ACTIONS.priorityAlert} draftKind="draft" />
      </>
    );
  }

  const item = getStatutoryItemById(itemId) ?? getStatutoryItemById("GRV-0412")!;

  return (
    <>
      <Section title="Re-ranked queue row">
        <p style={{ fontSize: 13, color: cssVar("text-secondary") }}>
          Statutory keyword + clock proximity override time-waiting.
        </p>
        <p
          className="lisn-num"
          style={{ fontSize: 14, fontWeight: 700, color: cssVar("severity-high"), marginTop: 10 }}
        >
          {item.id} · {item.countdown}
        </p>
        <p style={{ fontSize: 13, color: cssVar("text-primary"), marginTop: 8, fontWeight: 600 }}>
          Keyword: &quot;{item.keyword}&quot;
        </p>
        <p style={{ fontSize: 12, color: cssVar("text-muted"), marginTop: 6 }}>{item.regulation}</p>
        <p style={{ fontSize: 12, color: cssVar("text-secondary"), marginTop: 8 }}>{item.stallState}</p>
      </Section>
      <Section title="Audit trail">
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: cssVar("text-secondary"), lineHeight: 1.6 }}>
          {item.auditTrail.map((entry) => (
            <li key={entry}>{entry}</li>
          ))}
        </ul>
      </Section>
      <AiLine text="Explicit trigger — audit log is the compliance feature." />
      <div style={{ marginBottom: 16 }}>
        <ConfidenceBand band="High" />
      </div>
      <DraftActionFooter draftText={COMPLIANCE_ACTIONS.priorityAlert} draftKind="draft" />
    </>
  );
}

function ComplianceEvidenceDrill(): React.ReactElement {
  const d = DARK_PATTERN_EVIDENCE;
  return (
    <>
      <Section title="Named instrument match">
        <p style={{ fontSize: 15, fontWeight: 700, color: cssVar("text-primary") }}>{d.instrument}</p>
        <p className="lisn-num" style={{ fontSize: 13, color: cssVar("text-secondary"), marginTop: 10 }}>
          {d.evidenceCount} corroborated complaints
        </p>
        <p style={{ fontSize: 13, color: cssVar("text-secondary"), marginTop: 8 }}>Surface: {d.surfaceRef}</p>
      </Section>
      <Section title="Fact-pattern library">
        <p style={{ fontSize: 13, color: cssVar("text-secondary"), lineHeight: 1.5 }}>{d.factPattern}</p>
      </Section>
      <Section title="Routing guardrail">
        <p style={{ fontSize: 13, color: cssVar("text-secondary") }}>
          Internal Legal only — not for external circulation or filing.
        </p>
      </Section>
      <AiLine text={d.aiVerdict} />
      <div style={{ marginBottom: 16 }}>
        <ConfidenceBand band={d.confidence} />
      </div>
      <DraftActionFooter draftText={COMPLIANCE_ACTIONS.regulatoryCard} draftKind="prepare" />
    </>
  );
}

function InverseAnomalyDrill({ signal }: { signal?: RadarSignal }): React.ReactElement {
  const e = SUPPRESSION_EVIDENCE;
  const chartData = e.weeklySeries.map((p) => ({
    label: p.label,
    tickets: p.ticketVolume,
    cpo: p.contactPerOrder,
    accessChange: p.accessChange ?? false,
  }));
  const accessWeek = e.weeklySeries.find((p) => p.accessChange)?.label;

  return (
    <>
      <Section title="Falling ticket line (shown red)">
        <p className="lisn-num" style={{ fontSize: 14, fontWeight: 700, color: cssVar("severity-high") }}>
          Raw tickets {e.ticketDropPct} · Electronics category
        </p>
        <div style={{ marginTop: 12, height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={cssVar("border")} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: cssVar("text-muted") }} axisLine={false} tickLine={false} />
              <YAxis
                yAxisId="tickets"
                orientation="left"
                tick={{ fontSize: 11, fill: cssVar("severity-high") }}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <YAxis
                yAxisId="cpo"
                orientation="right"
                domain={[13.5, 14.8]}
                tick={{ fontSize: 11, fill: cssVar("accent") }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <Tooltip
                contentStyle={{
                  background: cssVar("surface-raised"),
                  border: `1px solid ${cssVar("border")}`,
                  borderRadius: radius.sm,
                  fontSize: 12,
                }}
              />
              {accessWeek && (
                <ReferenceLine
                  x={accessWeek}
                  yAxisId="tickets"
                  stroke={cssVar("severity-med")}
                  strokeDasharray="4 4"
                  label={{
                    value: "Access change",
                    position: "insideTopRight",
                    fill: cssVar("severity-med"),
                    fontSize: 10,
                  }}
                />
              )}
              <Line
                yAxisId="tickets"
                type="monotone"
                dataKey="tickets"
                stroke={cssVar("severity-high")}
                strokeWidth={2.5}
                dot={{ r: 3, fill: cssVar("severity-high") }}
                isAnimationActive={false}
                name="Ticket volume"
              />
              <Line
                yAxisId="cpo"
                type="monotone"
                dataKey="cpo"
                stroke={cssVar("accent")}
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={{ r: 3, fill: cssVar("accent") }}
                isAnimationActive={false}
                name="Contact / 1k orders"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <p style={{ fontSize: 11, color: cssVar("text-muted"), marginTop: 8 }}>
          <span style={{ color: cssVar("severity-high"), fontWeight: 600 }}>Red</span> = raw tickets ·{" "}
          <span style={{ color: cssVar("accent"), fontWeight: 600 }}>Dashed</span> = order-normalised overlay
        </p>
      </Section>

      <Section title="Order-normalised overlay — improvement vanishes">
        <p style={{ fontSize: 13, color: cssVar("text-secondary"), lineHeight: 1.5 }}>
          Contact-per-order holds at {e.contactPerOrderLabel}. The apparent ticket drop is not explained by fewer orders —
          Electronics order volume is flat-to-up in the same window.
        </p>
      </Section>

      <Section title="Support-access change marker">
        <p style={{ fontSize: 13, fontWeight: 600, color: cssVar("severity-med") }}>{e.accessChange.label}</p>
        <p style={{ fontSize: 12, color: cssVar("text-muted"), marginTop: 4 }}>{e.accessChange.when}</p>
        <p style={{ fontSize: 13, color: cssVar("text-secondary"), marginTop: 8, lineHeight: 1.45 }}>
          {e.accessChange.detail}
        </p>
      </Section>

      <Section title="Ruled out">
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: cssVar("text-secondary"), lineHeight: 1.6 }}>
          {e.ruledOut.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </Section>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, color: cssVar("text-muted"), textTransform: "uppercase", marginBottom: 8 }}>
          Evidence-backed status
        </div>
        <p style={{ margin: "0 0 8px", fontSize: 13, color: cssVar("text-secondary"), lineHeight: 1.45 }}>
          {e.statusVerdict}
        </p>
        <ConfidenceBand band={signal?.confidence ?? "Med-High"} />
      </div>

      <AiLine text={signal?.aiVerdict ?? "A warning, not a win — chat entry point moved same week."} />
      <DraftActionFooter
        draftText={signal?.draftAction ?? CX_QUALITY_ACTIONS.suppressionWarning}
        draftKind={signal?.draftKind ?? "route"}
      />
    </>
  );
}

function EntityVelocityDrill({ itemId }: { itemId: string }): React.ReactElement {
  const evidence = itemId === "audiomax" ? SELLER_TRUST_EVIDENCE : null;

  return (
    <>
      <Section title="Entity velocity break">
        <p style={{ fontSize: 13, color: cssVar("text-secondary"), lineHeight: 1.5 }}>
          {evidence?.sellerLabel ?? "Seller cohort"} — {evidence?.theme ?? "neg-review velocity break"}.
        </p>
        <p className="lisn-num" style={{ fontSize: 13, color: cssVar("text-primary"), marginTop: 10, fontWeight: 600 }}>
          {evidence?.velocityBreak ?? "Velocity break ahead of star average"}
        </p>
        <p style={{ fontSize: 12, color: cssVar("accent"), marginTop: 8, fontWeight: 600 }}>
          {evidence?.integrityNote ?? "Integrity-cleared"}
        </p>
      </Section>
      {evidence && (
        <>
          <Section title="Corpus snippets">
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: cssVar("text-secondary"), lineHeight: 1.55 }}>
              {evidence.snippets.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </Section>
          <Section title="Ruled out">
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: cssVar("text-secondary"), lineHeight: 1.6 }}>
              {evidence.ruledOut.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </Section>
        </>
      )}
      <Section title="Risk-review gate">
        <p style={{ fontSize: 13, color: cssVar("text-secondary") }}>
          Gated to risk review — route never auto-acts on seller-health actions.
        </p>
      </Section>
      <AiLine text="Organic spread · not brigading — integrity guard passed before surfacing." />
      <div style={{ marginBottom: 16 }}>
        <ConfidenceBand band="Med-High" />
      </div>
      <DraftActionFooter
        draftText={evidence?.draftAction ?? CX_QUALITY_ACTIONS.sellerTrust}
        draftKind="route"
      />
    </>
  );
}

function BridgeDrill({ tile }: { tile: (typeof BRIDGE_TILES)[number] }): React.ReactElement {
  const evidence = getBridgeEvidenceById(tile.id);

  return (
    <>
      <Section title="Split join view">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: 10,
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              padding: 12,
              borderRadius: radius.md,
              background: cssVar("accent-soft"),
              border: `1px solid ${cssVar("accent")}44`,
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 700, color: cssVar("accent"), textTransform: "uppercase", letterSpacing: 0.4 }}>
              CX signal cohort
            </div>
            <p style={{ margin: "8px 0 0", fontSize: 13, color: cssVar("text-primary"), fontWeight: 600, lineHeight: 1.4 }}>
              {evidence?.cxCohort ?? tile.cohort}
            </p>
            <p className="lisn-num" style={{ margin: "6px 0 0", fontSize: 12, color: cssVar("text-muted") }}>
              {evidence?.cxSignalCount ?? "1 corroborated signal"}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 20,
              fontWeight: 700,
              color: cssVar("text-muted"),
              padding: "0 4px",
            }}
            aria-hidden
          >
            ⨝
          </div>
          <div
            style={{
              padding: 12,
              borderRadius: radius.md,
              background: cssVar("surface-raised"),
              border: `1px solid ${cssVar("border")}`,
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 700, color: cssVar("text-muted"), textTransform: "uppercase", letterSpacing: 0.4 }}>
              Mock transaction cohort
            </div>
            <p style={{ margin: "8px 0 0", fontSize: 13, color: cssVar("text-primary"), fontWeight: 600, lineHeight: 1.4 }}>
              {evidence?.txnCohort ?? "Mock order/GMV feed"}
            </p>
            <p className="lisn-num" style={{ margin: "6px 0 0", fontSize: 12, color: cssVar("text-muted") }}>
              {evidence?.txnRowCount ?? "Mock feed rows"}
            </p>
          </div>
        </div>

        <div style={{ marginTop: 16, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: cssVar("text-muted"), marginBottom: 6 }}>
            Join key: {evidence?.joinKey ?? "cohort-level"}
          </div>
          <div className="lisn-num" style={{ fontSize: 22, fontWeight: 800, color: cssVar("severity-med") }}>
            {tile.bridgeValue}
          </div>
          <div style={{ fontSize: 11, color: cssVar("text-muted"), marginTop: 4 }}>[Phase 2]</div>
        </div>
      </Section>

      <Section title="Bridge-ready guardrails">
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: cssVar("text-secondary"), lineHeight: 1.6 }}>
          {(evidence?.guardrails ?? [
            "Cohort-level join only",
            "Human-approved pilot data ask",
            "Bridge-ready until feed lands",
          ]).map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </Section>

      {tile.governance && (
        <Section title="Governance tier">
          <p style={{ fontSize: 13, color: cssVar("severity-med"), fontWeight: 600, lineHeight: 1.5 }}>
            Cohort-banded · proxy-audited · differential action gated · never auto-applied
          </p>
        </Section>
      )}

      <AiLine text={evidence?.aiVerdict ?? tile.aiVerdict} />
      <div style={{ marginBottom: 16 }}>
        <ConfidenceBand band={evidence?.confidence ?? tile.confidence} />
      </div>
      <DraftActionFooter draftText={BRIDGE_ACTIONS.previewJoin} draftKind="prepare" />
      <DraftActionFooter draftText={BRIDGE_ACTIONS.pilotDataAsk} draftKind="draft" />
    </>
  );
}

function MissingPack({ itemId }: { itemId: string }): React.ReactElement {
  return <p style={{ color: cssVar("text-secondary"), fontSize: 13 }}>No evidence pack for this selection.</p>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }): React.ReactElement {
  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 0.5,
          color: cssVar("text-muted"),
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function AiLine({ text }: { text: string }): React.ReactElement {
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        alignItems: "flex-start",
        padding: "10px 12px",
        background: cssVar("accent-soft"),
        borderRadius: radius.md,
      }}
    >
      <AiMarker size={14} />
      <span style={{ fontSize: 13, color: cssVar("text-secondary"), lineHeight: 1.45 }}>{text}</span>
    </div>
  );
}
