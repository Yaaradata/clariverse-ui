'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Zap } from 'lucide-react';
import { SeverePainIncidentsData, formatNumber } from '@/lib/paingradation-lib';

interface SeverePainIncidentsProps {
  data: SeverePainIncidentsData;
  isDarkMode?: boolean;
}

export function SeverePainIncidents({ data, isDarkMode = false }: SeverePainIncidentsProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const colors = ['#ef4444', '#f97316', '#a855f7'];

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
        transitionDelay: '200ms',
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4"
        style={{
          background: isDarkMode
            ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, #0d0d0d 100%)'
            : 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, #FFFFFF 100%)',
          borderBottom: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-xl relative"
              style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
              }}
            >
              <AlertTriangle className="w-5 h-5 text-white" />
              <div
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse"
                style={{ backgroundColor: '#ef4444', boxShadow: '0 0 8px #ef4444' }}
              />
            </div>
            <div>
              <h3
                className="text-sm font-bold"
                style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
              >
                Severe Pain Incidents
              </h3>
              <p className="text-xs" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
                Critical escalations today
              </p>
            </div>
          </div>
          <Zap className="w-4 h-4" style={{ color: '#ef4444' }} />
        </div>
      </div>

      {/* Main Content */}
      <div className="p-5">
        {/* Total Cases */}
        <div className="text-center mb-5">
          <span
            className="text-5xl font-black"
            style={{
              color: '#ef4444',
              textShadow: '0 0 30px rgba(239, 68, 68, 0.3)',
            }}
          >
            {formatNumber(data.totalCases)}
          </span>
          <p className="text-sm mt-1" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
            severe cases today
          </p>
        </div>

        {/* Breakdown Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {data.breakdown.map((item, index) => (
            <div
              key={item.category}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{
                backgroundColor: `${colors[index]}15`,
                border: `1px solid ${colors[index]}30`,
              }}
            >
              <span
                className="text-xs font-medium"
                style={{ color: colors[index] }}
              >
                {item.category}
              </span>
              <span
                className="text-xs font-bold px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: colors[index],
                  color: '#FFFFFF',
                }}
              >
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>

        {/* Horizontal breakdown bar */}
        <div className="h-3 rounded-full overflow-hidden flex" style={{ backgroundColor: isDarkMode ? '#2a2a2a' : '#E5E5E5' }}>
          {data.breakdown.map((item, index) => (
            <div
              key={item.category}
              className="h-full transition-all duration-1000"
              style={{
                width: `${item.percentage}%`,
                backgroundColor: colors[index],
              }}
            />
          ))}
        </div>
      </div>

      {/* Criteria Footer */}
      <div
        className="px-5 py-3 border-t"
        style={{
          borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5',
          backgroundColor: isDarkMode ? '#0a0a0a' : '#FAFAFA',
        }}
      >
        <p className="text-[10px] font-medium mb-1" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
          QUALIFYING CRITERIA
        </p>
        <div className="flex flex-wrap gap-1">
          {data.criteria.map((criterion, index) => (
            <span
              key={index}
              className="text-[9px] px-2 py-0.5 rounded"
              style={{
                backgroundColor: isDarkMode ? '#1a1a1a' : '#F0F0F0',
                color: isDarkMode ? '#CCCCCC' : '#666666',
              }}
            >
              {criterion}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

