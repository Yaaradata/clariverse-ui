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
  RefreshCw,
} from 'lucide-react';
import { AISummaryWall } from '@/components/FCI/AISummaryWall';

interface RetailFCIKPICardsProps {
  data?: unknown;
  isDarkMode?: boolean;
}

// NPS Segment Monitor — 12-week rolling trend (HNI deterioration is fastest at -28 pts)
const NPS_TREND = [
  { week: 'W-11', HNI: 46, 'Mass Affluent': 38, 'Mass Retail': 22, 'Digital-Only': 52 },
  { week: 'W-10', HNI: 44, 'Mass Affluent': 37, 'Mass Retail': 20, 'Digital-Only': 54 },
  { week: 'W-9',  HNI: 42, 'Mass Affluent': 35, 'Mass Retail': 17, 'Digital-Only': 55 },
  { week: 'W-8',  HNI: 40, 'Mass Affluent': 34, 'Mass Retail': 15, 'Digital-Only': 57 },
  { week: 'W-7',  HNI: 37, 'Mass Affluent': 32, 'Mass Retail': 13, 'Digital-Only': 58 },
  { week: 'W-6',  HNI: 34, 'Mass Affluent': 30, 'Mass Retail': 10, 'Digital-Only': 59 },
  { week: 'W-5',  HNI: 31, 'Mass Affluent': 29, 'Mass Retail':  8, 'Digital-Only': 60 },
  { week: 'W-4',  HNI: 29, 'Mass Affluent': 28, 'Mass Retail':  6, 'Digital-Only': 61 },
  { week: 'W-3',  HNI: 26, 'Mass Affluent': 27, 'Mass Retail':  5, 'Digital-Only': 62 },
  { week: 'W-2',  HNI: 23, 'Mass Affluent': 25, 'Mass Retail':  3, 'Digital-Only': 63 },
  { week: 'W-1',  HNI: 21, 'Mass Affluent': 24, 'Mass Retail':  2, 'Digital-Only': 64 },
  { week: 'Now',  HNI: 18, 'Mass Affluent': 23, 'Mass Retail':  1, 'Digital-Only': 65 },
];

// Churn Signal Index — top 4 at-risk HNI customers
const CHURN_AT_RISK = [
  { id: 'HNI-001', deposit: '£480K', score: 92, reason: '3 EMI fails + 14-day unresolved fee dispute' },
  { id: 'HNI-002', deposit: '£390K', score: 87, reason: 'Mortgage complaint escalated twice' },
  { id: 'HNI-003', deposit: '£330K', score: 79, reason: 'HELOC competitor mention × 2' },
  { id: 'HNI-004', deposit: '£275K', score: 71, reason: 'App crash + negative Trustpilot review' },
];

// Repeat Contact — 10-day sparkline
const REPEAT_SPARKLINE = [
  { x: 0,   y: 45 }, { x: 11,  y: 35 }, { x: 22,  y: 40 }, { x: 33,  y: 25 },
  { x: 44,  y: 30 }, { x: 55,  y: 15 }, { x: 66,  y: 20 }, { x: 77,  y: 5  },
  { x: 88,  y: 10 }, { x: 100, y: 5  },
];

// Customer Emotion & Friction
const FRICTION_SIGNALS = [
  { label: 'Escalations',         value: 456, icon: AlertTriangle },
  { label: 'Long Handling Time',  value: 723, icon: Clock },
  { label: 'Interruptions',       value: 312, icon: MessageSquare },
  { label: 'High Agitation Calls',value: 189, icon: Phone },
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
        hvhf: { label: 'High Value High Frequency', count: 9550,  percentage: 18 },
        hvlf: { label: 'High Value Low Frequency',  count: 6360,  percentage: 12 },
        lvhf: { label: 'Low Value High Frequency',  count: 22700, percentage: 42 },
        lvlf: { label: 'Low Value Low Frequency',   count: 15130, percentage: 28 },
      },
      peakHour: '2:00 PM',
      peakIncrease: 12,
    },
    fciRate: {
      value: 1.5,
      trend: -0.3,
      segmentFCI: {
        hvhf: { label: 'HVHF', rate: 0.8, color: '#10b981' },
        hvlf: { label: 'HVLF', rate: 1.2, color: '#06b6d4' },
        lvhf: { label: 'LVHF', rate: 2.1, color: '#f59e0b' },
        lvlf: { label: 'LVLF', rate: 2.8, color: '#ef4444' },
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
        hvhf: { label: 'High Value High Freq', score: 38, color: '#10b981' },
        hvlf: { label: 'High Value Low Freq',  score: 32, color: '#06b6d4' },
        lvhf: { label: 'Low Value High Freq',  score: 26, color: '#f59e0b' },
        lvlf: { label: 'Low Value Low Freq',   score: 22, color: '#ef4444' },
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

  const segmentColors: Record<string, string> = {
    hvhf: '#10b981',
    hvlf: '#06b6d4',
    lvhf: '#f59e0b',
    lvlf: '#ef4444',
  };

  return (
    <div className="p-4">
      <div className="flex flex-nowrap gap-4 items-stretch min-w-0">
        {/* Left Side — 8 KPI Cards in a 3x3 grid (NPS trend spans 2 cols) */}
        <div className="flex-[2] min-w-0 grid grid-cols-3 gap-4">
          {/* Card 1 — Total Interactions */}
          <div
            className="border rounded-xl p-4 cursor-pointer flex flex-col h-full"
            style={getCardStyle(hoveredCard === 'total')}
            onMouseEnter={() => setHoveredCard('total')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-base" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                Total Interactions
              </span>
            </div>
            <div
              className="text-4xl font-bold mb-3"
              style={{
                background: 'linear-gradient(135deg, #5332FF 0%, #7c3aed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {formatNumber(kpiData.totalInteraction.totalVolume)}
            </div>

            <div className="flex-1 flex flex-col min-h-0">
              <p className="text-xs font-bold mb-2" style={{ color: '#939394' }}>CUSTOMER SEGMENTATION</p>
              <div className="grid grid-cols-2 gap-2 flex-1 content-start">
                {Object.entries(kpiData.totalInteraction.customerSegments).map(([key, segment]) => (
                  <div
                    key={key}
                    className="p-2.5 rounded-lg flex flex-col justify-center"
                    style={{ backgroundColor: isDarkMode ? '#1f1f1f' : '#f8f9fa' }}
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: segmentColors[key] }} />
                      <span className="text-[11px]" style={{ color: '#939394' }}>{segment.label}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-base" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                        {formatNumber(segment.count)}
                      </span>
                      <span className="text-sm font-semibold" style={{ color: segmentColors[key] }}>
                        {segment.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm mt-2 pt-2" style={{ borderTop: `1px solid ${isDarkMode ? '#1f1f1f' : '#e5e5e5'}` }}>
                <span style={{ color: '#939394' }}>vs. Last Week</span>
                <span className="font-bold" style={{ color: '#10b981' }}>
                  {kpiData.totalInteraction.lastWeekComparison}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2 — Sentiment Score */}
          <div
            className="border rounded-xl p-3 cursor-pointer flex flex-col h-full"
            style={getCardStyle(hoveredCard === 'sentiment')}
            onMouseEnter={() => setHoveredCard('sentiment')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-base" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                Sentiment Score
              </span>
            </div>
            <div className="text-4xl font-bold mb-2" style={{ color: '#10b981' }}>
              {kpiData.customerSentiment.value}%
            </div>

            <div className="flex-1 flex flex-col justify-between min-h-0">
              <div>
                <p className="text-xs font-bold mb-2" style={{ color: '#939394' }}>SENTIMENT BY SEGMENT</p>
                <div className="space-y-3">
                  {Object.entries(kpiData.customerSentiment.segmentSentimentBreakdown).map(([key, breakdown]) => {
                    const total = breakdown.positive + breakdown.neutral + breakdown.negative || 1;
                    const posPct = (breakdown.positive / total) * 100;
                    const neuPct = (breakdown.neutral / total) * 100;
                    const negPct = (breakdown.negative / total) * 100;
                    const posCount = breakdown.positiveCount ?? breakdown.positive;
                    const neuCount = breakdown.neutralCount ?? breakdown.neutral;
                    const negCount = breakdown.negativeCount ?? breakdown.negative;
                    const shortLabels: Record<string, string> = {
                      hvhf: 'HVHF',
                      hvlf: 'HVLF',
                      lvhf: 'LVHF',
                      lvlf: 'LVLF',
                    };
                    return (
                      <div key={key} className="flex items-center gap-2" title={breakdown.label}>
                        <span
                          className="text-[10px] font-bold shrink-0 text-right tracking-wide"
                          style={{ color: segmentColors[key] ?? '#939394', width: 38 }}
                        >
                          {shortLabels[key] ?? breakdown.label}
                        </span>
                        <div
                          className="flex-1 flex h-4 rounded-full overflow-hidden"
                          style={{ backgroundColor: isDarkMode ? '#1f1f1f' : '#f0f0f0' }}
                          title={`Positive ${breakdown.positive}% (${posCount}) · Neutral ${breakdown.neutral}% (${neuCount}) · Negative ${breakdown.negative}% (${negCount})`}
                        >
                          <div
                            className="h-full flex items-center justify-center shrink-0"
                            style={{
                              width: `${posPct}%`,
                              backgroundColor: '#34d399',
                              boxShadow: '0 0 6px rgba(52,211,153,0.4)',
                              minWidth: posPct > 0 ? '2px' : 0,
                            }}
                          >
                            {posPct >= 8 && (
                              <span className="text-[9px] font-bold text-black" style={{ textShadow: '0 0 4px #fff' }}>
                                {posCount}
                              </span>
                            )}
                          </div>
                          <div
                            className="h-full flex items-center justify-center shrink-0"
                            style={{
                              width: `${neuPct}%`,
                              backgroundColor: '#fbbf24',
                              boxShadow: '0 0 6px rgba(251,191,36,0.4)',
                              minWidth: neuPct > 0 ? '2px' : 0,
                            }}
                          >
                            {neuPct >= 8 && (
                              <span className="text-[9px] font-bold text-black" style={{ textShadow: '0 0 4px #fff' }}>
                                {neuCount}
                              </span>
                            )}
                          </div>
                          <div
                            className="h-full flex items-center justify-center shrink-0"
                            style={{
                              width: `${negPct}%`,
                              backgroundColor: '#ff073a',
                              boxShadow: '0 0 8px #ff073a',
                              minWidth: negPct > 0 ? '2px' : 0,
                            }}
                          >
                            {negPct >= 8 && (
                              <span className="text-[9px] font-bold text-white" style={{ textShadow: '0 0 4px #000' }}>
                                {negCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="p-2 rounded-lg" style={{ backgroundColor: isDarkMode ? '#1f1f1f' : '#f8f9fa' }}>
                  <p className="text-[10px] font-bold" style={{ color: '#34d399' }}>POSITIVE</p>
                  <p className="text-[10px]" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                    {kpiData.customerSentiment.positiveTopics.join(' • ')}
                  </p>
                </div>
                <div className="p-2 rounded-lg" style={{ backgroundColor: isDarkMode ? '#1f1f1f' : '#f8f9fa' }}>
                  <p className="text-[10px] font-bold" style={{ color: '#f87171' }}>NEGATIVE</p>
                  <p className="text-[10px]" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                    {kpiData.customerSentiment.negativeTopics.join(' • ')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 — Top Intent */}
          <div
            className="border rounded-xl p-4 cursor-pointer flex flex-col h-full"
            style={getCardStyle(hoveredCard === 'risk')}
            onMouseEnter={() => setHoveredCard('risk')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-base" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                Top Intent
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-3">
              <div className="text-4xl font-bold" style={{ color: '#ef4444' }}>
                {formatNumber(kpiData.riskSignal.totalFlagged)}
              </div>
              <span className="text-sm" style={{ color: '#939394' }}>identified</span>
            </div>

            <div className="flex-1 flex flex-col justify-between gap-3 min-h-0">
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
                      <div className="flex h-8 rounded-lg overflow-hidden mb-2">
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
                            <span className="text-[10px] font-bold text-white">{risk.cases}</span>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-2 mt-4">
                        {riskCategories.map((risk) => (
                          <div key={risk.key} className="flex items-center gap-2 min-w-0">
                            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: risk.color }} />
                            <span className="text-sm truncate" style={{ color: '#d6d9d8' }}>{risk.label}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>

              <div>
                <p className="text-[10px] font-bold mb-1" style={{ color: '#939394' }}>INTENT VOLUME BY SEGMENT</p>
                <div className="grid grid-cols-4 gap-1.5">
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
                        className="flex flex-col items-center p-1.5 rounded-lg"
                        style={{ backgroundColor: isDarkMode ? '#1f1f1f' : '#f8f9fa' }}
                      >
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
                          style={{
                            backgroundColor: `${segmentColors[key]}20`,
                            color: segmentColors[key],
                            border: `2px solid ${segmentColors[key]}`,
                          }}
                        >
                          {segment.count}
                        </div>
                        <span className="text-[9px] mt-1" style={{ color: '#939394' }}>{labels[key]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Card 4 — FCI Rate */}
          <div
            className="border rounded-xl p-4 cursor-pointer flex flex-col h-full"
            style={getCardStyle(hoveredCard === 'fci')}
            onMouseEnter={() => setHoveredCard('fci')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-base" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                FCI Rate
              </span>
            </div>
            <div
              className="text-4xl font-bold mb-3"
              style={{
                background: 'linear-gradient(135deg, #B90ABD 0%, #d946ef 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {kpiData.fciRate.value}%
            </div>

            <div className="flex-1 flex flex-col min-h-0">
              <p className="text-xs font-bold mb-2" style={{ color: '#939394' }}>FCI BY SEGMENT</p>
              <div className="flex items-end gap-2 justify-between mt-auto mb-3">
                {Object.entries(kpiData.fciRate.segmentFCI).map(([key, segment]) => {
                  const maxHeight = 130;
                  const barHeight = (segment.rate / 3) * maxHeight;
                  return (
                    <div key={key} className="flex flex-col items-center flex-1">
                      <span className="text-sm font-bold mb-1.5" style={{ color: segment.color }}>
                        {segment.rate}%
                      </span>
                      <div
                        className="w-full rounded-t-md transition-all duration-300"
                        style={{
                          height: `${barHeight}px`,
                          backgroundColor: segment.color,
                          minHeight: '12px',
                          boxShadow: `0 0 12px ${segment.color}40`,
                        }}
                      />
                      <span className="text-[11px] mt-1.5 font-medium" style={{ color: '#939394' }}>
                        {segment.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card 5 — NPS Segment Monitor (spans 2 cols) */}
          <div
            className="col-span-2 border rounded-xl p-4 cursor-pointer flex flex-col h-full"
            style={getCardStyle(hoveredCard === 'nps')}
            onMouseEnter={() => setHoveredCard('nps')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-start justify-between mb-1">
              <div className="min-w-0">
                <span className="font-bold text-base" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                  NPS Segment Monitor
                </span>
                <p className="text-[11px] mt-0.5" style={{ color: '#939394' }}>
                  12-week rolling · HNI deterioration is fastest (-28 pts)
                </p>
              </div>
              <span
                className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-1 rounded-full flex items-center gap-1 flex-shrink-0"
                style={{
                  color: '#ef4444',
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.25)',
                }}
              >
                <Sparkles size={9} /> HNI · -28
              </span>
            </div>
            <div className="flex-1 min-h-0" style={{ minHeight: 180 }}>
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
                  <Line type="monotone" dataKey="Digital-Only" stroke="#22c55e" strokeWidth={2} strokeDasharray="4 3" dot={{ r: 2, fill: '#fff', strokeWidth: 2 }} />
                  <Line type="monotone" dataKey="HNI"          stroke="#5332FF" strokeWidth={2.5} dot={{ r: 2, fill: '#fff', strokeWidth: 2 }} />
                  <Line type="monotone" dataKey="Mass Affluent" stroke="#9b85ff" strokeWidth={2} dot={{ r: 2, fill: '#fff', strokeWidth: 2 }} />
                  <Line type="monotone" dataKey="Mass Retail"   stroke="#f59e0b" strokeWidth={2} dot={{ r: 2, fill: '#fff', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 pt-1" style={{ borderTop: `1px solid ${isDarkMode ? '#1f1f1f' : '#e5e5e5'}` }}>
              {[
                { label: 'Digital-Only',  color: '#22c55e' },
                { label: 'HNI',           color: '#5332FF' },
                { label: 'Mass Affluent', color: '#9b85ff' },
                { label: 'Mass Retail',   color: '#f59e0b' },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-[10px]" style={{ color: '#939394' }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 6 — Churn Signal Index */}
          <div
            className="border rounded-xl p-4 cursor-pointer flex flex-col h-full relative overflow-hidden"
            style={{
              ...getCardStyle(hoveredCard === 'churn'),
              borderLeftWidth: '3px',
              borderLeftStyle: 'solid',
              borderLeftColor: '#ef4444',
            }}
            onMouseEnter={() => setHoveredCard('churn')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div
              aria-hidden
              style={{
                position: 'absolute', top: -40, right: -40, width: 120, height: 120,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(239,68,68,0.12) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
            <div className="flex items-start justify-between mb-1">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <Sparkles size={12} style={{ color: '#ef4444' }} />
                  <span className="font-bold text-base" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                    Churn Signal Index
                  </span>
                </div>
                <p className="text-[11px] mt-0.5" style={{ color: '#939394' }}>0 safe · 100 critical</p>
              </div>
              <span
                className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-1 rounded-full flex-shrink-0"
                style={{ color: '#ef4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}
              >
                Critical
              </span>
            </div>

            <div className="flex items-center gap-3 mb-2">
              {(() => {
                const CHURN_VALUE = 74;
                const SIZE_W = 104;
                const SIZE_H = 64;
                const CX = SIZE_W / 2;
                const CY = SIZE_H - 10;
                const R = 38;
                const ARC_LEN = Math.PI * R;
                const FILLED = (CHURN_VALUE / 100) * ARC_LEN;
                const arcPath = `M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`;
                return (
                  <div className="relative flex-shrink-0" style={{ width: SIZE_W, height: SIZE_H }}>
                    <svg width={SIZE_W} height={SIZE_H} viewBox={`0 0 ${SIZE_W} ${SIZE_H}`} style={{ display: 'block' }}>
                      <path
                        d={arcPath}
                        stroke="rgba(239,68,68,0.18)"
                        strokeWidth={9}
                        fill="none"
                        strokeLinecap="round"
                      />
                      <path
                        d={arcPath}
                        stroke="#f87171"
                        strokeWidth={9}
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${FILLED} ${ARC_LEN}`}
                        style={{ filter: 'drop-shadow(0 0 4px rgba(248,113,113,0.45))' }}
                      />
                    </svg>
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        textAlign: 'center',
                        lineHeight: 1,
                        pointerEvents: 'none',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 22,
                          fontWeight: 800,
                          color: '#ef4444',
                          fontVariantNumeric: 'tabular-nums',
                          lineHeight: 1,
                        }}
                      >
                        {CHURN_VALUE}
                      </div>
                      <div
                        style={{
                          fontSize: 8,
                          fontWeight: 700,
                          letterSpacing: '0.6px',
                          color: '#939394',
                          marginTop: 1,
                        }}
                      >
                        /100
                      </div>
                    </div>
                  </div>
                );
              })()}
              <div className="min-w-0">
                <div className="text-[10px] font-extrabold tracking-wider" style={{ color: '#ef4444' }}>CRITICAL ZONE</div>
                <div className="text-[10px]" style={{ color: '#939394' }}>4 HNI customers flagged</div>
              </div>
            </div>

            <p className="text-[10px] font-bold mb-1 tracking-wide" style={{ color: '#939394' }}>
              TOP AT-RISK · HNI
            </p>
            <div className="flex flex-col gap-1.5">
              {CHURN_AT_RISK.map((c) => (
                <div
                  key={c.id}
                  title={c.reason}
                  className="flex items-center justify-between px-2 py-1 rounded-md"
                  style={{
                    background: 'rgba(239,68,68,0.07)',
                    border: '1px solid rgba(239,68,68,0.15)',
                  }}
                >
                  <div className="min-w-0 flex items-center gap-2">
                    <span className="text-[11px] font-bold truncate" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>{c.id}</span>
                    <span className="text-[11px]" style={{ color: '#939394' }}>{c.deposit}</span>
                  </div>
                  <span className="font-extrabold" style={{ fontSize: 13, color: '#ef4444', fontVariantNumeric: 'tabular-nums' }}>{c.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 7 — Repeat Contact Rate */}
          <div
            className="border rounded-xl p-4 cursor-pointer flex flex-col h-full"
            style={getCardStyle(hoveredCard === 'repeat')}
            onMouseEnter={() => setHoveredCard('repeat')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="p-1.5 rounded-lg flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
                    boxShadow: '0 2px 8px rgba(168,85,247,0.3)',
                  }}
                >
                  <RefreshCw size={14} className="text-white" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-base block leading-tight" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                    Repeat Contact Rate
                  </span>
                  <span className="text-[10px]" style={{ color: '#939394' }}>Order-level 2+ contacts</span>
                </div>
              </div>
            </div>

            <div className="flex items-end justify-between mb-2">
              <div>
                <div className="text-4xl font-black" style={{ color: '#a855f7', lineHeight: 1 }}>12%</div>
                <p className="text-xs mt-1" style={{ color: '#cccccc' }}>4.3K orders</p>
              </div>
              <div
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                <TrendingUp size={14} style={{ color: '#ef4444' }} />
                <span className="text-xs font-bold" style={{ color: '#ef4444' }}>↑ 3%</span>
              </div>
            </div>

            <div className="flex-1 flex flex-col min-h-0 mt-3">
              <div className="flex-1 min-h-[60px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={REPEAT_SPARKLINE} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                    <defs>
                      <linearGradient id="repeatSpark" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor="#a855f7" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Line
                      type="monotone"
                      dataKey="y"
                      stroke="#a855f7"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 3, fill: '#a855f7' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px]" style={{ color: '#939394' }}>10 days ago</span>
                <span className="text-[10px]" style={{ color: '#939394' }}>Today</span>
              </div>
            </div>
          </div>

          {/* Card 8 — Strain & Friction */}
          <div
            className="border rounded-xl p-4 cursor-pointer flex flex-col h-full"
            style={getCardStyle(hoveredCard === 'emotion')}
            onMouseEnter={() => setHoveredCard('emotion')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-base" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                Strain &amp; Friction
              </span>
              <div className="flex items-center gap-1">
                <TrendingUp size={12} style={{ color: '#ef4444' }} />
                <span className="text-[10px]" style={{ color: '#939394' }}>+2.1% vs last</span>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                  Strained Conversations
                </span>
                <span className="text-xs font-bold" style={{ color: '#5332FF', fontVariantNumeric: 'tabular-nums' }}>34.2%</span>
              </div>
              <div
                className="relative w-full h-6 rounded-full overflow-hidden"
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
              <p className="text-[10px] font-bold mb-2 tracking-wide" style={{ color: '#939394' }}>
                FRUSTRATION SIGNALS
              </p>
              <div className="grid grid-cols-2 gap-2 flex-1 min-h-0">
                {FRICTION_SIGNALS.map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="rounded-lg p-2 flex flex-col justify-between"
                    style={{
                      backgroundColor: isDarkMode ? '#1f1f1f' : '#f8f9fa',
                      border: `1px solid ${isDarkMode ? '#2a2a2a' : '#e5e5e5'}`,
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <Icon size={14} style={{ color: '#B90ABD' }} />
                      <span className="text-xs font-medium" style={{ color: '#d6d9d8' }}>{label}</span>
                    </div>
                    <div
                      className="text-3xl font-bold"
                      style={{ color: '#5332FF', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}
                    >
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side — AI Summary Wall (shared) — stretches to full grid height */}
        <div className="flex-1 min-w-0">
          <AISummaryWall isDarkMode={isDarkMode} height="100%" />
        </div>
      </div>
    </div>
  );
}
