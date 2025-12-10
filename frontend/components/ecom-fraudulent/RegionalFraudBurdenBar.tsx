'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MapPin, X, TrendingUp, Users, Target } from 'lucide-react';

interface ChannelBreakdown {
  chat: number;
  email: number;
  ticket: number;
  voice: number;
  social: number;
}

interface RegionalData {
  region: string;
  'Delivery Liability Risk': number;
  'Internal Policy Violations': number;
  'Non-Resalable Returns': number;
  'Marketing Budget Waste': number;
  'Organized Fraud Rings': number;
  'Reputation Ransom Attacks': number;
  'RaaS Signals': number;
  'Cross-Channel Arbitration': number;
}

interface InsightData {
  region: string;
  pattern: string;
  aiInsight: string;
  summaryTitle?: string;
  evidence: string[];
  whyItMatters: string[];
  nextActions: string[];
  riskForecast: string[];
  ownership: string[];
  channelBreakdown: ChannelBreakdown;
}

const fraudPatterns = [
  'Delivery Liability Risk',
  'Internal Policy Violations',
  'Non-Resalable Returns',
  'Marketing Budget Waste',
  'Organized Fraud Rings',
  'Reputation Ransom Attacks',
  'RaaS Signals',
  'Cross-Channel Arbitration',
];

const fraudPatternColors: Record<string, string> = {
  'Delivery Liability Risk': '#EF4444',      // Red
  'Internal Policy Violations': '#F97316',   // Orange
  'Non-Resalable Returns': '#10B981',        // Green
  'Marketing Budget Waste': '#F59E0B',       // Amber
  'Organized Fraud Rings': '#3B82F6',         // Blue
  'Reputation Ransom Attacks': '#EC4899',     // Pink
  'RaaS Signals': '#8B5CF6',                  // Purple
  'Cross-Channel Arbitration': '#06B6D4',     // Cyan
};

const channelColors = {
  chat: '#3B82F6',
  email: '#10B981',
  ticket: '#F59E0B',
  voice: '#EC4899',
  social: '#8B5CF6',
};

// Mock data - in production, this would come from props or API
const regionalData: RegionalData[] = [
  {
    region: 'Tier 1',
    'Delivery Liability Risk': 26,
    'Internal Policy Violations': 17,
    'Non-Resalable Returns': 19,
    'Marketing Budget Waste': 30,
    'Organized Fraud Rings': 28,
    'Reputation Ransom Attacks': 34,
    'RaaS Signals': 19,
    'Cross-Channel Arbitration': 22,
  },
  {
    region: 'Tier 2',
    'Delivery Liability Risk': 18,
    'Internal Policy Violations': 10,
    'Non-Resalable Returns': 13,
    'Marketing Budget Waste': 22,
    'Organized Fraud Rings': 17,
    'Reputation Ransom Attacks': 18,
    'RaaS Signals': 11,
    'Cross-Channel Arbitration': 16,
  },
  {
    region: 'Rural',
    'Delivery Liability Risk': 15,
    'Internal Policy Violations': 7,
    'Non-Resalable Returns': 17,
    'Marketing Budget Waste': 15,
    'Organized Fraud Rings': 9,
    'Reputation Ransom Attacks': 10,
    'RaaS Signals': 7,
    'Cross-Channel Arbitration': 10,
  },
  {
    region: 'NE',
    'Delivery Liability Risk': 8,
    'Internal Policy Violations': 4,
    'Non-Resalable Returns': 4,
    'Marketing Budget Waste': 5,
    'Organized Fraud Rings': 5,
    'Reputation Ransom Attacks': 12,
    'RaaS Signals': 4,
    'Cross-Channel Arbitration': 7,
  },
  {
    region: 'Islands',
    'Delivery Liability Risk': 4,
    'Internal Policy Violations': 2,
    'Non-Resalable Returns': 2,
    'Marketing Budget Waste': 3,
    'Organized Fraud Rings': 1,
    'Reputation Ransom Attacks': 6,
    'RaaS Signals': 1,
    'Cross-Channel Arbitration': 3,
  },
];

// Region-specific insight data - in production, this would come from API
const regionInsights: Record<string, Omit<InsightData, 'pattern'>> = {
  'Tier 1': {
    region: 'Tier 1',
    aiInsight: 'High-velocity fraud using channel hopping to accelerate refund pressure.',
    summaryTitle: 'Omni-Channel Fraud Command Centers',
    evidence: [
      'Scripted INR + social threats across Chat + Social',
      'GPS mismatch clusters in top ZIPs',
      'Courier misinformation patterns repeated',
    ],
    whyItMatters: [],
    nextActions: [
      'Enforce Photo/POD capture in targeted high-risk pincodes',
      'Introduce automated hold on courier payout until status confirmed',
      'Deploy threat language auto-flagging across chat + social',
    ],
    riskForecast: [],
    ownership: [],
    channelBreakdown: { chat: 35, email: 28, ticket: 15, voice: 5, social: 17 },
  },
  'Tier 2': {
    region: 'Tier 2',
    aiInsight: 'Tier-1 methods emerging at moderate scale; opportunistic behavior.',
    summaryTitle: 'Fast-Follower Fraud Spillover',
    evidence: [
      'Playbook reuse detected from metro spread',
      'Early-stage claim stacking before verification',
      'Channel spillover into tickets + emails',
    ],
    whyItMatters: [],
    nextActions: [
      'Apply regional pincode risk tiers to adjust refund rules',
      'Enable first-line agent prompts for script-style messages',
      'Early-warning pattern alerts when repeat narratives spike',
    ],
    riskForecast: [],
    ownership: [],
    channelBreakdown: { chat: 43, email: 32, ticket: 18, voice: 4, social: 3 },
  },
  'Rural': {
    region: 'Rural',
    aiInsight: 'Lower volume but higher operational leakage per incident.',
    summaryTitle: 'Supplier-Driven Tactical Abuse',
    evidence: [
      'Seller network collusion patterns',
      'Device + account reuse across buyers',
      'Long investigation timelines → leakage',
    ],
    whyItMatters: [],
    nextActions: [
      'Reverse pickup verification for flagged sellers',
      'Deploy device fingerprint matching from chat/voice',
      'Switch to proof-first refunds only in red-zones',
    ],
    riskForecast: [],
    ownership: [],
    channelBreakdown: { chat: 40, email: 25, ticket: 20, voice: 10, social: 5 },
  },
  'NE': {
    region: 'NE',
    aiInsight: 'Lower scale but disproportionate social pressure.',
    summaryTitle: 'High Threat-Based Escalation',
    evidence: [
      'Viral threat language in transcripts',
      'SLA sensitivity → instant escalations',
      'Reputation pressure for faster refunds',
    ],
    whyItMatters: [],
    nextActions: [
      'Provide automated SLA updates to reduce escalation frequency',
      'Introduce goodwill refund caps when threats detected',
      'Create small regional reviewer risk list for monitoring',
    ],
    riskForecast: [],
    ownership: [],
    channelBreakdown: { chat: 40, email: 25, ticket: 20, voice: 10, social: 5 },
  },
  'Islands': {
    region: 'Islands',
    aiInsight: 'Smallest volumes but highest strategic fraud density.',
    summaryTitle: 'High-Intent Repeat Exploiters',
    evidence: [
      'Remote delivery validation weaknesses',
      'Repeated addresses + IPs',
      'Social review manipulation for leverage',
    ],
    whyItMatters: [],
    nextActions: [
      'Address + IP risk scoring for repeat offenders',
      'Courier proof compliance audit (small coverage, high return)',
      'Auto-flag review-refund correlation in social channels',
    ],
    riskForecast: [],
    ownership: [],
    channelBreakdown: { chat: 40, email: 25, ticket: 20, voice: 10, social: 5 },
  },
};

export default function RegionalFraudBurdenBar() {
  const [selectedInsight, setSelectedInsight] = useState<InsightData | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const checkTheme = () => {
      const theme = localStorage.getItem('theme');
      setIsDarkMode(theme === 'dark');
    };
    
    checkTheme();
    window.addEventListener('storage', checkTheme);
    
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => {
      window.removeEventListener('storage', checkTheme);
      observer.disconnect();
    };
  }, []);

  const containerBg = isDarkMode ? 'rgb(13, 13, 13)' : 'rgb(255, 255, 255)';
  const containerBorder = isDarkMode ? 'rgb(31, 31, 31)' : 'rgb(229, 231, 235)';
  const textColor = isDarkMode ? 'rgb(243, 244, 246)' : 'rgb(17, 24, 39)';
  const subtextColor = isDarkMode ? 'rgb(156, 163, 175)' : 'rgb(75, 85, 99)';
  const labelColor = isDarkMode ? 'rgb(107, 114, 128)' : 'rgb(75, 85, 99)';
  const summaryBg = isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgb(243, 244, 246)';
  const summaryBorder = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgb(209, 213, 219)';
  const summaryTextColor = isDarkMode ? 'rgb(209, 213, 219)' : 'rgb(55, 65, 81)';

  const handleBarClick = (data: any, index: number, pattern: string) => {
    const region = regionalData[index]?.region;
    if (!region) return;
    
    // Use region-specific insight data
    const regionInsight = regionInsights[region];
    if (regionInsight) {
      setSelectedInsight({
        ...regionInsight,
        pattern, // Include the clicked pattern for display
      });
    } else {
      // Fallback if region not found
      const defaultInsight: InsightData = {
        region,
        pattern,
        aiInsight: `${pattern} in ${region} shows elevated signals from communication channels.`,
        evidence: [
          'Pattern detected across multiple communication channels',
          'Consistent behavioral signals identified',
        ],
        whyItMatters: [],
        nextActions: [
          'Review channel-specific patterns',
          'Monitor trend over next 7 days',
          'Coordinate with regional fraud ops',
        ],
        riskForecast: [],
        ownership: [],
        channelBreakdown: { chat: 40, email: 25, ticket: 20, voice: 10, social: 5 },
      };
      setSelectedInsight(defaultInsight);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, entry: any) => sum + (entry.value || 0), 0);
      return (
        <div 
          className="rounded-lg p-3 shadow-lg border"
          style={{ 
            backgroundColor: containerBg,
            borderColor: containerBorder
          }}
        >
          <p className="text-sm font-semibold mb-2" style={{ color: textColor }}>{label}</p>
          <div className="space-y-1.5">
            {payload.map((entry: any, index: number) => {
              const percentage = total > 0 ? Math.round((entry.value / total) * 100) : 0;
              return (
                <div key={index} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-xs" style={{ color: summaryTextColor }}>{entry.dataKey}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold" style={{ color: textColor }}>{entry.value}</span>
                    <span className="text-xs" style={{ color: subtextColor }}>({percentage}%)</span>
                  </div>
                </div>
              );
            })}
            <div className="pt-1.5 mt-1.5" style={{ borderTop: `1px solid ${containerBorder}` }}>
              <div className="text-[10px]" style={{ color: subtextColor }}>Total: {total} signals</div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      className="rounded-xl p-5 md:p-6 h-[600px] shadow-sm flex flex-col"
      style={{ backgroundColor: containerBg, border: `1px solid ${containerBorder}` }}
    >
      {/* Header */}
      <div 
        className="flex items-center gap-2 mb-4 flex-shrink-0 pb-2"
        style={{ backgroundColor: containerBg }}
      >
        <div 
          className="p-1.5 rounded-lg border"
          style={{ 
            backgroundColor: isDarkMode ? 'rgba(34, 197, 94, 0.125)' : 'rgba(34, 197, 94, 0.12)',
            borderColor: isDarkMode ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.25)'
          }}
        >
          <MapPin className="w-4 h-4" style={{ color: 'rgb(34, 197, 94)' }} />
        </div>
        <div>
          <h3 className="font-semibold text-sm" style={{ color: textColor }}>Regional Fraud Burden</h3>
          <p className="text-[10px]" style={{ color: subtextColor }}>Comms-based fraud signals by region</p>
        </div>
      </div>

      {/* Chart and Insight Panel */}
      <div className="flex-1 min-h-0 flex gap-4">
        {/* Chart */}
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={regionalData}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={containerBorder} opacity={0.3} />
              <XAxis
                dataKey="region"
                tick={{ fill: labelColor, fontSize: 11 }}
              />
              <YAxis
                tick={{ fill: labelColor, fontSize: 11 }}
                label={{ value: 'Fraud Signal Volume', angle: -90, position: 'insideLeft', style: { fill: labelColor, fontSize: 10 } }}
              />
              <Tooltip content={<CustomTooltip />} />
              {fraudPatterns.map((pattern) => (
                <Bar
                  key={pattern}
                  dataKey={pattern}
                  stackId="a"
                  fill={fraudPatternColors[pattern]}
                  radius={pattern === fraudPatterns[fraudPatterns.length - 1] ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                  onClick={(data: any, index: number) => {
                    handleBarClick(data, index, pattern);
                  }}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* AI Insight Panel */}
        {selectedInsight && (
          <div 
            className="w-96 flex-shrink-0 rounded-xl p-4 flex flex-col overflow-y-auto shadow-sm border"
            style={{ 
              backgroundColor: containerBg,
              borderColor: containerBorder
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold" style={{ color: textColor }}>✨ AI Insight</h4>
              </div>
              <button
                onClick={() => setSelectedInsight(null)}
                className="p-1 rounded"
                style={{ 
                  backgroundColor: 'transparent'
                }}
              >
                <X className="w-4 h-4" style={{ color: subtextColor }} />
              </button>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto">
              {/* 1. Summary */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Target className="w-3 h-3" style={{ color: 'rgb(34, 197, 94)' }} />
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: labelColor }}>Summary</span>
                </div>
                <div 
                  className="rounded-lg p-3 border"
                  style={{ 
                    backgroundColor: isDarkMode ? 'rgba(168, 85, 247, 0.05)' : 'rgba(245, 243, 255, 0.9)',
                    borderColor: isDarkMode ? 'rgba(168, 85, 247, 0.3)' : 'rgba(168, 85, 247, 0.25)'
                  }}
                >
                  {selectedInsight.summaryTitle && (
                    <p className="text-[12px] font-semibold mb-1.5" style={{ color: isDarkMode ? 'rgb(196, 181, 253)' : 'rgb(126, 34, 206)' }}>{selectedInsight.summaryTitle}</p>
                  )}
                  <p className="text-[12px] leading-relaxed" style={{ color: isDarkMode ? 'rgb(196, 181, 253)' : 'rgb(126, 34, 206)' }}>{selectedInsight.aiInsight}</p>
                </div>
              </div>

              {/* 2. Root Cause */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: labelColor }}>Root Cause</span>
                </div>
                <div className="space-y-1.5">
                  {selectedInsight.evidence.map((item, idx) => (
                    <div key={idx} className="text-[11px] leading-relaxed flex items-start gap-2" style={{ color: summaryTextColor }}>
                      <span className="mt-0.5" style={{ color: 'rgb(249, 115, 22)' }}>•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Next Action Suggestion */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: labelColor }}>Next Action Suggestion</span>
                </div>
                <div className="space-y-1.5">
                  {selectedInsight.nextActions.map((item, idx) => (
                    <div key={idx} className="text-[11px] leading-relaxed flex items-start gap-2" style={{ color: summaryTextColor }}>
                      <span className="mt-0.5" style={{ color: 'rgb(59, 130, 246)' }}>•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Channel Breakdown */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: labelColor }}>Channel Breakdown</span>
                </div>
                <div className="space-y-2">
                  {Object.entries(selectedInsight.channelBreakdown).map(([channel, value]) => {
                    const total = Object.values(selectedInsight.channelBreakdown).reduce((a, b) => a + b, 0);
                    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                    const color = channelColors[channel as keyof typeof channelColors];
                    return (
                      <div key={channel} className="space-y-0.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <div
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-[10px] capitalize" style={{ color: subtextColor }}>{channel}</span>
                          </div>
                          <span className="text-[10px] font-medium" style={{ color: textColor }}>{percentage}%</span>
                        </div>
                        <div 
                          className="rounded-full h-1.5 overflow-hidden"
                          style={{ backgroundColor: summaryBg }}
                        >
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-3 pt-3 flex-shrink-0" style={{ borderTop: `1px solid ${containerBorder}` }}>
        <div className="flex items-center gap-3 flex-wrap text-[9px]">
          <span style={{ color: subtextColor }}>Click bars for insights</span>
          <span style={{ color: subtextColor }}>•</span>
          {fraudPatterns.map((pattern) => (
            <div key={pattern} className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded"
                style={{ backgroundColor: fraudPatternColors[pattern] }}
              />
              <span className="text-[9px]" style={{ color: subtextColor }}>{pattern}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
