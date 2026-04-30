'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { EscalationData } from '@/lib/fci-lib/fciAdvancedData';
import { ChevronDown, ChevronUp, AlertTriangle, BookOpen } from 'lucide-react';

interface AvoidableEscalationSplitBarProps {
  data: EscalationData;
  isDarkMode?: boolean;
}

export function AvoidableEscalationSplitBar({ data, isDarkMode = false }: AvoidableEscalationSplitBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showWeakPhrases, setShowWeakPhrases] = useState(false);

  const chartData = [
    {
      name: 'Escalations',
      'Confidence Gap': data.confidenceGapPercent,
      'Process Requirement': data.processRequirementPercent
    }
  ];

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-lg font-bold"
          style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
        >
          Component C: The "Avoidable Escalation" Split-Bar
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded hover:bg-opacity-20"
          style={{ color: '#939394' }}
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div
          className="border rounded-lg p-3"
          style={{
            borderColor: isDarkMode ? '#939394' : '#D6D9D8',
            backgroundColor: isDarkMode ? '#2a2a2a' : '#F9FAFB'
          }}
        >
          <p className="text-xs mb-1" style={{ color: '#939394' }}>Total Escalations</p>
          <p className="text-2xl font-bold" style={{ color: '#5332FF' }}>
            {data.totalEscalations}
          </p>
        </div>
        <div
          className="border rounded-lg p-3"
          style={{
            borderColor: isDarkMode ? '#939394' : '#D6D9D8',
            backgroundColor: isDarkMode ? '#2a2a2a' : '#F9FAFB'
          }}
        >
          <p className="text-xs mb-1" style={{ color: '#939394' }}>Confidence Gap %</p>
          <p className="text-2xl font-bold" style={{ color: '#B90ABD' }}>
            {data.confidenceGapPercent}%
          </p>
          <p className="text-xs mt-1" style={{ color: '#939394' }}>
            {data.confidenceGapCount} escalations
          </p>
        </div>
        <div
          className="border rounded-lg p-3"
          style={{
            borderColor: isDarkMode ? '#939394' : '#D6D9D8',
            backgroundColor: isDarkMode ? '#2a2a2a' : '#F9FAFB'
          }}
        >
          <p className="text-xs mb-1" style={{ color: '#939394' }}>Process Requirement %</p>
          <p className="text-2xl font-bold" style={{ color: '#5332FF' }}>
            {data.processRequirementPercent}%
          </p>
          <p className="text-xs mt-1" style={{ color: '#939394' }}>
            {data.processRequirementCount} escalations
          </p>
        </div>
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
              Alert: Confidence Gap Threshold Exceeded
            </p>
            <p className="text-xs" style={{ color: isDarkMode ? '#D6D9D8' : '#010101' }}>
              Red Segment ("Confidence Gap") is {data.confidenceGapPercent}% (threshold: {data.alerts.confidenceGapThreshold}%)
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
          <p className="text-xs font-semibold mb-1" style={{ color: '#5332FF' }}>
            Action: {data.aiRecommendation.action}
          </p>
          <p className="text-xs" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
            {data.aiRecommendation.coaching}
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

      {/* Horizontal Stacked Bar */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold mb-2" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
          Visual Representation: Horizontal Stacked Bar (Normalized to 100%)
        </h4>
        <ResponsiveContainer width="100%" height={100}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis dataKey="name" type="category" hide />
            <Tooltip
              contentStyle={{
                backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF',
                border: `1px solid ${isDarkMode ? '#939394' : '#D6D9D8'}`,
                borderRadius: '8px'
              }}
              formatter={(value, name) => [`${Number(value ?? 0)}%`, String(name)]}
            />
            <Bar dataKey="Confidence Gap" stackId="a" fill="#B90ABD" radius={[0, 4, 4, 0]}>
              <Cell
                fill="#B90ABD"
                style={{ cursor: 'pointer' }}
                onClick={() => setShowWeakPhrases(!showWeakPhrases)}
              />
            </Bar>
            <Bar dataKey="Process Requirement" stackId="a" fill="#5332FF" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: '#939394' }}>
          <div
            className="flex items-center gap-1 cursor-pointer hover:opacity-80"
            onClick={() => setShowWeakPhrases(!showWeakPhrases)}
          >
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#B90ABD' }}></div>
            <span>Left Segment (Red): Confidence Gap - Click to expand</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#5332FF' }}></div>
            <span>Right Segment (Blue): Process Requirement</span>
          </div>
        </div>
      </div>

      {/* Weak Phrases List */}
      {showWeakPhrases && (
        <div
          className="mb-4 p-3 rounded-lg border"
          style={{
            borderColor: '#B90ABD',
            backgroundColor: isDarkMode ? '#B90ABD20' : '#B90ABD10'
          }}
        >
          <h5 className="text-sm font-semibold mb-2" style={{ color: '#B90ABD' }}>
            Weak Phrases Used in Escalations:
          </h5>
          <div className="space-y-2">
            {data.weakPhrases.map((phrase, idx) => (
              <div
                key={idx}
                className="p-2 rounded"
                style={{
                  backgroundColor: isDarkMode ? '#2a2a2a' : '#FFFFFF'
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                    "{phrase.phrase}"
                  </span>
                  <span className="text-xs" style={{ color: '#939394' }}>
                    {phrase.count} occurrences
                  </span>
                </div>
                <p className="text-xs" style={{ color: '#939394' }}>
                  Context: {phrase.context}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expand Section */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t" style={{ borderColor: isDarkMode ? '#939394' : '#D6D9D8' }}>
          <p className="text-xs mb-2" style={{ color: '#939394' }}>
            <strong>Purpose:</strong> To differentiate between necessary escalations (e.g., Compliance/Fraud triggers) and avoidable escalations caused by an agent's lack of confidence or failure to "Take Ownership".
          </p>
          <p className="text-xs" style={{ color: '#939394' }}>
            <strong>Interactivity:</strong> Clicking the "Red" segment expands a list of the specific "Weak Phrases" used in the email threads, chats, voice transcripts, or trouble tickets.
          </p>
        </div>
      )}
    </div>
  );
}

