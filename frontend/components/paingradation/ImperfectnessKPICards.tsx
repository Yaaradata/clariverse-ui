'use client';

import { PackageX, IndianRupee, AlertCircle, MapPin } from 'lucide-react';
import { useTheme } from './useTheme';

interface ImperfectnessKPIData {
  imperfectOrderCount: number;
  imperfectOrderPercentage: number;
  totalOrders: number;
  businessImpactAmount: number;
  businessImpactTopic: string;
  maxImperfectOrdersRegion: string;
  maxImperfectOrdersCount: number;
}

interface ImperfectnessKPICardsProps {
  data: ImperfectnessKPIData;
}

export function ImperfectnessKPICards({ data }: ImperfectnessKPICardsProps) {
  const isDarkMode = useTheme();
  const kpiCards = [
    {
      title: 'Friction Instances',
      value: data.imperfectOrderCount.toLocaleString('en-US'),
      subtext: `${data.imperfectOrderPercentage.toFixed(1)}% of total orders`,
      percentage: data.imperfectOrderPercentage,
      icon: PackageX,
      color: 'text-white',
      bgColor: 'bg-purple-500/10',
      iconColor: 'text-purple-400',
      showHighlight: false,
      showSparkle: false,
    },
    {
      title: 'Churn Risk Value',
      value: `₹${data.businessImpactAmount.toLocaleString('en-US')}`,
      subtext: 'Total financial impact',
      icon: IndianRupee,
      color: 'text-white',
      bgColor: 'bg-red-500/10',
      iconColor: 'text-red-400',
      showHighlight: false,
      showSparkle: false,
    },
    {
      title: 'Top Detractor Driver',
      value: data.businessImpactTopic,
      subtext: 'Primary concern area',
      icon: AlertCircle,
      color: 'text-white',
      bgColor: 'bg-yellow-500/10',
      iconColor: 'text-yellow-400',
      showHighlight: false,
      showSparkle: true,
    },
    {
      title: 'Lowest CSAT Region',
      value: data.maxImperfectOrdersRegion,
      subtext: `${data.maxImperfectOrdersCount.toLocaleString('en-US')} imperfect orders`,
      icon: MapPin,
      color: 'text-white',
      bgColor: 'bg-green-500/10',
      iconColor: 'text-green-400',
      showHighlight: false,
      showSparkle: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
      {kpiCards.map((card, index) => {
        const Icon = card.icon;
        const isHighPercentage = card.percentage && card.percentage > 10;

        return (
          <div
            key={index}
            className="relative overflow-hidden group transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 rounded-lg flex flex-col"
            style={{
              backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF',
              borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5',
              borderWidth: '1px',
              borderStyle: 'solid',
              minHeight: '140px',
            }}
          >
            {/* Purple glow effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-linear-to-br from-[#b90abd]/10 via-[#b90abd]/5 to-transparent" />

            <div className="relative z-10 w-full px-4 py-4 flex flex-col">
              <div className="flex items-center justify-between mb-2 w-full">
                <div className="flex items-center gap-2">
                  {card.showSparkle && (
                    <span className="text-xl" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>✨</span>
                  )}
                  <h3 className="text-xs font-medium" style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}>
                    {card.title}
                  </h3>
                </div>
                <div
                  className={`p-1.5 rounded-lg ${card.bgColor} group-hover:scale-110 transition-transform duration-200`}
                >
                  <Icon className={`h-3.5 w-3.5 ${card.iconColor}`} />
                </div>
              </div>

              <div className="text-2xl font-bold mb-1 whitespace-nowrap text-left" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                {card.value}
              </div>
              <div className="text-xs whitespace-nowrap text-left" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
                {index === 0 ? (
                  // Imperfect Order Count - show percentage in red if high
                  <>
                    {isHighPercentage ? (
                      <>
                        <span className="text-red-400 font-semibold">
                          {card.percentage?.toFixed(1)}%
                        </span>
                        {' of total orders'}
                      </>
                    ) : (
                      `${card.percentage?.toFixed(1)}% of total orders`
                    )}
                  </>
                ) : index === 1 ? (
                  // Business Impact Amount - simple text
                  card.subtext
                ) : index === 2 ? (
                  // Business Impact Topic - show count if available
                  card.subtext
                ) : (
                  // Max Imperfect Orders Region - highlight count in purple
                  <>
                    <span className="text-purple-400 font-semibold">
                      {data.maxImperfectOrdersCount.toLocaleString('en-US')}
                    </span>
                    {' imperfect orders'}
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
