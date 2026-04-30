'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { KnowledgeAccuracyData } from '@/lib/fci-lib/fciAdvancedData';
import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

interface KnowledgeAccuracyLogProps {
  data: KnowledgeAccuracyData;
  isDarkMode?: boolean;
}

export function KnowledgeAccuracyLog({ data, isDarkMode = false }: KnowledgeAccuracyLogProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const top5Topics = data.topics.slice(0, 5);
  const activeAlert = data.alerts.find(a => a.detected);

  const chartData = top5Topics.map(topic => ({
    topic: topic.topic.length > 15 ? topic.topic.substring(0, 15) + '...' : topic.topic,
    fullTopic: topic.topic,
    'Process Error': topic.processErrors,
    'Product Knowledge Gap': topic.knowledgeGaps,
    errorRate: topic.errorRate
  }));

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
          Component B: The "Knowledge & Accuracy" Log
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded hover:bg-opacity-20"
          style={{ color: '#939394' }}
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Alert */}
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
              High Error Rate Detected
            </p>
            <p className="text-xs" style={{ color: isDarkMode ? '#D6D9D8' : '#010101' }}>
              {activeAlert.topic}: {activeAlert.errorRate}% error rate (threshold: {activeAlert.threshold}%)
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

      {/* Grouped Horizontal Bar Chart */}
      <div className="flex-1 flex flex-col">
        <h4 className="text-sm font-semibold mb-2" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
          Visual Representation: Grouped Horizontal Bar Chart
        </h4>
        
        {/* Legend above graph */}
        <div className="flex items-center justify-center gap-6 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 rounded" style={{ backgroundColor: '#B90ABD' }}></div>
            <span className="text-xs" style={{ color: isDarkMode ? '#D6D9D8' : '#010101' }}>Process Error</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 rounded" style={{ backgroundColor: '#5332FF' }}></div>
            <span className="text-xs" style={{ color: isDarkMode ? '#D6D9D8' : '#010101' }}>Product Knowledge Gap</span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#444' : '#e0e0e0'} />
              <XAxis 
                type="number" 
                tick={{ fill: isDarkMode ? '#D6D9D8' : '#010101', fontSize: 11 }}
                domain={[0, 100]}
              />
              <YAxis
                dataKey="topic"
                type="category"
                tick={{ fill: isDarkMode ? '#D6D9D8' : '#010101', fontSize: 11 }}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF',
                  border: `1px solid ${isDarkMode ? '#939394' : '#D6D9D8'}`,
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value, name) => [
                  `${Number(value ?? 0)} errors`,
                  String(name)
                ]}
              />
              <Bar dataKey="Process Error" fill="#B90ABD" radius={[0, 4, 4, 0]} barSize={16} />
              <Bar dataKey="Product Knowledge Gap" fill="#5332FF" radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expand Section */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t" style={{ borderColor: isDarkMode ? '#939394' : '#D6D9D8' }}>
          <p className="text-xs mb-2" style={{ color: '#939394' }}>
            <strong>Purpose:</strong> To address Incorrect Information by pinpointing the specific topics where agents are failing.
          </p>
          <p className="text-xs" style={{ color: '#939394' }}>
            <strong>Data Source:</strong> Integration with QA/Audit software tags or AI-transcript scanning for phrases like "Correction," "Sorry, I was wrong," or "Actually."
          </p>
        </div>
      )}
    </div>
  );
}

