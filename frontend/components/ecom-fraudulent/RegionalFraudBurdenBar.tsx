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

// Mock insight data - in production, this would come from API
const insightData: Record<string, InsightData> = {
  'Tier 1-Reputation Ransom Attacks': {
    region: 'Tier 1',
    pattern: 'Reputation Ransom Attacks',
    aiInsight: 'Reputation Ransom Attacks in Tier 1 are being driven by coordinated social escalations and copy-pasted complaint scripts across chat + social channels.',
    evidence: [
      '64% of Tier 1 complaints included threat-based language ("post online", "viral review")',
      '41% used identical phrasing, indicating script reuse',
      '27% of chat interactions escalated to social platforms within 6 hours',
      'Voice transcripts show aggressive tone escalation in refund discussions',
    ],
    whyItMatters: [
      'High risk to brand reputation',
      'Pressure on Goodwill Budget (refund leakage)',
      'Increased cross-channel workload due to escalations',
      'Signals potential RaaS activity in metro zones',
    ],
    nextActions: [
      'Deploy unified escalation messaging across all channels to eliminate arbitration',
      'Reduce discretionary refunds in Tier 1 for threat-based complaints',
      'Activate Social Listening Watchlist for repeat handles',
      'Align courier partners to audit delivery incidents feeding the narrative',
      'Trigger Fraud Playbook v3 for organized threat clusters',
    ],
    riskForecast: [
      'Narrative pressure increased 18% week-over-week',
      'Cross-channel jumps increased from 1.7 → 2.3 channels per fraud case',
      'Script similarity index rose from 0.42 → 0.58, indicating network reuse',
    ],
    ownership: [
      'Risk / Trust Head: Reduce abuse exposure',
      'CX Head: Normalize policy messaging',
      'Social Ops Lead: Contain external threats',
    ],
    channelBreakdown: { chat: 35, email: 28, ticket: 15, voice: 5, social: 17 },
  },
  'Tier 1-Delivery Liability Risk': {
    region: 'Tier 1',
    pattern: 'Delivery Liability Risk',
    aiInsight: 'High volume of contradictory delivery stories in Tier 1 indicate courier-customer alignment signals.',
    evidence: [
      '52% of complaints show GPS coordinate mismatches',
      '38% involve "delivery agent said" narratives',
      'Repeated INR complaints from same pincodes',
      'Contradictory delivery timelines across channels',
    ],
    whyItMatters: [
      'Direct impact on courier partner relationships',
      'Compensation padding attempts',
      'Customer trust erosion',
    ],
    nextActions: [
      'Enforce OTP-at-doorstep plus geo-tagged photo/POD',
      'Alert on >1km GPS drift',
      'Hold courier payouts until proof verified',
    ],
    riskForecast: [
      'Delivery disputes up 12% week-over-week',
      'GPS mismatch rate increased from 45% → 52%',
    ],
    ownership: [
      'Logistics Head: Courier audit & proof enforcement',
      'Fraud Ops: Coordinate investigation',
    ],
    channelBreakdown: { chat: 41, email: 22, ticket: 19, voice: 11, social: 7 },
  },
  'Tier 2-Marketing Budget Waste': {
    region: 'Tier 2',
    pattern: 'Marketing Budget Waste',
    aiInsight: 'Tier 2 users heavily exploiting promo-based refund reasoning with copy-pasted claim formats.',
    evidence: [
      '43% of refund requests cite "promo not applied"',
      '32% show identical cashback complaint language',
      'Promo re-use attempts detected across 18% of cases',
    ],
    whyItMatters: [
      'Marketing budget leakage',
      'Promo code abuse spreading',
      'Systemic exploitation pattern',
    ],
    nextActions: [
      'Bind promos to device fingerprint',
      'Tighten velocity limits on promo usage',
      'Add ML fake-account screening',
      'Kill-switch leaked codes',
    ],
    riskForecast: [
      'Promo abuse cases up 22% week-over-week',
      'Cashback exploitation increased 15%',
    ],
    ownership: [
      'Marketing Head: Promo security & device binding',
      'Fraud Ops: Account screening',
    ],
    channelBreakdown: { chat: 43, email: 32, ticket: 18, voice: 4, social: 3 },
  },
};

export default function RegionalFraudBurdenBar() {
  const [selectedInsight, setSelectedInsight] = useState<InsightData | null>(null);

  const handleBarClick = (data: any, index: number, pattern: string) => {
    const region = regionalData[index]?.region;
    if (!region) return;
    
    const key = `${region}-${pattern}`;
    const insight = insightData[key];
    if (insight) {
      setSelectedInsight(insight);
    } else {
      // Generate default insight if not available
      const defaultInsight: InsightData = {
        region,
        pattern,
        aiInsight: `${pattern} in ${region} shows elevated signals from communication channels.`,
        evidence: [
          'Pattern detected across multiple communication channels',
          'Consistent behavioral signals identified',
        ],
        whyItMatters: [
          'Potential operational impact',
          'Requires monitoring and response',
        ],
        nextActions: [
          'Review channel-specific patterns',
          'Monitor trend over next 7 days',
          'Coordinate with regional fraud ops',
        ],
        riskForecast: [
          'Pattern volume stable',
          'Monitor for escalation signals',
        ],
        ownership: [
          'Fraud Ops: Pattern investigation',
          'Regional Lead: Operational response',
        ],
        channelBreakdown: { chat: 40, email: 25, ticket: 20, voice: 10, social: 5 },
      };
      setSelectedInsight(defaultInsight);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, entry: any) => sum + (entry.value || 0), 0);
      return (
        <div className="bg-[#0d0d14] border border-white/20 rounded-lg p-3 shadow-lg">
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
    <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-5 h-[600px] shadow-lg shadow-black/30 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 flex-shrink-0 sticky top-0 bg-[#0a0a0f] z-10 pb-2">
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
          <div className="w-96 flex-shrink-0 bg-[#0d0d14] border border-white/10 rounded-xl p-4 flex flex-col overflow-y-auto scrollbar-thin">
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

            <div className="space-y-4 flex-1">
              {/* AI Insight Summary */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Target className="w-3 h-3 text-green-400" />
                  <span className="text-gray-400 text-[10px] uppercase tracking-wider">Summary</span>
                </div>
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                  <p className="text-white text-[12px] leading-relaxed">{selectedInsight.aiInsight}</p>
                </div>
                <div className="mt-2 flex items-center gap-2 text-[10px] text-gray-500">
                  <span>{selectedInsight.region}</span>
                  <span>•</span>
                  <span>{selectedInsight.pattern}</span>
                </div>
              </div>

              {/* Evidence from Comms */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="w-3 h-3 text-orange-400" />
                  <span className="text-gray-400 text-[10px] uppercase tracking-wider">Evidence from Comms</span>
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

              {/* Why It Matters */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <TrendingUp className="w-3 h-3 text-red-400" />
                  <span className="text-gray-400 text-[10px] uppercase tracking-wider">Why It Matters</span>
                </div>
                <div className="space-y-1.5">
                  {selectedInsight.whyItMatters.map((item, idx) => (
                    <div key={idx} className="text-gray-300 text-[11px] leading-relaxed flex items-start gap-2">
                      <span className="text-red-400 mt-0.5">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Best Action */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Target className="w-3 h-3 text-blue-400" />
                  <span className="text-gray-400 text-[10px] uppercase tracking-wider">Next Best Action</span>
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

              {/* Risk Forecast */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <TrendingUp className="w-3 h-3 text-yellow-400" />
                  <span className="text-gray-400 text-[10px] uppercase tracking-wider">Risk Forecast</span>
                </div>
                <div className="space-y-1.5">
                  {selectedInsight.riskForecast.map((item, idx) => (
                    <div key={idx} className="text-gray-300 text-[11px] leading-relaxed flex items-start gap-2">
                      <span className="text-yellow-400 mt-0.5">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ownership */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Users className="w-3 h-3 text-purple-400" />
                  <span className="text-gray-400 text-[10px] uppercase tracking-wider">Ownership</span>
                </div>
                <div className="space-y-1.5">
                  {selectedInsight.ownership.map((item, idx) => (
                    <div key={idx} className="text-gray-300 text-[11px] leading-relaxed flex items-start gap-2">
                      <span className="text-purple-400 mt-0.5">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Channel Breakdown */}
              <div>
                <div className="text-gray-400 text-[10px] uppercase tracking-wider mb-2">Channel Breakdown</div>
                <div className="flex items-center gap-1">
                  {Object.entries(selectedInsight.channelBreakdown).map(([channel, value]) => {
                    const total = Object.values(selectedInsight.channelBreakdown).reduce((a, b) => a + b, 0);
                    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                    if (value === 0) return null;
                    return (
                      <div key={channel} className="flex items-center gap-1">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: channelColors[channel as keyof typeof channelColors] }}
                        />
                        <span className="text-gray-400 text-[9px]">{channel.toUpperCase()}: {percentage}%</span>
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
