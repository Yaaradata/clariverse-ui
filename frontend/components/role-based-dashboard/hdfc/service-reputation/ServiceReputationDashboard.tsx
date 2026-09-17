"use client";

/**
 * HDFC Head of CX — Service Reputation drill (tile 2).
 * Structured sections; all metrics from ServiceReputationData.
 * Only mounted for /role-based/hdfc/head_of_cx.
 */
import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import {
  getDefaultServiceReputationWindow,
  getServiceReputationChannels,
  getServiceReputationSnapshot,
  HDFC_SERVICE_REPUTATION_PERSONA_LINE,
  type ChannelName,
} from "@/lib/role-based-dashboard/hdfc/ServiceReputationData";
import { useDashboardTheme } from "../../DashboardThemeContext";
import {
  ChannelScoreCards,
  ServiceReputationAIWall,
  ServiceReputationScorePanel,
} from "./ServiceReputationHero";
import {
  AppPlayServiceDecayPanel,
  ServiceReputationThemesPanel,
} from "./ServiceReputationThemesDecay";
import {
  HighReachWatchPanel,
  RisingServiceNarrativesPanel,
  WiderReputationSignalsPanel,
} from "./ServiceReputationSignals";
import { boxBorder } from "./SRPanel";

type Props = { onBack: () => void };

const MAX_W = 1500;

export default function ServiceReputationDashboard({ onBack }: Props) {
  const T = useDashboardTheme();
  const channels = getServiceReputationChannels();
  const [activeChannel, setActiveChannel] = useState<ChannelName | "all">("all");

  const data = useMemo(
    () =>
      getServiceReputationSnapshot(
        getDefaultServiceReputationWindow(),
        activeChannel,
      ),
    [activeChannel],
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        maxWidth: MAX_W,
        width: "100%",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, minWidth: 0 }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: T.elevated,
              ...boxBorder(T.borderLight),
              borderRadius: 10,
              padding: "8px 16px",
              cursor: "pointer",
              color: T.textSec,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "inherit",
              flexShrink: 0,
            }}
          >
            <ArrowLeft size={14} />
            Back to Overview
          </button>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: T.text,
                letterSpacing: -0.3,
              }}
            >
              {data.title}
            </div>
            <div style={{ fontSize: 13, color: T.textSec, marginTop: 3, maxWidth: 820 }}>
              {data.subtitle}
            </div>
            <div
              style={{
                fontSize: 11,
                color: T.textMut,
                marginTop: 4,
                fontWeight: 600,
                letterSpacing: 0.3,
              }}
            >
              {HDFC_SERVICE_REPUTATION_PERSONA_LINE}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => window.print()}
              style={{
                background: T.elevated,
                ...boxBorder(T.borderLight),
                borderRadius: 10,
                padding: "8px 14px",
                color: T.textSec,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Export Report
            </button>
          </div>

          {/* CHANNELS filter pills */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: 0.7,
                color: T.textMut,
                textTransform: "uppercase",
              }}
            >
              Channels
            </span>
            <button
              type="button"
              onClick={() => setActiveChannel("all")}
              style={{
                borderTop: `1px solid ${activeChannel === "all" ? T.cyan : T.borderLight}`,
                borderRight: `1px solid ${activeChannel === "all" ? T.cyan : T.borderLight}`,
                borderBottom: `1px solid ${activeChannel === "all" ? T.cyan : T.borderLight}`,
                borderLeft: `1px solid ${activeChannel === "all" ? T.cyan : T.borderLight}`,
                borderRadius: 999,
                padding: "4px 10px",
                fontSize: 10,
                fontWeight: 800,
                cursor: "pointer",
                fontFamily: "inherit",
                background: activeChannel === "all" ? `${T.cyan}22` : T.surface,
                color: activeChannel === "all" ? T.cyan : T.textMut,
              }}
            >
              All
            </button>
            {channels.map((ch) => {
              const on = activeChannel === ch;
              return (
                <button
                  key={ch}
                  type="button"
                  onClick={() => setActiveChannel(ch)}
                  style={{
                    borderTop: `1px solid ${on ? T.cyan : T.borderLight}`,
                    borderRight: `1px solid ${on ? T.cyan : T.borderLight}`,
                    borderBottom: `1px solid ${on ? T.cyan : T.borderLight}`,
                    borderLeft: `1px solid ${on ? T.cyan : T.borderLight}`,
                    borderRadius: 999,
                    padding: "4px 10px",
                    fontSize: 10,
                    fontWeight: 800,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    background: on ? `${T.cyan}22` : T.surface,
                    color: on ? T.cyan : T.textMut,
                  }}
                >
                  {ch}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* PASS 2 — Score + AI Wall */}
      <div
        className="sr-top-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.6fr) minmax(320px, 1fr)",
          gap: 16,
          alignItems: "stretch",
        }}
      >
        <ServiceReputationScorePanel data={data.service_reputation_score} />
        <ServiceReputationAIWall data={data.ai_summary_wall} />
      </div>

      <ChannelScoreCards data={data.channel_scores} />

      {/* PASS 3 — Themes + App/Play decay */}
      <div
        className="sr-mid-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.15fr) minmax(0, 1fr)",
          gap: 16,
          alignItems: "stretch",
        }}
      >
        <ServiceReputationThemesPanel data={data.service_reputation_themes} />
        <AppPlayServiceDecayPanel data={data.app_play_service_decay} />
      </div>

      {/* PASS 4 — High-reach + Rising narratives */}
      <div
        className="sr-watch-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          alignItems: "stretch",
        }}
      >
        <HighReachWatchPanel data={data.high_reach_watch} />
        <RisingServiceNarrativesPanel data={data.reputation_momentum} />
      </div>

      {/* PASS 5 — Wider signals */}
      <WiderReputationSignalsPanel data={data.wider_reputation_signals} />

      <style>{`
        @media (max-width: 1100px) {
          .sr-top-grid,
          .sr-mid-grid,
          .sr-watch-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
