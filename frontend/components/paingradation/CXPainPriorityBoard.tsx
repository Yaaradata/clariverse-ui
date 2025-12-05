'use client';

import { useState, useEffect } from 'react';
import {
  Sparkles, X, BarChart3, TrendingUp, ChevronRight, Zap,
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
type CustomerSegmentType = 'value-conscious' | 'tech-savvy' | 'fashion-conscious' | 'home';

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
  { id: 'home', label: 'Home', shortLabel: 'Home', color: '#ef4444' },
];

// Map quadrants to their customer segment types
const quadrantCustomerSegments: Record<PriorityColumn, CustomerSegmentType[]> = {
  'do-now': ['value-conscious', 'tech-savvy'],
  'schedule': ['tech-savvy', 'fashion-conscious'],
  'delegate': ['fashion-conscious', 'home'],
  'postpone': ['value-conscious', 'home'],
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

  // Get quadrant summary
  const getQuadrantSummary = (column: PriorityColumn) => {
    const clusters = clustersByPriority[column];
    const contacts = clusters.reduce((sum, c) => sum + c.contacts, 0);
    const percentage = totalContacts > 0 ? Math.round((contacts / totalContacts) * 100) : 0;
    return { count: clusters.length, contacts, percentage };
  };

  // Generate AI insights for a quadrant
  const getAIInsights = (column: PriorityColumn) => {
    const clusters = clustersByPriority[column];
    if (clusters.length === 0) return [];

    const config = priorityColumns.find(c => c.id === column)!;
    const topCluster = clusters[0];
    const totalContacts = clusters.reduce((sum, c) => sum + c.contacts, 0);
    const avgNegSentiment = Math.round(clusters.reduce((sum, c) => sum + c.metrics.negativeSentimentPercent, 0) / clusters.length);

    const insights = [
      {
        title: `${topCluster.title} Analysis`,
        description: `${topCluster.title} affects ${(topCluster.contacts / 1000).toFixed(1)}K contacts (${Math.round((topCluster.contacts / totalContacts) * 100)}% contribution). ${column === 'do-now' ? 'Immediate action required within 24 hours.' : column === 'schedule' ? 'Schedule review within 24-48 hours.' : column === 'delegate' ? 'Delegate to specialized team.' : 'Monitor and review next sprint.'} Resolution opportunity: ${topCluster.metrics.refundCancelRate}% refund reduction.`,
      },
      {
        title: 'Operational Efficiency Opportunity',
        description: `${clusters.length} pain clusters with ${avgNegSentiment}% average negative sentiment indicate ${column === 'do-now' || column === 'delegate' ? 'urgent' : 'planned'} optimization needs. ${config.title} Lead should prioritize ${topCluster.journeyStage.toLowerCase()} handling improvements.`,
      },
      {
        title: 'Customer Impact Assessment',
        description: `${(totalContacts / 1000).toFixed(1)}K customers in this quadrant have significant experience friction. Proactive outreach after issue resolution could improve NPS within 30 days.`,
      },
    ];

    return insights;
  };

  // Get customer segment distribution for detail view
  const getCustomerSegmentDistribution = (column: PriorityColumn) => {
    const clusters = clustersByPriority[column];
    const segments = quadrantCustomerSegments[column];
    const totalContacts = clusters.reduce((sum, c) => sum + c.contacts, 0);

    // Distribute clusters among customer segments
    const distribution = segments.map((segmentId, index) => {
      const segmentClusters = clusters.filter((_, i) => i % segments.length === index);
      const segmentContacts = segmentClusters.reduce((sum, c) => sum + c.contacts, 0);
      const contribution = totalContacts > 0 ? Math.round((segmentContacts / totalContacts) * 100) : 0;

      // Get top 3 topics for this segment
      const topTopics = segmentClusters.slice(0, 3).map((cluster, i) => ({
        name: cluster.title,
        volume: cluster.contacts,
        percentage: Math.round(85 - (i * 10) + Math.random() * 10), // Simulate percentage
      }));

      return {
        segment: segmentId,
        config: customerSegmentConfigs.find(s => s.id === segmentId)!,
        volume: segmentContacts,
        contribution,
        topics: topTopics,
      };
    });

    return distribution;
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

  // Quadrant Card Component
  const QuadrantCard = ({ column, isTopLeft }: { column: PriorityColumn; isTopLeft?: boolean }) => {
    const config = priorityColumns.find(c => c.id === column)!;
    const summary = getQuadrantSummary(column);
    const isHovered = hoveredQuadrant === column;
    const isSelected = selectedQuadrant === column;
    const segments = quadrantCustomerSegments[column];

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
            <Sparkles className="w-4 h-4" style={{ color: '#f59e0b' }} />
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
            {summary.contacts > 0 ? formatNumber(summary.contacts) : summary.count}
          </span>
        </div>

        {/* Percentage */}
        <div className="text-center mb-2">
          <span 
            className="text-lg"
            style={{ color: isDarkMode ? '#939394' : '#666666' }}
          >
            {summary.percentage}%
          </span>
        </div>

        {/* Description */}
        <div className="text-center mb-4">
          <span 
            className="text-xs"
            style={{ color: isDarkMode ? '#939394' : '#666666' }}
          >
            {quadrantDescriptions[column]}
          </span>
        </div>

        {/* Customer segment pills */}
        <div className="flex items-center justify-center gap-2 mb-3">
          {segments.map((segment) => {
            const segConfig = customerSegmentConfigs.find(s => s.id === segment)!;
            return (
              <span
                key={segment}
                className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: `${segConfig.color}25`,
                  color: segConfig.color,
                }}
              >
                {segConfig.shortLabel}
              </span>
            );
          })}
        </div>

        {/* Work on Top Priority button (only for Do-Now) */}
        {column === 'do-now' && (
          <button
            className="w-full py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-all hover:opacity-90"
            style={{
              background: `linear-gradient(135deg, ${config.color} 0%, ${config.color}dd 100%)`,
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
            <Sparkles className="w-3.5 h-3.5" />
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
              className="p-4 flex items-center justify-between flex-shrink-0"
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
                  {formatNumber(getQuadrantSummary(selectedQuadrant).contacts)} contacts
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
              className="flex border-b flex-shrink-0"
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
                  <Sparkles className="w-3.5 h-3.5" />
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
                <div className="space-y-4">
                  {getAIInsights(selectedQuadrant).map((insight, index) => (
                    <div 
                      key={index}
                      className="rounded-xl p-4"
                      style={{
                        backgroundColor: isDarkMode ? '#0d0d0d' : '#F8F9FA',
                        border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`,
                      }}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#f59e0b' }} />
                        <h4 
                          className="text-sm font-semibold"
                          style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
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
                  ))}
                </div>
              )}

              {activeTab === 'details' && (
                <div className="space-y-5">
                  {/* Segment Distribution Header */}
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" style={{ color: isDarkMode ? '#939394' : '#666666' }} />
                    <span 
                      className="text-xs font-semibold uppercase"
                      style={{ color: isDarkMode ? '#939394' : '#666666' }}
                    >
                      Segment Distribution
                    </span>
                  </div>

                  {/* Stacked Bar Chart */}
                  <div className="flex gap-6">
                    {/* Chart */}
                    <div className="flex-1">
                      <div className="h-48 flex items-end gap-4 justify-center">
                        {getCustomerSegmentDistribution(selectedQuadrant).map((seg, index) => {
                          const maxHeight = 180;
                          const height = Math.max(20, (seg.contribution / 100) * maxHeight);
                          
                          return (
                            <div key={seg.segment} className="flex flex-col items-center gap-2">
                              {/* Value label */}
                              <span 
                                className="text-xs font-semibold"
                                style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                              >
                                {formatNumber(seg.volume)}
                              </span>
                              
                              {/* Bar with gradient sections */}
                              <div 
                                className="w-20 rounded-t-lg overflow-hidden flex flex-col-reverse transition-all duration-500"
                                style={{ height: `${height}px` }}
                              >
                                {seg.topics.map((topic, i) => (
                                  <div
                                    key={i}
                                    className="w-full"
                                    style={{
                                      height: `${100 / Math.max(seg.topics.length, 1)}%`,
                                      backgroundColor: i === 0 ? seg.config.color : 
                                        i === 1 ? `${seg.config.color}cc` : `${seg.config.color}88`,
                                    }}
                                  />
                                ))}
                              </div>
                              
                              {/* Segment label */}
                              <span 
                                className="text-[10px] font-medium"
                                style={{ color: seg.config.color }}
                              >
                                {seg.config.shortLabel}
                              </span>
                              <span 
                                className="text-[9px]"
                                style={{ color: isDarkMode ? '#939394' : '#666666' }}
                              >
                                {seg.contribution}%
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Legend - Customer Segments */}
                      <div className="flex items-center justify-center gap-4 mt-4">
                        {quadrantCustomerSegments[selectedQuadrant].map((segId) => {
                          const segConfig = customerSegmentConfigs.find(s => s.id === segId)!;
                          return (
                            <div key={segId} className="flex items-center gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: segConfig.color }} />
                              <span className="text-[10px]" style={{ color: isDarkMode ? '#939394' : '#666666' }}>{segConfig.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Customer Segment Details */}
                    <div className="flex-1 space-y-5 min-w-[280px]">
                      {getCustomerSegmentDistribution(selectedQuadrant).map((seg) => (
                        <div key={seg.segment}>
                          {/* Segment header */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: seg.config.color }}
                              />
                              <span 
                                className="text-sm font-bold"
                                style={{ color: seg.config.color }}
                              >
                                {seg.config.label}
                              </span>
                            </div>
                            <span 
                              className="text-sm font-semibold"
                              style={{ color: seg.config.color }}
                            >
                              {seg.contribution}%
                            </span>
                          </div>
                          
                          {/* Volume and contribution */}
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-xs" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
                              Volume: <span className="font-medium" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>{formatNumber(seg.volume)}</span>
                            </span>
                            <span className="text-xs" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
                              Contribution: <span className="font-semibold">{seg.contribution}%</span>
                            </span>
                          </div>

                          {/* Top topics */}
                          <div className="space-y-2">
                            {seg.topics.map((topic, i) => (
                              <div 
                                key={i} 
                                className="flex items-center gap-3 py-1.5 px-2 rounded-lg"
                                style={{ backgroundColor: isDarkMode ? '#0d0d0d' : '#F5F5F5' }}
                              >
                                <span 
                                  className="text-[10px] w-5 h-5 flex items-center justify-center font-bold rounded"
                                  style={{ 
                                    backgroundColor: `${seg.config.color}20`,
                                    color: seg.config.color 
                                  }}
                                >
                                  {i + 1}
                                </span>
                                <span 
                                  className="text-xs flex-1"
                                  style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}
                                >
                                  {topic.name}
                                </span>
                                <span 
                                  className="text-xs font-medium w-10 text-right"
                                  style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                                >
                                  {formatNumber(topic.volume)}
                                </span>
                                {/* Progress bar */}
                                <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: isDarkMode ? '#2a2a2a' : '#E5E5E5' }}>
                                  <div 
                                    className="h-full rounded-full"
                                    style={{ 
                                      width: `${topic.percentage}%`,
                                      backgroundColor: seg.config.color 
                                    }}
                                  />
                                </div>
                                <span 
                                  className="text-xs font-semibold w-10 text-right"
                                  style={{ color: seg.config.color }}
                                >
                                  {topic.percentage}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Stats */}
            <div 
              className="p-4 flex-shrink-0 grid grid-cols-3 gap-4"
              style={{ 
                borderTop: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`,
                backgroundColor: isDarkMode ? '#0d0d0d' : '#F8F9FA'
              }}
            >
              <div className="text-center">
                <p className="text-[10px] mb-1" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
                  Total Contacts
                </p>
                <p 
                  className="text-xl font-bold"
                  style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                >
                  {formatNumber(getQuadrantSummary(selectedQuadrant).contacts)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-[10px] mb-1" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
                  Distribution
                </p>
                <p 
                  className="text-xl font-bold"
                  style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                >
                  {getQuadrantSummary(selectedQuadrant).percentage}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-[10px] mb-1" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
                  Active Clusters
                </p>
                <p 
                  className="text-xl font-bold"
                  style={{ color: priorityColumns.find(c => c.id === selectedQuadrant)!.color }}
                >
                  {clustersByPriority[selectedQuadrant].length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
