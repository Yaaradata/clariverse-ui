'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Package, Truck, MapPin, RotateCcw } from 'lucide-react';

const breachData = [
  { time: '00:00', inbound: 12, transit: 18, lastMile: 25, reverse: 8 },
  { time: '02:00', inbound: 8, transit: 22, lastMile: 30, reverse: 5 },
  { time: '04:00', inbound: 5, transit: 15, lastMile: 18, reverse: 3 },
  { time: '06:00', inbound: 10, transit: 28, lastMile: 35, reverse: 12 },
  { time: '08:00', inbound: 18, transit: 42, lastMile: 55, reverse: 15 },
  { time: '10:00', inbound: 25, transit: 38, lastMile: 68, reverse: 20 },
  { time: '12:00', inbound: 22, transit: 45, lastMile: 72, reverse: 18 },
  { time: '14:00', inbound: 30, transit: 52, lastMile: 85, reverse: 22 },
  { time: '16:00', inbound: 28, transit: 48, lastMile: 78, reverse: 25 },
  { time: '18:00', inbound: 20, transit: 35, lastMile: 60, reverse: 18 },
  { time: '20:00', inbound: 15, transit: 28, lastMile: 45, reverse: 12 },
  { time: '22:00', inbound: 10, transit: 20, lastMile: 32, reverse: 8 },
];

const maxTotal = Math.max(...breachData.map(d => d.inbound + d.transit + d.lastMile + d.reverse));

export default function LogisticsBreachPlot() {
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
  const labelColor = isDarkMode ? 'rgb(82, 82, 91)' : 'rgb(161, 161, 170)';

  return (
    <div 
      className="rounded-2xl p-5 flex flex-col h-full"
      style={{ backgroundColor: containerBg, border: `1px solid ${containerBorder}` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: textColor }}>
            <Package className="w-4 h-4" style={{ color: 'rgb(244, 63, 94)' }} />
            Logistics Custody Chain Breaches
          </h3>
          <p className="text-[10px] mt-1" style={{ color: subtextColor }}>Communication-derived delivery failure signals</p>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold" style={{ color: 'rgb(244, 63, 94)' }}>1,240</span>
          <p className="text-[9px] uppercase tracking-wider" style={{ color: subtextColor }}>Total Signals</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-3 mb-3 flex-wrap">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: 'rgb(244, 63, 94)' }}></div>
          <span className="text-[9px]" style={{ color: subtextColor }}>Inbound/Pkg</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: 'rgb(245, 158, 11)' }}></div>
          <span className="text-[9px]" style={{ color: subtextColor }}>Transit</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: 'rgb(249, 115, 22)' }}></div>
          <span className="text-[9px]" style={{ color: subtextColor }}>Last Mile</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: 'rgb(129, 140, 248)' }}></div>
          <span className="text-[9px]" style={{ color: subtextColor }}>Reverse</span>
        </div>
      </div>

      {/* Stacked Bar Chart */}
      <div className="flex-1 flex items-end gap-1 min-h-[120px]">
        {breachData.map((d, i) => {
          const total = d.inbound + d.transit + d.lastMile + d.reverse;
          const heightPercent = (total / maxTotal) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full rounded-t-sm flex flex-col-reverse overflow-hidden"
                style={{ height: `${heightPercent}%`, minHeight: '4px' }}
              >
                <div style={{ height: `${(d.inbound / total) * 100}%`, backgroundColor: 'rgb(244, 63, 94)' }}></div>
                <div style={{ height: `${(d.transit / total) * 100}%`, backgroundColor: 'rgb(245, 158, 11)' }}></div>
                <div style={{ height: `${(d.lastMile / total) * 100}%`, backgroundColor: 'rgb(249, 115, 22)' }}></div>
                <div style={{ height: `${(d.reverse / total) * 100}%`, backgroundColor: 'rgb(129, 140, 248)' }}></div>
              </div>
              <span className="text-[8px] mt-1" style={{ color: labelColor }}>{d.time.split(':')[0]}</span>
            </div>
          );
        })}
      </div>

      {/* Micro Info */}
      <div className="flex gap-4 mt-4 pt-3" style={{ borderTop: `1px solid ${containerBorder}` }}>
        <div>
          <span className="text-[9px] uppercase tracking-wider" style={{ color: subtextColor }}>Peak Stage</span>
          <p className="text-xs font-medium" style={{ color: 'rgb(249, 115, 22)' }}>Last Mile (45%)</p>
        </div>
        <div>
          <span className="text-[9px] uppercase tracking-wider" style={{ color: subtextColor }}>Top Keyword</span>
          <p className="text-xs font-medium" style={{ color: textColor }}>Open Box Denied</p>
        </div>
      </div>

      {/* AI Insight */}
      <div 
        className="mt-3 rounded-lg p-2.5"
        style={{ backgroundColor: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)' }}
      >
        <div className="flex items-center gap-1.5 mb-1">
          <TrendingUp className="w-3 h-3" style={{ color: 'rgb(244, 63, 94)' }} />
          <span className="text-[9px] uppercase tracking-wider font-medium" style={{ color: 'rgb(244, 63, 94)' }}>
            AI Insight
          </span>
        </div>
        <p className="text-[10px] leading-relaxed" style={{ color: isDarkMode ? 'rgb(254, 202, 202)' : 'rgb(153, 27, 27)' }}>
          <strong>Custody Spike:</strong> 40% surge in 'Open Box Delivery' refusals in North Zone (Last Mile) between 14:00-16:00, correlated with new courier onboarding.
        </p>
      </div>
    </div>
  );
}

