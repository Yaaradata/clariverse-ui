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
  const [hoveredSegment, setHoveredSegment] = useState<{ label: string; score: number; percentage: number } | null>(null);

  const kpiData = {
    totalInteraction: {
      value: 87.5,
      trend: 3.2,
      totalVolume: 243253,
      lastWeekComparison: '+1,842',
      customerSegments: {
        hvhf: { label: 'High Value High Frequency', count: 48650, percentage: 20 },
        hvlf: { label: 'High Value Low Frequency', count: 72976, percentage: 30 },
        lvhf: { label: 'Low Value High Frequency', count: 60813, percentage: 25 },
        lvlf: { label: 'Low Value Low Frequency', count: 60814, percentage: 25 }
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
      fraud: { percentage: 2.5, cases: 20, trend: -0.5 },
      cyber: { percentage: 1.8, cases: 15, trend: 0.3 },
      operational: { percentage: 2.2, cases: 18, trend: -0.2 },
      reputation: { percentage: 1.5, cases: 12, trend: 0.1 },
      thirdParty: { percentage: 1.9, cases: 15, trend: 0.4 },
      totalFlagged: 80,
      highPriority: 12,
      critical: 3,
      resolvedToday: 24,
      segmentRisk: {
        hvhf: { count: 8, level: 'low' },
        hvlf: { count: 15, level: 'medium' },
        lvhf: { count: 32, level: 'high' },
        lvlf: { count: 25, level: 'high' }
      }
    },
    customerSentiment: {
      value: 72,
      trend: 2.1,
      analyzedInteractions: 945,
      improvementFromYesterday: '+0.8%',
      negativeTopics: ['Wait times', 'Transfer issues'],
      positiveTopics: ['Quick resolution', 'Agent helpfulness'],
      npsScore: 68,
      detractors: 18,
      segmentSentiment: {
        hvhf: { label: 'High Value High Freq', score: 85, color: '#10b981' },
        hvlf: { label: 'High Value Low Freq', score: 72, color: '#06b6d4' },
        lvhf: { label: 'Low Value High Freq', score: 65, color: '#f59e0b' },
        lvlf: { label: 'Low Value Low Freq', score: 58, color: '#ef4444' }
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
    <div className="p-4" style={{ backgroundColor: isDarkMode ? '#000000' : '#f8f9fa' }}>
      <div className="flex gap-4">
        {/* Left Side - 4 KPI Cards in 2x2 grid */}
        <div className="flex-[2] grid grid-cols-2 gap-4">
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
                <span className="font-bold text-base" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>Risk Signals</span>
              </div>
              
              <div className="flex items-baseline gap-2 mb-3">
                <div className="text-4xl font-bold" style={{ color: '#ef4444' }}>
                  {formatNumber(kpiData.riskSignal.totalFlagged)}
                </div>
                <span className="text-sm" style={{ color: '#939394' }}>flagged</span>
              </div>
              
              <div className="flex-1 flex flex-col gap-7">
                {/* Horizontal Stacked Bar Chart */}
                <div>
                  {(() => {
                    const riskCategories = [
                      { key: 'fraud', label: 'Fraud', color: '#ef4444', cases: kpiData.riskSignal.fraud.cases },
                      { key: 'cyber', label: 'Cyber', color: '#8b5cf6', cases: kpiData.riskSignal.cyber.cases },
                      { key: 'operational', label: 'Operational', color: '#f59e0b', cases: kpiData.riskSignal.operational.cases },
                      { key: 'reputation', label: 'Reputation', color: '#06b6d4', cases: kpiData.riskSignal.reputation.cases },
                      { key: 'thirdParty', label: 'Third-Party', color: '#10b981', cases: kpiData.riskSignal.thirdParty.cases },
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
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-6">
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
                  <p className="text-[10px] font-bold mb-1" style={{ color: '#939394' }}>RISK BY SEGMENT</p>
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
              className="border rounded-xl p-4 cursor-pointer flex flex-col h-full"
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
                  <div className="flex items-center justify-center">
                    {/* Pie Chart */}
                    <div className="relative">
                      <svg width="90" height="90" viewBox="0 0 100 100">
                        {(() => {
                          const segments = Object.values(kpiData.customerSentiment.segmentSentiment);
                          const total = segments.reduce((sum, s) => sum + s.score, 0);
                          const overallSentiment = kpiData.customerSentiment.value; // 72%
                          let currentAngle = -90;
                          
                          return segments.map((segment, idx) => {
                            const piePercentage = (segment.score / total) * 100;
                            // Calculate weighted contribution to overall sentiment
                            const weightedPercentage = (segment.score / total) * overallSentiment;
                            const angle = (piePercentage / 100) * 360;
                            const startAngle = currentAngle;
                            const endAngle = currentAngle + angle;
                            currentAngle = endAngle;
                            
                            const startRad = (startAngle * Math.PI) / 180;
                            const endRad = (endAngle * Math.PI) / 180;
                            const largeArc = angle > 180 ? 1 : 0;
                            
                            const x1 = 50 + 40 * Math.cos(startRad);
                            const y1 = 50 + 40 * Math.sin(startRad);
                            const x2 = 50 + 40 * Math.cos(endRad);
                            const y2 = 50 + 40 * Math.sin(endRad);
                            
                            return (
                              <path
                                key={idx}
                                d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                fill={segment.color}
                                stroke={isDarkMode ? '#0d0d0d' : '#FFFFFF'}
                                strokeWidth="1"
                                className="cursor-pointer transition-opacity duration-200 hover:opacity-80"
                                onMouseEnter={() => setHoveredSegment({ label: segment.label, score: segment.score, percentage: Math.round(weightedPercentage * 10) / 10 })}
                                onMouseLeave={() => setHoveredSegment(null)}
                              />
                            );
                          });
                        })()}
                        <circle cx="50" cy="50" r="22" fill={isDarkMode ? '#0d0d0d' : '#FFFFFF'} />
                        {hoveredSegment && (
                          <text x="50" y="55" textAnchor="middle" fontSize="12" fontWeight="bold" fill={isDarkMode ? '#FFFFFF' : '#010101'}>
                            {hoveredSegment.percentage}%
                          </text>
                        )}
                      </svg>
                    </div>
                    {/* Legend */}
                    <div className="ml-3 space-y-1">
                      {Object.entries(kpiData.customerSentiment.segmentSentiment).map(([key, segment]) => {
                        const segments = Object.values(kpiData.customerSentiment.segmentSentiment);
                        const total = segments.reduce((sum, s) => sum + s.score, 0);
                        const overallSentiment = kpiData.customerSentiment.value;
                        const weightedPercentage = Math.round(((segment.score / total) * overallSentiment) * 10) / 10;
                        return (
                          <div 
                            key={key} 
                            className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
                            onMouseEnter={() => setHoveredSegment({ label: segment.label, score: segment.score, percentage: weightedPercentage })}
                            onMouseLeave={() => setHoveredSegment(null)}
                          >
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: segment.color }} />
                            <span className="text-[10px]" style={{ color: hoveredSegment?.label === segment.label ? segment.color : '#939394' }}>
                              {segment.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: isDarkMode ? '#1f1f1f' : '#f8f9fa' }}>
                    <p className="text-[10px] font-bold" style={{ color: '#10b981' }}>POSITIVE</p>
                    <p className="text-[10px]" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                      {kpiData.customerSentiment.positiveTopics.join(' • ')}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg" style={{ backgroundColor: isDarkMode ? '#1f1f1f' : '#f8f9fa' }}>
                    <p className="text-[10px] font-bold" style={{ color: '#ef4444' }}>NEGATIVE</p>
                    <p className="text-[10px]" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                      {kpiData.customerSentiment.negativeTopics.join(' • ')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
        </div>

        {/* Right Side - AI Summary Wall */}
        <div className="flex-1">
          <AISummaryWall isDarkMode={isDarkMode} />
        </div>
      </div>
    </div>
  );
}
