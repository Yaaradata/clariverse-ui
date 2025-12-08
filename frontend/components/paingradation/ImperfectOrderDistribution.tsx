'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';
import {
  Chart as ChartJS,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  Filler,
  Title,
  ChartData,
  ChartOptions,
  BubbleDataPoint,
} from 'chart.js';
import { Bubble } from 'react-chartjs-2';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, Filler, Title);

interface ChannelData {
  channel: string;
  count: number;
  color: string;
}

interface ClusterData {
  clusterLabel: string;
  mainTopic: string;
  totalCount: number;
  channels: ChannelData[];
  issues: Array<{
    pincode: string;
    address: string;
    city: string;
    cityTier: 'tier1' | 'tier2' | 'tier3' | 'northeast' | 'islands';
    orderId?: string;
    issueType?: string;
  }>;
}

interface ImperfectOrderDistributionProps {
  data: ClusterData[];
}

const MACRO_TOPICS = [
  'Payment & Order Status Mismatch',
  'Fulfilment Accuracy Issues',
  'Delivery Experience Complaints',
  'Product Condition Complaints',
  'Quality & Expectation Mismatch',
];

// Macro topic colors - each macro has one color
const MACRO_COLORS: Record<string, string> = {
  'Payment & Order Status Mismatch': '#3B82F6', // Blue
  'Fulfilment Accuracy Issues': '#22C55E', // Green
  'Delivery Experience Complaints': '#F97316', // Orange
  'Product Condition Complaints': '#A855F7', // Purple
  'Quality & Expectation Mismatch': '#F43F5E', // Pink/Red
};

const MACRO_SHADOWS: Record<string, string> = {
  'Payment & Order Status Mismatch': 'rgba(59,130,246,0.55)',
  'Fulfilment Accuracy Issues': 'rgba(34,197,94,0.55)',
  'Delivery Experience Complaints': 'rgba(249,115,22,0.55)',
  'Product Condition Complaints': 'rgba(168,85,247,0.55)',
  'Quality & Expectation Mismatch': 'rgba(244,63,94,0.55)',
};

// Channel colors for reference in tooltips (not used for bubble colors)
const CHANNEL_COLORS: Record<string, string> = {
  Email: '#5332ff',
  Voice: '#ef4444',
  Chat: '#10b981',
  Tickets: '#f59e0b',
  'Social Media': '#ec4899',
  Social: '#ec4899',
};

const normalizeChannel = (channel: string): string => {
  const mapping: Record<string, string> = {
    Phone: 'Voice',
    App: 'Tickets',
    WhatsApp: 'Voice',
  };
  return mapping[channel] || channel;
};

// Hash function to generate consistent pseudo-random values for jitter
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Calculate sentiment based on issue type and count (mock calculation)
// Add jitter to spread bubbles across full range 1-5, including 1 and 2
function calculateSentiment(cluster: ClusterData, index: number): number {
  // Use hash to distribute bubbles across full range
  const hash = hashString(cluster.clusterLabel);
  const hashValue = hash % 100; // 0-99
  
  // Distribute across full range: 1-5
  // Use hash to create a base position across the full range
  const basePosition = 1 + (hashValue / 100) * 4; // Maps 0-99 to 1-5
  
  // Add some variation based on count and keywords
  const countFactor = Math.min(cluster.totalCount / 50, 1) * 1.5; // 0-1.5 range
  const urgencyKeywords = ['payment', 'cancelled', 'damaged', 'missing', 'late', 'wrong'];
  const hasUrgencyKeyword = urgencyKeywords.some((keyword) =>
    cluster.clusterLabel.toLowerCase().includes(keyword)
  );
  const urgencyBonus = hasUrgencyKeyword ? 0.6 : 0;
  
  // Add smaller jitter for fine-tuning
  const jitter = ((hash % 50) / 50) * 0.4 - 0.2; // -0.2 to 0.2
  
  const sentiment = basePosition + countFactor * 0.3 + urgencyBonus * 0.3 + jitter;
  // Constrain to 1.15 to 4.85 to keep bubbles inside (accounting for max radius ~14px and padding)
  return Math.min(Math.max(sentiment, 1.15), 4.85);
}

// Calculate urgency index based on count and issue type
// Add jitter to spread bubbles across full range 0-1
function calculateUrgency(cluster: ClusterData, index: number): number {
  // Use hash to distribute bubbles across full urgency range
  const hash = hashString(cluster.clusterLabel + 'urgency'); // Different seed for Y-axis
  const hashValue = hash % 100; // 0-99
  
  // Distribute across full range: 0-1
  const baseUrgency = (hashValue / 100) * 0.9 + 0.05; // Maps 0-99 to 0.05-0.95
  
  const countFactor = Math.min(cluster.totalCount / 50, 1) * 0.3; // 0-0.3 range
  const criticalKeywords = ['payment', 'cancelled', 'refund', 'damaged'];
  const hasCriticalKeyword = criticalKeywords.some((keyword) =>
    cluster.clusterLabel.toLowerCase().includes(keyword)
  );
  const criticalBonus = hasCriticalKeyword ? 0.3 : 0;
  
  // Add smaller jitter for fine-tuning vertical position
  const jitterHash = hashString(cluster.clusterLabel + 'jitter');
  const jitter = ((jitterHash % 200) / 200) * 0.2 - 0.1; // -0.1 to 0.1
  
  const urgency = baseUrgency + countFactor * 0.2 + criticalBonus * 0.2 + jitter;
  // Constrain to 0.08 to 0.92 to keep bubbles inside (accounting for max radius ~14px and padding)
  return Math.min(Math.max(urgency, 0.08), 0.92);
}

// Calculate pressure score (0-10)
function calculatePressure(totalCount: number, maxCount: number, urgency: number): number {
  const volumeFactor = (totalCount / Math.max(maxCount, 1)) * 5;
  const urgencyFactor = urgency * 5;
  return Math.min(Math.max(volumeFactor + urgencyFactor, 0), 10);
}

// Calculate backlog percent (mock - based on count)
function calculateBacklogPercent(totalCount: number, maxCount: number): number {
  return (totalCount / Math.max(maxCount, 1)) * 100;
}

type BubbleInput = BubbleDataPoint & {
  meta: {
    clusterLabel: string;
    mainTopic: string;
    totalCount: number;
    channels: ChannelData[];
    dominantChannel: string;
    dominantChannelColor: string;
    pressureScore: number;
    sentiment: number;
    urgency: number;
    backlogPercent: number;
  };
};

function calcRadius(backlogPercent: number) {
  // backlogPercent is 0-100, normalize to 0-1 (same as PressureScatterMap)
  const normalized = Math.max(0, Math.min(backlogPercent / 100, 1));
  const base = Math.sqrt(normalized) * 15; // Reduced from 25 to 15
  const radius = Math.min(Math.max(base, 3), 14); // Reduced min from 4 to 3, max from 22 to 14
  return radius;
}

export function ImperfectOrderDistribution({ data }: ImperfectOrderDistributionProps) {
  const [selectedMacro, setSelectedMacro] = useState<string>('All');
  const [selectedChannel, setSelectedChannel] = useState<string>('All');
  const [isMacroDropdownOpen, setIsMacroDropdownOpen] = useState(false);
  const [isChannelDropdownOpen, setIsChannelDropdownOpen] = useState(false);
  const macroDropdownRef = useRef<HTMLDivElement>(null);
  const channelDropdownRef = useRef<HTMLDivElement>(null);

  // Debug: Log incoming data
  useEffect(() => {
    console.log('ImperfectOrderDistribution: Received data', {
      dataLength: data?.length || 0,
      firstItem: data?.[0] || null,
    });
  }, [data]);

  // Calculate max count for scaling
  const maxCount = useMemo(() => {
    if (!data || data.length === 0) return 1;
    return Math.max(...data.map((d) => d.totalCount), 1);
  }, [data]);

  // Get all unique channels from data
  const allChannels = useMemo(() => {
    const channels = new Set<string>();
    data.forEach((cluster) => {
      cluster.channels.forEach((ch) => {
        const normalized = normalizeChannel(ch.channel);
        channels.add(normalized);
      });
    });
    return Array.from(channels).sort();
  }, [data]);

  // Filter data based on selected macro and channel
  const filteredData = useMemo(() => {
    let result = data;

    // Filter by macro
    if (selectedMacro !== 'All') {
      result = result.filter((cluster) => cluster.mainTopic === selectedMacro);
    }

    // Filter by channel
    if (selectedChannel !== 'All') {
      result = result.filter((cluster) =>
        cluster.channels.some((ch) => normalizeChannel(ch.channel) === selectedChannel)
      );
    }

    return result;
  }, [data, selectedMacro, selectedChannel]);

  // Process data for bubble chart - convert to sentiment/urgency format
  const processed = useMemo(() => {
    if (!filteredData || filteredData.length === 0) {
      console.warn('ImperfectOrderDistribution: No filtered data', {
        dataLength: data.length,
        selectedMacro,
        filteredDataLength: filteredData.length,
      });
      return [];
    }

    const result = filteredData.map<BubbleInput>((cluster, index) => {
      // Determine dominant channel (channel with highest count) - for tooltip display
      const dominantChannelData = cluster.channels.reduce((max, ch) =>
        ch.count > max.count ? ch : max
      );
      const dominantChannel = normalizeChannel(dominantChannelData.channel);

      // Use macro topic color instead of channel color
      const macroColor = MACRO_COLORS[cluster.mainTopic] || '#888888';

      // Calculate metrics with jitter to reduce overlap
      const sentiment = calculateSentiment(cluster, index);
      const urgency = calculateUrgency(cluster, index);
      const backlogPercent = calculateBacklogPercent(cluster.totalCount, maxCount);
      const pressureScore = calculatePressure(cluster.totalCount, maxCount, urgency);
      const radius = calcRadius(backlogPercent);

      // Normalize all channels
      const normalizedChannels = cluster.channels.map((ch) => ({
        ...ch,
        channel: normalizeChannel(ch.channel),
      }));

      return {
        x: sentiment,
        y: urgency,
        r: radius,
        meta: {
          clusterLabel: cluster.clusterLabel,
          mainTopic: cluster.mainTopic,
          totalCount: cluster.totalCount,
          channels: normalizedChannels, // All channels for this bubble
          dominantChannel,
          dominantChannelColor: macroColor, // Use macro color
          pressureScore,
          sentiment,
          urgency,
          backlogPercent,
        },
      };
    });

    console.log('ImperfectOrderDistribution: Processed bubbles', {
      count: result.length,
      firstBubble: result[0] ? {
        x: result[0].x,
        y: result[0].y,
        r: result[0].r,
        label: result[0].meta.clusterLabel,
      } : null,
    });

    return result;
  }, [filteredData, maxCount, selectedMacro, data.length]);

  // Chart data
  const chartData = useMemo<ChartData<'bubble', BubbleInput[]>>(() => {
    if (!processed || processed.length === 0) {
      return {
        datasets: [
          {
            label: 'Micro Clusters',
            data: [],
          },
        ],
      };
    }

    return {
      datasets: [
        {
          label: 'Micro Clusters',
          data: processed,
          backgroundColor: processed.map(
            (point) => (point.meta.dominantChannelColor || '#888888') + 'B3'
          ),
          borderColor: processed.map(
            (point) => MACRO_SHADOWS[point.meta.mainTopic] || 'rgba(136,136,136,0.55)'
          ),
          borderWidth: processed.map((point) =>
            1 + Math.min(Math.max(point.meta.pressureScore / 10, 0), 1) * 4
          ),
          hoverBackgroundColor: processed.map(
            (point) => point.meta.dominantChannelColor || '#888888'
          ),
          hoverBorderColor: processed.map(
            (point) => point.meta.dominantChannelColor || '#888888'
          ),
        },
      ],
    };
  }, [processed]);

  // Chart options - exactly like Intent Landscape Map
  const options = useMemo<ChartOptions<'bubble'>>(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 20,
          right: 20,
          top: 20,
          bottom: 20,
        },
      },
      scales: {
        x: {
          min: 1,
          max: 5,
          ticks: {
            color: '#9ca3af',
            stepSize: 1,
            callback: (value) => Number(value).toFixed(0),
            autoSkip: false,
          },
          title: {
            display: true,
            text: 'Sentiment (Happy → Frustrated)',
            color: '#d1d5db',
            font: { size: 12 },
          },
          grid: {
            color: 'rgba(148,163,184,0.2)',
          },
        },
        y: {
          min: 0,
          max: 1,
          title: {
            display: true,
            text: 'Urgency Index',
            color: '#d1d5db',
            font: { size: 12 },
          },
          ticks: {
            color: '#9ca3af',
            callback: (value) => `${Math.round(Number(value) * 100)}%`,
          },
          grid: {
            color: 'rgba(148,163,184,0.2)',
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          mode: 'nearest',
          intersect: false,
          backgroundColor: 'rgba(15,23,42,0.9)',
          borderColor: 'rgba(148,163,184,0.25)',
          borderWidth: 1,
          titleColor: '#f9fafb',
          bodyColor: '#e5e7eb',
          padding: 12,
          callbacks: {
            title: (items) => {
              const datum = items[0]?.raw as BubbleInput | undefined;
              return datum?.meta.clusterLabel ?? '';
            },
            label: (context) => {
              const datum = context.raw as BubbleInput;
              const { meta } = datum;
              
              // Format channels list - show all channels for this micro
              const channelsList = meta.channels
                .map((ch) => `${ch.channel} (${ch.count})`)
                .join(', ');

              const labels = [
                `Sentiment: ${meta.sentiment.toFixed(1)}`,
                `Urgency: ${(meta.urgency * 100).toFixed(0)}%`,
                `Pressure: ${meta.pressureScore.toFixed(1)}`,
                `Channels: ${channelsList}`,
              ];
              return labels;
            },
          },
        },
      },
      elements: {
        point: {
          radius: (ctx) => {
            const datum = ctx.raw as BubbleInput;
            return datum?.r ?? 0;
          },
          hoverRadius: (ctx) => {
            const datum = ctx.raw as BubbleInput;
            const base = datum?.r ?? 0;
            return base * 1.2;
          },
          // Clip bubbles to chart area
          clip: true,
        },
      },
    };
  }, [filteredData]);

  // Glow plugin for pressure effect - exactly like Intent Landscape Map
  const glowPlugin = useMemo(
    () => {
      // Ensure MACRO_SHADOWS is in scope
      const shadowColors = MACRO_SHADOWS;
      
      return {
        id: 'pressureGlow',
        beforeDatasetsDraw(chart: ChartJS) {
          const { ctx } = chart;
          chart.getDatasetMeta(0).data.forEach((element, index) => {
            const datum = processed[index];
            if (!datum) return;
            const glow = Math.min(Math.max(datum.meta.pressureScore / 10, 0), 1);
            ctx.save();
            ctx.shadowColor = shadowColors[datum.meta.mainTopic] || 'rgba(136,136,136,0.55)';
            ctx.shadowBlur = 15 + glow * 25;
            ctx.globalCompositeOperation = 'lighter';
            if (typeof (element as any)?.draw === 'function') {
              (element as any).draw(ctx);
            }
            ctx.restore();
          });
        },
      };
    },
    [processed]
  );

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    const activeMicros = filteredData.length;
    const avgPressure =
      filteredData.length > 0
        ? filteredData.reduce((sum, cluster, index) => {
            const urgency = calculateUrgency(cluster, index);
            return sum + calculatePressure(cluster.totalCount, maxCount, urgency);
          }, 0) / filteredData.length
        : 0;

    // Top pressure nodes (top 5 by pressure score)
    const topPressureNodes = [...filteredData]
      .map((cluster, index) => {
        const urgency = calculateUrgency(cluster, index);
        const pressure = calculatePressure(cluster.totalCount, maxCount, urgency);
        const dominantChannelData = cluster.channels.reduce((max, ch) =>
          ch.count > max.count ? ch : max
        );
        const dominantChannel = normalizeChannel(dominantChannelData.channel);
        return {
          clusterLabel: cluster.clusterLabel,
          dominantChannel,
          pressure,
        };
      })
      .sort((a, b) => b.pressure - a.pressure)
      .slice(0, 5)
      .map((node) => ({
        ...node,
        pressure: node.pressure.toFixed(1),
      }));

    // Get active macro count
    const activeMacros = new Set(filteredData.map((c) => c.mainTopic)).size;

    return {
      activeMicros,
      avgPressure: avgPressure.toFixed(1),
      topPressureNodes,
      activeMacros,
    };
  }, [filteredData, maxCount]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        macroDropdownRef.current &&
        !macroDropdownRef.current.contains(event.target as Node)
      ) {
        setIsMacroDropdownOpen(false);
      }
      if (
        channelDropdownRef.current &&
        !channelDropdownRef.current.contains(event.target as Node)
      ) {
        setIsChannelDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Card className="border border-white/10 bg-black/30 shadow-lg h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-sm font-semibold text-white">
              Imperfect Order Distribution
            </CardTitle>
            <CardDescription className="text-xs text-gray-400">
              High-level distribution of {filteredData.length}+ micro clusters
            </CardDescription>
          </div>

          {/* Channel Filter Dropdown - Top Right */}
          <div className="relative" ref={channelDropdownRef}>
            <button
              onClick={() => setIsChannelDropdownOpen(!isChannelDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 bg-[#1a1a1a] text-gray-300 border border-[#2a2a2a] hover:border-[#3a3a3a] min-w-[140px] justify-between"
            >
              <span>{selectedChannel}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                  isChannelDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isChannelDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg shadow-xl z-50 overflow-hidden">
                <div className="py-2">
                  <button
                    onClick={() => {
                      setSelectedChannel('All');
                      setIsChannelDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-200 flex items-center gap-3 ${
                      selectedChannel === 'All'
                        ? 'bg-[#b90abd]/20 text-white'
                        : 'text-gray-300 hover:bg-[#1a1a1a] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      {selectedChannel === 'All' && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#b90abd] shrink-0" />
                      )}
                      {selectedChannel !== 'All' && (
                        <div className="w-1.5 h-1.5 rounded-full shrink-0" />
                      )}
                      <span className={selectedChannel === 'All' ? 'font-medium' : ''}>
                        All
                      </span>
                    </div>
                  </button>
                  {allChannels.map((channel) => (
                    <button
                      key={channel}
                      onClick={() => {
                        setSelectedChannel(channel);
                        setIsChannelDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-200 flex items-center gap-3 ${
                        selectedChannel === channel
                          ? 'bg-[#b90abd]/20 text-white'
                          : 'text-gray-300 hover:bg-[#1a1a1a] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        {selectedChannel === channel ? (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#b90abd] shrink-0" />
                        ) : (
                          <div
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: CHANNEL_COLORS[channel] || '#888888' }}
                          />
                        )}
                        <span className={selectedChannel === channel ? 'font-medium' : ''}>
                          {channel}
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
      <CardContent className="p-4 flex-1 flex flex-col overflow-hidden">
        {/* Macro Filter - Similar to Channel Filter in Intent Landscape Map */}
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-gray-300">
          <span className="font-semibold">Macro Topic •</span>

          {/* "All" filter button */}
          <button
            onClick={() => setSelectedMacro('All')}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-all ${
              selectedMacro === 'All'
                ? 'bg-white/10 border border-white/20 opacity-100'
                : 'opacity-40 hover:opacity-60 border border-transparent'
            } hover:bg-white/5 cursor-pointer`}
            title={selectedMacro === 'All' ? 'Showing all macros' : 'Show all macros'}
          >
            <span className="text-gray-300">All</span>
          </button>

          {/* Individual macro filter buttons */}
          {MACRO_TOPICS.map((macro) => {
            const isSelected = selectedMacro === macro;
            const macroCount = data.filter((c) => c.mainTopic === macro).length;
            const macroColor = MACRO_COLORS[macro] || '#888888';
            const shortName = macro.split(' ')[0];

            return (
              <button
                key={macro}
                onClick={() => setSelectedMacro(isSelected ? 'All' : macro)}
                className={`flex items-center gap-1 px-2 py-1 rounded transition-all ${
                  isSelected
                    ? 'bg-white/10 border border-white/20 opacity-100'
                    : 'opacity-40 hover:opacity-60 border border-transparent'
                } hover:bg-white/5 cursor-pointer`}
                title={
                  isSelected
                    ? `Showing only ${macro}. Click to show all.`
                    : `Show only ${macro}`
                }
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: macroColor }}
                />
                <span className="text-gray-300">
                  {shortName} {macroCount > 0 && `(${macroCount})`}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bubble Chart */}
        <div style={{ height: '260px', width: '100%', overflow: 'hidden', position: 'relative' }}>
          <Bubble
            key={`bubble-chart-${processed.length}-${selectedMacro}-${selectedChannel}`}
            data={chartData}
            options={options}
            plugins={[glowPlugin]}
            updateMode="resize"
          />
        </div>

        {/* Legend */}
        <div className="mt-2 flex flex-wrap gap-1 text-[9px] text-gray-400 mb-4">
          <span>X: Sentiment</span>
          <span>•</span>
          <span>Y: Urgency</span>
          <span>•</span>
          <span>Size: Volume</span>
          <span>•</span>
          <span>Glow: Pressure</span>
        </div>

        {/* Statistics Panel - Same as Intent Landscape Map */}
        <div className="rounded-lg border border-white/10 bg-black/40 p-4 space-y-4">
          {/* Scope */}
          <div>
            <div className="text-[10px] uppercase tracking-wide text-gray-400 mb-1">
              Scope
            </div>
            <div className="text-2xl font-bold text-white">{summaryMetrics.activeMicros}</div>
            <div className="text-[10px] text-gray-500">
              Active micros mapped across {summaryMetrics.activeMacros}{' '}
              {summaryMetrics.activeMacros === 1 ? 'macro' : 'macros'}
              {selectedMacro !== 'All' && ` (${selectedMacro})`}
            </div>
          </div>

          {/* Avg Pressure */}
          <div>
            <div className="text-[10px] uppercase tracking-wide text-gray-400 mb-1">
              Avg Pressure
            </div>
            <div className="text-xl font-bold text-white">
              {summaryMetrics.avgPressure}
            </div>
            <div className="text-[10px] text-gray-500">
              Weighted by sentiment tension & backlog
            </div>
          </div>

          {/* Top Pressure Nodes */}
          <div>
            <div className="text-[10px] uppercase tracking-wide text-gray-400 mb-2">
              Top Pressure Nodes
            </div>
            <div className="space-y-1 text-[10px]">
              {summaryMetrics.topPressureNodes.length > 0 ? (
                summaryMetrics.topPressureNodes.map((node, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-gray-300 truncate flex-1 mr-2">
                      {node.clusterLabel}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-gray-400">{node.dominantChannel}</span>
                      <span className="text-white font-medium">{node.pressure}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-[10px]">No data available</div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
