'use client';

import { useState } from 'react';
import { ResponsiveContainer, Treemap, Cell } from 'recharts';
import { PillarTreemapData } from '@/lib/fci-lib/fciAdvancedData';
import { ChevronDown, ChevronUp, AlertTriangle, BookOpen } from 'lucide-react';

interface FCIPillarTreemapProps {
  data: PillarTreemapData;
  isDarkMode?: boolean;
}

function TreemapNode(props: any) {
  const { x, y, width, height, name, payload, root, isDarkMode } = props;
  if (!width || !height) return null;

  // Handle different data structures from recharts
  const nodeData = payload || root || {};
  // Allow rendering even if some properties are missing (for parent nodes)

  const getColor = (severity: string, trend: string) => {
    if (severity === 'Critical' && trend === 'Worsening') return '#B90ABD';
    if (severity === 'High' && trend === 'Worsening') return '#ef4444';
    if (severity === 'Critical' || severity === 'High') return '#5332FF';
    if (trend === 'Improving') return '#10b981';
    return '#939394';
  };

  const severity = nodeData.severity || 'Medium';
  const trend = nodeData.trend || 'Stable';
  const color = getColor(severity, trend);
  const hasAlert = nodeData.alerts && Array.isArray(nodeData.alerts) && nodeData.alerts.some((a: any) => a.detected);

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: color,
          opacity: 0.8,
          stroke: isDarkMode ? '#1a1a1a' : '#FFFFFF',
          strokeWidth: 2
        }}
      />
      {width > 60 && height > 30 && (
        <>
          <text
            x={x + 4}
            y={y + 16}
            fill="#FFFFFF"
            fontSize={11}
            fontWeight={600}
            pointerEvents="none"
          >
            {nodeData.category || name || 'Unknown'}
          </text>
          <text
            x={x + 4}
            y={y + 32}
            fill="#E2E8F0"
            fontSize={9}
            pointerEvents="none"
          >
            {nodeData.volume || nodeData.value || 0} failures
          </text>
          {hasAlert && (
            <text
              x={x + 4}
              y={y + 48}
              fill="#FFD700"
              fontSize={9}
              fontWeight={600}
              pointerEvents="none"
            >
              Alert
            </text>
          )}
        </>
      )}
    </g>
  );
}

export function FCIPillarTreemap({ data, isDarkMode = false }: FCIPillarTreemapProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);

  const treemapData = data.pillars.map(p => ({
    name: p.category,
    value: p.volume,
    ...p
  }));

  const selectedData = selectedPillar
    ? data.pillars.find(p => p.category === selectedPillar)
    : null;

  const pillarGroups = ['GET IT RIGHT', 'TAKE OWNERSHIP', 'ACT WITH EMPATHY', 'MAKE IT EASY'];

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-lg font-bold"
          style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
        >
          Component F: The FCI Pillar Performance Treemap
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded hover:bg-opacity-20"
          style={{ color: '#939394' }}
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Pillar Groups Legend */}
      <div className="mb-4 flex flex-wrap gap-2">
        {pillarGroups.map((pillar, idx) => {
          const pillarData = data.pillars.filter(p => p.pillar === pillar);
          const totalVolume = pillarData.reduce((sum, p) => sum + p.volume, 0);
          return (
            <div
              key={idx}
              className="px-3 py-1 rounded text-xs"
              style={{
                backgroundColor: isDarkMode ? '#2a2a2a' : '#F9FAFB',
                border: `1px solid ${isDarkMode ? '#939394' : '#D6D9D8'}`
              }}
            >
              <span style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                {pillar}: <strong style={{ color: '#5332FF' }}>{totalVolume}</strong>
              </span>
            </div>
          );
        })}
      </div>

      {/* Treemap Visualization */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold mb-2" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
          Visual Description: Nested rectangles filling the center
        </h4>
        <div className="h-96 border rounded-lg overflow-hidden" style={{ borderColor: isDarkMode ? '#939394' : '#D6D9D8' }}>
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={treemapData}
              dataKey="value"
              nameKey="name"
              content={(nodeProps: any) => {
                const nodeData = nodeProps.payload || nodeProps.root || {};
                return (
                  <TreemapNode
                    {...nodeProps}
                    onClick={() => setSelectedPillar(nodeData.category || null)}
                    isDarkMode={isDarkMode}
                  />
                );
              }}
            />
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: '#939394' }}>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#B90ABD' }}></div>
            <span>Red = Critical/Worsening</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#10b981' }}></div>
            <span>Green = Improving</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#5332FF' }}></div>
            <span>Blue = High/Stable</span>
          </div>
        </div>
      </div>

      {/* Selected Pillar Details */}
      {selectedData && (
        <div
          className="mb-4 p-4 rounded-lg border"
          style={{
            borderColor: selectedData.severity === 'Critical' ? '#B90ABD' : '#5332FF',
            backgroundColor: isDarkMode ? '#5332FF20' : '#5332FF10'
          }}
        >
          <h5 className="text-sm font-semibold mb-2" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
            {selectedData.pillar} - {selectedData.category}
          </h5>
          <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
            <div>
              <span style={{ color: '#939394' }}>Volume: </span>
              <strong style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>{selectedData.volume}</strong>
            </div>
            <div>
              <span style={{ color: '#939394' }}>Severity: </span>
              <strong style={{ color: '#B90ABD' }}>{selectedData.severity}</strong>
            </div>
            <div>
              <span style={{ color: '#939394' }}>Trend: </span>
              <strong style={{ color: selectedData.trend === 'Improving' ? '#10b981' : '#ef4444' }}>
                {selectedData.trend}
              </strong>
            </div>
          </div>

          {/* Alerts */}
          {selectedData.alerts.some(a => a.detected) && (
            <div className="mb-3">
              {selectedData.alerts
                .filter(a => a.detected)
                .map((alert, idx) => (
                  <div
                    key={idx}
                    className="mb-2 p-2 rounded border-l-4"
                    style={{
                      borderColor: '#B90ABD',
                      backgroundColor: isDarkMode ? '#B90ABD30' : '#B90ABD10'
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 mt-0.5" style={{ color: '#B90ABD' }} />
                      <div>
                        <p className="text-xs font-semibold" style={{ color: '#B90ABD' }}>
                          {alert.type}
                        </p>
                        <p className="text-xs" style={{ color: isDarkMode ? '#D6D9D8' : '#010101' }}>
                          {alert.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* AI Recommendation */}
          {selectedData.aiRecommendation && (
            <div
              className="mb-3 p-3 rounded-lg"
              style={{
                backgroundColor: isDarkMode ? '#5332FF40' : '#5332FF20'
              }}
            >
              <p className="text-xs font-semibold mb-1" style={{ color: '#5332FF' }}>
                AI Recommendation
              </p>
              <p className="text-xs mb-1" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                <strong>{selectedData.aiRecommendation.title}</strong>: {selectedData.aiRecommendation.description}
              </p>
              <p className="text-xs font-semibold" style={{ color: '#5332FF' }}>
                Action: {selectedData.aiRecommendation.action}
              </p>
            </div>
          )}

          {/* Training Link */}
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" style={{ color: '#5332FF' }} />
            <span className="text-xs" style={{ color: '#939394' }}>
              Training Link: <strong style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>{selectedData.trainingLink}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Expand Section */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t" style={{ borderColor: isDarkMode ? '#939394' : '#D6D9D8' }}>
          <p className="text-xs mb-2" style={{ color: '#939394' }}>
            <strong>Grouping Logic (Mapped to PDF):</strong>
          </p>
          <ul className="text-xs space-y-1" style={{ color: '#939394' }}>
            <li>• GET IT RIGHT: Incorrect Information, Non-resolution, Repeat Contact</li>
            <li>• MAKE IT EASY: Turn Around Time (TAT), SLA</li>
            <li>• TAKE OWNERSHIP: Escalation</li>
            <li>• ACT WITH EMPATHY: Failed from Customer</li>
          </ul>
        </div>
      )}
    </div>
  );
}

