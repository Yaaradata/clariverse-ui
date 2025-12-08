'use client';

import { useState } from 'react';
import { 
  ShieldAlert,
  Package, 
  UserX, 
  Repeat, 
  ShoppingBag, 
  Mail, 
  Ticket, 
  Globe,
  Clock,
  ChevronDown,
  AlertTriangle,
  Users
} from 'lucide-react';

export interface FraudInsight {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  channels: string[];
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

type FilterType = 'all' | 'critical' | 'high' | 'medium' | 'low';

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
    case 'email': return <Mail className="w-3 h-3" />;
    case 'tickets': return <Ticket className="w-3 h-3" />;
    case 'social media': return <Globe className="w-3 h-3" />;
    default: return <Mail className="w-3 h-3" />;
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'CRITICAL': return 'bg-red-500 text-white';
    case 'HIGH': return 'bg-orange-500 text-white';
    case 'MEDIUM': return 'bg-yellow-500 text-black';
    case 'LOW': return 'bg-blue-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
};

export default function FraudInsightCards({ insights, criticalCount, highCount }: FraudInsightCardsProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const mediumCount = insights.filter(i => i.severity === 'MEDIUM').length;
  const lowCount = insights.filter(i => i.severity === 'LOW').length;
  const totalCount = insights.length;

  const filteredInsights = activeFilter === 'all' 
    ? insights 
    : insights.filter(i => i.severity.toLowerCase() === activeFilter);

  // Category counts for bottom stats
  const dnrCount = insights.filter(i => i.title.toLowerCase().includes('dnr') || i.icon === 'package').length;
  const emptyBoxCount = insights.filter(i => i.title.toLowerCase().includes('empty box')).length;
  const promoCount = insights.filter(i => i.title.toLowerCase().includes('promo')).length;
  const agentCount = insights.filter(i => i.title.toLowerCase().includes('agent') || i.icon === 'user').length;
  const wardrobingCount = insights.filter(i => i.title.toLowerCase().includes('wardrob') || i.icon === 'repeat').length;

  const filters: { key: FilterType; label: string; count: number; icon?: React.ReactNode }[] = [
    { key: 'all', label: 'All Alerts', count: totalCount },
    { key: 'critical', label: 'Critical', count: criticalCount, icon: <AlertTriangle className="w-3 h-3" /> },
    { key: 'high', label: 'High', count: highCount, icon: <AlertTriangle className="w-3 h-3" /> },
    { key: 'medium', label: 'Medium', count: mediumCount, icon: <AlertTriangle className="w-3 h-3" /> },
    { key: 'low', label: 'Low', count: lowCount, icon: <AlertTriangle className="w-3 h-3" /> },
  ];

  return (
    <div className="bg-[#0a0a0f] border border-white/10 rounded-xl p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/10 rounded-lg">
            <ShieldAlert className="w-5 h-5 text-red-400" />
          </div>
          <div>
          <h3 className="text-white font-semibold text-base">AI Fraud Pattern Insights</h3>
            <p className="text-gray-500 text-xs">{totalCount} active patterns requiring attention</p>
          </div>
        </div>
        <div className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></span>
          {totalCount} Active
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {filters.map(filter => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              activeFilter === filter.key
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
            }`}
          >
            {filter.icon}
            {filter.label}
            <span className={`px-1.5 py-0.5 rounded text-[10px] ${
              activeFilter === filter.key ? 'bg-blue-500/30' : 'bg-white/10'
            }`}>
              {filter.count}
            </span>
          </button>
        ))}
      </div>

      {/* Insight List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[400px] scrollbar-thin">
        {filteredInsights.map((insight) => {
            const IconComponent = getIconComponent(insight.icon);
          const isExpanded = expandedId === insight.id;
            
            return (
              <div 
                key={insight.id}
              className="bg-[#0d0d14] border border-white/5 rounded-xl p-3 hover:border-white/10 transition-all cursor-pointer"
              onClick={() => setExpandedId(isExpanded ? null : insight.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 bg-white/5 rounded-lg mt-0.5">
                    <IconComponent className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    {/* Badges */}
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${getSeverityColor(insight.severity)}`}>
                    {insight.severity}
                  </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 flex items-center gap-1">
                        <span className="w-1 h-1 bg-emerald-400 rounded-full"></span>
                        Active
                      </span>
                      {insight.channels.slice(0, 1).map((channel, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-400 flex items-center gap-1">
                          {getChannelIcon(channel)}
                          {channel}
                        </span>
                      ))}
                    </div>
                    
                    {/* Title & Description */}
                    <h4 className="text-white text-sm font-medium mb-1">{insight.title}</h4>
                    <p className="text-gray-500 text-xs line-clamp-1">{insight.description}</p>
                    
                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-white/5 space-y-2">
                        <div>
                          <span className="text-gray-500 text-[10px] uppercase tracking-wider">Root Cause</span>
                          <p className="text-gray-400 text-xs mt-0.5">{insight.rootCause}</p>
                        </div>
                        <div>
                          <span className="text-red-400 text-[10px] uppercase tracking-wider">Corrective Action</span>
                          <p className="text-gray-400 text-xs mt-0.5">{insight.correctiveAction}</p>
                  </div>
                        <div className="flex items-center gap-4 text-xs">
                          <span className="text-gray-500">
                            Affected: <span className="text-red-400 font-semibold">{insight.affected.toLocaleString()}</span>
                          </span>
                  </div>
                  </div>
                    )}
                  </div>
                </div>

                {/* Right: Timestamp */}
                <div className="flex items-center gap-2 text-gray-500 ml-3">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs whitespace-nowrap">{insight.detected}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-5 gap-2 mt-4 pt-4 border-t border-white/10">
        <div className="text-center p-2 bg-white/5 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-red-400 mx-auto mb-1" />
          <div className="text-white text-lg font-bold">{dnrCount}</div>
          <div className="text-gray-500 text-[9px] uppercase tracking-wider">Fulfillment</div>
        </div>
        <div className="text-center p-2 bg-white/5 rounded-lg">
          <Package className="w-4 h-4 text-orange-400 mx-auto mb-1" />
          <div className="text-white text-lg font-bold">{emptyBoxCount}</div>
          <div className="text-gray-500 text-[9px] uppercase tracking-wider">Syndicated</div>
        </div>
        <div className="text-center p-2 bg-white/5 rounded-lg">
          <ShoppingBag className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
          <div className="text-white text-lg font-bold">{promoCount}</div>
          <div className="text-gray-500 text-[9px] uppercase tracking-wider">Incentive</div>
        </div>
        <div className="text-center p-2 bg-white/5 rounded-lg">
          <Users className="w-4 h-4 text-purple-400 mx-auto mb-1" />
          <div className="text-white text-lg font-bold">{agentCount}</div>
          <div className="text-gray-500 text-[9px] uppercase tracking-wider">Insider</div>
        </div>
        <div className="text-center p-2 bg-white/5 rounded-lg">
          <Repeat className="w-4 h-4 text-blue-400 mx-auto mb-1" />
          <div className="text-white text-lg font-bold">{wardrobingCount}</div>
          <div className="text-gray-500 text-[9px] uppercase tracking-wider">Asset Abuse</div>
        </div>
      </div>

      {/* Scrollbar styling */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.02);
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.2);
        }
      `}</style>
    </div>
  );
}
