"use client";

import React from "react";
import {
  COMPLIANCE_HEADLINE,
  COMPLIANCE_SUMMARY,
  MRP_MISMATCH_CARD,
  REFUND_FRICTION_CARD,
  type StatutoryQueueItem,
} from "../../lib/cxHeadRetailData";
import { useNavigation } from "../../lib/NavigationContext";
import { AiExecSummaryBar } from "../common/AiExecSummaryBar";
import { CompactPageHeader, pageShellStyle } from "../common/CompactPageHeader";
import { CompactSignalCard } from "../common/CompactSignalCard";
import { ComplianceEvidenceCard } from "../compliance/ComplianceEvidenceCard";
import { StatutoryQueue } from "../compliance/StatutoryQueue";

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
    <div className="lisn-anim-fade" style={pageShellStyle()}>
      <CompactPageHeader
        eyebrow="Compliance"
        title={COMPLIANCE_HEADLINE.title}
        subtitle={COMPLIANCE_HEADLINE.soWhat}
      />

      <AiExecSummaryBar {...COMPLIANCE_SUMMARY} />

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 8, alignItems: "stretch" }}>
        <StatutoryQueue onSelect={openStatutoryDrill} />
        <ComplianceEvidenceCard onOpenEvidence={openDarkPatternDrill} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <CompactSignalCard
          title={REFUND_FRICTION_CARD.title}
          stat={REFUND_FRICTION_CARD.stat}
          aiLine={REFUND_FRICTION_CARD.aiVerdict}
        />
        <CompactSignalCard
          title={MRP_MISMATCH_CARD.title}
          stat={MRP_MISMATCH_CARD.stat}
          aiLine={MRP_MISMATCH_CARD.aiVerdict}
        />
      </div>
    </div>
  );
}
