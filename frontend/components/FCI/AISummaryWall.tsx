'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, AlertTriangle, Info, AlertCircle, 
  Zap, ChevronRight, X, Clock, Users, FileText, Target, 
  ArrowRight, CheckCircle2, AlertOctagon, Phone, Mail, GitBranch,
  BookOpen, CreditCard, RefreshCw, Timer
} from 'lucide-react';

// Types
export type FCISeverity = 'critical' | 'alert' | 'warning' | 'info';
export type FCICategory = 'system-issue' | 'sla-breach' | 'customer-experience' | 'product-update' | 'compliance' | 'security' | 'operational';

export interface FCIInsight {
  id: string;
  severity: FCISeverity;
  category: FCICategory;
  title: string;
  message: string;
  trend?: 'up' | 'down' | 'stable';
  change?: number;
  metrics?: {
    volume?: number;
    volumeLabel?: string;
    responseTime?: string;
    customerImpact?: 'Critical' | 'High' | 'Medium' | 'Low';
    repeatRate?: number;
  };
}

export interface FCIInsightDetails {
  rootCause: string;
  affectedAreas: string[];
  recommendedActions: string[];
  estimatedImpact: string;
  timeToResolve: string;
  assignedTo?: string;
  priority: 'immediate' | 'high' | 'medium' | 'low';
}

// Sample Data
export const fciInsightsData: FCIInsight[] = [
  {
    id: 'FCI-001',
    severity: 'info',
    category: 'product-update',
    title: 'High Volume Surge - Atmos Credit Card',
    message: 'Significant increase in inquiries due to new Atmos Credit Card launch - 2,340 calls today about card features and eligibility',
    trend: 'up',
    change: 156,
    metrics: {
      volume: 2340,
      volumeLabel: 'calls today',
      customerImpact: 'Medium'
    }
  },
  {
    id: 'FCI-002',
    severity: 'critical',
    category: 'system-issue',
    title: 'Debit Card Dispute Flow Broken',
    message: '900 debit card repeat calls happening without dispute form submitted - form submission failing silently',
    trend: 'up',
    change: 42,
    metrics: {
      volume: 900,
      volumeLabel: 'repeat calls today',
      customerImpact: 'Critical',
      repeatRate: 78
    }
  },
  {
    id: 'FCI-003',
    severity: 'alert',
    category: 'customer-experience',
    title: 'Repeat Contact: Branch + Phone Loop Detected',
    message: 'Customers bouncing between branch and phone support without resolution - 340 cases in loop pattern',
    trend: 'up',
    change: 28,
    metrics: {
      volume: 340,
      volumeLabel: 'customers in loop',
      customerImpact: 'High',
      repeatRate: 65
    }
  },
  {
    id: 'FCI-004',
    severity: 'warning',
    category: 'sla-breach',
    title: 'SLA Failure: High-Value Customer Emails',
    message: 'Email responses to high-value customers exceeding 48 hours - 156 VIP accounts affected',
    trend: 'up',
    change: 35,
    metrics: {
      volume: 156,
      volumeLabel: 'VIP customers delayed',
      responseTime: '>48 hrs',
      customerImpact: 'High'
    }
  }
];

export const fciInsightDetailsMap: Record<string, FCIInsightDetails> = {
  'FCI-001': {
    rootCause: 'New Atmos Credit Card launched with premium cashback rewards driving high customer interest. Marketing campaign exceeded projections by 3x, resulting in call volume surge. Agents need updated product knowledge to handle feature and eligibility inquiries.',
    affectedAreas: ['Card Services', 'Call Center', 'Product Knowledge', 'Marketing Alignment', 'Digital Channels'],
    recommendedActions: [
      'Deploy Atmos Credit Card quick reference guide to all agents immediately',
      'Add dedicated IVR option for Atmos Card inquiries to reduce wait times',
      'Enable self-service eligibility checker on mobile app and website',
      'Schedule additional agent shifts for next 2 weeks to handle surge',
      'Create FAQ chatbot responses for common Atmos Card questions'
    ],
    estimatedImpact: 'Medium - Positive product interest but requires capacity management',
    timeToResolve: '3-5 business days',
    assignedTo: 'Card Services + Call Center Ops',
    priority: 'medium'
  },
  'FCI-002': {
    rootCause: 'Dispute form submission API experiencing silent failures. Forms appear to submit but data is not reaching the backend system, causing customers to call repeatedly.',
    affectedAreas: ['Card Services', 'IT Systems', 'Customer Service', 'Operations', 'Digital Banking'],
    recommendedActions: [
      'IMMEDIATE: Enable form submission error alerts and logging',
      'Deploy hotfix for API timeout handling',
      'Proactively reach out to affected customers with case numbers',
      'Implement retry mechanism with user feedback',
      'Add form submission confirmation emails'
    ],
    estimatedImpact: 'Critical - $180K daily in repeat call costs + customer churn risk',
    timeToResolve: 'Immediate action required - 24-48 hours',
    assignedTo: 'IT Systems + Card Services Lead',
    priority: 'immediate'
  },
  'FCI-003': {
    rootCause: 'Lack of case continuity between branch and phone channels. Customer information and case history not syncing properly, causing repeated verification and issue explanation.',
    affectedAreas: ['Branch Operations', 'Phone Support', 'CRM Systems', 'Customer Experience', 'Operations'],
    recommendedActions: [
      'Enable cross-channel case linking in CRM',
      'Implement warm transfer protocol between branch and phone',
      'Create unified customer timeline visible to all channels',
      'Train agents on accessing previous interaction history',
      'Deploy callback option for complex cases'
    ],
    estimatedImpact: 'High - 340 frustrated customers, 3.2x handling cost increase',
    timeToResolve: '1-2 weeks for process fix, 4-6 weeks for system integration',
    assignedTo: 'Omnichannel Operations Manager',
    priority: 'high'
  },
  'FCI-004': {
    rootCause: 'Email queue prioritization not differentiating high-value customers. VIP accounts treated with same SLA as standard accounts, violating premium service commitments.',
    affectedAreas: ['Email Support', 'VIP Services', 'Customer Success', 'SLA Compliance', 'Operations'],
    recommendedActions: [
      'Implement priority queue for high-value customer emails',
      'Set up automated alerts when VIP emails approach 24-hour mark',
      'Assign dedicated team for high-value account responses',
      'Create escalation path for breached SLAs',
      'Send proactive status updates for pending VIP cases'
    ],
    estimatedImpact: 'High - VIP churn risk, $2.3M annual revenue at risk',
    timeToResolve: '3-5 business days',
    assignedTo: 'Email Support Lead + VIP Services',
    priority: 'high'
  }
};

interface AISummaryWallProps {
  data?: FCIInsight[];
  isDarkMode?: boolean;
}

export function AISummaryWall({ data = fciInsightsData, isDarkMode = false }: AISummaryWallProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeInsight, setActiveInsight] = useState<string | null>(null);
  const [selectedInsight, setSelectedInsight] = useState<FCIInsight | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ top: number } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const getTypeConfig = (type: FCISeverity) => {
    switch (type) {
      case 'critical':
        return {
          icon: AlertCircle,
          color: '#ef4444',
          bgGradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)',
          borderColor: '#ef444450',
          label: 'CRITICAL'
        };
      case 'alert':
        return {
          icon: AlertTriangle,
          color: '#f97316',
          bgGradient: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(249, 115, 22, 0.05) 100%)',
          borderColor: '#f9731650',
          label: 'ALERT'
        };
      case 'warning':
        return {
          icon: Zap,
          color: '#eab308',
          bgGradient: 'linear-gradient(135deg, rgba(234, 179, 8, 0.15) 0%, rgba(234, 179, 8, 0.05) 100%)',
          borderColor: '#eab30850',
          label: 'WARNING'
        };
      case 'info':
        return {
          icon: Info,
          color: '#22c55e',
          bgGradient: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.05) 100%)',
          borderColor: '#22c55e50',
          label: 'INFO'
        };
      default:
        return {
          icon: Info,
          color: '#939394',
          bgGradient: 'linear-gradient(135deg, rgba(147, 147, 148, 0.15) 0%, rgba(147, 147, 148, 0.05) 100%)',
          borderColor: '#93939450',
          label: 'INFO'
        };
    }
  };

  const getCategoryIcon = (category: FCICategory) => {
    switch (category) {
      case 'system-issue': return CreditCard;
      case 'sla-breach': return Timer;
      case 'customer-experience': return RefreshCw;
      case 'product-update': return BookOpen;
      case 'operational': return GitBranch;
      default: return Info;
    }
  };

  const getCategoryLabel = (category: FCICategory) => {
    switch (category) {
      case 'system-issue': return 'System Issue';
      case 'sla-breach': return 'SLA Breach';
      case 'customer-experience': return 'Customer Experience';
      case 'product-update': return 'Product Update';
      case 'compliance': return 'Compliance';
      case 'security': return 'Security';
      case 'operational': return 'Operational';
      default: return category;
    }
  };

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return null;
    }
  };

  const getPriorityConfig = (priority: FCIInsightDetails['priority']) => {
    switch (priority) {
      case 'immediate':
        return { color: '#ef4444', label: 'Immediate Action', icon: AlertOctagon };
      case 'high':
        return { color: '#f97316', label: 'High Priority', icon: AlertTriangle };
      case 'medium':
        return { color: '#eab308', label: 'Medium Priority', icon: Clock };
      case 'low':
        return { color: '#22c55e', label: 'Low Priority', icon: CheckCircle2 };
      default:
        return { color: '#939394', label: 'Unknown', icon: Info };
    }
  };

  const handleInsightClick = (insight: FCIInsight, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const containerRect = event.currentTarget.closest('.flex-1.overflow-y-auto')?.getBoundingClientRect();
    if (containerRect) {
      const relativeTop = rect.top - containerRect.top + (event.currentTarget.closest('.flex-1.overflow-y-auto')?.scrollTop || 0);
      setPopupPosition({ top: relativeTop });
    }
    setSelectedInsight(insight);
  };

  const closeDetail = () => {
    setSelectedInsight(null);
    setPopupPosition(null);
  };

  // Sort insights by severity
  const sortedData = [...data].sort((a, b) => {
    const priority = { critical: 0, alert: 1, warning: 2, info: 3 };
    return priority[a.severity] - priority[b.severity];
  });

  // Get details for selected insight
  const selectedDetails = selectedInsight ? fciInsightDetailsMap[selectedInsight.id] : null;
  const selectedConfig = selectedInsight ? getTypeConfig(selectedInsight.severity) : null;

  return (
    <div
      className={`rounded-2xl p-6 transition-all duration-500 flex flex-col ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{
        backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF',
        border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`,
        boxShadow: isDarkMode 
          ? '0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
          : '0 4px 24px rgba(0, 0, 0, 0.06)',
        height: '615px'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div 
            className="p-2 rounded-xl"
            style={{ 
              background: 'linear-gradient(135deg, #5332FF 0%, #B90ABD 100%)',
              boxShadow: '0 4px 12px rgba(83, 50, 255, 0.3)'
            }}
          >
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 
              className="text-lg font-bold"
              style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
            >
              AI Summary Wall
            </h3>
            <p className="text-xs" style={{ color: '#939394' }}>
              {selectedInsight ? 'Viewing details' : 'Real-time FCI intelligence'}
            </p>
          </div>
        </div>
        <div 
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
          style={{ 
            backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5',
            color: '#939394'
          }}
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Live
        </div>
      </div>

      {/* Scrollable Content Area - includes both detail view and insights list */}
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin relative" style={{ 
        scrollbarWidth: 'thin',
        scrollbarColor: isDarkMode ? '#3a3a3a #1a1a1a' : '#d1d1d1 #f5f5f5',
        minHeight: 0
      }}>
        {/* Insights List */}
        <div className="space-y-3">
          {sortedData.map((insight, index) => {
            const config = getTypeConfig(insight.severity);
            const Icon = config.icon;
            const TrendIcon = getTrendIcon(insight.trend);
            const CategoryIcon = getCategoryIcon(insight.category);
            const isActive = activeInsight === insight.id;
            const isSelected = selectedInsight?.id === insight.id;

            return (
              <div
                key={insight.id}
                className={`relative rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                } ${isActive ? 'scale-[1.02]' : 'hover:scale-[1.01]'}`}
                style={{ 
                  transitionDelay: `${index * 80}ms`,
                  background: config.bgGradient,
                  border: `1px solid ${isSelected ? config.color : (isActive ? config.color : config.borderColor)}`,
                  boxShadow: isSelected ? `0 4px 20px ${config.color}40` : (isActive ? `0 4px 20px ${config.color}30` : 'none')
                }}
                onMouseEnter={() => setActiveInsight(insight.id)}
                onMouseLeave={() => setActiveInsight(null)}
                onClick={(e) => handleInsightClick(insight, e)}
              >
                {/* Glow effect for critical items */}
                {insight.severity === 'critical' && (
                  <div 
                    className="absolute inset-0 rounded-xl animate-pulse"
                    style={{ 
                      background: `radial-gradient(circle at center, ${config.color}10 0%, transparent 70%)`,
                      pointerEvents: 'none'
                    }}
                  />
                )}

                <div className="relative flex items-start gap-3">
                  <div 
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: `${config.color}20` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: config.color }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span 
                        className="text-xs font-semibold uppercase px-1.5 py-0.5 rounded"
                        style={{ 
                          backgroundColor: `${config.color}25`,
                          color: config.color
                        }}
                      >
                        {config.label}
                      </span>
                      <span 
                        className="text-xs px-1.5 py-0.5 rounded flex items-center gap-1"
                        style={{ 
                          backgroundColor: isDarkMode ? '#2a2a2a' : '#E5E5E5',
                          color: '#939394'
                        }}
                      >
                        <CategoryIcon className="w-3 h-3" />
                        {getCategoryLabel(insight.category)}
                      </span>
                    </div>

                    <p 
                      className="text-sm font-semibold mb-1"
                      style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                    >
                      {insight.title}
                    </p>

                    <p 
                      className="text-xs leading-relaxed"
                      style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}
                    >
                      {insight.message}
                    </p>

                    {/* Metrics */}
                    {insight.metrics && (
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        {insight.metrics.volume !== undefined && (
                          <span 
                            className="text-xs font-medium"
                            style={{ color: config.color }}
                          >
                            {insight.metrics.volume.toLocaleString()} {insight.metrics.volumeLabel}
                          </span>
                        )}
                        {insight.metrics.responseTime && (
                          <span 
                            className="text-xs flex items-center gap-1"
                            style={{ color: '#939394' }}
                          >
                            <Timer className="w-3 h-3" />
                            {insight.metrics.responseTime}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Trend indicator */}
                    {insight.change !== undefined && TrendIcon && (
                      <div 
                        className="flex items-center gap-1.5 mt-2"
                        style={{ 
                          color: insight.trend === 'up' ? '#ef4444' : '#22c55e'
                        }}
                      >
                        <TrendIcon className="w-3.5 h-3.5" />
                        <span className="text-xs font-semibold">
                          {insight.change > 0 ? '+' : ''}{insight.change}% from last period
                        </span>
                      </div>
                    )}

                    {/* Click hint */}
                    <div 
                      className={`flex items-center gap-1 mt-2 text-[10px] transition-opacity duration-200 ${
                        isActive && !isSelected ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{ color: config.color }}
                    >
                      <span>Click for details</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>

                  <ChevronRight 
                    className={`w-4 h-4 flex-shrink-0 transition-all duration-300 ${
                      isActive ? 'translate-x-1 opacity-100' : 'opacity-40'
                    }`}
                    style={{ color: config.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Popup Detail View - positioned overlay */}
        {selectedInsight && selectedDetails && selectedConfig && popupPosition && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40"
              style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
              onClick={closeDetail}
            />
            {/* Popup */}
            <div 
              className="absolute left-0 right-0 z-50 mx-2 rounded-xl p-4 animate-in zoom-in-95 duration-200"
              style={{ 
                top: `${popupPosition.top}px`,
                background: isDarkMode ? '#1a1a1a' : '#FFFFFF',
                border: `2px solid ${selectedConfig.color}`,
                boxShadow: `0 8px 32px ${selectedConfig.color}40, 0 4px 16px rgba(0,0,0,0.3)`
              }}
            >
              {/* Detail Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="p-1.5 rounded-lg"
                    style={{ backgroundColor: `${selectedConfig.color}20` }}
                  >
                    <selectedConfig.icon className="w-4 h-4" style={{ color: selectedConfig.color }} />
                  </div>
                  <span 
                    className="text-sm font-bold"
                    style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                  >
                    {selectedInsight.title}
                  </span>
                </div>
                <button 
                  onClick={closeDetail}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ 
                    backgroundColor: isDarkMode ? '#2a2a2a' : '#F0F0F0'
                  }}
                >
                  <X className="w-4 h-4" style={{ color: '#939394' }} />
                </button>
              </div>

              {/* Priority Badge */}
              <div className="flex items-center gap-2 mb-3">
                {(() => {
                  const priorityConfig = getPriorityConfig(selectedDetails.priority);
                  return (
                    <span 
                      className="flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full"
                      style={{ 
                        backgroundColor: `${priorityConfig.color}20`,
                        color: priorityConfig.color
                      }}
                    >
                      <priorityConfig.icon className="w-3 h-3" />
                      {priorityConfig.label}
                    </span>
                  );
                })()}
                <span 
                  className="text-xs px-2 py-1 rounded-full"
                  style={{ 
                    backgroundColor: isDarkMode ? '#2a2a2a' : '#E5E5E5',
                    color: '#939394'
                  }}
                >
                  {getCategoryLabel(selectedInsight.category)}
                </span>
              </div>

              {/* Root Cause */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <FileText className="w-3.5 h-3.5" style={{ color: selectedConfig.color }} />
                  <span className="text-xs font-semibold uppercase" style={{ color: '#939394' }}>
                    Root Cause
                  </span>
                </div>
                <p 
                  className="text-sm leading-relaxed"
                  style={{ color: isDarkMode ? '#E0E0E0' : '#333333' }}
                >
                  {selectedDetails.rootCause}
                </p>
              </div>

              {/* Affected Areas */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <Target className="w-3.5 h-3.5" style={{ color: selectedConfig.color }} />
                  <span className="text-xs font-semibold uppercase" style={{ color: '#939394' }}>
                    Affected Areas
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDetails.affectedAreas.map((area, i) => (
                    <span 
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded"
                      style={{ 
                        backgroundColor: isDarkMode ? '#2a2a2a' : '#F0F0F0',
                        color: isDarkMode ? '#D6D9D8' : '#4a4a4a'
                      }}
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommended Actions */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <ArrowRight className="w-3.5 h-3.5" style={{ color: selectedConfig.color }} />
                  <span className="text-xs font-semibold uppercase" style={{ color: '#939394' }}>
                    Recommended Actions
                  </span>
                </div>
                <ul className="space-y-1.5">
                  {selectedDetails.recommendedActions.map((action, i) => (
                    <li 
                      key={i}
                      className="flex items-start gap-2 text-xs"
                      style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}
                    >
                      <span 
                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold"
                        style={{ 
                          backgroundColor: `${selectedConfig.color}20`,
                          color: selectedConfig.color
                        }}
                      >
                        {i + 1}
                      </span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer Info */}
              <div 
                className="flex items-center justify-between pt-3 border-t"
                style={{ borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5' }}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3" style={{ color: '#939394' }} />
                    <span className="text-[10px]" style={{ color: '#939394' }}>
                      {selectedDetails.timeToResolve}
                    </span>
                  </div>
                  {selectedDetails.assignedTo && (
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3 h-3" style={{ color: '#939394' }} />
                      <span className="text-[10px]" style={{ color: '#939394' }}>
                        {selectedDetails.assignedTo}
                      </span>
                    </div>
                  )}
                </div>
                <span 
                  className="text-[10px] font-medium"
                  style={{ color: selectedConfig.color }}
                >
                  {selectedDetails.estimatedImpact.split(' - ')[0]}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Summary Footer - Fixed at bottom */}
      <div 
        className="mt-5 pt-4 border-t grid grid-cols-3 gap-4 flex-shrink-0"
        style={{ borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5' }}
      >
        <div className="text-center">
          <p 
            className="text-2xl font-bold"
            style={{ color: '#ef4444' }}
          >
            {data.filter(i => i.severity === 'critical').length}
          </p>
          <p className="text-xs" style={{ color: '#939394' }}>Critical</p>
        </div>
        <div className="text-center">
          <p 
            className="text-2xl font-bold"
            style={{ color: '#f97316' }}
          >
            {data.filter(i => i.severity === 'alert' || i.severity === 'warning').length}
          </p>
          <p className="text-xs" style={{ color: '#939394' }}>Warnings</p>
        </div>
        <div className="text-center">
          <p 
            className="text-2xl font-bold"
            style={{ color: '#22c55e' }}
          >
            {data.filter(i => i.trend === 'down' || i.severity === 'info').length}
          </p>
          <p className="text-xs" style={{ color: '#939394' }}>Improving</p>
        </div>
      </div>
    </div>
  );
}
