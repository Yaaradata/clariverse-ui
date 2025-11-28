'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  UserCheck,
  FileText,
  ShieldCheck,
  Banknote,
  HandMetal,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import { ViolationData, getSeverityColor } from '@/lib/compliance/complianceData';

interface ViolationCategoryChartProps {
  data: ViolationData[];
  isDarkMode?: boolean;
}

export function ViolationCategoryChart({ data, isDarkMode = false }: ViolationCategoryChartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const maxCount = Math.max(...data.map(d => d.count));
  const totalViolations = data.reduce((sum, d) => sum + d.count, 0);

  const getCategoryIcon = (category: string, color: string) => {
    const iconProps = { className: "w-4 h-4", style: { color } };
    switch (category) {
      case 'KYC': return <UserCheck {...iconProps} />;
      case 'Script Violation': return <FileText {...iconProps} />;
      case 'Data Privacy': return <ShieldCheck {...iconProps} />;
      case 'AML': return <Banknote {...iconProps} />;
      case 'Consent': return <HandMetal {...iconProps} />;
      case 'PCI-DSS': return <CreditCard {...iconProps} />;
      default: return <AlertCircle {...iconProps} />;
    }
  };

  return (
    <div
      className={`rounded-2xl p-6 transition-all duration-500 h-full flex flex-col ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{
        backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF',
        border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`,
        boxShadow: isDarkMode 
          ? '0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
          : '0 4px 24px rgba(0, 0, 0, 0.06)'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 
            className="text-lg font-bold mb-1"
            style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
          >
            Violations by Category
          </h3>
          <p className="text-xs" style={{ color: '#939394' }}>
            {totalViolations.toLocaleString()} total violations detected
          </p>
        </div>
        <div 
          className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5' }}
        >
          <AlertTriangle className="w-4 h-4" style={{ color: '#f97316' }} />
          <span className="text-xs font-medium" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
            Live Monitoring
          </span>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="space-y-4 flex-1">
        {data.map((item, index) => {
          const barWidth = (item.count / maxCount) * 100;
          const severityColor = getSeverityColor(item.severity);
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={item.category}
              className={`transition-all duration-300 cursor-pointer ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Category Label Row */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="p-1.5 rounded-lg"
                    style={{ backgroundColor: `${severityColor}15` }}
                  >
                    {getCategoryIcon(item.category, severityColor)}
                  </div>
                  <span 
                    className="text-sm font-medium"
                    style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                  >
                    {item.category}
                  </span>
                  <span 
                    className="px-2 py-0.5 rounded text-xs font-medium uppercase"
                    style={{ 
                      backgroundColor: `${severityColor}20`,
                      color: severityColor
                    }}
                  >
                    {item.severity}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span 
                    className="text-sm font-bold tabular-nums"
                    style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                  >
                    {item.count.toLocaleString()}
                  </span>
                  <div 
                    className="flex items-center gap-1 text-xs font-medium"
                    style={{ color: item.trend > 0 ? '#ef4444' : '#22c55e' }}
                  >
                    {item.trend > 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>{Math.abs(item.trend)}%</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div 
                className="relative h-3 rounded-full overflow-hidden"
                style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#F0F0F0' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: isVisible ? `${barWidth}%` : '0%',
                    backgroundColor: severityColor,
                    boxShadow: isHovered ? `0 0 12px ${severityColor}80` : 'none',
                    transform: isHovered ? 'scaleY(1.2)' : 'scaleY(1)',
                    transitionDelay: `${index * 100}ms`
                  }}
                />
                {/* Percentage label */}
                <span 
                  className={`absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold transition-opacity duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                >
                  {item.percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t" style={{ borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5' }}>
        {['critical', 'high', 'medium', 'low'].map((severity) => (
          <div key={severity} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getSeverityColor(severity as any) }}
            />
            <span className="text-xs capitalize" style={{ color: '#939394' }}>
              {severity}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

