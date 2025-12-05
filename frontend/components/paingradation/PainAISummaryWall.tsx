'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, AlertTriangle, Info, AlertCircle, 
  Zap, ChevronRight, X, Clock, Users, FileText, Target, 
  ArrowRight, CheckCircle2, AlertOctagon, Package, Truck, 
  ShoppingCart, CreditCard, RefreshCw, Timer, RotateCcw,
  MapPin, IndianRupee, Smartphone, Store, Gift
} from 'lucide-react';

// Types
export type PainSeverity = 'critical' | 'alert' | 'warning' | 'info';
export type PainCategory = 'delivery-issue' | 'return-refund' | 'payment-gateway' | 'product-quality' | 'app-performance' | 'seller-issue' | 'logistics';

export interface PainInsight {
  id: string;
  severity: PainSeverity;
  category: PainCategory;
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

export interface PainInsightDetails {
  rootCause: string;
  affectedAreas: string[];
  recommendedActions: string[];
  estimatedImpact: string;
  timeToResolve: string;
  assignedTo?: string;
  priority: 'immediate' | 'high' | 'medium' | 'low';
}

// Sample Data - Flipkart Specific
export const painInsightsData: PainInsight[] = [
  {
    id: 'PAIN-001',
    severity: 'critical',
    category: 'delivery-issue',
    title: 'Delivery Delays - Mumbai & Pune Zones',
    message: '1,847 orders stuck in last-mile delivery for 48+ hours due to courier partner capacity issues in Maharashtra region',
    trend: 'up',
    change: 67,
    metrics: {
      volume: 1847,
      volumeLabel: 'delayed orders',
      customerImpact: 'Critical',
      repeatRate: 82
    }
  },
  {
    id: 'PAIN-002',
    severity: 'alert',
    category: 'return-refund',
    title: 'Return Pickup Failure Loop',
    message: 'Customers reporting 3+ failed return pickup attempts - 643 cases with no successful pickup in 7 days',
    trend: 'up',
    change: 45,
    metrics: {
      volume: 643,
      volumeLabel: 'failed pickups',
      customerImpact: 'High',
      repeatRate: 71
    }
  },
  {
    id: 'PAIN-004',
    severity: 'warning',
    category: 'product-quality',
    title: 'Wrong Item Delivery Pattern - Electronics',
    message: 'Spike in wrong item deliveries for smartphone accessories - 428 customers received different products than ordered',
    trend: 'up',
    change: 34,
    metrics: {
      volume: 428,
      volumeLabel: 'wrong deliveries',
      customerImpact: 'High',
      repeatRate: 56
    }
  },
  {
    id: 'PAIN-005',
    severity: 'alert',
    category: 'app-performance',
    title: 'App Crash During Flash Sale',
    message: 'Mobile app crashing during Big Billion Day flash sales - 3,200+ crash reports in 15 minutes peak period',
    trend: 'up',
    change: 156,
    metrics: {
      volume: 3200,
      volumeLabel: 'app crashes',
      customerImpact: 'Critical'
    }
  },
  {
    id: 'PAIN-006',
    severity: 'info',
    category: 'seller-issue',
    title: 'Seller Response Time Improvement',
    message: 'Electronics category sellers showing 40% faster response to customer queries after new SLA implementation',
    trend: 'down',
    change: -40,
    metrics: {
      volume: 856,
      volumeLabel: 'queries resolved',
      responseTime: '<2 hrs avg',
      customerImpact: 'Low'
    }
  },
];

export const painInsightDetailsMap: Record<string, PainInsightDetails> = {
  'PAIN-001': {
    rootCause: 'Courier partner Ecom Express experiencing severe capacity constraints in Mumbai and Pune hubs due to festival season surge. Warehouse-to-delivery center transfer delays compounded by local courier shortages and high order volumes from Big Billion Days sales.',
    affectedAreas: ['Last Mile Delivery', 'Mumbai Hub', 'Pune Hub', 'Courier Operations', 'Customer Service', 'Ekart Logistics'],
    recommendedActions: [
      'IMMEDIATE: Activate backup courier partners (Delhivery, BlueDart) for Maharashtra region',
      'Deploy additional delivery executives from nearby zones (Nashik, Thane)',
      'Enable customer self-pickup at Flipkart service centers for urgent orders',
      'Send proactive SMS/email with revised delivery timelines to all affected customers',
      'Set up dedicated helpline for delivery queries in Mumbai/Pune',
      'Negotiate extended operating hours with Ecom Express for next 48 hours'
    ],
    estimatedImpact: 'Critical - ₹1.2 Cr daily GMV at risk, 1,847 customers facing delays, potential 15% cancellation rate',
    timeToResolve: 'Immediate action - 48-72 hours for full clearance',
    assignedTo: 'Logistics Head + Mumbai Ops Manager',
    priority: 'immediate'
  },
  'PAIN-002': {
    rootCause: 'Return pickup logistics failing due to incorrect address data and delivery partner route optimization issues. Customers in tier-2/3 cities experiencing multiple failed attempts as pickup addresses not matching delivery addresses in system.',
    affectedAreas: ['Returns Management', 'Reverse Logistics', 'Address Validation', 'Customer Service', 'Seller Operations'],
    recommendedActions: [
      'Implement mandatory address confirmation call before pickup attempt',
      'Enable GPS-based address verification in return pickup flow',
      'Assign dedicated return pickup slots with customer confirmation',
      'Create priority queue for cases with 2+ failed attempts',
      'Add WhatsApp-based live tracking for return pickups',
      'Train delivery partners on return pickup best practices'
    ],
    estimatedImpact: 'High - 643 customers frustrated, ₹42L inventory stuck, increasing negative reviews',
    timeToResolve: '3-5 days for process fix, 2 weeks for system enhancement',
    assignedTo: 'Returns Operations + Reverse Logistics Team',
    priority: 'high'
  },
  'PAIN-004': {
    rootCause: 'Warehouse picking errors in Electronics category - sellers shipping from same warehouse location causing SKU mix-ups. Barcode scanning process being skipped during high-volume periods, leading to wrong items being packed.',
    affectedAreas: ['Warehouse Operations', 'Quality Control', 'Seller Fulfillment', 'Electronics Category', 'Packing Process'],
    recommendedActions: [
      'Mandatory double-scan verification for all smartphone accessory orders',
      'Implement photo verification at packing stage',
      'Conduct urgent retraining for warehouse pickers',
      'Separate storage zones for similar-looking products',
      'Add penalty clause in seller agreement for repeated wrong deliveries',
      'Proactive replacement initiation for all 428 affected customers'
    ],
    estimatedImpact: 'High - 428 customers affected, ₹18L reverse logistics cost, category reputation damage',
    timeToResolve: '24-48 hours for immediate fixes, 1 week for process overhaul',
    assignedTo: 'Warehouse Operations Manager + Quality Head',
    priority: 'high'
  },
  'PAIN-005': {
    rootCause: 'Mobile app server overload during Big Billion Day flash sales. Concurrent user requests exceeded capacity planning estimates by 3.5x. Image loading and inventory check APIs causing memory leaks leading to app crashes on Android devices.',
    affectedAreas: ['Mobile App', 'Server Infrastructure', 'Flash Sales', 'Tech Platform', 'User Experience', 'CDN'],
    recommendedActions: [
      'IMMEDIATE: Scale up server instances by 200% for next flash sale',
      'Implement aggressive image compression and lazy loading',
      'Add request queuing system to prevent server overload',
      'Deploy emergency app update with crash fixes',
      'Enable web fallback for app users during high traffic',
      'Send push notification apologizing and offering exclusive deals to affected users'
    ],
    estimatedImpact: 'Critical - 3,200 crashes, ₹8.5 Cr potential GMV loss, severe brand impact during flagship sale',
    timeToResolve: 'Emergency patch - 4-6 hours, infrastructure scale-up 12 hours',
    assignedTo: 'Mobile App Tech Lead + Infrastructure Team',
    priority: 'immediate'
  },
  'PAIN-006': {
    rootCause: 'New seller SLA policy implemented on Nov 15 with automated escalation for delayed responses. Sellers now incentivized with better visibility ranking for faster query resolution. Electronics category showing best adoption.',
    affectedAreas: ['Seller Management', 'Customer Service', 'Electronics Category', 'Seller Dashboard', 'Query Management'],
    recommendedActions: [
      'Roll out same SLA model to Fashion and Home categories',
      'Publish seller leaderboard showcasing top responders',
      'Provide query response templates for common questions',
      'Offer additional commission benefits for maintaining <2 hr response time',
      'Conduct weekly seller training webinars on customer service'
    ],
    estimatedImpact: 'Positive - 40% improvement in response time, customer satisfaction up 12% in Electronics',
    timeToResolve: 'Ongoing optimization - expand to other categories in 2-3 weeks',
    assignedTo: 'Seller Success Team + Category Managers',
    priority: 'medium'
  },
};

interface PainAISummaryWallProps {
  data?: PainInsight[];
  isDarkMode?: boolean;
}

export function PainAISummaryWall({ data = painInsightsData, isDarkMode = false }: PainAISummaryWallProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeInsight, setActiveInsight] = useState<string | null>(null);
  const [selectedInsight, setSelectedInsight] = useState<PainInsight | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ top: number } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const getTypeConfig = (type: PainSeverity) => {
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

  const getCategoryIcon = (category: PainCategory) => {
    switch (category) {
      case 'delivery-issue': return Truck;
      case 'return-refund': return RotateCcw;
      case 'payment-gateway': return CreditCard;
      case 'product-quality': return Package;
      case 'app-performance': return Smartphone;
      case 'seller-issue': return Store;
      case 'logistics': return MapPin;
      default: return ShoppingCart;
    }
  };

  const getCategoryLabel = (category: PainCategory) => {
    switch (category) {
      case 'delivery-issue': return 'Delivery Issue';
      case 'return-refund': return 'Return & Refund';
      case 'payment-gateway': return 'Payment Gateway';
      case 'product-quality': return 'Product Quality';
      case 'app-performance': return 'App Performance';
      case 'seller-issue': return 'Seller Issue';
      case 'logistics': return 'Logistics';
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

  const getPriorityConfig = (priority: PainInsightDetails['priority']) => {
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

  const handleInsightClick = (insight: PainInsight, event: React.MouseEvent) => {
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
  const selectedDetails = selectedInsight ? painInsightDetailsMap[selectedInsight.id] : null;
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
        height: '670px'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-2xl">✨</span>
          <div>
            <h3 
              className="text-lg font-bold"
              style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
            >
              AI Summary Wall
            </h3>
            <p className="text-xs" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
              {selectedInsight ? 'Viewing details' : 'Real-time customer experience intelligence'}
            </p>
          </div>
        </div>
        <div 
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
          style={{ 
            backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5',
            color: isDarkMode ? '#939394' : '#666666'
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
                          color: isDarkMode ? '#939394' : '#666666'
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
                            style={{ color: isDarkMode ? '#939394' : '#666666' }}
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

        {/* Popup Detail View */}
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
                    color: isDarkMode ? '#939394' : '#666666'
                  }}
                >
                  {getCategoryLabel(selectedInsight.category)}
                </span>
              </div>

              {/* Root Cause */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <FileText className="w-3.5 h-3.5" style={{ color: selectedConfig.color }} />
                  <span className="text-xs font-semibold uppercase" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
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
                  <span className="text-xs font-semibold uppercase" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
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
                  <span className="text-xs font-semibold uppercase" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
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
                    <Clock className="w-3 h-3" style={{ color: isDarkMode ? '#939394' : '#666666' }} />
                    <span className="text-[10px]" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
                      {selectedDetails.timeToResolve}
                    </span>
                  </div>
                  {selectedDetails.assignedTo && (
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3 h-3" style={{ color: isDarkMode ? '#939394' : '#666666' }} />
                      <span className="text-[10px]" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
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
          <p className="text-xs" style={{ color: isDarkMode ? '#939394' : '#666666' }}>Critical</p>
        </div>
        <div className="text-center">
          <p 
            className="text-2xl font-bold"
            style={{ color: '#f97316' }}
          >
            {data.filter(i => i.severity === 'alert' || i.severity === 'warning').length}
          </p>
          <p className="text-xs" style={{ color: isDarkMode ? '#939394' : '#666666' }}>Warnings</p>
        </div>
        <div className="text-center">
          <p 
            className="text-2xl font-bold"
            style={{ color: '#22c55e' }}
          >
            {data.filter(i => i.trend === 'down' || i.severity === 'info').length}
          </p>
          <p className="text-xs" style={{ color: isDarkMode ? '#939394' : '#666666' }}>Improving</p>
        </div>
      </div>
    </div>
  );
}

