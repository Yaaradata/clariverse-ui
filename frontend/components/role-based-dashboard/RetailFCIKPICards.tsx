'use client';

/**
 * RetailFCIKPICards — dedicated copy of `FCIKPICards` for the role-based
 * dashboard (Customer Happiness drill-down on the Retail persona).
 *
 * Keep this file independent from `components/FCI/FCIKPICards.tsx` so the
 * role-based view can evolve its KPIs, intents and tier breakdowns without
 * affecting the original FCI product screen.
 *
 * The mock data below is aligned with the HV/LV intent panel that appears
 * immediately below this block in the drill-down:
 *   HV monthly contacts = 15,910  (Private · HNI · Mass Affluent · 148K accounts)
 *   LV monthly contacts = 37,830  (Mass Retail · Digital-only · 2.41M accounts)
 *   HV avg sentiment = -0.42, LV avg sentiment = -0.48
 * Within each HV/LV bucket we split 60/40 into HF/LF to preserve the 4-tier UI.
 */

import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  AlertTriangle,
  Clock,
  MessageSquare,
  Phone,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { AISummaryWall } from '@/components/FCI/AISummaryWall';

interface RetailFCIKPICardsProps {
  data?: unknown;
  isDarkMode?: boolean;
}

const SEGMENT_COLORS = {
  hvhf: '#A855F7',
  hvlf: '#06B6D4',
  lvhf: '#6366F1',
  lvlf: '#94A3B8',
} as const;

// NPS Segment Monitor — 12-week rolling trend across the 4 HV/LV × HF/LF customer segments
// (HVHF deterioration is fastest at -28 pts)
const NPS_TREND = [
  { week: 'W-11', HVHF: 46, HVLF: 38, LVLF: 22, LVHF: 52 },
  { week: 'W-10', HVHF: 44, HVLF: 37, LVLF: 20, LVHF: 54 },
  { week: 'W-9',  HVHF: 42, HVLF: 35, LVLF: 17, LVHF: 55 },
  { week: 'W-8',  HVHF: 40, HVLF: 34, LVLF: 15, LVHF: 57 },
  { week: 'W-7',  HVHF: 37, HVLF: 32, LVLF: 13, LVHF: 58 },
  { week: 'W-6',  HVHF: 34, HVLF: 30, LVLF: 10, LVHF: 59 },
  { week: 'W-5',  HVHF: 31, HVLF: 29, LVLF:  8, LVHF: 60 },
  { week: 'W-4',  HVHF: 29, HVLF: 28, LVLF:  6, LVHF: 61 },
  { week: 'W-3',  HVHF: 26, HVLF: 27, LVLF:  5, LVHF: 62 },
  { week: 'W-2',  HVHF: 23, HVLF: 25, LVLF:  3, LVHF: 63 },
  { week: 'W-1',  HVHF: 21, HVLF: 24, LVLF:  2, LVHF: 64 },
  { week: 'Now',  HVHF: 18, HVLF: 23, LVLF:  1, LVHF: 65 },
];

// Sentiment by Relationship Value — sentiment split (Happy / Neutral / Unhappy) + deposits at stake
const WEALTH_TIERS = [
  { id: 'H1', label: 'H1 · $1M+',      happy: 44, neutral: 26, unhappy: 30, deposits: '$184M', accts: 312  },
  { id: 'H2', label: 'H2 · $500K–1M',  happy: 51, neutral: 24, unhappy: 25, deposits: '$276M', accts: 624  },
  { id: 'H3', label: 'H3 · $250K–500K', happy: 58, neutral: 22, unhappy: 20, deposits: '$312M', accts: 1085 },
];

// Vulnerable Customer Watchlist — condensed executive view keyed by wealth tier
// (segment · # customers flagged · severity). Segment codes mirror the NPS
// Segment Monitor above (HVHF/HVLF/LVHF/LVLF) so the wealth-tier taxonomy stays
// consistent across the drill-down.
type VulnerabilitySeverity = 'High' | 'Medium' | 'Low';
const VULNERABLE_SEGMENTS: Array<{ segment: string; count: number; severity: VulnerabilitySeverity }> = [
  { segment: 'HVHF', count: 2, severity: 'High'   },
  { segment: 'HVLF', count: 1, severity: 'High'   },
  { segment: 'LVHF', count: 2, severity: 'Medium' },
  { segment: 'LVLF', count: 1, severity: 'Medium' },
];

const SEVERITY_COLORS: Record<VulnerabilitySeverity, string> = {
  High:   '#ef4444',
  Medium: '#f59e0b',
  Low:    '#22c55e',
};

// Customer Emotion & Friction — each signal split by customer segment
// so the exec view can isolate frustration drivers by value/frequency cohort.
type FrictionSegmentBreakdown = { hvhf: number; hvlf: number; lvhf: number; lvlf: number };
const FRICTION_SIGNALS: Array<{
  label: string;
  value: number;
  icon: LucideIcon;
  bySegment: FrictionSegmentBreakdown;
}> = [
  {
    label: 'Escalations',
    value: 456,
    icon: AlertTriangle,
    bySegment: { hvhf: 182, hvlf: 118, lvhf: 94, lvlf: 62 },
  },
  {
    label: 'Long Handling Time',
    value: 723,
    icon: Clock,
    bySegment: { hvhf: 246, hvlf: 204, lvhf: 168, lvlf: 105 },
  },
  {
    label: 'Interruptions',
    value: 312,
    icon: MessageSquare,
    bySegment: { hvhf: 96, hvlf: 84, lvhf: 78, lvlf: 54 },
  },
  {
    label: 'High Agitation Calls',
    value: 189,
    icon: Phone,
    bySegment: { hvhf: 72, hvlf: 48, lvhf: 42, lvlf: 27 },
  },
];

export function RetailFCIKPICards({ isDarkMode = false }: RetailFCIKPICardsProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const kpiData = {
    totalInteraction: {
      value: 87.5,
      trend: 3.2,
      totalVolume: 53740,
      lastWeekComparison: '+1,842',
      customerSegments: {
        hvhf: { label: 'High Value High Frequency', count: 9550,  share: 18, delta: 2.1 },
        hvlf: { label: 'High Value Low Frequency',  count: 6360,  share: 12, delta: -0.8 },
        lvhf: { label: 'Low Value High Frequency',  count: 22700, share: 42, delta: 3.4 },
        lvlf: { label: 'Low Value Low Frequency',   count: 15130, share: 28, delta: -1.5 },
      },
      peakHour: '2:00 PM',
      peakIncrease: 12,
    },
    fciRate: {
      value: 1.5,
      trend: -0.3,
      segmentFCI: {
        hvhf: { label: 'HVHF', rate: 0.8, color: SEGMENT_COLORS.hvhf },
        hvlf: { label: 'HVLF', rate: 1.2, color: SEGMENT_COLORS.hvlf },
        lvhf: { label: 'LVHF', rate: 2.1, color: SEGMENT_COLORS.lvhf },
        lvlf: { label: 'LVLF', rate: 2.8, color: SEGMENT_COLORS.lvlf },
      },
    },
    riskSignal: {
      // Top 4 intents by monthly volume (in thousands) from HV+LV intent lists
      //   App Login & Authentication (LV 9.8K) + Account Access (LV 3.4K)  ≈ 13
      //   Card Declines (LV everyday 7.95K + HV travel/FX 1.75K)            ≈ 10
      //   Fee Disputes (LV overdraft 6.43K + HV fees 3.02K)                 ≈  9
      //   Wealth / RM issues (HV wealth 3.82K + HV RM access 1.59K)         ≈  5
      fraud:       { percentage: 2.5, cases: 13, trend: -0.5 },
      operational: { percentage: 2.2, cases: 10, trend: -0.2 },
      reputation:  { percentage: 1.5, cases:  9, trend:  0.1 },
      thirdParty:  { percentage: 1.9, cases:  5, trend:  0.4 },
      totalFlagged: 16,
      highPriority: 6,
      critical: 2,
      resolvedToday: 4,
      // Distinct intents surfaced per tier (sum must equal totalFlagged = 16)
      segmentRisk: {
        hvhf: { count: 3, level: 'low' },
        hvlf: { count: 5, level: 'medium' },
        lvhf: { count: 4, level: 'high' },
        lvlf: { count: 4, level: 'high' },
      },
    },
    customerSentiment: {
      // Weighted positive share across tiers = 28%
      // Maps the -0.42 / -0.48 HV/LV averages to a % positive-share index.
      value: 28,
      trend: -1.8,
      analyzedInteractions: 540,
      improvementFromYesterday: '-1.2%',
      negativeTopics: ['App login / auth', 'Fee & charge disputes'],
      positiveTopics: ['Rewards uplift', 'New product onboarding'],
      npsScore: -12,
      detractors: 38,
      segmentSentiment: {
        hvhf: { label: 'High Value High Freq', score: 38, color: SEGMENT_COLORS.hvhf },
        hvlf: { label: 'High Value Low Freq',  score: 32, color: SEGMENT_COLORS.hvlf },
        lvhf: { label: 'Low Value High Freq',  score: 26, color: SEGMENT_COLORS.lvhf },
        lvlf: { label: 'Low Value Low Freq',   score: 22, color: SEGMENT_COLORS.lvlf },
      },
      // Per-tier pos/neu/neg split. Counts are "interactions analyzed ≈ volume/100"
      //   HVHF  9,550 → 95  analyzed → 36 pos / 31 neu / 28 neg
      //   HVLF  6,360 → 64           → 20 / 21 / 23
      //   LVHF 22,700 → 227          → 59 / 73 / 95
      //   LVLF 15,130 → 151          → 33 / 45 / 73
      segmentSentimentBreakdown: {
        hvhf: { label: 'High Value High Freq', positive: 38, neutral: 32, negative: 30, positiveCount: 36, neutralCount: 31, negativeCount: 28 },
        hvlf: { label: 'High Value Low Freq',  positive: 32, neutral: 33, negative: 35, positiveCount: 20, neutralCount: 21, negativeCount: 23 },
        lvhf: { label: 'Low Value High Freq',  positive: 26, neutral: 32, negative: 42, positiveCount: 59, neutralCount: 73, negativeCount: 95 },
        lvlf: { label: 'Low Value Low Freq',   positive: 22, neutral: 30, negative: 48, positiveCount: 33, neutralCount: 45, negativeCount: 73 },
      },
    },
  };

  const formatNumber = (num: number): string =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const getCardStyle = (isHovered: boolean) => ({
    borderColor: isHovered ? '#5332FF' : (isDarkMode ? '#1f1f1f' : '#E5E5E5'),
    backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF',
    transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
    transition: 'all 0.2s ease',
  });

  const segmentColors: Record<string, string> = SEGMENT_COLORS;

  return (
    <div className="p-4">
      <div className="flex flex-nowrap gap-4 items-stretch min-w-0">
        {/* Left Side — 6 KPI Cards in a 2-col grid (2 per row):
            Row 1: [Combined Segments · Sentiment by Relationship Value]
            Row 2: [Top Intent · NPS Segment Monitor]
            Row 3: [Vulnerable Watchlist · Strain & Friction] */}
        <div className="flex-[2] min-w-0 grid grid-cols-2 gap-4">
          {/* Card 1 — Combined Segment Table (Total Interactions + Sentiment + FCI) */}
          <div
            className="border rounded-xl p-4 cursor-pointer flex flex-col h-full"
            style={getCardStyle(hoveredCard === 'segments')}
            onMouseEnter={() => setHoveredCard('segments')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
              <div className="min-w-0">
                <p className="text-[10px] font-bold tracking-wider" style={{ color: '#939394' }}>
                  TOTAL INTERACTIONS
                </p>
                <div className="flex items-baseline gap-2 mt-0.5 flex-wrap">
                  <span
                    className="text-3xl font-bold leading-none"
                    style={{
                      background: 'linear-gradient(135deg, #5332FF 0%, #7c3aed 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {formatNumber(kpiData.totalInteraction.totalVolume)}
                  </span>
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold"
                    style={{
                      color: '#10b981',
                      background: 'rgba(16,185,129,0.12)',
                      border: '1px solid rgba(16,185,129,0.35)',
                    }}
                    title="vs. Last Week"
                  >
                    ▲ {kpiData.totalInteraction.lastWeekComparison} vs last week
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[10.5px]" style={{ color: '#939394' }}>
                {[
                  { color: '#34d399', label: 'Positive' },
                  { color: '#fbbf24', label: 'Neutral' },
                  { color: '#ff073a', label: 'Negative' },
                ].map((l) => (
                  <span key={l.label} className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
                    {l.label}
                  </span>
                ))}
              </div>
            </div>

            <div
              className="rounded-lg overflow-hidden flex-1 flex flex-col"
              style={{ border: `1px solid ${isDarkMode ? '#1f1f1f' : '#e5e5e5'}` }}
            >
              {(() => {
                const tableCols = '64px minmax(88px,1fr) 80px 64px 60px';
                const segmentKeysArr = ['hvhf', 'hvlf', 'lvhf', 'lvlf'] as const;
                const headers = ['SEGMENT', 'INTERACTIONS', 'WoW', 'SENTIMENT', 'FCI RATE'];
                return (
                  <>
                    <div
                      className="grid items-center px-3 py-2 gap-3"
                      style={{
                        gridTemplateColumns: tableCols,
                        background: isDarkMode ? '#151515' : '#f8f9fa',
                        borderBottom: `1px solid ${isDarkMode ? '#1f1f1f' : '#e5e5e5'}`,
                      }}
                    >
                      {headers.map((h) => (
                        <span
                          key={h}
                          className="text-[9px] font-bold tracking-wider"
                          style={{
                            color: '#939394',
                            paddingLeft: h === 'WoW' ? 8 : 0,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            minWidth: 0,
                          }}
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                    {segmentKeysArr.map((k, idx) => {
                      const seg = kpiData.totalInteraction.customerSegments[k];
                      const sent = kpiData.customerSentiment.segmentSentimentBreakdown[k];
                      const fci = kpiData.fciRate.segmentFCI[k];
                      const color = SEGMENT_COLORS[k];
                      const delta = seg.delta ?? 0;
                      const isFlat = Math.abs(delta) < 0.05;
                      const isUp = delta > 0;
                      const deltaColor = isFlat ? '#939394' : isUp ? '#10b981' : '#ef4444';
                      const arrow = isFlat ? '●' : isUp ? '▲' : '▼';
                      // Sentiment score on -1..+1 scale: (positive% − negative%) / 100
                      const sentimentScore = (sent.positive - sent.negative) / 100;
                      const sentimentColor =
                        sentimentScore > 0.05
                          ? '#10b981'
                          : sentimentScore < -0.05
                          ? '#ef4444'
                          : '#f59e0b';
                      const sentimentLabel = Math.abs(sentimentScore).toFixed(2);
                      return (
                        <div
                          key={k}
                          className="grid items-center px-3 py-2 gap-3"
                          style={{
                            gridTemplateColumns: tableCols,
                            borderTop: idx === 0 ? 'none' : `1px solid ${isDarkMode ? '#1f1f1f' : '#e5e5e5'}`,
                          }}
                          title={`${k.toUpperCase()} · ${formatNumber(seg.count)} interactions · WoW ${isUp ? '+' : ''}${delta.toFixed(1)}% · Sentiment ${sentimentLabel} · FCI ${fci.rate}%`}
                        >
                          <span
                            className="inline-flex items-center justify-center text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{
                              background: `${color}18`,
                              color,
                              border: `1px solid ${color}40`,
                              width: 'max-content',
                            }}
                          >
                            {k.toUpperCase()}
                          </span>
                          <span
                            className="text-[13px] font-semibold tabular-nums"
                            style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                          >
                            {formatNumber(seg.count)}
                          </span>
                          <span
                            className="inline-flex items-center gap-1 text-[11px] font-semibold tabular-nums whitespace-nowrap"
                            style={{ color: deltaColor, paddingLeft: 8 }}
                          >
                            <span style={{ fontSize: 9 }}>{arrow}</span>
                            {Math.abs(delta).toFixed(1)}%
                          </span>
                          <span
                            className="text-[13px] font-bold tabular-nums"
                            style={{ color: sentimentColor }}
                            title={`Positive ${sent.positive}% · Neutral ${sent.neutral}% · Negative ${sent.negative}% → score ${sentimentLabel}`}
                          >
                            {sentimentLabel}
                          </span>
                          <span className="text-[13px] font-bold tabular-nums" style={{ color: '#FFFFFF' }}>
                            {fci.rate}%
                          </span>
                        </div>
                      );
                    })}
                  </>
                );
              })()}
            </div>

          </div>

          {/* Card 2 — Sentiment by Relationship Value */}
          <div
            className="border rounded-xl p-3 cursor-pointer flex flex-col h-full relative overflow-hidden"
            style={getCardStyle(hoveredCard === 'wealth')}
            onMouseEnter={() => setHoveredCard('wealth')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div
              aria-hidden
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                width: 3,
                background: '#5332FF',
                borderTopLeftRadius: 'inherit',
                borderBottomLeftRadius: 'inherit',
                pointerEvents: 'none',
              }}
            />
            <div className="flex items-start justify-between mb-1.5">
              <div className="min-w-0">
                <span className="font-bold text-sm" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                  Sentiment by Relationship Value
                </span>
                <p className="text-[10px] mt-0.5" style={{ color: '#939394' }}>
                  Sentiment split · deposits at stake
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-around mb-2 flex-1 min-h-0">
              {WEALTH_TIERS.map((tier) => (
                <div key={tier.id}>
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-[10.5px] font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101', letterSpacing: 0.3 }}>
                      {tier.label}
                    </span>
                    <span className="text-[10px]" style={{ color: '#939394', fontVariantNumeric: 'tabular-nums' }}>
                      {tier.deposits} · {tier.accts} accts
                    </span>
                  </div>
                  <div
                    className="flex h-5 rounded-md overflow-hidden"
                    style={{ backgroundColor: isDarkMode ? '#1f1f1f' : '#f0f0f0' }}
                    title={`Happy ${tier.happy}% · Neutral ${tier.neutral}% · Unhappy ${tier.unhappy}%`}
                  >
                    <div
                      className="h-full flex items-center justify-center"
                      style={{ width: `${tier.happy}%`, background: '#22c55e' }}
                    >
                      {tier.happy >= 14 && (
                        <span className="text-[10px] font-bold text-black">{tier.happy}%</span>
                      )}
                    </div>
                    <div
                      className="h-full flex items-center justify-center"
                      style={{ width: `${tier.neutral}%`, background: '#f59e0b' }}
                    >
                      {tier.neutral >= 14 && (
                        <span className="text-[10px] font-bold text-black">{tier.neutral}%</span>
                      )}
                    </div>
                    <div
                      className="h-full flex items-center justify-center"
                      style={{ width: `${tier.unhappy}%`, background: '#ef4444' }}
                    >
                      {tier.unhappy >= 14 && (
                        <span className="text-[10px] font-bold text-white">{tier.unhappy}%</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="flex flex-wrap items-center gap-x-3 gap-y-0.5 pt-1.5"
              style={{ borderTop: `1px solid ${isDarkMode ? '#1f1f1f' : '#e5e5e5'}` }}
            >
              {[
                { label: 'Happy',   color: '#22c55e' },
                { label: 'Neutral', color: '#f59e0b' },
                { label: 'Unhappy', color: '#ef4444' },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
                  <span className="text-[9.5px]" style={{ color: '#939394' }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3 — Top Intent */}
          <div
            className="border rounded-xl p-3 cursor-pointer flex flex-col h-full"
            style={getCardStyle(hoveredCard === 'risk')}
            onMouseEnter={() => setHoveredCard('risk')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                Top Intent
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <div className="text-2xl font-bold leading-none" style={{ color: '#ef4444' }}>
                {formatNumber(kpiData.riskSignal.totalFlagged)}
              </div>
              <span className="text-[11px]" style={{ color: '#939394' }}>identified</span>
            </div>

            <div className="flex-1 flex flex-col justify-between gap-2 min-h-0">
              <div>
                {(() => {
                  const riskCategories = [
                    { key: 'fraud',       label: 'App Login & Auth', color: '#ef4444', cases: kpiData.riskSignal.fraud.cases },
                    { key: 'operational', label: 'Card Declines',    color: '#f59e0b', cases: kpiData.riskSignal.operational.cases },
                    { key: 'reputation',  label: 'Fee Disputes',     color: '#06b6d4', cases: kpiData.riskSignal.reputation.cases },
                    { key: 'thirdParty',  label: 'Wealth / RM',      color: '#10b981', cases: kpiData.riskSignal.thirdParty.cases },
                  ];
                  const total = riskCategories.reduce((sum, r) => sum + r.cases, 0);

                  return (
                    <>
                      <div className="flex h-5 rounded-lg overflow-hidden mb-1.5">
                        {riskCategories.map((risk) => (
                          <div
                            key={risk.key}
                            className="flex items-center justify-center transition-all hover:opacity-80 cursor-pointer"
                            style={{
                              width: `${(risk.cases / total) * 100}%`,
                              backgroundColor: risk.color,
                            }}
                            title={`${risk.label}: ${risk.cases}`}
                          >
                            <span className="text-[9px] font-bold text-white">{risk.cases}</span>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                        {riskCategories.map((risk) => (
                          <div key={risk.key} className="flex items-center gap-1.5 min-w-0">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: risk.color }} />
                            <span className="text-[11px] truncate" style={{ color: '#d6d9d8' }}>{risk.label}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>

              <div>
                <p className="text-[9px] font-bold mb-1 tracking-wide" style={{ color: '#939394' }}>INTENT VOLUME BY SEGMENT</p>
                <div className="grid grid-cols-4 gap-1">
                  {Object.entries(kpiData.riskSignal.segmentRisk).map(([key, segment]) => {
                    const labels: Record<string, string> = {
                      hvhf: 'HVHF',
                      hvlf: 'HVLF',
                      lvhf: 'LVHF',
                      lvlf: 'LVLF',
                    };
                    return (
                      <div
                        key={key}
                        className="flex flex-col items-center py-1 px-0.5 rounded-lg"
                        style={{ backgroundColor: isDarkMode ? '#1f1f1f' : '#f8f9fa' }}
                      >
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
                          style={{
                            backgroundColor: `${segmentColors[key]}20`,
                            color: segmentColors[key],
                            border: `1.5px solid ${segmentColors[key]}`,
                          }}
                        >
                          {segment.count}
                        </div>
                        <span className="text-[8.5px] mt-0.5 leading-none" style={{ color: '#939394' }}>{labels[key]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Card 4 — NPS Segment Monitor */}
          <div
            className="border rounded-xl p-3 cursor-pointer flex flex-col h-full"
            style={getCardStyle(hoveredCard === 'nps')}
            onMouseEnter={() => setHoveredCard('nps')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-start justify-between mb-1">
              <div className="min-w-0">
                <span className="font-bold text-sm" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                  NPS Segment Monitor
                </span>
                <p className="text-[10px] mt-0.5" style={{ color: '#939394' }}>
                  12-week rolling · HVHF deterioration is fastest (-28 pts)
                </p>
              </div>
            </div>
            <div className="flex-1 min-h-0" style={{ minHeight: 130 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={NPS_TREND} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke={isDarkMode ? '#1f1f1f' : '#e5e5e5'} strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 10, fill: '#939394' }}
                    axisLine={{ stroke: '#393939' }}
                    tickLine={false}
                    tickMargin={6}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#939394' }}
                    axisLine={false}
                    tickLine={false}
                    width={34}
                    tickMargin={4}
                    domain={[0, 70]}
                    ticks={[0, 20, 40, 60]}
                  />
                  <Line type="monotone" dataKey="HVHF" stroke={segmentColors.hvhf} strokeWidth={2.5} dot={{ r: 2, fill: '#fff', strokeWidth: 2 }} />
                  <Line type="monotone" dataKey="HVLF" stroke={segmentColors.hvlf} strokeWidth={2} dot={{ r: 2, fill: '#fff', strokeWidth: 2 }} />
                  <Line type="monotone" dataKey="LVHF" stroke={segmentColors.lvhf} strokeWidth={2} strokeDasharray="4 3" dot={{ r: 2, fill: '#fff', strokeWidth: 2 }} />
                  <Line type="monotone" dataKey="LVLF" stroke={segmentColors.lvlf} strokeWidth={2} dot={{ r: 2, fill: '#fff', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 pt-1" style={{ borderTop: `1px solid ${isDarkMode ? '#1f1f1f' : '#e5e5e5'}` }}>
              {[
                { label: 'HVHF', color: segmentColors.hvhf },
                { label: 'HVLF', color: segmentColors.hvlf },
                { label: 'LVHF', color: segmentColors.lvhf },
                { label: 'LVLF', color: segmentColors.lvlf },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-[10px]" style={{ color: '#939394' }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 5 — Vulnerable Customer Watchlist (condensed) */}
          <div
            className="border rounded-xl p-3 cursor-pointer flex flex-col h-full relative overflow-hidden"
            style={getCardStyle(hoveredCard === 'vulnerable')}
            onMouseEnter={() => setHoveredCard('vulnerable')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div
              aria-hidden
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                width: 3,
                background: '#f59e0b',
                borderTopLeftRadius: 'inherit',
                borderBottomLeftRadius: 'inherit',
                pointerEvents: 'none',
              }}
            />
            <div
              aria-hidden
              style={{
                position: 'absolute', top: -40, right: -40, width: 120, height: 120,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(245,158,11,0.09) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="min-w-0">
                <span className="font-bold text-sm" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                  Vulnerable Watchlist
                </span>
                <p className="text-[10px] mt-0.5" style={{ color: '#939394' }}>
                  High Churn Signals
                </p>
              </div>
              <span
                className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full flex-shrink-0 flex items-center gap-1"
                style={{ color: '#f59e0b', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}
              >
                <Sparkles size={9} />
                AI
              </span>
            </div>

            <div className="flex flex-col justify-around gap-1 flex-1 min-h-0">
              {VULNERABLE_SEGMENTS.map((row) => {
                const sevColor = SEVERITY_COLORS[row.severity];
                const segmentKey = row.segment.toLowerCase() as keyof typeof SEGMENT_COLORS;
                const segmentColor = SEGMENT_COLORS[segmentKey] ?? '#939394';
                return (
                  <div
                    key={row.segment}
                    className="flex items-center justify-between gap-2 px-2 py-1 rounded-md"
                    style={{
                      background: `${segmentColor}12`,
                      border: `1px solid ${segmentColor}30`,
                    }}
                  >
                    <div className="min-w-0 flex items-center gap-2">
                      <span className="text-[11px] font-bold" style={{ color: segmentColor }}>
                        {row.segment}
                      </span>
                      <span className="text-[10px]" style={{ color: '#939394' }}>
                        · {row.count} customer{row.count === 1 ? '' : 's'}
                      </span>
                    </div>
                    <span
                      className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full flex-shrink-0"
                      style={{
                        color: sevColor,
                        background: `${sevColor}14`,
                        border: `1px solid ${sevColor}40`,
                      }}
                    >
                      {row.severity}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 6 — Strain & Friction */}
          <div
            className="border rounded-xl p-3 cursor-pointer flex flex-col h-full"
            style={getCardStyle(hoveredCard === 'emotion')}
            onMouseEnter={() => setHoveredCard('emotion')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-sm" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                Strain &amp; Friction
              </span>
              <div className="flex items-center gap-1">
                <TrendingUp size={11} style={{ color: '#ef4444' }} />
                <span className="text-[9.5px]" style={{ color: '#939394' }}>+2.1% vs last</span>
              </div>
            </div>

            <div className="mb-2">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[11px] font-semibold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                  Strained Conversations
                </span>
                <span className="text-[11px] font-bold" style={{ color: '#5332FF', fontVariantNumeric: 'tabular-nums' }}>34.2%</span>
              </div>
              <div
                className="relative w-full h-4 rounded-full overflow-hidden"
                style={{ backgroundColor: isDarkMode ? '#1f1f1f' : '#f0f0f0' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: '34.2%',
                    background: 'linear-gradient(90deg, #5332FF 0%, #7c3aed 100%)',
                    boxShadow: '0 0 8px rgba(83,50,255,0.4)',
                  }}
                />
              </div>
            </div>

            <div className="flex-1 flex flex-col min-h-0">
              <p className="text-[9.5px] font-bold mb-1.5 tracking-wide" style={{ color: '#939394' }}>
                FRUSTRATION SIGNALS
              </p>
              {(() => {
                const segmentOrder: Array<keyof FrictionSegmentBreakdown> = ['hvhf', 'hvlf', 'lvhf', 'lvlf'];
                // 6-col grid: signal label | HVHF | HVLF | LVHF | LVLF | total
                const gridCols = 'minmax(0,1fr) 44px 44px 44px 44px 56px';
                return (
                  <div
                    className="rounded-lg overflow-hidden"
                    style={{
                      backgroundColor: isDarkMode ? '#1f1f1f' : '#f8f9fa',
                      border: `1px solid ${isDarkMode ? '#2a2a2a' : '#e5e5e5'}`,
                    }}
                  >
                    {/* Header row — segment colors act as column cues */}
                    <div
                      className="grid items-center px-2 py-1 gap-x-1"
                      style={{
                        gridTemplateColumns: gridCols,
                        borderBottom: `1px solid ${isDarkMode ? '#2a2a2a' : '#e5e5e5'}`,
                      }}
                    >
                      <span className="text-[8.5px] font-bold tracking-wider" style={{ color: '#939394' }}>
                        SIGNAL
                      </span>
                      {segmentOrder.map((k) => (
                        <span
                          key={k}
                          className="text-[8.5px] font-bold tracking-wide text-center"
                          style={{ color: SEGMENT_COLORS[k] }}
                        >
                          {k.toUpperCase()}
                        </span>
                      ))}
                      <span
                        className="text-[8.5px] font-bold tracking-wider text-right"
                        style={{ color: '#5332FF' }}
                      >
                        TOTAL
                      </span>
                    </div>

                    {/* Data rows */}
                    {FRICTION_SIGNALS.map(({ label, value, icon: Icon, bySegment }, idx) => (
                      <div
                        key={label}
                        className="grid items-center px-2 py-1 gap-x-1"
                        style={{
                          gridTemplateColumns: gridCols,
                          borderTop: idx === 0 ? 'none' : `1px solid ${isDarkMode ? '#2a2a2a' : '#e5e5e5'}`,
                        }}
                        title={`${label} — ${segmentOrder.map((k) => `${k.toUpperCase()} ${bySegment[k]}`).join(' · ')} · Total ${value}`}
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Icon size={11} style={{ color: '#B90ABD' }} className="shrink-0" />
                          <span className="text-[10.5px] font-medium whitespace-nowrap" style={{ color: '#d6d9d8' }}>
                            {label}
                          </span>
                        </div>
                        {segmentOrder.map((k) => (
                          <span
                            key={k}
                            className="text-[10px] font-semibold text-center tabular-nums"
                            style={{ color: SEGMENT_COLORS[k] }}
                          >
                            {bySegment[k]}
                          </span>
                        ))}
                        <span
                          className="text-[11.5px] font-bold text-right tabular-nums"
                          style={{ color: '#5332FF' }}
                        >
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Right Side — AI Summary Wall (shared). Uses absolute-fill so its
            scrollable content never forces the left KPI grid to stretch; it
            adopts the left grid's natural height and scrolls internally. */}
        <div className="flex-1 min-w-0 relative self-stretch">
          <div className="absolute inset-0">
            <AISummaryWall isDarkMode={isDarkMode} height="100%" />
          </div>
        </div>
      </div>
    </div>
  );
}
