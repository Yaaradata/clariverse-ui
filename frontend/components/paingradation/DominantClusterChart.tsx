'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from './useTheme';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { MapPin, Filter, X, ChevronDown } from 'lucide-react';

interface ChannelData {
  channel: string;
  count: number;
  color: string;
}

interface ClusterData {
  clusterLabel: string;
  mainTopic: string; // Main topic category (A, B, C, D, E)
  totalCount: number;
  channels: ChannelData[];
  issues: IssueDetail[];
}

interface MainTopicData {
  topicId: string;
  topicName: string;
  clusters: string[];
  totalCount: number;
  channels: ChannelData[];
}

interface IssueDetail {
  pincode: string;
  address: string;
  city: string;
  cityTier: 'tier1' | 'tier2' | 'tier3' | 'northeast' | 'islands';
  orderId?: string;
  issueType?: string;
}

type TierOption = 'all' | 'tier1' | 'tier2' | 'tier3' | 'northeast' | 'islands';

interface TierOptionConfig {
  value: TierOption;
  label: string;
}

interface DominantClusterChartProps {
  data: ClusterData[];
}

const CHANNEL_COLORS: Record<string, string> = {
  'Email': '#5332ff',
  'Voice': '#ef4444',
  'Chat': '#10b981',
  'Social Media': '#f59e0b',
  'Tickets': '#8b5cf6',
  'Website': '#06b6d4',
};

const MACRO_COLORS: Record<string, string> = {
  'Payment & Order Status Mismatch': '#3B82F6', // Blue
  'Fulfilment Accuracy Issues': '#22C55E', // Green
  'Delivery Experience Complaints': '#F97316', // Orange
  'Product Condition Complaints': '#A855F7', // Purple
  'Quality & Expectation Mismatch': '#F43F5E', // Pink/Red
};

const TIER_COLORS = {
  tier1: '#ef4444',
  tier2: '#f59e0b',
  tier3: '#10b981',
  northeast: '#8b5cf6',
  islands: '#06b6d4',
};

const TIER_OPTIONS: TierOptionConfig[] = [
  { value: 'all', label: 'All Regions' },
  { value: 'tier1', label: 'Tier 1 Metros' },
  { value: 'tier2', label: 'Tier 2 Cities' },
  { value: 'tier3', label: 'Tier 3 & Rural' },
  { value: 'northeast', label: 'Northeast & Hill States' },
  { value: 'islands', label: 'Islands & Remote Areas' },
];

export function DominantClusterChart({ data }: DominantClusterChartProps) {
  const isDarkMode = useTheme();
  const [selectedTier, setSelectedTier] = useState<TierOption>('all');
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const [isTierDropdownOpen, setIsTierDropdownOpen] = useState(false);
  const tierDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tierDropdownRef.current &&
        !tierDropdownRef.current.contains(event.target as Node)
      ) {
        setIsTierDropdownOpen(false);
      }
    };

    if (isTierDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isTierDropdownOpen]);

  // Filter data based on selected tier
  const filteredData = useMemo(() => {
    if (selectedTier === 'all') return data;

    const filtered = data.map(cluster => {
      const filteredIssues = cluster.issues.filter(issue => issue.cityTier === selectedTier);
      const filteredCount = filteredIssues.length;
      
      // If no issues match this tier, return null to filter out
      if (filteredCount === 0) {
        return null;
      }

      const originalCount = cluster.totalCount;
      const ratio = originalCount > 0 ? filteredCount / originalCount : 0;

      // Calculate channel counts - preserve proportional distribution
      // For very small ratios, we need to ensure visibility while maintaining proportions
      const adjustedChannels = cluster.channels.map(channel => {
        let calculatedCount = channel.count * ratio;
        
        // Round to nearest integer, but ensure at least 1 if original had count and we have filtered issues
        if (calculatedCount > 0) {
          calculatedCount = Math.max(1, Math.round(calculatedCount));
        } else {
          calculatedCount = 0;
        }
        
        return {
          ...channel,
          count: calculatedCount,
        };
      });
      
      // Ensure total matches filteredCount (adjust if needed due to rounding)
      const channelSum = adjustedChannels.reduce((sum, ch) => sum + ch.count, 0);
      if (channelSum !== filteredCount && filteredCount > 0) {
        // Distribute the difference proportionally
        const diff = filteredCount - channelSum;
        if (diff !== 0) {
          // Find the channel with the largest count and adjust it
          const maxChannelIndex = adjustedChannels.reduce((maxIdx, ch, idx) => 
            ch.count > adjustedChannels[maxIdx].count ? idx : maxIdx, 0
          );
          adjustedChannels[maxChannelIndex].count += diff;
        }
      }

      return {
        ...cluster,
        issues: filteredIssues,
        channels: adjustedChannels,
        totalCount: filteredCount,
      };
    }).filter(cluster => cluster !== null && cluster.totalCount > 0) as ClusterData[];
    
    return filtered;
  }, [data, selectedTier]);

  const selectedTierLabel = TIER_OPTIONS.find(opt => opt.value === selectedTier)?.label || 'All Regions';

  // Group data by main topics
  const topicsData = useMemo(() => {
    const topicsMap = new Map<string, MainTopicData>();

    filteredData.forEach(cluster => {
      const topicId = cluster.mainTopic;
      const existing = topicsMap.get(topicId);

      if (existing) {
        existing.clusters.push(cluster.clusterLabel);
        existing.totalCount += cluster.totalCount;
        // Merge channels
        cluster.channels.forEach(channel => {
          const existingChannel = existing.channels.find(c => c.channel === channel.channel);
          if (existingChannel) {
            existingChannel.count += channel.count;
          } else {
            existing.channels.push({ ...channel });
          }
        });
      } else {
        topicsMap.set(topicId, {
          topicId,
          topicName: cluster.mainTopic,
          clusters: [cluster.clusterLabel],
          totalCount: cluster.totalCount,
          channels: cluster.channels.map(c => ({ ...c })),
        });
      }
    });

    return Array.from(topicsMap.values());
  }, [filteredData]);

  // Normalize channel names helper
  const normalizeChannel = (channel: string) => {
    if (channel === 'Phone') return 'Voice';
    if (channel === 'App') return 'Tickets';
    return channel;
  };

  // Get all channel names from topics data
  const channelNames = useMemo(() => {
    return Array.from(
      new Set(
        topicsData.flatMap(topic => 
          topic.channels.map(c => normalizeChannel(c.channel))
        )
      )
    ).filter(channel => channel !== 'WhatsApp'); // Exclude WhatsApp
  }, [topicsData]);

  // Prepare chart data with stacked bars grouped by main topics
  const chartData = useMemo(() => {
    const data = topicsData.map(topic => {
      const dataPoint: Record<string, any> = {
        topicId: topic.topicId,
        topicName: topic.topicName,
        totalCount: topic.totalCount,
        clusters: topic.clusters,
      };

      channelNames.forEach(channel => {
        const channelData = topic.channels.find(
          c => normalizeChannel(c.channel) === channel
        );
        // Ensure we always have a number, never undefined
        dataPoint[channel] = channelData?.count ?? 0;
      });

      return dataPoint;
    });

    // Filter out topics with zero total count to avoid empty bars
    return data.filter(dp => {
      const total = channelNames.reduce((sum, channel) => sum + (dp[channel] || 0), 0);
      return total > 0;
    });
  }, [topicsData, channelNames]);

  // Calculate max value for Y-axis domain to ensure bars are visible when filtered
  const maxYValue = useMemo(() => {
    if (chartData.length === 0) return 100;
    
    const totals = chartData.map(dataPoint => {
      return channelNames.reduce((sum, channel) => sum + (dataPoint[channel] || 0), 0);
    });
    
    const maxTotal = Math.max(...totals);
    const minTotal = Math.min(...totals.filter(t => t > 0)); // Get minimum non-zero total
    
    // If maxTotal is 0, return a small default value
    if (maxTotal === 0) return 10;
    
    // For very small values, ensure the domain is appropriate
    if (maxTotal < 10) {
      // For small values, use a domain that's at least 2x the max to ensure visibility
      return Math.max(10, maxTotal * 2);
    }
    
    // Add 20% padding to the max value for better visibility, with minimum of maxTotal
    const paddedMax = Math.ceil(maxTotal * 1.2);
    return Math.max(paddedMax, maxTotal);
  }, [chartData, channelNames]);

  // Get selected cluster details
  const selectedClusterData = useMemo(() => {
    if (!selectedCluster) return null;
    return filteredData.find(cluster => cluster.clusterLabel === selectedCluster);
  }, [selectedCluster, filteredData]);

  // Get selected topic details
  const selectedTopicData = useMemo(() => {
    if (!selectedCluster) return null;
    const topic = topicsData.find(t => t.clusters.includes(selectedCluster));
    return topic;
  }, [selectedCluster, topicsData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, entry: any) => sum + (entry.value || 0), 0);
      const dataPoint = payload[0]?.payload;
      const clusters = dataPoint?.clusters || [];
      
      return (
        <div className="rounded-lg p-4 shadow-xl max-w-xs" style={{ backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF', borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5', borderWidth: '1px', borderStyle: 'solid' }}>
          <p className="font-semibold text-sm mb-2" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>{label}</p>
          {clusters.length > 0 && (
            <p className="text-xs mb-3" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
              Clusters: {clusters.join(', ')}
            </p>
          )}
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => (
              entry.value > 0 && (
                <div key={index} className="flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}>{entry.name}:</span>
                  </div>
                  <span className="font-medium" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>{entry.value}</span>
                </div>
              )
            ))}
            <div className="pt-2 border-t mt-2" style={{ borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5' }}>
              <div className="flex items-center justify-between text-xs">
                <span style={{ color: isDarkMode ? '#939394' : '#666666' }}>Total:</span>
                <span className="font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>{total}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const handleBarClick = (data: any) => {
    if (data && data.topicName) {
      // Select the first cluster of the clicked topic
      const topic = topicsData.find(t => t.topicName === data.topicName);
      if (topic && topic.clusters.length > 0) {
        const firstCluster = topic.clusters[0];
        setSelectedCluster(
          selectedCluster === firstCluster ? null : firstCluster
        );
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Main Chart Section */}
      <div className="lg:col-span-2">
        <Card className="h-full" style={{ backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF', borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5', borderWidth: '1px', borderStyle: 'solid' }}>
          <CardHeader className="pb-4 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold mb-2" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                  Imperfect Order Distribution
                </CardTitle>
                <p className="text-xs" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
                  Channel distribution across main topics
                </p>
              </div>
            </div>

            {/* Tier Filter Dropdown */}
            <div className="mt-4 flex items-center gap-2">
              <Filter className="w-4 h-4" style={{ color: isDarkMode ? '#939394' : '#666666' }} />
              <span className="text-xs mr-2" style={{ color: isDarkMode ? '#939394' : '#666666' }}>Region:</span>
              <div className="relative" ref={tierDropdownRef}>
                <button
                  onClick={() => setIsTierDropdownOpen(!isTierDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 min-w-[180px] justify-between"
                  style={{
                    backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa',
                    color: isDarkMode ? '#D6D9D8' : '#4a4a4a',
                    borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = isDarkMode ? '#3a3a3a' : '#d0d0d0';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = isDarkMode ? '#2a2a2a' : '#E5E5E5';
                  }}
                >
                  <span>{selectedTierLabel}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isTierDropdownOpen ? 'rotate-180' : ''
                    }`}
                    style={{ color: isDarkMode ? '#939394' : '#666666' }}
                  />
                </button>

                {isTierDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 rounded-lg shadow-xl z-50 overflow-hidden" style={{ backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF', borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5', borderWidth: '1px', borderStyle: 'solid' }}>
                    <div className="py-2">
                      {TIER_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSelectedTier(option.value);
                            setIsTierDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm transition-all duration-200 flex items-center gap-3"
                          style={{
                            backgroundColor: selectedTier === option.value ? 'rgba(185, 10, 189, 0.2)' : 'transparent',
                            color: selectedTier === option.value ? (isDarkMode ? '#FFFFFF' : '#010101') : (isDarkMode ? '#D6D9D8' : '#4a4a4a'),
                          }}
                          onMouseEnter={(e) => {
                            if (selectedTier !== option.value) {
                              e.currentTarget.style.backgroundColor = isDarkMode ? '#1a1a1a' : '#f8f9fa';
                              e.currentTarget.style.color = isDarkMode ? '#FFFFFF' : '#010101';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedTier !== option.value) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = isDarkMode ? '#D6D9D8' : '#4a4a4a';
                            }
                          }}
                        >
                          <div className="flex items-center gap-2 flex-1">
                            {selectedTier === option.value && (
                              <div className="w-1.5 h-1.5 rounded-full bg-[#b90abd] shrink-0" />
                            )}
                            {selectedTier !== option.value && (
                              <div className="w-1.5 h-1.5 rounded-full shrink-0" />
                            )}
                            <span className={selectedTier === option.value ? 'font-medium' : ''}>
                              {option.label}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="h-[500px] w-full">
              {chartData.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
                    No data available for the selected filter
                  </p>
                </div>
              ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  key={`chart-${selectedTier}-${chartData.length}`}
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
                  onClick={handleBarClick}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDarkMode ? '#2a2a2a' : '#E5E5E5'}
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="topicName"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fill: isDarkMode ? '#939394' : '#666666', fontSize: 10 }}
                    axisLine={{ stroke: isDarkMode ? '#2a2a2a' : '#E5E5E5' }}
                    tickLine={{ stroke: isDarkMode ? '#2a2a2a' : '#E5E5E5' }}
                  />
                  <YAxis
                    domain={[0, maxYValue]}
                    tick={{ fill: isDarkMode ? '#939394' : '#666666', fontSize: 11 }}
                    axisLine={{ stroke: isDarkMode ? '#2a2a2a' : '#E5E5E5' }}
                    tickLine={{ stroke: isDarkMode ? '#2a2a2a' : '#E5E5E5' }}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {channelNames.map((channel, index) => (
                    <Bar
                      key={channel}
                      dataKey={channel}
                      stackId="a"
                      fill={CHANNEL_COLORS[channel] || `#${Math.floor(Math.random() * 16777215).toString(16)}`}
                      radius={index === channelNames.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                      onClick={handleBarClick}
                      style={{ cursor: 'pointer' }}
                      className="hover:opacity-80 transition-opacity"
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
              )}
            </div>

            {/* Channel Legend - Below the plot */}
            <div className="mt-0 pt-1 border-t" style={{ borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5' }}>
              <div className="flex flex-wrap gap-4 justify-center">
                {channelNames.map((channel) => (
                  <div key={channel} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: CHANNEL_COLORS[channel] || '#939394' }}
                    />
                    <span className="text-xs" style={{ color: isDarkMode ? '#939394' : '#666666' }}>{channel}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detail Panel */}
      <div className="lg:col-span-1">
        <Card className="h-full" style={{ backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF', borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5', borderWidth: '1px', borderStyle: 'solid' }}>
          <CardHeader className="pb-4 pt-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
              Top Detractor Themes
              </CardTitle>
              {selectedCluster && (
                <button
                  onClick={() => setSelectedCluster(null)}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isDarkMode ? '#1a1a1a' : '#f8f9fa';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <X className="w-4 h-4" style={{ color: isDarkMode ? '#939394' : '#666666' }} />
                </button>
              )}
            </div>
            {selectedTopicData && (
              <p className="text-xs mt-1" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
                {selectedTopicData.totalCount} total issues
              </p>
            )}
          </CardHeader>

          <CardContent>
            {selectedCluster && selectedClusterData ? (
              <div 
                className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: isDarkMode ? '#3a3a3a #1a1a1a' : '#d0d0d0 #f0f0f0',
                }}
              >
                <div className="mb-3 pb-3 border-b" style={{ borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5' }}>
                  <p className="text-xs mb-1" style={{ color: isDarkMode ? '#939394' : '#666666' }}>Selected Cluster</p>
                  <p className="text-sm font-semibold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>{selectedCluster}</p>
                  <p className="text-xs mt-1" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
                    {selectedClusterData.totalCount} issues
                  </p>
                </div>
                {selectedClusterData.issues.map((issue, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg hover:border-[#b90abd]/50 transition-all duration-200"
                    style={{
                      backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa',
                      borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                        style={{
                          backgroundColor:
                            TIER_COLORS[issue.cityTier] || '#939394',
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="w-3.5 h-3.5 text-[#b90abd] shrink-0" />
                          <span className="text-xs font-semibold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                            {issue.pincode}
                          </span>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `${TIER_COLORS[issue.cityTier]}20`,
                              color: TIER_COLORS[issue.cityTier],
                            }}
                          >
                            {issue.cityTier.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
                          {issue.address}
                        </p>
                        {issue.city && (
                          <p className="text-xs mt-1" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
                            {issue.city}
                          </p>
                        )}
                        {issue.orderId && (
                          <p className="text-xs text-purple-400 mt-1">
                            Order: {issue.orderId}
                          </p>
                        )}
                        {issue.issueType && (
                          <p className="text-xs text-yellow-400 mt-1">
                            Type: {issue.issueType}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : topicsData.length > 0 ? (
              <div 
                className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: isDarkMode ? '#3a3a3a #1a1a1a' : '#d0d0d0 #f0f0f0',
                }}
              >
                {topicsData.map((topic, topicIndex) => {
                  const topicColor = MACRO_COLORS[topic.topicName] || '#b90abd';
                  return (
                  <div
                    key={topicIndex}
                    className="p-3 border-2 rounded-lg transition-all duration-200"
                    style={{
                      backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa',
                      borderColor: `${topicColor}80`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = topicColor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = `${topicColor}80`;
                    }}
                  >
                    <div className="mb-2">
                      <h4 className="text-sm font-semibold mb-1" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                        {topic.topicName}
                      </h4>
                      <p className="text-xs" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
                        {topic.totalCount} issues
                      </p>
                    </div>
                    <div className="space-y-1.5 mt-2">
                      {topic.clusters.map((clusterName, clusterIndex) => {
                        const clusterData = filteredData.find(c => c.clusterLabel === clusterName);
                        const topicColor = MACRO_COLORS[topic.topicName] || '#b90abd';
                        return (
                          <div
                            key={clusterIndex}
                            onClick={() => {
                              setSelectedCluster(
                                selectedCluster === clusterName ? null : clusterName
                              );
                            }}
                            className="p-2 rounded-md cursor-pointer transition-all duration-200 border-2"
                            style={{
                              borderColor: selectedCluster === clusterName 
                                ? topicColor 
                                : `${topicColor}66`,
                              backgroundColor: selectedCluster === clusterName 
                                ? `${topicColor}20` 
                                : (isDarkMode ? '#0d0d0d' : '#FFFFFF'),
                            }}
                            onMouseEnter={(e) => {
                              if (selectedCluster !== clusterName) {
                                e.currentTarget.style.borderColor = `${topicColor}AA`;
                                e.currentTarget.style.backgroundColor = `${topicColor}10`;
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (selectedCluster !== clusterName) {
                                e.currentTarget.style.borderColor = `${topicColor}66`;
                                e.currentTarget.style.backgroundColor = isDarkMode ? '#0d0d0d' : '#FFFFFF';
                              }
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium" style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}>
                                {clusterName}
                              </span>
                              {clusterData && (
                                <span className="text-xs" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
                                  {clusterData.totalCount}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <MapPin className="w-12 h-12 mb-4" style={{ color: isDarkMode ? '#939394' : '#666666' }} />
                <p className="text-sm mb-2" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
                  No data available
                </p>
                <p className="text-xs" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
                  Select a different region filter
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
