"use client";

import React from "react";
import {
  COMPLIANCE_ACTIONS,
  COMPLIANCE_HEADLINE,
  COMPLIANCE_SUMMARY,
  MRP_MISMATCH_CARD,
  REFUND_FRICTION_CARD,
  type QuickCommerceRadarCard,
  type StatutoryQueueItem,
} from "../../lib/cxHeadRetailData";
import { useNavigation } from "../../lib/NavigationContext";
import { AiExecSummaryBar } from "../common/AiExecSummaryBar";
import { AiMarker } from "../common/AiMarker";
import { ConfidenceBand } from "../common/ConfidenceBand";
import { DraftActionFooter } from "../common/DraftActionFooter";
import { ComplianceEvidenceCard } from "../compliance/ComplianceEvidenceCard";
import { StatutoryQueue } from "../compliance/StatutoryQueue";
import { cssVar, layout, radius, type } from "../../theme/tokens";

function FrictionCard({ card }: { card: QuickCommerceRadarCard }): React.ReactElement {
  return (
    <div
      style={{
        padding: 16,
        borderRadius: radius.lg,
        background: cssVar("surface"),
        border: `1px solid ${cssVar("border")}`,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        height: "100%",
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 700, color: cssVar("text-primary") }}>{card.title}</div>
      <div className="lisn-num" style={{ fontSize: 15, fontWeight: 700, color: cssVar("text-primary") }}>
        {card.stat}
      </div>
      <p style={{ margin: 0, fontSize: 12, color: cssVar("text-secondary"), lineHeight: 1.45 }}>{card.honestyLine}</p>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
        <AiMarker size={12} />
        <span style={{ fontSize: 12, color: cssVar("text-secondary"), lineHeight: 1.45 }}>{card.aiVerdict}</span>
      </div>
      <ConfidenceBand band={card.confidence} />
      <DraftActionFooter draftText={card.draftAction} draftKind={card.draftKind} />
    </div>
  );
}

/** Pass 5 — S3 Compliance & Conduct. */
export function ComplianceConductScreen(): React.ReactElement {
  const { openDrill } = useNavigation();

  const openStatutoryDrill = (item: StatutoryQueueItem) => {
    openDrill({
      screenId: "compliance",
      itemId: item.id,
      drillSignature: "statutory-queue",
    });
  };

  const openDarkPatternDrill = () => {
    openDrill({
      screenId: "compliance",
      itemId: "dark-pattern-checkout",
      drillSignature: "compliance-evidence",
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
        gap: 18,
      }}
    >
      <div>
        <p
          style={{
            margin: 0,
            fontSize: type.scale.caption,
            fontWeight: type.weight.semibold,
            letterSpacing: 0.6,
            textTransform: "uppercase",
            color: cssVar("accent"),
          }}
        >
          Regulatory exposure surfacing in customer voice
        </p>
        <h2
          style={{
            margin: "10px 0 0",
            fontSize: type.scale.h1,
            fontWeight: type.weight.bold,
            color: cssVar("text-primary"),
            lineHeight: 1.2,
            maxWidth: 900,
          }}
        >
          {COMPLIANCE_HEADLINE.title}
        </h2>
        <p style={{ margin: "10px 0 0", fontSize: type.scale.body, color: cssVar("text-secondary"), maxWidth: 820, lineHeight: 1.5 }}>
          {COMPLIANCE_HEADLINE.soWhat}
        </p>
        <p style={{ margin: "8px 0 0", fontSize: type.scale.small, color: cssVar("text-muted"), maxWidth: 820, lineHeight: 1.45 }}>
          {COMPLIANCE_HEADLINE.explainability}
        </p>
      </div>

      <AiExecSummaryBar {...COMPLIANCE_SUMMARY} />

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 16, alignItems: "stretch" }}>
        <StatutoryQueue onSelect={openStatutoryDrill} />
        <ComplianceEvidenceCard onOpenEvidence={openDarkPatternDrill} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <FrictionCard card={REFUND_FRICTION_CARD} />
        <FrictionCard card={MRP_MISMATCH_CARD} />
      </div>

      <div
        style={{
          padding: 16,
          borderRadius: radius.lg,
          background: cssVar("surface-raised"),
          border: `1px solid ${cssVar("border")}`,
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 600, color: cssVar("text-muted"), marginBottom: 8 }}>
          Nodal officer priority — internal routing only
        </div>
        <DraftActionFooter draftText={COMPLIANCE_ACTIONS.priorityAlert} draftKind="draft" />
      </div>
    </div>
  );
}
