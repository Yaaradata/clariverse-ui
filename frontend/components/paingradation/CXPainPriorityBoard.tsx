'use client';

import { useState, useEffect } from 'react';
import {
  X, BarChart3, TrendingUp, ChevronRight, Zap,
  Layers, Target, ArrowRight
} from 'lucide-react';
import {
  PainCluster,
  PriorityColumn,
  PriorityColumnConfig,
  priorityColumns,
  painClustersData,
  getClustersByPriority,
} from '@/lib/paingradation-lib/painDashboardData';

interface CXPainPriorityBoardProps {
  isDarkMode?: boolean;
  data?: PainCluster[];
  threshold?: number;
}

// Customer segment types for the detail view
type CustomerSegmentType = 'value-conscious' | 'tech-savvy' | 'fashion-conscious' | 'Home & Grocery shoppers';

// Channel types
type ChannelType = 'email' | 'chat' | 'tickets' | 'voice' | 'social';

interface CustomerSegmentConfig {
  id: CustomerSegmentType;
  label: string;
  shortLabel: string;
  color: string;
}

const customerSegmentConfigs: CustomerSegmentConfig[] = [
  { id: 'value-conscious', label: 'Value-conscious', shortLabel: 'Value', color: '#10b981' },
  { id: 'tech-savvy', label: 'Tech-savvy', shortLabel: 'Tech', color: '#06b6d4' },
  { id: 'fashion-conscious', label: 'Fashion-conscious', shortLabel: 'Fashion', color: '#f97316' },
  { id: 'Home & Grocery shoppers', label: 'Home & Grocery shoppers', shortLabel: 'Home', color: '#ef4444' },
];

// Map quadrants to their customer segment types
const quadrantCustomerSegments: Record<PriorityColumn, CustomerSegmentType[]> = {
  'do-now': ['value-conscious', 'tech-savvy'],
  'schedule': ['tech-savvy', 'fashion-conscious'],
  'delegate': ['fashion-conscious', 'Home & Grocery shoppers'],
  'postpone': ['value-conscious', 'Home & Grocery shoppers'],
};

// Quadrant descriptions
const quadrantDescriptions: Record<PriorityColumn, string> = {
  'do-now': 'Important & Urgent',
  'schedule': 'Important, Not Urgent',
  'delegate': 'Not Important, Urgent',
  'postpone': 'Not Important, Not Urgent',
};

export function CXPainPriorityBoard({ 
  isDarkMode = false, 
  data = painClustersData,
  threshold = 60 
}: CXPainPriorityBoardProps) {
  const [selectedQuadrant, setSelectedQuadrant] = useState<PriorityColumn | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'details'>('summary');
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredQuadrant, setHoveredQuadrant] = useState<PriorityColumn | null>(null);
  const [hoveredChannel, setHoveredChannel] = useState<{ segment: string; topicIndex: number; channel: ChannelType | 'topic' } | null>(null);
  const [hoveredSegmentPill, setHoveredSegmentPill] = useState<{ segment: CustomerSegmentType; topicIndex: number } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Get clusters organized by priority
  const clustersByPriority: Record<PriorityColumn, PainCluster[]> = {
    'do-now': getClustersByPriority(data, 'do-now', threshold),
    'schedule': getClustersByPriority(data, 'schedule', threshold),
    'delegate': getClustersByPriority(data, 'delegate', threshold),
    'postpone': getClustersByPriority(data, 'postpone', threshold),
  };

  // Calculate totals
  const totalClusters = data.length;
  const totalContacts = data.reduce((sum, c) => sum + c.contacts, 0);

  // Hardcoded quadrant stats matching design
  const quadrantStats: Record<PriorityColumn, { count: number; contacts: number; percentage: number }> = {
    'do-now': { count: 12, contacts: 12, percentage: 0.6 },
    'schedule': { count: 35, contacts: 35, percentage: 2 },
    'delegate': { count: 500, contacts: 500, percentage: 25 },
    'postpone': { count: 1457, contacts: 1457, percentage: 73 },
  };

  // Get quadrant summary
  const getQuadrantSummary = (column: PriorityColumn) => {
    return quadrantStats[column];
  };

  // Generate AI insights for a quadrant - Business-focused insights
  const getAIInsights = (column: PriorityColumn) => {
    const quadrantTotal = quadrantStats[column].contacts;
    const segments = segmentDistributionData[column];
    const topSegment = segments[0];
    const secondSegment = segments[1];
    const topSegmentLabel = customerSegmentConfigs.find(c => c.id === topSegment?.segment)?.label || 'Value-conscious';
    const secondSegmentLabel = customerSegmentConfigs.find(c => c.id === secondSegment?.segment)?.label || 'Tech-savvy';

    // Quadrant-specific insights with business metrics
    const insightsByQuadrant: Record<PriorityColumn, Array<{ title: string; description: string }>> = {
      'do-now': [
        {
          title: 'Payment & Delivery Infrastructure Issue',
          description: `Payment Failure affects ${topSegment?.volume || 7} ${topSegmentLabel} customers (${topSegment?.contribution || 58}% contribution). Immediate escalation to payment gateway and logistics teams required. Revenue at risk: ₹2.4L if unresolved within 4 hours.`,
        },
        {
          title: 'Order Fulfillment Optimization',
          description: `${topSegment?.topics[1]?.volume || 2} Refund Delay cases and ${topSegment?.topics[2]?.volume || 2} Delivery Miss incidents indicate fulfillment friction. Operations Lead should prioritize order processing improvements immediately.`,
        },
        {
          title: 'Customer Retention Risk',
          description: `${quadrantTotal} high-priority customers have ₹1.8L combined lifetime value at risk. Proactive outreach after issue resolution could retain 85% of affected customers within 24 hours.`,
        },
      ],
      'schedule': [
        {
          title: 'Policy Communication Gap',
          description: `Policy Confusion affects ${topSegment?.topics[0]?.volume || 8} ${topSegmentLabel} customers (${topSegment?.contribution || 54}% contribution). Schedule UX review within 24-48 hours. Conversion opportunity: ₹95K if resolved.`,
        },
        {
          title: 'Return Experience Optimization',
          description: `${secondSegment?.topics[0]?.volume || 7} Return Friction cases and ${topSegment?.topics[1]?.volume || 6} Offer Confusion incidents indicate checkout UX friction. Product Lead should prioritize return flow improvements.`,
        },
        {
          title: 'Cross-Sell Opportunity',
          description: `${quadrantTotal} customers in this quadrant have ₹2.1L annual cross-sell potential. Proactive outreach after issue resolution could capture this value within 30 days.`,
        },
      ],
      'delegate': [
        {
          title: 'Callback Queue Optimization',
          description: `Callback Pending affects ${topSegment?.topics[0]?.volume || 100} ${topSegmentLabel} customers (${topSegment?.contribution || 54}% contribution). Delegate to outbound team for batch processing. SLA breach risk: 4 hours.`,
        },
        {
          title: 'Last-Mile Delivery Issues',
          description: `${topSegment?.topics[1]?.volume || 90} Courier Delay cases and ${secondSegment?.topics[0]?.volume || 95} Address Issue tickets indicate logistics friction. Logistics Lead should coordinate with delivery partners.`,
        },
        {
          title: 'Operational Efficiency Gain',
          description: `${quadrantTotal} cases can be resolved through automated workflows. Delegation to specialized teams could reduce handling time by 60% and free up ₹45K in agent capacity.`,
        },
      ],
      'postpone': [
        {
          title: 'Product Feedback Collection',
          description: `Packaging Feedback from ${topSegment?.topics[0]?.volume || 350} ${topSegmentLabel} customers (${topSegment?.contribution || 50}% contribution). Log for quarterly product review. Enhancement opportunity for next release cycle.`,
        },
        {
          title: 'Feature Roadmap Input',
          description: `${topSegment?.topics[1]?.volume || 200} Feature Request submissions and ${secondSegment?.topics[0]?.volume || 290} UI Preference feedbacks collected. Product team should review for Q2 roadmap prioritization.`,
        },
        {
          title: 'Long-term Experience Investment',
          description: `${quadrantTotal} customers provided enhancement suggestions. Implementing top 3 requests could improve NPS by 8 points and reduce future contacts by 15%.`,
        },
      ],
    };

    return insightsByQuadrant[column];
  };

  interface ChannelData {
    channel: ChannelType;
    volume: number;
    percentage: number;
  }

  // Channel configuration
  const channelConfig: Record<ChannelType, { label: string; color: string }> = {
    email: { label: 'Email', color: '#3b82f6' }, // Blue
    chat: { label: 'Chat', color: '#10b981' }, // Green
    tickets: { label: 'Tickets', color: '#f59e0b' }, // Amber
    voice: { label: 'Voice', color: '#ef4444' }, // Red
    social: { label: 'Social', color: '#8b5cf6' }, // Purple
  };

  const channelOrder: ChannelType[] = ['email', 'chat', 'tickets', 'voice', 'social'];

  // Hardcoded segment distribution matching quadrant stats
  const segmentDistributionData: Record<PriorityColumn, Array<{
    segment: CustomerSegmentType;
    volume: number;
    contribution: number;
    topics: Array<{ 
      name: string; 
      volume: number; 
      percentage: number;
      channels: ChannelData[];
    }>;
  }>> = {
    'do-now': [
      {
        segment: 'value-conscious',
        volume: 7,
        contribution: 58,
        topics: [
          { 
            name: 'Payment Failure', 
            volume: 3, 
            percentage: 43,
            channels: [
              { channel: 'email', volume: 1, percentage: 33 },
              { channel: 'chat', volume: 1, percentage: 33 },
              { channel: 'tickets', volume: 0, percentage: 0 },
              { channel: 'voice', volume: 1, percentage: 33 },
              { channel: 'social', volume: 0, percentage: 0 },
            ]
          },
          { 
            name: 'Refund Delay', 
            volume: 2, 
            percentage: 29,
            channels: [
              { channel: 'email', volume: 0, percentage: 0 },
              { channel: 'chat', volume: 1, percentage: 50 },
              { channel: 'tickets', volume: 1, percentage: 50 },
              { channel: 'voice', volume: 0, percentage: 0 },
              { channel: 'social', volume: 0, percentage: 0 },
            ]
          },
          { 
            name: 'Delivery Miss', 
            volume: 2, 
            percentage: 29,
            channels: [
              { channel: 'email', volume: 1, percentage: 50 },
              { channel: 'chat', volume: 0, percentage: 0 },
              { channel: 'tickets', volume: 0, percentage: 0 },
              { channel: 'voice', volume: 0, percentage: 0 },
              { channel: 'social', volume: 1, percentage: 50 },
            ]
          },
        ],
      },
      {
        segment: 'tech-savvy',
        volume: 5,
        contribution: 42,
        topics: [
          { 
            name: 'Rider No-Show', 
            volume: 2, 
            percentage: 40,
            channels: [
              { channel: 'email', volume: 0, percentage: 0 },
              { channel: 'chat', volume: 1, percentage: 50 },
              { channel: 'tickets', volume: 0, percentage: 0 },
              { channel: 'voice', volume: 1, percentage: 50 },
              { channel: 'social', volume: 0, percentage: 0 },
            ]
          },
          { 
            name: 'Order Not-Placed', 
            volume: 2, 
            percentage: 40,
            channels: [
              { channel: 'email', volume: 1, percentage: 50 },
              { channel: 'chat', volume: 1, percentage: 50 },
              { channel: 'tickets', volume: 0, percentage: 0 },
              { channel: 'voice', volume: 0, percentage: 0 },
              { channel: 'social', volume: 0, percentage: 0 },
            ]
          },
          { 
            name: 'App Outage', 
            volume: 1, 
            percentage: 20,
            channels: [
              { channel: 'email', volume: 0, percentage: 0 },
              { channel: 'chat', volume: 0, percentage: 0 },
              { channel: 'tickets', volume: 0, percentage: 0 },
              { channel: 'voice', volume: 0, percentage: 0 },
              { channel: 'social', volume: 1, percentage: 100 },
            ]
          },
        ],
      },
    ],
    'schedule': [
      {
        segment: 'tech-savvy',
        volume: 19,
        contribution: 54,
        topics: [
          { 
            name: 'Policy Confusion', 
            volume: 8, 
            percentage: 42,
            channels: [
              { channel: 'email', volume: 3, percentage: 38 },
              { channel: 'chat', volume: 2, percentage: 25 },
              { channel: 'tickets', volume: 2, percentage: 25 },
              { channel: 'voice', volume: 1, percentage: 12 },
              { channel: 'social', volume: 0, percentage: 0 },
            ]
          },
          { 
            name: 'Offer Confusion', 
            volume: 6, 
            percentage: 32,
            channels: [
              { channel: 'email', volume: 2, percentage: 33 },
              { channel: 'chat', volume: 2, percentage: 33 },
              { channel: 'tickets', volume: 1, percentage: 17 },
              { channel: 'voice', volume: 0, percentage: 0 },
              { channel: 'social', volume: 1, percentage: 17 },
            ]
          },
          { 
            name: 'App UX Issues', 
            volume: 5, 
            percentage: 26,
            channels: [
              { channel: 'email', volume: 1, percentage: 20 },
              { channel: 'chat', volume: 2, percentage: 40 },
              { channel: 'tickets', volume: 1, percentage: 20 },
              { channel: 'voice', volume: 1, percentage: 20 },
              { channel: 'social', volume: 0, percentage: 0 },
            ]
          },
        ],
      },
      {
        segment: 'fashion-conscious',
        volume: 16,
        contribution: 46,
        topics: [
          { 
            name: 'Return Friction', 
            volume: 7, 
            percentage: 44,
            channels: [
              { channel: 'email', volume: 2, percentage: 29 },
              { channel: 'chat', volume: 3, percentage: 43 },
              { channel: 'tickets', volume: 1, percentage: 14 },
              { channel: 'voice', volume: 1, percentage: 14 },
              { channel: 'social', volume: 0, percentage: 0 },
            ]
          },
          { 
            name: 'Search Friction', 
            volume: 5, 
            percentage: 31,
            channels: [
              { channel: 'email', volume: 1, percentage: 20 },
              { channel: 'chat', volume: 2, percentage: 40 },
              { channel: 'tickets', volume: 1, percentage: 20 },
              { channel: 'voice', volume: 0, percentage: 0 },
              { channel: 'social', volume: 1, percentage: 20 },
            ]
          },
          { 
            name: 'Tracking Clarity', 
            volume: 4, 
            percentage: 25,
            channels: [
              { channel: 'email', volume: 1, percentage: 25 },
              { channel: 'chat', volume: 1, percentage: 25 },
              { channel: 'tickets', volume: 1, percentage: 25 },
              { channel: 'voice', volume: 1, percentage: 25 },
              { channel: 'social', volume: 0, percentage: 0 },
            ]
          },
        ],
      },
    ],
    'delegate': [
      {
        segment: 'fashion-conscious',
        volume: 270,
        contribution: 54,
        topics: [
          { 
            name: 'Callback Pending', 
            volume: 100, 
            percentage: 37,
            channels: [
              { channel: 'email', volume: 30, percentage: 30 },
              { channel: 'chat', volume: 25, percentage: 25 },
              { channel: 'tickets', volume: 20, percentage: 20 },
              { channel: 'voice', volume: 15, percentage: 15 },
              { channel: 'social', volume: 10, percentage: 10 },
            ]
          },
          { 
            name: 'Courier Delay', 
            volume: 90, 
            percentage: 33,
            channels: [
              { channel: 'email', volume: 25, percentage: 28 },
              { channel: 'chat', volume: 30, percentage: 33 },
              { channel: 'tickets', volume: 20, percentage: 22 },
              { channel: 'voice', volume: 10, percentage: 11 },
              { channel: 'social', volume: 5, percentage: 6 },
            ]
          },
          { 
            name: 'WISMO', 
            volume: 80, 
            percentage: 30,
            channels: [
              { channel: 'email', volume: 20, percentage: 25 },
              { channel: 'chat', volume: 25, percentage: 31 },
              { channel: 'tickets', volume: 20, percentage: 25 },
              { channel: 'voice', volume: 10, percentage: 12 },
              { channel: 'social', volume: 5, percentage: 6 },
            ]
          },
        ],
      },
      {
        segment: 'Home & Grocery shoppers',
        volume: 230,
        contribution: 46,
        topics: [
          { 
            name: 'Address Issue', 
            volume: 95, 
            percentage: 41,
            channels: [
              { channel: 'email', volume: 20, percentage: 21 },
              { channel: 'chat', volume: 30, percentage: 32 },
              { channel: 'tickets', volume: 25, percentage: 26 },
              { channel: 'voice', volume: 15, percentage: 16 },
              { channel: 'social', volume: 5, percentage: 5 },
            ]
          },
          { 
            name: 'Rider Behavior', 
            volume: 75, 
            percentage: 33,
            channels: [
              { channel: 'email', volume: 15, percentage: 20 },
              { channel: 'chat', volume: 20, percentage: 27 },
              { channel: 'tickets', volume: 20, percentage: 27 },
              { channel: 'voice', volume: 15, percentage: 20 },
              { channel: 'social', volume: 5, percentage: 7 },
            ]
          },
          { 
            name: 'Slot Reschedule', 
            volume: 60, 
            percentage: 26,
            channels: [
              { channel: 'email', volume: 10, percentage: 17 },
              { channel: 'chat', volume: 20, percentage: 33 },
              { channel: 'tickets', volume: 15, percentage: 25 },
              { channel: 'voice', volume: 10, percentage: 17 },
              { channel: 'social', volume: 5, percentage: 8 },
            ]
          },
        ],
      },
    ],
    'postpone': [
      {
        segment: 'value-conscious',
        volume: 730,
        contribution: 50,
        topics: [
          { 
            name: 'Packaging Feedback', 
            volume: 350, 
            percentage: 48,
            channels: [
              { channel: 'email', volume: 100, percentage: 29 },
              { channel: 'chat', volume: 80, percentage: 23 },
              { channel: 'tickets', volume: 70, percentage: 20 },
              { channel: 'voice', volume: 60, percentage: 17 },
              { channel: 'social', volume: 40, percentage: 11 },
            ]
          },
          { 
            name: 'Feature Request', 
            volume: 200, 
            percentage: 27,
            channels: [
              { channel: 'email', volume: 60, percentage: 30 },
              { channel: 'chat', volume: 50, percentage: 25 },
              { channel: 'tickets', volume: 40, percentage: 20 },
              { channel: 'voice', volume: 30, percentage: 15 },
              { channel: 'social', volume: 20, percentage: 10 },
            ]
          },
          { 
            name: 'Wishlist Ideas', 
            volume: 180, 
            percentage: 25,
            channels: [
              { channel: 'email', volume: 50, percentage: 28 },
              { channel: 'chat', volume: 45, percentage: 25 },
              { channel: 'tickets', volume: 35, percentage: 19 },
              { channel: 'voice', volume: 30, percentage: 17 },
              { channel: 'social', volume: 20, percentage: 11 },
            ]
          },
        ],
      },
      {
        segment: 'Home & Grocery shoppers',
        volume: 727,
        contribution: 50,
        topics: [
          { 
            name: 'UI Preference', 
            volume: 290, 
            percentage: 40,
            channels: [
              { channel: 'email', volume: 80, percentage: 28 },
              { channel: 'chat', volume: 70, percentage: 24 },
              { channel: 'tickets', volume: 60, percentage: 21 },
              { channel: 'voice', volume: 50, percentage: 17 },
              { channel: 'social', volume: 30, percentage: 10 },
            ]
          },
          { 
            name: 'Notification Noise', 
            volume: 260, 
            percentage: 36,
            channels: [
              { channel: 'email', volume: 70, percentage: 27 },
              { channel: 'chat', volume: 65, percentage: 25 },
              { channel: 'tickets', volume: 55, percentage: 21 },
              { channel: 'voice', volume: 45, percentage: 17 },
              { channel: 'social', volume: 25, percentage: 10 },
            ]
          },
          { 
            name: 'Feature Request', 
            volume: 177, 
            percentage: 24,
            channels: [
              { channel: 'email', volume: 50, percentage: 28 },
              { channel: 'chat', volume: 45, percentage: 25 },
              { channel: 'tickets', volume: 35, percentage: 20 },
              { channel: 'voice', volume: 30, percentage: 17 },
              { channel: 'social', volume: 17, percentage: 10 },
            ]
          },
        ],
      },
    ],
  };

  // Get customer segment distribution for detail view
  const getCustomerSegmentDistribution = (column: PriorityColumn) => {
    const segmentData = segmentDistributionData[column];
    
    return segmentData.map((seg) => ({
      segment: seg.segment,
      config: customerSegmentConfigs.find(s => s.id === seg.segment)!,
      volume: seg.volume,
      contribution: seg.contribution,
      topics: seg.topics,
    }));
  };

  const handleQuadrantClick = (column: PriorityColumn) => {
    setSelectedQuadrant(column);
    setActiveTab('summary');
  };

  const closePanel = () => {
    setSelectedQuadrant(null);
  };

  // Format number
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  // Segment labels for each quadrant (matching FCI theme)
  const quadrantSegmentLabels: Record<PriorityColumn, string[]> = {
    'do-now': ['Value', 'Tech'],
    'schedule': ['Tech', 'Fashion'],
    'delegate': ['Fashion', 'Home'],
    'postpone': ['Value', 'Home'],
  };

  // Segment colors for pills
  const segmentPillColors: Record<string, string> = {
    'Value': '#10b981',
    'Tech': '#06b6d4',
    'Fashion': '#f97316',
    'Home': '#ef4444',
  };

  // Quadrant Card Component
  const QuadrantCard = ({ column, isTopLeft }: { column: PriorityColumn; isTopLeft?: boolean }) => {
    const config = priorityColumns.find(c => c.id === column)!;
    const summary = getQuadrantSummary(column);
    const isHovered = hoveredQuadrant === column;
    const isSelected = selectedQuadrant === column;
    const segmentLabels = quadrantSegmentLabels[column];

    return (
      <div
        className={`relative rounded-xl p-5 cursor-pointer transition-all duration-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{
          backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF',
          border: `1px solid ${isSelected ? config.color : (isHovered ? config.color : (isDarkMode ? '#2a2a2a' : '#E5E5E5'))}`,
          boxShadow: isHovered || isSelected ? `0 4px 20px ${config.color}20` : 'none',
        }}
        onMouseEnter={() => setHoveredQuadrant(column)}
        onMouseLeave={() => setHoveredQuadrant(null)}
        onClick={() => handleQuadrantClick(column)}
      >
        {/* Sparkle icon for Do-Now */}
        {isTopLeft && (
          <div className="absolute top-4 left-4">
            <span className="text-sm">✨</span>
          </div>
        )}

        {/* Header with colored dot and title */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: config.color }}
          />
          <span 
            className="text-sm font-semibold"
            style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
          >
            {config.title} {config.subtitle && `- ${config.subtitle}`}
          </span>
        </div>

        {/* Large number */}
        <div className="text-center mb-2">
          <span 
            className="text-5xl font-bold"
            style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
          >
            {summary.contacts}
          </span>
        </div>

        {/* Percentage */}
        <div className="text-center mb-2">
          <span 
            className="text-lg"
            style={{ color: isDarkMode ? '#939394' : '#666666' }}
          >
            {summary.percentage < 1 ? summary.percentage.toFixed(1) : summary.percentage}%
          </span>
        </div>

        {/* Description */}
        <div className="text-center mb-3">
          <span 
            className="text-xs"
            style={{ color: isDarkMode ? '#939394' : '#666666' }}
          >
            {quadrantDescriptions[column]}
          </span>
        </div>

        {/* Segment pills */}
        <div className="flex items-center justify-center gap-2 mb-3">
          {segmentLabels.map((label) => (
            <span
              key={label}
              className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: `${segmentPillColors[label]}25`,
                color: segmentPillColors[label],
              }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Work on Top Priority button (only for Do-Now) */}
        {column === 'do-now' && (
          <button
            className="w-full py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-all hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, #c026d3 0%, #7c3aed 100%)',
              color: '#FFFFFF',
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleQuadrantClick(column);
            }}
          >
            <Target className="w-4 h-4" />
            Work on Top Priority
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div 
      className={`rounded-2xl p-6 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{
        backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF',
        border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`,
        boxShadow: isDarkMode 
          ? '0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
          : '0 4px 24px rgba(0, 0, 0, 0.06)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4" style={{ color: isDarkMode ? '#939394' : '#666666' }} />
            <span 
              className="text-lg font-bold"
              style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
            >
              Pain
            </span>
            <span className="text-lg" style={{ color: isDarkMode ? '#939394' : '#666666' }}>•</span>
            <span 
              className="text-lg font-bold"
              style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
            >
              Eisenhower Quadrant Distribution
            </span>
          </div>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:opacity-80"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
              color: '#FFFFFF',
            }}
          >
            <span>✨</span>
            AI Priority Analysis
          </button>
        </div>
      </div>

      {/* Subtitle */}
      <p className="text-xs mb-6" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
        Focus on critical items first • Pain cluster distribution across priority quadrants
      </p>

      {/* Main content area */}
      <div className="flex gap-4">
        {/* Left side - 2x2 Quadrant Grid */}
        <div 
          className={`transition-all duration-300 ${selectedQuadrant ? 'flex-[1.2]' : 'flex-1'}`}
          style={{
            backgroundColor: isDarkMode ? '#1a1a1a' : '#F8F9FA',
            borderRadius: '16px',
            padding: '16px',
            border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`,
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            {/* Do - Now (Top Left) */}
            <QuadrantCard column="do-now" isTopLeft />
            
            {/* Schedule - Later (Top Right) */}
            <QuadrantCard column="schedule" />
            
            {/* Delegate - Team (Bottom Left) */}
            <QuadrantCard column="delegate" />
            
            {/* Postpone (Bottom Right) */}
            <QuadrantCard column="postpone" />
          </div>
        </div>

        {/* Right side - Detail Panel */}
        {selectedQuadrant && (
          <div 
            className="flex-1 rounded-xl overflow-hidden flex flex-col animate-in slide-in-from-right duration-300"
            style={{
              backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF',
              border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`,
              minWidth: '520px',
              maxWidth: '580px',
            }}
          >
            {/* Panel Header */}
            <div 
              className="p-4 flex items-center justify-between shrink-0"
              style={{ borderBottom: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}` }}
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5" style={{ color: isDarkMode ? '#939394' : '#666666' }} />
                <div>
                  <h3 
                    className="text-base font-bold"
                    style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                  >
                    {priorityColumns.find(c => c.id === selectedQuadrant)!.title} - {priorityColumns.find(c => c.id === selectedQuadrant)!.subtitle}
                  </h3>
                  <p className="text-[10px]" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
                    {quadrantDescriptions[selectedQuadrant]}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span 
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: `${priorityColumns.find(c => c.id === selectedQuadrant)!.color}20`,
                    color: priorityColumns.find(c => c.id === selectedQuadrant)!.color,
                  }}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  {getQuadrantSummary(selectedQuadrant).contacts} cases
                </span>
                <button 
                  onClick={closePanel}
                  className="p-1.5 rounded-lg transition-colors hover:bg-black/10"
                >
                  <X className="w-4 h-4" style={{ color: isDarkMode ? '#939394' : '#666666' }} />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div 
              className="flex border-b shrink-0"
              style={{ borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5' }}
            >
              <button
                className={`flex-1 px-4 py-3 text-xs font-semibold transition-colors ${
                  activeTab === 'summary' ? 'border-b-2' : ''
                }`}
                style={{
                  color: activeTab === 'summary' ? '#f59e0b' : (isDarkMode ? '#939394' : '#666666'),
                  borderColor: activeTab === 'summary' ? '#f59e0b' : 'transparent',
                }}
                onClick={() => setActiveTab('summary')}
              >
                <span className="flex items-center justify-center gap-1.5">
                  <span>✨</span>
                  AI Summary
                </span>
              </button>
              <button
                className={`flex-1 px-4 py-3 text-xs font-semibold transition-colors ${
                  activeTab === 'details' ? 'border-b-2' : ''
                }`}
                style={{
                  color: activeTab === 'details' ? '#06b6d4' : (isDarkMode ? '#939394' : '#666666'),
                  borderColor: activeTab === 'details' ? '#06b6d4' : 'transparent',
                }}
                onClick={() => setActiveTab('details')}
              >
                <span className="flex items-center justify-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5" />
                  Details
                </span>
              </button>
            </div>

            {/* Tab Content */}
            <div 
              className="flex-1 overflow-y-auto p-4"
              style={{ 
                scrollbarWidth: 'thin',
                scrollbarColor: isDarkMode ? '#3a3a3a #1a1a1a' : '#d1d1d1 #f5f5f5'
              }}
            >
              {activeTab === 'summary' && (
                <div className="space-y-3">
                  {(() => {
                    const insightColors = ['#ec4899', '#f97316', '#eab308']; // Pink, Orange, Yellow
                    return getAIInsights(selectedQuadrant).map((insight, index) => (
                      <div 
                        key={index}
                        className="rounded-lg p-4 relative overflow-hidden"
                        style={{
                          backgroundColor: isDarkMode ? '#1a1a1a' : '#F8F9FA',
                          borderLeft: `3px solid ${insightColors[index]}`,
                        }}
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <span className="text-sm mt-0.5">✨</span>
                          <h4 
                            className="text-sm font-semibold"
                            style={{ color: insightColors[index] }}
                          >
                            {insight.title}
                          </h4>
                        </div>
                        <p 
                          className="text-xs leading-relaxed pl-6"
                          style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}
                        >
                          {insight.description}
                        </p>
                      </div>
                    ));
                  })()}
                </div>
              )}

              {activeTab === 'details' && (
                <div className="space-y-5" style={{ overflow: 'visible' }}>
                  {/* Segment Distribution Header */}
                  <div className="flex items-center gap-2 pl-1 mb-6 pb-2" style={{ borderBottom: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}` }}>
                    <BarChart3 className="w-4 h-4 shrink-0" style={{ color: isDarkMode ? '#939394' : '#666666' }} />
                    <span 
                      className="text-xs font-semibold uppercase"
                      style={{ color: isDarkMode ? '#939394' : '#666666' }}
                    >
                      Segment Distribution
                    </span>
                  </div>

                  {/* Centered Stacked Bar Chart with Y-axis */}
                  <div className="flex justify-center items-start px-2 pt-4 mt-2">
                    <div className="flex items-start justify-center" style={{ maxWidth: '600px', width: '100%' }}>
                      {(() => {
                        const segments = getCustomerSegmentDistribution(selectedQuadrant);
                        const maxVolume = Math.max(...segments.map(s => s.volume));
                        // Calculate Y-axis max to align with nice round numbers
                        const yAxisMax = Math.ceil(maxVolume / 100) * 100;
                        // Create evenly spaced ticks that align with the scale
                        const chartHeight = 176; // h-44 = 176px
                        const yAxisTicks = [0, Math.round(yAxisMax * 0.25), Math.round(yAxisMax * 0.5), Math.round(yAxisMax * 0.75), yAxisMax];
                        // Topic colors matching legend: Topic 1 (Red), Topic 2 (Orange), Topic 3 (Yellow)
                        // With flex-col-reverse: Topic 1 at bottom, Topic 2 in middle, Topic 3 at top
                        const topicColors = ['#ef4444', '#f97316', '#eab308']; // Red, Orange, Yellow
                        
                        return (
                          <div className="flex items-start w-full pt-2 relative">
                            {/* Y-axis */}
                            <div className="relative h-44 pr-4 text-right shrink-0" style={{ minWidth: '45px' }}>
                              {yAxisTicks.map((tick, i) => {
                                // Calculate exact position for each tick based on the scale
                                const tickPosition = (tick / yAxisMax) * chartHeight;
                                return (
                                  <span 
                                    key={i}
                                    className="absolute text-[10px] leading-none transform -translate-y-1/2"
                                    style={{ 
                                      color: isDarkMode ? '#939394' : '#666666',
                                      bottom: `${tickPosition}px`,
                                      right: '0',
                                    }}
                                  >
                                    {tick}
                                  </span>
                                );
                              })}
                            </div>
                            
                            {/* Bars - Centered: Segments with Topics Stacked */}
                            <div className="flex-1 flex flex-col pl-4 relative" style={{ borderColor: isDarkMode ? '#3a3a3a' : '#e5e5e5' }}>
                              {/* Chart area with border */}
                              <div className="relative border-l border-b" style={{ height: `${chartHeight}px`, width: '100%', borderColor: isDarkMode ? '#3a3a3a' : '#e5e5e5' }}>
                                {/* Grid lines for Y-axis alignment */}
                                {yAxisTicks.map((tick, i) => {
                                  const tickPosition = (tick / yAxisMax) * chartHeight;
                                  return (
                                    <div
                                      key={`grid-${i}`}
                                      className="absolute left-0 right-0 border-t"
                                      style={{
                                        bottom: `${tickPosition}px`,
                                        borderColor: isDarkMode ? '#2a2a2a' : '#e5e5e5',
                                        borderStyle: 'dashed',
                                        borderWidth: '1px',
                                        pointerEvents: 'none',
                                      }}
                                    />
                                  );
                                })}
                                
                                {/* Bars container - aligned to bottom (baseline) */}
                                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-8" style={{ height: `${chartHeight}px` }}>
                                  {segments.map((seg) => {
                                    // Calculate bar height based on the scale
                                    const barHeight = (seg.volume / yAxisMax) * chartHeight;
                                    
                                    return (
                                      <div key={seg.segment} className="flex flex-col items-center relative z-10" style={{ flex: '1 1 0', minWidth: '60px', maxWidth: '100px' }}>
                                        {/* Value label on top */}
                                        <span 
                                          className="text-xs font-bold mb-1.5 absolute -top-5"
                                          style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                                        >
                                          {seg.volume}
                                        </span>
                                        
                                        {/* Stacked bar with topic colors - starts from baseline */}
                                        <div 
                                          className="w-16 rounded-t overflow-hidden flex flex-col-reverse transition-all duration-500"
                                          style={{ height: `${barHeight}px`, minHeight: '4px' }}
                                        >
                                          {seg.topics.map((topic, i) => {
                                            const topicHeight = (topic.volume / seg.volume) * 100;
                                            return (
                                              <div
                                                key={i}
                                                className="w-full"
                                                style={{
                                                  height: `${topicHeight}%`,
                                                  backgroundColor: topicColors[i] || topicColors[2],
                                                }}
                                              />
                                            );
                                          })}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                              
                              {/* Segment labels below the baseline */}
                              <div className="flex items-center justify-center gap-8 mt-2">
                                {segments.map((seg) => (
                                  <div key={seg.segment} className="flex flex-col items-center" style={{ flex: '1 1 0', minWidth: '60px', maxWidth: '100px' }}>
                                    <span 
                                      className="text-[10px] font-medium"
                                      style={{ color: seg.config.color }}
                                    >
                                      {seg.config.shortLabel}
                                    </span>
                                    <span 
                                      className="text-[9px] mt-0.5"
                                      style={{ color: isDarkMode ? '#939394' : '#666666' }}
                                    >
                                      {seg.contribution}%
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Legend - Topics (Below Plot) */}
                  <div className="flex items-center justify-center gap-6 mt-5">
                    {(() => {
                      const topicColors = ['#ef4444', '#f97316', '#eab308']; // Red, Orange, Yellow
                      return ['Topic 1', 'Topic 2', 'Topic 3'].map((label, i) => (
                        <div key={label} className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: topicColors[i] }} />
                          <span className="text-[10px]" style={{ color: isDarkMode ? '#939394' : '#666666' }}>{label}</span>
                        </div>
                      ));
                    })()}
                  </div>

                  {/* Segments with Topic Pills */}
                  <div className="space-y-5 mt-8">
                    {(() => {
                      const segments = getCustomerSegmentDistribution(selectedQuadrant);
                      const topicColors = ['#ef4444', '#f97316', '#eab308']; // Red, Orange, Yellow - matching legend
                      
                      return segments.map((seg) => {
                        return (
                          <div key={seg.segment} className="space-y-2.5">
                            {/* Segment Header with Warning Icon */}
                            <div className="flex items-center gap-2">
                              <span className="text-orange-500 text-xs">▲</span>
                              <span 
                                className="text-xs font-semibold"
                                style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                              >
                                {seg.config.label}
                              </span>
                            </div>

                            {/* Topic Pills for this Segment */}
                            <div className="flex items-center gap-2 flex-wrap pl-4 relative" style={{ overflow: 'visible' }}>
                              {seg.topics.map((topic, topicIndex) => {
                                // Calculate channel distribution for this specific topic
                                const channelPercentages: Record<ChannelType, number> = {
                                  email: topic.volume > 0 ? Math.round((topic.channels.find(c => c.channel === 'email')?.volume || 0) / topic.volume * 100) : 0,
                                  chat: topic.volume > 0 ? Math.round((topic.channels.find(c => c.channel === 'chat')?.volume || 0) / topic.volume * 100) : 0,
                                  tickets: topic.volume > 0 ? Math.round((topic.channels.find(c => c.channel === 'tickets')?.volume || 0) / topic.volume * 100) : 0,
                                  voice: topic.volume > 0 ? Math.round((topic.channels.find(c => c.channel === 'voice')?.volume || 0) / topic.volume * 100) : 0,
                                  social: topic.volume > 0 ? Math.round((topic.channels.find(c => c.channel === 'social')?.volume || 0) / topic.volume * 100) : 0,
                                };

                                const isHovered = hoveredSegmentPill?.segment === seg.segment && hoveredSegmentPill?.topicIndex === topicIndex;
                                const topicColor = topicColors[topicIndex] || topicColors[2]; // Use legend colors

                                return (
                                  <div 
                                    key={topicIndex} 
                                    className="relative"
                                    onMouseEnter={() => setHoveredSegmentPill({ segment: seg.segment, topicIndex })}
                                    onMouseLeave={() => setHoveredSegmentPill(null)}
                                  >
                                    {/* Pill with Topic Name */}
                                    <div
                                      className="flex items-center gap-1 px-2 py-1 rounded-full cursor-pointer transition-all duration-200"
                                      style={{
                                        backgroundColor: isHovered ? `${topicColor}20` : (isDarkMode ? '#1e293b' : '#f1f5f9'),
                                        border: `1px solid ${isHovered ? topicColor : (isDarkMode ? '#3a3a3a' : '#e2e8f0')}`,
                                      }}
                                    >
                                      {/* Target Icon */}
                                      <Target 
                                        className="w-2.5 h-2.5"
                                        style={{ color: topicColor }}
                                      />
                                      <span 
                                        className="text-[9px] font-semibold"
                                        style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                                      >
                                        {topic.name}
                                      </span>
                                    </div>

                                    {/* Channel Distribution Tooltip on Hover */}
                                    {isHovered && (
                                      <div 
                                        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-100 px-3 py-2 rounded-lg shadow-lg min-w-[180px] pointer-events-none"
                                        style={{ 
                                          backgroundColor: isDarkMode ? '#1e293b' : '#1e293b',
                                          color: '#ffffff',
                                          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                                        }}
                                        onMouseEnter={(e) => e.stopPropagation()}
                                      >
                                        {/* Topic Name and Volume */}
                                        <div className="flex items-center justify-between mb-2 pb-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
                                          <span className="text-[10px] font-semibold" style={{ color: '#ffffff' }}>
                                            {topic.name}
                                          </span>
                                          <span 
                                            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                            style={{ 
                                              backgroundColor: topicColor,
                                              color: '#FFFFFF'
                                            }}
                                          >
                                            {topic.volume}
                                          </span>
                                        </div>
                                        <div className="text-[10px] font-semibold mb-2 text-center" style={{ color: '#ffffff' }}>
                                          Channel Distribution
                                        </div>
                                        <div className="space-y-1">
                                          {channelOrder.map((channelType) => {
                                            const percentage = channelPercentages[channelType];
                                            if (percentage === 0) return null;
                                            
                                            return (
                                              <div key={channelType} className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-1.5">
                                                  <div 
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: channelConfig[channelType].color }}
                                                  />
                                                  <span className="text-[9px] font-medium" style={{ color: '#ffffff' }}>
                                                    {channelConfig[channelType].label}
                                                  </span>
                                                </div>
                                                <span className="text-[9px] font-bold" style={{ color: '#ffffff' }}>
                                                  {percentage}%
                                                </span>
                                              </div>
                                            );
                                          })}
                                        </div>
                                        {/* Arrow pointing down */}
                                        <div 
                                          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-3"
                                          style={{ 
                                            borderLeftColor: 'transparent',
                                            borderRightColor: 'transparent',
                                            borderTopColor: isDarkMode ? '#1e293b' : '#1e293b',
                                          }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      });
                    })()}
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
