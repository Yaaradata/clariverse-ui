'use client';

import { TrendingUp, TrendingDown, Phone, Mail, Ticket, MessageCircle, Shield, Zap, AlertOctagon, MessageSquare, Hash, Globe, Settings, Users, Handshake } from 'lucide-react';
import { AISummaryWall } from './AISummaryWall';
import { useState } from 'react';

interface FCIKPICardsProps {
  data: any;
  isDarkMode?: boolean;
}

export function FCIKPICards({ data, isDarkMode = false }: FCIKPICardsProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Aligned with HV/LV panel in the drill-down:
  //   HV monthly contacts = 15,910  (Private · HNI · Mass Affluent · 148K accounts)
  //   LV monthly contacts = 37,830  (Mass Retail · Digital-only · 2.41M accounts)
  //   HV avg sentiment = -0.42, LV avg sentiment = -0.48
  // Within each HV/LV bucket we split 60/40 into HF/LF to preserve the 4-tier UI.
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
        lvlf: { label: 'Low Value Low Frequency',   count: 15130, percentage: 28 }
      },
      peakHour: '2:00 PM',
      peakIncrease: 12
    },
    fciRate: {
      value: 1.5,
      trend: -0.3,
      segmentFCI: {
        hvhf: { label: 'HVHF', rate: 0.8, color: '#10b981' },
        hvlf: { label: 'HVLF', rate: 1.2, color: '#06b6d4' },
        lvhf: { label: 'LVHF', rate: 2.1, color: '#f59e0b' },
        lvlf: { label: 'LVLF', rate: 2.8, color: '#ef4444' }
      }
    },
    riskSignal: {
      // Top 4 intents by monthly volume (in thousands) from HV+LV intent lists
      //   App Login & Authentication (LV 9.8K) + Account Access (LV 3.4K)  ≈ 13
      //   Card Declines (LV everyday 7.95K + HV travel/FX 1.75K)            ≈ 10
      //   Fee Disputes (LV overdraft 6.43K + HV fees 3.02K)                 ≈ 9
      //   Wealth / RM issues (HV wealth 3.82K + HV RM access 1.59K)         ≈ 5
      fraud:      { percentage: 2.5, cases: 13, trend: -0.5 },
      operational:{ percentage: 2.2, cases: 10, trend: -0.2 },
      reputation: { percentage: 1.5, cases:  9, trend:  0.1 },
      thirdParty: { percentage: 1.9, cases:  5, trend:  0.4 },
      totalFlagged: 16,
      highPriority: 6,
      critical: 2,
      resolvedToday: 4,
      // Distinct intents surfaced per tier (sum must equal totalFlagged = 16)
      segmentRisk: {
        hvhf: { count: 3, level: 'low' },
        hvlf: { count: 5, level: 'medium' },
        lvhf: { count: 4, level: 'high' },
        lvlf: { count: 4, level: 'high' }
      }
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
        lvlf: { label: 'Low Value Low Freq',   score: 22, color: '#ef4444' }
      },
      // Per-tier pos/neu/neg split. Counts are "interactions analyzed ≈ volume/100"
      //   HVHF 9,550 → 95 analyzed → 36 pos / 31 neu / 28 neg
      //   HVLF 6,360 → 64          → 20 / 21 / 23
      //   LVHF 22,700 → 227         → 59 / 73 / 95
      //   LVLF 15,130 → 151         → 33 / 45 / 73
      segmentSentimentBreakdown: {
        hvhf: { label: 'High Value High Freq', positive: 38, neutral: 32, negative: 30, positiveCount: 36, neutralCount: 31, negativeCount: 28 },
        hvlf: { label: 'High Value Low Freq',  positive: 32, neutral: 33, negative: 35, positiveCount: 20, neutralCount: 21, negativeCount: 23 },
        lvhf: { label: 'Low Value High Freq',  positive: 26, neutral: 32, negative: 42, positiveCount: 59, neutralCount: 73, negativeCount: 95 },
        lvlf: { label: 'Low Value Low Freq',   positive: 22, neutral: 30, negative: 48, positiveCount: 33, neutralCount: 45, negativeCount: 73 }
      }
    }
  };

  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const TrendBadge = ({ trend, isPositive }: { trend: number; isPositive: boolean }) => (
    <div
      className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold"
      style={{
        color: isPositive ? '#10b981' : '#ef4444',
        backgroundColor: isDarkMode ? (isPositive ? '#10b98125' : '#ef444425') : (isPositive ? '#10b98115' : '#ef444415')
      }}
    >
      {isPositive ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
      <span>{Math.abs(trend)}%</span>
    </div>
  );

  const getCardStyle = (isHovered: boolean) => ({
    borderColor: isHovered ? '#5332FF' : (isDarkMode ? '#1f1f1f' : '#E5E5E5'),
    backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF',
    transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
    transition: 'all 0.2s ease'
  });

  const getChannelIcon = (channel: string) => {
    switch(channel) {
      case 'email': return <Mail className="w-3.5 h-3.5" />;
      case 'ticket': return <Ticket className="w-3.5 h-3.5" />;
      case 'chat': return <MessageCircle className="w-3.5 h-3.5" />;
      case 'voice': return <Phone className="w-3.5 h-3.5" />;
      case 'social': return <Hash className="w-3.5 h-3.5" />;
      default: return <MessageSquare className="w-3.5 h-3.5" />;
    }
  };

  const getChannelColor = (channel: string) => {
    switch(channel) {
      case 'email': return '#5332FF';
      case 'ticket': return '#ef4444';
      case 'chat': return '#10b981';
      case 'voice': return '#f59e0b';
      case 'social': return '#8b5cf6';
      default: return '#939394';
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-nowrap gap-4 items-stretch min-w-0">
        {/* Left Side - 4 KPI Cards in 2x2 grid */}
        <div className="flex-[2] min-w-0 grid grid-cols-2 gap-4">
            {/* Card 1 - Total Interaction */}
            <div 
              className="border rounded-xl p-4 cursor-pointer flex flex-col h-full"
              style={getCardStyle(hoveredCard === 'total')}
              onMouseEnter={() => setHoveredCard('total')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-base" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>Total Interactions</span>
              </div>
              <div className="text-4xl font-bold mb-3" style={{ 
                background: 'linear-gradient(135deg, #5332FF 0%, #7c3aed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {formatNumber(kpiData.totalInteraction.totalVolume)}
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold mb-2" style={{ color: '#939394' }}>CUSTOMER SEGMENTATION</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(kpiData.totalInteraction.customerSegments).map(([key, segment]) => {
                      const colors: Record<string, string> = {
                        hvhf: '#10b981',
                        hvlf: '#06b6d4', 
                        lvhf: '#f59e0b',
                        lvlf: '#ef4444'
                      };
                      return (
                        <div 
                          key={key}
                          className="p-2 rounded-lg" 
                          style={{ backgroundColor: isDarkMode ? '#1f1f1f' : '#f8f9fa' }}
                        >
                          <div className="flex items-center gap-1 mb-1">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[key] }} />
                            <span className="text-[10px]" style={{ color: '#939394' }}>{segment.label}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                              {formatNumber(segment.count)}
                            </span>
                            <span className="text-xs font-medium" style={{ color: colors[key] }}>
                              {segment.percentage}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm mt-2">
                  <span style={{ color: '#939394' }}>vs. Last Week</span>
                  <span className="font-bold" style={{ color: '#10b981' }}>{kpiData.totalInteraction.lastWeekComparison}</span>
                </div>
              </div>
            </div>

            {/* Card 2 - FCI Rate */}
            <div 
              className="border rounded-xl p-4 cursor-pointer flex flex-col h-full"
              style={getCardStyle(hoveredCard === 'fci')}
              onMouseEnter={() => setHoveredCard('fci')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-base" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>FCI Rate</span>
              </div>
              <div className="text-4xl font-bold mb-3" style={{ 
                background: 'linear-gradient(135deg, #B90ABD 0%, #d946ef 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {kpiData.fciRate.value}%
              </div>
              
              <div className="flex-1 flex flex-col justify-between">

                <div>
                  <p className="text-xs font-bold mb-2" style={{ color: '#939394' }}>FCI BY SEGMENT</p>
                  <div className="flex items-end gap-2 justify-between">
                    {Object.entries(kpiData.fciRate.segmentFCI).map(([key, segment]) => {
                      const maxHeight = 55;
                      const barHeight = (segment.rate / 3) * maxHeight;
                      return (
                        <div key={key} className="flex flex-col items-center flex-1">
                          <span className="text-xs font-bold mb-1" style={{ color: segment.color }}>
                            {segment.rate}%
                          </span>
                          <div 
                            className="w-full rounded-t-sm transition-all duration-300"
                            style={{ 
                              height: `${barHeight}px`, 
                              backgroundColor: segment.color,
                              minHeight: '8px'
                            }}
                          />
                          <span className="text-[10px] mt-1" style={{ color: '#939394' }}>
                            {segment.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Signal */}
            <div 
              className="border rounded-xl p-4 cursor-pointer flex flex-col h-full"
              style={getCardStyle(hoveredCard === 'risk')}
              onMouseEnter={() => setHoveredCard('risk')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-base" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>Top Intent</span>
              </div>
              
              <div className="flex items-baseline gap-2 mb-3">
                <div className="text-4xl font-bold" style={{ color: '#ef4444' }}>
                  {formatNumber(kpiData.riskSignal.totalFlagged)}
                </div>
                <span className="text-sm" style={{ color: '#939394' }}>identified</span>
              </div>
              
              <div className="flex-1 flex flex-col gap-7">
                {/* Horizontal Stacked Bar Chart */}
                <div>
                  {(() => {
                    const riskCategories = [
                      { key: 'fraud',       label: 'App Login & Auth',  color: '#ef4444', cases: kpiData.riskSignal.fraud.cases },
                      { key: 'operational', label: 'Card Declines',     color: '#f59e0b', cases: kpiData.riskSignal.operational.cases },
                      { key: 'reputation',  label: 'Fee Disputes',      color: '#06b6d4', cases: kpiData.riskSignal.reputation.cases },
                      { key: 'thirdParty',  label: 'Wealth / RM',       color: '#10b981', cases: kpiData.riskSignal.thirdParty.cases },
                    ];
                    const total = riskCategories.reduce((sum, r) => sum + r.cases, 0);
                    
                    return (
                      <>
                        {/* Stacked Bar */}
                        <div className="flex h-8 rounded-lg overflow-hidden mb-1.5 mt-3">
                          {riskCategories.map((risk, idx) => (
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
                        {/* Legend */}
                        <div className="flex flex-nowrap gap-x-2 gap-y-1 mt-6">
                          {riskCategories.map((risk) => (
                            <div key={risk.key} className="flex items-center gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: risk.color }} />
                              <span className="text-xs" style={{ color: '#939394' }}>{risk.label}</span>
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
                      const segmentColors: Record<string, string> = {
                        hvhf: '#10b981',
                        hvlf: '#06b6d4',
                        lvhf: '#f59e0b',
                        lvlf: '#ef4444'
                      };
                      const labels: Record<string, string> = {
                        hvhf: 'HVHF',
                        hvlf: 'HVLF',
                        lvhf: 'LVHF',
                        lvlf: 'LVLF'
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
                              border: `2px solid ${segmentColors[key]}`
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

            {/* Sentiment */}
            <div 
              className="border rounded-xl p-3 cursor-pointer flex flex-col h-full"
              style={getCardStyle(hoveredCard === 'sentiment')}
              onMouseEnter={() => setHoveredCard('sentiment')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-base" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>Sentiment Score</span>
              </div>
              <div className="text-4xl font-bold mb-2" style={{ color: '#10b981' }}>
                {kpiData.customerSentiment.value}%
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold mb-2" style={{ color: '#939394' }}>SENTIMENT BY SEGMENT</p>
                  <div className="space-y-2">
                    {Object.entries(kpiData.customerSentiment.segmentSentimentBreakdown).map(([key, breakdown]) => {
                      const total = breakdown.positive + breakdown.neutral + breakdown.negative || 1;
                      const posPct = (breakdown.positive / total) * 100;
                      const neuPct = (breakdown.neutral / total) * 100;
                      const negPct = (breakdown.negative / total) * 100;
                      const b = breakdown as typeof breakdown & { positiveCount?: number; neutralCount?: number; negativeCount?: number };
                      const posCount = b.positiveCount ?? breakdown.positive;
                      const neuCount = b.neutralCount ?? breakdown.neutral;
                      const negCount = b.negativeCount ?? breakdown.negative;
                      const segmentColors: Record<string, string> = {
                        hvhf: '#10b981',
                        hvlf: '#06b6d4',
                        lvhf: '#f59e0b',
                        lvlf: '#ef4444'
                      };
                      return (
                        <div key={key} className="space-y-1">
                          <span className="text-[10px] block font-medium" style={{ color: segmentColors[key] ?? '#939394' }}>{breakdown.label}</span>
                          <div 
                            className="flex h-4 rounded-full overflow-hidden"
                            style={{ backgroundColor: isDarkMode ? '#1f1f1f' : '#f0f0f0' }}
                            title={`Positive ${breakdown.positive}% (${posCount}) · Neutral ${breakdown.neutral}% (${neuCount}) · Negative ${breakdown.negative}% (${negCount})`}
                          >
                            <div className="h-full flex items-center justify-center shrink-0" style={{ width: `${posPct}%`, backgroundColor: '#34d399', boxShadow: '0 0 6px rgba(52,211,153,0.4)', minWidth: posPct > 0 ? '2px' : 0 }}>
                              {posPct >= 8 && <span className="text-[9px] font-bold text-black" style={{ textShadow: '0 0 4px #fff' }}>{posCount}</span>}
                            </div>
                            <div className="h-full flex items-center justify-center shrink-0" style={{ width: `${neuPct}%`, backgroundColor: '#fbbf24', boxShadow: '0 0 6px rgba(251,191,36,0.4)', minWidth: neuPct > 0 ? '2px' : 0 }}>
                              {neuPct >= 8 && <span className="text-[9px] font-bold text-black" style={{ textShadow: '0 0 4px #fff' }}>{neuCount}</span>}
                            </div>
                            <div className="h-full flex items-center justify-center shrink-0" style={{ width: `${negPct}%`, backgroundColor: '#ff073a', boxShadow: '0 0 8px #ff073a', minWidth: negPct > 0 ? '2px' : 0 }}>
                              {negPct >= 8 && <span className="text-[9px] font-bold text-white" style={{ textShadow: '0 0 4px #000' }}>{negCount}</span>}
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
        </div>

        {/* Right Side - AI Summary Wall */}
        <div className="flex-1 min-w-0">
          <AISummaryWall isDarkMode={isDarkMode} />
        </div>
      </div>
    </div>
  );
}
