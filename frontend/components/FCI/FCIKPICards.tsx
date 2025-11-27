'use client';

import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { FCIKPIData } from '@/lib/fci-lib/fciData';

interface FCIKPICardsProps {
  data: FCIKPIData;
  isDarkMode?: boolean;
}

export function FCIKPICards({ data, isDarkMode = false }: FCIKPICardsProps) {
  const kpiItems = [
    {
      label: 'Overall FCI Rate',
      value: `${data.overallFCIRate.value}%`,
      trend: data.overallFCIRate.trend,
      description: data.overallFCIRate.description,
      isPositive: data.overallFCIRate.trend < 0
    },
    {
      label: 'Preventable FCI %',
      value: `${data.preventableFCIPercent.value}%`,
      trend: data.preventableFCIPercent.trend,
      description: data.preventableFCIPercent.description,
      isPositive: data.preventableFCIPercent.trend < 0
    },
    {
      label: 'Repeat Contact Rate',
      value: `${data.repeatContactRate.value}%`,
      trend: data.repeatContactRate.trend,
      description: data.repeatContactRate.description,
      isPositive: data.repeatContactRate.trend < 0
    },
    {
      label: 'Unresolved Case %',
      value: `${data.unresolvedCasePercent.value}%`,
      trend: data.unresolvedCasePercent.trend,
      description: data.unresolvedCasePercent.description,
      isPositive: data.unresolvedCasePercent.trend < 0
    },
    {
      label: 'Business Impact Estimate ($)',
      value: `$${(data.businessImpactEstimate.value / 1000000).toFixed(2)}M`,
      trend: data.businessImpactEstimate.trend,
      description: data.businessImpactEstimate.description,
      isPositive: data.businessImpactEstimate.trend < 0
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {kpiItems.map((kpi, idx) => (
        <div
          key={idx}
          className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          style={{
            borderColor: isDarkMode ? '#939394' : '#D6D9D8',
            backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF'
          }}
        >
          <div className="flex items-start justify-between mb-2">
            <h3
              className="font-semibold text-sm"
              style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
            >
              {kpi.label}
            </h3>
            {kpi.trend !== 0 && (
              <div
                className="flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold"
                style={{
                  color: kpi.isPositive ? '#10b981' : '#ef4444',
                  backgroundColor: isDarkMode
                    ? (kpi.isPositive ? '#10b98120' : '#ef444420')
                    : (kpi.isPositive ? '#10b98110' : '#ef444410')
                }}
              >
                {kpi.isPositive ? (
                  <TrendingDown className="w-3 h-3" />
                ) : (
                  <TrendingUp className="w-3 h-3" />
                )}
                <span>{Math.abs(kpi.trend)}%</span>
              </div>
            )}
          </div>
          <div
            className="text-3xl font-bold mb-1"
            style={{ color: '#5332FF' }}
          >
            {kpi.value}
          </div>
          <p className="text-xs" style={{ color: '#939394' }}>
            {kpi.description}
          </p>
        </div>
      ))}
      
      {/* High-risk customers badge */}
      {data.highRiskCustomersImpacted > 0 && (
        <div
          className="col-span-full border rounded-lg p-3 flex items-center gap-3"
          style={{
            borderColor: '#B90ABD',
            backgroundColor: isDarkMode ? '#B90ABD30' : '#B90ABD10'
          }}
        >
          <AlertTriangle className="w-5 h-5" style={{ color: '#B90ABD' }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: '#B90ABD' }}>
              ⚠️ High-risk customers impacted
            </p>
            <p className="text-xs" style={{ color: isDarkMode ? '#D6D9D8' : '#010101' }}>
              {data.highRiskCustomersImpacted} customers at risk of churn
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

