"use client";

/**
 * HDFC Head of CX — Service Reputation drill (tile 2).
 * Structured sections; all metrics from ServiceReputationData.
 * Only mounted for /role-based/hdfc/head_of_cx.
 */
import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import {
  getDefaultServiceReputationWindow,
  getServiceReputationSnapshot,
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
  const data = useMemo(
    () => getServiceReputationSnapshot(getDefaultServiceReputationWindow(), "all"),
    [],
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
