'use client';

import { useState } from 'react';
import { 
  Sparkles,
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
    case 'CRITICAL': return 'bg-red-500 text-white'; // 76-100
    case 'HIGH': return 'bg-orange-500 text-white'; // 65-75
    case 'MEDIUM': return 'bg-amber-500 text-black'; // 50-64 (Yellow/Amber)
    case 'LOW': return 'bg-green-500 text-white'; // 40-49 (Light Green/Teal)
    default: return 'bg-gray-500 text-white';
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

  return (
    <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-5 h-full flex flex-col shadow-lg shadow-black/30 overflow-hidden w-full">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-2">
        <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-purple-500/10 rounded-lg">
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Predictive Threat Intelligence</h3>
            <p className="text-gray-500 text-[10px]">{filteredPatterns.length} of {patterns.length} patterns</p>
          </div>
        </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <div className="flex items-center gap-1 p-0.5 bg-white/5 rounded-lg">
              {(['all', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-2 py-1 text-[10px] font-medium rounded transition-all ${
                    severityFilter === sev
                      ? sev === 'CRITICAL' ? 'bg-red-500/30 text-red-400'
                        : sev === 'HIGH' ? 'bg-orange-500/30 text-orange-400'
                        : sev === 'MEDIUM' ? 'bg-amber-500/30 text-amber-400'
                        : sev === 'LOW' ? 'bg-green-500/30 text-green-400'
                        : 'bg-purple-500/30 text-purple-400'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {sev === 'all' ? 'All' : sev.charAt(0) + sev.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-2 py-1 text-[10px] text-gray-400 hover:text-white transition-all"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expandable Pattern List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin max-h-[350px]">
        {filteredPatterns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Filter className="w-8 h-8 text-gray-600 mb-2" />
            <p className="text-gray-500 text-sm">No patterns match filters</p>
            <button 
              onClick={clearFilters}
              className="mt-2 text-purple-400 text-xs hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : filteredPatterns.map((pattern) => {
          const isExpanded = expandedPatternId === pattern.id;
              
              return (
                <div 
                  key={pattern.id}
              className={`rounded-xl transition-all ${
                isExpanded 
                  ? 'bg-purple-500/10 border border-purple-500/30 shadow-md shadow-purple-900/30' 
                      : 'bg-[#0d0d14] border border-white/5 hover:border-white/10'
                  }`}
            >
              {/* Collapsed Header - Always Visible */}
              <div 
                onClick={() => toggleExpand(pattern.id)}
                className="p-3.5 cursor-pointer"
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${getSeverityColor(pattern.severity)}`}>
                          {pattern.severity}
                        </span>
                      </div>
                    <h4 className="text-white text-sm font-semibold truncate">{pattern.title}</h4>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
                        <span>{pattern.affected.toLocaleString()} cases</span>
                        <span>•</span>
                        <span>{pattern.detected}</span>
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-3.5 border-t border-white/5">
              {/* AI Summary */}
                  <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-3 mb-3">
                    <p className="text-gray-300 text-[12px] leading-relaxed">{pattern.aiSummary}</p>
              </div>

              {/* Metric Chips */}
                  <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-white text-base font-bold">{pattern.affected.toLocaleString()}</div>
                      <div className="text-gray-500 text-[10px]">Volume</div>
                </div>
                <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-yellow-400 text-base font-bold">{pattern.riskScore}</div>
                      <div className="text-gray-500 text-[10px]">Risk Score</div>
                </div>
                <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-red-400 text-base font-bold">{formatCurrency(pattern.exposure)}</div>
                      <div className="text-gray-500 text-[10px]">Exposure</div>
                </div>
              </div>

              {/* Root Cause & Action */}
                  <div className="space-y-3 mb-3">
                <div>
                      <span className="text-gray-500 text-[10px] uppercase tracking-wider">Root Cause</span>
                      <p className="text-gray-300 text-[12px] leading-relaxed mt-1 whitespace-pre-line">{pattern.rootCause}</p>
                </div>
                <div>
                      <span className="text-orange-400 text-[10px] uppercase tracking-wider">Recommended Action</span>
                      <p className="text-gray-300 text-[12px] leading-relaxed mt-1 whitespace-pre-line">{pattern.correctiveAction}</p>
                </div>
              </div>

              {/* CTA Buttons */}
                  <div className="flex justify-end pt-3 border-t border-white/5">
                <button 
                      onClick={(e) => { e.stopPropagation(); onViewCases?.(pattern.id); }}
                      className="flex items-center justify-center gap-1 px-3.5 py-1.75 bg-red-500/10 text-red-300 rounded-lg text-[11px] font-semibold hover:bg-red-500/20 transition-all"
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

      {/* Scrollbar styling */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.02);
          border-radius: 2px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.2);
        }
      `}</style>
    </div>
  );
}
