"use client";

import React from "react";
import { X } from "lucide-react";

import { ActionBar } from "../components/common/ActionBar";
import { EvidenceFeed } from "../components/common/EvidenceFeed";
import { InsightCard } from "../components/common/InsightCard";
import {
  AspectCliffPanel,
  LostDemandPanel,
  PromoHealthGate,
} from "../components/data/DrillComponents";
import { EVIDENCE_PACKS, getSignalById } from "../lib/seedData";
import { useNavigation } from "../lib/NavigationContext";
import { useAppState } from "../state/AppStateContext";
import { cssVar, radius, z } from "../theme/tokens";

export function SharedDrillPanel(): React.ReactElement | null {
  const { drill, closeDrill } = useNavigation();
  const { state } = useAppState();

  if (!drill || drill.kind !== "signal") return null;

  const signal = getSignalById(drill.itemId);
  if (!signal) return null;

  const pack = EVIDENCE_PACKS[drill.itemId];

  let panel: React.ReactElement;
  if (signal.signalId === "T2-12") {
    panel = <AspectCliffPanel signal={signal} />;
  } else if (signal.signalId === "T2-19") {
    panel = <PromoHealthGate signal={signal} />;
  } else if (signal.signalId === "T2-17") {
    panel = <LostDemandPanel signal={signal} />;
  } else {
    panel = <InsightCard signal={signal} variant="hero" />;
  }

  return (
    <div
      className="lisn-anim-drill"
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "min(480px, 100vw)",
        height: "100vh",
        zIndex: z.drill,
        background: cssVar("surface"),
        borderLeft: `1px solid ${cssVar("border")}`,
        boxShadow: cssVar("shadow-pop"),
        overflowY: "auto",
        padding: 20,
      }}
    >
      <button
        type="button"
        onClick={closeDrill}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: cssVar("text-muted"),
        }}
      >
        <X size={20} />
      </button>
      <InsightCard signal={signal} variant="hero" />
      <div style={{ marginTop: 14 }}>{panel}</div>
      {pack ? <EvidenceFeed pack={pack} /> : null}
      {signal.actions.length > 0 && !signal.advisory && !signal.suppressed ? (
        <ActionBar
          personaId={state.personaId}
          actions={signal.actions.map((a) => ({
            label: a.actionLabel,
            text: signal.title,
            routedOwner: a.routedOwner,
            signalId: signal.signalId,
            gated: a.gated,
          }))}
        />
      ) : null}
    </div>
  );
}
