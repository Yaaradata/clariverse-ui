'use client';

import { ShieldAlert, Scale, Twitter, Clock, AlertTriangle, MessageCircle } from 'lucide-react';
import { CoercionAlert, Severity, CoercionType } from '@/lib/ecom-fraudulent';

interface CoercionAlertCardsProps {
  alerts: CoercionAlert[];
}

const getTypeConfig = (type: CoercionType) => {
  switch (type) {
    case 'Legal Threat':
      return {
        icon: Scale,
        color: 'text-red-400',
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        label: 'LEGAL',
      };
    case 'Reputation Leverage Attacks':
      return {
        icon: Twitter,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        label: 'SOCIAL',
      };
    case 'Urgency Pressure':
      return {
        icon: Clock,
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        label: 'URGENCY',
      };
    case 'Social Engineering Attempts':
      return {
        icon: MessageCircle,
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/30',
        label: 'ENGINEERING',
      };
    default:
      return {
        icon: AlertTriangle,
        color: 'text-gray-400',
        bg: 'bg-gray-500/10',
        border: 'border-gray-500/30',
        label: 'OTHER',
      };
  }
};

const getSeverityColors = (severity: Severity) => {
  switch (severity) {
    case 'CRITICAL':
      return 'bg-red-500/20 text-red-300 border-red-500/40';
    case 'HIGH':
      return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
    case 'MEDIUM':
      return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
    default:
      return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
  }
};

export default function CoercionAlertCards({ alerts }: CoercionAlertCardsProps) {
  const sortedAlerts = [...alerts].sort((a, b) => {
    const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    return severityOrder[a.threatLevel] - severityOrder[b.threatLevel];
  });

  return (
    <div className="bg-[#0a0a0f] border border-rose-500/20 rounded-xl p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-rose-500/10 rounded-lg">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Coercion &amp; Social Engineering</h3>
            <p className="text-gray-500 text-xs">Threat-based refund attempts</p>
          </div>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 bg-rose-500/10 rounded-full animate-pulse">
          <AlertTriangle className="w-3 h-3 text-rose-400" />
          <span className="text-rose-400 text-xs font-medium">{alerts.length} Active</span>
        </div>
      </div>

      {/* Signal Type Filters */}
      <div className="flex items-center gap-2 mb-3">
        {['Legal Threat', 'Reputation Leverage Attacks', 'Social Engineering Attempts'].map((type) => {
          const config = getTypeConfig(type as CoercionType);
          const count = alerts.filter(a => a.type === type).length;
          return (
            <div 
              key={type}
              className={`flex items-center gap-1 px-2 py-1 rounded-full ${config.bg} ${config.border} border`}
            >
              <config.icon className={`w-3 h-3 ${config.color}`} />
              <span className={`text-[10px] font-medium ${config.color}`}>{count}</span>
            </div>
          );
        })}
      </div>

      {/* Alert Cards */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {sortedAlerts.map((alert) => {
          const typeConfig = getTypeConfig(alert.type);
          const TypeIcon = typeConfig.icon;
          
          return (
            <div 
              key={alert.id}
              className={`${typeConfig.bg} ${typeConfig.border} border rounded-lg p-3 hover:brightness-110 transition-all cursor-pointer`}
            >
              {/* Top Row */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded ${typeConfig.bg}`}>
                    <TypeIcon className={`w-3.5 h-3.5 ${typeConfig.color}`} />
                  </div>
                  <div>
                    <span className={`text-[10px] font-semibold ${typeConfig.color}`}>{typeConfig.label}</span>
                    {alert.platform && (
                      <span className="text-gray-500 text-[10px] ml-1">• {alert.platform}</span>
                    )}
                    {alert.urgencyIndicator && (
                      <span className="text-amber-400 text-[10px] ml-1">• {alert.urgencyIndicator}</span>
                    )}
                  </div>
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded border ${getSeverityColors(alert.threatLevel)}`}>
                  {alert.threatLevel}
                </span>
              </div>

              {/* Detected Phrase */}
              <div className="flex items-center gap-2 mb-2">
                <span className={`${typeConfig.color} text-xs font-medium`}>
                  &quot;{alert.detectedPhrase}&quot;
                </span>
              </div>

              {/* Transcript Snippet */}
              <div className="p-2 bg-black/30 rounded text-[10px] text-gray-400 italic line-clamp-2">
                {alert.transcriptSnippet}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3 text-gray-600" />
                  <span className="text-gray-600 text-[10px]">{alert.channel}</span>
                </div>
                <span className="text-gray-600 text-[10px]">
                  {new Date(alert.timestamp).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
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

