'use client';

import { useState, useEffect } from 'react';
import { 
  AlertTriangle,
  ChevronDown,
  X,
  Filter
} from 'lucide-react';

export interface FraudPattern {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  channels: string[];
  detected: string;
  affected: number;
  exposure: number;
  riskScore: number;
  trend: number;
  description: string;
  aiSummary: string;
  rootCause: string;
  correctiveAction: string;
  icon: 'package' | 'user' | 'repeat' | 'shopping';
  relatedAgents: number;
  relatedPincodes: number;
}

interface AIPatternBrainProps {
  patterns: FraudPattern[];
  onViewCases?: (patternId: string) => void;
  onViewAgents?: (patternId: string) => void;
  onViewPincodes?: (patternId: string) => void;
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'CRITICAL': return 'bg-red-50 text-red-600 border-red-200 dark:bg-red-500 dark:text-white dark:border-red-500/30'; // 76-100
    case 'HIGH': return 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-500 dark:text-white dark:border-orange-500/30'; // 65-75
    case 'MEDIUM': return 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500 dark:text-black dark:border-amber-500/30'; // 50-64 (Yellow/Amber)
    case 'LOW': return 'bg-green-50 text-green-600 border-green-200 dark:bg-green-500 dark:text-white dark:border-green-500/30'; // 40-49 (Light Green/Teal)
    default: return 'bg-muted text-muted-foreground border-border';
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Fulfillment Fraud': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'Syndicated Claims': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'Asset Abuse': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'Incentive Fraud': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'Insider Collusion': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'Brand Extortion': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
    case '3rd Party Fraud': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'Policy Arbitrage': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

const formatCurrency = (value: number) => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  return `₹${value.toLocaleString()}`;
};

export default function AIPatternBrain({ 
  patterns, 
  onViewCases, 
  onViewAgents, 
  onViewPincodes 
}: AIPatternBrainProps) {
  const [expandedPatternId, setExpandedPatternId] = useState<string | null>(null);
  const [severityFilter, setSeverityFilter] = useState<'all' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('all');
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const checkTheme = () => {
      const theme = localStorage.getItem('theme');
      setIsDarkMode(theme === 'dark');
    };
    
    checkTheme();
    window.addEventListener('storage', checkTheme);
    
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => {
      window.removeEventListener('storage', checkTheme);
      observer.disconnect();
    };
  }, []);
  
  // Apply filters
  const filteredPatterns = patterns.filter(p => {
    return severityFilter === 'all' || p.severity === severityFilter;
  });
  
  const hasActiveFilters = severityFilter !== 'all';

  const toggleExpand = (patternId: string) => {
    setExpandedPatternId(expandedPatternId === patternId ? null : patternId);
  };
  
  const clearFilters = () => {
    setSeverityFilter('all');
  };

  const containerBg = isDarkMode ? 'rgb(13, 13, 13)' : 'rgb(255, 255, 255)';
  const containerBorder = isDarkMode ? 'rgb(31, 31, 31)' : 'rgb(229, 231, 235)';
  const textColor = isDarkMode ? 'rgb(243, 244, 246)' : 'rgb(17, 24, 39)';
  const subtextColor = isDarkMode ? 'rgb(156, 163, 175)' : 'rgb(75, 85, 99)';
  const labelColor = isDarkMode ? 'rgb(107, 114, 128)' : 'rgb(75, 85, 99)';
  const summaryBg = isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgb(243, 244, 246)';
  const summaryBorder = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgb(209, 213, 219)';
  const summaryTextColor = isDarkMode ? 'rgb(209, 213, 219)' : 'rgb(55, 65, 81)';
  const actionTextColor = isDarkMode ? 'rgb(229, 231, 235)' : 'rgb(31, 41, 55)';

  return (
    <div 
      className="rounded-xl p-5 md:p-6 h-full flex flex-col shadow-sm overflow-hidden w-full"
      style={{ backgroundColor: containerBg, border: `1px solid ${containerBorder}` }}
    >
      {/* Header */}
      <div className="flex flex-col gap-2 mb-2">
        <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div>
            <h3 className="font-semibold text-sm" style={{ color: textColor }}>✨ Predictive Threat Intelligence</h3>
            <p className="text-[10px]" style={{ color: subtextColor }}>{filteredPatterns.length} of {patterns.length} patterns</p>
          </div>
        </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <div 
              className="flex items-center gap-1 p-0.5 rounded-lg border"
              style={{ 
                backgroundColor: isDarkMode ? 'rgb(39, 39, 42)' : 'rgb(244, 244, 245)',
                borderColor: containerBorder
              }}
            >
              {(['all', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((sev) => {
                const getSeverityStyle = (severity: string) => {
                  if (severityFilter !== sev) {
                    return {
                      backgroundColor: 'transparent',
                      color: subtextColor,
                      borderColor: 'transparent'
                    };
                  }
                  switch (severity) {
                    case 'CRITICAL':
                      return {
                        backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.12)',
                        color: isDarkMode ? 'rgb(252, 165, 165)' : 'rgb(185, 28, 28)',
                        borderColor: isDarkMode ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.25)'
                      };
                    case 'HIGH':
                      return {
                        backgroundColor: isDarkMode ? 'rgba(251, 146, 60, 0.2)' : 'rgba(249, 115, 22, 0.12)',
                        color: isDarkMode ? 'rgb(253, 186, 116)' : 'rgb(194, 65, 12)',
                        borderColor: isDarkMode ? 'rgba(249, 115, 22, 0.3)' : 'rgba(249, 115, 22, 0.25)'
                      };
                    case 'MEDIUM':
                      return {
                        backgroundColor: isDarkMode ? 'rgba(250, 204, 21, 0.2)' : 'rgba(234, 179, 8, 0.15)',
                        color: isDarkMode ? 'rgb(253, 224, 71)' : 'rgb(161, 98, 7)',
                        borderColor: isDarkMode ? 'rgba(234, 179, 8, 0.3)' : 'rgba(234, 179, 8, 0.25)'
                      };
                    case 'LOW':
                      return {
                        backgroundColor: isDarkMode ? 'rgba(147, 197, 253, 0.2)' : 'rgba(59, 130, 246, 0.15)',
                        color: isDarkMode ? 'rgb(147, 197, 253)' : 'rgb(29, 78, 216)',
                        borderColor: isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.25)'
                      };
                    default:
                      return {
                        backgroundColor: isDarkMode ? 'rgba(168, 85, 247, 0.2)' : 'rgba(168, 85, 247, 0.12)',
                        color: isDarkMode ? 'rgb(196, 181, 253)' : 'rgb(126, 34, 206)',
                        borderColor: isDarkMode ? 'rgba(168, 85, 247, 0.3)' : 'rgba(168, 85, 247, 0.25)'
                      };
                  }
                };
                const sevStyle = getSeverityStyle(sev);
                return (
                  <button
                    key={sev}
                    onClick={() => setSeverityFilter(sev)}
                    className="px-2 py-1 text-[10px] font-medium rounded transition-all border"
                    style={sevStyle}
                  >
                    {sev === 'all' ? 'All' : sev.charAt(0) + sev.slice(1).toLowerCase()}
                  </button>
                );
              })}
            </div>
            {hasActiveFilters && (
              <button 
              onClick={clearFilters}
              className="flex items-center gap-1 px-2 py-1 text-[10px]"
              style={{ color: subtextColor }}
            >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expandable Pattern List */}
      <div className="flex-1 overflow-y-auto space-y-3 max-h-[600px] pr-2 scrollbar-visible">
        {filteredPatterns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Filter className="w-8 h-8 mb-2" style={{ color: subtextColor }} />
            <p className="text-sm" style={{ color: subtextColor }}>No patterns match filters</p>
            <button 
              onClick={clearFilters}
              className="mt-2 text-xs"
              style={{ color: 'rgb(168, 85, 247)' }}
            >
              Clear filters
            </button>
          </div>
        ) : filteredPatterns.map((pattern) => {
          const isExpanded = expandedPatternId === pattern.id;
          const getSeverityColors = (severity: string) => {
            switch (severity) {
              case 'CRITICAL':
                return {
                  bgColor: isDarkMode ? 'rgba(239, 68, 68, 0.05)' : 'rgba(254, 242, 242, 0.9)',
                  borderColor: isDarkMode ? 'rgba(239, 68, 68, 0.6)' : 'rgba(239, 68, 68, 0.4)',
                };
              case 'HIGH':
                return {
                  bgColor: isDarkMode ? 'rgba(251, 146, 60, 0.05)' : 'rgba(255, 247, 237, 0.9)',
                  borderColor: isDarkMode ? 'rgba(251, 146, 60, 0.6)' : 'rgba(249, 115, 22, 0.4)',
                };
              case 'MEDIUM':
                return {
                  bgColor: isDarkMode ? 'rgba(250, 204, 21, 0.05)' : 'rgba(254, 252, 232, 0.9)',
                  borderColor: isDarkMode ? 'rgba(250, 204, 21, 0.4)' : 'rgba(234, 179, 8, 0.4)',
                };
              case 'LOW':
              default:
                return {
                  bgColor: isDarkMode ? 'rgba(147, 197, 253, 0.05)' : 'rgba(239, 246, 255, 0.9)',
                  borderColor: isDarkMode ? 'rgba(147, 197, 253, 0.4)' : 'rgba(59, 130, 246, 0.4)',
                };
            }
          };
          const patternColors = getSeverityColors(pattern.severity);
              
              return (
                <div 
                  key={pattern.id}
              className={`rounded-xl border cursor-pointer ${
                isExpanded ? 'shadow-sm' : ''
                  }`}
              style={{
                backgroundColor: isExpanded ? patternColors.bgColor : (isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.9)'),
                borderColor: isExpanded ? patternColors.borderColor : containerBorder
              }}
            >
              {/* Collapsed Header - Always Visible */}
              <div 
                onClick={() => toggleExpand(pattern.id)}
                className="p-3.5 cursor-pointer"
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span 
                          className="text-[9px] px-1.5 py-0.5 rounded font-semibold"
                          style={{
                            backgroundColor: pattern.severity === 'CRITICAL' 
                              ? (isDarkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.12)')
                              : pattern.severity === 'HIGH'
                              ? (isDarkMode ? 'rgba(251, 146, 60, 0.2)' : 'rgba(249, 115, 22, 0.12)')
                              : pattern.severity === 'MEDIUM'
                              ? (isDarkMode ? 'rgba(250, 204, 21, 0.2)' : 'rgba(234, 179, 8, 0.15)')
                              : (isDarkMode ? 'rgba(147, 197, 253, 0.2)' : 'rgba(59, 130, 246, 0.15)'),
                            color: pattern.severity === 'CRITICAL'
                              ? (isDarkMode ? 'rgb(252, 165, 165)' : 'rgb(185, 28, 28)')
                              : pattern.severity === 'HIGH'
                              ? (isDarkMode ? 'rgb(253, 186, 116)' : 'rgb(194, 65, 12)')
                              : pattern.severity === 'MEDIUM'
                              ? (isDarkMode ? 'rgb(253, 224, 71)' : 'rgb(161, 98, 7)')
                              : (isDarkMode ? 'rgb(147, 197, 253)' : 'rgb(29, 78, 216)')
                          }}
                        >
                          {pattern.severity}
                        </span>
                      </div>
                    <h4 className="text-sm font-semibold truncate" style={{ color: textColor }}>{pattern.title}</h4>
                    <div className="flex items-center gap-2 mt-1 text-[11px]" style={{ color: subtextColor }}>
                        <span>{pattern.affected.toLocaleString()} cases</span>
                        <span>•</span>
                        <span>{pattern.detected}</span>
                    </div>
                  </div>
                  <ChevronDown 
                    className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    style={{ color: subtextColor }}
                  />
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-3.5" style={{ borderTop: `1px solid ${containerBorder}` }}>
              {/* AI Summary */}
                  <div 
                    className="rounded-lg p-3 mb-3 border"
                    style={{ 
                      backgroundColor: isDarkMode ? 'rgba(168, 85, 247, 0.05)' : 'rgba(245, 243, 255, 0.9)',
                      borderColor: isDarkMode ? 'rgba(168, 85, 247, 0.3)' : 'rgba(168, 85, 247, 0.25)'
                    }}
                  >
                    <p className="text-[12px] leading-relaxed" style={{ color: isDarkMode ? 'rgb(196, 181, 253)' : 'rgb(126, 34, 206)' }}>{pattern.aiSummary}</p>
              </div>

              {/* Metric Chips */}
                  <div className="grid grid-cols-3 gap-3 mb-3">
                <div 
                  className="rounded-lg p-2 text-center border"
                  style={{ 
                    backgroundColor: summaryBg,
                    borderColor: summaryBorder
                  }}
                >
                      <div className="text-base font-bold" style={{ color: textColor }}>{pattern.affected.toLocaleString()}</div>
                      <div className="text-[10px]" style={{ color: labelColor }}>Volume</div>
                </div>
                <div 
                  className="rounded-lg p-2 text-center border"
                  style={{ 
                    backgroundColor: isDarkMode ? 'rgba(250, 204, 21, 0.05)' : 'rgba(254, 252, 232, 0.9)',
                    borderColor: isDarkMode ? 'rgba(250, 204, 21, 0.3)' : 'rgba(234, 179, 8, 0.25)'
                  }}
                >
                      <div className="text-base font-bold" style={{ color: isDarkMode ? 'rgb(234, 179, 8)' : 'rgb(161, 98, 7)' }}>{pattern.riskScore}</div>
                      <div className="text-[10px]" style={{ color: labelColor }}>Risk Score</div>
                </div>
                <div 
                  className="rounded-lg p-2 text-center border"
                  style={{ 
                    backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.05)' : 'rgba(254, 242, 242, 0.9)',
                    borderColor: isDarkMode ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.25)'
                  }}
                >
                      <div className="text-base font-bold" style={{ color: 'rgb(239, 68, 68)' }}>{formatCurrency(pattern.exposure)}</div>
                      <div className="text-[10px]" style={{ color: labelColor }}>Exposure</div>
                </div>
              </div>

              {/* Root Cause & Action */}
                  <div className="space-y-3 mb-3">
                <div>
                      <span className="text-[10px] uppercase tracking-wider" style={{ color: labelColor }}>Root Cause</span>
                      <p className="text-[12px] leading-relaxed mt-1 whitespace-pre-line" style={{ color: summaryTextColor }}>{pattern.rootCause}</p>
                </div>
                <div>
                      <span className="text-[10px] uppercase tracking-wider" style={{ color: 'rgb(249, 115, 22)' }}>Recommended Action</span>
                      <p className="text-[12px] leading-relaxed mt-1 whitespace-pre-line" style={{ color: summaryTextColor }}>{pattern.correctiveAction}</p>
                </div>
              </div>

              {/* CTA Buttons */}
                  <div className="flex justify-end pt-3" style={{ borderTop: `1px solid ${containerBorder}` }}>
                <button 
                      onClick={(e) => { e.stopPropagation(); onViewCases?.(pattern.id); }}
                      className="flex items-center justify-center gap-1 px-3.5 py-1.75 rounded-lg text-[11px] font-semibold transition-all border"
                      style={{
                        backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.063)' : 'rgba(254, 226, 226, 0.8)',
                        borderColor: 'rgba(239, 68, 68, 0.25)',
                        color: isDarkMode ? 'rgb(252, 165, 165)' : 'rgb(185, 28, 28)'
                      }}
                >
                  <AlertTriangle className="w-3 h-3" />
                  View Cases
                </button>
              </div>
            </div>
          )}
        </div>
          );
        })}
      </div>

      {/* Scrollbar styles */}
      <style jsx>{`
        .scrollbar-visible::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-visible::-webkit-scrollbar-track {
          background: ${isDarkMode ? 'rgb(39, 39, 42)' : 'rgb(243, 244, 246)'};
          border-radius: 3px;
        }
        .scrollbar-visible::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? 'rgb(107, 114, 128)' : 'rgb(156, 163, 175)'};
          border-radius: 3px;
        }
        .scrollbar-visible::-webkit-scrollbar-thumb:hover {
          background: ${isDarkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)'};
        }
        .scrollbar-visible {
          scrollbar-width: thin; /* Firefox */
          scrollbar-color: ${isDarkMode ? 'rgb(107, 114, 128) rgb(39, 39, 42)' : 'rgb(156, 163, 175) rgb(243, 244, 246)'}; /* Firefox */
        }
      `}</style>
    </div>
  );
}
