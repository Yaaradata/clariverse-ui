'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import { MapPin, Filter, X } from 'lucide-react';

interface ChannelData {
  channel: string;
  count: number;
  color: string;
}

interface ClusterData {
  clusterLabel: string;
  totalCount: number;
  channels: ChannelData[];
  issues: IssueDetail[];
}

interface IssueDetail {
  pincode: string;
  address: string;
  city: string;
  cityTier: 'tier1' | 'tier2' | 'tier3';
  orderId?: string;
  issueType?: string;
}

interface DominantClusterChartProps {
  data: ClusterData[];
}

const CHANNEL_COLORS: Record<string, string> = {
  'Email': '#5332ff',
  'Phone': '#ef4444',
  'Chat': '#10b981',
  'Social Media': '#f59e0b',
  'App': '#8b5cf6',
  'Website': '#06b6d4',
};

const TIER_COLORS = {
  tier1: '#ef4444',
  tier2: '#f59e0b',
  tier3: '#10b981',
};

export function DominantClusterChart({ data }: DominantClusterChartProps) {
  const [selectedTier, setSelectedTier] = useState<'all' | 'tier1' | 'tier2' | 'tier3'>('all');
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);

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

  // Prepare chart data with stacked bars
  const chartData = useMemo(() => {
    const channelNames = Array.from(
      new Set(filteredData.flatMap(cluster => cluster.channels.map(c => c.channel)))
    ).filter(channel => channel !== 'WhatsApp'); // Exclude WhatsApp

    return filteredData.map(cluster => {
      const dataPoint: Record<string, any> = {
        clusterLabel: cluster.clusterLabel,
        totalCount: cluster.totalCount,
        isSelected: selectedCluster === cluster.clusterLabel,
      };

      channelNames.forEach(channel => {
        const channelData = cluster.channels.find(c => c.channel === channel);
        dataPoint[channel] = channelData?.count || 0;
      });

      return dataPoint;
    });
  }, [filteredData, selectedCluster]);

  // Get selected cluster details
  const selectedClusterData = useMemo(() => {
    if (!selectedCluster) return null;
    return filteredData.find(cluster => cluster.clusterLabel === selectedCluster);
  }, [selectedCluster, filteredData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, entry: any) => sum + (entry.value || 0), 0);
      return (
        <div className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg p-4 shadow-xl">
          <p className="font-semibold text-white text-sm mb-3">{label}</p>
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
    if (data && data.clusterLabel) {
      setSelectedCluster(
        selectedCluster === data.clusterLabel ? null : data.clusterLabel
      );
    }
  };

  const channelNames = Array.from(
    new Set(filteredData.flatMap(cluster => cluster.channels.map(c => c.channel)))
  ).filter(channel => channel !== 'WhatsApp'); // Exclude WhatsApp

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Main Chart Section */}
      <div className="lg:col-span-2">
        <Card className="bg-[#0d0d0d] border border-[#2a2a2a]">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-white mb-2">
                  Dominant Cluster Distribution
                </CardTitle>
                <p className="text-xs text-gray-400">
                  Channel distribution across cluster labels
                </p>
              </div>
            </div>

            {/* Tier Filters */}
            <div className="mt-4 flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-400 mr-2">City Tier:</span>
              <div className="flex gap-2">
                {(['all', 'tier1', 'tier2', 'tier3'] as const).map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      selectedTier === tier
                        ? tier === 'all'
                          ? 'bg-[#b90abd] text-white shadow-lg shadow-[#b90abd]/30'
                          : `bg-[${TIER_COLORS[tier]}] text-white`
                        : 'bg-[#1a1a1a] text-gray-400 border border-[#2a2a2a] hover:border-[#3a3a3a]'
                    }`}
                    style={
                      selectedTier === tier && tier !== 'all'
                        ? { backgroundColor: TIER_COLORS[tier] }
                        : {}
                    }
                  >
                    {tier === 'all' ? 'All Cities' : tier.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  onClick={handleBarClick}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#2a2a2a"
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="clusterLabel"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tick={{ fill: '#939394', fontSize: 11 }}
                    axisLine={{ stroke: '#2a2a2a' }}
                    tickLine={{ stroke: '#2a2a2a' }}
                  />
                  <YAxis
                    tick={{ fill: '#939394', fontSize: 11 }}
                    axisLine={{ stroke: '#2a2a2a' }}
                    tickLine={{ stroke: '#2a2a2a' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                    formatter={(value) => (
                      <span className="text-xs text-gray-400">{value}</span>
                    )}
                  />
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

            {/* Channel Legend */}
            <div className="mt-4 pt-4 border-t border-[#2a2a2a]">
              <div className="flex flex-wrap gap-4">
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
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-white">
                Issue Details
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
            {selectedCluster && (
              <p className="text-xs text-gray-400 mt-1">
                {selectedClusterData?.totalCount || 0} issues in{' '}
                <span className="text-[#b90abd] font-medium">{selectedCluster}</span>
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
                {selectedClusterData.issues.map((issue, index) => (
                  <div
                    key={index}
                    className="p-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:border-[#b90abd]/50 transition-all duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                        style={{
                          backgroundColor:
                            TIER_COLORS[issue.cityTier] || '#939394',
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="w-3.5 h-3.5 text-[#b90abd] flex-shrink-0" />
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
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <MapPin className="w-12 h-12 text-gray-600 mb-4" />
                <p className="text-sm text-gray-400 mb-2">
                  Select a cluster from the chart
                </p>
                <p className="text-xs text-gray-500">
                  Click on any bar to view pincode and address details
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
