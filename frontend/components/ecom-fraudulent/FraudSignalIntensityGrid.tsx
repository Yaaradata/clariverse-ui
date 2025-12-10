'use client';

import { useState, useEffect } from 'react';
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
      Email: { volume: 4, detection: 89, avgTime: '2.1h', riskScore: 78 }, // Red (CRITICAL ≥76)
      Chat: { volume: 5, detection: 87, avgTime: '1.8h', riskScore: 72 }, // Orange (HIGH 65-75)
      Ticket: { volume: 3, detection: 85, avgTime: '2.4h', riskScore: 70 }, // Orange (HIGH 65-75)
      Voice: { volume: 0, detection: 0, avgTime: '0h', riskScore: 0 }, // Empty
      Social: { volume: 1, detection: 83, avgTime: '4.1h', riskScore: 58 }, // Yellow (MEDIUM 50-64)
    },
  },
  {
    id: 'FI-002',
    title: 'Internal Policy Violations',
    totalCases: 10,
    channels: {
      Email: { volume: 3, detection: 76, avgTime: '1.5h', riskScore: 68 }, // Orange (HIGH 65-75)
      Chat: { volume: 3, detection: 74, avgTime: '1.2h', riskScore: 62 }, // Yellow (MEDIUM 50-64)
      Ticket: { volume: 2, detection: 78, avgTime: '1.8h', riskScore: 71 }, // Orange (HIGH 65-75)
      Voice: { volume: 1, detection: 82, avgTime: '2.5h', riskScore: 73 }, // Orange (HIGH 65-75)
      Social: { volume: 0, detection: 0, avgTime: '0h', riskScore: 0 }, // Empty
    },
  },
  {
    id: 'FI-003',
    title: 'Non-Resalable Returns',
    totalCases: 14,
    channels: {
      Email: { volume: 4, detection: 81, avgTime: '2.3h', riskScore: 61 }, // Yellow (MEDIUM 50-64)
      Chat: { volume: 5, detection: 79, avgTime: '2.0h', riskScore: 59 }, // Yellow (MEDIUM 50-64)
      Ticket: { volume: 3, detection: 83, avgTime: '2.6h', riskScore: 63 }, // Yellow (MEDIUM 50-64)
      Voice: { volume: 1, detection: 77, avgTime: '3.1h', riskScore: 55 }, // Yellow (MEDIUM 50-64)
      Social: { volume: 1, detection: 75, avgTime: '3.5h', riskScore: 52 }, // Yellow (MEDIUM 50-64)
    },
  },
  {
    id: 'FI-004',
    title: 'Marketing Budget Waste',
    totalCases: 8,
    channels: {
      Email: { volume: 2, detection: 72, avgTime: '1.8h', riskScore: 69 }, // Orange (HIGH 65-75)
      Chat: { volume: 3, detection: 70, avgTime: '1.5h', riskScore: 64 }, // Yellow (MEDIUM 50-64)
      Ticket: { volume: 2, detection: 74, avgTime: '2.0h', riskScore: 67 }, // Orange (HIGH 65-75)
      Voice: { volume: 1, detection: 68, avgTime: '2.8h', riskScore: 56 }, // Yellow (MEDIUM 50-64)
      Social: { volume: 0, detection: 0, avgTime: '0h', riskScore: 0 }, // Empty
    },
  },
  {
    id: 'FI-005',
    title: 'Organized Fraud Rings',
    totalCases: 7,
    channels: {
      Email: { volume: 2, detection: 95, avgTime: '1.2h', riskScore: 82 }, // Red (CRITICAL ≥76)
      Chat: { volume: 2, detection: 93, avgTime: '1.0h', riskScore: 79 }, // Red (CRITICAL ≥76)
      Ticket: { volume: 1, detection: 97, avgTime: '1.4h', riskScore: 85 }, // Red (CRITICAL ≥76)
      Voice: { volume: 1, detection: 94, avgTime: '1.6h', riskScore: 74 }, // Orange (HIGH 65-75)
      Social: { volume: 1, detection: 92, avgTime: '1.8h', riskScore: 66 }, // Orange (HIGH 65-75)
    },
  },
  {
    id: 'FI-006',
    title: 'Reputation Ransom Attacks',
    totalCases: 11,
    channels: {
      Email: { volume: 3, detection: 88, avgTime: '0.8h', riskScore: 60 }, // Yellow (MEDIUM 50-64)
      Chat: { volume: 4, detection: 86, avgTime: '0.6h', riskScore: 57 }, // Yellow (MEDIUM 50-64)
      Ticket: { volume: 2, detection: 90, avgTime: '1.0h', riskScore: 54 }, // Yellow (MEDIUM 50-64)
      Voice: { volume: 0, detection: 0, avgTime: '0h', riskScore: 0 }, // Empty
      Social: { volume: 2, detection: 92, avgTime: '0.5h', riskScore: 48 }, // Green (LOW 40-49)
    },
  },
  {
    id: 'FI-007',
    title: 'RaaS Signals',
    totalCases: 12,
    channels: {
      Email: { volume: 3, detection: 96, avgTime: '0.9h', riskScore: 45 }, // Green (LOW 40-49)
      Chat: { volume: 4, detection: 94, avgTime: '0.7h', riskScore: 43 }, // Green (LOW 40-49)
      Ticket: { volume: 2, detection: 98, avgTime: '1.1h', riskScore: 48 }, // Green (LOW 40-49)
      Voice: { volume: 2, detection: 95, avgTime: '1.3h', riskScore: 46 }, // Green (LOW 40-49)
      Social: { volume: 1, detection: 93, avgTime: '1.5h', riskScore: 44 }, // Green (LOW 40-49)
    },
  },
  {
    id: 'FI-008',
    title: 'Cross-Channel Arbitration',
    totalCases: 13,
    channels: {
      Email: { volume: 3, detection: 85, avgTime: '2.2h', riskScore: 47 }, // Green (LOW 40-49)
      Chat: { volume: 5, detection: 83, avgTime: '1.9h', riskScore: 42 }, // Green (LOW 40-49)
      Ticket: { volume: 3, detection: 87, avgTime: '2.5h', riskScore: 49 }, // Green (LOW 40-49)
      Voice: { volume: 1, detection: 81, avgTime: '3.0h', riskScore: 41 }, // Green (LOW 40-49)
      Social: { volume: 1, detection: 79, avgTime: '3.3h', riskScore: 40 }, // Green (LOW 40-49)
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
    text: 'Organized Fraud Rings: 3 CRITICAL signals detected. Delivery Liability Risk Email at 78. Immediate escalation required.',
    color: 'red',
    iconComponent: AlertTriangle,
  },
  behavioral: {
    icon: '🧠',
    title: 'BEHAVIORAL INTELLIGENCE',
    text: '9 HIGH-risk signals across 4 patterns. Internal Policy Violations spans 3 channels. 4 empty cells show data gaps.',
    color: 'purple',
    iconComponent: Brain,
  },
  recommendation: {
    icon: '💡',
    title: 'STRATEGIC RECOMMENDATION',
    text: '23 signals at MEDIUM/LOW baseline. RaaS and Cross-Channel patterns well-controlled. Focus on CRITICAL clusters.',
    color: 'blue',
    iconComponent: Lightbulb,
  },
};

// Helper function to get background color based on risk score
// CRITICAL ≥76: Red, HIGH ≥65: Orange, MEDIUM ≥50: Yellow, LOW ≥40: Green
const getBackgroundColor = (riskScore: number, isDarkMode: boolean): string => {
  if (riskScore === 0) return isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgb(243, 244, 246)'; // Empty
  if (riskScore >= 76) return isDarkMode ? 'rgba(239, 68, 68, 0.6)' : 'rgba(239, 68, 68, 0.4)'; // Red - CRITICAL
  if (riskScore >= 65) return isDarkMode ? 'rgba(249, 115, 22, 0.6)' : 'rgba(249, 115, 22, 0.4)'; // Orange - HIGH
  if (riskScore >= 50) return isDarkMode ? 'rgba(234, 179, 8, 0.6)' : 'rgba(234, 179, 8, 0.4)'; // Yellow - MEDIUM
  if (riskScore >= 40) return isDarkMode ? 'rgba(34, 197, 94, 0.6)' : 'rgba(34, 197, 94, 0.4)'; // Green - LOW
  return isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgb(243, 244, 246)'; // Fallback
};

export default function FraudSignalIntensityGrid() {
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

  // Get row labels from patterns
  const rowLabels = patterns.map(p => p.title);

  return (
    <div 
      className="rounded-xl border shadow-sm"
      style={{ backgroundColor: containerBg, borderColor: containerBorder }}
    >
      {/* Header */}
      <div className="flex flex-col space-y-1.5 p-5 md:p-6">
        <h3 className="text-lg font-semibold" style={{ color: textColor }}>
          Fraud Signal Intensity Grid
        </h3>
        <p className="text-sm" style={{ color: subtextColor }}>
          Pattern intensity across communication channels
        </p>
      </div>

      {/* Grid Content */}
      <div className="p-5 md:p-6 pt-0 space-y-6">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-1">
          {/* Row Labels */}
          <div className="flex flex-col gap-2 pt-5">
            {rowLabels.map((label) => (
              <div
                key={label}
                className="flex h-10 items-center text-[10px] font-semibold uppercase tracking-wide"
                style={{ color: labelColor }}
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
                    className="text-center text-[10px] uppercase tracking-wide"
                    style={{ color: labelColor }}
                  >
                    {channel}
                  </div>
                ))}

                {/* Grid Cells */}
                {patterns.map((pattern) =>
                  channels.map((channel) => {
                    const cell = pattern.channels[channel];
                    const bgColor = getBackgroundColor(cell.riskScore, isDarkMode);

                    return (
                      <div
                        key={`${pattern.id}-${channel}`}
                        className="relative flex h-10 flex-col justify-between rounded-lg border px-2 py-1.5 text-[10px]"
                        style={{ 
                          backgroundColor: bgColor,
                          borderColor: containerBorder,
                          color: textColor
                        }}
                      >
                        {cell.volume > 0 ? (
                          <>
                            <div className="flex items-center justify-between font-semibold leading-none">
                              <span>{cell.avgTime}</span>
                              <span className="text-[8.5px] uppercase tracking-widest">
                                {cell.detection}% detected
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[8.5px] font-medium">
                              <span>Vol {cell.volume}</span>
                              <span>Risk {cell.riskScore}</span>
                            </div>
                          </>
                        ) : (
                          <div 
                            className="flex items-center justify-center h-full text-[8px]"
                            style={{ 
                              color: subtextColor,
                              backgroundColor: summaryBg
                            }}
                          >
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
        <div className="grid gap-6 md:grid-cols-3">
          <div 
            className="rounded-xl border p-4 space-y-2"
            style={{ 
              backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.05)' : 'rgba(254, 242, 242, 0.9)',
              borderColor: isDarkMode ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.25)'
            }}
          >
            <div className="text-sm font-semibold" style={{ color: isDarkMode ? 'rgb(252, 165, 165)' : 'rgb(185, 28, 28)' }}>🔥 Bottleneck</div>
            <div className="text-xs" style={{ color: isDarkMode ? 'rgb(252, 165, 165)' : 'rgb(153, 27, 27)' }}>{insights.threat.text}</div>
          </div>
          <div 
            className="rounded-xl border p-4 space-y-2"
            style={{ 
              backgroundColor: summaryBg,
              borderColor: summaryBorder
            }}
          >
            <div className="text-sm font-semibold" style={{ color: textColor }}>🏢 Ownership</div>
            <div className="text-xs" style={{ color: summaryTextColor }}>{insights.behavioral.text}</div>
          </div>
          <div 
            className="rounded-xl border p-4 space-y-2"
            style={{ 
              backgroundColor: isDarkMode ? 'rgba(34, 197, 94, 0.05)' : 'rgba(240, 253, 244, 0.9)',
              borderColor: isDarkMode ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.25)'
            }}
          >
            <div className="text-sm font-semibold" style={{ color: isDarkMode ? 'rgb(134, 239, 172)' : 'rgb(22, 101, 52)' }}>⚡ Efficiency</div>
            <div className="text-xs" style={{ color: isDarkMode ? 'rgb(134, 239, 172)' : 'rgb(20, 83, 45)' }}>{insights.recommendation.text}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

