'use client';

import { Gauge, AlertTriangle, Clock, Phone, MessageSquare } from 'lucide-react';
import { CustomerEmotionData } from '@/lib/fci-lib/fciData';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface CustomerEmotionProps {
  data: CustomerEmotionData;
  isDarkMode?: boolean;
}

export function CustomerEmotion({ data, isDarkMode = false }: CustomerEmotionProps) {
  const getSentimentColor = (percent: number) => {
    if (percent >= 50) return '#B90ABD';
    if (percent >= 30) return '#5332FF';
    return '#939394';
  };

  return (
    <div
      className="border rounded-lg p-4 shadow-sm h-full flex flex-col"
      style={{
        borderColor: isDarkMode ? '#939394' : '#D6D9D8',
        backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF'
      }}
    >
      <h3
        className="text-lg font-bold mb-4"
        style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
      >
Customer Emotion & Friction Indicators
      </h3>

      {/* Sentiment Gauge */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
            Negative Sentiment %
          </h4>
          <div className="flex items-center gap-2">
            {data.sentimentTrend > 0 ? (
              <TrendingUp className="w-4 h-4 text-red-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-green-500" />
            )}
            <span className="text-xs" style={{ color: '#939394' }}>
              {Math.abs(data.sentimentTrend)}% vs last period
            </span>
          </div>
        </div>
        <div className="relative w-full h-8 rounded-full overflow-hidden" style={{ backgroundColor: isDarkMode ? '#2a2a2a' : '#F3F4F6' }}>
          <div
            className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
            style={{
              width: `${data.negativeSentimentPercent}%`,
              backgroundColor: getSentimentColor(data.negativeSentimentPercent)
            }}
          >
            <span className="text-xs font-bold text-white">
              {data.negativeSentimentPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Frustration Signals */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold mb-3" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
          Frustration Signals:
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div
            className="border rounded-lg p-3"
            style={{
              borderColor: isDarkMode ? '#939394' : '#D6D9D8',
              backgroundColor: isDarkMode ? '#2a2a2a' : '#F9FAFB'
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4" style={{ color: '#B90ABD' }} />
              <span className="text-xs font-semibold" style={{ color: isDarkMode ? '#D6D9D8' : '#010101' }}>
                Escalations
              </span>
            </div>
            <div className="text-2xl font-bold" style={{ color: '#5332FF' }}>
              {data.frustrationSignals.escalations}
            </div>
          </div>
          <div
            className="border rounded-lg p-3"
            style={{
              borderColor: isDarkMode ? '#939394' : '#D6D9D8',
              backgroundColor: isDarkMode ? '#2a2a2a' : '#F9FAFB'
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4" style={{ color: '#B90ABD' }} />
              <span className="text-xs font-semibold" style={{ color: isDarkMode ? '#D6D9D8' : '#010101' }}>
                Long Handling Time
              </span>
            </div>
            <div className="text-2xl font-bold" style={{ color: '#5332FF' }}>
              {data.frustrationSignals.longHandlingTimeCases}
            </div>
          </div>
          <div
            className="border rounded-lg p-3"
            style={{
              borderColor: isDarkMode ? '#939394' : '#D6D9D8',
              backgroundColor: isDarkMode ? '#2a2a2a' : '#F9FAFB'
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="w-4 h-4" style={{ color: '#B90ABD' }} />
              <span className="text-xs font-semibold" style={{ color: isDarkMode ? '#D6D9D8' : '#010101' }}>
                Interruptions
              </span>
            </div>
            <div className="text-2xl font-bold" style={{ color: '#5332FF' }}>
              {data.frustrationSignals.interruptions}
            </div>
          </div>
          <div
            className="border rounded-lg p-3"
            style={{
              borderColor: isDarkMode ? '#939394' : '#D6D9D8',
              backgroundColor: isDarkMode ? '#2a2a2a' : '#F9FAFB'
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Phone className="w-4 h-4" style={{ color: '#B90ABD' }} />
              <span className="text-xs font-semibold" style={{ color: isDarkMode ? '#D6D9D8' : '#010101' }}>
                High Agitation Calls
              </span>
            </div>
            <div className="text-2xl font-bold" style={{ color: '#5332FF' }}>
              {data.frustrationSignals.highAgitationCalls}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}


