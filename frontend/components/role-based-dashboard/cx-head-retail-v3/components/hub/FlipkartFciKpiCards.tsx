'use client';

/**
 * FlipkartFciKpiCards — Customer Happiness KPI wall for head_cx_retail_v3.
 * E-commerce / Flipkart shopper context: GMV at stake, marketplace friction,
 * BBD delivery, UPI checkout, refund SLA vs Amazon.
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
import { ConfidenceBand } from '../common/ConfidenceBand';
import { CUSTOMER_VALUE_TIERS } from '../../lib/cxHeadRetailV3CustomerFciData';
import {
  HAPPINESS_BASE_WIDE,
  segmentsRankedByGmvAtRisk,
  type ValueLens,
} from '../../lib/cxHeadRetailV3HappinessLensData';
import { FLIPKART_FCI_INSIGHTS, FLIPKART_FCI_INSIGHT_DETAILS } from '../../lib/cxHeadRetailV3FlipkartFciInsights';

interface FlipkartFciKpiCardsProps {
  isDarkMode?: boolean;
  valueLens?: ValueLens;
  onValueLensChange?: (lens: ValueLens) => void;
}

const SEGMENT_COLORS = {
  hvhf: '#A855F7',
  hvlf: '#06B6D4',
  lvhf: '#6366F1',
  lvlf: '#94A3B8',
} as const;

// Happiness monitor — 12-week rolling trend across the 4 HV/LV × HF/LF customer segments
// (HVHF deterioration is fastest at -28 pts)
const HAPPINESS_TREND = [
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

// Sentiment by customer value — HV/LV × HF/LF · GMV at stake (Flipkart)
const VALUE_TIERS = CUSTOMER_VALUE_TIERS;

// Churn-signal shoppers flagged during BBD / payment spike window
type ChurnSignalSeverity = 'High' | 'Medium' | 'Low';
const CHURN_SIGNAL_SEGMENTS: Array<{ segment: string; count: number; severity: ChurnSignalSeverity }> = [
  { segment: 'HVHF', count: 12, severity: 'High' },
  { segment: 'HVLF', count: 8, severity: 'High' },
  { segment: 'LVHF', count: 24, severity: 'Medium' },
  { segment: 'LVLF', count: 18, severity: 'Medium' },
];

const SEVERITY_COLORS: Record<ChurnSignalSeverity, string> = {
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
    label: '#NeverDelivered posts',
    value: 214,
    icon: MessageSquare,
    bySegment: { hvhf: 68, hvlf: 52, lvhf: 58, lvlf: 36 },
  },
  {
    label: 'Repeat refund contacts',
    value: 389,
    icon: Phone,
    bySegment: { hvhf: 124, hvlf: 98, lvhf: 102, lvlf: 65 },
  },
];

export function FlipkartFciKpiCards({
  isDarkMode = false,
  valueLens = 'hv',
  onValueLensChange,
}: FlipkartFciKpiCardsProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const rankedSegments = segmentsRankedByGmvAtRisk();
  const churnForLens = CHURN_SIGNAL_SEGMENTS.filter((row) =>
    valueLens === 'hv' ? row.segment.startsWith('HV') : row.segment.startsWith('LV'),
  );

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
    contactEffort: {
      value: 1.5,
      trend: -0.3,
      /** CPU = contacts ÷ units (not orders). Resolution Rate = first-pass resolve %. */
      bySegment: {
        hvhf: { label: 'HVHF', cpu: 0.8, resolutionRate: 58, color: SEGMENT_COLORS.hvhf },
        hvlf: { label: 'HVLF', cpu: 1.2, resolutionRate: 42, color: SEGMENT_COLORS.hvlf },
        lvhf: { label: 'LVHF', cpu: 2.1, resolutionRate: 29, color: SEGMENT_COLORS.lvhf },
        lvlf: { label: 'LVLF', cpu: 2.8, resolutionRate: 15, color: SEGMENT_COLORS.lvlf },
      },
    },
    trustSignal: {
      checkout:    { percentage: 2.8, cases: 14, trend: 0.6 },
      fulfilment:  { percentage: 2.4, cases: 11, trend: 0.3 },
      refundDelay: { percentage: 2.0, cases: 9,  trend: 0.2 },
      sellerTrust: { percentage: 1.6, cases: 6,  trend: -0.1 },
      totalFlagged: 40,
      highPriority: 7,
      critical: 3,
      resolvedToday: 5,
      segmentVolume: {
        hvhf: { count: 4, level: 'high' },
        hvlf: { count: 5, level: 'medium' },
        lvhf: { count: 5, level: 'high' },
        lvlf: { count: 4, level: 'high' },
      },
      /** Our trust-breakdown model — cliff (rare, high blast) vs slope (chronic). */
      cliffEvents: [
        { key: 'itemMissing', label: 'Item missing', color: '#ef4444', cases: 6 },
        { key: 'counterfeit', label: 'Counterfeit', color: '#f97316', cases: 5 },
        { key: 'accountTakeover', label: 'Account takeover', color: '#dc2626', cases: 3 },
      ],
      slopeEvents: [
        { key: 'wrongItem', label: 'Wrong item', color: '#f59e0b', cases: 7 },
        { key: 'damaged', label: 'Damaged', color: '#eab308', cases: 6 },
        { key: 'hiddenFee', label: 'Hidden fee', color: '#06b6d4', cases: 4 },
        { key: 'neverDelivered', label: 'Never delivered', color: '#0ea5e9', cases: 4 },
        { key: 'deliveryDelay', label: 'Delivery delay', color: '#6366f1', cases: 3 },
        { key: 'refundNotCredited', label: 'Refund-not-credited', color: '#10b981', cases: 2 },
      ],
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
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 px-1">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[11px] font-bold tracking-wide" style={{ color: '#939394' }}>
            VALUE LENS
          </span>
          {([
            { id: 'hv' as const, label: 'High-value (default)' },
            { id: 'lv' as const, label: 'Low-value (managed)' },
          ]).map((opt) => {
            const active = valueLens === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onValueLensChange?.(opt.id)}
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: 999,
                  border: active ? '1px solid #5332FF' : '1px solid #393939',
                  background: active ? 'rgba(83,50,255,0.15)' : 'transparent',
                  color: active ? '#c4b5fd' : '#939394',
                  cursor: onValueLensChange ? 'pointer' : 'default',
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 text-[11px]" style={{ color: '#939394' }}>
          <span data-testid="flipkart-base-wide-happy" data-happy-rate={HAPPINESS_BASE_WIDE.happyRate}>
            Base-wide happy {HAPPINESS_BASE_WIDE.happyRate}% (lens does not change this)
          </span>
          <ConfidenceBand band={HAPPINESS_BASE_WIDE.confidence} />
        </div>
      </div>
      <div className="flex flex-nowrap gap-4 items-stretch min-w-0">
        {/* Left Side — 6 KPI Cards in a 2-col grid (2 per row):
            Row 1: [Combined Segments · Sentiment by Customer Value]
            Row 2: [Top Intent · Happiness monitor]
            Row 3: [Churn-signal watchlist · Strain & Friction] */}
        <div className="flex-[2] min-w-0 grid grid-cols-2 gap-4">
          {/* Card 1 — Combined Segment Table (Total Interactions + Sentiment + CPU / Resolution) */}
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

            <p className="text-[10px] mb-2" style={{ color: '#939394' }} title="Contacts per unit (units, not orders)">
              CPU = contacts ÷ units (units, not orders) · Resolution Rate beside it
            </p>

            <div
              className="rounded-lg overflow-hidden flex-1 flex flex-col"
              style={{ border: `1px solid ${isDarkMode ? '#1f1f1f' : '#e5e5e5'}` }}
            >
              {(() => {
                const tableCols = '52px minmax(64px,1fr) 56px 52px 44px 48px 56px';
                const headers = [
                  { key: 'seg', label: 'SEGMENT' },
                  { key: 'int', label: 'INTERACTIONS' },
                  { key: 'wow', label: 'WoW' },
                  { key: 'sent', label: 'SENTIMENT' },
                  {
                    key: 'cpu',
                    label: 'CPU',
                    title: 'Contacts per unit (units, not orders)',
                  },
                  { key: 'res', label: 'RES.', title: 'Resolution Rate' },
                  { key: 'gmv', label: 'GMV exposed', title: 'Ranking metric — GMV exposed (₹ Cr). HV rises on its own.' },
                ] as const;
                return (
                  <>
                    <div
                      className="grid items-center px-3 py-2 gap-2"
                      style={{
                        gridTemplateColumns: tableCols,
                        background: isDarkMode ? '#151515' : '#f8f9fa',
                        borderBottom: `1px solid ${isDarkMode ? '#1f1f1f' : '#e5e5e5'}`,
                      }}
                    >
                      {headers.map((h) => (
                        <span
                          key={h.key}
                          className="text-[9px] font-bold tracking-wider"
                          title={'title' in h ? h.title : undefined}
                          style={{
                            color: '#939394',
                            paddingLeft: h.key === 'wow' ? 8 : 0,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            minWidth: 0,
                            cursor: 'title' in h ? 'help' : undefined,
                            borderBottom: h.key === 'gmv' || h.key === 'cpu' ? '1px dotted #939394' : undefined,
                          }}
                        >
                          {h.label}
                        </span>
                      ))}
                    </div>
                    {rankedSegments.map((row, idx) => {
                      const delta = row.wowDelta;
                      const isFlat = Math.abs(delta) < 0.05;
                      const isUp = delta > 0;
                      const deltaColor = isFlat ? '#939394' : isUp ? '#10b981' : '#ef4444';
                      const arrow = isFlat ? '●' : isUp ? '▲' : '▼';
                      const sentimentColor =
                        row.sentiment > 0.05
                          ? '#10b981'
                          : row.sentiment < -0.05
                          ? '#ef4444'
                          : '#f59e0b';
                      const sentimentLabel = Math.abs(row.sentiment).toFixed(2);
                      const dimmed = row.valueLens !== valueLens;
                      return (
                        <div
                          key={row.key}
                          className="grid items-center px-3 py-2 gap-2"
                          style={{
                            gridTemplateColumns: tableCols,
                            borderTop: idx === 0 ? 'none' : `1px solid ${isDarkMode ? '#1f1f1f' : '#e5e5e5'}`,
                            opacity: dimmed ? 0.45 : 1,
                          }}
                          title={`${row.label} · ranked by GMV exposed ₹${row.gmvAtRiskCr} Cr · CPU ${row.cpu} · Res ${row.resolutionRate}%`}
                        >
                          <span
                            className="inline-flex items-center justify-center text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{
                              background: `${row.color}18`,
                              color: row.color,
                              border: `1px solid ${row.color}40`,
                              width: 'max-content',
                            }}
                          >
                            {row.label}
                          </span>
                          <span
                            className="text-[13px] font-semibold tabular-nums"
                            style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                          >
                            {formatNumber(row.interactions)}
                          </span>
                          <span
                            className="inline-flex items-center gap-1 text-[11px] font-semibold tabular-nums whitespace-nowrap"
                            style={{ color: deltaColor, paddingLeft: 8 }}
                          >
                            <span style={{ fontSize: 9 }}>{arrow}</span>
                            {Math.abs(delta).toFixed(1)}%
                          </span>
                          <span className="text-[13px] font-bold tabular-nums" style={{ color: sentimentColor }}>
                            {sentimentLabel}
                          </span>
                          <span
                            className="text-[13px] font-bold tabular-nums"
                            style={{ color: '#FFFFFF' }}
                            title="Contacts per unit (units, not orders)"
                          >
                            {row.cpu.toFixed(1)}
                          </span>
                          <span className="text-[13px] font-bold tabular-nums" style={{ color: '#a5b4fc' }}>
                            {row.resolutionRate}%
                          </span>
                          <span
                            className="text-[12px] font-extrabold tabular-nums"
                            style={{ color: '#fbbf24' }}
                            title="GMV exposed — ranking metric"
                          >
                            ₹{row.gmvAtRiskCr}
                          </span>
                        </div>
                      );
                    })}
                  </>
                );
              })()}
            </div>

          </div>

          {/* Card 2 — Sentiment by Customer Value */}
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
                  Sentiment by Customer Value
                </span>
                <p className="text-[10px] mt-0.5" style={{ color: '#939394' }}>
                  Sentiment split · GMV at stake
                </p>
              </div>
              <ConfidenceBand band="Med-High" />
            </div>

            <div className="flex flex-col justify-around mb-2 flex-1 min-h-0">
              {VALUE_TIERS.map((tier) => (
                <div key={tier.id}>
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-[10.5px] font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101', letterSpacing: 0.3 }}>
                      {tier.shortLabel} · {tier.label}
                    </span>
                    <span className="text-[10px]" style={{ color: '#939394', fontVariantNumeric: 'tabular-nums' }}>
                      {tier.gmv} · {tier.interactions.toLocaleString()} int.
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

          {/* Card 3 — Top Intent (cliff vs slope trust-breakdown) */}
          <div
            className="border rounded-xl p-3 cursor-pointer flex flex-col h-full"
            style={getCardStyle(hoveredCard === 'intent')}
            onMouseEnter={() => setHoveredCard('intent')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-start justify-between mb-1 gap-2">
              <div className="min-w-0">
                <span className="font-bold text-sm" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                  Top Intent
                </span>
                <p className="text-[10px] mt-0.5" style={{ color: '#939394' }}>
                  Our trust-breakdown model — scored on incident rate × network effect.
                </p>
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <div className="text-2xl font-bold leading-none" style={{ color: '#ef4444' }}>
                {formatNumber(kpiData.trustSignal.totalFlagged)}
              </div>
              <span className="text-[11px]" style={{ color: '#939394' }}>events scored</span>
            </div>

            <div className="flex-1 flex flex-col justify-between gap-2 min-h-0">
              <div className="flex flex-col gap-2">
                {([
                  { title: 'Cliff events', items: kpiData.trustSignal.cliffEvents, hint: 'item missing · counterfeit · account takeover' },
                  { title: 'Slope events', items: kpiData.trustSignal.slopeEvents, hint: 'wrong item · damaged · hidden fee · never delivered · delivery delay · refund-not-credited' },
                ] as const).map((group) => {
                  const total = group.items.reduce((sum, r) => sum + r.cases, 0);
                  return (
                    <div key={group.title}>
                      <div className="flex items-baseline justify-between gap-2 mb-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wide" style={{ color: isDarkMode ? '#e5e5e5' : '#111' }}>
                          {group.title}
                        </span>
                        <span className="text-[9px] truncate" style={{ color: '#939394' }} title={group.hint}>
                          {total} cases
                        </span>
                      </div>
                      <div className="flex h-4 rounded-md overflow-hidden mb-1">
                        {group.items.map((evt) => (
                          <div
                            key={evt.key}
                            className="flex items-center justify-center transition-all hover:opacity-80 cursor-pointer"
                            style={{
                              width: `${(evt.cases / total) * 100}%`,
                              backgroundColor: evt.color,
                              minWidth: evt.cases > 0 ? 14 : 0,
                            }}
                            title={`${evt.label}: ${evt.cases}`}
                          >
                            {evt.cases >= 3 ? (
                              <span className="text-[8px] font-bold text-white">{evt.cases}</span>
                            ) : null}
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                        {group.items.map((evt) => (
                          <div key={evt.key} className="flex items-center gap-1 min-w-0">
                            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: evt.color }} />
                            <span className="text-[10px] truncate" style={{ color: '#d6d9d8' }}>{evt.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div>
                <p className="text-[9px] font-bold mb-1 tracking-wide" style={{ color: '#939394' }}>INTENT VOLUME BY SEGMENT</p>
                <div className="grid grid-cols-4 gap-1">
                  {Object.entries(kpiData.trustSignal.segmentVolume).map(([key, segment]) => {
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

          {/* Card 4 — Happiness monitor */}
          <div
            className="border rounded-xl p-3 cursor-pointer flex flex-col h-full"
            style={getCardStyle(hoveredCard === 'nps')}
            onMouseEnter={() => setHoveredCard('nps')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-start justify-between mb-1">
              <div className="min-w-0">
                <span className="font-bold text-sm" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                  Happiness monitor
                </span>
                <p className="text-[10px] mt-0.5" style={{ color: '#939394' }}>
                  Real-time pulse only · Relational NPS relocated to Voice→P&L (quarterly / strategic)
                </p>
              </div>
            </div>
            <div className="flex-1 min-h-0" style={{ minHeight: 130 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={HAPPINESS_TREND} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
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

          {/* Card 5 — Churn-signal watchlist (condensed) */}
          <div
            className="border rounded-xl p-3 cursor-pointer flex flex-col h-full relative overflow-hidden"
            style={getCardStyle(hoveredCard === 'churn')}
            onMouseEnter={() => setHoveredCard('churn')}
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
                  Churn-signal watchlist
                </span>
                <p className="text-[10px] mt-0.5" style={{ color: '#939394' }}>
                  Cancel-window shoppers · Plus members lead the queue
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <ConfidenceBand band="Med-High" />
                <span
                  className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full flex items-center gap-1"
                  style={{ color: '#f59e0b', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}
                >
                  <Sparkles size={9} />
                  AI
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-around gap-1 flex-1 min-h-0">
              {churnForLens.map((row) => {
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
                        · {row.count} shopper{row.count === 1 ? '' : 's'}
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
            <AISummaryWall
              data={FLIPKART_FCI_INSIGHTS}
              insightDetailsMap={FLIPKART_FCI_INSIGHT_DETAILS}
              intelligenceSubtitle="Real-time shopper CX intelligence"
              isDarkMode={isDarkMode}
              height="100%"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
