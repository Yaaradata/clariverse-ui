"use client";

import React from "react";
import {
  COMPLIANCE_ACTIONS,
  COMPLIANCE_PAGE,
  getStatutoryItemById,
  MRP_MISMATCH_CARD,
  REFUND_FRICTION_CARD,
  type QuickCommerceRadarCard,
  type StatutoryQueueItem,
} from "../../lib/cxHeadRetailData";
import { useNavigation } from "../../lib/NavigationContext";
import { AiMarker } from "../common/AiMarker";
import { ConfidenceBand } from "../common/ConfidenceBand";
import { DraftActionFooter } from "../common/DraftActionFooter";
import { ComplianceKpiCards } from "../compliance/ComplianceKpiCards";
import { RegulationExposureChart } from "../compliance/RegulationExposureChart";
import { StatutoryClockProximityRunway } from "../compliance/StatutoryClockProximityRunway";
import { DetailPageHeader } from "../common/DetailPageHeader";
import { ScreenBackBar } from "../common/ScreenBackBar";
import { cssVar, layout, radius, space, type } from "../../theme/tokens";

function ComplianceHeadline(): React.ReactElement {
  return (
    <div style={{ borderLeft: `3px solid ${cssVar("accent")}`, paddingLeft: 14, maxWidth: 920 }}>
      <h2
        style={{
          margin: 0,
          fontSize: type.scale.display,
          fontWeight: type.weight.bold,
          color: cssVar("text-primary"),
          lineHeight: 1.12,
          letterSpacing: -0.55,
        }}
      >
        Regulatory exposure{" "}
        <span style={{ color: cssVar("accent"), fontWeight: 800 }}>surfacing</span> in customer{" "}
        <span
          style={{
            color: cssVar("accent-2"),
            fontWeight: 800,
            boxShadow: `inset 0 -3px 0 ${cssVar("accent")}40`,
          }}
        >
          voice
        </span>
        <span style={{ color: cssVar("accent") }}>.</span>
      </h2>
      <p style={{ margin: `${space["2"]} 0 0`, fontSize: type.scale.small, color: cssVar("text-secondary"), lineHeight: 1.5, maxWidth: 720 }}>
        {COMPLIANCE_PAGE.purpose}
      </p>
    </div>
  );
}

function SectionHeader({ title, hint }: { title: string; hint?: string }): React.ReactElement {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: space["3"], flexWrap: "wrap" }}>
      <div style={{ fontSize: type.scale.body, fontWeight: type.weight.bold, color: cssVar("text-primary") }}>{title}</div>
      {hint ? <div style={{ fontSize: type.scale.caption, color: cssVar("text-muted") }}>{hint}</div> : null}
    </div>
  );
}

function ConductSignalCard({ card }: { card: QuickCommerceRadarCard }): React.ReactElement {
  return (
    <div
      style={{
        padding: space["4"],
        borderRadius: radius.lg,
        background: cssVar("surface"),
        border: `1px solid ${cssVar("border")}`,
        borderLeft: `3px solid ${cssVar("severity-med")}`,
        display: "flex",
        flexDirection: "column",
        gap: space["2"],
        minWidth: 0,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: space["2"], alignItems: "flex-start" }}>
        <div style={{ fontSize: type.scale.body, fontWeight: type.weight.bold, color: cssVar("text-primary") }}>{card.title}</div>
        <ConfidenceBand band={card.confidence} />
      </div>
      <div className="lisn-num" style={{ fontSize: type.scale.small, fontWeight: type.weight.bold, color: cssVar("text-primary"), lineHeight: 1.4 }}>
        {card.stat}
      </div>
      <p style={{ margin: 0, fontSize: type.scale.caption, color: cssVar("text-secondary"), lineHeight: 1.45 }}>{card.honestyLine}</p>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
        <AiMarker size={12} />
        <span style={{ fontSize: type.scale.caption, color: cssVar("text-secondary"), lineHeight: 1.45 }}>{card.aiVerdict}</span>
      </div>
      <DraftActionFooter draftText={card.draftAction} draftKind={card.draftKind} />
    </div>
  );
}

const COMPLIANCE_PILOT_ACTIONS = [
  { id: "priority", draftKind: "draft" as const, text: COMPLIANCE_ACTIONS.priorityAlert },
  { id: "regulatory", draftKind: "prepare" as const, text: COMPLIANCE_ACTIONS.regulatoryCard },
  { id: "refund", draftKind: "route" as const, text: COMPLIANCE_ACTIONS.refundFriction },
  { id: "mrp", draftKind: "route" as const, text: COMPLIANCE_ACTIONS.mrpMismatch },
  { id: "ack", draftKind: "draft" as const, text: COMPLIANCE_ACTIONS.acknowledgementEscalation },
];

/** S3 Regulatory Exposure — KPIs → charts → conduct + actions. */
export function ComplianceConductScreen(): React.ReactElement {
  const { navigate, openDrill } = useNavigation();

  const openStatutoryDrill = (item: StatutoryQueueItem) => {
    openDrill({
      screenId: "compliance",
      itemId: item.id,
      drillSignature: "statutory-queue",
    });
  };

  return (
    <div
      className="lisn-anim-fade"
      style={{
        maxWidth: layout.contentMaxWidth,
        margin: "0 auto",
        padding: "24px 32px 48px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <DetailPageHeader headline={<ComplianceHeadline />} />
      <ScreenBackBar onBack={() => navigate("overview")} />

      <ComplianceKpiCards />

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)", gap: space["3"], alignItems: "stretch" }}>
        <StatutoryClockProximityRunway
          onSelect={(id) => {
            const item = getStatutoryItemById(id);
            if (item) openStatutoryDrill(item);
          }}
        />
        <RegulationExposureChart />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: space["4"], alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: space["3"], minWidth: 0 }}>
          <SectionHeader title={COMPLIANCE_PAGE.sections.conduct} hint="Firm-level instruments" />
          <div style={{ display: "flex", flexDirection: "column", gap: space["3"] }}>
            <ConductSignalCard card={REFUND_FRICTION_CARD} />
            <ConductSignalCard card={MRP_MISMATCH_CARD} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: space["3"], minWidth: 0 }}>
          <SectionHeader title={COMPLIANCE_PAGE.sections.actions} hint={COMPLIANCE_PAGE.sections.actionsHint} />
          <div style={{ display: "flex", flexDirection: "column", gap: space["3"] }}>
            {COMPLIANCE_PILOT_ACTIONS.map((action) => (
              <DraftActionFooter
                key={action.id}
                draftText={action.text}
                draftKind={action.draftKind}
                approveButtonLabel="Approve"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
