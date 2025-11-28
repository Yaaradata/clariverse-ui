'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  UserCheck,
  ShieldCheck,
  Banknote,
  Globe,
  Building2,
  AlertCircle,
  Search,
  FileBarChart,
  Mail,
  MessageSquare,
  Ticket,
  Mic,
  Share2,
  X
} from 'lucide-react';
import { ViolationData, getSeverityColor } from '@/lib/compliance/complianceData';

interface ChannelBreakdown {
  email: number;
  chat: number;
  ticket: number;
  voice: number;
  social: number;
}

interface ViolationCategoryChartProps {
  data: ViolationData[];
  isDarkMode?: boolean;
}

// Generate channel breakdown based on category total
const getChannelBreakdown = (category: string, total: number): ChannelBreakdown => {
  const distributions: Record<string, number[]> = {
    'Sanctions / PEP Screening': [0.15, 0.20, 0.35, 0.25, 0.05],
    'AML Compliance': [0.10, 0.15, 0.30, 0.40, 0.05],
    'Customer Identification Program': [0.20, 0.30, 0.20, 0.25, 0.05],
    'Regulatory Reporting': [0.40, 0.10, 0.35, 0.10, 0.05],
    'Data Privacy Compliance': [0.25, 0.25, 0.20, 0.15, 0.15],
    'Cross-Border Compliance': [0.30, 0.15, 0.25, 0.20, 0.10],
    'Vendor Compliance': [0.35, 0.20, 0.30, 0.10, 0.05]
  };
  
  const dist = distributions[category] || [0.20, 0.20, 0.20, 0.20, 0.20];
  
  return {
    email: Math.round(total * dist[0]),
    chat: Math.round(total * dist[1]),
    ticket: Math.round(total * dist[2]),
    voice: Math.round(total * dist[3]),
    social: Math.round(total * dist[4])
  };
};

export function ViolationCategoryChart({ data, isDarkMode = false }: ViolationCategoryChartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (hoveredIndex !== null && rowRefs.current[hoveredIndex] && containerRef.current) {
      const row = rowRefs.current[hoveredIndex];
      const container = containerRef.current;
      if (row) {
        const rowRect = row.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        setTooltipPosition({
          top: rowRect.bottom - containerRect.top + 8,
          left: 0
        });
      }
    }
  }, [hoveredIndex]);

  const maxCount = Math.max(...data.map(d => d.count));
  const totalViolations = data.reduce((sum, d) => sum + d.count, 0);

  const getCategoryIcon = (category: string, color: string) => {
    const iconProps = { className: "w-4 h-4", style: { color } };
    switch (category) {
      case 'Sanctions / PEP Screening': return <Search {...iconProps} />;
      case 'AML Compliance': return <Banknote {...iconProps} />;
      case 'Customer Identification Program': return <UserCheck {...iconProps} />;
      case 'Regulatory Reporting': return <FileBarChart {...iconProps} />;
      case 'Data Privacy Compliance': return <ShieldCheck {...iconProps} />;
      case 'Cross-Border Compliance': return <Globe {...iconProps} />;
      case 'Vendor Compliance': return <Building2 {...iconProps} />;
      default: return <AlertCircle {...iconProps} />;
    }
  };

  const channelConfig = [
    { key: 'email', label: 'Email', icon: Mail, color: '#3b82f6' },
    { key: 'chat', label: 'Chat', icon: MessageSquare, color: '#22c55e' },
    { key: 'ticket', label: 'Ticket', icon: Ticket, color: '#f97316' },
    { key: 'voice', label: 'Voice', icon: Mic, color: '#8b5cf6' },
    { key: 'social', label: 'Social', icon: Share2, color: '#ec4899' }
  ];

  const hoveredItem = hoveredIndex !== null ? data[hoveredIndex] : null;
  const hoveredChannelBreakdown = hoveredItem ? getChannelBreakdown(hoveredItem.category, hoveredItem.count) : null;
  const hoveredSeverityColor = hoveredItem ? getSeverityColor(hoveredItem.severity) : '#939394';

  return (
    <div
      ref={containerRef}
      className={`rounded-2xl p-6 transition-all duration-500 h-full flex flex-col relative ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{
        backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF',
        border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`,
        boxShadow: isDarkMode 
          ? '0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
          : '0 4px 24px rgba(0, 0, 0, 0.06)'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 
            className="text-lg font-bold mb-1"
            style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
          >
            Violations by Category
          </h3>
          <p className="text-xs" style={{ color: '#939394' }}>
            {totalViolations.toLocaleString()} total violations detected
          </p>
        </div>
        <div 
          className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5' }}
        >
          <AlertTriangle className="w-4 h-4" style={{ color: '#f97316' }} />
          <span className="text-xs font-medium" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
            Live Monitoring
          </span>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="space-y-4 flex-1">
        {data.map((item, index) => {
          const barWidth = (item.count / maxCount) * 100;
          const severityColor = getSeverityColor(item.severity);
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={item.category}
              ref={(el) => { rowRefs.current[index] = el; }}
              className={`transition-all duration-300 cursor-pointer ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Category Label Row */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="p-1.5 rounded-lg"
                    style={{ backgroundColor: `${severityColor}15` }}
                  >
                    {getCategoryIcon(item.category, severityColor)}
                  </div>
                  <span 
                    className="text-sm font-medium"
                    style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                  >
                    {item.category}
                  </span>
                  <span 
                    className="px-2 py-0.5 rounded text-xs font-medium uppercase"
                    style={{ 
                      backgroundColor: `${severityColor}20`,
                      color: severityColor
                    }}
                  >
                    {item.severity}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span 
                    className="text-sm font-bold tabular-nums"
                    style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                  >
                    {item.count.toLocaleString()}
                  </span>
                  <div 
                    className="flex items-center gap-1 text-xs font-medium"
                    style={{ color: item.trend > 0 ? '#ef4444' : '#22c55e' }}
                  >
                    {item.trend > 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>{Math.abs(item.trend)}%</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div 
                className="relative h-3 rounded-full overflow-hidden"
                style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#F0F0F0' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: isVisible ? `${barWidth}%` : '0%',
                    backgroundColor: severityColor,
                    boxShadow: isHovered ? `0 0 12px ${severityColor}80` : 'none',
                    transform: isHovered ? 'scaleY(1.2)' : 'scaleY(1)',
                    transitionDelay: `${index * 100}ms`
                  }}
                />
                {/* Percentage label */}
                <span 
                  className={`absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold transition-opacity duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                >
                  {item.percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t" style={{ borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5' }}>
        {['critical', 'high', 'medium', 'low'].map((severity) => (
          <div key={severity} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getSeverityColor(severity as any) }}
            />
            <span className="text-xs capitalize" style={{ color: '#939394' }}>
              {severity}
            </span>
          </div>
        ))}
      </div>

      {/* Fixed Channel Breakdown Tooltip - Rendered at component level */}
      {hoveredIndex !== null && hoveredItem && hoveredChannelBreakdown && (
        <div 
          className="absolute left-4 right-4 p-4 rounded-xl animate-in fade-in zoom-in-95 duration-200"
          style={{
            top: tooltipPosition.top,
            zIndex: 100,
            backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF',
            border: `2px solid ${hoveredSeverityColor}`,
            boxShadow: isDarkMode 
              ? `0 20px 60px rgba(0, 0, 0, 1), 0 0 0 1px ${hoveredSeverityColor}40`
              : `0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px ${hoveredSeverityColor}40`
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span 
                className="text-xs font-bold uppercase tracking-wide"
                style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
              >
                Channel Breakdown: {hoveredItem.category}
              </span>
              <span 
                className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                style={{ 
                  backgroundColor: hoveredSeverityColor,
                  color: '#FFFFFF'
                }}
              >
                {hoveredItem.count} total
              </span>
            </div>
            <button 
              onClick={() => setHoveredIndex(null)}
              className="p-1 rounded-lg hover:opacity-70 transition-opacity"
              style={{ color: '#939394' }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Horizontal Bars for each channel */}
          <div className="space-y-2.5">
            {channelConfig.map((channel) => {
              const Icon = channel.icon;
              const count = hoveredChannelBreakdown[channel.key as keyof ChannelBreakdown];
              const percentage = Math.round((count / hoveredItem.count) * 100);
              const maxChannelCount = Math.max(...Object.values(hoveredChannelBreakdown));
              const barWidth = (count / maxChannelCount) * 100;
              
              return (
                <div key={channel.key} className="flex items-center gap-3">
                  {/* Channel Icon & Label */}
                  <div className="flex items-center gap-2 w-20 flex-shrink-0">
                    <Icon className="w-4 h-4" style={{ color: channel.color }} />
                    <span 
                      className="text-xs font-medium"
                      style={{ color: isDarkMode ? '#FFFFFF' : '#333333' }}
                    >
                      {channel.label}
                    </span>
                  </div>
                  
                  {/* Thin Horizontal Bar */}
                  <div className="flex-1 flex items-center gap-2">
                    <div 
                      className="flex-1 h-2 rounded-full overflow-hidden"
                      style={{ backgroundColor: isDarkMode ? '#262626' : '#E8E8E8' }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ 
                          width: `${barWidth}%`,
                          backgroundColor: channel.color
                        }}
                      />
                    </div>
                    <span 
                      className="text-xs font-bold w-8 text-center"
                      style={{ color: channel.color }}
                    >
                      {count}
                    </span>
                  </div>
                  
                  {/* Percentage */}
                  <span 
                    className="text-[11px] font-medium w-10 text-right"
                    style={{ color: isDarkMode ? '#888888' : '#666666' }}
                  >
                    {percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
