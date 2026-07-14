"use client";

import React, { useState } from "react";
import {
  BRIDGE_PILOT_ACTIONS,
  REVENUE_BRIDGE_PAGE,
  STARRED_BRIDGE_IDS,
} from "../../lib/cxHeadRetailData";
import { useNavigation } from "../../lib/NavigationContext";
import { DraftActionFooter } from "../common/DraftActionFooter";
import { BridgeCatalogueList, BRIDGE_CATALOGUE_PANEL_HEIGHT } from "../revenue-bridge/BridgeCatalogueList";
import { BridgeDetailPanel } from "../revenue-bridge/BridgeDetailPanel";
import { RevenueBridgeLedgerKpis } from "../revenue-bridge/RevenueBridgeLedgerKpis";
import { DetailPageHeader } from "../common/DetailPageHeader";
import { cssVar, layout, radius, space, type } from "../../theme/tokens";

function RevenueBridgeHeadline(): React.ReactElement {
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
        <span style={{ color: cssVar("accent"), fontWeight: 800 }}>Voice</span> →{" "}
        <span
          style={{
            color: cssVar("accent-2"),
            fontWeight: 800,
            boxShadow: `inset 0 -3px 0 ${cssVar("accent")}40`,
          }}
        >
          P&L
        </span>{" "}
        join
        <span style={{ color: cssVar("accent") }}>.</span>
      </h2>
      <p style={{ margin: `${space["2"]} 0 0`, fontSize: type.scale.small, color: cssVar("text-secondary"), lineHeight: 1.5, maxWidth: 720 }}>
        {REVENUE_BRIDGE_PAGE.purpose}
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

/** Pass 7 — S5 Revenue Bridge: triage KPIs → catalogue list + detail → pilot actions. */
export function RevenueBridgeScreen(): React.ReactElement {
  const { openDrill } = useNavigation();
  const [selectedId, setSelectedId] = useState<string>(STARRED_BRIDGE_IDS[0]);

  const openBridgeDrill = (tileId: string) => {
    openDrill({
      screenId: "revenue-bridge",
      itemId: tileId,
      drillSignature: "bridge",
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
      <DetailPageHeader
        headline={<RevenueBridgeHeadline />}
        headerEnd={
          <span
            style={{
              flexShrink: 0,
              padding: "6px 12px",
              borderRadius: radius.pill,
              fontSize: type.scale.caption,
              fontWeight: type.weight.semibold,
              color: cssVar("severity-med"),
              background: `${cssVar("severity-med")}14`,
              border: `1px solid ${cssVar("severity-med")}44`,
              whiteSpace: "nowrap",
            }}
          >
            Phase 2
          </span>
        }
      />

      <RevenueBridgeLedgerKpis />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.5fr) minmax(280px, 1fr)",
          gap: space["4"],
          alignItems: "start",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: space["3"], minWidth: 0 }}>
          <SectionHeader title={REVENUE_BRIDGE_PAGE.sections.bridges} hint={REVENUE_BRIDGE_PAGE.sections.bridgesHint} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(200px, 220px) minmax(0, 1fr)",
              gap: space["3"],
              alignItems: "stretch",
            }}
          >
            <BridgeCatalogueList selectedId={selectedId} onSelect={setSelectedId} />
            <BridgeDetailPanel selectedId={selectedId} onOpenDrill={openBridgeDrill} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: space["3"], minWidth: 0 }}>
          <SectionHeader title={REVENUE_BRIDGE_PAGE.sections.actions} hint={REVENUE_BRIDGE_PAGE.sections.actionsHint} />
          <div style={{ display: "flex", flexDirection: "column", gap: space["3"], maxHeight: BRIDGE_CATALOGUE_PANEL_HEIGHT, overflowY: "auto", paddingRight: 2 }}>
            {BRIDGE_PILOT_ACTIONS.map((action) => (
              <DraftActionFooter key={action.id} draftText={action.text} draftKind={action.draftKind} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
