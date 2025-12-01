'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
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
  Share2
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
  const [hoveredBar, setHoveredBar] = useState<{ categoryIndex: number; channel: string } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

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

  return (
    <div
      className={`rounded-2xl p-6 transition-all duration-500 flex flex-col overflow-hidden ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{
        backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF',
        border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`,
        boxShadow: isDarkMode 
          ? '0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
          : '0 4px 24px rgba(0, 0, 0, 0.06)',
        maxHeight: '600px'
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
        <button 
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90 hover:scale-105"
          style={{ 
            background: 'linear-gradient(135deg, #5332FF 0%, #7c3aed 100%)',
            color: '#FFFFFF',
            boxShadow: '0 4px 12px rgba(83, 50, 255, 0.3)'
          }}
        >
          <span>✨</span>
          Automated SAR Report
        </button>
      </div>

      {/* Bar Chart */}
      <div className="space-y-4 flex-1">
        {data.map((item, index) => {
          const barWidth = (item.count / maxCount) * 100;
          const severityColor = getSeverityColor(item.severity);
          const channelBreakdown = getChannelBreakdown(item.category, item.count);

          return (
            <div
              key={item.category}
              className={`transition-all duration-300 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
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

              {/* Segmented Progress Bar with Channels */}
              <div 
                className="relative h-3 rounded-full overflow-hidden"
                style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#F0F0F0' }}
              >
                <div 
                  className="h-full flex rounded-full overflow-hidden transition-all duration-700 ease-out"
                  style={{
                    width: isVisible ? `${barWidth}%` : '0%',
                    transitionDelay: `${index * 100}ms`
                  }}
                >
                  {channelConfig.map((channel, channelIndex) => {
                    const channelCount = channelBreakdown[channel.key as keyof ChannelBreakdown];
                    const channelPercentage = (channelCount / item.count) * 100;
                    const isHovered = hoveredBar?.categoryIndex === index && hoveredBar?.channel === channel.key;
                    
                    if (channelCount === 0) return null;
                    
                    return (
                      <div
                        key={channel.key}
                        className="h-full flex items-center justify-center relative group cursor-pointer transition-all duration-300"
                        style={{ 
                          width: `${channelPercentage}%`,
                          backgroundColor: channel.color,
                          opacity: isHovered ? 1 : 0.9,
                          transform: isHovered ? 'scaleY(1.3)' : 'scaleY(1)',
                          boxShadow: isHovered ? `inset 0 0 0 1px ${isDarkMode ? '#FFFFFF' : '#000000'}60` : 'none'
                        }}
                        onMouseEnter={() => setHoveredBar({ categoryIndex: index, channel: channel.key })}
                        onMouseLeave={() => setHoveredBar(null)}
                      >
                        {/* Show percentage inside bar only on hover */}
                        {isHovered && (
                          <span 
                            className="text-[9px] font-bold text-white z-10"
                            style={{ 
                              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {Math.round(channelPercentage)}%
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Channel Legend (replacing severity legend) */}
      <div className="mt-6 pt-4 border-t flex-shrink-0" style={{ borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5' }}>
        <div className="flex items-center justify-between gap-2 overflow-x-auto">
          <span className="text-xs font-semibold flex-shrink-0" style={{ color: '#939394' }}>
            Channels:
          </span>
          {channelConfig.map((channel) => {
            const Icon = channel.icon;
            return (
              <div key={channel.key} className="flex items-center gap-1 flex-shrink-0">
                <Icon className="w-3 h-3" style={{ color: channel.color }} />
                <span className="text-[11px]" style={{ color: '#939394' }}>
                  {channel.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}