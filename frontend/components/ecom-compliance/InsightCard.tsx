'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, 
  Shield, 
  Phone, 
  Mail, 
  MessageSquare, 
  FileWarning,
  Eye,
  Users,
  Scale,
  TriangleAlert,
  Package,
  RefreshCw,
  Ticket,
  MessageCircle,
  ShoppingCart,
  CreditCard,
  UserX
} from 'lucide-react';
import { Insight, Severity, Channel } from '@/lib/ecom-compliance';

interface InsightCardProps {
  insight: Insight;
  delay?: number;
}

const getSeverityColors = (severity: Severity) => {
  switch (severity) {
    case 'CRITICAL':
      return {
        badgeBg: 'rgba(239, 68, 68, 0.2)',
        badgeText: 'rgb(252, 165, 165)',
        iconBg: 'rgba(239, 68, 68, 0.125)',
        iconColor: 'rgb(239, 68, 68)',
        borderColor: 'rgba(239, 68, 68, 0.6)',
        bgColor: 'rgba(239, 68, 68, 0.05)',
        boxShadow: 'rgba(239, 68, 68, 0.3) 0px 4px 20px -4px',
        affectedColor: 'rgb(239, 68, 68)',
        actionBorder: 'rgba(239, 68, 68, 0.25)',
        actionBg: 'rgba(239, 68, 68, 0.063)',
      };
    case 'HIGH':
      return {
        badgeBg: 'rgba(251, 146, 60, 0.2)',
        badgeText: 'rgb(253, 186, 116)',
        iconBg: 'rgba(249, 115, 22, 0.125)',
        iconColor: 'rgb(249, 115, 22)',
        borderColor: 'rgba(251, 146, 60, 0.6)',
        bgColor: 'rgba(251, 146, 60, 0.05)',
        boxShadow: 'rgba(251, 146, 60, 0.2) 0px 4px 20px -4px',
        affectedColor: 'rgb(249, 115, 22)',
        actionBorder: 'rgba(249, 115, 22, 0.25)',
        actionBg: 'rgba(249, 115, 22, 0.063)',
      };
    case 'MEDIUM':
      return {
        badgeBg: 'rgba(250, 204, 21, 0.2)',
        badgeText: 'rgb(253, 224, 71)',
        iconBg: 'rgba(234, 179, 8, 0.125)',
        iconColor: 'rgb(234, 179, 8)',
        borderColor: 'rgba(250, 204, 21, 0.4)',
        bgColor: 'rgba(250, 204, 21, 0.05)',
        boxShadow: 'rgba(250, 204, 21, 0.1) 0px 4px 20px -4px',
        affectedColor: 'rgb(234, 179, 8)',
        actionBorder: 'rgba(234, 179, 8, 0.25)',
        actionBg: 'rgba(234, 179, 8, 0.063)',
      };
    case 'LOW':
    default:
      return {
        badgeBg: 'rgba(147, 197, 253, 0.2)',
        badgeText: 'rgb(147, 197, 253)',
        iconBg: 'rgba(59, 130, 246, 0.125)',
        iconColor: 'rgb(59, 130, 246)',
        borderColor: 'rgba(147, 197, 253, 0.4)',
        bgColor: 'rgba(147, 197, 253, 0.05)',
        boxShadow: 'rgba(147, 197, 253, 0.1) 0px 4px 20px -4px',
        affectedColor: 'rgb(59, 130, 246)',
        actionBorder: 'rgba(59, 130, 246, 0.25)',
        actionBg: 'rgba(59, 130, 246, 0.063)',
      };
  }
};

const getChannelIcon = (channel: Channel) => {
  switch (channel) {
    case 'Voice':
      return <Phone className="w-3 h-3" />;
    case 'Email':
      return <Mail className="w-3 h-3" />;
    case 'Chat':
      return <MessageSquare className="w-3 h-3" />;
    case 'Tickets':
      return <Ticket className="w-3 h-3" />;
    case 'Social Media':
      return <MessageCircle className="w-3 h-3" />;
    case 'App/Web Chat':
      return <MessageSquare className="w-3 h-3" />;
    case 'Return Requests':
      return <Package className="w-3 h-3" />;
    case 'Customer Feedback':
      return <Users className="w-3 h-3" />;
    case 'Complaints':
      return <FileWarning className="w-3 h-3" />;
    default:
      return <MessageSquare className="w-3 h-3" />;
  }
};

const getInsightIcon = (title: string) => {
  if (title.includes('Return') || title.includes('Refund')) return <Package className="w-4 h-4" />;
  if (title.includes('PII') || title.includes('Privacy') || title.includes('Data')) return <Eye className="w-4 h-4" />;
  if (title.includes('Listing') || title.includes('Product')) return <ShoppingCart className="w-4 h-4" />;
  if (title.includes('Abuse') || title.includes('Fraud')) return <UserX className="w-4 h-4" />;
  if (title.includes('Consent')) return <Shield className="w-4 h-4" />;
  if (title.includes('Dark-Pattern') || title.includes('Unfair')) return <Scale className="w-4 h-4" />;
  if (title.includes('Breach') || title.includes('Security')) return <TriangleAlert className="w-4 h-4" />;
  if (title.includes('Delivery') || title.includes('SLA')) return <Package className="w-4 h-4" />;
  if (title.includes('Invoice') || title.includes('GST')) return <FileWarning className="w-4 h-4" />;
  if (title.includes('Warranty')) return <Shield className="w-4 h-4" />;
  if (title.includes('Seller')) return <Users className="w-4 h-4" />;
  if (title.includes('Promotional') || title.includes('Promo')) return <RefreshCw className="w-4 h-4" />;
  if (title.includes('Payment')) return <CreditCard className="w-4 h-4" />;
  if (title.includes('Cross-Sell')) return <ShoppingCart className="w-4 h-4" />;
  return <Shield className="w-4 h-4" />;
};

export default function InsightCard({ insight, delay = 0 }: InsightCardProps) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const checkTheme = () => {
      const theme = localStorage.getItem('theme');
      setIsDarkMode(theme === 'dark');
    };
    
    checkTheme();
    window.addEventListener('storage', checkTheme);
    
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => {
      window.removeEventListener('storage', checkTheme);
      observer.disconnect();
    };
  }, []);

  const colors = getSeverityColors(insight.severity);

  const textColor = isDarkMode ? 'rgb(243, 244, 246)' : 'rgb(31, 41, 55)';
  const summaryBg = isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgb(249, 250, 251)';
  const summaryBorder = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgb(229, 231, 235)';
  const summaryTextColor = isDarkMode ? 'rgb(209, 213, 219)' : 'rgb(75, 85, 99)';
  const labelColor = 'rgb(107, 114, 128)';
  const valueColor = isDarkMode ? 'rgb(255, 255, 255)' : 'rgb(31, 41, 55)';
  const actionTextColor = isDarkMode ? 'rgb(229, 231, 235)' : 'rgb(55, 65, 81)';

  return (
    <div
      className="w-72 min-w-[18rem] rounded-xl border px-4 py-4 text-sm shadow-lg flex flex-col transition-all duration-300 cursor-pointer hover:scale-[1.02]"
      style={{
        transitionDelay: `${delay}ms`,
        borderColor: colors.borderColor,
        backgroundColor: isDarkMode ? colors.bgColor : 'rgba(255, 255, 255, 0.9)',
        boxShadow: colors.boxShadow,
      }}
    >
      {/* Header */}
      <div className="flex items-start gap-2 mb-2">
        <div className="p-1 rounded-md" style={{ backgroundColor: colors.iconBg }}>
          <span style={{ color: colors.iconColor }}>
            {getInsightIcon(insight.title)}
          </span>
        </div>
        <span className="font-semibold text-[13px] leading-tight" style={{ color: textColor }}>
          {insight.title}
        </span>
      </div>

      {/* Severity Badge */}
      <div className="mb-2">
        <span
          className="text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-semibold"
          style={{ backgroundColor: colors.badgeBg, color: colors.badgeText }}
        >
          {insight.severity}
        </span>
      </div>

      {/* Metadata */}
      <div className="space-y-1 text-[10px] mb-3" style={{ color: summaryTextColor }}>
        <div className="flex justify-between items-center">
          <span className="uppercase tracking-wide" style={{ color: labelColor }}>Channel</span>
          <span className="flex items-center gap-1 justify-end flex-wrap" style={{ color: valueColor }}>
            {insight.channels.map((c, i) => (
              <span key={i} className="flex items-center gap-0.5">
                {getChannelIcon(c)}
                <span className="text-[9px]">{c}</span>
              </span>
            ))}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="uppercase tracking-wide" style={{ color: labelColor }}>Policy</span>
          <span className="text-[9px] text-right max-w-[150px] truncate" style={{ color: valueColor }}>{insight.domain}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="uppercase tracking-wide" style={{ color: labelColor }}>Detected</span>
          <span style={{ color: valueColor }}>{insight.detected_at}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="uppercase tracking-wide" style={{ color: labelColor }}>Affected</span>
          <span className="font-semibold" style={{ color: colors.affectedColor }}>
            {insight.affected_interactions.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Issue Summary */}
      <div
        className="rounded-lg border p-2 text-[11px] mb-3"
        style={{ backgroundColor: summaryBg, borderColor: summaryBorder, color: summaryTextColor }}
      >
        <p className="leading-relaxed">{insight.issue}</p>
      </div>

      {/* Root Cause */}
      <div className="mb-2">
        <span className="text-[9px] uppercase tracking-wider font-medium" style={{ color: labelColor }}>Root Cause</span>
        <p className="text-[11px] mt-0.5" style={{ color: summaryTextColor }}>{insight.root_cause}</p>
      </div>

      {/* Actions */}
      <div className="rounded-lg border p-2 text-[11px]" style={{ borderColor: colors.actionBorder, backgroundColor: colors.actionBg }}>
        <div className="flex items-start gap-1.5">
          <Settings className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: colors.iconColor }} />
          <div>
            <span className="text-[9px] uppercase tracking-wider font-medium block" style={{ color: colors.iconColor }}>Corrective Action</span>
            <span style={{ color: actionTextColor }}>{insight.corrective_action}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

