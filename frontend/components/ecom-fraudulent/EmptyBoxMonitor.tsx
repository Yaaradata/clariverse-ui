'use client';

import { Package, AlertTriangle, MessageSquare } from 'lucide-react';
import { EmptyBoxIncident, Severity } from '@/lib/ecom-fraudulent';

interface EmptyBoxMonitorProps {
  incidents: EmptyBoxIncident[];
}

const getSeverityColors = (severity: Severity) => {
  switch (severity) {
    case 'CRITICAL':
      return {
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        text: 'text-red-400',
        badge: 'bg-red-500/20 text-red-300',
      };
    case 'HIGH':
      return {
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/30',
        text: 'text-orange-400',
        badge: 'bg-orange-500/20 text-orange-300',
      };
    case 'MEDIUM':
      return {
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/30',
        text: 'text-yellow-400',
        badge: 'bg-yellow-500/20 text-yellow-300',
      };
    default:
      return {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        text: 'text-blue-400',
        badge: 'bg-blue-500/20 text-blue-300',
      };
  }
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

const getSentimentLabel = (score: number) => {
  if (score <= -0.8) return { label: 'Hostile', color: 'text-red-400' };
  if (score <= -0.5) return { label: 'Angry', color: 'text-orange-400' };
  if (score <= -0.2) return { label: 'Upset', color: 'text-yellow-400' };
  return { label: 'Neutral', color: 'text-gray-400' };
};

export default function EmptyBoxMonitor({ incidents }: EmptyBoxMonitorProps) {
  return (
    <div className="bg-[#0a0a0f] border border-orange-500/20 rounded-xl p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-orange-500/10 rounded-lg">
            <Package className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">&quot;Empty Box&quot; &amp; Tampering</h3>
            <p className="text-gray-500 text-xs">High-value missing item claims</p>
          </div>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 bg-red-500/10 rounded-full">
          <AlertTriangle className="w-3 h-3 text-red-400" />
          <span className="text-red-400 text-xs font-medium">{incidents.length} Active</span>
        </div>
      </div>

      {/* Incidents List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {incidents.map((incident) => {
          const colors = getSeverityColors(incident.riskLevel);
          const sentiment = getSentimentLabel(incident.sentimentScore);
          
          return (
            <div 
              key={incident.id} 
              className={`${colors.bg} ${colors.border} border rounded-lg p-3 hover:brightness-110 transition-all cursor-pointer`}
            >
              {/* Top Row */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-xs font-mono">{incident.ticketId}</span>
                  <span className={`${colors.badge} text-[10px] px-1.5 py-0.5 rounded-full font-medium`}>
                    {incident.riskLevel}
                  </span>
                </div>
                <span className="text-white font-semibold text-sm">{formatCurrency(incident.itemValue)}</span>
              </div>

              {/* Item Name */}
              <p className="text-white text-xs font-medium mb-2 truncate">{incident.itemName}</p>

              {/* Detected Keyword */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gray-500 text-[10px] uppercase tracking-wide">Keyword:</span>
                <span className={`${colors.text} text-xs font-medium bg-black/30 px-2 py-0.5 rounded`}>
                  {incident.detectedKeyword}
                </span>
              </div>

              {/* Sentiment */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-gray-500" />
                  <span className="text-gray-500 text-[10px]">{incident.channel}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-500 text-[10px]">Sentiment:</span>
                  <span className={`${sentiment.color} text-[10px] font-medium`}>
                    {sentiment.label} ({incident.sentimentScore.toFixed(2)})
                  </span>
                </div>
              </div>

              {/* Transcript Snippet */}
              <div className="mt-2 p-2 bg-black/30 rounded text-[10px] text-gray-400 italic line-clamp-2">
                {incident.transcriptSnippet}
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.02);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.2);
        }
      `}</style>
    </div>
  );
}

