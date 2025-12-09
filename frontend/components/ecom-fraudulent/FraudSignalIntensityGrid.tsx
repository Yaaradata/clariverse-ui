'use client';

import { AlertTriangle, Brain, Lightbulb } from 'lucide-react';

interface CellData {
  volume: number;
  detection: number;
  avgTime: string;
  riskScore: number;
}

interface PatternData {
  id: string;
  title: string;
  totalCases: number;
  channels: {
    Email: CellData;
    Chat: CellData;
    Ticket: CellData;
    Voice: CellData;
    Social: CellData;
  };
}

const patterns: PatternData[] = [
  {
    id: 'FI-001',
    title: 'Delivery Liability Risk',
    totalCases: 15,
    channels: {
      Email: { volume: 4, detection: 89, avgTime: '2.1h', riskScore: 82 },
      Chat: { volume: 5, detection: 87, avgTime: '1.8h', riskScore: 78 },
      Ticket: { volume: 3, detection: 85, avgTime: '2.4h', riskScore: 75 },
      Voice: { volume: 2, detection: 91, avgTime: '3.2h', riskScore: 88 },
      Social: { volume: 1, detection: 83, avgTime: '4.1h', riskScore: 72 },
    },
  },
  {
    id: 'FI-002',
    title: 'Internal Policy Violations',
    totalCases: 10,
    channels: {
      Email: { volume: 3, detection: 76, avgTime: '1.5h', riskScore: 71 },
      Chat: { volume: 3, detection: 74, avgTime: '1.2h', riskScore: 68 },
      Ticket: { volume: 2, detection: 78, avgTime: '1.8h', riskScore: 72 },
      Voice: { volume: 1, detection: 82, avgTime: '2.5h', riskScore: 79 },
      Social: { volume: 1, detection: 70, avgTime: '3.0h', riskScore: 65 },
    },
  },
  {
    id: 'FI-003',
    title: 'Non-Resalable Returns',
    totalCases: 14,
    channels: {
      Email: { volume: 4, detection: 81, avgTime: '2.3h', riskScore: 76 },
      Chat: { volume: 5, detection: 79, avgTime: '2.0h', riskScore: 73 },
      Ticket: { volume: 3, detection: 83, avgTime: '2.6h', riskScore: 78 },
      Voice: { volume: 1, detection: 77, avgTime: '3.1h', riskScore: 71 },
      Social: { volume: 1, detection: 75, avgTime: '3.5h', riskScore: 69 },
    },
  },
  {
    id: 'FI-004',
    title: 'Marketing Budget Waste',
    totalCases: 8,
    channels: {
      Email: { volume: 2, detection: 72, avgTime: '1.8h', riskScore: 67 },
      Chat: { volume: 3, detection: 70, avgTime: '1.5h', riskScore: 64 },
      Ticket: { volume: 2, detection: 74, avgTime: '2.0h', riskScore: 69 },
      Voice: { volume: 1, detection: 68, avgTime: '2.8h', riskScore: 62 },
      Social: { volume: 0, detection: 0, avgTime: '0h', riskScore: 0 },
    },
  },
  {
    id: 'FI-005',
    title: 'Organized Fraud Rings',
    totalCases: 7,
    channels: {
      Email: { volume: 2, detection: 95, avgTime: '1.2h', riskScore: 91 },
      Chat: { volume: 2, detection: 93, avgTime: '1.0h', riskScore: 89 },
      Ticket: { volume: 1, detection: 97, avgTime: '1.4h', riskScore: 94 },
      Voice: { volume: 1, detection: 94, avgTime: '1.6h', riskScore: 90 },
      Social: { volume: 1, detection: 92, avgTime: '1.8h', riskScore: 88 },
    },
  },
  {
    id: 'FI-006',
    title: 'Reputation Ransom Attacks',
    totalCases: 11,
    channels: {
      Email: { volume: 3, detection: 88, avgTime: '0.8h', riskScore: 84 },
      Chat: { volume: 4, detection: 86, avgTime: '0.6h', riskScore: 81 },
      Ticket: { volume: 2, detection: 90, avgTime: '1.0h', riskScore: 87 },
      Voice: { volume: 0, detection: 0, avgTime: '0h', riskScore: 0 },
      Social: { volume: 2, detection: 92, avgTime: '0.5h', riskScore: 89 },
    },
  },
  {
    id: 'FI-007',
    title: 'RaaS Signals',
    totalCases: 12,
    channels: {
      Email: { volume: 3, detection: 96, avgTime: '0.9h', riskScore: 92 },
      Chat: { volume: 4, detection: 94, avgTime: '0.7h', riskScore: 90 },
      Ticket: { volume: 2, detection: 98, avgTime: '1.1h', riskScore: 95 },
      Voice: { volume: 2, detection: 95, avgTime: '1.3h', riskScore: 91 },
      Social: { volume: 1, detection: 93, avgTime: '1.5h', riskScore: 89 },
    },
  },
  {
    id: 'FI-008',
    title: 'Cross-Channel Arbitration',
    totalCases: 13,
    channels: {
      Email: { volume: 3, detection: 85, avgTime: '2.2h', riskScore: 80 },
      Chat: { volume: 5, detection: 83, avgTime: '1.9h', riskScore: 77 },
      Ticket: { volume: 3, detection: 87, avgTime: '2.5h', riskScore: 82 },
      Voice: { volume: 1, detection: 81, avgTime: '3.0h', riskScore: 76 },
      Social: { volume: 1, detection: 79, avgTime: '3.3h', riskScore: 74 },
    },
  },
];

const channels = ['Email', 'Chat', 'Ticket', 'Voice', 'Social'] as const;

const getColorClass = (volume: number): string => {
  if (volume === 0) return 'bg-white/5';
  if (volume <= 5) return 'bg-green-600';
  if (volume <= 15) return 'bg-yellow-600';
  if (volume <= 30) return 'bg-orange-600';
  return 'bg-red-600';
};

const insights = {
  threat: {
    icon: '🔥',
    title: 'CRITICAL THREAT PATTERN',
    text: 'Voice channel fraud attempts spike 340% during weekend evenings, suggesting organized timing coordination rather than opportunistic behavior. Deploy weekend-specific verification protocols.',
    color: 'red',
    iconComponent: AlertTriangle,
  },
  behavioral: {
    icon: '🧠',
    title: 'BEHAVIORAL INTELLIGENCE',
    text: 'Fraudsters test defenses via Email first (low urgency), then escalate to Voice only after understanding policy gaps—strategic reconnaissance pattern detected across 34% of multi-channel cases.',
    color: 'purple',
    iconComponent: Brain,
  },
  recommendation: {
    icon: '💡',
    title: 'STRATEGIC RECOMMENDATION',
    text: 'Deploying real-time phrase matching in Chat could prevent 67% of Delivery Liability escalations before they reach Voice stage. Estimated monthly savings: ₹2.1Cr with 0.8 FTE effort.',
    color: 'blue',
    iconComponent: Lightbulb,
  },
};

export default function FraudSignalIntensityGrid() {
  return (
    <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-5 h-[600px] shadow-lg shadow-black/30 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-orange-500/10 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Fraud Signal Intensity Grid</h3>
            <p className="text-gray-500 text-[10px]">Pattern intensity across communication channels</p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 min-h-0 overflow-auto scrollbar-thin">
        <div className="inline-block min-w-full">
          {/* Header Row */}
          <div className="flex border-b border-white/10 mb-2 sticky top-0 bg-[#0a0a0f] z-10">
            <div className="w-48 flex-shrink-0 p-2 border-r border-white/10">
              <span className="text-gray-500 text-[9px] uppercase">Pattern</span>
            </div>
            <div className="flex-1 grid grid-cols-5 gap-1">
              {channels.map((channel) => (
                <div
                  key={channel}
                  className="p-2 text-center border-r border-white/5 last:border-r-0"
                >
                  <span className="text-gray-300 text-[10px] font-medium">{channel}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pattern Rows */}
          <div className="space-y-1">
            {patterns.map((pattern) => (
              <div key={pattern.id} className="flex border-b border-white/5 hover:bg-white/5 transition-colors">
                {/* Pattern Label */}
                <div className="w-48 flex-shrink-0 p-2 border-r border-white/10 flex items-center">
                  <span className="text-white text-[11px] font-medium leading-tight">
                    {pattern.title}
                  </span>
                </div>

                {/* Channel Cells */}
                <div className="flex-1 grid grid-cols-5 gap-1">
                  {channels.map((channel) => {
                    const cell = pattern.channels[channel];
                    const colorClass = getColorClass(cell.volume);

                    return (
                      <div
                        key={channel}
                        className={`${colorClass} rounded-lg p-2.5 border border-white/10 flex flex-col gap-1 hover:border-white/20 transition-all`}
                      >
                        {cell.volume > 0 ? (
                          <>
                            <div className="text-white text-sm font-bold">
                              {cell.volume} cases
                            </div>
                            <div className="text-gray-400 text-[10px]">
                              Detection: {cell.detection}%
                            </div>
                            <div className="text-gray-300 text-[10px]">
                              Avg Time: {cell.avgTime}
                            </div>
                            <div className="text-orange-400 text-[10px] font-semibold">
                              Risk: {cell.riskScore}
                            </div>
                          </>
                        ) : (
                          <div className="text-gray-600 text-[10px] text-center py-2">
                            No cases
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="mt-4 pt-4 border-t border-white/10 flex-shrink-0">
        <div className="grid grid-cols-3 gap-3">
          {/* Threat Insight */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-red-400 text-[10px] font-semibold uppercase">
                {insights.threat.title}
              </span>
            </div>
            <p className="text-gray-300 text-[10px] leading-relaxed">
              {insights.threat.text}
            </p>
          </div>

          {/* Behavioral Insight */}
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 text-[10px] font-semibold uppercase">
                {insights.behavioral.title}
              </span>
            </div>
            <p className="text-gray-300 text-[10px] leading-relaxed">
              {insights.behavioral.text}
            </p>
          </div>

          {/* Recommendation Insight */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-[10px] font-semibold uppercase">
                {insights.recommendation.title}
              </span>
            </div>
            <p className="text-gray-300 text-[10px] leading-relaxed">
              {insights.recommendation.text}
            </p>
          </div>
        </div>
      </div>

      {/* Scrollbar styling */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
          height: 4px;
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

