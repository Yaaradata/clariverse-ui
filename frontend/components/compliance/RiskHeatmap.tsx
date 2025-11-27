'use client';

import { useState } from 'react';
import { riskHeatmapData } from '@/lib/compliance/riskHeatmapData';

interface RiskHeatmapProps {
  isDarkMode: boolean;
  riskTypes?: string[];
  channels?: string[];
  riskScores?: { [key: string]: number[] };
}

export default function RiskHeatmap({ isDarkMode, riskTypes, channels, riskScores }: RiskHeatmapProps) {
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null);

  const defaultRiskTypes = riskTypes || riskHeatmapData.riskTypes;
  const defaultChannels = channels || riskHeatmapData.channels;
  const defaultRiskScores = riskScores || riskHeatmapData.riskScores;

  const getRiskColor = (score: number) => {
    if (score >= 80) return '#B90ABD'; // Critical - Magenta
    if (score >= 60) return '#5332FF'; // High - Blue
    if (score >= 40) return '#939394'; // Medium - Gray
    return '#D6D9D8'; // Low - Light Gray
  };

  return (
      <div className="border rounded-lg p-4 shadow-sm" style={{ 
        borderColor: isDarkMode ? '#939394' : '#D6D9D8',
        backgroundColor: isDarkMode ? '#1a1a1a' : '#FAFAFA'
      }}>
      <h3 className="text-lg font-bold mb-4" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
        🛰️ Risk Heatmap
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left p-2 font-semibold" style={{ color: '#939394' }}>Risk Type</th>
              {defaultChannels.map((ch, i) => (
                <th key={i} className="p-2 font-semibold text-center" style={{ color: '#939394' }}>{ch}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {defaultRiskTypes.map((risk, i) => (
              <tr key={i} className="border-t" style={{ borderColor: isDarkMode ? '#939394' : '#D6D9D8' }}>
                <td className="p-2 text-xs font-medium" style={{ color: isDarkMode ? '#D6D9D8' : '#010101' }}>{risk}</td>
                {defaultRiskScores[risk].map((score, j) => (
                  <td key={j} className="p-2">
                    <div 
                      className="w-full h-8 rounded flex items-center justify-center text-white font-bold text-xs cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: getRiskColor(score) }}
                      onClick={() => setSelectedRisk(`${risk} - ${defaultChannels[j]}: ${score}`)}
                    >
                      {score}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3 flex items-center gap-4 text-xs">
          <span style={{ color: '#939394' }}>Risk Score:</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#D6D9D8' }}></div>
            <span style={{ color: '#939394' }}>Low (0-40)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#939394' }}></div>
            <span style={{ color: '#939394' }}>Medium (40-60)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#5332FF' }}></div>
            <span style={{ color: '#939394' }}>High (60-80)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#B90ABD' }}></div>
            <span style={{ color: '#939394' }}>Critical (80-100)</span>
          </div>
        </div>
        {selectedRisk && (
          <div className="mt-3 p-2 rounded" style={{ backgroundColor: isDarkMode ? '#5332FF40' : '#5332FF20' }}>
            <p className="text-xs font-semibold" style={{ color: '#5332FF' }}>Selected: {selectedRisk}</p>
          </div>
        )}
      </div>
    </div>
  );
}

