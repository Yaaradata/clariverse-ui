'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PackageX, DollarSign, AlertCircle, MapPin, Sparkles } from 'lucide-react';

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
  const kpiCards = [
    {
      title: 'Imperfect Order Count',
      value: data.imperfectOrderCount.toLocaleString('en-US'),
      subtext: `${data.imperfectOrderPercentage.toFixed(1)}% of total orders`,
      percentage: data.imperfectOrderPercentage,
      icon: PackageX,
      color: 'text-white',
      bgColor: 'bg-purple-500/10',
      iconColor: 'text-purple-400',
      showHighlight: data.imperfectOrderPercentage > 10,
    },
    {
      title: 'Business Impact Amount',
      value: `₹${data.businessImpactAmount.toLocaleString('en-US')}`,
      subtext: 'Total financial impact',
      icon: DollarSign,
      color: 'text-white',
      bgColor: 'bg-red-500/10',
      iconColor: 'text-red-400',
      showHighlight: data.businessImpactAmount > 1000000,
    },
    {
      title: 'Business Impact Topic',
      value: data.businessImpactTopic,
      subtext: 'Primary concern area',
      icon: AlertCircle,
      color: 'text-white',
      bgColor: 'bg-yellow-500/10',
      iconColor: 'text-yellow-400',
      showHighlight: false,
    },
    {
      title: 'Max Imperfect Orders Region',
      value: data.maxImperfectOrdersRegion,
      subtext: `${data.maxImperfectOrdersCount.toLocaleString('en-US')} imperfect orders`,
      icon: MapPin,
      color: 'text-white',
      bgColor: 'bg-green-500/10',
      iconColor: 'text-green-400',
      showHighlight: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
      {kpiCards.map((card, index) => {
        const Icon = card.icon;
        const isHighPercentage = card.percentage && card.percentage > 10;

        return (
          <Card
            key={index}
            className="relative overflow-hidden group transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 bg-[#0d0d0d] border border-[#2a2a2a]"
          >
            {/* Sparkle Icon for highlights */}
            {card.showHighlight && (
              <div className="absolute top-2 left-2 z-10">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
              </div>
            )}

            {/* Purple glow effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-[#b90abd]/10 via-[#b90abd]/5 to-transparent" />

            <CardHeader
              className={`flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-3 relative z-10 ${
                card.showHighlight ? 'pt-8' : ''
              }`}
            >
              <CardTitle className="text-xs font-medium text-gray-300">
                {card.title}
              </CardTitle>
              <div
                className={`p-1.5 rounded-lg ${card.bgColor} group-hover:scale-110 transition-transform duration-200`}
              >
                <Icon className={`h-3.5 w-3.5 ${card.iconColor}`} />
              </div>
            </CardHeader>

            <CardContent className="relative z-10 px-4 pb-4">
              <div>
                <div className="text-2xl font-bold text-white mb-1">
                  {card.value}
                </div>
                <div className="text-xs text-gray-400">
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
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
