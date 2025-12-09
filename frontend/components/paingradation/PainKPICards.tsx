'use client';

import { useState, useEffect } from 'react';
import { PainAISummaryWall } from './PainAISummaryWall';
import { CXPainPriorityBoard } from './CXPainPriorityBoard';
import { DisruptionHeatMap } from './DisruptionHeatMap';
import {
  overallPainHealthData,
  painByJourneyStageData,
  sentimentByCustomerTypeData,
  transportationDisruptionAlertData,
} from '@/lib/paingradation-lib/painDashboardData';
import { getPainLevelColor } from '@/lib/paingradation-lib/data';
import { useTheme } from './useTheme';

export function PainKPICards() {
  const isDarkMode = useTheme();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [hoveredSegment, setHoveredSegment] = useState<{ label: string; score: number; percentage: number; description?: string; sentimentBreakdown?: { positive: number; neutral: number; negative: number } } | null>(null);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    // Animate score
    const duration = 1500;
    const steps = 60;
    const increment = overallPainHealthData.customerPainIndex / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= overallPainHealthData.customerPainIndex) {
        setAnimatedScore(overallPainHealthData.customerPainIndex);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const formatCount = (num: number): string => {
    if (num >= 1000) {
      const k = num / 1000;
      // Round to 1 decimal place, but show as integer if it's a whole number
      return k % 1 === 0 ? `${k}K` : `${k.toFixed(1)}K`;
    }
    return num.toString();
  };

  const getCardStyle = (isHovered: boolean) => ({
    borderColor: isHovered ? '#5332FF' : (isDarkMode ? '#1f1f1f' : '#E5E5E5'),
    backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF',
    transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
    transition: 'all 0.2s ease',
  });

  return (
    <div>
      {/* Grid Layout: Left 2x2 grid, Right AI Summary Wall */}
      <div className="grid grid-cols-[2fr_1fr] gap-4" style={{ gridTemplateRows: '1fr 1fr' }}>
        {/* Left Side - 4 KPI Cards in 2x2 grid */}
        <div className="grid grid-cols-2 gap-4" style={{ gridRow: 'span 2' }}>
          {/* Card 1: Overall Pain Health (Top-Left) */}
          <div
            className="border rounded-xl p-4 cursor-pointer flex flex-col h-full"
            style={getCardStyle(hoveredCard === 'overall')}
            onMouseEnter={() => setHoveredCard('overall')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-base" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                Overall Pain Health
              </span>
            </div>

            {/* Gauge Section */}
            <div className="flex flex-col items-center mb-3">
              {/* SVG Gauge */}
              <div className="relative w-32 h-20 mb-2">
                <svg viewBox="0 0 160 90" className="w-full h-full">
                  {/* Background arc */}
                  <path
                    d="M 10 80 A 70 70 0 0 1 150 80"
                    fill="none"
                    stroke={isDarkMode ? '#2a2a2a' : '#E5E5E5'}
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  {/* Active arc */}
                  {(() => {
                    const colorConfig = getPainLevelColor(overallPainHealthData.customerPainIndex);
                    const gaugePercentage = (overallPainHealthData.customerPainIndex / 100) * 100;
                    return (
                      <>
                        <path
                          d="M 10 80 A 70 70 0 0 1 150 80"
                          fill="none"
                          stroke={colorConfig.bg}
                          strokeWidth="10"
                          strokeLinecap="round"
                          strokeDasharray={`${gaugePercentage * 2.2} 220`}
                          style={{
                            transition: 'stroke-dasharray 1.5s ease-out',
                            filter: `drop-shadow(0 0 6px ${colorConfig.glow})`,
                          }}
                        />
                        {/* Needle */}
                        <g
                          style={{
                            transform: `rotate(${-90 + (gaugePercentage * 1.8)}deg)`,
                            transformOrigin: '80px 80px',
                            transition: 'transform 1.5s ease-out',
                          }}
                        >
                          <line
                            x1="80"
                            y1="80"
                            x2="80"
                            y2="25"
                            stroke={isDarkMode ? '#FFFFFF' : '#010101'}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                          <circle
                            cx="80"
                            cy="80"
                            r="5"
                            fill={colorConfig.bg}
                            stroke={isDarkMode ? '#0d0d0d' : '#FFFFFF'}
                            strokeWidth="2"
                          />
                        </g>
                      </>
                    );
                  })()}
                </svg>
              </div>

              {/* Score Display */}
              <div className="text-center">
                <div className="flex items-baseline justify-center gap-1">
                  <span
                    className="text-4xl font-black tracking-tight"
                    style={{ color: getPainLevelColor(overallPainHealthData.customerPainIndex).bg }}
                  >
                    {animatedScore}
                  </span>
                  <span
                    className="text-xl font-bold"
                    style={{ color: isDarkMode ? '#939394' : '#666666' }}
                  >
                    /100
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                {overallPainHealthData.csat !== undefined && (
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: isDarkMode ? '#939394' : '#666666' }}>CSAT</span>
                    <span className="font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                      {overallPainHealthData.csat}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: isDarkMode ? '#939394' : '#666666' }}>Negative Sentiment</span>
                  <span className="font-bold" style={{ color: '#ef4444' }}>
                    {overallPainHealthData.negativeSentimentPercent}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: isDarkMode ? '#939394' : '#666666' }}>Repeat Contact Rate</span>
                  <span className="font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                    {overallPainHealthData.repeatContactRate}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: isDarkMode ? '#939394' : '#666666' }}>Escalation Rate</span>
                  <span className="font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                    {overallPainHealthData.escalationRate}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: isDarkMode ? '#939394' : '#666666' }}>Avg Days to Resolve</span>
                  <span className="font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                    {overallPainHealthData.avgDaysToResolve} days
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Pain by Journey Stage (Top-Right) */}
          <div
            className="border rounded-xl p-4 cursor-pointer flex flex-col h-full"
            style={getCardStyle(hoveredCard === 'journey')}
            onMouseEnter={() => setHoveredCard('journey')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-base" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                Pain by Journey Stage
              </span>
            </div>
            <div className="text-4xl font-bold mb-3" style={{
              background: 'linear-gradient(135deg, #B90ABD 0%, #d946ef 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {formatNumber(painByJourneyStageData.totalCases)}
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold mb-2" style={{ color: isDarkMode ? '#939394' : '#666666' }}>PAIN BY STAGE</p>
                <div className="flex items-end gap-2 justify-between">
                  {painByJourneyStageData.stages.map((stage, idx) => {
                    const maxPainScore = Math.max(...painByJourneyStageData.stages.map(s => s.painScore));
                    const maxHeight = 55;
                    const barHeight = (stage.painScore / maxPainScore) * maxHeight;
                    return (
                      <div key={idx} className="flex flex-col items-center flex-1">
                        <span className="text-xs font-bold mb-1" style={{ color: stage.color }}>
                          {formatCount(stage.cases)}
                        </span>
                        <div 
                          className="w-full rounded-t-sm transition-all duration-300"
                          style={{ 
                            height: `${barHeight}px`, 
                            backgroundColor: stage.color,
                            minHeight: '8px'
                          }}
                        />
                        <span className="text-[10px] mt-1 text-center" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
                          {stage.stage}
                        </span>
                        <span className="text-[9px] mt-0.5" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
                          {stage.percentage}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Sentiment by Customer Type (Bottom-Left) */}
          <div
            className="border rounded-xl p-4 cursor-pointer flex flex-col h-full"
            style={getCardStyle(hoveredCard === 'sentiment')}
            onMouseEnter={() => setHoveredCard('sentiment')}
            onMouseLeave={() => setHoveredCard(null)}
          >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-base" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
              Sentiment by Customer Type
            </span>
          </div>
          <div className="text-4xl font-bold mb-2" style={{ color: '#10b981' }}>
            {sentimentByCustomerTypeData.overallSentiment}%
          </div>

          <div className="flex-1 flex flex-col justify-between relative">
            <div>
              <p className="text-xs font-bold mb-2" style={{ color: isDarkMode ? '#939394' : '#666666' }}>SENTIMENT BY TYPE</p>
              <div className="flex items-center justify-center mb-3">
                {/* Donut Chart */}
                <div className="relative">
                  <svg width="90" height="90" viewBox="0 0 100 100">
                    {(() => {
                      const segments = sentimentByCustomerTypeData.customerTypes;
                      // Use percentage (weight) for pie chart distribution
                      const totalPercentage = segments.reduce((sum, s) => sum + s.percentage, 0);
                      let currentAngle = -90;
                      
                      return segments.map((segment, idx) => {
                        // Calculate pie percentage based on segment weight (percentage of interactions)
                        const piePercentage = (segment.percentage / totalPercentage) * 100;
                        const angle = (piePercentage / 100) * 360;
                        const startAngle = currentAngle;
                        const endAngle = currentAngle + angle;
                        currentAngle = endAngle;
                        
                        const startRad = (startAngle * Math.PI) / 180;
                        const endRad = (endAngle * Math.PI) / 180;
                        const largeArc = angle > 180 ? 1 : 0;
                        
                        // Round to 2 decimal places to avoid hydration mismatch
                        const x1 = Math.round((50 + 40 * Math.cos(startRad)) * 100) / 100;
                        const y1 = Math.round((50 + 40 * Math.sin(startRad)) * 100) / 100;
                        const x2 = Math.round((50 + 40 * Math.cos(endRad)) * 100) / 100;
                        const y2 = Math.round((50 + 40 * Math.sin(endRad)) * 100) / 100;
                        
                        return (
                          <path
                            key={idx}
                            d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                            fill={segment.color}
                            stroke={isDarkMode ? '#0d0d0d' : '#FFFFFF'}
                            strokeWidth="1"
                            className="cursor-pointer transition-opacity duration-200 hover:opacity-80"
                            onMouseEnter={() => {
                              setHoveredSegment({ 
                                label: segment.type, 
                                score: segment.sentimentScore, 
                                percentage: segment.sentimentScore,
                                description: segment.description,
                                sentimentBreakdown: segment.sentimentBreakdown
                              });
                            }}
                            onMouseLeave={() => {
                              setHoveredSegment(null);
                            }}
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
                <div className="ml-3 space-y-1 relative">
                  {sentimentByCustomerTypeData.customerTypes.map((type, idx) => {
                    const isHovered = hoveredSegment?.label === type.type;
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 cursor-pointer transition-opacity relative group"
                        style={{ opacity: hoveredSegment && !isHovered ? 0.5 : 1 }}
                        onMouseEnter={() => {
                          setHoveredSegment({ 
                            label: type.type, 
                            score: type.sentimentScore, 
                            percentage: type.sentimentScore,
                            description: type.description,
                            sentimentBreakdown: type.sentimentBreakdown
                          });
                        }}
                        onMouseLeave={() => {
                          setHoveredSegment(null);
                        }}
                      >
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: type.color }} />
                        <span className="text-[10px]" style={{ color: isHovered ? type.color : (isDarkMode ? '#939394' : '#666666') }}>
                          {type.type.split(' ')[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Customer Type Tooltip */}
              {hoveredSegment && hoveredSegment.description && (
                <div
                  className="absolute z-50 pointer-events-none transition-opacity duration-200"
                  style={{
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    opacity: 1,
                    maxWidth: '220px',
                  }}
                >
                  <div
                    className="px-3 py-2.5 rounded-lg shadow-lg"
                    style={{
                      backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF',
                      border: `1px solid ${sentimentByCustomerTypeData.customerTypes.find(t => t.type === hoveredSegment.label)?.color || '#939394'}40`,
                      boxShadow: `0 4px 12px rgba(0, 0, 0, 0.3), 0 0 0 1px ${sentimentByCustomerTypeData.customerTypes.find(t => t.type === hoveredSegment.label)?.color || '#939394'}20`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: sentimentByCustomerTypeData.customerTypes.find(t => t.type === hoveredSegment.label)?.color || '#939394' }}
                      />
                      <span
                        className="text-xs font-bold"
                        style={{ color: sentimentByCustomerTypeData.customerTypes.find(t => t.type === hoveredSegment.label)?.color || '#939394' }}
                      >
                        {hoveredSegment.label}
                      </span>
                    </div>
                    
                    {/* Sentiment Breakdown */}
                    {hoveredSegment.sentimentBreakdown && (
                      <div className="mb-2 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#10b981' }} />
                            <span className="text-[10px]" style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}>
                              Positive
                            </span>
                          </div>
                          <span className="text-[10px] font-semibold" style={{ color: '#10b981' }}>
                            {hoveredSegment.sentimentBreakdown.positive}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
                            <span className="text-[10px]" style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}>
                              Neutral
                            </span>
                          </div>
                          <span className="text-[10px] font-semibold" style={{ color: '#f59e0b' }}>
                            {hoveredSegment.sentimentBreakdown.neutral}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#ef4444' }} />
                            <span className="text-[10px]" style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}>
                              Negative
                            </span>
                          </div>
                          <span className="text-[10px] font-semibold" style={{ color: '#ef4444' }}>
                            {hoveredSegment.sentimentBreakdown.negative}%
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-2 border-t mb-2" style={{ borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5' }}>
                      <p
                        className="text-[10px] leading-relaxed"
                        style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}
                      >
                        {hoveredSegment.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="p-2 rounded-lg" style={{ backgroundColor: isDarkMode ? '#1f1f1f' : '#f8f9fa' }}>
                <p className="text-[10px] font-bold" style={{ color: '#10b981' }}>POSITIVE</p>
                <p className="text-[10px]" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                  {sentimentByCustomerTypeData.positiveFactors.join(' • ')}
                </p>
              </div>
              <div className="p-2 rounded-lg" style={{ backgroundColor: isDarkMode ? '#1f1f1f' : '#f8f9fa' }}>
                <p className="text-[10px] font-bold" style={{ color: '#ef4444' }}>NEGATIVE</p>
                <p className="text-[10px]" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                  {sentimentByCustomerTypeData.negativeFactors.join(' • ')}
                </p>
              </div>
            </div>
          </div>
        </div>

          {/* Card 4: Transportation Disruption Alert (Bottom-Right) */}
          <div
            className="border rounded-xl p-4 cursor-pointer flex flex-col h-full"
            style={getCardStyle(hoveredCard === 'disruption')}
            onMouseEnter={() => setHoveredCard('disruption')}
            onMouseLeave={() => setHoveredCard(null)}
          >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-base" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
              Transportation Disruption Alert
            </span>
          </div>
          <div className="text-4xl font-bold mb-3" style={{
            background: 'linear-gradient(135deg, #5332FF 0%, #7c3aed 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {formatNumber(transportationDisruptionAlertData.totalDisruptions)}
          </div>

          <div className="flex-1 flex flex-col justify-between relative">
            <div>
              <p className="text-xs font-bold mb-2" style={{ color: isDarkMode ? '#939394' : '#666666' }}>DISRUPTION CATEGORIES</p>
              <div className="grid grid-cols-2 gap-2">
                {transportationDisruptionAlertData.categories.map((category, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg relative group cursor-pointer transition-all duration-200"
                    style={{ 
                      backgroundColor: isDarkMode ? '#1f1f1f' : '#f8f9fa',
                      border: hoveredCategory === idx ? `1px solid ${category.color}40` : '1px solid transparent'
                    }}
                    onMouseEnter={(e) => {
                      setHoveredCategory(idx);
                      const rect = e.currentTarget.getBoundingClientRect();
                      const cardRect = e.currentTarget.closest('.border.rounded-xl')?.getBoundingClientRect();
                      if (cardRect) {
                        setTooltipPosition({
                          x: rect.left - cardRect.left + rect.width / 2,
                          y: rect.top - cardRect.top - 10
                        });
                      }
                    }}
                    onMouseLeave={() => {
                      setHoveredCategory(null);
                      setTooltipPosition(null);
                    }}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
                      <span className="text-[10px]" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
                        {category.category}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                        {formatNumber(category.count)}
                      </span>
                      <span className="text-xs font-medium" style={{ color: category.color }}>
                        {category.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tooltip */}
            {hoveredCategory !== null && tooltipPosition && (
              <div
                className="absolute z-50 pointer-events-none transition-opacity duration-200"
                style={{
                  left: `${tooltipPosition.x}px`,
                  top: `${tooltipPosition.y}px`,
                  transform: 'translateX(-50%) translateY(-100%)',
                  opacity: hoveredCategory !== null ? 1 : 0,
                }}
              >
                <div
                  className="px-3 py-2 rounded-lg shadow-lg max-w-xs"
                  style={{
                    backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF',
                    border: `1px solid ${transportationDisruptionAlertData.categories[hoveredCategory].color}40`,
                    boxShadow: `0 4px 12px rgba(0, 0, 0, 0.3), 0 0 0 1px ${transportationDisruptionAlertData.categories[hoveredCategory].color}20`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: transportationDisruptionAlertData.categories[hoveredCategory].color }}
                    />
                    <span
                      className="text-xs font-bold"
                      style={{ color: transportationDisruptionAlertData.categories[hoveredCategory].color }}
                    >
                      {transportationDisruptionAlertData.categories[hoveredCategory].category}
                    </span>
                  </div>
                  <p
                    className="text-[10px] leading-relaxed"
                    style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}
                  >
                    {transportationDisruptionAlertData.categories[hoveredCategory].description}
                  </p>
                  {/* Arrow */}
                  <div
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full"
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderTop: `6px solid ${isDarkMode ? '#1a1a1a' : '#FFFFFF'}`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        </div>

        {/* Right Side - AI Summary Wall (spans 2 rows) */}
        <div className="row-span-2">
          <PainAISummaryWall isDarkMode={isDarkMode} />
        </div>
      </div>

      {/* CX Pain Priority Board - Below the KPI Cards */}
      <div className="mt-4">
        <CXPainPriorityBoard isDarkMode={isDarkMode} />
      </div>

      {/* Disruption Heat Map - Below the Priority Board */}
      <div className="mt-4">
        <DisruptionHeatMap isDarkMode={isDarkMode} />
      </div>
    </div>
  );
}

