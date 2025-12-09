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
      Email: { volume: 4, detection: 89, avgTime: '2.1h', riskScore: 82 }, // Orange
      Chat: { volume: 5, detection: 87, avgTime: '1.8h', riskScore: 78 }, // Orange
      Ticket: { volume: 3, detection: 85, avgTime: '2.4h', riskScore: 75 }, // Orange
      Voice: { volume: 0, detection: 0, avgTime: '0h', riskScore: 0 }, // No data
      Social: { volume: 1, detection: 83, avgTime: '4.1h', riskScore: 76 }, // Orange
    },
  },
  {
    id: 'FI-002',
    title: 'Internal Policy Violations',
    totalCases: 10,
    channels: {
      Email: { volume: 3, detection: 76, avgTime: '1.5h', riskScore: 71 }, // Orange
      Chat: { volume: 3, detection: 74, avgTime: '1.2h', riskScore: 68 }, // Light green
      Ticket: { volume: 2, detection: 78, avgTime: '1.8h', riskScore: 72 }, // Orange
      Voice: { volume: 1, detection: 82, avgTime: '2.5h', riskScore: 74 }, // Orange
      Social: { volume: 0, detection: 0, avgTime: '0h', riskScore: 0 }, // No data
    },
  },
  {
    id: 'FI-003',
    title: 'Non-Resalable Returns',
    totalCases: 14,
    channels: {
      Email: { volume: 4, detection: 81, avgTime: '2.3h', riskScore: 72 }, // Orange
      Chat: { volume: 5, detection: 79, avgTime: '2.0h', riskScore: 70 }, // Orange
      Ticket: { volume: 3, detection: 83, avgTime: '2.6h', riskScore: 74 }, // Orange
      Voice: { volume: 1, detection: 77, avgTime: '3.1h', riskScore: 68 }, // Light green
      Social: { volume: 1, detection: 75, avgTime: '3.5h', riskScore: 66 }, // Light green
    },
  },
  {
    id: 'FI-004',
    title: 'Marketing Budget Waste',
    totalCases: 8,
    channels: {
      Email: { volume: 2, detection: 72, avgTime: '1.8h', riskScore: 70 }, // Orange
      Chat: { volume: 3, detection: 70, avgTime: '1.5h', riskScore: 68 }, // Light green
      Ticket: { volume: 2, detection: 74, avgTime: '2.0h', riskScore: 72 }, // Orange
      Voice: { volume: 1, detection: 68, avgTime: '2.8h', riskScore: 66 }, // Light green
      Social: { volume: 0, detection: 0, avgTime: '0h', riskScore: 0 }, // No data
    },
  },
  {
    id: 'FI-005',
    title: 'Organized Fraud Rings',
    totalCases: 7,
    channels: {
      Email: { volume: 2, detection: 95, avgTime: '1.2h', riskScore: 92 }, // Red
      Chat: { volume: 2, detection: 93, avgTime: '1.0h', riskScore: 89 }, // Orange
      Ticket: { volume: 1, detection: 97, avgTime: '1.4h', riskScore: 96 }, // Red
      Voice: { volume: 1, detection: 94, avgTime: '1.6h', riskScore: 88 }, // Orange
      Social: { volume: 1, detection: 92, avgTime: '1.8h', riskScore: 86 }, // Orange
    },
  },
  {
    id: 'FI-006',
    title: 'Reputation Ransom Attacks',
    totalCases: 11,
    channels: {
      Email: { volume: 3, detection: 88, avgTime: '0.8h', riskScore: 82 }, // Orange
      Chat: { volume: 4, detection: 86, avgTime: '0.6h', riskScore: 79 }, // Orange
      Ticket: { volume: 2, detection: 90, avgTime: '1.0h', riskScore: 83 }, // Orange
      Voice: { volume: 0, detection: 0, avgTime: '0h', riskScore: 0 }, // No data
      Social: { volume: 2, detection: 92, avgTime: '0.5h', riskScore: 88 }, // Orange
    },
  },
  {
    id: 'FI-007',
    title: 'RaaS Signals',
    totalCases: 12,
    channels: {
      Email: { volume: 3, detection: 96, avgTime: '0.9h', riskScore: 88 }, // Orange
      Chat: { volume: 4, detection: 94, avgTime: '0.7h', riskScore: 86 }, // Orange
      Ticket: { volume: 2, detection: 98, avgTime: '1.1h', riskScore: 88 }, // Orange
      Voice: { volume: 2, detection: 95, avgTime: '1.3h', riskScore: 89 }, // Orange
      Social: { volume: 1, detection: 93, avgTime: '1.5h', riskScore: 87 }, // Orange
    },
  },
  {
    id: 'FI-008',
    title: 'Cross-Channel Arbitration',
    totalCases: 13,
    channels: {
      Email: { volume: 3, detection: 85, avgTime: '2.2h', riskScore: 80 }, // Orange
      Chat: { volume: 5, detection: 83, avgTime: '1.9h', riskScore: 77 }, // Orange
      Ticket: { volume: 3, detection: 87, avgTime: '2.5h', riskScore: 82 }, // Orange
      Voice: { volume: 1, detection: 81, avgTime: '3.0h', riskScore: 76 }, // Orange
      Social: { volume: 1, detection: 79, avgTime: '3.3h', riskScore: 75 }, // Orange
    },
  },
];

const channels = ['Email', 'Chat', 'Ticket', 'Voice', 'Social'] as const;

const getColorClass = (riskScore: number): string => {
  if (riskScore === 0) return 'bg-white/5';
  // Green (45-49) - Low risk
  if (riskScore >= 45 && riskScore <= 49) return 'bg-green-600';
  // Yellow (50-74) - Medium risk
  if (riskScore >= 50 && riskScore < 62) return 'bg-yellow-500';
  if (riskScore >= 62 && riskScore <= 74) return 'bg-yellow-600';
  // Orange (75-84) - High risk
  if (riskScore >= 75 && riskScore < 80) return 'bg-orange-500';
  if (riskScore >= 80 && riskScore <= 84) return 'bg-orange-600';
  // Red (85-95) - Critical risk
  if (riskScore >= 85 && riskScore < 90) return 'bg-red-500';
  if (riskScore >= 90 && riskScore <= 95) return 'bg-red-600';
  if (riskScore > 95) return 'bg-red-700';
  // Fallback for values below 45
  if (riskScore < 45) return 'bg-green-500';
  return 'bg-white/5';
};

const insights = {
  threat: {
    icon: '🔥',
    title: 'CRITICAL THREAT PATTERN',
    text: 'Voice channel fraud spikes 340% during weekend evenings. Deploy weekend verification protocols.',
    color: 'red',
    iconComponent: AlertTriangle,
  },
  behavioral: {
    icon: '🧠',
    title: 'BEHAVIORAL INTELLIGENCE',
    text: 'Fraudsters test via Email first, then escalate to Voice. Pattern detected in 34% of multi-channel cases.',
    color: 'purple',
    iconComponent: Brain,
  },
  recommendation: {
    icon: '💡',
    title: 'STRATEGIC RECOMMENDATION',
    text: 'Real-time phrase matching in Chat prevents 67% of escalations. Savings: ₹2.1Cr monthly with 0.8 FTE.',
    color: 'blue',
    iconComponent: Lightbulb,
  },
};

// Helper function to get background color based on risk score (similar to the example)
const getBackgroundColor = (riskScore: number): string => {
  if (riskScore === 0) return 'rgba(0, 0, 0, 0.3)';
  // Green to yellow gradient (low to medium risk)
  if (riskScore >= 45 && riskScore < 50) return `rgba(43, 223, 22, ${0.373 + (riskScore - 45) * 0.0034})`;
  if (riskScore >= 50 && riskScore < 55) return `rgba(57, 223, 22, ${0.39 + (riskScore - 50) * 0.0036})`;
  if (riskScore >= 55 && riskScore < 60) return `rgba(74, 223, 22, ${0.408 + (riskScore - 55) * 0.0044})`;
  if (riskScore >= 60 && riskScore < 65) return `rgba(95, 223, 22, ${0.43 + (riskScore - 60) * 0.006})`;
  if (riskScore >= 65 && riskScore < 70) return `rgba(119, 223, 22, ${0.46 + (riskScore - 65) * 0.006})`;
  // Yellow to orange gradient (medium to high risk)
  if (riskScore >= 70 && riskScore < 75) return `rgba(147, 223, 22, ${0.49 + (riskScore - 70) * 0.007})`;
  if (riskScore >= 75 && riskScore < 80) return `rgba(177, 223, 22, ${0.525 + (riskScore - 75) * 0.0083})`;
  if (riskScore >= 80 && riskScore < 85) return `rgba(212, 223, 22, ${0.565 + (riskScore - 80) * 0.0078})`;
  // Orange to red gradient (high to critical risk)
  if (riskScore >= 85 && riskScore < 90) return `rgba(223, 196, 22, ${0.604 + (riskScore - 85) * 0.0092})`;
  if (riskScore >= 90 && riskScore < 95) return `rgba(223, 60, 22, ${0.65 + (riskScore - 90) * 0.01})`;
  if (riskScore >= 95) return `rgba(223, 22, 22, ${0.7 + Math.min((riskScore - 95) * 0.02, 0.1)})`;
  // Fallback for very low scores
  return 'rgba(43, 223, 22, 0.373)';
};

export default function FraudSignalIntensityGrid() {
  // Get row labels from patterns
  const rowLabels = patterns.map(p => p.title);

  return (
    <div className="rounded-lg border border-white/10 bg-[#0d0d0d]">
      {/* Header */}
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-lg font-semibold text-white">
          Fraud Signal Intensity Grid
        </h3>
        <p className="text-sm text-gray-400">
          Pattern intensity across communication channels
        </p>
      </div>

      {/* Grid Content */}
      <div className="p-6 pt-0 space-y-6 px-6 pb-8">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-1">
          {/* Row Labels */}
          <div className="flex flex-col gap-2 pt-5">
            {rowLabels.map((label) => (
              <div
                key={label}
                className="flex h-10 items-center text-[10px] font-semibold uppercase tracking-wide text-gray-400"
              >
                {label}
              </div>
            ))}
          </div>

          {/* Grid with Channels */}
          <div className="overflow-x-auto">
            <div className="min-w-[480px]">
              <div
                className="grid gap-y-2 gap-x-2"
                style={{ gridTemplateColumns: 'repeat(5, minmax(0px, 1fr))' }}
              >
                {/* Channel Headers */}
                {channels.map((channel) => (
                  <div
                    key={channel}
                    className="text-center text-[10px] uppercase tracking-wide text-gray-400"
                  >
                    {channel}
                  </div>
                ))}

                {/* Grid Cells */}
                {patterns.map((pattern) =>
                  channels.map((channel) => {
                    const cell = pattern.channels[channel];
                    const bgColor = getBackgroundColor(cell.riskScore);

                    return (
                      <div
                        key={`${pattern.id}-${channel}`}
                        className="relative flex h-10 flex-col justify-between rounded-lg border border-white/10 bg-black/30 px-2 py-1.5 text-[10px] text-white shadow-inner"
                        style={{ backgroundColor: bgColor }}
                      >
                        {cell.volume > 0 ? (
                          <>
                            <div className="flex items-center justify-between font-semibold leading-none">
                              <span>{cell.avgTime}</span>
                              <span className="text-[8.5px] uppercase tracking-widest">
                                {cell.detection}% detected
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[8.5px] font-medium text-white/85">
                              <span>Vol {cell.volume}</span>
                              <span>Risk {cell.riskScore}</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-500 text-[8px]">
                            -
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Insights Section */}
        <div className="grid gap-2.5 md:grid-cols-3">
          <div className="rounded-xl border p-4 border-rose-400/30 bg-rose-500/10 space-y-2">
            <div className="text-sm font-semibold text-white">🔥 Bottleneck</div>
            <div className="text-xs text-gray-300">{insights.threat.text}</div>
          </div>
          <div className="rounded-xl border p-4 border-white/10 bg-black/40 space-y-2">
            <div className="text-sm font-semibold text-white">🏢 Ownership</div>
            <div className="text-xs text-gray-300">{insights.behavioral.text}</div>
          </div>
          <div className="rounded-xl border p-4 border-emerald-400/30 bg-emerald-500/10 space-y-2">
            <div className="text-sm font-semibold text-white">⚡ Efficiency</div>
            <div className="text-xs text-gray-300">{insights.recommendation.text}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

