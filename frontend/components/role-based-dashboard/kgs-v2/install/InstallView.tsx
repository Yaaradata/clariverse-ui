"use client";

import install from "@kgs2/data/install.json";
import { useLabel2 } from "@kgs2/lib/demoState";
import { Sparkles } from "lucide-react";
import type { CSSProperties } from "react";
import {
  K,
  withAlpha,
} from "@/components/role-based-dashboard/kgs/shared/tokens";
import { DrillHeader2 } from "../shared/DrillHeader2";
import {
  type SignalWall2Data,
  type WallLevel2,
  SignalWall2,
} from "../shared/SignalWall2";
import {
  ByPartnerTable,
  CaptureGapNote,
  FrictionPraiseChart,
  InstallerQuotes,
  InstallerTopics,
  InstallStepStrip,
} from "./InstallDrillSections";

function buildInstallWall(): SignalWall2Data {
  return {
    title: "Signal Wall",
    sub: "Installer experience signals",
    pill: "Live",
    cards: install.signalWall.map((card) => {
      const level = (card.level ??
        (card.severity === "improving" ? "improving" : "alert")) as WallLevel2;
      return {
        id: card.id,
        level,
        tag: level === "improving" ? "Improving" : card.severity,
        title: card.title,
        body: card.body,
        metric: card.metric,
        trend: card.trend,
        detail: {
          cause: card.body,
          areas: ["Install experience", card.type],
          actions:
            card.id === "IN-01"
              ? [
                  "Share a one-page set-up guide with partners",
                  "Send a feedback note to the US product team",
                ]
              : ["Route praise to Marketing"],
          timeline: card.trend,
          owner: card.owner,
          priority: level === "improving" ? "Watching" : "Needs action",
        },
      };
    }),
    footer: [
      { label: "Critical", value: 0 },
      { label: "Needs action", value: 1 },
      { label: "Improving", value: 1 },
    ],
  };
}

/**
 * Install experience — ChannelView layout (SPEC §7 / R5).
 * Framed as experience only — never as a product fault.
 * No Approve / draft buttons on this page.
 */
export function InstallView() {
  const L = useLabel2();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        padding: "16px 24px 24px",
      }}
    >
      <DrillHeader2
        title={install.title}
        subtitle={install.subtitle}
      />

      <CaptureGapNote text={install.captureGapNote} />

      <InstallStepStrip steps={install.steps} />

      <FrictionPraiseChart
        steps={install.steps}
        frictionTotal={install.frictionTotal}
        praiseTotal={install.praiseTotal}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: 12,
          alignItems: "stretch",
        }}
      >
        <InstallerTopics topics={install.topics} />
        <div style={{ position: "relative", minHeight: 0, minWidth: 0 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
            }}
          >
            <InstallerQuotes quotes={install.quotes} />
          </div>
        </div>
      </div>

      <ByPartnerTable rows={install.byPartner} />

      <SignalWall2 wall={buildInstallWall()} />

      <section
        aria-label="LiSN evidence summary"
        style={{
          background: withAlpha(K.brand, 0.08),
          border: `1px solid ${withAlpha(K.violet400, 0.35)}`,
          borderRadius: K.radius.card,
          padding: 18,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 800,
            color: K.text,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Sparkles size={18} color={K.violet400} aria-hidden />
          LiSN evidence summary
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 16,
          }}
        >
          <p style={summaryP}>
            <strong style={{ color: K.text }}>Main signal:</strong>{" "}
            {L(install.evidenceSummary.mainSignal)}
          </p>
          <p style={summaryP}>
            <strong style={{ color: K.text }}>What changed:</strong>{" "}
            {L(install.evidenceSummary.whatChanged)}
          </p>
          <p style={summaryP}>
            <strong style={{ color: K.text }}>Decide first:</strong>{" "}
            {L(install.evidenceSummary.decideFirst)}
          </p>
        </div>
      </section>
    </div>
  );
}

const summaryP: CSSProperties = {
  margin: 0,
  fontSize: 14,
  lineHeight: 1.55,
  color: K.body,
};
