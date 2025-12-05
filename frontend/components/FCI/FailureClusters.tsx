'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip, Legend } from 'recharts';
import { FCICluster } from '@/lib/fci-lib/fciData';
import { TrendingUp, TrendingDown, X, Users, Clock, MessageSquare, Mail, MessageCircle, Ticket, Phone, Share2, Sparkles, AlertTriangle, Lightbulb } from 'lucide-react';

interface FailureClustersProps {
  clusters: FCICluster[];
  isDarkMode?: boolean;
}

// Fixed channel order for consistent stacking
const CHANNEL_ORDER = ['Voice', 'Chat', 'Email', 'Social Media', 'Ticket'];

// Channel colors for stacked bars (matching severity theme)
const CHANNEL_COLORS: Record<string, string> = {
  'Voice': '#ef4444',        // Red
  'Chat': '#f97316',         // Orange
  'Email': '#eab308',        // Yellow
  'Social Media': '#22c55e', // Green
  'Ticket': '#06b6d4' // Cyan
};

// Custom bar shape that only curves the topmost segment
const CustomBar = (props: any) => {
  const { x, y, width, height, fill, payload, dataKey, viewMode } = props;
  
  if (!payload || height <= 0) return null;
  
  // Determine which items to check based on view mode
  const itemsToCheck = viewMode === 'customerSegment' 
    ? CUSTOMER_SEGMENTS
    : CHANNEL_ORDER;
  
  // Find the topmost item for this bar (last item with value > 0 in order)
  let topItem = '';
  for (let i = itemsToCheck.length - 1; i >= 0; i--) {
    const item = itemsToCheck[i];
    if (payload[item] && payload[item] > 0) {
      topItem = item;
      break;
    }
  }
  
  // Only apply radius if this is the top item
  const isTop = dataKey === topItem;
  const radius = isTop ? 6 : 0;
  
  if (isTop) {
    // Draw bar with rounded top corners
    return (
      <path
        d={`
          M ${x},${y + radius}
          Q ${x},${y} ${x + radius},${y}
          L ${x + width - radius},${y}
          Q ${x + width},${y} ${x + width},${y + radius}
          L ${x + width},${y + height}
          L ${x},${y + height}
          Z
        `}
        fill={fill}
      />
    );
  }
  
  // Regular rectangle for non-top bars
  return (
    <rect x={x} y={y} width={width} height={height} fill={fill} />
  );
};

// Channel breakdown colors
const BREAKDOWN_CHANNEL_COLORS: Record<string, string> = {
  'Email': '#eab308',        // Yellow
  'Chat': '#f97316',         // Orange
  'Ticket': '#22c55e',       // Green
  'Voice': '#a855f7',        // Purple
  'Social': '#06b6d4'        // Cyan
};

// Channel icons
const getChannelIcon = (channel: string) => {
  switch (channel) {
    case 'Email': return Mail;
    case 'Chat': return MessageCircle;
    case 'Ticket': return Ticket;
    case 'Voice': return Phone;
    case 'Social': return Share2;
    default: return MessageCircle;
  }
};

// Generate AI Insight based on cluster data
const generateAIInsight = (cluster: FCICluster): string => {
  const trendDirection = cluster.trend > 0 ? 'increased' : 'decreased';
  const trendPercent = Math.abs(cluster.trend);
  
  if (cluster.processError && cluster.processError > 60) {
    return `Failures ${trendDirection} by ${trendPercent}% due to system and process issues. ${cluster.processError}% of cases stem from process errors, indicating need for workflow optimization in ${cluster.category.toLowerCase()}.`;
  }
  
  if (cluster.productKnowledgeGap && cluster.productKnowledgeGap > 60) {
    const topChannel = cluster.topChannels?.[0]?.channel || 'voice';
    return `Score dropped ${trendPercent}% due to knowledge gaps. Focus on agent training for ${cluster.category.toLowerCase()} protocols, especially on ${topChannel.toLowerCase()} channel.`;
  }
  
  if (cluster.trend > 10) {
    return `Alert: ${cluster.category} failures spiked ${trendPercent}% affecting ${cluster.affectedCustomers.toLocaleString()} customers. Primary driver: ${cluster.processError && cluster.processError > cluster.productKnowledgeGap! ? 'process errors' : 'knowledge gaps'}.`;
  }
  
  return `${cluster.category} shows ${trendPercent}% ${trendDirection} trend with ${cluster.count.toLocaleString()} cases. Resolution time averaging ${cluster.avgResolutionTime || 'N/A'} across ${cluster.totalInteractions?.toLocaleString() || 0} interactions.`;
};

// Generate Recommendation based on cluster data
const generateRecommendation = (cluster: FCICluster): string => {
  const topChannel = cluster.topChannels?.[0]?.channel || 'voice';
  
  if (cluster.processError && cluster.processError > 60) {
    return `Consider automating ${cluster.category.toLowerCase()} workflows on ${topChannel.toLowerCase()} channel to reduce manual review backlog by up to ${Math.round(cluster.processError * 0.5)}%.`;
  }
  
  if (cluster.productKnowledgeGap && cluster.productKnowledgeGap > 50) {
    return `Implement targeted training program for ${topChannel.toLowerCase()} agents on ${cluster.category.toLowerCase()}. Expected FCI reduction: ${Math.round(cluster.productKnowledgeGap * 0.3)}%.`;
  }
  
  return `Deploy proactive monitoring for ${cluster.category.toLowerCase()} with automated escalation for cases exceeding ${cluster.avgResolutionTime || '2 hours'} resolution time.`;
};

// Detail Card Component for selected cluster
const ClusterDetailCard = ({ 
  cluster, 
  isDarkMode, 
  onClose 
}: { 
  cluster: FCICluster; 
  isDarkMode: boolean; 
  onClose: () => void;
}) => {
  const getSeverityColor = (severity: string) => {
    if (severity === 'High Impact') return '#ef4444';  // Red
    if (severity === 'Medium') return '#f97316';       // Orange
    return '#22c55e';                                   // Green for Low
  };

  return (
    <div
      className="rounded-xl p-4 h-full flex flex-col animate-in slide-in-from-right-4 duration-300 overflow-y-auto"
      style={{
        backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF',
        border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`,
        boxShadow: isDarkMode 
          ? '0 4px 24px rgba(0, 0, 0, 0.4)'
          : '0 4px 24px rgba(0, 0, 0, 0.08)'
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h4 className="font-bold text-base" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
              {cluster.category}
            </h4>
            <span
              className="px-2 py-1 rounded text-xs font-bold text-white"
              style={{ backgroundColor: getSeverityColor(cluster.severity) }}
            >
              {cluster.severity}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span 
              className="text-2xl font-bold"
              style={{ color: getSeverityColor(cluster.severity) }}
            >
              {cluster.count.toLocaleString()}
            </span>
            <span className="text-sm" style={{ color: '#939394' }}>cases</span>
            <div 
              className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold"
              style={{ 
                color: cluster.trend > 0 ? '#ef4444' : '#22c55e',
                backgroundColor: cluster.trend > 0 ? '#ef444415' : '#22c55e15'
              }}
            >
              {cluster.trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {cluster.trend > 0 ? '+' : ''}{cluster.trend}%
            </div>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-black/10 transition-colors"
        >
          <X className="w-4 h-4" style={{ color: '#939394' }} />
        </button>
      </div>

      {/* Metrics Grid - 3 Columns */}
      <div 
        className="grid grid-cols-3 gap-4 p-4 rounded-lg mb-4"
        style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5' }}
      >
        {/* Row 1 */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg" style={{ backgroundColor: '#5332FF20' }}>
            <MessageSquare className="w-4 h-4" style={{ color: '#5332FF' }} />
          </div>
          <div>
            <p className="text-xs" style={{ color: '#939394' }}>Total Interactions</p>
            <p className="text-sm font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
              {cluster.totalInteractions ? cluster.totalInteractions.toLocaleString() : 'N/A'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg" style={{ backgroundColor: '#f59e0b20' }}>
            <Clock className="w-4 h-4" style={{ color: '#f59e0b' }} />
          </div>
          <div>
            <p className="text-xs" style={{ color: '#939394' }}>Avg Resolution</p>
            <p className="text-sm font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
              {cluster.avgResolutionTime || 'N/A'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg" style={{ backgroundColor: '#f9731620' }}>
            <Lightbulb className="w-4 h-4" style={{ color: '#f97316' }} />
          </div>
          <div>
            <p className="text-xs" style={{ color: '#939394' }}>Knowledge Gap</p>
            <p className="text-sm font-bold" style={{ color: '#f97316' }}>
              {cluster.productKnowledgeGap || 0}%
            </p>
          </div>
        </div>
        
        {/* Row 2 */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg" style={{ backgroundColor: '#ef444420' }}>
            <Users className="w-4 h-4" style={{ color: '#ef4444' }} />
          </div>
          <div>
            <p className="text-xs" style={{ color: '#939394' }}>Customers Affected</p>
            <p className="text-sm font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
              {cluster.affectedCustomers.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg" style={{ backgroundColor: '#ef444420' }}>
            <AlertTriangle className="w-4 h-4" style={{ color: '#ef4444' }} />
          </div>
          <div>
            <p className="text-xs" style={{ color: '#939394' }}>Process Error</p>
            <p className="text-sm font-bold" style={{ color: '#ef4444' }}>
              {cluster.processError || 0}%
            </p>
          </div>
        </div>
        <div /> {/* Empty cell for alignment */}
      </div>

      {/* AI Insight Card */}
      <div 
        className="rounded-xl p-4 mb-3"
        style={{ 
          background: isDarkMode 
            ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(30, 30, 30, 0.9) 100%)'
            : 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(255, 255, 255, 0.9) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.3)'
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4" style={{ color: '#f59e0b' }} />
          <span className="text-xs font-bold uppercase" style={{ color: '#f59e0b' }}>
            AI Insight
          </span>
        </div>
        <p className="text-sm" style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}>
          {generateAIInsight(cluster)}
        </p>
      </div>

      {/* Recommendation Card */}
      <div 
        className="rounded-xl p-4 mb-4"
        style={{ 
          background: isDarkMode 
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(30, 30, 30, 0.9) 100%)'
            : 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(255, 255, 255, 0.9) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)'
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4" style={{ color: '#10b981' }} />
          <span className="text-xs font-bold uppercase" style={{ color: '#10b981' }}>
            Recommendation
          </span>
        </div>
        <p className="text-sm" style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}>
          {cluster.nextActionSuggestion || generateRecommendation(cluster)}
        </p>
      </div>

      {/* Dominant Topics */}
      {cluster.topics && Array.isArray(cluster.topics) && cluster.topics.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold mb-2 uppercase" style={{ color: '#939394' }}>
            Dominant Topics
          </p>
          <div className="flex flex-wrap gap-2">
            {cluster.topics.map((topic: string, idx: number) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded text-xs"
                style={{
                  backgroundColor: isDarkMode ? '#2a2a2a' : '#E5E5E5',
                  color: isDarkMode ? '#D6D9D8' : '#4a4a4a'
                }}
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

// Custom Tooltip for stacked bars
const CustomStackedTooltip = ({ active, payload, label, isDarkMode }: any) => {
  if (!active || !payload || !payload.length) return null;
  
  return (
    <div
      className="p-3 rounded-lg shadow-lg"
      style={{
        backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF',
        border: `1px solid ${isDarkMode ? '#3a3a3a' : '#E5E5E5'}`
      }}
    >
      <p className="text-sm font-bold mb-2" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
        {label}
      </p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 text-xs mb-1">
          <span 
            className="w-3 h-3 rounded"
            style={{ backgroundColor: entry.fill }}
          />
          <span style={{ color: '#939394' }}>{entry.name}:</span>
          <span style={{ color: isDarkMode ? '#FFFFFF' : '#010101', fontWeight: 600 }}>
            {entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

// Customer segment multipliers to simulate different data based on segment
const CUSTOMER_SEGMENT_MULTIPLIERS: Record<string, Record<string, number>> = {
  'High Value High Frequency': {
    'Account Access & Security': 1.3,
    'Transaction Disputes & Fraud': 1.5,
    'Credit Card Services': 1.4,
    'Loan & Mortgage Inquiries': 1.2,
    'Fee Complaints & Waivers': 0.8,
    'Digital Banking & Technology': 1.1,
    'Branch & ATM Services': 0.9,
    'Investment & Wealth': 1.6,
    'Direct Deposit & Payroll': 0.7,
    'Account Closure & Changes': 0.6
  },
  'High Value Low Frequency': {
    'Account Access & Security': 0.9,
    'Transaction Disputes & Fraud': 1.1,
    'Credit Card Services': 1.2,
    'Loan & Mortgage Inquiries': 1.3,
    'Fee Complaints & Waivers': 0.7,
    'Digital Banking & Technology': 0.8,
    'Branch & ATM Services': 0.6,
    'Investment & Wealth': 1.5,
    'Direct Deposit & Payroll': 0.5,
    'Account Closure & Changes': 0.4
  },
  'Low Value High Frequency': {
    'Account Access & Security': 1.2,
    'Transaction Disputes & Fraud': 1.0,
    'Credit Card Services': 0.9,
    'Loan & Mortgage Inquiries': 0.8,
    'Fee Complaints & Waivers': 1.3,
    'Digital Banking & Technology': 1.4,
    'Branch & ATM Services': 1.1,
    'Investment & Wealth': 0.5,
    'Direct Deposit & Payroll': 1.2,
    'Account Closure & Changes': 1.0
  },
  'Low Value Low Frequency': {
    'Account Access & Security': 0.8,
    'Transaction Disputes & Fraud': 0.7,
    'Credit Card Services': 0.6,
    'Loan & Mortgage Inquiries': 0.5,
    'Fee Complaints & Waivers': 1.1,
    'Digital Banking & Technology': 0.9,
    'Branch & ATM Services': 0.8,
    'Investment & Wealth': 0.3,
    'Direct Deposit & Payroll': 0.9,
    'Account Closure & Changes': 0.7
  }
};

type ViewMode = 'channel' | 'customerSegment';

// Customer segment options - moved outside component to avoid initialization issues
const CUSTOMER_SEGMENTS = [
  'High Value High Frequency',
  'High Value Low Frequency',
  'Low Value High Frequency',
  'Low Value Low Frequency'
];

// Colors for customer segments - matching channel color theme
const SEGMENT_COLORS: Record<string, string> = {
  'High Value High Frequency': '#ef4444',  // Red (same as Voice)
  'High Value Low Frequency': '#f97316',   // Orange (same as Chat)
  'Low Value High Frequency': '#eab308',   // Yellow (same as Email)
  'Low Value Low Frequency': '#22c55e'     // Green (same as Social Media)
};

export function FailureClusters({ clusters, isDarkMode = false }: FailureClustersProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('channel');
  
  // Filter and transform clusters - no filtering needed, just use original clusters
  const filteredClusters = useMemo(() => {
    return [...clusters];
  }, [clusters]);
  
  // Find the cluster with highest volume to show by default
  const highestVolumeCluster = useMemo(() => {
    return filteredClusters.reduce((max, cluster) => 
      cluster.count > max.count ? cluster : max, filteredClusters[0]
    );
  }, [filteredClusters]);
  
  const [selectedCluster, setSelectedCluster] = useState<FCICluster | null>(null);
  
  // Update selected cluster when view mode changes
  useEffect(() => {
    if (selectedCluster) {
      const updatedCluster = filteredClusters.find(c => c.id === selectedCluster.id);
      if (updatedCluster) {
        setSelectedCluster(updatedCluster);
        return;
      }
    }
    setSelectedCluster(highestVolumeCluster);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode]);
  
  // Transform data for stacked bar chart based on view mode
  const chartData = useMemo(() => {
    if (viewMode === 'customerSegment') {
      // Show data grouped by customer segments
      return filteredClusters.map(cluster => {
        const baseData: any = {
          name: cluster.category,
          fullName: cluster.category,
          total: cluster.count,
          severity: cluster.severity,
          clusterId: cluster.id
        };
        
        // Calculate values for each customer segment
        CUSTOMER_SEGMENTS.forEach(segment => {
          const multiplier = CUSTOMER_SEGMENT_MULTIPLIERS[segment]?.[cluster.category] || 1;
          const segmentValue = Math.round(cluster.count * multiplier);
          baseData[segment] = segmentValue;
        });
        
        // Calculate total for sorting
        baseData.total = CUSTOMER_SEGMENTS.reduce((sum, segment) => {
          return sum + (baseData[segment] || 0);
        }, 0);
        
        return baseData;
      }).sort((a, b) => b.total - a.total); // Sort by total descending
    } else {
      // Show all channels stacked (default channel view)
      return filteredClusters.map(cluster => {
        const baseData: any = {
          name: cluster.category,
          fullName: cluster.category,
          total: cluster.count,
          severity: cluster.severity,
          clusterId: cluster.id
        };
        
        // Calculate actual values based on channel percentages (only for channels that exist)
        if (cluster.topChannels) {
          cluster.topChannels.forEach(channel => {
            const value = Math.round(cluster.count * (channel.percentage / 100));
            if (value > 0) {
              baseData[channel.channel] = value;
            }
          });
        }
        
        return baseData;
      }).sort((a, b) => b.total - a.total); // Sort by total descending
    }
  }, [filteredClusters, viewMode]);

  // Use fixed channel order for consistent stacking
  const channelList = CHANNEL_ORDER;
  
  // Get active items for chart based on view mode
  const activeChartItems = useMemo(() => {
    if (viewMode === 'customerSegment') {
      return CUSTOMER_SEGMENTS;
    }
    return CHANNEL_ORDER;
  }, [viewMode]);

  const handleBarClick = (data: any) => {
    if (data && data.fullName) {
      const cluster = filteredClusters.find(c => c.category === data.fullName);
      if (cluster) {
        setSelectedCluster(cluster);
      }
    }
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  return (
    <div className="p-6 h-full">
      <div className="mb-4">
        <h3
          className="text-lg font-bold mb-4"
          style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
        >
          What's Failing?
        </h3>
        
        {/* Tab Buttons - By Channel and By Customer Segment */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => handleViewModeChange('channel')}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              backgroundColor: viewMode === 'channel' 
                ? '#5332FF' 
                : (isDarkMode ? '#1a1a1a' : '#FFFFFF'),
              color: viewMode === 'channel' 
                ? '#FFFFFF' 
                : (isDarkMode ? '#D6D9D8' : '#4a4a4a'),
              border: `1px solid ${viewMode === 'channel' ? '#5332FF' : (isDarkMode ? '#2a2a2a' : '#E5E5E5')}`,
              boxShadow: viewMode === 'channel' ? '0 2px 8px rgba(83, 50, 255, 0.3)' : 'none'
            }}
          >
            By Channel
          </button>
          <button
            onClick={() => handleViewModeChange('customerSegment')}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              backgroundColor: viewMode === 'customerSegment' 
                ? '#5332FF' 
                : (isDarkMode ? '#1a1a1a' : '#FFFFFF'),
              color: viewMode === 'customerSegment' 
                ? '#FFFFFF' 
                : (isDarkMode ? '#D6D9D8' : '#4a4a4a'),
              border: `1px solid ${viewMode === 'customerSegment' ? '#5332FF' : (isDarkMode ? '#2a2a2a' : '#E5E5E5')}`,
              boxShadow: viewMode === 'customerSegment' ? '0 2px 8px rgba(83, 50, 255, 0.3)' : 'none'
            }}
          >
            By Customer Segment
          </button>
        </div>
      </div>

      <div className="flex gap-4" style={{ minHeight: '450px' }}>
        {/* Left - Stacked Bar Chart */}
        <div className={selectedCluster ? 'w-1/2' : 'w-full'} style={{ transition: 'width 0.3s ease' }}>
          <div style={{ width: '100%', height: 420 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chartData} 
                margin={{ right: 10, bottom: 10, left: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#3a3a3a' : '#E5E5E5'} />
                <XAxis
                  dataKey="name"
                  angle={-35}
                  textAnchor="end"
                  height={120}
                  tick={{ fill: isDarkMode ? '#D6D9D8' : '#010101', fontSize: 9 }}
                  interval={0}
                />
                <YAxis tick={{ fill: isDarkMode ? '#D6D9D8' : '#010101', fontSize: 11 }} />
                <Tooltip content={<CustomStackedTooltip isDarkMode={isDarkMode} />} />
                {viewMode === 'channel' ? (
                  // Render channel bars
                  activeChartItems.map((channel) => (
                    <Bar 
                      key={channel}
                      dataKey={channel}
                      stackId="a"
                      fill={CHANNEL_COLORS[channel] || '#939394'}
                      shape={(props: any) => <CustomBar {...props} viewMode="channel" />}
                      cursor="pointer"
                      opacity={selectedCluster ? 0.6 : 1}
                      onClick={(data) => handleBarClick(data)}
                    />
                  ))
                ) : (
                  // Render customer segment bars
                  activeChartItems.map((segment) => (
                    <Bar 
                      key={segment}
                      dataKey={segment}
                      stackId="a"
                      fill={SEGMENT_COLORS[segment] || '#939394'}
                      shape={(props: any) => <CustomBar {...props} viewMode="customerSegment" />}
                      cursor="pointer"
                      opacity={selectedCluster ? 0.6 : 1}
                      onClick={(data) => handleBarClick(data)}
                    />
                  ))
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend - Shows Channels or Customer Segments (Below Chart) */}
          <div 
            className="flex items-center justify-center gap-6 py-3 px-4 rounded-xl mt-4"
            style={{ 
              backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5',
              border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`
            }}
          >
            {viewMode === 'channel' ? (
              // Show channel legend
              channelList.map(channel => (
                <div
                  key={channel}
                  className="flex items-center gap-2"
                >
                  <span 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: CHANNEL_COLORS[channel] || '#939394' }}
                  />
                  <span 
                    className="text-sm font-medium" 
                    style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}
                  >
                    {channel}
                  </span>
                </div>
              ))
            ) : (
              // Show customer segment legend
              CUSTOMER_SEGMENTS.map(segment => (
                <div
                  key={segment}
                  className="flex items-center gap-2"
                >
                  <span 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: SEGMENT_COLORS[segment] || '#939394' }}
                  />
                  <span 
                    className="text-sm font-medium" 
                    style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}
                  >
                    {segment}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right - Detail Card */}
        {selectedCluster && (
          <div className="w-1/2" style={{ transition: 'width 0.3s ease' }}>
            <ClusterDetailCard 
              cluster={selectedCluster} 
              isDarkMode={isDarkMode}
              onClose={() => setSelectedCluster(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
