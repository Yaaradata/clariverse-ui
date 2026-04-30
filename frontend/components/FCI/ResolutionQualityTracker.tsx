'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ResolutionQualityData } from '@/lib/fci-lib/fciAdvancedData';
import { ChevronDown, ChevronUp, AlertTriangle, BookOpen } from 'lucide-react';

interface ResolutionQualityTrackerProps {
  data: ResolutionQualityData;
  isDarkMode?: boolean;
}

export function ResolutionQualityTracker({ data, isDarkMode = false }: ResolutionQualityTrackerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const activeAlert = data.alerts.find(a => a.detected);

  return (
    <div
      className="border rounded-lg p-4 shadow-sm h-full flex flex-col"
      style={{
        borderColor: isDarkMode ? '#939394' : '#D6D9D8',
        backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF'
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-lg font-bold"
          style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
        >
          Component A: Resolution Effectiveness Monitor
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded hover:bg-opacity-20"
          style={{ color: '#939394' }}
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Alert - Moved to Top */}
      {activeAlert && (
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
              Alert: Spike in Re-opens Detected
            </p>
            <p className="text-xs" style={{ color: isDarkMode ? '#D6D9D8' : '#010101' }}>
              {activeAlert.category}: {activeAlert.reopenRate}% re-open rate (threshold: {activeAlert.threshold}%)
            </p>
          </div>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div
          className="border rounded-lg p-3"
          style={{
            borderColor: isDarkMode ? '#939394' : '#D6D9D8',
            backgroundColor: isDarkMode ? '#2a2a2a' : '#F9FAFB'
          }}
        >
          <p className="text-xs mb-1" style={{ color: '#939394' }}>FCR Rate</p>
          <p className="text-2xl font-bold" style={{ color: '#5332FF' }}>
            {data.fcrRate}%
          </p>
          <p className="text-xs mt-1" style={{ color: '#939394' }}>
            (Unique_Tickets_Resolved_Without_Followup / Total_Unique_Tickets) * 100
          </p>
        </div>
        <div
          className="border rounded-lg p-3"
          style={{
            borderColor: isDarkMode ? '#939394' : '#D6D9D8',
            backgroundColor: isDarkMode ? '#2a2a2a' : '#F9FAFB'
          }}
        >
          <p className="text-xs mb-1" style={{ color: '#939394' }}>Re-open Rate</p>
          <p className="text-2xl font-bold" style={{ color: '#B90ABD' }}>
            {data.reopenRate}%
          </p>
          <p className="text-xs mt-1" style={{ color: '#939394' }}>
            (Tickets_Reopened_Within_48hrs / Total_Closed_Tickets) * 100
          </p>
        </div>
      </div>

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

      {/* Trend Graph */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold mb-3" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
          Resolution Quality Trends
        </h4>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data.trendData} margin={{ top: 10, right: 30, left: 10, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#444' : '#e0e0e0'} />
            <XAxis
              dataKey="date"
              tick={{ fill: isDarkMode ? '#D6D9D8' : '#010101', fontSize: 11 }}
              axisLine={{ stroke: isDarkMode ? '#666' : '#ccc' }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: isDarkMode ? '#D6D9D8' : '#010101', fontSize: 11 }}
              axisLine={{ stroke: isDarkMode ? '#666' : '#ccc' }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF',
                border: `1px solid ${isDarkMode ? '#939394' : '#D6D9D8'}`,
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(value, name) => {
                const safeValue = Number(value ?? 0);
                const safeName = String(name);
                const label = safeName === 'fcrRate' ? 'FCR Rate' : 'Re-open Rate';
                return [`${safeValue}%`, label];
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '10px' }}
              formatter={(value) => value === 'fcrRate' ? 'FCR Rate' : 'Re-open Rate'}
            />
            
            {/* FCR Rate Line */}
            <Line
              type="monotone"
              dataKey="fcrRate"
              stroke="#5332FF"
              strokeWidth={2.5}
              name="fcrRate"
              dot={{ r: 5, fill: '#5332FF', stroke: '#fff', strokeWidth: 2 }}
              activeDot={{ r: 7, fill: '#5332FF' }}
            />
            
            {/* Re-open Rate Line */}
            <Line
              type="monotone"
              dataKey="reopenRate"
              stroke="#B90ABD"
              strokeWidth={2.5}
              name="reopenRate"
              dot={{ r: 5, fill: '#B90ABD', stroke: '#fff', strokeWidth: 2 }}
              activeDot={{ r: 7, fill: '#B90ABD' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Expand Section */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t" style={{ borderColor: isDarkMode ? '#939394' : '#D6D9D8' }}>
          <p className="text-xs mb-2" style={{ color: '#939394' }}>
            <strong>Purpose:</strong> To identify Non-Resolution and Repeat Contact issues caused by lack of ownership or knowledge.
          </p>
        </div>
      )}
    </div>
  );
}
