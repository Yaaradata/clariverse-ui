'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

interface DataPoint {
  id: string;
  category: string;
  sentiment: number;
  urgency: number;
  volume: number;
  pressure: number;
  trigger: string;
  channel: string;
}

interface RedFlagDistributionChartProps {
  isDarkMode?: boolean;
}

// Category colors - matching reference style
const CATEGORY_COLORS: Record<string, string> = {
  'Sanctions': '#ef4444',
  'Structuring': '#f97316',
  'Money Mule': '#eab308',
  'Scam Victim': '#a855f7',
  'Third-Party': '#22d3ee'
};

const CATEGORY_SHADOWS: Record<string, string> = {
  'Sanctions': 'rgba(239, 68, 68, 0.55)',
  'Structuring': 'rgba(249, 115, 22, 0.55)',
  'Money Mule': 'rgba(234, 179, 8, 0.55)',
  'Scam Victim': 'rgba(168, 85, 247, 0.55)',
  'Third-Party': 'rgba(34, 211, 238, 0.55)'
};

// Channel colors for reference
const CHANNEL_COLORS: Record<string, string> = {
  Voice: '#ef4444',
  Chat: '#10b981',
  Email: '#5332ff',
  Tickets: '#f59e0b',
};

// Data points spread across the chart
const SCATTER_DATA: DataPoint[] = [
  // Sanctions - Red
  { id: 's1', category: 'Sanctions', sentiment: 2.0, urgency: 92, volume: 55, pressure: 8.2, trigger: 'Family transfer to Iran', channel: 'Voice' },
  { id: 's2', category: 'Sanctions', sentiment: 1.4, urgency: 45, volume: 35, pressure: 9.1, trigger: 'North Korea mention', channel: 'Voice' },
  { id: 's3', category: 'Sanctions', sentiment: 2.3, urgency: 85, volume: 45, pressure: 7.5, trigger: 'Cuba remittance request', channel: 'Chat' },
  { id: 's4', category: 'Sanctions', sentiment: 4.2, urgency: 78, volume: 40, pressure: 8.8, trigger: 'Syria connection', channel: 'Voice' },
  
  // Structuring - Orange
  { id: 'st1', category: 'Structuring', sentiment: 2.5, urgency: 72, volume: 50, pressure: 6.8, trigger: 'Reporting limit question', channel: 'Chat' },
  { id: 'st2', category: 'Structuring', sentiment: 2.8, urgency: 55, volume: 42, pressure: 7.2, trigger: 'Multiple $9K deposits', channel: 'Voice' },
  { id: 'st3', category: 'Structuring', sentiment: 3.0, urgency: 62, volume: 48, pressure: 7.5, trigger: 'Cash threshold inquiry', channel: 'Chat' },
  { id: 'st4', category: 'Structuring', sentiment: 3.3, urgency: 48, volume: 38, pressure: 5.9, trigger: 'Split transaction request', channel: 'Tickets' },
  { id: 'st5', category: 'Structuring', sentiment: 4.5, urgency: 35, volume: 32, pressure: 6.5, trigger: 'Daily limit question', channel: 'Email' },
  
  // Money Mule - Yellow
  { id: 'm1', category: 'Money Mule', sentiment: 3.5, urgency: 68, volume: 45, pressure: 9.2, trigger: 'Work from home transfer', channel: 'Voice' },
  { id: 'm2', category: 'Money Mule', sentiment: 4.0, urgency: 58, volume: 38, pressure: 8.5, trigger: 'Unknown sender funds', channel: 'Voice' },
  { id: 'm3', category: 'Money Mule', sentiment: 3.8, urgency: 52, volume: 35, pressure: 9.5, trigger: 'Quick transfer request', channel: 'Chat' },
  
  // Scam Victim - Purple
  { id: 'sv1', category: 'Scam Victim', sentiment: 4.2, urgency: 88, volume: 52, pressure: 8.8, trigger: 'IRS phone call', channel: 'Voice' },
  { id: 'sv2', category: 'Scam Victim', sentiment: 4.5, urgency: 82, volume: 48, pressure: 8.2, trigger: 'Tech support scam', channel: 'Voice' },
  { id: 'sv3', category: 'Scam Victim', sentiment: 4.8, urgency: 75, volume: 42, pressure: 7.5, trigger: 'Romance scam transfer', channel: 'Chat' },
  { id: 'sv4', category: 'Scam Victim', sentiment: 4.6, urgency: 68, volume: 45, pressure: 9.0, trigger: 'Grandparent scam', channel: 'Voice' },
  { id: 'sv5', category: 'Scam Victim', sentiment: 4.3, urgency: 62, volume: 38, pressure: 8.5, trigger: 'Lottery/Prize scam', channel: 'Email' },
  { id: 'sv6', category: 'Scam Victim', sentiment: 4.9, urgency: 85, volume: 55, pressure: 7.8, trigger: 'Investment scam', channel: 'Voice' },
  
  // Third-Party - Cyan
  { id: 't1', category: 'Third-Party', sentiment: 1.8, urgency: 55, volume: 42, pressure: 5.5, trigger: 'Employer transfer request', channel: 'Email' },
  { id: 't2', category: 'Third-Party', sentiment: 1.5, urgency: 42, volume: 35, pressure: 4.8, trigger: 'Business partner funds', channel: 'Tickets' },
  { id: 't3', category: 'Third-Party', sentiment: 2.0, urgency: 65, volume: 48, pressure: 6.2, trigger: 'Family member account', channel: 'Voice' },
  { id: 't4', category: 'Third-Party', sentiment: 2.2, urgency: 48, volume: 32, pressure: 5.0, trigger: 'Friend behalf transfer', channel: 'Chat' },
  { id: 't5', category: 'Third-Party', sentiment: 1.2, urgency: 35, volume: 28, pressure: 4.2, trigger: 'Authorized user request', channel: 'Email' }
];

type BubbleInput = BubbleDataPoint & {
  meta: DataPoint;
};

function calcRadius(volume: number) {
  const minRadius = 3;
  const maxRadius = 14;
  const minVolume = 25;
  const maxVolume = 60;
  const normalized = (volume - minVolume) / (maxVolume - minVolume);
  return minRadius + normalized * (maxRadius - minRadius);
}

export function RedFlagDistributionChart({ isDarkMode = false }: RedFlagDistributionChartProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedChannel, setSelectedChannel] = useState<string>('All');
  const [isChannelDropdownOpen, setIsChannelDropdownOpen] = useState(false);
  const channelDropdownRef = useRef<HTMLDivElement>(null);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    SCATTER_DATA.forEach(d => {
      counts[d.category] = (counts[d.category] || 0) + 1;
    });
    return counts;
  }, []);

  const categories = ['Sanctions', 'Structuring', 'Money Mule', 'Scam Victim', 'Third-Party'];

  // Get all unique channels
  const allChannels = useMemo(() => {
    const channels = new Set<string>();
    SCATTER_DATA.forEach(d => channels.add(d.channel));
    return Array.from(channels).sort();
  }, []);

  // Filter data based on selected category and channel
  const filteredData = useMemo(() => {
    let result = SCATTER_DATA;

    if (selectedCategory !== 'All') {
      result = result.filter(d => d.category === selectedCategory);
    }

    if (selectedChannel !== 'All') {
      result = result.filter(d => d.channel === selectedChannel);
    }

    return result;
  }, [selectedCategory, selectedChannel]);

  // Process data for bubble chart
  const processed = useMemo(() => {
    return filteredData.map<BubbleInput>((point) => {
      const radius = calcRadius(point.volume);
      const categoryColor = CATEGORY_COLORS[point.category] || '#888888';

      return {
        x: point.sentiment,
        y: point.urgency / 100, // Convert to 0-1 range
        r: radius,
        meta: point,
      };
    });
  }, [filteredData]);

  // Chart data
  const chartData = useMemo<ChartData<'bubble', BubbleInput[]>>(() => {
    return {
      datasets: [
        {
          label: 'Red Flags',
          data: processed,
          backgroundColor: processed.map(
            (point) => (CATEGORY_COLORS[point.meta.category] || '#888888') + 'B3'
          ),
          borderColor: processed.map(
            (point) => CATEGORY_SHADOWS[point.meta.category] || 'rgba(136,136,136,0.55)'
          ),
          borderWidth: processed.map((point) =>
            1 + Math.min(Math.max(point.meta.pressure / 10, 0), 1) * 4
          ),
          hoverBackgroundColor: processed.map(
            (point) => CATEGORY_COLORS[point.meta.category] || '#888888'
          ),
          hoverBorderColor: processed.map(
            (point) => CATEGORY_COLORS[point.meta.category] || '#888888'
          ),
        },
      ],
    };
  }, [processed]);

  // Chart options
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
              return datum?.meta.trigger ?? '';
            },
            label: (context) => {
              const datum = context.raw as BubbleInput;
              const { meta } = datum;
              
              const labels = [
                `Category: ${meta.category}`,
                `Sentiment: ${meta.sentiment.toFixed(1)}`,
                `Urgency: ${meta.urgency}%`,
                `Pressure: ${meta.pressure.toFixed(1)}`,
                `Channel: ${meta.channel}`,
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
          clip: true,
        },
      },
    };
  }, []);

  // Glow plugin for pressure effect
  const glowPlugin = useMemo(
    () => {
      const shadowColors = CATEGORY_SHADOWS;
      
      return {
        id: 'pressureGlow',
        beforeDatasetsDraw(chart: ChartJS) {
          const { ctx } = chart;
          chart.getDatasetMeta(0).data.forEach((element, index) => {
            const datum = processed[index];
            if (!datum) return;
            const glow = Math.min(Math.max(datum.meta.pressure / 10, 0), 1);
            ctx.save();
            ctx.shadowColor = shadowColors[datum.meta.category] || 'rgba(136,136,136,0.55)';
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
    const activeFlags = filteredData.length;
    const avgPressure = filteredData.length > 0
      ? filteredData.reduce((sum, d) => sum + d.pressure, 0) / filteredData.length
      : 0;

    const topPressureNodes = [...filteredData]
      .sort((a, b) => b.pressure - a.pressure)
      .slice(0, 5)
      .map((node) => ({
        trigger: node.trigger,
        channel: node.channel,
        pressure: node.pressure.toFixed(1),
      }));

    const activeCategories = new Set(filteredData.map((d) => d.category)).size;

    return {
      activeFlags,
      avgPressure: avgPressure.toFixed(1),
      topPressureNodes,
      activeCategories,
    };
  }, [filteredData]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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
    <Card className="shadow-lg h-full flex flex-col" style={{ backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : '#FFFFFF', borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#E5E5E5', borderWidth: '1px', borderStyle: 'solid' }}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-sm font-semibold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
              Red Flag Distribution
            </CardTitle>
          </div>

          {/* Channel Filter Dropdown - Top Right */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold" style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}>Channel •</span>
            <div className="relative" ref={channelDropdownRef}>
              <button
                onClick={() => setIsChannelDropdownOpen(!isChannelDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 min-w-[140px] justify-between"
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
                <span>{selectedChannel}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                    isChannelDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isChannelDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 rounded-lg shadow-xl z-50 overflow-hidden" style={{ backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF', borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5', borderWidth: '1px', borderStyle: 'solid' }}>
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setSelectedChannel('All');
                        setIsChannelDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm transition-all duration-200 flex items-center gap-3"
                      style={{
                        backgroundColor: selectedChannel === 'All' ? 'rgba(185, 10, 189, 0.2)' : 'transparent',
                        color: selectedChannel === 'All' ? (isDarkMode ? '#FFFFFF' : '#010101') : (isDarkMode ? '#D6D9D8' : '#4a4a4a'),
                      }}
                      onMouseEnter={(e) => {
                        if (selectedChannel !== 'All') {
                          e.currentTarget.style.backgroundColor = isDarkMode ? '#1a1a1a' : '#f8f9fa';
                          e.currentTarget.style.color = isDarkMode ? '#FFFFFF' : '#010101';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedChannel !== 'All') {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = isDarkMode ? '#D6D9D8' : '#4a4a4a';
                        }
                      }}
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
                        className="w-full text-left px-4 py-2.5 text-sm transition-all duration-200 flex items-center gap-3"
                        style={{
                          backgroundColor: selectedChannel === channel ? 'rgba(185, 10, 189, 0.2)' : 'transparent',
                          color: selectedChannel === channel ? (isDarkMode ? '#FFFFFF' : '#010101') : (isDarkMode ? '#D6D9D8' : '#4a4a4a'),
                        }}
                        onMouseEnter={(e) => {
                          if (selectedChannel !== channel) {
                            e.currentTarget.style.backgroundColor = isDarkMode ? '#1a1a1a' : '#f8f9fa';
                            e.currentTarget.style.color = isDarkMode ? '#FFFFFF' : '#010101';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedChannel !== channel) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = isDarkMode ? '#D6D9D8' : '#4a4a4a';
                          }
                        }}
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
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-1 flex flex-col overflow-hidden">
        {/* Category Filter */}
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs" style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}>
          <span className="font-semibold">Category •</span>

          {/* "All" filter button */}
          <button
            onClick={() => setSelectedCategory('All')}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-all ${
              selectedCategory === 'All'
                ? 'bg-white/10 border border-white/20 opacity-100'
                : 'opacity-40 hover:opacity-60 border border-transparent'
            } hover:bg-white/5 cursor-pointer`}
            title={selectedCategory === 'All' ? 'Showing all categories' : 'Show all categories'}
          >
            <span style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}>All</span>
          </button>

          {/* Individual category filter buttons */}
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const catCount = categoryCounts[cat] || 0;
            const catColor = CATEGORY_COLORS[cat] || '#888888';

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(isSelected ? 'All' : cat)}
                className={`flex items-center gap-1 px-2 py-1 rounded transition-all ${
                  isSelected
                    ? 'bg-white/10 border border-white/20 opacity-100'
                    : 'opacity-40 hover:opacity-60 border border-transparent'
                } hover:bg-white/5 cursor-pointer`}
                title={
                  isSelected
                    ? `${cat}. Click to show all.`
                    : `${cat}`
                }
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: catColor }}
                />
                <span style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}>
                  {cat} {catCount > 0 && `(${catCount})`}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bubble Chart */}
        <div style={{ height: '260px', width: '100%', overflow: 'hidden', position: 'relative' }}>
          <Bubble
            key={`bubble-chart-${processed.length}-${selectedCategory}-${selectedChannel}`}
            data={chartData}
            options={options}
            plugins={[glowPlugin]}
            updateMode="resize"
          />
        </div>

        {/* Legend */}
        <div className="mt-2 flex flex-wrap gap-1 text-[9px] mb-4" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
          <span>X: Sentiment</span>
          <span>•</span>
          <span>Y: Urgency</span>
          <span>•</span>
          <span>Size: Volume</span>
          <span>•</span>
          <span>Glow: Pressure</span>
        </div>

        {/* Statistics Panel */}
        <div className="rounded-lg p-4 space-y-4" style={{ backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.4)' : '#f8f9fa', borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#E5E5E5', borderWidth: '1px', borderStyle: 'solid' }}>
          {/* Scope */}
          <div>
            <div className="text-[10px] uppercase tracking-wide mb-1" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
              Scope
            </div>
            <div className="text-2xl font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>{summaryMetrics.activeFlags}</div>
            <div className="text-[10px]" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
              Active flags mapped across {summaryMetrics.activeCategories}{' '}
              {summaryMetrics.activeCategories === 1 ? 'category' : 'categories'}
            </div>
          </div>

          {/* Avg Pressure */}
          <div>
            <div className="text-[10px] uppercase tracking-wide mb-1" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
              Avg Pressure
            </div>
            <div className="text-xl font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
              {summaryMetrics.avgPressure}
            </div>
            <div className="text-[10px]" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
              Weighted by sentiment tension & backlog
            </div>
          </div>

          {/* Top Pressure Nodes */}
          <div>
            <div className="text-[10px] uppercase tracking-wide mb-2" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
              Top Pressure Nodes
            </div>
            <div className="space-y-1 text-[10px]">
              {summaryMetrics.topPressureNodes.length > 0 ? (
                summaryMetrics.topPressureNodes.map((node, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="truncate flex-1 mr-2" style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}>
                      {node.trigger}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span style={{ color: isDarkMode ? '#939394' : '#666666' }}>{node.channel}</span>
                      <span className="font-medium" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>{node.pressure}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-[10px]" style={{ color: isDarkMode ? '#939394' : '#666666' }}>No data available</div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Demo wrapper
export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <div 
      className="min-h-screen p-8 transition-colors duration-200"
      style={{ 
        backgroundColor: isDarkMode ? '#0a0a0a' : '#f5f5f5'
      }}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-8">
          <h1 
            className="text-3xl font-bold"
            style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
          >
            Red Flag Distribution
          </h1>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF',
              color: isDarkMode ? '#FFFFFF' : '#010101',
              border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`
            }}
          >
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        <RedFlagDistributionChart isDarkMode={isDarkMode} />
      </div>
    </div>
  );
}