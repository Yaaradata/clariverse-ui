'use client';

import { TrendingUp, TrendingDown, Phone, Mail, Ticket, MessageCircle, Shield, Zap, AlertOctagon, MessageSquare, Hash } from 'lucide-react';
import { AISummaryWall } from './AISummaryWall';
import { useState } from 'react';

interface FCIKPICardsProps {
  data: any;
  isDarkMode?: boolean;
}

export function FCIKPICards({ data, isDarkMode = false }: FCIKPICardsProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const kpiData = {
    totalInteraction: {
      value: 87.5,
      trend: 3.2,
      totalVolume: 2265,
      lastWeekComparison: '+142',
      sparkline: [45, 52, 48, 61, 55, 68, 75, 87],
      channels: {
        email: { count: 628, percentage: 27.7 },
        ticket: { count: 339, percentage: 15.0 },
        chat: { count: 498, percentage: 22.0 },
        voice: { count: 565, percentage: 24.9 },
        social: { count: 235, percentage: 10.4 }
      },
      peakHour: '2:00 PM',
      peakIncrease: 12
    },
    fciRate: {
      value: 18.5,
      trend: -2.3,
      channels: { 
        email: 28, 
        chat: 24, 
        voice: 32, 
        ticket: 10,
        social: 6 
      },
      actualResolutions: 419,
      target: 22.0,
      bestPerforming: 'Voice',
      worstPerforming: 'Social'
    },
    crossChannelReport: {
      value: 24.3,
      trend: 1.5,
      breakdown: { 
        emailToPhone: 12.1, 
        chatToCall: 8.2, 
        ticketToEmail: 3.5,
        other: 0.5 
      },
      volume: 551,
      commonPath: 'Email → Phone',
      avgTouchpoints: 2.8,
      multiChannelCustomers: 203
    },
    escalationRate: {
      value: 12.8,
      trend: -1.2,
      casesEscalatedToday: 290,
      avgEscalationTime: 4.2,
      mostEscalated: { category: 'Billing Issues', percentage: 34 },
      secondMostEscalated: { category: 'Technical Support', percentage: 28 },
      thirdMostEscalated: { category: 'Account Access', percentage: 18 },
      tier2: 68,
      tier3: 32
    },
    riskSignal: {
      fraud: { percentage: 3.2, cases: 72, trend: -0.5 },
      outage: { percentage: 0.8, cases: 18, trend: 0.0 },
      compliance: { percentage: 5.1, cases: 115, trend: 1.2 },
      totalFlagged: 205,
      highPriority: 28,
      critical: 5,
      resolvedToday: 67
    },
    customerSentiment: {
      value: 72,
      trend: 2.1,
      positive: 45,
      neutral: 27,
      negative: 28,
      analyzedInteractions: 945,
      improvementFromYesterday: '+0.8%',
      negativeTopics: ['Wait times', 'Transfer issues'],
      positiveTopics: ['Quick resolution', 'Agent helpfulness'],
      npsScore: 68,
      detractors: 18
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

  const LineChart = ({ data }: { data: number[] }) => {
    const width = 320;
    const height = 40;
    const padding = 4;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    let pathD = '';
    let areaD = '';
    data.forEach((value, idx) => {
      const x = (idx / (data.length - 1)) * chartWidth + padding;
      const y = height - ((value - min) / range) * chartHeight - padding;
      pathD += `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
      if (idx === 0) areaD += `M ${x} ${height} L ${x} ${y}`;
      else areaD += ` L ${x} ${y}`;
    });
    areaD += ` L ${width - padding} ${height} Z`;

    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="w-full">
        <defs>
          <linearGradient id="sparklineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5332FF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#5332FF" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#sparklineGradient)" />
        <path d={pathD} stroke="#5332FF" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

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
    <div className="p-6" style={{ backgroundColor: isDarkMode ? '#000000' : '#f8f9fa' }}>
      <div className="grid grid-cols-5 gap-4">
        {/* Left Side - 6 KPI Cards */}
        <div className="col-span-3 flex flex-col gap-4" style={{ height: '600px' }}>
          {/* Row 1 - Top 3 Cards */}
          <div className="grid grid-cols-3 gap-4" style={{ height: '290px' }}>
            {/* Card 1 - Total Interaction */}
            <div 
              className="border rounded-2xl p-4 cursor-pointer flex flex-col h-full"
              style={getCardStyle(hoveredCard === 'total')}
              onMouseEnter={() => setHoveredCard('total')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>Total Interactions</span>
                <TrendBadge trend={kpiData.totalInteraction.trend} isPositive={false} />
              </div>
              <div className="text-3xl font-bold mb-3" style={{ 
                background: 'linear-gradient(135deg, #5332FF 0%, #7c3aed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {formatNumber(kpiData.totalInteraction.totalVolume)}
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div className="grid grid-cols-5 gap-1 mb-3">
                  {Object.entries(kpiData.totalInteraction.channels).map(([channel, data]) => (
                    <div 
                      key={channel}
                      className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg" 
                      style={{ backgroundColor: isDarkMode ? '#1f1f1f' : '#f8f9fa' }}
                    >
                      <div style={{ color: getChannelColor(channel) }}>
                        {getChannelIcon(channel)}
                      </div>
                      <div className="font-bold text-xs" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                        {formatNumber(data.count)}
                      </div>
                      <div className="text-[9px] text-center capitalize" style={{ color: '#939394' }}>
                        {channel}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: '#939394' }}>vs. Last Week</span>
                    <span className="font-bold" style={{ color: '#10b981' }}>{kpiData.totalInteraction.lastWeekComparison}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: '#939394' }}>Peak Hour</span>
                    <span className="font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>{kpiData.totalInteraction.peakHour}</span>
                  </div>
                  <LineChart data={kpiData.totalInteraction.sparkline} />
                </div>
              </div>
            </div>

            {/* Card 2 - FCI Rate */}
            <div 
              className="border rounded-2xl p-4 cursor-pointer flex flex-col h-full"
              style={getCardStyle(hoveredCard === 'fci')}
              onMouseEnter={() => setHoveredCard('fci')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>FCI Rate</span>
                <TrendBadge trend={kpiData.fciRate.trend} isPositive={true} />
              </div>
              <div className="text-3xl font-bold mb-3" style={{ 
                background: 'linear-gradient(135deg, #B90ABD 0%, #d946ef 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {kpiData.fciRate.value}%
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span style={{ color: '#939394' }}>Resolutions</span>
                    <span className="font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                      {formatNumber(kpiData.fciRate.actualResolutions)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span style={{ color: '#939394' }}>Target</span>
                    <span className="font-bold" style={{ color: '#10b981' }}>{kpiData.fciRate.target}%</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold mb-1" style={{ color: '#939394' }}>CHANNEL PERFORMANCE</p>
                  {Object.entries(kpiData.fciRate.channels).map(([channel, percentage]) => (
                    <div key={channel} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <div style={{ color: getChannelColor(channel) }}>
                          {getChannelIcon(channel)}
                        </div>
                        <span className="capitalize" style={{ color: '#939394' }}>{channel}</span>
                      </div>
                      <span className="font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                        {percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 3 - Cross Channel */}
            <div 
              className="border rounded-2xl p-4 cursor-pointer flex flex-col h-full"
              style={getCardStyle(hoveredCard === 'cross')}
              onMouseEnter={() => setHoveredCard('cross')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>Cross-Channel</span>
                <TrendBadge trend={kpiData.crossChannelReport.trend} isPositive={false} />
              </div>
              <div className="text-3xl font-bold mb-3" style={{ color: '#5332FF' }}>
                {kpiData.crossChannelReport.value}%
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span style={{ color: '#939394' }}>Total Cases</span>
                    <span className="font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                      {formatNumber(kpiData.crossChannelReport.volume)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span style={{ color: '#939394' }}>Avg Touchpoints</span>
                    <span className="font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                      {kpiData.crossChannelReport.avgTouchpoints}
                    </span>
                  </div>
                </div>

                <div className="p-2 rounded-lg" style={{ backgroundColor: isDarkMode ? '#1f1f1f' : '#f8f9fa' }}>
                  <p className="text-[10px] font-bold mb-1.5" style={{ color: '#939394' }}>TOP MIGRATION PATHS</p>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" style={{ color: '#5332FF' }} />
                        <span style={{ color: '#939394' }}>→</span>
                        <Phone className="w-3 h-3" style={{ color: '#f59e0b' }} />
                      </div>
                      <span className="font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                        {kpiData.crossChannelReport.breakdown.emailToPhone}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" style={{ color: '#10b981' }} />
                        <span style={{ color: '#939394' }}>→</span>
                        <Phone className="w-3 h-3" style={{ color: '#f59e0b' }} />
                      </div>
                      <span className="font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                        {kpiData.crossChannelReport.breakdown.chatToCall}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <Ticket className="w-3 h-3" style={{ color: '#ef4444' }} />
                        <span style={{ color: '#939394' }}>→</span>
                        <Mail className="w-3 h-3" style={{ color: '#5332FF' }} />
                      </div>
                      <span className="font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                        {kpiData.crossChannelReport.breakdown.ticketToEmail}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2 - Bottom 3 Cards */}
          <div className="grid grid-cols-3 gap-4" style={{ height: '290px' }}>
            {/* Escalation */}
            <div 
              className="border rounded-2xl p-4 cursor-pointer flex flex-col h-full"
              style={getCardStyle(hoveredCard === 'escalation')}
              onMouseEnter={() => setHoveredCard('escalation')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>Escalation Rate</span>
                <TrendBadge trend={kpiData.escalationRate.trend} isPositive={true} />
              </div>
              <div className="text-3xl font-bold mb-3" style={{ color: '#f59e0b' }}>
                {kpiData.escalationRate.value}%
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span style={{ color: '#939394' }}>Cases Today</span>
                    <span className="font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                      {formatNumber(kpiData.escalationRate.casesEscalatedToday)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span style={{ color: '#939394' }}>Avg Time</span>
                    <span className="font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                      {kpiData.escalationRate.avgEscalationTime}h
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="flex-1 p-1.5 rounded-lg text-center" style={{ backgroundColor: isDarkMode ? '#1f1f1f' : '#f8f9fa' }}>
                      <p className="text-[10px] mb-0.5" style={{ color: '#939394' }}>Tier 2</p>
                      <p className="text-lg font-bold" style={{ color: '#f59e0b' }}>{kpiData.escalationRate.tier2}%</p>
                    </div>
                    <div className="flex-1 p-1.5 rounded-lg text-center" style={{ backgroundColor: isDarkMode ? '#1f1f1f' : '#f8f9fa' }}>
                      <p className="text-[10px] mb-0.5" style={{ color: '#939394' }}>Tier 3</p>
                      <p className="text-lg font-bold" style={{ color: '#ef4444' }}>{kpiData.escalationRate.tier3}%</p>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg" style={{ backgroundColor: isDarkMode ? '#1f1f1f' : '#f8f9fa' }}>
                    <p className="text-[10px] font-bold mb-1" style={{ color: '#939394' }}>TOP REASONS</p>
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between text-xs">
                        <span style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                          {kpiData.escalationRate.mostEscalated.category}
                        </span>
                        <span className="font-bold" style={{ color: '#f59e0b' }}>
                          {kpiData.escalationRate.mostEscalated.percentage}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span style={{ color: '#939394' }}>
                          {kpiData.escalationRate.secondMostEscalated.category}
                        </span>
                        <span className="font-bold" style={{ color: '#939394' }}>
                          {kpiData.escalationRate.secondMostEscalated.percentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Signal */}
            <div 
              className="border rounded-2xl p-4 cursor-pointer flex flex-col h-full"
              style={getCardStyle(hoveredCard === 'risk')}
              onMouseEnter={() => setHoveredCard('risk')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>Risk Signals</span>
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold"
                  style={{ backgroundColor: isDarkMode ? '#ef444425' : '#ef444415', color: '#ef4444' }}>
                  <AlertOctagon className="w-3.5 h-3.5" />
                  <span>{kpiData.riskSignal.critical}</span>
                </div>
              </div>
              
              <div className="flex items-baseline gap-2 mb-3">
                <div className="text-3xl font-bold" style={{ color: '#ef4444' }}>
                  {formatNumber(kpiData.riskSignal.totalFlagged)}
                </div>
                <span className="text-sm" style={{ color: '#939394' }}>flagged</span>
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: isDarkMode ? '#1f1f1f' : '#f8f9fa' }}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <AlertOctagon className="w-3.5 h-3.5" style={{ color: '#ef4444' }} />
                        <span className="text-xs font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>Fraud</span>
                      </div>
                      <span className="text-sm font-bold" style={{ color: '#ef4444' }}>
                        {kpiData.riskSignal.fraud.percentage}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span style={{ color: '#939394' }}>{formatNumber(kpiData.riskSignal.fraud.cases)} cases</span>
                      <span style={{ color: '#10b981' }}>
                        {kpiData.riskSignal.fraud.trend}%
                      </span>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg" style={{ backgroundColor: isDarkMode ? '#1f1f1f' : '#f8f9fa' }}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" style={{ color: '#f59e0b' }} />
                        <span className="text-xs font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>Outage</span>
                      </div>
                      <span className="text-sm font-bold" style={{ color: '#10b981' }}>
                        {kpiData.riskSignal.outage.percentage}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span style={{ color: '#939394' }}>{formatNumber(kpiData.riskSignal.outage.cases)} cases</span>
                      <span style={{ color: '#939394' }}>No change</span>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg" style={{ backgroundColor: isDarkMode ? '#1f1f1f' : '#f8f9fa' }}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5" style={{ color: '#5332FF' }} />
                        <span className="text-xs font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>Compliance</span>
                      </div>
                      <span className="text-sm font-bold" style={{ color: '#f59e0b' }}>
                        {kpiData.riskSignal.compliance.percentage}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span style={{ color: '#939394' }}>{formatNumber(kpiData.riskSignal.compliance.cases)} cases</span>
                      <span style={{ color: '#ef4444' }}>+{kpiData.riskSignal.compliance.trend}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sentiment */}
            <div 
              className="border rounded-2xl p-4 cursor-pointer flex flex-col h-full"
              style={getCardStyle(hoveredCard === 'sentiment')}
              onMouseEnter={() => setHoveredCard('sentiment')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>Sentiment Score</span>
                <TrendBadge trend={kpiData.customerSentiment.trend} isPositive={true} />
              </div>
              <div className="text-3xl font-bold mb-3" style={{ color: '#10b981' }}>
                {kpiData.customerSentiment.value}%
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 h-2.5 rounded-full overflow-hidden mb-2">
                    <div style={{ width: `${kpiData.customerSentiment.positive}%`, backgroundColor: '#10b981' }}></div>
                    <div style={{ width: `${kpiData.customerSentiment.neutral}%`, backgroundColor: '#939394' }}></div>
                    <div style={{ width: `${kpiData.customerSentiment.negative}%`, backgroundColor: '#ef4444' }}></div>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-xs mb-2">
                    <div className="text-center">
                      <div className="font-bold" style={{ color: '#10b981' }}>{kpiData.customerSentiment.positive}%</div>
                      <div className="text-[10px]" style={{ color: '#939394' }}>Positive</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold" style={{ color: '#939394' }}>{kpiData.customerSentiment.neutral}%</div>
                      <div className="text-[10px]" style={{ color: '#939394' }}>Neutral</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold" style={{ color: '#ef4444' }}>{kpiData.customerSentiment.negative}%</div>
                      <div className="text-[10px]" style={{ color: '#939394' }}>Negative</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded-lg" 
                    style={{ backgroundColor: isDarkMode ? '#1f1f1f' : '#f8f9fa' }}>
                    <span className="text-xs" style={{ color: '#939394' }}>NPS Score</span>
                    <span className="font-bold text-sm" style={{ color: '#10b981' }}>{kpiData.customerSentiment.npsScore}</span>
                  </div>

                  <div className="p-2 rounded-lg" style={{ backgroundColor: isDarkMode ? '#1f1f1f' : '#f8f9fa' }}>
                    <p className="text-[10px] font-bold mb-1" style={{ color: '#10b981' }}>POSITIVE</p>
                    <p className="text-xs mb-2" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                      {kpiData.customerSentiment.positiveTopics.join(' • ')}
                    </p>
                    <p className="text-[10px] font-bold mb-1" style={{ color: '#ef4444' }}>NEGATIVE</p>
                    <p className="text-xs" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                      {kpiData.customerSentiment.negativeTopics.join(' • ')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - AI Summary Wall */}
        <div className="col-span-2" style={{ height: '600px' }}>
          <AISummaryWall isDarkMode={isDarkMode} />
        </div>
      </div>
    </div>
  );
}
