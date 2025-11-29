'use client';

import { TrendingUp, TrendingDown, Phone, Mail, Ticket, MessageCircle, Shield, Zap, AlertOctagon } from 'lucide-react';
import { AISummaryWall } from './AISummaryWall';

interface FCIKPICardsProps {
  data: any;
  isDarkMode?: boolean;
}

export function FCIKPICards({ data, isDarkMode = false }: FCIKPICardsProps) {
  const kpiData = {
    totalInteraction: {
      value: 87.5,
      trend: 3.2,
      totalVolume: 2265,
      lastWeekComparison: '+142',
      sparkline: [45, 52, 48, 61, 55, 68, 75, 87]
    },
    fciRate: {
      value: 18.5,
      trend: -2.3,
      channels: { 
        email: 28, 
        chat: 24, 
        voice: 32, 
        tickets: 10, 
        social: 6 
      },
      actualResolutions: 419
    },
    crossChannelReport: {
      value: 24.3,
      trend: 1.5,
      breakdown: { emailToPhone: 12, chatToCall: 8, other: 4.3 },
      volume: 551,
      commonPath: 'Email → Phone'
    },
    escalationRate: {
      value: 12.8,
      trend: -1.2,
      casesEscalatedToday: 290,
      avgEscalationTime: 4.2,
      mostEscalated: { category: 'Billing issues', percentage: 34 }
    },
    riskSignal: {
      fraud: { percentage: 3.2, cases: 72 },
      outage: { percentage: 0.8, cases: 18 },
      compliance: { percentage: 5.1, cases: 115 },
      totalFlagged: 2265,
      highPriority: 28
    },
    customerSentiment: {
      value: 72,
      trend: 2.1,
      positive: 45,
      neutral: 27,
      negative: 28,
      analyzedInteractions: 945,
      improvementFromYesterday: '+0.8%',
      negativeTopics: ['Wait times', 'Transfer issues']
    }
  };

  const cardStyle = {
    borderColor: isDarkMode ? '#1f1f1f' : '#E5E5E5',
    backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF'
  };

  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const TrendBadge = ({ trend, isPositive }: { trend: number; isPositive: boolean }) => (
    <div
      className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-semibold"
      style={{
        color: isPositive ? '#10b981' : '#ef4444',
        backgroundColor: isDarkMode ? (isPositive ? '#10b98120' : '#ef444420') : (isPositive ? '#10b98110' : '#ef444410')
      }}
    >
      {isPositive ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
      <span>{Math.abs(trend)}%</span>
    </div>
  );

  const LineChart = ({ data }: { data: number[] }) => {
    const width = 280;
    const height = 35;
    const padding = 4;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    let pathD = '';
    data.forEach((value, idx) => {
      const x = (idx / (data.length - 1)) * chartWidth + padding;
      const y = height - ((value - min) / range) * chartHeight - padding;
      pathD += `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    });

    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="w-full">
        <path d={pathD} stroke="#5332FF" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
      </svg>
    );
  };

  return (
    <div className="grid grid-cols-5 gap-2.5">
      {/* Left Side - 6 KPI Cards in 3x2 Grid */}
      <div className="col-span-3 grid grid-cols-3 gap-2.5">
        {/* Row 1 */}
        {/* Card 1 - Total Interaction */}
        <div className="border rounded-xl p-2.5" style={cardStyle}>
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-sm" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>Total Interaction</span>
            <TrendBadge trend={kpiData.totalInteraction.trend} isPositive={false} />
          </div>
          <div className="text-3xl font-bold mb-1" style={{ color: '#5332FF' }}>{kpiData.totalInteraction.value}%</div>
          <div className="mt-1 space-y-0.5">
            <p className="text-sm font-semibold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>vs. Last Week: {kpiData.totalInteraction.lastWeekComparison}</p>
            <p className="text-sm" style={{ color: '#939394' }}>{formatNumber(kpiData.totalInteraction.totalVolume)} total interactions</p>
            <div className="mt-0.5">
              <LineChart data={kpiData.totalInteraction.sparkline} />
            </div>
          </div>
        </div>

        {/* Card 2 - FCI Rate */}
        <div className="border rounded-xl p-2.5" style={cardStyle}>
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-sm" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>FCI Rate</span>
            <TrendBadge trend={kpiData.fciRate.trend} isPositive={true} />
          </div>
          <div className="text-3xl font-bold mb-1" style={{ color: '#B90ABD' }}>{kpiData.fciRate.value}%</div>
          <div className="space-y-0.5 mt-1">
            <p className="text-sm font-semibold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>{formatNumber(kpiData.fciRate.actualResolutions)} first contact resolutions</p>
            <div className="grid grid-cols-2 gap-y-0.5 gap-x-1 text-xs pt-0.5" style={{ color: '#939394' }}>
              <span className="flex items-center gap-1"><Mail className="w-3 h-3" />Email: {kpiData.fciRate.channels.email}%</span>
              <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />Chat: {kpiData.fciRate.channels.chat}%</span>
              <span className="flex items-center gap-1"><Phone className="w-3 h-3" />Voice: {kpiData.fciRate.channels.voice}%</span>
              <span className="flex items-center gap-1"><Ticket className="w-3 h-3" />Tickets: {kpiData.fciRate.channels.tickets}%</span>
              <span className="flex items-center gap-1 col-span-2"><Shield className="w-3 h-3" />Social Media: {kpiData.fciRate.channels.social}%</span>
            </div>
          </div>
        </div>

        {/* Card 3 - Cross Channel */}
        <div className="border rounded-xl p-2.5" style={cardStyle}>
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-sm" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>Cross Channel</span>
            <TrendBadge trend={kpiData.crossChannelReport.trend} isPositive={false} />
          </div>
          <div className="text-3xl font-bold mb-1" style={{ color: '#5332FF' }}>{kpiData.crossChannelReport.value}%</div>
          <div className="space-y-0.5 mt-1">
            <div className="text-sm" style={{ color: '#939394' }}>
              <span>Email→Phone ({kpiData.crossChannelReport.breakdown.emailToPhone}%), </span>
              <span>Chat→Call ({kpiData.crossChannelReport.breakdown.chatToCall}%)</span>
            </div>
            <p className="text-sm font-semibold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>{formatNumber(kpiData.crossChannelReport.volume)} cross-channel cases</p>
            <p className="text-sm" style={{ color: '#939394' }}>Most common: {kpiData.crossChannelReport.commonPath}</p>
          </div>
        </div>

        {/* Row 2 */}
        {/* Card 4 - Escalation Rate */}
        <div className="border rounded-xl p-2.5" style={cardStyle}>
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-sm" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>Escalation</span>
            <TrendBadge trend={kpiData.escalationRate.trend} isPositive={true} />
          </div>
          <div className="text-3xl font-bold mb-1" style={{ color: '#f59e0b' }}>{kpiData.escalationRate.value}%</div>
          <div className="space-y-0.5 mt-1">
            <p className="text-sm font-semibold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>{formatNumber(kpiData.escalationRate.casesEscalatedToday)} cases escalated today</p>
            <p className="text-sm" style={{ color: '#939394' }}>Avg. escalation time: {kpiData.escalationRate.avgEscalationTime} hours</p>
            <p className="text-sm" style={{ color: '#939394' }}>Most escalated: {kpiData.escalationRate.mostEscalated.category} ({kpiData.escalationRate.mostEscalated.percentage}%)</p>
          </div>
        </div>

        {/* Card 5 - Risk Signal */}
        <div className="border rounded-xl p-2.5" style={cardStyle}>
          <span className="font-semibold text-sm" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>Risk Signal</span>
          <div className="space-y-0.5 mt-1">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1" style={{ color: '#939394' }}><AlertOctagon className="w-3 h-3" style={{ color: '#ef4444' }} />Fraud</span>
              <span className="px-1.5 py-0.5 rounded text-sm font-semibold" style={{ backgroundColor: '#10b98120', color: '#10b981' }}>{kpiData.riskSignal.fraud.percentage}% ({kpiData.riskSignal.fraud.cases})</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1" style={{ color: '#939394' }}><Zap className="w-3 h-3" style={{ color: '#f59e0b' }} />Outage</span>
              <span className="px-1.5 py-0.5 rounded text-sm font-semibold" style={{ backgroundColor: '#10b98120', color: '#10b981' }}>{kpiData.riskSignal.outage.percentage}% ({kpiData.riskSignal.outage.cases})</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1" style={{ color: '#939394' }}><Shield className="w-3 h-3" style={{ color: '#5332FF' }} />Compliance</span>
              <span className="px-1.5 py-0.5 rounded text-sm font-semibold" style={{ backgroundColor: '#f59e0b20', color: '#f59e0b' }}>{kpiData.riskSignal.compliance.percentage}% ({kpiData.riskSignal.compliance.cases})</span>
            </div>
            <div className="pt-0.5 border-t" style={{ borderColor: isDarkMode ? '#1f1f1f' : '#E5E5E5' }}>
              <p className="text-sm font-semibold mt-0.5" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>Total flagged: {formatNumber(kpiData.riskSignal.totalFlagged)}</p>
              <p className="text-sm" style={{ color: '#ef4444' }}>High priority: {kpiData.riskSignal.highPriority} cases</p>
            </div>
          </div>
        </div>

        {/* Card 6 - Customer Sentiment */}
        <div className="border rounded-xl p-2.5" style={cardStyle}>
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-sm" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>Sentiment</span>
            <TrendBadge trend={kpiData.customerSentiment.trend} isPositive={true} />
          </div>
          <div className="text-3xl font-bold mb-1" style={{ color: '#10b981' }}>{kpiData.customerSentiment.value}%</div>
          <div className="flex gap-0.5 h-2 rounded overflow-hidden mb-1">
            <div style={{ width: `${kpiData.customerSentiment.positive}%`, backgroundColor: '#10b981' }}></div>
            <div style={{ width: `${kpiData.customerSentiment.neutral}%`, backgroundColor: '#939394' }}></div>
            <div style={{ width: `${kpiData.customerSentiment.negative}%`, backgroundColor: '#ef4444' }}></div>
          </div>
          <div className="space-y-0.5">
            <p className="text-sm" style={{ color: '#939394' }}>Based on {formatNumber(kpiData.customerSentiment.analyzedInteractions)} analyzed</p>
            <p className="text-sm font-semibold" style={{ color: '#10b981' }}>Improved from yesterday: {kpiData.customerSentiment.improvementFromYesterday}</p>
            <p className="text-sm" style={{ color: '#ef4444' }}>Trending: {kpiData.customerSentiment.negativeTopics.join(', ')}</p>
          </div>
        </div>
      </div>

      {/* Right Side - AI Summary Wall */}
      <div className="col-span-2">
        <AISummaryWall isDarkMode={isDarkMode} />
      </div>
    </div>
  );
}