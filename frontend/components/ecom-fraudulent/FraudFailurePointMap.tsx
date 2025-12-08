'use client';

import { AlertTriangle, Package, User, FileText, RotateCcw, Gift, MessageSquare, ArrowRightLeft } from 'lucide-react';

interface ChannelBreakdown {
  chat: number;
  email: number;
  ticket: number;
  voice: number;
  social: number;
}

interface FailurePointData {
  id: string;
  name: string;
  icon: typeof Package;
  description: string;
}

interface FraudCategory {
  id: string;
  name: string;
}

interface MatrixCell {
  failurePointId: string;
  fraudCategoryId: string;
  frequency: number; // 0-100, determines dot size
  channelBreakdown: ChannelBreakdown;
  insight: string;
}

const failurePoints: FailurePointData[] = [
  {
    id: 'FP-001',
    name: 'Fulfillment Gaps',
    icon: Package,
    description: 'Late delivery, missing item, no proof, courier issues',
  },
  {
    id: 'FP-002',
    name: 'Identity & Access Gaps',
    icon: User,
    description: 'OTP loops, login issues, profile edits',
  },
  {
    id: 'FP-003',
    name: 'Policy Interpretation Gaps',
    icon: FileText,
    description: 'Claims about overrides, exceptions, promises by previous agent',
  },
  {
    id: 'FP-004',
    name: 'Returns Workflow Gaps',
    icon: RotateCcw,
    description: 'Packaging missing, damaged item narrative, RVP mismatch',
  },
  {
    id: 'FP-005',
    name: 'Marketing & Promo Gaps',
    icon: Gift,
    description: 'Cashback loopholes, coupon exploitation',
  },
  {
    id: 'FP-006',
    name: 'Reputation & Social Influence Gaps',
    icon: MessageSquare,
    description: 'Public threats, review extortion',
  },
  {
    id: 'FP-007',
    name: 'Multi-Channel Arbitration Gaps',
    icon: ArrowRightLeft,
    description: 'Hopping to find lenient agent',
  },
  {
    id: 'FP-008',
    name: 'Internal Collaboration Gaps',
    icon: AlertTriangle,
    description: 'Agent coaching, misaligned guidance',
  },
];

const fraudCategories: FraudCategory[] = [
  { id: 'FC-001', name: 'Delivery Liability Risk' },
  { id: 'FC-002', name: 'Internal Policy Violations' },
  { id: 'FC-003', name: 'Non-Resalable Returns' },
  { id: 'FC-004', name: 'Marketing Budget Waste' },
  { id: 'FC-005', name: 'Organized Fraud Rings' },
  { id: 'FC-006', name: 'Reputation Ransom Attacks' },
  { id: 'FC-007', name: 'Refund-as-a-Service (RaaS)' },
  { id: 'FC-008', name: 'Cross-Channel Arbitration' },
];

const channelColors = {
  chat: '#3B82F6',
  email: '#10B981',
  ticket: '#F59E0B',
  voice: '#EC4899',
  social: '#8B5CF6',
};

// Mock matrix data
const matrixData: MatrixCell[] = [
  {
    failurePointId: 'FP-001',
    fraudCategoryId: 'FC-001',
    frequency: 85,
    channelBreakdown: { chat: 41, email: 22, ticket: 19, voice: 11, social: 7 },
    insight: 'High courier dispute language → comp-padding attempts',
  },
  {
    failurePointId: 'FP-001',
    fraudCategoryId: 'FC-005',
    frequency: 72,
    channelBreakdown: { chat: 35, email: 28, ticket: 20, voice: 12, social: 5 },
    insight: 'Missing delivery proof enables organized empty-box claims',
  },
  {
    failurePointId: 'FP-002',
    fraudCategoryId: 'FC-001',
    frequency: 45,
    channelBreakdown: { chat: 50, email: 30, ticket: 15, voice: 5, social: 0 },
    insight: 'OTP bypass attempts signal identity manipulation',
  },
  {
    failurePointId: 'FP-003',
    fraudCategoryId: 'FC-002',
    frequency: 78,
    channelBreakdown: { chat: 38, email: 25, ticket: 20, voice: 15, social: 2 },
    insight: 'Exception-demand wording reveals policy override attempts',
  },
  {
    failurePointId: 'FP-003',
    fraudCategoryId: 'FC-008',
    frequency: 65,
    channelBreakdown: { chat: 42, email: 28, ticket: 18, voice: 10, social: 2 },
    insight: 'Multi-agent promises indicate channel-hopping strategy',
  },
  {
    failurePointId: 'FP-004',
    fraudCategoryId: 'FC-003',
    frequency: 82,
    channelBreakdown: { chat: 48, email: 32, ticket: 12, voice: 5, social: 3 },
    insight: 'Packaging destruction claims enable non-resalable returns',
  },
  {
    failurePointId: 'FP-005',
    fraudCategoryId: 'FC-004',
    frequency: 68,
    channelBreakdown: { chat: 43, email: 32, ticket: 18, voice: 4, social: 3 },
    insight: 'Promo re-use language exposes cashback exploitation',
  },
  {
    failurePointId: 'FP-006',
    fraudCategoryId: 'FC-006',
    frequency: 74,
    channelBreakdown: { chat: 35, email: 28, ticket: 15, voice: 5, social: 17 },
    insight: 'Social virality threats correlate with review extortion',
  },
  {
    failurePointId: 'FP-007',
    fraudCategoryId: 'FC-008',
    frequency: 88,
    channelBreakdown: { chat: 45, email: 30, ticket: 18, voice: 5, social: 2 },
    insight: 'Channel-hopping patterns reveal arbitration exploitation',
  },
  {
    failurePointId: 'FP-007',
    fraudCategoryId: 'FC-005',
    frequency: 79,
    channelBreakdown: { chat: 40, email: 25, ticket: 20, voice: 10, social: 5 },
    insight: 'Cross-channel coordination signals organized fraud rings',
  },
  {
    failurePointId: 'FP-008',
    fraudCategoryId: 'FC-002',
    frequency: 56,
    channelBreakdown: { chat: 30, email: 25, ticket: 25, voice: 18, social: 2 },
    insight: 'Agent misalignment enables policy bypass attempts',
  },
  {
    failurePointId: 'FP-001',
    fraudCategoryId: 'FC-007',
    frequency: 63,
    channelBreakdown: { chat: 38, email: 30, ticket: 20, voice: 8, social: 4 },
    insight: 'Delivery failure narratives used in RaaS refund templates',
  },
];

export default function FraudFailurePointMap() {
  const getCellData = (failurePointId: string, fraudCategoryId: string): MatrixCell | null => {
    return matrixData.find(
      (cell) => cell.failurePointId === failurePointId && cell.fraudCategoryId === fraudCategoryId
    ) || null;
  };

  const getFrequencyColor = (frequency: number): string => {
    if (frequency >= 75) return '#EF4444'; // Red - High
    if (frequency >= 50) return '#F97316'; // Orange - Moderate
    if (frequency >= 25) return '#F59E0B'; // Amber - Low
    return '#10B981'; // Green - Very Low
  };

  const getDotSize = (frequency: number): string => {
    if (frequency >= 75) return 'w-3 h-3';
    if (frequency >= 50) return 'w-2.5 h-2.5';
    if (frequency >= 25) return 'w-2 h-2';
    return 'w-1.5 h-1.5';
  };

  const getTotalChannelPercentage = (breakdown: ChannelBreakdown): number => {
    return breakdown.chat + breakdown.email + breakdown.ticket + breakdown.voice + breakdown.social;
  };

  return (
    <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-5 h-[600px] shadow-lg shadow-black/30 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 flex-shrink-0 sticky top-0 bg-[#0a0a0f] z-10 pb-2">
        <div className="p-1.5 bg-orange-500/10 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-orange-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm">Fraud Failure Point Map</h3>
          <p className="text-gray-500 text-[10px]">Operational weaknesses exploited by fraudsters</p>
        </div>
      </div>

      {/* Matrix - Scrollable */}
      <div className="flex-1 overflow-auto scrollbar-thin">
        <div className="inline-block min-w-full">
          {/* Header Row - Fraud Categories */}
          <div className="flex border-b border-white/10 mb-2 sticky top-0 bg-[#0a0a0f] z-10">
            <div className="w-48 flex-shrink-0 p-2 border-r border-white/10">
              <span className="text-gray-500 text-[9px] uppercase">Failure Points</span>
            </div>
            <div className="flex-1 grid grid-cols-8 gap-1">
              {fraudCategories.map((category) => (
                <div
                  key={category.id}
                  className="p-2 text-center border-r border-white/5 last:border-r-0"
                >
                  <span className="text-gray-300 text-[10px] font-medium leading-tight block">
                    {category.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Matrix Rows */}
          <div className="space-y-1">
            {failurePoints.map((failurePoint) => {
              const Icon = failurePoint.icon;
              return (
                <div key={failurePoint.id} className="flex border-b border-white/5 hover:bg-white/5 transition-colors">
                  {/* Failure Point Label */}
                  <div className="w-48 flex-shrink-0 p-2 border-r border-white/10 flex items-start gap-2">
                    <div className="p-1 bg-orange-500/10 rounded mt-0.5">
                      <Icon className="w-3.5 h-3.5 text-orange-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-[11px] font-semibold leading-tight">
                        {failurePoint.name}
                      </div>
                      <div className="text-gray-400 text-[9px] leading-tight mt-0.5">
                        {failurePoint.description}
                      </div>
                    </div>
                  </div>

                  {/* Matrix Cells */}
                  <div className="flex-1 grid grid-cols-8 gap-1">
                    {fraudCategories.map((category) => {
                      const cellData = getCellData(failurePoint.id, category.id);
                      if (!cellData) {
                        return (
                          <div
                            key={category.id}
                            className="p-2 border-r border-white/5 last:border-r-0 flex items-center justify-center"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-white/5" />
                          </div>
                        );
                      }

                      const frequencyColor = getFrequencyColor(cellData.frequency);
                      const dotSize = getDotSize(cellData.frequency);
                      const totalPercentage = getTotalChannelPercentage(cellData.channelBreakdown);

                      return (
                        <div
                          key={category.id}
                          className="p-2 border-r border-white/5 last:border-r-0 flex flex-col items-center justify-center gap-1.5 group cursor-pointer hover:bg-white/5 transition-colors"
                          title={cellData.insight}
                        >
                          {/* Risk Dot */}
                          <div
                            className={`${dotSize} rounded-full`}
                            style={{ backgroundColor: frequencyColor }}
                          />

                          {/* Micro Channel Bar */}
                          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden flex">
                            {cellData.channelBreakdown.chat > 0 && (
                              <div
                                className="h-full"
                                style={{
                                  width: `${(cellData.channelBreakdown.chat / totalPercentage) * 100}%`,
                                  backgroundColor: channelColors.chat,
                                }}
                              />
                            )}
                            {cellData.channelBreakdown.email > 0 && (
                              <div
                                className="h-full"
                                style={{
                                  width: `${(cellData.channelBreakdown.email / totalPercentage) * 100}%`,
                                  backgroundColor: channelColors.email,
                                }}
                              />
                            )}
                            {cellData.channelBreakdown.ticket > 0 && (
                              <div
                                className="h-full"
                                style={{
                                  width: `${(cellData.channelBreakdown.ticket / totalPercentage) * 100}%`,
                                  backgroundColor: channelColors.ticket,
                                }}
                              />
                            )}
                            {cellData.channelBreakdown.voice > 0 && (
                              <div
                                className="h-full"
                                style={{
                                  width: `${(cellData.channelBreakdown.voice / totalPercentage) * 100}%`,
                                  backgroundColor: channelColors.voice,
                                }}
                              />
                            )}
                            {cellData.channelBreakdown.social > 0 && (
                              <div
                                className="h-full"
                                style={{
                                  width: `${(cellData.channelBreakdown.social / totalPercentage) * 100}%`,
                                  backgroundColor: channelColors.social,
                                }}
                              />
                            )}
                          </div>

                          {/* Frequency */}
                          <div className="text-[10px] text-gray-300 font-semibold">
                            {cellData.frequency}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        </div>

      {/* Legend */}
      <div className="mt-3 pt-3 border-t border-white/5 flex-shrink-0">
        <div className="flex items-center gap-4 flex-wrap text-[8px]">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500">Dot Size:</span>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-gray-400">Low</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <span className="text-gray-400">Mod</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-gray-400">High</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500">Bar = Channel Mix</span>
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

