'use client';

import { useState, useEffect } from 'react';
import { Package, AlertCircle } from 'lucide-react';
import { PainVolumeData, formatNumber } from '@/lib/paingradation-lib';

interface PainVolumeProps {
  data: PainVolumeData;
  isDarkMode?: boolean;
}

export function PainVolume({ data, isDarkMode = false }: PainVolumeProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const maxSparkline = Math.max(...data.sparklineData);
  const minSparkline = Math.min(...data.sparklineData);
  const range = maxSparkline - minSparkline || 1;

  // Generate sparkline path
  const sparklinePoints = data.sparklineData.map((value, index) => {
    const x = (index / (data.sparklineData.length - 1)) * 100;
    const y = 40 - ((value - minSparkline) / range) * 35;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div
      className={`rounded-2xl overflow-hidden transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{
        backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF',
        border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`,
        boxShadow: isDarkMode
          ? '0 4px 24px rgba(0, 0, 0, 0.4)'
          : '0 4px 24px rgba(0, 0, 0, 0.06)',
        transitionDelay: '100ms',
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4"
        style={{
          background: isDarkMode
            ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, #0d0d0d 100%)'
            : 'linear-gradient(135deg, rgba(249, 115, 22, 0.08) 0%, #FFFFFF 100%)',
          borderBottom: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
              }}
            >
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3
                className="text-sm font-bold"
                style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
              >
                Pain Volume
              </h3>
              <p className="text-xs" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
                High-pain intent interactions
              </p>
            </div>
          </div>
          <AlertCircle className="w-4 h-4" style={{ color: '#f97316' }} />
        </div>
      </div>

      {/* Main Content */}
      <div className="p-5">
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="flex items-baseline gap-1">
              <span
                className="text-4xl font-black"
                style={{ color: '#f97316' }}
              >
                {data.percentage}%
              </span>
            </div>
            <p className="text-sm mt-1" style={{ color: isDarkMode ? '#CCCCCC' : '#666666' }}>
              {formatNumber(data.totalCases)} cases
            </p>
          </div>

          {/* Sparkline */}
          <div className="w-24 h-12">
            <svg viewBox="0 0 100 45" className="w-full h-full">
              <defs>
                <linearGradient id="sparklineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Fill area */}
              <polygon
                points={`0,45 ${sparklinePoints} 100,45`}
                fill="url(#sparklineGradient)"
              />
              {/* Line */}
              <polyline
                points={sparklinePoints}
                fill="none"
                stroke="#f97316"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* End dot */}
              <circle
                cx="100"
                cy={40 - ((data.sparklineData[data.sparklineData.length - 1] - minSparkline) / range) * 35}
                r="3"
                fill="#f97316"
              />
            </svg>
          </div>
        </div>

        {/* Breakdown bars */}
        <div className="space-y-2">
          {[
            { label: 'Delivery Promise Broken', value: data.breakdown.deliveryPromiseBroken, color: '#ef4444' },
            { label: 'Refund Delay', value: data.breakdown.refundDelay, color: '#f97316' },
            { label: 'Wrong/Damaged Item', value: data.breakdown.wrongDamagedItem, color: '#eab308' },
            { label: 'Return Friction', value: data.breakdown.returnReplacementFriction, color: '#a855f7' },
          ].map((item) => {
            const percentage = (item.value / data.totalCases) * 100;
            return (
              <div key={item.label} className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px]" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
                      {item.label}
                    </span>
                    <span className="text-[10px] font-medium" style={{ color: isDarkMode ? '#CCCCCC' : '#666666' }}>
                      {formatNumber(item.value)}
                    </span>
                  </div>
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ backgroundColor: isDarkMode ? '#2a2a2a' : '#E5E5E5' }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

