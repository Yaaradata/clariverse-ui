'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, AlertTriangle, Info, AlertCircle, 
  Zap, ChevronRight, X, Clock, Users, FileText, Target, 
  ArrowRight, CheckCircle2, AlertOctagon
} from 'lucide-react';
import { ComplianceInsight } from '@/lib/compliance/complianceData';

// Extended insight details for click view
interface InsightDetails {
  rootCause: string;
  affectedAreas: string[];
  recommendedActions: string[];
  estimatedImpact: string;
  timeToResolve: string;
  assignedTo?: string;
  priority: 'immediate' | 'high' | 'medium' | 'low';
}

const insightDetailsMap: Record<string, InsightDetails> = {
  'INS-001': {
    rootCause: 'Increased onboarding volume without proportional staff training on new KYC protocols introduced last month.',
    affectedAreas: ['Customer Onboarding', 'Identity Verification', 'Document Processing'],
    recommendedActions: [
      'Schedule immediate refresher training for verification teams',
      'Review and simplify KYC checklist for common scenarios',
      'Deploy AI-assisted document verification to reduce manual errors'
    ],
    estimatedImpact: '$45,000 potential regulatory fine risk',
    timeToResolve: '5-7 business days',
    assignedTo: 'Compliance Team Lead',
    priority: 'high'
  },
  'INS-002': {
    rootCause: 'Agent AGT-1823 has consistently skipped mandatory disclosure statements, particularly during high-volume periods.',
    affectedAreas: ['Script Compliance', 'Call Quality', 'Regulatory Disclosure'],
    recommendedActions: [
      'Immediate 1-on-1 coaching session with agent',
      'Enable real-time script prompts on agent desktop',
      'Review call recordings from past week for pattern analysis'
    ],
    estimatedImpact: 'Medium compliance risk - potential audit flag',
    timeToResolve: '2-3 business days',
    assignedTo: 'Team Supervisor - Europe',
    priority: 'immediate'
  },
  'INS-003': {
    rootCause: 'BPO vendor TechServe Asia accessed customer database outside approved hours and downloaded bulk records without authorization.',
    affectedAreas: ['Data Security', 'Third-Party Access', 'Customer Privacy', 'GDPR Compliance'],
    recommendedActions: [
      'Immediately revoke database access for vendor',
      'Conduct forensic audit of downloaded data',
      'Notify DPO and prepare incident report',
      'Review and strengthen vendor access controls'
    ],
    estimatedImpact: 'Critical - potential data breach, GDPR violation risk up to €20M',
    timeToResolve: 'Immediate action required',
    assignedTo: 'CISO + Legal Team',
    priority: 'immediate'
  },
  'INS-004': {
    rootCause: 'Implementation of automated consent tracking and improved data handling procedures in EMEA operations.',
    affectedAreas: ['Data Privacy', 'GDPR Compliance', 'Customer Trust'],
    recommendedActions: [
      'Continue monitoring improvement trend',
      'Document best practices for other regions',
      'Consider expanding automation to APAC region'
    ],
    estimatedImpact: 'Positive - reduced compliance risk by 15%',
    timeToResolve: 'Ongoing monitoring',
    priority: 'low'
  },
  'INS-005': {
    rootCause: 'New automated alert routing system reducing manual triage time and ensuring faster escalation.',
    affectedAreas: ['AML Detection', 'Alert Management', 'Investigation Efficiency'],
    recommendedActions: [
      'Monitor system performance metrics',
      'Train additional staff on new workflow',
      'Plan Phase 2 automation rollout'
    ],
    estimatedImpact: 'Positive - 15% faster response to suspicious activities',
    timeToResolve: 'Completed',
    priority: 'low'
  },
  'INS-006': {
    rootCause: 'New agents in European call centers not consistently obtaining explicit consent before call recordings.',
    affectedAreas: ['GDPR Compliance', 'Call Recording', 'Customer Rights'],
    recommendedActions: [
      'Mandatory consent training for all EU-based agents',
      'Update IVR to include automatic consent prompt',
      'Audit last 30 days of call recordings for compliance'
    ],
    estimatedImpact: 'High - GDPR Article 6 violation risk',
    timeToResolve: '3-5 business days',
    assignedTo: 'EU Compliance Manager',
    priority: 'high'
  }
};

interface InsightsPanelProps {
  data: ComplianceInsight[];
  isDarkMode?: boolean;
}

export function InsightsPanel({ data, isDarkMode = false }: InsightsPanelProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeInsight, setActiveInsight] = useState<string | null>(null);
  const [selectedInsight, setSelectedInsight] = useState<ComplianceInsight | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const getTypeConfig = (type: ComplianceInsight['type']) => {
    switch (type) {
      case 'critical':
        return {
          icon: AlertCircle,
          color: '#ef4444',
          bgGradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)',
          borderColor: '#ef444450',
          label: 'Critical'
        };
      case 'alert':
        return {
          icon: AlertTriangle,
          color: '#f97316',
          bgGradient: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(249, 115, 22, 0.05) 100%)',
          borderColor: '#f9731650',
          label: 'Alert'
        };
      case 'warning':
        return {
          icon: Zap,
          color: '#eab308',
          bgGradient: 'linear-gradient(135deg, rgba(234, 179, 8, 0.15) 0%, rgba(234, 179, 8, 0.05) 100%)',
          borderColor: '#eab30850',
          label: 'Warning'
        };
      case 'info':
        return {
          icon: Info,
          color: '#22c55e',
          bgGradient: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.05) 100%)',
          borderColor: '#22c55e50',
          label: 'Info'
        };
      default:
        return {
          icon: Info,
          color: '#939394',
          bgGradient: 'linear-gradient(135deg, rgba(147, 147, 148, 0.15) 0%, rgba(147, 147, 148, 0.05) 100%)',
          borderColor: '#93939450',
          label: 'Info'
        };
    }
  };

  const getTrendIcon = (trend: ComplianceInsight['trend']) => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return null;
    }
  };

  const getPriorityConfig = (priority: InsightDetails['priority']) => {
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

  const handleInsightClick = (insight: ComplianceInsight) => {
    setSelectedInsight(insight);
  };

  const closeDetail = () => {
    setSelectedInsight(null);
  };

  // Sort insights by severity
  const sortedData = [...data].sort((a, b) => {
    const priority = { critical: 0, alert: 1, warning: 2, info: 3 };
    return priority[a.type] - priority[b.type];
  });

  // Get details for selected insight
  const selectedDetails = selectedInsight ? insightDetailsMap[selectedInsight.id] : null;
  const selectedConfig = selectedInsight ? getTypeConfig(selectedInsight.type) : null;

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
        maxHeight: '500px'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
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
              AI Insights
            </h3>
            <p className="text-xs" style={{ color: '#939394' }}>
              {selectedInsight ? 'Click to view details' : 'Real-time compliance intelligence'}
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

      {/* Detail View */}
      {selectedInsight && selectedDetails && selectedConfig && (
        <div 
          className="mb-4 rounded-xl p-4 animate-in slide-in-from-top-2 duration-300"
          style={{ 
            background: selectedConfig.bgGradient,
            border: `1px solid ${selectedConfig.color}50`
          }}
        >
          {/* Detail Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <selectedConfig.icon className="w-5 h-5" style={{ color: selectedConfig.color }} />
              <span 
                className="text-sm font-bold"
                style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
              >
                Insight Details
              </span>
            </div>
            <button 
              onClick={closeDetail}
              className="p-1 rounded-lg hover:bg-black/10 transition-colors"
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
              {selectedInsight.category}
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
                    backgroundColor: isDarkMode ? '#1a1a1a' : '#F0F0F0',
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
      )}

      {/* Insights List - Scrollable */}
      <div 
        className="space-y-3 overflow-y-auto pr-2 scrollbar-thin flex-1"
        style={{ 
          scrollbarWidth: 'thin',
          scrollbarColor: isDarkMode ? '#3a3a3a #1a1a1a' : '#d1d1d1 #f5f5f5'
        }}
      >
        {sortedData.map((insight, index) => {
          const config = getTypeConfig(insight.type);
          const Icon = config.icon;
          const TrendIcon = getTrendIcon(insight.trend);
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
                background: isSelected ? config.bgGradient : config.bgGradient,
                border: `1px solid ${isSelected ? config.color : (isActive ? config.color : config.borderColor)}`,
                boxShadow: isSelected ? `0 4px 20px ${config.color}40` : (isActive ? `0 4px 20px ${config.color}30` : 'none')
              }}
              onMouseEnter={() => setActiveInsight(insight.id)}
              onMouseLeave={() => setActiveInsight(null)}
              onClick={() => handleInsightClick(insight)}
            >
              {/* Glow effect for critical items */}
              {insight.type === 'critical' && (
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
                  <div className="flex items-center gap-2 mb-1">
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
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{ 
                        backgroundColor: isDarkMode ? '#2a2a2a' : '#E5E5E5',
                        color: '#939394'
                      }}
                    >
                      {typeof insight.category === 'string' ? insight.category : insight.category}
                    </span>
                  </div>

                  <p 
                    className="text-sm leading-relaxed"
                    style={{ color: isDarkMode ? '#E0E0E0' : '#333333' }}
                  >
                    {insight.message}
                  </p>

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
                      isActive ? 'opacity-100' : 'opacity-0'
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

      {/* Summary Footer */}
      <div 
        className="mt-5 pt-4 border-t grid grid-cols-3 gap-4"
        style={{ borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5' }}
      >
        <div className="text-center">
          <p 
            className="text-2xl font-bold"
            style={{ color: '#ef4444' }}
          >
            {data.filter(i => i.type === 'critical').length}
          </p>
          <p className="text-xs" style={{ color: '#939394' }}>Critical</p>
        </div>
        <div className="text-center">
          <p 
            className="text-2xl font-bold"
            style={{ color: '#f97316' }}
          >
            {data.filter(i => i.type === 'alert' || i.type === 'warning').length}
          </p>
          <p className="text-xs" style={{ color: '#939394' }}>Warnings</p>
        </div>
        <div className="text-center">
          <p 
            className="text-2xl font-bold"
            style={{ color: '#22c55e' }}
          >
            {data.filter(i => i.trend === 'down').length}
          </p>
          <p className="text-xs" style={{ color: '#939394' }}>Improving</p>
        </div>
      </div>
    </div>
  );
}
