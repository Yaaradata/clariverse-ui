'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FCICluster } from '@/lib/fci-lib/fciData';
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp } from 'lucide-react';

interface FailureClustersProps {
  clusters: FCICluster[];
  isDarkMode?: boolean;
}

export function FailureClusters({ clusters, isDarkMode = false }: FailureClustersProps) {
  const [expandedCluster, setExpandedCluster] = useState<string | null>(null);

  const top5Clusters = clusters.slice(0, 5);
  
  const chartData = top5Clusters.map(cluster => ({
    name: cluster.category.length > 20 ? cluster.category.substring(0, 20) + '...' : cluster.category,
    fullName: cluster.category,
    count: cluster.count,
    trend: cluster.trend,
    severity: cluster.severity
  }));

  const getSeverityColor = (severity: string) => {
    if (severity === 'High Impact') return '#B90ABD';
    if (severity === 'Medium') return '#5332FF';
    return '#939394';
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="w-3 h-3 text-red-500" />;
    return <TrendingDown className="w-3 h-3 text-green-500" />;
  };

  return (
    <div
      className="border rounded-lg p-4 shadow-sm"
      style={{
        borderColor: isDarkMode ? '#939394' : '#D6D9D8',
        backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF'
      }}
    >
      <h3
        className="text-lg font-bold mb-4"
        style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
      >
        🟩 What's Failing? (FCI Clusters / Reasons)
      </h3>

      {/* Chart Visualization */}
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#939394' : '#D6D9D8'} />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fill: isDarkMode ? '#D6D9D8' : '#010101', fontSize: 12 }}
            />
            <YAxis tick={{ fill: isDarkMode ? '#D6D9D8' : '#010101', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF',
                border: `1px solid ${isDarkMode ? '#939394' : '#D6D9D8'}`,
                borderRadius: '8px',
                color: isDarkMode ? '#FFFFFF' : '#010101'
              }}
              formatter={(value: number, name: string, props: any) => [
                `${value} cases`,
                props.payload.fullName
              ]}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getSeverityColor(entry.severity)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Cluster List */}
      <div className="space-y-3">
        {top5Clusters.map((cluster) => (
          <div
            key={cluster.id}
            className="border rounded-lg p-3 cursor-pointer hover:shadow-md transition-all"
            style={{
              borderColor: isDarkMode ? '#939394' : '#D6D9D8',
              backgroundColor: isDarkMode ? '#2a2a2a' : '#FFFFFF'
            }}
            onClick={() => setExpandedCluster(expandedCluster === cluster.id ? null : cluster.id)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4
                    className="font-bold text-sm"
                    style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                  >
                    {cluster.category}
                  </h4>
                  <span
                    className="px-2 py-1 rounded text-xs font-bold text-white"
                    style={{ backgroundColor: getSeverityColor(cluster.severity) }}
                  >
                    {cluster.severity}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: '#939394' }}>
                  <span>{cluster.count} cases</span>
                  <span>•</span>
                  <span>{cluster.affectedCustomers} customers affected</span>
                  <span className="flex items-center gap-1">
                    {getTrendIcon(cluster.trend)}
                    {Math.abs(cluster.trend)}%
                  </span>
                </div>
              </div>
              {expandedCluster === cluster.id ? (
                <ChevronUp className="w-4 h-4" style={{ color: '#939394' }} />
              ) : (
                <ChevronDown className="w-4 h-4" style={{ color: '#939394' }} />
              )}
            </div>

            {expandedCluster === cluster.id && (
              <div className="mt-3 pt-3 border-t" style={{ borderColor: isDarkMode ? '#939394' : '#D6D9D8' }}>
                <p className="text-xs mb-2" style={{ color: '#939394' }}>
                  <strong>Business Impact:</strong> {cluster.businessImpact}
                </p>
                <div>
                  <p className="text-xs font-semibold mb-1" style={{ color: isDarkMode ? '#D6D9D8' : '#010101' }}>
                    Examples:
                  </p>
                  <ul className="text-xs space-y-1">
                    {cluster.examples.map((example, idx) => (
                      <li key={idx} style={{ color: '#939394' }}>
                        • {example}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  className="mt-3 w-full py-2 rounded text-xs font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#5332FF' }}
                >
                  View Detailed Analysis
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs mt-4 italic" style={{ color: '#939394' }}>
        👉 Immediate view: Which types of failures are hurting customers most?
      </p>
    </div>
  );
}

