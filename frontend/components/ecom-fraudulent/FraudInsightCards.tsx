'use client';

import { 
  Package, 
  UserX, 
  Repeat, 
  ShoppingBag, 
  MessageSquare, 
  Mail, 
  Ticket, 
  Phone,
  Globe,
  Settings
} from 'lucide-react';

export interface FraudInsight {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  channels: string[];
  policy: string;
  detected: string;
  affected: number;
  description: string;
  rootCause: string;
  correctiveAction: string;
  icon: 'package' | 'user' | 'repeat' | 'shopping';
}

interface FraudInsightCardsProps {
  insights: FraudInsight[];
  criticalCount: number;
  highCount: number;
}

const getIconComponent = (icon: string) => {
  switch (icon) {
    case 'package': return Package;
    case 'user': return UserX;
    case 'repeat': return Repeat;
    case 'shopping': return ShoppingBag;
    default: return Package;
  }
};

const getChannelIcon = (channel: string) => {
  switch (channel.toLowerCase()) {
    case 'chat': return <MessageSquare className="w-3 h-3" />;
    case 'email': return <Mail className="w-3 h-3" />;
    case 'tickets': return <Ticket className="w-3 h-3" />;
    case 'voice': return <Phone className="w-3 h-3" />;
    case 'social media': return <Globe className="w-3 h-3" />;
    default: return <MessageSquare className="w-3 h-3" />;
  }
};

const getSeverityColors = (severity: string) => {
  switch (severity) {
    case 'CRITICAL':
      return {
        badge: 'bg-red-500/20 text-red-400 border-red-500/40',
        border: 'border-red-500/30',
        icon: 'bg-red-500/10 text-red-400',
      };
    case 'HIGH':
      return {
        badge: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
        border: 'border-orange-500/30',
        icon: 'bg-orange-500/10 text-orange-400',
      };
    case 'MEDIUM':
      return {
        badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
        border: 'border-yellow-500/30',
        icon: 'bg-yellow-500/10 text-yellow-400',
      };
    default:
      return {
        badge: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
        border: 'border-blue-500/30',
        icon: 'bg-blue-500/10 text-blue-400',
      };
  }
};

export default function FraudInsightCards({ insights, criticalCount, highCount }: FraudInsightCardsProps) {
  return (
    <div className="bg-[#0a0a0f] border border-white/10 rounded-xl p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-amber-400">✦</span>
          <h3 className="text-white font-semibold text-base">AI Fraud Pattern Insights</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-red-500/20 text-red-400 text-xs font-medium px-2 py-0.5 rounded">
            {criticalCount} CRITICAL
          </span>
          <span className="bg-orange-500/20 text-orange-400 text-xs font-medium px-2 py-0.5 rounded">
            {highCount} HIGH
          </span>
        </div>
      </div>
      <p className="text-gray-500 text-xs mb-4">
        Live detection of fraud patterns, abuse signals, and risk indicators from customer communications.
      </p>

      {/* Horizontal Scrolling Cards */}
      <div className="flex-1 overflow-x-auto pb-2">
        <div className="flex gap-4 min-w-max">
          {insights.map((insight) => {
            const colors = getSeverityColors(insight.severity);
            const IconComponent = getIconComponent(insight.icon);
            
            return (
              <div 
                key={insight.id}
                className={`w-72 flex-shrink-0 bg-[#0d0d14] border ${colors.border} rounded-xl p-4 hover:brightness-110 transition-all cursor-pointer`}
              >
                {/* Card Header */}
                <div className="flex items-start gap-2 mb-3">
                  <div className={`p-1.5 rounded-lg ${colors.icon}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white text-sm font-semibold leading-tight">{insight.title}</h4>
                  </div>
                </div>

                {/* Severity Badge */}
                <div className="mb-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${colors.badge}`}>
                    {insight.severity}
                  </span>
                </div>

                {/* Metadata */}
                <div className="space-y-1.5 text-[11px] mb-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500 uppercase tracking-wide">Channel</span>
                    <div className="flex items-center gap-1 text-gray-300">
                      {insight.channels.map((channel, i) => (
                        <span key={i} className="flex items-center gap-0.5">
                          {getChannelIcon(channel)}
                          <span className="text-[10px]">{channel}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 uppercase tracking-wide">Policy</span>
                    <span className="text-gray-300 text-right max-w-[140px] truncate">{insight.policy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 uppercase tracking-wide">Detected</span>
                    <span className="text-gray-300">{insight.detected}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 uppercase tracking-wide">Affected</span>
                    <span className="text-red-400 font-semibold">{insight.affected.toLocaleString()}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-black/30 rounded-lg p-2.5 mb-3">
                  <p className="text-gray-400 text-[11px] leading-relaxed line-clamp-2">{insight.description}</p>
                </div>

                {/* Root Cause */}
                <div className="mb-3">
                  <span className="text-gray-500 text-[9px] uppercase tracking-wider font-medium">Root Cause</span>
                  <p className="text-gray-400 text-[11px] mt-0.5 line-clamp-2">{insight.rootCause}</p>
                </div>

                {/* Corrective Action */}
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-2.5">
                  <div className="flex items-start gap-1.5">
                    <Settings className="w-3 h-3 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-red-400 text-[9px] uppercase tracking-wider font-semibold block">Corrective Action</span>
                      <p className="text-gray-300 text-[11px] mt-0.5 line-clamp-2">{insight.correctiveAction}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scrollbar styling */}
      <style jsx>{`
        div::-webkit-scrollbar {
          height: 6px;
        }
        div::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.02);
          border-radius: 3px;
        }
        div::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 3px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.2);
        }
      `}</style>
    </div>
  );
}

