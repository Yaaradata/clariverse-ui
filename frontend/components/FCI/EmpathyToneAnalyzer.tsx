'use client';

import { useState } from 'react';
import { EmpathyToneData } from '@/lib/fci-lib/fciAdvancedData';
import { ChevronDown, ChevronUp, AlertTriangle, BookOpen } from 'lucide-react';

interface EmpathyToneAnalyzerProps {
  data: EmpathyToneData;
  isDarkMode?: boolean;
}

export function EmpathyToneAnalyzer({ data, isDarkMode = false }: EmpathyToneAnalyzerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-lg font-bold"
          style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
        >
          Component D: The "Empathy & Tone" Analyzer
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded hover:bg-opacity-20"
          style={{ color: '#939394' }}
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Sentiment Score */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
            Sentiment Score
          </span>
          <span className="text-lg font-bold" style={{ color: data.sentimentScore > 0 ? '#10b981' : '#ef4444' }}>
            {data.sentimentScore > 0 ? '+' : ''}{data.sentimentScore.toFixed(2)}
          </span>
        </div>
        <div className="relative w-full h-6 rounded-full overflow-hidden" style={{ backgroundColor: isDarkMode ? '#2a2a2a' : '#F3F4F6' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.abs(data.sentimentScore) * 100}%`,
              backgroundColor: data.sentimentScore > 0 ? '#10b981' : '#ef4444'
            }}
          />
        </div>
        <p className="text-xs mt-1" style={{ color: '#939394' }}>
          NLP analysis of transcript text
        </p>
      </div>

      {/* Alert */}
      {data.alerts.detected && (
        <div
          className="mb-4 p-3 rounded-lg border-l-4 flex items-start gap-3"
          style={{
            borderColor: '#B90ABD',
            backgroundColor: isDarkMode ? '#B90ABD30' : '#B90ABD10'
          }}
        >
          <AlertTriangle className="w-5 h-5 mt-0.5" style={{ color: '#B90ABD' }} />
          <div className="flex-1">
            <p className="text-sm font-semibold mb-1" style={{ color: '#B90ABD' }}>
              Alert: Transactional Tone Threshold Exceeded
            </p>
            <p className="text-xs" style={{ color: isDarkMode ? '#D6D9D8' : '#010101' }}>
              The bar shifts to majority Transactional ({data.transactionalPercent}%). Customer sentiment drops when agents use words like 'Policy' more than 3 times.
            </p>
          </div>
        </div>
      )}

      {/* AI Recommendation */}
      {data.aiRecommendation && (
        <div
          className="mb-4 p-3 rounded-lg"
          style={{
            backgroundColor: isDarkMode ? '#5332FF40' : '#5332FF20'
          }}
        >
          <p className="text-sm font-semibold mb-1" style={{ color: '#5332FF' }}>
            AI Recommendation
          </p>
          <p className="text-xs mb-2" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
            <strong>{data.aiRecommendation.title}</strong>: {data.aiRecommendation.description}
          </p>
          <p className="text-xs font-semibold" style={{ color: '#5332FF' }}>
            Action: {data.aiRecommendation.action}
          </p>
        </div>
      )}

      {/* Training Link */}
      <div className="mb-4 flex items-center gap-2">
        <BookOpen className="w-4 h-4" style={{ color: '#5332FF' }} />
        <span className="text-xs" style={{ color: '#939394' }}>
          Training Link: <strong style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>{data.trainingLink}</strong>
        </span>
      </div>

      {/* Stacked Percentage Bar */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold mb-2" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
          Visual Representation: Stacked Percentage Bar
        </h4>
        <div className="relative w-full h-12 rounded-lg overflow-hidden border" style={{ borderColor: isDarkMode ? '#939394' : '#D6D9D8' }}>
          <div
            className="absolute left-0 top-0 h-full flex items-center justify-start pl-2 transition-all duration-500"
            style={{
              width: `${data.relationalPercent}%`,
              backgroundColor: '#10b981'
            }}
          >
            {data.relationalPercent > 10 && (
              <span className="text-xs font-semibold text-white">
                Relational {data.relationalPercent}%
              </span>
            )}
          </div>
          <div
            className="absolute right-0 top-0 h-full flex items-center justify-end pr-2 transition-all duration-500"
            style={{
              width: `${data.transactionalPercent}%`,
              backgroundColor: '#939394'
            }}
          >
            {data.transactionalPercent > 10 && (
              <span className="text-xs font-semibold text-white">
                Transactional {data.transactionalPercent}%
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: '#939394' }}>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#10b981' }}></div>
            <span>Left Side (Green): Relational Interactions (Empathetic)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#939394' }}></div>
            <span>Right Side (Grey): Transactional Interactions (Robotic)</span>
          </div>
        </div>
      </div>

      {/* Keywords Breakdown */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h5 className="text-xs font-semibold mb-2" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
            Relational Keywords:
          </h5>
          <div className="space-y-1">
            {data.relationalKeywords.map((keyword, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs p-1 rounded"
                style={{
                  backgroundColor: isDarkMode ? '#2a2a2a' : '#F9FAFB'
                }}
              >
                <span style={{ color: '#10b981' }}>{keyword.keyword}</span>
                <span style={{ color: '#939394' }}>{keyword.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h5 className="text-xs font-semibold mb-2" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
            Transactional Keywords:
          </h5>
          <div className="space-y-1">
            {data.transactionalKeywords.map((keyword, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs p-1 rounded"
                style={{
                  backgroundColor: isDarkMode ? '#2a2a2a' : '#F9FAFB'
                }}
              >
                <span style={{ color: '#939394' }}>{keyword.keyword}</span>
                <span style={{ color: '#939394' }}>{keyword.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expand Section */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t" style={{ borderColor: isDarkMode ? '#939394' : '#D6D9D8' }}>
          <p className="text-xs mb-2" style={{ color: '#939394' }}>
            <strong>Purpose:</strong> To address Failed from Customer reasons by analyzing the Sentiment and "Relational vs. Transactional" balance.
          </p>
          <p className="text-xs" style={{ color: '#939394' }}>
            <strong>Score Calculation:</strong> (Count of Relational_Keywords) / (Total_Keywords) * Weighting_Factor
          </p>
        </div>
      )}
    </div>
  );
}

