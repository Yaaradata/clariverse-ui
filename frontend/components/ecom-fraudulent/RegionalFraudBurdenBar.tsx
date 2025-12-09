'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MapPin, X, AlertTriangle, TrendingUp, Users, Target } from 'lucide-react';

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
        <div className="bg-black border border-white/20 rounded-lg p-3 shadow-lg">
          <p className="text-white text-sm font-semibold mb-2">{label}</p>
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
                    <span className="text-gray-300 text-xs">{entry.dataKey}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-xs font-semibold">{entry.value}</span>
                    <span className="text-gray-500 text-xs">({percentage}%)</span>
                  </div>
                </div>
              );
            })}
            <div className="pt-1.5 mt-1.5 border-t border-white/10">
              <div className="text-gray-400 text-[10px]">Total: {total} signals</div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-5 h-[600px] shadow-lg shadow-black/30 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 flex-shrink-0 sticky top-0 bg-[#0d0d0d] z-10 pb-2">
        <div className="p-1.5 bg-green-500/10 rounded-lg">
          <MapPin className="w-4 h-4 text-green-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm">Regional Fraud Burden</h3>
          <p className="text-gray-500 text-[10px]">Comms-based fraud signals by region</p>
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
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="region"
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
              />
              <YAxis
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
                label={{ value: 'Fraud Signal Volume', angle: -90, position: 'insideLeft', style: { fill: '#9CA3AF', fontSize: 10 } }}
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
          <div className="w-96 flex-shrink-0 bg-black/30 border border-white/10 rounded-xl p-4 flex flex-col overflow-y-auto scrollbar-thin">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-green-500/10 rounded">
                  <AlertTriangle className="w-3.5 h-3.5 text-green-400" />
                </div>
                <h4 className="text-white text-sm font-semibold">AI Insight</h4>
              </div>
              <button
                onClick={() => setSelectedInsight(null)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto">
              {/* 1. Summary */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Target className="w-3 h-3 text-green-400" />
                  <span className="text-gray-400 text-[10px] uppercase tracking-wider">Summary</span>
                </div>
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                  {selectedInsight.summaryTitle && (
                    <p className="text-white text-[12px] font-semibold mb-1.5">{selectedInsight.summaryTitle}</p>
                  )}
                  <p className="text-white text-[12px] leading-relaxed">{selectedInsight.aiInsight}</p>
                </div>
              </div>

              {/* 2. Root Cause */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-gray-400 text-[10px] uppercase tracking-wider">Root Cause</span>
                </div>
                <div className="space-y-1.5">
                  {selectedInsight.evidence.map((item, idx) => (
                    <div key={idx} className="text-gray-300 text-[11px] leading-relaxed flex items-start gap-2">
                      <span className="text-orange-400 mt-0.5">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Next Action Suggestion */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-gray-400 text-[10px] uppercase tracking-wider">Next Action Suggestion</span>
                </div>
                <div className="space-y-1.5">
                  {selectedInsight.nextActions.map((item, idx) => (
                    <div key={idx} className="text-gray-300 text-[11px] leading-relaxed flex items-start gap-2">
                      <span className="text-blue-400 mt-0.5">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Channel Breakdown */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-gray-400 text-[10px] uppercase tracking-wider">Channel Breakdown</span>
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
                            <span className="text-gray-400 text-[10px] capitalize">{channel}</span>
                          </div>
                          <span className="text-white text-[10px] font-medium">{percentage}%</span>
                        </div>
                        <div className="bg-white/5 rounded-full h-1.5 overflow-hidden">
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
      <div className="mt-3 pt-3 border-t border-white/5 flex-shrink-0">
        <div className="flex items-center gap-3 flex-wrap text-[9px]">
          <span className="text-gray-500">Click bars for insights</span>
          <span className="text-gray-600">•</span>
          {fraudPatterns.map((pattern) => (
            <div key={pattern} className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded"
                style={{ backgroundColor: fraudPatternColors[pattern] }}
              />
              <span className="text-gray-400 text-[9px]">{pattern}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scrollbar styling */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.02);
          border-radius: 2px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.2);
        }
      `}</style>
    </div>
  );
}
