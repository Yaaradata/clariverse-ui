'use client';

import { useState } from 'react';
import { Target, ArrowRight, X, Sparkles, Clock, Users, AlertTriangle, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

interface FCIEisenhowerDistributionProps {
  isDarkMode: boolean;
}

// Segment types
type SegmentKey = 'hvhf' | 'hvlf' | 'lvhf' | 'lvlf';

interface DominantTopic {
  name: string;
  volume: number;
  weight: number;
}

interface SegmentData {
  label: string;
  shortLabel: string;
  volume: number;
  contribution: number;
  color: string;
  dominantTopics: DominantTopic[];
}

interface AISummaryItem {
  title: string;
  description: string;
  accent: string;
}

interface QuadrantData {
  count: number;
  percentage: number;
  label: string;
  description: string;
  color: string;
  segments: SegmentKey[];
  segmentData: Record<SegmentKey, SegmentData>;
  aiSummary: AISummaryItem[];
}

// Base segment data from KPI Cards (Total Interactions: 243,253)
// FCI Rate by segment: HVHF: 0.8%, HVLF: 1.2%, LVHF: 2.1%, LVLF: 2.8%
const baseSegmentCounts = {
  hvhf: { total: 48650, fciRate: 0.008, fciCount: 389 },  // 48,650 * 0.8% = 389 FCI
  hvlf: { total: 72976, fciRate: 0.012, fciCount: 876 },  // 72,976 * 1.2% = 876 FCI
  lvhf: { total: 60813, fciRate: 0.021, fciCount: 1277 }, // 60,813 * 2.1% = 1,277 FCI
  lvlf: { total: 60814, fciRate: 0.028, fciCount: 1703 }  // 60,814 * 2.8% = 1,703 FCI
};
// Total FCI: 4,245

// Quadrant distribution of FCI cases based on priority matrix
// DO: Critical high-value issues (10% of HVHF + 5% of HVLF FCI)
// SCHEDULE: Important but not urgent (25% of HVLF + 15% of LVHF FCI)
// DELEGATE: Urgent but delegatable (60% of LVHF + 40% of LVLF FCI)
// POSTPONE: Low priority (70% of HVLF + 60% of LVLF FCI)

const fciQuadrantData: Record<string, QuadrantData> = {
  do: {
    count: 83,
    percentage: 2,
    label: 'Do - Now',
    description: 'Important & Urgent',
    color: '#ef4444',
    segments: ['hvhf', 'hvlf'],
    segmentData: {
      hvhf: {
        label: 'High Value High Frequency',
        shortLabel: 'HVHF',
        volume: 39, // 10% of 389 HVHF FCI cases - critical escalations
        contribution: 47,
        color: '#10b981',
        dominantTopics: [
          { name: 'VIP Dispute Timeout', volume: 15, weight: 0.95 },
          { name: 'Premium Card Block', volume: 12, weight: 0.88 },
          { name: 'High-Value Wire Fail', volume: 12, weight: 0.82 }
        ]
      },
      hvlf: {
        label: 'High Value Low Frequency',
        shortLabel: 'HVLF',
        volume: 44, // 5% of 876 HVLF FCI cases
        contribution: 53,
        color: '#06b6d4',
        dominantTopics: [
          { name: 'Large Transfer Reject', volume: 18, weight: 0.91 },
          { name: 'Account Freeze Issue', volume: 14, weight: 0.85 },
          { name: 'Compliance Escalation', volume: 12, weight: 0.78 }
        ]
      },
      lvhf: { label: 'Low Value High Frequency', shortLabel: 'LVHF', volume: 0, contribution: 0, color: '#f59e0b', dominantTopics: [] },
      lvlf: { label: 'Low Value Low Frequency', shortLabel: 'LVLF', volume: 0, contribution: 0, color: '#ef4444', dominantTopics: [] }
    },
    aiSummary: [
      { title: 'Critical Revenue at Risk', description: '83 high-value customers with combined CLV of $2.3M are experiencing critical failures. VIP Dispute Timeout (15 cases) and Premium Card Block (12 cases) are the top issues requiring immediate executive attention.', accent: '#ef4444' },
      { title: 'SLA Breach Imminent', description: 'Average time to SLA breach is 2.5 hours. 39 HVHF cases need resolution within 4 hours to avoid contractual penalties and potential churn.', accent: '#f97316' },
      { title: 'Immediate Action Required', description: 'Escalate Large Transfer Rejections (18 cases) to Operations Manager. 44 HVLF customers have pending high-value transactions blocked - total value at risk: $4.2M.', accent: '#eab308' }
    ]
  },
  schedule: {
    count: 411,
    percentage: 10,
    label: 'Schedule - Later',
    description: 'Important, Not Urgent',
    color: '#eab308',
    segments: ['hvlf', 'lvhf'],
    segmentData: {
      hvhf: { label: 'High Value High Frequency', shortLabel: 'HVHF', volume: 0, contribution: 0, color: '#10b981', dominantTopics: [] },
      hvlf: {
        label: 'High Value Low Frequency',
        shortLabel: 'HVLF',
        volume: 219, // 25% of 876 HVLF FCI
        contribution: 53,
        color: '#06b6d4',
        dominantTopics: [
          { name: 'Biometric Auth Failure', volume: 85, weight: 0.89 },
          { name: 'Session Timeout Issues', volume: 72, weight: 0.76 },
          { name: 'App Upgrade Friction', volume: 62, weight: 0.65 }
        ]
      },
      lvhf: {
        label: 'Low Value High Frequency',
        shortLabel: 'LVHF',
        volume: 192, // 15% of 1,277 LVHF FCI
        contribution: 47,
        color: '#f59e0b',
        dominantTopics: [
          { name: 'Login Error Messages', volume: 78, weight: 0.82 },
          { name: 'Password Reset Loop', volume: 64, weight: 0.71 },
          { name: 'Device Recognition', volume: 50, weight: 0.58 }
        ]
      },
      lvlf: { label: 'Low Value Low Frequency', shortLabel: 'LVLF', volume: 0, contribution: 0, color: '#ef4444', dominantTopics: [] }
    },
    aiSummary: [
      { title: 'Authentication Infrastructure Issue', description: 'Biometric Auth Failure affects 85 HVLF customers (53% contribution). Schedule engineering review within 24-48 hours. Conversion opportunity: $1.2M if resolved.', accent: '#eab308' },
      { title: 'Session Management Optimization', description: '72 Session Timeout cases and 64 Password Reset Loops indicate UX friction. Digital Lead should prioritize mobile app session handling improvements.', accent: '#06b6d4' },
      { title: 'Cross-Sell Opportunity', description: '411 customers in this quadrant have $340K annual cross-sell potential. Proactive outreach after issue resolution could capture this value within 30 days.', accent: '#10b981' }
    ]
  },
  delegate: {
    count: 1448,
    percentage: 34,
    label: 'Delegate - Team',
    description: 'Not Important, Urgent',
    color: '#5332ff',
    segments: ['lvhf', 'lvlf'],
    segmentData: {
      hvhf: { label: 'High Value High Frequency', shortLabel: 'HVHF', volume: 0, contribution: 0, color: '#10b981', dominantTopics: [] },
      hvlf: { label: 'High Value Low Frequency', shortLabel: 'HVLF', volume: 0, contribution: 0, color: '#06b6d4', dominantTopics: [] },
      lvhf: {
        label: 'Low Value High Frequency',
        shortLabel: 'LVHF',
        volume: 766, // 60% of 1,277 LVHF FCI
        contribution: 53,
        color: '#f59e0b',
        dominantTopics: [
          { name: 'Branch Phone Loop', volume: 285, weight: 0.94 },
          { name: 'Repeated Verification', volume: 245, weight: 0.87 },
          { name: 'Channel Handoff Gap', volume: 236, weight: 0.79 }
        ]
      },
      lvlf: {
        label: 'Low Value Low Frequency',
        shortLabel: 'LVLF',
        volume: 682, // 40% of 1,703 LVLF FCI
        contribution: 47,
        color: '#ef4444',
        dominantTopics: [
          { name: 'Case History Missing', volume: 268, weight: 0.91 },
          { name: 'Callback Not Received', volume: 225, weight: 0.83 },
          { name: 'Transfer Documentation', volume: 189, weight: 0.72 }
        ]
      }
    },
    aiSummary: [
      { title: 'Team Capacity Available', description: '35% team capacity available. Assign 1,448 cases to frontline teams. Branch Phone Loop (285 cases) and Repeated Verification (245 cases) can be handled by Tier 1 agents.', accent: '#5332ff' },
      { title: 'Process Automation Opportunity', description: '40% of delegate cases (580 cases) are automation candidates. Case History Missing (268) and Callback Not Received (225) can be addressed with workflow automation.', accent: '#8b5cf6' },
      { title: 'Average Resolution Time', description: 'Expected resolution: 12 minutes per case. Combined customer value: $211K/year. Channel Handoff Gap (236 cases) requires documentation improvement.', accent: '#06b6d4' }
    ]
  },
  postpone: {
    count: 2303,
    percentage: 54,
    label: 'Postpone',
    description: 'Not Important, Not Urgent',
    color: '#6b7280',
    segments: ['hvlf', 'lvlf'],
    segmentData: {
      hvhf: { label: 'High Value High Frequency', shortLabel: 'HVHF', volume: 0, contribution: 0, color: '#10b981', dominantTopics: [] },
      hvlf: {
        label: 'High Value Low Frequency',
        shortLabel: 'HVLF',
        volume: 613, // 70% of 876 HVLF FCI (non-urgent issues)
        contribution: 27,
        color: '#06b6d4',
        dominantTopics: [
          { name: 'FAQ Not Discoverable', volume: 245, weight: 0.88 },
          { name: 'Search Result Mismatch', volume: 198, weight: 0.81 },
          { name: 'Help Center Navigation', volume: 170, weight: 0.69 }
        ]
      },
      lvhf: { label: 'Low Value High Frequency', shortLabel: 'LVHF', volume: 0, contribution: 0, color: '#f59e0b', dominantTopics: [] },
      lvlf: {
        label: 'Low Value Low Frequency',
        shortLabel: 'LVLF',
        volume: 1690, // 60% remaining of 1,703 LVLF FCI after delegate
        contribution: 73,
        color: '#ef4444',
        dominantTopics: [
          { name: 'Basic How-To Queries', volume: 845, weight: 0.96 },
          { name: 'Account Info Requests', volume: 507, weight: 0.84 },
          { name: 'Feature Awareness Gap', volume: 338, weight: 0.71 }
        ]
      }
    },
    aiSummary: [
      { title: 'Self-Service Optimization', description: '85% of 2,303 cases (1,958 cases) are self-service solvable. Basic How-To Queries (845 cases) and FAQ Not Discoverable (245 cases) indicate knowledge base gaps.', accent: '#6b7280' },
      { title: 'Resource Savings Opportunity', description: 'Addressing these issues through self-service improvements can save 15 hours/week. Monthly review recommended for Knowledge Team to update FAQ content.', accent: '#10b981' },
      { title: 'Low Priority - Monitor Only', description: 'Combined annual value: $45K. Account Info Requests (507 cases) and Feature Awareness Gap (338 cases) can be addressed through in-app tooltips and guided tours.', accent: '#939394' }
    ]
  }
};

// Topic colors for stacked bars
const topicColors = [
  '#ef4444', // red - Topic 1
  '#f97316', // orange - Topic 2
  '#eab308', // yellow - Topic 3
  '#22c55e', // green - Topic 4
  '#06b6d4', // cyan - Topic 5
];

const segmentLabels: Record<SegmentKey, string> = {
  hvhf: 'HVHF',
  hvlf: 'HVLF', 
  lvhf: 'LVHF',
  lvlf: 'LVLF',
};

const segmentFullLabels: Record<SegmentKey, string> = {
  hvhf: 'High Value High Freq',
  hvlf: 'High Value Low Freq', 
  lvhf: 'Low Value High Freq',
  lvlf: 'Low Value Low Freq',
};

// Tooltip component for bar chart
interface TooltipProps {
  segment: SegmentData;
  topic: DominantTopic;
  topicIndex: number;
  visible: boolean;
  x: number;
  y: number;
  isDarkMode: boolean;
}

function BarTooltip({ segment, topic, topicIndex, visible, x, y, isDarkMode }: TooltipProps) {
  if (!visible) return null;
  
  return (
    <div 
      className="absolute z-50 px-3 py-2 rounded-lg shadow-xl pointer-events-none"
      style={{ 
        left: x,
        top: y - 80,
        backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF',
        border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`,
        transform: 'translateX(-50%)',
        minWidth: '180px'
      }}
    >
      <div className="text-xs font-semibold mb-1" style={{ color: segment.color }}>
        {segment.shortLabel} - {segment.label}
      </div>
      <div className="flex items-center gap-2 text-xs mb-1" style={{ color: topicColors[topicIndex] }}>
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: topicColors[topicIndex] }} />
        <span className="font-medium">{topic.name}</span>
      </div>
      <div className="text-xs" style={{ color: isDarkMode ? '#E5E5E5' : '#374151' }}>
        Volume: <span className="font-bold">{topic.volume}</span>
      </div>
      <div className="text-xs" style={{ color: '#939394' }}>
        Weight: <span className="font-bold">{(topic.weight * 100).toFixed(0)}%</span>
      </div>
    </div>
  );
}

// Stacked Bar Chart Component - Segments on X-axis, Topics as colors
interface BarChartProps {
  segments: SegmentKey[];
  segmentData: Record<SegmentKey, SegmentData>;
  isDarkMode: boolean;
}

function SegmentBarChart({ segments, segmentData, isDarkMode }: BarChartProps) {
  const [tooltip, setTooltip] = useState<{ segment: SegmentData; topic: DominantTopic; topicIndex: number; x: number; y: number } | null>(null);
  
  // Get active segments with data
  const activeSegments = segments.filter(s => segmentData[s].volume > 0);
  const maxVolume = Math.max(...activeSegments.map(s => segmentData[s].volume), 1);
  
  // Y-axis ticks
  const yAxisTicks = [0, Math.round(maxVolume * 0.25), Math.round(maxVolume * 0.5), Math.round(maxVolume * 0.75), maxVolume];
  
  const chartHeight = 160;
  const chartPadding = { left: 40, right: 10, top: 10, bottom: 50 };
  const chartWidth = 400;
  
  return (
    <div className="relative w-full">
      <svg 
        width="100%" 
        height={chartHeight + chartPadding.top + chartPadding.bottom}
        viewBox={`0 0 ${chartWidth} ${chartHeight + chartPadding.top + chartPadding.bottom}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ display: 'block' }}
      >
        {/* Grid lines - horizontal */}
        <g>
          {yAxisTicks.map((tick, idx) => {
            const y = chartPadding.top + chartHeight - (tick / maxVolume) * chartHeight;
            return (
              <line
                key={idx}
                x1={chartPadding.left}
                y1={y}
                x2={chartWidth - chartPadding.right}
                y2={y}
                stroke={isDarkMode ? '#3a3a3a' : '#E5E5E5'}
                strokeDasharray="3 3"
              />
            );
          })}
        </g>
        
        {/* Y-axis */}
        <g>
          <line
            x1={chartPadding.left}
            y1={chartPadding.top}
            x2={chartPadding.left}
            y2={chartPadding.top + chartHeight}
            stroke={isDarkMode ? '#666' : '#999'}
          />
          {yAxisTicks.map((tick, idx) => {
            const y = chartPadding.top + chartHeight - (tick / maxVolume) * chartHeight;
            return (
              <text
                key={idx}
                x={chartPadding.left - 8}
                y={y + 4}
                textAnchor="end"
                fontSize="10"
                fill={isDarkMode ? '#D6D9D8' : '#666'}
              >
                {tick}
              </text>
            );
          })}
        </g>
        
        {/* X-axis */}
        <line
          x1={chartPadding.left}
          y1={chartPadding.top + chartHeight}
          x2={chartWidth - chartPadding.right}
          y2={chartPadding.top + chartHeight}
          stroke={isDarkMode ? '#666' : '#999'}
        />
        
        {/* Bars - one per segment, stacked by topics */}
        <g>
          {activeSegments.map((segKey, segIdx) => {
            const segment = segmentData[segKey];
            const availableWidth = chartWidth - chartPadding.left - chartPadding.right;
            const barWidth = Math.min(80, availableWidth / activeSegments.length - 15);
            const barSpacing = availableWidth / activeSegments.length;
            const barX = chartPadding.left + barSpacing * segIdx + (barSpacing - barWidth) / 2;
            
            const totalBarHeight = (segment.volume / maxVolume) * chartHeight;
            let currentY = chartPadding.top + chartHeight;
            
            // Calculate topic proportions
            const totalTopicVolume = segment.dominantTopics.reduce((sum, t) => sum + t.volume, 0);
            
            return (
              <g key={segKey}>
                {/* Stacked topic bars */}
                {segment.dominantTopics.map((topic, topicIdx) => {
                  const topicHeight = totalTopicVolume > 0 
                    ? (topic.volume / totalTopicVolume) * totalBarHeight 
                    : 0;
                  
                  if (topicHeight === 0) return null;
                  
                  const y = currentY - topicHeight;
                  currentY = y;
                  
                  const isTopTopic = topicIdx === segment.dominantTopics.length - 1;
                  
                  return (
                    <rect
                      key={topicIdx}
                      x={barX}
                      y={y}
                      width={barWidth}
                      height={topicHeight}
                      fill={topicColors[topicIdx % topicColors.length]}
                      rx={isTopTopic ? 4 : 0}
                      ry={isTopTopic ? 4 : 0}
                      className="cursor-pointer transition-opacity duration-200 hover:opacity-80"
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const svgRect = e.currentTarget.closest('svg')?.getBoundingClientRect();
                        if (svgRect) {
                          setTooltip({
                            segment,
                            topic,
                            topicIndex: topicIdx,
                            x: rect.left - svgRect.left + barWidth / 2,
                            y: rect.top - svgRect.top
                          });
                        }
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  );
                })}
                
                {/* Volume label on top of bar */}
                <text
                  x={barX + barWidth / 2}
                  y={chartPadding.top + chartHeight - totalBarHeight - 5}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="bold"
                  fill={isDarkMode ? '#FFFFFF' : '#1f2937'}
                >
                  {segment.volume}
                </text>
                
                {/* X-axis label - segment name */}
                <text
                  x={barX + barWidth / 2}
                  y={chartPadding.top + chartHeight + 15}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="bold"
                  fill={segment.color}
                >
                  {segment.shortLabel}
                </text>
                <text
                  x={barX + barWidth / 2}
                  y={chartPadding.top + chartHeight + 28}
                  textAnchor="middle"
                  fontSize="9"
                  fill={isDarkMode ? '#939394' : '#666'}
                >
                  {segment.contribution}%
                </text>
              </g>
            );
          })}
        </g>
      </svg>
      
      {/* Legend for topic colors */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
        {[0, 1, 2].map((idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            <div 
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: topicColors[idx] }}
            />
            <span className="text-[10px]" style={{ color: isDarkMode ? '#E5E5E5' : '#666' }}>
              Topic {idx + 1}
            </span>
          </div>
        ))}
      </div>
      
      {tooltip && (
        <BarTooltip 
          segment={tooltip.segment}
          topic={tooltip.topic}
          topicIndex={tooltip.topicIndex}
          visible={true} 
          x={tooltip.x} 
          y={tooltip.y} 
          isDarkMode={isDarkMode} 
        />
      )}
    </div>
  );
}

// Segment Card Component
interface SegmentCardProps {
  segment: SegmentData;
  isDarkMode: boolean;
}

function SegmentCard({ segment, isDarkMode }: SegmentCardProps) {
  const sortedTopics = [...segment.dominantTopics].sort((a, b) => b.weight - a.weight);
  
  return (
    <div 
      className="rounded-lg p-2.5"
      style={{ 
        backgroundColor: isDarkMode ? '#1a1a1a' : '#F9FAFB',
        border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: segment.color }} />
          <span className="text-xs font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#1f2937' }}>
            {segment.shortLabel}
          </span>
        </div>
        <span 
          className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
          style={{ 
            backgroundColor: `${segment.color}20`,
            color: segment.color
          }}
        >
          {segment.contribution}%
        </span>
      </div>
      
      {/* Stats - Inline */}
      <div className="flex items-center gap-3 mb-2 text-[10px]">
        <div className="flex items-center gap-1">
          <span style={{ color: '#939394' }}>Volume:</span>
          <span className="font-bold" style={{ color: segment.color }}>{segment.volume}</span>
        </div>
        <div className="flex items-center gap-1">
          <span style={{ color: '#939394' }}>Contribution:</span>
          <span className="font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#1f2937' }}>{segment.contribution}%</span>
        </div>
      </div>
      
      {/* Dominant Topics - Compact */}
      <div className="space-y-1">
        {sortedTopics.length > 0 ? sortedTopics.slice(0, 3).map((topic, idx) => {
          const topicColor = topicColors[idx % topicColors.length];
          return (
            <div 
              key={idx}
              className="flex items-center justify-between py-1 px-1.5 rounded"
              style={{ backgroundColor: isDarkMode ? '#232323' : '#ECEFF2' }}
            >
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <span 
                  className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                  style={{ backgroundColor: `${topicColor}30`, color: topicColor }}
                >
                  {idx + 1}
                </span>
                <span className="text-[10px] truncate" style={{ color: isDarkMode ? '#E5E5E5' : '#374151' }}>
                  {topic.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0 ml-1">
                <span className="text-[10px] font-medium" style={{ color: '#939394' }}>
                  {topic.volume}
                </span>
                <div 
                  className="w-8 h-1 rounded-full overflow-hidden"
                  style={{ backgroundColor: isDarkMode ? '#2a2a2a' : '#E5E5E5' }}
                >
                  <div 
                    className="h-full rounded-full"
                    style={{ width: `${topic.weight * 100}%`, backgroundColor: topicColor }}
                  />
                </div>
                <span className="text-[9px] font-bold w-6 text-right" style={{ color: topicColor }}>
                  {(topic.weight * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          );
        }) : (
          <div className="text-[10px] text-center py-1" style={{ color: '#939394' }}>
            No topics
          </div>
        )}
      </div>
    </div>
  );
}

export function FCIEisenhowerDistribution({ isDarkMode }: FCIEisenhowerDistributionProps) {
  const [selectedQuadrant, setSelectedQuadrant] = useState<string | null>(null);
  const [activeInsightTab, setActiveInsightTab] = useState<'summary' | 'details'>('summary');

  const handleQuadrantClick = (quadrant: string) => {
    setSelectedQuadrant(selectedQuadrant === quadrant ? null : quadrant);
    setActiveInsightTab('summary'); // Reset to summary tab when changing quadrant
  };

  const selectedData = selectedQuadrant ? fciQuadrantData[selectedQuadrant] : null;

  return (
    <div 
      className="rounded-2xl p-6 mb-6"
      style={{ 
        backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF',
        border: `1px solid ${isDarkMode ? '#1f1f1f' : '#E5E5E5'}`
      }}
    >
      <div className={`grid gap-6 ${selectedQuadrant ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Left Side - Quadrant Distribution */}
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5" style={{ color: '#b90abd' }} />
              <h2 
                className="text-lg font-bold"
                style={{ color: isDarkMode ? '#FFFFFF' : '#1f2937' }}
              >
                FCI • Eisenhower Quadrant Distribution
              </h2>
              <div 
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md ml-2"
                style={{ 
                  backgroundColor: 'rgba(185, 10, 189, 0.1)',
                  border: '1px solid rgba(185, 10, 189, 0.3)'
                }}
              >
                <Sparkles className="h-3.5 w-3.5" style={{ color: '#b90abd' }} />
                <span className="text-xs font-medium" style={{ color: '#b90abd' }}>AI Priority Analysis</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm mb-6 flex items-center gap-2" style={{ color: '#939394' }}>
            <span>Focus on critical items first</span>
            <span style={{ color: '#b90abd' }}>•</span>
            <span>Failed interaction distribution across priority quadrants</span>
          </p>

          {/* Quadrant Grid */}
          <div 
            className="grid grid-cols-2 gap-0 rounded-lg overflow-hidden"
            style={{ border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}` }}
          >
            {(['do', 'schedule', 'delegate', 'postpone'] as const).map((quadrant) => {
              const data = fciQuadrantData[quadrant];
              const isSelected = selectedQuadrant === quadrant;
              const isLeftColumn = quadrant === 'do' || quadrant === 'delegate';
              const isTopRow = quadrant === 'do' || quadrant === 'schedule';
              const isDoQuadrant = quadrant === 'do';

              return (
                <div
                  key={quadrant}
                  className={`relative text-center cursor-pointer p-6 transition-all duration-200 group ${
                    isSelected ? 'ring-2 shadow-lg' : 'hover:bg-opacity-50'
                  }`}
                  style={{
                    backgroundColor: isSelected 
                      ? (isDarkMode ? 'rgba(40, 40, 40, 0.7)' : 'rgba(240, 240, 240, 0.7)')
                      : 'transparent',
                    borderRight: isLeftColumn ? `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}` : 'none',
                    borderBottom: isTopRow ? `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}` : 'none',
                    ...(isSelected ? { boxShadow: '0 0 0 2px #b90abd' } : {})
                  }}
                  onClick={() => handleQuadrantClick(quadrant)}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(40, 40, 40, 0.5)' : 'rgba(240, 240, 240, 0.5)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {isDoQuadrant && data.count > 0 && (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#b90abd]/10 via-[#b90abd]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  )}

                  <div className="flex items-center justify-center mb-3 relative z-10">
                    {isDoQuadrant && data.count > 0 && (
                      <span className="absolute -left-4 text-sm animate-pulse">✨</span>
                    )}
                    <div 
                      className="w-3.5 h-3.5 rounded-full mr-2"
                      style={{ backgroundColor: data.color }}
                    />
                    <span 
                      className="text-sm font-semibold"
                      style={{ color: isDarkMode ? '#E5E5E5' : '#374151' }}
                    >
                      {data.label}
                    </span>
                  </div>

                  <div 
                    className="text-4xl font-bold mb-1"
                    style={{ color: isDarkMode ? '#FFFFFF' : '#1f2937' }}
                  >
                    {data.count}
                  </div>

                  <div className="text-sm mb-2" style={{ color: '#939394' }}>
                    {data.percentage}%
                  </div>

                  <div className="text-xs mb-3" style={{ color: '#6B7280' }}>
                    {data.description}
                  </div>

                  {/* Segment Pills */}
                  <div className="flex items-center justify-center gap-1.5 mb-4">
                    {data.segments.map((seg) => (
                      <span 
                        key={seg}
                        className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                        style={{ 
                          backgroundColor: `${data.segmentData[seg].color}20`,
                          color: data.segmentData[seg].color
                        }}
                      >
                        {data.segmentData[seg].shortLabel}
                      </span>
                    ))}
                  </div>

                  {isDoQuadrant && data.count > 0 && (
                    <button
                      className="w-full py-2.5 px-4 rounded-lg text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-all duration-200 hover:shadow-lg"
                      style={{ 
                        background: 'linear-gradient(to right, #b90abd, #5332ff)',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuadrantClick(quadrant);
                      }}
                    >
                      <Target className="h-3.5 w-3.5" />
                      Work on Top Priority
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side - Detailed Analysis Panel */}
        {selectedQuadrant && selectedData && (
          <div 
            className="rounded-xl overflow-hidden"
            style={{ 
              backgroundColor: isDarkMode ? '#151515' : '#F9FAFB',
              border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`
            }}
          >
            {/* Panel Header */}
            <div 
              className="flex items-center justify-between p-4"
              style={{ borderBottom: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}` }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${selectedData.color}20` }}
                >
                  <BarChart3 className="h-4 w-4" style={{ color: selectedData.color }} />
                </div>
                <div>
                  <h3 
                    className="text-base font-bold"
                    style={{ color: isDarkMode ? '#FFFFFF' : '#1f2937' }}
                  >
                    {selectedData.label}
                  </h3>
                  <p className="text-xs" style={{ color: '#939394' }}>{selectedData.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md"
                  style={{ 
                    backgroundColor: `${selectedData.color}15`,
                    border: `1px solid ${selectedData.color}40`
                  }}
                >
                  {selectedData.count > 0 && Number(selectedData.percentage) >= 0 ? (
                    <TrendingUp className="h-3.5 w-3.5" style={{ color: '#ef4444' }} />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5" style={{ color: '#10b981' }} />
                  )}
                  <span className="text-xs font-bold" style={{ color: selectedData.color }}>
                    {selectedData.count} cases
                  </span>
                </div>
                <button
                  onClick={() => setSelectedQuadrant(null)}
                  className="p-1.5 rounded-md hover:bg-gray-700/50 transition-colors"
                  style={{ color: '#939394' }}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Insight Tabs */}
            <div 
              className="flex gap-0 px-4 pt-3"
              style={{ borderBottom: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}` }}
            >
              <button
                onClick={() => setActiveInsightTab('summary')}
                className="relative pb-2.5 px-4 text-sm font-medium transition-colors flex items-center gap-1.5"
                style={{
                  color: activeInsightTab === 'summary' ? '#b90abd' : '#939394'
                }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                AI Summary
                {activeInsightTab === 'summary' && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: '#b90abd' }}
                  />
                )}
              </button>
              <button
                onClick={() => setActiveInsightTab('details')}
                className="relative pb-2.5 px-4 text-sm font-medium transition-colors flex items-center gap-1.5"
                style={{
                  color: activeInsightTab === 'details' ? '#b90abd' : '#939394'
                }}
              >
                <BarChart3 className="h-3.5 w-3.5" />
                Segment Details
                {activeInsightTab === 'details' && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: '#b90abd' }}
                  />
                )}
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-4 max-h-[550px] overflow-y-auto space-y-5">
              {activeInsightTab === 'summary' ? (
                /* AI Summary Tab Content */
                <div className="space-y-4">
                  {/* Quadrant-specific AI Insights */}
                  <div className="space-y-3">
                    {selectedData.aiSummary.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl relative overflow-hidden"
                        style={{
                          backgroundColor: isDarkMode ? 'rgba(185, 10, 189, 0.08)' : 'rgba(185, 10, 189, 0.05)',
                          border: `1px solid ${isDarkMode ? 'rgba(185, 10, 189, 0.2)' : 'rgba(185, 10, 189, 0.15)'}`
                        }}
                      >
                        {/* Accent bar */}
                        <div 
                          className="absolute left-0 top-0 bottom-0 w-1"
                          style={{ backgroundColor: item.accent }}
                        />
                        <div className="pl-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-4 w-4" style={{ color: item.accent }} />
                            <h4
                              className="text-sm font-bold"
                              style={{ color: isDarkMode ? '#FFFFFF' : '#1f2937' }}
                            >
                              {item.title}
                            </h4>
                          </div>
                          <p className="text-xs leading-relaxed" style={{ color: '#939394' }}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick Stats Summary */}
                  <div 
                    className="grid grid-cols-3 gap-3 p-3 rounded-xl"
                    style={{ 
                      backgroundColor: isDarkMode ? '#1a1a1a' : '#F3F4F6',
                      border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`
                    }}
                  >
                    <div className="text-center">
                      <div className="text-xs" style={{ color: '#939394' }}>Total Cases</div>
                      <div className="text-2xl font-bold" style={{ color: selectedData.color }}>
                        {selectedData.count}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs" style={{ color: '#939394' }}>Distribution</div>
                      <div className="text-2xl font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#1f2937' }}>
                        {selectedData.percentage}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs" style={{ color: '#939394' }}>Active Segments</div>
                      <div className="text-2xl font-bold" style={{ color: '#f59e0b' }}>
                        {selectedData.segments.filter(s => selectedData.segmentData[s].volume > 0).length}
                      </div>
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div 
                    className="flex items-center justify-between p-3 rounded-xl"
                    style={{ 
                      backgroundColor: isDarkMode ? '#1a1a1a' : '#F3F4F6',
                      border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" style={{ color: '#939394' }} />
                      <span className="text-xs" style={{ color: '#939394' }}>
                        {selectedQuadrant === 'do' ? '2-4 hours resolution' : 
                         selectedQuadrant === 'schedule' ? '24-48 hours' :
                         selectedQuadrant === 'delegate' ? '1-2 weeks' : 'Monthly review'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" style={{ color: '#939394' }} />
                      <span className="text-xs" style={{ color: '#939394' }}>
                        {selectedQuadrant === 'do' ? 'Operations Manager' : 
                         selectedQuadrant === 'schedule' ? 'Digital Lead' :
                         selectedQuadrant === 'delegate' ? 'Team Leads' : 'Knowledge Team'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Details Tab Content */
                <div className="space-y-5">
                  {/* Bar Chart and Segment Cards - Side by Side */}
                  <div className="flex gap-4">
                    {/* Left - Bar Chart Section */}
                    <div 
                      className="flex-1 rounded-xl p-4"
                      style={{ 
                        backgroundColor: isDarkMode ? '#1a1a1a' : '#F3F4F6',
                        border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`
                      }}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <BarChart3 className="h-4 w-4" style={{ color: '#b90abd' }} />
                        <span className="text-xs font-bold tracking-wide" style={{ color: '#939394' }}>
                          SEGMENT DISTRIBUTION
                        </span>
                      </div>
                      <SegmentBarChart 
                        segments={selectedData.segments} 
                        segmentData={selectedData.segmentData}
                        isDarkMode={isDarkMode}
                      />
                    </div>

                    {/* Right - Segment Cards */}
                    <div className="flex-1 flex flex-col gap-3">
                      {selectedData.segments.filter(s => selectedData.segmentData[s].volume > 0).map((segKey) => (
                        <SegmentCard 
                          key={segKey}
                          segment={selectedData.segmentData[segKey]}
                          isDarkMode={isDarkMode}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Summary Stats */}
                  <div 
                    className="grid grid-cols-3 gap-3 p-3 rounded-xl"
                    style={{ 
                      backgroundColor: isDarkMode ? '#1a1a1a' : '#F3F4F6',
                      border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`
                    }}
                  >
                    <div className="text-center">
                      <div className="text-xs" style={{ color: '#939394' }}>Total Volume</div>
                      <div className="text-2xl font-bold" style={{ color: selectedData.color }}>
                        {selectedData.count}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs" style={{ color: '#939394' }}>Distribution</div>
                      <div className="text-2xl font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#1f2937' }}>
                        {selectedData.percentage}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs" style={{ color: '#939394' }}>Segments</div>
                      <div className="text-2xl font-bold" style={{ color: '#f59e0b' }}>
                        {selectedData.segments.filter(s => selectedData.segmentData[s].volume > 0).length}
                      </div>
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div 
                    className="flex items-center justify-between p-3 rounded-xl"
                    style={{ 
                      backgroundColor: isDarkMode ? '#1a1a1a' : '#F3F4F6',
                      border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" style={{ color: '#939394' }} />
                      <span className="text-xs" style={{ color: '#939394' }}>
                        {selectedQuadrant === 'do' ? '2-4 hours resolution' : 
                         selectedQuadrant === 'schedule' ? '24-48 hours' :
                         selectedQuadrant === 'delegate' ? '1-2 weeks' : 'Monthly review'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" style={{ color: '#939394' }} />
                      <span className="text-xs" style={{ color: '#939394' }}>
                        {selectedQuadrant === 'do' ? 'Operations Manager' : 
                         selectedQuadrant === 'schedule' ? 'Digital Lead' :
                         selectedQuadrant === 'delegate' ? 'Team Leads' : 'Knowledge Team'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
