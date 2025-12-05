'use client';

import { useState } from 'react';
import { Tag, TrendingUp, ExternalLink, AlertOctagon } from 'lucide-react';
import { AbuseKeyword } from '@/lib/ecom-fraudulent';

interface PromoAbuseTagCloudProps {
  keywords: AbuseKeyword[];
}

const getRiskColor = (weight: number) => {
  if (weight >= 5) return { text: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/40', glow: 'shadow-red-500/20' };
  if (weight >= 4) return { text: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/40', glow: 'shadow-orange-500/20' };
  if (weight >= 3) return { text: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/40', glow: 'shadow-yellow-500/20' };
  return { text: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/40', glow: 'shadow-blue-500/20' };
};

const getTagSize = (frequency: number, maxFrequency: number) => {
  const ratio = frequency / maxFrequency;
  if (ratio >= 0.8) return 'text-base px-3 py-1.5';
  if (ratio >= 0.6) return 'text-sm px-2.5 py-1';
  if (ratio >= 0.4) return 'text-xs px-2 py-1';
  return 'text-[11px] px-2 py-0.5';
};

export default function PromoAbuseTagCloud({ keywords }: PromoAbuseTagCloudProps) {
  const [selectedKeyword, setSelectedKeyword] = useState<AbuseKeyword | null>(null);
  const maxFrequency = Math.max(...keywords.map(k => k.frequency));
  
  // Sort by frequency for display
  const sortedKeywords = [...keywords].sort((a, b) => b.frequency - a.frequency);
  const totalDetections = keywords.reduce((sum, k) => sum + k.frequency, 0);

  return (
    <div className="bg-[#0a0a0f] border border-emerald-500/20 rounded-xl p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-500/10 rounded-lg">
            <Tag className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Promo &amp; Referral Abuse</h3>
            <p className="text-gray-500 text-xs">Keywords from social &amp; chat logs</p>
          </div>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 rounded-full">
          <TrendingUp className="w-3 h-3 text-emerald-400" />
          <span className="text-emerald-400 text-xs font-medium">{totalDetections.toLocaleString()}</span>
        </div>
      </div>

      {/* Tag Cloud */}
      <div className="flex-1 overflow-hidden">
        <div className="flex flex-wrap gap-2 justify-center items-center py-2">
          {sortedKeywords.map((keyword) => {
            const colors = getRiskColor(keyword.riskWeight);
            const size = getTagSize(keyword.frequency, maxFrequency);
            const isSelected = selectedKeyword?.keyword === keyword.keyword;
            
            return (
              <button
                key={keyword.keyword}
                onClick={() => setSelectedKeyword(isSelected ? null : keyword)}
                className={`
                  ${colors.bg} ${colors.border} ${colors.text} ${size}
                  border rounded-full font-medium transition-all duration-200
                  hover:brightness-125 hover:scale-105
                  ${isSelected ? `ring-2 ring-offset-2 ring-offset-[#0a0a0f] ${colors.border} shadow-lg ${colors.glow}` : ''}
                `}
              >
                <span className="flex items-center gap-1">
                  {keyword.keyword}
                  {keyword.riskWeight >= 5 && (
                    <AlertOctagon className="w-3 h-3" />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Keyword Details */}
      {selectedKeyword && (
        <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className={`font-semibold ${getRiskColor(selectedKeyword.riskWeight).text}`}>
                {selectedKeyword.keyword}
              </span>
              <span className="text-gray-500 text-xs ml-2">
                Risk Level: {selectedKeyword.riskWeight}/5
              </span>
            </div>
            <button 
              onClick={() => setSelectedKeyword(null)}
              className="text-gray-500 hover:text-white transition-colors"
            >
              ×
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mb-2 text-[10px]">
            <div className="bg-black/30 rounded p-2">
              <span className="text-gray-500 block">Frequency</span>
              <span className="text-white font-medium">{selectedKeyword.frequency}</span>
            </div>
            <div className="bg-black/30 rounded p-2">
              <span className="text-gray-500 block">Source</span>
              <span className="text-white font-medium">{selectedKeyword.source}</span>
            </div>
            <div className="bg-black/30 rounded p-2">
              <span className="text-gray-500 block">Last Seen</span>
              <span className="text-white font-medium">
                {new Date(selectedKeyword.lastDetected).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>
          
          <div className="space-y-1">
            <span className="text-gray-500 text-[10px] uppercase tracking-wider">Sample Detections</span>
            {selectedKeyword.examples.map((example, i) => (
              <div key={i} className="text-[10px] text-gray-400 italic bg-black/20 rounded px-2 py-1">
                {example}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk Legend */}
      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-gray-600 text-[10px]">Click tag for details</span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-gray-500 text-[9px]">Critical</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-gray-500 text-[9px]">High</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="text-gray-500 text-[9px]">Medium</span>
          </div>
        </div>
      </div>
    </div>
  );
}

