'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

    return data.map(cluster => {
      const filteredIssues = cluster.issues.filter(issue => issue.cityTier === selectedTier);
      const filteredCount = filteredIssues.length;
      const originalCount = cluster.totalCount;
      const ratio = originalCount > 0 ? filteredCount / originalCount : 0;

      return {
        ...cluster,
        issues: filteredIssues,
        channels: cluster.channels.map(channel => ({
          ...channel,
          count: Math.round(channel.count * ratio),
        })),
        totalCount: filteredCount,
      };
    }).filter(cluster => cluster.totalCount > 0);
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

  // Prepare chart data with stacked bars grouped by main topics
  const chartData = useMemo(() => {
    // Normalize channel names: convert "Phone" to "Voice", "App" to "Tickets", and exclude "WhatsApp"
    const normalizeChannel = (channel: string) => {
      if (channel === 'Phone') return 'Voice';
      if (channel === 'App') return 'Tickets';
      return channel;
    };

    const channelNames = Array.from(
      new Set(
        topicsData.flatMap(topic => 
          topic.channels.map(c => normalizeChannel(c.channel))
        )
      )
    ).filter(channel => channel !== 'WhatsApp'); // Exclude WhatsApp

    return topicsData.map(topic => {
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
        dataPoint[channel] = channelData?.count || 0;
      });

      return dataPoint;
    });
  }, [topicsData]);

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
        <div className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg p-4 shadow-xl max-w-xs">
          <p className="font-semibold text-white text-sm mb-2">{label}</p>
          {clusters.length > 0 && (
            <p className="text-xs text-gray-400 mb-3">
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
                    <span className="text-gray-300">{entry.name}:</span>
                  </div>
                  <span className="text-white font-medium">{entry.value}</span>
                </div>
              )
            ))}
            <div className="pt-2 border-t border-[#2a2a2a] mt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Total:</span>
                <span className="text-white font-bold">{total}</span>
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

  // Normalize channel names: convert "Phone" to "Voice", "App" to "Tickets", and exclude "WhatsApp"
  const normalizeChannel = (channel: string) => {
    if (channel === 'Phone') return 'Voice';
    if (channel === 'App') return 'Tickets';
    return channel;
  };

  const channelNames = Array.from(
    new Set(
      topicsData.flatMap(topic => 
        topic.channels.map(c => normalizeChannel(c.channel))
      )
    )
  ).filter(channel => channel !== 'WhatsApp'); // Exclude WhatsApp

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Main Chart Section */}
      <div className="lg:col-span-2">
        <Card className="bg-[#0d0d0d] border border-[#2a2a2a] h-full">
          <CardHeader className="pb-4 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-white mb-2">
                  Imperfect Order Distribution
                </CardTitle>
                <p className="text-xs text-gray-400">
                  Channel distribution across main topics
                </p>
              </div>
            </div>

            {/* Tier Filter Dropdown */}
            <div className="mt-4 flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-400 mr-2">Region:</span>
              <div className="relative" ref={tierDropdownRef}>
                <button
                  onClick={() => setIsTierDropdownOpen(!isTierDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 bg-[#1a1a1a] text-gray-300 border border-[#2a2a2a] hover:border-[#3a3a3a] min-w-[180px] justify-between"
                >
                  <span>{selectedTierLabel}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                      isTierDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isTierDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="py-2">
                      {TIER_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSelectedTier(option.value);
                            setIsTierDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-200 flex items-center gap-3 ${
                            selectedTier === option.value
                              ? 'bg-[#b90abd]/20 text-white'
                              : 'text-gray-300 hover:bg-[#1a1a1a] hover:text-white'
                          }`}
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
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
                  onClick={handleBarClick}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#2a2a2a"
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="topicName"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fill: '#939394', fontSize: 10 }}
                    axisLine={{ stroke: '#2a2a2a' }}
                    tickLine={{ stroke: '#2a2a2a' }}
                  />
                  <YAxis
                    tick={{ fill: '#939394', fontSize: 11 }}
                    axisLine={{ stroke: '#2a2a2a' }}
                    tickLine={{ stroke: '#2a2a2a' }}
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
            </div>

            {/* Channel Legend - Below the plot */}
            <div className="mt-0 pt-1 border-t border-[#2a2a2a]">
              <div className="flex flex-wrap gap-4 justify-center">
                {channelNames.map((channel) => (
                  <div key={channel} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: CHANNEL_COLORS[channel] || '#939394' }}
                    />
                    <span className="text-xs text-gray-400">{channel}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detail Panel */}
      <div className="lg:col-span-1">
        <Card className="bg-[#0d0d0d] border border-[#2a2a2a] h-full">
          <CardHeader className="pb-4 pt-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-white">
                Dominant Clusters
              </CardTitle>
              {selectedCluster && (
                <button
                  onClick={() => setSelectedCluster(null)}
                  className="p-1.5 rounded-lg hover:bg-[#1a1a1a] transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
            {selectedTopicData && (
              <p className="text-xs text-gray-400 mt-1">
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
                  scrollbarColor: '#3a3a3a #1a1a1a',
                }}
              >
                <div className="mb-3 pb-3 border-b border-[#2a2a2a]">
                  <p className="text-xs text-gray-400 mb-1">Selected Cluster</p>
                  <p className="text-sm font-semibold text-white">{selectedCluster}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedClusterData.totalCount} issues
                  </p>
                </div>
                {selectedClusterData.issues.map((issue, index) => (
                  <div
                    key={index}
                    className="p-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:border-[#b90abd]/50 transition-all duration-200"
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
                          <span className="text-xs font-semibold text-white">
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
                        <p className="text-xs text-gray-400 leading-relaxed">
                          {issue.address}
                        </p>
                        {issue.city && (
                          <p className="text-xs text-gray-500 mt-1">
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
                  scrollbarColor: '#3a3a3a #1a1a1a',
                }}
              >
                {topicsData.map((topic, topicIndex) => {
                  const topicColor = MACRO_COLORS[topic.topicName] || '#b90abd';
                  return (
                  <div
                    key={topicIndex}
                    className="p-3 bg-[#1a1a1a] border-2 rounded-lg transition-all duration-200"
                    style={{
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
                      <h4 className="text-sm font-semibold text-white mb-1">
                        {topic.topicName}
                      </h4>
                      <p className="text-xs text-gray-400">
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
                                : '#0d0d0d',
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
                                e.currentTarget.style.backgroundColor = '#0d0d0d';
                              }
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-gray-300">
                                {clusterName}
                              </span>
                              {clusterData && (
                                <span className="text-xs text-gray-500">
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
                <MapPin className="w-12 h-12 text-gray-600 mb-4" />
                <p className="text-sm text-gray-400 mb-2">
                  No data available
                </p>
                <p className="text-xs text-gray-500">
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
