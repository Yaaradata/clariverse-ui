'use client';

import { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

const radarData = [
  { category: 'Counterfeit/IP', value: 85, label: 'Fake, Copy' },
  { category: 'MRP/Price', value: 62, label: 'Higher price' },
  { category: 'Expiry/Quality', value: 45, label: 'Expired stock' },
  { category: 'Misleading Specs', value: 78, label: 'Wrong features' },
  { category: 'Seller Conduct', value: 55, label: 'Rude seller' },
];

export default function MarketplaceRadar() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const checkTheme = () => {
      const theme = localStorage.getItem('theme');
      setIsDarkMode(theme === 'dark');
    };
    checkTheme();
    window.addEventListener('storage', checkTheme);
    return () => window.removeEventListener('storage', checkTheme);
  }, []);

  const containerBg = isDarkMode ? 'rgb(13, 13, 13)' : 'rgb(255, 255, 255)';
  const containerBorder = isDarkMode ? 'rgb(31, 31, 31)' : 'rgb(229, 231, 235)';
  const textColor = isDarkMode ? 'rgb(255, 255, 255)' : 'rgb(31, 41, 55)';
  const subtextColor = isDarkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)';
  const gridColor = isDarkMode ? 'rgb(63, 63, 70)' : 'rgb(212, 212, 216)';

  // Calculate radar polygon points
  const centerX = 100;
  const centerY = 100;
  const maxRadius = 70;
  const angleStep = (2 * Math.PI) / radarData.length;
  
  const getPoint = (value: number, index: number) => {
    const angle = angleStep * index - Math.PI / 2;
    const radius = (value / 100) * maxRadius;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };

  const polygonPoints = radarData.map((d, i) => getPoint(d.value, i)).map(p => `${p.x},${p.y}`).join(' ');
  const safeZonePoints = radarData.map((_, i) => getPoint(50, i)).map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div 
      className="rounded-2xl p-5 flex flex-col h-full"
      style={{ backgroundColor: containerBg, border: `1px solid ${containerBorder}` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: textColor }}>
            <ShieldAlert className="w-4 h-4" style={{ color: 'rgb(239, 68, 68)' }} />
            Marketplace Integrity Radar
          </h3>
          <p className="text-[10px] mt-1" style={{ color: subtextColor }}>Vendor health based on complaint categories</p>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold" style={{ color: 'rgb(239, 68, 68)' }}>72</span>
          <span className="text-xs" style={{ color: subtextColor }}>/100</span>
          <p className="text-[9px] uppercase tracking-wider" style={{ color: 'rgb(239, 68, 68)' }}>High Risk</p>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="flex-1 flex items-center justify-center min-h-[160px]">
        <svg viewBox="0 0 200 200" className="w-full h-full max-w-[200px]">
          {/* Grid circles */}
          {[25, 50, 75, 100].map((r, i) => (
            <circle
              key={i}
              cx={centerX}
              cy={centerY}
              r={(r / 100) * maxRadius}
              fill="none"
              stroke={gridColor}
              strokeWidth="0.5"
              strokeDasharray={i === 1 ? "4,4" : "0"}
            />
          ))}
          
          {/* Axis lines */}
          {radarData.map((_, i) => {
            const point = getPoint(100, i);
            return (
              <line
                key={i}
                x1={centerX}
                y1={centerY}
                x2={point.x}
                y2={point.y}
                stroke={gridColor}
                strokeWidth="0.5"
              />
            );
          })}

          {/* Safe zone (green dashed) */}
          <polygon
            points={safeZonePoints}
            fill="none"
            stroke="rgb(16, 185, 129)"
            strokeWidth="1"
            strokeDasharray="4,4"
            opacity="0.4"
          />

          {/* Risk polygon */}
          <polygon
            points={polygonPoints}
            fill="rgba(239, 68, 68, 0.2)"
            stroke="rgb(239, 68, 68)"
            strokeWidth="2"
          />

          {/* Data points */}
          {radarData.map((d, i) => {
            const point = getPoint(d.value, i);
            return (
              <circle
                key={i}
                cx={point.x}
                cy={point.y}
                r="3"
                fill="rgb(239, 68, 68)"
              />
            );
          })}

          {/* Labels */}
          {radarData.map((d, i) => {
            const labelPoint = getPoint(115, i);
            return (
              <text
                key={i}
                x={labelPoint.x}
                y={labelPoint.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="8"
                fill={subtextColor}
              >
                {d.category.split('/')[0]}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Micro Info */}
      <div className="flex gap-4 mt-2 pt-3" style={{ borderTop: `1px solid ${containerBorder}` }}>
        <div>
          <span className="text-[9px] uppercase tracking-wider" style={{ color: subtextColor }}>Top Offender</span>
          <p className="text-xs font-medium" style={{ color: 'rgb(239, 68, 68)' }}>Electronics Category</p>
        </div>
        <div>
          <span className="text-[9px] uppercase tracking-wider" style={{ color: subtextColor }}>Active Vectors</span>
          <p className="text-xs font-medium" style={{ color: textColor }}>5 Risk Areas</p>
        </div>
      </div>

      {/* AI Insight */}
      <div 
        className="mt-3 rounded-lg p-2.5"
        style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
      >
        <div className="flex items-center gap-1.5 mb-1">
          <AlertTriangle className="w-3 h-3" style={{ color: 'rgb(239, 68, 68)' }} />
          <span className="text-[9px] uppercase tracking-wider font-medium" style={{ color: 'rgb(239, 68, 68)' }}>
            AI Insight
          </span>
        </div>
        <p className="text-[10px] leading-relaxed" style={{ color: isDarkMode ? 'rgb(254, 202, 202)' : 'rgb(153, 27, 27)' }}>
          <strong>Catalog Integrity:</strong> 'Counterfeit' axis is elevated (85/100) due to a cluster of complaints targeting 3 specific headphone SKUs. Immediate listing suppression recommended.
        </p>
      </div>
    </div>
  );
}

