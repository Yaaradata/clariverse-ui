'use client';

import { useState, useEffect } from 'react';
import { 
  AlertTriangle, Shield, Server, MessageSquare, Users, 
  Clock, ChevronDown, ChevronUp, MapPin, Activity
} from 'lucide-react';
import { 
  RiskAlert, getSeverityColor, getRegionFlag, 
  RiskCategory 
} from '@/lib/compliance/complianceData';

interface RiskAlertPanelProps {
  data: RiskAlert[];
  isDarkMode?: boolean;
}

export function RiskAlertPanel({ data, isDarkMode = false }: RiskAlertPanelProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<RiskCategory | 'all'>('all');

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const getCategoryConfig = (category: RiskCategory) => {
    switch (category) {
      case 'fraud':
        return {
          icon: AlertTriangle,
          color: '#ef4444',
          label: 'Fraud',
          bgGradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
        };
      case 'cyber':
        return {
          icon: Shield,
          color: '#8b5cf6',
          label: 'Cyber Security',
          bgGradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
        };
      case 'operational':
        return {
          icon: Server,
          color: '#f97316',
          label: 'Operational',
          bgGradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
        };
      case 'reputation':
        return {
          icon: MessageSquare,
          color: '#ec4899',
          label: 'Reputation',
          bgGradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)'
        };
      case 'third-party':
        return {
          icon: Users,
          color: '#06b6d4',
          label: 'Third-Party',
          bgGradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)'
        };
      default:
        return {
          icon: AlertTriangle,
          color: '#939394',
          label: 'Unknown',
          bgGradient: 'linear-gradient(135deg, #939394 0%, #6b7280 100%)'
        };
    }
  };

  const getStatusConfig = (status: RiskAlert['status']) => {
    switch (status) {
      case 'active':
        return { color: '#ef4444', label: 'Active', pulse: true };
      case 'monitoring':
        return { color: '#eab308', label: 'Monitoring', pulse: true };
      case 'resolved':
        return { color: '#22c55e', label: 'Resolved', pulse: false };
      default:
        return { color: '#939394', label: 'Unknown', pulse: false };
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const filteredData = selectedCategory === 'all' 
    ? data 
    : data.filter(alert => alert.category === selectedCategory);

  // Sort by severity and status
  const sortedData = [...filteredData].sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    const statusOrder = { active: 0, monitoring: 1, resolved: 2 };
    
    if (severityOrder[a.severity] !== severityOrder[b.severity]) {
      return severityOrder[a.severity] - severityOrder[b.severity];
    }
    return statusOrder[a.status] - statusOrder[b.status];
  });

  // Category counts for filter tabs
  const categoryCounts = {
    all: data.length,
    fraud: data.filter(a => a.category === 'fraud').length,
    cyber: data.filter(a => a.category === 'cyber').length,
    operational: data.filter(a => a.category === 'operational').length,
    reputation: data.filter(a => a.category === 'reputation').length,
    'third-party': data.filter(a => a.category === 'third-party').length,
  };

  const categories: (RiskCategory | 'all')[] = ['all', 'fraud', 'cyber', 'operational', 'reputation', 'third-party'];

  return (
    <div
      className={`rounded-2xl overflow-hidden transition-all duration-500 flex flex-col ${
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
      <div 
        className="p-6"
        style={{ 
          background: isDarkMode 
            ? 'linear-gradient(135deg, #1a0a1a 0%, #0d0d0d 100%)'
            : 'linear-gradient(135deg, #FFF5F5 0%, #FFFFFF 100%)',
          borderBottom: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="p-2.5 rounded-xl"
              style={{ 
                background: 'linear-gradient(135deg, #ef4444 0%, #B90ABD 100%)',
                boxShadow: '0 4px 16px rgba(239, 68, 68, 0.35)'
              }}
            >
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 
                className="text-lg font-bold"
                style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
              >
                Risk Alert Center
              </h3>
              <p className="text-xs" style={{ color: '#939394' }}>
                {data.filter(a => a.status === 'active').length} active alerts requiring attention
              </p>
            </div>
          </div>

          {/* Active alerts badge */}
          <div 
            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ 
              backgroundColor: '#ef444420',
              border: '1px solid #ef444440'
            }}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-semibold" style={{ color: '#ef4444' }}>
              {data.filter(a => a.status === 'active').length} Active
            </span>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const config = cat === 'all' ? null : getCategoryConfig(cat as RiskCategory);
            const count = categoryCounts[cat];

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  isSelected ? 'scale-105' : 'hover:scale-102'
                }`}
                style={{
                  backgroundColor: isSelected 
                    ? (config ? `${config.color}20` : (isDarkMode ? '#5332FF20' : '#5332FF15'))
                    : (isDarkMode ? '#1a1a1a' : '#F5F5F5'),
                  color: isSelected 
                    ? (config ? config.color : '#5332FF')
                    : '#939394',
                  border: isSelected 
                    ? `1px solid ${config ? config.color : '#5332FF'}50`
                    : '1px solid transparent'
                }}
              >
                {config && <config.icon className="w-3.5 h-3.5" />}
                <span>{cat === 'all' ? 'All Risks' : config?.label}</span>
                <span 
                  className="px-1.5 py-0.5 rounded-full text-[10px]"
                  style={{ 
                    backgroundColor: isSelected 
                      ? (config ? `${config.color}30` : '#5332FF30')
                      : (isDarkMode ? '#2a2a2a' : '#E5E5E5')
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Alerts List */}
      <div className="flex-1 overflow-y-auto">
        {sortedData.map((alert, index) => {
          const categoryConfig = getCategoryConfig(alert.category);
          const statusConfig = getStatusConfig(alert.status);
          const severityColor = getSeverityColor(alert.severity);
          const isExpanded = expandedAlert === alert.id;
          const Icon = categoryConfig.icon;

          return (
            <div
              key={alert.id}
              className={`border-b transition-all duration-300 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ 
                transitionDelay: `${index * 60}ms`,
                borderColor: isDarkMode ? '#1f1f1f' : '#F0F0F0',
                backgroundColor: isExpanded 
                  ? (isDarkMode ? '#141414' : '#FAFAFA')
                  : 'transparent'
              }}
            >
              {/* Alert Header */}
              <div 
                className="p-4 cursor-pointer hover:bg-opacity-50 transition-colors"
                onClick={() => setExpandedAlert(isExpanded ? null : alert.id)}
                style={{ 
                  backgroundColor: isExpanded ? 'transparent' : undefined
                }}
              >
                <div className="flex items-start gap-3">
                  {/* Category Icon */}
                  <div 
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{ background: categoryConfig.bgGradient }}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-1.5">
                      {/* Severity */}
                      <span 
                        className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                        style={{ 
                          backgroundColor: `${severityColor}20`,
                          color: severityColor
                        }}
                      >
                        {alert.severity}
                      </span>

                      {/* Status */}
                      <span 
                        className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium"
                        style={{ 
                          backgroundColor: `${statusConfig.color}15`,
                          color: statusConfig.color
                        }}
                      >
                        {statusConfig.pulse && (
                          <span 
                            className="w-1.5 h-1.5 rounded-full animate-pulse"
                            style={{ backgroundColor: statusConfig.color }}
                          />
                        )}
                        {statusConfig.label}
                      </span>

                      {/* Region */}
                      <span 
                        className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium"
                        style={{ 
                          backgroundColor: isDarkMode ? '#2a2a2a' : '#F0F0F0',
                          color: isDarkMode ? '#FFFFFF' : '#010101'
                        }}
                      >
                        <MapPin className="w-3 h-3" style={{ color: '#939394' }} />
                        {getRegionFlag(alert.region)} {alert.region}
                      </span>
                    </div>

                    <h4 
                      className="text-sm font-semibold mb-1"
                      style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                    >
                      {alert.title}
                    </h4>

                    <p 
                      className={`text-xs ${isExpanded ? '' : 'line-clamp-2'}`}
                      style={{ color: '#939394' }}
                    >
                      {alert.description}
                    </p>
                  </div>

                  {/* Expand/Collapse */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" style={{ color: '#939394' }} />
                      <span className="text-[10px]" style={{ color: '#939394' }} suppressHydrationWarning>
                        {formatTimestamp(alert.timestamp)}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" style={{ color: '#939394' }} />
                    ) : (
                      <ChevronDown className="w-4 h-4" style={{ color: '#939394' }} />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div 
                  className="px-4 pb-4 pt-0"
                  style={{ marginLeft: '52px' }}
                >
                  <div 
                    className="rounded-lg p-4 grid grid-cols-2 gap-4"
                    style={{ backgroundColor: isDarkMode ? '#0a0a0a' : '#F5F5F5' }}
                  >
                    <div>
                      <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#939394' }}>
                        Impacted Agents
                      </p>
                      <p 
                        className="text-lg font-bold"
                        style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                      >
                        {alert.impactedAgents}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#939394' }}>
                        Impacted Customers
                      </p>
                      <p 
                        className="text-lg font-bold"
                        style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                      >
                        {alert.impactedCustomers.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-3">
                    <button 
                      className="flex-1 text-xs font-medium px-4 py-2 rounded-lg transition-colors"
                      style={{ 
                        backgroundColor: '#5332FF',
                        color: '#FFFFFF'
                      }}
                    >
                      Investigate
                    </button>
                    <button 
                      className="flex-1 text-xs font-medium px-4 py-2 rounded-lg transition-colors"
                      style={{ 
                        backgroundColor: isDarkMode ? '#2a2a2a' : '#E5E5E5',
                        color: isDarkMode ? '#FFFFFF' : '#010101'
                      }}
                    >
                      Acknowledge
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Summary */}
      <div 
        className="p-4 border-t"
        style={{ 
          borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5',
          backgroundColor: isDarkMode ? '#0a0a0a' : '#FAFAFA'
        }}
      >
        <div className="grid grid-cols-5 gap-2">
          {(['fraud', 'cyber', 'operational', 'reputation', 'third-party'] as RiskCategory[]).map((cat) => {
            const config = getCategoryConfig(cat);
            const count = data.filter(a => a.category === cat && a.status === 'active').length;

            return (
              <div 
                key={cat} 
                className="text-center p-2 rounded-lg"
                style={{ backgroundColor: isDarkMode ? '#141414' : '#FFFFFF' }}
              >
                <config.icon 
                  className="w-4 h-4 mx-auto mb-1" 
                  style={{ color: count > 0 ? config.color : '#939394' }} 
                />
                <p 
                  className="text-lg font-bold"
                  style={{ color: count > 0 ? config.color : '#939394' }}
                >
                  {count}
                </p>
                <p className="text-[9px] uppercase" style={{ color: '#939394' }}>
                  {config.label.split(' ')[0]}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

